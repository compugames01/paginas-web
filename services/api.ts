
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

export const fetchProducts = async (): Promise<Product[]> => {
    console.log("API: Fetching all products from Netlify function...");
    try {
        // This now makes a real network request to our serverless backend function.
        const response = await fetch('/.netlify/functions/products');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products: Product[] = await response.json();
        console.log("API: Products fetched successfully from function.");
        return products;
    } catch (error) {
        console.error("API: Failed to fetch products from function, falling back to local mock data.", error);
        // Fallback to local mock data in case the function fails during development
        return JSON.parse(JSON.stringify(MOCK_PRODUCTS));
    }
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

export const login = (email: string, password: string): Promise<{ success: boolean; message: string; user: User | null }> => {
    console.log(`API: Attempting login for ${email}...`);
    return new Promise(resolve => {
        setTimeout(() => {
            const user = mockUsers.find(u => u.email === email && u.password === password);
            if (user) {
                if (!user.verified) {
                    console.log("API: Login failed. Account not verified.");
                    resolve({ success: false, message: 'Por favor, verifica tu correo electrónico antes de iniciar sesión.', user: null });
                    return;
                }
                console.log("API: Login successful.");
                const { password, ...userWithoutPassword } = user;
                resolve({ success: true, message: 'Inicio de sesión exitoso.', user: userWithoutPassword });
            } else {
                console.log("API: Login failed. Incorrect credentials.");
                resolve({ success: false, message: 'Credenciales incorrectas.', user: null });
            }
        }, apiDelay);
    });
};

export const register = (name: string, email: string, password: string, phone: string): Promise<{ success: boolean, message: string, user: User | null, verificationToken: string | null }> => {
    console.log(`API: Attempting registration for ${email}...`);
    return new Promise(resolve => {
        setTimeout(() => {
            if (mockUsers.some(u => u.email === email)) {
                console.log("API: Registration failed, email exists.");
                resolve({ success: false, message: 'Este correo electrónico ya está registrado.', user: null, verificationToken: null });
                return;
            }
            const verificationToken = `VERIFY-${Math.random().toString(36).substring(2, 15)}`;
            const newUser: MockUserWithPassword = { name, email, password, phone: `+51 ${phone}`, addresses: [], paymentMethods: [], verified: false, verificationToken };
            mockUsers.push(newUser);
            saveUsers();
            const { password: pw, ...userWithoutPassword } = newUser;
            console.log("API: Registration successful.");
            resolve({ success: true, message: 'Registro exitoso.', user: userWithoutPassword, verificationToken });
        }, apiDelay);
    });
};

export const verifyEmail = (token: string, email: string): Promise<{ success: boolean; message: string }> => {
    console.log(`API: Verifying email ${email} with token ${token}...`);
    return new Promise(resolve => {
        setTimeout(() => {
            const userIndex = mockUsers.findIndex(u => u.email === email);
            if (userIndex !== -1) {
                const user = mockUsers[userIndex];
                if (user.verificationToken === token) {
                    user.verified = true;
                    delete user.verificationToken; // One-time use token
                    mockUsers[userIndex] = user;
                    saveUsers();
                    console.log(`API: Email for ${email} verified successfully.`);
                    resolve({ success: true, message: '¡Correo electrónico verificado con éxito!' });
                } else {
                    console.log(`API: Email verification failed for ${email}. Invalid token.`);
                    resolve({ success: false, message: 'El enlace de verificación no es válido o ha expirado.' });
                }
            } else {
                console.log(`API: Email verification failed for ${email}. User not found.`);
                resolve({ success: false, message: 'No se encontró un usuario con ese correo electrónico.' });
            }
        }, apiDelay);
    });
};

export const resendVerificationEmail = (email: string): Promise<{ success: boolean; message: string }> => {
    console.log(`API: Resend verification request for ${email}...`);
    return new Promise(resolve => {
        setTimeout(() => {
            const user = mockUsers.find(u => u.email === email);
            if (user) {
                if(user.verified) {
                    resolve({ success: false, message: 'Esta cuenta ya ha sido verificada.' });
                    return;
                }
                const newToken = `VERIFY-${Math.random().toString(36).substring(2, 15)}`;
                user.verificationToken = newToken;
                saveUsers();
                sendVerificationEmail(user.email, user.name, newToken);
                resolve({ success: true, message: 'Se ha enviado un nuevo correo de verificación.' });
            } else {
                resolve({ success: true, message: 'Si existe una cuenta con este correo, recibirás un nuevo enlace de verificación.' });
            }
        }, apiDelay);
    });
};

export const sendVerificationEmail = async (email: string, name: string, token: string): Promise<void> => {
    console.log(`Simulating sending verification email to ${email}...`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const verificationLink = `https://abarrotes-fresco.app/verify?token=${token}&email=${email}`;

    const emailContent = `
    -----------------------------------------
    To: ${email}
    From: no-reply@abarrotesfresco.com
    Subject: Verifica tu cuenta en Abarrotes Fresco

    Hola ${name},

    ¡Gracias por registrarte en Abarrotes Fresco!
    Para completar tu registro y asegurar tu cuenta, por favor verifica tu dirección de correo electrónico haciendo clic en el siguiente enlace:

    ${verificationLink}

    Si no te registraste en nuestro sitio, por favor ignora este correo.

    ¡Felices compras!

    El equipo de Abarrotes Fresco
    -----------------------------------------
    `;
    console.log("Email content:");
    console.log(emailContent.trim());
    console.log(`Verification email successfully "sent" to ${name} <${email}>.`);
};

export const sendPasswordResetEmail = (email: string): Promise<{ success: boolean; message: string; token: string | null }> => {
    console.log(`API: Password reset request for ${email}...`);
    return new Promise(resolve => {
        setTimeout(() => {
            const user = mockUsers.find(u => u.email === email);
            if (user) {
                const token = `RESET-${Math.random().toString(36).substring(2, 15)}`;
                const resetLink = `https://abarrotes-fresco.app/reset-password?token=${token}&email=${email}`;
                
                const emailContent = `
    -----------------------------------------
    To: ${email}
    From: no-reply@abarrotesfresco.com
    Subject: Restablece tu contraseña de Abarrotes Fresco

    Hola ${user.name},

    Recibimos una solicitud para restablecer tu contraseña.
    Haz clic en el siguiente enlace para establecer una nueva contraseña:

    ${resetLink}

    Si no solicitaste esto, puedes ignorar este correo de forma segura.

    El equipo de Abarrotes Fresco
    -----------------------------------------
                `;
                console.log("Email content:");
                console.log(emailContent.trim());
                console.log(`Password reset email "sent" to ${email}.`);
                
                resolve({ success: true, message: 'Se ha enviado un enlace de restablecimiento.', token });
            } else {
                console.log(`API: Password reset request for non-existent email ${email}. Responding with generic success message.`);
                resolve({ success: true, message: 'Si existe una cuenta con este correo, recibirás un enlace.', token: null });
            }
        }, apiDelay);
    });
};

export const resetPassword = (email: string, token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    console.log(`API: Attempting to reset password for ${email} with token ${token}...`);
    return new Promise(resolve => {
        setTimeout(() => {
            const userIndex = mockUsers.findIndex(u => u.email === email);
            if (userIndex !== -1 && token && token.startsWith('RESET-')) {
                mockUsers[userIndex].password = newPassword;
                saveUsers();
                console.log("API: Password reset successful.");
                resolve({ success: true, message: 'Tu contraseña ha sido actualizada exitosamente.' });
            } else {
                console.log("API: Password reset failed. Invalid token or user not found.");
                resolve({ success: false, message: 'El enlace de restablecimiento no es válido o ha expirado.' });
            }
        }, apiDelay);
    });
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
