import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // Cek profile (nomor HP)
    const { data: profile } = await supabase
        .from('profiles')
        .select('phone_number')
        .eq('id', user.id)
        .single()

    // Cek apakah data undangan (nama mempelai & slug) sudah ada
    const { data: invitation } = await supabase
        .from('invitations')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

    // 1. Cegat jika nomor HP belum ada
    if (!profile?.phone_number) {
        return <PhoneForm userId={user.id} userName={user.user_metadata?.full_name || ''} />
    }

    // 2. Cegat jika Nama Mempelai / Slug belum diatur
    if (!invitation || !invitation.slug || invitation.bride_name === 'Nama Wanita') {
        return <SetupInvitationForm userId={user.id} />
    }

    // Lolos semua syarat -> Masuk Editor
    return <DashboardClient user={user} initialData={invitation} />
}

// Komponen Form No HP
function PhoneForm({ userId, userName }: { userId: string, userName: string }) {
    return (
        <div className="flex items-center justify-center h-screen w-full bg-gray-50 p-4 text-black">
            <form action={async (formData) => {
                'use server'
                const phone = formData.get('phone') as string
                const supabase = await createClient()
                await supabase.from('profiles').upsert({ id: userId, full_name: userName, phone_number: phone })
                redirect('/dashboard')
            }} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-200">
                <h2 className="text-2xl font-bold mb-2">Lengkapi Profil</h2>
                <p className="text-gray-600 text-sm mb-6">Masukkan nomor WhatsApp Anda.</p>
                <input type="tel" name="phone" required placeholder="Contoh: 081234567890" className="w-full border p-3 rounded-lg mb-6 outline-none focus:ring-2 focus:ring-black" />
                <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800">Simpan & Lanjutkan</button>
            </form>
        </div>
    )
}

// Komponen Form Setup Nama Mempelai & Slug Custom
function SetupInvitationForm({ userId }: { userId: string }) {
    return (
        <div className="flex items-center justify-center h-screen w-full bg-gray-50 p-4 text-black">
            <form action={async (formData) => {
                'use server'
                const groom = formData.get('groom') as string
                const bride = formData.get('bride') as string
                const format = formData.get('format') as string // 'pria-wanita' atau 'wanita-pria'

                // Buat slug bersih (contoh: dani-dan-wiwin)
                const cleanGroom = groom.toLowerCase().replace(/[^a-z0-9]/g, '-')
                const cleanBride = bride.toLowerCase().replace(/[^a-z0-9]/g, '-')
                const slug = format === 'pria-wanita' ? `${cleanGroom}-dan-${cleanBride}` : `${cleanBride}-dan-${cleanGroom}`

                const supabase = await createClient()
                await supabase.from('invitations').insert({
                    user_id: userId,
                    groom_name: groom,
                    bride_name: bride,
                    slug: `undanganpernikahan-${slug}-${Date.now().toString().slice(-4)}`,
                    template_id: 'rustic-01',
                    status: 'DRAFT',
                    content_data: { sections: { gallery: { enabled: true } } }
                })
                redirect('/dashboard')
            }} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-200">
                <h2 className="text-2xl font-bold mb-2">Atur Nama Mempelai</h2>
                <p className="text-gray-600 text-sm mb-6">Tentukan nama pasangan dan format urutan link undangan.</p>

                <label className="block text-sm font-semibold mb-1">Nama Pria</label>
                <input type="text" name="groom" required placeholder="Contoh: Dani" className="w-full border p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-black" />

                <label className="block text-sm font-semibold mb-1">Nama Wanita</label>
                <input type="text" name="bride" required placeholder="Contoh: Wiwin" className="w-full border p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-black" />

                <label className="block text-sm font-semibold mb-1">Urutan Nama di Link URL</label>
                <select name="format" className="w-full border p-3 rounded-lg mb-6 outline-none focus:ring-2 focus:ring-black bg-white">
                    <option value="pria-wanita">Pria di Depan (Contoh: /dani-dan-wiwin)</option>
                    <option value="wanita-pria">Wanita di Depan (Contoh: /wiwin-dan-dani)</option>
                </select>

                <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800">Buat Undangan</button>
            </form>
        </div>
    )
}