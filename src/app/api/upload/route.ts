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
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const folder = formData.get('folder') as string || 'general'; // Pisahkan folder foto/musik

        if (!file) {
            return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        // Buat nama file unik: folder/timestamp-namafile.ext
        const uniqueFilename = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: uniqueFilename,
            Body: buffer,
            ContentType: file.type,
        });

        await s3Client.send(command);

        const publicUrl = `${process.env.NEXT_PUBLIC_R2_URL}/${uniqueFilename}`;

        return NextResponse.json({ url: publicUrl, success: true });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Gagal upload file' }, { status: 500 });
    }
}