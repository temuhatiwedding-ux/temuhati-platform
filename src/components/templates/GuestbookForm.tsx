'use client'

import { useState, useEffect } from 'react'

export default function GuestbookForm({ invitationId }: { invitationId: string }) {
    const [formData, setFormData] = useState({ name: '', attendance: 'hadir', message: '' })
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [comments, setComments] = useState<any[]>([])

    const fetchComments = async () => {
        if (!invitationId) return
        try {
            const res = await fetch(`/api/comments?invitation_id=${invitationId}`)
            if (res.ok) {
                const data = await res.json()
                setComments(data)
            }
        } catch (error) {
            console.error('Gagal mengambil komentar', error)
        }
    }

    useEffect(() => {
        fetchComments()
    }, [invitationId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('loading')

        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    invitation_id: invitationId,
                    ...formData
                })
            })

            if (!res.ok) throw new Error('Gagal mengirim')

            setStatus('success')
            setFormData({ name: '', attendance: 'hadir', message: '' })
            fetchComments() // Refresh daftar komentar setelah sukses

            setTimeout(() => setStatus('idle'), 3000)
        } catch (error) {
            setStatus('error')
        }
    }

    return (
        <div className="max-w-xl mx-auto space-y-8">
            {/* Form Input */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 text-stone-800">
                <h3 className="font-serif text-2xl mb-4 text-center">Ucapan & Doa</h3>

                {status === 'success' && (
                    <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm mb-4 text-center font-medium">
                        Terima kasih atas ucapan dan doa Anda!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        required
                        type="text"
                        placeholder="Nama Lengkap"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full border border-stone-300 rounded-lg p-3 text-sm outline-none focus:border-stone-800 bg-white"
                    />
                    <select
                        value={formData.attendance}
                        onChange={(e) => setFormData(prev => ({ ...prev, attendance: e.target.value }))}
                        className="w-full border border-stone-300 rounded-lg p-3 text-sm outline-none focus:border-stone-800 bg-white"
                    >
                        <option value="hadir">Ya, Saya Akan Hadir</option>
                        <option value="tidak_hadir">Maaf, Saya Tidak Bisa Hadir</option>
                        <option value="ragu">Masih Ragu-ragu</option>
                    </select>
                    <textarea
                        required
                        rows={3}
                        placeholder="Tulis ucapan atau doa..."
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        className="w-full border border-stone-300 rounded-lg p-3 text-sm outline-none focus:border-stone-800 resize-none bg-white"
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-stone-800 text-white font-bold py-3 rounded-lg text-sm hover:bg-stone-900 disabled:opacity-50 transition-colors"
                    >
                        {status === 'loading' ? 'Mengirim...' : 'Kirim Ucapan'}
                    </button>
                </form>
            </div>

            {/* List Komentar */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 text-stone-800 max-h-[400px] overflow-y-auto">
                <h4 className="font-bold text-sm mb-4 pb-2 border-b border-stone-100 text-center uppercase tracking-widest">
                    {comments.length} Ucapan
                </h4>

                {comments.length === 0 ? (
                    <p className="text-center text-sm text-stone-500 py-4">Belum ada ucapan.</p>
                ) : (
                    <ul className="space-y-4">
                        {comments.map((comment) => (
                            <li key={comment.id} className="bg-stone-50 p-4 rounded-lg border border-stone-100">
                                <div className="flex justify-between items-start mb-2">
                                    <h5 className="font-bold text-sm">{comment.name}</h5>
                                    <span className={`text-[10px] px-2 py-1 rounded font-bold ${comment.attendance === 'hadir' ? 'bg-green-100 text-green-700' :
                                            comment.attendance === 'tidak_hadir' ? 'bg-red-100 text-red-700' :
                                                'bg-stone-200 text-stone-700'
                                        }`}>
                                        {comment.attendance === 'hadir' ? '✅ Hadir' : comment.attendance === 'tidak_hadir' ? '❌ Tidak Hadir' : 'Ragu'}
                                    </span>
                                </div>
                                <p className="text-sm text-stone-600 mb-2">{comment.message}</p>
                                <span className="text-[10px] text-stone-400">
                                    {new Date(comment.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}