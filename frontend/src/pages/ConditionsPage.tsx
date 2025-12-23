import React from 'react';
import Layout from '../components/layout/Layout';
import { useGetConditionsQuery } from '../store/api/apiSlice';
import Skeleton from '../components/common/Skeleton';
import ErrorMessage from '../components/common/ErrorMessage';
import { FileText, AlertCircle, CheckCircle } from 'lucide-react';
import type { Condition } from '../types/fhir.types';
import { getTerminologyDisplay } from '../utils/terminology';

const ConditionsSkeleton = () => (
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

const ConditionsPage: React.FC = () => {
    const { data, isLoading, error, refetch } = useGetConditionsQuery();
    const conditions = data?.entry?.map(e => e.resource!).filter(Boolean) || [];

    if (isLoading) return <Layout><ConditionsSkeleton /></Layout>;
    if (error) return <ErrorMessage message="Failed to load conditions" onRetry={refetch} />;

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

    const getConditionName = (condition: Condition) => {
        // 1. Check top-level text
        if (condition.code?.text) return condition.code.text;

        // 2. Check all codings for a display name
        const displayCoding = condition.code?.coding?.find(c => c.display);
        if (displayCoding?.display) return displayCoding.display;

        // 3. Fallback to terminology utility for common codes
        const codeCoding = condition.code?.coding?.find(c => c.code);
        if (codeCoding?.code) {
            const mappedName = getTerminologyDisplay(codeCoding.code, '');
            if (mappedName) return mappedName;
            return codeCoding.code;
        }

        return 'Unknown Condition';
    };

    const getClinicalStatus = (condition: Condition) => {
        // Handle CodeableConcept (R4)
        const codingStatus = condition.clinicalStatus?.coding?.find(c => c.code || c.display);
        if (codingStatus) return (codingStatus.code || codingStatus.display || 'unknown').toLowerCase();

        if (condition.clinicalStatus?.text) return condition.clinicalStatus.text.toLowerCase();

        // Handle string status (some older versions/custom resources)
        if (typeof condition.clinicalStatus === 'string') return (condition.clinicalStatus as string).toLowerCase();

        return 'unknown';
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-red-100 text-red-800';
            case 'resolved':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'resolved':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            default:
                return <FileText className="w-5 h-5 text-[#F43F5E]" />;
        }
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto animate-fadeIn">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <FileText className="w-8 h-8 mr-3 text-[#F43F5E]" />
                        Conditions
                    </h1>
                    <p className="text-gray-600 mt-2">View your diagnoses and health conditions</p>
                </div>

                {conditions.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No conditions found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {conditions.map((condition, index) => {
                            const status = getClinicalStatus(condition);
                            return (
                                <div key={condition.id || index} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow flex flex-col">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                {getStatusIcon(status)}
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {getConditionName(condition)}
                                                </h3>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3">
                                                Clinical Status: {status}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                        <span className="text-sm text-gray-500">
                                            Onset Date: {formatDate(condition.onsetDateTime)}
                                        </span>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                                            {status}
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

export default ConditionsPage;
