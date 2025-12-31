import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { 
  Leaf, ArrowRight, ArrowLeft, LayoutDashboard, History, Gift, 
  LogOut, Plus, CheckCircle, XCircle, MapPin, Loader2, 
  Megaphone, Trash2, Zap, Smile, BookOpen, 
  Fish, CloudRain, Users, Hand, Coins, 
  BarChart3, ChevronRight, ExternalLink, Calendar
} from 'lucide-react';
// IMPORT SUPABASE
import { supabase } from './supabaseClient';

// --- CONFIG & TEXT ---
const t = {
  en: {
    appName: "EDUCYCLE", slogan: "Knowledge for Earth. Cycle for Future.",
    heroTitle: "EDUCYCLE", heroSubtitle: "INITIATIVE",
    heroDesc: "A campus-wide ecosystem transforming waste into education funds and green innovation.",
    getStarted: "Explore Mission", login: "Access Portal",
    aboutTitle: "Who We Are", 
    aboutDesc: "We provide a seamless pickup service for recyclables and drop-off points across campus. Our goal is to reduce landfill waste while funding student activities.",
    cat1: "Our Programs", cat1Desc: "Community-driven events like 'Gotong-Royong' and Eco-Workshops.",
    cat2: "Merchandise", cat2Desc: "Upcycled products: Notebooks, Tote bags, and Reusable kits.",
    cat3: "Pickup Service", cat3Desc: "Door-to-door collection for heavy recyclables at hostels & faculties.",
    dashboard: "Dashboard", welcome: "Welcome back,",
    fundingTitle: "Company Seed Fund", fundingDesc: "Current round funding for Phase 1 expansion.",
    raised: "Raised", goal: "Target",
    impactTitle: "Eco-Impact Calculator", 
    redeemTitle: "Rewards Center", redeemDesc: "Redeem vouchers & exclusive merch.",
    eventsTitle: "Upcoming Events", joinBtn: "Join Event",
    newsTitle: "Announcements", pending: "Pending", approved: "Verified",
    newReq: "New Recycle Entry",
    fundCTA: "Fund Us"
  }
};

const REWARDS_DATA = [
  { id: 'r1', name: "RM5 Cafeteria", cost: 500, icon: Gift },
  { id: 'r2', name: "EduCycle Notebook", cost: 1200, icon: BookOpen },
  { id: 'r3', name: "Exclusive Tee", cost: 2500, icon: Smile },
];

const EVENTS_DATA = [
  { id: 1, title: "Gotong-Royong Perdana", date: "15 Jan 2025", loc: "Central Lake", img: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=600&auto=format&fit=crop" },
  { id: 2, title: "FunRun EcoLife 5KM", date: "20 Feb 2025", loc: "Stadium Arena", img: "https://images.unsplash.com/photo-1452626038306-369663ca05bb?q=80&w=600&auto=format&fit=crop" },
  { id: 3, title: "E-Waste Workshop", date: "05 Mar 2025", loc: "Eng. Hall", img: "https://images.unsplash.com/photo-1581092921461-eab62e97a782?q=80&w=600&auto=format&fit=crop" },
];

// --- MAIN APP COMPONENT ---
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  
  // AUTO-LOGIN LOGIC (PERSISTENCE)
  useEffect(() => {
    const savedUser = localStorage.getItem('educycle_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleSetUser = (user) => {
    setCurrentUser(user);
    if(user) localStorage.setItem('educycle_user', JSON.stringify(user));
    else localStorage.removeItem('educycle_user');
  };

  return (
    <Router>
      <AppRoutes currentUser={currentUser} setCurrentUser={handleSetUser} />
    </Router>
  );
}

function AppRoutes({ currentUser, setCurrentUser }) {
  const [dbRequests, setDbRequests] = useState([]);
  
  // Funding State (Shark Tank Feature)
  const [companyFund, setCompanyFund] = useState(3250); // Mula RM3250
  const fundGoal = 5000;

  // FETCH DATA
  const fetchRequests = async () => {
    const { data } = await supabase.from('requests').select('*').order('id', { ascending: false });
    if (data) setDbRequests(data);
  };

  useEffect(() => { fetchRequests(); }, []);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage setCurrentUser={setCurrentUser} />} />
      <Route path="/dashboard" element={<UserDashboard currentUser={currentUser} setCurrentUser={setCurrentUser} dbRequests={dbRequests} fetchRequests={fetchRequests} companyFund={companyFund} setCompanyFund={setCompanyFund} fundGoal={fundGoal}/>} />
      <Route path="/admin-dashboard" element={<AdminDashboard currentUser={currentUser} setCurrentUser={setCurrentUser} dbRequests={dbRequests} fetchRequests={fetchRequests}/>} />
    </Routes>
  );
}

// 1. LANDING PAGE (REBRANDED)
function LandingPage() {
  const navigate = useNavigate();
  const txt = t.en;

  const scrollToAbout = () => {
    document.getElementById('about-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="font-sans bg-slate-50 text-slate-800 overflow-x-hidden">
       {/* HERO SECTION */}
       <header className="relative h-screen flex flex-col items-center justify-center text-center px-4">
         <div className="absolute inset-0 z-0">
            {/* Background Image: Realistic Campus/Nature */}
            <img src="https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=2574&auto=format&fit=crop" className="w-full h-full object-cover" alt="Nature"/>
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-slate-900"></div>
         </div>
         
         <nav className="absolute top-0 w-full z-50 px-6 py-6 flex justify-between items-center">
            <div className="flex items-center gap-2 font-black text-2xl text-white tracking-tight">
                {/* LOGO: BOOK + LEAF */}
                <div className="bg-emerald-500 p-2 rounded-lg flex items-center justify-center">
                    <BookOpen className="text-white w-6 h-6" />
                    <Leaf className="text-emerald-900 w-4 h-4 -ml-2 mt-2" />
                </div>
                {txt.appName}
            </div>
            <button onClick={() => navigate('/login')} className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2 rounded-full font-bold hover:bg-white hover:text-emerald-900 transition-all">{txt.login}</button>
         </nav>

         <div className="relative z-10 max-w-4xl space-y-6 animate-fade-in-up mt-10">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/30 border border-emerald-400/50 rounded-full text-emerald-300 font-bold text-xs uppercase tracking-widest backdrop-blur-md">
             <Zap size={14}/> {txt.heroSubtitle}
           </div>
           <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none">
             {txt.heroTitle}<span className="text-emerald-400">.</span>
           </h1>
           <p className="text-xl md:text-2xl text-slate-200 max-w-2xl mx-auto font-light leading-relaxed">
             {txt.heroDesc}
           </p>
           <button onClick={scrollToAbout} className="mt-8 px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-full text-lg shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] transition-all flex items-center gap-2 mx-auto">
             {txt.getStarted} <ArrowRight />
           </button>
         </div>
         
         {/* Scroll Indicator */}
         <div className="absolute bottom-10 animate-bounce text-white/50">
            <p className="text-xs uppercase tracking-widest mb-2">Scroll to Discover</p>
            <ArrowRight className="rotate-90 mx-auto" />
         </div>
       </header>

       {/* ABOUT US SECTION (SCROLLABLE CARDS) */}
       <section id="about-section" className="py-20 bg-white">
         <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12 max-w-2xl">
                <h2 className="text-4xl font-black text-slate-900 mb-4">{txt.aboutTitle}</h2>
                <p className="text-lg text-slate-500 leading-relaxed">{txt.aboutDesc}</p>
            </div>

            {/* HORIZONTAL SCROLL CONTAINER */}
            <div className="flex overflow-x-auto gap-6 pb-8 snap-x scrollbar-hide">
                {/* CARD 1: SERVICE */}
                <div className="snap-center shrink-0 w-[85vw] md:w-[400px] h-[500px] rounded-3xl overflow-hidden relative group cursor-pointer shadow-xl">
                    <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Service"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 flex flex-col justify-end">
                        <div className="bg-emerald-500 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-white"><MapPin /></div>
                        <h3 className="text-3xl font-bold text-white mb-2">{txt.cat3}</h3>
                        <p className="text-slate-300">{txt.cat3Desc}</p>
                    </div>
                </div>

                {/* CARD 2: PRODUCTS */}
                <div className="snap-center shrink-0 w-[85vw] md:w-[400px] h-[500px] rounded-3xl overflow-hidden relative group cursor-pointer shadow-xl">
                    <img src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Product"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 flex flex-col justify-end">
                        <div className="bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-white"><Gift /></div>
                        <h3 className="text-3xl font-bold text-white mb-2">{txt.cat2}</h3>
                        <p className="text-slate-300">{txt.cat2Desc}</p>
                    </div>
                </div>

                {/* CARD 3: PROGRAMS */}
                <div className="snap-center shrink-0 w-[85vw] md:w-[400px] h-[500px] rounded-3xl overflow-hidden relative group cursor-pointer shadow-xl">
                    <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Program"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 flex flex-col justify-end">
                        <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-white"><Users /></div>
                        <h3 className="text-3xl font-bold text-white mb-2">{txt.cat1}</h3>
                        <p className="text-slate-300">{txt.cat1Desc}</p>
                    </div>
                </div>
            </div>
         </div>
       </section>
    </div>
  );
}

// 2. LOGIN PAGE (GENERAL USER + STEALTH ADMIN)
function LoginPage({ setCurrentUser }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  // Auto-redirect if already logged in (persistence)
  useEffect(() => {
    const saved = localStorage.getItem('educycle_user');
    if (saved) navigate('/dashboard');
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      // Logic Login
      if (formData.email === 'admin' && formData.password === 'admin') {
        setCurrentUser({ name: 'Admin', email: 'admin@educycle.com', role: 'admin' });
        navigate('/admin-dashboard');
      } else {
        // General User (Staff/Student)
        if (formData.email.includes('@') && formData.username) {
            setCurrentUser({ name: formData.username, email: formData.email, role: 'user' });
            navigate('/dashboard');
        } else {
            alert("Please enter valid credentials.");
        }
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex">
       {/* Left Side - Image */}
       <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
          <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2670&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-40" alt="Login"/>
          <div className="relative z-10 text-white p-12">
             <h1 className="text-6xl font-black mb-6">Join the<br/>Cycle.</h1>
             <p className="text-xl text-slate-300">Staff & Students United for a Greener Future.</p>
          </div>
       </div>

       {/* Right Side - Form */}
       <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 py-12 relative">
          <button onClick={() => navigate('/')} className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-slate-800 font-bold text-sm"><ArrowLeft size={16}/> Back</button>
          
          <div className="mb-10">
             <div className="flex items-center gap-2 font-black text-2xl text-emerald-600 mb-2">
                <BookOpen size={28}/> EDUCYCLE
             </div>
             <h2 className="text-4xl font-black text-slate-900">Access Portal</h2>
             <p className="text-slate-500 mt-2">Enter your details to sync your contribution.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
             <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Username</label>
                <input type="text" required onChange={e => setFormData({...formData, username: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold outline-none focus:ring-2 focus:ring-emerald-500"/>
             </div>
             <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                <input type="email" required onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold outline-none focus:ring-2 focus:ring-emerald-500"/>
             </div>
             <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Password</label>
                <input type="password" required onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold outline-none focus:ring-2 focus:ring-emerald-500"/>
             </div>
             
             <button disabled={loading} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 flex justify-center items-center gap-2">
                {loading ? <Loader2 className="animate-spin"/> : "Secure Login"}
             </button>
          </form>

          {/* STEALTH ADMIN BUTTON */}
          <button onClick={() => { setFormData({username: 'Admin', email: 'admin', password: ''}); alert("Admin Mode Activated. Enter Password: 'admin'"); }} className="mt-8 text-[10px] text-slate-200 hover:text-slate-400 font-bold uppercase tracking-widest text-center transition-colors">
             Admin Access
          </button>
       </div>
    </div>
  );
}

// 3. USER DASHBOARD (SHARK TANK FEATURES)
function UserDashboard({ currentUser, setCurrentUser, dbRequests, fetchRequests, companyFund, setCompanyFund, fundGoal }) {
  const navigate = useNavigate();
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (!currentUser) navigate('/login'); }, [currentUser, navigate]);
  if (!currentUser) return null;

  // AI CALCULATIONS
  const myReqs = dbRequests.filter(r => r.student === currentUser.name && r.status === 'Approved');
  const totalPoints = myReqs.reduce((acc, curr) => acc + (curr.points || 0), 0);
  const co2 = (totalPoints * 0.12).toFixed(1);
  const energy = (totalPoints * 0.5).toFixed(0);

  // FUNDING BAR LOGIC
  const fundProgress = Math.min((companyFund / fundGoal) * 100, 100);

  // EVENT JOIN SIMULATION
  const handleJoinEvent = (title) => {
    // Simulasi buka Google Form
    if(window.confirm(`Redirecting to Google Form for "${title}"...`)) {
       // window.open('https://forms.google.com', '_blank'); // Uncomment if real
    }
  };

  const handleLogout = () => {
    if(window.confirm("Log out?")) {
        setCurrentUser(null);
        navigate('/');
    }
  };

  // SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const type = e.target.type.value;
    const weight = e.target.weight.value;
    const points = Math.floor(weight * 10); // Simple logic
    const today = new Date().toISOString().split('T')[0];

    const { error } = await supabase.from('requests').insert([{
        student: currentUser.name, email: currentUser.email, type: type, weight: weight+'kg', location: 'Drop-off Point', status: 'Pending', date: today, points: points
    }]);

    if (!error) { alert("Success!"); setShowNewEntry(false); fetchRequests(); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* HEADER WITH FUNDING BAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        {/* Funding Bar (Top Strip) */}
        <div className="bg-slate-900 text-slate-300 text-[10px] py-2 px-4 md:px-10 flex items-center justify-between">
            <div className="flex items-center gap-2"><BarChart3 size={12} className="text-emerald-400"/> <span>{t.en.fundingTitle}</span></div>
            <div className="flex items-center gap-4 w-1/2 md:w-1/3">
                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{width: `${fundProgress}%`}}></div>
                </div>
                <span className="font-bold text-white whitespace-nowrap">RM{companyFund} / {fundGoal}</span>
            </div>
        </div>

        <div className="px-4 md:px-10 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-emerald-700 font-black text-xl">
                <BookOpen size={24}/> EDUCYCLE
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t.en.welcome}</p>
                    <p className="font-bold text-slate-800">{currentUser.name}</p>
                    <p className="text-[10px] text-emerald-600">{currentUser.email}</p>
                </div>
                <button onClick={handleLogout} className="bg-slate-100 p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"><LogOut size={18}/></button>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-10 py-8">
        
        {/* TOP ROW: IMPACT & REDEEM (SIDE BY SIDE) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* 1. IMPACT CARD (2/3 Width) */}
            <div className="lg:col-span-2 bg-emerald-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl flex flex-col justify-between min-h-[250px]">
                <div className="relative z-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-emerald-200 text-xs font-bold uppercase tracking-widest mb-1">{t.en.impactTitle}</p>
                            <h2 className="text-5xl font-black">{totalPoints} <span className="text-lg font-medium opacity-70">pts</span></h2>
                        </div>
                        <button onClick={() => setShowNewEntry(true)} className="bg-white text-emerald-800 px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-emerald-50 active:scale-95 transition-all flex items-center gap-2">
                            <Plus size={16}/> {t.en.newReq}
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-8">
                        <div className="bg-emerald-500/30 p-4 rounded-2xl backdrop-blur-sm border border-emerald-400/20">
                            <CloudRain className="mb-2 opacity-80" size={20}/>
                            <p className="text-2xl font-bold">{co2}</p>
                            <p className="text-[10px] uppercase opacity-70">kg CO2 Saved</p>
                        </div>
                        <div className="bg-emerald-500/30 p-4 rounded-2xl backdrop-blur-sm border border-emerald-400/20">
                            <Zap className="mb-2 opacity-80" size={20}/>
                            <p className="text-2xl font-bold">{energy}</p>
                            <p className="text-[10px] uppercase opacity-70">kWh Energy</p>
                        </div>
                        <div className="bg-emerald-500/30 p-4 rounded-2xl backdrop-blur-sm border border-emerald-400/20">
                            <Fish className="mb-2 opacity-80" size={20}/>
                            <p className="text-2xl font-bold">{Math.floor(totalPoints/100)}</p>
                            <p className="text-[10px] uppercase opacity-70">Marine Life</p>
                        </div>
                    </div>
                </div>
                <Leaf className="absolute -bottom-10 -right-10 text-emerald-500 w-64 h-64 opacity-20 rotate-12"/>
            </div>

            {/* 2. REDEEM SECTION (1/3 Width) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2"><Gift size={18} className="text-orange-500"/> {t.en.redeemTitle}</h3>
                    <span className="text-xs font-bold text-slate-400">{totalPoints} available</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                    {REWARDS_DATA.map(r => (
                        <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-2 rounded-lg shadow-sm text-slate-600 group-hover:text-emerald-600"><r.icon size={16}/></div>
                                <div>
                                    <p className="font-bold text-sm text-slate-700">{r.name}</p>
                                    <p className="text-[10px] text-slate-400 font-bold">{r.cost} pts</p>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-slate-300 group-hover:text-emerald-500"/>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* EVENTS SCROLL SECTION (NEW FEATURE) */}
        <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Calendar className="text-blue-500"/> {t.en.eventsTitle}</h3>
            
            {/* Horizontal Scroll Area */}
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x scrollbar-hide">
                {EVENTS_DATA.map(ev => (
                    <div key={ev.id} className="snap-start shrink-0 w-[280px] bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="h-32 overflow-hidden relative">
                            <img src={ev.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={ev.title}/>
                            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide text-slate-800">{ev.date}</div>
                        </div>
                        <div className="p-4">
                            <h4 className="font-bold text-slate-800 mb-1 truncate">{ev.title}</h4>
                            <p className="text-xs text-slate-500 flex items-center gap-1 mb-4"><MapPin size={12}/> {ev.loc}</p>
                            <button onClick={() => handleJoinEvent(ev.title)} className="w-full py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors flex items-center justify-center gap-2">
                                {t.en.joinBtn} <ExternalLink size={12}/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* BOTTOM: HISTORY & ANNOUNCEMENTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><History size={18} className="text-purple-500"/> Activity Log</h3>
                <div className="bg-white rounded-3xl p-1 border border-slate-200 shadow-sm min-h-[200px]">
                    {myReqs.length === 0 ? <p className="text-center text-slate-400 py-10 text-sm">No recent activity.</p> : 
                        myReqs.map(req => (
                            <div key={req.id} className="flex justify-between items-center p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><CheckCircle size={18}/></div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">{req.type}</p>
                                        <p className="text-xs text-slate-400">{req.date} • {req.weight}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-black text-emerald-500">+{req.points} pts</span>
                            </div>
                        ))
                    }
                </div>
            </div>
            
            <div>
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Megaphone size={18} className="text-red-500"/> Announcements</h3>
                <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
                    <div className="mb-4 pb-4 border-b border-blue-100">
                        <p className="font-bold text-blue-900 text-sm mb-1">System Maintenance</p>
                        <p className="text-xs text-blue-600">Server upgrade scheduled for this Sunday at 2 AM.</p>
                    </div>
                    <div>
                        <p className="font-bold text-blue-900 text-sm mb-1">Double Points Day!</p>
                        <p className="text-xs text-blue-600">Recycle E-Waste next Monday to get 2x Eco-Credits.</p>
                    </div>
                </div>
            </div>
        </div>
      </main>

      {/* NEW ENTRY MODAL */}
      {showNewEntry && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
                <button onClick={() => setShowNewEntry(false)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><XCircle/></button>
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2"><Leaf className="text-emerald-500"/> Recycle</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Type</label>
                        <select name="type" className="w-full border-2 border-slate-100 rounded-xl p-3 font-bold mt-1">
                            <option>Plastic</option><option>Paper</option><option>E-Waste</option><option>Tin</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Weight (KG)</label>
                        <input name="weight" type="number" step="0.1" className="w-full border-2 border-slate-100 rounded-xl p-3 font-bold mt-1" required/>
                    </div>
                    <button disabled={loading} className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors">
                        {loading ? "Submitting..." : "Submit Entry"}
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}

// 4. ADMIN DASHBOARD (SIMPLE)
function AdminDashboard({ currentUser, fetchRequests, dbRequests }) {
  const navigate = useNavigate();
  useEffect(() => { if(currentUser?.role !== 'admin') navigate('/login'); }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10">
        <h1 className="text-3xl font-black mb-10 flex items-center gap-3"><LayoutDashboard className="text-emerald-400"/> Admin Command Center</h1>
        <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
            <table className="w-full text-left">
                <thead className="bg-slate-950 text-slate-400 text-xs uppercase">
                    <tr><th className="p-4">User</th><th className="p-4">Type</th><th className="p-4">Status</th></tr>
                </thead>
                <tbody>
                    {dbRequests.map(req => (
                        <tr key={req.id} className="border-t border-slate-700">
                            <td className="p-4">{req.student}</td>
                            <td className="p-4">{req.type} ({req.weight})</td>
                            <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${req.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>{req.status}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <button onClick={() => navigate('/')} className="mt-8 text-slate-400 hover:text-white flex items-center gap-2"><LogOut size={16}/> Logout</button>
    </div>
  );
}