'use client'

import { useState } from 'react'
import { MessageSquare, Users, CheckCircle, XCircle, CornerDownRight, UserPlus } from 'lucide-react'

interface Comment {
    id: string;
    name: string;
    attendance: 'hadir' | 'tidak_hadir' | 'ragu';
    guest_count?: number;
    message: string;
    created_at: string;
    admin_reply?: string;
}

interface CommentsTabProps {
    comments: Comment[];
    isLoadingComments: boolean;
    onReply?: (commentId: string, replyText: string) => void;
}

export default function CommentsTab({ comments, isLoadingComments, onReply }: CommentsTabProps) {
    const [replyingTo, setReplyingTo] = useState<string | null>(null)
    const [replyText, setReplyText] = useState('')

    const total = comments.length
    const hadir = comments.filter(c => c.attendance === 'hadir').length
    const tidakHadir = comments.filter(c => c.attendance === 'tidak_hadir').length

    // Hitung total kepala/tamu yang hadir
    const totalTamuHadir = comments.reduce((sum, c) => {
        return c.attendance === 'hadir' ? sum + (Number(c.guest_count) || 1) : sum
    }, 0)

    const handleReply = (id: string) => {
        if (onReply && replyText.trim()) {
            onReply(id, replyText)
            setReplyingTo(null)
            setReplyText('')
        }
    }

    return (
        <div className="h-full bg-[#FBFBF9] p-4 md:p-8 overflow-y-auto relative">
            <div className="w-full max-w-[1400px] mx-auto">

                {/* HEADER */}
                <div className="flex items-center gap-3 mb-7">
                    <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-[#D1E0D7]">
                        <MessageSquare className="w-4 h-4 text-brand" />
                    </div>

                    <div>
                        <h2 className="text-[15px] font-semibold text-brand leading-tight">
                            Ucapan & RSVP
                        </h2>
                        <p className="text-[11px] text-brand/55 mt-1">
                            Kelola ucapan dan konfirmasi kehadiran tamu
                        </p>
                    </div>
                </div>

                {/* STATISTIK */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
                    <div className="bg-[#F0F5F2] border border-[#D1E0D7] shadow-sm rounded-3xl p-5 flex items-center gap-4">
                        <div className="p-3 bg-white border border-[#D1E0D7] text-brand rounded-2xl shrink-0"><Users className="w-5 h-5" /></div>
                        <div>
                            <p className="text-[10px] text-brand/60 font-bold uppercase tracking-wider leading-tight">Total Ucapan</p>
                            <p className="text-2xl font-bold text-brand">{total}</p>
                        </div>
                    </div>
                    <div className="bg-[#F0F5F2] border border-[#D1E0D7] shadow-sm rounded-3xl p-5 flex items-center gap-4">
                        <div className="p-3 bg-white border border-[#D1E0D7] text-[#0F5132] rounded-2xl shrink-0"><CheckCircle className="w-5 h-5" /></div>
                        <div>
                            <p className="text-[10px] text-brand/60 font-bold uppercase tracking-wider leading-tight">RSVP Hadir</p>
                            <p className="text-2xl font-bold text-brand">{hadir}</p>
                        </div>
                    </div>
                    <div className="bg-[#F0F5F2] border border-[#D1E0D7] shadow-sm rounded-3xl p-5 flex items-center gap-4">
                        <div className="p-3 bg-white border border-[#D1E0D7] text-[#2C3931] rounded-2xl shrink-0"><UserPlus className="w-5 h-5" /></div>
                        <div>
                            <p className="text-[10px] text-brand/60 font-bold uppercase tracking-wider leading-tight">Estimasi Tamu</p>
                            <p className="text-2xl font-bold text-brand">{totalTamuHadir}</p>
                        </div>
                    </div>
                    <div className="bg-[#F0F5F2] border border-[#D1E0D7] shadow-sm rounded-3xl p-5 flex items-center gap-4">
                        <div className="p-3 bg-white border border-[#D1E0D7] text-[#842029] rounded-2xl shrink-0"><XCircle className="w-5 h-5" /></div>
                        <div>
                            <p className="text-[10px] text-brand/60 font-bold uppercase tracking-wider leading-tight">RSVP Absen</p>
                            <p className="text-2xl font-bold text-brand">{tidakHadir}</p>
                        </div>
                    </div>
                </div>

                {/* DAFTAR KOMENTAR */}
                <div className="bg-white border border-[#D1E0D7] rounded-3xl shadow-sm overflow-hidden">
                    {isLoadingComments ? (
                        <div className="p-10 text-center text-sm text-brand/60 font-medium">Memuat data...</div>
                    ) : comments.length === 0 ? (
                        <div className="p-16 text-center text-brand/40">
                            <MessageSquare className="w-10 h-10 mx-auto mb-4 opacity-50" />
                            <p className="text-sm font-medium">Belum ada ucapan yang masuk.</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-[#D1E0D7]">
                            {comments.map((comment) => (
                                <li key={comment.id} className="p-4 hover:bg-[#FBFBF9] transition-colors">
                                    {/* HEADER: Nama, Tanggal & Badge dibikin sejajar dan padat */}
                                    <div className="flex justify-between items-start mb-1.5 gap-2">
                                        <div className="flex flex-col">
                                            <h4 className="font-bold text-brand text-sm leading-none mb-1">{comment.name}</h4>
                                            <span className="text-[10px] text-brand/50 font-medium leading-none">
                                                {new Date(comment.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="flex gap-1.5 items-center flex-wrap justify-end">
                                            <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${comment.attendance === 'hadir' ? 'bg-[#D1E7DD] text-[#0F5132]' :
                                                comment.attendance === 'tidak_hadir' ? 'bg-[#F8D7DA] text-[#842029]' :
                                                    'bg-[#FFF3CD] text-[#856404]'
                                                }`}>
                                                {comment.attendance === 'hadir' ? 'Hadir' : comment.attendance === 'tidak_hadir' ? 'Absen' : 'Ragu'}
                                            </span>

                                            {comment.attendance === 'hadir' && (
                                                <span className="text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-[#E8EFEA] text-[#3A4B40]">
                                                    {comment.guest_count || 1} Pax
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* PESAN */}
                                    <p className="text-sm text-brand/80 leading-snug mb-2 font-medium">{comment.message}</p>

                                    {/* BALASAN ADMIN & FORM BALAS */}
                                    {comment.admin_reply ? (
                                        <div className="bg-[#F0F5F2] p-3 rounded-xl border border-[#D1E0D7] flex gap-2.5 mt-2">
                                            <CornerDownRight className="w-3.5 h-3.5 text-brand/40 mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-[10px] font-bold text-brand/60 uppercase tracking-wider mb-0.5">Balasan Anda</p>
                                                <p className="text-sm text-brand font-medium leading-snug">{comment.admin_reply}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-1.5">
                                            {replyingTo === comment.id ? (
                                                <div className="flex gap-1.5">
                                                    <input
                                                        type="text"
                                                        value={replyText}
                                                        onChange={(e) => setReplyText(e.target.value)}
                                                        placeholder="Tulis balasan..."
                                                        className="flex-1 bg-[#FBFBF9] border border-[#D1E0D7] rounded-lg px-3 py-1.5 text-sm focus:bg-white focus:border-[#8BA896] focus:ring-[2px] focus:ring-[#8BA896]/20 outline-none text-brand transition-all duration-300 font-medium hover:border-[#B5CDBF]"
                                                    />
                                                    <button
                                                        onClick={() => handleReply(comment.id)}
                                                        className="bg-[#3A4B40] text-white px-3 py-1.5 text-xs font-bold rounded-lg hover:bg-[#2c3931] transition-colors shadow-sm"
                                                    >
                                                        Kirim
                                                    </button>
                                                    <button
                                                        onClick={() => setReplyingTo(null)}
                                                        className="bg-white border border-[#D1E0D7] text-brand px-3 py-1.5 text-xs font-bold rounded-lg hover:bg-[#F0F5F2] transition-colors shadow-sm"
                                                    >
                                                        Batal
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setReplyingTo(comment.id)}
                                                    className="text-[10px] text-brand/50 hover:text-brand font-bold transition-colors uppercase tracking-wider"
                                                >
                                                    Balas Pesan
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}