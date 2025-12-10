import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Users, FileText, ExternalLink, Leaf, ShieldAlert, Plus, Ticket } from "lucide-react";
import { getAllHelplines, getAllNews, createTicket, getTicketStats, type Helpline, type NewsArticle, type TicketStats } from "../../../services/ecoConnectService";

export const EcoConnectPage = () => {
    const navigate = useNavigate();
    const [helplines, setHelplines] = useState<Helpline[]>([]);
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [ticketStats, setTicketStats] = useState<TicketStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [showTicketModal, setShowTicketModal] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [helplinesData, newsData, statsData] = await Promise.all([
                getAllHelplines({ active: true }),
                getAllNews({ limit: 3 }),
                getTicketStats()
            ]);
            setHelplines(helplinesData);
            setNews(newsData);
            setTicketStats(statsData);
        } catch (error) {
            console.error('Failed to fetch EcoConnect data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTicket = async (ticketData: any) => {
        try {
            await createTicket(ticketData);
            await fetchData(); // Refresh stats
            setShowTicketModal(false);
        } catch (error) {
            console.error('Failed to create ticket:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    const emergencyHelplines = helplines.filter(h => h.category === 'emergency');
    const expertHelplines = helplines.filter(h => h.category === 'expert');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-7xl mx-auto pb-20"
        >
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-5xl font-bold text-white mb-2 font-['Orbitron']">EcoConnect Support</h1>
                    <p className="text-zinc-400 text-lg">Direct access to expert help, subsidies, and community support.</p>
                    {ticketStats && (
                        <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="text-zinc-500">Open Tickets: <span className="text-white font-semibold">{ticketStats.open}</span></span>
                            <span className="text-zinc-500">In Progress: <span className="text-blue-400 font-semibold">{ticketStats.inProgress}</span></span>
                            <span className="text-zinc-500">Resolved Today: <span className="text-green-400 font-semibold">{ticketStats.resolved}</span></span>
                        </div>
                    )}
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowTicketModal(true)}
                        className="px-6 py-3 bg-green-600 hover:bg-green-500 border border-green-500/50 rounded-xl text-white font-semibold transition-all flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Create Ticket
                    </button>
                    <button
                        onClick={() => navigate('/app')}
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold transition-all"
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Helplines (2/3 width on large screens) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Emergency Support */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <ShieldAlert className="text-red-500" /> Emergency Response
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {emergencyHelplines.map((helpline) => (
                                <ContactCard
                                    key={helpline.id}
                                    title={helpline.title}
                                    desc={helpline.description}
                                    phone={helpline.phone}
                                    whatsapp={helpline.whatsapp}
                                    email={helpline.email}
                                    availability={helpline.availability}
                                    color={helpline.color as any}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Expert Consultation */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <Users className="text-blue-500" /> Expert Consultation
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {expertHelplines.map((helpline) => (
                                <ContactCard
                                    key={helpline.id}
                                    title={helpline.title}
                                    desc={helpline.description}
                                    phone={helpline.phone}
                                    whatsapp={helpline.whatsapp}
                                    email={helpline.email}
                                    availability={helpline.availability}
                                    color={helpline.color as any}
                                />
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column: News & Subsidies */}
                <div className="space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <FileText className="text-green-500" /> Latest Subsidies
                        </h2>
                        <div className="space-y-4">
                            {news.map((article) => (
                                <NewsCard
                                    key={article.id}
                                    category={article.category}
                                    title={article.title}
                                    date={formatDate(article.publishDate)}
                                    preview={article.preview}
                                    link={article.link}
                                />
                            ))}
                        </div>
                        <button className="w-full py-3 mt-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-zinc-300 hover:text-white transition-colors text-sm">
                            View All Schemes
                        </button>
                    </section>

                    <div className="p-6 bg-gradient-to-br from-green-900/50 to-emerald-900/50 border border-green-500/30 rounded-2xl">
                        <Leaf className="w-8 h-8 text-green-400 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Sustainable Farming</h3>
                        <p className="text-zinc-300 text-sm mb-4">
                            Join our community workshop on sustainable cotton farming practices next Tuesday.
                        </p>
                        <button className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-semibold transition-colors">
                            Register Free
                        </button>
                    </div>
                </div>
            </div>

            {/* Ticket Creation Modal */}
            {showTicketModal && <TicketModal onClose={() => setShowTicketModal(false)} onSubmit={handleCreateTicket} />}
        </motion.div>
    );
};

// Helper function to format date
const formatDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 24) {
        return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
    } else if (diffInDays < 7) {
        return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7);
        return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    } else {
        return date.toLocaleDateString();
    }
};

const ContactCard = ({ title, desc, phone, whatsapp, email, availability, color }: { 
    title: string, 
    desc: string, 
    phone: string,
    whatsapp: string,
    email: string,
    availability: string,
    color: 'red' | 'blue' | 'orange' | 'green'
}) => {
    const colorStyles = {
        red: "bg-red-500/10 border-red-500/20 hover:border-red-500/40 text-red-500",
        blue: "bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40 text-blue-500",
        orange: "bg-orange-500/10 border-orange-500/20 hover:border-orange-500/40 text-orange-500",
        green: "bg-green-500/10 border-green-500/20 hover:border-green-500/40 text-green-500"
    };

    return (
        <div className={`p-6 rounded-xl border backdrop-blur-sm transition-all group cursor-pointer ${colorStyles[color].replace('text-', '')} bg-opacity-10 bg-zinc-900`}>
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <Phone className={`w-5 h-5 ${colorStyles[color].split(' ').pop()}`} />
            </div>
            <p className="text-zinc-400 text-sm mb-2 min-h-[40px]">{desc}</p>
            <p className="text-zinc-500 text-xs mb-4">Available: {availability}</p>
            <div className="flex items-center gap-3">
                <a href={`tel:${phone}`} className={`flex-1 py-2 rounded-lg font-semibold text-sm bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white text-center`}>
                    Call
                </a>
                <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className={`px-3 py-2 rounded-lg font-semibold text-sm bg-green-500/20 text-green-500 hover:bg-green-500/30 transition-colors`}>
                    WhatsApp
                </a>
            </div>
        </div>
    );
};
const NewsCard = ({ category, title, date, preview, link }: { 
    category: string, 
    title: string, 
    date: string, 
    preview: string,
    link: string | null
}) => (
    <div className="p-5 bg-black/40 border border-white/10 rounded-xl hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer group">
        <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-green-400 uppercase tracking-wider bg-green-500/10 px-2 py-0.5 rounded">{category}</span>
            <span className="text-zinc-500 text-xs">{date}</span>
        </div>
        <h4 className="text-white font-bold mb-1 group-hover:text-green-400 transition-colors">{title}</h4>
        <p className="text-zinc-400 text-sm line-clamp-2">{preview}</p>
        {link && (
            <a href={link} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center text-blue-400 text-xs font-semibold gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Read More <ExternalLink className="w-3 h-3" />
            </a>
        )}
    </div>
);

// Ticket Creation Modal Component
const TicketModal = ({ onClose, onSubmit }: { onClose: () => void, onSubmit: (data: any) => void }) => {
    const [formData, setFormData] = useState({
        farmerName: '',
        category: 'General',
        subcategory: '',
        subject: '',
        description: '',
        priority: 'medium',
        contactPhone: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-900 border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Ticket className="text-green-500" />
                        Create Support Ticket
                    </h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white text-2xl">×</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-zinc-400 text-sm mb-2">Your Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.farmerName}
                                onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-green-500 focus:outline-none"
                                placeholder="Enter your name"
                            />
                        </div>
                        <div>
                            <label className="block text-zinc-400 text-sm mb-2">Contact Phone *</label>
                            <input
                                type="tel"
                                required
                                value={formData.contactPhone}
                                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-green-500 focus:outline-none"
                                placeholder="+91 XXXXX XXXXX"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-zinc-400 text-sm mb-2">Category *</label>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-green-500 focus:outline-none"
                            >
                                <option value="General">General</option>
                                <option value="Emergency">Emergency</option>
                                <option value="Technical">Technical</option>
                                <option value="Expert">Expert Consultation</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-zinc-400 text-sm mb-2">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-green-500 focus:outline-none"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-zinc-400 text-sm mb-2">Subject *</label>
                        <input
                            type="text"
                            required
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-green-500 focus:outline-none"
                            placeholder="Brief description of your issue"
                        />
                    </div>

                    <div>
                        <label className="block text-zinc-400 text-sm mb-2">Description *</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-green-500 focus:outline-none resize-none"
                            placeholder="Provide detailed information about your issue..."
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-colors"
                        >
                            Submit Ticket
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};
