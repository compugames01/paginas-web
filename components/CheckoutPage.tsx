import React, { useState, useMemo } from 'react';
import type { CartItem, User, Address, PaymentMethod } from '../types';

interface CheckoutPageProps {
    cartItems: CartItem[];
    subtotal: number;
    currentUser: User | null;
    onCheckout: (items: CartItem[], total: number, shippingAddress: Address, paymentMethod: PaymentMethod) => void;
    onBackToCart: () => void;
}

const VisaIcon = () => (<svg className="w-8 h-auto" viewBox="0 0 38 23"><path d="M35 0H3C1.3 0 0 1.3 0 3v17c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#1A1F71"/><path d="M12.9 6.8c-.3-.3-.7-.4-1.2-.4H8.2c-.5 0-.9.2-1.2.5-.3.3-.4.7-.4 1.1 0 .5.2.9.5 1.2.3.3.7.4 1.1.4h1.9c.4 0 .8-.2 1.1-.4.3-.3.4-.6.4-1s-.2-.8-.5-1.1zM11.5 16V6.2h2.2l1.9 6.8c.1.3.2.7.3 1.1.1-.4.2-.8.3-1.1l1.9-6.8h2.2V16h-2V8.7c0-.4-.1-.8-.1-1.2 0-.4-.1-.8-.1-1.2l-1.7 6.3h-1.5L13.6 6.3c0 .4-.1.8-.1 1.2 0 .4-.1.8-.1 1.2V16h-2z" fill="#fff"/></svg>);
const MastercardIcon = () => (<svg className="w-8 h-auto" viewBox="0 0 38 23"><path d="M35 0H3C1.3 0 0 1.3 0 3v17c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#222"/><circle cx="15" cy="11.5" r="5" fill="#EB001B"/><circle cx="23" cy="11.5" r="5" fill="#F79E1B"/><path d="M20 11.5a5.8 5.8 0 01-5 5.7 5.8 5.8 0 000-11.4 5.8 5.8 0 005 5.7z" fill="#FF5F00"/></svg>);

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cartItems, subtotal, currentUser, onCheckout, onBackToCart }) => {
    const [email, setEmail] = useState(currentUser?.email || '');
    const [card, setCard] = useState({ number: '', expiry: '', cvc: '', name: currentUser?.name || '' });
    const [address, setAddress] = useState({
        country: 'Peru',
        line1: '',
        line2: '',
        district: '',
        postalCode: '',
    });
    
    const tax = 0; // As per image
    const total = useMemo(() => subtotal + tax, [subtotal, tax]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (!email || !card.number || !card.expiry || !card.cvc || !card.name || !address.line1 || !address.district || !address.postalCode) {
            alert('Por favor, complete todos los campos requeridos.');
            return;
        }

        const rawCardNumber = card.number.replace(/\s/g, '');
        let cardType: 'visa' | 'mastercard' = 'visa'; // Default
        if (rawCardNumber.startsWith('4')) { cardType = 'visa'; }
        else if (rawCardNumber.startsWith('5')) { cardType = 'mastercard'; }
        
        const shippingAddress: Address = {
            id: Date.now(),
            street: address.line1 + (address.line2 ? ` ${address.line2}` : ''),
            city: address.district,
            state: '', // The form doesn't have a state field
            postalCode: address.postalCode,
            country: address.country,
        };

        const paymentMethod: PaymentMethod = {
            id: Date.now() + 1,
            cardType: cardType,
            last4: rawCardNumber.slice(-4),
            expiryDate: card.expiry,
        };

        onCheckout(cartItems, total, shippingAddress, paymentMethod);
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = e.target.value.replace(/[^\d]/g, '').substring(0, 16).replace(/(.{4})/g, '$1 ').trim();
        setCard({ ...card, number: formatted });
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/[^\d]/g, '').substring(0, 4);
        if (value.length > 2) {
            value = value.slice(0, 2) + ' / ' + value.slice(2);
        }
        setCard({ ...card, expiry: value });
    };

    const inputClasses = "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200";

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4 py-8">
                 <button onClick={onBackToCart} className="text-primary hover:text-primary-dark font-medium flex items-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Volver al carrito
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Left Column: Order Summary */}
                    <aside className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md order-last md:order-first">
                        <h2 className="text-2xl font-bold text-text-primary dark:text-gray-100 mb-6">Resumen del Pedido</h2>
                        <div className="space-y-4">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                                        <div>
                                            <p className="font-semibold text-text-primary dark:text-gray-200">{item.name}</p>
                                            <p className="text-sm text-text-secondary dark:text-gray-400">Cantidad: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium text-text-primary dark:text-gray-200">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-6 border-t dark:border-gray-700 space-y-2">
                            <div className="flex justify-between text-text-secondary dark:text-gray-300"><p>Subtotal</p><p>${subtotal.toFixed(2)}</p></div>
                            <div className="flex justify-between text-text-secondary dark:text-gray-300"><p>Impuestos</p><p>${tax.toFixed(2)}</p></div>
                            <div className="flex justify-between text-xl font-bold text-text-primary dark:text-white mt-2 pt-2 border-t dark:border-gray-700"><p>Total</p><p>${total.toFixed(2)}</p></div>
                        </div>
                    </aside>
                    {/* Right Column: Payment Form */}
                    <main>
                         <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-text-primary dark:text-gray-100">Información de Contacto</h2>
                                <input type="email" placeholder="Correo electrónico" value={email} onChange={e => setEmail(e.target.value)} required className={inputClasses}/>
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-text-primary dark:text-gray-100">Método de Pago</h2>
                                <div className="relative">
                                    <input type="text" placeholder="Número de la tarjeta" value={card.number} onChange={handleCardNumberChange} required className={`${inputClasses} pl-4`} />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                       <VisaIcon /> <MastercardIcon />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="MM / AA" value={card.expiry} onChange={handleExpiryChange} required className={inputClasses}/>
                                    <input type="text" placeholder="CVC" value={card.cvc} onChange={e => setCard({...card, cvc: e.target.value.replace(/[^\d]/g, '').substring(0, 4)})} required className={inputClasses}/>
                                </div>
                                 <input type="text" placeholder="Nombre completo en la tarjeta" value={card.name} onChange={e => setCard({...card, name: e.target.value})} required className={inputClasses}/>
                            </div>
                             <div className="space-y-4">
                                <h2 className="text-xl font-bold text-text-primary dark:text-gray-100">Dirección de Facturación</h2>
                                <select value={address.country} onChange={e => setAddress({...address, country: e.target.value})} className={inputClasses}>
                                    <option value="Peru">Perú</option>
                                    <option value="Mexico">México</option>
                                    <option value="Colombia">Colombia</option>
                                    <option value="Argentina">Argentina</option>
                                    <option value="United States">Estados Unidos</option>
                                </select>
                                <input type="text" placeholder="Dirección línea 1" value={address.line1} onChange={e => setAddress({...address, line1: e.target.value})} required className={inputClasses}/>
                                <input type="text" placeholder="Dirección línea 2 (opcional)" value={address.line2} onChange={e => setAddress({...address, line2: e.target.value})} className={inputClasses}/>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Distrito" value={address.district} onChange={e => setAddress({...address, district: e.target.value})} required className={inputClasses}/>
                                    <input type="text" placeholder="Código Postal" value={address.postalCode} onChange={e => setAddress({...address, postalCode: e.target.value})} required className={inputClasses}/>
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105 text-lg">
                                Pagar ${total.toFixed(2)}
                            </button>
                         </form>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
