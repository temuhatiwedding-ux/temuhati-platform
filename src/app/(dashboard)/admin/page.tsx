import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import EditClientButton from './EditClientButton'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // 1. Cek apakah user ini benar-benar admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        redirect('/dashboard')
    }

    // 2. Tarik semua data undangan klien
    const { data: invitations } = await supabase
        .from('invitations')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-stone-800">Admin Dashboard - Daftar Klien</h1>

            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                <table className="w-full text-left text-sm text-stone-600">
                    <thead className="bg-stone-50 border-b border-stone-200">
                        <tr>
                            <th className="p-4 font-semibold text-stone-900">Nama Pasangan</th>
                            <th className="p-4 font-semibold text-stone-900">Slug URL</th>
                            <th className="p-4 font-semibold text-stone-900">Status</th>
                            <th className="p-4 font-semibold text-stone-900">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {invitations?.map((inv: any) => (
                            <tr key={inv.id} className="hover:bg-stone-50">
                                <td className="p-4 font-medium text-stone-900">{inv.groom_name} & {inv.bride_name}</td>
                                <td className="p-4">{inv.slug}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${inv.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {inv.status}
                                    </span>
                                </td>

                                <td className="p-4">
                                    <EditClientButton clientId={inv.user_id} />
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}