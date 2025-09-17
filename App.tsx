
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
import { MOCK_PRODUCTS } from './constants';

// Mock user data for simulation
const mockUsers: (User & { password: string; addresses?: Address[]; paymentMethods?: PaymentMethod[] })[] = [
    { 
        name: 'Usuario Ejemplo', 
        email: 'user@example.com', 
        phone: '+51 987 654 321',
        password: 'Password123',
        addresses: [
            { id: 1, street: 'Calle Falsa 123', city: 'Ciudad Capital', state: 'Provincia Central', postalCode: '12345', country: 'País Ficticio' },
            { id: 2, street: 'Avenida Siempre Viva 742', city: 'Villa Ejemplo', state: 'Estado Modelo', postalCode: '54321', country: 'País Ficticio' },
        ],
        paymentMethods: [
            { id: 1, cardType: 'visa', last4: '1234', expiryDate: '12/25' },
            { id: 2, cardType: 'mastercard', last4: '5678', expiryDate: '08/26' }
        ]
    }
];

/**
 * Simulates sending a welcome email to a new user.
 * In a real application, this would make an API call to a backend service.
 * @param email The recipient's email address.
 * @param name The recipient's name.
 */
const sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
    console.log(`Simulating sending welcome email to ${email}...`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    const emailContent = `
    -----------------------------------------
    To: ${email}
    From: no-reply@abarrotesfresco.com
    Subject: ¡Bienvenido a Abarrotes Fresco!

    Hola ${name},

    ¡Gracias por registrarte en Abarrotes Fresco! Estamos muy contentos de tenerte con nosotros.
    Explora nuestro catálogo y descubre la frescura y calidad que tenemos para ofrecerte.

    ¡Felices compras!

    El equipo de Abarrotes Fresco
    -----------------------------------------
    `;

    console.log("Email content:");
    console.log(emailContent.trim());
    console.log(`Welcome email successfully "sent" to ${name} <${email}>.`);
};


const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [wishlist, setWishlist] = useState<number[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
    const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [orderHistory, setOrderHistory] = useState<Order[]>([]);
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined' && localStorage.theme) {
            return localStorage.theme;
        }
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };


    const handleLogin = useCallback((email: string, password: string): boolean => {
        const user = mockUsers.find(u => u.email === email && u.password === password);
        if (user) {
            setCurrentUser({ name: user.name, email: user.email, phone: user.phone, addresses: user.addresses || [], paymentMethods: user.paymentMethods || [] });
            setCurrentPage('home');
            return true;
        }
        alert('Credenciales incorrectas.');
        return false;
    }, []);

    const handleRegister = useCallback(async (name: string, email: string, password: string, phone: string): Promise<boolean> => {
        if (mockUsers.some(u => u.email === email)) {
            alert('Este correo electrónico ya está registrado.');
            return false;
        }
        const newUser = { name, email, password, phone: `+51 ${phone}`, addresses: [], paymentMethods: [] };
        mockUsers.push(newUser);
        setCurrentUser({ name, email, phone: `+51 ${phone}`, addresses: [], paymentMethods: [] });
        
        await sendWelcomeEmail(email, name);

        setCurrentPage('home');
        alert('¡Registro exitoso! Has iniciado sesión y se ha enviado un correo de bienvenida.');
        return true;
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
        if (items.length === 0) return;
        
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
        setOrderHistory(prev => [...prev, newOrder]);
        clearCart();
        setCurrentPage('confirmation');
    }, [clearCart]);
    
    const handleViewDetails = useCallback((product: Product) => {
        setSelectedProduct(product);
        setCurrentPage('productDetail');
    }, []);

    const handleSubmitReview = useCallback((productId: number, review: { rating: number; comment: string }) => {
        if (!currentUser) {
            alert("Debes iniciar sesión para dejar una reseña.");
            return;
        }

        const updatedProducts = products.map(p => {
            if (p.id === productId) {
                const newReview: Review = {
                    id: Date.now(),
                    author: currentUser.name,
                    rating: review.rating,
                    comment: review.comment,
                };
                const updatedReviews = [...p.reviews, newReview];
                const newAverageRating = updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length;
                
                const updatedProduct = {
                    ...p,
                    reviews: updatedReviews,
                    rating: newAverageRating,
                };
                setSelectedProduct(updatedProduct);
                return updatedProduct;
            }
            return p;
        });
        setProducts(updatedProducts);

    }, [currentUser, products]);

    const handleUpdateUser = useCallback((currentEmail: string, newName: string, newEmail: string, newPhone: string, currentPassword?: string, newPassword?: string): { success: boolean; message: string } => {
        const userIndex = mockUsers.findIndex(u => u.email === currentEmail);
        if (userIndex === -1) {
            return { success: false, message: 'Usuario no encontrado.' };
        }
        const user = mockUsers[userIndex];
        if (newPassword) {
            if (!currentPassword || user.password !== currentPassword) {
                return { success: false, message: 'La contraseña actual es incorrecta.' };
            }
            user.password = newPassword;
        }
        if (newEmail !== currentEmail && mockUsers.some(u => u.email === newEmail)) {
            return { success: false, message: 'El nuevo correo electrónico ya está en uso.' };
        }
        user.name = newName;
        user.email = newEmail;
        user.phone = newPhone;
        mockUsers[userIndex] = user;
        setCurrentUser(prevUser => prevUser ? { ...prevUser, name: newName, email: newEmail, phone: newPhone } : null);
        return { success: true, message: 'Perfil actualizado con éxito.' };
    }, []);

    const handleAddAddress = useCallback((addressData: Omit<Address, 'id'>) => {
        if (!currentUser) return;
        const newAddress: Address = { ...addressData, id: Date.now() };
        const updatedAddresses = [...(currentUser.addresses || []), newAddress];
        const updatedUser = { ...currentUser, addresses: updatedAddresses };
        setCurrentUser(updatedUser);
        const userIndex = mockUsers.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            mockUsers[userIndex].addresses = updatedAddresses;
        }
    }, [currentUser]);

    const handleUpdateAddress = useCallback((address: Address) => {
        if (!currentUser) return;
        const updatedAddresses = (currentUser.addresses || []).map(a => a.id === address.id ? address : a);
        const updatedUser = { ...currentUser, addresses: updatedAddresses };
        setCurrentUser(updatedUser);
        const userIndex = mockUsers.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            mockUsers[userIndex].addresses = updatedAddresses;
        }
    }, [currentUser]);

    const handleDeleteAddress = useCallback((addressId: number) => {
        if (!currentUser) return;
        const updatedAddresses = (currentUser.addresses || []).filter(a => a.id !== addressId);
        const updatedUser = { ...currentUser, addresses: updatedAddresses };
        setCurrentUser(updatedUser);
        const userIndex = mockUsers.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            mockUsers[userIndex].addresses = updatedAddresses;
        }
    }, [currentUser]);

    const handleAddPaymentMethod = useCallback((paymentData: Omit<PaymentMethod, 'id'>) => {
         if (!currentUser) return;
         const newPaymentMethod: PaymentMethod = { ...paymentData, id: Date.now() };
         const updatedPaymentMethods = [...(currentUser.paymentMethods || []), newPaymentMethod];
         const updatedUser = { ...currentUser, paymentMethods: updatedPaymentMethods };
         setCurrentUser(updatedUser);
         const userIndex = mockUsers.findIndex(u => u.email === currentUser.email);
         if (userIndex !== -1) {
            mockUsers[userIndex].paymentMethods = updatedPaymentMethods;
         }
    }, [currentUser]);

    const handleDeletePaymentMethod = useCallback((paymentMethodId: number) => {
        if (!currentUser) return;
        const updatedPaymentMethods = (currentUser.paymentMethods || []).filter(p => p.id !== paymentMethodId);
        const updatedUser = { ...currentUser, paymentMethods: updatedPaymentMethods };
        setCurrentUser(updatedUser);
        const userIndex = mockUsers.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            mockUsers[userIndex].paymentMethods = updatedPaymentMethods;
        }
    }, [currentUser]);

    const handleDeleteAccount = useCallback((email: string) => {
        const userIndex = mockUsers.findIndex(u => u.email === email);
        if (userIndex > -1) {
            mockUsers.splice(userIndex, 1);
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
