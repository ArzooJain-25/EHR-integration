import React from 'react';
import Layout from '../components/layout/Layout';
import { useGetAppointmentsQuery } from '../store/api/apiSlice';
import Skeleton from '../components/common/Skeleton';
import ErrorMessage from '../components/common/ErrorMessage';
import { Calendar, Clock, User, Video, ChevronRight } from 'lucide-react';
import type { Appointment } from '../types/fhir.types';

const AppointmentsSkeleton = () => (
    <div className="space-y-6 animate-fadeIn">
        {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <Skeleton className="h-7 w-1/3 mb-4" />
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Skeleton variant="circular" className="w-6 h-6" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    </div>
                    <Skeleton className="h-10 w-32 rounded-xl" />
                </div>
            </div>
        ))}
    </div>
);

const AppointmentsPage: React.FC = () => {
    const { data, isLoading, error, refetch } = useGetAppointmentsQuery();
    const appointments = data?.entry?.map(e => e.resource!).filter(Boolean) || [];

    if (isLoading) return <Layout><AppointmentsSkeleton /></Layout>;
    if (error) return <ErrorMessage message="Failed to load appointments" onRetry={refetch} />;

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTime = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getProvider = (appointment: Appointment) => {
        return appointment.participant?.find(p => p.actor?.display)?.actor?.display || 'Healthcare Provider';
    };

    const isPastAppointment = (dateString?: string) => {
        if (!dateString) return false;
        return new Date(dateString) < new Date();
    };

    const upcomingAppointments = appointments.filter(apt => !isPastAppointment(apt.start));
    const pastAppointments = appointments.filter(apt => isPastAppointment(apt.start));

    return (
        <Layout>
            <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <Calendar className="w-8 h-8 mr-3 text-[#EC4899]" />
                        Appointments
                    </h1>
                    <p className="text-gray-600 mt-2">Manage your upcoming and past medical consultations</p>
                </div>

                {appointments.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No upcoming Appointments</h3>
                        <p className="text-gray-500 max-w-xs mx-auto">You don't have any appointments scheduled at the moment.</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Upcoming Appointments */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <span className="w-2 h-2 bg-[#EC4899] rounded-full mr-3"></span>
                                Upcoming Appointments
                            </h2>
                            {upcomingAppointments.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6">
                                    {upcomingAppointments.map((apt, index) => (
                                        <div key={apt.id || index} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                                <div className="flex-1 space-y-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="p-2.5 bg-[#FDF2F8] text-[#EC4899] rounded-xl">
                                                            <Calendar className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-bold text-gray-900">{apt.description || 'Medical Consultation'}</h3>
                                                            <p className="text-sm text-gray-500">{formatDate(apt.start)} • {formatTime(apt.start)} - {formatTime(apt.end)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3 pl-1">
                                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                            <User className="w-4 h-4 text-gray-400" />
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-600">{getProvider(apt)}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4 w-full md:w-auto">
                                                    <button className="flex-1 md:flex-none bg-[#D63384] text-white px-8 py-3 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-[#C22D77] transition-all shadow-sm hover:shadow-md">
                                                        <Video className="w-4 h-4" />
                                                        <span>Join Session</span>
                                                    </button>
                                                    <button className="p-3 text-gray-400 hover:bg-gray-50 rounded-2xl transition-colors">
                                                        <ChevronRight className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 text-center">
                                    <p className="text-gray-500 font-medium">No upcoming Appointments</p>
                                </div>
                            )}
                        </section>

                        {/* Past Appointments */}
                        {pastAppointments.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <span className="w-2 h-2 bg-gray-300 rounded-full mr-3"></span>
                                    Past Appointments
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {pastAppointments.map((apt, index) => (
                                        <div key={apt.id || index} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="p-2 bg-gray-50 text-gray-400 rounded-lg">
                                                            <Clock className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-gray-900">{apt.description || 'Consultation'}</h3>
                                                            <p className="text-xs text-gray-500">{formatDate(apt.start)}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                                                        Completed
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <User className="w-4 h-4 text-gray-400" />
                                                    <span>{getProvider(apt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default AppointmentsPage;
