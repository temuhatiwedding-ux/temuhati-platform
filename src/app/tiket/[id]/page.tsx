'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { QRCodeSVG } from 'qrcode.react'
import { useParams } from 'next/navigation'
import { Ticket, Users, CheckCircle2, AlertCircle } from 'lucide-react'

export default function TicketPage() {
    const params = useParams()
    const id = params.id as string

    const [guest, setGuest] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function fetchGuest() {
            if (!id) return
            const { data, error } = await supabase
                .from('guest_list')
                .select('*')
                .eq('id', id)
                .single()

            if (data) setGuest(data)
            if (error) console.error(error)

            setLoading(false)
        }
        fetchGuest()
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen bg-stone-100 flex items-center justify-center">
                <p className="text-stone-500 font-medium animate-pulse">Memuat tiket...</p>
            </div>
        )
    }

    if (!guest) {
        return (
            <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
                <h1 className="text-xl font-bold text-stone-800">Tiket Tidak Ditemukan</h1>
                <p className="text-stone-500 mt-2 text-sm">Pastikan link yang Anda buka sudah benar.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FBFBF9] flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-sm bg-white rounded-3xl shadow-[0_20px_50px_rgba(58,75,64,0.08)] overflow-hidden border border-[#D1E0D7]">

                {/* Header Section */}
                <div className="bg-[#3A4B40] p-6 text-center text-[#FBFBF9] relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                    <div className="absolute -left-6 -bottom-6 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>

                    <Ticket className="w-8 h-8 mx-auto mb-3 opacity-90" />
                    <h1 className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-80 mb-1">
                        Tiket Masuk
                    </h1>
                    <h2 className="text-xl font-serif font-medium tracking-wide">
                        Resepsi Pernikahan
                    </h2>
                </div>

                {/* Body Section */}
                <div className="p-8 text-center relative">
                    {/* Efek sobekan tiket di kiri kanan */}
                    <div className="absolute -left-4 top-0 w-8 h-8 bg-[#FBFBF9] rounded-full -translate-y-1/2 border-b border-r border-[#D1E0D7]"></div>
                    <div className="absolute -right-4 top-0 w-8 h-8 bg-[#FBFBF9] rounded-full -translate-y-1/2 border-b border-l border-[#D1E0D7]"></div>

                    {/* Garis putus-putus */}
                    <div className="absolute left-6 right-6 top-0 h-[1px] border-t-2 border-dashed border-gray-200 -translate-y-1/2"></div>

                    <div className="mb-8 mt-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Nama Tamu</p>
                        <h3 className="text-2xl font-bold text-gray-800">{guest.name}</h3>
                    </div>

                    <div className="flex justify-center gap-8 mb-8">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1.5 text-gray-500 mb-1">
                                <Users className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Kuota</span>
                            </div>
                            <p className="text-lg font-bold text-gray-800">{guest.max_pax} <span className="text-sm font-normal text-gray-500">Orang</span></p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1.5 text-gray-500 mb-1">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Status</span>
                            </div>
                            {guest.is_checked_in ? (
                                <p className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full mt-1">Hadir</p>
                            ) : (
                                <p className="text-sm font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full mt-1">Belum Hadir</p>
                            )}
                        </div>
                    </div>

                    {/* QR Code Section */}
                    <div className="flex flex-col items-center">
                        <div className={`p-4 rounded-2xl bg-white border-2 ${guest.is_checked_in ? 'border-gray-200 opacity-50' : 'border-[#3A4B40]/20 shadow-sm'}`}>
                            <QRCodeSVG
                                value={`https://temuhatiinvite.com/tiket/${guest.id}`}
                                size={180}
                                bgColor={"#ffffff"}
                                fgColor={"#3A4B40"}
                                level={"H"}
                            />
                        </div>

                        <p className="mt-5 text-xs text-gray-500 max-w-[250px] leading-relaxed">
                            {guest.is_checked_in
                                ? "Tiket ini sudah digunakan untuk check-in."
                                : "Tunjukkan QR Code ini kepada penerima tamu di lokasi acara."}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}