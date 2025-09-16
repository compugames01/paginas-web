import React, { useMemo } from 'react';
import type { CartItem } from '../types';

interface CartPageProps {
    cartItems: CartItem[];
    onUpdateQuantity: (productId: number, quantity: number) => void;
    onRemoveFromCart: (productId: number) => void;
    onNavigateToCheckout: () => void;
}

const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);

const CartPage: React.FC<CartPageProps> = ({ cartItems, onUpdateQuantity, onRemoveFromCart, onNavigateToCheckout }) => {
    const subtotal = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cartItems]);

    if (cartItems.length === 0) {
        return (
            <div className="text-center py-20">
                <h1 className="text-4xl font-bold text-text-primary dark:text-gray-100 mb-4">Tu carrito está vacío</h1>
                <p className="text-text-secondary dark:text-gray-400">Parece que aún no has añadido ningún producto.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-lg shadow-xl max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary dark:text-gray-100 mb-6 border-b dark:border-gray-700 pb-4">
                Tu Carrito de Compras
            </h1>
            <div className="space-y-6">
                {cartItems.map(item => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border dark:border-gray-700 rounded-lg">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                            <div>
                                <h2 className="font-bold text-lg text-text-primary dark:text-gray-200">{item.name}</h2>
                                <p className="text-sm text-text-secondary dark:text-gray-400">${item.price.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value, 10))}
                                className="w-20 p-2 border border-gray-300 rounded-md text-center dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            <p className="font-semibold w-24 text-right text-lg dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
                            <button onClick={() => onRemoveFromCart(item.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
                                <TrashIcon />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t dark:border-gray-700">
                <div className="flex justify-end items-center mb-4">
                    <span className="text-xl font-medium text-text-secondary dark:text-gray-400">Subtotal:</span>
                    <span className="text-2xl font-bold text-text-primary dark:text-white ml-4">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-end">
                    <button onClick={onNavigateToCheckout} className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                        Proceder al Pago
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
