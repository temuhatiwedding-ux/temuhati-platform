'use client'

import { useEffect, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { createClient } from '@/utils/supabase/client'
import toast from 'react-hot-toast'
import { UserCheck } from 'lucide-react'

interface ScannerTabProps {
    slug: string;
}

export default function ScannerTab({ slug }: ScannerTabProps) {
    const supabase = createClient()
    const [scannedGuest, setScannedGuest] = useState<any>(null)
    const [actualPax, setActualPax] = useState<number | string>(1)
    const [isProcessing, setIsProcessing] = useState(false)

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "qr-reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
        )

        const processQR = async (decodedText: string) => {
            try {
                // 1. Ekstrak ID
                let scannedId = decodedText.trim()
                if (scannedId.includes('/tiket/')) {
                    const urlParts = scannedId.split('/tiket/')
                    scannedId = urlParts[1].split('?')[0].replace(/\/$/, '')
                }

                // 2. Tarik data dari DB
                const { data, error } = await supabase
                    .from('guest_list')
                    .select('*')
                    .eq('id', scannedId)
                    .single()

                // 3. Tampilkan error yang spesifik jika gagal
                if (error) {
                    toast.error(`Gagal (DB): ${error.message}`)
                    setTimeout(() => setIsProcessing(false), 3000)
                    return
                }

                if (!data) {
                    toast.error(`Kosong! ID: ${scannedId.substring(0, 8)}... tidak ada.`)
                    setTimeout(() => setIsProcessing(false), 3000)
                    return
                }

                if (data.is_checked_in) {
                    toast.error(`Tiket atas nama ${data.name} SUDAH DIPAKAI!`)
                    setTimeout(() => setIsProcessing(false), 3000)
                    return
                }

                // 4. Sukses
                setScannedGuest(data)
                setActualPax(data.max_pax)
            } catch (error: any) {
                toast.error(`Sistem Error: ${error.message}`)
                setIsProcessing(false)
            }
        }

        const onScanSuccess = (decodedText: string) => {
            setIsProcessing((loading) => {
                if (loading) return true

                // Tambahkan tipe :any agar TS tidak protes
                setScannedGuest((guest: any) => {
                    if (guest) return guest
                    processQR(decodedText)
                    return null
                })

                return true
            })
        }

        scanner.render(onScanSuccess, () => { })

        return () => {
            scanner.clear().catch(console.error)
        }
    }, [supabase])

    const handleCheckIn = async () => {
        if (!scannedGuest) return
        setIsProcessing(true)

        const finalPax = Number(actualPax) || 1

        const { error } = await supabase
            .from('guest_list')
            .update({ is_checked_in: true, actual_pax: finalPax, check_in_time: new Date().toISOString() })
            .eq('id', scannedGuest.id)

        if (error) {
            toast.error('Gagal melakukan check-in')
            setIsProcessing(false)
        } else {
            toast.success(`Check-in berhasil: ${scannedGuest.name}`)

            // Cukup reset state tanpa setGuests
            setScannedGuest(null)
            setIsProcessing(false)
        }
    }

    return (
        <div className="h-full bg-stone-50 p-6 md:p-10 overflow-y-auto">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Scanner Check-in</h2>
                    <p className="text-sm text-gray-500 mt-1">Arahkan QR Code tamu ke area kamera di bawah.</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
                    <div id="qr-reader" className="w-full rounded-lg overflow-hidden border-none outline-none"></div>
                </div>

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
                                    <span className="text-sm font-semibold text-gray-700">Tamu yg Hadir:</span>
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
                                    onClick={() => {
                                        setScannedGuest(null)
                                        setIsProcessing(false)
                                    }}
                                    className="flex-1 py-3 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Batal / Scan Ulang
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