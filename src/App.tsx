
import Auth from "@/views/auth/Auth";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { WorkerProvider } from "@/context/WorkerContext";

function App() {
    return (
        <LanguageProvider>
            <WorkerProvider>
                <Auth />
            </WorkerProvider>
        </LanguageProvider>
    );
}

export default App
