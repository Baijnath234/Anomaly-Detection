import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import {
  DashboardPage,
  UploadPage,
  AnalysisPage,
  ProblemsPage,
  ExpiryPage,
  LiveMonitorPage,
  ReportsPage,
  SignInPage,
  ElectricalDashboardPage,
  SmartAutomationPage,
  ConfiguratorPage,
} from './pages';
import Register from './pages/Register';
import ForgotPassword from './pages/forgotPassword';
import Verification from './pages/Verification';
import ResetPassword from './pages/ResetPasswordPage';
import User from './pages/User/UserTable';
import ViewPage from './pages/ModelList/viewPage';
import ModelList from './pages/ModelList/ModelList';

const App: React.FC = () => {
  return (
    <Routes>
      {/* 7 Anomaly Detection & Repair Assistant Pages inside AppLayout */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/electrical" replace />} />
        <Route path="/electrical" element={<ElectricalDashboardPage />} />
        <Route path="/automation" element={<SmartAutomationPage />} />
        <Route path="/configurator" element={<ConfiguratorPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/expiry" element={<ExpiryPage />} />
        <Route path="/live" element={<LiveMonitorPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/view-page" element={<ViewPage />} />
        <Route path="/modelList" element={<ModelList />} />
      </Route>

      {/* Auth & Legacy Management Routes */}
      <Route path="/singup" element={<SignInPage />} />
      <Route path="/signup" element={<SignInPage />} />
      <Route path="/login" element={<SignInPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/forget-password" element={<ForgotPassword />} />
      <Route path="/otp-verification" element={<Verification />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/users" element={<User />} />
    </Routes>
  );
};

export default App;
