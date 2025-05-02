// app/api/items.tsx
import dbConnect  from '@/lib/mongodb';
import Item from '@/models/Item';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const client = await dbConnect();
  const db = client.db();

  const { method }: { method?: string } = req;

  switch (method) {
    case 'GET':
      try {
        const items: any[] = await Item.find({});
        res.status(200).json({ success: true, data: items });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const item: any = await Item.create(req.body);
        res.status(201).json({ success: true, data: item });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
