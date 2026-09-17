import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import DashboardClient from './DashboardClient'
import SetupInvitationForm from './SetupInvitationForm' // Tambahkan import ini

export const dynamic = 'force-dynamic'

export default async function DashboardPage({ searchParams }: any) {
    const params = await searchParams
    const clientId = params?.clientId

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const targetUserId = clientId || user.id

    const { data: profile } = await supabase
        .from('profiles')
        .select('phone_number')
        .eq('id', user.id)
        .single()

    const { data: invitation } = await supabase
        .from('invitations')
        .select('*')
        .eq('user_id', targetUserId)
        .maybeSingle()

    // Server Action terpisah khusus untuk dipassing ke Client Component
    async function handleSetupInvitation(formData: FormData) {
        'use server'

        const groom = formData.get('groom') as string
        const bride = formData.get('bride') as string
        const format = formData.get('format') as string

        const cleanGroom = groom.toLowerCase().replace(/[^a-z0-9]/g, '-')
        const cleanBride = bride.toLowerCase().replace(/[^a-z0-9]/g, '-')

        const slug = format === 'pria-wanita'
            ? `${cleanGroom}-dan-${cleanBride}`
            : `${cleanBride}-dan-${cleanGroom}`

        const supabase = await createClient()

        await supabase.from('invitations').insert({
            user_id: targetUserId, // Selalu gunakan targetUserId di sini
            groom_name: groom,
            bride_name: bride,
            slug: `undanganpernikahan-${slug}-${Date.now().toString().slice(-4)}`,
            template_id: 'rustic-01',
            status: 'DRAFT',
            content_data: {
                sections: {
                    gallery: { enabled: true },
                },
            },
        })

        redirect('/dashboard')
    }

    if (!profile?.phone_number) {
        return (
            <PhoneForm
                userId={user.id}
                userName={user.user_metadata?.full_name || ''}
            />
        )
    }

    if (!invitation || !invitation.slug || invitation.bride_name === 'Nama Wanita') {
        // Oper action handleSubmit ke Client Component
        return <SetupInvitationForm userId={targetUserId} actionSubmit={handleSetupInvitation} />
    }

    const activeUser = { ...user, id: targetUserId }

    return (
        <DashboardClient
            key={targetUserId}
            user={activeUser}
            initialData={invitation}
        />
    )
}


// ============================================================
// LOGO
// ============================================================

function TemuHatiLogo() {
    return (
        <div className="flex items-center justify-center gap-2.5 mb-8">
            <img
                src="/icon.svg"
                alt="TemuHati"
                className="w-9 h-9 object-contain"
            />

            <span className="text-[22px] font-medium tracking-tight text-[#3A4B40]">
                TemuHati
            </span>
        </div>
    )
}


// ============================================================
// PROGRESS INDICATOR
// ============================================================

function StepIndicator({ step }: { step: 1 | 2 }) {
    return (
        <div className="flex items-center justify-center gap-2 mb-7">
            <div
                className={`h-1.5 rounded-full transition-all ${step === 1
                    ? 'w-8 bg-[#3A4B40]'
                    : 'w-5 bg-[#D1E0D7]'
                    }`}
            />

            <div
                className={`h-1.5 rounded-full transition-all ${step === 2
                    ? 'w-8 bg-[#3A4B40]'
                    : 'w-5 bg-[#D1E0D7]'
                    }`}
            />
        </div>
    )
}


// ============================================================
// FORM NO HP
// ============================================================

function PhoneForm({
    userId,
    userName,
}: {
    userId: string
    userName: string
}) {
    return (
        <div className="relative flex min-h-screen w-full items-center justify-center bg-[#FBFBF9] px-5 py-10 text-[#3A4B40] overflow-hidden">

            {/* Decorative background */}
            <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#E8EFEA] opacity-50" />
            <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#F1E9DF] opacity-50" />

            <div className="relative z-10 w-full max-w-[440px]">

                <TemuHatiLogo />

                <div className="rounded-[2rem] border border-[#D1E0D7] bg-white p-7 shadow-[0_18px_50px_rgba(58,75,64,0.07)] sm:p-9">

                    <StepIndicator step={1} />

                    {/* Heading */}
                    <div className="mb-8 text-center">


                        <h1 className="text-[28px] font-semibold tracking-tight text-[#3A4B40]">
                            Lengkapi Profil
                        </h1>


                    </div>

                    <form
                        action={async (formData) => {
                            'use server'

                            const phone = formData.get('phone') as string

                            const supabase = await createClient()

                            await supabase
                                .from('profiles')
                                .upsert({
                                    id: userId,
                                    full_name: userName,
                                    phone_number: phone,
                                })

                            redirect('/dashboard')
                        }}
                    >

                        <div className="mb-6">
                            <label
                                htmlFor="phone"
                                className="mb-2 block text-sm font-medium text-[#3A4B40]"
                            >
                                Nomor WhatsApp
                            </label>

                            <input
                                id="phone"
                                type="tel"
                                name="phone"
                                required
                                placeholder="Contoh: 081234567890"
                                className="w-full rounded-2xl border border-[#D1E0D7] bg-white px-4 py-3.5 text-sm text-[#3A4B40] placeholder:text-[#A5B2AA] outline-none transition-all focus:border-[#8BA896] focus:ring-4 focus:ring-[#8BA896]/10"
                            />

                            <p className="mt-2.5 px-1 text-xs leading-5 text-[#8A958F]">
                                Nomor ini digunakan untuk kebutuhan komunikasi
                                terkait undanganmu.
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3A4B40] px-5 py-3.5 text-sm font-semibold text-[#FBFBF9] shadow-[0_8px_20px_rgba(58,75,64,0.16)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#304037] hover:shadow-[0_12px_25px_rgba(58,75,64,0.20)]"
                        >
                            Simpan & Lanjutkan


                        </button>
                    </form>
                </div>


            </div>
        </div>
    )
}


