'use client'

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'

// Fungsi untuk mengekstrak hasil potong menjadi file Blob
const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<Blob | null> => {
    const image = new Image()
    image.src = imageSrc
    await new Promise((resolve) => (image.onload = resolve))

    const canvas = document.createElement('canvas')
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height)

    return new Promise((resolve) => canvas.toBlob((file) => resolve(file), 'image/jpeg'))
}

export default function ImageCropper({ imageSrc, aspect, onCancel, onSave }: { imageSrc: string, aspect: number, onCancel: () => void, onSave: (blob: Blob) => void }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

    const onCropComplete = useCallback((_: any, croppedPixels: any) => {
        setCroppedAreaPixels(croppedPixels)
    }, [])

    const handleSave = async () => {
        if (!croppedAreaPixels) return
        const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
        if (croppedBlob) onSave(croppedBlob)
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl">
                <div className="relative h-[60vh] w-full bg-stone-900">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                    />
                </div>
                <div className="p-4 flex justify-end gap-3 bg-white">
                    <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded-lg">Batal</button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-stone-800">Potong & Lanjut Upload</button>
                </div>
            </div>
        </div>
    )
}