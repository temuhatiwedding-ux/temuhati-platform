import Rustic01 from './rustic-01'
import Modern02 from './modern-02'
import Elegan01 from './elegan-01'
import Modern03 from './modern-03' // Sesuaikan besar/kecil huruf nama file lu

import { InvitationData } from '@/types/invitation'

const TEMPLATE_REGISTRY: Record<string, React.FC<{ data: InvitationData }>> = {
    'rustic-01': Rustic01,
    'modern-02': Modern02,
    'elegan-01': Elegan01,
    'modern-03': Modern03, // 👈 Pastikan cuma namanya aja, JANGAN pakai < >
}

export default function TemplateRenderer({ data }: { data: InvitationData }) {
    const templateId = data.template_id || 'rustic-01'
    const SelectedTemplate = TEMPLATE_REGISTRY[templateId] || TEMPLATE_REGISTRY['rustic-01']

    return <SelectedTemplate data={data} />
}