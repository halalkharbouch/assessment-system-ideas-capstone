import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Overview from '../components/Overview';
import StudentPerformance from '../components/StudentPerformance';
import AssessmentInsights from '../components/AssessmentInsights';
import CourseAnalysis from '../components/CourseAnalysis';
import InstructorMetrics from '../components/InstructorMetrics';
import Settings from '../components/Settings';

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-grow p-6 bg-gray-100">
        <Routes>
          <Route path="overview" element={<Overview />} />
          <Route path="student-performance" element={<StudentPerformance />} />
          <Route path="assessment-insights" element={<AssessmentInsights />} />
          <Route path="course-analysis" element={<CourseAnalysis />} />
          <Route path="instructor-metrics" element={<InstructorMetrics />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
