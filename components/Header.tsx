import React, { useState, useEffect } from 'react';
import type { Page, User } from '../types';

interface HeaderProps {
    setCurrentPage: (page: Page) => void;
    cartItemCount: number;
    wishlistItemCount: number;
    currentUser: User | null;
    onLogout: () => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const WishlistIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
    </svg>
);

const LogoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19V6.13a1 1 0 011.528-.849l8.32 5.67a1 1 0 010 1.7l-8.32 5.67A1 1 0 0111 19z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19V6.13a1 1 0 011.528-.849l8.32 5.67a1 1 0 010 1.7l-8.32 5.67A1 1 0 015 19z" />
    </svg>
);

const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const NavLink: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
    <button onClick={onClick} className="text-gray-100 hover:text-white hover:bg-primary-dark px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap">
        {children}
    </button>
);

const Header: React.FC<HeaderProps> = ({ setCurrentPage, cartItemCount, wishlistItemCount, currentUser, onLogout, theme, toggleTheme }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const handleMobileLinkClick = (page: Page) => {
        setCurrentPage(page);
        setIsMobileMenuOpen(false);
    };

    const handleLogoutClick = () => {
        onLogout();
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="bg-primary shadow-lg sticky top-0 z-50">
            <nav className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <button onClick={() => setCurrentPage('home')} className="flex-shrink-0 flex items-center gap-2 text-white">
                            <LogoIcon />
                            <span className="font-bold text-xl">Abarrotes Fresco</span>
                        </button>
                         <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <NavLink onClick={() => setCurrentPage('home')}>Inicio</NavLink>
                                <NavLink onClick={() => setCurrentPage('catalog')}>Catálogo</NavLink>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center">
                         <div className="hidden md:flex items-center space-x-4">
                             {currentUser ? (
                                 <>
                                     <span className="text-white text-sm font-medium px-3 py-2">Hola, {currentUser.name.split(' ')[0]}</span>
                                     <NavLink onClick={() => setCurrentPage('account')}>Mi Cuenta</NavLink>
                                     <NavLink onClick={onLogout}>Cerrar Sesión</NavLink>
                                 </>
                             ) : (
                                 <>
                                   <NavLink onClick={() => setCurrentPage('login')}>Iniciar Sesión</NavLink>
                                   <NavLink onClick={() => setCurrentPage('register')}>Registrarse</NavLink>
                                 </>
                             )}
                         </div>
                        <button onClick={toggleTheme} className="relative text-gray-100 hover:text-white p-2 rounded-full hover:bg-primary-dark transition-colors ml-4">
                            <span className="sr-only">Cambiar tema</span>
                            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                        </button>
                        <button onClick={() => setCurrentPage('wishlist')} className="relative text-gray-100 hover:text-white p-2 rounded-full hover:bg-primary-dark transition-colors ml-1">
                            <span className="sr-only">Ver lista de deseos</span>
                            <WishlistIcon />
                            {wishlistItemCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                    {wishlistItemCount}
                                </span>
                            )}
                        </button>
                        <button onClick={() => setCurrentPage('cart')} className="relative text-gray-100 hover:text-white p-2 rounded-full hover:bg-primary-dark transition-colors ml-1">
                            <span className="sr-only">Ver carrito</span>
                            <CartIcon />
                            {cartItemCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>
                        <div className="md:hidden flex items-center">
                            <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-100 hover:text-white p-2 rounded-full hover:bg-primary-dark transition-colors ml-1" aria-label="Abrir menú">
                                <MenuIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

             {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 z-50 bg-gray-900 bg-opacity-90 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} role="dialog" aria-modal="true">
                <div className="container mx-auto px-4 h-full flex flex-col">
                    <div className="flex justify-between items-center h-16 flex-shrink-0">
                        <button onClick={() => handleMobileLinkClick('home')} className="flex-shrink-0 flex items-center gap-2 text-white">
                            <LogoIcon />
                            <span className="font-bold text-xl">Abarrotes Fresco</span>
                        </button>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-200 hover:text-white" aria-label="Cerrar menú">
                            <CloseIcon />
                        </button>
                    </div>
                    <div className="flex flex-col items-center justify-center flex-grow text-center space-y-6">
                        <button onClick={() => handleMobileLinkClick('home')} className="text-3xl font-bold text-white hover:text-accent transition-colors">Inicio</button>
                        <button onClick={() => handleMobileLinkClick('catalog')} className="text-3xl font-bold text-white hover:text-accent transition-colors">Catálogo</button>
                        
                        <div className="border-t border-gray-700 w-1/2 my-6"></div>

                        {currentUser ? (
                            <>
                               <span className="text-xl text-gray-300">Hola, {currentUser.name.split(' ')[0]}</span>
                               <button onClick={() => handleMobileLinkClick('account')} className="text-3xl font-bold text-white hover:text-accent transition-colors">Mi Cuenta</button>
                               <button onClick={handleLogoutClick} className="text-3xl font-bold text-white hover:text-accent transition-colors">Cerrar Sesión</button>
                            </>
                        ) : (
                            <>
                               <button onClick={() => handleMobileLinkClick('login')} className="text-3xl font-bold text-white hover:text-accent transition-colors">Iniciar Sesión</button>
                               <button onClick={() => handleMobileLinkClick('register')} className="bg-accent text-primary font-bold py-3 px-8 rounded-lg text-xl hover:bg-yellow-500 transition-colors">Registrarse</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;