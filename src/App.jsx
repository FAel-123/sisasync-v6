import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import { 
  RefreshCw, Leaf, ArrowRight, LayoutDashboard, History, Gift, 
  LogOut, Plus, CheckCircle, XCircle, MapPin, Loader2, Search, 
  Megaphone, Trash2, Zap, Smile, CircuitBoard,
  Fish, CloudRain, ClipboardList, Users, Package, BarChart3, 
  Ticket, Shirt, Utensils, Lock, Database, Smartphone, FileText, Coffee
} from 'lucide-react';
// IMPORT SUPABASE
import { supabase } from './supabaseClient';

// --- DATABASE BAHASA ---
const t = {
  en: {
    appName: "SisaSync", slogan: "Synchronize Waste. Sustain Life.",
    heroTitle: "SISASYNC", heroSubtitle: "NETWORK",
    heroDesc: "Integrated engineering solution for campus waste. Sync data to the cloud.",
    getStarted: "Get Started", login: "Login", welcomeBack: "Welcome,",
    dashboard: "Hub", history: "History", rewards: "Redeem", logout: "Log Out",
    newRequest: "New Entry", totalPoints: "Eco-Credits", recentActivity: "Recent Activity",
    status: "Status", wasteType: "Select Material", locationLabel: "Location",
    weightKg: "Weight (kg)", submit: "Submit Data", studentTab: "Student",
    adminTab: "Admin", pending: "Pending", approved: "Completed", rejected: "Rejected",
    newsFeed: "Updates", manageReq: "Requests", announcements: "Alerts",
    postNews: "Post Update", titlePlaceholder: "Subject...", contentPlaceholder: "Message...",
    postBtn: "Post", back: "Back", goHome: "RETURN TO HUB",
    notFoundDesc: "ERROR 404: PAGE NOT FOUND.",
    impactTitle: "Impact", impactCO2: "CO2 Reduced", impactAnimals: "Life Saved",
    impactEnergy: "Energy", ptsPerKg: "pts/kg",
    redeemTitle: "Rewards", redeemDesc: "Exchange points for items.",
    notEnough: "Insufficient Points", redeemSuccess: "Redeem Success!",
    confirmRedeem: "Redeem", selectItem: "Select Item"
  },
  ms: {
    appName: "SisaSync", slogan: "Menyegerakkan Sisa. Melestarikan Alam.",
    heroTitle: "SISASYNC", heroSubtitle: "JARINGAN",
    heroDesc: "Solusi kejuruteraan sisa kampus. Segerakkan data ke awan.",
    getStarted: "Mula Sekarang", login: "Log Masuk", welcomeBack: "Selamat Datang,",
    dashboard: "Hab", history: "Sejarah", rewards: "Tebus", logout: "Keluar",
    newRequest: "Entri Baru", totalPoints: "Kredit Eco", recentActivity: "Aktiviti Terkini",
    status: "Status", wasteType: "Pilih Bahan", locationLabel: "Lokasi",
    weightKg: "Berat (kg)", submit: "Hantar Data", studentTab: "Pelajar",
    adminTab: "Admin", pending: "Menunggu", approved: "Selesai", rejected: "Ditolak",
    newsFeed: "Berita", manageReq: "Permintaan", announcements: "Notis",
    postNews: "Hantar Berita", titlePlaceholder: "Tajuk...", contentPlaceholder: "Mesej...",
    postBtn: "Hantar", back: "Kembali", goHome: "BALIK UTAMA",
    notFoundDesc: "RALAT 404: HALAMAN TIADA.",
    impactTitle: "Impak", impactCO2: "Kurang CO2", impactAnimals: "Hidupan",
    impactEnergy: "Tenaga", ptsPerKg: "mata/kg",
    redeemTitle: "Ganjaran", redeemDesc: "Tukar mata untuk item.",
    notEnough: "Mata Tak Cukup", redeemSuccess: "Berjaya Tebus!",
    confirmRedeem: "Tebus", selectItem: "Pilih Item"
  }
};

const REWARDS_DATA = [
  { id: 'r1', name: "RM5 Voucher", cost: 500, icon: Utensils },
  { id: 'r2', name: "RM10 Voucher", cost: 900, icon: Ticket },
  { id: 'r3', name: "SisaSync Tee", cost: 2500, icon: Shirt },
  { id: 'r4', name: "Metal Straw", cost: 1200, icon: Leaf },
];

// --- RATE POINT (Ikut jenis sampah) ---
const POINT_RATES = {
  'Plastic': 10,
  'Paper': 5,
  'Tin': 15,
  'E-Waste': 50
};

export default function App() {
  const [lang, setLang] = useState('en');
  const [currentUser, setCurrentUser] = useState(null);
  const txt = t[lang];
  const toggleLang = () => setLang(prev => prev === 'en' ? 'ms' : 'en');

  return (
    <Router>
      <AppRoutes lang={lang} toggleLang={toggleLang} txt={txt} currentUser={currentUser} setCurrentUser={setCurrentUser} />
    </Router>
  );
}

function AppRoutes({ lang, toggleLang, txt, currentUser, setCurrentUser }) {
  const [dbRequests, setDbRequests] = useState([]);
  const [newsList, setNewsList] = useState([
    { id: 1, title: 'Maintenance', content: 'Trucks arrive 10 AM Saturday.', date: '2023-12-25' },
    { id: 2, title: 'System Update', content: 'Plastic points increased 1.5x.', date: '2023-12-24' },
  ]);

  // TARIK DATA REAL DARI SUPABASE
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('id', { ascending: false });
      
      if (error) throw error;
      if (data) setDbRequests(data);
    } catch (error) {
      console.log('Connection Error:', error.message);
    }
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage lang={lang} toggleLang={toggleLang} txt={txt} />} />
      <Route path="/login" element={<LoginPage txt={txt} setCurrentUser={setCurrentUser} />} />
      <Route path="/student-dashboard" element={<StudentDashboard txt={txt} currentUser={currentUser} setCurrentUser={setCurrentUser} dbRequests={dbRequests} fetchRequests={fetchRequests} newsList={newsList} />} />
      <Route path="/admin-dashboard" element={<AdminDashboard txt={txt} currentUser={currentUser} dbRequests={dbRequests} fetchRequests={fetchRequests} newsList={newsList} setNewsList={setNewsList} />} />
      <Route path="*" element={<NotFoundPage txt={txt} />} />
    </Routes>
  );
}

// 1. LANDING PAGE
function LandingPage({ lang, toggleLang, txt }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="font-sans bg-white text-slate-800 overflow-x-hidden">
       <nav className={`fixed top-0 w-full z-50 px-4 md:px-10 py-4 flex justify-between items-center transition-all ${scrolled ? 'bg-[#0f172a]/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent'}`}>
         <div className="flex items-center gap-2 font-black text-lg md:text-2xl tracking-tight text-white"><RefreshCw className="text-emerald-400 animate-spin-slow w-6 h-6 md:w-8 md:h-8" /> {txt.appName}</div>
         <div className="flex gap-2 md:gap-3">
            <button onClick={toggleLang} className="px-3 py-1 md:px-4 md:py-2 font-bold text-[10px] md:text-xs bg-white/10 border border-white/30 text-white rounded-full hover:bg-white hover:text-emerald-900 uppercase backdrop-blur-sm transition-all">{lang}</button>
            <button onClick={() => navigate('/login')} className="bg-emerald-500 text-white px-4 py-1 md:px-6 md:py-2 rounded-full font-bold text-xs md:text-sm hover:bg-emerald-400 shadow-lg transition-all active:scale-95">{txt.login}</button>
         </div>
       </nav>
       <header className="relative h-screen flex flex-col items-center justify-center text-center px-4">
         <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover" alt="Forest"/>
            <div className="absolute inset-0 bg-black/50"></div>
         </div>
         <div className="relative z-10 max-w-5xl space-y-4 md:space-y-6 animate-fade-in-up mt-10">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/50 rounded-full text-emerald-300 font-bold text-[10px] md:text-xs uppercase tracking-widest backdrop-blur-md"><Zap size={12}/> {txt.slogan}</div>
           <h1 className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white leading-none drop-shadow-2xl">{txt.heroTitle}<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200 tracking-normal">{txt.heroSubtitle}</span></h1>
           <p className="text-sm md:text-2xl text-emerald-100 max-w-xs md:max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md px-2">{txt.heroDesc}</p>
           <button onClick={() => navigate('/login')} className="group w-full md:w-auto px-8 py-4 md:px-12 md:py-6 bg-white text-emerald-900 font-black rounded-full text-lg md:text-xl shadow-xl hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-3 mx-auto mt-4">{txt.getStarted} <ArrowRight className="group-hover:translate-x-1 transition-transform"/></button>
         </div>
       </header>
    </div>
  );
}

// 2. LOGIN PAGE (REAL INPUT)
function LoginPage({ txt, setCurrentUser }) {
  const navigate = useNavigate();
  const [isLoginAdmin, setIsLoginAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailInput, setEmailInput] = useState(''); // Simpan input user
  const [passInput, setPassInput] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      
      // LOGIC VALIDATION
      if (isLoginAdmin) {
        // Admin hardcode untuk demo
        if(emailInput === 'admin' && passInput === 'admin') {
            setCurrentUser({ name: 'Admin Staff', role: 'admin' });
            navigate('/admin-dashboard');
        } else {
            alert("For demo admin, use ID: 'admin' & Pass: 'admin'");
        }
      } else {
        // Student MESTI ada @
        if (emailInput.includes('@')) {
            // Guna email yang ditaip sebagai Username
            setCurrentUser({ name: emailInput, role: 'student' }); 
            navigate('/student-dashboard');
        } else {
            alert("Please enter a valid email address (must contain '@').");
        }
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] flex font-sans">
       <div className="hidden lg:flex flex-1 relative bg-emerald-900 overflow-hidden"><img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2670&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" alt="Recycle"/><div className="absolute inset-0 bg-gradient-to-t from-emerald-950 to-transparent"/><div className="absolute bottom-20 left-20 z-10 max-w-lg"><h1 className="text-5xl font-black text-white mb-4">Sync Your Waste.<br/>Save The Planet.</h1><p className="text-emerald-200 text-lg">Powered by SisaSync Technology.</p></div></div>
       <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-8 bg-white relative w-full">
         <button onClick={() => navigate('/')} className="absolute top-6 left-6 text-slate-400 hover:text-slate-800 transition-colors flex gap-2 font-bold group text-sm"><ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/> {txt.back}</button>
         <div className="w-full max-w-sm mt-10 md:mt-0">
            <div className="mb-8"><div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4"><RefreshCw size={28}/></div><h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-2">{txt.login}</h2><p className="text-slate-500 text-sm">Access your SisaSync account.</p></div>
            <div className="bg-slate-100 p-1 rounded-xl flex mb-6"><button onClick={() => setIsLoginAdmin(false)} className={`flex-1 py-3 rounded-lg font-bold text-xs md:text-sm transition-all active:scale-95 ${!isLoginAdmin ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{txt.studentTab}</button><button onClick={() => setIsLoginAdmin(true)} className={`flex-1 py-3 rounded-lg font-bold text-xs md:text-sm transition-all active:scale-95 ${isLoginAdmin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{txt.adminTab}</button></div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Email Address</label>
                <input 
                    type={isLoginAdmin ? "text" : "email"} 
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    placeholder={isLoginAdmin ? "admin" : "student@college.edu.my"}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 transition-all text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Passcode</label>
                <input 
                    type="password" 
                    value={passInput}
                    onChange={(e) => setPassInput(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 transition-all text-sm"
                />
              </div>
              <button disabled={isLoading} className={`w-full py-4 rounded-xl font-black text-white shadow-lg mt-4 transition-all active:scale-95 active:shadow-inner ${isLoginAdmin ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>{isLoading ? <Loader2 className="animate-spin mx-auto"/> : txt.login}</button>
            </form>
         </div>
       </div>
    </div>
  );
}

// 3. STUDENT DASHBOARD (REAL CALCULATION)
function StudentDashboard({ txt, currentUser, setCurrentUser, dbRequests, fetchRequests, newsList }) {
  const navigate = useNavigate();
  const [showRecycleModal, setShowRecycleModal] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState(['Plastic']);

  useEffect(() => { if (!currentUser) navigate('/login'); }, [currentUser, navigate]);
  if (!currentUser) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-600"/></div>;

  // --- KIRA POINT SEBENAR DARI DATABASE ---
  // 1. Tapis request milik user ni saja
  // 2. Tapis yang status 'Approved' sahaja
  // 3. Tambah semua point
  const myApprovedRequests = dbRequests.filter(req => req.student === currentUser.name && req.status === 'Approved');
  const points = myApprovedRequests.reduce((total, req) => total + (req.points || 0), 0);

  const co2Saved = (points * 0.15).toFixed(1); 
  const marineSaved = Math.floor(points / 200); 
  const energySaved = (points * 0.5).toFixed(0); 
  
  // Guna email sebagai nama paparan
  const safeName = currentUser.name; 

  // --- SUBMIT KE SUPABASE ---
  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if(selectedTypes.length === 0) { alert("Please select at least one material."); return; }
    setIsLoading(true);

    const typeString = selectedTypes.join(', ');
    const weightVal = parseFloat(e.target.weight.value);
    const locationVal = e.target.location.value;
    const today = new Date().toISOString().split('T')[0];
    
    // KIRA POINT ANGGARAN (Weight * Rate)
    // Ambil rate bahan pertama yang dipilih untuk pengiraan mudah
    const rate = POINT_RATES[selectedTypes[0]] || 5; 
    const calculatedPoints = Math.floor(weightVal * rate);

    try {
      const { error } = await supabase
        .from('requests')
        .insert([
          { 
            student: currentUser.name,  // GUNA EMAIL SEBENAR
            type: typeString, 
            location: locationVal, 
            weight: weightVal + 'kg', 
            date: today,
            status: 'Pending',
            points: calculatedPoints // Simpan point (valid bila approved)
          }
        ]);
        
      if (error) throw error;
      
      alert("SisaSync: Data Uploaded! Points will be added after approval.");
      setShowRecycleModal(false);
      fetchRequests(); 
    } catch (error) {
      alert("Error uploading: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelection = (id) => {
    if (selectedTypes.includes(id)) { setSelectedTypes(selectedTypes.filter(t => t !== id)); } 
    else { setSelectedTypes([...selectedTypes, id]); }
  };

  const wasteOptions = [
    { id: 'Plastic', label: 'Plastic', icon: Coffee, points: '10', color: 'text-blue-500 bg-blue-50' },
    { id: 'Paper', label: 'Paper', icon: FileText, points: '5', color: 'text-yellow-600 bg-yellow-50' },
    { id: 'Tin', label: 'Metal', icon: Database, points: '15', color: 'text-gray-600 bg-gray-50' },
    { id: 'E-Waste', label: 'E-Waste', icon: Smartphone, points: '50', color: 'text-purple-600 bg-purple-50' },
  ];

  const RecycleModal = () => (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-emerald-900/40 backdrop-blur-sm p-0 md:p-4 animate-in fade-in">
      <div className="bg-white border-t-4 md:border-4 border-emerald-100 w-full max-w-lg rounded-t-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative h-[90vh] md:h-auto overflow-y-auto">
        <button onClick={() => setShowRecycleModal(false)} className="absolute top-4 right-4 md:top-6 md:right-6 text-slate-400 hover:text-red-500 bg-slate-50 p-2 rounded-full active:scale-90 transition-transform"><XCircle size={24} /></button>
        <div className="text-center mb-6 mt-4 md:mt-0"><div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner"><RefreshCw size={28}/></div><h2 className="text-2xl font-black text-emerald-950">{txt.newRequest}</h2></div>
        <form onSubmit={handleSubmitRequest} className="space-y-6 pb-10">
          <div><label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block text-center">{txt.wasteType}</label><div className="grid grid-cols-2 gap-3">{wasteOptions.map((option) => { const isSelected = selectedTypes.includes(option.id); return (<div key={option.id} onClick={() => toggleSelection(option.id)} className={`cursor-pointer rounded-2xl p-4 border-2 transition-all active:scale-95 flex flex-col items-center justify-center gap-2 group relative overflow-hidden ${isSelected ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200' : 'border-slate-100 hover:border-emerald-200 bg-white'}`}><div className={`p-3 rounded-full ${option.color} group-hover:scale-110 transition-transform`}><option.icon size={24} /></div><div className="text-center"><span className={`block font-bold text-sm ${isSelected ? 'text-emerald-900' : 'text-slate-600'}`}>{option.label}</span><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{option.points} {txt.ptsPerKg}</span></div>{isSelected && <div className="absolute top-2 right-2 text-emerald-500"><CheckCircle size={16} fill="currentColor" className="text-white"/></div>}</div>); })}</div></div>
          <div className="space-y-4"><div className="bg-slate-50 p-3 rounded-2xl border border-slate-100"><label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">{txt.locationLabel}</label><select name="location" className="w-full bg-white border border-slate-200 rounded-xl p-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-400"><option value="Block A">Block A (Eng)</option><option value="Block B">Block B (Sci)</option><option value="Library">Library</option><option value="Cafe">Cafeteria</option></select></div><div><label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block ml-2">{txt.weightKg}</label><input name="weight" type="number" step="0.1" placeholder="2.5" required className="w-full bg-white border-2 border-slate-100 rounded-2xl p-3 font-bold text-slate-700 outline-none focus:border-emerald-400 text-lg"/></div></div>
          <button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-lg mt-2 flex justify-center items-center gap-2 transition-all active:scale-95 active:shadow-inner mb-4">{isLoading ? <Loader2 className="animate-spin"/> : <>{txt.submit} <CheckCircle size={20}/></>}</button>
        </form>
      </div>
    </div>
  );

  const RedeemModal = () => {
    const [selectedId, setSelectedId] = useState(null);
    const confirmRedeem = () => {
      const selectedItem = REWARDS_DATA.find(r => r.id === selectedId);
      if (!selectedItem) return;
      if (!window.confirm(`Confirm redeem ${selectedItem.name}?`)) return;
      // Note: Sistem redeem sebenar perlu tolak point kat database, tapi untuk demo kita just alert
      // Sebab kita belum buat table 'redemptions'. 
      if (points >= selectedItem.cost) {
        alert(`${txt.redeemSuccess} Item: ${selectedItem.name}\n(Note: In full version, points will deduct from DB)`);
        setSelectedId(null);
      } else {
        alert(txt.notEnough);
      }
    };
    const activeItem = REWARDS_DATA.find(r => r.id === selectedId);

    return (
      <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-emerald-900/40 backdrop-blur-sm p-0 md:p-4 animate-in fade-in">
        <div className="bg-white border-t-4 md:border-4 border-emerald-100 w-full max-w-lg rounded-t-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative h-[85vh] md:h-auto flex flex-col">
          <button onClick={() => setShowRedeemModal(false)} className="absolute top-4 right-4 md:top-6 md:right-6 text-slate-400 hover:text-red-500 bg-slate-50 p-2 rounded-full active:scale-90 transition-transform z-20"><XCircle size={24} /></button>
          <div className="text-center mb-6 flex-shrink-0 mt-4 md:mt-0">
            <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner"><Gift size={28}/></div>
            <h2 className="text-2xl font-black text-emerald-950">{txt.redeemTitle}</h2>
            <div className="mt-2 bg-emerald-100 text-emerald-800 px-4 py-1 rounded-full inline-block font-bold text-xs">{txt.totalPoints}: {points} pts</div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-6 overflow-y-auto pr-2 custom-scrollbar flex-grow pb-20 md:pb-0">
            {REWARDS_DATA.map(item => {
              const canAfford = points >= item.cost;
              const isSelected = selectedId === item.id;
              return (
                <div key={item.id} onClick={() => { if (canAfford) setSelectedId(item.id); }} className={`border-2 rounded-2xl p-4 flex flex-col items-center text-center transition-all relative ${canAfford ? 'cursor-pointer active:scale-95 hover:border-emerald-300' : 'cursor-not-allowed opacity-40 grayscale bg-slate-50'} ${isSelected ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200' : 'border-slate-100'}`}>
                  <div className={`p-3 rounded-full mb-2 ${isSelected ? 'bg-emerald-200 text-emerald-700' : 'bg-slate-50 text-slate-600'}`}><item.icon size={20}/></div>
                  <h4 className="font-bold text-xs md:text-sm text-slate-800 leading-tight">{item.name}</h4>
                  <p className={`font-black text-[10px] md:text-xs mt-1 ${canAfford ? 'text-emerald-600' : 'text-slate-400'}`}>{item.cost} pts</p>
                  {!canAfford && <div className="absolute top-2 right-2 text-slate-400"><Lock size={12}/></div>}
                  {isSelected && <div className="absolute top-2 right-2 text-white bg-emerald-500 rounded-full p-1 shadow-md"><CheckCircle size={14} fill="currentColor"/></div>}
                </div>
              );
            })}
          </div>
          <button onClick={confirmRedeem} disabled={!activeItem} className={`absolute bottom-6 left-6 right-6 md:static w-[calc(100%-3rem)] md:w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all flex items-center justify-center gap-2 z-30 ${!activeItem ? 'bg-slate-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 active:shadow-inner'}`}>
            {activeItem ? `${txt.confirmRedeem}` : txt.selectItem}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] text-slate-800 font-sans pb-24 md:pb-10">
      {showRecycleModal && <RecycleModal />}
      {showRedeemModal && <RedeemModal />}
      
      <nav className="fixed top-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100 px-4 md:px-6 py-3 flex justify-between items-center">
         <div className="flex items-center gap-2 text-emerald-600 font-black text-lg md:text-xl cursor-pointer" onClick={() => navigate('/')}><RefreshCw size={24}/> <span className="hidden md:inline">{txt.appName}</span></div>
         <div className="flex gap-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1">{points} pts</span>
            <button onClick={() => navigate('/')} className="text-slate-400 hover:text-red-500 p-1 active:scale-90 transition-transform"><LogOut size={20}/></button>
         </div>
      </nav>

      <main className="pt-20 px-4 md:px-10 max-w-6xl mx-auto">
        <header className="mb-6 md:mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
           <div><h1 className="text-2xl md:text-4xl font-black text-slate-800 mb-1">{txt.welcomeBack} <br className="md:hidden"/><span className="text-emerald-600 truncate max-w-[200px] md:max-w-md block">{safeName}</span></h1><p className="text-slate-500 text-xs md:text-base font-medium">{txt.slogan}</p></div>
           <button onClick={() => setShowRecycleModal(true)} className="hidden md:flex bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg items-center gap-2 active:scale-95 active:shadow-inner transition-all"><Plus size={24}/> {txt.newRequest}</button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
           <div className="bg-emerald-600 rounded-[2rem] p-6 md:p-8 text-white shadow-xl relative overflow-hidden group col-span-1 md:col-span-3 lg:col-span-1">
              <RefreshCw className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10 rotate-45 pointer-events-none"/>
              <p className="font-bold text-emerald-100 uppercase tracking-widest text-xs mb-2">{txt.totalPoints}</p>
              <h2 className="text-5xl md:text-6xl font-black mb-6">{points}</h2>
              <button onClick={() => setShowRedeemModal(true)} className="relative z-10 w-full bg-white text-emerald-700 px-4 py-3 rounded-xl font-bold text-sm hover:bg-emerald-50 flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 active:shadow-inner"><Gift size={18}/> {txt.rewards}</button>
           </div>
           
           <div className="col-span-1 md:col-span-3 lg:col-span-2 grid grid-cols-3 gap-2 md:gap-4">
              {[
                { icon: CloudRain, val: co2Saved, unit: 'kg', label: txt.impactCO2, bg: 'bg-sky-100', txt: 'text-sky-600' },
                { icon: Fish, val: marineSaved, unit: '', label: txt.impactAnimals, bg: 'bg-teal-100', txt: 'text-teal-600' },
                { icon: Zap, val: energySaved, unit: 'kWh', label: txt.impactEnergy, bg: 'bg-yellow-100', txt: 'text-yellow-600' }
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-[1.5rem] p-3 md:p-6 border-2 border-slate-50 shadow-sm flex flex-col items-center justify-center text-center group hover:border-emerald-200 transition-colors">
                  <div className={`w-8 h-8 md:w-12 md:h-12 ${stat.bg} ${stat.txt} rounded-full flex items-center justify-center mb-2 md:mb-3`}><stat.icon size={16} className="md:w-6 md:h-6"/></div>
                  <h3 className="text-lg md:text-2xl font-black text-slate-800 leading-none">{stat.val}<span className="text-[10px] md:text-sm block md:inline font-medium text-slate-400 ml-1">{stat.unit}</span></h3>
                  <p className="text-slate-400 text-[9px] md:text-xs font-bold uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
           <div className="lg:col-span-2">
              <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><History className="text-emerald-500"/> {txt.recentActivity}</h3>
              <div className="space-y-3 md:space-y-4">
                {myApprovedRequests.length === 0 && dbRequests.filter(req => req.student === currentUser.name).length === 0 ? (
                   <div className="text-slate-400 text-center py-10 border-2 border-dashed border-emerald-100 rounded-3xl text-sm flex flex-col items-center">
                    <p>No records found for <strong>{currentUser.name}</strong>.</p>
                    <p className="text-xs mt-2">Start recycling to earn points!</p>
                   </div>
                ) : (
                  // Tunjuk SEMUA request user (Pending + Approved)
                  dbRequests.filter(r => r.student === currentUser.name).map((req) => (
                    <div key={req.id} className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center gap-3 md:gap-5">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${req.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-50 text-orange-400'}`}>{req.status === 'Approved' ? <Smile size={20} className="md:w-6 md:h-6"/> : <Loader2 size={20} className="md:w-6 md:h-6 animate-spin"/>}</div>
                        <div><h4 className="font-bold text-sm md:text-lg text-slate-800">{req.type}</h4><p className="text-slate-400 text-xs font-medium flex items-center gap-1"><MapPin size={10}/> {req.location}</p></div>
                      </div>
                      <div className="text-right">
                        <span className={`block px-2 py-1 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-wider ${req.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-50 text-orange-500'}`}>{req.status === 'Approved' ? txt.approved : txt.pending}</span>
                        {req.status === 'Approved' && <span className="text-[10px] font-bold text-emerald-500">+{req.points} pts</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
           </div>
           
           <div className="mt-4 md:mt-0">
              <div className="bg-blue-50/50 rounded-[2rem] p-6 border-2 border-blue-100/50 relative overflow-hidden h-full">
                <div className="flex items-center gap-2 mb-4 text-blue-600 font-bold uppercase text-xs tracking-wider"><Megaphone size={16}/> {txt.newsFeed}</div>
                <div className="space-y-4">
                  {newsList.map(n => (
                    <div key={n.id} className="bg-white p-4 rounded-2xl border border-blue-100 relative shadow-sm">
                      <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                      <h4 className="font-bold text-blue-900 text-xs md:text-sm leading-tight mb-1">{n.title}</h4>
                      <p className="text-[10px] md:text-xs text-blue-600 leading-relaxed">{n.content}</p>
                    </div>
                  ))}
                </div>
              </div>
           </div>
        </div>
      </main>

      <button onClick={() => setShowRecycleModal(true)} className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 active:scale-95 transition-transform"><Plus size={28}/></button>
    </div>
  );
}

// 4. ADMIN DASHBOARD
function AdminDashboard({ txt, currentUser, dbRequests, fetchRequests, newsList, setNewsList }) {
  const navigate = useNavigate();
  const [adminSection, setAdminSection] = useState('requests');
  useEffect(() => { if (!currentUser) navigate('/login'); }, [currentUser, navigate]);
  if (!currentUser) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-600"/></div>;

  const handleAdminAction = async (id, action) => {
    const newStatus = action === 'approve' ? 'Approved' : 'Rejected';
    try {
      const { error } = await supabase
        .from('requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      fetchRequests(); // REFRESH DATA
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handlePostNews = (e) => { e.preventDefault(); const newPost = { id: Date.now(), title: e.target.title.value, content: e.target.content.value, date: new Date().toISOString().split('T')[0] }; setNewsList([newPost, ...newsList]); e.target.reset(); };
  const handleDeleteNews = (id) => setNewsList(newsList.filter(n => n.id !== id));
  
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col md:flex-row relative overflow-hidden">
      <aside className="hidden md:flex w-64 flex-col p-6 bg-[#0f172a] border-r border-slate-800 sticky top-0 h-screen z-20 shadow-2xl">
        <div className="flex items-center gap-3 text-emerald-400 font-black text-lg mb-10 tracking-tight z-10"><LayoutDashboard size={20}/> ADMIN OS</div>
        <nav className="space-y-2 flex-1 z-10">
          <button onClick={() => setAdminSection('requests')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${adminSection === 'requests' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><ClipboardList size={18}/> {txt.manageReq}</button>
          <button onClick={() => setAdminSection('news')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${adminSection === 'news' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Megaphone size={18}/> {txt.announcements}</button>
        </nav>
        <button onClick={() => navigate('/')} className="flex items-center gap-3 text-red-400 hover:bg-red-900/20 p-4 rounded-xl font-bold transition-all z-10 text-sm"><LogOut size={18}/> {txt.logout}</button>
      </aside>

      <div className="md:hidden bg-[#0f172a] p-4 flex justify-between items-center text-white sticky top-0 z-30">
        <div className="font-black text-emerald-400 flex items-center gap-2"><LayoutDashboard size={18}/> ADMIN</div>
        <button onClick={() => navigate('/')}><LogOut size={18} className="text-red-400"/></button>
      </div>

      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-8">
           <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm"><h4 className="text-2xl md:text-3xl font-black text-slate-800">{dbRequests.length}</h4><p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">Requests</p></div>
           <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm"><h4 className="text-2xl md:text-3xl font-black text-slate-800">450kg</h4><p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">Mass</p></div>
        </div>

        <div className="md:hidden flex bg-white p-1 rounded-xl mb-6 shadow-sm border border-slate-100">
           <button onClick={() => setAdminSection('requests')} className={`flex-1 py-2 rounded-lg font-bold text-xs ${adminSection === 'requests' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500'}`}>{txt.manageReq}</button>
           <button onClick={() => setAdminSection('news')} className={`flex-1 py-2 rounded-lg font-bold text-xs ${adminSection === 'news' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500'}`}>{txt.announcements}</button>
        </div>

        {adminSection === 'requests' && (
          <div className="bg-white rounded-[1.5rem] border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px] md:min-w-full">
                <thead className="bg-slate-50 text-slate-400 text-[10px] md:text-xs uppercase font-bold tracking-wider"><tr><th className="p-4 md:p-6">User / Email</th><th className="p-4 md:p-6">Data</th><th className="p-4 md:p-6">Status</th><th className="p-4 md:p-6 text-right">Action</th></tr></thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {dbRequests.length === 0 ? (
                    <tr><td colSpan="4" className="p-6 text-center text-slate-400">No requests found.</td></tr>
                  ) : (
                    dbRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50">
                        <td className="p-4 md:p-6 font-bold text-slate-800">{req.student}</td>
                        <td className="p-4 md:p-6"><span className="block">{req.type}</span><span className="text-xs text-slate-500">{req.weight} • {req.location} • {req.points}pts</span></td>
                        <td className="p-4 md:p-6"><span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${req.status === 'Pending' ? 'bg-orange-100 text-orange-600' : req.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>{req.status}</span></td>
                        <td className="p-4 md:p-6 text-right space-x-2">{req.status === 'Pending' && (<><button onClick={() => handleAdminAction(req.id, 'reject')} className="p-2 bg-red-50 text-red-500 rounded-lg"><XCircle size={16}/></button><button onClick={() => handleAdminAction(req.id, 'approve')} className="p-2 bg-emerald-500 text-white rounded-lg"><CheckCircle size={16}/></button></>)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminSection === 'news' && (
           <div className="space-y-6">
             <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
               <h3 className="font-bold text-blue-600 mb-4 text-sm uppercase tracking-wide">Post Update</h3>
               <form onSubmit={handlePostNews} className="space-y-4">
                 <input name="title" required type="text" placeholder={txt.titlePlaceholder} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none focus:border-blue-400"/>
                 <textarea name="content" required placeholder={txt.contentPlaceholder} rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium outline-none focus:border-blue-400"></textarea>
                 <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg active:scale-95 text-sm">{txt.postBtn}</button>
               </form>
             </div>
             {newsList.map(news => (
               <div key={news.id} className="bg-white border border-slate-200 p-5 rounded-2xl flex justify-between items-start">
                 <div><h4 className="font-bold text-slate-800 mb-1">{news.title}</h4><p className="text-slate-500 text-xs">{news.content}</p></div>
                 <button onClick={() => handleDeleteNews(news.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
               </div>
             ))}
           </div>
        )}
      </main>
    </div>
  );
}

// 5. NOT FOUND PAGE
function NotFoundPage({ txt }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F0FDF4] flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-9xl font-black text-emerald-200">404</h1>
      <p className="text-emerald-800 font-bold mb-6">{txt.notFoundDesc}</p>
      <button onClick={() => navigate('/')} className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg">{txt.goHome}</button>
    </div>
  );
}