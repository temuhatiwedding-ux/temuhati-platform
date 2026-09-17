'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

function UpdatePasswordContent() {
    const supabase = createClient()
    const router = useRouter()

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isReady, setIsReady] = useState(false)

    // Tangkap sesi recovery saat halaman pertama kali dibuka dari link email
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
            if (event === 'PASSWORD_RECOVERY') {
                setIsReady(true)
            }
        })

        // Fallback jika user sudah punya session aktif lewat token URL
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setIsReady(true)
            } else {
                // Cek apakah ada hash token di URL (dari email Supabase)
                const hash = window.location.hash
                if (hash && hash.includes('type=recovery')) {
                    setIsReady(true)
                } else {
                    // Beri jeda sedikit untuk memastikan state terbaca, jika tetap kosong arahkan kembali
                    const timer = setTimeout(() => {
                        setIsReady(true) // Tetap izinkan form terbuka untuk mencoba update
                    }, 1000)
                    return () => clearTimeout(timer)
                }
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [supabase])

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (password !== confirmPassword) {
            setError('Password tidak sama. Silakan periksa kembali.')
            return
        }

        if (password.length < 6) {
            setError('Password minimal 6 karakter.')
            return
        }

        setLoading(true)
        const toastId = toast.loading('Menyimpan password baru...')

        try {
            const { error } = await supabase.auth.updateUser({ password })
            if (error) throw error

            toast.success('Password berhasil diubah! Silakan masuk kembali.', { id: toastId })

            await supabase.auth.signOut()
            router.push('/')

        } catch (err: any) {
            setError(err.message)
            toast.error(err.message || 'Gagal mengubah password.', { id: toastId })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen w-full bg-[#FBFBF9] font-sans text-[#3A4B40] items-center justify-center p-6">
            <div className="w-full max-w-md bg-white border border-[#D1E0D7] rounded-[2rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(58,75,64,0.05)]">

                <div className="flex flex-col items-center text-center mb-8">
                    <img src="/icon.svg" alt="TemuHati Logo" className="w-12 h-12 object-contain mb-4" />
                    <h1 className="text-2xl font-bold tracking-tight mb-2">Buat Password Baru</h1>
                    <p className="text-[#3A4B40]/70 text-sm font-medium">
                        Masukkan password baru untuk akun Anda.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-bold text-[#3A4B40]/60 uppercase tracking-wider pl-1">
                            Password Baru
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white border border-[#D1E0D7] rounded-2xl px-5 py-3.5 pr-12 text-sm focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-[#3A4B40] placeholder:text-[#3A4B40]/30 transition-all duration-300 font-medium hover:border-[#B5CDBF]"
                                placeholder="Minimal 6 karakter"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3A4B40]/40 hover:text-[#3A4B40] transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-bold text-[#3A4B40]/60 uppercase tracking-wider pl-1">
                            Konfirmasi Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-white border border-[#D1E0D7] rounded-2xl px-5 py-3.5 pr-12 text-sm focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-[#3A4B40] placeholder:text-[#3A4B40]/30 transition-all duration-300 font-medium hover:border-[#B5CDBF]"
                                placeholder="Ulangi password baru"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3A4B40]/40 hover:text-[#3A4B40] transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#3A4B40] text-[#FBFBF9] py-4 rounded-2xl text-sm font-bold hover:bg-[#2C3931] transition-all duration-300 shadow-[0_8px_20px_rgba(58,75,64,0.2)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 mt-4"
                    >
                        {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default function UpdatePasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FBFBF9] text-[#3A4B40] font-bold">Memuat...</div>}>
            <UpdatePasswordContent />
        </Suspense>
    )
}