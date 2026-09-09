'use client'

import { InvitationData } from '@/types/invitation'
import GuestbookForm from '@/components/templates/GuestbookForm'

export default function Modern02({ data }: { data: InvitationData }) {
    const content = data.content_data || {}

    return (
        <div
            className="w-full min-h-screen text-white flex flex-col relative"
            style={{
                backgroundImage: `url(${content.bgPhoto || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
            <div className="absolute inset-0 bg-black/50" /> {/* Overlay gelap */}

            <div className="relative z-10 p-8 flex flex-col items-center justify-center min-h-screen text-center">
                <h3 className="text-sm tracking-[0.3em] uppercase mb-4">The Wedding Of</h3>
                <h1 className="text-5xl font-light mb-2">{data.bride_name}</h1>
                <span className="text-2xl font-light my-2">&</span>
                <h1 className="text-5xl font-light mb-8">{data.groom_name}</h1>
                <p className="text-sm max-w-xs">{content.quote}</p>
            </div>

            <div className="relative z-10 bg-white text-black py-12 px-6">
                <h2 className="text-2xl text-center mb-8">Tinggalkan Pesan</h2>
                <GuestbookForm invitationId={data.invitation_id || ''} />
            </div>
        </div>
    )
}