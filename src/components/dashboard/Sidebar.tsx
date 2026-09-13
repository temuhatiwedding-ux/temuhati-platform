import { LayoutDashboard, MessageSquare, Send, BarChart2, Users } from 'lucide-react'

interface SidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (val: boolean) => void;
    activeMenu: string;
    setActiveMenu: (val: string) => void;
}

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen, activeMenu, setActiveMenu }: SidebarProps) {
    return (
        <>
            {isSidebarOpen && (
                <div className="md:hidden fixed inset-0 bg-brand/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsSidebarOpen(false)} />
            )}
            <aside className={`fixed md:relative z-50 w-64 bg-brand-light h-full transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col md:rounded-r-[2rem] shadow-[12px_0_40px_rgba(58,75,64,0.08)]`}>
                <div className="h-[72px] flex items-center px-6">
                    <h1 className="font-bold text-2xl tracking-tight text-brand flex items-center gap-2">
                        TemuHati
                        <span className="w-1.5 h-1.5 rounded-full bg-brand/50 mt-1"></span>
                    </h1>
                </div>

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
                        <Send className="w-5 h-5" /> Sebar Undangan
                    </button>

                    <button
                        onClick={() => { setActiveMenu('statistik'); setIsSidebarOpen(false) }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${activeMenu === 'statistik' ? 'bg-brand text-brand-light shadow-md shadow-brand/20 translate-x-1' : 'text-brand/70 hover:bg-brand/5 hover:text-brand'}`}
                    >
                        <BarChart2 className="w-5 h-5" /> Statistik
                    </button>

                    <button
                        onClick={() => { setActiveMenu('guestbook'); setIsSidebarOpen(false) }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${activeMenu === 'guestbook' ? 'bg-brand text-brand-light shadow-md shadow-brand/20 translate-x-1' : 'text-brand/40 cursor-not-allowed'}`}
                        disabled
                    >
                        <Users className="w-5 h-5" /> Buku Tamu (Soon)
                    </button>
                </nav>
            </aside>
        </>
    )
}