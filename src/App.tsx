import { RouterProvider } from 'react-router-dom';
import { LanguageProvider } from '@/i18n/LanguageContext';
import { WorkerProvider } from '@/context/WorkerContext';
import { router } from '@/routes';

function App() {
    return (
        <LanguageProvider>
            <WorkerProvider>
                <RouterProvider router={router} />
            </WorkerProvider>
        </LanguageProvider>
    );
}

export default App;
