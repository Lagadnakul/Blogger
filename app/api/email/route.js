import { connectDB } from "@/lib/config/db";
import EmailModel from "@/lib/models/EmailModel";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Connect to MongoDB first
    await connectDB();
    
    const formData = await request.formData();
    const email = formData.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, msg: "Email is required" },
        { status: 400 }
      );
    }

    // Create new email document using EmailModel
    const newEmail = new EmailModel({
      email: email,
      date: new Date()
    });

    // Save to MongoDB
    await newEmail.save();

    return NextResponse.json(
      { success: true, msg: "Successfully subscribed!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email subscription error:", error);
    return NextResponse.json(
      { success: false, msg: "Failed to subscribe" },
      { status: 500 }
    );
  }
}

export async function GET(request){
  const emails = await EmailModel.find({});
  return NextResponse.json({emails});
}

export async function DELETE(request){
  const id = await request.nextUrl.searchParams.get("id");
  await EmailModel.findByIdAndDelete(id);
  return NextResponse.json({success:true,msg:"Email Deleted"})
}