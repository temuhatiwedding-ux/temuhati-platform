
'use client'

import { useGuestbook } from '@/hooks/useGuestbook'
import { toast } from 'react-hot-toast'

export default function Guestbook({ invitationId, themeColor = 'var(--color-primary)', isPreview = false }: { invitationId: string, themeColor?: string, isPreview?: boolean }) {
    const { formData, setFormData, status, comments, handleSubmit } = useGuestbook(invitationId)

    // Cegat form jika dalam mode preview
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isPreview) {
            toast.error('Mode pratinjau: Ucapan tidak akan dikirim.')
            return
        }
        handleSubmit(e)
    }

    return (
        <div className="w-full bg-[color:var(--color-secondary)] rounded-tl-[6rem] md:rounded-tl-[8rem] pt-20 pb-24 px-6 relative z-10 -mt-24 md:-mt-32">
            <div className="max-w-lg mx-auto">

                {/* HEADER */}
                <div className="text-center mb-8">
                    <h3 className="font-serif text-4xl text-[color:var(--color-primary)] mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                        Ucapan Sesuatu
                    </h3>
                </div>

                {/* STATUS SUKSES */}
                {status === 'success' && (
                    <div className="bg-green-50 text-green-600 border border-green-200 p-3 rounded-lg text-sm mb-6 text-center font-medium shadow-sm">
                        Terima kasih atas ucapan dan doa Anda!
                    </div>
                )}

                {/* FORM */}
                <form onSubmit={handleFormSubmit} className="space-y-4 mb-12">
                    <input
                        required type="text" placeholder="Nama Kamu" value={formData.name || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl p-3.5 text-sm outline-none focus:border-[color:var(--color-primary)] focus:ring-1 focus:ring-[color:var(--color-primary)] placeholder:text-gray-400 shadow-sm transition-all"
                    />

                    <textarea
                        required rows={4} placeholder="Berikan Ucapan & Do'a" value={formData.message || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl p-3.5 text-sm outline-none focus:border-[color:var(--color-primary)] focus:ring-1 focus:ring-[color:var(--color-primary)] resize-none placeholder:text-gray-400 shadow-sm transition-all"
                    />

                    <div className="pt-2">
                        <p className="text-xs font-bold text-gray-700 mb-3">Konfirmasi Kehadiran ?</p>
                        <div className="grid grid-cols-2 gap-3">
                            {/* Tombol Hadir */}
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, attendance: 'hadir', guest_count: 1 }))}
                                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border text-xs font-bold transition-all ${formData.attendance === 'hadir' ? 'border-green-400 bg-white text-green-500 shadow-sm' : 'border-gray-200 bg-white text-gray-400 hover:bg-gray-50'}`}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className={formData.attendance === 'hadir' ? 'text-green-500' : 'text-gray-300'}>
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                                </svg>
                                Hadir
                            </button>

                            {/* Tombol Tidak Hadir */}
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, attendance: 'tidak_hadir', guest_count: 0 }))}
                                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border text-xs font-bold transition-all ${formData.attendance === 'tidak_hadir' ? 'border-red-400 bg-white text-red-500 shadow-sm' : 'border-gray-200 bg-white text-gray-400 hover:bg-gray-50'}`}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className={formData.attendance === 'tidak_hadir' ? 'text-red-500' : 'text-gray-300'}>
                                    <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path>
                                </svg>
                                Tidak Hadir
                            </button>
                        </div>
                        {/* Form Jumlah Tamu HANYA muncul kalau pilih Hadir */}
                        {formData.attendance === 'hadir' && (
                            <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <p className="text-xs font-bold text-gray-700 mb-2">Jumlah Tamu</p>
                                <select
                                    value={formData.guest_count || 1}
                                    onChange={(e) => setFormData(prev => ({ ...prev, guest_count: parseInt(e.target.value) }))}
                                    className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl p-3 text-sm outline-none focus:border-[color:var(--color-primary)] focus:ring-1 focus:ring-[color:var(--color-primary)] shadow-sm transition-all"
                                >
                                    <option value={1}>1 Orang</option>
                                    <option value={2}>2 Orang</option>
                                    <option value={3}>3 Orang</option>
                                    <option value={4}>4 Orang</option>
                                    <option value={5}>5 Orang</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit" disabled={status === 'loading'}
                        className="w-full bg-[color:var(--color-primary)] text-[color:var(--color-text)] font-bold py-3.5 rounded-xl text-sm hover:bg-[color:var(--color-primary)] disabled:opacity-70 transition-colors shadow-md mt-4"
                    >
                        {status === 'loading' ? 'Mengirim...' : 'Kirim'}
                    </button>
                </form>

                {/* DAFTAR UCAPAN */}
                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {comments.length === 0 ? (
                        <p className="text-center text-sm opacity-60 py-4">Belum ada ucapan.</p>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                                {/* Avatar */}
                                <div className="flex-shrink-0 mt-1">
                                    <svg width="36" height="36" viewBox="0 0 24 24" fill="var(--color-primary)">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path>
                                    </svg>
                                </div>

                                {/* Konten Komentar */}
                                <div className="flex flex-col">
                                    <div className="flex flex-col mb-1.5">
                                        <h5 className="font-bold text-sm text-[color:var(--color-primary)]">{comment.name}</h5>
                                        <span className="text-[10px] text-gray-500">
                                            {/* Format tanggal sederhana, sesuaikan kalau ada field created_at */}
                                            {comment.created_at ? new Date(comment.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : 'Hari ini'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-700 leading-relaxed">{comment.message}</p>

                                    {comment.admin_reply && (
                                        <div className="mt-2 pl-3 border-l-2 border-[color:var(--color-accent)] bg-white/50 p-2 rounded-r-md">
                                            <p className="text-[10px] font-bold text-[color:var(--color-primary)] uppercase tracking-wider mb-1">
                                                Balasan Mempelai
                                            </p>
                                            <p className="text-xs text-gray-700 italic">"{comment.admin_reply}"</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>

    )
}
