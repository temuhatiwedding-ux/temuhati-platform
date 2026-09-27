'use client'

import { useGuestbook } from '@/hooks/useGuestbook'
import { toast } from 'react-hot-toast'

export default function Guestbook({ invitationId, themeColor = '#a68759', isPreview = false }: { invitationId: string, themeColor?: string, isPreview?: boolean }) {
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

    const countHadir = comments.filter(c => c.attendance === 'hadir').length
    const countTidakHadir = comments.filter(c => c.attendance === 'tidak_hadir').length

    return (
        <div className="max-w-lg mx-auto text-white">
            <div className="text-center mb-8">
                <h3 className="font-serif text-4xl font-bold mb-2">Ucapkan Sesuatu</h3>
                <p className="text-sm opacity-90 mb-6">Berikan Ucapan & Doa Restu</p>

                <div className="flex justify-center gap-4 mb-6">
                    <div className="bg-white/20 rounded-xl py-4 w-28 flex flex-col items-center shadow-sm">
                        <span className="text-2xl font-bold mb-1">{countHadir}</span>
                        <span className="text-xs font-semibold tracking-wide">Hadir</span>
                    </div>
                    <div className="bg-white/20 rounded-xl py-4 w-28 flex flex-col items-center shadow-sm">
                        <span className="text-2xl font-bold mb-1">{countTidakHadir}</span>
                        <span className="text-xs font-semibold tracking-wide">Tidak Hadir</span>
                    </div>
                </div>
            </div>

            {status === 'success' && (
                <div className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-lg text-sm mb-6 text-center font-medium shadow-sm">
                    Terima kasih atas ucapan dan doa Anda!
                </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 mb-10">
                <input
                    required type="text" placeholder="Nama" value={formData.name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-white text-stone-800 rounded-lg p-3.5 text-sm outline-none focus:ring-2 focus:ring-white/50 placeholder:text-stone-400 shadow-sm"
                />
                <textarea
                    required rows={3} placeholder="Tulis ucapan dan doa Anda di sini..." value={formData.message || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full bg-white text-stone-800 rounded-lg p-3.5 text-sm outline-none focus:ring-2 focus:ring-white/50 resize-none placeholder:text-stone-400 shadow-sm"
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <select
                        value={formData.attendance || 'hadir'}
                        onChange={(e) => {
                            const newAttendance = e.target.value
                            setFormData(prev => ({
                                ...prev,
                                attendance: newAttendance,
                                // Kalau batal hadir, reset jumlah tamu jadi 1 biar data rapi
                                guest_count: newAttendance === 'hadir' ? (prev.guest_count || 1) : 1
                            }))
                        }}
                        className="w-full bg-white text-stone-800 rounded-lg p-3.5 text-sm outline-none focus:ring-2 focus:ring-white/50 shadow-sm"
                    >
                        <option value="hadir">Hadir</option>
                        <option value="tidak_hadir">Tidak Hadir</option>
                        <option value="ragu">Ragu-ragu</option>
                    </select>

                    {/* Form Jumlah Tamu HANYA muncul kalau pilih Hadir */}
                    {formData.attendance === 'hadir' && (
                        <select
                            value={formData.guest_count || 1}
                            onChange={(e) => setFormData(prev => ({ ...prev, guest_count: parseInt(e.target.value) }))}
                            className="w-full bg-white text-stone-800 rounded-lg p-3.5 text-sm outline-none focus:ring-2 focus:ring-white/50 shadow-sm"
                        >
                            <option value={1}>1 Orang</option>
                            <option value={2}>2 Orang</option>
                            <option value={3}>3 Orang</option>
                            <option value={4}>4 Orang</option>
                            <option value={5}>5 Orang</option>
                        </select>
                    )}
                </div>

                <button
                    type="submit" disabled={status === 'loading'}
                    style={{ color: themeColor }}
                    className="w-full bg-white font-bold py-3.5 rounded-lg text-sm hover:bg-stone-50 disabled:opacity-70 transition-colors shadow-md"
                >
                    {status === 'loading' ? 'Mengirim...' : 'Kirim Ucapan'}
                </button>
            </form>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {comments.length === 0 ? (
                    <p className="text-center text-sm opacity-80 py-4">Belum ada ucapan.</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="bg-black/10 backdrop-blur-sm p-4 rounded-xl border border-white/5 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <h5 className="font-bold text-sm">{comment.name}</h5>

                                <div className="flex gap-1.5">
                                    <span className="text-[10px] px-2.5 py-1 rounded-md bg-black/20 font-bold uppercase tracking-wider">
                                        {comment.attendance === 'hadir' ? 'Hadir' : comment.attendance === 'tidak_hadir' ? 'Tidak Hadir' : 'Ragu'}
                                    </span>
                                    {comment.attendance === 'hadir' && comment.guest_count && (
                                        <span className="text-[10px] px-2.5 py-1 rounded-md bg-white/20 font-bold uppercase tracking-wider">
                                            {comment.guest_count} Orang
                                        </span>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm opacity-90 leading-relaxed">{comment.message}</p>
                            {comment.admin_reply && (
                                <div className="mt-3 pl-3 border-l-2 border-[#a4825e] bg-stone-50/50 p-2 rounded-r-md">
                                    <p className="text-[10px] font-bold text-[#a4825e] uppercase tracking-wider mb-1">
                                        Balasan Mempelai
                                    </p>
                                    <p className="text-sm text-gray-700 italic">"{comment.admin_reply}"</p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}