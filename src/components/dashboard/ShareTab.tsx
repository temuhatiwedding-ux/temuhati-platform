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
    hasQrAddon?: boolean;
    hasSelfieAddon?: boolean;
}

interface Guest {
    id: string;
    name: string;
    whatsapp?: string;
    max_pax: number;
    actual_pax?: number;
    selfie_url?: string;
    is_sent: boolean;
    is_checked_in: boolean;
}

export default function ShareTab({ slug, hasQrAddon = false, hasSelfieAddon = false }: ShareTabProps) {
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
    const scanLockRef = useRef(false)
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://temuhatiinvite.com'
    const baseInvitationUrl = `${baseUrl}/${slug}`

    // Search & Manual Check-in States
    const [searchQuery, setSearchQuery] = useState('')
    const [manualGuest, setManualGuest] = useState<any>(null)
    const [manualPax, setManualPax] = useState<number | string>(1)

    // Selfie States & Refs
    const [selfieData, setSelfieData] = useState<{ isOpen: boolean; guest: any }>({ isOpen: false, guest: null })
    const [isUploading, setIsUploading] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const streamRef = useRef<MediaStream | null>(null)

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
            scanLockRef.current = false // Reset lock saat kamera dimatikan
            return
        }

        if (scannerRef.current) return

        const scanner = new Html5QrcodeScanner(
            "qr-reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
        )
        scannerRef.current = scanner

        const onScanSuccess = async (decodedText: string) => {
            // Kalau kamera lagi dikunci (modal terbuka / lagi loading), JANGAN BACA QR LAGI
            if (scanLockRef.current) return

            scanLockRef.current = true // Langsung kunci kamera!
            setIsProcessing(true) // Tombol berubah jadi "Memproses..."

            try {
                let scannedId = decodedText.trim()
                if (scannedId.includes('/tiket/')) {
                    const urlParts = scannedId.split('/tiket/')
                    scannedId = urlParts[1].split('?')[0].replace(/\/$/, '')
                }

                const { data, error } = await supabase
                    .from('guest_list')
                    .select('*')
                    .eq('id', scannedId)
                    .single()

                if (error || !data || data.is_checked_in) {
                    if (error) toast.error(`Error DB: ${error.message}`)
                    else if (!data) toast.error(`Data kosong! ID: ${scannedId.substring(0, 8)}`)
                    else toast.error(`Tiket atas nama ${data.name} SUDAH DIPAKAI!`)

                    // Beri jeda 2 detik sebelum kamera bisa nge-scan ulang
                    setTimeout(() => {
                        setIsProcessing(false)
                        scanLockRef.current = false // Buka kunci
                    }, 2000)
                    return
                }

                // SUKSES NEMU DATA
                setScannedGuest(data)
                setActualPax(data.max_pax)
                setIsProcessing(false) // Tombol kembali jadi "Konfirmasi Hadir"

                // CATATAN: scanLockRef.current dibiarkan TRUE supaya 
                // kamera belakang layar nggak nyecan-nyecan lagi selama modal masih terbuka!
            } catch (error: any) {
                toast.error(`Sistem Error: ${error.message}`)
                setIsProcessing(false)
                scanLockRef.current = false
            }
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

        let finalMessage = messageTemplate
            .replace(/\[nama_tamu\]/g, guest.name)
            .replace(/\[link_undangan\]/g, linkUndangan)
            .replace(/\[nama_mempelai\]/g, getNamaMempelai())

        if (!hasQrAddon) {
            // Hapus blok teks QR Formal beserta enter-nya
            finalMessage = finalMessage.replace("\n\n🎫 *Tiket Masuk & QR Code (Wajib ditunjukkan di lokasi):*\n[link_tiket]", "")

            // Hapus blok teks QR Casual beserta enter-nya
            finalMessage = finalMessage.replace("\n\n🎫 *Akses QR Code Check-in kamu (Tunjukkan di meja tamu ya!):*\n[link_tiket]", "")

            // Jaga-jaga bersihin tag [link_tiket] kalau user ngetik manual di mode Kustom
            finalMessage = finalMessage.replace(/\[link_tiket\]/g, "")
        } else {
            // Kalau punya Addon, ganti tag dengan URL asli
            finalMessage = finalMessage.replace(/\[link_tiket\]/g, linkTiket)
        }

        return finalMessage
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

        let formattedWa = guest.whatsapp || ''
        if (formattedWa) {
            // 1. Bersihkan karakter aneh (spasi, strip, tanda plus)
            formattedWa = formattedWa.replace(/\D/g, '')

            // 2. Ubah angka 0 di depan menjadi 62
            if (formattedWa.startsWith('0')) {
                formattedWa = '62' + formattedWa.substring(1)
            }
            // 3. Antisipasi kalau user ngetik langsung "852..." tanpa 0 atau 62
            else if (formattedWa.startsWith('8')) {
                formattedWa = '62' + formattedWa
            }
        }

        const waUrl = formattedWa
            ? `https://wa.me/${formattedWa}?text=${encodeURIComponent(text)}`
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
                .update({ is_checked_in: true, actual_pax: finalPax, check_in_time: new Date().toISOString() })
                .eq('id', scannedGuest.id)

            if (error) {
                toast.error(`Gagal Update: ${error.message}`)
                setIsProcessing(false)
                return
            }

            toast.success(`Check-in berhasil: ${scannedGuest.name}`)

            // Update state UI list tamu
            setGuests(prev => prev.map(g => g.id === scannedGuest.id ? { ...g, is_checked_in: true, actual_pax: finalPax } : g))

            // LOGIKA TRANSISI ADD-ON SELFIE
            if (hasSelfieAddon) {
                const guestData = { id: scannedGuest.id, name: scannedGuest.name }
                setScannedGuest(null)
                setIsScannerOpen(false) // Mematikan scanner QR

                setSelfieData({ isOpen: true, guest: guestData })

                // JEDA 800ms: Biarkan hardware HP merilis kamera QR dulu baru buka Selfie
                setTimeout(() => {
                    startCamera()
                }, 800)

            } else {
                setScannedGuest(null)
                setIsScannerOpen(false)
            }

        } catch (error: any) {
            toast.error('Terjadi kesalahan sistem saat update data.')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleManualCheckIn = async () => {
        if (!manualGuest) return
        setIsProcessing(true)

        try {
            const finalPax = Number(manualPax) || 1
            const { error } = await supabase
                .from('guest_list')
                .update({ is_checked_in: true, actual_pax: finalPax, check_in_time: new Date().toISOString() })
                .eq('id', manualGuest.id)

            if (error) {
                toast.error(`Gagal Update: ${error.message}`)
                return
            }

            toast.success(`Check-in manual berhasil: ${manualGuest.name}`)
            setGuests(prev => prev.map(g => g.id === manualGuest.id ? { ...g, is_checked_in: true, actual_pax: finalPax } : g))

            // LOGIKA TRANSISI ADD-ON SELFIE
            if (hasSelfieAddon) {
                const guestData = { id: manualGuest.id, name: manualGuest.name }
                setManualGuest(null) // Tutup modal manual

                setSelfieData({ isOpen: true, guest: guestData })
                startCamera() // Nyalakan kamera selfie
            } else {
                setManualGuest(null)
            }

        } catch (error: any) {
            toast.error('Terjadi kesalahan sistem.')
        } finally {
            setIsProcessing(false)
        }
    }

    const startCamera = async () => {
        try {
            // Coba akses kamera depan (user)
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' }
            })
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                streamRef.current = stream
            }
        } catch (err) {
            // FALLBACK: Kalau device gagal baca facingMode, buka kamera default apa aja
            try {
                const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true })
                if (videoRef.current) {
                    videoRef.current.srcObject = fallbackStream
                    streamRef.current = fallbackStream
                }
            } catch (fallbackErr) {
                toast.error('Gagal akses kamera. Cek izin browser lu!')
            }
        }
    }

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop())
            streamRef.current = null
        }
    }

    const captureAndUpload = async () => {
        if (!videoRef.current || !canvasRef.current || !selfieData.guest) return

        const video = videoRef.current
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set ukuran canvas lebih kecil untuk kompresi (misal lebar 600px)
        const targetWidth = 600
        const scale = targetWidth / video.videoWidth
        const targetHeight = video.videoHeight * scale

        canvas.width = targetWidth
        canvas.height = targetHeight

        // Jepret gambar ke canvas
        ctx.drawImage(video, 0, 0, targetWidth, targetHeight)

        // KOMPRESI: Ubah ke JPEG dengan kualitas 60% (0.6)
        const base64Image = canvas.toDataURL('image/jpeg', 0.6)

        setIsUploading(true)
        try {
            // 1. Upload ke API Cloudflare lu (Buat endpoint /api/upload-selfie di Next.js lu)
            const response = await fetch('/api/upload-selfie', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64Image, guestId: selfieData.guest.id })
            })

            const { url } = await response.json()
            if (!url) throw new Error("Gagal dapat URL dari Cloudflare")

            // 2. Simpan URL ke Supabase
            await supabase.from('guest_list').update({ selfie_url: url }).eq('id', selfieData.guest.id)

            // 3. Update UI List
            setGuests(prev => prev.map(g => g.id === selfieData.guest.id ? { ...g, selfie_url: url } : g))
            toast.success('Selfie tersimpan!')

            // Tutup modal
            stopCamera()
            setSelfieData({ isOpen: false, guest: null })
        } catch (error: any) {
            toast.error('Gagal upload selfie.')
        } finally {
            setIsUploading(false)
        }
    }

    const filteredGuests = guests.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()))

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
                                {/* HANYA MUNCUL JIKA PUNYA ADDON */}
                                {hasQrAddon && (
                                    <div>
                                        <label className="text-xs font-medium text-gray-600 block mb-1">Jatah Tamu (Pax)</label>
                                        <input type="number" min="1" value={newPax} onChange={(e) => setNewPax(e.target.value === '' ? '' : parseInt(e.target.value))} className="w-full p-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-stone-500" />
                                    </div>
                                )}
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
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                        <div className="flex flex-col gap-1">
                            <h3 className="font-semibold text-gray-800 text-sm">Daftar Tamu</h3>
                            <div className="flex gap-2">
                                <span className="text-[10px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded font-bold">{guests.length} Total</span>
                                {hasQrAddon && (
                                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">{guests.filter(g => g.is_checked_in).length} Hadir</span>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                            {hasQrAddon ? (
                                <>
                                    {/* TOMBOL UPGRADE SELFIE (Simulasi Bypass) */}
                                    {!hasSelfieAddon && (
                                        <button
                                            onClick={async () => {
                                                const { error } = await supabase.from('invitations').update({ has_selfie_addon: true }).eq('slug', slug)
                                                if (!error) {
                                                    alert('Upgrade Selfie Sukses!')
                                                    window.location.reload()
                                                }
                                            }}
                                            className="flex-1 md:flex-none bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
                                        >
                                            ✨ +Selfie
                                        </button>
                                    )}

                                    {/* TOMBOL SCANNER */}
                                    <button
                                        onClick={() => setIsScannerOpen(true)}
                                        className="flex-1 md:flex-none bg-[#3A4B40] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#2c3931] transition-colors"
                                    >
                                        <Camera className="w-4 h-4" /> Buka Scanner
                                    </button>
                                </>
                            ) : (
                                /* TOMBOL UPGRADE QR (Simulasi Bypass) */
                                <button
                                    onClick={async () => {
                                        const { error } = await supabase.from('invitations').update({ has_qr_addon: true }).eq('slug', slug)
                                        if (!error) {
                                            alert('Upgrade QR Sukses!')
                                            window.location.reload()
                                        }
                                    }}
                                    className="w-full md:w-auto bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
                                >
                                    🔒 Beli Fitur QR
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="p-4 overflow-y-auto flex-1">
                        <div className="p-4 border-b border-gray-100">
                            <input
                                type="text"
                                placeholder="Cari nama tamu..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full p-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-stone-500"
                            />
                        </div>
                        {isLoading ? (
                            <div className="text-center py-10 text-gray-500 text-sm">Memuat daftar tamu...</div>
                        ) : guests.length === 0 ? (
                            <div className="text-center py-10 text-gray-400">
                                <Send className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                                <p className="text-sm">Belum ada tamu yang ditambahkan.</p>
                            </div>

                        ) : (

                            <ul className="space-y-3">
                                {filteredGuests.map((guest) => (
                                    <li key={guest.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50 hover:bg-white transition-colors flex flex-col gap-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                {/* 1. BARIS NAMA, FOTO & CENTANG (Sudah digabung jadi satu) */}
                                                <div className="flex items-center gap-2 mb-1">
                                                    {hasSelfieAddon && guest.selfie_url && (
                                                        <img src={guest.selfie_url} alt="Selfie" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                                                    )}
                                                    <span className="font-bold text-gray-800 text-sm">{guest.name}</span>
                                                    {hasQrAddon && guest.is_checked_in && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                                </div>

                                                {/* 2. BARIS BADGE STATUS WA & PAX */}
                                                <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider">
                                                    <span className={`px-2 py-0.5 rounded ${guest.is_sent ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>
                                                        {guest.is_sent ? 'WA Terkirim' : 'Belum Dikirim'}
                                                    </span>

                                                    {hasQrAddon && (
                                                        <div className="flex gap-1">
                                                            <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                                                                Kuota: {guest.max_pax}
                                                            </span>
                                                            {guest.is_checked_in && (
                                                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                                                    Hadir: {guest.actual_pax || 0}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* 3. TOMBOL HAPUS */}
                                            <button onClick={() => removeGuest(guest.id)} className="text-red-400 hover:text-red-600 bg-red-50 p-1.5 rounded-md">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* 4. TOMBOL AKSI BAWAH */}
                                        <div className="flex gap-2 mt-2">
                                            <button onClick={() => copyToClipboard(guest)} className="flex-1 bg-white border border-gray-200 text-gray-600 text-xs py-2 rounded-lg shadow-sm hover:bg-gray-50 flex items-center justify-center gap-1.5 font-medium transition-all">
                                                <Copy className="w-3.5 h-3.5" /> Copy Teks
                                            </button>
                                            <button onClick={() => sendWhatsApp(guest)} className="flex-1 bg-[#25D366] text-white text-xs py-2 rounded-lg shadow-sm hover:bg-[#20b858] flex items-center justify-center gap-1.5 font-medium transition-all">
                                                <MessageCircle className="w-3.5 h-3.5" /> Kirim WA
                                            </button>
                                            {hasQrAddon && !guest.is_checked_in && (
                                                <button
                                                    onClick={() => { setManualGuest(guest); setManualPax(guest.max_pax); }}
                                                    className="flex-1 bg-stone-800 text-white text-xs py-2 rounded-lg shadow-sm hover:bg-stone-900 flex items-center justify-center gap-1.5 font-medium transition-all"
                                                >
                                                    <UserCheck className="w-3.5 h-3.5" /> Manual Checkin
                                                </button>
                                            )}
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
                                                scanLockRef.current = false // <--- BUKA KUNCI KAMERA BIAR BISA SCAN LAGI
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
            {/* MODAL MANUAL CHECK-IN */}
            {manualGuest && (
                <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl transform transition-all animate-in zoom-in duration-200">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <UserCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-center text-gray-900 mb-1">Manual Check-in</h3>
                        <p className="text-center text-gray-500 text-sm mb-6">Atas nama <span className="font-bold text-gray-800">{manualGuest.name}</span></p>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                            <div className="flex justify-between items-center mb-3 text-sm">
                                <span className="text-gray-500">Kuota Undangan:</span>
                                <span className="font-bold text-gray-800">{manualGuest.max_pax} Orang</span>
                            </div>
                            <hr className="border-gray-200 mb-3" />
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-gray-700">Tamu yg Hadir:</span>
                                <input
                                    type="number"
                                    min="1"
                                    value={manualPax}
                                    onChange={(e) => setManualPax(e.target.value === '' ? '' : parseInt(e.target.value))}
                                    className="w-16 p-2 text-center text-sm border border-gray-300 rounded-lg outline-none focus:border-stone-500 font-bold"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setManualGuest(null)}
                                className="flex-1 py-3 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleManualCheckIn}
                                disabled={isProcessing}
                                className="flex-1 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-70"
                            >
                                {isProcessing ? 'Memproses...' : 'Konfirmasi'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL SELFIE */}
            {selfieData.isOpen && (
                <div className="fixed inset-0 bg-black/90 z-[110] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden p-6 shadow-2xl flex flex-col items-center">
                        <h3 className="font-bold text-gray-900 mb-1">Selfie Kehadiran</h3>
                        <p className="text-sm text-gray-500 mb-4">{selfieData.guest?.name}</p>

                        {/* Area Kamera */}
                        <div className="w-full aspect-square bg-black rounded-2xl overflow-hidden relative mb-6">
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
                            {/* Canvas disembunyikan, cuma buat proses gambar */}
                            <canvas ref={canvasRef} className="hidden" />

                            {isUploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-bold">
                                    Mengunggah...
                                </div>
                            )}
                        </div>

                        <div className="flex w-full gap-3">
                            <button
                                onClick={() => {
                                    stopCamera()
                                    setSelfieData({ isOpen: false, guest: null })
                                }}
                                disabled={isUploading}
                                className="flex-1 py-3 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl"
                            >
                                Lewati
                            </button>
                            <button
                                onClick={captureAndUpload}
                                disabled={isUploading}
                                className="flex-1 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl"
                            >
                                Jepret & Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}