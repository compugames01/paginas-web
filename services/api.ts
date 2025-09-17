
import { MOCK_PRODUCTS, mockUsers as initialUsers } from '../constants';
import { Product, User, Review, Address, PaymentMethod, Order } from '../types';

type MockUserWithPassword = User & { password: string };

// Simulate network delay
const apiDelay = 500;

// =================================
// Data Persistence Layer
// =================================

// Load users from localStorage or initialize from constants
let mockUsers: MockUserWithPassword[] = (() => {
    try {
        const storedUsers = localStorage.getItem('mockUsersDB');
        if (storedUsers) {
            return JSON.parse(storedUsers);
        }
    } catch (error) {
        console.error("Failed to parse mock users from localStorage", error);
    }
    const initialData = JSON.parse(JSON.stringify(initialUsers)); // Deep copy
    localStorage.setItem('mockUsersDB', JSON.stringify(initialData));
    return initialData;
})();

// Helper to save users state to localStorage
const saveUsers = () => {
    try {
        localStorage.setItem('mockUsersDB', JSON.stringify(mockUsers));
    } catch (error) {
        console.error("Failed to save mock users to localStorage", error);
    }
};


// =================================
// Product API
// =================================

export const fetchProducts = (): Promise<Product[]> => {
    console.log("API: Fetching all products...");
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("API: Products fetched successfully.");
            resolve(JSON.parse(JSON.stringify(MOCK_PRODUCTS))); // Deep copy to prevent mutation
        }, apiDelay);
    });
};

export const submitReview = (productId: number, author: string, reviewData: { rating: number, comment: string }): Promise<Product | null> => {
    console.log(`API: Submitting review for product ${productId}...`);
    return new Promise(resolve => {
        setTimeout(() => {
            const product = MOCK_PRODUCTS.find(p => p.id === productId);
            if (product) {
                const newReview: Review = {
                    id: Date.now(),
                    author,
                    rating: reviewData.rating,
                    comment: reviewData.comment,
                };
                product.reviews.push(newReview);
                const newAverageRating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
                product.rating = newAverageRating;
                console.log("API: Review submitted and product updated.");
                resolve(JSON.parse(JSON.stringify(product)));
            } else {
                console.error("API: Product not found for review submission.");
                resolve(null);
            }
        }, apiDelay);
    });
};

// =================================
// User & Auth API
// =================================

export const login = (email: string, password: string): Promise<User | null> => {
    console.log(`API: Attempting login for ${email}...`);
    return new Promise(resolve => {
        setTimeout(() => {
            const user = mockUsers.find(u => u.email === email && u.password === password);
            if (user) {
                console.log("API: Login successful.");
                const { password, ...userWithoutPassword } = user;
                resolve(userWithoutPassword);
            } else {
                console.log("API: Login failed.");
                resolve(null);
            }
        }, apiDelay);
    });
};

export const register = (name: string, email: string, password: string, phone: string): Promise<{ success: boolean, message: string, user: User | null }> => {
    console.log(`API: Attempting registration for ${email}...`);
    return new Promise(resolve => {
        setTimeout(() => {
            if (mockUsers.some(u => u.email === email)) {
                console.log("API: Registration failed, email exists.");
                resolve({ success: false, message: 'Este correo electrónico ya está registrado.', user: null });
                return;
            }
            const newUser: MockUserWithPassword = { name, email, password, phone: `+51 ${phone}`, addresses: [], paymentMethods: [] };
            mockUsers.push(newUser);
            saveUsers();
            const { password: pw, ...userWithoutPassword } = newUser;
            console.log("API: Registration successful.");
            resolve({ success: true, message: 'Registro exitoso.', user: userWithoutPassword });
        }, apiDelay);
    });
};

export const sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
    console.log(`Simulating sending welcome email to ${email}...`);
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

export const sendOrderEmail = (email: string, order: Order): Promise<void> => {
    console.log(`Simulating sending order receipt email to ${email}...`);
    return new Promise(resolve => {
        setTimeout(() => {
            const itemsList = order.items.map(item =>
                `    - ${item.name} (x${item.quantity}): $${(item.price * item.quantity).toFixed(2)}`
            ).join('\n');

            const emailContent = `
-----------------------------------------
To: ${email}
From: no-reply@abarrotesfresco.com
Subject: Recibo de tu pedido #${order.id}

Hola,

Gracias por tu compra. Aquí tienes el resumen de tu pedido:

Número de Pedido: ${order.id}
Fecha: ${order.date}
Total: $${order.total.toFixed(2)}

Artículos:
${itemsList}

Dirección de Envío:
    ${order.shippingAddress.street}
    ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}
    ${order.shippingAddress.country}

Método de Pago:
    ${order.paymentMethod.cardType.charAt(0).toUpperCase() + order.paymentMethod.cardType.slice(1)} terminada en ${order.paymentMethod.last4}

Si tienes alguna pregunta, no dudes en contactarnos.

El equipo de Abarrotes Fresco
-----------------------------------------
            `;
            console.log("Email content:");
            console.log(emailContent.trim());
            console.log(`Order receipt email successfully "sent" for order #${order.id}.`);
            resolve();
        }, apiDelay);
    });
};

export const updateUser = (
    currentEmail: string,
    newName: string,
    newEmail: string,
    newPhone: string,
    currentPassword?: string,
    newPassword?: string
): Promise<{ success: boolean; message: string; user: User | null }> => {
    console.log(`API: Updating profile for ${currentEmail}...`);
    return new Promise(resolve => {
        setTimeout(() => {
            const userIndex = mockUsers.findIndex(u => u.email === currentEmail);
            if (userIndex === -1) {
                resolve({ success: false, message: 'Usuario no encontrado.', user: null });
                return;
            }
            const user = mockUsers[userIndex];
            if (newPassword) {
                if (!currentPassword || user.password !== currentPassword) {
                    resolve({ success: false, message: 'La contraseña actual es incorrecta.', user: null });
                    return;
                }
                user.password = newPassword;
            }
            if (newEmail !== currentEmail && mockUsers.some(u => u.email === newEmail)) {
                resolve({ success: false, message: 'El nuevo correo electrónico ya está en uso.', user: null });
                return;
            }
            user.name = newName;
            user.email = newEmail;
            user.phone = newPhone;
            mockUsers[userIndex] = user;
            saveUsers();

            const { password, ...updatedUser } = user;
            console.log("API: Profile updated successfully.");
            resolve({ success: true, message: 'Perfil actualizado con éxito.', user: updatedUser });
        }, apiDelay);
    });
};

export const deleteAccount = (email: string): Promise<boolean> => {
    console.log(`API: Deleting account for ${email}...`);
    return new Promise(resolve => {
        setTimeout(() => {
            const userIndex = mockUsers.findIndex(u => u.email === email);
            if (userIndex > -1) {
                mockUsers.splice(userIndex, 1);
                saveUsers();
                console.log("API: Account deleted successfully.");
                resolve(true);
            } else {
                console.log("API: Account not found for deletion.");
                resolve(false);
            }
        }, apiDelay);
    });
};


// =================================
// User Data Management API (Address, Payment)
// =================================

const findUserByEmail = (email: string) => {
    const userIndex = mockUsers.findIndex(u => u.email === email);
    if (userIndex !== -1) {
        return { user: mockUsers[userIndex], index: userIndex };
    }
    return null;
};

const sanitizeUser = (user: MockUserWithPassword): User => {
    const { password, ...sanitized } = user;
    return JSON.parse(JSON.stringify(sanitized));
};

export const addAddress = (userEmail: string, addressData: Omit<Address, 'id'>): Promise<User | null> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const result = findUserByEmail(userEmail);
            if (!result) return resolve(null);
            
            const newAddress: Address = { ...addressData, id: Date.now() };
            result.user.addresses = [...(result.user.addresses || []), newAddress];
            mockUsers[result.index] = result.user;
            saveUsers();

            resolve(sanitizeUser(result.user));
        }, apiDelay);
    });
};

export const updateAddress = (userEmail: string, address: Address): Promise<User | null> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const result = findUserByEmail(userEmail);
            if (!result) return resolve(null);

            result.user.addresses = (result.user.addresses || []).map(a => a.id === address.id ? address : a);
            mockUsers[result.index] = result.user;
            saveUsers();

            resolve(sanitizeUser(result.user));
        }, apiDelay);
    });
};

export const deleteAddress = (userEmail: string, addressId: number): Promise<User | null> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const result = findUserByEmail(userEmail);
            if (!result) return resolve(null);

            result.user.addresses = (result.user.addresses || []).filter(a => a.id !== addressId);
            mockUsers[result.index] = result.user;
            saveUsers();

            resolve(sanitizeUser(result.user));
        }, apiDelay);
    });
};

export const addPaymentMethod = (userEmail: string, paymentData: Omit<PaymentMethod, 'id'>): Promise<User | null> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const result = findUserByEmail(userEmail);
            if (!result) return resolve(null);

            const newPaymentMethod: PaymentMethod = { ...paymentData, id: Date.now() };
            result.user.paymentMethods = [...(result.user.paymentMethods || []), newPaymentMethod];
            mockUsers[result.index] = result.user;
            saveUsers();

            resolve(sanitizeUser(result.user));
        }, apiDelay);
    });
};


export const deletePaymentMethod = (userEmail: string, paymentMethodId: number): Promise<User | null> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const result = findUserByEmail(userEmail);
            if (!result) return resolve(null);

            result.user.paymentMethods = (result.user.paymentMethods || []).filter(p => p.id !== paymentMethodId);
            mockUsers[result.index] = result.user;
            saveUsers();

            resolve(sanitizeUser(result.user));
        }, apiDelay);
    });
};
