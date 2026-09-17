'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Copy, Plus, Trash2, MessageCircle, CheckCircle2, Camera, X, UserCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/utils/supabase/client'
import { Html5QrcodeScanner } from 'html5-qrcode'

const MESSAGE_TEMPLATES = [
    {
        id: 'formal',
        name: 'Formal (Islami)',
        text: `Assalamu'alaikum Wr. Wb\nBismillahirrahmanirrahim.\n\nYth. [nama_tamu],\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i, untuk menghadiri acara pernikahan kami:\n\n*[nama_mempelai]*\n\nInfo lengkap acara & link undangan:\n[link_undangan]\n\n🎫 *Tiket Masuk & QR Code (Wajib ditunjukkan di lokasi):*\n[link_tiket]\n\nMerupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir. Terima Kasih.`
    },
    {
        id: 'casual',
        name: 'Santai / Kasual',
        text: `Halo [nama_tamu]!\n\nDengan penuh kebahagiaan, kami mengundang kamu untuk hadir di pernikahan kami:\n\n*[nama_mempelai]*\n\nDetail acara bisa dilihat di sini:\n[link_undangan]\n\n🎫 *Akses QR Code Check-in kamu (Tunjukkan di meja tamu ya!):*\n[link_tiket]\n\nKehadiranmu akan jadi hadiah terindah buat kami. Sampai jumpa!`
    }
]

interface ShareTabProps {
    slug: string;
}

interface Guest {
    id: string;
    name: string;
    whatsapp?: string;
    max_pax: number;
    is_sent: boolean;
    is_checked_in: boolean;
}

export default function ShareTab({ slug }: ShareTabProps) {
    const supabase = createClient()
    const [guests, setGuests] = useState<Guest[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Form States
    const [newGuest, setNewGuest] = useState('')
    const [newWa, setNewWa] = useState('')
    const [newPax, setNewPax] = useState<number | string>(1)

    const [selectedTemplateId, setSelectedTemplateId] = useState('formal')
    const [messageTemplate, setMessageTemplate] = useState(MESSAGE_TEMPLATES[0].text)

    // Scanner States
    const [isScannerOpen, setIsScannerOpen] = useState(false)
    const [scannedGuest, setScannedGuest] = useState<any>(null)
    const [actualPax, setActualPax] = useState<number | string>(1)
    const [isProcessing, setIsProcessing] = useState(false)
    const scannerRef = useRef<Html5QrcodeScanner | null>(null)

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://temuhatiinvite.com'
    const baseInvitationUrl = `${baseUrl}/${slug}`

    const getNamaMempelai = () => {
        if (!slug) return 'Mempelai'
        let cleanSlug = slug.replace('undanganpernikahan-', '').replace(/-\d+$/, '')
        return cleanSlug.split('-dan-').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' & ')
    }

    const fetchGuests = async () => {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('guest_list')
            .select('*')
            .eq('slug', slug)
            .order('created_at', { ascending: false })

        if (data) setGuests(data)
        if (error) console.error(error)
        setIsLoading(false)
    }

    useEffect(() => {
        if (slug) fetchGuests()
    }, [slug])

    useEffect(() => {
        if (!isScannerOpen) {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(console.error)
                scannerRef.current = null
            }
            return
        }

        if (scannerRef.current) return // Cegah kamera nyala 2x

        const scanner = new Html5QrcodeScanner(
            "qr-reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
        )
        scannerRef.current = scanner

        const processQR = async (decodedText: string) => {
            try {
                // Ekstrak ID (Fix "QR Tidak Valid")
                let scannedId = decodedText.trim()
                if (scannedId.includes('/tiket/')) {
                    const urlParts = scannedId.split('/tiket/')
                    scannedId = urlParts[1].split('?')[0].replace(/\/$/, '')
                }

                const { data, error } = await supabase
                    .from('guest_list')
                    .select('*')
                    .eq('id', scannedId)
                    .single() // Filter slug dihapus biar 100% akurat

                if (error) {
                    toast.error(`Error DB: ${error.message}`)
                    setTimeout(() => setIsProcessing(false), 2000)
                    return
                }

                if (!data) {
                    toast.error(`Data kosong! ID: ${scannedId.substring(0, 8)}`)
                    setTimeout(() => setIsProcessing(false), 2000)
                    return
                }

                if (data.is_checked_in) {
                    toast.error(`Tiket atas nama ${data.name} SUDAH DIPAKAI!`)
                    setTimeout(() => setIsProcessing(false), 2000)
                    return
                }

                setScannedGuest(data)
                setActualPax(data.max_pax)
                setIsProcessing(false)
            } catch (error: any) {
                toast.error(`Sistem Error: ${error.message}`)
                setIsProcessing(false)
            }
        }

        const onScanSuccess = (decodedText: string) => {
            setIsProcessing((loading) => {
                if (loading) return true
                setScannedGuest((guest: any) => {
                    if (guest) return guest
                    processQR(decodedText)
                    return null
                })
                return true
            })
        }

        scanner.render(onScanSuccess, () => { })

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(console.error)
                scannerRef.current = null
            }
        }
    }, [isScannerOpen, supabase])

    const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value
        setSelectedTemplateId(val)
        if (val !== 'custom') {
            const found = MESSAGE_TEMPLATES.find(t => t.id === val)
            if (found) setMessageTemplate(found.text)
        }
    }

    const addGuest = async (e: React.FormEvent) => {
        e.preventDefault()
        const guestName = newGuest.trim()
        if (!guestName) return

        const paxValue = Number(newPax) || 1

        const { data, error } = await supabase
            .from('guest_list')
            .insert([{ slug, name: guestName, whatsapp: newWa.trim(), max_pax: paxValue }])
            .select()
            .single()

        if (error) {
            toast.error('Gagal menyimpan tamu')
            return
        }

        setGuests([data, ...guests])
        setNewGuest('')
        setNewWa('')
        setNewPax(1)
        toast.success('Tamu berhasil ditambahkan')
    }

    const removeGuest = async (id: string) => {
        const { error } = await supabase.from('guest_list').delete().eq('id', id)
        if (error) {
            toast.error('Gagal menghapus tamu')
            return
        }
        setGuests(guests.filter(g => g.id !== id))
        toast.success('Tamu dihapus')
    }

    const getFormattedMessage = (guest: Guest) => {
        const linkUndangan = `${baseInvitationUrl}?to=${encodeURIComponent(guest.name)}`
        const linkTiket = `${baseUrl}/tiket/${guest.id}`
        return messageTemplate
            .replace(/\[nama_tamu\]/g, guest.name)
            .replace(/\[link_undangan\]/g, linkUndangan)
            .replace(/\[link_tiket\]/g, linkTiket)
            .replace(/\[nama_mempelai\]/g, getNamaMempelai())
    }

    const markAsSent = async (id: string) => {
        const { error } = await supabase.from('guest_list').update({ is_sent: true }).eq('id', id)
        if (!error) {
            setGuests(prev => prev.map(g => g.id === id ? { ...g, is_sent: true } : g))
        }
    }

    const copyToClipboard = (guest: Guest) => {
        navigator.clipboard.writeText(getFormattedMessage(guest))
        toast.success('Teks disalin!')
        if (!guest.is_sent) markAsSent(guest.id)
    }

    const sendWhatsApp = (guest: Guest) => {
        const text = getFormattedMessage(guest)
        const waUrl = guest.whatsapp
            ? `https://wa.me/${guest.whatsapp}?text=${encodeURIComponent(text)}`
            : `https://wa.me/?text=${encodeURIComponent(text)}`
        window.open(waUrl, '_blank')
        if (!guest.is_sent) markAsSent(guest.id)
    }

    const handleCheckIn = async () => {
        if (!scannedGuest) return
        setIsProcessing(true)

        try {
            const finalPax = Number(actualPax) || 1

            const { error } = await supabase
                .from('guest_list')
                .update({
                    is_checked_in: true,
                    actual_pax: finalPax,
                    check_in_time: new Date().toISOString()
                })
                .eq('id', scannedGuest.id)

            if (error) {
                // Munculkan notif error spesifik dari Supabase
                toast.error(`Gagal Update: ${error.message}`)
                return
            }

            toast.success(`Check-in berhasil: ${scannedGuest.name}`)

            // Update UI list langsung
            setGuests(prev => prev.map(g => g.id === scannedGuest.id ? { ...g, is_checked_in: true } : g))

            setScannedGuest(null)
            setIsScannerOpen(false) // Tutup modal otomatis jika sukses
        } catch (error: any) {
            console.error("Sistem Error Check-in:", error)
            toast.error('Terjadi kesalahan sistem saat update data.')
        } finally {
            // FINALLY ini yang menjamin tombol "Memproses..." bakal balik normal apapun yang terjadi
            setIsProcessing(false)
        }
    }

    return (
        <div className="h-full bg-stone-50 p-6 md:p-10 overflow-y-auto relative">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* KIRI: Form & Template */}
                <div className="space-y-6 lg:col-span-5">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Manajemen Tamu & QR</h2>
                        <p className="text-sm text-gray-500 mt-1">Atur kuota, kirim undangan, dan pantau check-in.</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-semibold text-gray-800 mb-4 text-sm flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Tambah Tamu Baru
                        </h3>
                        <form onSubmit={addGuest} className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-gray-600 block mb-1">Nama Tamu *</label>
                                <input required type="text" value={newGuest} onChange={(e) => setNewGuest(e.target.value)} placeholder="Contoh: Budi Santoso" className="w-full p-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-stone-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-gray-600 block mb-1">No. WA (Opsional)</label>
                                    <input type="text" value={newWa} onChange={(e) => setNewWa(e.target.value)} placeholder="62812..." className="w-full p-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-stone-500" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-600 block mb-1">Jatah Tamu (Pax)</label>
                                    <input type="number" min="1" value={newPax} onChange={(e) => setNewPax(e.target.value === '' ? '' : parseInt(e.target.value))} className="w-full p-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-stone-500" />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-stone-800 text-white p-2.5 rounded-lg text-sm font-semibold hover:bg-stone-900 transition-colors">
                                Simpan Tamu
                            </button>
                        </form>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold text-gray-800 text-sm">Template Pesan WA</h3>
                            <select value={selectedTemplateId} onChange={handleTemplateChange} className="text-xs border border-gray-300 rounded-md p-1.5 focus:outline-none focus:border-stone-500 bg-gray-50">
                                {MESSAGE_TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                <option value="custom">Kustom</option>
                            </select>
                        </div>
                        <textarea value={messageTemplate} onChange={(e) => { setMessageTemplate(e.target.value); setSelectedTemplateId('custom'); }} rows={6} className="w-full p-3 text-sm border border-gray-300 rounded-lg outline-none focus:border-stone-500" />
                    </div>
                </div>

                {/* KANAN: List Tamu & Tombol Scanner */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col lg:col-span-7 max-h-[calc(100vh-120px)]">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                            <h3 className="font-semibold text-gray-800 text-sm">Daftar Kehadiran</h3>
                            <div className="flex gap-2">
                                <span className="text-[10px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded font-bold">{guests.length} Total</span>
                                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">{guests.filter(g => g.is_checked_in).length} Hadir</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsScannerOpen(true)}
                            className="bg-[#3A4B40] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#2c3931] transition-colors"
                        >
                            <Camera className="w-4 h-4" /> Buka Scanner
                        </button>
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
                                    <li key={guest.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50 hover:bg-white transition-colors flex flex-col gap-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-gray-800 text-sm">{guest.name}</span>
                                                    {guest.is_checked_in && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider">
                                                    <span className={`px-2 py-0.5 rounded ${guest.is_sent ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>
                                                        {guest.is_sent ? 'WA Terkirim' : 'Belum Dikirim'}
                                                    </span>
                                                    <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                                                        {guest.max_pax} Pax
                                                    </span>
                                                </div>
                                            </div>
                                            <button onClick={() => removeGuest(guest.id)} className="text-red-400 hover:text-red-600 bg-red-50 p-1.5 rounded-md">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex gap-2 mt-2">
                                            <button onClick={() => copyToClipboard(guest)} className="flex-1 bg-white border border-gray-200 text-gray-600 text-xs py-2 rounded-lg shadow-sm hover:bg-gray-50 flex items-center justify-center gap-1.5 font-medium transition-all">
                                                <Copy className="w-3.5 h-3.5" /> Copy Teks
                                            </button>
                                            <button onClick={() => sendWhatsApp(guest)} className="flex-1 bg-[#25D366] text-white text-xs py-2 rounded-lg shadow-sm hover:bg-[#20b858] flex items-center justify-center gap-1.5 font-medium transition-all">
                                                <MessageCircle className="w-3.5 h-3.5" /> Kirim WA
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL SCANNER */}
            {isScannerOpen && (
                <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden relative shadow-2xl">

                        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-800">Scanner Check-in</h3>
                            <button
                                onClick={() => {
                                    setIsScannerOpen(false)
                                    setScannedGuest(null)
                                }}
                                className="p-1 bg-gray-200 rounded-full hover:bg-gray-300 text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Kalau data tamu sukses discan, munculin form konfirmasi. Kalau belum, munculin kamera. */}
                            {scannedGuest ? (
                                <div className="animate-in fade-in zoom-in duration-300">
                                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <UserCheck className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-center text-gray-900 mb-1">Tiket Valid</h3>
                                    <p className="text-center text-gray-500 text-sm mb-6">Atas nama <span className="font-bold text-gray-800">{scannedGuest.name}</span></p>

                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                                        <div className="flex justify-between items-center mb-3 text-sm">
                                            <span className="text-gray-500">Kuota Undangan:</span>
                                            <span className="font-bold text-gray-800">{scannedGuest.max_pax} Orang</span>
                                        </div>
                                        <hr className="border-gray-200 mb-3" />
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-semibold text-gray-700">Tamu yg Hadir:</span>
                                            <input
                                                type="number"
                                                min="1"
                                                value={actualPax}
                                                onChange={(e) => setActualPax(e.target.value === '' ? '' : parseInt(e.target.value))}
                                                className="w-16 p-2 text-center text-sm border border-gray-300 rounded-lg outline-none focus:border-stone-500 font-bold"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                setScannedGuest(null)
                                                setIsProcessing(false)
                                                // Jangan panggil setIsScannerOpen(false) di sini!
                                            }}
                                            className="flex-1 py-3 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                                        >
                                            Batal / Scan Ulang
                                        </button>
                                        <button
                                            onClick={handleCheckIn}
                                            disabled={isProcessing}
                                            className="flex-1 py-3 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-70"
                                        >
                                            {isProcessing ? 'Memproses...' : 'Konfirmasi Hadir'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-center text-sm text-gray-500 mb-4">Arahkan kamera ke QR Code tamu.</p>
                                    <div id="qr-reader" className="w-full rounded-2xl overflow-hidden border-none outline-none bg-black"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}