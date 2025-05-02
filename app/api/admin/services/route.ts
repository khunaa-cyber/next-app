import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await dbConnect; 
    const db = client.db('khunaa'); // Replace with your actual database name

    const services = await db.collection('services').find({}).toArray();

    return NextResponse.json({ success: true, services });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}