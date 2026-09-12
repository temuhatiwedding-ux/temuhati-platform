'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function EditClientButton({ clientId }: { clientId: string }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleClick = () => {
        setIsLoading(true)
        router.push(`/dashboard?clientId=${clientId}`)
        router.refresh()
    }

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className="inline-block px-4 py-2 bg-black text-white text-xs font-bold rounded-md hover:bg-stone-800 transition-colors disabled:opacity-50"
        >
            {isLoading ? 'Memuat...' : 'Edit Form Klien'}
        </button>
    )
}