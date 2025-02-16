import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import Selection from "./pages/Selection";
import { Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import context from "./context/createContext";
import StudentHomePage from "./pages/studentPages/StudentHomePage";
import TeacherHomePage from "./pages/teacherPages/TeacherHomePage";
import ProtectedRoute from "./component/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Notfound from "./pages/Notfound";



const App = () => {
  const navigate = useNavigate();
  const { isLogin } = useContext(context);
  const [hasNavigated, setHasNavigated] = useState(false);


  useEffect(() => {
    if (isLogin && !hasNavigated) {
      setHasNavigated(true);
      if (isLogin.userType == "student") {
        navigate("/student/home",{ replace: true });
      } else if (isLogin.userType == "teacher") {
        navigate("/teacher/home",{ replace: true });
      }
    }
  }, [isLogin, hasNavigated, navigate]);

  return (
    <div className="app ">
      <div className="row m-0 ">
        <div className=" main-col col-md-6 col-lg-4 mx-auto vh-100   p-0 ">
          <Routes>
          <Route path="/" element={<Selection />} />
            <Route path="/login/:name" element={<LoginPage />} />
            <Route path="/register/:name" element={<RegisterPage />} />
            <Route
              path="/student/home/*"
              element={ 
                <ProtectedRoute isLogin={isLogin}>
                  <StudentHomePage setHasNavigated={setHasNavigated} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/home/*"
              element={
                <ProtectedRoute isLogin={isLogin}>
                  <TeacherHomePage setHasNavigated={setHasNavigated} />
                </ProtectedRoute>
              }
            />
            <Route
              path="*"
              element={
                
                  <Notfound/>
              }
            />
            
          </Routes>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default App;
