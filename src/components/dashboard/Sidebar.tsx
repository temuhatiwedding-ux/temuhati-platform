'use client'

import { LayoutDashboard, MessageSquare, Send, BarChart2, LogOut, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

interface SidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (val: boolean) => void;
    activeMenu: string;
    setActiveMenu: (val: string) => void;
    user?: any; // Tambahan props user
}

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen, activeMenu, setActiveMenu, user }: SidebarProps) {
    const router = useRouter()
    const supabase = createClient()

    // Fungsi Logout
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()
        if (!error) {
            router.push('/login') // Sesuaikan dengan path halaman login lu
        }
    }

    return (
        <>
            {isSidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-[#3A4B40]/15 backdrop-blur-[4px] z-40 transition-all duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <aside
                className={`
                    fixed md:relative z-50 w-64
                    bg-[#F0F5F2]
                    h-full
                    transition-transform duration-300
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0
                    flex flex-col
                    md:rounded-r-[2rem]
                    shadow-[12px_0_40px_rgba(58,75,64,0.08)]
                `}
            >
                {/* LOGO */}
                <div className="h-[72px] flex items-center px-6">
                    <h1 className="font-bold text-2xl tracking-tight text-brand flex items-center gap-2.5">
                        <img src="/icon.svg" alt="Logo" className="w-8 h-8 object-contain" />
                        TemuHati
                        <span className="w-1.5 h-1.5 rounded-full bg-brand/50 mt-1"></span>
                    </h1>
                </div>

                {/* NAVIGATION */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-2">
                    <button
                        onClick={() => { setActiveMenu('editor'); setIsSidebarOpen(false) }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${activeMenu === 'editor' ? 'bg-brand text-brand-light shadow-md shadow-brand/20 translate-x-1' : 'text-brand/70 hover:bg-brand/5 hover:text-brand'}`}
                    >
                        <LayoutDashboard className="w-5 h-5" /> Editor Undangan
                    </button>

                    <button
                        onClick={() => { setActiveMenu('komentar'); setIsSidebarOpen(false) }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${activeMenu === 'komentar' ? 'bg-brand text-brand-light shadow-md shadow-brand/20 translate-x-1' : 'text-brand/70 hover:bg-brand/5 hover:text-brand'}`}
                    >
                        <MessageSquare className="w-5 h-5" /> Ucapan & Doa
                    </button>

                    <button
                        onClick={() => { setActiveMenu('sebar'); setIsSidebarOpen(false) }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${activeMenu === 'sebar' ? 'bg-brand text-brand-light shadow-md shadow-brand/20 translate-x-1' : 'text-brand/70 hover:bg-brand/5 hover:text-brand'}`}
                    >
                        <Send className="w-5 h-5" /> Guestbook
                    </button>

                    <button
                        onClick={() => { setActiveMenu('statistik'); setIsSidebarOpen(false) }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${activeMenu === 'statistik' ? 'bg-brand text-brand-light shadow-md shadow-brand/20 translate-x-1' : 'text-brand/70 hover:bg-brand/5 hover:text-brand'}`}
                    >
                        <BarChart2 className="w-5 h-5" /> Statistik
                    </button>
                </nav>

                {/* USER PROFILE & LOGOUT */}
                <div className="p-4 border-t border-[#D1E0D7]/50 mt-auto space-y-3">
                    {/* Profil User */}
                    {user && (
                        <div className="flex items-center gap-3 px-3 py-2 bg-white/50 rounded-2xl border border-[#D1E0D7]/50">
                            <div className="w-9 h-9 rounded-xl bg-white border border-[#D1E0D7] flex items-center justify-center shrink-0 shadow-sm">
                                <User className="w-4 h-4 text-brand" />
                            </div>
                            <div className="overflow-hidden flex-1">
                                <p className="text-xs font-bold text-brand truncate" title={user.email}>
                                    {user.email || 'User'}
                                </p>
                                <p className="text-[9px] text-brand/60 font-bold uppercase tracking-wider mt-0.5">
                                    Administrator
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Tombol Logout */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#842029] bg-[#F8D7DA]/60 hover:bg-[#F8D7DA] border border-transparent hover:border-[#F5C2C7] transition-all duration-200 shadow-sm"
                    >
                        <LogOut className="w-4 h-4" /> Keluar
                    </button>
                </div>
            </aside>
        </>
    )
}