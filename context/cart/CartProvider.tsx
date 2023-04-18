import { FC, ReactNode, useEffect, useReducer } from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';

import { ICartProduct, IOrder, ShippingAddress } from '@/interfaces';
import { CartContext, cartReducer } from './';
import Cookies from 'js-cookie';
import { tesloApi } from '@/api';

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;

  shippingAddress?: ShippingAddress;
}

const CART_INITIAL_STATE: CartState = {
  // cart: [],
  isLoaded: false,
  cart: Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined,
}

interface ProviderProps { children: ReactNode }

export const CartProvider:FC<ProviderProps> = ({children}) => {

  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffect(() => {
    try {
      const cookieProducts = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [];
      dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: cookieProducts});
    } catch (error) {
      dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: []});
    }
  }, [])
  
  useEffect(() => {
    // Agregaamos la validacion de firstname porque si no esta cargado no mandamos nada
    if (Cookies.get('firstName')) {
      const shippingAddress = {
        firstName: Cookies.get('firstName') || '',
        lastName: Cookies.get('lastName') || '',
        address: Cookies.get('address') || '',
        address2: Cookies.get('address2') || '',
        zip: Cookies.get('zip') || '',
        city: Cookies.get('city') || '',
        country: Cookies.get('country') || '',
        phone: Cookies.get('phone') || ''
      }
      dispatch({ type: '[Cart] - Load Address from Cookies', payload: shippingAddress});
    }

  }, []);

  // Este effect, graba las cookies cada vez que hay algun cambio en el cart
  useEffect(() => {
    Cookie.set('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  // Este effect calcula los montos cuando cambia el cart.
  // Es recomendable usar diferentes effects para cada funcionalidad.
  useEffect(() => {

    const numberOfItems = state.cart.reduce((prev, current) => current.quantity + prev, 0);
    const subTotal = state.cart.reduce((prev, current) => (current.price * current.quantity) + prev, 0);
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

    const orderSummary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: subTotal * (taxRate + 1)
    }

    dispatch({ type: '[Cart] - Update order summary', payload: orderSummary });
    
  }, [state.cart]);
  

  const addProductToCart = (product:ICartProduct) => {
    
    // Nivel 1
    // No hace ningun chequeo, se van a repetir los productos
    // dispatch({ type: '[Cart] - Update products in cart', payload: product })

    // Nivel 2
    // Chequea pero va a sobreescribir si tenemos el mismo, no va a sumarlos
    // const productsInCart = state.cart.filter(p => p._id !== product._id && p.size !== product.size);
    // dispatch({ type: '[Cart] - Update products in cart', payload: [...productsInCart, product] });

    // Nivel final
    const productInCart = state.cart.some(p => p._id === product._id);
    if(!productInCart) return dispatch({ type: '[Cart] - Update products in cart', payload: [...state.cart, product] });

    const productInCartDiffSize = state.cart.some(p => p._id === product._id && p.size === product.size);
    if(!productInCartDiffSize) return dispatch({ type: '[Cart] - Update products in cart', payload: [...state.cart, product] });

    const updatedProducts = state.cart.map(p => {
      if (p._id !== product._id) return p;
      if (p.size !== product.size ) return p;

      // Actualizar la cantidad
      p.quantity += product.quantity;
      return p;
    });

    dispatch({ type: '[Cart] - Update products in cart', payload: updatedProducts });
  }

  const updateCartQuantity = (product:ICartProduct) => {
    dispatch({ type: '[Cart] - Change product quantity on cart', payload: product })
  }

  const removeCartProduct = (product:ICartProduct) => {
    dispatch({ type: '[Cart] - Remove product in cart', payload: product })
  }
  
  const updateAddress = (address: ShippingAddress) => {
    Cookies.set('firstName', address.firstName);
    Cookies.set('lastName', address.lastName);
    Cookies.set('address', address.address);
    Cookies.set('address2', address.address2 || '');
    Cookies.set('zip', address.zip);
    Cookies.set('city', address.city);
    Cookies.set('country', address.country);
    Cookies.set('phone', address.phone);
    
    dispatch({ type: '[Cart] - Update Address', payload: address })
  }

  const createOrder = async():Promise<{hasError: boolean; message: string; }> => {

    if(!state.shippingAddress) {
      throw new Error('No hay direccion de entrega.');
    }

    const body:IOrder = {
      orderItems: state.cart.map(p => ({
        ...p,
        size: p.size!
      })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.numberOfItems,
      subTotal: state.subTotal,
      tax: state.tax,
      total: state.total,
      isPaid: false
    }

    try {
      const { data } = await tesloApi.post<IOrder>('/orders', body);

      dispatch({ type: '[Cart] - Order complete' });

      return {
        hasError: false,
        message: data._id!
      }

    } catch (error) {
      if(axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: error.response?.data.message
        }
      }
      return {
        hasError: true,
        message: 'Error no controlado, hable con el administrador.'
      }

    }
  }


  return (
    <CartContext.Provider value={{
      ...state,

      // Methods
      addProductToCart,
      updateCartQuantity,
      removeCartProduct,
      updateAddress,

      // Orders
      createOrder,
    }}>
      {children}
    </CartContext.Provider>
  )
}