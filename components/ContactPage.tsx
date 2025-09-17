
import React, { useState } from 'react';

const InfoCard: React.FC<{ icon: JSX.Element; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-primary-light dark:bg-primary/20 text-primary dark:text-primary-light rounded-full flex items-center justify-center">
            {icon}
        </div>
        <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{title}</h3>
            <div className="text-text-secondary dark:text-gray-400 mt-1">{children}</div>
        </div>
    </div>
);

const LocationIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
const ClockIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const PhoneIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>);

const faqs = [
    {
        question: '¿Cuáles son los métodos de pago aceptados?',
        answer: 'Aceptamos tarjetas de crédito y débito (Visa, MasterCard, American Express), pagos en efectivo y pagos a través de aplicaciones móviles en nuestra tienda física.'
    },
    {
        question: '¿Hacen envíos a domicilio?',
        answer: 'Actualmente, todas las compras son para recoger en tienda. Estamos trabajando para ofrecer servicio a domicilio en el futuro. ¡Mantente atento!'
    },
    {
        question: '¿Puedo devolver un producto?',
        answer: 'Sí, aceptamos devoluciones de productos no perecederos dentro de los 7 días posteriores a la compra, presentando tu ticket. Por motivos de higiene y seguridad, los productos frescos no admiten devolución.'
    },
    {
        question: '¿Tienen productos orgánicos o sin gluten?',
        answer: '¡Claro! Contamos con una sección dedicada a productos orgánicos y una variedad de opciones sin gluten. Pregunta a nuestro personal y con gusto te ayudarán a encontrarlos.'
    }
];

const AccordionItem: React.FC<{ question: string; answer: string; }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b dark:border-gray-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-4 px-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 focus:outline-none"
            >
                <span className="text-lg font-medium text-gray-800 dark:text-gray-200">{question}</span>
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>
            <div className={`overflow-hidden transition-max-height duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/30 text-text-secondary dark:text-gray-400">
                    {answer}
                </div>
            </div>
        </div>
    );
};

const ContactPage: React.FC = () => {
    return (
        <div className="space-y-16">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100">Contáctanos</h1>
                <p className="mt-4 text-lg text-text-secondary dark:text-gray-400">Estamos aquí para ayudarte. ¡Visítanos!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                <div className="space-y-6">
                    <InfoCard icon={<LocationIcon />} title="Nuestra Dirección">
                        <p>Calle Falsa 123, Centro</p>
                        <p>Ciudad Capital, CP 01010</p>
                    </InfoCard>
                    <InfoCard icon={<ClockIcon />} title="Horario de Atención">
                        <p><strong>Lunes a Sábado:</strong> 8:00 AM - 9:00 PM</p>
                        <p><strong>Domingos:</strong> 9:00 AM - 3:00 PM</p>
                    </InfoCard>
                    <InfoCard icon={<PhoneIcon />} title="Teléfono">
                        <p>+51 (1) 234-5678</p>
                    </InfoCard>
                </div>

                <div className="w-full h-80 md:h-full rounded-lg shadow-lg overflow-hidden">
                   <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.585526038165!2d-99.1353986850934!3d19.43260778688126!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1f94d9b0f4a7b%3A0x8e50b1d305a4173!2sZ%C3%B3calo%2C%20Centro%20Hist%C3%B3rico%20de%20la%20Cdad.%20de%20M%C3%A9xico%2C%20Centro%2C%20Cuauht%C3%A9moc%2C%2006000%20Ciudad%20de%20M%C3%A9xico%2C%20CDMX!5e0!3m2!1sen!2smx!4v1678886483129!5m2!1sen!2smx"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Ubicación de la tienda"
                    ></iframe>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 text-center mb-8">Preguntas Frecuentes</h2>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
