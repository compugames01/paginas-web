
import React, { useState, useEffect } from 'react';
import type { User, Order, Address, PaymentMethod, Toast } from '../types';

interface AccountPageProps {
    user: User;
    orderHistory: Order[];
    onUpdateUser: (
        currentEmail: string,
        newName: string,
        newEmail: string,
        newPhone: string,
        currentPassword?: string,
        newPassword?: string
    ) => Promise<{ success: boolean; message: string }>;
    onAddAddress: (addressData: Omit<Address, 'id'>) => void;
    onUpdateAddress: (address: Address) => void;
    onDeleteAddress: (addressId: number) => void;
    onAddPaymentMethod: (paymentData: Omit<PaymentMethod, 'id'>) => void;
    onDeletePaymentMethod: (paymentMethodId: number) => void;
    onDeleteAccount: (email: string) => Promise<boolean>;
    onLogout: () => void;
    onEmailOrder: (order: Order) => void;
    addToast: (message: string, type: Toast['type']) => void;
}

const ProfileIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);
const HistoryIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>);
const AddressIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
const PaymentIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>);
const SupportIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const LogoutIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>);
const VisaIcon = () => (<svg className="w-12 h-auto" viewBox="0 0 38 23"><path d="M35 0H3C1.3 0 0 1.3 0 3v17c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#1A1F71"/><path d="M12.9 6.8c-.3-.3-.7-.4-1.2-.4H8.2c-.5 0-.9.2-1.2.5-.3.3-.4.7-.4 1.1 0 .5.2.9.5 1.2.3.3.7.4 1.1.4h1.9c.4 0 .8-.2 1.1-.4.3-.3.4-.6.4-1s-.2-.8-.5-1.1zM11.5 16V6.2h2.2l1.9 6.8c.1.3.2.7.3 1.1.1-.4.2-.8.3-1.1l1.9-6.8h2.2V16h-2V8.7c0-.4-.1-.8-.1-1.2 0-.4-.1-.8-.1-1.2l-1.7 6.3h-1.5L13.6 6.3c0 .4-.1.8-.1 1.2 0 .4-.1.8-.1 1.2V16h-2z" fill="#fff"/></svg>);
const MastercardIcon = () => (<svg className="w-12 h-auto" viewBox="0 0 38 23"><path d="M35 0H3C1.3 0 0 1.3 0 3v17c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#222"/><circle cx="15" cy="11.5" r="5" fill="#EB001B"/><circle cx="23" cy="11.5" r="5" fill="#F79E1B"/><path d="M20 11.5a5.8 5.8 0 01-5 5.7 5.8 5.8 0 000-11.4 5.8 5.8 0 005 5.7z" fill="#FF5F00"/></svg>);
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const EyeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064 7 9.542-7 .847 0 1.673.124 2.468.352M7.5 7.5l12 12" /></svg>;
const EmailIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);

const statusColors: { [key in Order['status']]: string } = {
    Procesando: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    Enviado: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    Entregado: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    Cancelado: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

const emptyAddress: Omit<Address, 'id'> = { street: '', city: '', state: '', postalCode: '', country: '' };

const faqs = [
    { question: '¿Cuáles son los métodos de pago aceptados?', answer: 'Aceptamos tarjetas de crédito y débito (Visa, MasterCard) para compras en línea. Todos los pagos son procesados de forma segura.' },
    { question: '¿Hacen envíos a domicilio?', answer: 'Sí, realizamos envíos a domicilio. Podrás seleccionar tu dirección de envío guardada durante el proceso de pago. Los costos y tiempos de entrega varían según la ubicación.' },
    { question: '¿Puedo devolver un producto?', answer: 'Sí, aceptamos devoluciones de productos no perecederos dentro de los 7 días posteriores a la compra. Por favor, contacta a nuestro equipo de soporte para iniciar el proceso.' },
    { question: '¿Cómo puedo hacer seguimiento de mi pedido?', answer: 'El estado de tu pedido se actualizará en tu "Historial de Pedidos". Recibirás notificaciones por correo electrónico cuando tu pedido sea enviado y entregado.' }
];

const AccordionItem: React.FC<{ question: string; answer: string; }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b dark:border-gray-700"><button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left py-4 px-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 focus:outline-none"><span className="text-lg font-medium text-text-primary dark:text-gray-200">{question}</span><span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span></button><div className={`overflow-hidden transition-max-height duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}><div className="p-4 bg-gray-50 dark:bg-gray-700/30 text-text-secondary dark:text-gray-400">{answer}</div></div></div>
    );
};


const AccountPage: React.FC<AccountPageProps> = ({ user, orderHistory, onUpdateUser, onAddAddress, onUpdateAddress, onDeleteAddress, onAddPaymentMethod, onDeletePaymentMethod, onDeleteAccount, onLogout, onEmailOrder, addToast }) => {
    const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'addresses' | 'payment' | 'support'>('profile');
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    
    // Profile Edit State
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editedName, setEditedName] = useState(user.name);
    const [editedEmail, setEditedEmail] = useState(user.email);
    const [editedPhone, setEditedPhone] = useState(user.phone || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profileError, setProfileError] = useState('');
    const [passwordVisibility, setPasswordVisibility] = useState({
        current: false,
        new: false,
        confirm: false,
    });


    // Address Management State
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | Omit<Address, 'id'> | null>(null);
    
    // Payment Method State
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [newCard, setNewCard] = useState({ number: '', expiry: '', cvv: '', name: user.name });
    const [paymentError, setPaymentError] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [paymentMethodToDelete, setPaymentMethodToDelete] = useState<number | null>(null);

    // Delete Account State
    const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
    const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

    // Support Form State
    const [supportSubject, setSupportSubject] = useState('');
    const [supportMessage, setSupportMessage] = useState('');


    useEffect(() => {
        setEditedName(user.name);
        setEditedEmail(user.email);
        setEditedPhone(user.phone || '');
    }, [user]);

    const handleEditProfileToggle = () => {
        setIsEditingProfile(!isEditingProfile);
        setEditedName(user.name);
        setEditedEmail(user.email);
        setEditedPhone(user.phone || '');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setProfileError('');
        setPasswordVisibility({ current: false, new: false, confirm: false });
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileError('');
        if (newPassword !== confirmPassword) {
            setProfileError('Las nuevas contraseñas no coinciden.');
            return;
        }
        const result = await onUpdateUser(user.email, editedName, editedEmail, editedPhone, currentPassword, newPassword);
        if (result.success) {
            setIsEditingProfile(false);
        } else {
            setProfileError(result.message);
        }
    };
    
    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setPasswordVisibility(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleAddNewAddress = () => { setEditingAddress(emptyAddress); setShowAddressForm(true); };
    const handleEditAddress = (address: Address) => { setEditingAddress(address); setShowAddressForm(true); };

    const handleSaveAddress = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingAddress) return;
        if ('id' in editingAddress) { onUpdateAddress(editingAddress); } 
        else { onAddAddress(editingAddress); }
        setShowAddressForm(false);
        setEditingAddress(null);
    };

    const handleCancelAddressForm = () => { setShowAddressForm(false); setEditingAddress(null); };

    const handleSavePaymentMethod = (e: React.FormEvent) => {
        e.preventDefault();
        setPaymentError('');
        const rawCardNumber = newCard.number.replace(/\s/g, '');

        if (!/^\d{16}$/.test(rawCardNumber)) { return setPaymentError('El número de tarjeta debe tener 16 dígitos.'); }
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(newCard.expiry)) { return setPaymentError('La fecha de vencimiento debe estar en formato MM/AA.'); }
        if (!/^\d{3,4}$/.test(newCard.cvv)) { return setPaymentError('El CVV debe tener 3 o 4 dígitos.'); }

        let cardType: 'visa' | 'mastercard' | null = null;
        if (rawCardNumber.startsWith('4')) { cardType = 'visa'; } 
        else if (rawCardNumber.startsWith('5')) { cardType = 'mastercard'; }
        if (!cardType) { return setPaymentError('Solo se aceptan tarjetas Visa o Mastercard.'); }
        
        onAddPaymentMethod({
            cardType: cardType,
            last4: rawCardNumber.slice(-4),
            expiryDate: newCard.expiry,
        });

        setShowPaymentForm(false);
        setNewCard({ number: '', expiry: '', cvv: '', name: user.name });
    };

    const openDeleteConfirmation = (id: number) => {
        setPaymentMethodToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setPaymentMethodToDelete(null);
    };

    const handleConfirmDelete = () => {
        if (paymentMethodToDelete !== null) {
            onDeletePaymentMethod(paymentMethodToDelete);
        }
        handleCancelDelete();
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = e.target.value.replace(/[^\d]/g, '').substring(0, 16).replace(/(.{4})/g, '$1 ').trim();
        setNewCard({...newCard, number: formatted});
    };

    const handleSupportSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addToast('Mensaje de soporte enviado con éxito.', 'success');
        setSupportSubject('');
        setSupportMessage('');
    };
    
    const inputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200";
    const passwordInputClasses = `${inputClasses} pr-10`;

    return (
        <div className="max-w-6xl mx-auto">
             <h1 className="text-4xl font-extrabold text-text-primary dark:text-gray-100 mb-8">Mi Panel</h1>
            <div className="flex flex-col md:flex-row gap-8">
                <aside className="md:w-1/4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md sticky top-24">
                        <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-primary-light text-primary-dark dark:bg-primary/20 dark:text-primary-light font-bold' : 'text-text-primary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}><ProfileIcon /> Perfil</button>
                        <button onClick={() => setActiveTab('history')} className={`w-full flex items-center px-4 py-3 mt-2 rounded-lg transition-colors ${activeTab === 'history' ? 'bg-primary-light text-primary-dark dark:bg-primary/20 dark:text-primary-light font-bold' : 'text-text-primary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}><HistoryIcon /> Historial</button>
                        <button onClick={() => setActiveTab('addresses')} className={`w-full flex items-center px-4 py-3 mt-2 rounded-lg transition-colors ${activeTab === 'addresses' ? 'bg-primary-light text-primary-dark dark:bg-primary/20 dark:text-primary-light font-bold' : 'text-text-primary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}><AddressIcon /> Direcciones</button>
                        <button onClick={() => setActiveTab('payment')} className={`w-full flex items-center px-4 py-3 mt-2 rounded-lg transition-colors ${activeTab === 'payment' ? 'bg-primary-light text-primary-dark dark:bg-primary/20 dark:text-primary-light font-bold' : 'text-text-primary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}><PaymentIcon /> Pagos</button>
                        <button onClick={() => setActiveTab('support')} className={`w-full flex items-center px-4 py-3 mt-2 rounded-lg transition-colors ${activeTab === 'support' ? 'bg-primary-light text-primary-dark dark:bg-primary/20 dark:text-primary-light font-bold' : 'text-text-primary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}><SupportIcon /> Soporte</button>
                        <div className="border-t dark:border-gray-700 my-2"></div>
                        <button onClick={onLogout} className="w-full flex items-center px-4 py-3 mt-2 rounded-lg text-red-600 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"><LogoutIcon /> Cerrar Sesión</button>
                    </div>
                </aside>

                <main className="md:w-3/4">
                    {activeTab === 'profile' && (
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                            {!isEditingProfile ? (
                                <><h2 className="text-3xl font-bold text-text-primary dark:text-gray-100 mb-6">Información del Perfil</h2><div className="space-y-6"><div><label className="text-sm font-medium text-text-secondary dark:text-gray-400">Nombre Completo</label><p className="text-lg text-text-primary dark:text-gray-200">{user.name}</p></div><div><label className="text-sm font-medium text-text-secondary dark:text-gray-400">Correo Electrónico</label><p className="text-lg text-text-primary dark:text-gray-200">{user.email}</p></div><div><label className="text-sm font-medium text-text-secondary dark:text-gray-400">Número de Teléfono</label><p className="text-lg text-text-primary dark:text-gray-200">{user.phone || 'No especificado'}</p></div><div className="pt-4"><button onClick={handleEditProfileToggle} className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg">Editar Perfil</button></div></div></>
                            ) : (
                                <><h2 className="text-3xl font-bold text-text-primary dark:text-gray-100 mb-6">Editar Perfil</h2><form onSubmit={handleSaveProfile} className="space-y-6"><div><label htmlFor="editedName" className="block text-sm font-medium text-text-primary dark:text-gray-300">Nombre Completo</label><input id="editedName" type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} required className={inputClasses}/></div><div><label htmlFor="editedEmail" className="block text-sm font-medium text-text-primary dark:text-gray-300">Correo Electrónico</label><input id="editedEmail" type="email" value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} required className={inputClasses}/></div><div><label htmlFor="editedPhone" className="block text-sm font-medium text-text-primary dark:text-gray-300">Número de Teléfono</label><input id="editedPhone" type="tel" value={editedPhone} onChange={(e) => setEditedPhone(e.target.value)} required className={inputClasses}/></div><div className="pt-4 border-t dark:border-gray-700"><h3 className="text-lg font-semibold text-text-primary dark:text-gray-200 mt-4 mb-2">Cambiar Contraseña (opcional)</h3><div className="space-y-4"><div><label htmlFor="currentPassword" className="dark:text-gray-300">Contraseña Actual</label><div className="relative"><input id="currentPassword" type={passwordVisibility.current ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={passwordInputClasses}/><button type="button" onClick={() => togglePasswordVisibility('current')} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">{passwordVisibility.current ? <EyeOffIcon/> : <EyeIcon/>}</button></div></div><div><label htmlFor="newPassword" className="dark:text-gray-300">Nueva Contraseña</label><div className="relative"><input id="newPassword" type={passwordVisibility.new ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={passwordInputClasses}/><button type="button" onClick={() => togglePasswordVisibility('new')} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">{passwordVisibility.new ? <EyeOffIcon/> : <EyeIcon/>}</button></div></div><div><label htmlFor="confirmPassword" className="dark:text-gray-300">Confirmar Nueva Contraseña</label><div className="relative"><input id="confirmPassword" type={passwordVisibility.confirm ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={passwordInputClasses}/><button type="button" onClick={() => togglePasswordVisibility('confirm')} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">{passwordVisibility.confirm ? <EyeOffIcon/> : <EyeIcon/>}</button></div></div></div></div>{profileError && <p className="text-sm text-red-600 font-medium">{profileError}</p>}<div className="pt-4 flex items-center space-x-4"><button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg">Guardar Cambios</button><button type="button" onClick={handleEditProfileToggle} className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-bold py-2 px-6 rounded-lg">Cancelar</button></div></form></>
                            )}
                            <div className="mt-8 pt-6 border-t border-red-500/30 dark:border-red-500/20">
                                <h3 className="text-xl font-bold text-red-600 dark:text-red-500">Zona de Peligro</h3>
                                <p className="mt-2 text-sm text-text-secondary dark:text-gray-400">
                                    La eliminación de tu cuenta es una acción permanente e irreversible. Perderás todo tu historial de pedidos y direcciones guardadas.
                                </p>
                                <div className="mt-4">
                                    <button
                                        onClick={() => {
                                            setIsDeleteAccountModalOpen(true);
                                            setDeleteConfirmationText('');
                                        }}
                                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                    >
                                        Eliminar Cuenta
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'history' && (
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"><h2 className="text-3xl font-bold text-text-primary dark:text-gray-100 mb-6">Historial de Pedidos</h2>{orderHistory.length > 0 ? (<div className="space-y-4">{orderHistory.map(order => (<div key={order.id} className="border dark:border-gray-700 rounded-lg overflow-hidden"><button className="w-full p-4 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/50 dark:hover:bg-gray-700/70 flex flex-col md:flex-row justify-between items-start md:items-center text-left" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}><div className="mb-2 md:mb-0"><p className="font-bold text-text-primary dark:text-gray-200">Pedido #{order.id}</p><p className="text-sm text-text-secondary dark:text-gray-400">Fecha: {order.date}</p></div><div className="flex items-center gap-4"><p className="font-semibold text-text-primary dark:text-white">${order.total.toFixed(2)}</p><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status]}`}>{order.status}</span><span className={`transform transition-transform duration-300 ${expandedOrder === order.id ? 'rotate-180' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span></div></button>{expandedOrder === order.id && (<div className="p-4 border-t dark:border-gray-700"><h4 className="font-semibold mb-2 text-text-primary dark:text-gray-200">Detalles del Pedido:</h4>{order.items.map(item => (<div key={item.id} className="flex flex-col items-start sm:flex-row sm:items-center justify-between gap-2 py-2 border-b dark:border-gray-700 last:border-b-0"><div className="flex items-center gap-3"><img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded"/><div><p className="text-text-primary dark:text-gray-300">{item.name}</p><p className="text-sm text-text-secondary dark:text-gray-400">{item.quantity} x ${item.price.toFixed(2)}</p></div></div><p className="font-medium text-text-primary dark:text-white self-end sm:self-center">${(item.quantity * item.price).toFixed(2)}</p></div>))}<div className="mt-4 pt-4 border-t dark:border-gray-600 flex items-center justify-end gap-4"><button onClick={() => onEmailOrder(order)} className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors"><EmailIcon />Enviar por Correo</button></div></div>)}</div>))}</div>) : (<p className="text-text-secondary dark:text-gray-400">Aún no has realizado ningún pedido.</p>)}</div>
                    )}
                    {activeTab === 'addresses' && (
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"><div className="flex justify-between items-center mb-6"><h2 className="text-3xl font-bold text-text-primary dark:text-gray-100">Mis Direcciones</h2>{!showAddressForm && <button onClick={handleAddNewAddress} className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg">Añadir Dirección</button>}</div>{!showAddressForm ? (<div className="space-y-4">{(user.addresses && user.addresses.length > 0) ? user.addresses.map(addr => (<div key={addr.id} className="p-4 border dark:border-gray-700 rounded-lg flex justify-between items-start"><div><p className="font-semibold text-text-primary dark:text-gray-200">{addr.street}</p><p className="text-text-secondary dark:text-gray-400">{addr.city}, {addr.state} {addr.postalCode}</p><p className="text-text-secondary dark:text-gray-400">{addr.country}</p></div><div className="flex items-center space-x-2"><button onClick={() => handleEditAddress(addr)} className="text-blue-600 hover:underline">Editar</button><button onClick={() => onDeleteAddress(addr.id)} className="text-red-600 hover:underline">Eliminar</button></div></div>)) : <p className="text-text-secondary dark:text-gray-400">No tienes ninguna dirección guardada.</p>}</div>) : (<form onSubmit={handleSaveAddress} className="space-y-4 p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50"><h3 className="text-xl font-bold text-text-primary dark:text-gray-200">{'id' in editingAddress! ? 'Editar' : 'Añadir Nueva'} Dirección</h3><div><label className="dark:text-gray-300">Calle</label><input type="text" value={editingAddress?.street} onChange={e => setEditingAddress({...editingAddress!, street: e.target.value})} required className={inputClasses}/></div><div><label className="dark:text-gray-300">Ciudad</label><input type="text" value={editingAddress?.city} onChange={e => setEditingAddress({...editingAddress!, city: e.target.value})} required className={inputClasses}/></div><div><label className="dark:text-gray-300">Estado/Provincia</label><input type="text" value={editingAddress?.state} onChange={e => setEditingAddress({...editingAddress!, state: e.target.value})} required className={inputClasses}/></div><div><label className="dark:text-gray-300">Código Postal</label><input type="text" value={editingAddress?.postalCode} onChange={e => setEditingAddress({...editingAddress!, postalCode: e.target.value})} required className={inputClasses}/></div><div><label className="dark:text-gray-300">País</label><input type="text" value={editingAddress?.country} onChange={e => setEditingAddress({...editingAddress!, country: e.target.value})} required className={inputClasses}/></div><div className="flex items-center space-x-4 pt-2"><button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg">Guardar</button><button type="button" onClick={handleCancelAddressForm} className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-bold py-2 px-6 rounded-lg">Cancelar</button></div></form>)}</div>
                    )}
                    {activeTab === 'payment' && (
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                            <div className="flex justify-between items-center mb-6"><h2 className="text-3xl font-bold text-text-primary dark:text-gray-100">Métodos de Pago</h2>{!showPaymentForm && <button onClick={() => setShowPaymentForm(true)} className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg">Añadir Tarjeta</button>}</div>
                            {!showPaymentForm ? (
                                <div className="space-y-4">
                                    {(user.paymentMethods && user.paymentMethods.length > 0) ? user.paymentMethods.map(pm => (
                                        <div key={pm.id} className="p-4 border dark:border-gray-700 rounded-lg flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                {pm.cardType === 'visa' ? <VisaIcon /> : <MastercardIcon />}
                                                <div>
                                                    <p className="font-semibold text-text-primary dark:text-gray-200">{pm.cardType.charAt(0).toUpperCase() + pm.cardType.slice(1)} terminada en {pm.last4}</p>
                                                    <p className="text-text-secondary dark:text-gray-400">Vence: {pm.expiryDate}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => openDeleteConfirmation(pm.id)} className="text-red-600 hover:underline">Eliminar</button>
                                        </div>
                                    )) : <p className="text-text-secondary dark:text-gray-400">No tienes ningún método de pago guardado.</p>}
                                </div>
                            ) : (
                                <form onSubmit={handleSavePaymentMethod} className="space-y-4 p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                                    <h3 className="text-xl font-bold text-text-primary dark:text-gray-200">Añadir Nueva Tarjeta</h3>
                                    <div><label className="dark:text-gray-300">Nombre en la Tarjeta</label><input type="text" value={newCard.name} onChange={e => setNewCard({...newCard, name: e.target.value})} required className={inputClasses}/></div>
                                    <div><label className="dark:text-gray-300">Número de Tarjeta</label><input type="text" inputMode="numeric" value={newCard.number} onChange={handleCardNumberChange} required placeholder="0000 0000 0000 0000" className={inputClasses}/></div>
                                    <div className="flex gap-4">
                                        <div className="w-1/2"><label className="dark:text-gray-300">Vencimiento (MM/AA)</label><input type="text" value={newCard.expiry} onChange={e => setNewCard({...newCard, expiry: e.target.value})} required placeholder="MM/AA" className={inputClasses}/></div>
                                        <div className="w-1/2"><label className="dark:text-gray-300">CVV</label><input type="text" inputMode="numeric" value={newCard.cvv} onChange={e => setNewCard({...newCard, cvv: e.target.value})} required placeholder="123" className={inputClasses}/></div>
                                    </div>
                                    {paymentError && <p className="text-sm text-red-600 font-medium">{paymentError}</p>}
                                    <div className="flex items-center space-x-4 pt-2">
                                        <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg">Guardar Tarjeta</button>
                                        <button type="button" onClick={() => setShowPaymentForm(false)} className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-bold py-2 px-6 rounded-lg">Cancelar</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}
                    {activeTab === 'support' && (
                         <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                            <h2 className="text-3xl font-bold text-text-primary dark:text-gray-100 mb-6">Ayuda y Soporte</h2>
                            <div className="space-y-12">
                                <div>
                                    <h3 className="text-2xl font-semibold text-text-primary dark:text-gray-200 mb-4">Preguntas Frecuentes</h3>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                                        {faqs.map((faq, index) => (
                                            <AccordionItem key={index} question={faq.question} answer={faq.answer} />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-semibold text-text-primary dark:text-gray-200 mb-4">Envíanos un Mensaje</h3>
                                    <form onSubmit={handleSupportSubmit} className="space-y-4 p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                                        <div><label htmlFor="supportName" className="block text-sm font-medium text-text-primary dark:text-gray-300">Nombre</label><input id="supportName" type="text" value={user.name} readOnly className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm"/></div>
                                        <div><label htmlFor="supportEmail" className="block text-sm font-medium text-text-primary dark:text-gray-300">Correo Electrónico</label><input id="supportEmail" type="email" value={user.email} readOnly className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm"/></div>
                                        <div><label htmlFor="supportSubject" className="block text-sm font-medium text-text-primary dark:text-gray-300">Asunto</label><input id="supportSubject" type="text" value={supportSubject} onChange={e => setSupportSubject(e.target.value)} required className={inputClasses}/></div>
                                        <div><label htmlFor="supportMessage" className="block text-sm font-medium text-text-primary dark:text-gray-300">Mensaje</label><textarea id="supportMessage" rows={5} value={supportMessage} onChange={e => setSupportMessage(e.target.value)} required className={inputClasses}></textarea></div>
                                        <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg">Enviar Mensaje</button>
                                    </form>
                                </div>
                                 <div>
                                    <h3 className="text-2xl font-semibold text-text-primary dark:text-gray-200 mb-4">Contacto Directo</h3>
                                    <div className="p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50 space-y-2">
                                        <p className="text-text-primary dark:text-gray-300"><strong>Teléfono:</strong> +51 (1) 234-5678</p>
                                        <p className="text-text-primary dark:text-gray-300"><strong>Email:</strong> soporte@abarrotesfresco.com</p>
                                    </div>
                                </div>
                            </div>
                         </div>
                    )}
                </main>
            </div>
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-80 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-sm w-full transform transition-all" role="document">
                        <h3 className="text-xl font-bold text-text-primary dark:text-white">Confirmar Eliminación</h3>
                        <p className="mt-4 text-text-secondary dark:text-gray-400">
                            ¿Estás seguro de que quieres eliminar este método de pago? Esta acción no se puede deshacer.
                        </p>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button onClick={handleCancelDelete} className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg transition-colors">
                                Cancelar
                            </button>
                            <button onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isDeleteAccountModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-80 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-sm w-full transform transition-all" role="document">
                        <h3 className="text-xl font-bold text-text-primary dark:text-white">¿Estás seguro?</h3>
                        <p className="mt-4 text-text-secondary dark:text-gray-400">
                            Estás a punto de eliminar tu cuenta permanentemente. Esta acción es irreversible y todos tus datos se perderán.
                        </p>
                        <div className="mt-4">
                            <label htmlFor="delete-confirm" className="text-sm font-medium text-text-secondary dark:text-gray-400">
                                Para confirmar, escribe <strong className="text-red-500">ELIMINAR</strong> en el campo de abajo.
                            </label>
                            <input
                                id="delete-confirm"
                                type="text"
                                value={deleteConfirmationText}
                                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                                className="mt-2 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm bg-white dark:bg-gray-700 text-text-primary dark:text-gray-200"
                            />
                        </div>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button onClick={() => setIsDeleteAccountModalOpen(false)} className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg transition-colors">
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    onDeleteAccount(user.email);
                                    setIsDeleteAccountModalOpen(false);
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-red-400 disabled:cursor-not-allowed dark:disabled:bg-red-800"
                                disabled={deleteConfirmationText !== 'ELIMINAR'}
                            >
                                Sí, Eliminar Cuenta
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountPage;
