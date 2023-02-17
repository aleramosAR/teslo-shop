import { db } from '@/database';
import { IProduct } from '@/interfaces';
import { Product } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = 
  | { message: string }
  | IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getProductBySlug(req, res);
    default:
      return res.status(400).json({ message: 'Bad Request' });
  }
}

const getProductBySlug = async(req: NextApiRequest, res: NextApiResponse<Data>) =>{
  const { slug } = req.query;

  await db.connect();
  const product = await Product.findOne({ slug }).select('title images price inStock slug -_id').lean();
  await db.disconnect();

  if(!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  return res.status(200).json(product);
}
