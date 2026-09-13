'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import TemplateRenderer from '@/components/templates/TemplateRenderer'
import imageCompression from 'browser-image-compression'
import { Toaster, toast } from 'react-hot-toast'
import ImageCropper from '@/components/dashboard/ImageCropper'
import { Image as ImageIcon, Music, Heart, CalendarDays, Gift, Video, Type, CheckCircle, UploadCloud, X, ChevronUp, Save, Menu, MessageSquare, Send, Copy, ExternalLink, } from 'lucide-react'
import CommentsTab from '@/components/dashboard/CommentsTab'
import ShareTab from '@/components/dashboard/ShareTab'
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
    { label: 'Laksana Surgaku', value: `${process.env.NEXT_PUBLIC_R2_URL}/master-music/laksana-surgaku.mp3` }, // Nanti ganti dengan URL lagu lu di R2

]


export default function DashboardClient({ user, initialData }: { user: any, initialData?: any }) {
    const [formData, setFormData] = useState({

        template_id: initialData?.template_id || '',

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
        love_story: initialData?.content_data?.love_story || { enabled: true, stories: [{ year: '', text: '' }] },
        live_stream: initialData?.content_data?.live_stream || { enabled: false, url: '' },
        closing_text: initialData?.content_data?.closing_text || '',
        closingPhoto: initialData?.content_data?.closingPhoto || '',
        sections: initialData?.content_data?.sections || { gallery: { enabled: true, photos: [] } }


    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                template_id: initialData.template_id || 'rustic-01',
                brideName: initialData.bride_name || '',
                groomName: initialData.groom_name || '',
                coverPhoto: initialData.content_data?.coverPhoto || '',
                bgPhoto: initialData.content_data?.bgPhoto || '',
                musicUrl: initialData.content_data?.musicUrl || '',
                quote: initialData.content_data?.quote || '',
                bride_details: initialData.content_data?.bride_details || { fullName: '', order: '', parents: '', ig: '' },
                groom_details: initialData.content_data?.groom_details || { fullName: '', order: '', parents: '', ig: '' },
                events: initialData.content_data?.events || {
                    akad: { date: '', time: '', location: '', mapUrl: '' },
                    resepsi: { date: '', time: '', location: '', mapUrl: '' }
                },
                gift: initialData.content_data?.gift || { enabled: true, banks: [{ name: '', account: '', holder: '' }] },
                love_story: initialData.content_data?.love_story || { enabled: true, stories: [{ year: '2020', text: 'Pertama kali bertemu' }] },
                live_stream: initialData.content_data?.live_stream || { enabled: false, url: '' },
                closing_text: initialData.content_data?.closing_text || '',
                closingPhoto: initialData.content_data?.closingPhoto || '',
                sections: initialData.content_data?.sections || { gallery: { enabled: true, photos: [] } }
            })
        }
    }, [initialData])

    const [cropConfig, setCropConfig] = useState<{ src: string, field: string, aspect: number, index?: number } | null>(null)
    const activeConfig = TEMPLATE_CONFIG[formData.template_id] || TEMPLATE_CONFIG['rustic-01']
    const [saveStatus, setSaveStatus] = useState('Tersimpan')
    const [invitationSlug, setInvitationSlug] = useState('')
    const [invitationStatus, setInvitationStatus] = useState('DRAFT')
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
    const [isUploadingMusic, setIsUploadingMusic] = useState(false)
    const [isFormOpen, setIsFormOpen] = useState(false)

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [activeMenu, setActiveMenu] = useState('editor')
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
                    closingPhoto: formData.closingPhoto,
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

    // 1. Fungsi untuk mencegat gambar dan membuka modal crop
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const file = e.target.files?.[0]
        if (!file) return

        let aspect = 3 / 4 // Default potret (Galeri, Cover)
        if (field === 'bgPhoto') aspect = 9 / 16 // Fullscreen background
        if (field === 'closingPhoto') aspect = 1 / 1 // Bulat / Persegi

        const reader = new FileReader()
        reader.onload = () => {
            setCropConfig({ src: reader.result as string, field, aspect })
        }
        reader.readAsDataURL(file)
        e.target.value = '' // Reset agar bisa pilih file yang sama berulang kali
    }
    const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = () => {
            // Rasio galeri diset 3:4 (sesuaikan kalau mau 1:1)
            setCropConfig({ src: reader.result as string, field: 'gallery', aspect: 3 / 4, index })
        }
        reader.readAsDataURL(file)
        e.target.value = ''
    }
    // 2. Fungsi untuk memproses hasil crop dan mengunggahnya
    const handleCropSave = async (croppedBlob: Blob) => {
        if (!cropConfig) return

        const field = cropConfig.field
        setCropConfig(null) // Tutup modal langsung

        const toastId = toast.loading('Mengupload gambar...')

        try {
            const isGallery = field === 'gallery'
            const fileSuffix = isGallery ? `gallery-${user.id}-${cropConfig.index}` : `${field}-${user.id}`
            const file = new File([croppedBlob], `${fileSuffix}.jpg`, { type: 'image/jpeg' })

            const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1280, useWebWorker: true, fileType: 'image/webp' }
            const compressedFile = await imageCompression(file, options)

            const uploadData = new FormData()
            uploadData.append('file', compressedFile, `${fileSuffix}.webp`)
            if (isGallery) uploadData.append('folder', 'gallery') // Tambahkan folder khusus galeri

            const response = await fetch('/api/upload', { method: 'POST', body: uploadData })
            const data = await response.json()

            if (data.url) {
                const urlWithCacheBuster = `${data.url}?t=${Date.now()}`

                if (isGallery && cropConfig.index !== undefined) {
                    setFormData(prev => {
                        const currentPhotos = prev.sections.gallery.photos || []
                        const newPhotos = [...currentPhotos]
                        newPhotos[cropConfig.index as number] = urlWithCacheBuster
                        return { ...prev, sections: { ...prev.sections, gallery: { ...prev.sections.gallery, photos: newPhotos } } }
                    })
                } else {
                    setFormData(prev => ({ ...prev, [field]: urlWithCacheBuster }))
                }

                toast.success('Upload berhasil!', { id: toastId })
            }
        } catch (error) {
            console.error(error)
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


    const removeGalleryPhoto = (index: number) => {
        setFormData(prev => {
            const currentPhotos = prev.sections.gallery.photos || []
            const newPhotos = currentPhotos.filter((_: string, i: number) => i !== index)
            return { ...prev, sections: { ...prev.sections, gallery: { ...prev.sections.gallery, photos: newPhotos } } }
        })
    }

    const copyLink = () => {
        const fullUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://temuhatiinvite.com'}/${invitationSlug}`;
        navigator.clipboard.writeText(fullUrl);
        alert('Link berhasil disalin!');
    };

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
    const handleReplySubmit = async (commentId: string, replyText: string) => {
        try {
            // 1. Update kolom admin_reply di Supabase
            const { error } = await supabase
                .from('comments')
                .update({ admin_reply: replyText })
                .eq('id', commentId)

            if (error) throw error

            // 2. Update state lokal agar UI langsung berubah tanpa refresh
            setComments(prevComments =>
                prevComments.map(comment =>
                    comment.id === commentId
                        ? { ...comment, admin_reply: replyText }
                        : comment
                )
            )

            toast.success('Balasan berhasil dikirim!')
        } catch (error) {
            console.error('Error replying to comment:', error)
            toast.error('Gagal mengirim balasan')
        }
    }

    // Panggil otomatis saat menu komentar dibuka
    useEffect(() => {
        if (activeMenu === 'komentar') fetchComments()
    }, [activeMenu])

    return (
        <div className="flex h-[100dvh] bg-[#FBFBF9] overflow-hidden font-sans text-brand w-full relative">
            <Toaster
                position="top-center"
                containerStyle={{ zIndex: 99999 }}
                toastOptions={{
                    className: 'text-sm font-bold rounded-2xl bg-white text-brand shadow-[0_8px_30px_rgb(0,0,0,0.08)]'
                }}
            />

            {/* ================= SIDEBAR ================= */}
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
            />

            {/* ================= MAIN CONTENT ================= */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#FBFBF9]">

                {/* Topbar Mobile & Indikator Status */}
                <header className="h-16 bg-[#FBFBF9] flex items-center px-4 md:px-8 justify-between z-30 shrink-0 sticky top-0">
                    <div className="flex items-center gap-3">
                        <button className="md:hidden p-2 text-brand hover:bg-brand/10 rounded-xl transition-colors" onClick={() => setIsSidebarOpen(true)}>
                            <Menu className="w-5 h-5" />
                        </button>

                    </div>

                    {/* Status Menyimpan */}
                    <div className="flex items-center">
                        <span className={`text-[11px] md:text-xs px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold transition-colors duration-300 ${saveStatus === 'Menyimpan...' ? 'bg-amber-100 text-amber-700' : 'bg-brand/10 text-brand'}`}>
                            {saveStatus}
                        </span>
                    </div>
                </header>

                {/* Konten Dinamis */}
                <main className="flex-1 overflow-hidden relative">

                    {/* LAYOUT EDITOR UNDANGAN */}
                    {activeMenu === 'editor' && (
                        <div className="flex h-full relative w-full text-brand">

                            {isFormOpen && (
                                <div
                                    className="fixed inset-0 bg-brand/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
                                    onClick={() => setIsFormOpen(false)}
                                />
                            )}

                            {/* 2. Container Form (di atas backdrop) */}
                            <div className={`
                                fixed inset-x-0 bottom-0 z-50 w-full h-[85vh] bg-white shadow-[0_-8px_40px_rgba(58,75,64,0.12)] rounded-t-[2rem] transition-transform duration-300 ease-in-out transform flex flex-col
                                md:relative md:inset-auto md:h-full md:w-[450px] md:translate-y-0 md:rounded-none md:border-r md:border-brand/10 md:shadow-none md:bg-white/50
                                ${isFormOpen ? 'translate-y-0' : 'translate-y-full'}
                            `}>
                                {/* Header Bottom Sheet (Hanya Mobile) */}
                                <div className="md:hidden flex justify-end items-center px-5 py-3 sticky top-0 bg-white/90 backdrop-blur-md rounded-t-[2rem] z-10 shrink-0">
                                    <button onClick={() => setIsFormOpen(false)} className="text-brand/70 bg-brand/5 hover:bg-brand/10 px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors">
                                        Tutup
                                    </button>
                                </div>

                                {/* Wrapper Scroll Form */}
                                <div className="p-6 h-full overflow-y-auto pb-24 md:pb-8 flex flex-col justify-between custom-scrollbar">
                                    <div>


                                        {/* ===================== STATUS BANNER ===================== */}
                                        <div className="mb-8">
                                            {invitationStatus === 'DRAFT' ? (
                                                <div className="bg-brand-light border border-brand/10 rounded-3xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm">
                                                    <div>
                                                        <h3 className="font-bold text-brand text-sm flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                                            Status: Draft
                                                        </h3>
                                                        <p className="text-xs text-brand/60 mt-1">Selesaikan pembayaran untuk mengaktifkan link.</p>
                                                    </div>
                                                    <button onClick={handlePublish} className="w-full sm:w-auto bg-brand text-brand-light px-5 py-2.5 rounded-full text-xs font-bold hover:bg-brand/90 transition-colors shadow-md shadow-brand/20">
                                                        Bayar & Aktifkan
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="bg-[#F0F5F2] border border-[#D1E0D7] rounded-3xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm">
                                                    <div className="overflow-hidden">
                                                        <div className="flex items-center gap-2 mb-1.5">
                                                            <span className="w-2 h-2 bg-[#3A4B40] rounded-full animate-pulse"></span>
                                                            <h3 className="font-bold text-[#3A4B40] text-sm">Undangan Aktif</h3>
                                                        </div>
                                                        <p className="text-xs text-[#3A4B40]/70 truncate">
                                                            {process.env.NEXT_PUBLIC_APP_URL || 'https://temuhatiinvite.com'}/{invitationSlug}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2 w-full sm:w-auto">
                                                        <button onClick={copyLink} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-[#D1E0D7] text-[#3A4B40] px-4 py-2.5 rounded-full text-xs font-bold hover:bg-[#F8FAF9] transition-colors">
                                                            <Copy className="w-3.5 h-3.5" /> Salin
                                                        </button>
                                                        <a href={`/${invitationSlug}`} target="_blank" className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#3A4B40] text-white px-4 py-2.5 rounded-full text-xs font-bold hover:bg-[#2C3931] transition-colors shadow-md shadow-[#3A4B40]/20">
                                                            <ExternalLink className="w-3.5 h-3.5" /> Buka
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {/* ===================== ISI FORM ===================== */}
                                        <div className="flex flex-col gap-6">

                                            {/* PILIH TEMA */}
                                            <div className="bg-[#F0F5F2] border border-[#D1E0D7] shadow-sm rounded-3xl p-6">
                                                <h3 className="font-bold text-brand mb-3 text-sm">Pilih Desain Tema</h3>
                                                <select
                                                    className="w-full bg-white border border-[#D1E0D7] rounded-2xl px-4 py-3 text-sm focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand transition-all duration-300 cursor-pointer font-medium hover:border-[#B5CDBF]"
                                                    value={formData.template_id}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, template_id: e.target.value }))}
                                                >
                                                    {Object.entries(TEMPLATE_CONFIG).map(([id, config]) => (
                                                        <option key={id} value={id}>{config.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* KARTU 1: DATA MEMPELAI */}
                                            <div className="bg-[#F0F5F2] border border-[#D1E0D7] shadow-sm rounded-3xl p-6">
                                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#D1E0D7]">
                                                    <div className="bg-white border border-[#D1E0D7] p-2.5 rounded-2xl">
                                                        <Heart className="w-4 h-4 text-brand" />
                                                    </div>
                                                    <h3 className="font-bold text-brand text-base">Data Mempelai</h3>
                                                </div>

                                                <div className="space-y-6">
                                                    {/* Panggilan Utama */}
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-[11px] font-bold text-brand/60 mb-2 uppercase tracking-wider">Panggilan Wanita</label>
                                                            <input type="text" value={formData.brideName} onChange={(e) => setFormData({ ...formData, brideName: e.target.value })} className="w-full bg-white border border-[#D1E0D7] rounded-2xl px-4 py-3 text-sm focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 font-medium hover:border-[#B5CDBF]" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[11px] font-bold text-brand/60 mb-2 uppercase tracking-wider">Panggilan Pria</label>
                                                            <input type="text" value={formData.groomName} onChange={(e) => setFormData({ ...formData, groomName: e.target.value })} className="w-full bg-white border border-[#D1E0D7] rounded-2xl px-4 py-3 text-sm focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 font-medium hover:border-[#B5CDBF]" />
                                                        </div>
                                                    </div>

                                                    {/* Detail Wanita */}
                                                    <div className="space-y-4 p-5 bg-white border border-[#D1E0D7] rounded-3xl shadow-sm">
                                                        <h4 className="font-bold text-sm text-brand mb-1">Detail Wanita</h4>
                                                        <input className="w-full bg-[#FBFBF9] border border-[#D1E0D7] rounded-2xl px-4 py-3 text-sm focus:bg-white focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 font-medium hover:border-[#B5CDBF]" placeholder="Nama Lengkap" value={formData.bride_details.fullName} onChange={(e) => updateNested('bride_details', 'fullName', e.target.value)} />

                                                        <div className="grid grid-cols-2 gap-3">
                                                            <input className="w-full bg-[#FBFBF9] border border-[#D1E0D7] rounded-2xl px-4 py-3 text-sm focus:bg-white focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 font-medium hover:border-[#B5CDBF]" placeholder="Anak Ke-" value={formData.bride_details.order} onChange={(e) => updateNested('bride_details', 'order', e.target.value)} />
                                                            <input className="w-full bg-[#FBFBF9] border border-[#D1E0D7] rounded-2xl px-4 py-3 text-sm focus:bg-white focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 font-medium hover:border-[#B5CDBF]" placeholder="Username IG" value={formData.bride_details.ig} onChange={(e) => updateNested('bride_details', 'ig', e.target.value)} />
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3">
                                                            <input className="w-full bg-[#FBFBF9] border border-[#D1E0D7] rounded-2xl px-4 py-3 text-sm focus:bg-white focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 font-medium hover:border-[#B5CDBF]" placeholder="Nama Bapak " value={formData.bride_details?.fatherName || ''} onChange={(e) => updateNested('bride_details', 'fatherName', e.target.value)} />
                                                            <input className="w-full bg-[#FBFBF9] border border-[#D1E0D7] rounded-2xl px-4 py-3 text-sm focus:bg-white focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 font-medium hover:border-[#B5CDBF]" placeholder="Nama Ibu" value={formData.bride_details?.motherName || ''} onChange={(e) => updateNested('bride_details', 'motherName', e.target.value)} />
                                                        </div>
                                                    </div>

                                                    {/* Detail Pria */}
                                                    <div className="space-y-4 p-5 bg-white border border-[#D1E0D7] rounded-3xl shadow-sm">
                                                        <h4 className="font-bold text-sm text-brand mb-1">Detail Pria</h4>
                                                        <input className="w-full bg-[#FBFBF9] border border-[#D1E0D7] rounded-2xl px-4 py-3 text-sm focus:bg-white focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 font-medium hover:border-[#B5CDBF]" placeholder="Nama Lengkap" value={formData.groom_details.fullName} onChange={(e) => updateNested('groom_details', 'fullName', e.target.value)} />

                                                        <div className="grid grid-cols-2 gap-3">
                                                            <input className="w-full bg-[#FBFBF9] border border-[#D1E0D7] rounded-2xl px-4 py-3 text-sm focus:bg-white focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 font-medium hover:border-[#B5CDBF]" placeholder="Anak Ke-" value={formData.groom_details.order} onChange={(e) => updateNested('groom_details', 'order', e.target.value)} />
                                                            <input className="w-full bg-[#FBFBF9] border border-[#D1E0D7] rounded-2xl px-4 py-3 text-sm focus:bg-white focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 font-medium hover:border-[#B5CDBF]" placeholder="Username IG" value={formData.groom_details.ig} onChange={(e) => updateNested('groom_details', 'ig', e.target.value)} />
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3">
                                                            <input className="w-full bg-[#FBFBF9] border border-[#D1E0D7] rounded-2xl px-4 py-3 text-sm focus:bg-white focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 font-medium hover:border-[#B5CDBF]" placeholder="Nama Bapak " value={formData.groom_details?.fatherName || ''} onChange={(e) => updateNested('groom_details', 'fatherName', e.target.value)} />
                                                            <input className="w-full bg-[#FBFBF9] border border-[#D1E0D7] rounded-2xl px-4 py-3 text-sm focus:bg-white focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 font-medium hover:border-[#B5CDBF]" placeholder="Nama Ibu " value={formData.groom_details?.motherName || ''} onChange={(e) => updateNested('groom_details', 'motherName', e.target.value)} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* KARTU 2: MEDIA UTAMA */}
                                            <div className="bg-[#F0F5F2] border border-[#D1E0D7] shadow-sm rounded-3xl p-6">
                                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#D1E0D7]">
                                                    <div className="bg-white border border-[#D1E0D7] p-2.5 rounded-2xl">
                                                        <ImageIcon className="w-4 h-4 text-brand" />
                                                    </div>
                                                    <h3 className="font-bold text-brand text-base">Media Utama</h3>
                                                </div>

                                                <div className="space-y-6">

                                                    {/* Tampil hanya jika template butuh Cover */}
                                                    {activeConfig.hasCover && (
                                                        <div>
                                                            <label className="block text-[11px] font-bold text-brand/60 mb-2 uppercase tracking-wider">Foto Cover Utama</label>
                                                            {!formData.coverPhoto ? (
                                                                <label className="flex flex-col items-center justify-center w-full h-24 bg-white border-2 border-dashed border-[#D1E0D7] hover:border-[#8BA896] hover:bg-[#FBFBF9] rounded-2xl cursor-pointer transition-all duration-300 group">
                                                                    <span className="text-xs font-bold text-brand/60 group-hover:text-brand transition-colors">+ Pilih Foto Cover</span>
                                                                    <span className="text-[10px] text-brand/40 mt-1">Format: JPG, PNG</span>
                                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageSelect(e, 'coverPhoto')} />
                                                                </label>
                                                            ) : (
                                                                <div className="flex items-center justify-between bg-white border border-[#D1E0D7] p-3 rounded-2xl shadow-sm">
                                                                    <div className="flex items-center gap-3">
                                                                        <img src={formData.coverPhoto} alt="Cover" className="h-12 w-12 rounded-xl object-cover border border-[#D1E0D7]" />
                                                                        <span className="text-xs font-bold text-brand">Foto Cover Terpilih</span>
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setFormData(prev => ({ ...prev, coverPhoto: '' }))}
                                                                        className="text-[11px] font-bold text-[#D96565] bg-[#FFF0F0] hover:bg-[#FFE0E0] px-4 py-2 rounded-xl transition-all duration-300 border border-[#FFE0E0]"
                                                                    >
                                                                        Hapus
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Tampil hanya jika template butuh Background Foto */}
                                                    {activeConfig.hasBg && (
                                                        <div>
                                                            <label className="block text-[11px] font-bold text-brand/60 mb-2 uppercase tracking-wider">Foto Background Utama</label>
                                                            {!formData.bgPhoto ? (
                                                                <label className="flex flex-col items-center justify-center w-full h-24 bg-white border-2 border-dashed border-[#D1E0D7] hover:border-[#8BA896] hover:bg-[#FBFBF9] rounded-2xl cursor-pointer transition-all duration-300 group">
                                                                    <span className="text-xs font-bold text-brand/60 group-hover:text-brand transition-colors">+ Pilih Background</span>
                                                                    <span className="text-[10px] text-brand/40 mt-1">Format: JPG, PNG</span>
                                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageSelect(e, 'bgPhoto')} />
                                                                </label>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setFormData(prev => ({ ...prev, bgPhoto: '' }))}
                                                                    className="text-[11px] font-bold text-[#D96565] bg-[#FFF0F0] hover:bg-[#FFE0E0] px-4 py-2 rounded-xl transition-all duration-300 border border-[#FFE0E0]"
                                                                >
                                                                    Hapus
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Musik Latar */}
                                                    <div>
                                                        <label className="block text-[11px] font-bold text-brand/60 mb-2 uppercase tracking-wider">Musik Latar (Backsound)</label>
                                                        <select
                                                            className="w-full bg-white border border-[#D1E0D7] rounded-2xl px-4 py-3 text-sm focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand transition-all duration-300 cursor-pointer font-medium hover:border-[#B5CDBF] mb-3"
                                                            onChange={(e) => setFormData(prev => ({ ...prev, musicUrl: e.target.value }))}
                                                            value={PRESET_MUSIC.find(p => p.value === formData.musicUrl) ? formData.musicUrl : 'custom'}
                                                        >
                                                            {PRESET_MUSIC.map((music, i) => <option key={i} value={music.value}>{music.label}</option>)}
                                                        </select>

                                                        {(!PRESET_MUSIC.find(p => p.value === formData.musicUrl) || formData.musicUrl === 'custom') && formData.musicUrl !== '' && (
                                                            <label className="flex flex-col items-center justify-center w-full h-20 bg-white border-2 border-dashed border-[#D1E0D7] hover:border-[#8BA896] hover:bg-[#FBFBF9] rounded-2xl cursor-pointer transition-all duration-300 group">
                                                                <span className="text-xs font-bold text-brand/60 group-hover:text-brand transition-colors">+ Upload MP3 / Audio</span>
                                                                <span className="text-[10px] text-brand/40 mt-1">Maksimal 10MB</span>
                                                                <input type="file" accept="audio/mp3,audio/mpeg" className="hidden" onChange={handleUploadMusic} />
                                                            </label>
                                                        )}

                                                        {formData.musicUrl && formData.musicUrl !== 'custom' && (
                                                            <div className="mt-2 bg-white p-2 rounded-2xl border border-[#D1E0D7] shadow-sm">
                                                                <audio controls src={formData.musicUrl} className="w-full h-10 outline-none" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Kutipan Pernikahan */}
                                                    <div>
                                                        <label className="block text-[11px] font-bold text-brand/60 mb-2 uppercase tracking-wider">Kutipan / Ayat Suci</label>
                                                        <textarea
                                                            className="w-full bg-white border border-[#D1E0D7] rounded-2xl px-4 py-3 text-sm focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/30 transition-all duration-300 resize-none font-medium hover:border-[#B5CDBF] leading-relaxed"
                                                            rows={4}
                                                            value={formData.quote}
                                                            onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                                                            placeholder="Contoh: Dan di antara tanda-tanda kekuasaan-Nya..."
                                                        />
                                                    </div>

                                                </div>
                                            </div>

                                            {/* KARTU 3: RANGKAIAN ACARA */}
                                            <div className="bg-[#F0F5F2] border border-[#D1E0D7] shadow-sm rounded-3xl p-6">
                                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#D1E0D7]">
                                                    <div className="bg-white border border-[#D1E0D7] p-2.5 rounded-2xl">
                                                        <CalendarDays className="w-4 h-4 text-brand" />
                                                    </div>
                                                    <h3 className="font-bold text-brand text-base">Rangkaian Acara</h3>
                                                </div>
                                                <div className="space-y-6">

                                                    {/* AKAD */}
                                                    <div className="space-y-4 p-5 bg-white border border-[#D1E0D7] rounded-3xl shadow-sm">
                                                        <h4 className="font-bold text-sm text-brand mb-1">Akad Nikah</h4>

                                                        {/* Grid diubah: Hari full width, Tanggal & Jam berdampingan */}
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <input type="text" className="col-span-2 w-full bg-[#FBFBF9] border border-[#D1E0D7] rounded-2xl px-4 py-3 text-sm focus:bg-white focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 font-medium hover:border-[#B5CDBF]" placeholder="Hari (Contoh: Jumat)" value={formData.events?.akad?.day || ''} onChange={(e) => updateEvent('akad', 'day', e.target.value)} />
                                                            <input type="date" className="w-full bg-[#FBFBF9] border border-[#D1E0D7] rounded-2xl px-3 py-3 text-sm focus:bg-white focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 font-medium hover:border-[#B5CDBF]" value={formData.events?.akad?.date || ''} onChange={(e) => updateEvent('akad', 'date', e.target.value)} />
                                                            <input type="time" className="w-full bg-[#FBFBF9] border border-[#D1E0D7] rounded-2xl px-3 py-3 text-sm focus:bg-white focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 font-medium hover:border-[#B5CDBF]" value={formData.events?.akad?.time || ''} onChange={(e) => updateEvent('akad', 'time', e.target.value)} />
                                                        </div>

                                                        <input className="w-full bg-[#FBFBF9] border border-[#D1E0D7] rounded-2xl px-4 py-3 text-sm focus:bg-white focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 font-medium hover:border-[#B5CDBF]" placeholder="Lokasi (Contoh: Masjid Raya)" value={formData.events?.akad?.location || ''} onChange={(e) => updateEvent('akad', 'location', e.target.value)} />
                                                        <input className="w-full bg-[#FBFBF9] border border-[#D1E0D7] rounded-2xl px-4 py-3 text-sm focus:bg-white focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 font-medium hover:border-[#B5CDBF]" placeholder="Link Google Maps" value={formData.events?.akad?.mapUrl || ''} onChange={(e) => updateEvent('akad', 'mapUrl', e.target.value)} />
                                                    </div>

                                                    {/* RESEPSI */}
                                                    <div className="space-y-4 p-5 bg-white border border-[#D1E0D7] rounded-3xl shadow-sm">
                                                        <h4 className="font-bold text-sm text-brand mb-1">Resepsi</h4>

                                                        {/* Grid diubah: Hari full width, Tanggal & Jam berdampingan */}
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <input type="text" className="col-span-2 w-full bg-[#FBFBF9] border border-[#D1E0D7] rounded-2xl px-4 py-3 text-sm focus:bg-white focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 font-medium hover:border-[#B5CDBF]" placeholder="Hari (Contoh: Sabtu)" value={formData.events?.resepsi?.day || ''} onChange={(e) => updateEvent('resepsi', 'day', e.target.value)} />
                                                            <input type="date" className="w-full bg-[#FBFBF9] border border-[#D1E0D7] rounded-2xl px-3 py-3 text-sm focus:bg-white focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 font-medium hover:border-[#B5CDBF]" value={formData.events?.resepsi?.date || ''} onChange={(e) => updateEvent('resepsi', 'date', e.target.value)} />
                                                            <input type="time" className="w-full bg-[#FBFBF9] border border-[#D1E0D7] rounded-2xl px-3 py-3 text-sm focus:bg-white focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 font-medium hover:border-[#B5CDBF]" value={formData.events?.resepsi?.time || ''} onChange={(e) => updateEvent('resepsi', 'time', e.target.value)} />
                                                        </div>

                                                        <input className="w-full bg-[#FBFBF9] border border-[#D1E0D7] rounded-2xl px-4 py-3 text-sm focus:bg-white focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 font-medium hover:border-[#B5CDBF]" placeholder="Lokasi (Contoh: Gedung Serbaguna)" value={formData.events?.resepsi?.location || ''} onChange={(e) => updateEvent('resepsi', 'location', e.target.value)} />
                                                        <input className="w-full bg-[#FBFBF9] border border-[#D1E0D7] rounded-2xl px-4 py-3 text-sm focus:bg-white focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 font-medium hover:border-[#B5CDBF]" placeholder="Link Google Maps" value={formData.events?.resepsi?.mapUrl || ''} onChange={(e) => updateEvent('resepsi', 'mapUrl', e.target.value)} />
                                                    </div>

                                                </div>
                                            </div>

                                            {/* KARTU 4: GALERI FOTO */}
                                            <div className="bg-[#F0F5F2] border border-[#D1E0D7] shadow-sm rounded-3xl p-6">
                                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#D1E0D7]">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-white border border-[#D1E0D7] p-2.5 rounded-2xl">
                                                            <ImageIcon className="w-4 h-4 text-brand" />
                                                        </div>
                                                        <h3 className="font-bold text-brand text-base">Galeri Foto</h3>
                                                    </div>
                                                    <label className="flex items-center gap-2 text-[11px] font-bold text-brand cursor-pointer uppercase tracking-wider">
                                                        <input type="checkbox" className="accent-brand w-4 h-4 rounded cursor-pointer" checked={formData.sections.gallery.enabled} onChange={(e) => setFormData(prev => ({ ...prev, sections: { ...prev.sections, gallery: { ...prev.sections.gallery, enabled: e.target.checked } } }))} />
                                                        Aktifkan
                                                    </label>
                                                </div>
                                                <div className={`transition-all duration-300 ${!formData.sections.gallery.enabled ? 'opacity-40 pointer-events-none grayscale-[30%]' : ''}`}>

                                                    {/* Grid Galeri */}
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {(formData.sections.gallery.photos || []).map((photo: string, i: number) => (
                                                            <div key={i} className="relative bg-white border border-[#D1E0D7] rounded-2xl overflow-hidden group shadow-sm h-32">
                                                                <img src={photo} alt={`Gallery ${i}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

                                                                {/* Tombol Hapus (Hover) */}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeGalleryPhoto(i)}
                                                                    className="absolute top-2 right-2 bg-red-50 text-red-600 hover:bg-red-100 p-1.5 rounded-xl shadow-sm transition-colors z-10 border border-red-100 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                                                >
                                                                    <X className="w-3.5 h-3.5" />
                                                                </button>

                                                                {/* Tombol Ganti */}
                                                                <label className="absolute bottom-2 left-2 right-2 cursor-pointer text-brand text-[11px] bg-white/90 backdrop-blur-md py-1.5 rounded-xl text-center font-bold hover:bg-white transition-colors border border-white/50 shadow-sm z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                                                                    Ganti
                                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleGallerySelect(e, i)} />
                                                                </label>
                                                            </div>
                                                        ))}

                                                        {/* Tombol Tambah Foto */}
                                                        {(formData.sections.gallery.photos || []).length < 10 && (
                                                            <label className="flex flex-col items-center justify-center w-full h-32 bg-white border-2 border-dashed border-[#D1E0D7] hover:border-[#8BA896] hover:bg-[#FBFBF9] rounded-2xl cursor-pointer transition-all duration-300 group shadow-sm">
                                                                <span className="text-xs font-bold text-brand/60 group-hover:text-brand transition-colors">+ Tambah Foto</span>
                                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleGallerySelect(e, (formData.sections.gallery.photos || []).length)} />
                                                            </label>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* KARTU 5: LOVE STORY */}
                                            <div className="bg-[#F0F5F2] border border-[#D1E0D7] shadow-sm rounded-3xl p-6">
                                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#D1E0D7]">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-white border border-[#D1E0D7] p-2.5 rounded-2xl">
                                                            <Heart className="w-4 h-4 text-brand" />
                                                        </div>
                                                        <h3 className="font-bold text-brand text-base">Love Story</h3>
                                                    </div>
                                                    <label className="flex items-center gap-2 text-[11px] font-bold text-brand cursor-pointer uppercase tracking-wider">
                                                        <input type="checkbox" className="accent-brand w-4 h-4 rounded cursor-pointer" checked={formData.love_story.enabled} onChange={(e) => setFormData({ ...formData, love_story: { ...formData.love_story, enabled: e.target.checked } })} />
                                                        Aktifkan
                                                    </label>
                                                </div>

                                                <div className={`transition-all duration-300 ${!formData.love_story.enabled ? 'opacity-40 pointer-events-none grayscale-[30%]' : ''}`}>
                                                    <div className="space-y-4 mb-6">
                                                        {formData.love_story.stories.map((story: any, i: number) => (
                                                            <div key={i} className="p-5 bg-white border border-[#D1E0D7] rounded-3xl shadow-sm space-y-3 relative group">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <h4 className="font-bold text-sm text-brand">Bagian Cerita {i + 1}</h4>

                                                                    {/* Tombol Hapus: Hanya muncul jika form lebih dari 1 */}
                                                                    {formData.love_story.stories.length > 1 && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                const newStories = formData.love_story.stories.filter((_: any, idx: number) => idx !== i);
                                                                                setFormData((prev: any) => ({ ...prev, love_story: { ...prev.love_story, stories: newStories } }));
                                                                            }}
                                                                            className="text-[10px] font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-colors border border-red-100"
                                                                        >
                                                                            Hapus
                                                                        </button>
                                                                    )}
                                                                </div>

                                                                <input
                                                                    className="w-full bg-[#FBFBF9] border border-[#D1E0D7] rounded-2xl px-4 py-3 text-sm focus:bg-white focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 font-bold hover:border-[#B5CDBF]"
                                                                    placeholder="Tahun (Contoh: 2020 - Awal Bertemu)"
                                                                    value={story.year}
                                                                    onChange={(e) => updateStory(i, 'year', e.target.value)}
                                                                />
                                                                <textarea
                                                                    className="w-full bg-[#FBFBF9] border border-[#D1E0D7] rounded-2xl px-4 py-3 text-sm focus:bg-white focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 resize-none font-medium hover:border-[#B5CDBF] leading-relaxed"
                                                                    rows={3}
                                                                    placeholder="Ceritakan momen spesial kalian di sini..."
                                                                    value={story.text}
                                                                    onChange={(e) => updateStory(i, 'text', e.target.value)}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={addStory}
                                                        className="w-full bg-white border-2 border-dashed border-[#D1E0D7] hover:border-[#8BA896] hover:bg-[#FBFBF9] text-brand/70 hover:text-brand text-xs font-bold py-3.5 rounded-2xl transition-all duration-300 shadow-sm"
                                                    >
                                                        + Tambah Cerita
                                                    </button>
                                                </div>
                                            </div>
                                            {/* KARTU 6: HADIAH / REKENING */}
                                            <div className="bg-[#F0F5F2] border border-[#D1E0D7] shadow-sm rounded-3xl p-6">
                                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#D1E0D7]">
                                                    <div className="bg-white border border-[#D1E0D7] p-2.5 rounded-2xl">
                                                        <CheckCircle className="w-4 h-4 text-brand" />
                                                    </div>
                                                    <h3 className="font-bold text-brand text-base">Hadiah (Amplop Digital)</h3>
                                                </div>

                                                <div className="space-y-6">
                                                    {/* REKENING 1 */}
                                                    <div className="space-y-4 p-5 bg-white border border-[#D1E0D7] rounded-3xl shadow-sm">
                                                        <h4 className="font-bold text-sm text-brand mb-1">Rekening 1</h4>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <input className="w-full bg-[#FBFBF9] border border-[#D1E0D7] rounded-2xl px-4 py-3 text-sm focus:bg-white focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 font-bold hover:border-[#B5CDBF]" placeholder="Bank (Cth: BCA)" value={formData.gift?.banks?.[0]?.name || ''} onChange={(e) => updateNested('gift', 'banks', [{ ...(formData.gift?.banks?.[0] || {}), name: e.target.value }, formData.gift?.banks?.[1] || {}])} />
                                                            <input className="w-full bg-[#FBFBF9] border border-[#D1E0D7] rounded-2xl px-4 py-3 text-sm focus:bg-white focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 font-bold hover:border-[#B5CDBF]" placeholder="No Rekening" value={formData.gift?.banks?.[0]?.account || ''} onChange={(e) => updateNested('gift', 'banks', [{ ...(formData.gift?.banks?.[0] || {}), account: e.target.value }, formData.gift?.banks?.[1] || {}])} />
                                                        </div>
                                                        <input className="w-full bg-[#FBFBF9] border border-[#D1E0D7] rounded-2xl px-4 py-3 text-sm focus:bg-white focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 font-bold hover:border-[#B5CDBF]" placeholder="Atas Nama" value={formData.gift?.banks?.[0]?.holder || ''} onChange={(e) => updateNested('gift', 'banks', [{ ...(formData.gift?.banks?.[0] || {}), holder: e.target.value }, formData.gift?.banks?.[1] || {}])} />
                                                    </div>

                                                    {/* REKENING 2 */}
                                                    <div className="space-y-4 p-5 bg-white border border-[#D1E0D7] rounded-3xl shadow-sm">
                                                        <h4 className="font-bold text-sm text-brand mb-1">Rekening 2</h4>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <input className="w-full bg-[#FBFBF9] border border-[#D1E0D7] rounded-2xl px-4 py-3 text-sm focus:bg-white focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 font-bold hover:border-[#B5CDBF]" placeholder="Bank (Cth: Mandiri)" value={formData.gift?.banks?.[1]?.name || ''} onChange={(e) => updateNested('gift', 'banks', [formData.gift?.banks?.[0] || {}, { ...(formData.gift?.banks?.[1] || {}), name: e.target.value }])} />
                                                            <input className="w-full bg-[#FBFBF9] border border-[#D1E0D7] rounded-2xl px-4 py-3 text-sm focus:bg-white focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 font-bold hover:border-[#B5CDBF]" placeholder="No Rekening" value={formData.gift?.banks?.[1]?.account || ''} onChange={(e) => updateNested('gift', 'banks', [formData.gift?.banks?.[0] || {}, { ...(formData.gift?.banks?.[1] || {}), account: e.target.value }])} />
                                                        </div>
                                                        <input className="w-full bg-[#FBFBF9] border border-[#D1E0D7] rounded-2xl px-4 py-3 text-sm focus:bg-white focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 font-bold hover:border-[#B5CDBF]" placeholder="Atas Nama" value={formData.gift?.banks?.[1]?.holder || ''} onChange={(e) => updateNested('gift', 'banks', [formData.gift?.banks?.[0] || {}, { ...(formData.gift?.banks?.[1] || {}), holder: e.target.value }])} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* KARTU 7: LIVE STREAMING */}
                                            <div className="bg-[#F0F5F2] border border-[#D1E0D7] shadow-sm rounded-3xl p-6">
                                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#D1E0D7]">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-white border border-[#D1E0D7] p-2.5 rounded-2xl">
                                                            <CheckCircle className="w-4 h-4 text-brand" />
                                                        </div>
                                                        <h3 className="font-bold text-brand text-base">Live Streaming</h3>
                                                    </div>
                                                    <label className="flex items-center gap-2 text-[11px] font-bold text-brand cursor-pointer uppercase tracking-wider">
                                                        <input type="checkbox" className="accent-brand w-4 h-4 rounded cursor-pointer" checked={formData.live_stream?.enabled || false} onChange={(e) => setFormData({ ...formData, live_stream: { ...formData.live_stream, enabled: e.target.checked } })} />
                                                        Aktifkan
                                                    </label>
                                                </div>

                                                <div className={`transition-all duration-300 ${!formData.live_stream?.enabled ? 'opacity-40 pointer-events-none grayscale-[30%]' : ''}`}>
                                                    <input
                                                        className="w-full bg-white border border-[#D1E0D7] rounded-2xl px-4 py-3 text-sm focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 font-medium hover:border-[#B5CDBF]"
                                                        placeholder="Paste Link Streaming (YouTube / IG / Zoom)"
                                                        value={formData.live_stream?.url || ''}
                                                        onChange={(e) => setFormData({ ...formData, live_stream: { ...formData.live_stream, url: e.target.value } })}
                                                    />
                                                </div>
                                            </div>

                                            {/* KARTU 8: PENUTUP */}
                                            <div className="bg-[#F0F5F2] border border-[#D1E0D7] shadow-sm rounded-3xl p-6">
                                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#D1E0D7]">
                                                    <div className="bg-white border border-[#D1E0D7] p-2.5 rounded-2xl">
                                                        <CheckCircle className="w-4 h-4 text-brand" />
                                                    </div>
                                                    <h3 className="font-bold text-brand text-base">Bagian Penutup</h3>
                                                </div>

                                                <div className="space-y-6">
                                                    {/* Upload Foto Penutup */}
                                                    <div>
                                                        <label className="block text-[11px] font-bold text-brand/60 mb-3 uppercase tracking-wider">Foto Penutup (Bulat)</label>
                                                        <div className="flex items-center gap-5">
                                                            {formData.closingPhoto ? (
                                                                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md shrink-0 group">
                                                                    <img src={formData.closingPhoto} alt="Closing" className="w-full h-full object-cover" />
                                                                    <button type="button" onClick={() => setFormData({ ...formData, closingPhoto: '' })} className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <X className="w-6 h-6" />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <label className="w-20 h-20 rounded-full bg-white border-2 border-[#D1E0D7] border-dashed hover:border-[#8BA896] hover:bg-[#FBFBF9] flex items-center justify-center shrink-0 cursor-pointer transition-all duration-300 shadow-sm group">
                                                                    <ImageIcon className="w-6 h-6 text-brand/40 group-hover:text-brand transition-colors" />
                                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageSelect(e, 'closingPhoto')} />
                                                                </label>
                                                            )}

                                                            {!formData.closingPhoto && (
                                                                <div className="flex-1">
                                                                    <label className="cursor-pointer bg-white border border-[#D1E0D7] px-4 py-2.5 rounded-xl text-xs font-bold text-brand hover:bg-[#FBFBF9] hover:border-[#8BA896] transition-all duration-300 inline-block shadow-sm">
                                                                        + Pilih Foto
                                                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageSelect(e, 'closingPhoto')} />
                                                                    </label>
                                                                    <p className="text-[10px] text-brand/50 mt-2 font-medium">Format 1:1 (Persegi/Bulat) agar hasil rapi.</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Input Teks */}
                                                    <div>
                                                        <label className="block text-[11px] font-bold text-brand/60 mb-2 uppercase tracking-wider">Pesan Penutup</label>
                                                        <textarea
                                                            className="w-full bg-white border border-[#D1E0D7] rounded-2xl px-4 py-3 text-sm focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-brand placeholder:text-brand/40 transition-all duration-300 resize-none font-medium hover:border-[#B5CDBF] leading-relaxed"
                                                            rows={4}
                                                            value={formData.closing_text || ''}
                                                            onChange={(e) => setFormData({ ...formData, closing_text: e.target.value })}
                                                            placeholder="Contoh: Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>

                            {/* AREA PREVIEW (Kanan di Desktop, Bawah di HP) */}
                            <div className="flex-1 w-full flex flex-col md:bg-stone-200 md:items-center md:justify-center md:p-8">

                                {/* LAPIS 1: Ngurung tombol fixed (Ganti overflow-y-auto jadi overflow-hidden) */}
                                <div className="w-full md:max-w-[400px] h-[calc(100dvh-100px)] md:h-[85vh] bg-stone-100 md:bg-white relative transform translate-x-0 z-0 overflow-hidden md:rounded-[2rem] border-0 md:border-[12px] md:border-stone-800 md:shadow-2xl shrink-0">

                                    {/* LAPIS 2: Area khusus scroll konten */}
                                    <div className="w-full h-full overflow-x-hidden overflow-y-auto">
                                        <TemplateRenderer
                                            data={{

                                                invitation_id: user.id,
                                                template_id: formData.template_id,
                                                bride_name: formData.brideName,
                                                groom_name: formData.groomName,
                                                isPreview: true,
                                                content_data: {
                                                    coverPhoto: formData.coverPhoto,
                                                    bgPhoto: formData.bgPhoto,
                                                    closingPhoto: formData.closingPhoto,
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
                        <CommentsTab
                            comments={comments}
                            isLoadingComments={isLoadingComments}
                            onReply={handleReplySubmit}
                        />
                    )}

                    {/* LAYOUT SEBAR UNDANGAN */}
                    {activeMenu === 'sebar' && (
                        <ShareTab slug={invitationSlug} />
                    )}

                </main>
            </div>
            {cropConfig && (
                <ImageCropper
                    imageSrc={cropConfig.src}
                    aspect={cropConfig.aspect}
                    onCancel={() => setCropConfig(null)}
                    onSave={handleCropSave}
                />
            )}
        </div>
    )

}