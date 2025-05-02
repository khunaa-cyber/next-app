import {dbConnect} from '@/lib/mongodb';
import Item from '@/models/Item';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect;

  switch (method) {
    case 'PUT':
      try {
        const item = await Item.findByIdAndUpdate(id as string, req.body, {
          new: true,
          runValidators: true,
        });
        if (!item) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: item });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case 'DELETE':
      try {
        const deletedItem = await Item.deleteOne({ _id: id as string });
        if (!deletedItem) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}