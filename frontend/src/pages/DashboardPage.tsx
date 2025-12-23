import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Skeleton from '../components/common/Skeleton';
import ErrorMessage from '../components/common/ErrorMessage';
import {
    useGetPatientQuery,
    useGetMedicationsQuery,
    useGetAllergiesQuery,
    useGetConditionsQuery,
    useGetObservationsQuery,
    useGetAppointmentsQuery
} from '../store/api/apiSlice';
import {
    Heart,
    ChevronRight,
    Video,
    Calendar,
    Activity,
    AlertTriangle,
    User,
    Pill
} from 'lucide-react';
import type { MedicationRequest, AllergyIntolerance, Condition, Observation, Appointment } from '../types/fhir.types';

const DashboardSkeleton = () => (
    <div className="flex flex-col lg:flex-row gap-8 animate-fadeIn">
        <div className="flex-1 space-y-8">
            {/* Welcome Section Skeleton */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
            </div>

            {/* Quick Stats Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <Skeleton className="w-12 h-12 rounded-xl mb-4" />
                        <Skeleton className="h-6 w-24 mb-2" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                ))}
            </div>

            {/* Upcoming Appointments Skeleton */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-16" />
                </div>
                <div className="space-y-6">
                    {[1, 2].map(i => (
                        <div key={i} className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                            <Skeleton className="h-6 w-1/3 mb-4" />
                            <div className="flex space-x-4">
                                <Skeleton variant="circular" className="w-10 h-10" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-1/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Right Sidebar Skeleton */}
        <div className="w-full lg:w-80 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
                <Skeleton variant="circular" className="w-24 h-24 mx-auto mb-4" />
                <Skeleton className="h-7 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-1/2 mx-auto mb-8" />
                <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-50">
                    {[1, 2, 3].map(i => (
                        <div key={i}>
                            <Skeleton className="h-3 w-full mb-1" />
                            <Skeleton className="h-5 w-full" />
                        </div>
                    ))}
                </div>
                <div className="mt-8">
                    <Skeleton className="h-24 w-full rounded-2xl" />
                </div>
            </div>
        </div>
    </div>
);

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();

    const { data: patientData, isLoading: patientLoading } = useGetPatientQuery();
    const { data: medsData, isLoading: medsLoading, error: medsError, refetch: refetchMeds } = useGetMedicationsQuery();
    const { data: allergiesData, isLoading: allergiesLoading, error: allergiesError, refetch: refetchAllergies } = useGetAllergiesQuery();
    const { data: conditionsData, isLoading: conditionsLoading, error: conditionsError, refetch: refetchConditions } = useGetConditionsQuery();
    const { data: obsData, isLoading: obsLoading, error: obsError, refetch: refetchObs } = useGetObservationsQuery();
    const { data: appointmentsData, isLoading: appointmentsLoading, error: appointmentsError, refetch: refetchAppointments } = useGetAppointmentsQuery();

    const patient = patientData;
    const medications = medsData?.entry?.map(e => e.resource).filter(Boolean) as MedicationRequest[] || [];
    const allergies = allergiesData?.entry?.map(e => e.resource).filter(Boolean) as AllergyIntolerance[] || [];
    const conditions = conditionsData?.entry?.map(e => e.resource).filter(Boolean) as Condition[] || [];
    const observations = obsData?.entry?.map(e => e.resource).filter(Boolean) as Observation[] || [];
    const appointments = appointmentsData?.entry?.map(e => e.resource).filter(Boolean) as Appointment[] || [];

    const isLoading = patientLoading || medsLoading || allergiesLoading || conditionsLoading || obsLoading || appointmentsLoading;
    const error = medsError || allergiesError || conditionsError || obsError || appointmentsError;

    const handleRetry = () => {
        refetchMeds();
        refetchAllergies();
        refetchConditions();
        refetchObs();
        refetchAppointments();
    };

    if (isLoading) return <Layout><DashboardSkeleton /></Layout>;
    if (error) return <ErrorMessage message="Failed to load dashboard data" onRetry={handleRetry} />;

    const getPatientName = () => {
        if (!patient?.name?.[0]) return 'Patient';
        return patient.name[0].given?.[0] || 'Patient';
    };

    const getFullName = () => {
        if (!patient?.name?.[0]) return 'Patient Name';
        const name = patient.name[0];
        return `${name.given?.join(' ') || ''} ${name.family || ''} `.trim();
    };

    const calculateAge = (birthDate?: string) => {
        if (!birthDate) return 'N/A';
        const birth = new Date(birthDate);
        const now = new Date();
        let age = now.getFullYear() - birth.getFullYear();
        const m = now.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
            age--;
        }
        return age.toString();
    };

    const isPastAppointment = (dateString?: string) => {
        if (!dateString) return false;
        return new Date(dateString) < new Date();
    };

    const upcomingAppointments = appointments.filter(apt => !isPastAppointment(apt.start));

    return (
        <Layout>
            <div className="flex flex-col lg:flex-row gap-8 animate-fadeIn">
                {/* Main Content Area */}
                <div className="flex-1 space-y-8">
                    {/* Welcome Section */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Welcome {getPatientName()},</h1>
                        <p className="text-gray-500 mt-1">
                            {upcomingAppointments.length > 0
                                ? `You have ${upcomingAppointments.length} upcoming appointments`
                                : 'You have got no appointments for today'}
                        </p>
                    </div>

                    {/* Quick Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Medications */}
                        <div
                            onClick={() => navigate('/medications')}
                            className="bg-[#FDF2F8] p-6 rounded-2xl border border-pink-100 hover:shadow-md transition-shadow group cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white rounded-xl text-[#EC4899] shadow-sm">
                                    <Pill className="w-6 h-6" />
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#EC4899] transition-colors" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mt-1">Medications</h3>
                            <p className="text-sm text-gray-600 mt-2">
                                {medications.length > 0 ? `${medications.length} Active Medications` : 'No Medications'}
                            </p>
                        </div>

                        {/* Allergies */}
                        <div
                            onClick={() => navigate('/allergies')}
                            className="bg-[#F5F3FF] p-6 rounded-2xl border border-purple-100 hover:shadow-md transition-shadow group cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white rounded-xl text-[#8B5CF6] shadow-sm">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#8B5CF6] transition-colors" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mt-1">Allergies</h3>
                            <p className="text-sm text-gray-600 mt-2">
                                {allergies.length > 0 ? `${allergies.length} Reported Allergies` : 'No Allergies'}
                            </p>
                        </div>

                        {/* Conditions */}
                        <div
                            onClick={() => navigate('/conditions')}
                            className="bg-[#FFF1F2] p-6 rounded-2xl border border-rose-100 hover:shadow-md transition-shadow group cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white rounded-xl text-[#F43F5E] shadow-sm">
                                    <Heart className="w-6 h-6" />
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#F43F5E] transition-colors" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mt-1">Conditions</h3>
                            <p className="text-sm text-gray-600 mt-2">
                                {conditions.length > 0 ? `${conditions.length} Health Conditions` : 'No Conditions'}
                            </p>
                        </div>

                        {/* Observations */}
                        <div
                            onClick={() => navigate('/observations')}
                            className="bg-[#F0F9FF] p-6 rounded-2xl border border-blue-100 hover:shadow-md transition-shadow group cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white rounded-xl text-[#0EA5E9] shadow-sm">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#0EA5E9] transition-colors" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mt-1">Observations</h3>
                            <p className="text-sm text-gray-600 mt-2">
                                {observations.length > 0 ? `${observations.length} Lab Results` : 'No Observations'}
                            </p>
                        </div>
                    </div>

                    {/* Upcoming Appointments */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Upcoming Appointments</h2>
                            <button
                                onClick={() => navigate('/appointments')}
                                className="text-[#D63384] text-sm font-semibold hover:underline"
                            >
                                View all
                            </button>
                        </div>

                        <div className="space-y-6">
                            {appointmentsLoading ? (
                                // Skeleton Loader
                                [1, 2].map(i => (
                                    <div key={i} className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 animate-pulse">
                                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                                        <div className="flex space-x-4">
                                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : upcomingAppointments.length > 0 ? (
                                upcomingAppointments.slice(0, 2).map((app, i) => (
                                    <div key={app.id || i} className={`p-6 ${i === 0 ? 'bg-[#FDF2F8]/50 border-pink-50' : 'bg-white border-gray-50'} rounded-2xl border`}>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">{app.description || 'Consultation'}</h3>
                                                <div className="flex items-center space-x-4 mt-3">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                                            <User className="w-4 h-4 text-gray-400" />
                                                        </div>
                                                        <span className="text-sm text-gray-600">
                                                            {app.participant?.find(p => p.actor?.display)?.actor?.display || 'Healthcare Provider'}
                                                        </span>
                                                    </div>
                                                    <span className="text-gray-300">•</span>
                                                    <span className="text-sm text-gray-600">
                                                        {app.start ? new Date(app.start).toLocaleDateString() : 'TBD'}
                                                    </span>
                                                    <span className="text-gray-300">•</span>
                                                    <span className="text-sm text-gray-600">
                                                        {app.start ? new Date(app.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                    </span>
                                                </div>
                                            </div>
                                            {i === 0 && (
                                                <button className="bg-[#D63384] text-white px-6 py-2.5 rounded-xl font-semibold flex items-center space-x-2 hover:bg-[#C22D77] transition-colors shadow-sm">
                                                    <Video className="w-4 h-4" />
                                                    <span>Join Session</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 font-medium">No Upcoming Appointments</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Medications */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Medications</h2>
                            <button
                                onClick={() => navigate('/medications')}
                                className="text-[#D63384] text-sm font-semibold hover:underline"
                            >
                                View all
                            </button>
                        </div>
                        {medications.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {medications.slice(0, 3).map((med, i) => (
                                    <div key={med.id || i} className="space-y-3">
                                        <div className="flex items-center space-x-2 text-gray-400 text-xs font-medium">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>{med.authoredOn ? new Date(med.authoredOn).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                        <h4 className="font-bold text-gray-900">
                                            <span className="text-[#D63384]">{med.medicationCodeableConcept?.text || 'Medication'}</span>
                                        </h4>
                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                            <span>{med.status || 'Active'}</span>
                                            <span>{med.dosageInstruction?.[0]?.text || ''}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No Results</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar - Patient Profile */}
                <div className="w-full lg:w-80 space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
                        <div className="relative inline-block">
                            <div className="w-24 h-24 bg-[#FDF2F8] rounded-full mx-auto flex items-center justify-center text-[#EC4899] text-3xl font-bold border-4 border-white shadow-md">
                                {getFullName().split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="absolute bottom-0 right-0 w-6 h-6 bg-red-500 border-2 border-white rounded-full"></div>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mt-4">{getFullName()}</h2>
                        <p className="text-gray-400 text-sm font-medium">{calculateAge(patient?.birthDate)} Years</p>

                        <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-50">
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Blood</p>
                                <p className="text-sm font-bold text-red-500 mt-1">AB+</p>
                            </div>
                            <div className="border-x border-gray-50 px-2">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Height</p>
                                <p className="text-sm font-bold text-purple-600 mt-1">160 cm</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Weight</p>
                                <p className="text-sm font-bold text-pink-500 mt-1">54 kg</p>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4 text-left">
                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <p className="text-xs font-bold text-gray-900 mb-2">Patient Information</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px]">
                                        <span className="text-gray-500">Gender</span>
                                        <span className="text-gray-900 font-medium capitalize">{patient?.gender || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px]">
                                        <span className="text-gray-500">Birthday</span>
                                        <span className="text-gray-900 font-medium">{patient?.birthDate || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default DashboardPage;
