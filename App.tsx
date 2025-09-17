
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
import { Page, CartItem, Product, User, Order, Review, Address, PaymentMethod } from './types';
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

    const orderHistory = useMemo(() => {
        if (!currentUser) return [];
        return allOrderHistories[currentUser.email] || [];
    }, [currentUser, allOrderHistories]);

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

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };


    const handleLogin = useCallback(async (email: string, password: string): Promise<boolean> => {
        const user = await api.login(email, password);
        if (user) {
            setCurrentUser(user);
            setCurrentPage('home');
            return true;
        }
        alert('Credenciales incorrectas.');
        return false;
    }, []);

    const handleRegister = useCallback(async (name: string, email: string, password: string, phone: string): Promise<boolean> => {
        const result = await api.register(name, email, password, phone);
        if (result.success && result.user) {
            setCurrentUser(result.user);
            await api.sendWelcomeEmail(email, name);
            setCurrentPage('home');
            alert('¡Registro exitoso! Has iniciado sesión y se ha enviado un correo de bienvenida.');
            return true;
        } else {
            alert(result.message);
            return false;
        }
    }, []);

    const handleLogout = useCallback(() => {
        setCurrentUser(null);
        setCurrentPage('home');
    }, []);

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
    }, []);

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
            if (prevWishlist.includes(productId)) {
                return prevWishlist.filter(id => id !== productId);
            }
            return [...prevWishlist, productId];
        });
    }, []);

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

    const handleSubmitReview = useCallback(async (productId: number, review: { rating: number; comment: string }) => {
        if (!currentUser) {
            alert("Debes iniciar sesión para dejar una reseña.");
            return;
        }
        const updatedProduct = await api.submitReview(productId, currentUser.name, review);
        if(updatedProduct) {
             setProducts(prevProducts => prevProducts.map(p => p.id === productId ? updatedProduct : p));
             setSelectedProduct(updatedProduct);
        }
    }, [currentUser]);

    const handleUpdateUser = useCallback(async (currentEmail: string, newName: string, newEmail: string, newPhone: string, currentPassword?: string, newPassword?: string): Promise<{ success: boolean; message: string }> => {
        const result = await api.updateUser(currentEmail, newName, newEmail, newPhone, currentPassword, newPassword);
        if (result.success && result.user) {
            setCurrentUser(result.user);
        }
        return { success: result.success, message: result.message };
    }, []);

    const handleAddAddress = useCallback(async (addressData: Omit<Address, 'id'>) => {
        if (!currentUser) return;
        const updatedUser = await api.addAddress(currentUser.email, addressData);
        if (updatedUser) {
            setCurrentUser(updatedUser);
        }
    }, [currentUser]);

    const handleUpdateAddress = useCallback(async (address: Address) => {
        if (!currentUser) return;
        const updatedUser = await api.updateAddress(currentUser.email, address);
        if (updatedUser) {
            setCurrentUser(updatedUser);
        }
    }, [currentUser]);

    const handleDeleteAddress = useCallback(async (addressId: number) => {
        if (!currentUser) return;
        const updatedUser = await api.deleteAddress(currentUser.email, addressId);
        if (updatedUser) {
            setCurrentUser(updatedUser);
        }
    }, [currentUser]);

    const handleAddPaymentMethod = useCallback(async (paymentData: Omit<PaymentMethod, 'id'>) => {
         if (!currentUser) return;
         const updatedUser = await api.addPaymentMethod(currentUser.email, paymentData);
         if (updatedUser) {
             setCurrentUser(updatedUser);
         }
    }, [currentUser]);

    const handleDeletePaymentMethod = useCallback(async (paymentMethodId: number) => {
        if (!currentUser) return;
        const updatedUser = await api.deletePaymentMethod(currentUser.email, paymentMethodId);
        if (updatedUser) {
             setCurrentUser(updatedUser);
        }
    }, [currentUser]);

    const handleDeleteAccount = useCallback(async (email: string) => {
        const result = await api.deleteAccount(email);
        if (result) {
            handleLogout();
            alert('Tu cuenta ha sido eliminada exitosamente.');
            return true;
        }
        alert('No se pudo encontrar la cuenta para eliminar.');
        return false;
    }, [handleLogout]);


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
                return <LoginPage onLogin={handleLogin} onNavigateToRegister={() => setCurrentPage('register')} onNavigateToForgotPassword={() => setCurrentPage('forgotPassword')} />;
            case 'register':
                return <RegisterPage onRegister={handleRegister} onNavigateToLogin={() => setCurrentPage('login')} />;
            case 'forgotPassword':
                return <ForgotPasswordPage onNavigateToLogin={() => setCurrentPage('login')} />;
            case 'confirmation':
                return confirmedOrder ? <ConfirmationPage order={confirmedOrder} onGoHome={() => setCurrentPage('home')} /> : <HomePage products={products} onAddToCart={addToCart} onViewDetails={handleViewDetails} />;
            case 'productDetail':
                return selectedProduct ? <ProductDetailPage product={selectedProduct} allProducts={products} onAddToCart={addToCart} onBack={() => setCurrentPage('catalog')} currentUser={currentUser} onSubmitReview={handleSubmitReview} onViewDetails={handleViewDetails} wishlist={wishlist} onToggleWishlist={handleToggleWishlist} /> : <CatalogPage products={products} onAddToCart={addToCart} onViewDetails={handleViewDetails} />;
            case 'wishlist':
                 const wishlistProducts = products.filter(p => wishlist.includes(p.id));
                 return <WishlistPage products={wishlistProducts} onToggleWishlist={handleToggleWishlist} onAddToCart={addToCart} onViewDetails={handleViewDetails} />;
            case 'account':
                if (!currentUser) {
                    return <LoginPage onLogin={handleLogin} onNavigateToRegister={() => setCurrentPage('register')} onNavigateToForgotPassword={() => setCurrentPage('forgotPassword')} />;
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
                />;
            default:
                return <HomePage products={products} onAddToCart={addToCart} onViewDetails={handleViewDetails} />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen font-sans">
            <Header setCurrentPage={setCurrentPage} cartItemCount={cartItemCount} wishlistItemCount={wishlist.length} currentUser={currentUser} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />
            <main className="flex-grow container mx-auto px-2 sm:px-4 py-8">
                {renderPage()}
            </main>
            <Footer />
        </div>
    );
};

export default App;
