import { useState, useEffect } from 'react'

export function useGuestbook(invitationId: string) {
    const [formData, setFormData] = useState({ name: '', attendance: 'hadir', message: '' })
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [comments, setComments] = useState<any[]>([])

    const fetchComments = async () => {
        if (!invitationId) return
        try {
            const res = await fetch(`/api/comments?invitation_id=${invitationId}`)
            if (res.ok) setComments(await res.json())
        } catch (error) { console.error(error) }
    }

    useEffect(() => { fetchComments() }, [invitationId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('loading')
        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ invitation_id: invitationId, ...formData })
            })
            if (!res.ok) throw new Error('Gagal')
            setStatus('success')
            setFormData({ name: '', attendance: 'hadir', message: '' })
            fetchComments()
            setTimeout(() => setStatus('idle'), 3000)
        } catch (error) {
            setStatus('error')
        }
    }

    return { formData, setFormData, status, comments, handleSubmit }
}