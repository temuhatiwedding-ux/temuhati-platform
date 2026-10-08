'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Volume2, VolumeX, MapPin, Copy } from 'lucide-react'
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

export default function Modern03({ data }: { data: InvitationData }) {
    const searchParams = useSearchParams()
    const guestName = searchParams.get('to') || 'Bapak/Ibu/Saudara/i'
    const guestId = searchParams.get('id')

    const [isOpened, setIsOpened] = useState(false)
    const [isExiting, setIsExiting] = useState(false)
    const [heroIndex, setHeroIndex] = useState(0)
    const [isMounted, setIsMounted] = useState(false)
    const [isPlaying, setIsPlaying] = useState(true)
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    const [visiblePhotos, setVisiblePhotos] = useState<Record<string, boolean>>({});

    const audioRef = useRef<HTMLAudioElement>(null)
    const supabase = createClient()

    const galleryHeaderRef = useRef<HTMLDivElement>(null);
    const galleryVideoRef = useRef<HTMLDivElement>(null);
    const galleryPhotosRef = useRef<HTMLDivElement>(null);

    const [showGalleryHeader, setShowGalleryHeader] = useState(false);
    const [showGalleryVideo, setShowGalleryVideo] = useState(false);
    const [showGalleryPhotos, setShowGalleryPhotos] = useState(false);

    const countdownRef = useRef<HTMLDivElement>(null);
    const groomRef = useRef<HTMLDivElement>(null);
    const brideRef = useRef<HTMLDivElement>(null);

    const [showCountdown, setShowCountdown] = useState(false);
    const [showGroom, setShowGroom] = useState(false);
    const [showBride, setShowBride] = useState(false);

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
        if (eventHeaderRef.current) observer.observe(eventHeaderRef.current);
        if (akadCardRef.current) observer.observe(akadCardRef.current);
        if (resepsiCardRef.current) observer.observe(resepsiCardRef.current);
        if (loveStoryImgRef.current) observer.observe(loveStoryImgRef.current);
        if (loveStoryTextRef.current) observer.observe(loveStoryTextRef.current);
        if (galleryHeaderRef.current) observer.observe(galleryHeaderRef.current);
        if (galleryVideoRef.current) observer.observe(galleryVideoRef.current);
        if (galleryPhotosRef.current) observer.observe(galleryPhotosRef.current);
        if (giftHeaderRef.current) observer.observe(giftHeaderRef.current);
        if (closingTextRef.current) observer.observe(closingTextRef.current);

        const photoElements = document.querySelectorAll('[data-photo-index]');
        photoElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [data?.content_data?.sections?.gallery?.videoUrl, data?.content_data?.sections?.gallery?.photos]);

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

    const colors = content?.theme_colors || {
        primary: '#7B959A',
        secondary: '#F3F5F4',
        accent: '#D1E0D7',
        text: '#ffffff',
        textDark: '#2F3E40'
    };

    const events: any = content.events || {
        akad: { day: 'SABTU', date: '12 OKTOBER 2026', time: '08.00 WIB', location: 'Lokasi Akad', mapUrl: '#' },
        resepsi: { day: 'SABTU', date: '12 OKTOBER 2026', time: '10.00 WIB', location: 'Lokasi Resepsi', mapUrl: '#' }
    }

    const sections: any = content.sections || {}
    const savedPhotos = sections.gallery?.photos || []

    const gallery = savedPhotos.length > 0 ? savedPhotos : [
        `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/galeri-1.jpg`,
        `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/galeri-2.jpg`,
        `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/galeri-3.jpg`,
        `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/galeri-4.jpg`,
        `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/galeri-5.jpg`,
    ]

    const themeColor = colors.primary;
    const coverImage = content.coverPhoto || `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/cover.jpg`
    const groomPhoto = content.groomPhoto || `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/mempelai-pria.jpg`
    const bridePhoto = content.bridePhoto || `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/mempelai-wanita.jpg`

    const toggleMusic = () => {
        if (audioRef.current) {
            isPlaying ? audioRef.current.pause() : audioRef.current.play()
            setIsPlaying(!isPlaying)
        }
    }

    const handleOpen = () => {
        setIsExiting(true)
        setTimeout(() => setIsOpened(true), 800)
    }

    useEffect(() => {
        if (isOpened) {
            const timer = setInterval(() => {
                setHeroIndex((prev) => prev + 1)
            }, 5000)
            return () => clearInterval(timer)
        }
    }, [isOpened])

    const heroPhotos = content.heroPhotos && content.heroPhotos.length > 0
        ? content.heroPhotos
        : [coverImage, gallery.length > 0 ? gallery[0] : groomPhoto]

    useEffect(() => {
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

    const groomInitial = data.groom_name ? data.groom_name.charAt(0).toUpperCase() : 'H';
    const brideInitial = data.bride_name ? data.bride_name.charAt(0).toUpperCase() : 'A';

    const formatEventDate = (dateString: string | undefined, manualDay: string | undefined) => {
        if (!dateString) return { day: manualDay || '-', date: '-', monthYear: '-' };
        const dateObj = new Date(dateString);
        const autoDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

        return {
            day: manualDay || autoDays[dateObj.getDay()],
            date: dateObj.getDate().toString(),
            monthYear: `${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`
        };
    };

    const akadDate = formatEventDate(events?.akad?.date, events?.akad?.day);
    const resepsiDate = formatEventDate(events?.resepsi?.date, events?.resepsi?.day);

    return (
        <div
            className={`w-full max-w-[430px] mx-auto relative bg-[color:var(--color-secondary)] shadow-2xl text-[color:var(--color-textDark)] font-sans selection:bg-slate-500 selection:text-[var(--color-text)] ${!isOpened ? 'h-[100dvh] overflow-hidden' : 'min-h-screen'}`}
            style={{
                '--color-primary': colors.primary,
                '--color-secondary': colors.secondary,
                '--color-accent': colors.accent,
                '--color-text': colors.text,
                '--color-text-dark': colors.textDark
            } as React.CSSProperties}
        >{/* --- 1. COVER SECTION (Arch Style) --- */}
            {!isOpened && (
                <div
                    // 👇 UBAH DI SINI: Ganti bg-[color:var(--color-secondary)] jadi bg-[color:var(--color-primary)]
                    className={`absolute top-0 left-0 w-full h-[100dvh] z-[100] flex flex-col items-center justify-center bg-[color:var(--color-primary)] p-4 md:p-6 transition-transform duration-[800ms] ease-in-out ${isExiting ? '-translate-y-full' : 'translate-y-0'}`}
                >
                    <div className="relative w-full h-full border-[1px] border-[color:var(--color-accent)] rounded-t-[10rem] rounded-b-xl overflow-hidden shadow-inner flex flex-col justify-end p-6">
                        <img src={coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                        <div className="relative z-10 w-full text-center flex flex-col items-center">
                            <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-white/90 mb-4 cover-animate">The Wedding Of</p>
                            <h1 className="text-4xl leading-tight mb-8 cover-animate cover-delay-150 text-[color:var(--color-text)]" style={{ fontFamily: 'var(--font-playfair)' }}>
                                <span className="block italic">{data.groom_name || 'Habib'}</span>
                                <span className="block text-2xl my-2 text-[color:var(--color-accent)]">&</span>
                                <span className="block italic">{data.bride_name || 'Adiba'}</span>
                            </h1>
                            <div className="w-[1px] h-12 bg-white/50 mb-6 cover-animate cover-delay-300"></div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-white/80 mb-1 cover-animate cover-delay-300">Dear</p>
                            <p className="text-base font-bold mb-8 text-[color:var(--color-text)] capitalize cover-animate cover-delay-300">{guestName}</p>

                            {/* Tombol juga disesuaikan biar kontras kalau bingkainya warna gelap */}
                            <button
                                onClick={handleOpen}
                                className="w-max bg-[color:var(--color-primary)] backdrop-blur-sm border border-[color:var(--color-accent)] text-[color:var(--color-text)] font-medium text-sm py-2.5 px-6 rounded-full hover:opacity-80 transition-all cover-animate cover-delay-500"
                            >
                                Buka Undangan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- 2. MAIN CONTENT --- */}
            {musicUrl && isOpened && (
                <>
                    <audio ref={audioRef} autoPlay loop className="hidden" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}>
                        <source src={musicUrl} type="audio/mpeg" />
                    </audio>
                    <button onClick={toggleMusic} className="fixed bottom-6 right-6 z-50 p-3.5 bg-white/80 backdrop-blur-md border border-[color:var(--color-accent)] text-[color:var(--color-primary)] rounded-full shadow-xl hover:scale-95 transition-transform flex items-center justify-center">
                        {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>
                </>
            )}

            {/* --- HERO SECTION (Clean Border) --- */}
            {/* 👇 Background pembungkus diganti ke primary */}
            <div className="relative w-full h-[85dvh] flex flex-col p-4 bg-[color:var(--color-primary)]">
                <div className="relative w-full h-full rounded-t-[10rem] overflow-hidden border-[1px] border-[color:var(--color-accent)]">
                    <div
                        className="absolute top-0 right-0 w-full h-full flex flex-row-reverse transition-transform duration-[4000ms] ease-out"
                        style={{ transform: `translateX(${heroIndex * 100}%)` }}
                    >
                        {Array.from({ length: 20 }).map((_, idx) => (
                            <img
                                key={idx}
                                src={heroPhotos[idx % heroPhotos.length]}
                                alt={`Hero slide ${idx}`}
                                className="w-full h-full shrink-0 object-cover object-top"
                            />
                        ))}
                    </div>
                    <div className="absolute inset-0 bg-black/20" />

                    {/* Inner minimal border */}
                    <div className="absolute inset-3 border border-white/30 rounded-t-[9.5rem] z-20 pointer-events-none" />

                    {/* 👇 Gradient fade disesuaikan jadi warna primary */}
                    <div className="absolute bottom-0 w-full p-8 text-center bg-gradient-to-t from-[color:var(--color-primary)] via-[color:var(--color-primary)]/80 to-transparent pt-32 z-30">
                        <p className={`text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-accent)] mb-3 ${(isOpened || isExiting) ? 'dramatic-reveal' : 'opacity-0'}`} style={{ animationDelay: '400ms' }}>
                            We Are Getting Married
                        </p>
                        {/* 👇 Teks berubah jadi terang (text) */}
                        <h2 className={`text-4xl text-[color:var(--color-text)] mb-4 italic ${(isOpened || isExiting) ? 'dramatic-reveal' : 'opacity-0'}`} style={{ fontFamily: 'var(--font-playfair)', animationDelay: '800ms' }}>
                            {data.groom_name} & {data.bride_name}
                        </h2>
                        <div className={`w-[1px] h-8 bg-[color:var(--color-accent)] mx-auto mb-4 ${(isOpened || isExiting) ? 'dramatic-reveal' : 'opacity-0'}`} style={{ animationDelay: '1000ms' }}></div>
                        <p className={`text-xs font-medium tracking-[0.2em] uppercase text-[color:var(--color-text)]/80 ${(isOpened || isExiting) ? 'dramatic-reveal' : 'opacity-0'}`} style={{ animationDelay: '1200ms' }}>
                            {events?.akad?.date ? events.akad.date.split('-').reverse().join('. ') : 'TBA'}
                        </p>
                    </div>
                </div>
            </div>

            {/* --- QUOTE & COUNTDOWN (Minimalist Arch Boxes) --- */}
            {/* 👇 Background section diganti ke primary */}
            <div className="w-full bg-[color:var(--color-primary)] pt-12 pb-20 px-6 relative z-10 flex flex-col items-center">
                <div id="countdown-sec" ref={countdownRef} className="text-center w-full">

                    {/* Kutipan */}
                    <div className={`mb-16 text-[color:var(--color-text)] ${(isOpened || isExiting) && showCountdown ? 'dramatic-reveal' : 'opacity-0'}`}>
                        <svg className="w-6 h-6 mx-auto mb-4 text-[color:var(--color-accent)]" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                        <p className="text-xs leading-relaxed max-w-[300px] mx-auto italic font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                            "{content?.quote || 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri...'}"
                        </p>
                        <p className="mt-4 text-[10px] uppercase tracking-widest font-bold">
                            {content?.quote_source || '(Qs. Ar-Rum : 21)'}
                        </p>
                    </div>

                    <p className={`text-[10px] uppercase tracking-[0.3em] mb-6 text-[color:var(--color-accent)] ${(isOpened || isExiting) && showCountdown ? 'dramatic-reveal' : 'opacity-0'}`} style={{ animationDelay: '300ms' }}>Menuju Hari Bahagia</p>

                    {/* Countdown Boxes */}
                    <div className="flex items-center justify-center gap-3 w-full max-w-[320px] mx-auto">
                        {[
                            { label: 'Hari', value: timeLeft.days, delay: '400ms' },
                            { label: 'Jam', value: timeLeft.hours, delay: '500ms' },
                            { label: 'Menit', value: timeLeft.minutes, delay: '600ms' },
                            { label: 'Detik', value: timeLeft.seconds, delay: '700ms' },
                        ].map((item, index) => (
                            <div
                                key={index}
                                // 👇 Box dibikin transparan (bg-transparent), outline doang pakai warna accent
                                className={`flex flex-col items-center justify-center w-[70px] h-[90px] border border-[color:var(--color-accent)] rounded-t-full rounded-b-full bg-transparent shadow-sm ${(isOpened || isExiting) && showCountdown ? 'dramatic-reveal' : 'opacity-0'}`}
                                style={{ animationDelay: item.delay }}
                            >
                                {/* 👇 Teks angka dibikin terang */}
                                <span className="text-2xl font-serif text-[color:var(--color-text)]" style={{ fontFamily: 'var(--font-playfair)' }}>{item.value}</span>
                                <span className="text-[9px] tracking-wider uppercase mt-1 text-[color:var(--color-text)]/70">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* --- COUPLE SECTION (Symmetrical Arch) --- */}
            <div className="w-full bg-white relative py-20 px-6 border-y border-[color:var(--color-accent)]/30">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-12 bg-[color:var(--color-accent)]"></div>

                {/* GROOM */}
                <div id="groom-sec" ref={groomRef} className="flex flex-col items-center text-center mb-16">
                    <div className={`relative w-48 aspect-[3/4] mb-6 p-2 border border-[color:var(--color-accent)] rounded-t-full ${showGroom ? 'dramatic-reveal' : 'opacity-0'}`}>
                        <img src={content?.groomPhoto || `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/mempelai-pria.jpg`} alt="Groom" className="w-full h-full object-cover rounded-t-full grayscale-[20%]" />
                    </div>
                    <div className={`${showGroom ? 'dramatic-reveal' : 'opacity-0'}`} style={{ animationDelay: '300ms' }}>
                        <h3 className="text-3xl text-[color:var(--color-primary)] mb-2 italic" style={{ fontFamily: 'var(--font-playfair)' }}>
                            {content?.groom_details?.fullName || data.groom_name || 'Habib Yulianto'}
                        </h3>
                        <p className="text-[11px] text-[color:var(--color-textDark)]/70 uppercase tracking-widest leading-relaxed">
                            Putra {content?.groom_details?.order || 'Kedua'} Dari <br />
                            <span className="font-bold">Bpk. {content?.groom_details?.fatherName || 'M. Dawam'} & Ibu {content?.groom_details?.motherName || 'Dewi Sudarwati'}</span>
                        </p>
                        {content?.groom_details?.ig && (
                            <a href={`https://instagram.com/${content.groom_details.ig.replace('@', '')}`} target="_blank" rel="noreferrer" className="inline-flex mt-4 text-[color:var(--color-accent)] hover:text-[color:var(--color-primary)] transition-colors">
                                <InstagramIcon className="w-5 h-5" />
                            </a>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-center my-10 opacity-50">
                    <div className="w-[1px] h-16 bg-[color:var(--color-accent)]"></div>
                    <span className="mx-6 text-4xl text-[color:var(--color-primary)] italic font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>&</span>
                    <div className="w-[1px] h-16 bg-[color:var(--color-accent)]"></div>
                </div>

                {/* BRIDE */}
                <div id="bride-sec" ref={brideRef} className="flex flex-col items-center text-center">
                    <div className={`relative w-48 aspect-[3/4] mb-6 p-2 border border-[color:var(--color-accent)] rounded-b-full ${showBride ? 'dramatic-reveal' : 'opacity-0'}`}>
                        <img src={content?.bridePhoto || `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/mempelai-wanita.jpg`} alt="Bride" className="w-full h-full object-cover rounded-b-full grayscale-[20%]" />
                    </div>
                    <div className={`${showBride ? 'dramatic-reveal' : 'opacity-0'}`} style={{ animationDelay: '300ms' }}>
                        <h3 className="text-3xl text-[color:var(--color-primary)] mb-2 italic" style={{ fontFamily: 'var(--font-playfair)' }}>
                            {content?.bride_details?.fullName || data.bride_name || 'Adiba Putri Syakila'}
                        </h3>
                        <p className="text-[11px] text-[color:var(--color-textDark)]/70 uppercase tracking-widest leading-relaxed">
                            Putri {content?.bride_details?.order || 'Pertama'} Dari <br />
                            <span className="font-bold">Bpk. {content?.bride_details?.fatherName || 'Anas Rifai'} & Ibu {content?.bride_details?.motherName || 'Kholifah'}</span>
                        </p>
                        {content?.bride_details?.ig && (
                            <a href={`https://instagram.com/${content.bride_details.ig.replace('@', '')}`} target="_blank" rel="noreferrer" className="inline-flex mt-4 text-[color:var(--color-accent)] hover:text-[color:var(--color-primary)] transition-colors">
                                <InstagramIcon className="w-5 h-5" />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* --- EVENT SECTION (Minimalist Cards) --- */}
            {/* 👇 Background section diganti ke primary */}
            <div className="w-full bg-[color:var(--color-primary)] py-20 px-6 relative z-10 flex flex-col items-center">
                <div id="event-header" ref={eventHeaderRef} className={`text-center mb-16 transition-all duration-[2500ms] ease-out ${showEventHeader ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-[color:var(--color-accent)] mb-2">Save The Date</p>
                    {/* 👇 Teks judul diganti ke terang */}
                    <h2 className="text-4xl text-[color:var(--color-text)] italic" style={{ fontFamily: 'var(--font-playfair)' }}>Wedding Events</h2>
                </div>

                {/* AKAD KARTU */}
                <div id="akad-card" ref={akadCardRef} className={`w-full max-w-[320px] bg-transparent mb-10 border border-[color:var(--color-accent)] rounded-t-full p-2 shadow-sm transition-all duration-[2000ms] ease-out ${showAkadCard ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
                    <div className="w-full aspect-square rounded-t-full overflow-hidden mb-6">
                        <img src={content?.akadPhoto || `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/galeri-1.jpg`} alt="Akad Nikah" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center px-4 pb-8">
                        <h3 className="text-2xl text-[color:var(--color-text)] mb-2 uppercase tracking-widest font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>Akad Nikah</h3>
                        <div className="w-8 h-[1px] bg-[color:var(--color-accent)] mx-auto mb-4"></div>
                        <p className="text-sm font-bold text-[color:var(--color-text)] uppercase mb-1">{akadDate.day}, {akadDate.date} {akadDate.monthYear}</p>
                        <p className="text-xs text-[color:var(--color-text)]/70 mb-6">Pukul : {events?.akad?.time || '08.00 WIB'}</p>

                        {/* 👇 Udah dipisah spasinya dan ditambah whitespace-pre-line */}
                        <p className="text-[11px] text-[color:var(--color-text)]/80 mb-6 leading-relaxed max-w-[250px] mx-auto whitespace-pre-line">
                            {events?.akad?.location || 'Kediaman Mempelai Wanita, Ds Pagu, Wates, Kediri'}
                        </p>

                        {events?.akad?.mapUrl && (
                            <a href={events.akad.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 border border-[color:var(--color-accent)] text-[color:var(--color-text)] px-6 py-2 rounded-full text-[10px] uppercase tracking-widest hover:bg-[color:var(--color-text)] hover:text-[color:var(--color-primary)] transition-colors">
                                <MapPin className="w-3 h-3" /> Lokasi
                            </a>
                        )}
                    </div>
                </div>

                {/* RESEPSI KARTU */}
                <div id="resepsi-card" ref={resepsiCardRef} className={`w-full max-w-[320px] bg-transparent border border-[color:var(--color-accent)] rounded-b-full p-2 shadow-sm transition-all duration-[2000ms] ease-out ${showResepsiCard ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
                    <div className="text-center px-4 pt-8 pb-6">
                        <h3 className="text-2xl text-[color:var(--color-text)] mb-2 uppercase tracking-widest font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>Resepsi</h3>
                        <div className="w-8 h-[1px] bg-[color:var(--color-accent)] mx-auto mb-4"></div>
                        <p className="text-sm font-bold text-[color:var(--color-text)] uppercase mb-1">{resepsiDate.day}, {resepsiDate.date} {resepsiDate.monthYear}</p>
                        <p className="text-xs text-[color:var(--color-text)]/70 mb-6">Pukul : {events?.resepsi?.time || '10.00 WIB - Selesai'}</p>

                        {/* 👇 Ditambahin whitespace-pre-line juga di sini */}
                        <p className="text-[11px] text-[color:var(--color-text)]/80 mb-6 leading-relaxed max-w-[250px] mx-auto whitespace-pre-line">
                            {events?.resepsi?.location || 'Kediaman Mempelai Wanita, Ds Pagu, Wates, Kediri'}
                        </p>

                        {events?.resepsi?.mapUrl && (
                            <a href={events.resepsi.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 border border-[color:var(--color-accent)] text-[color:var(--color-text)] px-6 py-2 rounded-full text-[10px] uppercase tracking-widest hover:bg-[color:var(--color-text)] hover:text-[color:var(--color-primary)] transition-colors">
                                <MapPin className="w-3 h-3" /> Lokasi
                            </a>
                        )}
                    </div>
                    <div className="w-full aspect-square rounded-b-full overflow-hidden">
                        <img src={content?.resepsiPhoto || `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/galeri-2.jpg`} alt="Resepsi" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            {/* --- GALLERY SECTION (2-Column Grid Minimalist) --- */}
            {content?.sections?.gallery?.enabled !== false && (
                <div className="w-full bg-white py-20 px-6 flex flex-col items-center border-y border-[color:var(--color-accent)]/30">
                    <div id="gallery-header" ref={galleryHeaderRef} className={`text-center mb-12 transition-all duration-[2500ms] ease-out ${showGalleryHeader ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-[color:var(--color-primary)] mb-2">Beautiful Moments</p>
                        <h2 className="text-4xl text-[color:var(--color-textDark)] italic" style={{ fontFamily: 'var(--font-playfair)' }}>Our Gallery</h2>
                    </div>

                    <div id="gallery-photos" className="w-full max-w-[360px] mx-auto grid grid-cols-2 gap-3">
                        {gallery.map((photoUrl: string, index: number) => (
                            <div
                                key={index}
                                data-photo-index={`gal-${index}`}
                                className={`w-full overflow-hidden border border-[color:var(--color-accent)]/50 transition-all duration-[2000ms] ease-out ${index % 2 === 0 ? 'rounded-tl-3xl rounded-br-3xl aspect-[4/5]' : 'rounded-tr-3xl rounded-bl-3xl aspect-square mt-6'
                                    } ${visiblePhotos[`gal-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
                            >
                                <img src={photoUrl} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- LIVE STREAMING SECTION --- */}
            {content?.live_stream?.enabled !== false && (
                <div className="w-full bg-[color:var(--color-secondary)] py-20 px-6 flex flex-col items-center border-t border-[color:var(--color-accent)]/30">
                    <div className="text-center mb-10">
                        <p className="text-[10px] uppercase tracking-[0.4em] text-[color:var(--color-primary)] mb-2">Virtual Invitation</p>
                        <h2 className="text-4xl md:text-5xl text-[color:var(--color-textDark)] italic font-serif mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>Live Streaming</h2>
                        <p className="text-xs text-slate-600 leading-relaxed max-w-[280px] mx-auto mb-8">
                            Kami mengundang Bapak/Ibu/Saudara/i untuk menyaksikan pernikahan kami secara virtual melalui siaran langsung di bawah ini:
                        </p>

                        <div className="border-y border-[color:var(--color-accent)]/50 py-3 mb-8 inline-block px-8">
                            <p className="text-xs font-bold tracking-widest text-[color:var(--color-textDark)] uppercase">{akadDate.day}, {akadDate.date} {akadDate.monthYear}</p>
                            <p className="text-[11px] text-slate-500 mt-1">Pukul : {events?.akad?.time || '08.00 WIB'}</p>
                        </div>
                    </div>

                    <div className="w-full max-w-[360px] mx-auto p-2 border border-[color:var(--color-accent)] bg-white shadow-sm">
                        <div className="w-full aspect-video bg-slate-900 flex items-center justify-center relative overflow-hidden">
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
                                <p className="text-[10px] text-white/50 uppercase tracking-widest">Video tidak tersedia</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* --- LOVE STORY SECTION (Overlay Card) --- */}
            {/* 👇 Background utama section diubah ke primary */}
            {content?.love_story?.enabled !== false && (
                <div className="w-full bg-[color:var(--color-primary)] py-20 px-6 flex flex-col items-center relative overflow-hidden">

                    {/* Foto Love Story */}
                    <div id="lovestory-img" ref={loveStoryImgRef} className={`relative w-full max-w-[340px] aspect-[4/5] rounded-t-full overflow-hidden border border-[color:var(--color-accent)] mb-8 transition-all duration-[2500ms] ease-out ${showLoveStoryImg ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
                        <img src={content?.loveStoryPhoto || `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/modern-02/galeri-2.jpg`} alt="Love Story" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20" />
                    </div>

                    {/* 👇 Background card diubah ke primary biar nge-blend elegan */}
                    <div id="lovestory-text" ref={loveStoryTextRef} className={`w-full max-w-[300px] bg-[color:var(--color-primary)] border border-[color:var(--color-accent)] p-6 md:p-8 -mt-24 relative z-10 text-center shadow-lg transition-all duration-[2500ms] ease-out delay-150 ${showLoveStoryText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>

                        {/* 👇 Teks diubah jadi text terang */}
                        <h2 className="text-3xl text-[color:var(--color-text)] font-serif italic mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>Love Story</h2>

                        <div className="space-y-6">
                            {(() => {
                                const storiesToRender = content?.love_story?.stories?.length
                                    ? content.love_story.stories
                                    : [
                                        { year: 'Pertemuan', text: 'Berawal dari pertemuan sederhana yang menumbuhkan rasa nyaman.' },
                                        { year: 'Komitmen', text: 'Dengan niat tulus, kami memutuskan untuk melangkah bersama.' }
                                    ];





                                return storiesToRender.map((story: any, index: number) => (
                                    <div key={index} className="relative">
                                        {/* 👇 Judul tahun dan isi cerita pakai text terang */}
                                        <h3 className="text-xs uppercase tracking-widest font-bold text-[color:var(--color-text)] mb-2">{story.year}</h3>

                                        <p className="text-[11px] text-[color:var(--color-text)]/80 leading-relaxed whitespace-pre-line">
                                            {story.text}
                                        </p>

                                        {index !== storiesToRender.length - 1 && (
                                            <div className="w-[1px] h-6 bg-[color:var(--color-accent)] mx-auto mt-4"></div>
                                        )}
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>
                </div>
            )}

            {/* --- WEDDING GIFT (Minimalist Frame) --- */}
            {content?.gift?.enabled !== false && (
                <div id="gift-section" className="w-full bg-white pt-20 pb-32 px-6 flex flex-col items-center border-t border-[color:var(--color-accent)]/30">
                    <div id="gift-header" ref={giftHeaderRef} className={`text-center w-full max-w-md mx-auto transition-all duration-[2500ms] ease-out ${showGiftHeader ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-[color:var(--color-primary)] mb-2">Send Gift</p>
                        <h2 className="text-4xl md:text-4xl mb-6 font-serif text-[color:var(--color-textDark)] italic" style={{ fontFamily: 'var(--font-playfair)' }}>Wedding Gift</h2>
                        <p className="text-xs text-slate-500 leading-relaxed mb-8 max-w-[280px] mx-auto">
                            Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Jika memberi adalah ungkapan kasih, Anda dapat mengirimkannya melalui:
                        </p>

                        <button onClick={() => setIsGiftOpen(!isGiftOpen)} className="bg-[color:var(--color-primary)] text-[color:var(--color-text)] font-bold text-xs px-8 py-3 rounded-none tracking-widest uppercase hover:opacity-80 transition-opacity">
                            {isGiftOpen ? 'Tutup' : 'Kirim Hadiah'}
                        </button>
                    </div>

                    <div className={`w-full max-w-sm mx-auto transition-all duration-700 ease-in-out overflow-hidden flex flex-col gap-4 ${isGiftOpen ? 'max-h-[1500px] opacity-100 mt-10' : 'max-h-0 opacity-0 mt-0'}`}>

                        {/* 1. KARTU REKENING BANK */}
                        {content?.gift?.banks?.map((bank: any, index: number) => (
                            <div key={index} className="w-full bg-white border border-[color:var(--color-accent)] p-6 text-center shadow-sm">
                                <h3 className="font-bold text-lg text-[color:var(--color-textDark)] tracking-widest uppercase mb-1">{bank.name}</h3>
                                <p className="text-xl tracking-[0.2em] text-[color:var(--color-primary)] font-serif mb-4">{bank.account}</p>
                                <p className="text-xs text-slate-500 uppercase tracking-widest mb-4">a.n {bank.holder}</p>
                                <button onClick={() => handleCopy(bank.account, `bank-${index}`)} className="text-[10px] border border-[color:var(--color-primary)] text-[color:var(--color-primary)] px-4 py-1.5 uppercase font-bold tracking-widest hover:bg-[color:var(--color-primary)] hover:text-[color:var(--color-text)] transition-colors">
                                    {copiedId === `bank-${index}` ? 'Tersalin' : 'Copy Rekening'}
                                </button>
                            </div>
                        ))}

                        {/* 2. KARTU KADO FISIK / ALAMAT */}
                        <div className="w-full bg-white border border-[color:var(--color-accent)] p-6 text-center shadow-sm mt-2">
                            <div className="flex justify-center mb-3">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-[color:var(--color-primary)]">
                                    <path d="M20 8h-3V6c0-1.1-.9-2-2-2h-2c-.6 0-1.1.3-1.5.7C11.1 4.3 10.6 4 10 4H8c-1.1 0-2 .9-2 2v2H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-9 12H3V10h8v10zm2 0V10h8v10h-8zm-3-12H8V6h2v2zm6 0h-2V6h2v2z"></path>
                                </svg>
                            </div>
                            <h4 className="font-bold text-[color:var(--color-textDark)] tracking-widest uppercase mb-4 text-[13px]">Kirim Kado Fisik</h4>
                            <div className="text-[11px] text-slate-500 space-y-3 text-left border-t border-[color:var(--color-accent)]/50 pt-4">
                                <div>
                                    <span className="font-bold text-[color:var(--color-textDark)] uppercase tracking-wider block mb-0.5">Penerima</span>
                                    {content?.gift?.physical?.recipientName || data?.groom_name || 'Nama Penerima'}
                                </div>
                                <div>
                                    <span className="font-bold text-[color:var(--color-textDark)] uppercase tracking-wider block mb-0.5">No. HP</span>
                                    {content?.gift?.physical?.phone || '-'}
                                </div>
                                <div>
                                    <span className="font-bold text-[color:var(--color-textDark)] uppercase tracking-wider block mb-0.5">Alamat</span>
                                    <span className="whitespace-pre-line leading-relaxed">
                                        {content?.gift?.physical?.address || 'Alamat belum ditambahkan'}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* --- GUESTBOOK SECTION --- */}
            <Guestbook invitationId={data?.invitation_id || ''} themeColor={themeColor || '#7B959A'} isPreview={data?.isPreview ?? !data?.invitation_id} />

            {/* --- CLOSING SECTION (Centered Arch) --- */}
            {/* 👇 Background diganti ke primary */}
            <div className="w-full bg-[color:var(--color-primary)] pt-20 pb-10 flex flex-col items-center border-t border-[color:var(--color-accent)]/30">
                <div id="closing-text" ref={closingTextRef} className={`relative w-full max-w-[320px] mx-auto text-center transition-all duration-[2000ms] ease-out ${showClosingText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>

                    <div className="w-full aspect-[3/4] border border-[color:var(--color-accent)] p-2 rounded-t-full mb-8">
                        <div className="relative w-full h-full rounded-t-full overflow-hidden">
                            {heroPhotos.map((photoUrl: string, index: number) => (
                                <img
                                    key={`closing-${index}`}
                                    src={photoUrl}
                                    alt={`Closing Slide ${index}`}
                                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] ease-in-out grayscale-[10%] ${index === (heroIndex % heroPhotos.length)
                                        ? 'opacity-100 scale-100'
                                        : 'opacity-0 scale-110'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* 👇 Judul diubah ke teks terang */}
                    <h2 className="text-4xl text-[color:var(--color-text)] italic font-serif mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>Terima Kasih</h2>

                    {/* 👇 Teks paragraf diubah ke terang dengan opacity 80% */}
                    <p className="text-xs text-[color:var(--color-text)]/80 leading-relaxed mb-8 max-w-[280px] mx-auto whitespace-pre-line">
                        {content?.closing_text || 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu berkenan hadir.'}
                    </p>

                    {/* 👇 Label "Kami Yang Berbahagia" pakai accent biar kontras */}
                    <p className="text-[10px] font-bold tracking-widest uppercase text-[color:var(--color-accent)] mb-2">Kami Yang Berbahagia,</p>

                    {/* 👇 Nama mempelai terang */}
                    <h3 className="text-2xl text-[color:var(--color-text)] italic font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                        {data?.groom_name || 'Habib'} & {data?.bride_name || 'Adiba'}
                    </h3>
                </div>

                <div className="w-full pt-16 flex flex-col items-center">
                    {/* 👇 Footer copyright juga jadi terang transparan */}
                    <p className="text-[9px] text-[color:var(--color-text)]/50 uppercase tracking-widest mb-3">
                        Made with <span className="text-red-400">❤️</span> by temuhati
                    </p>
                </div>
            </div>

            {/* Dev Tools Preview */}
            {data.isPreview && isOpened && (
                <button onClick={() => { setIsExiting(false); setIsOpened(false); }} className="fixed bottom-24 right-4 z-[9999] bg-stone-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl">
                    ⟲ Kembali Cover
                </button>
            )}
        </div>
    )
}