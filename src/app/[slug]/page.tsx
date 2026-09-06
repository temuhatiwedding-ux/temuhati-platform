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
        template_id: invitation.template_id || 'rustic-01',
        bride_name: invitation.bride_name,
        groom_name: invitation.groom_name,
        content_data: invitation.content_data || {}
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center relative overflow-hidden p-4">
            <div className="w-full max-w-[375px] bg-white shadow-2xl rounded-lg overflow-hidden">
                {/* Render UI template publik */}
                <TemplateRenderer data={invitationData} />
            </div>

            {/* Footer Statis Temuhati */}
            <div className="absolute bottom-4 text-xs text-gray-500 font-semibold w-full text-center">
                © 2026 Temuhati. All rights reserved.
            </div>
        </div>
    )
}