'use client'

import { useState } from 'react'
import { InvitationData } from '@/types/invitation'

export default function Rustic01({ data }: { data: InvitationData }) {
    const [isOpened, setIsOpened] = useState(false)
    const content = data.content_data || { sections: { gallery: { enabled: true } } }

    // Fallback dummy data untuk mode dev/preview
    const bride = content.bride_details || { fullName: 'Nama Lengkap Wanita', order: 'Putri Pertama', parents: 'Bapak A & Ibu B', ig: '#' }
    const groom = content.groom_details || { fullName: 'Nama Lengkap Pria', order: 'Putra Pertama', parents: 'Bapak X & Ibu Y', ig: '#' }
    const events = content.events || {
        akad: { date: '2026-12-31', time: '08:00 WIB', location: 'Masjid Agung', mapUrl: '#' },
        resepsi: { date: '2026-12-31', time: '11:00 WIB', location: 'Gedung Serbaguna', mapUrl: '#' }
    }
    const gift = content.gift || { enabled: true, banks: [{ name: 'BCA', account: '123456789', holder: 'Nama Mempelai' }] }
    const live = content.live_stream || { enabled: true, url: '#' }

    // 1. Cover
    if (!isOpened) {
        return (
            <div className="relative w-full h-[667px] flex flex-col items-center justify-center bg-stone-100 p-4 overflow-hidden">
                {content.coverPhoto && <img src={content.coverPhoto} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-50" />}
                <div className="relative z-10 text-center flex flex-col items-center">
                    <h3 className="text-sm uppercase tracking-widest text-stone-800 mb-4 font-bold">The Wedding Of</h3>
                    <h1 className="text-5xl font-serif text-stone-900 drop-shadow-md mb-2">{data.bride_name}</h1>
                    <span className="text-3xl font-serif text-stone-800 my-2">&</span>
                    <h1 className="text-5xl font-serif text-stone-900 drop-shadow-md mb-8">{data.groom_name}</h1>
                    <button onClick={() => setIsOpened(true)} className="px-6 py-3 bg-stone-800 text-white rounded-full font-semibold shadow-lg hover:bg-stone-900 animate-bounce">
                        Buka Undangan
                    </button>
                </div>
            </div>
        )
    }

    // 2-8. Isi Undangan
    return (
        <div className="w-full bg-stone-50 text-stone-800">
            {content.musicUrl && (
                <audio autoPlay loop className="hidden"><source src={content.musicUrl} type="audio/mpeg" /></audio>
            )}

            {/* Page Utama & Save the Date */}
            <div className="min-h-[500px] flex flex-col items-center justify-center p-8 text-center bg-stone-100">
                <h2 className="text-3xl font-serif mb-4">We Are Getting Married</h2>
                <p className="text-sm mb-6">Kami mengundang Anda untuk hadir di momen bahagia kami.</p>
                <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan+Kami" target="_blank" rel="noreferrer" className="px-6 py-2 border border-stone-800 rounded-full text-sm font-semibold">
                    Save the Date
                </a>
            </div>

            {/* Kutipan */}
            <div className="p-8 text-center italic text-sm text-stone-600 bg-white">
                "{content.quote || 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri...'}"
            </div>

            {/* Data Mempelai */}
            <div className="p-8 flex flex-col gap-8 bg-stone-50">
                <div className="text-center">
                    <h3 className="text-2xl font-serif mb-2">{bride.fullName}</h3>
                    <p className="text-xs text-stone-500 mb-2">{bride.order} dari {bride.parents}</p>
                    <a href={bride.ig} target="_blank" rel="noreferrer" className="text-xs bg-stone-200 px-3 py-1 rounded">Instagram</a>
                </div>
                <div className="text-center text-xl font-serif">&</div>
                <div className="text-center">
                    <h3 className="text-2xl font-serif mb-2">{groom.fullName}</h3>
                    <p className="text-xs text-stone-500 mb-2">{groom.order} dari {groom.parents}</p>
                    <a href={groom.ig} target="_blank" rel="noreferrer" className="text-xs bg-stone-200 px-3 py-1 rounded">Instagram</a>
                </div>
            </div>

            {/* Acara & Countdown */}
            <div className="p-8 bg-stone-800 text-stone-100 text-center">
                <h2 className="text-3xl font-serif mb-6">Jadwal Acara</h2>

                <div className="mb-8 border border-stone-600 p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">Akad Nikah</h3>
                    <p className="text-sm">{events.akad?.date}</p>
                    <p className="text-sm mb-4">{events.akad?.time}</p>
                    <p className="text-sm mb-4">{events.akad?.location}</p>
                    <a href={events.akad?.mapUrl} target="_blank" rel="noreferrer" className="text-xs bg-stone-100 text-stone-900 px-4 py-2 rounded">Buka Maps</a>
                </div>

                <div className="border border-stone-600 p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">Resepsi</h3>
                    <p className="text-sm">{events.resepsi?.date}</p>
                    <p className="text-sm mb-4">{events.resepsi?.time}</p>
                    <p className="text-sm mb-4">{events.resepsi?.location}</p>
                    <a href={events.resepsi?.mapUrl} target="_blank" rel="noreferrer" className="text-xs bg-stone-100 text-stone-900 px-4 py-2 rounded">Buka Maps</a>
                </div>
            </div>

            {/* Galeri */}
            {content.sections?.gallery?.enabled && (
                <div className="p-8 bg-white text-center">
                    <h2 className="text-2xl font-serif mb-4">Galeri Kami</h2>
                    <div className="grid grid-cols-2 gap-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-full h-32 bg-stone-200 rounded"></div>
                        ))}
                    </div>
                </div>
            )}

            {/* Live Streaming & Gift */}
            <div className="p-8 bg-stone-100 text-center flex flex-col gap-8">
                {live.enabled && (
                    <div>
                        <h2 className="text-2xl font-serif mb-2">Live Streaming</h2>
                        <a href={live.url} target="_blank" rel="noreferrer" className="px-6 py-2 bg-red-600 text-white rounded-full text-sm">Tonton Live</a>
                    </div>
                )}

                {gift.enabled && (
                    <div>
                        <h2 className="text-2xl font-serif mb-4">Wedding Gift</h2>
                        <p className="text-sm mb-4">Doa restu Anda merupakan karunia yang sangat berarti. Namun jika Anda ingin memberikan tanda kasih:</p>
                        {gift.banks.map((b, i) => (
                            <div key={i} className="bg-white p-4 rounded mb-2 shadow-sm border">
                                <p className="font-bold">{b.name}</p>
                                <p className="font-mono text-lg">{b.account}</p>
                                <p className="text-sm text-stone-500">a.n {b.holder}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Penutup */}
            <div className="p-8 bg-stone-800 text-stone-100 text-center">
                <p className="text-sm italic mb-4">{content.closing_text || 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.'}</p>
                <h2 className="text-3xl font-serif mt-6">{data.bride_name} & {data.groom_name}</h2>
            </div>
        </div>
    )
}