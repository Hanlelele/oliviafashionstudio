import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
    const userDefault = {
        isAuthenticated: false,
        token: '',
    };

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : userDefault;
    });

    const [token, setToken] = useState(() => {
        const storedtoken = localStorage.getItem('token');
        return storedtoken;
    });

    const login = (userData, token) => {
        setUser({ ...userData, isAuthenticated: true });
        setToken(token);
        localStorage.setItem('user', JSON.stringify({ ...userData, isAuthenticated: true }));
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setUser(userDefault);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const update = (userData) => {
        setUser({ ...userData, isAuthenticated: true });
        localStorage.setItem('user', JSON.stringify({ ...userData, isAuthenticated: true }));
    };

    return <AuthContext.Provider value={{ user, token, login, logout, update }}>{children}</AuthContext.Provider>;
};
