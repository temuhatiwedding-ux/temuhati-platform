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
    const [visiblePhotos, setVisiblePhotos] = useState<Record<string, boolean>>({});

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

    const giftHeaderRef = useRef<HTMLDivElement>(null);
    const [showGiftHeader, setShowGiftHeader] = useState(false);
    const [isGiftOpen, setIsGiftOpen] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const closingTextRef = useRef<HTMLDivElement>(null);
    const [showClosingText, setShowClosingText] = useState(false);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    useEffect(() => {
        const observerOptions = { threshold: 0.2 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.id === 'countdown-sec') setShowCountdown(true);
                    if (entry.target.id === 'groom-sec') setShowGroom(true);
                    if (entry.target.id === 'bride-sec') setShowBride(true);
                    if (entry.target.id === 'event-header') setShowEventHeader(true);
                    if (entry.target.id === 'akad-card') setShowAkadCard(true);
                    if (entry.target.id === 'resepsi-card') setShowResepsiCard(true);
                    if (entry.target.id === 'lovestory-img') setShowLoveStoryImg(true);
                    if (entry.target.id === 'lovestory-text') setShowLoveStoryText(true);
                    if (entry.target.id === 'gallery-header') setShowGalleryHeader(true);
                    if (entry.target.id === 'gallery-video') setShowGalleryVideo(true);
                    if (entry.target.id === 'gallery-photos') setShowGalleryPhotos(true);
                    if (entry.target.id === 'gift-header') setShowGiftHeader(true);
                    const photoIdx = entry.target.getAttribute('data-photo-index');
                    if (photoIdx) {
                        setVisiblePhotos(prev => ({ ...prev, [photoIdx]: true }));

                    }
                    if (entry.target.id === 'closing-text') setShowClosingText(true);
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
        if (galleryHeaderRef.current) observer.observe(galleryHeaderRef.current);
        if (galleryVideoRef.current) observer.observe(galleryVideoRef.current);
        if (giftHeaderRef.current) observer.observe(giftHeaderRef.current);
        if (closingTextRef.current) observer.observe(closingTextRef.current);

        const photoElements = document.querySelectorAll('[data-photo-index]');
        photoElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();

        // 👇 Update juga kurung sikunya biar foto baru langsung dipantau
    }, [data?.content_data?.sections?.gallery?.videoUrl, data?.content_data?.sections?.gallery?.photos]);

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const shortCode = searchParams.get('c')

    useEffect(() => {
        const markAsOpened = async () => {
            if (shortCode) {
                await supabase.from('guest_list').update({ is_opened: true }).eq('short_code', shortCode)
            }
        }
        markAsOpened()
    }, [shortCode])



    const content = data.content_data || {}

    const defaultMusic = `${process.env.NEXT_PUBLIC_R2_URL}/master-music/laksana-surgaku.mp3`
    const musicUrl = content.musicUrl || defaultMusic

    const colors = content?.theme_colors || {
        primary: '#7B959A',
        secondary: '#F3F5F4',
        accent: '#D1E0D7',
        text: '#ffffff',
        textDark: '#2F3E40'
    };

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
        `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/galeri-1.jpg`,
        `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/galeri-2.jpg`,
        `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/galeri-3.jpg`,
        `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/galeri-4.jpg`,
        `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/galeri-5.jpg`,
    ]

    const themeColor = "#18181b" // zinc-900 untuk modern minimalis
    const coverImage = content.coverPhoto || `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/cover.jpg`
    const groomPhoto = content.groomPhoto || `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/mempelai-pria.jpg`
    const bridePhoto = content.bridePhoto || `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/mempelai-wanita.jpg`
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
            }, 5000)

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
        <div
            className={`w-full max-w-[430px] mx-auto relative bg-white shadow-2xl text-zinc-900 font-sans selection:bg-slate-500 selection:text-[var(--color-text)] ${!isOpened ? 'h-[100dvh] overflow-hidden' : 'min-h-screen'}`}
            // 👇 TAMBAHIN INJEKSI WARNA DI SINI
            style={{
                '--color-primary': colors.primary,
                '--color-secondary': colors.secondary,
                '--color-accent': colors.accent,
                '--color-text': colors.text,
                '--color-text-dark': colors.textDark // 👈 INJEKSI BARU
            } as React.CSSProperties}
        >


            {/* --- 1. COVER SECTION --- */}
            {!isOpened && (
                <div
                    className={`absolute top-0 left-0 w-full h-[100dvh] z-[100] flex flex-col justify-end bg-[color:var(--color-secondary)] text-[color:var(--color-text)] overflow-hidden font-sans transition-transform duration-[800ms] ease-in-out ${isExiting ? '-translate-y-full' : 'translate-y-0'}`}
                >
                    <img src={coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute bottom-0 w-full h-[60%] bg-gradient-to-t from-black via-black/80 to-transparent" />
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
                            className="w-max bg-[color:var(--color-primary)] backdrop-blur-sm border border-[color:var(--color-accent)] text-[color:var(--color-text)] font-medium text-sm py-2.5 px-6 rounded-full hover:opacity-80 transition-all cover-animate cover-delay-500"
                        >
                            Buka Undangan
                        </button>
                    </div>
                </div>
            )}




            {/* --- 2. MAIN CONTENT --- */}
            {/* 1. Tambahkan h-[100dvh] dan flex flex-col di parent utama */}
            <div className="relative w-full h-[100dvh] flex flex-col bg-[color:var(--color-secondary)]">

                {/* Audio (Tetap sama) */}
                {musicUrl && isOpened && (
                    <>
                        <audio ref={audioRef} autoPlay loop className="hidden" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}>
                            <source src={musicUrl} type="audio/mpeg" />
                        </audio>
                        <button onClick={toggleMusic} className="fixed bottom-6 right-6 z-50 p-4 bg-[color:var(--color-primary)]/80 backdrop-blur-md border border-[color:var(--color-accent)]/20 text-[color:var(--color-text)] rounded-full shadow-xl hover:scale-95 transition-transform flex items-center justify-center">
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
                            <path
                                fill="var(--color-secondary)"
                                fillOpacity="1"
                                d="M0,160L80,149.3C160,139,320,117,480,128C640,139,800,181,960,186.7C1120,192,1280,160,1360,144L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
                            ></path>
                        </svg>
                    </div>
                </div>

                {/* --- TEKS HERO BAWAH --- */}

                <div className="relative z-30 flex-1 flex flex-col items-center justify-center w-full px-4 py-2 text-center bg-[color:var(--color-secondary)] overflow-hidden">


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
                        className={`relative z-10 text-[10px] md:text-xs uppercase tracking-[0.2em] text-[color:var(--color-primary)] mb-2 ${(isOpened || isExiting) ? 'dramatic-reveal' : 'opacity-0'}`}
                        style={{ fontFamily: 'var(--font-playfair)', animationDelay: '400ms' }}
                    >
                        The Wedding of
                    </p>

                    <h2
                        className={`relative z-10 text-3xl md:text-4xl text-[color:var(--color-primary)] mb-2 uppercase ${(isOpened || isExiting) ? 'dramatic-reveal' : 'opacity-0'}`}
                        style={{ fontFamily: 'var(--font-playfair)', animationDelay: '800ms' }}
                    >
                        {data.groom_name} & {data.bride_name}
                    </h2>

                    <p
                        className={`relative z-10 text-xs font-bold tracking-[0.1em] text-[color:var(--color-textDark)] ${(isOpened || isExiting) ? 'dramatic-reveal' : 'opacity-0'}`}
                        style={{ animationDelay: '1200ms' }}
                    >
                        {events?.akad?.date ? events.akad.date.split('-').reverse().join('. ') : 'TANGGAL BELUM DIATUR'}
                    </p>

                </div>

            </div>



            {/* --- SECTION GABUNGAN: INISIAL, COUNTDOWN, & COUPLE --- */}

            <div className="w-full relative">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-[color:var(--color-secondary)] z-0"></div>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[color:var(--color-primary)] z-0"></div>


                <div className="bg-[color:var(--color-primary)] rounded-tl-[5rem] rounded-br-[5rem] flex flex-col w-full relative z-20 overflow-hidden">


                    <div id="countdown-sec" ref={countdownRef} className="pt-16 pb-8 px-6 flex flex-col items-center text-[color:var(--color-text)] relative z-30">

                        {/* Inisial */}
                        <div className="flex items-center justify-center gap-6 mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                            <span
                                className={`text-6xl ${(isOpened || isExiting) && showCountdown ? 'dramatic-reveal' : 'opacity-0'}`}
                                style={{ animationDelay: '100ms' }}
                            >
                                {groomInitial}
                            </span>
                            <span
                                className={`text-5xl text-[color:var(--color-text)]/50 italic font-light ${(isOpened || isExiting) && showCountdown ? 'dramatic-reveal' : 'opacity-0'}`}
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
                            className={`w-full max-w-[280px] h-[1px] bg-[color:var(--color-accent)]/70 mb-8 origin-center transition-all duration-1000 ease-out ${(isOpened || isExiting) && showCountdown ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`}
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
                            className={`text-center text-xs leading-relaxed max-w-[320px] text-[color:var(--color-text)]/90 ${(isOpened || isExiting) && showCountdown ? 'dramatic-reveal' : 'opacity-0'}`}
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
                        <div className="absolute bottom-0 left-0 w-full h-[70%] bg-[color:var(--color-secondary)] rounded-tr-[5rem]"></div>

                        {/* Foto Groom */}
                        <div
                            className={`relative z-10 w-[70%] max-w-[240px] pt-4 ${showGroom ? 'dramatic-reveal' : 'opacity-0'}`}
                            style={{ animationDelay: '100ms' }}
                        >
                            <img src={content?.groomPhoto || `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/mempelai-pria.jpg`} alt="Groom" className="w-full aspect-[4/5] object-cover rounded-r-[4rem] shadow-xl" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/mempelai-pria.jpg`; }} />
                        </div>
                    </div>

                    <div className="bg-[color:var(--color-secondary)] relative z-10 px-8 pt-6 pb-10 w-full">
                        {/* Teks Groom */}
                        <div
                            className={`${showGroom ? 'dramatic-reveal' : 'opacity-0'}`}
                            style={{ animationDelay: '400ms' }}
                        >
                            <h3 className="text-3xl text-[color:var(--color-primary)] mb-1.5" style={{ fontFamily: 'var(--font-playfair)' }}>
                                {content?.groom_details?.fullName || data.groom_name || 'Habib Yulianto'}
                            </h3>
                            <p className="text-[11px] text-[color:var(--color-primary)] font-medium leading-relaxed max-w-[85%]">
                                Putra {content?.groom_details?.order || 'Kedua'} dari <br />
                                Bapak {content?.groom_details?.fatherName || 'M. Dawam'} & Ibu {content?.groom_details?.motherName || 'Dewi Sudarwati'}
                            </p>
                            {content?.groom_details?.ig && (
                                <a href={`https://instagram.com/${content.groom_details.ig.replace('@', '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[color:var(--color-primary)] text-[color:var(--color-text)] mt-4 hover:scale-110 transition-transform shadow-sm">
                                    <InstagramIcon className="w-4 h-4" />
                                </a>
                            )}
                        </div>

                        {/* Ornamen Burung */}
                        <div
                            className={`absolute top-1/2 right-[12%] z-20 flex flex-col gap-6 opacity-40 ${showGroom ? 'dramatic-reveal' : 'opacity-0'}`}
                            style={{ animationDelay: '700ms' }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-primary)" className="ml-6 transform rotate-12"><path d="M22 10s-3-2-6-1-4 4-4 4-2-3-5-3-5 2-5 2 2-3 5-3 5 3 5 3 3-4 6-4 4 2 4 2z" /></svg>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--color-primary)" className="transform -rotate-12"><path d="M22 10s-3-2-6-1-4 4-4 4-2-3-5-3-5 2-5 2 2-3 5-3 5 3 5 3 3-4 6-4 4 2 4 2z" /></svg>
                        </div>
                    </div>

                    {/* --- C. BRIDE SECTION --- */}
                    <div id="bride-sec" ref={brideRef} className="relative w-full">
                        <div className="absolute top-0 left-0 w-full h-[50%] bg-[color:var(--color-secondary)] rounded-bl-[5rem]"></div>

                        {/* Foto Bride */}
                        <div
                            className={`relative z-10 w-[70%] max-w-[240px] ml-auto ${showBride ? 'dramatic-reveal' : 'opacity-0'}`}
                            style={{ animationDelay: '100ms' }}
                        >
                            <img src={content?.bridePhoto || `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/mempelai-wanita.jpg`} alt="Bride" className="w-full aspect-[4/5] object-cover rounded-l-[4rem] shadow-xl" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/mempelai-wanita.jpg`; }} />
                        </div>
                    </div>

                    <div className="relative z-10 px-8 pt-6 pb-12 w-full text-right flex flex-col items-end text-[color:var(--color-text)]">
                        {/* Teks Bride */}
                        <div
                            className={`flex flex-col items-end ${showBride ? 'dramatic-reveal' : 'opacity-0'}`}
                            style={{ animationDelay: '400ms' }}
                        >
                            <h3 className="text-3xl text-[color:var(--color-text)] mb-1.5" style={{ fontFamily: 'var(--font-playfair)' }}>
                                {content?.bride_details?.fullName || data.bride_name || 'Adiba Putri Syakila'}
                            </h3>
                            <p className="text-[11px] text-[color:var(--color-text)]/80 font-medium leading-relaxed max-w-[85%]">
                                Putri {content?.bride_details?.order || 'Pertama'} dari <br />
                                Bapak {content?.bride_details?.fatherName || 'Anas Rifai'} & Ibu {content?.bride_details?.motherName || 'Kholifah'}
                            </p>
                            {content?.bride_details?.ig && (
                                <a href={`https://instagram.com/${content.bride_details.ig.replace('@', '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[color:var(--color-secondary)] text-[color:var(--color-primary)] mt-4 hover:scale-110 transition-transform shadow-sm">
                                    <InstagramIcon className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>


            {/* --- EVENT SECTION --- */}
            <div className="w-full bg-[color:var(--color-primary)] py-16 px-6 relative z-10 overflow-hidden">

                {/* Header Event) */}
                <div id="event-header" ref={eventHeaderRef} className={`text-center text-[var(--color-text)] mb-12 transition-all duration-[2500ms] ease-out ${showEventHeader ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                    <style>
                        {`@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');`}
                    </style>
                    <h2 className="text-[5rem] mb-2 font-normal leading-none" style={{ fontFamily: "'Great Vibes', cursive" }}>Wedding</h2>
                    <p className="text-xs tracking-[0.4em] uppercase font-light mt-2">E v e n t</p>
                </div>

                {/* KARTU 1: AKAD NIKAH  */}
                <div id="akad-card" ref={akadCardRef} className={`w-full max-w-[320px] mx-auto bg-white mb-12 shadow-xl rounded-tl-[4rem] overflow-hidden transition-all duration-[2500ms] ease-out ${showAkadCard ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>

                    {/* Foto Zoom  */}
                    <div className="w-full h-[250px] overflow-hidden">
                        <img
                            src={content?.akadPhoto || `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/galeri-1.jpg`}
                            alt="Akad Nikah"
                            className={`w-full h-full object-cover transition-transform duration-[5000ms] ease-out ${showAkadCard ? 'scale-100' : 'scale-110'}`}
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/galeri-1.jpg`; }}
                        />
                    </div>

                    <div className="flex h-full">
                        <div className="w-16 bg-[color:var(--color-primary)] flex items-center justify-center shrink-0">
                            <span className="transform -rotate-90 text-[var(--color-text)] text-3xl font-serif whitespace-nowrap tracking-wider" style={{ fontFamily: 'var(--font-playfair)' }}>
                                Akad Nikah
                            </span>
                        </div>

                        <div className="flex-1 p-5 bg-white">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-5xl text-[color:var(--color-primary)] font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                                    {akadDate.date}
                                </span>
                                <div className="text-xs text-slate-500 leading-tight">
                                    <p className="font-bold text-slate-700">{akadDate.day}</p>
                                    <p>{akadDate.monthYear}</p>
                                </div>
                            </div>
                            <hr className="border-slate-400 mb-4" />
                            <p className="text-[10px] text-slate-600 mb-4 font-medium">Pukul : {events?.akad?.time || '08.00 WIB'}</p>
                            <h4 className="text-[color:var(--color-primary)] text-sm font-bold mb-2">Lokasi Acara</h4>

                            {/* 👇 Bagian Lokasi Ditambahin whitespace-pre-line */}
                            <p className="text-[10px] text-slate-600 mb-6 leading-relaxed">
                                <span className="font-bold block mb-1">Tempat : </span>
                                <span className="whitespace-pre-line">{events?.akad?.location || 'Kediaman Mempelai Wanita, Ds Pagu, Wates, Kediri, Jawa Timur'}</span>
                            </p>

                            {events?.akad?.mapUrl && (
                                <a href={events.akad.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1.5 bg-[color:var(--color-primary)] text-[color:var(--color-text)] px-4 py-2 rounded-full text-[10px] font-bold hover:bg-[color:var(--color-primary)] transition-colors shadow-sm">
                                    <MapPin className="w-3 h-3" />
                                    Lihat Lokasi
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* KARTU 2: RESEPSI  */}
                <div id="resepsi-card" ref={resepsiCardRef} className={`w-full max-w-[320px] mx-auto bg-white mb-8 shadow-xl rounded-tr-[4rem] overflow-hidden transition-all duration-[2500ms] ease-out ${showResepsiCard ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>

                    {/* Foto Zoom  */}
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
                                <span className="text-5xl text-[color:var(--color-primary)] font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                                    {resepsiDate.date}
                                </span>
                                <div className="text-xs text-slate-500 leading-tight">
                                    <p className="font-bold text-slate-700">{resepsiDate.day}</p>
                                    <p>{resepsiDate.monthYear}</p>
                                </div>
                            </div>
                            <hr className="border-slate-400 mb-4" />
                            <p className="text-[10px] text-slate-600 mb-4 font-medium">Pukul : {events?.resepsi?.time || '10.00 WIB - Selesai'}</p>
                            <h4 className="text-[color:var(--color-primary)] text-sm font-bold mb-2">Lokasi Acara</h4>

                            {/* 👇 Bagian Lokasi Ditambahin whitespace-pre-line */}
                            <p className="text-[10px] text-slate-600 mb-6 leading-relaxed">
                                <span className="font-bold block mb-1">Tempat : </span>
                                <span className="whitespace-pre-line">{events?.resepsi?.location || 'Kediaman Mempelai Wanita, Ds Pagu, Wates, Kediri, Jawa Timur'}</span>
                            </p>

                            {events?.resepsi?.mapUrl && (
                                <a href={events.resepsi.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1.5 bg-[color:var(--color-primary)] text-[color:var(--color-text)] px-4 py-2 rounded-full text-[10px] font-bold hover:bg-[color:var(--color-primary)] transition-colors shadow-sm">
                                    <MapPin className="w-3 h-3" />
                                    Lihat Lokasi
                                </a>
                            )}
                        </div>

                        <div className="w-16 bg-[color:var(--color-primary)] flex items-center justify-center shrink-0">
                            <span className="transform rotate-90 text-[var(--color-text)] text-3xl font-serif whitespace-nowrap tracking-wider" style={{ fontFamily: 'var(--font-playfair)' }}>
                                Resepsi
                            </span>
                        </div>
                    </div>
                </div>

            </div>



            {/* --- LIVE STREAMING SECTION --- */}

            {content?.live_stream?.enabled !== false && (
                <div className="relative w-full py-16 px-6 flex flex-col items-center justify-center overflow-hidden">

                    <div className="absolute inset-0 z-0">
                        <img
                            src={content?.bgPhoto || content?.heroPhotos?.[0] || `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/galeri-1.jpg`}
                            alt="Live Stream Background"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-[color:var(--color-primary)]/80 mix-blend-multiply"></div>
                        <div className="absolute inset-0 bg-black/40"></div>
                    </div>

                    {/* Konten Utama */}
                    <div className="relative z-10 w-full max-w-2xl mx-auto text-center text-[var(--color-text)]">
                        <h2 className="text-5xl font-serif mb-6 drop-shadow-md" style={{ fontFamily: 'var(--font-playfair)' }}>
                            Live Streaming
                        </h2>

                        <p className="text-xs md:text-sm text-[var(--color-text)]/90 max-w-md mx-auto leading-relaxed mb-6 drop-shadow">
                            Kami mengundang Bapak/Ibu/Saudara/i untuk menyaksikan pernikahan kami secara virtual yang disiarkan langsung melalui media di bawah ini:
                        </p>

                        <div className="mb-8 text-sm font-bold tracking-widest drop-shadow-md">
                            <p className="uppercase">{akadDate.day}, {akadDate.date} {akadDate.monthYear}</p>
                            <p className="mt-1">Pukul : {events?.akad?.time || '08.00 WIB'}</p>
                        </div>

                        {/* Video Iframe Container */}
                        <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-white/20 aspect-video relative bg-slate-900 flex items-center justify-center backdrop-blur-sm">

                            {/* Pasang link YouTube dummy sebagai fallback kalau url kosong */}
                            {getYouTubeEmbedUrl(content?.live_stream?.url || 'https://youtu.be/TEy7NE8Ui50') ? (
                                <iframe
                                    className="absolute top-0 left-0 w-full h-full"
                                    src={getYouTubeEmbedUrl(content?.live_stream?.url || 'https://youtu.be/TEy7NE8Ui50') || ''}
                                    title="YouTube Live Stream"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <p className="text-sm text-[var(--color-text)]/50 font-medium">Link YouTube tidak valid.</p>
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
                            <h2 className="text-4xl md:text-5xl text-[color:var(--color-text)] font-serif tracking-widest drop-shadow-md" style={{ fontFamily: 'var(--font-playfair)' }}>
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
                                    <h3 className="text-lg font-bold text-[color:var(--color-primary)]">
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
                                    <h3 className="text-lg font-bold text-[color:var(--color-primary)]">Awal Cerita</h3>
                                    <p className="text-[11px] md:text-xs text-slate-600 leading-relaxed">
                                        Berawal dari pertemuan sederhana, kami saling mengenal dan mulai berbagi banyak cerita. Tanpa disadari, kebersamaan itu tumbuh menjadi rasa nyaman yang semakin kuat dari hari ke hari.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-[color:var(--color-primary)]">Lamaran</h3>
                                    <p className="text-[11px] md:text-xs text-slate-600 leading-relaxed">
                                        Dengan niat yang tulus dan restu keluarga, kami memutuskan untuk melangkah ke tahap yang lebih serius. Momen lamaran menjadi awal dari perjalanan baru yang penuh harapan dan doa baik.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-[color:var(--color-primary)]">Pernikahan</h3>
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
                <div className="w-full bg-[var(--color-primary)] py-16 px-6 flex flex-col items-center overflow-hidden">

                    {/* BAGIAN 1: HEADER (Muncul duluan) */}
                    <div
                        id="gallery-header"
                        ref={galleryHeaderRef}
                        className={`text-center text-[var(--color-text)] mb-10 transition-all duration-[2500ms] ease-out ${showGalleryHeader ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
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
                                    <p className="text-sm text-[var(--color-text)]/50 font-medium">Link Video tidak valid.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* BAGIAN 3: FOTO-FOTO GALERI (Muncul Satu per Satu) */}
                    <div
                        id="gallery-photos"
                        // Wadah utama udah nggak butuh animasi opacity/translate lagi, kita copot
                        className="w-full max-w-2xl mx-auto space-y-4"
                    >
                        {content?.sections?.gallery?.photos && content.sections.gallery.photos.length > 0 ? (
                            content.sections.gallery.photos.map((photoUrl: string, index: number) => (
                                <div
                                    key={`real-${index}`}
                                    data-photo-index={`real-${index}`}
                                    className={`w-full rounded-2xl overflow-hidden shadow-lg transition-all duration-[2000ms] ease-out ${visiblePhotos[`real-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
                                >
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
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <div
                                        key={`dummy-${num}`}
                                        data-photo-index={`dummy-${num}`}
                                        className={`w-full rounded-2xl overflow-hidden shadow-lg transition-all duration-[2000ms] ease-out ${visiblePhotos[`dummy-${num}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
                                    >
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/galeri-${num}.jpg`}
                                            alt={`Gallery ${num}`}
                                            className="w-full h-auto object-cover"
                                        />
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            )}
            {/* --- WEDDING GIFT (AMPLOP DIGITAL) SECTION --- */}
            {content?.gift?.enabled !== false && (
                <div
                    id="gift-section"
                    className="w-full bg-[var(--color-primary)] pt-16 pb-40 px-6 flex flex-col items-center"
                >
                    {/* BAGIAN ATAS (Judul & Deskripsi) - Ini yang Dianimasi! */}
                    <div
                        id="gift-header"
                        ref={giftHeaderRef}
                        // 👇 Animasinya DIPINDAHIN ke sini bre
                        className={`text-center text-[var(--color-text)] w-full max-w-md mx-auto transition-all duration-[2500ms] ease-out ${showGiftHeader ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                    >
                        <h2 className="text-4xl md:text-5xl mb-4 font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                            Amplop Digital
                        </h2>
                        <p className="text-xs md:text-sm text-[var(--color-text)]/90 leading-relaxed mb-8">
                            Doa restu Anda merupakan karunia yang sangat berarti bagi kami, dan jika memberi adalah ungkapan tanda kasih, Anda dapat memberi kado secara cashless.
                        </p>

                        <button
                            onClick={() => setIsGiftOpen(!isGiftOpen)}
                            className="bg-gradient-to-r from-white to-[#F0F5F2] text-[var(--color-primary)] font-bold text-xs md:text-sm px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto tracking-widest uppercase"
                        >
                            {isGiftOpen ? 'TUTUP' : 'KIRIM HADIAH'}
                            <span className={`transition-transform duration-300 ${isGiftOpen ? 'rotate-90' : ''}`}>➔</span>
                        </button>
                    </div>

                    {/* BAGIAN KARTU (Tersembunyi & Terbuka Mulus) */}
                    <div
                        className={`w-full max-w-sm mx-auto transition-all duration-700 ease-in-out overflow-hidden flex flex-col gap-4 ${isGiftOpen ? 'max-h-[1500px] opacity-100 mt-10' : 'max-h-0 opacity-0 mt-0'}`}
                    >
                        {/* 1. MAPPING KARTU BANK DARI DATABASE */}
                        {content?.gift?.banks && content.gift.banks.length > 0 ? (
                            content.gift.banks.map((bank: any, index: number) => (
                                <div key={index} className="w-full bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl relative overflow-hidden">
                                    {/* Efek Lingkaran Abstrak Background Kartu */}
                                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-gray-100 rounded-full opacity-50 blur-xl"></div>
                                    <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-gray-100 rounded-full opacity-50 blur-xl"></div>

                                    <div className="relative z-10 flex justify-between items-start mb-6">
                                        {/* Chip Kartu */}
                                        <div className="w-10 h-8 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded flex items-center justify-center opacity-80">
                                            <div className="w-6 h-4 border border-yellow-600/30 rounded-sm"></div>
                                        </div>
                                        {/* Nama Bank */}
                                        <h3 className="font-bold text-xl text-blue-800 italic uppercase tracking-wider">{bank.name}</h3>
                                    </div>

                                    <div className="relative z-10 mb-1">
                                        <p className="text-2xl tracking-[0.15em] text-gray-800 font-mono">{bank.account}</p>
                                    </div>
                                    <div className="relative z-10 flex justify-between items-end">
                                        <p className="text-xs text-gray-500 uppercase tracking-widest">{bank.holder}</p>

                                        {/* Tombol Copy */}
                                        <button
                                            onClick={() => handleCopy(bank.account, `bank-${index}`)}
                                            className="bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 hover:bg-gray-50 shadow-sm transition-all"
                                        >
                                            {copiedId === `bank-${index}` ? (
                                                <span className="text-green-600">✓ Tersalin</span>
                                            ) : (
                                                <>
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                                    Copy
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-[var(--color-text)]/70 text-sm">Belum ada data rekening.</p>
                        )}

                        {/* 2. KARTU ALAMAT FISIK (Kirim Hadiah) */}
                        <div className="w-full bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl relative mt-2 text-center">
                            <div className="flex justify-center mb-2">
                                {/* Ikon Kado */}
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-gray-700">
                                    <path d="M20 8h-3V6c0-1.1-.9-2-2-2h-2c-.6 0-1.1.3-1.5.7C11.1 4.3 10.6 4 10 4H8c-1.1 0-2 .9-2 2v2H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-9 12H3V10h8v10zm2 0V10h8v10h-8zm-3-12H8V6h2v2zm6 0h-2V6h2v2z"></path>
                                </svg>
                            </div>
                            <h4 className="font-bold text-gray-800 text-sm mb-3">Kirim Hadiah</h4>

                            <div className="text-xs text-gray-600 space-y-1.5">
                                {/* 👇 Ini yang bikin error tadi, gw ganti ke content?.gift?.physical?.recipientName atau fallback ke data?.groom_name */}
                                <p><span className="font-medium">Nama Penerima :</span> {content?.gift?.physical?.recipientName || data?.groom_name || 'Nama Penerima'}</p>
                                <p><span className="font-medium">No. HP :</span> {content?.gift?.physical?.phone || '-'}</p>
                                <p><span className="font-medium">Alamat :</span> {content?.gift?.physical?.address || 'Alamat belum ditambahkan'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- GUESTBOOK SECTION --- */}
            <Guestbook
                invitationId={data?.invitation_id || ''}
                themeColor={themeColor || '#7B959A'}
                isPreview={data?.isPreview ?? !data?.invitation_id}
            />

            {/* --- CLOSING SECTION --- */}
            <div className="w-full flex flex-col items-center bg-[var(--color-secondary)]"> {/* Background nyambung sama warna Guestbook */}

                {/* 1. Area Foto 3:4 & Teks Closing */}
                <div className="relative w-full aspect-[3/4] md:max-w-md mx-auto overflow-hidden flex flex-col justify-center items-center shadow-lg">

                    {/* Background Slideshow (Slide dari bawah ke atas) */}
                    <div className="absolute inset-0 w-full h-full z-0">
                        {heroPhotos.map((photoUrl: string, index: number) => (
                            <img
                                key={`closing-${index}`}
                                src={photoUrl}
                                alt={`Closing Slide ${index}`}
                                className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] ease-in-out ${
                                    // 👇 UBAH BAGIAN INI (Tambahin % heroPhotos.length)
                                    index === (heroIndex % heroPhotos.length)
                                        ? 'opacity-100 translate-y-0 scale-100'
                                        : 'opacity-0 translate-y-16 scale-105'
                                    }`}
                            />
                        ))}
                        {/* Overlay hitam biar teks putihnya gampang dibaca */}
                        <div className="absolute inset-0 bg-black/40"></div>
                    </div>

                    {/* Konten Teks Closing */}
                    <div
                        id="closing-text"
                        ref={closingTextRef}
                        className={`relative z-10 text-center px-6 text-[var(--color-text)] w-full max-w-lg transition-all duration-[2000ms] ease-out ${showClosingText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                            }`}
                    >
                        <h2 className="text-4xl md:text-5xl font-serif mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                            Terimakasih
                        </h2>
                        <p className="text-xs md:text-sm text-[var(--color-text)]/90 leading-relaxed mb-6 whitespace-pre-line">
                            {content?.closing_text || 'Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu. Atas kehadiran dan doa restunya, kami mengucapkan terima kasih.'}
                        </p>
                        <p className="text-[10px] md:text-xs font-bold tracking-widest uppercase mb-2">
                            Kami Yang Berbahagia,
                        </p>
                        <h3 className="text-3xl md:text-4xl font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                            {data?.groom_name || 'Habib'} & {data?.bride_name || 'Adiba'}
                        </h3>
                    </div>
                </div>

                {/* 2. Footer Terpisah di Bawah Foto */}
                <div className="w-full bg-[var(--color-primary)] py-8 flex flex-col items-center">
                    <p className="text-[10px] text-[var(--color-text)]/90 mb-3 font-medium tracking-wide">
                        Made with <span className="text-red-400">❤️</span> by temuhatiinvite.com
                    </p>
                    <div className="flex gap-5">
                        {/* WA Icon */}
                        <a href="https://wa.me/6285221011424" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity text-[var(--color-text)]">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.052 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                            </svg>
                        </a>
                        {/* IG Icon */}
                        <a href="https://instagram.com/temuhati.kita" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity text-[var(--color-text)]">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            {/* Dev Tools Preview */}
            {data.isPreview && isOpened && (
                <button
                    onClick={() => {
                        setIsExiting(false); // Kembalikan posisi cover ke bawah
                        setIsOpened(false);  // Render ulang cover
                    }}
                    className="fixed bottom-24 right-4 z-[9999] bg-stone-900/80 backdrop-blur-sm text-[var(--color-text)] px-4 py-2 rounded-full text-xs font-bold shadow-xl border border-stone-700 hover:bg-stone-800 transition-all"

                >
                    ⟲ Kembali ke Cover
                </button>
            )}
        </div>
    )
}