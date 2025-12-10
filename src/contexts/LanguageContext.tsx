
import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, defaultText?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations: Record<string, Record<Language, string>> = {
    // General
    'menu': { en: 'MENU', hi: 'मेनू' },
    'close': { en: 'CLOSE', hi: 'बंद करें' },
    'tagline': { en: 'Farming Management Made Easy', hi: 'खेती प्रबंधन को आसान बनाया' },

    // Dashboard Strings
    'dashboard': { en: 'Dashboard Overview', hi: 'डैशबोर्ड अवलोकन' },
    'dashboard_subtitle': { en: 'Real-time farm analytics', hi: 'वास्तविक समय खेती एनालिटिक्स' },

    // Machine Strings
    'machines': { en: 'Machine Monitoring', hi: 'मशीन निगरानी' },
    'machines_subtitle': { en: 'Track fleet status', hi: 'बेड़े की स्थिति ट्रैक करें' },

    // Worker Strings
    'workers': { en: 'Worker Management', hi: 'श्रमिक प्रबंधन' },
    'workers_subtitle': { en: 'Staff coordination', hi: 'स्टाफ समन्वय' },

    // Weather Strings
    'weather': { en: 'Weather Station', hi: 'मौसम केंद्र' },
    'weather_subtitle': { en: 'Forecast & conditions', hi: 'पूर्वानुमान और स्थितियां' },

    // Health Strings
    'health': { en: 'Plant Health AI', hi: 'पौधा स्वास्थ्य एआई' },
    'health_subtitle': { en: 'Disease detection', hi: 'रोग का पता लगाना' },

    // EcoConnect Strings
    'ecoconnect': { en: 'EcoConnect', hi: 'इको कनेक्ट' },
    'ecoconnect_subtitle': { en: 'Market & Community', hi: 'बाजार और समुदाय' },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>('en');

    const t = (key: string, defaultText: string = ''): string => {
        const translation = translations[key];
        if (translation && translation[language]) {
            return translation[language];
        }
        return defaultText || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
