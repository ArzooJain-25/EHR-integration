import React from 'react';
import Layout from '../components/layout/Layout';
import { useGetObservationsQuery } from '../store/api/apiSlice';
import Skeleton from '../components/common/Skeleton';
import ErrorMessage from '../components/common/ErrorMessage';
import { Activity } from 'lucide-react';
import type { Observation } from '../types/fhir.types';
import { getTerminologyDisplay } from '../utils/terminology';

const ObservationsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
        {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                            <Skeleton variant="circular" className="w-5 h-5" />
                            <Skeleton className="h-6 w-3/4" />
                        </div>
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
                <div className="space-y-3 pt-4 border-t border-gray-50">
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const ObservationsPage: React.FC = () => {
    const { data, isLoading, error, refetch } = useGetObservationsQuery();
    const observations = data?.entry?.map(e => e.resource!).filter(Boolean) || [];

    if (isLoading) return <Layout><ObservationsSkeleton /></Layout>;
    if (error) return <ErrorMessage message="Failed to load observations" onRetry={refetch} />;

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch (e) {
            return dateString;
        }
    };

    const getObservationName = (obs: Observation) => {
        if (obs.code?.text) return obs.code.text;
        const displayCoding = obs.code?.coding?.find(c => c.display);
        if (displayCoding?.display) return displayCoding.display;
        const codeCoding = obs.code?.coding?.find(c => c.code);
        if (codeCoding?.code) {
            const mappedName = getTerminologyDisplay(codeCoding.code, '');
            if (mappedName) return mappedName;
            return codeCoding.code;
        }
        return 'Unknown';
    };

    const getObservationValue = (obs: Observation) => {
        if (obs.valueQuantity) {
            return `${obs.valueQuantity.value} ${obs.valueQuantity.unit || ''}`;
        }
        return 'N/A';
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto animate-fadeIn">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <Activity className="w-8 h-8 mr-3 text-[#0EA5E9]" />
                        Observations
                    </h1>
                    <p className="text-gray-600 mt-2">View your vital signs and lab results</p>
                </div>

                {observations.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No observations found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {observations.map((obs, index) => (
                            <div key={obs.id || index} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Activity className="w-5 h-5 text-[#0EA5E9]" />
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {getObservationName(obs)}
                                            </h3>
                                        </div>
                                        <div className="text-sm text-gray-600 mb-3">
                                            Value: {getObservationValue(obs)}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                    <span className="text-sm text-gray-500">
                                        Effective Date: {formatDate(obs.effectiveDateTime)}
                                    </span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${obs.status === 'final' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {obs.status || 'Unknown'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ObservationsPage;
