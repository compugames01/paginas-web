
import React, { useState } from 'react';

interface LoginPageProps {
    onLogin: (email: string, password: string) => boolean;
    onNavigateToRegister: () => void;
}

const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

const validatePassword = (password: string): string => {
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

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setEmailError('');
        setPasswordError('');

        if (!email || !password) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        if (!validateEmail(email)) {
            setEmailError('Por favor, introduce un formato de correo electrónico válido.');
            return;
        }

        const passError = validatePassword(password);
        if (passError) {
            setPasswordError(passError);
            return;
        }

        onLogin(email, password);
    };

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg border dark:border-gray-700">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary dark:text-gray-100">
                        Inicia sesión en tu cuenta
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Correo electrónico</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-text-primary rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Contraseña</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-text-primary rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {emailError && <p className="mt-2 text-sm text-red-600">{emailError}</p>}
                    {passwordError && <p className="mt-2 text-sm text-red-600">{passwordError}</p>}


                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-text-primary bg-accent hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                        >
                            Iniciar Sesión
                        </button>
                    </div>
                </form>
                <div className="text-sm text-center">
                    <button onClick={onNavigateToRegister} className="font-medium text-primary hover:text-primary-dark">
                        ¿No tienes una cuenta? Regístrate
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;