import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGetPatientQuery } from '../../store/api/apiSlice';
import {
    Activity,
    Pill,
    LogOut,
    Heart,
    AlertTriangle,
    ChevronRight,
    LayoutDashboard,
    Settings,
    Calendar,
    ChevronLeft,
    ArrowLeft
} from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { data: patient } = useGetPatientQuery();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/observations', icon: Activity, label: 'Observations' },
        { path: '/conditions', icon: Heart, label: 'Conditions' },
        { path: '/appointments', icon: Calendar, label: 'Appointments' },
        { path: '/medications', icon: Pill, label: 'Medications' },
        { path: '/allergies', icon: AlertTriangle, label: 'Allergies' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    const getPatientName = () => {
        if (!patient?.name?.[0]) return 'Olivia Roye';
        const name = patient.name[0];
        return `${name.given?.join(' ') || ''} ${name.family || ''}`.trim();
    };

    const getPatientInitials = () => {
        if (!patient?.name?.[0]) return 'OR';
        const name = patient.name[0];
        const firstInitial = name.given?.[0]?.[0] || '';
        const lastInitial = name.family?.[0] || '';
        return (firstInitial + lastInitial).toUpperCase() || 'OR';
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-['Montserrat']">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-30 h-16 flex items-center px-6 justify-between">
                <div className="flex items-center space-x-4">
                    {location.pathname !== '/dashboard' && (
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-50 rounded-full transition-colors border border-gray-100 text-gray-400 hover:text-gray-600 group"
                            title="Go Back"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    )}
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-[#D63384]">Patient Portal</span>
                        <div className="flex items-center space-x-2 text-gray-400 text-sm ml-4">
                            {(() => {
                                const currentItem = navItems.find(item => item.path === location.pathname);
                                const Icon = currentItem?.icon || LayoutDashboard;
                                return (
                                    <>
                                        <Icon className="w-4 h-4" />
                                        <ChevronRight className="w-3 h-3" />
                                        <span className="text-gray-600 font-medium">{currentItem?.label || 'Dashboard'}</span>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <button
                            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                            className="flex items-center space-x-3 p-1 pr-3 hover:bg-gray-50 rounded-full transition-colors border border-gray-100 cursor-pointer"
                        >
                            <div className="w-8 h-8 bg-[#FDF2F8] text-[#EC4899] rounded-full flex items-center justify-center font-bold text-sm">
                                {getPatientInitials()}
                            </div>
                            <div className="text-left hidden sm:block">
                                <p className="text-xs font-bold text-gray-900">{getPatientName()}</p>
                                <p className="text-[10px] text-gray-500">Patient</p>
                            </div>
                        </button>

                        {profileDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                                <button
                                    onClick={handleLogout}
                                    className="w-[calc(100%-1rem)] mx-2 flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-red-500 border border-red-100 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside
                    className={`
                        bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out z-20
                        ${sidebarOpen ? 'w-64' : 'w-20'}
                    `}
                >
                    <div className="flex-1 py-6 flex flex-col space-y-2">
                        <div className="px-4 mb-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
                            >
                                {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                            </button>
                        </div>

                        {navItems.filter(item => item.path !== '/settings').map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`
                                        mx-4 flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group relative
                                        ${isActive
                                            ? 'bg-[#FDF2F8] text-[#EC4899]'
                                            : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}
                                    `}
                                >
                                    <Icon className="w-6 h-6 shrink-0" />
                                    {sidebarOpen && (
                                        <span className="font-medium whitespace-nowrap overflow-hidden transition-all duration-300">
                                            {item.label}
                                        </span>
                                    )}
                                    {/* Tooltip only when closed */}
                                    {!sidebarOpen && (
                                        <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                            {item.label}
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-[#F9FAFB] p-8">
                    {children}
                </main>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/5 z-10 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default Layout;
