import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "../../../models/User";
import { connectToMongoDB } from "../../../lib/mongoDB";

export async function POST(req) {
    try {
        const { email, password } = await req.json()
        const hashedPassword = await bcrypt.hash(password, 12);

        await connectToMongoDB();

        const user = new User({ email: email, password: hashedPassword })
        await user.save();

        return NextResponse.json(
            { message: "User created successfully" },
            { status: 201 }
        );
    } catch (err) {
        return NextResponse.json(
            { message: err },
            { status: 500 }
        );
    }
}