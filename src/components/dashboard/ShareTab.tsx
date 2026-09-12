'use client'

import { useState, useEffect } from 'react'
import { Send, Copy, Plus, Trash2, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/utils/supabase/client' // Sesuaikan path ini jika berbeda

const MESSAGE_TEMPLATES = [
    {
        id: 'formal',
        name: 'Formal (Islami)',
        text: `Assalamu'alaikum Wr. Wb\nBismillahirrahmanirrahim.\n\nYth. [nama_tamu],\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i, teman sekaligus sahabat, untuk menghadiri acara pernikahan kami:\n\n*[nama_mempelai]*\n\nBerikut link undangan kami untuk info lengkap dari acara bisa kunjungi:\n\n[link_undangan]\n\nMerupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.\n\nMohon maaf perihal undangan hanya dibagikan melalui pesan ini. Terima kasih banyak atas perhatiannya.\n\nWassalamu'alaikum Wr. Wb.\nTerima Kasih.`
    },
    {
        id: 'casual',
        name: 'Santai / Kasual',
        text: `Halo [nama_tamu]!\n\nDengan penuh kebahagiaan, kami bermaksud mengundang kamu untuk hadir di momen spesial pernikahan kami:\n\n*[nama_mempelai]*\n\nDetail acara dan lokasi dapat dilihat melalui link undangan berikut:\n\n[link_undangan]\n\nKehadiran dan doa restumu akan menjadi hadiah terindah bagi kami. Sampai jumpa di hari bahagia kami!\n\nTerima kasih.`
    },
    {
        id: 'singkat',
        name: 'Singkat / Padat',
        text: `Kepada Yth. [nama_tamu],\n\nKami mengundang Bapak/Ibu/Saudara/i untuk hadir pada acara pernikahan kami:\n\n*[nama_mempelai]*\n\nInformasi lengkap mengenai acara silakan buka link berikut:\n[link_undangan]\n\nTerima kasih atas doa dan restunya.`
    }
]

interface ShareTabProps {
    slug: string;
}

interface Guest {
    id: string;
    name: string;
    is_sent?: boolean;
}

export default function ShareTab({ slug }: ShareTabProps) {
    const [guests, setGuests] = useState<Guest[]>([])
    const [newGuest, setNewGuest] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    const namaMempelai = slug ? slug.split('-').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' & ') : 'Mempelai'

    const [selectedTemplateId, setSelectedTemplateId] = useState('formal')
    const [messageTemplate, setMessageTemplate] = useState(MESSAGE_TEMPLATES[0].text)

    const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value
        setSelectedTemplateId(val)
        if (val !== 'custom') {
            const found = MESSAGE_TEMPLATES.find(t => t.id === val)
            if (found) setMessageTemplate(found.text)
        }
    }

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessageTemplate(e.target.value)
        setSelectedTemplateId('custom') // Otomatis pindah ke opsi kustom jika diedit manual
    }

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://temuhatiinvite.com'
    const baseInvitationUrl = `${baseUrl}/${slug}`

    // Fetch data awal
    useEffect(() => {
        const fetchGuests = async () => {
            setIsLoading(true)
            const { data, error } = await supabase
                .from('guests')
                .select('*')
                .eq('slug', slug)
                .order('created_at', { ascending: true })

            if (data) setGuests(data)
            if (error) console.error(error)
            setIsLoading(false)
        }
        if (slug) fetchGuests()
    }, [slug, supabase])

    const addGuest = async (e: React.FormEvent) => {
        e.preventDefault()
        const guestName = newGuest.trim()
        if (!guestName) return

        if (guests.some(g => g.name.toLowerCase() === guestName.toLowerCase())) {
            toast.error('Nama tamu sudah ada')
            return
        }

        // Insert ke DB
        const { data, error } = await supabase
            .from('guests')
            .insert([{ slug, name: guestName }])
            .select()
            .single()

        if (error) {
            toast.error('Gagal menyimpan tamu')
            return
        }

        setGuests([...guests, data])
        setNewGuest('')
        toast.success('Tamu ditambahkan')
    }

    const removeGuest = async (id: string) => {
        // Delete dari DB
        const { error } = await supabase
            .from('guests')
            .delete()
            .eq('id', id)

        if (error) {
            toast.error('Gagal menghapus tamu')
            return
        }

        setGuests(guests.filter(g => g.id !== id))
        toast.success('Tamu dihapus')
    }

    const generateLink = (name: string) => {
        return `${baseInvitationUrl}?to=${encodeURIComponent(name)}`
    }
    const getFormattedMessage = (name: string) => {
        const link = generateLink(name)

        let namaMempelai = 'Mempelai'
        if (slug) {
            // 1. Hapus "undanganpernikahan-"
            let cleanSlug = slug.replace('undanganpernikahan-', '')

            // 2. Hapus angka di akhir (contoh: -1513 atau -2234)
            cleanSlug = cleanSlug.replace(/-\d+$/, '')

            // 3. Pecah HANYA berdasarkan "-dan-"
            const names = cleanSlug.split('-dan-')

            // 4. Ubah huruf pertama jadi kapital lalu gabung pakai &
            namaMempelai = names.map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' & ')
        }

        return messageTemplate
            .replace(/\[nama_tamu\]/g, name)
            .replace(/\[link_undangan\]/g, link)
            .replace(/\[nama_mempelai\]/g, namaMempelai)
    }

    const markAsSent = async (id: string) => {
        // Update database
        const { error } = await supabase.from('guests').update({ is_sent: true }).eq('id', id)

        // Update state lokal
        if (!error) {
            setGuests(prev => prev.map(g => g.id === id ? { ...g, is_sent: true } : g))
        }
    }

    const copyToClipboard = (guest: Guest) => {
        const text = getFormattedMessage(guest.name)
        navigator.clipboard.writeText(text)
        toast.success('Teks disalin!')
        if (!guest.is_sent) markAsSent(guest.id)
    }

    const sendWhatsApp = (guest: Guest) => {
        const text = getFormattedMessage(guest.name)
        const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
        window.open(waUrl, '_blank')
        if (!guest.is_sent) markAsSent(guest.id)
    }
    return (
        <div className="h-full bg-stone-50 p-6 md:p-10 overflow-y-auto">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Bagian Kiri: Pengaturan & Input */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Sebar Undangan</h2>
                        <p className="text-sm text-gray-500 mt-1">Buat link khusus dan kirim via WhatsApp.</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold text-gray-800 text-sm">Template Pesan WhatsApp</h3>
                            <select
                                value={selectedTemplateId}
                                onChange={handleTemplateChange}
                                className="text-xs border border-gray-300 rounded-md p-1.5 focus:outline-none focus:border-stone-500 bg-gray-50"
                            >
                                {MESSAGE_TEMPLATES.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                                <option value="custom">Kustom (Buat Sendiri)</option>
                            </select>
                        </div>
                        <textarea
                            value={messageTemplate}
                            onChange={handleTextChange}
                            rows={6}
                            className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-stone-500"
                        />
                        <p className="text-[11px] text-gray-400 mt-2">Gunakan <span className="font-mono text-stone-600">[nama_tamu]</span>, <span className="font-mono text-stone-600">[nama_mempelai]</span>, dan <span className="font-mono text-stone-600">[link_undangan]</span>.</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-semibold text-gray-800 mb-3 text-sm">Tambah Nama Tamu</h3>
                        <form onSubmit={addGuest} className="flex gap-2">
                            <input
                                type="text"
                                value={newGuest}
                                onChange={(e) => setNewGuest(e.target.value)}
                                placeholder="Contoh: Budi Santoso"
                                className="flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-stone-500"
                            />
                            <button type="submit" className="bg-stone-800 text-white p-2 rounded-lg hover:bg-stone-900 flex items-center justify-center">
                                <Plus className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bagian Kanan: Daftar Tamu */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col max-h-[calc(100vh-120px)]">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800 text-sm">Daftar Link Tamu</h3>
                        <span className="text-xs bg-stone-200 text-stone-700 px-2 py-1 rounded font-bold">{guests.length} Tamu</span>
                    </div>

                    <div className="p-4 overflow-y-auto flex-1">
                        {isLoading ? (
                            <div className="text-center py-10 text-gray-500 text-sm">Memuat daftar tamu...</div>
                        ) : guests.length === 0 ? (
                            <div className="text-center py-10 text-gray-400">
                                <Send className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                                <p className="text-sm">Belum ada tamu yang ditambahkan.</p>
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {guests.map((guest) => (
                                    <li key={guest.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50 flex flex-col gap-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="font-semibold text-gray-800 text-sm block mb-1">{guest.name}</span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${guest.is_sent ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                                    {guest.is_sent ? '✓ Terkirim' : 'Belum Dikirim'}
                                                </span>
                                            </div>
                                            <button onClick={() => removeGuest(guest.id)} className="text-red-400 hover:text-red-600">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="flex gap-2 mt-1">
                                            <button onClick={() => copyToClipboard(guest)} className="flex-1 bg-white border border-gray-200 text-gray-600 text-xs py-2 rounded shadow-sm hover:bg-gray-50 flex items-center justify-center gap-2">
                                                <Copy className="w-3 h-3" /> Copy Teks
                                            </button>
                                            <button onClick={() => sendWhatsApp(guest)} className="flex-1 bg-[#25D366] text-white text-xs py-2 rounded shadow-sm hover:bg-[#20b858] flex items-center justify-center gap-2 font-medium">
                                                <MessageCircle className="w-4 h-4" /> Kirim WA
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}