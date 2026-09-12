'use client'

import { useState } from 'react'
import { MessageSquare, Users, CheckCircle, XCircle, CornerDownRight } from 'lucide-react'

interface Comment {
    id: string;
    name: string;
    attendance: 'hadir' | 'tidak_hadir' | 'ragu';
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

    const handleReply = (id: string) => {
        if (onReply && replyText.trim()) {
            onReply(id, replyText)
            setReplyingTo(null)
            setReplyText('')
        }
    }

    return (
        <div className="h-full bg-stone-50 p-6 md:p-10 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Ucapan & Kehadiran</h2>
                    <p className="text-sm text-gray-500 mt-1">Kelola pesan dan konfirmasi tamu.</p>
                </div>

                {/* Statistik */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users className="w-5 h-5" /></div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Pesan</p>
                            <p className="text-2xl font-bold text-gray-900">{total}</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg"><CheckCircle className="w-5 h-5" /></div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Hadir</p>
                            <p className="text-2xl font-bold text-gray-900">{hadir}</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg"><XCircle className="w-5 h-5" /></div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Tidak Hadir</p>
                            <p className="text-2xl font-bold text-gray-900">{tidakHadir}</p>
                        </div>
                    </div>
                </div>

                {/* Daftar Komentar */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                    {isLoadingComments ? (
                        <div className="p-10 text-center text-sm text-gray-500">Memuat data...</div>
                    ) : comments.length === 0 ? (
                        <div className="p-16 text-center text-gray-400">
                            <MessageSquare className="w-10 h-10 mx-auto mb-4 text-gray-300" />
                            <p className="text-sm">Belum ada ucapan.</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {comments.map((comment) => (
                                <li key={comment.id} className="p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm">{comment.name}</h4>
                                            <span className="text-xs text-gray-400">
                                                {new Date(comment.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wide ${comment.attendance === 'hadir' ? 'bg-green-100 text-green-700' :
                                                comment.attendance === 'tidak_hadir' ? 'bg-red-100 text-red-700' :
                                                    'bg-gray-100 text-gray-700'
                                            }`}>
                                            {comment.attendance === 'hadir' ? 'Hadir' : comment.attendance === 'tidak_hadir' ? 'Tidak Hadir' : 'Ragu'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700 leading-relaxed mb-4">{comment.message}</p>

                                    {/* Tampilan Balasan Admin */}
                                    {comment.admin_reply ? (
                                        <div className="bg-stone-50 p-4 rounded-lg border border-stone-100 flex gap-3 mt-4">
                                            <CornerDownRight className="w-4 h-4 text-stone-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs font-semibold text-stone-700 mb-1">Balasan Anda:</p>
                                                <p className="text-sm text-stone-600">{comment.admin_reply}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Form Balas */
                                        <div className="mt-2">
                                            {replyingTo === comment.id ? (
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={replyText}
                                                        onChange={(e) => setReplyText(e.target.value)}
                                                        placeholder="Tulis balasan..."
                                                        className="flex-1 text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:border-stone-500"
                                                    />
                                                    <button onClick={() => handleReply(comment.id)} className="bg-stone-800 text-white px-4 py-2 text-xs rounded-md hover:bg-stone-900">Kirim</button>
                                                    <button onClick={() => setReplyingTo(null)} className="bg-gray-100 text-gray-600 px-4 py-2 text-xs rounded-md hover:bg-gray-200">Batal</button>
                                                </div>
                                            ) : (
                                                <button onClick={() => setReplyingTo(comment.id)} className="text-xs text-stone-500 hover:text-stone-800 font-medium">
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