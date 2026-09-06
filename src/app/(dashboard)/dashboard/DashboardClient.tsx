'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import TemplateRenderer from '@/components/templates/TemplateRenderer'

export default function DashboardClient({ user, initialData }: { user: any, initialData?: any }) {
    const [formData, setFormData] = useState({
        template_id: initialData?.template_id || 'rustic-01',
        brideName: initialData?.bride_name || '',
        groomName: initialData?.groom_name || '',
        coverPhoto: initialData?.content_data?.coverPhoto || '',
        musicUrl: initialData?.content_data?.musicUrl || '',
        quote: initialData?.content_data?.quote || '',
        bride_details: initialData?.content_data?.bride_details || { fullName: '', order: '', parents: '', ig: '' },
        groom_details: initialData?.content_data?.groom_details || { fullName: '', order: '', parents: '', ig: '' },
        events: initialData?.content_data?.events || {
            akad: { date: '', time: '', location: '', mapUrl: '' },
            resepsi: { date: '', time: '', location: '', mapUrl: '' }
        },
        gift: initialData?.content_data?.gift || { enabled: true, banks: [{ name: '', account: '', holder: '' }] },
        live_stream: initialData?.content_data?.live_stream || { enabled: false, url: '' },
        closing_text: initialData?.content_data?.closing_text || '',
        sections: initialData?.content_data?.sections || { gallery: { enabled: true, photos: [] } }
    })
    const [saveStatus, setSaveStatus] = useState('Tersimpan')
    const [invitationSlug, setInvitationSlug] = useState('')
    const [invitationStatus, setInvitationStatus] = useState('DRAFT')
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
    const [isUploadingMusic, setIsUploadingMusic] = useState(false)
    const supabase = createClient()

    const updateNested = (category: string, field: string, value: string) => {
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
                    musicUrl: formData.musicUrl,
                    quote: formData.quote,
                    bride_details: formData.bride_details,
                    groom_details: formData.groom_details,
                    events: formData.events,
                    gift: formData.gift,
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

    return (
        <div className="flex h-screen w-full bg-gray-50 text-black">
            {/* Form Kiri */}
            <div className="w-1/2 border-r bg-white p-8 overflow-y-auto flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Editor Undangan</h2>
                        <span className={`text-sm ${saveStatus === 'Menyimpan...' ? 'text-yellow-500' : 'text-green-500'}`}>
                            {saveStatus}
                        </span>
                    </div>

                    <div className="flex flex-col gap-4">
                        <label className="flex flex-col text-sm font-semibold">
                            Mempelai Wanita
                            <input type="text" value={formData.brideName} onChange={(e) => setFormData({ ...formData, brideName: e.target.value })} className="mt-1 p-2 border rounded" />
                        </label>
                        <label className="flex flex-col text-sm font-semibold">
                            Mempelai Pria
                            <input type="text" value={formData.groomName} onChange={(e) => setFormData({ ...formData, groomName: e.target.value })} className="mt-1 p-2 border rounded" />
                        </label>

                        <label className="flex flex-col text-sm font-semibold">
                            Upload Foto Cover
                            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'photos', 'photo')} disabled={isUploadingPhoto} className="mt-1 p-2 border rounded" />
                        </label>

                        <label className="flex flex-col text-sm font-semibold">
                            Upload Background Music
                            <input type="file" accept="audio/*" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'music', 'music')} disabled={isUploadingMusic} className="mt-1 p-2 border rounded" />
                        </label>

                        <div>
                            <label className="block text-sm font-bold mb-1">Kutipan Pernikahan</label>
                            <textarea
                                className="w-full border p-2 text-sm" rows={3}
                                value={formData.quote}
                                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                                placeholder="Contoh: Dan di antara tanda-tanda kekuasaan-Nya..."
                            />
                        </div>

                        {/* Data Mempelai */}
                        <div className="border p-4 bg-gray-50">
                            <h3 className="font-bold mb-2">Detail Wanita</h3>
                            <input className="w-full border p-2 text-sm mb-2" placeholder="Nama Lengkap" value={formData.bride_details.fullName} onChange={(e) => updateNested('bride_details', 'fullName', e.target.value)} />
                            <input className="w-full border p-2 text-sm mb-2" placeholder="Status (contoh: Putri Pertama)" value={formData.bride_details.order} onChange={(e) => updateNested('bride_details', 'order', e.target.value)} />
                            <input className="w-full border p-2 text-sm mb-2" placeholder="Nama Orang Tua" value={formData.bride_details.parents} onChange={(e) => updateNested('bride_details', 'parents', e.target.value)} />
                            <input className="w-full border p-2 text-sm" placeholder="Link Instagram" value={formData.bride_details.ig} onChange={(e) => updateNested('bride_details', 'ig', e.target.value)} />
                        </div>

                        <div className="border p-4 bg-gray-50">
                            <h3 className="font-bold mb-2">Detail Pria</h3>
                            <input className="w-full border p-2 text-sm mb-2" placeholder="Nama Lengkap" value={formData.groom_details.fullName} onChange={(e) => updateNested('groom_details', 'fullName', e.target.value)} />
                            <input className="w-full border p-2 text-sm mb-2" placeholder="Status (contoh: Putra Pertama)" value={formData.groom_details.order} onChange={(e) => updateNested('groom_details', 'order', e.target.value)} />
                            <input className="w-full border p-2 text-sm mb-2" placeholder="Nama Orang Tua" value={formData.groom_details.parents} onChange={(e) => updateNested('groom_details', 'parents', e.target.value)} />
                            <input className="w-full border p-2 text-sm" placeholder="Link Instagram" value={formData.groom_details.ig} onChange={(e) => updateNested('groom_details', 'ig', e.target.value)} />
                        </div>

                        {/* Acara */}
                        <div className="border p-4 bg-gray-50">
                            <h3 className="font-bold mb-2">Akad Nikah</h3>
                            <input type="date" className="w-full border p-2 text-sm mb-2" value={formData.events.akad.date} onChange={(e) => updateEvent('akad', 'date', e.target.value)} />
                            <input type="time" className="w-full border p-2 text-sm mb-2" value={formData.events.akad.time} onChange={(e) => updateEvent('akad', 'time', e.target.value)} />
                            <input className="w-full border p-2 text-sm mb-2" placeholder="Lokasi" value={formData.events.akad.location} onChange={(e) => updateEvent('akad', 'location', e.target.value)} />
                            <input className="w-full border p-2 text-sm" placeholder="Link Google Maps" value={formData.events.akad.mapUrl} onChange={(e) => updateEvent('akad', 'mapUrl', e.target.value)} />
                        </div>

                        <hr className="my-4" />

                        <h3 className="font-bold text-lg">Pengaturan Section</h3>
                        <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.sections.gallery.enabled}
                                onChange={() => toggleSection('gallery')}
                                className="w-4 h-4"
                            />
                            Tampilkan Galeri Foto
                        </label>
                    </div>
                </div>

                <div className="mt-8 p-4 bg-gray-100 rounded-lg border border-gray-300">
                    <h3 className="font-bold mb-2">Status Undangan: {invitationStatus}</h3>
                    {invitationStatus === 'DRAFT' ? (
                        <button onClick={handlePublish} className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">
                            Simulasi Bayar & Aktifkan
                        </button>
                    ) : (
                        <div>
                            <p className="text-sm text-green-600 font-bold mb-2">Undangan Aktif!</p>
                            <a href={`/${invitationSlug}`} target="_blank" className="text-blue-500 underline break-all">
                                http://localhost:3000/{invitationSlug}
                            </a>
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-4 border-t text-xs text-gray-400 text-center">
                    © 2026 Temuhati. All rights reserved.
                </div>
            </div>

            {/* Preview Kanan */}
            <div className="w-1/2 bg-gray-200 p-8 flex items-center justify-center">
                <div className="w-[375px] h-[667px] bg-white shadow-2xl rounded-[30px] border-8 border-gray-900 overflow-hidden relative">
                    {/* Panggil Mesin Template di sini */}
                    <div className="w-full h-full overflow-y-auto no-scrollbar">
                        <TemplateRenderer
                            data={{
                                template_id: formData.template_id,
                                bride_name: formData.brideName,
                                groom_name: formData.groomName,
                                content_data: {
                                    coverPhoto: formData.coverPhoto,
                                    musicUrl: formData.musicUrl,
                                    quote: formData.quote,
                                    bride_details: formData.bride_details,
                                    groom_details: formData.groom_details,
                                    events: formData.events,
                                    gift: formData.gift,
                                    live_stream: formData.live_stream,
                                    closing_text: formData.closing_text,
                                    sections: formData.sections
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}