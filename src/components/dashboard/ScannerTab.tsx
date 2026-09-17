'use client'

import { useEffect, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { createClient } from '@/utils/supabase/client'
import toast from 'react-hot-toast'
import { CheckCircle2, XCircle, Users, UserCheck } from 'lucide-react'

interface ScannerTabProps {
    slug: string;
}

export default function ScannerTab({ slug }: ScannerTabProps) {
    const supabase = createClient()
    const [scannedGuest, setScannedGuest] = useState<any>(null)
    const [actualPax, setActualPax] = useState<number | string>(1)
    const [isProcessing, setIsProcessing] = useState(false)

    useEffect(() => {
        // Inisialisasi Scanner
        const scanner = new Html5QrcodeScanner(
            "qr-reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        )

        const onScanSuccess = async (decodedText: string) => {
            if (isProcessing || scannedGuest) return

            setIsProcessing(true)
            try {
                // 1. Bersihkan teks hasil scan
                let scannedId = decodedText.trim()

                // 2. Ekstrak ID dengan lebih aman (buang parameter ? atau slash / di akhir)
                if (scannedId.includes('/tiket/')) {
                    const urlParts = scannedId.split('/tiket/')
                    scannedId = urlParts[1].split('?')[0].replace(/\/$/, '')
                }

                // 3. Cek ke database
                const { data, error } = await supabase
                    .from('guest_list')
                    .select('*')
                    .eq('id', scannedId)
                    .eq('slug', slug)
                    .single()

                if (error || !data) {
                    // Log ini buat ngecek di Inspect -> Console kalau masih gagal
                    console.error("DATA GAGAL:", { url_asli: decodedText, id_ditemukan: scannedId, slug_admin: slug, error_db: error })
                    toast.error('QR tidak valid untuk undangan ini.')
                    setIsProcessing(false)
                    return
                }

                if (data.is_checked_in) {
                    toast.error(`Tiket atas nama ${data.name} SUDAH DIPAKAI!`)
                    setIsProcessing(false)
                    return
                }

                // 4. Sukses
                setScannedGuest(data)
                setActualPax(data.max_pax)
            } catch (error) {
                console.error("SISTEM ERROR:", error)
                toast.error('Terjadi kesalahan sistem.')
            } finally {
                setIsProcessing(false)
            }
        }

        scanner.render(onScanSuccess, (err) => { /* abaikan error log scan cari */ })

        // Cleanup saat komponen ditutup
        return () => {
            scanner.clear().catch(console.error)
        }
    }, [slug, isProcessing, scannedGuest])

    const handleCheckIn = async () => {
        if (!scannedGuest) return
        setIsProcessing(true)

        const finalPax = Number(actualPax) || 1

        const { error } = await supabase
            .from('guest_list')
            .update({
                is_checked_in: true,
                actual_pax: finalPax,
                check_in_time: new Date().toISOString()
            })
            .eq('id', scannedGuest.id)

        if (error) {
            toast.error('Gagal melakukan check-in')
        } else {
            toast.success(`Check-in berhasil untuk ${scannedGuest.name}!`)

            // Tutup modal & jalankan scanner lagi
            setScannedGuest(null)

            // Untuk mempermudah, kita biarkan user refresh halaman jika pause gagal dilanjut, 
            // tapi biasanya html5-qrcode bisa otomatis resume jika di-clear state-nya.
            window.location.reload()
        }
        setIsProcessing(false)
    }

    return (
        <div className="h-full bg-stone-50 p-6 md:p-10 overflow-y-auto">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Scanner Check-in</h2>
                    <p className="text-sm text-gray-500 mt-1">Arahkan QR Code tamu ke area kamera di bawah.</p>
                </div>

                {/* Wadah Kamera Scanner */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
                    <div id="qr-reader" className="w-full rounded-lg overflow-hidden border-none outline-none"></div>
                </div>

                {/* Modal Konfirmasi Tamu (Muncul saat QR valid di-scan) */}
                {scannedGuest && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl transform transition-all">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <UserCheck className="w-6 h-6" />
                            </div>

                            <h3 className="text-xl font-bold text-center text-gray-900 mb-1">Tiket Valid</h3>
                            <p className="text-center text-gray-500 text-sm mb-6">Atas nama <span className="font-bold text-gray-800">{scannedGuest.name}</span></p>

                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                                <div className="flex justify-between items-center mb-3 text-sm">
                                    <span className="text-gray-500">Kuota Undangan:</span>
                                    <span className="font-bold text-gray-800">{scannedGuest.max_pax} Orang</span>
                                </div>
                                <hr className="border-gray-200 mb-3" />
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-semibold text-gray-700">Tamu Aktual yg Hadir:</span>
                                    <input
                                        type="number"
                                        min="1"
                                        value={actualPax}
                                        onChange={(e) => setActualPax(e.target.value === '' ? '' : parseInt(e.target.value))}
                                        className="w-16 p-2 text-center text-sm border border-gray-300 rounded-lg outline-none focus:border-stone-500 font-bold"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setScannedGuest(null); window.location.reload(); }}
                                    className="flex-1 py-3 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleCheckIn}
                                    disabled={isProcessing}
                                    className="flex-1 py-3 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-70"
                                >
                                    {isProcessing ? 'Memproses...' : 'Check-in'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}