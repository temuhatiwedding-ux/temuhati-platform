'use client'

import { useRef, useState, useEffect } from 'react'
import { useGuestbook } from '@/hooks/useGuestbook'
import { toast } from 'react-hot-toast'

export default function Guestbook({ invitationId, isPreview = false }: { invitationId: string, isPreview?: boolean }) {
    const { formData, setFormData, status, comments, handleSubmit } = useGuestbook(invitationId)

    // --- SCROLL ANIMATION OBSERVER ---
    const gbRef = useRef<HTMLDivElement>(null)
    const [showGb, setShowGb] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) setShowGb(true)
        }, { threshold: 0.2 })

        if (gbRef.current) observer.observe(gbRef.current)
        return () => observer.disconnect()
    }, [])

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
        // Wrapper background menggunakan primary color agar serasi dengan text terang
        <div className="py-16 px-6 bg-[color:var(--color-primary)] text-[color:var(--color-text)]">
            <div ref={gbRef} className={`max-w-lg mx-auto ${showGb ? 'dramatic-reveal' : 'opacity-0'}`}>

                <div className="text-center mb-8">
                    <h3 className="font-serif text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Ucapkan Sesuatu</h3>
                    <p className="text-sm opacity-90 mb-6">Berikan Ucapan & Doa Restu</p>

                    <div className="flex justify-center gap-4 mb-6">
                        <div className="bg-[color:var(--color-text)]/10 backdrop-blur-sm rounded-xl py-4 w-28 flex flex-col items-center shadow-sm border border-[color:var(--color-text)]/20">
                            <span className="text-2xl font-bold mb-1">{countHadir}</span>
                            <span className="text-xs font-semibold tracking-wide">Hadir</span>
                        </div>
                        <div className="bg-[color:var(--color-text)]/10 backdrop-blur-sm rounded-xl py-4 w-28 flex flex-col items-center shadow-sm border border-[color:var(--color-text)]/20">
                            <span className="text-2xl font-bold mb-1">{countTidakHadir}</span>
                            <span className="text-xs font-semibold tracking-wide">Tidak Hadir</span>
                        </div>
                    </div>
                </div>

                {status === 'success' && (
                    <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/30 text-white p-3 rounded-lg text-sm mb-6 text-center font-medium shadow-sm">
                        Terima kasih atas ucapan dan doa Anda!
                    </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-4 mb-10">
                    <input
                        required type="text" placeholder="Nama" value={formData.name || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-[color:var(--color-secondary)] text-[color:var(--color-text-dark)] rounded-lg p-3.5 text-sm outline-none focus:ring-2 focus:ring-[color:var(--color-accent)] placeholder:text-[color:var(--color-text-dark)]/40 shadow-sm"
                    />
                    <textarea
                        required rows={3} placeholder="Tulis ucapan dan doa Anda di sini..." value={formData.message || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        className="w-full bg-[color:var(--color-secondary)] text-[color:var(--color-text-dark)] rounded-lg p-3.5 text-sm outline-none focus:ring-2 focus:ring-[color:var(--color-accent)] resize-none placeholder:text-[color:var(--color-text-dark)]/40 shadow-sm"
                    />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <select
                            value={formData.attendance || 'hadir'}
                            onChange={(e) => {
                                const newAttendance = e.target.value
                                setFormData(prev => ({
                                    ...prev,
                                    attendance: newAttendance,
                                    guest_count: newAttendance === 'hadir' ? (prev.guest_count || 1) : 1
                                }))
                            }}
                            className="w-full bg-[color:var(--color-secondary)] text-[color:var(--color-text-dark)] rounded-lg p-3.5 text-sm outline-none focus:ring-2 focus:ring-[color:var(--color-accent)] shadow-sm"
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
                                className="w-full bg-[color:var(--color-secondary)] text-[color:var(--color-text-dark)] rounded-lg p-3.5 text-sm outline-none focus:ring-2 focus:ring-[color:var(--color-accent)] shadow-sm"
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
                        className="w-full bg-[color:var(--color-secondary)] text-[color:var(--color-primary)] font-bold py-3.5 rounded-lg text-sm hover:opacity-90 disabled:opacity-70 transition-colors shadow-md"
                    >
                        {status === 'loading' ? 'Mengirim...' : 'Kirim Ucapan'}
                    </button>
                </form>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {comments.length === 0 ? (
                        <p className="text-center text-sm opacity-80 py-4">Belum ada ucapan.</p>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="bg-[color:var(--color-text)]/10 backdrop-blur-sm p-4 rounded-xl border border-[color:var(--color-text)]/20 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <h5 className="font-bold text-sm">{comment.name}</h5>

                                    <div className="flex gap-1.5">
                                        <span className="text-[10px] px-2.5 py-1 rounded-md bg-black/20 font-bold uppercase tracking-wider">
                                            {comment.attendance === 'hadir' ? 'Hadir' : comment.attendance === 'tidak_hadir' ? 'Tidak Hadir' : 'Ragu'}
                                        </span>
                                        {comment.attendance === 'hadir' && comment.guest_count && (
                                            <span className="text-[10px] px-2.5 py-1 rounded-md bg-[color:var(--color-secondary)] text-[color:var(--color-primary)] font-bold uppercase tracking-wider">
                                                {comment.guest_count} Orang
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm opacity-90 leading-relaxed">{comment.message}</p>

                                {comment.admin_reply && (
                                    <div className="mt-3 pl-3 border-l-2 border-[color:var(--color-accent)] bg-[color:var(--color-secondary)] p-2 rounded-r-md">
                                        <p className="text-[10px] font-bold text-[color:var(--color-primary)] uppercase tracking-wider mb-1">
                                            Balasan Mempelai
                                        </p>
                                        <p className="text-sm text-[color:var(--color-text-dark)] italic">"{comment.admin_reply}"</p>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}