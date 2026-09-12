'use client'

import { createClient } from '@/utils/supabase/client'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
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

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=/dashboard?template=${template}`,
            },
        })
    }

    return (
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center border border-gray-200">
            <h1 className="text-2xl font-bold mb-2">{isLogin ? 'Masuk ke Temuhati' : 'Daftar Akun Baru'}</h1>
            <p className="text-gray-600 mb-6 text-sm">Silakan masuk untuk mulai membuat undangan.</p>

            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-left">{error}</div>}

            <form onSubmit={handleEmailAuth} className="flex flex-col gap-4 text-left mb-6">
                <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-black text-sm"
                        placeholder="nama@email.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 p-3 pr-10 rounded-lg outline-none focus:ring-2 focus:ring-black text-sm"
                            placeholder="Minimal 6 karakter"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 mt-2"
                >
                    {loading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar')}
                </button>
            </form>

            <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-xs text-gray-400 font-medium">ATAU</span>
                <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-white border border-gray-300 text-black py-3 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2 mb-6 shadow-sm"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Lanjutkan dengan Google
            </button>

            <p className="text-sm text-gray-600">
                {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-black font-bold hover:underline"
                >
                    {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
                </button>
            </p>
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
                <LoginContent />
            </Suspense>
        </div>
    )
}