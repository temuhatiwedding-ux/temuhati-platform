'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Volume2, VolumeX, MapPin, ArrowRight, Copy } from 'lucide-react'
import { InvitationData } from '@/types/invitation'
import Guestbook from './Guestbook'
import { useSearchParams } from 'next/navigation'

const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|^youtube.com\/live\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
};

export default function Modern02({ data }: { data: InvitationData }) {
    const searchParams = useSearchParams()
    const guestName = searchParams.get('to') || 'Bapak/Ibu/Saudara/i'
    const guestId = searchParams.get('id')

    const [isOpened, setIsOpened] = useState(false)
    const [isExiting, setIsExiting] = useState(false) // State baru
    const [heroIndex, setHeroIndex] = useState(0)
    const [isMounted, setIsMounted] = useState(false)
    const [isPlaying, setIsPlaying] = useState(true)
    const [showGift, setShowGift] = useState(false)
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

    const audioRef = useRef<HTMLAudioElement>(null)
    const supabase = createClient()

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        const markAsOpened = async () => {
            if (guestId) {
                await supabase.from('guest_list').update({ is_opened: true }).eq('id', guestId)
            }
        }
        markAsOpened()
    }, [guestId])

    const content = data.content_data || {}
    const defaultMusic = `${process.env.NEXT_PUBLIC_R2_URL}/master-music/laksana-surgaku.mp3`
    const musicUrl = content.musicUrl || defaultMusic

    const bride = content.bride_details || { fullName: 'Nama Wanita', order: 'Pertama', fatherName: 'Bapak', motherName: 'Ibu', ig: '#' }
    const groom = content.groom_details || { fullName: 'Nama Pria', order: 'Pertama', fatherName: 'Bapak', motherName: 'Ibu', ig: '#' }
    const events: any = content.events || {
        akad: { day: 'SABTU', date: '12 OKTOBER 2026', time: '08.00 WIB', location: 'Lokasi Akad', mapUrl: '#' },
        resepsi: { day: 'SABTU', date: '12 OKTOBER 2026', time: '10.00 WIB', location: 'Lokasi Resepsi', mapUrl: '#' }
    }
    const love_story = content.love_story || { enabled: true, stories: [] }
    const sections: any = content.sections || {}
    const galleryEnabled = sections.gallery?.enabled ?? true
    const savedPhotos = sections.gallery?.photos || []

    const gallery = savedPhotos.length > 0 ? savedPhotos : [
        `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/elegan-01/galeri-1.jpg`,
        `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/elegan-01/galeri-2.jpg`,
        `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/elegan-01/galeri-3.jpg`,
        `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/elegan-01/galeri-4.jpg`,
        `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/elegan-01/galeri-5.jpg`,
    ]

    const themeColor = "#18181b" // zinc-900 untuk modern minimalis
    const coverImage = content.coverPhoto || `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/elegan-01/cover.png`
    const groomPhoto = content.groomPhoto || `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/elegan-01/mempelai-pria.jpg`
    const bridePhoto = content.bridePhoto || `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/elegan-01/mempelai-wanita.jpg`
    const closingPhoto = content.closingPhoto || `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/elegan-01/prewedding-penutup.jpg`

    const gifts: any = content.gift?.banks || [
        { name: 'BCA', account: '1234567890', holder: 'Ardi Pratama' },
        { name: 'MANDIRI', account: '0987654321', holder: 'Rania Safitri' }
    ]
    const liveStream = content.live_stream || { enabled: false, url: '' }

    const toggleMusic = () => {
        if (audioRef.current) {
            isPlaying ? audioRef.current.pause() : audioRef.current.play()
            setIsPlaying(!isPlaying)
        }
    }
    // Handler untuk tombol "Buka Undangan"
    const handleOpen = () => {
        setIsExiting(true)
        setTimeout(() => setIsOpened(true), 800) // Sesuaikan durasi CSS
    }

    // Effect untuk Slideshow Otomatis
    useEffect(() => {
        if (isOpened) {
            const timer = setInterval(() => {
                setHeroIndex((prev) => prev + 1)
            }, 6000) // Total 8 detik (misal: 4 detik geser + 4 detik diam)

            return () => clearInterval(timer)
        }
    }, [isOpened])

    // Array Foto untuk Slideshow (Fallback)
    const heroPhotos = content.heroPhotos && content.heroPhotos.length > 0
        ? content.heroPhotos
        : [ // Fallback jika heroPhotos kosong
            coverImage,
            gallery.length > 0 ? gallery[0] : groomPhoto
        ]

    useEffect(() => {
        const getTargetDate = () => {
            if (!events?.akad?.date) return new Date().getTime()
            let dateStr = events.akad.date.toLowerCase().replace(/^(senin|selasa|rabu|kamis|jumat|sabtu|minggu)[,\s]*/i, '')
            const bulanMap: Record<string, string> = { 'januari': 'Jan', 'februari': 'Feb', 'maret': 'Mar', 'april': 'Apr', 'mei': 'May', 'juni': 'Jun', 'juli': 'Jul', 'agustus': 'Aug', 'september': 'Sep', 'oktober': 'Oct', 'november': 'Nov', 'desember': 'Dec' }
            Object.keys(bulanMap).forEach(key => { dateStr = dateStr.replace(key, bulanMap[key]) })
            let timeStr = events?.akad?.time ? events.akad.time.split('-')[0].trim().replace(/[^0-9:]/g, '').substring(0, 5) : '08:00'
            if (!timeStr) timeStr = '08:00'
            const finalDate = new Date(`${dateStr} ${timeStr}`).getTime()
            return isNaN(finalDate) ? new Date().getTime() : finalDate
        }

        const targetDate = getTargetDate()
        const interval = setInterval(() => {
            const distance = targetDate - new Date().getTime()
            if (distance < 0) {
                clearInterval(interval)
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
                return
            }
            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [events?.akad?.date, events?.akad?.time])

    const formatTanggal = (dateStr: string) => {
        if (!dateStr) return '';
        if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        }
        return dateStr;
    }

    return (
        // 1. Pindahkan logika scroll lock ke PEMBUNGKUS UTAMA ini
        <div className={`w-full max-w-[430px] mx-auto relative bg-white shadow-2xl text-zinc-900 font-sans selection:bg-slate-500 selection:text-white ${!isOpened ? 'h-[100dvh] overflow-hidden' : 'min-h-screen'}`}>

            {/* --- 1. COVER SECTION --- */}
            {!isOpened && (
                <div
                    className={`absolute top-0 left-0 w-full h-[100dvh] z-[100] flex flex-col justify-end bg-black text-white overflow-hidden font-sans transition-transform duration-[800ms] ease-in-out ${isExiting ? '-translate-y-full' : 'translate-y-0'}`}
                >
                    <img src={coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute bottom-0 w-full h-[60%] bg-gradient-to-t from-[#111111] via-[#111111]/80 to-transparent" />

                    <div className="relative z-10 w-full px-6 pb-12 text-left flex flex-col">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-2 cover-animate">The Wedding Of</p>
                        <h1 className="text-4xl drop-shadow-lg leading-tight mb-8 cover-animate cover-delay-150" style={{ fontFamily: 'var(--font-playfair)' }}>
                            <span className="block uppercase tracking-wider font-bold">{data.groom_name || 'HABIB'}</span>
                            <div className="flex items-center mt-1">
                                <span className="italic font-normal lowercase text-3xl mr-3" style={{ fontFamily: 'var(--font-playfair)' }}>&</span>
                                <span className="uppercase tracking-wider font-bold">{data.bride_name || 'ADIBA'}</span>
                            </div>
                        </h1>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-1 cover-animate cover-delay-300">Dear</p>
                        <p className="text-base font-semibold mb-6 capitalize cover-animate cover-delay-300">{guestName}</p>
                        <button
                            onClick={handleOpen}
                            className="w-max bg-slate-500/60 backdrop-blur-sm border border-white/20 text-white font-medium text-sm py-2.5 px-6 rounded-full hover:bg-slate-500/80 transition-colors cover-animate cover-delay-500"
                        >
                            Buka Undangan
                        </button>
                    </div>
                </div>
            )}

            {/* --- 2. MAIN CONTENT --- */}
            {/* 2. Div ini sekarang jadi bersih, class overflow-hidden yang lama sudah dihapus */}
            <div className="relative w-full bg-white">

                {/* Audio (Hanya dijalankan jika cover sudah terbuka sepenuhnya) */}
                {musicUrl && isOpened && (
                    <>
                        <audio ref={audioRef} autoPlay loop className="hidden" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}>
                            <source src={musicUrl} type="audio/mpeg" />
                        </audio>
                        <button onClick={toggleMusic} className="fixed bottom-6 right-6 z-50 p-4 bg-slate-500/80 backdrop-blur-md border border-white/20 text-white rounded-full shadow-xl hover:scale-95 transition-transform flex items-center justify-center">
                            {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                        </button>
                    </>
                )}

                {/* --- FOTO SLIDESHOW, BOKEH & OMBAK GELOMBANG --- */}
                <div className="relative w-full h-[65dvh] overflow-hidden">

                    {/* Container Flex yang bergeser ke KANAN terus-menerus */}
                    <div
                        className="absolute top-0 right-0 w-full h-full flex flex-row-reverse transition-transform duration-[4000ms] ease-out"
                        style={{ transform: `translateX(${heroIndex * 100}%)` }}
                    >
                        {/* Kita render barisan 60 foto (cukup untuk 4 menit dibiarkan diam) */}
                        {Array.from({ length: 60 }).map((_, idx) => (
                            <img
                                key={idx}
                                src={heroPhotos[idx % heroPhotos.length]}
                                alt={`Hero slide ${idx}`}
                                className="w-full h-full shrink-0 object-cover"
                            />
                        ))}
                    </div>

                    {/* Gelembung Cahaya (HANYA render setelah browser siap agar bebas error) */}
                    {isMounted && (
                        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
                            {[...Array(12)].map((_, i) => (
                                <div
                                    key={i}
                                    className="bokeh-particle"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        bottom: `${Math.random() * 30}%`,
                                        width: `${Math.random() * 15 + 10}px`,
                                        height: `${Math.random() * 15 + 10}px`,
                                        animationDuration: `${Math.random() * 4 + 3}s`,
                                        animationDelay: `${Math.random() * 2}s`
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Masking Gelombang SVG di Bawah Foto */}
                    <div className="absolute -bottom-1 w-full z-20">
                        <svg viewBox="0 0 1440 320" className="w-full h-auto drop-shadow-sm">
                            <path fill="#ffffff" fillOpacity="1" d="M0,160L80,149.3C160,139,320,117,480,128C640,139,800,181,960,186.7C1120,192,1280,160,1360,144L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
                        </svg>
                    </div>
                </div>

                {/* --- TEKS HERO BAWAH --- */}
                <div className="relative z-30 flex-1 flex flex-col items-center justify-center w-full px-6 py-6 text-center bg-white overflow-hidden">

                    {/* --- BACKGROUND BUNGA (Opacity 15%) --- */}
                    <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-[150%] h-[150%] text-slate-400 opacity-15 transform rotate-12"
                        >
                            <path d="M12 22V9" />
                            <path d="M12 9c-4 0-7-3-7-7 4 0 7 3 7 7z" />
                            <path d="M12 9c4 0 7-3 7-7-4 0-7 3-7 7z" />
                            <path d="M12 14c-3 0-5-2-5-5 3 0 5 2 5 5z" />
                            <path d="M12 14c3 0 5-2 5-5-3 0-5 2-5 5z" />
                            <path d="M12 18c-1.5 0-3-1-3-3 1.5 0 3 1 3 3z" />
                            <path d="M12 18c1.5 0 3-1 3-3-1.5 0-3 1-3 3z" />
                        </svg>
                    </div>

                    {/* --- KONTEN TEKS (Tambahkan relative dan z-10 agar di atas bunga) --- */}
                    <p
                        className={`relative z-10 text-xs uppercase tracking-[0.2em] text-slate-500 mb-4 ${isExiting || isOpened ? 'dramatic-reveal' : 'opacity-0'}`}
                        style={{ fontFamily: 'var(--font-playfair)', animationDelay: '400ms' }}
                    >
                        The Wedding of
                    </p>

                    <h2
                        className={`relative z-10 text-4xl text-slate-600 mb-6 uppercase ${isExiting || isOpened ? 'dramatic-reveal' : 'opacity-0'}`}
                        style={{ fontFamily: 'var(--font-playfair)', animationDelay: '800ms' }}
                    >
                        {data.groom_name} & {data.bride_name}
                    </h2>

                    <p
                        className={`relative z-10 text-sm font-bold tracking-[0.1em] text-slate-700 ${isExiting || isOpened ? 'dramatic-reveal' : 'opacity-0'}`}
                        style={{ animationDelay: '1200ms' }}
                    >
                        {events?.akad?.date ? events.akad.date.split('-').reverse().join('. ') : 'TANGGAL BELUM DIATUR'}
                    </p>

                </div>
            </div>

            {/* Couple Profile */}
            <div className="py-24 px-6 max-w-lg mx-auto">
                <p className="text-xl font-medium tracking-tight text-zinc-400 mb-16">
                    We invite you to share in our joy as we begin our new life together.
                </p>

                <div className="flex flex-col gap-16">
                    <div className="flex flex-col gap-4">
                        <img src={groomPhoto} alt="Groom" className="w-full aspect-square object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                        <div>
                            <h3 className="text-3xl font-black uppercase tracking-tighter">{groom.fullName}</h3>
                            <p className="text-sm text-zinc-500 uppercase tracking-widest mt-1">Son of {groom.fatherName || '-'} & {groom.motherName || '-'}</p>
                            {groom.ig && <a href={`https://instagram.com/${groom.ig.replace('@', '')}`} className="inline-block mt-4 text-xs font-bold uppercase tracking-widest border-b border-zinc-900 pb-1">Instagram &#8599;</a>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 text-right">
                        <img src={bridePhoto} alt="Bride" className="w-full aspect-square object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                        <div>
                            <h3 className="text-3xl font-black uppercase tracking-tighter">{bride.fullName}</h3>
                            <p className="text-sm text-zinc-500 uppercase tracking-widest mt-1">Daughter of {bride.fatherName || '-'} & {bride.motherName || '-'}</p>
                            {bride.ig && <a href={`https://instagram.com/${bride.ig.replace('@', '')}`} className="inline-block mt-4 text-xs font-bold uppercase tracking-widest border-b border-zinc-900 pb-1">Instagram &#8599;</a>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Event Details & Countdown */}
            <div className="py-24 px-6 bg-zinc-900 text-white">
                <div className="max-w-lg mx-auto">
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-12">The Details</h2>

                    {/* Modern Minimal Timer */}
                    <div className="grid grid-cols-4 gap-4 border-y border-zinc-800 py-8 mb-16">
                        {Object.entries(timeLeft).map(([unit, value]) => (
                            <div key={unit} className="text-center">
                                <span className="block text-3xl font-light tabular-nums">{value.toString().padStart(2, '0')}</span>
                                <span className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-2">{unit}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-12">
                        <div className="border-l border-zinc-700 pl-6 relative">
                            <div className="absolute w-2 h-2 bg-white -left-[4.5px] top-2"></div>
                            <h3 className="text-xl font-bold uppercase tracking-widest mb-2">Akad Nikah</h3>
                            <p className="text-sm text-zinc-400 mb-1">{events.akad?.day ? `${events.akad.day}, ` : ''}{formatTanggal(events.akad?.date)}</p>
                            <p className="text-sm text-zinc-400 mb-4">{events.akad?.time}</p>
                            <p className="text-sm font-medium leading-relaxed mb-6">{events.akad?.location}</p>
                            <a href={events.akad?.mapUrl} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-white text-zinc-900 px-6 py-3 hover:bg-zinc-200 transition-colors">
                                View Map <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>

                        <div className="border-l border-zinc-700 pl-6 relative">
                            <div className="absolute w-2 h-2 bg-white -left-[4.5px] top-2"></div>
                            <h3 className="text-xl font-bold uppercase tracking-widest mb-2">Resepsi</h3>
                            <p className="text-sm text-zinc-400 mb-1">{events.resepsi?.day ? `${events.resepsi.day}, ` : ''}{formatTanggal(events.resepsi?.date)}</p>
                            <p className="text-sm text-zinc-400 mb-4">{events.resepsi?.time} - Selesai</p>
                            <p className="text-sm font-medium leading-relaxed mb-6">{events.resepsi?.location}</p>
                            <a href={events.resepsi?.mapUrl} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-white text-zinc-900 px-6 py-3 hover:bg-zinc-200 transition-colors">
                                View Map <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gallery: Strict Grid */}
            {galleryEnabled && gallery && gallery.length > 0 && (
                <div className="py-24 max-w-4xl mx-auto">
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-12 px-6">Gallery</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-1 px-1">
                        {gallery.map((img: string, i: number) => (
                            <img key={i} src={img} alt={`Gallery ${i}`} className="w-full aspect-square object-cover grayscale hover:grayscale-0 transition-all duration-300" />
                        ))}
                    </div>
                </div>
            )}

            {/* Wedding Gift (Clean dark cards) */}
            <div className="py-24 px-6 bg-zinc-100 text-center">
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-6">Wedding Gift</h2>
                <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-10">Your blessing is our greatest gift. If you wish to send a token of love, you may use the details below.</p>

                {!showGift ? (
                    <button onClick={() => setShowGift(true)} className="bg-zinc-900 text-white font-bold uppercase tracking-widest text-xs px-8 py-4 hover:bg-zinc-800 transition-colors">
                        Send Gift
                    </button>
                ) : (
                    <div className="flex flex-col gap-4 items-center max-w-sm mx-auto animate-in fade-in zoom-in-95 duration-300">
                        {gifts.map((gift: any, i: number) => (
                            <div key={i} className="w-full bg-white border border-zinc-200 p-6 text-left flex flex-col gap-6">
                                <span className="font-black text-xl tracking-tighter">{gift.name}</span>
                                <div>
                                    <p className="text-2xl font-light tabular-nums tracking-wider text-zinc-900">{gift.account}</p>
                                    <p className="text-xs uppercase tracking-widest text-zinc-500 mt-1">{gift.holder}</p>
                                </div>
                                <button onClick={() => { navigator.clipboard.writeText(gift.account); alert('Copied!'); }} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-900 pb-1 w-fit">
                                    <Copy className="w-3.5 h-3.5" /> Copy Number
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Guestbook */}
            <div className="py-24 px-6">
                <div className="max-w-lg mx-auto">
                    <Guestbook invitationId={data.invitation_id || ''} themeColor={themeColor} isPreview={data.isPreview ?? !data.invitation_id} />
                </div>
            </div>

            {/* Closing */}
            <div className="relative py-32 px-6 flex flex-col items-center justify-center bg-zinc-950 text-white overflow-hidden">
                <img src={closingPhoto} alt="Closing" className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950" />
                <div className="relative z-10 text-center">
                    <h2 className="text-5xl font-black tracking-tighter uppercase mb-6">Thank You</h2>
                    <p className="text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed mb-12">
                        {content.closing_text || "We can't wait to share our special day with you."}
                    </p>
                    <p className="text-3xl font-black uppercase tracking-tighter">
                        {data.groom_name} & {data.bride_name}
                    </p>
                </div>
            </div>

            {/* Dev Tools Preview */}
            {data.isPreview && isOpened && (
                <button
                    onClick={() => {
                        setIsExiting(false); // Kembalikan posisi cover ke bawah
                        setIsOpened(false);  // Render ulang cover
                    }}
                    className="fixed bottom-24 right-4 z-[9999] bg-stone-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl border border-stone-700 hover:bg-stone-800 transition-all"

                >
                    ⟲ Kembali ke Cover
                </button>
            )}
        </div>
    )
}