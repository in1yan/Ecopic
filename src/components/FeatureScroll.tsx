import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect, ChangeEvent } from "react";
import { useWorkerContext } from "@/context/WorkerContext";
import { LayoutDashboard, Tractor, Users, CloudSun, LucideIcon, Bell, Wrench, CheckCircle, AlertTriangle, Radio, TrendingUp, Globe, Activity } from "lucide-react";

const GradientIcon = ({ icon: Icon, id, from, to }: { icon: LucideIcon, id: string, from: string, to: string }) => (
    <div className="relative flex items-center justify-center">
        <svg width="0" height="0" className="absolute block">
            <defs>
                <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={from} />
                    <stop offset="100%" stopColor={to} />
                </linearGradient>
            </defs>
        </svg>
        <Icon className="w-8 h-8" style={{ stroke: `url(#${id})` }} />
    </div>
);

export const features = [
    {
        id: 'dashboard',
        title: 'Dashboard Overview',
        subtitle: 'Real-time farm metrics and performance',
        description: 'Get a bird\'s eye view of your entire farm operation. Monitor key performance indicators, track daily yields, and oversee resource allocation in real-time.',
        icon: <GradientIcon icon={LayoutDashboard} id="grad-dash" from="#38bdf8" to="#3b82f6" />,
        previewData: {
            revenue: { amount: '₹12.5L', label: 'Monthly Revenue', change: '+15%' },
            profit: { amount: '₹8.3L', label: 'Net Profit', change: '+24%' },
            workers: { total: 24, change: '+12%' },
            machines: { active: 8, online: 6, change: '+61.2%' },
            yield: { amount: '1234 kg', label: 'Total today' },
            bags: { count: 45, label: 'Sealed today', change: '+8%' },
            market: { price: '₹6,200/q', trend: '+2.4%', status: 'High Demand' },
            inventory: { current: '850q', capacity: '1000q', nextDelivery: 'Tomorrow' }
        },
        gradient: 'from-sky-400 to-blue-500'
    },
    {
        id: 'machines',
        title: 'Machine Monitoring',
        subtitle: 'Real-time status of cotton picking machines',
        description: 'Track the location, status, and performance of every machine in your fleet. Receive alerts for maintenance and optimize route planning.',
        icon: <GradientIcon icon={Tractor} id="grad-machine" from="#fb923c" to="#ea580c" />,
        previewData: {
            total: 12,
            online: 8,
            offline: 2,
            repair: 2,
            machines: [
                { id: 1, field: 'Field A', battery: 85, trash: 2.3, bags: 12, status: 'Online' },
                { id: 2, field: 'Field B', battery: 72, trash: 1.8, bags: 10, status: 'Online' }
            ]
        },
        gradient: 'from-sky-400 to-blue-500'
    },
    {
        id: 'workers',
        title: 'Worker Management',
        subtitle: 'Performance tracking and labor allocation',
        description: 'Manage your workforce efficiently. Track individual performance, assign tasks, and ensure fair compensation based on accurate data.',
        icon: <GradientIcon icon={Users} id="grad-users" from="#a78bfa" to="#d946ef" />,
        previewData: {
            stats: {
                total: 24,
                active: 18,
                wagesPaid: '₹45,200',
                avgEfficiency: '92%'
            },
            topPerformers: [
                { name: 'John Doe', picked: 520, wage: '₹2,600' },
                { name: 'Jane Smith', picked: 480, wage: '₹2,400' },
                { name: 'Alice Brown', picked: 450, wage: '₹2,250' }
            ]
        },
        gradient: 'from-sky-400 to-blue-500'
    },

    {
        id: 'weather',
        title: 'Weather Station',
        subtitle: 'Real-time weather monitoring for precision farming',
        description: 'Access hyper-local weather data to make informed decisions about irrigation, spraying, and harvesting. Stay ahead of changing conditions.',
        icon: <GradientIcon icon={CloudSun} id="grad-weather" from="#facc15" to="#0ea5e9" />,
        previewData: {
            current: { temp: 0, condition: 'Loading...', humidity: 0, windSpeed: 0 },
            insights: [],
            forecast: []
        },
        gradient: 'from-sky-400 to-blue-500'
    },
    {
        id: 'news_station',
        title: 'AgriNews Network',
        subtitle: 'Live farm updates, subsidies, and expert talks',
        description: 'Stay tuned with the pulse of agriculture. Real-time news ticker, government scheme alerts, and expert interviews broadcast directly to your dashboard.',
        icon: <GradientIcon icon={Radio} id="grad-news" from="#ef4444" to="#b91c1c" />,
        previewData: {
            headline: "Government Announces New MSP for Cotton Crops",
            subtext: "Prices expected to rise by 8% this season.",
            ticker: ["PM-KISAN installment released", "Monsoon forecast: Above average rainfall expected", "New solar pump subsidy open for applications"],
            liveViewers: "1.2k",
            breaking: true
        },
        gradient: 'from-red-500 to-rose-600'
    }
];

export const FeatureScroll = ({ onSelectFeature, containerRef }: { onSelectFeature: (feature: typeof features[0]) => void, containerRef: React.RefObject<HTMLDivElement> }) => {
    return (
        <div className="relative w-full z-20 pb-40">
            {features.map((feature, index) => (
                <FeatureCard
                    key={feature.id}
                    feature={feature}
                    index={index}
                    onSelect={() => onSelectFeature(feature)}
                    containerRef={containerRef}
                />
            ))}
        </div>
    );
};

const FeatureCard = ({ feature, index, onSelect, containerRef }: { feature: typeof features[0], index: number, onSelect: () => void, containerRef: React.RefObject<HTMLDivElement> }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        container: containerRef,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);
    const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100]);

    const isLeft = index % 2 === 0;
    const isLargeCard = true;

    return (
        <div
            ref={ref}
            className={`flex w-full min-h-[90vh] items-center ${isLargeCard ? 'justify-center' : isLeft ? 'justify-start pl-10 md:pl-20' : 'justify-end pr-10 md:pr-20'}`}
        >
            <motion.div
                style={{ opacity, scale, y }}
                className={`relative group w-full ${isLargeCard ? 'max-w-[95vw]' : 'max-w-2xl'}`}
            >
                {/* Card Glow */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000`} />

                {/* Card Content */}
                <div className={`relative p-10 ${isLargeCard ? 'bg-zinc-800/30' : 'bg-black/50'} backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all`}>
                    {/* Indian Flag Accent - Only for non-large cards */}
                    {!isLargeCard && <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-white to-green-500" />}

                    {/* Header */}
                    <div className="mb-8">
                        <h3 className={`text-4xl font-bold text-white mb-2 ${isLargeCard ? 'font-sans' : "font-['Orbitron']"}`}>
                            {feature.title}
                        </h3>
                        <p className="text-zinc-400 text-lg">{feature.subtitle}</p>
                    </div>

                    {/* Preview Content */}
                    <div className="mb-8">
                        {feature.id === 'dashboard' && <DashboardPreview data={feature.previewData} />}
                        {feature.id === 'machines' && <MachinesPreview data={feature.previewData} />}
                        {feature.id === 'workers' && <WorkersPreview data={feature.previewData} />}

                        {feature.id === 'weather' && <WeatherPreview data={feature.previewData} />}
                        {feature.id === 'news_station' && <NewsBillboardPreview data={feature.previewData} />}
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={onSelect}
                        className="w-full py-4 rounded-xl font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 transition-all flex items-center justify-center gap-3 group/btn text-lg"
                    >
                        <span>{feature.id === 'news_station' ? 'EcoConnect Support' : 'View Full Details'}</span>
                        <span className="group-hover/btn:translate-x-2 transition-transform text-xl">→</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
};


// Preview Components
const DashboardPreview = ({ data }: any) => (
    <div className="grid grid-cols-2 gap-4">
        {/* Left Column: Stats in 2x3 grid */}
        <div className="grid grid-cols-2 gap-3">
            {/* Revenue */}
            <div className="p-3 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm">
                <div className="text-zinc-300 text-sm mb-1">Monthly Revenue</div>
                <div className="text-3xl font-bold text-white">{data.revenue.amount}</div>
                <div className="text-emerald-400 text-sm">{data.revenue.change}</div>
            </div>
            {/* Profit */}
            <div className="p-3 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm">
                <div className="text-zinc-300 text-sm mb-1">Net Profit</div>
                <div className="text-3xl font-bold text-white">{data.profit.amount}</div>
                <div className="text-emerald-400 text-sm">{data.profit.change}</div>
            </div>
            {/* Workers */}
            <div className="p-3 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm">
                <div className="text-zinc-300 text-sm mb-1">Total Workers</div>
                <div className="text-3xl font-bold text-white">{data.workers.total}</div>
                <div className="text-zinc-400 text-sm">{data.workers.change}</div>
            </div>
            {/* Machines */}
            <div className="p-3 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm">
                <div className="text-zinc-300 text-sm mb-1">Active Machines</div>
                <div className="text-3xl font-bold text-white">{data.machines.active}</div>
                <div className="text-emerald-400 text-sm">{data.machines.change}</div>
            </div>
            {/* Yield */}
            <div className="p-3 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm">
                <div className="text-zinc-300 text-sm mb-1">Today's Yield</div>
                <div className="text-3xl font-bold text-white">{data.yield.amount}</div>
            </div>
            {/* Bags */}
            <div className="p-3 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm">
                <div className="text-zinc-300 text-sm mb-1">Cotton Bags</div>
                <div className="text-3xl font-bold text-white">{data.bags.count}</div>
                <div className="text-emerald-400 text-sm">{data.bags.change}</div>
            </div>
            {/* Inventory Quick View */}
            <div className="p-3 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm col-span-2">
                <div className="flex justify-between items-center mb-1">
                    <div className="text-zinc-300 text-sm">Current Stock</div>
                    <div className="text-zinc-400 text-xs">Capacity: {data.inventory.capacity}</div>
                </div>
                <div className="flex justify-between items-end">
                    <div className="text-3xl font-bold text-white">{data.inventory.current}</div>
                    <div className="text-zinc-300 text-xs bg-white/10 px-2 py-1 rounded border border-white/20">
                        Next Delivery: <span className="font-bold text-white">{data.inventory.nextDelivery}</span>
                    </div>
                </div>
                <div className="w-full bg-zinc-700/50 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full" style={{ width: '85%' }}></div>
                </div>
            </div>
        </div>

        {/* Right Column: Market & Notifications */}
        <div className="flex flex-col gap-3">
            {/* Market Status */}
            <div className="p-3 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-semibold text-base">Market Status</h4>
                    <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">Live</span>
                </div>
                <div className="flex items-end justify-between">
                    <div>
                        <div className="text-zinc-400 text-xs">Cotton Price</div>
                        <div className="text-2xl font-bold text-white">{data.market.price}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-emerald-400 font-bold">{data.market.trend}</div>
                        <div className="text-zinc-400 text-xs">{data.market.status}</div>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="p-3 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-semibold text-base flex items-center gap-2">
                        <Bell className="w-4 h-4" /> Notifications
                    </h4>
                    <span className="text-xs font-medium px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">3 New</span>
                </div>
                <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                    <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="p-1.5 bg-yellow-500/10 text-yellow-500 rounded-lg border border-yellow-500/20">
                            <Wrench className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-zinc-100 font-medium text-sm truncate">Machine #4 Maintenance</div>
                            <div className="text-zinc-400 text-xs">Hydraulic system check required</div>
                            <div className="text-zinc-500 text-[10px] mt-0.5">2 hours ago</div>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg border border-emerald-500/20">
                            <CheckCircle className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-zinc-100 font-medium text-sm truncate">Harvest Completed</div>
                            <div className="text-zinc-400 text-xs">Field A - 450kg collected</div>
                            <div className="text-zinc-500 text-[10px] mt-0.5">5 hours ago</div>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="p-1.5 bg-orange-500/10 text-orange-500 rounded-lg border border-orange-500/20">
                            <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-zinc-100 font-medium text-sm truncate">Weather Alert</div>
                            <div className="text-zinc-400 text-xs">Heavy rain expected tomorrow</div>
                            <div className="text-zinc-500 text-[10px] mt-0.5">1 day ago</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const MachinesPreview = ({ data }: any) => (
    <div className="grid grid-cols-2 gap-4">
        {/* Left Column: Stats in 1x3 grid (Stacked) */}
        <div className="flex flex-col gap-3">
            {/* Fleet Health */}
            <div className="flex-1 p-3 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm flex flex-col justify-center items-center text-center">
                <div className="text-zinc-300 font-bold text-sm mb-1">Fleet Health</div>
                <div className="w-16 h-16 rounded-full border-4 border-emerald-500/50 flex items-center justify-center mb-1 bg-emerald-500/10">
                    <span className="text-xl font-bold text-emerald-400">92%</span>
                </div>
                <div className="text-zinc-400 text-xs">Operational Efficiency</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {/* Active */}
                <div className="p-3 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm text-center">
                    <div className="text-zinc-300 text-xs mb-1">Active</div>
                    <div className="text-2xl font-bold text-white">{data.online} <span className="text-xs font-normal text-zinc-400">/ {data.total}</span></div>
                </div>
                {/* Issues */}
                <div className="p-3 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm text-center">
                    <div className="text-zinc-300 text-xs mb-1">Issues</div>
                    <div className="text-2xl font-bold text-orange-400">{data.offline + data.repair}</div>
                </div>
            </div>
        </div>

        {/* Right Column: System Alerts / Mini Status */}
        <div className="p-3 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-semibold text-sm">System Alerts</h4>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </div>
            <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
                {/* Simulated Alerts based on data */}
                <div className="flex items-start gap-2 p-2 bg-white/5 rounded-lg border border-red-500/20">
                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                    <div>
                        <div className="text-zinc-200 font-bold text-xs">Machine #4 Offline</div>
                        <div className="text-zinc-500 text-[10px]">Signal lost 20 mins ago</div>
                    </div>
                </div>
                <div className="flex items-start gap-2 p-2 bg-white/5 rounded-lg border border-orange-500/20">
                    <Wrench className="w-4 h-4 text-orange-500 mt-0.5" />
                    <div>
                        <div className="text-zinc-200 font-bold text-xs">Maintenance Due</div>
                        <div className="text-zinc-500 text-[10px]">Machine #2 - check hydraulic</div>
                    </div>
                </div>
                <div className="flex items-start gap-2 p-2 bg-white/5 rounded-lg border border-emerald-500/20">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                    <div>
                        <div className="text-zinc-200 font-bold text-xs">Field A Complete</div>
                        <div className="text-zinc-500 text-[10px]">Harvest finished successfully</div>
                    </div>
                </div>
            </div>
            <div className="mt-2 pt-2 border-t border-white/5 text-center">
                <span className="text-[10px] text-zinc-500">Sync: Just now</span>
            </div>
        </div>
    </div>
);

const WorkersPreview = ({ data: _initialData }: any) => {
    const { stats, topPerformers } = useWorkerContext();

    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Left Column: Stats in 2x2 grid (merged some cells) */}
            <div className="flex flex-col gap-4">
                {/* Total Workers */}
                <div className="p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm flex items-center justify-between">
                    <div>
                        <div className="text-zinc-300 text-sm mb-1">Total Workers</div>
                        <div className="text-3xl font-bold text-white">{stats.totalWorkers}</div>
                    </div>
                    <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                        <Users className="w-6 h-6" />
                    </div>
                </div>

                {/* Total Cost */}
                <div className="p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm flex items-center justify-between">
                    <div>
                        <div className="text-zinc-300 text-sm mb-1">Total Cost</div>
                        <div className="text-3xl font-bold text-white">₹{stats.totalCost.toLocaleString()}</div>
                    </div>
                    <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                </div>

                {/* Avg Efficiency */}
                <div className="p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm flex items-center justify-between">
                    <div>
                        <div className="text-zinc-300 text-sm mb-1">Avg Efficiency</div>
                        <div className="text-3xl font-bold text-white">{stats.avgEfficiency}</div>
                    </div>
                    <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
                        <Activity className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Right Column: Top Performers List */}
            <div className="p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-semibold text-base">Top Performers</h4>
                    <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-500 rounded-full border border-yellow-500/20">Real-time</span>
                </div>
                <div className="space-y-3">
                    {topPerformers.length === 0 ? (
                        <div className="text-zinc-500 text-sm text-center py-4">No data available</div>
                    ) : (
                        topPerformers.map((worker: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                        #{idx + 1}
                                    </div>
                                    <div>
                                        <div className="text-zinc-200 font-medium text-sm">{worker.name}</div>
                                        <div className="text-zinc-500 text-xs">{worker.picked} kg picked</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-emerald-400 font-bold text-sm">₹{worker.cost}</div>
                                    <div className="text-zinc-500 text-[10px]">Cost</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};



const WeatherPreview = ({ data: _unused }: any) => {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch('http://localhost:3001/api/weather?city=Coimbatore')
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    const d = res.data;
                    const insights = [
                        { type: 'Irrigation', message: Number(d.current.humidity) > 70 ? "High humidity. Reduce irrigation." : "Moisture levels adequate. No irrigation needed." },
                        { type: 'Spraying', message: Number(d.current.windSpeed) > 15 ? "High winds. Avoid spraying." : "Conditions favorable for spraying if needed." }
                    ];
                    setData({
                        current: d.current,
                        forecast: d.forecast.slice(0, 3),
                        insights: insights
                    });
                }
            })
            .catch(err => console.error("Weather fetch failed", err));
    }, []);

    if (!data) return (
        <div className="h-[300px] flex flex-col items-center justify-center bg-zinc-900/60 rounded-xl border border-white/5 backdrop-blur-sm">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-zinc-400 font-mono text-xs">Connecting to Weather Station...</div>
        </div>
    );

    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Left Column: Current Weather */}
            <div className="p-4 bg-zinc-900/60 rounded-xl border border-white/5 backdrop-blur-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="text-white text-lg font-bold mb-1">Current Weather</div>
                        <div className="text-zinc-400 text-sm capitalize">{data.current.description || data.current.condition}</div>
                    </div>

                </div>

                <div className="flex items-end gap-2 mt-4">
                    <div className="text-5xl font-bold text-white">{data.current.temp}°C</div>
                    <div className="text-zinc-500 mb-1">Feels like {data.current.temp + 2}°</div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/10">
                    <div>
                        <div className="text-zinc-500 text-xs">Humidity</div>
                        <div className="text-white font-bold">{data.current.humidity}%</div>
                    </div>
                    <div>
                        <div className="text-zinc-500 text-xs">Wind</div>
                        <div className="text-white font-bold">{data.current.windSpeed} km/h</div>
                    </div>
                </div>
            </div>

            {/* Right Column: Forecast */}
            <div className="flex flex-col gap-3">
                {/* 3-Day Forecast */}
                <div className="grid grid-cols-3 gap-2">
                    {data.forecast && data.forecast.map((day: any, idx: number) => (
                        <div key={idx} className="p-2 bg-white/5 rounded-lg border border-white/5 text-center">
                            <div className="text-zinc-400 text-xs font-bold uppercase mb-1">{day.day}</div>
                            <div className="text-white font-bold text-lg">{day.temp}°</div>
                            <div className="text-zinc-500 text-xs capitalize truncate">{day.description || day.condition}</div>
                        </div>
                    ))}
                </div>

                {/* Insights */}
                <div className="flex-1 p-3 bg-zinc-900/60 rounded-xl border border-white/5 backdrop-blur-sm">
                    <div className="text-zinc-100 font-bold text-sm mb-2">Farming Insights</div>
                    <div className="space-y-2">
                        {data.insights && data.insights.map((insight: any, idx: number) => (
                            <div key={idx} className="flex gap-2 text-xs">
                                <span className="text-zinc-400 font-bold min-w-[60px]">{insight.type}:</span>
                                <span className="text-zinc-300 leading-tight">{insight.message}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const NewsBillboardPreview = ({ data }: any) => (
    <div className="flex flex-col h-full bg-black/80 border-4 border-zinc-800 rounded-xl overflow-hidden shadow-2xl relative">
        {/* TV Frame Gloss */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none z-10" />

        {/* Header Bar */}
        <div className="bg-red-700 px-4 py-2 flex items-center justify-between z-20 shadow-lg shrink-0">
            <div className="flex items-center gap-2">
                <div className="bg-white text-red-700 font-extrabold px-2 py-0.5 text-xs rounded uppercase tracking-wider animate-pulse">
                    LIVE
                </div>
                <div className="text-white font-['Orbitron'] font-bold tracking-wider flex items-center gap-1">
                    <Globe className="w-4 h-4" /> AGRINEWS
                </div>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-xs font-mono">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                {data.liveViewers} watching
            </div>
        </div>

        {/* Main Stage */}
        <div className="flex-1 relative p-6 flex flex-col justify-between bg-gradient-to-b from-zinc-900 to-black">
            {/* Background elements */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent" />

            {/* Breaking Badge - Pushed to top */}
            <div className="relative z-10 flex items-start">
                <div className="bg-yellow-500 text-black font-bold px-3 py-1 text-xs uppercase tracking-widest clip-path-slant flex items-center gap-2 shadow-lg">
                    <TrendingUp className="w-3 h-3" /> Headlines
                </div>
            </div>

            {/* Content Container - Pushed to bottom */}
            <div className="relative z-10 mt-4">
                <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-2 drop-shadow-lg font-['Impact'] tracking-wide">
                    {data.headline}
                </h3>
                <p className="text-zinc-300 text-lg border-l-4 border-red-600 pl-3 bg-black/30 backdrop-blur-sm py-1 pr-2 rounded-r inline-block">
                    {data.subtext}
                </p>
            </div>
        </div>

        {/* Scrolling Ticker */}
        <div className="bg-yellow-400 text-black py-2 overflow-hidden whitespace-nowrap relative z-20 border-t-4 border-red-700 shrink-0">
            <div className="inline-block animate-marquee-fast font-bold uppercase tracking-wider text-sm">
                {data.ticker.map((item: string, i: number) => (
                    <span key={i} className="mx-8">
                        • {item}
                    </span>
                ))}
                {/* Duplicate for seamless loop */}
                {data.ticker.map((item: string, i: number) => (
                    <span key={`dup-${i}`} className="mx-8">
                        • {item}
                    </span>
                ))}
            </div>
        </div>
    </div>
);
