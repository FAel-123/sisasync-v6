import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { 
  Leaf, ArrowRight, ArrowLeft, LayoutDashboard, History, Gift, 
  LogOut, Plus, CheckCircle, XCircle, MapPin, Loader2, 
  Megaphone, Trash2, Zap, Smile, BookOpen, 
  Fish, CloudRain, Users, Hand, Coins, 
  BarChart3, ChevronRight, ExternalLink, Calendar,
  Coffee, FileText, Database, Smartphone, Lock, 
  ShieldCheck, Key, TrendingUp, AlertCircle, Heart,
  Moon, Sun, Globe, Truck, Package, Menu, X, Eye, 
  Image as ImageIcon, Upload, FlaskConical 
} from 'lucide-react';
// IMPORT SUPABASE
import { supabase } from './supabaseClient';

// --- TRANSLATION DICTIONARY ---
const LANG = {
  en: {
    heroTitle: "EDUCYCLE",
    heroDesc: "Transforming waste into education funds.",
    explore: "Explore Mission",
    access: "Access Portal",
    welcome: "Hi,",
    dashboard: "Dashboard",
    calculator: "Eco-Impact",
    newEntry: "Recycle Now",
    co2: "CO2 Removed",
    energy: "Energy Saved",
    life: "Life Saved",
    rewards: "Rewards",
    available: "pts",
    events: "Events",
    join: "Join",
    joined: "Joined",
    logs: "History",
    updates: "News",
    noEvents: "No events.",
    noLogs: "No history.",
    redeemTitle: "Redeem",
    redeemConfirm: "Redeem reward",
    redeemSuccess: "SUCCESS!",
    locked: "LOCKED",
    needMore: "Need more points.",
    admin: "Admin",
    logout: "Logout",
    pickup: "Requests",
    manageEvents: "Events",
    postUpdate: "Update",
    adminPanel: "Admin Panel",
    selectMethod: "Delivery Method",
    methodPickup: "Pickup",
    methodDropoff: "Drop-off",
    fee: "Fee",
    bonus: "Bonus",
    aboutTitle: "Who We Are",
    aboutDesc: "We provide seamless pickup services and recyclables drop-off points.",
    cat1: "Pickup Service",
    desc1: "We come to your doorstep to collect heavy recyclables.",
    cat2: "Merchandise",
    desc2: "Redeem points for exclusive eco-friendly products.",
    cat3: "Programs",
    desc3: "Join our community events and clean-up drives.",
    cat4: "Green R&D",
    desc4: "Developing soap from vegetable enzymes."
  },
  ms: {
    heroTitle: "EDUCYCLE",
    heroDesc: "Mengubah sisa menjadi dana pendidikan.",
    explore: "Misi Kami",
    access: "Masuk",
    welcome: "Hai,",
    dashboard: "Utama",
    calculator: "Impak",
    newEntry: "Kitar Semula",
    co2: "CO2 Disingkir",
    energy: "Tenaga Dijimat",
    life: "Nyawa Selamat",
    rewards: "Ganjaran",
    available: "mata",
    events: "Acara",
    join: "Sertai",
    joined: "Disertai",
    logs: "Sejarah",
    updates: "Berita",
    noEvents: "Tiada acara.",
    noLogs: "Tiada rekod.",
    redeemTitle: "Tebus",
    redeemConfirm: "Tebus ganjaran",
    redeemSuccess: "BERJAYA!",
    locked: "KUNCI",
    needMore: "Mata tak cukup.",
    admin: "Admin",
    logout: "Keluar",
    pickup: "Kutipan",
    manageEvents: "Acara",
    postUpdate: "Berita",
    adminPanel: "Panel Admin",
    selectMethod: "Cara Serahan",
    methodPickup: "Kutipan",
    methodDropoff: "Hantar",
    fee: "Caj",
    bonus: "Bonus",
    aboutTitle: "Tentang Kami",
    aboutDesc: "Servis kutipan dan pusat pengumpulan.",
    cat1: "Servis Kutipan",
    desc1: "Kami datang ke pintu anda untuk mengutip barang.",
    cat2: "Cenderamata",
    desc2: "Tebus mata ganjaran untuk barangan eksklusif.",
    cat3: "Program Komuniti",
    desc3: "Sertai acara gotong-royong dan bengkel kami.",
    cat4: "R&D Hijau",
    desc4: "Menghasilkan sabun daripada enzim sayuran."
  }
};

// --- DATA ---
const REWARDS_DATA = [
  { id: 'r1', name: "RM5 Voucher", cost: 500, icon: Gift },
  { id: 'r2', name: "Notebook", cost: 1200, icon: BookOpen },
  { id: 'r3', name: "Eco-Tee", cost: 2500, icon: Smile },
  { id: 'r4', name: "Straw Kit", cost: 800, icon: Leaf },
  { id: 'r5', name: "Movie Tix", cost: 1500, icon: Gift },
];

// --- MAIN APP ---
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [language, setLanguage] = useState('en'); 
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('educycle_user');
    const savedLang = localStorage.getItem('educycle_lang');
    const savedTheme = localStorage.getItem('educycle_theme');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedLang) setLanguage(savedLang);
    if (savedTheme === 'dark') setIsDark(true);
  }, []);

  const handleSetUser = (user) => {
    setCurrentUser(user);
    if(user) localStorage.setItem('educycle_user', JSON.stringify(user));
    else localStorage.removeItem('educycle_user');
  };

  const toggleLang = () => {
    const newLang = language === 'en' ? 'ms' : 'en';
    setLanguage(newLang);
    localStorage.setItem('educycle_lang', newLang);
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('educycle_theme', newTheme ? 'dark' : 'light');
  };

  const globalProps = { language, setLanguage: toggleLang, isDark, setIsDark: toggleTheme, t: LANG[language] };

  return (
    <Router>
      <style>{`
        ::-webkit-scrollbar { display: none !important; width: 0px; background: transparent; }
        * { -ms-overflow-style: none !important; scrollbar-width: none !important; }
        html, body { overflow-x: hidden; background-color: ${isDark ? '#0f172a' : '#f8fafc'}; color: ${isDark ? '#f8fafc' : '#1e293b'}; }
        .animate-shake { animation: shake 0.3s ease-in-out; border-color: #ef4444 !important; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <AppRoutes currentUser={currentUser} setCurrentUser={handleSetUser} {...globalProps} />
    </Router>
  );
}

function AppRoutes({ currentUser, setCurrentUser, language, setLanguage, isDark, setIsDark, t }) {
  const [dbRequests, setDbRequests] = useState([]);
  const [dbEvents, setDbEvents] = useState([]);
  const [dbNews, setDbNews] = useState([]);
  const [companyFund, setCompanyFund] = useState(3250); 
  const fundGoal = 5000;

  const refreshData = async () => {
    const reqs = await supabase.from('requests').select('*').order('id', { ascending: false });
    const evs = await supabase.from('events').select('*').order('id', { ascending: false });
    const news = await supabase.from('news').select('*').order('id', { ascending: false });
    
    if (reqs.data) setDbRequests(reqs.data);
    
    if (evs.data && evs.data.length > 0) {
        setDbEvents(evs.data);
    } else {
        // Fallback for demo
        setDbEvents([
            { id: 1, title: "Tree Planting", date: "2024-02-01", loc: "Eco Park", participants: 89, zoom_enabled: true, img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop" },
            { id: 2, title: "E-Waste Fix", date: "2024-01-20", loc: "Main Hall", participants: 15, zoom_enabled: false, img: "https://images.unsplash.com/photo-1591485423070-4859c43910da?q=80&w=800&auto=format&fit=crop" },
            { id: 3, title: "Gotong-Royong", date: "2024-01-15", loc: "College", participants: 42, zoom_enabled: true, img: "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?q=80&w=800&auto=format&fit=crop" }
        ]);
    }
    if (news.data && news.data.length > 0) {
        setDbNews(news.data);
    } else {
        setDbNews([
            {id: 1, title: "System Update", content: "Maintenance Sunday 2AM", date: "2025-01-01"},
            {id: 2, title: "Double Points", content: "Recycle Paper 2x points", date: "2025-01-02"}
        ]);
    }
  };

  useEffect(() => { refreshData(); }, []);

  const props = { currentUser, setCurrentUser, dbRequests, dbEvents, dbNews, fetchRequests: refreshData, companyFund, fundGoal, language, setLanguage, isDark, setIsDark, t };

  return (
    <Routes>
      <Route path="/" element={<LandingPage {...props} />} />
      <Route path="/login" element={<LoginPage {...props} />} />
      <Route path="/dashboard" element={<UserDashboard {...props} />} />
      <Route path="/admin-dashboard" element={<AdminDashboard {...props} fetchData={refreshData} />} />
    </Routes>
  );
}

// --- SMART TOGGLES ---
const SettingsToggles = ({ language, setLanguage, isDark, setIsDark, isLanding = false }) => {
    if (isLanding) {
        return (
            <div className="flex items-center gap-2">
                <button onClick={setLanguage} className="p-2 rounded-full font-bold text-[10px] flex items-center gap-1 transition-all bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-md">
                    <Globe size={14}/> {language === 'en' ? 'EN' : 'MS'}
                </button>
                <button onClick={setIsDark} className="p-2 rounded-full transition-all bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-md">
                    {isDark ? <Sun size={14}/> : <Moon size={14}/>}
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <button onClick={setLanguage} className={`p-2 rounded-full font-bold text-[10px] flex items-center gap-1 transition-all border ${isDark ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-sm'}`}>
                <Globe size={14} className={!isDark ? "text-blue-600" : "text-blue-400"}/> {language === 'en' ? 'EN' : 'MS'}
            </button>
            <button onClick={setIsDark} className={`p-2 rounded-full transition-all border ${isDark ? 'bg-slate-800 text-yellow-400 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-sm'}`}>
                {isDark ? <Sun size={14}/> : <Moon size={14} className="text-slate-600"/>}
            </button>
        </div>
    );
};

// 1. LANDING PAGE
function LandingPage({ t, language, setLanguage, isDark, setIsDark }) {
  const navigate = useNavigate();
  return (
    <div className={`font-sans overflow-x-hidden ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
       <header className="relative h-screen flex flex-col items-center justify-center text-center px-4">
         <div className="absolute inset-0 z-0"><img src="https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=2574&auto=format&fit=crop" className="w-full h-full object-cover" alt="Nature"/><div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-black/90 via-black/60 to-slate-900' : 'from-black/70 via-black/40 to-slate-900'}`}></div></div>
         
         <nav className="absolute top-0 w-full z-50 px-6 md:px-12 py-6 flex justify-between items-center">
            <div className="flex items-center gap-2 font-black text-xl md:text-2xl text-white tracking-tight"><div className="bg-emerald-500 p-1.5 md:p-2 rounded-lg flex items-center justify-center"><BookOpen className="text-white w-4 h-4 md:w-6 md:h-6" /><Leaf className="text-emerald-900 w-3 h-3 md:w-4 md:h-4 -ml-1 md:-ml-2 mt-1" /></div> {t.heroTitle}</div>
            <div className="flex items-center gap-3"><SettingsToggles language={language} setLanguage={setLanguage} isDark={isDark} setIsDark={setIsDark} isLanding={true} /><button onClick={() => navigate('/login')} className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full font-bold text-xs md:text-sm hover:bg-white hover:text-emerald-900 transition-all">{t.access}</button></div>
         </nav>

         <div className="relative z-10 max-w-4xl space-y-4 md:space-y-6 animate-fade-in-up mt-10 px-4">
           <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 bg-emerald-500/30 border border-emerald-400/50 rounded-full text-emerald-300 font-bold text-[10px] md:text-xs uppercase tracking-widest backdrop-blur-md"><Zap size={12}/> INITIATIVE</div>
           <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-none">EDUCYCLE<span className="text-emerald-400">.</span></h1>
           <p className="text-lg md:text-2xl text-slate-200 max-w-2xl mx-auto font-light leading-relaxed">{t.heroDesc}</p>
           <button onClick={() => document.getElementById('about-section').scrollIntoView({ behavior: 'smooth' })} className="mt-4 px-8 py-3 md:px-10 md:py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-full text-sm md:text-lg shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] transition-all flex items-center gap-2 mx-auto">{t.explore} <ArrowRight /></button>
         </div>
       </header>
       
       <section id="about-section" className={`py-16 md:py-20 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
         <div className="max-w-full mx-auto px-6">
            <div className="mb-10 max-w-2xl"><h2 className="text-3xl md:text-4xl font-black mb-4">{t.aboutTitle}</h2><p className={`text-base md:text-lg leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.aboutDesc}</p></div>
            
            <div className="flex overflow-x-auto gap-4 md:gap-6 pb-8 snap-x scrollbar-hide md:grid md:grid-cols-4 md:pb-0 md:overflow-visible">
                {[
                    {t: t.cat1, d: t.desc1, i: MapPin, c: "bg-emerald-500", img: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800"}, 
                    {t: t.cat2, d: t.desc2, i: Gift, c: "bg-orange-500", img: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800"}, 
                    {t: t.cat3, d: t.desc3, i: Users, c: "bg-blue-500", img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800"},
                    {t: t.cat4, d: t.desc4, i: FlaskConical, c: "bg-purple-500", img: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=800"} 
                ].map((item, idx) => (
                    <div key={idx} className="snap-center shrink-0 w-[80vw] md:w-auto h-[400px] rounded-3xl overflow-hidden relative group cursor-pointer shadow-xl">
                        <img src={item.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Card"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-6 flex flex-col justify-end">
                            <div className={`${item.c} w-10 h-10 rounded-full flex items-center justify-center mb-4 text-white shadow-lg`}><item.i size={20}/></div>
                            <h3 className="text-2xl font-bold text-white mb-2">{item.t}</h3>
                            <p className="text-slate-300 text-xs md:text-sm leading-relaxed opacity-90">{item.d}</p>
                        </div>
                    </div>
                ))}
            </div>
         </div>
       </section>
    </div>
  );
}

// 2. LOGIN PAGE
function LoginPage({ setCurrentUser, t, isDark }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => { const saved = localStorage.getItem('educycle_user'); if (saved) navigate('/dashboard'); }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault(); setLoading(true);
    setTimeout(() => { setLoading(false);
      if (formData.email.includes('@') && formData.username) { setCurrentUser({ name: formData.username, email: formData.email, role: 'user' }); navigate('/dashboard'); } else { alert("Invalid credentials."); }
    }, 1000);
  };

  const handleAdminUnlock = (e) => {
    e.preventDefault();
    if(adminPasscode === '1234') { setCurrentUser({ name: 'Administrator', email: 'admin@educycle.com', role: 'admin' }); navigate('/admin-dashboard'); } 
    else { setIsShaking(true); setTimeout(() => setIsShaking(false), 300); setAdminPasscode(''); }
  };

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}`}>
       <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden"><img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2670&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-40" alt="Login"/><div className="relative z-10 text-white p-12"><h1 className="text-6xl font-black mb-6">Join the<br/>Cycle.</h1><p className="text-xl text-slate-300">Staff & Students United for a Greener Future.</p></div></div>
       <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 py-12 relative h-screen">
          <button onClick={() => navigate('/')} className={`absolute top-8 left-8 flex items-center gap-2 font-bold text-sm ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-800'}`}><ArrowLeft size={16}/> Back</button>
          <div className="mb-8"><div className="flex items-center gap-2 font-black text-2xl text-emerald-600 mb-2"><BookOpen size={28}/> EDUCYCLE</div><h2 className="text-3xl md:text-4xl font-black">{t.access}</h2><p className="text-slate-500 mt-2 text-sm md:text-base">Enter your details to sync your contribution.</p></div>
          <form onSubmit={handleLogin} className="space-y-4">
             <div><label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Username</label><input type="text" required onChange={e => setFormData({...formData, username: e.target.value})} className={`w-full border rounded-xl p-3 md:p-4 font-bold outline-none focus:ring-2 focus:ring-emerald-500 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}/></div>
             <div><label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label><input type="email" required onChange={e => setFormData({...formData, email: e.target.value})} className={`w-full border rounded-xl p-3 md:p-4 font-bold outline-none focus:ring-2 focus:ring-emerald-500 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}/></div>
             <div><label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Password</label><input type="password" required onChange={e => setFormData({...formData, password: e.target.value})} className={`w-full border rounded-xl p-3 md:p-4 font-bold outline-none focus:ring-2 focus:ring-emerald-500 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}/></div>
             <button disabled={loading} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 flex justify-center items-center gap-2">{loading ? <Loader2 className="animate-spin"/> : "Secure Login"}</button>
          </form>
          <div className="mt-8 flex justify-center"><button onClick={() => setShowAdminModal(true)} className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hover:text-emerald-500 transition-colors flex items-center gap-1"><ShieldCheck size={12}/> {t.admin}</button></div>
       </div>
       {showAdminModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in px-4">
            <div className={`bg-slate-900 w-full max-w-sm p-8 rounded-3xl shadow-2xl border border-slate-700 relative ${isShaking ? 'animate-shake' : ''}`}>
                <button onClick={() => setShowAdminModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><XCircle/></button>
                <div className="text-center mb-6"><div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700"><Lock size={32} className="text-emerald-500"/></div><h3 className="text-xl font-bold text-white">Security Clearance</h3><p className="text-xs text-slate-400 mt-1">Authorized Personnel Only</p></div>
                <form onSubmit={handleAdminUnlock}><div className="mb-6"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block text-center">Enter Passcode</label><div className="relative"><Key className="absolute left-4 top-3.5 text-slate-500" size={18}/><input type="password" maxLength="4" autoFocus value={adminPasscode} onChange={(e) => setAdminPasscode(e.target.value)} placeholder="• • • •" className="w-full bg-slate-950 border border-slate-700 text-white text-center text-2xl tracking-[0.5em] rounded-xl p-3 font-bold outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-slate-700"/></div></div><button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all">Unlock Dashboard</button></form>
            </div>
         </div>
       )}
    </div>
  );
}

// 3. USER DASHBOARD
function UserDashboard({ currentUser, setCurrentUser, dbRequests, dbEvents, dbNews, fetchRequests, companyFund, fundGoal, t, language, setLanguage, isDark, setIsDark }) {
  const navigate = useNavigate();
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState(['Plastic']);
  const [deliveryMethod, setDeliveryMethod] = useState('Pickup');
  const [expandedImage, setExpandedImage] = useState(null); // For Image Zoom

  useEffect(() => { if (!currentUser) navigate('/login'); }, [currentUser, navigate]);
  if (!currentUser) return null;

  const myReqs = dbRequests.filter(r => r.student === currentUser.name && r.status === 'Approved');
  const totalPoints = myReqs.reduce((acc, curr) => acc + (curr.points || 0), 0);
  const fundProgress = Math.min((companyFund / fundGoal) * 100, 100);

  const handleFundClick = () => alert(`📈 INVESTOR UPDATE:\n\nFunds Raised: RM${companyFund.toLocaleString()}\nProgress: ${fundProgress.toFixed(1)}%\nStatus: On Track`);
  const handleLogout = () => { if(window.confirm(`${t.logout}?`)) { setCurrentUser(null); navigate('/'); } };
  const toggleSelection = (id) => { if (selectedTypes.includes(id)) { if (selectedTypes.length > 1) setSelectedTypes(selectedTypes.filter(t => t !== id)); } else { setSelectedTypes([...selectedTypes, id]); } };

  const handleRedeem = (reward) => { if (totalPoints >= reward.cost) { if(window.confirm(`${t.redeemConfirm} "${reward.name}"?`)) { alert(`🎉 ${t.redeemSuccess}\n\nCode: EC-${Math.floor(Math.random() * 9000) + 1000}`); } } else { alert(`🔒 ${t.locked} \n\n${t.needMore}`); } };
  
  const handleJoinEvent = async (ev) => { if(window.confirm(`${t.join} "${ev.title}"?`)) { await supabase.from('events').update({ participants: (ev.participants || 0) + 1 }).eq('id', ev.id); alert(`Success!`); fetchRequests(); } };

  // HANDLE ZOOM (Only if enabled by Admin)
  const handleImageClick = (ev) => {
      if(ev.zoom_enabled) {
          setExpandedImage(ev.img);
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    const weight = parseFloat(e.target.weight.value);
    let points = Math.floor(weight * 10); 
    if (deliveryMethod === 'Pickup') points = Math.max(0, points - 20); else points += 50;
    const { error } = await supabase.from('requests').insert([{ student: currentUser.name, email: currentUser.email, type: selectedTypes.join(', '), weight: weight + 'kg', location: e.target.location.value, status: 'Pending', date: new Date().toISOString().split('T')[0], points, method: deliveryMethod }]);
    if (!error) { alert(`Success!`); setShowNewEntry(false); fetchRequests(); } else { alert("Error"); }
    setLoading(false);
  };

  const wasteOptions = [{ id: 'Plastic', icon: Coffee, color: 'text-blue-500 bg-blue-50', rate: 10 }, { id: 'Paper', icon: FileText, color: 'text-yellow-600 bg-yellow-50', rate: 5 }, { id: 'Tin', icon: Database, color: 'text-gray-600 bg-gray-50', rate: 15 }, { id: 'E-Waste', icon: Smartphone, color: 'text-purple-600 bg-purple-50', rate: 50 }];

  return (
    <div className={`min-h-screen font-sans pb-20 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* HEADER FULL WIDTH DASHBOARD */}
      <header className={`sticky top-0 z-40 shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b`}>
        <div onClick={handleFundClick} className="bg-[#0f172a] text-white py-3 px-6 cursor-pointer group relative overflow-hidden transition-all hover:bg-slate-900"><div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"></div><div className="max-w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4 relative z-10"><div className="flex items-center gap-3"><div className="bg-emerald-500/20 p-2 rounded-xl border border-emerald-500/30 group-hover:scale-110 transition-transform"><BarChart3 size={20} className="text-emerald-400"/></div><div><p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Phase 1 Funding</p><h3 className="font-black text-lg text-white leading-none">SEED ROUND</h3></div></div><div className="flex-1 w-full max-w-2xl"><div className="flex justify-between text-[10px] font-bold mb-1 px-1"><span className="text-emerald-300">RM {companyFund.toLocaleString()}</span><span className="text-slate-500">Goal: RM {fundGoal.toLocaleString()}</span></div><div className="w-full bg-slate-800 h-3 md:h-4 rounded-full overflow-hidden border border-slate-700 shadow-[0_0_10px_rgba(16,185,129,0.15)] relative"><div className="bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-500 h-full rounded-full transition-all duration-1000 relative flex items-center justify-end pr-2" style={{width: `${fundProgress}%`}}><div className="absolute inset-0 w-full h-full bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[length:15px_15px] opacity-30 animate-[pulse_2s_infinite]"></div></div></div></div><div className="hidden md:block"><span className="bg-emerald-500 text-white font-black text-sm px-3 py-1 rounded-lg shadow-lg group-hover:scale-110 transition-transform inline-block">{Math.floor(fundProgress)}%</span></div></div></div>
        <div className={`px-6 py-3 flex justify-between items-center backdrop-blur-md ${isDark ? 'bg-slate-800/80' : 'bg-white/80'}`}>
            <div className="flex items-center gap-2 text-emerald-500 font-black text-lg"><BookOpen size={20}/> EDUCYCLE</div>
            <div className="flex items-center gap-3"><SettingsToggles language={language} setLanguage={setLanguage} isDark={isDark} setIsDark={setIsDark} /><div className="text-right hidden md:block"><p className="text-[10px] opacity-60 font-bold uppercase">{t.welcome}</p><p className="font-bold text-sm">{currentUser.name}</p></div><button onClick={handleLogout} className={`p-2 rounded-full transition-colors ${isDark ? 'bg-slate-700 hover:bg-red-900 text-slate-300' : 'bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500'}`}><LogOut size={16}/></button></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
            <div className="lg:col-span-2 bg-emerald-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg flex flex-col justify-between min-h-[250px]"><div className="relative z-10"><div className="flex justify-between items-start"><div><p className="text-emerald-200 text-[10px] font-bold uppercase tracking-widest mb-1">{t.calculator}</p><h2 className="text-4xl md:text-5xl font-black">{totalPoints} <span className="text-sm font-medium opacity-70">pts</span></h2></div><button onClick={() => setShowNewEntry(true)} className="bg-white text-emerald-800 px-4 py-2 rounded-lg font-bold text-xs shadow-lg hover:bg-emerald-50 active:scale-95 transition-all flex items-center gap-1"><Plus size={14}/> {t.newEntry}</button></div><div className="grid grid-cols-3 gap-2 md:gap-3 mt-6"><div className="bg-emerald-500/30 p-3 md:p-4 rounded-xl backdrop-blur-sm border border-emerald-400/20"><CloudRain className="mb-2 opacity-80" size={18}/><p className="text-xl md:text-2xl font-black">{(totalPoints * 0.12).toFixed(1)}</p><p className="text-[9px] md:text-[10px] opacity-90 leading-tight mt-1 font-medium">{t.co2}</p></div><div className="bg-emerald-500/30 p-3 md:p-4 rounded-xl backdrop-blur-sm border border-emerald-400/20"><Zap className="mb-2 opacity-80" size={18}/><p className="text-xl md:text-2xl font-black">{(totalPoints * 0.5).toFixed(0)}</p><p className="text-[9px] md:text-[10px] opacity-90 leading-tight mt-1 font-medium">{t.energy}</p></div><div className="bg-emerald-500/30 p-3 md:p-4 rounded-xl backdrop-blur-sm border border-emerald-400/20"><Fish className="mb-2 opacity-80" size={18}/><p className="text-xl md:text-2xl font-black">{Math.floor(totalPoints / 100)}</p><p className="text-[9px] md:text-[10px] opacity-90 leading-tight mt-1 font-medium">{t.life}</p></div></div></div><Leaf className="absolute -bottom-8 -right-8 text-emerald-500 w-48 h-48 opacity-20 rotate-12"/></div>
            <div className={`rounded-2xl p-5 border shadow-sm flex flex-col h-[250px] ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}><div className="flex justify-between items-center mb-4"><h3 className="font-bold flex items-center gap-2 text-sm"><Gift className="text-orange-500" size={18}/> {t.rewards}</h3><span className="text-xs font-bold opacity-60">{totalPoints} {t.available}</span></div><div className="flex-1 overflow-y-auto space-y-3 pr-1">{REWARDS_DATA.map(r => (<div key={r.id} onClick={() => handleRedeem(r)} className={`flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer group ${isDark ? 'bg-slate-700 border-slate-600 hover:border-emerald-500' : 'bg-slate-50 border-slate-100 hover:border-emerald-200 hover:bg-emerald-50'}`}><div className="flex items-center gap-3"><div className={`p-2 rounded-lg shadow-sm ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-600'} group-hover:text-emerald-500`}><r.icon size={16}/></div><div><p className="font-bold text-xs md:text-sm">{r.name}</p><p className="text-[10px] font-bold opacity-60">{r.cost} pts</p></div></div><ChevronRight size={16} className="opacity-40 group-hover:text-emerald-500 group-hover:opacity-100"/></div>))}</div></div>
        </div>

        <div className="mb-6"><h3 className="text-lg font-bold mb-3 flex items-center gap-2"><Calendar className="text-blue-500" size={18}/> {t.events}</h3>
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
            {dbEvents.length === 0 ? <p className="text-sm opacity-50">{t.noEvents}</p> : dbEvents.map(ev => (
                <div key={ev.id} className={`snap-start shrink-0 w-[240px] md:w-[260px] rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all group ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                    <div 
                        className={`h-32 md:h-40 overflow-hidden relative bg-slate-200 ${ev.zoom_enabled ? 'cursor-zoom-in' : ''}`}
                        onClick={() => handleImageClick(ev)}
                    >
                        <img src={ev.img || "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?q=80&w=800&auto=format&fit=crop"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={ev.title}/>
                        {ev.zoom_enabled && <div className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"><Eye size={12}/></div>}
                    </div>
                    
                    <div className="p-4">
                        <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase mb-2 ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{ev.date}</span>
                        <h4 className="font-bold text-sm mb-1 truncate">{ev.title}</h4>
                        <p className="text-[10px] opacity-60 flex items-center gap-1 mb-3"><MapPin size={10}/> {ev.loc}</p>
                        
                        <div className="flex items-center justify-between mt-3">
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500"><Users size={12}/> {ev.participants || 0}</span>
                            <button onClick={() => handleJoinEvent(ev)} className={`px-4 py-1.5 border rounded-lg text-[10px] font-bold transition-colors ${isDark ? 'border-slate-600 hover:bg-emerald-600 hover:border-emerald-600 text-slate-300' : 'border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 bg-slate-50'}`}>{t.join}</button>
                        </div>
                    </div>
                </div>
            ))}
        </div></div>

        {/* LOGS & NEWS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2"><h3 className="font-bold mb-3 flex items-center gap-2 text-sm"><History size={16} className="text-purple-500"/> {t.logs}</h3><div className={`rounded-2xl p-4 border shadow-sm min-h-[300px] ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>{dbRequests.filter(r=>r.student === currentUser.name).length === 0 ? <p className="text-center opacity-50 py-20 text-xs">{t.noLogs}</p> : dbRequests.filter(r=>r.student === currentUser.name).map(req => (<div key={req.id} className={`flex justify-between items-center py-4 border-b last:border-0 transition-colors px-2 rounded-lg ${isDark ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-50 hover:bg-slate-50'}`}><div className="flex items-center gap-4"><div className={`w-10 h-10 rounded-full flex items-center justify-center ${req.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : req.status === 'Rejected' ? 'bg-red-100 text-red-500' : 'bg-orange-100 text-orange-500'}`}>{req.status === 'Approved' ? <CheckCircle size={18}/> : req.status === 'Rejected' ? <XCircle size={18}/> : <Loader2 size={18} className="animate-spin"/>}</div><div><p className="font-bold text-sm flex items-center gap-2">{req.type} {req.method === 'Drop-off' && <span className="bg-purple-100 text-purple-600 text-[9px] px-1 rounded">SELF</span>}</p><p className="text-[10px] opacity-60 font-medium">{req.date} • {req.weight} • {req.location}</p></div></div><div className="text-right"><span className="block font-black text-emerald-500 text-sm">+{req.points} pts</span><span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : req.status === 'Rejected' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'}`}>{req.status}</span></div></div>))}</div></div>
            <div><h3 className="font-bold mb-3 flex items-center gap-2 text-sm"><Megaphone size={16} className="text-red-500"/> {t.updates}</h3><div className={`rounded-2xl p-5 border min-h-[300px] ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-blue-50 border-blue-100'}`}>{dbNews.map(n => (<div key={n.id} className={`mb-4 pb-4 border-b last:border-0 ${isDark ? 'border-slate-700' : 'border-blue-100'}`}><span className="bg-blue-200 text-blue-800 text-[9px] font-bold px-2 py-0.5 rounded mb-2 inline-block">{n.date}</span><p className={`font-bold text-sm mb-1 ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>{n.title}</p><p className={`text-[10px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-blue-600'}`}>{n.content}</p></div>))}</div></div>
        </div>
      </main>

      {/* NEW ENTRY MODAL */}
      {showNewEntry && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in"><div className={`w-full max-w-lg rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}><button onClick={() => setShowNewEntry(false)} className="absolute top-4 right-4 opacity-50 hover:opacity-100"><XCircle/></button>
        <div className="text-center mb-6"><h2 className="text-2xl font-black flex items-center justify-center gap-2"><Leaf className="text-emerald-500"/> {t.newEntry}</h2></div>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div onClick={() => setDeliveryMethod('Pickup')} className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${deliveryMethod === 'Pickup' ? 'border-emerald-500 bg-emerald-500/10' : isDark ? 'border-slate-600 hover:border-slate-500' : 'border-slate-100 hover:border-emerald-100'}`}><Truck size={24} className={deliveryMethod === 'Pickup' ? 'text-emerald-500' : 'opacity-50'}/><div className="text-center"><span className="block font-bold text-xs">{t.methodPickup}</span><span className="text-[10px] text-red-400 font-bold">-20 pts ({t.fee})</span></div></div>
                <div onClick={() => setDeliveryMethod('Drop-off')} className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${deliveryMethod === 'Drop-off' ? 'border-emerald-500 bg-emerald-500/10' : isDark ? 'border-slate-600 hover:border-slate-500' : 'border-slate-100 hover:border-emerald-100'}`}><Package size={24} className={deliveryMethod === 'Drop-off' ? 'text-emerald-500' : 'opacity-50'}/><div className="text-center"><span className="block font-bold text-xs">{t.methodDropoff}</span><span className="text-[10px] text-emerald-500 font-bold">+50 pts ({t.bonus})</span></div></div>
            </div>
            <div className="grid grid-cols-2 gap-3">{wasteOptions.map((option) => { const isSelected = selectedTypes.includes(option.id); return (<div key={option.id} onClick={() => toggleSelection(option.id)} className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex flex-col items-center justify-center gap-2 relative ${isSelected ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500' : isDark ? 'border-slate-600 hover:border-slate-500' : 'border-slate-100 hover:border-emerald-200'}`}><div className={`p-3 rounded-full ${option.color}`}><option.icon size={24} /></div><div className="text-center"><span className={`block font-bold text-sm ${isSelected ? 'text-emerald-500' : ''}`}>{option.id}</span><span className="text-[10px] font-bold opacity-60 uppercase tracking-wide">{option.rate} pts/kg</span></div>{isSelected && <div className="absolute top-2 right-2 text-emerald-500"><CheckCircle size={16} fill="currentColor" className={isDark ? 'text-slate-900' : 'text-white'}/></div>}</div>); })}</div>
            <div className="space-y-4"><div><label className="text-xs font-bold opacity-60 uppercase tracking-wider mb-1 block">Location</label><select name="location" className={`w-full border rounded-xl p-3 font-bold outline-none focus:ring-2 focus:ring-emerald-400 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200 text-slate-700'}`}><option>Hostel Block A</option><option>Hostel Block B</option><option>Main Library</option><option>Student Cafe</option><option>Faculty of Eng</option></select></div><div><label className="text-xs font-bold opacity-60 uppercase tracking-wider mb-1 block">Weight (KG)</label><input name="weight" type="number" step="0.1" placeholder="e.g. 2.5" required className={`w-full border-2 rounded-xl p-3 font-bold outline-none focus:border-emerald-400 text-lg ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200 text-slate-700'}`}/></div></div>
            <button disabled={loading} className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg active:scale-95">{loading ? "Calculating..." : "Submit Recycle Entry"}</button>
        </form></div></div>
      )}

      {/* IMAGE ZOOM MODAL */}
      {expandedImage && (
          <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 animate-in fade-in" onClick={() => setExpandedImage(null)}>
              <button className="absolute top-4 right-4 text-white p-2 bg-white/10 rounded-full hover:bg-white/20"><X/></button>
              <img src={expandedImage} className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()} alt="Zoomed"/>
          </div>
      )}
    </div>
  );
}

// 4. ADMIN DASHBOARD
function AdminDashboard({ currentUser, setCurrentUser, dbRequests, dbEvents, dbNews, fetchData, companyFund, t, language, setLanguage, isDark, setIsDark }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [eventForm, setEventForm] = useState({ title: '', date: '', loc: '', img: null, zoom_enabled: false });
  const [uploading, setUploading] = useState(false);

  useEffect(() => { if(currentUser?.role !== 'admin') navigate('/login'); }, [currentUser, navigate]);

  const handleStatus = async (id, status) => { await supabase.from('requests').update({ status }).eq('id', id); fetchData(); };
  
  // IMAGE UPLOAD LOGIC
  const handleImageUpload = async (e) => {
      try {
          // SAFETY CHECK 1: Ensure files exist
          if (!e.target.files || e.target.files.length === 0) return;

          setUploading(true);
          const file = e.target.files[0];
          
          // SAFETY CHECK 2: Ensure file object is valid
          if (!file) throw new Error("No file selected");

          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${fileName}`;

          // UPLOAD TO 'images' BUCKET (LowerCase)
          let { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
          if (uploadError) throw uploadError;

          const { data } = supabase.storage.from('images').getPublicUrl(filePath);
          setEventForm({ ...eventForm, img: data.publicUrl });
          alert("Image uploaded successfully!");
      } catch (error) {
          alert("Upload failed! Did you set the Bucket Policy? Error: " + error.message);
      } finally {
          setUploading(false);
      }
  };

  const handleAddEvent = async (e) => { 
      e.preventDefault(); 
      if (!eventForm.img) return alert("Please upload an image!");
      await supabase.from('events').insert([eventForm]); 
      alert("Event Published!"); fetchData(); 
      setEventForm({ title: '', date: '', loc: '', img: null, zoom_enabled: false }); 
  };
  
  // --- NEW: DELETE EVENT FEATURE ---
  const handleDeleteEvent = async (id) => {
      if(window.confirm("Are you sure you want to delete this event? This cannot be undone.")) {
          const { error } = await supabase.from('events').delete().eq('id', id);
          if(error) {
              alert("Error deleting event: " + error.message);
          } else {
              alert("Event deleted successfully.");
              fetchData(); // Refresh list immediately
          }
      }
  };

  const handleAddNews = async (e) => { e.preventDefault(); await supabase.from('news').insert([{ title: e.target.title.value, content: e.target.content.value, date: new Date().toISOString().split('T')[0] }]); alert("Announcement Posted!"); fetchData(); e.target.reset(); };

  const totalUsers = new Set(dbRequests.map(r => r.student)).size;
  const pendingCount = dbRequests.filter(r => r.status === 'Pending').length;

  return (
    <div className={`min-h-screen flex font-sans ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
        <aside className={`w-64 flex flex-col fixed h-full z-20 ${isDark ? 'bg-slate-950 text-slate-400' : 'bg-slate-900 text-slate-400'}`}>
            <div className="p-6 text-white font-black text-2xl flex items-center gap-2"><LayoutDashboard className="text-emerald-500"/> ADMIN</div>
            <nav className="flex-1 px-4 space-y-2">
                <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'overview' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800'}`}><BarChart3 size={18}/> Overview</button>
                <button onClick={() => setActiveTab('requests')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'requests' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800'}`}><ShieldCheck size={18}/> Requests <span className="bg-red-500 text-white text-[10px] px-2 rounded-full ml-auto">{pendingCount}</span></button>
                <button onClick={() => setActiveTab('events')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'events' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800'}`}><Calendar size={18}/> Manage Events</button>
                <button onClick={() => setActiveTab('news')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'news' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800'}`}><Megaphone size={18}/> Announcements</button>
            </nav>
            <div className="p-4"><button onClick={() => navigate('/')} className="w-full flex items-center gap-2 p-3 text-red-400 font-bold hover:bg-slate-800 rounded-xl transition-all"><LogOut size={18}/> Logout</button></div>
        </aside>

        <main className="ml-64 flex-1 p-10">
            {/* ADMIN HEADER FIXED */}
            <div className="flex justify-between items-center mb-8 px-6">
                <h2 className="text-3xl font-black">{activeTab === 'overview' ? t.adminPanel : activeTab === 'requests' ? t.pickup : activeTab === 'events' ? t.manageEvents : t.updates}</h2>
                <div className="flex items-center gap-3">
                    <SettingsToggles language={language} setLanguage={setLanguage} isDark={isDark} setIsDark={setIsDark} />
                    <div className={`px-4 py-2 rounded-full border font-bold text-sm flex items-center gap-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 text-slate-700'}`}>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Administrator
                    </div>
                </div>
            </div>

            <div className="px-6">
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* FLUID RESPONSIVE GRID FIX */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className={`p-6 rounded-2xl shadow-sm border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}><div className="flex flex-col"><p className="text-[10px] font-bold uppercase opacity-60 mb-2">Total Users</p><div className="flex items-center gap-4"><div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Users size={24}/></div><h3 className="text-3xl font-black">{totalUsers}</h3></div></div></div>
                        <div className={`p-6 rounded-2xl shadow-sm border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}><div className="flex flex-col"><p className="text-[10px] font-bold uppercase opacity-60 mb-2">Total Funding</p><div className="flex items-center gap-4"><div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><Coins size={24}/></div><h3 className="text-3xl font-black">RM {companyFund}</h3></div></div></div>
                        <div className={`p-6 rounded-2xl shadow-sm border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}><div className="flex flex-col"><p className="text-[10px] font-bold uppercase opacity-60 mb-2">Pending Req</p><div className="flex items-center gap-4"><div className="p-3 bg-orange-100 text-orange-600 rounded-xl"><AlertCircle size={24}/></div><h3 className="text-3xl font-black">{pendingCount}</h3></div></div></div>
                    </div>
                    <div className={`p-6 rounded-2xl shadow-sm border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                        <h3 className="font-bold mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-emerald-500"/> Funding History</h3>
                        <div className="space-y-3">
                            <div className={`flex justify-between items-center p-3 rounded-xl ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}><span className="font-bold">Seed Round A</span><span className="text-emerald-500 font-black">+RM 2,000</span></div>
                            <div className={`flex justify-between items-center p-3 rounded-xl ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}><span className="font-bold">Angel Investor</span><span className="text-emerald-500 font-black">+RM 1,250</span></div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'requests' && (
                <div className={`rounded-2xl shadow-sm border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <table className="w-full text-left">
                        <thead className={`text-xs uppercase ${isDark ? 'bg-slate-900 text-slate-400' : 'bg-slate-50 text-slate-400'}`}><tr><th className="p-4">Student</th><th className="p-4">Method</th><th className="p-4">Type</th><th className="p-4">Location</th><th className="p-4">Status</th><th className="p-4 text-right">Action</th></tr></thead>
                        <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-100'}`}>
                            {dbRequests.map(req => (
                                <tr key={req.id} className={`${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'} transition-colors`}>
                                    <td className="p-4 font-bold">{req.student}</td>
                                    <td className="p-4 text-sm opacity-80 flex items-center gap-2">{req.method === 'Drop-off' ? <Package size={14} className="text-purple-500"/> : <Truck size={14} className="text-blue-500"/>} {req.method || 'Pickup'}</td>
                                    <td className="p-4 text-sm opacity-80">{req.type} ({req.weight})</td>
                                    <td className="p-4 text-sm opacity-80">{req.location}</td>
                                    <td className="p-4"><span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${req.status === 'Pending' ? 'bg-orange-100 text-orange-600' : req.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>{req.status}</span></td>
                                    <td className="p-4 text-right space-x-2 flex justify-end">{req.status === 'Pending' && (<><button onClick={() => handleStatus(req.id, 'Approved')} className="bg-emerald-500 text-white p-2 rounded-lg hover:bg-emerald-600"><CheckCircle size={16}/></button><button onClick={() => handleStatus(req.id, 'Rejected')} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"><XCircle size={16}/></button></>)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'events' && (
                <div>
                    <div className={`p-6 rounded-2xl shadow-sm border mb-8 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                        <h4 className="font-bold mb-4">Create New Event</h4>
                        <form onSubmit={handleAddEvent} className="grid grid-cols-2 gap-4">
                            <input value={eventForm.title} onChange={e=>setEventForm({...eventForm, title: e.target.value})} placeholder="Event Title" required className={`border p-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-500 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}/>
                            <input value={eventForm.date} onChange={e=>setEventForm({...eventForm, date: e.target.value})} placeholder="Date (e.g 25 Dec 2025)" required className={`border p-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-500 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}/>
                            
                            {/* --- FILE UPLOAD INPUT --- */}
                            <div className="col-span-2">
                                <label className={`block text-xs font-bold mb-2 uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Cover Image</label>
                                <div className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDark ? 'border-slate-700 hover:border-emerald-500' : 'border-slate-300 hover:border-emerald-500'}`}>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="fileUpload"/>
                                    <label htmlFor="fileUpload" className="flex flex-col items-center cursor-pointer">
                                        {uploading ? <Loader2 className="animate-spin text-emerald-500"/> : <Upload className="text-slate-400 mb-2"/>}
                                        <span className="text-xs font-bold text-slate-500">{uploading ? "Uploading..." : eventForm.img ? "Image Uploaded!" : "Click to Upload Image"}</span>
                                    </label>
                                </div>
                            </div>
                            
                            <input value={eventForm.loc} onChange={e=>setEventForm({...eventForm, loc: e.target.value})} placeholder="Location" required className={`border p-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-500 col-span-2 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}/>
                            
                            {/* ZOOM TOGGLE */}
                            <div className={`flex items-center justify-between p-3 border rounded-xl ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                <span className="text-sm font-bold opacity-70 flex items-center gap-2"><ImageIcon size={16}/> Allow Image Zoom?</span>
                                <button type="button" onClick={() => setEventForm({...eventForm, zoom_enabled: !eventForm.zoom_enabled})} className={`w-10 h-5 rounded-full relative transition-colors ${eventForm.zoom_enabled ? 'bg-emerald-500' : 'bg-slate-400'}`}>
                                    <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${eventForm.zoom_enabled ? 'left-6' : 'left-1'}`}></div>
                                </button>
                            </div>

                            <button className="col-span-2 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700">Publish Event</button>
                        </form>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dbEvents.map(ev => (
                            <div key={ev.id} className={`p-4 rounded-xl border shadow-sm relative group ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                {/* DELETE BUTTON */}
                                <button onClick={() => handleDeleteEvent(ev.id)} className="absolute top-2 right-2 z-10 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"><Trash2 size={14}/></button>
                                
                                <div className="h-32 overflow-hidden rounded-lg mb-3 relative">
                                    <img src={ev.img || "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?q=80&w=800&auto=format&fit=crop"} className="w-full h-full object-cover"/>
                                    {ev.zoom_enabled && <div className="absolute bottom-2 right-2 bg-black/60 text-white p-1 rounded-md"><Eye size={12}/></div>}
                                </div>
                                <h4 className="font-bold">{ev.title}</h4>
                                <p className="text-xs opacity-60">{ev.date} • {ev.loc}</p>
                                <div className={`mt-4 p-2 rounded-lg flex items-center justify-between ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
                                    <span className="text-[10px] font-bold uppercase opacity-60">Total Joined</span>
                                    <span className="flex items-center gap-1 font-black text-emerald-500"><Users size={14}/> {ev.participants || 0}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'news' && (
                <div>
                    <div className={`p-6 rounded-2xl shadow-sm border mb-8 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                        <h4 className="font-bold mb-4">{t.postUpdate}</h4>
                        <form onSubmit={handleAddNews} className="space-y-4">
                            <input name="title" placeholder="Subject" required className={`w-full border p-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-500 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}/>
                            <textarea name="content" placeholder="Message..." required rows="3" className={`w-full border p-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-500 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}></textarea>
                            <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700">Post Announcement</button>
                        </form>
                    </div>
                    <div className="space-y-4">
                        {dbNews.map(n => (
                            <div key={n.id} className={`p-4 rounded-xl border shadow-sm flex justify-between items-start ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                <div><h4 className="font-bold">{n.title}</h4><p className="text-xs opacity-60 mt-1">{n.content}</p></div>
                                <span className={`text-[10px] px-2 py-1 rounded font-bold ${isDark ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{n.date}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            </div>
        </main>
    </div>
  );
}