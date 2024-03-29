import MainPage from './pages/MainPage';
import Login from './pages/Login';
import ErrorPage from './pages/ErrorPage';
import SignUp from './pages/signUp';
import { Routes, Route, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';

export const App: React.FC = () => {
    const token = localStorage.getItem("token");
    const location = useLocation();
    useEffect(() => {
        // Empty useEffect hook, have to declare location even though
        // it's not used, so that program acknowledges that path has changed.
        // That is useful for checking if token is type of "null" or "string"
    }, [location.pathname]);
    return (
        <Routes>
            {!token && (
                <>
                    <Route path="/" element={<Login />} />
                    <Route path="/signUp" element={<SignUp />} />
                    <Route path="*" element={<ErrorPage />} />
                </>

            )}
            {token && (
                <>
                    <Route path="/home" element={<MainPage />}
                        errorElement={<ErrorPage />} />
                    <Route path="/users" element={<MainPage />}>
                        <Route path=":username" element={<MainPage />} />
                    </Route>
                    <Route path="*" element={<ErrorPage />} />
                </>
            )}

        </Routes>
    );
};

