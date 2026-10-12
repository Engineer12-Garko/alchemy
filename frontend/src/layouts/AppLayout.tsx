import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState, type FormEvent } from 'react';
import './AppLayout.css';
import { apiRequest, ApiError, clearAccessToken } from '../services/api_client';

interface Account { display_name: string; email: string }
interface Course { id: number; code: string; name: string; subject: string }
interface ProgressSummary { attempts: number; reviews_due: number }

const navigation = [
  { path: '/', icon: 'space_dashboard', label: 'Overview' },
  { path: '/ai-tutor', icon: 'neurology', label: 'AI Tutor Workspace' },
  { path: '/diagnosis', icon: 'troubleshoot', label: 'Diagnosis & Gaps' },
  { path: '/quiz', icon: 'quiz', label: 'Practice & Quizzes' },
  { path: '/study-planner', icon: 'calendar_month', label: 'Study Planner' },
  { path: '/resources', icon: 'folder_copy', label: 'Learning Resources' },
  { path: '/progress', icon: 'insights', label: 'Progress & Insights' },
  { path: '/settings', icon: 'settings', label: 'Settings' },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const [account, setAccount] = useState<Account | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [progressSummary, setProgressSummary] = useState<ProgressSummary | null>(null);
  const [courseFormOpen, setCourseFormOpen] = useState(false);
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseError, setCourseError] = useState('');
  const selectedCourse = courses.find((course) => String(course.id) === selectedCourseId) ?? courses[0];

  useEffect(() => {
    let active = true;
    Promise.all([
      apiRequest<Account>('/auth/me'),
      apiRequest<Course[]>('/courses'),
      apiRequest<ProgressSummary>('/progress'),
    ]).then(([user, courseList, summary]) => {
      if (!active) return;
      setAccount(user);
      setCourses(courseList);
      setSelectedCourseId((current) => current || String(courseList[0]?.id ?? ''));
      setProgressSummary(summary);
    }).catch((reason: unknown) => {
      // 401s are already handled globally in apiRequest (token cleared + redirect).
      if (active && !(reason instanceof ApiError && reason.status === 401)) {
        setCourseError(reason instanceof Error ? reason.message : 'Unable to load account workspace data');
      }
    });
    return () => { active = false; };
  }, []);

  const createCourse = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCourseError('');
    try {
      const course = await apiRequest<Course>('/courses', {
        method: 'POST',
        body: JSON.stringify({ code: courseCode.trim(), name: courseName.trim(), subject: '' }),
      });
      setCourses((current) => [...current, course]);
      setSelectedCourseId(String(course.id));
      setCourseCode('');
      setCourseName('');
      setCourseFormOpen(false);
    } catch (reason) {
      setCourseError(reason instanceof Error ? reason.message : 'Unable to create course');
    }
  };

  const signOut = async () => {
    clearAccessToken();
    navigate('/auth', { replace: true });
  };

  return (
    <div className="studio-shell">
      <aside className="sidebar">
        <div className="sidebar__main">
          <NavLink className="brand" to="/">
            <div className="brand__mark">A</div>
            <div className="brand__name">
              <strong>Alchemy</strong>
              <small>Academic Studio</small>
            </div>
            <span className="brand__version">AI 2.5</span>
          </NavLink>

          <div className="course-select">
            <span className="material-symbols-outlined">menu_book</span>
            <label className="course-select__text"><small>Enrolled Course</small>
              <select aria-label="Select course" onChange={(event) => setSelectedCourseId(event.target.value)} value={selectedCourse ? String(selectedCourse.id) : ''}>
                {courses.length === 0 && <option value="">No course yet</option>}
                {courses.map((course) => <option key={course.id} value={course.id}>{course.code}: {course.name}</option>)}
              </select>
            </label>
            <button aria-label={courseFormOpen ? 'Cancel adding course' : 'Add course'} className="course-select__arrow" onClick={() => setCourseFormOpen((open) => !open)} type="button"><span className="material-symbols-outlined">{courseFormOpen ? 'close' : 'add'}</span></button>
          </div>
          {courseFormOpen && <form className="sidebar-course-form" onSubmit={(event) => void createCourse(event)}><input aria-label="Course code" onChange={(event) => setCourseCode(event.target.value)} placeholder="Course code" required value={courseCode} /><input aria-label="Course name" onChange={(event) => setCourseName(event.target.value)} placeholder="Course name" required value={courseName} /><button type="submit">Save course</button></form>}
          {courseError && <p className="sidebar-course-error" role="alert">{courseError}</p>}

          <nav aria-label="Main navigation" className="side-nav">
            {navigation.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `side-nav__item${isActive ? ' is-active' : ''}`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar__footer">
          <div className="sync-card">
            <div className="sync-card__label"><span className="material-symbols-outlined">cloud_done</span>Learning activity</div>
            <div className="sync-card__cache">Recorded attempts <span>{progressSummary?.attempts ?? '—'}</span></div>
            <div className="sync-card__cache">Reviews due <span>{progressSummary?.reviews_due ?? '—'}</span></div>
          </div>
          <button className="profile-card" type="button" onClick={() => navigate('/settings')}>
            <span className="profile-card__avatar"><span className="material-symbols-outlined">person</span></span>
            <span className="profile-card__copy"><strong>{account?.display_name ?? 'Account'}</strong><small>{account?.email ?? ''}</small></span>
            <span className="material-symbols-outlined">more_vert</span>
          </button>
          <button className="layout-signout" onClick={() => void signOut()} type="button">Sign out</button>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          {selectedCourse && <span className="topbar__course"><span className="topbar__course-dot" /> {selectedCourse.code} · {selectedCourse.name}</span>}
          <div className="topbar__actions">
            <button aria-label="Study planner and due tasks" className="icon-button notification-button" onClick={() => navigate('/study-planner')} type="button">
              <span className="material-symbols-outlined">notifications</span><i />
            </button>
            <button aria-label="User profile" className="topbar__avatar" onClick={() => navigate('/settings')} type="button">
              <span className="material-symbols-outlined">person</span>
            </button>
          </div>
        </header>

        <main className="main-content">
          <Outlet />
        </main>
      </div>

    </div>
  );
}