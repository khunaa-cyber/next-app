import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await dbConnect;
    const db = client.db('khunaa'); // Replace with your actual database name

    const doctors = await db.collection('doctors').find({}).toArray();

    return NextResponse.json({ success: true, doctors });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}