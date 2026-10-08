import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import PreviewClient from './PreviewClient' // <--- Import file baru lu

export default async function PreviewPage({ params }: any) {
    const resolvedParams = await params
    const templateId = resolvedParams?.template

    const supabase = await createClient()
    const { data: templateRecord } = await supabase
        .from('templates')
        .select('dummy_data')
        .eq('id', templateId)
        .single()

    if (!templateRecord) return notFound()

    // ==========================================
    // INI OBATNYA: Ubah string jadi Object dulu
    // ==========================================
    let parsedDummy = templateRecord.dummy_data
    if (typeof parsedDummy === 'string') {
        parsedDummy = JSON.parse(parsedDummy) // <--- Parse string ke JSON
    }

    const finalData = {
        ...parsedDummy, // <--- Sekarang disebar sebagai Object beneran
        invitation_id: 'preview-mode',
        template_id: templateId,
        isPreview: true,
    }
    // Panggil PreviewClient di sini, parsing datanya
    return (
        <div className="min-h-screen bg-gray-100 flex justify-center">
            <PreviewClient templateId={templateId} finalData={finalData} />
        </div>
    )
}