'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import TemplateRenderer from '@/components/templates/TemplateRenderer'
import imageCompression from 'browser-image-compression'
import { Toaster, toast } from 'react-hot-toast'
import { Image as ImageIcon, Music, Heart, CalendarDays, Gift, Video, Type, CheckCircle, UploadCloud, X, ChevronUp, Save, Menu, MessageSquare, Send, Copy, ExternalLink, } from 'lucide-react'

import Sidebar from '@/components/dashboard/Sidebar'


const TEMPLATE_CONFIG: Record<string, { name: string, hasCover: boolean, hasBg: boolean, hasClosingPhoto: boolean }> = {
    'rustic-01': { name: 'Rustic Minimalist', hasCover: true, hasBg: false, hasClosingPhoto: false },
    'modern-02': { name: 'Modern Full Image', hasCover: false, hasBg: true, hasClosingPhoto: true },
    'elegan-01': { name: 'Elegant Luxury', hasCover: true, hasBg: false, hasClosingPhoto: false },
    // Tambahkan variasi desain lain di sini nanti
}

const PRESET_MUSIC = [
    { label: '-- Pilih Lagu Bawaan --', value: '' },
    { label: 'Upload Lagu Sendiri', value: 'custom' },
    { label: 'A Thousand Years - Christina Perri', value: 'https://temuhatiinvite.com/master-music/tiara-andini.mp3' }, // Nanti ganti dengan URL lagu lu di R2

]


export default function DashboardClient({ user, initialData }: { user: any, initialData?: any }) {
    const [formData, setFormData] = useState({

        template_id: initialData?.template_id || 'rustic-01',

        brideName: initialData?.bride_name || '',
        groomName: initialData?.groom_name || '',
        coverPhoto: initialData?.content_data?.coverPhoto || '',
        bgPhoto: initialData?.content_data?.bgPhoto || '',
        musicUrl: initialData?.content_data?.musicUrl || '',
        quote: initialData?.content_data?.quote || '',
        bride_details: initialData?.content_data?.bride_details || { fullName: '', order: '', parents: '', ig: '' },
        groom_details: initialData?.content_data?.groom_details || { fullName: '', order: '', parents: '', ig: '' },
        events: initialData?.content_data?.events || {
            akad: { date: '', time: '', location: '', mapUrl: '' },
            resepsi: { date: '', time: '', location: '', mapUrl: '' }
        },
        gift: initialData?.content_data?.gift || { enabled: true, banks: [{ name: '', account: '', holder: '' }] },
        love_story: initialData?.content_data?.love_story || { enabled: true, stories: [{ year: '2020', text: 'Pertama kali bertemu' }] },
        live_stream: initialData?.content_data?.live_stream || { enabled: false, url: '' },
        closing_text: initialData?.content_data?.closing_text || '',
        sections: initialData?.content_data?.sections || { gallery: { enabled: true, photos: [] } }


    })
    const activeConfig = TEMPLATE_CONFIG[formData.template_id] || TEMPLATE_CONFIG['rustic-01']
    const [saveStatus, setSaveStatus] = useState('Tersimpan')
    const [invitationSlug, setInvitationSlug] = useState('')
    const [invitationStatus, setInvitationStatus] = useState('DRAFT')
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
    const [isUploadingMusic, setIsUploadingMusic] = useState(false)
    const [isFormOpen, setIsFormOpen] = useState(false)

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [activeMenu, setActiveMenu] = useState('editor') // 'editor', 'komentar', 'sebar', 'statistik'
    const supabase = createClient()

    const updateNested = (category: string, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [category]: { ...prev[category as keyof typeof prev] as any, [field]: value }
        }))
    }

    const updateEvent = (event: 'akad' | 'resepsi', field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            events: {
                ...prev.events,
                [event]: { ...prev.events[event], [field]: value }
            }
        }))
    }

    const handleUpload = async (file: File, folder: string, type: 'photo' | 'music') => {
        const isPhoto = type === 'photo'
        isPhoto ? setIsUploadingPhoto(true) : setIsUploadingMusic(true)

        const data = new FormData()
        data.append('file', file)
        data.append('folder', folder)

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: data })
            const result = await res.json()

            if (result.success) {
                if (isPhoto) setFormData(prev => ({ ...prev, coverPhoto: result.url }))
                else setFormData(prev => ({ ...prev, musicUrl: result.url }))
            } else {
                alert(result.error)
            }
        } catch (error) {
            alert('Upload gagal')
        } finally {
            isPhoto ? setIsUploadingPhoto(false) : setIsUploadingMusic(false)
        }
    }

    const handlePublish = async () => {
        await supabase.from('invitations').update({ status: 'PUBLISHED' }).eq('slug', invitationSlug)
        setInvitationStatus('PUBLISHED')
        alert('Sukses! Undangan aktif (Bypass Midtrans)')
    }

    const toggleSection = (section: 'gallery') => {
        setFormData(prev => ({
            ...prev,
            sections: {
                ...prev.sections,
                [section]: { enabled: !prev.sections[section].enabled }
            }
        }))
    }

    useEffect(() => {
        const saveData = async () => {
            setSaveStatus('Menyimpan...')

            const { data: existing } = await supabase
                .from('invitations')
                .select('id, slug, status')
                .eq('user_id', user.id)
                .maybeSingle()

            const payload = {
                template_id: formData.template_id,
                bride_name: formData.brideName,
                groom_name: formData.groomName,
                content_data: {
                    coverPhoto: formData.coverPhoto,
                    bgPhoto: formData.bgPhoto,
                    musicUrl: formData.musicUrl,
                    quote: formData.quote,
                    bride_details: formData.bride_details,
                    groom_details: formData.groom_details,
                    events: formData.events,
                    gift: formData.gift,
                    love_story: formData.love_story,
                    live_stream: formData.live_stream,
                    closing_text: formData.closing_text,
                    sections: formData.sections

                }
            }

            if (existing) {
                await supabase.from('invitations').update(payload).eq('id', existing.id)
                setInvitationSlug(existing.slug)
                setInvitationStatus(existing.status)
            } else {
                const newSlug = `invite-${user.id.substring(0, 8)}-${Date.now()}`
                await supabase.from('invitations').insert({
                    user_id: user.id,
                    slug: newSlug,
                    status: 'DRAFT',
                    ...payload
                })
                setInvitationSlug(newSlug)
                setInvitationStatus('DRAFT')
            }
            setSaveStatus('Tersimpan')
        }

        const timer = setTimeout(() => saveData(), 1000)
        return () => clearTimeout(timer)
    }, [formData, user.id, supabase])

    // Mapping data untuk props TemplateRenderer
    const previewData = {
        template_id: formData.template_id,
        bride_name: formData.brideName,
        groom_name: formData.groomName,
        content_data: {
            coverPhoto: formData.coverPhoto,
            musicUrl: formData.musicUrl,
            sections: formData.sections
        }
    }

    const addStory = () => {
        setFormData(prev => ({ ...prev, love_story: { ...prev.love_story, stories: [...prev.love_story.stories, { year: '', text: '' }] } }))
    }

    const updateStory = (index: number, field: string, value: string) => {
        setFormData(prev => {
            const newStories = [...prev.love_story.stories]
            newStories[index] = { ...newStories[index], [field]: value }
            return { ...prev, love_story: { ...prev.love_story, stories: newStories } }
        })
    }

    const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Deklarasikan toastId di sini, SEBELUM try
        const toastId = toast.loading('Mengupload gambar...')

        try {
            const options = {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 1280,
                useWebWorker: true,
                fileType: 'image/webp'
            }

            const compressedFile = await imageCompression(file, options)
            const fileName = `${field}-${user.id}.webp`

            const formData = new FormData()
            formData.append('file', compressedFile, fileName)

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })

            const data = await response.json()

            if (data.url) {
                const urlWithCacheBuster = `${data.url}?t=${Date.now()}`
                setFormData(prev => ({ ...prev, [field]: urlWithCacheBuster }))

                // Panggil success dengan id
                toast.success('Upload berhasil!', { id: toastId })
            }
        } catch (error) {
            console.error(error)
            // Panggil error dengan id
            toast.error('Gagal mengupload gambar', { id: toastId })
        }
    }
    const handleUploadMusic = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 10 * 1024 * 1024) {
            toast.error('Ukuran lagu terlalu besar! Maksimal 10MB.')
            return
        }

        const toastId = toast.loading('Sedang mengupload musik...')

        try {
            const ext = file.name.split('.').pop()
            const fileName = `music-${user.id}.${ext}`

            const formData = new FormData()
            formData.append('file', file, fileName)
            formData.append('folder', 'music')

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })

            const data = await response.json()

            if (data.url) {
                const urlWithCacheBuster = `${data.url}?t=${Date.now()}`
                setFormData(prev => ({ ...prev, musicUrl: urlWithCacheBuster }))
                toast.success('Upload musik berhasil!', { id: toastId })
            }
        } catch (error) {
            console.error(error)
            toast.error('Gagal mengupload musik', { id: toastId })
        }
    }

    const handleUploadGallery = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Deklarasikan toastId sebelum try
        const toastId = toast.loading('Mengupload gambar galeri...')

        try {
            const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1280, useWebWorker: true, fileType: 'image/webp' }
            const compressedFile = await imageCompression(file, options)

            // Nama fix berdasarkan urutan (index) agar saling menimpa
            const fileName = `gallery-${user.id}-${index}.webp`
            const uploadData = new FormData()
            uploadData.append('file', compressedFile, fileName)
            uploadData.append('folder', 'gallery')

            const response = await fetch('/api/upload', { method: 'POST', body: uploadData })
            const data = await response.json()

            if (data.url) {
                const urlWithCacheBuster = `${data.url}?t=${Date.now()}`
                setFormData(prev => {
                    const currentPhotos = prev.sections.gallery.photos || []
                    const newPhotos = [...currentPhotos]
                    newPhotos[index] = urlWithCacheBuster
                    return { ...prev, sections: { ...prev.sections, gallery: { ...prev.sections.gallery, photos: newPhotos } } }
                })
                // Panggil success dengan id
                toast.success('Upload foto galeri berhasil!', { id: toastId })
            }
        } catch (error) {
            console.error(error)
            // Panggil error dengan id
            toast.error('Gagal mengupload foto galeri', { id: toastId })
        }
    }

    const removeGalleryPhoto = (index: number) => {
        setFormData(prev => {
            const currentPhotos = prev.sections.gallery.photos || []
            const newPhotos = currentPhotos.filter((_: string, i: number) => i !== index)
            return { ...prev, sections: { ...prev.sections, gallery: { ...prev.sections.gallery, photos: newPhotos } } }
        })
    }

    const copyLink = () => {
        navigator.clipboard.writeText(`http://localhost:3000/${invitationSlug}`)
        toast.success('Link berhasil disalin!')
    }

    const [comments, setComments] = useState<any[]>([])
    const [isLoadingComments, setIsLoadingComments] = useState(false)

    // Fungsi tarik data komentar
    const fetchComments = async () => {
        // Asumsi lu pakai supabase client di file ini
        setIsLoadingComments(true)
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            // PASTIKAN FILTER INI ADA AGAR TIDAK BOCOR
            .eq('invitation_id', user.id) // Sesuaikan dengan ID unik undangan lu
            .order('created_at', { ascending: false })

        if (data) setComments(data)
        setIsLoadingComments(false)
    }

    // Panggil otomatis saat menu komentar dibuka
    useEffect(() => {
        if (activeMenu === 'komentar') fetchComments()
    }, [activeMenu])

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans text-slate-800 w-full relative">
            <Toaster
                position="top-center"
                containerStyle={{ zIndex: 99999 }}
                toastOptions={{ className: 'text-sm font-bold' }}
            />

            {/* ================= SIDEBAR ================= */}
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
            />

            {/* ================= MAIN CONTENT ================= */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">

                {/* Topbar Mobile & Indikator Status */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 justify-between z-30 shrink-0">
                    <div className="flex items-center gap-3">
                        <button className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md" onClick={() => setIsSidebarOpen(true)}>
                            <Menu className="w-5 h-5" />
                        </button>
                        <h2 className="font-semibold text-slate-800 md:hidden capitalize">{activeMenu}</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${saveStatus === 'Menyimpan...' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {saveStatus}
                        </span>
                    </div>
                </header>

                {/* Konten Dinamis */}
                <main className="flex-1 overflow-hidden relative">

                    {/* LAYOUT EDITOR UNDANGAN */}
                    {activeMenu === 'editor' && (
                        <div className="flex h-full relative w-full text-black">
                            {/* AREA FORM (Kiri di Desktop, Bottom Sheet di HP) */}
                            <div className={`
                                fixed inset-x-0 bottom-0 z-50 w-full h-[85vh] bg-white shadow-2xl rounded-t-2xl transition-transform duration-300 ease-in-out transform flex flex-col
                                md:relative md:inset-auto md:h-full md:w-[450px] md:translate-y-0 md:rounded-none md:border-r md:border-gray-300 md:shadow-none
                                ${isFormOpen ? 'translate-y-0' : 'translate-y-full'}
                            `}>
                                {/* Header Bottom Sheet (Hanya Mobile) */}
                                <div className="md:hidden flex justify-between items-center p-4 border-b sticky top-0 bg-white rounded-t-2xl z-10 shrink-0">
                                    <h2 className="font-bold text-lg">Editor Undangan</h2>
                                    <button onClick={() => setIsFormOpen(false)} className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm font-bold">
                                        Tutup
                                    </button>
                                </div>

                                {/* Wrapper Scroll Form */}
                                <div className="p-6 h-full overflow-y-auto pb-24 md:pb-6 flex flex-col justify-between">
                                    <div>
                                        {/* Header Desktop */}
                                        <div className="hidden md:flex justify-between items-center mb-6">
                                            <h2 className="text-2xl font-bold">Editor Undangan</h2>
                                        </div>

                                        {/* ===================== STATUS BANNER ===================== */}
                                        <div className="mb-6">
                                            {invitationStatus === 'DRAFT' ? (
                                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                                                    <div>
                                                        <h3 className="font-bold text-gray-800 text-sm">Status: Draft</h3>
                                                        <p className="text-xs text-gray-500 mt-0.5">Selesaikan pembayaran untuk mengaktifkan link.</p>
                                                    </div>
                                                    <button onClick={handlePublish} className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded-md text-xs font-bold hover:bg-gray-800 transition-colors">
                                                        Bayar & Aktifkan
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                                    <div className="overflow-hidden">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                                            <h3 className="font-bold text-green-800 text-sm">Undangan Aktif</h3>
                                                        </div>
                                                        <p className="text-xs text-green-700 truncate">
                                                            http://localhost:3000/{invitationSlug}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2 w-full sm:w-auto">
                                                        <button onClick={copyLink} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-white border border-green-200 text-green-700 px-3 py-2 rounded-md text-xs font-bold hover:bg-green-100 transition-colors">
                                                            <Copy className="w-3.5 h-3.5" /> Salin
                                                        </button>
                                                        <a href={`/${invitationSlug}`} target="_blank" className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-green-600 text-white px-3 py-2 rounded-md text-xs font-bold hover:bg-green-700 transition-colors">
                                                            <ExternalLink className="w-3.5 h-3.5" /> Buka
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* ===================== ISI FORM ===================== */}
                                        <div className="flex flex-col gap-5">

                                            {/* PILIH TEMA */}
                                            <div className="bg-white border border-gray-200 rounded-lg p-5">
                                                <h3 className="font-semibold text-gray-800 mb-3 text-sm">Pilih Desain Tema</h3>
                                                <select
                                                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black outline-none"
                                                    value={formData.template_id}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, template_id: e.target.value }))}
                                                >
                                                    {Object.entries(TEMPLATE_CONFIG).map(([id, config]) => (
                                                        <option key={id} value={id}>{config.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {/* KARTU 1: DATA MEMPELAI */}
                                            <div className="bg-white border border-gray-200 rounded-lg p-5">
                                                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                                                    <Heart className="w-4 h-4 text-gray-500" />
                                                    <h3 className="font-semibold text-gray-800">Data Mempelai</h3>
                                                </div>
                                                <div className="space-y-5">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Panggilan Wanita</label>
                                                            <input type="text" value={formData.brideName} onChange={(e) => setFormData({ ...formData, brideName: e.target.value })} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Panggilan Pria</label>
                                                            <input type="text" value={formData.groomName} onChange={(e) => setFormData({ ...formData, groomName: e.target.value })} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none" />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <h4 className="font-medium text-sm text-gray-800">Detail Wanita</h4>
                                                        <input className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black outline-none" placeholder="Nama Lengkap" value={formData.bride_details.fullName} onChange={(e) => updateNested('bride_details', 'fullName', e.target.value)} />
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <input className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black outline-none" placeholder="Putri ke-..." value={formData.bride_details.order} onChange={(e) => updateNested('bride_details', 'order', e.target.value)} />
                                                            <input className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black outline-none" placeholder="Username IG" value={formData.bride_details.ig} onChange={(e) => updateNested('bride_details', 'ig', e.target.value)} />
                                                        </div>
                                                        <input className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black outline-none" placeholder="Nama Orang Tua" value={formData.bride_details.parents} onChange={(e) => updateNested('bride_details', 'parents', e.target.value)} />
                                                    </div>

                                                    <div className="space-y-3 pt-3">
                                                        <h4 className="font-medium text-sm text-gray-800">Detail Pria</h4>
                                                        <input className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black outline-none" placeholder="Nama Lengkap" value={formData.groom_details.fullName} onChange={(e) => updateNested('groom_details', 'fullName', e.target.value)} />
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <input className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black outline-none" placeholder="Putra ke-..." value={formData.groom_details.order} onChange={(e) => updateNested('groom_details', 'order', e.target.value)} />
                                                            <input className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black outline-none" placeholder="Username IG" value={formData.groom_details.ig} onChange={(e) => updateNested('groom_details', 'ig', e.target.value)} />
                                                        </div>
                                                        <input className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black outline-none" placeholder="Nama Orang Tua" value={formData.groom_details.parents} onChange={(e) => updateNested('groom_details', 'parents', e.target.value)} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* KARTU 2: MEDIA UTAMA */}
                                            <div className="bg-white border border-gray-200 rounded-lg p-5">
                                                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                                                    <ImageIcon className="w-4 h-4 text-gray-500" />
                                                    <h3 className="font-semibold text-gray-800">Media Utama</h3>
                                                </div>
                                                <div className="space-y-5">

                                                    {/* Tampil hanya jika template butuh Cover */}
                                                    {activeConfig.hasCover && (
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Foto Cover Utama</label>
                                                            <div className="flex items-center gap-3">
                                                                <label className="flex-1 cursor-pointer bg-white hover:bg-gray-50 border border-dashed border-gray-300 rounded-md p-2.5 text-center">
                                                                    <span className="text-xs text-gray-600">Pilih Foto</span>
                                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUploadImage(e, 'coverPhoto')} />
                                                                </label>
                                                                {formData.coverPhoto && (
                                                                    <div className="flex flex-col items-center gap-1">
                                                                        <img src={formData.coverPhoto} alt="Cover" className="h-10 w-10 rounded-md object-cover border" />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setFormData(prev => ({ ...prev, coverPhoto: '' }))}
                                                                            className="text-[10px] text-red-500 hover:underline"
                                                                        >
                                                                            Hapus
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Tampil hanya jika template butuh Background Foto */}
                                                    {activeConfig.hasBg && (
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Foto Background Utama</label>
                                                            <div className="flex items-center gap-3">
                                                                <label className="flex-1 cursor-pointer bg-white hover:bg-gray-50 border border-dashed border-gray-300 rounded-md p-2.5 text-center">
                                                                    <span className="text-xs text-gray-600">Pilih Background</span>
                                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUploadImage(e, 'bgPhoto')} />
                                                                </label>
                                                                {formData.bgPhoto && (
                                                                    <div className="flex flex-col items-center gap-1">
                                                                        <img src={formData.bgPhoto} alt="Background" className="h-10 w-10 rounded-md object-cover border" />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setFormData(prev => ({ ...prev, bgPhoto: '' }))}
                                                                            className="text-[10px] text-red-500 hover:underline"
                                                                        >
                                                                            Hapus
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Musik Latar</label>
                                                        <select className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black outline-none mb-2" onChange={(e) => setFormData(prev => ({ ...prev, musicUrl: e.target.value }))} value={PRESET_MUSIC.find(p => p.value === formData.musicUrl) ? formData.musicUrl : 'custom'}>
                                                            {PRESET_MUSIC.map((music, i) => <option key={i} value={music.value}>{music.label}</option>)}
                                                        </select>
                                                        {(!PRESET_MUSIC.find(p => p.value === formData.musicUrl) || formData.musicUrl === 'custom') && formData.musicUrl !== '' && (
                                                            <label className="block cursor-pointer bg-white hover:bg-gray-50 border border-dashed border-gray-300 rounded-md p-2.5 text-center">
                                                                <span className="text-xs text-gray-600">Upload MP3 (Max 10MB)</span>
                                                                <input type="file" accept="audio/mp3,audio/mpeg" className="hidden" onChange={handleUploadMusic} />
                                                            </label>
                                                        )}
                                                        {formData.musicUrl && formData.musicUrl !== 'custom' && <audio controls src={formData.musicUrl} className="mt-2 w-full h-8" />}
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Kutipan Pernikahan</label>
                                                        <textarea className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black outline-none resize-none" rows={3} value={formData.quote} onChange={(e) => setFormData({ ...formData, quote: e.target.value })} placeholder="Tulis kutipan di sini..." />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* KARTU 3: RANGKAIAN ACARA */}
                                            <div className="bg-white border border-gray-200 rounded-lg p-5">
                                                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                                                    <CalendarDays className="w-4 h-4 text-gray-500" />
                                                    <h3 className="font-semibold text-gray-800">Rangkaian Acara</h3>
                                                </div>
                                                <div className="space-y-6">
                                                    <div className="space-y-3">
                                                        <h4 className="font-medium text-sm text-gray-800">Akad Nikah</h4>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <input type="date" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black outline-none" value={formData.events.akad.date} onChange={(e) => updateEvent('akad', 'date', e.target.value)} />
                                                            <input type="time" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black outline-none" value={formData.events.akad.time} onChange={(e) => updateEvent('akad', 'time', e.target.value)} />
                                                        </div>
                                                        <input className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black outline-none" placeholder="Lokasi (Contoh: Masjid Raya)" value={formData.events.akad.location} onChange={(e) => updateEvent('akad', 'location', e.target.value)} />
                                                        <input className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black outline-none" placeholder="Link Google Maps" value={formData.events.akad.mapUrl} onChange={(e) => updateEvent('akad', 'mapUrl', e.target.value)} />
                                                    </div>

                                                    <div className="space-y-3 pt-3 border-t border-gray-100">
                                                        <h4 className="font-medium text-sm text-gray-800">Resepsi</h4>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <input type="date" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black outline-none" value={formData.events.resepsi.date} onChange={(e) => updateEvent('resepsi', 'date', e.target.value)} />
                                                            <input type="time" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black outline-none" value={formData.events.resepsi.time} onChange={(e) => updateEvent('resepsi', 'time', e.target.value)} />
                                                        </div>
                                                        <input className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black outline-none" placeholder="Lokasi (Contoh: Gedung Serbaguna)" value={formData.events.resepsi.location} onChange={(e) => updateEvent('resepsi', 'location', e.target.value)} />
                                                        <input className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black outline-none" placeholder="Link Google Maps" value={formData.events.resepsi.mapUrl} onChange={(e) => updateEvent('resepsi', 'mapUrl', e.target.value)} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* KARTU 4: GALERI FOTO */}
                                            <div className="bg-white border border-gray-200 rounded-lg p-5">
                                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                                                    <div className="flex items-center gap-2">
                                                        <ImageIcon className="w-4 h-4 text-gray-500" />
                                                        <h3 className="font-semibold text-gray-800">Galeri Foto</h3>
                                                    </div>
                                                    <label className="flex items-center gap-2 text-xs font-medium text-gray-600 cursor-pointer">
                                                        <input type="checkbox" className="accent-black w-3.5 h-3.5" checked={formData.sections.gallery.enabled} onChange={(e) => setFormData(prev => ({ ...prev, sections: { ...prev.sections, gallery: { ...prev.sections.gallery, enabled: e.target.checked } } }))} />
                                                        Aktifkan
                                                    </label>
                                                </div>
                                                <div className={`${!formData.sections.gallery.enabled ? 'opacity-40 pointer-events-none' : ''}`}>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {(formData.sections.gallery.photos || []).map((photo: string, i: number) => (
                                                            <div key={i} className="group relative border border-gray-200 rounded-md overflow-hidden">
                                                                <img src={photo} alt={`Gallery ${i}`} className="w-full h-24 object-cover" />
                                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                                                                    <label className="cursor-pointer text-white text-[10px] bg-gray-800 px-2 py-1 rounded">Ganti<input type="file" accept="image/*" className="hidden" onChange={(e) => handleUploadGallery(e, i)} /></label>
                                                                    <button type="button" onClick={() => removeGalleryPhoto(i)} className="text-white text-[10px] bg-red-600 px-2 py-1 rounded">Hapus</button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {(formData.sections.gallery.photos || []).length < 10 && (
                                                        <label className="mt-3 block cursor-pointer bg-white hover:bg-gray-50 border border-dashed border-gray-300 rounded-md p-2 text-center text-xs text-gray-600">
                                                            + Tambah Foto
                                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUploadGallery(e, (formData.sections.gallery.photos || []).length)} />
                                                        </label>
                                                    )}
                                                </div>
                                            </div>

                                            {/* KARTU 5: LOVE STORY */}
                                            <div className="bg-white border border-gray-200 rounded-lg p-5">
                                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                                                    <div className="flex items-center gap-2">
                                                        <Heart className="w-4 h-4 text-gray-500" />
                                                        <h3 className="font-semibold text-gray-800">Love Story</h3>
                                                    </div>
                                                    <label className="flex items-center gap-2 text-xs font-medium text-gray-600 cursor-pointer">
                                                        <input type="checkbox" className="accent-black w-3.5 h-3.5" checked={formData.love_story.enabled} onChange={(e) => setFormData({ ...formData, love_story: { ...formData.love_story, enabled: e.target.checked } })} />
                                                        Aktifkan
                                                    </label>
                                                </div>
                                                <div className={`space-y-4 ${!formData.love_story.enabled ? 'opacity-40 pointer-events-none' : ''}`}>
                                                    {formData.love_story.stories.map((story: any, i: number) => (
                                                        <div key={i} className="pl-3 border-l-2 border-gray-300 space-y-2">
                                                            <input className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black outline-none font-medium" placeholder="Tahun (Contoh: 2020)" value={story.year} onChange={(e) => updateStory(i, 'year', e.target.value)} />
                                                            <textarea className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black outline-none resize-none" rows={2} placeholder="Cerita..." value={story.text} onChange={(e) => updateStory(i, 'text', e.target.value)} />
                                                        </div>
                                                    ))}
                                                    <button type="button" onClick={addStory} className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs py-2 rounded-md transition-colors">+ Tambah Cerita</button>
                                                </div>
                                            </div>

                                            {/* KARTU 6: LAIN-LAIN */}
                                            <div className="bg-white border border-gray-200 rounded-lg p-5">
                                                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                                                    <CheckCircle className="w-4 h-4 text-gray-500" />
                                                    <h3 className="font-semibold text-gray-800">Lain-lain</h3>
                                                </div>
                                                <div className="space-y-6">
                                                    <div className="space-y-3">
                                                        <h4 className="font-medium text-sm text-gray-800">Rekening Hadiah</h4>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <input className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black outline-none" placeholder="Bank (BCA/Mandiri)" value={formData.gift.banks[0].name} onChange={(e) => updateNested('gift', 'banks', [{ ...formData.gift.banks[0], name: e.target.value }])} />
                                                            <input className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black outline-none" placeholder="No Rekening" value={formData.gift.banks[0].account} onChange={(e) => updateNested('gift', 'banks', [{ ...formData.gift.banks[0], account: e.target.value }])} />
                                                        </div>
                                                        <input className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black outline-none" placeholder="Atas Nama" value={formData.gift.banks[0].holder} onChange={(e) => updateNested('gift', 'banks', [{ ...formData.gift.banks[0], holder: e.target.value }])} />
                                                    </div>

                                                    <div className="space-y-3 pt-3 border-t border-gray-100">
                                                        <div className="flex justify-between items-center">
                                                            <h4 className="font-medium text-sm text-gray-800">Live Streaming</h4>
                                                            <label className="flex items-center gap-2 text-xs font-medium text-gray-600 cursor-pointer">
                                                                <input type="checkbox" className="accent-black w-3.5 h-3.5" checked={formData.live_stream.enabled} onChange={(e) => setFormData({ ...formData, live_stream: { ...formData.live_stream, enabled: e.target.checked } })} />
                                                                Aktifkan
                                                            </label>
                                                        </div>
                                                        <input className={`w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black outline-none ${!formData.live_stream.enabled ? 'opacity-40 pointer-events-none' : ''}`} placeholder="Link Streaming" value={formData.live_stream.url} onChange={(e) => updateNested('live_stream', 'url', e.target.value)} />
                                                    </div>

                                                    <div className="space-y-3 pt-3 border-t border-gray-100">
                                                        <h4 className="font-medium text-sm text-gray-800">Teks Penutup</h4>
                                                        <textarea className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black outline-none resize-none" rows={3} value={formData.closing_text} onChange={(e) => setFormData({ ...formData, closing_text: e.target.value })} placeholder="Merupakan suatu kehormatan..." />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>

                            {/* AREA PREVIEW (Kanan di Desktop, Bawah di HP) */}
                            <div className="flex-1 w-full flex flex-col md:bg-stone-200 md:items-center md:justify-center md:p-8">

                                {/* h-[calc(100dvh-100px)] ngasih sela/gap 100px di bagian bawah khusus mobile */}
                                <div className="w-full md:max-w-[400px] h-[calc(100dvh-100px)] md:h-[85vh] bg-stone-100 md:bg-white relative transform translate-x-0 z-0 overflow-x-hidden overflow-y-auto md:rounded-[2rem] border-0 md:border-[12px] md:border-stone-800 md:shadow-2xl shrink-0">
                                    <TemplateRenderer
                                        data={{
                                            invitation_id: user.id,
                                            template_id: formData.template_id,
                                            bride_name: formData.brideName,
                                            groom_name: formData.groomName,
                                            content_data: {
                                                coverPhoto: formData.coverPhoto,
                                                bgPhoto: formData.bgPhoto,
                                                musicUrl: formData.musicUrl,
                                                quote: formData.quote,
                                                bride_details: formData.bride_details,
                                                groom_details: formData.groom_details,
                                                events: formData.events,
                                                gift: formData.gift,
                                                love_story: formData.love_story,
                                                live_stream: formData.live_stream,
                                                closing_text: formData.closing_text,
                                                sections: formData.sections
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {!isFormOpen && (
                                <div className="fixed bottom-0 left-0 w-full h-[120px] bg-gradient-to-t from-black/90 via-black/40 to-transparent z-[60] flex items-end justify-center pb-6 md:hidden pointer-events-none">
                                    <button
                                        type="button"
                                        onClick={() => setIsFormOpen(true)}
                                        className="pointer-events-auto flex items-center gap-2 text-white px-6 py-3 text-sm font-semibold tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] hover:text-amber-300 transition-colors"
                                    >
                                        <ChevronUp className="w-5 h-5 animate-bounce" />
                                        <span>Edit Undangan</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* LAYOUT KOMENTAR */}
                    {activeMenu === 'komentar' && (
                        <div className="h-full bg-[#F8FAFC] p-4 md:p-8 overflow-y-auto">
                            <div className="max-w-3xl mx-auto">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">Ucapan & Konfirmasi Kehadiran</h2>
                                    <p className="text-sm text-gray-500">Daftar ucapan dan konfirmasi kehadiran dari tamu undangan.</p>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                                    {isLoadingComments ? (
                                        <div className="p-8 text-center text-gray-500">Memuat data...</div>
                                    ) : comments.length === 0 ? (
                                        <div className="p-12 text-center text-gray-400">
                                            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                            <p>Belum ada ucapan dari tamu.</p>
                                        </div>
                                    ) : (
                                        <ul className="divide-y divide-gray-100">
                                            {comments.map((comment) => (
                                                <li key={comment.id} className="p-5 hover:bg-gray-50 transition-colors">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-bold text-gray-800">{comment.name}</h4>
                                                        <span className={`text-[10px] px-2 py-1 rounded font-bold ${comment.attendance === 'hadir' ? 'bg-green-100 text-green-700' :
                                                            comment.attendance === 'tidak_hadir' ? 'bg-red-100 text-red-700' :
                                                                'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            {comment.attendance === 'hadir' ? '✅ Hadir' : comment.attendance === 'tidak_hadir' ? '❌ Tidak Hadir' : 'Ragu-ragu'}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-2">{comment.message}</p>
                                                    <span className="text-[10px] text-gray-400">
                                                        {new Date(comment.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* LAYOUT SEBAR UNDANGAN (Placeholder) */}
                    {activeMenu === 'sebar' && (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8 text-center">
                            <Send className="w-16 h-16 mb-4 text-slate-300" />
                            <h2 className="font-bold text-xl text-slate-700 mb-2">Sebar Undangan</h2>
                            <p className="max-w-md">Fitur untuk membuat link khusus per nama tamu dan mengirimkannya otomatis via WhatsApp.</p>
                        </div>
                    )}

                </main>
            </div>
        </div>
    )
}