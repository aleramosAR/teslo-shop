import { isValidObjectId } from "mongoose";
import { db } from ".";
import { IOrder } from "@/interfaces";
import { Order } from "@/models";

export const getOrderById = async(id: string):Promise<IOrder | null> => {

  if(!isValidObjectId(id)) {
    return null;
  }

  await db.connect();
  const order = await Order.findById(id).lean();
  await db.disconnect();

  if(!order) {
    return null;
  }

  // Devuelvo los datos de la orden parseadas para evitar errores con datos que devuelve mongoose
  // Por ejemplo los ObJectId o los formatos de las fechas
  return JSON.parse(JSON.stringify(order));

}

export const getOrdersByUser = async(userId:string):Promise<IOrder[]> => {

  if(!isValidObjectId(userId)) {
    return [];
  }

  await db.connect();
  const orders = await Order.find({ user: userId }).lean();
  await db.disconnect();

  // Se hace el stringify para evitar errores con ciertos datos de mongoose como los ObjectId
  return JSON.parse(JSON.stringify(orders));
  
}