'use client'

import { useEffect, useRef, useState } from 'react'
import { useGuestbook } from '@/hooks/useGuestbook'
import { toast } from 'react-hot-toast'

export default function Guestbook03({ invitationId, themeColor = 'var(--color-primary)', isPreview = false }: { invitationId: string, themeColor?: string, isPreview?: boolean }) {
    const { formData, setFormData, status, comments, handleSubmit } = useGuestbook(invitationId)

    const headerRef = useRef<HTMLDivElement>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const listRef = useRef<HTMLDivElement>(null)

    const [showHeader, setShowHeader] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [showList, setShowList] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.id === 'gb-header') setShowHeader(true)
                    if (entry.target.id === 'gb-form') setShowForm(true)
                    if (entry.target.id === 'gb-list') setShowList(true)
                }
            })
        }, { threshold: 0.15 })

        if (headerRef.current) observer.observe(headerRef.current)
        if (formRef.current) observer.observe(formRef.current)
        if (listRef.current) observer.observe(listRef.current)

        return () => observer.disconnect()
    }, [])

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isPreview) {
            toast.error('Mode pratinjau: Ucapan tidak akan dikirim.')
            return
        }
        handleSubmit(e)
    }

    const getInitial = (name: string) => name ? name.charAt(0).toUpperCase() : 'G'

    return (
        // 👇 Background diubah jadi primary
        <div className="w-full bg-[color:var(--color-primary)] pt-20 pb-24 px-6 relative z-10 border-t border-[color:var(--color-accent)]/30 overflow-hidden">
            <div className="max-w-md mx-auto">

                <div
                    id="gb-header"
                    ref={headerRef}
                    className={`text-center mb-10 transition-all duration-[2000ms] ease-out ${showHeader ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                >
                    <p className="text-[10px] uppercase tracking-[0.4em] text-[color:var(--color-accent)] mb-2">RSVP & Wishes</p>
                    <h2 className="text-4xl text-[color:var(--color-text)] italic font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                        Guestbook
                    </h2>
                </div>

                {status === 'success' && (
                    <div className="bg-transparent border border-[color:var(--color-accent)] text-[color:var(--color-text)] p-4 text-xs mb-8 text-center font-bold tracking-widest uppercase shadow-sm">
                        Terima kasih atas ucapan dan doa Anda!
                    </div>
                )}

                <form
                    id="gb-form"
                    ref={formRef}
                    onSubmit={handleFormSubmit}
                    className={`space-y-4 mb-14 transition-all duration-[2000ms] ease-out delay-150 ${showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                >
                    {/* 👇 Teks inputan dibikin terang */}
                    <input
                        required type="text" placeholder="Nama Anda" value={formData.name || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-transparent border border-[color:var(--color-accent)] text-[color:var(--color-text)] rounded-none p-4 text-xs outline-none focus:border-[color:var(--color-text)] placeholder:text-[color:var(--color-text)]/50 transition-colors"
                    />

                    <textarea
                        required rows={4} placeholder="Berikan Ucapan & Doa" value={formData.message || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        className="w-full bg-transparent border border-[color:var(--color-accent)] text-[color:var(--color-text)] rounded-none p-4 text-xs outline-none focus:border-[color:var(--color-text)] resize-none placeholder:text-[color:var(--color-text)]/50 transition-colors"
                    />

                    <div className="pt-2">
                        <p className="text-[10px] font-bold text-[color:var(--color-text)] uppercase tracking-widest mb-3 text-center">Konfirmasi Kehadiran</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, attendance: 'hadir', guest_count: 1 }))}
                                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-none border text-[10px] font-bold tracking-widest uppercase transition-colors ${formData.attendance === 'hadir' ? 'border-[color:var(--color-text)] bg-[color:var(--color-text)] text-[color:var(--color-primary)]' : 'border-[color:var(--color-accent)] bg-transparent text-[color:var(--color-text)]/70 hover:bg-white/10'}`}
                            >
                                Hadir
                            </button>

                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, attendance: 'tidak_hadir', guest_count: 0 }))}
                                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-none border text-[10px] font-bold tracking-widest uppercase transition-colors ${formData.attendance === 'tidak_hadir' ? 'border-[color:var(--color-text)] bg-[color:var(--color-text)] text-[color:var(--color-primary)]' : 'border-[color:var(--color-accent)] bg-transparent text-[color:var(--color-text)]/70 hover:bg-white/10'}`}
                            >
                                Tidak Hadir
                            </button>
                        </div>

                        {formData.attendance === 'hadir' && (
                            <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <p className="text-[10px] font-bold text-[color:var(--color-text)] uppercase tracking-widest mb-2 text-center">Jumlah Tamu</p>
                                <select
                                    value={formData.guest_count || 1}
                                    onChange={(e) => setFormData(prev => ({ ...prev, guest_count: parseInt(e.target.value) }))}
                                    className="w-full bg-transparent border border-[color:var(--color-accent)] text-[color:var(--color-text)] rounded-none p-3.5 text-xs outline-none focus:border-[color:var(--color-text)] transition-colors text-center"
                                >
                                    {/* 👇 <option> dikasih warna hitam biar kebaca di native dropdown browser */}
                                    <option value={1} className="text-zinc-900">1 Orang</option>
                                    <option value={2} className="text-zinc-900">2 Orang</option>
                                    <option value={3} className="text-zinc-900">3 Orang</option>
                                    <option value={4} className="text-zinc-900">4 Orang</option>
                                    <option value={5} className="text-zinc-900">5 Orang</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit" disabled={status === 'loading'}
                        className="w-full bg-[color:var(--color-text)] text-[color:var(--color-primary)] font-bold py-4 rounded-none text-[10px] uppercase tracking-widest hover:opacity-90 disabled:opacity-70 transition-opacity mt-6"
                    >
                        {status === 'loading' ? 'Mengirim...' : 'Kirim Ucapan'}
                    </button>
                </form>

                <div
                    id="gb-list"
                    ref={listRef}
                    className={`space-y-5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar transition-all duration-[2000ms] ease-out delay-300 ${showList ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                >
                    {comments.length === 0 ? (
                        <p className="text-center text-xs text-[color:var(--color-text)]/60 py-4 italic font-serif">Belum ada ucapan.</p>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="flex gap-4 border-b border-[color:var(--color-accent)]/40 pb-5 last:border-0">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-10 h-10 rounded-full border border-[color:var(--color-accent)] flex items-center justify-center text-[color:var(--color-text)] font-serif italic text-lg bg-transparent">
                                        {getInitial(comment.name)}
                                    </div>
                                </div>

                                <div className="flex flex-col w-full">
                                    <div className="flex justify-between items-center mb-2">
                                        <h5 className="font-bold text-xs uppercase tracking-widest text-[color:var(--color-text)]">{comment.name}</h5>
                                        <span className="text-[9px] text-[color:var(--color-text)]/60 uppercase tracking-widest">
                                            {comment.created_at ? new Date(comment.created_at).toLocaleString('id-ID', { dateStyle: 'short' }) : 'Hari ini'}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-[color:var(--color-text)]/90 leading-relaxed whitespace-pre-line">{comment.message}</p>

                                    {comment.admin_reply && (
                                        <div className="mt-3 border-l-2 border-[color:var(--color-accent)] bg-white/10 p-3">
                                            <p className="text-[9px] font-bold text-[color:var(--color-accent)] uppercase tracking-widest mb-1">
                                                Balasan Mempelai
                                            </p>
                                            <p className="text-[11px] text-[color:var(--color-text)] italic font-serif">"{comment.admin_reply}"</p>
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