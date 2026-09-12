

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import DashboardClient from './DashboardClient'

export const dynamic = 'force-dynamic' // Matikan cache Next.js

// Gunakan tipe any sementara agar aman di Next.js 14 maupun 15
export default async function DashboardPage({ searchParams }: any) {
    // Await searchParams agar support Next.js versi terbaru
    const params = await searchParams
    const clientId = params?.clientId

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // Gunakan clientId jika ada (Admin mode), jika tidak gunakan ID sendiri
    const targetUserId = clientId || user.id

    // Cek profile user yang sedang login (untuk nomor HP)
    const { data: profile } = await supabase
        .from('profiles')
        .select('phone_number')
        .eq('id', user.id)
        .single()

    // Cek data undangan berdasarkan targetUserId (Klien / Diri Sendiri)
    const { data: invitation } = await supabase
        .from('invitations')
        .select('*')
        .eq('user_id', targetUserId)
        .maybeSingle()

    // 1. Cegat jika nomor HP admin/user belum ada
    if (!profile?.phone_number) {
        return <PhoneForm userId={user.id} userName={user.user_metadata?.full_name || ''} />
    }

    // 2. Cegat jika form inisiasi klien belum diisi
    if (!invitation || !invitation.slug || invitation.bride_name === 'Nama Wanita') {
        return <SetupInvitationForm userId={targetUserId} />
    }

    // Override ID user dengan targetUserId agar upload foto & simpan data masuk ke klien
    const activeUser = { ...user, id: targetUserId }

    // Gunakan key={targetUserId} agar komponen selalu mereset state saat ganti klien
    return <DashboardClient key={targetUserId} user={activeUser} initialData={invitation} />
}

// Komponen Form No HP (Tetap sama)
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

// Komponen Form Setup Nama Mempelai & Slug Custom (Tetap sama, logic insert sudah support parameter userId)
function SetupInvitationForm({ userId }: { userId: string }) {
    return (
        <div className="flex items-center justify-center h-screen w-full bg-gray-50 p-4 text-black">
            <form action={async (formData) => {
                'use server'
                const groom = formData.get('groom') as string
                const bride = formData.get('bride') as string
                const format = formData.get('format') as string

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