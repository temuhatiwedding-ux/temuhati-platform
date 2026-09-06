import Rustic01 from './rustic-01'
import { InvitationData } from '@/types/invitation'

// Registry: Daftarkan semua template baru di sini nantinya
const TEMPLATE_REGISTRY: Record<string, React.FC<{ data: InvitationData }>> = {
    'rustic-01': Rustic01,
}

export default function TemplateRenderer({ data }: { data: InvitationData }) {
    const templateId = data.template_id || 'rustic-01'
    const SelectedTemplate = TEMPLATE_REGISTRY[templateId] || TEMPLATE_REGISTRY['rustic-01']

    return <SelectedTemplate data={data} />
}