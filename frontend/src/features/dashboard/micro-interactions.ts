/* Micro-interaction Logic - Modal toggles, lens drag-and-drop feedback */
(() => {
  // Modal toggle handling
  const modal = document.getElementById('calibration-modal');
  const openBtn = document.getElementById('open-calibration-modal');
  const closeBtn = document.getElementById('close-calibration-modal');
  const startBtn = document.getElementById('modal-start-btn');
  const resumeHeroBtn = document.getElementById('resume-drill-btn');

  if (openBtn && modal && closeBtn) {
    openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  }

  if (startBtn && modal) {
    startBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      alert('Initiating calibrated Multivariable Chain Rule drill sequence...');
    });
  }

  if (resumeHeroBtn) {
    resumeHeroBtn.addEventListener('click', () => {
      alert('Launching 15-minute adaptive drill workspace...');
    });
  }

  // Lens Drag-and-drop feedback
  const dropzone = document.getElementById('lens-dropzone');
  if (dropzone) {
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('bg-surface-container-highest');
    });
    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('bg-surface-container-highest');
    });
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('bg-surface-container-highest');
      alert('File received! Parsing mathematical symbols and cross-referencing MATH 201 syllabus...');
    });
    dropzone.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*,.pdf,.tex';
      input.onchange = () => {
        alert('File uploaded to Live Study Lens. Analyzing with AI Tutor...');
      };
      input.click();
    });
  }
})();