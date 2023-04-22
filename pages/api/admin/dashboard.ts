import { db } from '@/database';
import { Order, Product, User } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  numberOfOrders: number;
  paidOrders: number; // isPaid: true
  notPaidOrders: number;
  numberOfClients: number; // role: client
  numberOfProducts: number;
  productsWithNoInventory: number;
  lowInventory: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  await db.connect();
  // const numberOfOrders = await Order.count();
  // const paidOrders = await Order.count({ isPaid: true });
  // const numberOfClients = await User.count({ role: 'client' });
  // const numberOfProducts = await Product.count();
  // const productsWithNoInventory = await Product.count({ inStock: 0 });
  // const lowInventory = await Product.count({ inStock: { $lte: 10} });

  // Ejecuto todos los pasos anteriores pero en uno solo
  const [
    numberOfOrders,
    paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory
  ] = await Promise.all([
    Order.count(),
    Order.count({ isPaid: true }),
    User.count({ role: 'client' }),
    Product.count(),
    Product.count({ inStock: 0 }),
    Product.count({ inStock: { $lte: 10} }),
  ]);
  await db.disconnect();

  res.status(200).json({ 
    numberOfOrders,
    paidOrders,
    notPaidOrders: numberOfOrders - paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory
   });
  
}