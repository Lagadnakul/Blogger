import { connectDB } from "@/lib/config/db";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from 'path';
import fs from 'fs/promises';

export async function POST(request) {
    try {
        await connectDB();
        
        if (!request.headers.get("content-type")?.includes("multipart/form-data")) {
            return NextResponse.json({
                error: "Content type must be multipart/form-data"
            }, { status: 400 });
        }

        const formData = await request.formData();
        const file = formData.get('image');

        if (!file) {
            return NextResponse.json({ 
                error: "No file received in the request" 
            }, { status: 400 });
        }

        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await fs.mkdir(uploadDir, { recursive: true });

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '-')}`;
        const filePath = path.join(uploadDir, fileName);
        
        await writeFile(filePath, buffer);
        
        return NextResponse.json({ 
            success: true,
            imgUrl: `/uploads/${fileName}`
        });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ 
            error: "Server error",
            message: error.message 
        }, { status: 500 });
    }
}