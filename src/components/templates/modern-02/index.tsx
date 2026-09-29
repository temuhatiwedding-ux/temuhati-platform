'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Volume2, VolumeX, MapPin, ArrowRight, Copy } from 'lucide-react'
import { InvitationData } from '@/types/invitation'
import Guestbook from './Guestbook'
import { useSearchParams } from 'next/navigation'
import { InstagramIcon } from '@/components/ui/InstagramIcon';


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


    // --- SCROLL ANIMATION OBSERVERS ---
    const countdownRef = useRef<HTMLDivElement>(null);
    const groomRef = useRef<HTMLDivElement>(null);
    const brideRef = useRef<HTMLDivElement>(null);

    const [showCountdown, setShowCountdown] = useState(false);
    const [showGroom, setShowGroom] = useState(false);
    const [showBride, setShowBride] = useState(false);

    useEffect(() => {
        const observerOptions = { threshold: 0.2 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.id === 'countdown-sec') setShowCountdown(true);
                    if (entry.target.id === 'groom-sec') setShowGroom(true);
                    if (entry.target.id === 'bride-sec') setShowBride(true);
                }
            });
        }, observerOptions);

        if (countdownRef.current) observer.observe(countdownRef.current);
        if (groomRef.current) observer.observe(groomRef.current);
        if (brideRef.current) observer.observe(brideRef.current);

        return () => observer.disconnect();
    }, []);

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

    useEffect(() => {
        // Ambil tanggal akad, gunakan fallback jika kosong
        const targetDate = new Date(events?.akad?.date ? `${events.akad.date}T08:00:00` : '2026-12-28T08:00:00').getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [events?.akad?.date]);

    // Ambil inisial huruf pertama
    const groomInitial = data.groom_name ? data.groom_name.charAt(0).toUpperCase() : 'H';
    const brideInitial = data.bride_name ? data.bride_name.charAt(0).toUpperCase() : 'A';

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
            {/* 1. Tambahkan h-[100dvh] dan flex flex-col di parent utama */}
            <div className="relative w-full h-[100dvh] flex flex-col bg-white">

                {/* Audio (Tetap sama) */}
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
                {/* 2. Ubah h-[55dvh] menjadi h-[55%] dan tambahkan shrink-0 */}
                <div className="relative w-full h-[55%] shrink-0 overflow-hidden">

                    <div
                        className="absolute top-0 right-0 w-full h-full flex flex-row-reverse transition-transform duration-[4000ms] ease-out"
                        style={{ transform: `translateX(${heroIndex * 100}%)` }}
                    >
                        {Array.from({ length: 60 }).map((_, idx) => (
                            <img
                                key={idx}
                                src={heroPhotos[idx % heroPhotos.length]}
                                alt={`Hero slide ${idx}`}
                                className="w-full h-full shrink-0 object-cover object-top"
                            />
                        ))}
                    </div>

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

                    <div className="absolute -bottom-1 w-full z-20 leading-none">
                        {/* Tambahkan preserveAspectRatio="none" dan ganti h-auto menjadi h-12 atau h-16 agar gelombang lebih ceper */}
                        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-12 md:h-24 drop-shadow-sm">
                            <path fill="#ffffff" fillOpacity="1" d="M0,160L80,149.3C160,139,320,117,480,128C640,139,800,181,960,186.7C1120,192,1280,160,1360,144L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
                        </svg>
                    </div>
                </div>

                {/* --- TEKS HERO BAWAH --- */}
                {/* 3. Ganti min-h-[45dvh] menjadi flex-1 (otomatis mengisi sisa layar), dan kurangi padding (py-12 -> py-6) agar teks tidak kepentok di HP layar kecil */}
                <div className="relative z-30 flex-1 flex flex-col items-center justify-center w-full px-6 py-6 text-center bg-white overflow-hidden">

                    {/* --- BACKGROUND BUNGA (Opacity 15% & FADE MASK) --- */}
                    {/* maskImage membuat 25% bagian atas bunga memudar (fade-out) halus sehingga garis lurus batas kontainer hilang total */}
                    <div
                        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
                        style={{
                            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)',
                            maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 100%)'
                        }}
                    >
                        <img
                            src="/templates/modern-02/flower.png"
                            alt="Flower Ornament"
                            className="w-[150%] h-auto opacity-15 transform rotate-12 object-contain"
                        />
                    </div>

                    <p
                        className={`relative z-10 text-xs uppercase tracking-[0.2em] text-slate-500 mb-4 ${(isOpened || isExiting) ? 'dramatic-reveal' : 'opacity-0'}`}
                        style={{ fontFamily: 'var(--font-playfair)', animationDelay: '400ms' }}
                    >
                        The Wedding of
                    </p>

                    <h2
                        className={`relative z-10 text-4xl text-slate-600 mb-6 uppercase ${(isOpened || isExiting) ? 'dramatic-reveal' : 'opacity-0'}`}
                        style={{ fontFamily: 'var(--font-playfair)', animationDelay: '800ms' }}
                    >
                        {data.groom_name} & {data.bride_name}
                    </h2>

                    <p
                        className={`relative z-10 text-sm font-bold tracking-[0.1em] text-slate-700 ${(isOpened || isExiting) ? 'dramatic-reveal' : 'opacity-0'}`}
                        style={{ animationDelay: '1200ms' }}
                    >
                        {events?.akad?.date ? events.akad.date.split('-').reverse().join('. ') : 'TANGGAL BELUM DIATUR'}
                    </p>

                </div>

            </div>

            {/* --- SECTION GABUNGAN: INISIAL, COUNTDOWN, & COUPLE --- */}
            <div className="w-full bg-white relative">

                <div className="bg-[#6C858D] rounded-tl-[5rem] rounded-br-[5rem] flex flex-col w-full relative z-20 overflow-hidden">

                    {/* --- A. INISIAL, COUNTDOWN & KUTIPAN --- */}
                    <div id="countdown-sec" ref={countdownRef} className="pt-16 pb-8 px-6 flex flex-col items-center text-white relative z-30">

                        {/* Inisial */}
                        <div className="flex items-center justify-center gap-6 mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                            <span
                                className={`text-6xl ${(isOpened || isExiting) && showCountdown ? 'dramatic-reveal' : 'opacity-0'}`}
                                style={{ animationDelay: '100ms' }}
                            >
                                {groomInitial}
                            </span>
                            <span
                                className={`text-5xl text-white/50 italic font-light ${(isOpened || isExiting) && showCountdown ? 'dramatic-reveal' : 'opacity-0'}`}
                                style={{ animationDelay: '300ms' }}
                            >
                                &
                            </span>
                            <span
                                className={`text-6xl ${(isOpened || isExiting) && showCountdown ? 'dramatic-reveal' : 'opacity-0'}`}
                                style={{ animationDelay: '100ms' }}
                            >
                                {brideInitial}
                            </span>
                        </div>

                        {/* Garis Pemisah */}
                        <div
                            className={`w-full max-w-[280px] h-[1px] bg-white/70 mb-8 origin-center transition-all duration-1000 ease-out ${(isOpened || isExiting) && showCountdown ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`}
                            style={{ transitionDelay: '400ms' }}
                        ></div>

                        {/* Countdown */}
                        <div className="flex items-center justify-between w-full max-w-[280px] mb-10">
                            {[
                                { label: 'Hari', value: timeLeft.days, delay: '500ms' },
                                { label: 'Jam', value: timeLeft.hours, delay: '600ms' },
                                { label: 'Menit', value: timeLeft.minutes, delay: '700ms' },
                                { label: 'Detik', value: timeLeft.seconds, delay: '800ms' },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className={`flex flex-col items-center ${(isOpened || isExiting) && showCountdown ? 'dramatic-reveal' : 'opacity-0'}`}
                                    style={{ animationDelay: item.delay }}
                                >
                                    <span className="text-2xl font-bold">{item.value}</span>
                                    <span className="text-[10px] tracking-wider uppercase mt-1">{item.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Kutipan */}
                        <div
                            className={`text-center text-xs leading-relaxed max-w-[320px] text-white/90 ${(isOpened || isExiting) && showCountdown ? 'dramatic-reveal' : 'opacity-0'}`}
                            style={{ animationDelay: '1000ms' }}
                        >
                            <p className="whitespace-pre-wrap break-words">
                                "{content?.quote || 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.'}"
                            </p>
                            <p className="mt-5 font-bold">
                                {content?.quote_source || '(Qs. Ar-Rum : 21)'}
                            </p>
                        </div>
                    </div>

                    {/* --- B. GROOM SECTION --- */}
                    <div id="groom-sec" ref={groomRef} className="relative w-full mt-2">
                        <div className="absolute bottom-0 left-0 w-full h-[70%] bg-white rounded-tr-[5rem]"></div>

                        {/* Foto Groom (Slide dari Kiri) */}
                        <div className={`relative z-10 w-[70%] max-w-[240px] pt-4 transition-all duration-1000 ease-out ${showGroom ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
                            <img src={content?.groomPhoto || `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/mempelai-pria.jpg`} alt="Groom" className="w-full aspect-[4/5] object-cover rounded-r-[4rem] shadow-xl" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/mempelai-pria.jpg`; }} />
                        </div>
                    </div>

                    <div className="bg-white relative z-10 px-8 pt-6 pb-10 w-full">
                        {/* Teks Groom (Naik dari bawah dengan delay) */}
                        <div className={`transition-all duration-1000 delay-300 ease-out ${showGroom ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <h3 className="text-3xl text-[#6C858D] mb-1.5" style={{ fontFamily: 'var(--font-playfair)' }}>
                                {content?.groom_details?.fullName || data.groom_name || 'Habib Yulianto'}
                            </h3>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-[85%]">
                                Putra {content?.groom_details?.order || 'Kedua'} dari <br />
                                Bapak {content?.groom_details?.fatherName || 'M. Dawam'} & Ibu {content?.groom_details?.motherName || 'Dewi Sudarwati'}
                            </p>
                            {content?.groom_details?.ig && (
                                <a href={`https://instagram.com/${content.groom_details.ig.replace('@', '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#6C858D] text-white mt-4 hover:scale-110 transition-transform shadow-sm">
                                    <InstagramIcon className="w-4 h-4" />
                                </a>
                            )}
                        </div>

                        {/* Ornamen Burung (Muncul perlahan) */}
                        <div className={`absolute top-1/2 right-[12%] z-20 flex flex-col gap-6 transition-all duration-[1500ms] delay-700 ${showGroom ? 'opacity-40 translate-x-0' : 'opacity-0 translate-x-6'}`}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#6C858D] ml-6 transform rotate-12"><path d="M22 10s-3-2-6-1-4 4-4 4-2-3-5-3-5 2-5 2 2-3 5-3 5 3 5 3 3-4 6-4 4 2 4 2z" /></svg>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-[#6C858D] transform -rotate-12"><path d="M22 10s-3-2-6-1-4 4-4 4-2-3-5-3-5 2-5 2 2-3 5-3 5 3 5 3 3-4 6-4 4 2 4 2z" /></svg>
                        </div>
                    </div>

                    {/* --- C. BRIDE SECTION --- */}
                    <div id="bride-sec" ref={brideRef} className="relative w-full">
                        <div className="absolute top-0 left-0 w-full h-[50%] bg-white rounded-bl-[5rem]"></div>

                        {/* Foto Bride (Slide dari Kanan) */}
                        <div className={`relative z-10 w-[70%] max-w-[240px] ml-auto transition-all duration-1000 ease-out ${showBride ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
                            <img src={content?.bridePhoto || `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/mempelai-wanita.jpg`} alt="Bride" className="w-full aspect-[4/5] object-cover rounded-l-[4rem] shadow-xl" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/mempelai-wanita.jpg`; }} />
                        </div>
                    </div>

                    <div className="relative z-10 px-8 pt-6 pb-12 w-full text-right flex flex-col items-end text-white">
                        {/* Teks Bride (Naik dari bawah dengan delay) */}
                        <div className={`transition-all duration-1000 delay-300 ease-out flex flex-col items-end ${showBride ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <h3 className="text-3xl text-white mb-1.5" style={{ fontFamily: 'var(--font-playfair)' }}>
                                {content?.bride_details?.fullName || data.bride_name || 'Adiba Putri Syakila'}
                            </h3>
                            <p className="text-[11px] text-white/80 font-medium leading-relaxed max-w-[85%]">
                                Putri {content?.bride_details?.order || 'Pertama'} dari <br />
                                Bapak {content?.bride_details?.fatherName || 'Anas Rifai'} & Ibu {content?.bride_details?.motherName || 'Kholifah'}
                            </p>
                            {content?.bride_details?.ig && (
                                <a href={`https://instagram.com/${content.bride_details.ig.replace('@', '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#6C858D] mt-4 hover:scale-110 transition-transform shadow-sm">
                                    <InstagramIcon className="w-4 h-4" />
                                </a>
                            )}
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