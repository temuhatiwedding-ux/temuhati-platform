'use client'

import { useEffect, useState } from 'react'
import { BarChart2, Users, Send, CheckCircle, QrCode, MailOpen, MessageSquare, Loader2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client' // <--- IMPORT DISESUAIKAN

interface StatistikTabProps {
    slug: string;
}

export default function StatistikTab({ slug }: StatistikTabProps) {
    const supabase = createClient() // <--- INISIALISASI SUPABASE DI SINI

    const [stats, setStats] = useState({
        totalUndangan: 0,
        terkirim: 0,
        dibuka: 0,
        rsvp_hadir: 0,
        rsvp_tidak: 0,
        rsvp_ragu: 0,
        total_pax_kuota: 0,
        total_checkin: 0,
        total_ucapan: 0
    })

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchStatistik = async () => {
            setIsLoading(true)
            try {
                // 1. Ambil data Guest List (pakai slug)
                const { data: guests, error: errGuests } = await supabase
                    .from('guest_list')
                    .select('*')
                    .eq('slug', slug)

                if (errGuests) throw errGuests

                // 2. Cari ID undangan dari tabel invitations
                const { data: invData, error: invError } = await supabase
                    .from('invitations')
                    .select('id')
                    .eq('slug', slug)
                    .single()

                if (invError) throw invError

                // 3. Ambil data Komentar (pakai invitation_id)
                const { data: comments, error: errComments } = await supabase
                    .from('comments')
                    .select('*')
                    .eq('invitation_id', invData.id) // <-- Ini fix-nya

                if (errComments) throw errComments

                if (guests && comments) {
                    setStats({
                        totalUndangan: guests.length,
                        terkirim: guests.filter(g => g.is_sent).length,
                        dibuka: guests.filter(g => g.is_opened === true).length,
                        total_pax_kuota: guests.reduce((sum, g) => sum + (g.max_pax || 0), 0),
                        total_checkin: guests.filter(g => g.is_checked_in).reduce((sum, g) => sum + (g.actual_pax || 0), 0),

                        total_ucapan: comments.length,
                        rsvp_hadir: comments.filter(c => c.attendance === 'hadir').length,
                        rsvp_tidak: comments.filter(c => c.attendance === 'tidak_hadir').length,
                        rsvp_ragu: comments.filter(c => c.attendance === 'ragu').length,
                    })
                }
            } catch (error) {
                console.error("Gagal mengambil data statistik:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (slug) fetchStatistik()
    }, [slug])

    // Kalkulasi persentase untuk progress bar
    const persenTerkirim = stats.totalUndangan > 0 ? Math.round((stats.terkirim / stats.totalUndangan) * 100) : 0
    const persenDibuka = stats.terkirim > 0 ? Math.round((stats.dibuka / stats.terkirim) * 100) : 0
    const persenCheckin = stats.total_pax_kuota > 0 ? Math.round((stats.total_checkin / stats.total_pax_kuota) * 100) : 0

    if (isLoading) {
        return (
            <div className="h-full bg-[#FBFBF9] flex items-center justify-center">
                <div className="flex flex-col items-center text-brand/50">
                    <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#8BA896]" />
                    <p className="text-sm font-bold uppercase tracking-wider">Menghitung Data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full bg-[#FBFBF9] p-4 md:p-8 overflow-y-auto relative">
            <div className="w-full max-w-[1400px] mx-auto animate-in fade-in zoom-in-95 duration-500">

                {/* HEADER SIMPLE */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-white border border-[#D1E0D7] p-2 rounded-xl shadow-sm shrink-0">
                        <BarChart2 className="w-4 h-4 text-brand" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-brand leading-none mb-1.5">Statistik Undangan</h2>
                        <p className="text-[10px] text-brand/60 font-bold uppercase tracking-wider leading-none">Pantau performa sebar undangan & kehadiran tamu</p>
                    </div>
                </div>

                {/* HIGHLIGHT METRICS (4 Kotak Atas) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-[#F0F5F2] border border-[#D1E0D7] shadow-sm rounded-3xl p-5 flex items-center gap-4 hover:border-[#B5CDBF] transition-colors">
                        <div className="p-3 bg-white border border-[#D1E0D7] text-[#007BFF] rounded-2xl shrink-0"><Send className="w-5 h-5" /></div>
                        <div>
                            <p className="text-[10px] text-brand/60 font-bold uppercase tracking-wider leading-tight">WA Terkirim</p>
                            <p className="text-2xl font-bold text-brand">{stats.terkirim} <span className="text-xs text-brand/50 font-medium">/ {stats.totalUndangan}</span></p>
                        </div>
                    </div>
                    <div className="bg-[#F0F5F2] border border-[#D1E0D7] shadow-sm rounded-3xl p-5 flex items-center gap-4 hover:border-[#B5CDBF] transition-colors">
                        <div className="p-3 bg-white border border-[#D1E0D7] text-[#8BA896] rounded-2xl shrink-0"><MailOpen className="w-5 h-5" /></div>
                        <div>
                            <p className="text-[10px] text-brand/60 font-bold uppercase tracking-wider leading-tight">Undangan Dibuka</p>
                            <p className="text-2xl font-bold text-brand">{stats.dibuka}</p>
                        </div>
                    </div>
                    <div className="bg-[#F0F5F2] border border-[#D1E0D7] shadow-sm rounded-3xl p-5 flex items-center gap-4 hover:border-[#B5CDBF] transition-colors">
                        <div className="p-3 bg-white border border-[#D1E0D7] text-[#0F5132] rounded-2xl shrink-0"><CheckCircle className="w-5 h-5" /></div>
                        <div>
                            <p className="text-[10px] text-brand/60 font-bold uppercase tracking-wider leading-tight">RSVP Hadir</p>
                            <p className="text-2xl font-bold text-brand">{stats.rsvp_hadir}</p>
                        </div>
                    </div>
                    <div className="bg-[#F0F5F2] border border-[#D1E0D7] shadow-sm rounded-3xl p-5 flex items-center gap-4 hover:border-[#B5CDBF] transition-colors">
                        <div className="p-3 bg-white border border-[#D1E0D7] text-[#3A4B40] rounded-2xl shrink-0"><QrCode className="w-5 h-5" /></div>
                        <div>
                            <p className="text-[10px] text-brand/60 font-bold uppercase tracking-wider leading-tight">Tamu Check-in</p>
                            <p className="text-2xl font-bold text-brand">{stats.total_checkin}</p>
                        </div>
                    </div>
                </div>

                {/* PROGRESS BAR & GRAFIK DETAIL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* KARTU 1: Progress Penyebaran */}
                    <div className="bg-white border border-[#D1E0D7] shadow-sm rounded-3xl p-6">
                        <h3 className="font-bold text-brand text-sm mb-5 flex items-center gap-2">
                            <Users className="w-4 h-4" /> Progress Penyebaran WA
                        </h3>

                        <div className="space-y-6">
                            {/* Bar Terkirim */}
                            <div>
                                <div className="flex justify-between text-xs font-bold text-brand mb-2">
                                    <span>Terkirim ({stats.terkirim} dari {stats.totalUndangan})</span>
                                    <span>{persenTerkirim}%</span>
                                </div>
                                <div className="w-full bg-[#F0F5F2] rounded-full h-3.5 border border-[#D1E0D7] overflow-hidden">
                                    <div className="bg-gradient-to-r from-[#8BA896] to-[#60866d] h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${persenTerkirim}%` }}></div>
                                </div>
                            </div>

                            {/* Bar Dibuka */}
                            <div>
                                <div className="flex justify-between text-xs font-bold text-brand mb-2">
                                    <span>Telah Dibuka ({stats.dibuka} dari {stats.terkirim} Terkirim)</span>
                                    <span>{persenDibuka}%</span>
                                </div>
                                <div className="w-full bg-[#F0F5F2] rounded-full h-3.5 border border-[#D1E0D7] overflow-hidden">
                                    <div className="bg-gradient-to-r from-[#3A4B40] to-[#2c3931] h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${persenDibuka}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* KARTU 2: Kehadiran Fisik & Kuota */}
                    <div className="bg-white border border-[#D1E0D7] shadow-sm rounded-3xl p-6">
                        <h3 className="font-bold text-brand text-sm mb-5 flex items-center gap-2">
                            <QrCode className="w-4 h-4" /> Utilisasi Kuota Tamu (Check-in)
                        </h3>

                        <div className="flex items-center gap-6">
                            {/* Circular Chart Sederhana pakai Conic Gradient CSS */}
                            <div className="relative w-28 h-28 rounded-full shrink-0 flex items-center justify-center bg-[#F0F5F2] shadow-inner"
                                style={{ background: `conic-gradient(#3A4B40 ${persenCheckin}%, #F0F5F2 ${persenCheckin}%)` }}
                            >
                                <div className="w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                                    <span className="text-2xl font-bold text-brand leading-none">{persenCheckin}%</span>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="flex justify-between items-center border-b border-[#D1E0D7] pb-2">
                                    <p className="text-[10px] text-brand/60 font-bold uppercase tracking-wider">Total Kuota</p>
                                    <p className="text-sm font-bold text-brand">{stats.total_pax_kuota} Pax</p>
                                </div>
                                <div className="flex justify-between items-center border-b border-[#D1E0D7] pb-2">
                                    <p className="text-[10px] text-brand/60 font-bold uppercase tracking-wider">Tamu Hadir</p>
                                    <p className="text-sm font-bold text-[#0F5132]">{stats.total_checkin} Pax</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-[10px] text-brand/60 font-bold uppercase tracking-wider">Sisa Kuota</p>
                                    <p className="text-sm font-bold text-[#842029]">{stats.total_pax_kuota - stats.total_checkin} Pax</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* KARTU 3: Detail RSVP & Komentar */}
                    <div className="bg-[#F0F5F2] border border-[#D1E0D7] shadow-sm rounded-3xl p-6 md:col-span-2">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="font-bold text-brand text-sm flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" /> Rangkuman RSVP Web
                            </h3>
                            <span className="bg-white border border-[#D1E0D7] px-3 py-1.5 rounded-xl text-[11px] uppercase tracking-wider font-bold text-brand shadow-sm">
                                {stats.total_ucapan} Total Ucapan
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white p-5 rounded-2xl border border-[#D1E0D7] text-center shadow-sm hover:border-[#B5CDBF] transition-colors">
                                <p className="text-3xl font-bold text-[#0F5132] mb-1">{stats.rsvp_hadir}</p>
                                <p className="text-[10px] text-brand/60 font-bold uppercase tracking-wider">RSVP Hadir</p>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-[#D1E0D7] text-center shadow-sm hover:border-[#B5CDBF] transition-colors">
                                <p className="text-3xl font-bold text-[#842029] mb-1">{stats.rsvp_tidak}</p>
                                <p className="text-[10px] text-brand/60 font-bold uppercase tracking-wider">RSVP Absen</p>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-[#D1E0D7] text-center shadow-sm hover:border-[#B5CDBF] transition-colors">
                                <p className="text-3xl font-bold text-[#856404] mb-1">{stats.rsvp_ragu}</p>
                                <p className="text-[10px] text-brand/60 font-bold uppercase tracking-wider">RSVP Ragu</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}