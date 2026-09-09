import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import TemplateRenderer from '@/components/templates/TemplateRenderer'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function InvitationPage({ params }: { params: Promise<{ slug: string }> }) {
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

                <div className="w-full text-center py-6 text-xs text-stone-400 font-semibold bg-[#fcfbf9] relative z-0 border-t border-stone-200">
                    © 2026 Temuhati. All rights reserved.
                </div>
            </div>
        </div>
    )
}