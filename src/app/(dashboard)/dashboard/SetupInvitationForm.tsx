'use client'

import { useState } from 'react'

// Kita bawa komponen UI kecil ini ke sini agar gampang diakses oleh Client Component
function TemuHatiLogo() {
    return (
        <div className="flex items-center justify-center gap-2.5 mb-8">
            <img src="/icon.svg" alt="TemuHati" className="w-9 h-9 object-contain" />
            <span className="text-[22px] font-medium tracking-tight text-[#3A4B40]">
                TemuHati
            </span>
        </div>
    )
}

function StepIndicator({ step }: { step: 1 | 2 }) {
    return (
        <div className="flex items-center justify-center gap-2 mb-7">
            <div className={`h-1.5 rounded-full transition-all ${step === 1 ? 'w-8 bg-[#3A4B40]' : 'w-5 bg-[#D1E0D7]'}`} />
            <div className={`h-1.5 rounded-full transition-all ${step === 2 ? 'w-8 bg-[#3A4B40]' : 'w-5 bg-[#D1E0D7]'}`} />
        </div>
    )
}

export default function SetupInvitationForm({
    userId,
    actionSubmit
}: {
    userId: string
    actionSubmit: (formData: FormData) => void
}) {
    // State untuk menangkap input nama secara real-time
    const [groom, setGroom] = useState('')
    const [bride, setBride] = useState('')

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center bg-[#FBFBF9] px-5 py-10 text-[#3A4B40] overflow-hidden">
            {/* Decorative background */}
            <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#E8EFEA] opacity-50" />
            <div className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-[#F1E9DF] opacity-50" />

            <div className="relative z-10 w-full max-w-[480px]">
                <TemuHatiLogo />

                <div className="rounded-[2rem] border border-[#D1E0D7] bg-white p-7 shadow-[0_18px_50px_rgba(58,75,64,0.07)] sm:p-9">
                    <StepIndicator step={2} />

                    {/* Heading */}
                    <div className="mb-8 text-center">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8BA896]">
                            Langkah 02
                        </p>
                        <h1 className="text-[28px] font-semibold tracking-tight text-[#3A4B40]">
                            Atur Nama Mempelai
                        </h1>
                        <p className="mx-auto mt-3 max-w-[350px] text-sm leading-6 text-[#718078]">
                            Masukkan nama pasangan untuk memulai undangan pernikahanmu.
                        </p>
                    </div>

                    <form action={actionSubmit}>
                        {/* Nama Pria */}
                        <div className="mb-5">
                            <label htmlFor="groom" className="mb-2 block text-sm font-medium text-[#3A4B40]">
                                Nama Pria
                            </label>
                            <input
                                id="groom"
                                type="text"
                                name="groom"
                                required
                                value={groom}
                                onChange={(e) => setGroom(e.target.value)}
                                placeholder="Contoh: Ardi"
                                className="w-full rounded-2xl border border-[#D1E0D7] bg-white px-4 py-3.5 text-sm text-[#3A4B40] placeholder:text-[#A5B2AA] outline-none transition-all focus:border-[#8BA896] focus:ring-4 focus:ring-[#8BA896]/10"
                            />
                        </div>

                        {/* Nama Wanita */}
                        <div className="mb-5">
                            <label htmlFor="bride" className="mb-2 block text-sm font-medium text-[#3A4B40]">
                                Nama Wanita
                            </label>
                            <input
                                id="bride"
                                type="text"
                                name="bride"
                                required
                                value={bride}
                                onChange={(e) => setBride(e.target.value)}
                                placeholder="Contoh: Rania"
                                className="w-full rounded-2xl border border-[#D1E0D7] bg-white px-4 py-3.5 text-sm text-[#3A4B40] placeholder:text-[#A5B2AA] outline-none transition-all focus:border-[#8BA896] focus:ring-4 focus:ring-[#8BA896]/10"
                            />
                        </div>

                        {/* Format URL (Dinamis mengikuti state) */}
                        <div className="mb-7">
                            <label htmlFor="format" className="mb-2 block text-sm font-medium text-[#3A4B40]">
                                Urutan Nama di Link
                            </label>
                            <select
                                id="format"
                                name="format"
                                defaultValue="pria-wanita"
                                className="w-full appearance-none rounded-2xl border border-[#D1E0D7] bg-white px-4 py-3.5 text-sm text-[#3A4B40] outline-none transition-all focus:border-[#8BA896] focus:ring-4 focus:ring-[#8BA896]/10"
                            >
                                <option value="pria-wanita">
                                    Pria di Depan — {groom || 'Ardi'} & {bride || 'Rania'}
                                </option>
                                <option value="wanita-pria">
                                    Wanita di Depan — {bride || 'Rania'} & {groom || 'Ardi'}
                                </option>
                            </select>
                            <p className="mt-2.5 px-1 text-xs leading-5 text-[#8A958F]">
                                Urutan ini akan digunakan sebagai bagian dari alamat link undangan.
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3A4B40] px-5 py-3.5 text-sm font-semibold text-[#FBFBF9] shadow-[0_8px_20px_rgba(58,75,64,0.16)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#304037] hover:shadow-[0_12px_25px_rgba(58,75,64,0.20)]"
                        >
                            Buat Undangan
                            <span className="text-base transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                        </button>
                    </form>
                </div>
                <p className="mt-6 text-center text-xs text-[#9AA59F]">
                    TemuHati · Buat momenmu menjadi kenangan.
                </p>
            </div>
        </div>
    )
}