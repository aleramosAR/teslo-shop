import type { NextApiRequest, NextApiResponse } from 'next'
import { IOrder, IOrderItem } from '@/interfaces';
import { getSession } from 'next-auth/react';
import { db } from '@/database';
import { Order, Product } from '@/models';
import mongoose from 'mongoose';

type Data = 
  | { message: string }
  | IOrder

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return createOrder(req, res);
    default:
      res.status(400).json({ message: 'Bad Request' })
  }
}

const createOrder = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

  const { orderItems, total } = req.body as IOrder;

  // Verificar la sesion del usuario.
  const session:any = await getSession({req})

  if(!session) {
    return res.status(401).json({ message: 'Debe estar autenticado para hacer esto.' });
  }

  // Crear un array con los productos comprados
  const productsIds = orderItems.map(product => product._id);
  await db.connect();
  const dbProducts:IOrderItem[] = await Product.find({ _id: { $in: productsIds }});
  
  try {
    const subTotal = orderItems.reduce((prev, current) => {
      const currentPrice = dbProducts.find(prod => new mongoose.Types.ObjectId(prod._id).toString() === current._id)?.price;
      if(!currentPrice) {
        throw new Error('Verifique el carrito de nuevo. Producto no existe');
      }
      return (currentPrice * current.quantity) + prev;
    }, 0);

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
    const backendTotal = subTotal * (taxRate + 1);

    if(total !== backendTotal) {
      throw new Error('El total no cuadra con el monto');
    }

    // Todo bien hasta este punto
    const userId = session.user._id;
    const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
    newOrder.total = Math.round(newOrder.total * 100) / 100;
    await newOrder.save();
    await db.disconnect();
    return res.status(201).json(newOrder);

  } catch (error:any) {
    await db.disconnect();
    console.log(error);
    res.status(400).json({
      message: error.message || 'Revise logs del servidor'
    })
  }


  return res.status(201).json(req.body);
}
