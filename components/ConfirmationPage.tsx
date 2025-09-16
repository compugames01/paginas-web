
import React from 'react';
import type { Order } from '../types';

interface ConfirmationPageProps {
    order: Order;
    onGoHome: () => void;
}

const SuccessIcon = () => (
    <svg className="w-16 h-16 text-primary mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ order, onGoHome }) => {
    return (
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center">
            <SuccessIcon />
            <h1 className="text-4xl font-extrabold text-text-primary dark:text-gray-100 mt-4">¡Gracias por tu compra!</h1>
            <p className="text-text-secondary dark:text-gray-400 mt-2">Tu pedido ha sido confirmado y está siendo preparado.</p>
            
            <div className="text-left bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg my-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-text-primary dark:text-gray-100 mb-4">Resumen del Pedido</h2>
                <div className="border-b dark:border-gray-700 pb-4 mb-4">
                    <p className="text-sm font-semibold text-text-secondary dark:text-gray-400">NÚMERO DE PEDIDO: <span className="text-text-primary dark:text-gray-200 font-mono">{order.id}</span></p>
                    <p className="text-sm text-text-secondary dark:text-gray-400">FECHA: <span className="text-text-primary dark:text-gray-200">{order.date}</span></p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                     <div>
                        <h3 className="font-bold text-text-primary dark:text-gray-200">Dirección de Envío</h3>
                        <address className="not-italic text-text-secondary dark:text-gray-400 text-sm">
                            {order.shippingAddress.street}<br/>
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br/>
                            {order.shippingAddress.country}
                        </address>
                    </div>
                     <div>
                        <h3 className="font-bold text-text-primary dark:text-gray-200">Método de Pago</h3>
                        <p className="text-text-secondary dark:text-gray-400 text-sm">
                            {order.paymentMethod.cardType.charAt(0).toUpperCase() + order.paymentMethod.cardType.slice(1)} terminada en **** {order.paymentMethod.last4}
                        </p>
                    </div>
                </div>
                
                <div className="space-y-4">
                    {order.items.map(item => (
                        <div key={item.id} className="flex justify-between items-center border-b dark:border-gray-700 pb-2">
                            <div>
                                <p className="font-bold text-text-primary dark:text-gray-200">{item.name}</p>
                                <p className="text-sm text-text-secondary dark:text-gray-400">
                                    {item.quantity} x ${item.price.toFixed(2)}
                                </p>
                            </div>
                            <p className="font-semibold text-text-primary dark:text-gray-200">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                </div>
                
                {order.notes && (
                    <div className="mt-6 pt-4 border-t dark:border-gray-700">
                        <h3 className="font-bold text-text-primary dark:text-gray-200">Notas Especiales:</h3>
                        <p className="text-text-secondary dark:text-gray-400 mt-1 whitespace-pre-wrap">{order.notes}</p>
                    </div>
                )}
                
                <div className="flex justify-end items-center mt-6 pt-4 border-t-2 border-dashed dark:border-gray-600">
                    <span className="text-xl font-medium text-text-secondary dark:text-gray-400">Total:</span>
                    <span className="text-2xl font-bold text-text-primary dark:text-white ml-4">${order.total.toFixed(2)}</span>
                </div>
            </div>

            <button
                onClick={onGoHome}
                className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
                Seguir Comprando
            </button>
        </div>
    );
};

export default ConfirmationPage;