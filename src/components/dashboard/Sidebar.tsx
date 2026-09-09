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
                <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsSidebarOpen(false)} />
            )}

            <aside className={`fixed md:relative z-50 w-64 bg-white border-r border-gray-200 h-full transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col`}>
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <h1 className="font-bold text-xl tracking-tight text-slate-900">Temuhati.</h1>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <button onClick={() => { setActiveMenu('editor'); setIsSidebarOpen(false) }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeMenu === 'editor' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                        <LayoutDashboard className="w-4 h-4" /> Editor Undangan
                    </button>
                    <button onClick={() => { setActiveMenu('komentar'); setIsSidebarOpen(false) }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeMenu === 'komentar' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                        <MessageSquare className="w-4 h-4" /> Ucapan & Doa
                    </button>
                    <button onClick={() => { setActiveMenu('sebar'); setIsSidebarOpen(false) }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeMenu === 'sebar' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                        <Send className="w-4 h-4" /> Sebar Undangan
                    </button>
                    <button onClick={() => { setActiveMenu('statistik'); setIsSidebarOpen(false) }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeMenu === 'statistik' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                        <BarChart2 className="w-4 h-4" /> Statistik
                    </button>
                    <button onClick={() => { setActiveMenu('guestbook'); setIsSidebarOpen(false) }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeMenu === 'guestbook' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                        <Users className="w-4 h-4" /> Buku Tamu (Soon)
                    </button>
                </nav>
            </aside>
        </>
    )
}