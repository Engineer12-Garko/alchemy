/* Dashboard Page - Main container for the academic dashboard layout */
import React from "react";
import { DashboardCanvas } from "./DashboardCanvas";
import { CalibrationModal } from "./CalibrationModal";

export const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <DashboardCanvas />
      <CalibrationModal isOpen={false} onClose={() => {}} />
    </div>
  );
};