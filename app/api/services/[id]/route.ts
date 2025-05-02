import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await dbConnect;
    const db = client.db('khunaa'); // Replace with your actual database name

    // Fetch the service by ID from the database
    const service = await db
      .collection('services')
      .findOne({ _id: new ObjectId(params.id) });

    if (!service) {
      return NextResponse.json(
        { success: false, message: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, service });
  } catch (error) {
    console.error(`Error fetching service with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
