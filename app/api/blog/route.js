import { connectDB } from "@/lib/config/db";
import { blog_data } from "@/Assets/assets";
import { NextResponse } from "next/server";
import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';


// Create Blog Schema
const blogSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  author: String,
  image: String,
  authorImg: String,
  date: { type: Date, default: Date.now }
});

// Create Blog Model
const BlogModel = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

// GET endpoint to fetch all blogs or single blog
export async function GET(request) {
  try {
    await connectDB();

    const blogId = request.nextUrl.searchParams.get("id");
    if (blogId) {
      // Try to find blog in database first
      const dbBlog = await BlogModel.findById(blogId);
      if (dbBlog) {
        return NextResponse.json(dbBlog);
      }
      // If not found in DB, look in static data
      const staticBlog = blog_data.find(blog => blog.id === Number(blogId));
      if (!staticBlog) {
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      }
      return NextResponse.json(staticBlog);
    } else {
      // Try to get blogs from database
      const dbBlogs = await BlogModel.find({});
      if (dbBlogs && dbBlogs.length > 0) {
        return NextResponse.json({ blogs: dbBlogs });
      }
      // If no blogs in DB, return static data
      return NextResponse.json({ blogs: blog_data });
    }
  } catch (error) {
    console.error('Error in GET blogs:', error);
    // Fallback to static data if database fails
    return NextResponse.json({ blogs: blog_data });
  }
}

// POST endpoint to create new blog
export async function POST(request) {
  try {
    await connectDB();

    if (!request.headers.get("content-type")?.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content type must be multipart/form-data" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json(
        { error: "No file received" },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "-")}`;
    const filePath = path.join(uploadDir, fileName);
    const imgUrl = `/uploads/${fileName}`;

    await fs.writeFile(filePath, buffer);

    const blogData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      author: formData.get("author"),
      image: imgUrl,
      authorImg: formData.get("authorImg"),
      date: new Date()
    };

    const savedBlog = await BlogModel.create(blogData);

    return NextResponse.json({
      success: true,
      message: "Blog added successfully",
      data: savedBlog
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

//Creating API Endpoint to delete Blog
export async function DELETE(request) {
  try {
    await connectDB();
    const id = request.nextUrl.searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
    }

    // First try to find blog in static data
    const staticBlog = blog_data.find(blog => blog.id === Number(id));
    if (staticBlog) {
      return NextResponse.json({ msg: "Cannot delete static blog" }, { status: 400 });
    }

    // Then try to find and delete from database
    const blog = await BlogModel.findById(id);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Delete the image file if it exists
    if (blog.image && blog.image.startsWith('/uploads/')) {
      try {
        await fs.unlink(`./public${blog.image}`);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    await BlogModel.findByIdAndDelete(id);
    return NextResponse.json({ msg: "Blog deleted successfully" });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}