import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react';

const LoginPage: React.FC = () => {
    const { login } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
                        <Heart className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        OpenEMR Patient Portal
                    </h1>
                    <p className="text-gray-600">
                        Access your health records securely
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={login}
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
                    >
                        Login with OpenEMR
                    </button>

                    <div className="text-center text-sm text-gray-500">
                        <p>Secure authentication via SMART on FHIR</p>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Features:</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center">
                            <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                            View your medical records
                        </li>
                        <li className="flex items-center">
                            <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                            Check lab results and vital signs
                        </li>
                        <li className="flex items-center">
                            <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                            Manage appointments
                        </li>
                        <li className="flex items-center">
                            <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                            Review medications
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
