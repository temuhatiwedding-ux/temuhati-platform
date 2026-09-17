import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server' // Sesuaikan path jika berbeda

// 1. Fungsi untuk MENGIRIM komentar (POST)
export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        // Tambahkan guest_count di sini
        const { invitation_id, name, attendance, message, guest_count } = await req.json()

        if (!invitation_id || !name || !attendance) {
            return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
        }

        const { error } = await supabase
            .from('comments')
            // Tambahkan guest_count di dalam insert
            .insert([{ invitation_id, name, attendance, message, guest_count }])

        if (error) throw error

        return NextResponse.json({ success: true, message: 'Komentar terkirim' })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// 2. Fungsi untuk MENGAMBIL komentar (GET)
export async function GET(req: Request) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(req.url)
        const invitation_id = searchParams.get('invitation_id')

        if (!invitation_id) {
            return NextResponse.json({ error: 'ID Undangan tidak valid' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('invitation_id', invitation_id)
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}