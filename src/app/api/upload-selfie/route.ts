import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID?.trim()}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID?.trim() || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY?.trim() || '',
    },
    forcePathStyle: true,
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { image, guestId } = body;

        if (!image || !guestId) {
            return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
        }

        // Hapus prefix "data:image/jpeg;base64," untuk mendapatkan string murni
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');

        // Buat nama file unik berdasarkan ID tamu
        const filename = `selfies/${guestId}-${Date.now()}.jpg`;

        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: filename,
            Body: buffer,
            ContentType: 'image/jpeg',
            ContentEncoding: 'base64', // Tambahkan ini agar S3 tahu ini base64
        });

        await s3Client.send(command);

        const publicUrl = `${process.env.NEXT_PUBLIC_R2_URL}/${filename}`;

        return NextResponse.json({ url: publicUrl, success: true });
    } catch (error) {
        console.error('Upload selfie error:', error);
        return NextResponse.json({ error: 'Gagal upload selfie' }, { status: 500 });
    }
}