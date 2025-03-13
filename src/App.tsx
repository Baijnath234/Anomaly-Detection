import React from 'react';
import { Route, Routes } from 'react-router-dom';
// import { getRoutes } from './app/RouterConfig';
// import { RouteWithSubRoutes } from './app/RouteWithSubRoutes';
import MainScreen from './pages/MianScreen'
import { SignInPage } from './pages';
import Dashboard from './pages/common/Dashboard';
import Register from './pages/Register'
import ForgotPassword from './pages/forgotPassword'
import Verification from './pages/Verification'
import ResetPassword from './pages/ResetPasswordPage'
import User from './pages/User/UserTable'
import ViewPage from './pages/ModelList/viewPage'
import ModelList from './pages/ModelList/ModelList';

const App: React.FC = () => {
  return (
    <Routes>
     <Route path='/' element={<MainScreen/>} />
     <Route path='/singup' element={<SignInPage/>} />
     <Route path="/dashboard/*" element={<Dashboard />} />
     <Route path='/register' element={<Register/>}/> 
     <Route path='/forgot-password' element={<ForgotPassword/>}/> 
     <Route path='/otp-verification' element={<Verification/>}/>
     <Route path='/reset-password' element={<ResetPassword/>}/>
     <Route path='/users' element={<User/>}/>
     <Route path="/view-page" element={<ViewPage />} />
     <Route path="/modelList" element={<ModelList />} />
    </Routes>
  );
};

export default App;

// {getRoutes().map((route, index) => (
//   <RouteWithSubRoutes key={index} {...route} />
// ))}