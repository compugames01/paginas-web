
import React, { useState } from 'react';
import * as api from '../services/api';

interface ForgotPasswordPageProps {
    onNavigateToLogin: () => void;
    onNavigateToResetPassword: (email: string, token: string) => void;
}

const validateEmail = (email: string): boolean => {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigateToLogin, onNavigateToResetPassword }) => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [resetInfo, setResetInfo] = useState<{ email: string; token: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailError('');
        setResetInfo(null);

        if (!validateEmail(email)) {
            setEmailError('Por favor, introduce un formato de correo electrónico válido.');
            return;
        }

        setIsLoading(true);
        const result = await api.sendPasswordResetEmail(email);
        setIsLoading(false);

        setEmailSent(true);
        if (result.success && result.token) {
            setResetInfo({ email, token: result.token });
        }
    };

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg border dark:border-gray-700">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary dark:text-gray-100">
                        Restablecer Contraseña
                    </h2>
                    <p className="mt-2 text-center text-sm text-text-secondary dark:text-gray-400">
                        {emailSent 
                            ? "Revisa tu bandeja de entrada para continuar."
                            : "Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña."
                        }
                    </p>
                </div>
                {emailSent ? (
                    <div>
                        <div className="rounded-md bg-green-50 dark:bg-green-900/50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-green-800 dark:text-green-300">
                                        Si existe una cuenta con este correo electrónico, recibirás un enlace para restablecer tu contraseña.
                                        {resetInfo && (
                                            <span className="block mt-2">
                                                Para esta demostración, puedes{' '}
                                                <button
                                                    onClick={() => onNavigateToResetPassword(resetInfo.email, resetInfo.token)}
                                                    className="font-bold underline hover:text-green-600 dark:hover:text-green-200 focus:outline-none"
                                                >
                                                    hacer clic aquí
                                                </button>
                                                {' '}para continuar.
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email-address" className="sr-only">Correo electrónico</label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className={`appearance-none rounded-md relative block w-full px-3 py-2 border placeholder-gray-500 text-text-primary focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${emailError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                    placeholder="Correo electrónico"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {emailError && <p className="text-sm text-red-600 dark:text-red-400">{emailError}</p>}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-accent hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-yellow-300 dark:disabled:bg-yellow-700 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Enviando...' : 'Enviar Enlace de Restablecimiento'}
                            </button>
                        </div>
                    </form>
                )}

                <div className="text-sm text-center">
                    <button onClick={onNavigateToLogin} className="font-medium text-black dark:text-gray-200 hover:underline">
                        Volver a Iniciar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
