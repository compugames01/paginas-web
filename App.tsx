
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import CatalogPage from './components/CatalogPage';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AccountPage from './components/AccountPage';
import ConfirmationPage from './components/ConfirmationPage';
import ProductDetailPage from './components/ProductDetailPage';
import WishlistPage from './components/WishlistPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import ContactPage from './components/ContactPage';
import VerificationPage from './components/VerificationPage';
import ToastContainer from './components/Toast';
import { Page, CartItem, Product, User, Order, Review, Address, PaymentMethod, Toast } from './types';
import * as api from './services/api';


const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>(() => {
        const savedPage = localStorage.getItem('currentPage');
        return (savedPage as Page) || 'home';
    });
    const [cart, setCart] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [wishlist, setWishlist] = useState<number[]>(() => {
        const savedWishlist = localStorage.getItem('wishlist');
        return savedWishlist ? JSON.parse(savedWishlist) : [];
    });
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('currentUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [allOrderHistories, setAllOrderHistories] = useState<Record<string, Order[]>>(() => {
        const saved = localStorage.getItem('allOrderHistories');
        return saved ? JSON.parse(saved) : {};
    });
    const [passwordResetInfo, setPasswordResetInfo] = useState<{ email: string; token: string } | null>(null);
    const [verificationInfo, setVerificationInfo] = useState<{ email: string; token: string } | null>(null);
    const [toasts, setToasts] = useState<Toast[]>([]);

    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined' && localStorage.theme) {
            return localStorage.theme;
        }
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });
    const [isLoading, setIsLoading] = useState(true);

    // --- Search State ---
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

    const orderHistory = useMemo(() => {
        if (!currentUser) return [];
        return allOrderHistories[currentUser.email] || [];
    }, [currentUser, allOrderHistories]);

    // --- Toast Management ---
    const addToast = useCallback((message: string, type: Toast['type']) => {
        const id = Date.now();
        setToasts(prevToasts => [...prevToasts, { id, message, type }]);
        setTimeout(() => {
            removeToast(id);
        }, 5000);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, []);


    // --- Persist State to localStorage ---
    useEffect(() => { localStorage.setItem('currentPage', currentPage); }, [currentPage]);
    useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);
    useEffect(() => { localStorage.setItem('wishlist', JSON.stringify(wishlist)); }, [wishlist]);
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('currentUser');
        }
    }, [currentUser]);
    useEffect(() => {
        localStorage.setItem('allOrderHistories', JSON.stringify(allOrderHistories));
    }, [allOrderHistories]);


    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    useEffect(() => {
        const loadProducts = async () => {
            setIsLoading(true);
            const fetchedProducts = await api.fetchProducts();
            setProducts(fetchedProducts);
            setIsLoading(false);
        };
        loadProducts();
    }, []);
    
    // Debounce search query
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    const searchResults = useMemo(() => {
        if (debouncedSearchQuery.trim() === '') {
            return [];
        }
        return products.filter(product =>
            product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        ).slice(0, 5); // Limit to 5 results
    }, [debouncedSearchQuery, products]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };


    const handleLogin = useCallback(async (email: string, password: string): Promise<{ success: boolean; message: string; }> => {
        const result = await api.login(email, password);
        if (result.success && result.user) {
            setCurrentUser(result.user);
            setCurrentPage('home');
            addToast(`¡Bienvenido de nuevo, ${result.user.name.split(' ')[0]}!`, 'success');
        }
        return { success: result.success, message: result.message };
    }, [addToast]);

    const handleRegister = useCallback(async (name: string, email: string, password: string, phone: string): Promise<boolean> => {
        const result = await api.register(name, email, password, phone);
        if (result.success && result.user && result.verificationToken) {
            await api.sendVerificationEmail(email, name, result.verificationToken);
            addToast(`Se ha enviado un correo de verificación a ${email}.`, 'info');
            setVerificationInfo({ email: result.user.email, token: result.verificationToken });
            setCurrentPage('verification');
            return true;
        } else {
            addToast(result.message, 'error');
            return false;
        }
    }, [addToast]);

    const handleLogout = useCallback(() => {
        setCurrentUser(null);
        setCart([]);
        setWishlist([]);
        setCurrentPage('home');
        addToast('Has cerrado sesión exitosamente.', 'info');
    }, [addToast]);

    const handleNavigateToResetPassword = useCallback((email: string, token: string) => {
        setPasswordResetInfo({ email, token });
        setCurrentPage('resetPassword');
    }, []);
    
    const handleResetPassword = useCallback(async (newPassword: string): Promise<{ success: boolean; message: string }> => {
        if (!passwordResetInfo) {
            return { success: false, message: 'No se encontró la información para restablecer la contraseña. Por favor, inténtalo de nuevo.' };
        }
        const result = await api.resetPassword(passwordResetInfo.email, passwordResetInfo.token, newPassword);
        if (result.success) {
            addToast(result.message, 'success');
            setPasswordResetInfo(null);
            setCurrentPage('login');
        }
        return result;
    }, [passwordResetInfo, addToast]);

    const handleVerifyAccount = useCallback(async (token: string, email: string): Promise<{ success: boolean; message: string }> => {
        const result = await api.verifyEmail(token, email);
        if (result.success) {
            setVerificationInfo(null);
        }
        return result;
    }, []);
    
    const handleResendVerification = useCallback(async (email: string) => {
        const result = await api.resendVerificationEmail(email);
        addToast(result.message, 'info');
    }, [addToast]);

    const addToCart = useCallback((product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
        addToast(`${product.name} añadido al carrito`, 'success');
    }, [addToast]);

    const updateCartQuantity = useCallback((productId: number, quantity: number) => {
        setCart(prevCart => {
            if (quantity <= 0) {
                return prevCart.filter(item => item.id !== productId);
            }
            return prevCart.map(item =>
                item.id === productId ? { ...item, quantity } : item
            );
        });
    }, []);

    const removeFromCart = useCallback((productId: number) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    }, []);
    
    const clearCart = useCallback(() => {
        setCart([]);
    }, []);
    
    const handleToggleWishlist = useCallback((productId: number) => {
        setWishlist(prevWishlist => {
            const isInWishlist = prevWishlist.includes(productId);
            if (isInWishlist) {
                addToast('Eliminado de la lista de deseos', 'info');
                return prevWishlist.filter(id => id !== productId);
            }
            addToast('Añadido a la lista de deseos', 'success');
            return [...prevWishlist, productId];
        });
    }, [addToast]);

    const handleCheckout = useCallback((
        items: CartItem[], 
        total: number, 
        shippingAddress: Address,
        paymentMethod: PaymentMethod
    ) => {
        if (items.length === 0 || !currentUser) return;
        
        const newOrder: Order = {
            id: `FRESCO-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            items,
            total,
            shippingAddress,
            paymentMethod,
            date: new Date().toISOString().split('T')[0],
            status: 'Procesando'
        };
        
        setConfirmedOrder(newOrder);
        setAllOrderHistories(prev => {
            const userHistory = prev[currentUser.email] || [];
            return {
                ...prev,
                [currentUser.email]: [...userHistory, newOrder]
            };
        });
        clearCart();
        setCurrentPage('confirmation');
    }, [clearCart, currentUser]);
    
    const handleViewDetails = useCallback((product: Product) => {
        setSelectedProduct(product);
        setCurrentPage('productDetail');
    }, []);
    
    const handleSearchResultSelect = useCallback((product: Product) => {
        handleViewDetails(product);
        setSearchQuery('');
    }, [handleViewDetails]);

    const handleSubmitReview = useCallback(async (productId: number, review: { rating: number; comment: string }) => {
        if (!currentUser) {
            addToast("Debes iniciar sesión para dejar una reseña.", 'error');
            return;
        }
        const updatedProduct = await api.submitReview(productId, currentUser.name, review);
        if(updatedProduct) {
             setProducts(prevProducts => prevProducts.map(p => p.id === productId ? updatedProduct : p));
             setSelectedProduct(updatedProduct);
             addToast('¡Gracias por tu reseña!', 'success');
        }
    }, [currentUser, addToast]);

    const handleUpdateUser = useCallback(async (currentEmail: string, newName: string, newEmail: string, newPhone: string, currentPassword?: string, newPassword?: string): Promise<{ success: boolean; message: string }> => {
        const result = await api.updateUser(currentEmail, newName, newEmail, newPhone, currentPassword, newPassword);
        if (result.success && result.user) {
            setCurrentUser(result.user);
            addToast(result.message, 'success');
        } else {
            addToast(result.message, 'error');
        }
        return { success: result.success, message: result.message };
    }, [addToast]);

    const handleAddAddress = useCallback(async (addressData: Omit<Address, 'id'>) => {
        if (!currentUser) return;
        const updatedUser = await api.addAddress(currentUser.email, addressData);
        if (updatedUser) {
            setCurrentUser(updatedUser);
            addToast('Dirección añadida con éxito.', 'success');
        }
    }, [currentUser, addToast]);

    const handleUpdateAddress = useCallback(async (address: Address) => {
        if (!currentUser) return;
        const updatedUser = await api.updateAddress(currentUser.email, address);
        if (updatedUser) {
            setCurrentUser(updatedUser);
            addToast('Dirección actualizada con éxito.', 'success');
        }
    }, [currentUser, addToast]);

    const handleDeleteAddress = useCallback(async (addressId: number) => {
        if (!currentUser) return;
        const updatedUser = await api.deleteAddress(currentUser.email, addressId);
        if (updatedUser) {
            setCurrentUser(updatedUser);
            addToast('Dirección eliminada con éxito.', 'success');
        }
    }, [currentUser, addToast]);

    const handleAddPaymentMethod = useCallback(async (paymentData: Omit<PaymentMethod, 'id'>) => {
         if (!currentUser) return;
         const updatedUser = await api.addPaymentMethod(currentUser.email, paymentData);
         if (updatedUser) {
             setCurrentUser(updatedUser);
             addToast('Método de pago añadido con éxito.', 'success');
         }
    }, [currentUser, addToast]);

    const handleDeletePaymentMethod = useCallback(async (paymentMethodId: number) => {
        if (!currentUser) return;
        const updatedUser = await api.deletePaymentMethod(currentUser.email, paymentMethodId);
        if (updatedUser) {
             setCurrentUser(updatedUser);
             addToast('Método de pago eliminado con éxito.', 'success');
        }
    }, [currentUser, addToast]);

    const handleDeleteAccount = useCallback(async (email: string) => {
        const result = await api.deleteAccount(email);
        if (result) {
            setAllOrderHistories(prev => {
                const newHistories = { ...prev };
                delete newHistories[email];
                return newHistories;
            });
            handleLogout();
            addToast('Tu cuenta y todos tus datos asociados han sido eliminados exitosamente.', 'success');
            return true;
        }
        addToast('No se pudo encontrar la cuenta para eliminar.', 'error');
        return false;
    }, [handleLogout, setAllOrderHistories, addToast]);

    const handleEmailOrder = useCallback(async (order: Order) => {
        if (!currentUser) {
            addToast("Debes iniciar sesión para realizar esta acción.", 'error');
            return;
        }
        await api.sendOrderEmail(currentUser.email, order);
        addToast(`Se ha enviado un recibo del pedido #${order.id} a tu correo electrónico.`, 'info');
    }, [currentUser, addToast]);

    const cartItemCount = useMemo(() => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }, [cart]);

    const renderPage = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                </div>
            );
        }
        switch (currentPage) {
            case 'home':
                return <HomePage products={products} onAddToCart={addToCart} onViewDetails={handleViewDetails} />;
            case 'catalog':
                return <CatalogPage products={products} onAddToCart={addToCart} onViewDetails={handleViewDetails} />;
            case 'cart':
                return <CartPage 
                    cartItems={cart} 
                    onUpdateQuantity={updateCartQuantity} 
                    onRemoveFromCart={removeFromCart} 
                    onNavigateToCheckout={() => {
                        if (currentUser) {
                            setCurrentPage('checkout');
                        } else {
                            addToast('Debes iniciar sesión para proceder al pago.', 'info');
                            setCurrentPage('login');
                        }
                    }}
                />;
            case 'checkout':
                const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
                return <CheckoutPage
                    cartItems={cart}
                    subtotal={subtotal}
                    currentUser={currentUser}
                    onCheckout={handleCheckout}
                    onBackToCart={() => setCurrentPage('cart')}
                />;
            case 'login':
                return <LoginPage onLogin={handleLogin} onNavigateToRegister={() => setCurrentPage('register')} onNavigateToForgotPassword={() => setCurrentPage('forgotPassword')} onResendVerificationRequest={handleResendVerification} />;
            case 'register':
                return <RegisterPage onRegister={handleRegister} onNavigateToLogin={() => setCurrentPage('login')} />;
            case 'verification':
                 if (!verificationInfo) {
                     return <LoginPage onLogin={handleLogin} onNavigateToRegister={() => setCurrentPage('register')} onNavigateToForgotPassword={() => setCurrentPage('forgotPassword')} onResendVerificationRequest={handleResendVerification}/>;
                 }
                 return <VerificationPage 
                     email={verificationInfo.email} 
                     token={verificationInfo.token}
                     onVerify={handleVerifyAccount}
                     onNavigateToLogin={() => setCurrentPage('login')}
                     onResendVerification={handleResendVerification}
                 />;
            case 'forgotPassword':
                return <ForgotPasswordPage onNavigateToLogin={() => setCurrentPage('login')} onNavigateToResetPassword={handleNavigateToResetPassword} />;
             case 'resetPassword':
                return <ResetPasswordPage onResetPassword={handleResetPassword} onNavigateToLogin={() => setCurrentPage('login')} />;
            case 'confirmation':
                return confirmedOrder ? <ConfirmationPage order={confirmedOrder} onGoHome={() => setCurrentPage('home')} /> : <HomePage products={products} onAddToCart={addToCart} onViewDetails={handleViewDetails} />;
            case 'productDetail':
                return selectedProduct ? <ProductDetailPage product={selectedProduct} allProducts={products} onAddToCart={addToCart} onBack={() => setCurrentPage('catalog')} currentUser={currentUser} onSubmitReview={handleSubmitReview} onViewDetails={handleViewDetails} wishlist={wishlist} onToggleWishlist={handleToggleWishlist} /> : <CatalogPage products={products} onAddToCart={addToCart} onViewDetails={handleViewDetails} />;
            case 'wishlist':
                 const wishlistProducts = products.filter(p => wishlist.includes(p.id));
                 return <WishlistPage products={wishlistProducts} onToggleWishlist={handleToggleWishlist} onAddToCart={addToCart} onViewDetails={handleViewDetails} />;
            case 'contact':
                return <ContactPage />;
            case 'account':
                if (!currentUser) {
                    return <LoginPage onLogin={handleLogin} onNavigateToRegister={() => setCurrentPage('register')} onNavigateToForgotPassword={() => setCurrentPage('forgotPassword')} onResendVerificationRequest={handleResendVerification} />;
                }
                return <AccountPage 
                    user={currentUser}
                    orderHistory={orderHistory}
                    onUpdateUser={handleUpdateUser}
                    onAddAddress={handleAddAddress}
                    onUpdateAddress={handleUpdateAddress}
                    onDeleteAddress={handleDeleteAddress}
                    onAddPaymentMethod={handleAddPaymentMethod}
                    onDeletePaymentMethod={handleDeletePaymentMethod}
                    onDeleteAccount={handleDeleteAccount}
                    onLogout={handleLogout}
                    onEmailOrder={handleEmailOrder}
                    addToast={addToast}
                />;
            default:
                return <HomePage products={products} onAddToCart={addToCart} onViewDetails={handleViewDetails} />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen font-sans">
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            <Header 
                setCurrentPage={setCurrentPage} 
                cartItemCount={cartItemCount} 
                wishlistItemCount={wishlist.length} 
                currentUser={currentUser} 
                onLogout={handleLogout} 
                theme={theme} 
                toggleTheme={toggleTheme}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchResults={searchResults}
                onSearchResultSelect={handleSearchResultSelect}
            />
            <main className="flex-grow container mx-auto px-2 sm:px-4 py-8">
                {renderPage()}
            </main>
            <Footer />
        </div>
    );
};

export default App;
