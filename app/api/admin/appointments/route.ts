import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await dbConnect;
    const db = client.db('khunaa'); // Replace with your actual database name

    const recentAppointments = await db.collection('appointments')
      .find({})
      .sort({ date: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json({ success: true, appointments: recentAppointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}