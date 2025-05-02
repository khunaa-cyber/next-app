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

    // Fetch the user by ID
    const user = await db
      .collection('users')
      .findOne({ _id: new ObjectId(params.id) });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error(`Error fetching user with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await dbConnect;
    const db = client.db('khunaa'); // Replace with your actual database name

    const id = params.id;
    const body = await request.json();

    // Update the user in the database
    const result = await db
      .collection('users')
      .updateOne({ _id: new ObjectId(id) }, { $set: body });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User profile updated successfully',
    });
  } catch (error) {
    console.error(`Error updating user with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
