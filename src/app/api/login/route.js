import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  await dbConnect();

  try {
    const { email, password } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d', 
    });

    const userResponse = {
        name: user.name,
        email: user.email,
    };

    return NextResponse.json({
      message: 'Logged in successfully',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ message: 'An error occurred during login', error: error.message }, { status: 500 });
  }
}