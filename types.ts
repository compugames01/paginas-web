export type Page = 'home' | 'catalog' | 'cart' | 'login' | 'register' | 'confirmation' | 'productDetail' | 'wishlist' | 'checkout' | 'account';

export interface Address {
    id: number;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export interface PaymentMethod {
    id: number;
    cardType: 'visa' | 'mastercard';
    last4: string;
    expiryDate: string;
}

export interface User {
    name: string;
    email: string;
    phone?: string;
    addresses?: Address[];
    paymentMethods?: PaymentMethod[];
}

export interface Review {
    id: number;
    author: string;
    rating: number;
    comment: string;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    category: 'Frutas y Verduras' | 'Lácteos y Huevos' | 'Carnes y Pescados' | 'Panadería' | 'Despensa';
    tags?: ('destacado' | 'oferta' | 'nuevo')[];
    description: string;
    rating: number;
    reviews: Review[];
}

export interface CartItem extends Product {
    quantity: number;
}

export interface Order {
    id: string;
    items: CartItem[];
    total: number;
    notes?: string;
    date: string;
    status: 'Procesando' | 'Enviado' | 'Entregado' | 'Cancelado';
    shippingAddress: Address;
    paymentMethod: PaymentMethod;
}