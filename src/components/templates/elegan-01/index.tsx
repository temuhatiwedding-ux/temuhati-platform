'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Volume2, VolumeX, MapPin, Quote, } from 'lucide-react'
import { InvitationData } from '@/types/invitation'
import Guestbook from './Guestbook'
import { useSearchParams } from 'next/navigation'

const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|^youtube.com\/live\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
};

const InstagramIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
)
const CopyIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
)

const VideoIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="23 7 16 12 23 17 23 7"></polygon>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
    </svg>
)

export default function Elegan01({ data }: { data: InvitationData }) {
    const searchParams = useSearchParams()
    const guestName = searchParams.get('to') || 'Bapak/Ibu/Saudara/i'
    const guestId = searchParams.get('id')

    // --- STATE ANIMASI & AUDIO ---
    const [isOpened, setIsOpened] = useState(false)
    const [isExiting, setIsExiting] = useState(false) // State baru untuk transisi cover
    const [isPlaying, setIsPlaying] = useState(false)
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    const [showGift, setShowGift] = useState(false)

    const audioRef = useRef<HTMLAudioElement>(null)
    const supabase = createClient()
    // --- SCROLL ANIMATION OBSERVERS ---
    const quoteRef = useRef<HTMLDivElement>(null);
    const groomRef = useRef<HTMLDivElement>(null);
    const brideRef = useRef<HTMLDivElement>(null);
    const introRef = useRef<HTMLDivElement>(null);
    const eventHeaderRef = useRef<HTMLDivElement>(null);
    const countdownRef = useRef<HTMLDivElement>(null);
    const akadCardRef = useRef<HTMLDivElement>(null);
    const resepsiCardRef = useRef<HTMLDivElement>(null);
    const loveStoryHeaderRef = useRef<HTMLDivElement>(null);
    const galleryHeaderRef = useRef<HTMLDivElement>(null);
    const [visiblePhotos, setVisiblePhotos] = useState<Record<string, boolean>>({});
    const [showEventHeader, setShowEventHeader] = useState(false);
    const [showCountdown, setShowCountdown] = useState(false);
    const [showAkadCard, setShowAkadCard] = useState(false);
    const [showResepsiCard, setShowResepsiCard] = useState(false);
    const closingRef = useRef<HTMLDivElement>(null);
    const [showClosing, setShowClosing] = useState(false);
    const footerRef = useRef<HTMLElement>(null);
    const [showFooter, setShowFooter] = useState(false);

    const [showGalleryHeader, setShowGalleryHeader] = useState(false);

    const giftHeaderRef = useRef<HTMLDivElement>(null);
    const [showGiftHeader, setShowGiftHeader] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };
    const [showLoveStoryHeader, setShowLoveStoryHeader] = useState(false);
    const [showQuote, setShowQuote] = useState(false);
    const [showGroom, setShowGroom] = useState(false);
    const [showBride, setShowBride] = useState(false);

    const [showIntro, setShowIntro] = useState(false);

    useEffect(() => {
        const observerOptions = { threshold: 0.2 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.id === 'quote-sec') setShowQuote(true);
                    if (entry.target.id === 'groom-sec') setShowGroom(true);
                    if (entry.target.id === 'bride-sec') setShowBride(true);
                    if (entry.target.id === 'intro-sec') setShowIntro(true);
                    if (entry.target.id === 'event-header') setShowEventHeader(true);
                    if (entry.target.id === 'countdown-sec') setShowCountdown(true);
                    if (entry.target.id === 'akad-card') setShowAkadCard(true);
                    if (entry.target.id === 'resepsi-card') setShowResepsiCard(true);
                    if (entry.target.id === 'lovestory-header') setShowLoveStoryHeader(true);
                    if (entry.target.id === 'gallery-header') setShowGalleryHeader(true);
                    const photoIdx = entry.target.getAttribute('data-photo-index');
                    if (photoIdx) {
                        setVisiblePhotos(prev => ({ ...prev, [photoIdx]: true }));
                    }
                    if (entry.target.id === 'gift-header') setShowGiftHeader(true);
                    if (entry.target.id === 'closing-sec') setShowClosing(true);
                    if (entry.target.id === 'footer-sec') setShowFooter(true);
                }
            });
        }, observerOptions);

        if (quoteRef.current) observer.observe(quoteRef.current);
        if (groomRef.current) observer.observe(groomRef.current);
        if (brideRef.current) observer.observe(brideRef.current);
        if (introRef.current) observer.observe(introRef.current);
        if (eventHeaderRef.current) observer.observe(eventHeaderRef.current);
        if (countdownRef.current) observer.observe(countdownRef.current);
        if (akadCardRef.current) observer.observe(akadCardRef.current);
        if (resepsiCardRef.current) observer.observe(resepsiCardRef.current);
        if (loveStoryHeaderRef.current) observer.observe(loveStoryHeaderRef.current);
        if (galleryHeaderRef.current) observer.observe(galleryHeaderRef.current);
        const photoElements = document.querySelectorAll('[data-photo-index]');
        photoElements.forEach(el => observer.observe(el));
        if (giftHeaderRef.current) observer.observe(giftHeaderRef.current);
        if (closingRef.current) observer.observe(closingRef.current);
        if (footerRef.current) observer.observe(footerRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const markAsOpened = async () => {
            if (guestId) {
                await supabase
                    .from('guest_list')
                    .update({ is_opened: true })
                    .eq('id', guestId)
            }
        }
        markAsOpened()
    }, [guestId])

    const content = data.content_data || {}

    // --- WARNA DINAMIS ---
    const colors = content?.theme_colors || {
        primary: '#7B959A',
        secondary: '#F3F5F4',
        accent: '#D1E0D7',
        text: '#ffffff',
        textDark: '#2F3E40'
    };
    const themeColor = colors.primary;
    const defaultMusic = `${process.env.NEXT_PUBLIC_R2_URL}/master-music/laksana-surgaku.mp3`
    const musicUrl = content.musicUrl || defaultMusic

    // Data Teks
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
        `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/elegan-01/galeri-6.jpg`
    ]

    const defaultCover = `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/elegan-01/cover.png`
    const coverImage = content.coverPhoto || defaultCover

    const defaultGroom = `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/elegan-01/mempelai-pria.jpg`
    const groomPhoto = content.groomPhoto || defaultGroom

    const defaultBride = `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/elegan-01/mempelai-wanita.jpg`
    const bridePhoto = content.bridePhoto || defaultBride

    const defaultClosing = `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/elegan-01/prewedding-penutup.jpg`
    const closingPhoto = content.closingPhoto || defaultClosing

    const gifts: any = content.gift?.banks || [
        { name: 'BCA', account: '1234567890', holder: 'Ardi Pratama' },
        { name: 'MANDIRI', account: '0987654321', holder: 'Rania Safitri' }
    ]
    const liveStream = content.live_stream || { enabled: false, url: '' }

    // --- HANDLER FUNCTIONS ---
    const toggleMusic = () => {
        if (audioRef.current) {
            isPlaying ? audioRef.current.pause() : audioRef.current.play()
            setIsPlaying(!isPlaying)
        }
    }

    const handleOpen = () => {
        setIsExiting(true)
        setTimeout(() => setIsOpened(true), 800)

        // Trigger musik saat tombol diklik
        if (audioRef.current) {
            audioRef.current.play().catch(err => console.log("Audio ditahan browser:", err))
            setIsPlaying(true)
        }
    }

    useEffect(() => {
        const getTargetDate = () => {
            if (!events?.akad?.date) return new Date().getTime()

            let dateStr = events.akad.date.toLowerCase()
            dateStr = dateStr.replace(/^(senin|selasa|rabu|kamis|jumat|sabtu|minggu)[,\s]*/i, '')
            const bulanMap: Record<string, string> = {
                'januari': 'Jan', 'februari': 'Feb', 'maret': 'Mar', 'april': 'Apr',
                'mei': 'May', 'juni': 'Jun', 'juli': 'Jul', 'agustus': 'Aug',
                'september': 'Sep', 'oktober': 'Oct', 'november': 'Nov', 'desember': 'Dec'
            }
            Object.keys(bulanMap).forEach(key => {
                dateStr = dateStr.replace(key, bulanMap[key])
            })
            let timeStr = events?.akad?.time ? events.akad.time.split('-')[0].trim() : '08:00'
            timeStr = timeStr.replace(/[^0-9:]/g, '').substring(0, 5)
            if (!timeStr) timeStr = '08:00'

            const finalDate = new Date(`${dateStr} ${timeStr}`).getTime()
            return isNaN(finalDate) ? new Date().getTime() : finalDate
        }

        const targetDate = getTargetDate()

        const interval = setInterval(() => {
            const now = new Date().getTime()
            const distance = targetDate - now

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
            const date = new Date(dateStr);
            return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        }
        return dateStr;
    }

    const calendarTitle = encodeURIComponent(`Pernikahan ${data.groom_name || 'Mempelai'} & ${data.bride_name || 'Mempelai'}`);
    const calendarDetails = encodeURIComponent(`Kehadiran dan doa restu Anda sangat berarti bagi kami.`);
    const calendarLocation = encodeURIComponent(events?.akad?.location || '');

    let calendarDates = '';
    if (events?.akad?.date) {
        // Ubah "2024-12-31" jadi "20241231" sesuai standar Google Calendar
        const formattedDate = events.akad.date.replace(/-/g, '');
        calendarDates = `&dates=${formattedDate}/${formattedDate}`;
    }

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calendarTitle}&details=${calendarDetails}&location=${calendarLocation}${calendarDates}`;

    // --- RETURN UTAMA MULAI DI SINI ---
    return (
        <div
            className={`w-full max-w-[430px] mx-auto relative bg-white shadow-2xl font-sans selection:bg-slate-500 selection:text-[color:var(--color-text)] ${!isOpened ? 'h-[100dvh] overflow-hidden' : 'min-h-screen'}`}
            style={{
                '--color-primary': colors.primary,
                '--color-secondary': colors.secondary,
                '--color-accent': colors.accent,
                '--color-text': colors.text,
                '--color-text-dark': colors.textDark
            } as React.CSSProperties}
        >

            {/* --- 1. COVER (Sebelum Dibuka) --- */}
            {!isOpened && (
                <div
                    className={`absolute top-0 left-0 w-full h-[100dvh] z-[100] flex flex-col justify-end bg-[color:var(--color-secondary)] text-[color:var(--color-text)] overflow-hidden transition-transform duration-[800ms] ease-in-out ${isExiting ? '-translate-y-full' : 'translate-y-0'}`}
                >
                    <img src={coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="relative z-10 w-full flex flex-col items-center justify-end pb-16 px-6 text-center">
                        <p className="text-sm mb-2 drop-shadow-md uppercase tracking-widest cover-animate">The Wedding Of</p>
                        <h1 className="text-4xl font-serif font-bold mb-6 drop-shadow-lg cover-animate cover-delay-150" style={{ fontFamily: 'var(--font-playfair)' }}>
                            {data.groom_name || 'Ardi'} & {data.bride_name || 'Rania'}
                        </h1>
                        <p className="text-sm mb-1 drop-shadow-md cover-animate cover-delay-300">Kepada Yth.</p>

                        <p className="text-lg font-bold mb-8 drop-shadow-md capitalize cover-animate cover-delay-300">{guestName}</p>

                        <button
                            onClick={handleOpen}
                            className="bg-[color:var(--color-primary)] text-[color:var(--color-text)] font-bold py-3 px-8 rounded-lg shadow-xl hover:opacity-80 transition-all cover-animate cover-delay-500"
                        >
                            Buka Undangan
                        </button>
                    </div>
                </div>
            )}

            {/* --- 2. MAIN CONTENT (Isi Undangan) --- */}
            <div className="relative w-full min-h-[100dvh] flex flex-col bg-[color:var(--color-secondary)] text-[color:var(--color-text-dark)]">

                {/* Audio Button */}
                {musicUrl && (
                    <>
                        <audio ref={audioRef} loop className="hidden" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}>
                            <source src={musicUrl} type="audio/mpeg" />
                        </audio>
                        <button
                            onClick={toggleMusic}
                            className="fixed bottom-6 right-6 z-50 p-3 bg-[color:var(--color-secondary)] text-[color:var(--color-primary)] border border-[color:var(--color-accent)] rounded-full shadow-lg hover:opacity-80 transition-all flex items-center justify-center"
                        >
                            {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                        </button>
                    </>
                )}

                {/* Hero Banner Halaman Pertama */}
                <div className="relative w-full h-[100dvh] flex flex-col justify-end bg-[color:var(--color-secondary)] text-[color:var(--color-text)] overflow-hidden">
                    {/* Animasi Background Zoom-Out */}
                    <img
                        src={coverImage}
                        alt="Hero"
                        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] ease-out ${isOpened ? 'scale-100' : 'scale-110'}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    <div className="relative z-10 w-full flex flex-col items-center justify-end pb-24 px-6 text-center">
                        <p className={`text-xs uppercase tracking-widest mb-2 drop-shadow-md transition-all duration-[1000ms] ease-out ${isOpened ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} delay-[800ms]`}>
                            The Wedding Of
                        </p>

                        <h1 className={`text-4xl font-serif font-bold mb-6 drop-shadow-lg transition-all duration-[1000ms] ease-out ${isOpened ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} delay-[1000ms]`} style={{ fontFamily: 'var(--font-playfair)' }}>
                            {data.groom_name || 'Ardi'} & {data.bride_name || 'Rania'}
                        </h1>

                        <p className={`text-xs mb-1 drop-shadow-md transition-all duration-[1000ms] ease-out ${isOpened ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} delay-[1200ms]`}>
                            Tanggal
                        </p>

                        <p className={`text-sm font-bold uppercase mb-8 drop-shadow-md transition-all duration-[1000ms] ease-out ${isOpened ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} delay-[1200ms]`}>
                            {events.resepsi?.date}
                        </p>

                        <a
                            href={calendarUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={`bg-[color:var(--color-primary)] text-[color:var(--color-text)] font-semibold text-sm py-3 px-8 rounded-lg shadow-xl hover:opacity-80 transition-all duration-[1000ms] ease-out ${isOpened ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} delay-[1400ms]`}
                        >
                            Save the Date
                        </a>
                    </div>
                </div>

                {/* Kutipan Quran */}
                <div
                    id="quote-sec"
                    ref={quoteRef}
                    className="py-16 px-8 flex flex-col items-center justify-center bg-[color:var(--color-primary)] text-[color:var(--color-text)] overflow-hidden"
                >
                    <Quote
                        className={`w-8 h-8 mb-6 fill-current rotate-180 ${showQuote ? 'dramatic-reveal' : 'opacity-0'}`}
                        style={{ animationDelay: '200ms' }}
                    />

                    <div className="text-center max-w-[320px]">
                        <p
                            className={`text-sm italic mb-6 leading-relaxed whitespace-pre-wrap break-words ${showQuote ? 'dramatic-reveal' : 'opacity-0'}`}
                            style={{ animationDelay: '600ms' }}
                        >
                            "{content?.quote || 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.'}"
                        </p>
                        <p
                            className={`font-bold text-sm ${showQuote ? 'dramatic-reveal' : 'opacity-0'}`}
                            style={{ animationDelay: '1000ms' }}
                        >
                            {content?.quote_source || 'Q.S. Ar-Rum: 21'}
                        </p>
                    </div>
                </div>

                {/* Profil Mempelai */}
                <div className="py-16 px-6 text-center bg-[color:var(--color-secondary)]">
                    <p
                        id="intro-sec"
                        ref={introRef}
                        className={`text-sm text-[color:var(--color-text-dark)]/80 mb-12 leading-relaxed max-w-sm mx-auto ${showIntro ? 'dramatic-reveal' : 'opacity-0'}`}
                    >
                        Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i serta kerabat sekalian untuk menghadiri acara pernikahan kami:
                    </p>

                    {/* Groom (Pria) */}
                    <div id="groom-sec" ref={groomRef} className="mb-8 flex flex-col items-center">
                        <img
                            src={groomPhoto}
                            alt="Groom"
                            className={`w-2/3 max-w-[240px] aspect-[3/4] object-cover rounded-2xl mb-6 shadow-sm ${showGroom ? 'dramatic-reveal' : 'opacity-0'}`}
                            style={{ animationDelay: '200ms' }}
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/elegan-01/galeri-1.jpg`;
                            }}
                        />
                        <h3
                            className={`text-2xl font-serif font-bold mb-2 text-[color:var(--color-primary)] ${showGroom ? 'dramatic-reveal' : 'opacity-0'}`}
                            style={{ animationDelay: '400ms', fontFamily: 'var(--font-playfair)' }}
                        >
                            {groom.fullName}
                        </h3>
                        <p
                            className={`text-sm text-[color:var(--color-text-dark)]/80 mb-4 ${showGroom ? 'dramatic-reveal' : 'opacity-0'}`}
                            style={{ animationDelay: '600ms' }}
                        >
                            Putra {groom.order} dari Bapak {groom.fatherName || '-'} & Ibu {groom.motherName || '-'}
                        </p>

                        {/* Tombol IG Pria */}
                        {groom.ig && (
                            <a
                                href={`https://instagram.com/${groom.ig.replace('@', '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className={`inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full border border-[color:var(--color-primary)] text-[color:var(--color-primary)] text-xs font-medium transition-colors hover:bg-[color:var(--color-primary)] hover:text-[color:var(--color-text)] ${showGroom ? 'dramatic-reveal' : 'opacity-0'}`}
                                style={{ animationDelay: '800ms' }}
                            >
                                <InstagramIcon className="w-3.5 h-3.5" />
                                {groom.ig.startsWith('@') ? groom.ig : `@${groom.ig}`}
                            </a>
                        )}
                    </div>

                    <div className="text-5xl font-serif my-12 text-[color:var(--color-primary)] opacity-80">&</div>

                    {/* Bride (Wanita) */}
                    <div id="bride-sec" ref={brideRef} className="mb-12 flex flex-col items-center">
                        <img
                            src={bridePhoto}
                            alt="Bride"
                            className={`w-2/3 max-w-[240px] aspect-[3/4] object-cover rounded-2xl mb-6 shadow-sm ${showBride ? 'dramatic-reveal' : 'opacity-0'}`}
                            style={{ animationDelay: '200ms' }}
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/elegan-01/galeri-1.jpg`;
                            }}
                        />
                        <h3
                            className={`text-2xl font-serif font-bold mb-2 text-[color:var(--color-primary)] ${showBride ? 'dramatic-reveal' : 'opacity-0'}`}
                            style={{ animationDelay: '400ms', fontFamily: 'var(--font-playfair)' }}
                        >
                            {bride.fullName}
                        </h3>
                        <p
                            className={`text-sm text-[color:var(--color-text-dark)]/80 mb-4 ${showBride ? 'dramatic-reveal' : 'opacity-0'}`}
                            style={{ animationDelay: '600ms' }}
                        >
                            Putri {bride.order} dari Bapak {bride.fatherName || '-'} & Ibu {bride.motherName || '-'}
                        </p>

                        {/* Tombol IG Wanita */}
                        {bride.ig && (
                            <a
                                href={`https://instagram.com/${bride.ig.replace('@', '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className={`inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full border border-[color:var(--color-primary)] text-[color:var(--color-primary)] text-xs font-medium transition-colors hover:bg-[color:var(--color-primary)] hover:text-[color:var(--color-text)] ${showBride ? 'dramatic-reveal' : 'opacity-0'}`}
                                style={{ animationDelay: '800ms' }}
                            >
                                <InstagramIcon className="w-3.5 h-3.5" />
                                {bride.ig.startsWith('@') ? bride.ig : `@${bride.ig}`}
                            </a>
                        )}
                    </div>
                </div>

                {/* Event Details */}
                <div className="py-16 px-6 flex flex-col items-center bg-[color:var(--color-secondary)] text-center overflow-hidden">

                    {/* Header Event & Foto (Narik data dari akadPhoto) */}
                    <div id="event-header" ref={eventHeaderRef} className={`w-full flex flex-col items-center ${showEventHeader ? 'dramatic-reveal' : 'opacity-0'}`}>
                        <img
                            src={content?.akadPhoto || `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/elegan-01/galeri-1.jpg`}
                            alt="Event"
                            className="w-full max-w-sm aspect-square object-cover rounded-t-[200px] mb-8 shadow-sm"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/elegan-01/galeri-1.jpg`;
                            }}
                        />
                        <h2
                            className="text-2xl font-bold text-[color:var(--color-text-dark)] mb-8 font-serif"
                            style={{ fontFamily: 'var(--font-playfair)' }}
                        >
                            Save The Date
                        </h2>
                    </div>

                    {/* Countdown Box */}
                    <div id="countdown-sec" ref={countdownRef} className={`flex gap-3 mb-12 w-full max-w-sm justify-center ${showCountdown ? 'dramatic-reveal' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
                        {['Hari', 'Jam', 'Menit', 'Detik'].map((label, index) => {
                            const values = [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds];
                            return (
                                <div key={label} className="flex flex-col items-center justify-center p-3 bg-white shadow-sm rounded-xl border border-[color:var(--color-accent)] min-w-[70px]">
                                    <span className="text-2xl font-serif font-bold text-[color:var(--color-primary)]">
                                        {values[index]}
                                    </span>
                                    <span className="text-[10px] text-[color:var(--color-text-dark)]/60 uppercase tracking-widest font-semibold mt-1">
                                        {label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>

                    {/* AKAD */}
                    <div id="akad-card" ref={akadCardRef} className={`mb-6 w-full max-w-sm bg-white p-8 rounded-2xl shadow-sm border border-[color:var(--color-accent)] flex flex-col items-center ${showAkadCard ? 'dramatic-reveal' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
                        <h3 className="text-2xl font-serif font-bold mb-4 text-[color:var(--color-primary)]" style={{ fontFamily: 'var(--font-playfair)' }}>
                            Akad Nikah
                        </h3>
                        <p className="text-sm text-[color:var(--color-text-dark)]/80 mb-2 uppercase tracking-wide">
                            {events?.akad?.day ? `${events.akad.day}, ` : ''}{formatTanggal(events?.akad?.date)}
                        </p>
                        <p className="text-sm font-bold text-[color:var(--color-text-dark)] mb-4">PUKUL : {events?.akad?.time || '08:00 WIB'}</p>
                        <p className="text-sm text-[color:var(--color-text-dark)]/70 leading-relaxed mb-6">{events?.akad?.location}</p>

                        {events?.akad?.mapUrl && (
                            <a
                                href={events.akad.mapUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 bg-[color:var(--color-primary)] text-[color:var(--color-text)] px-6 py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-90"
                            >
                                <MapPin className="w-4 h-4" />
                                Lokasi Akad
                            </a>
                        )}
                    </div>

                    {/* RESEPSI */}
                    <div id="resepsi-card" ref={resepsiCardRef} className={`mb-4 w-full max-w-sm bg-white p-8 rounded-2xl shadow-sm border border-[color:var(--color-accent)] flex flex-col items-center ${showResepsiCard ? 'dramatic-reveal' : 'opacity-0'}`} style={{ animationDelay: '400ms' }}>
                        <h3 className="text-2xl font-serif font-bold mb-4 text-[color:var(--color-primary)]" style={{ fontFamily: 'var(--font-playfair)' }}>
                            Resepsi
                        </h3>
                        <p className="text-sm text-[color:var(--color-text-dark)]/80 mb-2 uppercase tracking-wide">
                            {events?.resepsi?.day ? `${events.resepsi.day}, ` : ''}{formatTanggal(events?.resepsi?.date)}
                        </p>
                        <p className="text-sm font-bold text-[color:var(--color-text-dark)] mb-4">PUKUL : {events?.resepsi?.time || '10:00 WIB'} - Selesai</p>
                        <p className="text-sm text-[color:var(--color-text-dark)]/70 leading-relaxed mb-6">{events?.resepsi?.location}</p>

                        {events?.resepsi?.mapUrl && (
                            <a
                                href={events.resepsi.mapUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 bg-[color:var(--color-primary)] text-[color:var(--color-text)] px-6 py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-90"
                            >
                                <MapPin className="w-4 h-4" />
                                Lokasi Resepsi
                            </a>
                        )}
                    </div>
                </div>

                {/* Love Story */}
                {love_story.enabled && love_story.stories.length > 0 && (
                    <div className="py-16 px-6 bg-[color:var(--color-secondary)] overflow-hidden">

                        {/* Header di-observe buat trigger animasi */}
                        <h2
                            id="lovestory-header"
                            ref={loveStoryHeaderRef}
                            className={`text-3xl font-serif font-bold text-center mb-10 text-[color:var(--color-primary)] ${showLoveStoryHeader ? 'dramatic-reveal' : 'opacity-0'}`}
                            style={{ fontFamily: 'var(--font-playfair)' }}
                        >
                            Love Story
                        </h2>

                        <div className="flex flex-col gap-4 max-w-sm mx-auto">
                            {love_story.stories.map((story: any, index: number) => (
                                <div
                                    key={index}
                                    className={`bg-white p-6 rounded-2xl shadow-sm text-center border border-[color:var(--color-accent)] ${showLoveStoryHeader ? 'dramatic-reveal' : 'opacity-0'}`}
                                    // Delay dikalikan index biar munculnya satu-satu berurutan dari atas ke bawah
                                    style={{ animationDelay: `${(index + 1) * 200}ms` }}
                                >
                                    <h4 className="font-bold text-lg mb-3 text-[color:var(--color-primary)]">{story.year}</h4>
                                    <p className="text-sm text-[color:var(--color-text-dark)]/80 leading-relaxed">{story.text}</p>
                                </div>
                            ))}
                        </div>

                    </div>
                )}

                {/* GALERI */}
                {galleryEnabled && gallery && gallery.length > 0 && (
                    <div className="py-16 px-6 bg-white text-center border-t border-[color:var(--color-accent)] overflow-hidden">

                        <h2
                            id="gallery-header"
                            ref={galleryHeaderRef}
                            className={`text-3xl font-serif font-bold mb-8 text-[color:var(--color-primary)] ${showGalleryHeader ? 'dramatic-reveal' : 'opacity-0'}`}
                            style={{ fontFamily: 'var(--font-playfair)' }}
                        >
                            Galeri Kami
                        </h2>

                        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                            {gallery.map((img: string, i: number) => (
                                <img
                                    key={i}
                                    data-photo-index={i} // Atribut ini penting buat ditangkap sama observer
                                    src={img}
                                    alt={`Gallery ${i}`}
                                    className={`w-full object-cover rounded-xl shadow-sm ${i % 3 === 0 ? 'col-span-2 aspect-video' : 'aspect-square'
                                        } ${visiblePhotos[i] ? 'dramatic-reveal' : 'opacity-0'}`}
                                    // Delay dibuat bervariasi agar foto muncul bergantian
                                    style={{ animationDelay: `${(i % 3) * 200}ms` }}
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/elegan-01/galeri-1.jpg`;
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* LIVE STREAMING */}
                {Boolean(liveStream?.enabled) && liveStream?.url && (
                    <div className="py-16 px-6 bg-stone-50 text-center border-t border-stone-100">
                        <h2 className="text-3xl font-serif font-bold mb-4" style={{ color: themeColor }}>Live Streaming</h2>
                        <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed mb-8">
                            Bagi keluarga dan sahabat yang tidak dapat hadir secara langsung, kami mengundang Anda untuk menyaksikan momen bahagia kami secara virtual:
                        </p>

                        <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-xl border-4 border-white aspect-video relative bg-stone-200 flex items-center justify-center">
                            {getYouTubeEmbedUrl(liveStream.url) ? (
                                <iframe
                                    className="absolute top-0 left-0 w-full h-full"
                                    src={getYouTubeEmbedUrl(liveStream.url) || ''}
                                    title="YouTube Live Stream"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <p className="text-sm text-stone-500 font-medium">Link YouTube tidak valid.</p>
                            )}
                        </div>
                    </div>
                )}
                {/* WEDDING GIFT */}
                <div className="py-16 px-6 text-center bg-[color:var(--color-primary)] text-[color:var(--color-text)] overflow-hidden">

                    <div id="gift-header" ref={giftHeaderRef} className={`${showGiftHeader ? 'dramatic-reveal' : 'opacity-0'}`}>
                        <h2 className="text-3xl font-serif font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>Wedding Gift</h2>
                        <p className="text-sm leading-relaxed mb-8 max-w-md mx-auto opacity-90">
                            Kehadiran dan doa restu Anda merupakan anugerah terindah bagi kami. Namun, apabila Anda tidak dapat hadir dan hendak memberikan tanda kasih kepada kami, Anda dapat menggunakan fitur di bawah ini.
                        </p>

                        {!showGift ? (
                            <button
                                onClick={() => setShowGift(true)}
                                className="border border-[color:var(--color-text)] text-[color:var(--color-text)] px-8 py-2.5 rounded-full text-sm font-semibold hover:bg-[color:var(--color-text)] hover:text-[color:var(--color-primary)] transition-all duration-300"
                            >
                                Kirim Hadiah
                            </button>
                        ) : (
                            <div className="flex flex-col gap-4 items-center animate-in fade-in slide-in-from-bottom-4 duration-500">

                                {/* 1. MAPPING KARTU ATM DIGITAL */}
                                {gifts.map((gift: any, i: number) => (
                                    <div key={i} className="relative w-full max-w-[320px] h-[190px] rounded-2xl overflow-hidden shadow-xl text-left text-white border border-white/10">

                                        {/* Background Texture ATM */}
                                        <img src="/templates/elegan-01/atm-texture.jpg" className="absolute inset-0 w-full h-full object-cover" alt="texture" />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-black/40"></div>

                                        {/* Konten Kartu */}
                                        <div className="relative z-10 w-full h-full p-6 flex flex-col justify-between">

                                            {/* Logo / Nama Bank */}
                                            <div className="flex justify-end">
                                                <span className="font-bold text-xl tracking-wider italic opacity-90 drop-shadow-md">{gift.name}</span>
                                            </div>

                                            {/* Nomor Rekening & Tombol Salin */}
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-2xl font-semibold tracking-widest mb-1 drop-shadow-md">{gift.account}</p>
                                                    <p className="text-sm opacity-80 font-medium drop-shadow-md">a.n. {gift.holder}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleCopy(gift.account, `gift-${i}`)}
                                                    className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                                                >
                                                    {copiedId === `gift-${i}` ? (
                                                        <span className="font-bold text-green-300">Tersalin!</span>
                                                    ) : (
                                                        <>
                                                            <CopyIcon className="w-3.5 h-3.5" />
                                                            Salin
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* 2. KARTU ALAMAT FISIK */}
                                <div className="w-full max-w-[320px] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl relative mt-2 text-center text-white">
                                    <div className="flex justify-center mb-3 opacity-90">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20 8h-3V6c0-1.1-.9-2-2-2h-2c-.6 0-1.1.3-1.5.7C11.1 4.3 10.6 4 10 4H8c-1.1 0-2 .9-2 2v2H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-9 12H3V10h8v10zm2 0V10h8v10h-8zm-3-12H8V6h2v2zm6 0h-2V6h2v2z"></path>
                                        </svg>
                                    </div>
                                    <h4 className="font-serif font-bold text-lg mb-4 tracking-wider" style={{ fontFamily: 'var(--font-playfair)' }}>Kirim Kado Fisik</h4>

                                    <div className="text-sm text-left space-y-3 bg-black/20 p-4 rounded-xl border border-white/10">
                                        <p>
                                            <span className="font-semibold opacity-70 text-[10px] uppercase tracking-wider block mb-0.5">Nama Penerima</span>
                                            {content?.gift?.physical?.recipientName || data?.groom_name || 'Nama Penerima'}
                                        </p>
                                        <p>
                                            <span className="font-semibold opacity-70 text-[10px] uppercase tracking-wider block mb-0.5">No. HP</span>
                                            {content?.gift?.physical?.phone || '-'}
                                        </p>
                                        <p>
                                            <span className="font-semibold opacity-70 text-[10px] uppercase tracking-wider block mb-0.5">Alamat Lengkap</span>
                                            <span className="leading-relaxed opacity-90 block">{content?.gift?.physical?.address || 'Alamat belum ditambahkan'}</span>
                                        </p>
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                </div>


                <Guestbook
                    invitationId={data.invitation_id || ''}
                    isPreview={data.isPreview ?? !data.invitation_id}
                />


                {/* PENUTUP */}
                <div
                    id="closing-sec"
                    ref={closingRef}
                    className="py-20 px-6 bg-[color:var(--color-secondary)] text-center flex flex-col items-center overflow-hidden"
                >

                    {/* Foto Bulat */}
                    <div
                        className={`w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden shadow-xl mb-8 border-4 border-white ${showClosing ? 'dramatic-reveal' : 'opacity-0'}`}
                    >
                        <img
                            src={closingPhoto}
                            alt="Couple Portrait"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/elegan-01/galeri-1.jpg`;
                            }}
                        />
                    </div>

                    <h2
                        className={`text-4xl font-serif font-bold text-[color:var(--color-primary)] mb-6 ${showClosing ? 'dramatic-reveal' : 'opacity-0'}`}
                        style={{ animationDelay: '200ms', fontFamily: 'var(--font-playfair)' }}
                    >
                        Terima Kasih
                    </h2>

                    <p
                        className={`text-sm text-[color:var(--color-text-dark)]/80 max-w-md mx-auto leading-relaxed mb-10 ${showClosing ? 'dramatic-reveal' : 'opacity-0'}`}
                        style={{ animationDelay: '400ms' }}
                    >
                        {content.closing_text || 'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir dan memberikan do\'a restu kepada kami.'}
                    </p>

                    <p
                        className={`font-bold text-sm uppercase tracking-widest mb-3 text-[color:var(--color-text-dark)]/60 ${showClosing ? 'dramatic-reveal' : 'opacity-0'}`}
                        style={{ animationDelay: '600ms' }}
                    >
                        Kami Yang Berbahagia
                    </p>

                    {/* Font disamakan dengan tema elegan menggunakan playfair */}
                    <p
                        className={`text-5xl font-serif text-[color:var(--color-primary)] ${showClosing ? 'dramatic-reveal' : 'opacity-0'}`}
                        style={{ animationDelay: '800ms', fontFamily: 'var(--font-playfair)' }}
                    >
                        {data.groom_name} & {data.bride_name}
                    </p>

                </div>

                {/* FOOTER - Teks statis, tidak terhubung ke form agar klien tidak bisa ubah */}
                <footer
                    id="footer-sec"
                    ref={footerRef}
                    className={`py-10 bg-[color:var(--color-secondary)] flex flex-col items-center justify-center border-t border-[color:var(--color-accent)] overflow-hidden transition-opacity ${showFooter ? 'dramatic-reveal' : 'opacity-0'}`}
                >
                    <a
                        href="https://instagram.com/temuhati.kita"
                        target="_blank"
                        rel="noreferrer"
                        className="mb-3 text-[color:var(--color-primary)] opacity-80 hover:opacity-100 transition-opacity"
                    >
                        <InstagramIcon className="w-5 h-5" />
                    </a>
                    <p className="text-xs text-[color:var(--color-text-dark)]/60 font-medium">
                        by <span className="font-bold underline decoration-[color:var(--color-primary)]/40 underline-offset-4 text-[color:var(--color-primary)] hover:opacity-80 transition-opacity">TemuHati</span>
                    </p>
                </footer>

            </div>
        </div>
    )
}