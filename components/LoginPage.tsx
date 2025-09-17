
import React, { useState } from 'react';

interface LoginPageProps {
    onLogin: (email: string, password: string) => Promise<void>;
    loginError: { message: string; isUnverified: boolean } | null;
    onNavigateToRegister: () => void;
    onNavigateToForgotPassword: () => void;
    onResendVerificationRequest: (email: string) => void;
}

const validateEmail = (email: string): boolean => {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

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

const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const EyeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064 7 9.542-7 .847 0 1.673.124 2.468.352M7.5 7.5l12 12" /></svg>;


const LoginPage: React.FC<LoginPageProps> = ({ onLogin, loginError, onNavigateToRegister, onNavigateToForgotPassword, onResendVerificationRequest }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [touched, setTouched] = useState({
        email: false,
        password: false,
    });

    const handleBlur = (field: 'email' | 'password') => {
        setTouched(prev => ({ ...prev, [field]: true }));
        
        if (field === 'email') {
            if (!validateEmail(email)) {
                setEmailError('Por favor, introduce un formato de correo electrónico válido.');
            } else {
                setEmailError('');
            }
        } else if (field === 'password') {
            const passError = validatePassword(password);
            setPasswordError(passError);
        }
    };
    
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        if (touched.email) {
            if (!validateEmail(newEmail)) {
                setEmailError('Por favor, introduce un formato de correo electrónico válido.');
            } else {
                setEmailError('');
            }
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        if (touched.password) {
            const passError = validatePassword(newPassword);
            setPasswordError(passError);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setTouched({ email: true, password: true });

        const isEmailValid = validateEmail(email);
        const passwordValidationError = validatePassword(password);
        
        if (!isEmailValid) {
            setEmailError('Por favor, introduce un formato de correo electrónico válido.');
        } else {
            setEmailError('');
        }
        setPasswordError(passwordValidationError);
        
        if (isEmailValid && !passwordValidationError) {
            await onLogin(email, password);
        }
    };
    
    const handleResendClick = () => {
        if (validateEmail(email)) {
            onResendVerificationRequest(email);
        } else {
            // This case should ideally be handled by the main app state, but a local validation is fine as fallback
            setEmailError('Por favor, introduce un correo electrónico válido para reenviar el enlace.');
        }
    };

    return (
        <div className="flex items-center justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg border dark:border-gray-700">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary dark:text-gray-100">
                        Inicia sesión en tu cuenta
                    </h2>
                </div>
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
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border placeholder-gray-500 text-text-primary rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${touched.email && emailError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={handleEmailChange}
                                onBlur={() => handleBlur('email')}
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="password" className="sr-only">Contraseña</label>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border placeholder-gray-500 text-text-primary rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${touched.password && passwordError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                placeholder="Contraseña"
                                value={password}
                                onChange={handlePasswordChange}
                                onBlur={() => handleBlur('password')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        {touched.email && emailError && <p className="text-sm text-red-600 dark:text-red-400">{emailError}</p>}
                        {touched.password && passwordError && <p className="text-sm text-red-600 dark:text-red-400">{passwordError}</p>}
                        {loginError && <p className="text-sm text-red-600 dark:text-red-400">{loginError.message}</p>}
                    </div>
                    
                     <div className="flex items-center justify-between text-sm">
                        {loginError?.isUnverified ? (
                             <button
                                type="button"
                                onClick={handleResendClick}
                                className="font-medium text-black dark:text-gray-200 hover:underline focus:outline-none"
                            >
                                Reenviar correo de verificación
                            </button>
                        ) : (
                            <span />
                        )}
                        <button 
                            type="button" 
                            onClick={onNavigateToForgotPassword} 
                            className="font-medium text-black dark:text-gray-200 hover:underline focus:outline-none"
                        >
                            ¿Se te olvidó la contraseña?
                        </button>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-accent hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                        >
                            Iniciar Sesión
                        </button>
                    </div>
                </form>
                <div className="text-sm text-center">
                    <button onClick={onNavigateToRegister} className="font-medium text-black dark:text-gray-200 hover:underline">
                        ¿No tienes una cuenta? Regístrate
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
