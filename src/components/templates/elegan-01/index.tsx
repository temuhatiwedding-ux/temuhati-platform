'use client'

import { useState, useRef } from 'react'
import { Volume2, VolumeX, MapPin, Quote } from 'lucide-react'
import { InvitationData } from '@/types/invitation'
import GuestbookForm from '@/components/templates/GuestbookForm'

export default function Elegan01({ data }: { data: InvitationData }) {
    const [isOpened, setIsOpened] = useState(false)
    const [isPlaying, setIsPlaying] = useState(true)
    const audioRef = useRef<HTMLAudioElement>(null)
    const content = data.content_data || {}

    // Fallback Data
    const bride = content.bride_details || { fullName: 'Nama Wanita', order: 'Putri Pertama', parents: 'Bapak & Ibu', ig: '#' }
    const groom = content.groom_details || { fullName: 'Nama Pria', order: 'Putra Pertama', parents: 'Bapak & Ibu', ig: '#' }
    const events = content.events || { akad: { date: 'SABTU, 12 OKTOBER 2025', time: '08.00 WIB', location: 'Lokasi Akad', mapUrl: '#' }, resepsi: { date: 'SABTU, 12 OKTOBER 2025', time: '10.00 WIB', location: 'Lokasi Resepsi', mapUrl: '#' } }
    const love_story = content.love_story || { enabled: true, stories: [] }

    const themeColor = "#a4825e"
    const defaultCover = "/templates/elegan-01/cover.png"
    const coverImage = content.coverPhoto || defaultCover

    // Placeholder untuk foto spesifik (Bisa disesuaikan nanti)
    const groomPhoto = "/templates/elegan-01/groom.jpg"
    const bridePhoto = "/templates/elegan-01/bride.jpg"

    const toggleMusic = () => {
        if (audioRef.current) {
            isPlaying ? audioRef.current.pause() : audioRef.current.play()
            setIsPlaying(!isPlaying)
        }
    }

    // --- 1. COVER (Sebelum Dibuka) ---
    if (!isOpened) {
        return (
            <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black text-white overflow-hidden">
                <img src={coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="relative z-10 w-full flex flex-col items-center justify-end pb-16 px-6 text-center">
                    <p className="text-sm mb-2 drop-shadow-md">The Wedding Of</p>
                    <h1 className="text-3xl font-serif font-bold mb-6 drop-shadow-lg">
                        {data.groom_name || 'Ardi'} & {data.bride_name || 'Rania'}
                    </h1>
                    <p className="text-sm mb-1 drop-shadow-md">Kepada Yth.</p>
                    <p className="text-base font-bold mb-8 drop-shadow-md">Bapak/Ibu/Saudara/i</p>
                    <button onClick={() => setIsOpened(true)} className="bg-white text-black font-bold py-3 px-8 rounded-lg shadow-xl hover:bg-gray-100 transition-colors">
                        Buka Undangan
                    </button>
                </div>
            </div>
        )
    }

    // --- 2. ISI UNDANGAN (Setelah Dibuka) ---
    return (
        <div className="w-full bg-[#fcfbf9] text-stone-800 font-sans">
            {/* Audio Button */}
            {content.musicUrl && (
                <>
                    <audio ref={audioRef} autoPlay loop className="hidden" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}>
                        <source src={content.musicUrl} type="audio/mpeg" />
                    </audio>
                    <button onClick={toggleMusic} className="fixed bottom-6 right-6 z-50 p-3 bg-white text-[#a4825e] border border-stone-200 rounded-full shadow-lg hover:bg-stone-50 transition-all flex items-center justify-center">
                        {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>
                </>
            )}

            {/* Hero Banner Halaman Pertama */}
            <div className="relative w-full h-[100dvh] flex flex-col justify-end bg-black text-white overflow-hidden">
                <img src={coverImage} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="relative z-10 w-full flex flex-col items-center justify-end pb-24 px-6 text-center">
                    <p className="text-xs uppercase tracking-widest mb-2 drop-shadow-md">The Wedding Of</p>
                    <h1 className="text-3xl font-serif font-bold mb-6 drop-shadow-lg">
                        {data.groom_name || 'Ardi'} & {data.bride_name || 'Rania'}
                    </h1>
                    <p className="text-xs mb-1 drop-shadow-md">Tanggal</p>
                    <p className="text-sm font-bold uppercase mb-8 drop-shadow-md">{events.resepsi?.date}</p>
                    <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan" target="_blank" rel="noreferrer" className="bg-white text-black font-semibold text-sm py-3 px-8 rounded-lg shadow-xl hover:bg-gray-100 transition-colors">
                        Save the Date
                    </a>
                </div>
            </div>

            {/* Kutipan Quran */}
            <div className="py-16 px-8 text-center text-white flex flex-col items-center justify-center" style={{ backgroundColor: themeColor }}>
                <Quote className="w-8 h-8 mb-6 fill-white opacity-80 rotate-180" />
                <p className="text-sm italic mb-6 leading-relaxed">
                    "{content.quote || 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri.'}"
                </p>
                <p className="font-bold text-sm">Q.S. Ar-Rum: 21</p>
            </div>

            {/* Profil Mempelai */}
            <div className="py-16 px-6 text-center">
                <p className="text-sm text-stone-600 mb-12 leading-relaxed max-w-sm mx-auto">
                    Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i serta kerabat sekalian untuk menghadiri acara pernikahan kami:
                </p>

                <div className="mb-8">
                    <img src={groomPhoto} alt="Groom" className="w-2/3 max-w-[240px] aspect-[3/4] object-cover mx-auto rounded-2xl mb-6 shadow-sm" onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop'} />
                    <h3 className="text-2xl font-serif font-bold mb-2" style={{ color: themeColor }}>{groom.fullName}</h3>
                    <p className="text-sm text-stone-600">{groom.order} dari Bapak {groom.parents.split('&')[0]} & Ibu {groom.parents.split('&')[1] || ''}</p>
                </div>

                <div className="text-5xl font-serif my-12" style={{ color: themeColor }}>&</div>

                <div className="mb-12">
                    <img src={bridePhoto} alt="Bride" className="w-2/3 max-w-[240px] aspect-[3/4] object-cover mx-auto rounded-2xl mb-6 shadow-sm" onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop'} />
                    <h3 className="text-2xl font-serif font-bold mb-2" style={{ color: themeColor }}>{bride.fullName}</h3>
                    <p className="text-sm text-stone-600">{bride.order} dari Bapak {bride.parents.split('&')[0]} & Ibu {bride.parents.split('&')[1] || ''}</p>
                </div>
            </div>

            {/* Event Details */}
            <div className="py-16 px-6 flex flex-col items-center bg-white text-center">
                <img src={coverImage} alt="Event" className="w-full max-w-sm aspect-square object-cover rounded-t-[200px] mb-8 shadow-sm" />
                <h2 className="text-2xl font-bold text-stone-800 mb-6">Save The Date</h2>
                <div className="mb-10 w-full max-w-sm">
                    <h3 className="text-2xl font-serif font-bold mb-4" style={{ color: themeColor }}>Resepsi</h3>
                    <p className="text-sm text-stone-700 mb-2 uppercase tracking-wide">{events.resepsi?.date}</p>
                    <p className="text-sm font-bold text-stone-800 mb-4">PUKUL : {events.resepsi?.time} - Selesai</p>
                    <p className="text-sm text-stone-600 leading-relaxed mb-6">{events.resepsi?.location}</p>
                    <a href={events.resepsi?.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-90" style={{ backgroundColor: themeColor }}>
                        <MapPin className="w-4 h-4" />
                        Lokasi Acara
                    </a>
                </div>
            </div>

            {/* Love Story */}
            {love_story.enabled && love_story.stories.length > 0 && (
                <div className="py-16 px-6 bg-[#fcfbf9]">
                    <h2 className="text-3xl font-serif font-bold text-center mb-10" style={{ color: themeColor }}>Love Story</h2>
                    <div className="flex flex-col gap-4 max-w-sm mx-auto">
                        {love_story.stories.map((story: any, index: number) => (
                            <div key={index} className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] text-center border border-stone-100">
                                <h4 className="font-bold text-lg mb-3" style={{ color: themeColor }}>{story.year}</h4>
                                <p className="text-sm text-stone-600 leading-relaxed">{story.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Guestbook Form */}
            <div className="py-16 px-6 bg-white">
                <GuestbookForm invitationId={data.invitation_id || ''} />
            </div>
        </div>
    )
}