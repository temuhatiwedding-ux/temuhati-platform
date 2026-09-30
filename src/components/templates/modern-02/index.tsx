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

    // --- TAMBAHKAN REF & STATE UNTUK GALERI ---
    const galleryHeaderRef = useRef<HTMLDivElement>(null);
    const galleryVideoRef = useRef<HTMLDivElement>(null);
    const galleryPhotosRef = useRef<HTMLDivElement>(null);

    const [showGalleryHeader, setShowGalleryHeader] = useState(false);
    const [showGalleryVideo, setShowGalleryVideo] = useState(false);
    const [showGalleryPhotos, setShowGalleryPhotos] = useState(false);


    // --- SCROLL ANIMATION OBSERVERS ---
    const countdownRef = useRef<HTMLDivElement>(null);
    const groomRef = useRef<HTMLDivElement>(null);
    const brideRef = useRef<HTMLDivElement>(null);

    const [showCountdown, setShowCountdown] = useState(false);
    const [showGroom, setShowGroom] = useState(false);
    const [showBride, setShowBride] = useState(false);

    // --- Hapus eventRef & showEvent lama, ganti jadi 3 ini ---
    const eventHeaderRef = useRef<HTMLDivElement>(null);
    const akadCardRef = useRef<HTMLDivElement>(null);
    const resepsiCardRef = useRef<HTMLDivElement>(null);

    const [showEventHeader, setShowEventHeader] = useState(false);
    const [showAkadCard, setShowAkadCard] = useState(false);
    const [showResepsiCard, setShowResepsiCard] = useState(false);

    const loveStoryImgRef = useRef<HTMLDivElement>(null);
    const loveStoryTextRef = useRef<HTMLDivElement>(null);

    const [showLoveStoryImg, setShowLoveStoryImg] = useState(false);
    const [showLoveStoryText, setShowLoveStoryText] = useState(false);

    useEffect(() => {
        // Balikin threshold ke 0.2 karena sekarang kita pantau elemen yang ukurannya lebih kecil
        const observerOptions = { threshold: 0.2 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.id === 'countdown-sec') setShowCountdown(true);
                    if (entry.target.id === 'groom-sec') setShowGroom(true);
                    if (entry.target.id === 'bride-sec') setShowBride(true);

                    // --- Tambahkan pengecekan untuk 3 elemen baru ---
                    if (entry.target.id === 'event-header') setShowEventHeader(true);
                    if (entry.target.id === 'akad-card') setShowAkadCard(true);
                    if (entry.target.id === 'resepsi-card') setShowResepsiCard(true);
                    if (entry.target.id === 'lovestory-img') setShowLoveStoryImg(true);
                    if (entry.target.id === 'lovestory-text') setShowLoveStoryText(true);
                    if (entry.target.id === 'gallery-header') setShowGalleryHeader(true);
                    if (entry.target.id === 'gallery-video') setShowGalleryVideo(true);
                    if (entry.target.id === 'gallery-photos') setShowGalleryPhotos(true);
                }
            });
        }, observerOptions);

        if (countdownRef.current) observer.observe(countdownRef.current);
        if (groomRef.current) observer.observe(groomRef.current);
        if (brideRef.current) observer.observe(brideRef.current);

        // --- Daftarkan 3 elemen baru ke observer ---
        if (eventHeaderRef.current) observer.observe(eventHeaderRef.current);
        if (akadCardRef.current) observer.observe(akadCardRef.current);
        if (resepsiCardRef.current) observer.observe(resepsiCardRef.current);

        if (loveStoryImgRef.current) observer.observe(loveStoryImgRef.current);
        if (loveStoryTextRef.current) observer.observe(loveStoryTextRef.current);

        if (galleryHeaderRef.current) observer.observe(galleryHeaderRef.current);
        if (galleryVideoRef.current) observer.observe(galleryVideoRef.current);
        if (galleryPhotosRef.current) observer.observe(galleryPhotosRef.current);

        return () => observer.disconnect();
    }, [data?.content_data?.sections?.gallery?.videoUrl]);

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
    const formatEventDate = (dateString: string | undefined, manualDay: string | undefined) => {
        if (!dateString) return { day: manualDay || '-', date: '-', monthYear: '-' };
        const dateObj = new Date(dateString);

        // Auto-generate hari hanya dipakai sebagai cadangan (fallback) kalau manualDay kosong
        const autoDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

        return {
            // Gunakan manualDay dari form, kalau kosong baru pakai autoDays
            day: manualDay || autoDays[dateObj.getDay()],
            date: dateObj.getDate().toString(),
            monthYear: `${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`
        };
    };
    const akadDate = formatEventDate(events?.akad?.date, events?.akad?.day);
    const resepsiDate = formatEventDate(events?.resepsi?.date, events?.resepsi?.day);
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
            <div className="relative w-full h-[100dvh] flex flex-col bg-[#9BAAB0]">

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
                {/* Porsi foto kita besarkan jadi h-[68%] agar jauh lebih lega dan kepala tidak terpotong */}
                <div className="relative w-full h-[68%] shrink-0 overflow-hidden">

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
                        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-10 md:h-16 drop-shadow-sm">
                            <path fill="#ffffff" fillOpacity="1" d="M0,160L80,149.3C160,139,320,117,480,128C640,139,800,181,960,186.7C1120,192,1280,160,1360,144L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
                        </svg>
                    </div>
                </div>

                {/* --- TEKS HERO BAWAH --- */}
                {/* Teks mengisi sisa 32%. Padding (py) dan Margin (mb) dipadatkan agar sangat compact */}
                <div className="relative z-30 flex-1 flex flex-col items-center justify-center w-full px-4 py-2 text-center bg-white overflow-hidden">

                    {/* --- BACKGROUND BUNGA (Opacity 15% & FADE MASK) --- */}
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

                    {/* --- KONTEN TEKS COMPACT --- */}
                    <p
                        className={`relative z-10 text-[10px] md:text-xs uppercase tracking-[0.2em] text-slate-500 mb-2 ${(isOpened || isExiting) ? 'dramatic-reveal' : 'opacity-0'}`}
                        style={{ fontFamily: 'var(--font-playfair)', animationDelay: '400ms' }}
                    >
                        The Wedding of
                    </p>

                    <h2
                        className={`relative z-10 text-3xl md:text-4xl text-slate-600 mb-2 uppercase ${(isOpened || isExiting) ? 'dramatic-reveal' : 'opacity-0'}`}
                        style={{ fontFamily: 'var(--font-playfair)', animationDelay: '800ms' }}
                    >
                        {data.groom_name} & {data.bride_name}
                    </h2>

                    <p
                        className={`relative z-10 text-xs font-bold tracking-[0.1em] text-slate-700 ${(isOpened || isExiting) ? 'dramatic-reveal' : 'opacity-0'}`}
                        style={{ animationDelay: '1200ms' }}
                    >
                        {events?.akad?.date ? events.akad.date.split('-').reverse().join('. ') : 'TANGGAL BELUM DIATUR'}
                    </p>

                </div>

            </div>

            {/* --- SECTION GABUNGAN: INISIAL, COUNTDOWN, & COUPLE --- */}
            {/* Hapus warna background di sini, cukup relative */}
            <div className="w-full relative">

                {/* Background penyambung ke atas (putih untuk Hero) */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-white z-0"></div>

                {/* Background penyambung ke bawah (#96A8AD untuk Event) */}
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[#96A8AD] z-0"></div>

                {/* Kotak Utama Biru Gelap (di atas background penyambung) */}
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

                        {/* Foto Groom */}
                        <div
                            className={`relative z-10 w-[70%] max-w-[240px] pt-4 ${showGroom ? 'dramatic-reveal' : 'opacity-0'}`}
                            style={{ animationDelay: '100ms' }}
                        >
                            <img src={content?.groomPhoto || `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/mempelai-pria.jpg`} alt="Groom" className="w-full aspect-[4/5] object-cover rounded-r-[4rem] shadow-xl" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/mempelai-pria.jpg`; }} />
                        </div>
                    </div>

                    <div className="bg-white relative z-10 px-8 pt-6 pb-10 w-full">
                        {/* Teks Groom */}
                        <div
                            className={`${showGroom ? 'dramatic-reveal' : 'opacity-0'}`}
                            style={{ animationDelay: '400ms' }}
                        >
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

                        {/* Ornamen Burung */}
                        <div
                            className={`absolute top-1/2 right-[12%] z-20 flex flex-col gap-6 opacity-40 ${showGroom ? 'dramatic-reveal' : 'opacity-0'}`}
                            style={{ animationDelay: '700ms' }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#6C858D] ml-6 transform rotate-12"><path d="M22 10s-3-2-6-1-4 4-4 4-2-3-5-3-5 2-5 2 2-3 5-3 5 3 5 3 3-4 6-4 4 2 4 2z" /></svg>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-[#6C858D] transform -rotate-12"><path d="M22 10s-3-2-6-1-4 4-4 4-2-3-5-3-5 2-5 2 2-3 5-3 5 3 5 3 3-4 6-4 4 2 4 2z" /></svg>
                        </div>
                    </div>

                    {/* --- C. BRIDE SECTION --- */}
                    <div id="bride-sec" ref={brideRef} className="relative w-full">
                        <div className="absolute top-0 left-0 w-full h-[50%] bg-white rounded-bl-[5rem]"></div>

                        {/* Foto Bride */}
                        <div
                            className={`relative z-10 w-[70%] max-w-[240px] ml-auto ${showBride ? 'dramatic-reveal' : 'opacity-0'}`}
                            style={{ animationDelay: '100ms' }}
                        >
                            <img src={content?.bridePhoto || `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/mempelai-wanita.jpg`} alt="Bride" className="w-full aspect-[4/5] object-cover rounded-l-[4rem] shadow-xl" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/mempelai-wanita.jpg`; }} />
                        </div>
                    </div>

                    <div className="relative z-10 px-8 pt-6 pb-12 w-full text-right flex flex-col items-end text-white">
                        {/* Teks Bride */}
                        <div
                            className={`flex flex-col items-end ${showBride ? 'dramatic-reveal' : 'opacity-0'}`}
                            style={{ animationDelay: '400ms' }}
                        >
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

            {/* --- EVENT SECTION --- */}
            <div className="w-full bg-[#9BAAB0] py-16 px-6 relative z-10 overflow-hidden">

                {/* Header Event (Durasi diperlambat ke 2500ms) */}
                <div id="event-header" ref={eventHeaderRef} className={`text-center text-white mb-12 transition-all duration-[2500ms] ease-out ${showEventHeader ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                    <style>
                        {`@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');`}
                    </style>
                    <h2 className="text-[5rem] mb-2 font-normal leading-none" style={{ fontFamily: "'Great Vibes', cursive" }}>Wedding</h2>
                    <p className="text-xs tracking-[0.4em] uppercase font-light mt-2">E v e n t</p>
                </div>

                {/* KARTU 1: AKAD NIKAH (Durasi diperlambat ke 2500ms) */}
                <div id="akad-card" ref={akadCardRef} className={`w-full max-w-[320px] mx-auto bg-white mb-12 shadow-xl rounded-tl-[4rem] overflow-hidden transition-all duration-[2500ms] ease-out ${showAkadCard ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>

                    {/* Foto Zoom (Diperlambat drastis ke 5000ms) */}
                    <div className="w-full h-[250px] overflow-hidden">
                        <img
                            src={content?.akadPhoto || `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/galeri-1.jpg`}
                            alt="Akad Nikah"
                            className={`w-full h-full object-cover transition-transform duration-[5000ms] ease-out ${showAkadCard ? 'scale-100' : 'scale-110'}`}
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/galeri-1.jpg`; }}
                        />
                    </div>

                    <div className="flex h-full">
                        <div className="w-16 bg-[#5A7178] flex items-center justify-center shrink-0">
                            <span className="transform -rotate-90 text-white text-3xl font-serif whitespace-nowrap tracking-wider" style={{ fontFamily: 'var(--font-playfair)' }}>
                                Akad Nikah
                            </span>
                        </div>

                        <div className="flex-1 p-5 bg-white">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-5xl text-[#5A7178] font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                                    {akadDate.date}
                                </span>
                                <div className="text-xs text-slate-500 leading-tight">
                                    <p className="font-bold text-slate-700">{akadDate.day}</p>
                                    <p>{akadDate.monthYear}</p>
                                </div>
                            </div>
                            <hr className="border-slate-400 mb-4" />
                            <p className="text-[10px] text-slate-600 mb-4 font-medium">Pukul : {events?.akad?.time || '08.00 WIB'}</p>
                            <h4 className="text-[#5A7178] text-sm font-bold mb-2">Lokasi Acara</h4>
                            <p className="text-[10px] text-slate-600 mb-6 leading-relaxed">
                                <span className="font-bold">Tempat : </span>
                                {events?.akad?.location || 'Kediaman Mempelai Wanita, Ds Pagu, Wates, Kediri, Jawa Timur'}
                            </p>
                            {events?.akad?.mapUrl && (
                                <a href={events.akad.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1.5 bg-[#7B959A] text-white px-4 py-2 rounded-full text-[10px] font-bold hover:bg-[#5A7178] transition-colors shadow-sm">
                                    <MapPin className="w-3 h-3" />
                                    Lihat Lokasi
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* KARTU 2: RESEPSI (Durasi diperlambat ke 2500ms) */}
                <div id="resepsi-card" ref={resepsiCardRef} className={`w-full max-w-[320px] mx-auto bg-white mb-8 shadow-xl rounded-tr-[4rem] overflow-hidden transition-all duration-[2500ms] ease-out ${showResepsiCard ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>

                    {/* Foto Zoom (Diperlambat drastis ke 5000ms) */}
                    <div className="w-full h-[250px] overflow-hidden">
                        <img
                            src={content?.resepsiPhoto || `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/galeri-2.jpg`}
                            alt="Resepsi"
                            className={`w-full h-full object-cover transition-transform duration-[5000ms] ease-out ${showResepsiCard ? 'scale-100' : 'scale-110'}`}
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/galeri-2.jpg`; }}
                        />
                    </div>

                    <div className="flex h-full">
                        <div className="flex-1 p-5 bg-white">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-5xl text-[#5A7178] font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                                    {resepsiDate.date}
                                </span>
                                <div className="text-xs text-slate-500 leading-tight">
                                    <p className="font-bold text-slate-700">{resepsiDate.day}</p>
                                    <p>{resepsiDate.monthYear}</p>
                                </div>
                            </div>
                            <hr className="border-slate-400 mb-4" />
                            <p className="text-[10px] text-slate-600 mb-4 font-medium">Pukul : {events?.resepsi?.time || '10.00 WIB - Selesai'}</p>
                            <h4 className="text-[#5A7178] text-sm font-bold mb-2">Lokasi Acara</h4>
                            <p className="text-[10px] text-slate-600 mb-6 leading-relaxed">
                                <span className="font-bold">Tempat : </span>
                                {events?.resepsi?.location || 'Kediaman Mempelai Wanita, Ds Pagu, Wates, Kediri, Jawa Timur'}
                            </p>
                            {events?.resepsi?.mapUrl && (
                                <a href={events.resepsi.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1.5 bg-[#7B959A] text-white px-4 py-2 rounded-full text-[10px] font-bold hover:bg-[#5A7178] transition-colors shadow-sm">
                                    <MapPin className="w-3 h-3" />
                                    Lihat Lokasi
                                </a>
                            )}
                        </div>

                        <div className="w-16 bg-[#5A7178] flex items-center justify-center shrink-0">
                            <span className="transform rotate-90 text-white text-3xl font-serif whitespace-nowrap tracking-wider" style={{ fontFamily: 'var(--font-playfair)' }}>
                                Resepsi
                            </span>
                        </div>
                    </div>
                </div>

            </div>

            {/* --- LIVE STREAMING SECTION --- */}
            {/* Hapus pengecekan URL di sini, dan set default true agar selalu muncul sebelum di-toggle off */}
            {content?.live_stream?.enabled !== false && (
                <div className="relative w-full py-16 px-6 flex flex-col items-center justify-center overflow-hidden">

                    {/* Background Image dengan efek gelap (Cinematic) */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src={content?.bgPhoto || content?.heroPhotos?.[0] || `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/galeri-1.jpg`}
                            alt="Live Stream Background"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-[#3A4A50]/80 mix-blend-multiply"></div>
                        <div className="absolute inset-0 bg-black/40"></div>
                    </div>

                    {/* Konten Utama */}
                    <div className="relative z-10 w-full max-w-2xl mx-auto text-center text-white">
                        <h2 className="text-5xl font-serif mb-6 drop-shadow-md" style={{ fontFamily: 'var(--font-playfair)' }}>
                            Live Streaming
                        </h2>

                        <p className="text-xs md:text-sm text-white/90 max-w-md mx-auto leading-relaxed mb-6 drop-shadow">
                            Kami mengundang Bapak/Ibu/Saudara/i untuk menyaksikan pernikahan kami secara virtual yang disiarkan langsung melalui media di bawah ini:
                        </p>

                        <div className="mb-8 text-sm font-bold tracking-widest drop-shadow-md">
                            <p className="uppercase">{akadDate.day}, {akadDate.date} {akadDate.monthYear}</p>
                            <p className="mt-1">Pukul : {events?.akad?.time || '08.00 WIB'}</p>
                        </div>

                        {/* Video Iframe Container */}
                        <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-white/20 aspect-video relative bg-slate-900 flex items-center justify-center backdrop-blur-sm">

                            {/* Pasang link YouTube dummy sebagai fallback kalau url kosong */}
                            {getYouTubeEmbedUrl(content?.live_stream?.url || 'https://www.youtube.com/watch?v=7b7_x0aOQTw') ? (
                                <iframe
                                    className="absolute top-0 left-0 w-full h-full"
                                    src={getYouTubeEmbedUrl(content?.live_stream?.url || 'https://www.youtube.com/watch?v=7b7_x0aOQTw') || ''}
                                    title="YouTube Live Stream"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <p className="text-sm text-white/50 font-medium">Link YouTube tidak valid.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* --- LOVE STORY SECTION --- */}
            {content?.love_story?.enabled !== false && (
                <div className="w-full bg-white py-16 px-6 flex flex-col items-center overflow-hidden">
                    {/* Tambahkan overflow-hidden pada wadah utama agar efek melayang tidak membuat scroll berantakan */}

                    {/* BAGIAN 1: FOTO UTAMA & JUDUL (Punya animasi sendiri) */}
                    <div
                        id="lovestory-img"
                        ref={loveStoryImgRef}
                        className={`relative w-full max-w-[340px] mx-auto aspect-[3/4] rounded-[2rem] overflow-hidden mb-12 shadow-lg transition-all duration-[2500ms] ease-out ${showLoveStoryImg ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
                    >
                        {/* Efek Slow Zoom di dalam foto */}
                        <img
                            src={content?.loveStoryPhoto || `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/galeri-2.jpg`}
                            alt="Love Story"
                            className={`w-full h-full object-cover transition-transform duration-[5000ms] ease-out ${showLoveStoryImg ? 'scale-100' : 'scale-110'}`}
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/galeri-2.jpg`; }}
                        />

                        {/* Gradient gelap di bawah agar teks terbaca jelas */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                        <div className="absolute bottom-6 left-0 w-full text-center">
                            <h2 className="text-4xl md:text-5xl text-white font-serif tracking-widest drop-shadow-md" style={{ fontFamily: 'var(--font-playfair)' }}>
                                LOVE STORY
                            </h2>
                        </div>
                    </div>

                    {/* BAGIAN 2: LIST CERITA (Punya animasi terpisah) */}
                    <div
                        id="lovestory-text"
                        ref={loveStoryTextRef}
                        className={`w-full max-w-md mx-auto space-y-8 text-center px-2 transition-all duration-[2500ms] ease-out delay-150 ${showLoveStoryText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                    >
                        {content?.love_story?.stories && content.love_story.stories.length > 0 && content.love_story.stories[0].year !== '' ? (
                            content.love_story.stories.map((story, index) => (
                                <div key={index} className="space-y-3">
                                    <h3 className="text-lg font-bold text-[#7B959A]">
                                        {story.year}
                                    </h3>
                                    <p className="text-[11px] md:text-xs text-slate-600 leading-relaxed">
                                        {story.text}
                                    </p>
                                </div>
                            ))
                        ) : (
                            // Placeholder Default
                            <>
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-[#7B959A]">Awal Cerita</h3>
                                    <p className="text-[11px] md:text-xs text-slate-600 leading-relaxed">
                                        Berawal dari pertemuan sederhana, kami saling mengenal dan mulai berbagi banyak cerita. Tanpa disadari, kebersamaan itu tumbuh menjadi rasa nyaman yang semakin kuat dari hari ke hari.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-[#7B959A]">Lamaran</h3>
                                    <p className="text-[11px] md:text-xs text-slate-600 leading-relaxed">
                                        Dengan niat yang tulus dan restu keluarga, kami memutuskan untuk melangkah ke tahap yang lebih serius. Momen lamaran menjadi awal dari perjalanan baru yang penuh harapan dan doa baik.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-[#7B959A]">Pernikahan</h3>
                                    <p className="text-[11px] md:text-xs text-slate-600 leading-relaxed">
                                        Kini kami sampai pada hari yang kami nantikan, hari di mana dua hati dipersatukan dalam ikatan suci pernikahan. Semoga langkah ini menjadi awal kehidupan baru yang penuh cinta, kebahagiaan, dan keberkahan.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* --- GALLERY SECTION --- */}
            {content?.sections?.gallery?.enabled !== false && (
                <div className="w-full bg-[#7B959A] py-16 px-6 flex flex-col items-center overflow-hidden">

                    {/* BAGIAN 1: HEADER (Muncul duluan) */}
                    <div
                        id="gallery-header"
                        ref={galleryHeaderRef}
                        className={`text-center text-white mb-10 transition-all duration-[2500ms] ease-out ${showGalleryHeader ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                    >
                        <h2 className="text-5xl md:text-6xl mb-1 font-normal leading-none" style={{ fontFamily: "'Great Vibes', cursive" }}>Our</h2>
                        <p className="text-sm md:text-base tracking-[0.4em] uppercase font-serif mt-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                            G a l l e r y
                        </p>
                    </div>

                    {/* BAGIAN 2: VIDEO YOUTUBE (Opsional, muncul menyusul) */}
                    {content?.sections?.gallery?.videoUrl && (
                        <div
                            id="gallery-video"
                            ref={galleryVideoRef}
                            className={`w-full max-w-2xl mx-auto mb-4 transition-all duration-[2500ms] ease-out delay-300 ${showGalleryVideo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                        >
                            <div className="w-full rounded-2xl overflow-hidden shadow-xl aspect-video relative bg-slate-900 flex items-center justify-center">
                                {getYouTubeEmbedUrl(content.sections.gallery.videoUrl) ? (
                                    <iframe
                                        className="absolute top-0 left-0 w-full h-full"
                                        src={getYouTubeEmbedUrl(content.sections.gallery.videoUrl) || ''}
                                        title="YouTube Gallery Video"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <p className="text-sm text-white/50 font-medium">Link Video tidak valid.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* BAGIAN 3: FOTO-FOTO GALERI (Muncul belakangan) */}
                    <div
                        id="gallery-photos"
                        ref={galleryPhotosRef}
                        className={`w-full max-w-2xl mx-auto space-y-4 transition-all duration-[2500ms] ease-out delay-500 ${showGalleryPhotos ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                    >
                        {content?.sections?.gallery?.photos && content.sections.gallery.photos.length > 0 ? (
                            content.sections.gallery.photos.map((photoUrl: string, index: number) => (
                                <div key={index} className="w-full rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src={photoUrl}
                                        alt={`Gallery ${index + 1}`}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            ))
                        ) : (
                            // Placeholder Default dari R2
                            <>
                                <div className="w-full rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/galeri-1.jpg`}
                                        alt="Gallery 1"
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                                <div className="w-full rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/galeri-2.jpg`}
                                        alt="Gallery 2"
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            </>
                        )}
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