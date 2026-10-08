'use client' // <--- Kunci utamanya di sini

import dynamic from 'next/dynamic'

// 1. Pindahin dynamic import ke sini
const TemplateComponents: Record<string, any> = {
    'elegan-01': dynamic(() => import('@/components/templates/elegan-01'), { ssr: false }),
    'modern-02': dynamic(() => import('@/components/templates/modern-02'), { ssr: false }),
}

export default function PreviewClient({ templateId, finalData }: { templateId: string, finalData: any }) {
    const Template = TemplateComponents[templateId]

    if (!Template) return <div className="p-10 text-center">Komponen UI belum didaftarkan</div>

    return (
        <div className="w-full max-w-[414px] bg-white shadow-2xl relative min-h-screen overflow-x-hidden">
            <Template data={finalData} />
        </div>
    )
}