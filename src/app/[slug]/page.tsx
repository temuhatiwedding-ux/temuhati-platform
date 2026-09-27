export const dynamic = 'force-dynamic' // <--- INI OBATNYA BIAR GAK KENA CACHE

import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import TemplateRenderer from '@/components/templates/TemplateRenderer'
import { Metadata } from 'next'
import { Lock } from 'lucide-react'

// Inisialisasi Supabase satu kali di luar fungsi
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const { data } = await supabase.from('invitations').select('groom_name, bride_name, content_data').eq('slug', slug).single()
    if (!data) return { title: 'Undangan Pernikahan' }
    const title = `The Wedding of ${data.groom_name} & ${data.bride_name}`
    const coverImage = data.content_data?.coverPhoto || data.content_data?.bgPhoto || `${process.env.NEXT_PUBLIC_R2_URL}/dummy-photos/default-cover.jpg`
    return {
        title: title,
        description: 'Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.',
        openGraph: { title, description: 'Tanpa mengurangi rasa hormat...', images: [coverImage], type: 'website' },
    }
}

export default async function InvitationPage({ params }: Props) {
    const { slug } = await params

    const { data: invitation } = await supabase
        .from('invitations')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!invitation) {
        notFound()
    }

    // 2. CEK STATUS (Udah gw bikin kebal huruf besar/kecil)
    const currentStatus = invitation.status?.toUpperCase()
    const currentPayment = invitation.payment_status?.toUpperCase()

    const isDraft = currentStatus === 'DRAFT' || currentPayment === 'UNPAID'

    // ==========================================
    // OPSI "KASIH KERAS": BLOKIR TOTAL AKSES
    // ==========================================
    if (isDraft) {
        return (
            <div className="min-h-[100dvh] bg-[#FBFBF9] flex items-center justify-center p-4">
                <div className="bg-white border border-[#D1E0D7] rounded-[2rem] p-8 max-w-sm w-full text-center shadow-xl">
                    <div className="w-16 h-16 bg-[#F8D7DA]/50 border border-[#F5C2C7] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                        <Lock className="w-7 h-7 text-[#842029]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#3A4B40] mb-2 tracking-tight">Undangan Terkunci</h2>
                    <p className="text-sm text-[#3A4B40]/70 mb-8 font-medium leading-relaxed">
                        Maaf, tautan undangan ini belum dapat diakses publik karena masih dalam status <strong>DRAFT</strong> atau belum menyelesaikan pembayaran.
                    </p>
                    <a
                        href="/"
                        className="inline-block w-full bg-[#3A4B40] text-white py-3.5 rounded-xl text-sm font-bold hover:bg-[#2C3931] transition-colors shadow-sm"
                    >
                        Kembali ke Beranda
                    </a>
                </div>
            </div>
        )
    }

    // ==========================================
    // RENDER NORMAL KALAU UDAH LUNAS (PUBLISHED & PAID)
    // ==========================================
    const invitationData = {
        invitation_id: invitation.user_id,
        template_id: invitation.template_id || 'rustic-01',
        bride_name: invitation.bride_name,
        groom_name: invitation.groom_name,
        content_data: invitation.content_data || {}
    }

    return (
        <div className="min-h-[100dvh] bg-stone-200 flex flex-col items-center relative">
            <div className="w-full md:max-w-[430px] min-h-[100dvh] bg-white shadow-2xl relative overflow-x-hidden flex flex-col">
                <div className="flex-grow">
                    <TemplateRenderer data={invitationData} />
                </div>
            </div>
        </div>
    )
}