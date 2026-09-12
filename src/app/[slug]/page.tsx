import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import TemplateRenderer from '@/components/templates/TemplateRenderer'
import { Metadata } from 'next'

// Inisialisasi Supabase satu kali di luar fungsi
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Props = {
    params: Promise<{ slug: string }>
}

// 1. Fungsi Generate Metadata untuk WhatsApp / Sosial Media
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params

    const { data } = await supabase
        .from('invitations')
        .select('groom_name, bride_name, content_data')
        .eq('slug', slug)
        .single()

    if (!data) {
        return { title: 'Undangan Pernikahan' }
    }

    const title = `The Wedding of ${data.groom_name} & ${data.bride_name}`

    // Pastikan path JSON ini sesuai dengan struktur penyimpanan gambar di editor lu
    const coverImage = data.content_data?.coverPhoto ||
        data.content_data?.bgPhoto ||
        'https://temuhatiinvite.com/dummy-photos/default-cover.jpg'

    return {
        title: title,
        description: 'Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.',
        openGraph: {
            title: title,
            description: 'Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.',
            images: [coverImage],
            type: 'website',
        },
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

    // Format data dari database agar sesuai standar tipe InvitationData
    const invitationData = {
        invitation_id: invitation.user_id,
        template_id: invitation.template_id || 'rustic-01',
        bride_name: invitation.bride_name,
        groom_name: invitation.groom_name,
        content_data: invitation.content_data || {}
    }

    return (
        <div className="min-h-[100dvh] bg-stone-200 flex flex-col items-center">
            {/* KUNCI: w-full di HP, md:max-w-[430px] di Laptop */}
            <div className="w-full md:max-w-[430px] min-h-[100dvh] bg-white shadow-2xl relative overflow-x-hidden flex flex-col">

                <div className="flex-grow">
                    <TemplateRenderer data={invitationData} />
                </div>

            </div>
        </div>
    )
}