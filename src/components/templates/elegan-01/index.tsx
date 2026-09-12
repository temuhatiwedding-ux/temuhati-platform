'use client'

import { useState, useRef, useEffect } from 'react'
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
    const [isOpened, setIsOpened] = useState(false)
    const [isPlaying, setIsPlaying] = useState(true)
    const audioRef = useRef<HTMLAudioElement>(null)
    const content = data.content_data || {}
    const defaultMusic = "https://temuhatiinvite.com/master-music/laksana-surgaku.mp3"
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

    // 1. Ganti fallback galeri ke R2
    const gallery = savedPhotos.length > 0 ? savedPhotos : [
        'https://temuhatiinvite.com/dummy-photos/elegan-01/galeri-1.jpg',
        'https://temuhatiinvite.com/dummy-photos/elegan-01/galeri-2.jpg',
        'https://temuhatiinvite.com/dummy-photos/elegan-01/galeri-3.jpg',
        'https://temuhatiinvite.com/dummy-photos/elegan-01/galeri-4.jpg',
        'https://temuhatiinvite.com/dummy-photos/elegan-01/galeri-5.jpg',
        'https://temuhatiinvite.com/dummy-photos/elegan-01/galeri-6.jpg'
    ]

    const themeColor = "#a4825e"

    // 2. Ganti fallback cover, foto mempelai, dan penutup ke R2
    const defaultCover = "https://temuhatiinvite.com/dummy-photos/elegan-01/cover.png"
    const coverImage = content.coverPhoto || defaultCover

    const defaultGroom = "https://temuhatiinvite.com/dummy-photos/elegan-01/mempelai-pria.jpg"
    const groomPhoto = content.groomPhoto || defaultGroom

    const defaultBride = "https://temuhatiinvite.com/dummy-photos/elegan-01/mempelai-wanita.jpg"
    const bridePhoto = content.bridePhoto || defaultBride

    const defaultClosing = "https://temuhatiinvite.com/dummy-photos/elegan-01/prewedding-penutup.jpg"
    const closingPhoto = content.closingPhoto || defaultClosing

    const toggleMusic = () => {
        if (audioRef.current) {
            isPlaying ? audioRef.current.pause() : audioRef.current.play()
            setIsPlaying(!isPlaying)
        }
    }

    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

    useEffect(() => {
        const getTargetDate = () => {
            if (!events?.akad?.date) return new Date().getTime()

            let dateStr = events.akad.date.toLowerCase()

            // 1. Hapus nama hari (contoh: "Sabtu, " -> "")
            dateStr = dateStr.replace(/^(senin|selasa|rabu|kamis|jumat|sabtu|minggu)[,\s]*/i, '')

            // 2. Terjemahkan nama bulan ke Inggris agar bisa dibaca JS
            const bulanMap: Record<string, string> = {
                'januari': 'Jan', 'februari': 'Feb', 'maret': 'Mar', 'april': 'Apr',
                'mei': 'May', 'juni': 'Jun', 'juli': 'Jul', 'agustus': 'Aug',
                'september': 'Sep', 'oktober': 'Oct', 'november': 'Nov', 'desember': 'Dec'
            }
            Object.keys(bulanMap).forEach(key => {
                dateStr = dateStr.replace(key, bulanMap[key])
            })

            // 3. Ambil format jam saja (contoh: "08:00 WIB" atau "08:00 - Selesai" -> "08:00")
            let timeStr = events?.akad?.time ? events.akad.time.split('-')[0].trim() : '08:00'
            timeStr = timeStr.replace(/[^0-9:]/g, '').substring(0, 5)
            if (!timeStr) timeStr = '08:00'

            // 4. Gabungkan dan ubah ke timestamp
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
    }, [events?.akad?.date, events?.akad?.time]) // Update otomatis jika tanggal/jam di form diedit


    const formatTanggal = (dateStr: string) => {
        if (!dateStr) return '';
        // Jika formatnya YYYY-MM-DD (mengandung strip)
        if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const date = new Date(dateStr);
            return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        }
        return dateStr; // Biarkan jika klien sudah mengetik teks manual
    }

    const [showGift, setShowGift] = useState(false)

    // Data cadangan jika dari database kosong
    const gifts: any = content.gift?.banks || [
        { name: 'BCA', account: '1234567890', holder: 'Ardi Pratama' },
        { name: 'MANDIRI', account: '0987654321', holder: 'Rania Safitri' }
    ]

    const liveStream = content.live_stream || { enabled: false, url: '' }

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

                    {/* TAMPILKAN NAMA TAMU DISINI */}
                    <p className="text-base font-bold mb-8 drop-shadow-md capitalize">{guestName}</p>

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
            {musicUrl && (
                <>
                    <audio ref={audioRef} autoPlay loop className="hidden" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}>
                        <source src={musicUrl} type="audio/mpeg" />
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

                {/* Groom (Pria) */}
                <div className="mb-8">
                    <img src={groomPhoto} alt="Groom" className="w-2/3 max-w-[240px] aspect-[3/4] object-cover mx-auto rounded-2xl mb-6 shadow-sm" onError={(e) => {
                        e.currentTarget.onerror = null; // Mencegah infinite loop
                        e.currentTarget.src = 'https://temuhatiinvite.com/dummy-photos/elegan-01/galeri-1.jpg';
                    }} />
                    <h3 className="text-2xl font-serif font-bold mb-2" style={{ color: themeColor }}>{groom.fullName}</h3>
                    <p className="text-sm text-stone-600 mb-4">Putra {groom.order} dari Bapak {groom.fatherName || '-'} & Ibu {groom.motherName || '-'}</p>

                    {/* Tombol IG Pria */}
                    {groom.ig && (
                        <a href={`https://instagram.com/${groom.ig.replace('@', '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full border text-xs font-medium transition-colors hover:bg-stone-50" style={{ borderColor: themeColor, color: themeColor }}>
                            <InstagramIcon className="w-3.5 h-3.5" />
                            {groom.ig.startsWith('@') ? groom.ig : `@${groom.ig}`}
                        </a>
                    )}
                </div>

                <div className="text-5xl font-serif my-12" style={{ color: themeColor }}>&</div>

                {/* Bride (Wanita) */}
                <div className="mb-12">
                    <img src={bridePhoto} alt="Bride" className="w-2/3 max-w-[240px] aspect-[3/4] object-cover mx-auto rounded-2xl mb-6 shadow-sm" onError={(e) => {
                        e.currentTarget.onerror = null; // Mencegah infinite loop
                        e.currentTarget.src = 'https://temuhatiinvite.com/dummy-photos/elegan-01/galeri-1.jpg';
                    }} />
                    <h3 className="text-2xl font-serif font-bold mb-2" style={{ color: themeColor }}>{bride.fullName}</h3>
                    <p className="text-sm text-stone-600 mb-4">Putri {bride.order} dari Bapak {bride.fatherName || '-'} & Ibu {bride.motherName || '-'}</p>

                    {/* Tombol IG Wanita */}
                    {bride.ig && (
                        <a href={`https://instagram.com/${bride.ig.replace('@', '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full border text-xs font-medium transition-colors hover:bg-stone-50" style={{ borderColor: themeColor, color: themeColor }}>
                            <InstagramIcon className="w-3.5 h-3.5" />
                            {bride.ig.startsWith('@') ? bride.ig : `@${bride.ig}`}
                        </a>
                    )}
                </div>
            </div>

            {/* Event Details */}
            <div className="py-16 px-6 flex flex-col items-center bg-[#fcfbf9] text-center">
                <img src={coverImage} alt="Event" className="w-full max-w-sm aspect-square object-cover rounded-t-[200px] mb-8 shadow-sm" />
                <h2 className="text-2xl font-bold text-stone-800 mb-8">Save The Date</h2>

                {/* Countdown Box */}
                <div className="flex gap-3 mb-12 w-full max-w-sm justify-center">
                    <div className="flex flex-col items-center justify-center p-3 bg-white shadow-sm rounded-xl border border-stone-100 min-w-[70px]">
                        <span className="text-2xl font-serif font-bold" style={{ color: themeColor }}>{timeLeft.days}</span>
                        <span className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold mt-1">Hari</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 bg-white shadow-sm rounded-xl border border-stone-100 min-w-[70px]">
                        <span className="text-2xl font-serif font-bold" style={{ color: themeColor }}>{timeLeft.hours}</span>
                        <span className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold mt-1">Jam</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 bg-white shadow-sm rounded-xl border border-stone-100 min-w-[70px]">
                        <span className="text-2xl font-serif font-bold" style={{ color: themeColor }}>{timeLeft.minutes}</span>
                        <span className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold mt-1">Menit</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 bg-white shadow-sm rounded-xl border border-stone-100 min-w-[70px]">
                        <span className="text-2xl font-serif font-bold" style={{ color: themeColor }}>{timeLeft.seconds}</span>
                        <span className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold mt-1">Detik</span>
                    </div>
                </div>

                {/* AKAD */}
                <div className="mb-6 w-full max-w-sm bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
                    <h3 className="text-2xl font-serif font-bold mb-4" style={{ color: themeColor }}>Akad Nikah</h3>
                    <p className="text-sm text-stone-700 mb-2 uppercase tracking-wide">
                        {events.akad?.day ? `${events.akad.day}, ` : ''}{formatTanggal(events.akad?.date)}
                    </p>
                    <p className="text-sm font-bold text-stone-800 mb-4">PUKUL : {events.akad?.time}</p>
                    <p className="text-sm text-stone-600 leading-relaxed mb-6">{events.akad?.location}</p>
                    <a href={events.akad?.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-90" style={{ backgroundColor: themeColor }}>
                        <MapPin className="w-4 h-4" />
                        Lokasi Akad
                    </a>
                </div>

                {/* RESEPSI */}
                <div className="mb-4 w-full max-w-sm bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
                    <h3 className="text-2xl font-serif font-bold mb-4" style={{ color: themeColor }}>Resepsi</h3>
                    <p className="text-sm text-stone-700 mb-2 uppercase tracking-wide">
                        {events.resepsi?.day ? `${events.resepsi.day}, ` : ''}{formatTanggal(events.resepsi?.date)}
                    </p>
                    <p className="text-sm font-bold text-stone-800 mb-4">PUKUL : {events.resepsi?.time} - Selesai</p>
                    <p className="text-sm text-stone-600 leading-relaxed mb-6">{events.resepsi?.location}</p>
                    <a href={events.resepsi?.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-90" style={{ backgroundColor: themeColor }}>
                        <MapPin className="w-4 h-4" />
                        Lokasi Resepsi
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

            {/* GALERI */}
            {galleryEnabled && gallery && gallery.length > 0 && (
                <div className="py-16 px-6 bg-white text-center border-t border-stone-100">
                    <h2 className="text-3xl font-serif font-bold mb-8" style={{ color: themeColor }}>Galeri Kami</h2>

                    <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                        {gallery.map((img: string, i: number) => (
                            <img
                                key={i}
                                src={img}
                                alt={`Gallery ${i}`}
                                className={`w-full object-cover rounded-xl shadow-sm ${i % 3 === 0 ? 'col-span-2 aspect-video' : 'aspect-square'
                                    }`}
                                onError={(e) => {
                                    e.currentTarget.onerror = null; // Mencegah infinite loop
                                    e.currentTarget.src = 'https://temuhatiinvite.com/dummy-photos/elegan-01/galeri-1.jpg';
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
            <div className="py-16 px-6 text-center text-white" style={{ backgroundColor: themeColor }}>
                <h2 className="text-3xl font-serif font-bold mb-4">Wedding Gift</h2>
                <p className="text-sm leading-relaxed mb-8 max-w-md mx-auto opacity-90">
                    Kehadiran dan doa restu Anda merupakan anugerah terindah bagi kami. Namun, apabila Anda tidak dapat hadir dan hendak memberikan tanda kasih kepada kami, Anda dapat menggunakan fitur di bawah ini.
                </p>

                {!showGift ? (
                    <button
                        onClick={() => setShowGift(true)}
                        className="border border-white text-white px-8 py-2.5 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition-all duration-300"
                    >
                        Kirim Hadiah
                    </button>
                ) : (
                    <div className="flex flex-col gap-4 items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {gifts.map((gift: any, i: number) => (
                            <div key={i} className="relative w-full max-w-[320px] h-[190px] rounded-2xl overflow-hidden shadow-xl text-left text-white border border-white/10">
                                {/* Ganti nama file gambar ini sesuai dengan nama tekstur atm lu di folder public */}
                                <img src="/templates/elegan-01/atm-texture.jpg" className="absolute inset-0 w-full h-full object-cover" alt="texture" />

                                {/* Overlay hitam transparan untuk menggelapkan gambar. Ubah bg-black/40 kalau mau lebih gelap/terang */}
                                <div className="absolute inset-0 bg-black/40"></div>

                                {/* Konten Kartu */}
                                <div className="relative z-10 w-full h-full p-6 flex flex-col justify-between">
                                    {/* Logo / Nama Bank */}
                                    <div className="flex justify-end">
                                        <span className="font-bold text-xl tracking-wider italic opacity-90">{gift.name}</span>
                                    </div>

                                    {/* Nomor Rekening & Tombol Salin */}
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-2xl font-semibold tracking-widest mb-1 shadow-sm">{gift.account}</p>
                                            <p className="text-sm opacity-80 font-medium">a.n. {gift.holder}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(gift.account);
                                                alert('Nomor rekening berhasil disalin!');
                                            }}
                                            className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all active:scale-95"
                                        >
                                            <CopyIcon className="w-3.5 h-3.5" />
                                            Salin
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>


            {/* Guestbook Form */}
            <div className="py-16 px-6" style={{ backgroundColor: themeColor }}>
                <Guestbook
                    invitationId={data.invitation_id || ''}
                    themeColor={themeColor}
                    isPreview={data.isPreview ?? !data.invitation_id} // Deteksi otomatis jika tidak ada ID berarti preview
                />
            </div>

            {/* PENUTUP */}
            {/* PENUTUP */}
            <div className="py-20 px-6 bg-white text-center flex flex-col items-center">

                {/* Foto Bulat (Mengambil dari cover/bgPhoto, fallback ke galeri) */}
                <div className="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden shadow-xl mb-8 border-4 border-white">
                    <img
                        src={closingPhoto}
                        alt="Couple Portrait"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = 'https://temuhatiinvite.com/dummy-photos/elegan-01/galeri-1.jpg' }}
                    />
                </div>

                <h2 className="text-4xl font-serif font-bold text-stone-800 mb-6">Terima Kasih</h2>

                <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed mb-10">
                    {content.closing_text || 'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir dan memberikan do\'a restu kepada kami.'}
                </p>

                <p className="font-bold text-sm uppercase tracking-widest mb-3" style={{ color: themeColor }}>
                    Kami Yang Berbahagia
                </p>

                {/* Gunakan class font latin/cursive yang lu pakai di cover di sini */}
                <p className="text-5xl" style={{ color: themeColor, fontFamily: 'cursive' }}>
                    {data.groom_name} & {data.bride_name}
                </p>
            </div>

            {/* FOOTER - Teks statis, tidak terhubung ke form agar klien tidak bisa ubah */}
            <footer className="py-10 bg-white flex flex-col items-center justify-center border-t border-stone-100">
                <a href="https://instagram.com/temuhati" target="_blank" rel="noreferrer" className="mb-3 text-stone-500 hover:text-stone-800 transition-colors">
                    <InstagramIcon className="w-5 h-5" />
                </a>
                <p className="text-xs text-stone-500 font-medium">
                    by <span className="font-bold underline decoration-stone-300 underline-offset-4 text-stone-700">TemuHati</span>
                </p>
            </footer>

        </div>
    )
}