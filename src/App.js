import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './Pages/Home';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Gallery from './Pages/Gallery';
import Login from './Pages/Login';
import UploadGallery from './AdminPages/UploadGallery';
import DisplayContact from './AdminPages/DisplayContact';
import UploadNews from './AdminPages/UploadNews';
import Employee from './AdminPages/Employe';
import AdminLogin from './Pages/AdminLogin';
import UserLogin from './Pages/UserLogin';
import UserHeader from './Users/UserHeader';
import SendNews from './Users/userspages/sendNews';
import UserProfile from './Users/userspages/userProfile';
import ForgotPassword from './Pages/ForgotPassword'; // Import the ForgotPassword component
import './Component/Style.css'; // Importing Style.css here
import UploadVideos from './AdminPages/UploadVideos';
import Video from './Pages/Video';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/about' element={<About/>}></Route>
          <Route path='/contact' element={<Contact/>}></Route>
          <Route path='/gallery' element={<Gallery/>}></Route>
          <Route path='/Video' element={<Video/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/upload-gallery' element={<UploadGallery/>}></Route>
          <Route path='/display-contact' element={<DisplayContact/>}></Route>
          <Route path='/upload-news' element={<UploadNews/>}></Route>
          <Route path='/employee-news' element={<Employee/>}></Route>
          <Route path='/admin-login' element={<AdminLogin/>}></Route>
          <Route path='/user-login' element={<UserLogin/>}></Route>
          <Route path='/forgot-password' element={<ForgotPassword/>}></Route> {/* Add route for Forgot Password */}
          <Route path='/user2-profile' element={<UserHeader/>}></Route>
          <Route path='/sendNews/:key' element={<SendNews/>}></Route>
          <Route path='/userProfile/:key' element={<UserProfile/>}></Route>
          <Route path='/uploadvideo' element={<UploadVideos/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
