
import React, { useState, useEffect } from 'react';

interface VerificationPageProps {
    email: string;
    token: string;
    onVerify: (token: string, email: string) => Promise<{ success: boolean; message: string }>;
    onNavigateToLogin: () => void;
    onResendVerification: (email: string) => void;
}

const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
);

const SuccessIcon = () => (
    <svg className="w-16 h-16 text-primary mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ErrorIcon = () => (
    <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

type Status = 'initial' | 'verifying' | 'success' | 'error';

const VerificationPage: React.FC<VerificationPageProps> = ({ email, token, onVerify, onNavigateToLogin, onResendVerification }) => {
    const [status, setStatus] = useState<Status>('initial');
    const [message, setMessage] = useState('');

    const handleVerification = async () => {
        setStatus('verifying');
        const result = await onVerify(token, email);
        setMessage(result.message);
        setStatus(result.success ? 'success' : 'error');
    };

    const handleResend = () => {
        onResendVerification(email);
        alert('Se ha enviado un nuevo correo de verificación.');
    };

    const renderContent = () => {
        switch (status) {
            case 'verifying':
                return (
                    <>
                        <LoadingSpinner />
                        <h2 className="mt-6 text-2xl font-bold text-text-primary dark:text-gray-200">Verificando tu cuenta...</h2>
                        <p className="mt-2 text-text-secondary dark:text-gray-400">Esto tomará solo un momento.</p>
                    </>
                );
            case 'success':
                return (
                    <>
                        <SuccessIcon />
                        <h2 className="mt-6 text-2xl font-bold text-text-primary dark:text-gray-200">{message}</h2>
                        <p className="mt-2 text-text-secondary dark:text-gray-400">Ya puedes iniciar sesión con tu cuenta.</p>
                        <button
                            onClick={onNavigateToLogin}
                            className="mt-6 w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg shadow-lg"
                        >
                            Ir a Iniciar Sesión
                        </button>
                    </>
                );
            case 'error':
                return (
                    <>
                        <ErrorIcon />
                        <h2 className="mt-6 text-2xl font-bold text-text-primary dark:text-gray-200">Error de Verificación</h2>
                        <p className="mt-2 text-text-secondary dark:text-gray-400">{message}</p>
                        <div className="mt-6 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleResend}
                                className="w-full bg-accent hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg shadow-lg"
                            >
                                Reenviar correo
                            </button>
                             <button
                                onClick={onNavigateToLogin}
                                className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-text-primary dark:text-gray-200 font-bold py-3 px-8 rounded-lg"
                            >
                                Volver a Inicio de Sesión
                            </button>
                        </div>
                    </>
                );
            case 'initial':
            default:
                return (
                    <>
                        <h2 className="text-3xl font-extrabold text-text-primary dark:text-gray-100">Verifica tu correo electrónico</h2>
                        <p className="mt-2 text-center text-text-secondary dark:text-gray-400">
                            Te hemos enviado un correo a <strong className="text-text-primary dark:text-gray-200">{email}</strong>. Por favor, haz clic en el enlace del correo para activar tu cuenta.
                        </p>
                        <div className="mt-8">
                            <p className="text-sm text-text-secondary dark:text-gray-400 mb-4">
                                Para fines de esta demostración, puedes verificar tu cuenta inmediatamente:
                            </p>
                            <button
                                onClick={handleVerification}
                                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg shadow-lg"
                            >
                                Verificar mi cuenta ahora (Demo)
                            </button>
                        </div>
                         <div className="mt-6 text-sm">
                            <button onClick={handleResend} className="font-medium text-black dark:text-gray-200 hover:underline">
                               ¿No recibiste el correo? Reenviar
                            </button>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg border dark:border-gray-700 text-center">
                {renderContent()}
            </div>
        </div>
    );
};

export default VerificationPage;
