import { createClient } from '@/utils/supabase/server'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'

// 1. Daftarkan komponen template di sini (sesuaikan path foldernya dengan proyek lu)
const TemplateComponents: Record<string, any> = {
    'elegan-01': dynamic(() => import('@/components/templates/elegan-01')),
    // 'rustic-01': dynamic(() => import('@/components/template/rustic-01')), // Contoh untuk template lain nanti
}

export default async function PreviewPage({ params }: any) {
    // 1. Await params untuk Next.js 15
    const resolvedParams = await params
    const templateId = resolvedParams?.template

    const supabase = await createClient()

    // 2. Gunakan templateId yang sudah di-resolve
    const { data: templateRecord } = await supabase
        .from('templates')
        .select('dummy_data')
        .eq('id', templateId)
        .single()

    // Jika data tidak ada di database, akan return 404
    if (!templateRecord) return notFound()

    const Template = TemplateComponents[templateId]
    if (!Template) return <div className="p-10 text-center">Komponen UI belum didaftarkan</div>

    const finalData = {
        ...templateRecord.dummy_data,
        invitation_id: 'preview-mode',
        template_id: templateId,
        isPreview: true,
    }

    // 4. Render template dengan wrapper ukuran HP
    return (
        <div className="min-h-screen bg-gray-100 flex justify-center">
            {/* Wrapper utama yang melock ukuran maksimal seukuran HP (max-w-md = 448px) */}
            <div className="w-full max-w-[414px] bg-white shadow-2xl relative min-h-screen overflow-x-hidden">
                <Template data={finalData} />
            </div>
        </div>
    )
}