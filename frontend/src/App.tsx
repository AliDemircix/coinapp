import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Navigate,  Outlet,  Route, Routes, } from 'react-router-dom';
import * as Paths from './Paths';
import Cookies from "js-cookie";

import AlertPopup from './components/AlertPopup';
import Login from './pages/Login';
import { AlertProvider } from './context/AlertContext';
import Coins from './pages/Coins';
import AdminPage from './pages/Admin';
import { AddCoin } from './pages/AddCoin';

export const LoginContext = createContext<any>({
  setIsAuthenticated(){},
});
interface CheckAuthProps {
  children: React.ReactNode;
}
export const CheckAuth:React.FC<CheckAuthProps>=({children})=>{
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    useEffect(() => {
        // const token = sessionStorage.getItem('token');
       const token = Cookies.get('token')
        if (token) {
          setIsAuthenticated(true);
          console.log("fdfs")
        }
        else {
          window.location.href = "/login";
        }
      }, []);
      if (isAuthenticated) {
        return (
          <LoginContext.Provider value={setIsAuthenticated}>
            {children}
          </LoginContext.Provider>
        );
      } else {
        // You might want to show a loading spinner or a message here while checking authentication
        return null;
      }
  }

function App() {

  return (
    <AlertProvider>
      <AlertPopup />
      <BrowserRouter>
        <Routes >
          <Route
            path={Paths.login.path}
            element={<Login />}
          />
          <Route
            path={Paths.create.path}
            element={<Login />}
          />
          <Route
            path="/"
            element={<Outlet/>}>
            <Route
              path={Paths.admin.path}
              element={(<CheckAuth><AdminPage /></CheckAuth>)} >
              <Route
                path={Paths.coins.path}
                element={<Coins />}
              />
              <Route
                path={Paths.addCoin.path}
                element={<AddCoin />}
              />

            </Route>
          </Route>
          <Route index element={<Navigate to={Paths.admin.path} />} />
        </Routes>
      </BrowserRouter>
    </AlertProvider>
  )
}

export default App;
