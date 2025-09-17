
import React, { useState } from 'react';

interface ResetPasswordPageProps {
    onResetPassword: (newPassword: string) => Promise<{ success: boolean; message: string }>;
    onNavigateToLogin: () => void;
}

const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const EyeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064 7 9.542-7 .847 0 1.673.124 2.468.352M7.5 7.5l12 12" /></svg>;

const validatePassword = (password: string): string => {
    if (!password) {
        return 'La contraseña es obligatoria.';
    }
    if (password.length < 8) {
        return 'La contraseña debe tener al menos 8 caracteres.';
    }
    if (!/[A-Z]/.test(password)) {
        return 'La contraseña debe contener al menos una letra mayúscula.';
    }
    if (!/[0-9]/.test(password)) {
        return 'La contraseña debe contener al menos un número.';
    }
    return '';
};


const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onResetPassword, onNavigateToLogin }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({ newPassword: '', confirmPassword: '' });
    const [apiError, setApiError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError('');
        const newPasswordError = validatePassword(newPassword);
        const confirmPasswordError = newPassword !== confirmPassword ? 'Las contraseñas no coinciden.' : '';

        setErrors({ newPassword: newPasswordError, confirmPassword: confirmPasswordError });

        if (newPasswordError || confirmPasswordError) {
            return;
        }

        setIsLoading(true);
        const result = await onResetPassword(newPassword);
        setIsLoading(false);

        if (!result.success) {
            setApiError(result.message);
        }
    };

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg border dark:border-gray-700">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary dark:text-gray-100">
                        Establece tu nueva contraseña
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="relative">
                            <label htmlFor="new-password" className="sr-only">Nueva Contraseña</label>
                            <input
                                id="new-password"
                                name="newPassword"
                                type={showPassword ? 'text' : 'password'}
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border placeholder-gray-500 text-text-primary rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${errors.newPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                placeholder="Nueva Contraseña"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                             <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                        <div className="relative">
                            <label htmlFor="confirm-password" className="sr-only">Confirmar Nueva Contraseña</label>
                            <input
                                id="confirm-password"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border placeholder-gray-500 text-text-primary rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                placeholder="Confirmar Nueva Contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                             <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        {errors.newPassword && <p className="text-sm text-red-600 dark:text-red-400">{errors.newPassword}</p>}
                        {errors.confirmPassword && <p className="text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>}
                        {apiError && <p className="text-sm text-red-600 dark:text-red-400">{apiError}</p>}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-accent hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-yellow-300 dark:disabled:bg-yellow-700 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}
                        </button>
                    </div>
                </form>
                 <div className="text-sm text-center">
                    <button onClick={onNavigateToLogin} className="font-medium text-black dark:text-gray-200 hover:underline">
                        Volver a Iniciar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
