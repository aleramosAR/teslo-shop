import bcrypt from 'bcryptjs';

import { User } from "@/models";
import { db } from ".";

export const checkUserEmailPassword = async( email: string, password: string ) => {

  await db.connect();
  const user = await User.findOne({ email });
  await db.disconnect();

  if(!user) {
    return null;
  }

  if(!bcrypt.compareSync(password, user.password!)) {
    return null;
  }

  const { role, name, _id } = user;

  return {
    _id,
    email: email.toLowerCase(),
    role,
    name
  }

}

// Esta funcion verifica el usuario de Oauth
export const oAuthToDbUser = async( oAuthEmail: string, oAuthName: string ) => {
  
  await db.connect();
  const user = await User.findOne({ email: oAuthEmail });

  if(user) {
    await db.disconnect();
    const { _id, name, email, role } = user;
    return { _id, name, email, role };
  }

  // Pongo @ en password porque este usuario no lo usa, se conecta desde oAuth (Facebook, Github, Twitter, etc)
  const newUser = new User({ email: oAuthEmail, name: oAuthName, password: '@', role: 'client' });
  await newUser.save();
  await db.disconnect();

  const { _id, name, email, role } = newUser
  return { _id, name, email, role };

}