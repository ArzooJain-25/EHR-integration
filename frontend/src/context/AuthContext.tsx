import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authAPI } from '../services/api';

interface AuthContextType {
    isAuthenticated: boolean;
    patientId: string | null;
    loading: boolean;
    login: () => void;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [patientId, setPatientId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);


    const checkAuth = async () => {
        try {
            const status = await authAPI.checkStatus();
            setIsAuthenticated(status.authenticated);
            setPatientId(status.patientId);
        } catch (error) {
            console.error('checkAuth error:', error);
            setIsAuthenticated(false);
            setPatientId(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Add a small delay to ensure cookies are set after redirect
        const timer = setTimeout(() => {
            checkAuth();
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    const login = () => {
        authAPI.login();
    };

    const logout = async () => {
        try {
            await authAPI.logout();
            setIsAuthenticated(false);
            setPatientId(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, patientId, loading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
