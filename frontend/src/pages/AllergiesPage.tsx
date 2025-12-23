import React from 'react';
import Layout from '../components/layout/Layout';
import { useGetAllergiesQuery } from '../store/api/apiSlice';
import Skeleton from '../components/common/Skeleton';
import ErrorMessage from '../components/common/ErrorMessage';
import { AlertTriangle, Shield, AlertCircle } from 'lucide-react';
import type { AllergyIntolerance } from '../types/fhir.types';

const AllergiesSkeleton = () => (
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

const AllergiesPage: React.FC = () => {
    const { data, isLoading, error, refetch } = useGetAllergiesQuery();
    const allergies = data?.entry?.map(e => e.resource!).filter(Boolean) || [];

    if (isLoading) return <Layout><AllergiesSkeleton /></Layout>;
    if (error) return <ErrorMessage message="Failed to load allergies" onRetry={refetch} />;

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getAllergyName = (allergy: AllergyIntolerance) => {
        const codeText = allergy.code?.text || allergy.code?.coding?.[0]?.display;

        // Use code text if valid and not "unknown"
        if (codeText && codeText.toLowerCase() !== 'unknown') {
            return codeText;
        }

        // Fallback: Extract text from narrative div (e.g. <div>sulfa</div>)
        if (allergy.text?.div) {
            // Strip HTML tags
            const text = allergy.text.div.replace(/<[^>]*>?/gm, '').trim();
            if (text) return text;
        }

        return 'Unknown Allergy';
    };

    const getClinicalStatus = (allergy: AllergyIntolerance) => {
        return allergy.clinicalStatus?.coding?.[0]?.code || 'unknown';
    };

    const getCriticalityColor = (criticality?: string) => {
        switch (criticality?.toLowerCase()) {
            case 'high':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'low':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-red-100 text-red-800';
            case 'inactive':
                return 'bg-gray-100 text-gray-800';
            case 'resolved':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    const getCriticalityIcon = (criticality?: string) => {
        switch (criticality?.toLowerCase()) {
            case 'high':
                return <AlertTriangle className="w-6 h-6 text-red-500" />;
            case 'low':
                return <AlertCircle className="w-6 h-6 text-yellow-500" />;
            default:
                return <Shield className="w-6 h-6 text-gray-500" />;
        }
    };

    const getReactions = (allergy: AllergyIntolerance) => {
        if (!allergy.reaction || allergy.reaction.length === 0) return [];
        return allergy.reaction.map(r =>
            r.manifestation?.map(m => m.text || m.coding?.[0]?.display).filter(Boolean)
        ).flat().filter(Boolean);
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto animate-fadeIn">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <AlertTriangle className="w-8 h-8 mr-3 text-[#8B5CF6]" />
                        Allergies & Intolerances
                    </h1>
                    <p className="text-gray-600 mt-2">View your allergy and intolerance information</p>
                </div>

                {allergies.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <Shield className="w-16 h-16 text-green-300 mx-auto mb-4" />
                        <p className="text-gray-500">No allergies or intolerances recorded</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {allergies.map((allergy, index) => {
                            const status = getClinicalStatus(allergy);
                            const reactions = getReactions(allergy);
                            return (
                                <div
                                    key={allergy.id || index}
                                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                {getCriticalityIcon(allergy.criticality)}
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {getAllergyName(allergy)}
                                                </h3>
                                            </div>
                                            {allergy.category && allergy.category.length > 0 && (
                                                <p className="text-sm text-gray-500 capitalize mb-3">
                                                    {allergy.category.join(', ')}
                                                </p>
                                            )}

                                            <div className="flex flex-wrap gap-2 mb-3">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                                                    {status}
                                                </span>
                                                {allergy.criticality && (
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCriticalityColor(allergy.criticality)}`}>
                                                        {allergy.criticality}
                                                    </span>
                                                )}
                                            </div>

                                            {reactions.length > 0 && (
                                                <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
                                                    <p className="text-sm font-medium text-red-900 mb-1">Reactions:</p>
                                                    <ul className="text-sm text-red-800 list-disc list-inside">
                                                        {reactions.map((reaction, idx) => (
                                                            <li key={idx}>{reaction}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <span className="text-sm text-gray-500">
                                            Recorded: {formatDate(allergy.recordedDate)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default AllergiesPage;