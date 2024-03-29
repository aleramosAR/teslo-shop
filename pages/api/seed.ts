// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db, SeedDatabase } from '@/database';
import { Order, Product, User } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = { message: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  if(process.env.NODE_ENV === 'production') {
    return res.status(401).json({ message: 'No tiene acceso a este API.' });
  }

  await db.connect();
  
  await User.deleteMany();
  await User.insertMany(SeedDatabase.initialData.users);
  
  await Product.deleteMany();
  await Product.insertMany(SeedDatabase.initialData.products);

  await Order.deleteMany();

  await db.disconnect();


  res.status(200).json({ message: 'Proceso realizado correctamente.' })
}
