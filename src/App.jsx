import React, { useState, useEffect } from 'react';
// HashRouter: Fix 404 on refresh di phone
// Added 'Navigate' to imports to handle redirection
import { HashRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { 
  Leaf, ArrowRight, ArrowLeft, LayoutDashboard, History, Gift, 
  LogOut, Plus, CheckCircle, XCircle, MapPin, Loader2, 
  Megaphone, Trash2, Zap, Smile, BookOpen, 
  Fish, CloudRain, Users, Hand, Coins, 
  BarChart3, ChevronRight, ExternalLink, Calendar,
  Coffee, FileText, Database, Smartphone, Lock, 
  ShieldCheck, Key, TrendingUp, AlertCircle, Heart,
  Moon, Sun, Globe, Truck, Package, Menu, X, Eye, 
  Image as ImageIcon, Upload, FlaskConical, AlertTriangle,
  QrCode, Copy, Check, ShoppingBag, Clock, Info, Star,
  Briefcase, Cpu, User, Anchor, CreditCard, Camera, Video, Mic, Wrench, Vote, Home
} from 'lucide-react';

// IMPORT SUPABASE
import { supabase } from './supabaseClient';

// --- TEAM DATA ---
const TEAM_MEMBERS = [
  { role: "CEO", name: "ZAIM HAZIQ", title: "Chief Executive Officer", dept: "Top Management", icon: Briefcase, color: "bg-slate-500" },
  { role: "CTO", name: "NURFAIL IZANI", title: "Chief Technology Officer", dept: "Technology Dept", icon: Cpu, color: "bg-blue-500" },
  { role: "COO", name: "AHMAD IKMAL", title: "Chief Operating Officer", dept: "Operations & Logistics", icon: Truck, color: "bg-emerald-500" },
  { role: "CFO & CMO", name: "PHANG JUN LIANG", title: "Finance & Marketing", dept: "Financial Dept", icon: TrendingUp, color: "bg-purple-500" },
];

// --- VOLUNTEER ROLES & LIMITS ---
const VOLUNTEER_ROLES = [
    { id: 'logistic', name: 'Logistics & Setup', icon: Wrench, color: 'bg-orange-500', limit: 5 },
    { id: 'multimedia', name: 'Multimedia & Photo', icon: Camera, color: 'bg-purple-500', limit: 3 },
    { id: 'protocol', name: 'Protocol & Emcee', icon: Mic, color: 'bg-blue-500', limit: 2 },
    { id: 'promo', name: 'Promotion & Socials', icon: Megaphone, color: 'bg-pink-500', limit: 4 }
];

// --- VOTING LOCATIONS ---
const VOTE_LOCATIONS = [
    { id: 1, name: "Student Library (Foyer)", votes: 145, color: "bg-blue-500" },
    { id: 2, name: "Sports Complex", votes: 89, color: "bg-orange-500" },
    { id: 3, name: "Faculty of Engineering", votes: 210, color: "bg-emerald-500" }
];

// --- CUSTOM COMPONENTS ---

const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const timer = setTimeout(onClose, 1500); return () => clearTimeout(timer); }, [onClose]);
  return (
    <div className={`fixed top-4 right-4 z-[100] px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300 ${type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-600 text-white'}`}>
      {type === 'error' ? <XCircle size={20}/> : <CheckCircle size={20}/>}
      <span className="font-bold text-sm">{message}</span>
    </div>
  );
};

// --- NOT FOUND PAGE REMOVED (Diganti dengan Redirect) ---

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isDark }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 px-4">
      <div className={`w-full max-w-sm p-6 rounded-2xl shadow-2xl scale-100 animate-in zoom-in-95 duration-200 ${isDark ? 'bg-slate-900 border border-slate-700 text-white' : 'bg-white text-slate-900'}`}>
        <div className="flex flex-col items-center text-center mb-6"><div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4"><AlertTriangle size={24}/></div><h3 className="text-lg font-black">{title}</h3><p className="text-sm opacity-70 mt-2">{message}</p></div>
        <div className="grid grid-cols-2 gap-3"><button onClick={onClose} className={`py-3 rounded-xl font-bold text-sm transition-colors ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}>Cancel</button><button onClick={onConfirm} className="py-3 rounded-xl font-bold text-sm bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 transition-all active:scale-95">Delete</button></div>
      </div>
    </div>
  );
};

const RedeemModal = ({ isOpen, onClose, reward, userPoints, onConfirm, isDark }) => {
    if (!isOpen || !reward) return null;
    const canAfford = userPoints >= reward.cost;
    const [isProcessing, setIsProcessing] = useState(false);

    const handleConfirm = () => {
        setIsProcessing(true);
        onConfirm(reward);
        setTimeout(() => setIsProcessing(false), 2000); 
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 px-4">
            <div className={`w-full max-w-sm p-6 rounded-3xl shadow-2xl relative scale-100 animate-in zoom-in-95 duration-300 ${isDark ? 'bg-slate-900 text-white border border-slate-700' : 'bg-white text-slate-900'}`}>
                <button onClick={onClose} className="absolute top-4 right-4 opacity-50 hover:opacity-100"><X/></button>
                <div className="text-center mb-6 pt-4">
                    <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 shadow-lg ${canAfford ? 'bg-orange-100 text-orange-500' : 'bg-slate-100 text-slate-400'}`}>
                        <reward.icon size={40} className={canAfford ? 'animate-bounce' : ''} />
                    </div>
                    <h3 className="text-xl font-black">{reward.name}</h3>
                    <p className="text-sm opacity-60 mt-1">Cost: <span className="font-bold">{reward.cost} pts</span></p>
                </div>
                {!canAfford && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-center text-xs font-bold mb-4 flex items-center justify-center gap-2">
                        <AlertCircle size={14}/> Insufficient points ({userPoints} pts)
                    </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={onClose} className={`py-3 rounded-xl font-bold text-sm transition-colors ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}>Cancel</button>
                    <button 
                        onClick={handleConfirm} 
                        disabled={!canAfford || isProcessing}
                        className={`py-3 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${!canAfford ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/30'}`}
                    >
                        {isProcessing ? <Loader2 className="animate-spin" size={18}/> : "Confirm Redeem"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const VolunteerModal = ({ isOpen, onClose, event, onConfirm, isDark }) => {
    const [selectedRole, setSelectedRole] = useState(null);
    const [roleCounts, setRoleCounts] = useState({});
    const [loadingCounts, setLoadingCounts] = useState(true);

    useEffect(() => {
        if (isOpen && event) {
            fetchCounts();
        }
    }, [isOpen, event]);

    const fetchCounts = async () => {
        setLoadingCounts(true);
        const { data } = await supabase.from('event_volunteers').select('role').eq('event_id', event.id);
        if (data) {
            const counts = {};
            data.forEach(item => { counts[item.role] = (counts[item.role] || 0) + 1; });
            setRoleCounts(counts);
        }
        setLoadingCounts(false);
    };

    if (!isOpen || !event) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in px-4">
            <div className={`w-full max-w-md p-6 rounded-3xl shadow-2xl relative ${isDark ? 'bg-slate-900 text-white border border-slate-700' : 'bg-white text-slate-900'}`}>
                <button onClick={onClose} className="absolute top-4 right-4 opacity-50 hover:opacity-100"><X/></button>
                <div className="mb-6"><h3 className="text-xl font-black mb-1">Volunteer Registration</h3><p className="text-xs opacity-60">Event: {event.title}</p></div>
                <p className="text-sm font-bold mb-3">Available Positions:</p>
                {loadingCounts ? <div className="text-center py-4"><Loader2 className="animate-spin mx-auto"/></div> : (
                    <div className="grid grid-cols-1 gap-3 mb-6">
                        {VOLUNTEER_ROLES.map(role => {
                            const currentCount = roleCounts[role.name] || 0;
                            const isFull = currentCount >= role.limit;
                            return (
                                <div key={role.id} onClick={() => !isFull && setSelectedRole(role.id)} className={`p-3 rounded-xl border-2 transition-all flex items-center justify-between gap-3 ${isFull ? 'opacity-50 cursor-not-allowed bg-slate-100 border-slate-200 grayscale' : 'cursor-pointer'} ${selectedRole === role.id ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : isDark ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-100 hover:bg-slate-50'}`}>
                                    <div className="flex items-center gap-3"><div className={`${role.color} p-2 rounded-full text-white shadow-sm`}><role.icon size={16}/></div><div><span className="text-xs font-bold block">{role.name}</span><span className={`text-[10px] font-bold ${isFull ? 'text-red-500' : 'text-emerald-600'}`}>{isFull ? "FULL" : `${role.limit - currentCount} slots left`}</span></div></div>
                                    <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden"><div className={`h-full ${isFull ? 'bg-red-500' : 'bg-emerald-500'}`} style={{width: `${(currentCount / role.limit) * 100}%`}}></div></div>
                                </div>
                            );
                        })}
                    </div>
                )}
                <button disabled={!selectedRole} onClick={() => onConfirm(event.id, VOLUNTEER_ROLES.find(r => r.id === selectedRole).name)} className={`w-full py-3 font-bold rounded-xl shadow-lg transition-all ${selectedRole ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>Confirm Registration</button>
            </div>
        </div>
    );
};

const MembershipPayModal = ({ isOpen, onClose, onSuccess, isDark }) => {
    const [processing, setProcessing] = useState(false);
    if (!isOpen) return null;

    const handlePay = () => {
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            const generatedId = "UK" + Math.floor(100000 + Math.random() * 900000);
            onSuccess(generatedId);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in px-4">
            <div className={`w-full max-w-sm p-8 rounded-3xl shadow-2xl relative text-center ${isDark ? 'bg-slate-900 text-white border border-slate-700' : 'bg-white text-slate-900'}`}>
                <button onClick={onClose} className="absolute top-4 right-4 opacity-50 hover:opacity-100"><X/></button>
                <div className="w-16 h-16 bg-yellow-400 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-yellow-400/50 animate-bounce"><Star size={32} className="text-white fill-white"/></div>
                <h3 className="text-2xl font-black mb-2">Upgrade to Member</h3>
                <p className="text-sm opacity-60 mb-6">Unlock exclusive volunteering events and get a digital ID card.</p>
                <div className={`p-4 rounded-xl mb-6 flex justify-between items-center ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}><span className="font-bold text-sm">Membership Fee</span><span className="font-black text-xl text-emerald-500">RM 10.00</span></div>
                <button onClick={handlePay} disabled={processing} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">{processing ? <Loader2 className="animate-spin"/> : "Pay Now & Join"}</button>
            </div>
        </div>
    );
};

const EcoCubeModal = ({ isOpen, onClose, isDark }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in px-4">
            <div className={`w-full max-w-lg p-6 rounded-3xl shadow-2xl relative ${isDark ? 'bg-slate-900 text-white border border-slate-700' : 'bg-white text-slate-900'}`}>
                <button onClick={onClose} className="absolute top-4 right-4 opacity-50 hover:opacity-100"><X/></button>
                <div className="flex items-center gap-3 mb-6"><div className="bg-emerald-500 p-3 rounded-xl text-white shadow-lg"><Package size={24}/></div><div><h3 className="text-2xl font-black">Eco-Cube</h3><p className="text-sm opacity-60">Toiletries Collection Service</p></div></div>
                <div className={`p-4 rounded-xl mb-4 ${isDark ? 'bg-slate-800' : 'bg-emerald-50'}`}><p className="text-sm leading-relaxed"><span className="font-bold text-emerald-500">What we collect:</span> Shampoo bottles, body wash containers, plastic tubes, and other bathroom plastics.</p></div>
                <h4 className="font-bold mb-3 flex items-center gap-2"><Clock size={16}/> Weekly Schedule</h4>
                <div className={`rounded-xl border overflow-hidden mb-6 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}><table className="w-full text-sm text-left"><thead className={isDark ? 'bg-slate-800' : 'bg-slate-50'}><tr><th className="p-3">Location</th><th className="p-3">Day</th><th className="p-3">Time</th></tr></thead><tbody className="divide-y opacity-90"><tr><td className="p-3">Hostel Block A</td><td className="p-3">Mon & Thu</td><td className="p-3 font-bold text-emerald-500">5:00 PM</td></tr><tr><td className="p-3">Hostel Block B</td><td className="p-3">Tue & Fri</td><td className="p-3 font-bold text-emerald-500">5:00 PM</td></tr><tr><td className="p-3">Student Cafe</td><td className="p-3">Wednesday</td><td className="p-3 font-bold text-emerald-500">1:00 PM</td></tr></tbody></table></div>
                <button onClick={onClose} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg">Got it!</button>
            </div>
        </div>
    );
};

const ShopModal = ({ isOpen, onClose, products, isDark }) => {
    const [purchasing, setPurchasing] = useState(null);
    if (!isOpen) return null;
    const handleBuy = (id) => {
        setPurchasing(id);
        setTimeout(async () => {
            const product = products.find(p => p.id === id);
            await supabase.from('products').update({ sold: (product.sold || 0) + 1 }).eq('id', id);
            setPurchasing(null);
            alert("Thank you! Order placed.");
        }, 1000);
    };
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in px-4">
            <div className={`w-full max-w-2xl p-6 rounded-3xl shadow-2xl relative max-h-[85vh] flex flex-col ${isDark ? 'bg-slate-900 text-white border border-slate-700' : 'bg-white text-slate-900'}`}>
                <button onClick={onClose} className="absolute top-4 right-4 opacity-50 hover:opacity-100"><X/></button>
                <div className="flex items-center gap-3 mb-6"><div className="bg-orange-500 p-3 rounded-xl text-white shadow-lg"><ShoppingBag size={24}/></div><div><h3 className="text-2xl font-black">Recycle Shop</h3><p className="text-sm opacity-60">Support our green initiative.</p></div></div>
                <div className="overflow-y-auto flex-1 pr-2">
                    {products.length === 0 ? <p className="text-center py-20 opacity-50 italic">No items on the shelf yet.</p> : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {products.map(p => (
                                <div key={p.id} className={`p-3 rounded-xl border flex flex-col ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
                                    <div className="h-32 bg-slate-200 rounded-lg mb-3 overflow-hidden"><img src={p.img} className="w-full h-full object-cover"/></div>
                                    <h4 className="font-bold text-sm truncate">{p.name}</h4>
                                    <div className="flex justify-between items-end mt-auto pt-2"><div><p className="text-xs opacity-60">{p.sold || 0} sold</p><p className="text-emerald-500 font-black text-sm">{p.price}</p></div><button onClick={() => handleBuy(p.id)} className="bg-emerald-500 text-white p-2 rounded-lg hover:bg-emerald-600 transition-colors">{purchasing === p.id ? <Loader2 size={16} className="animate-spin"/> : <ShoppingBag size={16}/>}</button></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const DonateModal = ({ isOpen, onClose, isDark }) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;
  const handleCopy = () => { navigator.clipboard.writeText("8001234567"); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 px-4">
      <div className={`w-full max-w-md p-6 rounded-3xl shadow-2xl relative ${isDark ? 'bg-slate-900 text-white border border-slate-700' : 'bg-white text-slate-900'}`}>
        <button onClick={onClose} className="absolute top-4 right-4 opacity-50 hover:opacity-100"><X/></button>
        <div className="text-center mb-6"><h3 className="text-2xl font-black mb-2 flex items-center justify-center gap-2"><Heart className="text-red-500 fill-red-500"/> Donate Fund</h3><p className="text-sm opacity-60">Scan to contribute to our eco-mission.</p></div>
        <div className="bg-white p-4 rounded-2xl w-48 h-48 mx-auto mb-6 flex items-center justify-center border-2 border-slate-100"><img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=DuitNow-EduCycle-Donation" alt="QR" className="w-full h-full"/></div>
        <div className={`p-4 rounded-xl flex items-center justify-between mb-6 ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}><div className="text-left"><p className="text-[10px] font-bold uppercase opacity-50">CIMB Bank</p><p className="font-mono font-bold text-lg tracking-wider">8001234567</p><p className="text-xs opacity-70">EduCycle Ventures</p></div><button onClick={handleCopy} className={`p-3 rounded-lg transition-all ${copied ? 'bg-emerald-500 text-white' : isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white shadow-sm hover:bg-slate-200 border'}`}>{copied ? <Check size={18}/> : <Copy size={18}/>}</button></div>
        <button onClick={onClose} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95">I have transferred</button>
      </div>
    </div>
  );
};

const ParticipantsModal = ({ isOpen, onClose, participants, isDark }) => {
    if(!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 px-4">
            <div className={`w-full max-w-lg p-6 rounded-3xl shadow-2xl relative max-h-[80vh] flex flex-col ${isDark ? 'bg-slate-900 text-white border border-slate-700' : 'bg-white text-slate-900'}`}>
                <button onClick={onClose} className="absolute top-4 right-4 opacity-50 hover:opacity-100"><X/></button>
                <h3 className="text-xl font-black mb-4 flex items-center gap-2"><Users className="text-blue-500"/> Participant List</h3>
                <div className="overflow-y-auto flex-1 pr-2">
                    {participants.length === 0 ? <p className="text-center py-10 opacity-50 italic">No participants yet.</p> : (
                        <table className="w-full text-left text-sm"><thead className={`sticky top-0 ${isDark ? 'bg-slate-900' : 'bg-white'}`}><tr className="border-b opacity-50"><th className="pb-2">Name</th><th className="pb-2">Email</th></tr></thead><tbody className="divide-y opacity-90">{participants.map((p, idx) => (<tr key={idx} className="h-10"><td className="font-bold py-2">{p.student_name}</td><td className="py-2 opacity-70">{p.student_email}</td></tr>))}</tbody></table>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- TEAM CARD COMPONENT ---
const TeamCard = ({ member, isDark }) => (
    <div className={`w-40 md:w-48 p-4 rounded-2xl relative group hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center text-center z-10 ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white shadow-xl shadow-slate-200'}`}>
        <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center text-white text-xl mb-3 shadow-lg ${member.color}`}>
            <member.icon size={24} />
        </div>
        <h3 className="text-sm font-bold mb-1 leading-tight">{member.name}</h3>
        <p className={`text-[9px] font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{member.role}</p>
        <div className={`px-2 py-0.5 rounded-full text-[8px] font-bold truncate w-full ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{member.dept}</div>
    </div>
);

const REWARDS_DATA = [
  { id: 'r1', name: "RM5 Voucher", cost: 500, icon: Gift },
  { id: 'r2', name: "Notebook", cost: 1200, icon: BookOpen },
  { id: 'r3', name: "Eco-Tee", cost: 2500, icon: Smile },
  { id: 'r4', name: "Straw Kit", cost: 800, icon: Leaf },
  { id: 'r5', name: "Movie Tix", cost: 1500, icon: Gift },
];

const LANG = {
  en: { heroTitle: "EDUCYCLE", heroDesc: "Transforming waste into education funds.", explore: "Explore Mission", access: "Login", welcome: "Hi,", dashboard: "Dashboard", calculator: "Eco-Impact", newEntry: "Recycle Now", co2: "CO2 Removed", energy: "Energy Saved", life: "Life Saved", rewards: "Rewards", available: "pts", events: "Events", join: "Join", joined: "Joined", logs: "History", updates: "News", noEvents: "No events.", noLogs: "No history.", redeemTitle: "Redeem", redeemConfirm: "Redeem reward", redeemSuccess: "SUCCESS!", locked: "LOCKED", needMore: "Need more points.", admin: "Admin", logout: "Logout", pickup: "Requests", manageEvents: "Events", postUpdate: "Update", adminPanel: "Admin Panel", selectMethod: "Delivery Method", methodPickup: "Pickup", methodDropoff: "Drop-off", fee: "Fee", bonus: "Bonus", aboutTitle: "Who We Are", aboutDesc: "We provide seamless pickup services and recyclables drop-off points across campus.", cat1: "Pickup Service", desc1: "Doorstep collection.", cat2: "Merchandise", desc2: "Eco-friendly products.", cat3: "Programs", desc3: "Community events.", cat4: "Green R&D", desc4: "Sustainable innovation." },
  ms: { heroTitle: "EDUCYCLE", heroDesc: "Mengubah sisa menjadi dana pendidikan.", explore: "Misi Kami", access: "Log Masuk", welcome: "Hai,", dashboard: "Utama", calculator: "Impak", newEntry: "Kitar Semula", co2: "CO2 Disingkir", energy: "Tenaga Dijimat", life: "Nyawa Selamat", rewards: "Ganjaran", available: "mata", events: "Acara", join: "Sertai", joined: "Disertai", logs: "Sejarah", updates: "Berita", noEvents: "Tiada acara.", noLogs: "Tiada rekod.", redeemTitle: "Tebus", redeemConfirm: "Tebus ganjaran", redeemsuccess: "BERJAYA!", locked: "KUNCI", needMore: "Mata tak cukup.", admin: "Admin", logout: "Keluar", pickup: "Kutipan", manageEvents: "Acara", postUpdate: "Berita", adminPanel: "Panel Admin", selectMethod: "Cara Serahan", methodPickup: "Kutipan", methodDropoff: "Hantar", fee: "Caj", bonus: "Bonus", aboutTitle: "Tentang Kami", aboutDesc: "Servis kutipan dan pusat pengumpulan barangan kitar semula.", cat1: "Servis Kutipan", desc1: "Kutipan depan pintu.", cat2: "Cenderamata", desc2: "Barangan mesra alam.", cat3: "Program Komuniti", desc3: "Acara komuniti.", cat4: "R&D Hijau", desc4: "Inovasi lestari." }
};

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

  const globalProps = { 
    language, 
    setLanguage: () => { const newLang = language === 'en' ? 'ms' : 'en'; setLanguage(newLang); localStorage.setItem('educycle_lang', newLang); }, 
    isDark, 
    setIsDark: () => { const newTheme = !isDark; setIsDark(newTheme); localStorage.setItem('educycle_theme', newTheme ? 'dark' : 'light'); }, 
    t: language === 'en' ? LANG.en : LANG.ms 
  };

  return (
    <Router>
      <style>{`::-webkit-scrollbar { display: none !important; width: 0px; background: transparent; } * { -ms-overflow-style: none !important; scrollbar-width: none !important; } html, body { overflow-x: hidden; background-color: ${isDark ? '#0f172a' : '#f8fafc'}; color: ${isDark ? '#f8fafc' : '#1e293b'}; } .scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
      <AppRoutes currentUser={currentUser} setCurrentUser={handleSetUser} {...globalProps} />
    </Router>
  );
}

function AppRoutes({ currentUser, setCurrentUser, language, setLanguage, isDark, setIsDark, t }) {
  const [dbRequests, setDbRequests] = useState([]);
  const [dbEvents, setDbEvents] = useState([]);
  const [dbNews, setDbNews] = useState([]);
  const [dbRedemptions, setDbRedemptions] = useState([]);
  const [dbProducts, setDbProducts] = useState([]); 
  const [companyFund, setCompanyFund] = useState(3250); 
  const fundGoal = 5000;
  const [joinedEventIds, setJoinedEventIds] = useState([]); 

  const refreshData = async () => {
    const reqs = await supabase.from('requests').select('*').order('id', { ascending: false });
    const evs = await supabase.from('events').select('*').order('id', { ascending: false });
    const news = await supabase.from('news').select('*').order('id', { ascending: false });
    const redeems = await supabase.from('redemptions').select('*'); 
    const prods = await supabase.from('products').select('*').order('id', { ascending: false });
    
    if (reqs.data) setDbRequests(reqs.data);
    if (evs.data) setDbEvents(evs.data);
    if (news.data) setDbNews(news.data);
    if (redeems.data) setDbRedemptions(redeems.data); 
    if (prods.data) setDbProducts(prods.data || []); 

    if (currentUser) {
        const { data: joinedData } = await supabase.from('event_participants').select('event_id').eq('student_email', currentUser.email);
        if (joinedData) {
            setJoinedEventIds(joinedData.map(item => item.event_id)); 
        }
    }
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(() => { refreshData(); }, 2000); 
    return () => clearInterval(interval);
  }, [currentUser]); 

  const props = { currentUser, setCurrentUser, dbRequests, dbEvents, dbNews, dbRedemptions, dbProducts, fetchRequests: refreshData, companyFund, fundGoal, language, setLanguage, isDark, setIsDark, t, joinedEventIds };

  return (
    <Routes>
      <Route path="/" element={<LandingPage {...props} />} />
      <Route path="/login" element={<LoginPage {...props} />} />
      <Route path="/dashboard" element={<UserDashboard {...props} />} />
      <Route path="/admin-dashboard" element={<AdminDashboard {...props} fetchData={refreshData} />} />
      <Route path="/member-zone" element={<MemberZone {...props} />} />
      
      {/* 404 REPLACEMENT: Auto Redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// --- MEMBER ZONE PAGE ---
function MemberZone({ currentUser, dbEvents, isDark }) {
    const navigate = useNavigate();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [toast, setToast] = useState(null);
    const [locations, setLocations] = useState(VOTE_LOCATIONS);
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        if(!currentUser || !currentUser.isMember) navigate('/dashboard');
    }, [currentUser, navigate]);

    const handleVolunteer = async (eventId, role) => {
        const { error } = await supabase.from('event_volunteers').insert([{
            event_id: eventId,
            student_name: currentUser.name,
            role: role
        }]);
        if(!error) {
            setToast({ message: "Registered as Volunteer!", type: "success" });
            setSelectedEvent(null);
        } else {
            setToast({ message: "Error registering.", type: "error" });
        }
    };

    const handleVote = (id) => {
        if(hasVoted) return setToast({message: "You have already voted!", type: "error"});
        const updated = locations.map(l => l.id === id ? {...l, votes: l.votes + 1} : l);
        setLocations(updated);
        setHasVoted(true);
        setToast({message: "Vote cast successfully!", type: "success"});
    };

    const totalVotes = locations.reduce((acc, curr) => acc + curr.votes, 0);

    return (
        <div className={`min-h-screen font-sans pb-20 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <VolunteerModal 
                isOpen={!!selectedEvent} 
                onClose={() => setSelectedEvent(null)} 
                event={selectedEvent} 
                onConfirm={handleVolunteer}
                isDark={isDark}
            />

            <header className={`px-6 py-4 flex items-center justify-between border-b ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 font-bold text-sm"><ArrowLeft size={18}/> Back</button>
                <div className="font-black text-emerald-500 flex items-center gap-2"><Star size={18} fill="currentColor"/> MEMBER ZONE</div>
            </header>

            <main className="max-w-4xl mx-auto p-6">
                {/* DIGITAL ID CARD - FIXED ID */}
                <div className="w-full max-w-md mx-auto aspect-[1.586/1] rounded-3xl bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-6 text-white shadow-2xl relative overflow-hidden mb-10 transform hover:scale-105 transition-transform duration-500">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="flex items-center gap-2">
                            <BookOpen size={24}/>
                            <span className="font-black tracking-widest text-lg">EDUCYCLE</span>
                        </div>
                        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold border border-white/30">PREMIUM MEMBER</span>
                    </div>
                    <div className="mt-auto relative z-10">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs uppercase opacity-80 mb-1 tracking-wider">Member Name</p>
                                <h2 className="text-2xl font-black tracking-wide text-shadow">{currentUser?.name?.toUpperCase()}</h2>
                            </div>
                            <QrCode size={48} className="opacity-80"/>
                        </div>
                        <p className="mt-4 text-xs font-mono opacity-70">ID: {currentUser?.memberId || "Generating..."}</p>
                    </div>
                </div>

                {/* --- VOTING SECTION --- */}
                <div className="mb-10">
                    <h3 className="text-xl font-black mb-6 flex items-center gap-2"><Vote size={24} className="text-purple-500"/> Vote Next Location</h3>
                    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                        <p className="text-sm opacity-60 mb-4">Where should we place the next Eco-Cube? Cast your vote!</p>
                        <div className="space-y-4">
                            {locations.map(loc => {
                                const percent = Math.round((loc.votes / totalVotes) * 100) || 0;
                                return (
                                    <div key={loc.id} onClick={() => handleVote(loc.id)} className={`relative overflow-hidden p-4 rounded-xl border-2 cursor-pointer transition-all ${hasVoted ? 'opacity-80 cursor-default' : 'hover:border-emerald-500'} ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                                        <div className={`absolute top-0 left-0 bottom-0 opacity-10 transition-all duration-1000 ${loc.color}`} style={{width: `${percent}%`}}></div>
                                        <div className="relative flex justify-between items-center z-10">
                                            <span className="font-bold">{loc.name}</span>
                                            <span className="font-mono text-sm opacity-70">{percent}% ({loc.votes})</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* VOLUNTEER OPPORTUNITIES */}
                <h3 className="text-xl font-black mb-6 flex items-center gap-2"><Hand size={24} className="text-blue-500"/> Volunteer Opportunities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dbEvents.map(ev => (
                        <div key={ev.id} className={`p-5 rounded-2xl border transition-all hover:shadow-lg ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <h4 className="font-bold text-lg">{ev.title}</h4>
                                <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>{ev.date}</span>
                            </div>
                            <p className="text-sm opacity-60 mb-4 flex items-center gap-2"><MapPin size={14}/> {ev.loc}</p>
                            
                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex -space-x-2">
                                    {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white"></div>)}
                                    <span className="text-[10px] pl-3 self-center opacity-60 font-bold">12 joined</span>
                                </div>
                                <button onClick={() => setSelectedEvent(ev)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95">Apply Volunteer</button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

const SettingsToggles = ({ language, setLanguage, isDark, setIsDark, isLanding = false }) => {
    return (
        <div className="flex items-center gap-2">
            <button onClick={setLanguage} className={`p-2 rounded-full font-bold text-[10px] flex items-center gap-1 transition-all border ${isLanding ? 'bg-white/10 text-white border-white/20' : isDark ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-white text-slate-700 border-slate-200'}`}><Globe size={14}/> {language === 'en' ? 'EN' : 'MS'}</button>
            <button onClick={setIsDark} className={`p-2 rounded-full transition-all border ${isLanding ? 'bg-white/10 text-white border-white/20' : isDark ? 'bg-slate-800 text-yellow-400 border-slate-700' : 'bg-white text-slate-700 border-slate-200'}`}>{isDark ? <Sun size={14}/> : <Moon size={14}/>}</button>
        </div>
    );
};

// 1. LANDING PAGE
function LandingPage({ t, language, setLanguage, isDark, setIsDark }) {
  const navigate = useNavigate();
  const scrollTo = (id) => { document.getElementById(id).scrollIntoView({ behavior: 'smooth' }); };
  
  const ceo = TEAM_MEMBERS[0];
  const subordinates = TEAM_MEMBERS.slice(1);

  return (
    <div className={`font-sans overflow-x-hidden ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
       <header className="relative h-screen flex flex-col items-center justify-center text-center px-4">
         <div className="absolute inset-0 z-0"><img src="https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=2574&auto=format&fit=crop" className="w-full h-full object-cover" alt="Nature"/><div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-black/90 via-black/60 to-slate-900' : 'from-black/70 via-black/40 to-slate-900'}`}></div></div>
         <nav className="absolute top-0 w-full z-50 px-6 md:px-12 py-6 flex justify-between items-center">
            <div className="flex items-center gap-2 font-black text-xl md:text-2xl text-white tracking-tight"><div className="bg-emerald-500 p-1.5 md:p-2 rounded-lg flex items-center justify-center"><BookOpen className="text-white w-4 h-4 md:w-6 md:h-6" /><Leaf className="text-emerald-900 w-3 h-3 md:w-4 md:h-4 -ml-1 md:-ml-2 mt-1" /></div> {t.heroTitle}</div>
            <div className="flex items-center gap-3">
                <button onClick={() => scrollTo('team-section')} className="hidden md:block text-white text-sm font-bold opacity-80 hover:opacity-100 mr-4">Our Team</button>
                <SettingsToggles language={language} setLanguage={setLanguage} isDark={isDark} setIsDark={setIsDark} isLanding={true} />
                <button onClick={() => navigate('/login')} className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full font-bold text-xs md:text-sm hover:bg-white hover:text-emerald-900 transition-all">{t.access}</button>
            </div>
         </nav>
         <div className="relative z-10 max-w-4xl space-y-4 md:space-y-6 animate-fade-in-up mt-10 px-4">
           <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 bg-emerald-500/30 border border-emerald-400/50 rounded-full text-emerald-300 font-bold text-[10px] md:text-xs uppercase tracking-widest backdrop-blur-md"><Zap size={12}/> INITIATIVE</div>
           <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-none">EDUCYCLE<span className="text-emerald-400">.</span></h1>
           <p className="text-lg md:text-2xl text-slate-200 max-w-2xl mx-auto font-light leading-relaxed">{t.heroDesc}</p>
           <button onClick={() => scrollTo('about-section')} className="mt-4 px-8 py-3 md:px-10 md:py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-full text-sm md:text-lg shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] transition-all flex items-center gap-2 mx-auto">{t.explore} <ArrowRight /></button>
         </div>
       </header>
       
       {/* ABOUT SECTION */}
       <section id="about-section" className={`py-16 md:py-20 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
         <div className="max-w-full mx-auto px-6">
            <div className="mb-10 max-w-2xl"><h2 className="text-3xl md:text-4xl font-black mb-4">{t.aboutTitle}</h2><p className={`text-base md:text-lg leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.aboutDesc}</p></div>
            <div className="flex overflow-x-auto gap-4 md:gap-6 pb-8 snap-x scrollbar-hide md:grid md:grid-cols-4 md:pb-0 md:overflow-visible">
                {[{t: t.cat1, d: t.desc1, i: MapPin, c: "bg-emerald-500", img: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800"}, {t: t.cat2, d: t.desc2, i: Gift, c: "bg-orange-500", img: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800"}, {t: t.cat3, d: t.desc3, i: Users, c: "bg-blue-500", img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800"}, {t: t.cat4, d: t.desc4, i: FlaskConical, c: "bg-purple-500", img: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=800"}].map((item, idx) => (
                    <div key={idx} className="snap-center shrink-0 w-[80vw] md:w-auto h-[400px] rounded-3xl overflow-hidden relative group cursor-pointer shadow-xl"><img src={item.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Card"/><div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-6 flex flex-col justify-end"><div className={`${item.c} w-10 h-10 rounded-full flex items-center justify-center mb-4 text-white shadow-lg`}><item.i size={20}/></div><h3 className="text-2xl font-bold text-white mb-2">{item.t}</h3><p className="text-slate-300 text-xs md:text-sm leading-relaxed opacity-90">{item.d}</p></div></div>
                ))}
            </div>
         </div>
       </section>

       {/* --- NEW TEAM SECTION (TREE STRUCTURE) --- */}
       <section id="team-section" className={`py-20 ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}>
           <div className="max-w-6xl mx-auto px-6 text-center">
               <h2 className="text-4xl font-black mb-12">Our Organization</h2>
               
               <div className="flex flex-col items-center">
                   {/* LEVEL 1: CEO */}
                   <div className="flex justify-center mb-4 relative z-10">
                       <TeamCard member={ceo} isDark={isDark} />
                   </div>

                   {/* CONNECTOR LINES */}
                   <div className="w-full max-w-2xl h-8 relative mb-4 hidden md:block">
                       {/* Center Line Down from CEO */}
                       <div className={`absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
                       {/* Horizontal Line connecting branches */}
                       <div className={`absolute left-[16%] right-[16%] top-1/2 h-px -translate-y-1/2 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
                       {/* Vertical Lines down to subordinates */}
                       <div className={`absolute left-[16%] top-1/2 bottom-0 w-px ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
                       <div className={`absolute right-[16%] top-1/2 bottom-0 w-px ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
                   </div>

                   {/* LEVEL 2: DEPARTMENTS */}
                   <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-12 w-full">
                       {subordinates.map((m, idx) => (
                           <div key={idx} className="flex flex-col items-center relative">
                               {/* Mobile Connector */}
                               <div className={`h-8 w-px mb-2 md:hidden ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
                               <TeamCard member={m} isDark={isDark} />
                           </div>
                       ))}
                   </div>
               </div>
           </div>
       </section>
    </div>
  );
}

// 2. LOGIN PAGE
// 2. LOGIN PAGE (UPDATED)
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
    setTimeout(() => { setLoading(false); if (formData.email.includes('@') && formData.username) { setCurrentUser({ name: formData.username, email: formData.email, role: 'user' }); navigate('/dashboard'); } else { alert("Invalid credentials."); } }, 1000);
  };

  // --- NEW: AUTO-SUBMIT LOGIC ---
  const handlePasscodeChange = (e) => {
      // 1. Ambil value dan buang apa-apa yang bukan nombor
      const val = e.target.value.replace(/\D/g, ''); 
      
      // 2. Limitkan kepada 4 digit sahaja
      if (val.length > 4) return;

      setAdminPasscode(val);

      // 3. Jika cukup 4 digit, check terus
      if (val.length === 4) {
          if (val === '1234') {
              // Kod Betul: Login terus
              setCurrentUser({ name: 'Administrator', email: 'admin@educycle.com', role: 'admin' }); 
              navigate('/admin-dashboard');
          } else {
              // Kod Salah: Shake dan reset
              setIsShaking(true); 
              setTimeout(() => { 
                  setIsShaking(false); 
                  setAdminPasscode(''); 
              }, 500);
          }
      }
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
       
       {/* --- ADMIN MODAL UPDATE --- */}
       {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in px-4">
            <div className={`bg-slate-900 w-full max-w-sm p-8 rounded-3xl shadow-2xl border border-slate-700 relative ${isShaking ? 'animate-shake' : ''}`}>
                <button onClick={() => setShowAdminModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><XCircle/></button>
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700"><Lock size={32} className="text-emerald-500"/></div>
                    <h3 className="text-xl font-bold text-white">Security Clearance</h3>
                    <p className="text-xs text-slate-400 mt-1">Key in 4-digit PIN</p>
                </div>
                
                {/* INPUT PIN YANG BARU */}
                <div className="mb-6">
                    <div className="relative">
                        <Key className="absolute left-4 top-3.5 text-slate-500" size={18}/>
                        <input 
                            type="password" 
                            inputMode="numeric" // Keyboard phone akan keluar nombor sahaja
                            pattern="[0-9]*" 
                            maxLength="4" 
                            autoFocus 
                            value={adminPasscode} 
                            onChange={handlePasscodeChange} 
                            placeholder="• • • •" 
                            className="w-full bg-slate-950 border border-slate-700 text-white text-center text-2xl tracking-[0.5em] rounded-xl p-3 font-bold outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-slate-700"
                        />
                    </div>
                </div>
                <p className="text-center text-[10px] text-slate-500 uppercase tracking-widest">Auto-redirecting...</p>
            </div>
        </div>
       )}
    </div>
  );
}

// 3. USER DASHBOARD
function UserDashboard({ currentUser, setCurrentUser, dbRequests, dbEvents, dbNews, dbRedemptions, dbProducts, fetchRequests, companyFund, fundGoal, t, language, setLanguage, isDark, setIsDark, joinedEventIds }) {
  const navigate = useNavigate();
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [showDonate, setShowDonate] = useState(false);
  const [showEcoCube, setShowEcoCube] = useState(false); 
  const [showShop, setShowShop] = useState(false); 
  const [showMemberPay, setShowMemberPay] = useState(false); // NEW STATE FOR PAYMENT MODAL
  
  const [loading, setLoading] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState(['Plastic']);
  const [deliveryMethod, setDeliveryMethod] = useState('Pickup');
  const [expandedImage, setExpandedImage] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedReward, setSelectedReward] = useState(null);

  useEffect(() => { if (!currentUser) navigate('/login'); }, [currentUser, navigate]);
  if (!currentUser) return null;

  const myReqs = dbRequests.filter(r => r.student === currentUser.name && r.status === 'Approved');
  const totalEarned = myReqs.reduce((acc, curr) => acc + (curr.points || 0), 0);
  const myRedemptions = dbRedemptions ? dbRedemptions.filter(r => r.student_name === currentUser.name) : [];
  const totalSpent = myRedemptions.reduce((acc, curr) => acc + (curr.cost || 0), 0);
  const totalPoints = totalEarned - totalSpent; 
  const fundProgress = Math.min((companyFund / fundGoal) * 100, 100);
  
  const handleLogout = () => { setCurrentUser(null); navigate('/'); };
  const toggleSelection = (id) => { if (selectedTypes.includes(id)) { if (selectedTypes.length > 1) setSelectedTypes(selectedTypes.filter(t => t !== id)); } else { setSelectedTypes([...selectedTypes, id]); } };
  const triggerRedeem = (reward) => { setSelectedReward(reward); };

  const confirmRedeem = async (reward) => {
      const { error } = await supabase.from('redemptions').insert([{ student_name: currentUser.name, reward_name: reward.name, cost: reward.cost }]);
      if (!error) { setToast({message: `Redeemed ${reward.name}!`, type: "success"}); fetchRequests(); } 
      else { setToast({message: "Redemption failed!", type: "error"}); }
      setSelectedReward(null);
  };
  
  const handleJoinEvent = async (ev) => { 
      await supabase.from('event_participants').insert([{ event_id: ev.id, student_name: currentUser.name, student_email: currentUser.email }]);
      await supabase.from('events').update({ participants: (ev.participants || 0) + 1 }).eq('id', ev.id); 
      setToast({message: `Joined ${ev.title} successfully!`, type: "success"}); 
      fetchRequests(); 
  };
  
  const handleImageClick = (ev) => { if(ev.zoom_enabled) { setExpandedImage(ev.img); } };
  
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    const weight = parseFloat(e.target.weight.value);
    let points = Math.floor(weight * 10); 
    if (deliveryMethod === 'Pickup') points = Math.max(0, points - 20); else points += 50;
    const { error } = await supabase.from('requests').insert([{ student: currentUser.name, email: currentUser.email, type: selectedTypes.join(', '), weight: weight + 'kg', location: e.target.location.value, status: 'Pending', date: new Date().toISOString().split('T')[0], points, method: deliveryMethod }]);
    if (!error) { setToast({message: "Request submitted!", type: "success"}); setShowNewEntry(false); fetchRequests(); } else { setToast({message: "Error submitting.", type: "error"}); }
    setLoading(false);
  };

  // --- NEW: HANDLE MEMBERSHIP UPGRADE WITH FIXED ID ---
  const handleUpgradeMember = (generatedId) => {
      // Save ID to state and LocalStorage so it persists
      const updatedUser = { ...currentUser, isMember: true, memberId: generatedId };
      setCurrentUser(updatedUser); // Update Parent State & LocalStorage
      setShowMemberPay(false);
      navigate('/member-zone');
  };

  const wasteOptions = [{ id: 'Plastic', icon: Coffee, color: 'text-blue-500 bg-blue-50', rate: 10 }, { id: 'Paper', icon: FileText, color: 'text-yellow-600 bg-yellow-50', rate: 5 }, { id: 'Tin', icon: Database, color: 'text-gray-600 bg-gray-50', rate: 15 }, { id: 'E-Waste', icon: Smartphone, color: 'text-purple-600 bg-purple-50', rate: 50 }];
  
  return (
    <div className={`min-h-screen font-sans pb-20 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <DonateModal isOpen={showDonate} onClose={() => setShowDonate(false)} isDark={isDark} />
      <RedeemModal isOpen={!!selectedReward} onClose={() => setSelectedReward(null)} reward={selectedReward} userPoints={totalPoints} onConfirm={confirmRedeem} isDark={isDark} />
      
      {/* NEW MODALS */}
      <EcoCubeModal isOpen={showEcoCube} onClose={() => setShowEcoCube(false)} isDark={isDark} />
      <ShopModal isOpen={showShop} onClose={() => setShowShop(false)} products={dbProducts} isDark={isDark} />
      <MembershipPayModal isOpen={showMemberPay} onClose={() => setShowMemberPay(false)} onSuccess={handleUpgradeMember} isDark={isDark} />

      <header className={`sticky top-0 z-40 shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b`}>
        <div className="bg-[#0f172a] text-white py-3 px-6 group relative overflow-hidden transition-all hover:bg-slate-900"><div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"></div><div className="max-w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4 relative z-10"><div className="flex items-center gap-3"><div className="bg-emerald-500/20 p-2 rounded-xl border border-emerald-500/30 group-hover:scale-110 transition-transform"><BarChart3 size={20} className="text-emerald-400"/></div><div><p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Phase 1 Funding</p><h3 className="font-black text-lg text-white leading-none">SEED ROUND</h3></div></div><div className="flex-1 w-full max-w-2xl flex items-center gap-2"><div className="flex-1"><div className="flex justify-between text-[10px] font-bold mb-1 px-1"><span className="text-emerald-300">RM {companyFund.toLocaleString()}</span><span className="text-slate-500">Goal: RM {fundGoal.toLocaleString()}</span></div><div className="w-full bg-slate-800 h-3 md:h-4 rounded-full overflow-hidden border border-slate-700 shadow-[0_0_10px_rgba(16,185,129,0.15)] relative"><div className="bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-500 h-full rounded-full transition-all duration-1000 relative flex items-center justify-end pr-2" style={{width: `${fundProgress}%`}}><div className="absolute inset-0 w-full h-full bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[length:15px_15px] opacity-30 animate-[pulse_2s_infinite]"></div></div></div></div><button onClick={() => setShowDonate(true)} className="bg-emerald-500 hover:bg-emerald-400 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-transform active:scale-95 shadow-lg">Donate</button></div><div className="hidden md:block"><span className="bg-emerald-500 text-white font-black text-sm px-3 py-1 rounded-lg shadow-lg group-hover:scale-100 transition-transform inline-block">{Math.floor(fundProgress)}%</span></div></div></div>
        <div className={`px-6 py-3 flex justify-between items-center backdrop-blur-md ${isDark ? 'bg-slate-800/80' : 'bg-white/80'}`}><div className="flex items-center gap-2 text-emerald-500 font-black text-lg"><BookOpen size={20}/> EDUCYCLE</div><div className="flex items-center gap-3"><SettingsToggles language={language} setLanguage={setLanguage} isDark={isDark} setIsDark={setIsDark} /><div className="text-right hidden md:block"><p className="text-[10px] opacity-60 font-bold uppercase">{t.welcome}</p><p className="font-bold text-sm">{currentUser.name}</p></div><button onClick={handleLogout} className={`p-2 rounded-full transition-colors ${isDark ? 'bg-slate-700 hover:bg-red-900 text-slate-300' : 'bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500'}`}><LogOut size={16}/></button></div></div>
      </header>
      <main className="max-w-7xl mx-auto px-6 md:px-10 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
            <div className="lg:col-span-2 bg-emerald-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg flex flex-col justify-between min-h-[250px]"><div className="relative z-10"><div className="flex justify-between items-start"><div><p className="text-emerald-200 text-[10px] font-bold uppercase tracking-widest mb-1">{t.calculator}</p><h2 className="text-4xl md:text-5xl font-black">{totalPoints} <span className="text-sm font-medium opacity-70">pts</span></h2></div><button onClick={() => setShowNewEntry(true)} className="bg-white text-emerald-800 px-4 py-2 rounded-lg font-bold text-xs shadow-lg hover:bg-emerald-50 active:scale-95 transition-all flex items-center gap-1"><Plus size={14}/> {t.newEntry}</button></div>
            {/* --- IMPACT SECTION --- */}
            <div className="grid grid-cols-3 gap-2 md:gap-3 mt-6">
                <div className="bg-emerald-500/30 p-3 md:p-4 rounded-xl backdrop-blur-sm border border-emerald-400/20"><CloudRain className="mb-2 opacity-80" size={18}/><p className="text-xl md:text-2xl font-black">{(totalEarned * 0.12).toFixed(1)}</p><p className="text-[9px] md:text-[10px] opacity-90 leading-tight mt-1 font-medium">{t.co2}</p><p className="text-[8px] opacity-70 mt-1 italic">~{(totalEarned * 0.05).toFixed(1)} km driven</p></div>
                <div className="bg-emerald-500/30 p-3 md:p-4 rounded-xl backdrop-blur-sm border border-emerald-400/20"><Zap className="mb-2 opacity-80" size={18}/><p className="text-xl md:text-2xl font-black">{(totalEarned * 0.5).toFixed(0)}</p><p className="text-[9px] md:text-[10px] opacity-90 leading-tight mt-1 font-medium">{t.energy}</p><p className="text-[8px] opacity-70 mt-1 italic">~{Math.floor(totalEarned/20)} hrs light</p></div>
                <div className="bg-emerald-500/30 p-3 md:p-4 rounded-xl backdrop-blur-sm border border-emerald-400/20"><Fish className="mb-2 opacity-80" size={18}/><p className="text-xl md:text-2xl font-black">{Math.floor(totalEarned / 100)}</p><p className="text-[9px] md:text-[10px] opacity-90 leading-tight mt-1 font-medium">{t.life}</p><p className="text-[8px] opacity-70 mt-1 italic">Marine life saved</p></div>
            </div>
            </div><Leaf className="absolute -bottom-8 -right-8 text-emerald-500 w-48 h-48 opacity-20 rotate-12"/></div>
            
            {/* --- REWARDS (KEMBALI DI SINI) --- */}
            <div className={`rounded-2xl p-5 border shadow-sm flex flex-col h-[250px] ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}><div className="flex justify-between items-center mb-4"><h3 className="font-bold flex items-center gap-2 text-sm"><Gift className="text-orange-500" size={18}/> {t.rewards}</h3><span className="text-xs font-bold opacity-60">{totalPoints} {t.available}</span></div><div className="flex-1 overflow-y-auto space-y-3 pr-1">{REWARDS_DATA.map(r => (<div key={r.id} onClick={() => triggerRedeem(r)} className={`flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer group ${isDark ? 'bg-slate-700 border-slate-600 hover:border-emerald-500' : 'bg-slate-50 border-slate-100 hover:border-emerald-200 hover:bg-emerald-50'}`}><div className="flex items-center gap-3"><div className={`p-2 rounded-lg shadow-sm ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-600'} group-hover:text-emerald-500`}><r.icon size={16}/></div><div><p className="font-bold text-xs md:text-sm">{r.name}</p><p className="text-[10px] font-bold opacity-60">{r.cost} pts</p></div></div><ChevronRight size={16} className="opacity-40 group-hover:text-emerald-500 group-hover:opacity-100"/></div>))}</div></div>
        </div>

        {/* --- EXTRA SERVICES ROW (BARU DI BAWAH) --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div onClick={() => setShowEcoCube(true)} className={`p-4 rounded-xl border flex flex-row items-center gap-4 cursor-pointer transition-all hover:scale-95 ${isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-emerald-50 shadow-sm'}`}>
                <div className="bg-emerald-100 p-3 rounded-full"><Package size={24} className="text-emerald-600"/></div>
                <div><span className="font-bold text-sm block">Eco-Cube</span><span className="text-[10px] opacity-60">Toiletries Box</span></div>
            </div>
            <div onClick={() => setShowShop(true)} className={`p-4 rounded-xl border flex flex-row items-center gap-4 cursor-pointer transition-all hover:scale-95 ${isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-orange-50 shadow-sm'}`}>
                <div className="bg-orange-100 p-3 rounded-full"><ShoppingBag size={24} className="text-orange-600"/></div>
                <div><span className="font-bold text-sm block">Recycle Shop</span><span className="text-[10px] opacity-60">Merchandise</span></div>
            </div>
            {/* --- MEMBERSHIP BUTTON (NEW) --- */}
            <div onClick={() => currentUser.isMember ? navigate('/member-zone') : setShowMemberPay(true)} className={`col-span-2 p-4 rounded-xl border flex flex-row items-center gap-4 cursor-pointer transition-all hover:scale-95 relative overflow-hidden group ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className={`absolute right-0 top-0 bottom-0 w-2 ${currentUser.isMember ? 'bg-blue-500' : 'bg-yellow-400'}`}></div>
                <div className={`${currentUser.isMember ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'} p-3 rounded-full`}><Star size={24}/></div>
                <div>
                    <span className="font-bold text-sm block flex items-center gap-2">Membership {currentUser.isMember && <span className="bg-blue-500 text-white text-[9px] px-2 rounded-full">ACTIVE</span>}</span>
                    <span className="text-[10px] opacity-60">{currentUser.isMember ? "Enter Member Zone" : "Upgrade for RM10"}</span>
                </div>
            </div>
        </div>

        <div className="mb-6"><h3 className="text-lg font-bold mb-3 flex items-center gap-2"><Calendar className="text-blue-500" size={18}/> {t.events}</h3>
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
            {dbEvents.length === 0 ? <p className="text-sm opacity-50">{t.noEvents}</p> : dbEvents.map(ev => {
                const isJoined = joinedEventIds.includes(ev.id);
                return (
                <div key={ev.id} className={`min-w-[280px] max-w-[280px] snap-start shrink-0 rounded-xl border shadow-sm relative group hover:shadow-md transition-all ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                    <div className={`h-32 md:h-40 overflow-hidden relative bg-slate-200 ${ev.zoom_enabled ? 'cursor-zoom-in' : ''}`} onClick={() => handleImageClick(ev)}><img src={ev.img || "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?q=80&w=800&auto=format&fit=crop"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={ev.title}/>{ev.zoom_enabled && <div className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"><Eye size={12}/></div>}</div>
                    <div className="p-4">
                        <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase mb-2 ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{ev.date}</span>
                        <h4 className="font-bold text-sm mb-1 truncate">{ev.title}</h4>
                        <p className="text-[10px] opacity-60 flex items-center gap-1 mb-3"><MapPin size={10}/> {ev.loc}</p>
                        <div className="flex items-center justify-between mt-3">
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500"><Users size={12}/> {ev.participants || 0}</span>
                            <button onClick={() => !isJoined && handleJoinEvent(ev)} disabled={isJoined} className={`px-4 py-1.5 border rounded-lg text-[10px] font-bold transition-all ${isJoined ? 'bg-emerald-100 text-emerald-600 border-emerald-200 cursor-default shadow-inner' : isDark ? 'border-slate-600 hover:bg-emerald-600 hover:border-emerald-600 text-slate-300 hover:text-white' : 'border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 bg-slate-50'}`}>{isJoined ? 'Joined ✓' : t.join}</button>
                        </div>
                    </div>
                </div>
            )})}
        </div></div>
        
        {/* LOGS & NEWS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2"><h3 className="font-bold mb-3 flex items-center gap-2 text-sm"><History size={16} className="text-purple-500"/> {t.logs}</h3><div className={`rounded-2xl p-4 border shadow-sm min-h-[300px] ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>{dbRequests.filter(r=>r.student === currentUser.name).length === 0 ? <p className="text-center opacity-50 py-20 text-xs">{t.noLogs}</p> : dbRequests.filter(r=>r.student === currentUser.name).map(req => (<div key={req.id} className={`flex justify-between items-center py-4 border-b last:border-0 transition-colors px-2 rounded-lg ${isDark ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-50 hover:bg-slate-50'}`}><div className="flex items-center gap-4"><div className={`w-10 h-10 rounded-full flex items-center justify-center ${req.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : req.status === 'Rejected' ? 'bg-red-100 text-red-500' : 'bg-orange-100 text-orange-500'}`}>{req.status === 'Approved' ? <CheckCircle size={18}/> : req.status === 'Rejected' ? <XCircle size={18}/> : <Loader2 size={18} className="animate-spin"/>}</div><div><p className="font-bold text-sm flex items-center gap-2">{req.type} {req.method === 'Drop-off' && <span className="bg-purple-100 text-purple-600 text-[9px] px-1 rounded">SELF</span>}</p><p className="text-[10px] opacity-60 font-medium">{req.date} • {req.weight} • {req.location}</p></div></div><div className="text-right"><span className="block font-black text-emerald-500 text-sm">+{req.points} pts</span><span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : req.status === 'Rejected' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'}`}>{req.status}</span></div></div>))}</div></div>
            <div><h3 className="font-bold mb-3 flex items-center gap-2 text-sm"><Megaphone size={16} className="text-red-500"/> {t.updates}</h3><div className={`rounded-2xl p-5 border min-h-[300px] ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-blue-50 border-blue-100'}`}>{dbNews.map(n => (<div key={n.id} className={`mb-4 pb-4 border-b last:border-0 ${isDark ? 'border-slate-700' : 'border-blue-100'}`}><span className="bg-blue-200 text-blue-800 text-[9px] font-bold px-2 py-0.5 rounded mb-2 inline-block">{n.date}</span><p className={`font-bold text-sm mb-1 ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>{n.title}</p><p className={`text-[10px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-blue-600'}`}>{n.content}</p></div>))}</div></div>
        </div>
      </main>
      
      {showNewEntry && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in"><div className={`w-full max-w-lg rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}><button onClick={() => setShowNewEntry(false)} className="absolute top-4 right-4 opacity-50 hover:opacity-100"><XCircle/></button><div className="text-center mb-6"><h2 className="text-2xl font-black flex items-center justify-center gap-2"><Leaf className="text-emerald-500"/> {t.newEntry}</h2></div><form onSubmit={handleSubmit} className="space-y-6"><div className="grid grid-cols-2 gap-3 mb-4"><div onClick={() => setDeliveryMethod('Pickup')} className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${deliveryMethod === 'Pickup' ? 'border-emerald-500 bg-emerald-500/10' : isDark ? 'border-slate-600 hover:border-slate-500' : 'border-slate-100 hover:border-emerald-100'}`}><Truck size={24} className={deliveryMethod === 'Pickup' ? 'text-emerald-500' : 'opacity-50'}/><div className="text-center"><span className="block font-bold text-xs">{t.methodPickup}</span><span className="text-[10px] text-red-400 font-bold">-20 pts ({t.fee})</span></div></div><div onClick={() => setDeliveryMethod('Drop-off')} className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${deliveryMethod === 'Drop-off' ? 'border-emerald-500 bg-emerald-500/10' : isDark ? 'border-slate-600 hover:border-slate-500' : 'border-slate-100 hover:border-emerald-100'}`}><Package size={24} className={deliveryMethod === 'Drop-off' ? 'text-emerald-500' : 'opacity-50'}/><div className="text-center"><span className="block font-bold text-xs">{t.methodDropoff}</span><span className="text-[10px] text-emerald-500 font-bold">+50 pts ({t.bonus})</span></div></div></div><div className="grid grid-cols-2 gap-3">{wasteOptions.map((option) => { const isSelected = selectedTypes.includes(option.id); return (<div key={option.id} onClick={() => toggleSelection(option.id)} className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex flex-col items-center justify-center gap-2 relative ${isSelected ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500' : isDark ? 'border-slate-600 hover:border-slate-500' : 'border-slate-100 hover:border-emerald-200'}`}><div className={`p-3 rounded-full ${option.color}`}><option.icon size={24} /></div><div className="text-center"><span className={`block font-bold text-sm ${isSelected ? 'text-emerald-500' : ''}`}>{option.id}</span><span className="text-[10px] font-bold opacity-60 uppercase tracking-wide">{option.rate} pts/kg</span></div>{isSelected && <div className="absolute top-2 right-2 text-emerald-500"><CheckCircle size={16} fill="currentColor" className={isDark ? 'text-slate-900' : 'text-white'}/></div>}</div>); })}</div><div className="space-y-4"><div><label className="text-xs font-bold opacity-60 uppercase tracking-wider mb-1 block">Location</label><select name="location" className={`w-full border rounded-xl p-3 font-bold outline-none focus:ring-2 focus:ring-emerald-400 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200 text-slate-700'}`}><option>Hostel Block A</option><option>Hostel Block B</option><option>Main Library</option><option>Student Cafe</option><option>Faculty of Eng</option></select></div><div><label className="text-xs font-bold opacity-60 uppercase tracking-wider mb-1 block">Weight (KG)</label><input name="weight" type="number" step="0.1" placeholder="e.g. 2.5" required className={`w-full border-2 rounded-xl p-3 font-bold outline-none focus:border-emerald-400 text-lg ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200 text-slate-700'}`}/></div></div><button disabled={loading} className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg active:scale-95">{loading ? "Calculating..." : "Submit Recycle Entry"}</button></form></div></div>
      )}
      {expandedImage && (<div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 animate-in fade-in" onClick={() => setExpandedImage(null)}><button className="absolute top-4 right-4 text-white p-2 bg-white/10 rounded-full hover:bg-white/20"><X/></button><img src={expandedImage} className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()} alt="Zoomed"/></div>)}
    </div>
  );
}

// 4. ADMIN DASHBOARD
// 4. ADMIN DASHBOARD (UPDATED)
function AdminDashboard({ currentUser, setCurrentUser, dbRequests, dbEvents, dbNews, dbProducts, fetchData, companyFund, t, language, setLanguage, isDark, setIsDark }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [eventForm, setEventForm] = useState({ title: '', date: '', loc: '', img: null, zoom_enabled: false });
  const [productForm, setProductForm] = useState({ name: '', price: '', img: null });

  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  
  // State untuk Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [deleteTarget, setDeleteTarget] = useState(null); 
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingIds, setDeletingIds] = useState([]);
  const [viewParticipants, setViewParticipants] = useState(null);
  const [participantsList, setParticipantsList] = useState([]);

  useEffect(() => { if(currentUser?.role !== 'admin') navigate('/login'); }, [currentUser, navigate]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => { fetchData(); }, 2000); 
    return () => clearInterval(interval);
  }, []);

  const handleStatus = async (id, status) => { await supabase.from('requests').update({ status }).eq('id', id); setToast({message: `Status updated to ${status}`, type: "success"}); fetchData(); };
  
  const fetchParticipants = async (eventId) => {
      const { data, error } = await supabase.from('event_participants').select('*').eq('event_id', eventId);
      if(data) setParticipantsList(data);
      setViewParticipants(eventId);
  };

  const handleImageUpload = async (e, type = 'event') => {
      try {
          if (!e.target.files || e.target.files.length === 0) return;
          const file = e.target.files[0];
          setUploading(true);
          const fileName = `${Math.random().toString(36).substring(7)}_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
          let { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
          if (uploadError) throw uploadError;
          const { data } = supabase.storage.from('images').getPublicUrl(fileName);
          if(type === 'event') setEventForm({ ...eventForm, img: data.publicUrl });
          else setProductForm({ ...productForm, img: data.publicUrl });
          setToast({message: "Image uploaded!", type: "success"});
      } catch (error) {
          setToast({message: "Upload failed: " + error.message, type: "error"});
      } finally {
          setUploading(false);
      }
  };

  const handleAddEvent = async (e) => { 
      e.preventDefault(); 
      if (!eventForm.img) return setToast({message: "Please upload image!", type: "error"});
      await supabase.from('events').insert([eventForm]); 
      setToast({message: "Event Published!", type: "success"}); fetchData(); 
      setEventForm({ title: '', date: '', loc: '', img: null, zoom_enabled: false }); 
  };
  
  const handleAddNews = async (e) => { 
      e.preventDefault(); 
      await supabase.from('news').insert([{ title: e.target.title.value, content: e.target.content.value, date: new Date().toISOString().split('T')[0] }]); 
      setToast({message: "News posted!", type: "success"}); 
      fetchData(); 
      e.target.reset(); 
  };

  const handleAddProduct = async (e) => {
      e.preventDefault();
      if (!productForm.img) return setToast({message: "Please upload product image!", type: "error"});
      await supabase.from('products').insert([productForm]);
      setToast({message: "Product Listed!", type: "success"});
      fetchData();
      setProductForm({ name: '', price: '', img: null });
  };

  const confirmDelete = async () => {
      if(!deleteTarget) return;
      setIsDeleting(true);
      setDeletingIds(prev => [...prev, deleteTarget.id]); 
      let table = 'events';
      if(deleteTarget.type === 'news') table = 'news';
      if(deleteTarget.type === 'product') table = 'products';
      setTimeout(async () => {
          const { error } = await supabase.from(table).delete().eq('id', deleteTarget.id);
          if(error) { setToast({message: "Delete failed!", type: "error"}); setDeletingIds(prev => prev.filter(id => id !== deleteTarget.id)); } 
          else { setToast({message: "Deleted successfully.", type: "success"}); fetchData(); setDeletingIds(prev => prev.filter(id => id !== deleteTarget.id)); }
          setDeleteTarget(null);
          setIsDeleting(false);
      }, 500);
  };

  const totalUsers = new Set(dbRequests.map(r => r.student)).size;
  const pendingCount = dbRequests.filter(r => r.status === 'Pending').length;
  const totalSales = dbProducts.reduce((acc, curr) => acc + (curr.sold || 0), 0);

  return (
    <div className={`min-h-screen flex font-sans ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        
        <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} title="Delete Item?" message="This action cannot be undone." isDark={isDark} />
        <ParticipantsModal isOpen={!!viewParticipants} onClose={() => setViewParticipants(null)} participants={participantsList} isDark={isDark} />
        
        {/* OVERLAY GELAP UNTUK MOBILE */}
        {isSidebarOpen && (<div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in" onClick={() => setIsSidebarOpen(false)}></div>)}
        
        {/* SIDEBAR ADMIN */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isDark ? 'bg-slate-950 text-slate-400 border-r border-slate-800' : 'bg-slate-900 text-slate-400'} flex flex-col shadow-2xl lg:shadow-none`}>
            
            <div className="p-6 text-white font-black text-2xl flex items-center justify-between">
                <div className="flex items-center gap-2"><LayoutDashboard className="text-emerald-500"/> ADMIN</div>
                
                {/* --- FIX: BUTANG TUTUP SIDEBAR (MOBILE) --- */}
                {/* Butang ini hanya muncul pada screen kecil (lg:hidden) */}
                <button 
                    onClick={() => setIsSidebarOpen(false)} 
                    className="lg:hidden p-2 rounded-lg bg-slate-800 text-white hover:bg-red-600 transition-colors shadow-lg border border-slate-700"
                >
                    <X size={20}/>
                </button>
                {/* ------------------------------------------ */}

            </div>

            <nav className="flex-1 px-4 space-y-2">
                <button onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'overview' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800'}`}><BarChart3 size={18}/> Overview</button>
                <button onClick={() => { setActiveTab('requests'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'requests' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800'}`}><ShieldCheck size={18}/> Requests <span className="bg-red-500 text-white text-[10px] px-2 rounded-full ml-auto">{pendingCount}</span></button>
                <button onClick={() => { setActiveTab('events'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'events' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800'}`}><Calendar size={18}/> Manage Events</button>
                <button onClick={() => { setActiveTab('news'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'news' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800'}`}><Megaphone size={18}/> Announcements</button>
                <button onClick={() => { setActiveTab('merch'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'merch' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800'}`}><ShoppingBag size={18}/> Merchandise</button>
            </nav>
            <div className="p-4"><button onClick={() => navigate('/')} className="w-full flex items-center gap-2 p-3 text-red-400 font-bold hover:bg-slate-800 rounded-xl transition-all"><LogOut size={18}/> Logout</button></div>
        </aside>

        <main className={`flex-1 p-4 md:p-10 transition-all duration-300 lg:ml-64`}>
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    {/* BUTANG BUKA MENU (MOBILE) */}
                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg active:scale-95"><Menu size={24}/></button>
                    <h2 className="text-2xl md:text-3xl font-black">{activeTab === 'overview' ? t.adminPanel : activeTab === 'requests' ? t.pickup : activeTab === 'events' ? t.manageEvents : activeTab === 'news' ? t.updates : 'Merchandise'}</h2>
                </div>
                <div className="flex items-center gap-3"><SettingsToggles language={language} setLanguage={setLanguage} isDark={isDark} setIsDark={setIsDark} /><div className={`hidden md:flex px-4 py-2 rounded-full border font-bold text-sm items-center gap-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 text-slate-700'}`}><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Administrator</div></div>
            </div>
            <div className="">
            {activeTab === 'overview' && (<div className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"><div className={`p-6 rounded-2xl shadow-sm border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}><div className="flex flex-col"><p className="text-[10px] font-bold uppercase opacity-60 mb-2">Total Users</p><div className="flex items-center gap-4"><div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Users size={24}/></div><h3 className="text-3xl font-black">{totalUsers}</h3></div></div></div><div className={`p-6 rounded-2xl shadow-sm border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}><div className="flex flex-col"><p className="text-[10px] font-bold uppercase opacity-60 mb-2">Total Funding</p><div className="flex items-center gap-4"><div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><Coins size={24}/></div><h3 className="text-3xl font-black">RM {companyFund}</h3></div></div></div><div className={`p-6 rounded-2xl shadow-sm border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}><div className="flex flex-col"><p className="text-[10px] font-bold uppercase opacity-60 mb-2">Pending Req</p><div className="flex items-center gap-4"><div className="p-3 bg-orange-100 text-orange-600 rounded-xl"><AlertCircle size={24}/></div><h3 className="text-3xl font-black">{pendingCount}</h3></div></div></div></div><div className={`p-6 rounded-2xl shadow-sm border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}><h3 className="font-bold mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-emerald-500"/> Funding History</h3><div className="space-y-3"><div className={`flex justify-between items-center p-3 rounded-xl ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}><span className="font-bold">Seed Round A</span><span className="text-emerald-500 font-black">+RM 2,000</span></div><div className={`flex justify-between items-center p-3 rounded-xl ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}><span className="font-bold">Angel Investor</span><span className="text-emerald-500 font-black">+RM 1,250</span></div></div></div></div>)}
            {activeTab === 'requests' && (<div className={`rounded-2xl shadow-sm border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}><div className="overflow-x-auto"><table className="w-full text-left min-w-[600px]"><thead className={`text-xs uppercase ${isDark ? 'bg-slate-900 text-slate-400' : 'bg-slate-50 text-slate-400'}`}><tr><th className="p-4">Student</th><th className="p-4">Method</th><th className="p-4">Type</th><th className="p-4">Location</th><th className="p-4">Status</th><th className="p-4 text-right">Action</th></tr></thead><tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-100'}`}>{dbRequests.map(req => (<tr key={req.id} className={`${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'} transition-colors`}><td className="p-4 font-bold">{req.student}</td><td className="p-4 text-sm opacity-80 flex items-center gap-2">{req.method === 'Drop-off' ? <Package size={14} className="text-purple-500"/> : <Truck size={14} className="text-blue-500"/>} {req.method || 'Pickup'}</td><td className="p-4 text-sm opacity-80">{req.type} ({req.weight})</td><td className="p-4 text-sm opacity-80">{req.location}</td><td className="p-4"><span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${req.status === 'Pending' ? 'bg-orange-100 text-orange-600' : req.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>{req.status}</span></td><td className="p-4 text-right space-x-2 flex justify-end">{req.status === 'Pending' && (<><button onClick={() => handleStatus(req.id, 'Approved')} className="bg-emerald-500 text-white p-2 rounded-lg hover:bg-emerald-600"><CheckCircle size={16}/></button><button onClick={() => handleStatus(req.id, 'Rejected')} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"><XCircle size={16}/></button></>)}</td></tr>))}</tbody></table></div></div>)}
            {activeTab === 'events' && (<div><div className={`p-6 rounded-2xl shadow-sm border mb-8 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}><h4 className="font-bold mb-4">Create New Event</h4><form onSubmit={handleAddEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4"><input value={eventForm.title} onChange={e=>setEventForm({...eventForm, title: e.target.value})} placeholder="Event Title" required className={`border p-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-500 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}/><input value={eventForm.date} onChange={e=>setEventForm({...eventForm, date: e.target.value})} placeholder="Date (e.g 25 Dec 2025)" required className={`border p-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-500 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}/><div className="md:col-span-2"><label className={`block text-xs font-bold mb-2 uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Cover Image</label><div className={`relative border-2 border-dashed rounded-xl h-48 overflow-hidden transition-colors ${isDark ? 'border-slate-700 hover:border-emerald-500' : 'border-slate-300 hover:border-emerald-500'}`}><input type="file" accept="image/*" onChange={(e)=>handleImageUpload(e, 'event')} className="hidden" id="fileUpload"/><label htmlFor="fileUpload" className="absolute inset-0 w-full h-full flex flex-col items-center justify-center cursor-pointer z-10">{eventForm.img ? (<div className="relative w-full h-full group"><img src={eventForm.img} className="w-full h-full object-cover" alt="Preview"/><div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><ImageIcon className="text-white mb-2" size={24}/><span className="text-white font-bold text-sm">Click to Change Image</span></div></div>) : (<div className="text-center"><div className="bg-emerald-500/10 p-3 rounded-full inline-block mb-3"><Upload className="text-emerald-500" size={24}/></div><span className={`block text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{uploading ? "Uploading..." : "Click Anywhere to Upload"}</span></div>)}</label></div></div><input value={eventForm.loc} onChange={e=>setEventForm({...eventForm, loc: e.target.value})} placeholder="Location" required className={`border p-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-500 md:col-span-2 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}/><div className={`flex items-center justify-between p-3 border rounded-xl ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}><span className="text-sm font-bold opacity-70 flex items-center gap-2"><ImageIcon size={16}/> Allow Image Zoom?</span><button type="button" onClick={() => setEventForm({...eventForm, zoom_enabled: !eventForm.zoom_enabled})} className={`w-10 h-5 rounded-full relative transition-colors ${eventForm.zoom_enabled ? 'bg-emerald-500' : 'bg-slate-400'}`}><div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${eventForm.zoom_enabled ? 'left-6' : 'left-1'}`}></div></button></div><button className="md:col-span-2 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700">Publish Event</button></form></div><div className="flex overflow-x-auto gap-4 pb-4 snap-x">{dbEvents.map(ev => (<div key={ev.id} className={`min-w-[280px] max-w-[280px] snap-start shrink-0 rounded-xl border shadow-sm relative group transition-all duration-300 ${deletingIds.includes(ev.id) ? 'opacity-0 scale-90' : 'opacity-100 scale-100'} ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}><button onClick={() => setDeleteTarget({ id: ev.id, type: 'event' })} className="absolute top-2 right-2 z-10 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"><Trash2 size={14}/></button><div className="h-32 overflow-hidden rounded-lg mb-3 relative"><img src={ev.img || "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?q=80&w=800&auto=format&fit=crop"} className="w-full h-full object-cover"/>{ev.zoom_enabled && <div className="absolute bottom-2 right-2 bg-black/60 text-white p-1 rounded-md"><Eye size={12}/></div>}</div><div className="p-4"><h4 className="font-bold">{ev.title}</h4><p className="text-xs opacity-60">{ev.date} • {ev.loc}</p><div className={`mt-4 p-2 rounded-lg flex items-center justify-between ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}><span className="text-[10px] font-bold uppercase opacity-60">Total Joined</span><div className="flex items-center gap-2"><span className="flex items-center gap-1 font-black text-emerald-500"><Users size={14}/> {ev.participants || 0}</span><button onClick={() => fetchParticipants(ev.id)} className="text-[10px] bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded font-bold text-slate-600">View</button></div></div></div></div>))}</div></div>)}
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
                  {dbNews.length === 0 ? <p className="text-sm opacity-50 italic">No announcements posted.</p> : dbNews.map(n => (
                    <div key={n.id} className={`p-4 rounded-xl border shadow-sm flex justify-between items-start group relative ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} transition-all duration-300 ${deletingIds.includes(n.id) ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                      <div>
                        <h4 className="font-bold">{n.title}</h4>
                        <p className="text-xs opacity-60 mt-1">{n.content}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-[10px] px-2 py-1 rounded font-bold ${isDark ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{n.date}</span>
                        <button onClick={() => setDeleteTarget({ id: n.id, type: 'news' })} className="text-red-400 hover:text-red-500 p-1 rounded hover:bg-red-500/10 transition-colors">
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'merch' && (
                <div>
                    <div className={`p-6 rounded-2xl shadow-sm border mb-8 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold">Add New Product</h4>
                            <div className="w-1/3">
                                <div className="flex justify-between text-[10px] mb-1 font-bold"><span className="text-emerald-500">Sales Progress</span><span>{totalSales} items sold</span></div>
                                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden"><div className="bg-emerald-500 h-full rounded-full" style={{width: `${Math.min(totalSales, 100)}%`}}></div></div>
                            </div>
                        </div>
                        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input value={productForm.name} onChange={e=>setProductForm({...productForm, name: e.target.value})} placeholder="Product Name" required className={`border p-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-500 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}/>
                            <input value={productForm.price} onChange={e=>setProductForm({...productForm, price: e.target.value})} placeholder="Price (e.g. RM 15 / 500 pts)" required className={`border p-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-500 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}/>
                            <div className="md:col-span-2">
                                <label className={`block text-xs font-bold mb-2 uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Product Image</label>
                                <div className={`relative border-2 border-dashed rounded-xl h-32 overflow-hidden transition-colors ${isDark ? 'border-slate-700 hover:border-emerald-500' : 'border-slate-300 hover:border-emerald-500'}`}>
                                    <input type="file" accept="image/*" onChange={(e)=>handleImageUpload(e, 'product')} className="hidden" id="prodUpload"/>
                                    <label htmlFor="prodUpload" className="absolute inset-0 w-full h-full flex flex-col items-center justify-center cursor-pointer z-10">
                                        {productForm.img ? <img src={productForm.img} className="w-full h-full object-cover"/> : <div className="text-center text-xs opacity-50"><Upload size={20} className="mx-auto mb-1"/>Upload Photo</div>}
                                    </label>
                                </div>
                            </div>
                            <button className="md:col-span-2 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700">List Item</button>
                        </form>
                    </div>
                    {/* SHELF DISPLAY */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {dbProducts.map(p => (
                            <div key={p.id} className={`relative group p-3 rounded-xl border flex flex-col transition-all ${deletingIds.includes(p.id) ? 'opacity-0 scale-95' : 'opacity-100'} ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
                                <button onClick={() => setDeleteTarget({ id: p.id, type: 'product' })} className="absolute top-2 right-2 z-10 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"><Trash2 size={14}/></button>
                                <div className="h-32 bg-slate-200 rounded-lg mb-3 overflow-hidden"><img src={p.img} className="w-full h-full object-cover"/></div>
                                <h4 className="font-bold text-sm truncate">{p.name}</h4>
                                <div className="flex justify-between items-center mt-auto pt-2">
                                    <span className="text-xs opacity-60">{p.sold || 0} sold</span>
                                    <span className="text-emerald-500 font-black text-sm">{p.price}</span>
                                </div>
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