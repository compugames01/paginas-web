
import React from 'react';

const SocialIcon: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
        {children}
    </a>
);

const FacebookIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
    </svg>
);

const InstagramIcon = () => (
     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.316 1.363.364 2.427.048 1.067.06 1.407.06 4.055 0 2.648-.012 2.988-.06 4.055-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.316-2.427.364-1.067.048-1.407.06-4.055.06-2.648 0-2.988-.012-4.055-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.316-1.363-.364-2.427C2.013 14.988 2 14.648 2 12s.012-2.988.06-4.055c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.316 2.427-.364C8.92 2.013 9.27 2 11.685 2h.63zm-.001 1.802c-2.596 0-2.93.01-3.953.058-.975.045-1.504.207-1.857.344-.467.182-.86.387-1.232.758-.372.372-.576.765-.758 1.232-.137.353-.3.882-.344 1.857-.048 1.023-.058 1.357-.058 3.953s.01 2.93.058 3.953c.045.975.207 1.504.344 1.857.182.466.387.86.758 1.232.372.372.765.576 1.232.758.353.137.882.3 1.857.344 1.023.048 1.357.058 3.953.058s2.93-.01 3.953-.058c.975-.045 1.504-.207 1.857-.344.467-.182.86-.387 1.232-.758.372-.372.576-.765-.758-1.232.137-.353.3-.882.344-1.857.048-1.023.058-1.357.058-3.953s-.01-2.93-.058-3.953c-.045-.975-.207-1.504-.344-1.857-.182-.467-.387-.86-.758-1.232-.372-.372-.765-.576-1.232-.758-.353-.137-.882-.3-1.857-.344-1.023-.048-1.357-.058-3.953-.058zM12 6.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 1.802a3.333 3.333 0 110 6.666 3.333 3.333 0 010-6.666zm5.338-3.205a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" clipRule="evenodd" />
    </svg>
);

const TwitterIcon = () => (
     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
    </svg>
);


const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto py-6 px-4">
                <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                    <div>
                        <p>&copy; {new Date().getFullYear()} Abarrotes Fresco. Todos los derechos reservados.</p>
                        <p className="text-sm text-gray-400 mt-1">Calidad y frescura a tu alcance.</p>
                    </div>
                    <div className="flex justify-center space-x-6 mt-4 md:mt-0">
                        <SocialIcon href="#"><FacebookIcon /></SocialIcon>
                        <SocialIcon href="#"><InstagramIcon /></SocialIcon>
                        <SocialIcon href="#"><TwitterIcon /></SocialIcon>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
