'use client'

import { createClient } from '@/utils/supabase/client'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useState } from 'react'
import { Eye, EyeOff, Menu, X } from 'lucide-react'
import toast from 'react-hot-toast'

function LoginContent() {
    const supabase = createClient()
    const searchParams = useSearchParams()
    const router = useRouter()
    const template = searchParams.get('template') || 'rustic-01'

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const toastId = toast.loading(isLogin ? 'Sedang masuk...' : 'Mendaftarkan akun...')

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password })
                if (error) throw error

                toast.success('Berhasil masuk!', { id: toastId })
                router.push(`/dashboard?template=${template}`)
            } else {
                const { error } = await supabase.auth.signUp({ email, password })
                if (error) throw error

                toast.success('Akun berhasil dibuat!', { id: toastId })
                router.push(`/dashboard?template=${template}`)
            }
        } catch (err: any) {
            setError(err.message)
            toast.error(isLogin ? 'Gagal masuk. Cek email/password.' : 'Gagal mendaftar.', { id: toastId })
        } finally {
            setLoading(false)
        }
    }

    const handleResetPassword = async (e: React.MouseEvent) => {
        e.preventDefault()
        if (!email) {
            toast.error('Isi dulu kolom emailnya bre!')
            return
        }

        const toastId = toast.loading('Mengirim link reset password...')
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            })
            if (error) throw error

            toast.success('Link reset terkirim! Cek kotak masuk/spam email lu.', { id: toastId })
        } catch (err: any) {
            toast.error(err.message, { id: toastId })
        }
    }

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=/dashboard?template=${template}`,
            },
        })
    }

    return (
        <div className="flex min-h-screen w-full bg-[#FBFBF9] font-sans text-[#3A4B40] overflow-hidden relative">

            {/* ================= HEADER / TOP BAR ================= */}
            <div className="absolute top-6 left-6 right-6 md:top-8 md:left-10 md:right-10 z-30 flex justify-between items-center">

                {/* LOGO KIRI */}
                <div className="flex items-center gap-3">
                    <img src="/icon.svg" alt="TemuHati Logo" className="w-8 h-8 md:w-9 md:h-9 object-contain" />
                    <span className="font-bold text-xl md:text-2xl text-[#3A4B40] tracking-tight">
                        TemuHati
                    </span>
                </div>

                {/* MENU KANAN (Desktop) */}
                <div className="hidden md:flex items-center gap-6">
                    <a href="#" className="text-sm font-bold text-[#3A4B40]/70 hover:text-[#3A4B40] hover:scale-105 transition-all">
                        Katalog
                    </a>
                    <a href="#" className="text-sm font-bold text-[#3A4B40]/70 hover:text-[#3A4B40] hover:scale-105 transition-all">
                        Testimoni
                    </a>

                    {/* Tombol Konsultasi WA (Simpel tanpa animasi) */}
                    <a
                        href="https://wa.me/6285221011424"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white border border-[#D1E0D7] text-[#3A4B40] hover:bg-[#F0F5F2] hover:border-[#8BA896] px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-sm flex items-center gap-2"
                    >
                        Konsultasi
                    </a>
                </div>

                {/* HAMBURGER MENU (Mobile) */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden text-[#3A4B40] p-2 hover:bg-[#F0F5F2] rounded-full transition-colors"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* DROPDOWN MENU (Mobile) */}
            {isMobileMenuOpen && (
                <div className="absolute top-20 left-6 right-6 bg-white border border-[#D1E0D7] rounded-2xl shadow-xl p-5 flex flex-col gap-4 z-30 md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
                    <a href="#" className="text-sm font-bold text-[#3A4B40] border-b border-[#D1E0D7] pb-3 hover:text-[#8BA896] transition-colors">Katalog</a>
                    <a href="#" className="text-sm font-bold text-[#3A4B40] border-b border-[#D1E0D7] pb-3 hover:text-[#8BA896] transition-colors">Testimoni</a>
                    <a href="https://wa.me/6285221011424" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#3A4B40] hover:text-[#8BA896] transition-colors">
                        Konsultasi WhatsApp
                    </a>
                </div>
            )}

            {/* ================= SISI KIRI: FORM ================= */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 md:px-16 lg:px-24 z-10 relative mt-16 md:mt-0">
                <div className="w-full max-w-md">
                    <div className="mb-10 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
                            {isLogin ? 'Selamat Datang' : 'Buat Akun Baru'}
                        </h1>
                        <p className="text-[#3A4B40]/70 text-sm md:text-base font-medium">
                            {isLogin ? 'Masuk untuk mulai membuat undangan pernikahan digital yang elegan.' : 'Daftar sekarang untuk memulai perjalanan kustomisasi undanganmu.'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleEmailAuth} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-bold text-[#3A4B40]/60 uppercase tracking-wider pl-1">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white border border-[#D1E0D7] rounded-2xl px-5 py-3.5 text-sm focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-[#3A4B40] placeholder:text-[#3A4B40]/30 transition-all duration-300 font-medium hover:border-[#B5CDBF] shadow-sm"
                                placeholder="nama@email.com"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-bold text-[#3A4B40]/60 uppercase tracking-wider pl-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white border border-[#D1E0D7] rounded-2xl px-5 py-3.5 pr-12 text-sm focus:border-[#8BA896] focus:ring-[3px] focus:ring-[#8BA896]/20 outline-none text-[#3A4B40] placeholder:text-[#3A4B40]/30 transition-all duration-300 font-medium hover:border-[#B5CDBF] shadow-sm"
                                    placeholder="Minimal 6 karakter"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3A4B40]/40 hover:text-[#3A4B40] focus:outline-none transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {isLogin && (
                            <div className="flex items-center justify-between pt-1 pb-2">
                                <label className="flex items-center gap-2 text-xs font-bold text-[#3A4B40]/80 cursor-pointer">
                                    <input type="checkbox" className="accent-[#3A4B40] w-4 h-4 rounded cursor-pointer" />
                                    Ingat saya
                                </label>
                                <button
                                    type="button"
                                    onClick={handleResetPassword}
                                    className="text-xs font-bold text-[#3A4B40] hover:text-[#8BA896] transition-colors"
                                >
                                    Lupa Password?
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#3A4B40] text-[#FBFBF9] py-4 rounded-2xl text-sm font-bold hover:bg-[#2C3931] transition-all duration-300 shadow-[0_8px_20px_rgba(58,75,64,0.2)] hover:shadow-[0_8px_25px_rgba(58,75,64,0.3)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 mt-2"
                        >
                            {loading ? 'Memproses...' : (isLogin ? 'Masuk ke Dashboard' : 'Daftar Sekarang')}
                        </button>
                    </form>

                    <div className="flex items-center gap-4 my-6">
                        <div className="h-px bg-[#D1E0D7] flex-1"></div>
                        <span className="text-xs text-[#3A4B40]/40 font-bold uppercase tracking-wider">Atau</span>
                        <div className="h-px bg-[#D1E0D7] flex-1"></div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full bg-white border border-[#D1E0D7] text-[#3A4B40] py-3.5 rounded-2xl text-sm font-bold hover:bg-[#F0F5F2] hover:border-[#8BA896] transition-all duration-300 flex items-center justify-center gap-3 shadow-sm"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Lanjutkan dengan Google
                    </button>

                    <p className="text-sm text-[#3A4B40]/70 font-medium text-center mt-8">
                        {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError(null);
                            }}
                            className="text-[#3A4B40] font-bold hover:text-[#8BA896] hover:underline transition-colors"
                        >
                            {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
                        </button>
                    </p>
                </div>
            </div>

            {/* ================= SISI KANAN: VIDEO ================= */}
            <div className="hidden md:flex w-1/2 relative p-8 lg:p-12 items-center justify-center">
                <div className="relative w-full max-w-xl lg:max-w-xl h-[80vh] min-h-[500px] rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(58,75,64,0.15)] border-4 border-white">
                    <div className="absolute inset-0 bg-[#3A4B40]/5 z-10 pointer-events-none"></div>
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src="/login-video.mp4" type="video/mp4" />
                    </video>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FBFBF9] text-[#3A4B40] font-bold">Memuat...</div>}>
            <LoginContent />
        </Suspense>
    )
}