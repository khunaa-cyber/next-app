import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

const uri = process.env.MONGODB_URI!;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function dbConnect() {
  return clientPromise;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Connect to MongoDB
    const client = await dbConnect();
    const db = client.db('khunaa'); // Replace with your database name

    // Handle GET request: Fetch all patients
    if (req.method === 'GET') {
      const patients = await db.collection('patients').find({}).toArray();
      if (!patients) {
        return res.status(404).json({ success: false, message: 'No patients found' });
      }
      // Removed duplicate export default async function handler declaration and its content
      return res.status(200).json({ success: true, data: patients });
    }

    // Handle POST request: Add a new patient
    if (req.method === 'POST') {
      const newPatient = req.body; // Ensure body-parser is enabled
      const result = await db.collection('patients').insertOne(newPatient);
      return res.status(201).json({ success: true, data: result });
    }

    // Method not allowed
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Database connection failed' });
  }
}