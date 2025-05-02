import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await dbConnect;
    const db = client.db('khunaa'); // Replace with your actual database name

    const appointmentsCount = await db.collection('appointments').countDocuments();
    const patientsCount = await db.collection('patients').countDocuments();
    const doctorsCount = await db.collection('doctors').countDocuments();
    const revenue = await db.collection('payments').aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]).toArray();

    return NextResponse.json({
      success: true,
      appointments: appointmentsCount,
      patients: patientsCount,
      doctors: doctorsCount,
      revenue: revenue[0]?.total || 0,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}