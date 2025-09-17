
import React, { useState } from 'react';

interface RegisterPageProps {
    onRegister: (name: string, email: string, password: string, phone: string) => Promise<boolean>;
    onNavigateToLogin: () => void;
}

const validateName = (name: string): string => {
    if (!name.trim()) {
        return 'El nombre completo es obligatorio.';
    }
    return '';
};

const validateEmail = (email: string): boolean => {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

const validatePhone = (phone: string): string => {
    if (!phone.trim()) {
        return 'El número de teléfono es obligatorio.';
    }
    if (!/^\d{9}$/.test(phone)) {
        return 'El número de teléfono debe contener 9 dígitos.';
    }
    return '';
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

type FormField = 'name' | 'email' | 'password' | 'phone';

const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const EyeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064 7 9.542-7 .847 0 1.673.124 2.468.352M7.5 7.5l12 12" /></svg>;

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister, onNavigateToLogin }) => {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
    });

    const [touched, setTouched] = useState({
        name: false,
        email: false,
        password: false,
        phone: false,
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validateField = (field: FormField, value: string) => {
        let error = '';
        switch (field) {
            case 'name':
                error = validateName(value);
                break;
            case 'email':
                if (!validateEmail(value)) {
                    error = 'Por favor, introduce un formato de correo electrónico válido.';
                }
                break;
            case 'password':
                error = validatePassword(value);
                break;
            case 'phone':
                error = validatePhone(value);
                break;
        }
        setErrors(prev => ({ ...prev, [field]: error }));
        return error === '';
    };

    const handleBlur = (field: FormField) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        validateField(field, formState[field]);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const field = name as FormField;
        setFormState(prev => ({ ...prev, [field]: value }));
        if (touched[field]) {
            validateField(field, value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Mark all as touched and validate all
        setTouched({ name: true, email: true, password: true, phone: true });
        const isNameValid = validateField('name', formState.name);
        const isEmailValid = validateField('email', formState.email);
        const isPasswordValid = validateField('password', formState.password);
        const isPhoneValid = validateField('phone', formState.phone);

        if (isNameValid && isEmailValid && isPasswordValid && isPhoneValid) {
            setIsLoading(true);
            try {
                await onRegister(formState.name, formState.email, formState.password, formState.phone);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="flex items-center justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg border dark:border-gray-700">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary dark:text-gray-100">
                        Crea una nueva cuenta
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="name" className="sr-only">Nombre completo</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border placeholder-gray-500 text-text-primary rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${touched.name && errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                placeholder="Nombre completo"
                                value={formState.name}
                                onChange={handleChange}
                                onBlur={() => handleBlur('name')}
                            />
                        </div>
                        <div>
                            <label htmlFor="email-address" className="sr-only">Correo electrónico</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border placeholder-gray-500 text-text-primary focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${touched.email && errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                placeholder="Correo electrónico"
                                value={formState.email}
                                onChange={handleChange}
                                onBlur={() => handleBlur('email')}
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="phone" className="sr-only">Número de teléfono</label>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 dark:text-gray-400 sm:text-sm">+51</span>
                            </div>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                autoComplete="tel"
                                required
                                className={`appearance-none rounded-none relative block w-full pl-12 pr-3 py-2 border placeholder-gray-500 text-text-primary focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${touched.phone && errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                placeholder="987654321"
                                value={formState.phone}
                                onChange={handleChange}
                                onBlur={() => handleBlur('phone')}
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="password" className="sr-only">Contraseña</label>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border placeholder-gray-500 text-text-primary rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${touched.password && errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                placeholder="Contraseña"
                                value={formState.password}
                                onChange={handleChange}
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
                        {touched.name && errors.name && <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
                        {touched.email && errors.email && <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
                        {touched.phone && errors.phone && <p className="text-sm text-red-600 dark:text-red-400">{errors.phone}</p>}
                        {touched.password && errors.password && <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-accent hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-yellow-300 dark:disabled:bg-yellow-700 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Registrando...' : 'Registrarse'}
                        </button>
                    </div>
                </form>
                <div className="text-sm text-center">
                    <button onClick={onNavigateToLogin} className="font-medium text-black dark:text-gray-200 hover:underline">
                        ¿Ya tienes una cuenta? Inicia sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
