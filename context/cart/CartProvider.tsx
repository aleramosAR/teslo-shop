import { FC, ReactNode, useEffect, useReducer } from 'react';
import Cookie from 'js-cookie';

import { ICartProduct } from '@/interfaces';
import { CartContext, cartReducer } from './';

export interface CartState {
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
}

const CART_INITIAL_STATE: CartState = {
  // cart: [],
  cart: Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0
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

  return (
    <CartContext.Provider value={{
      ...state,

      // Methods
      addProductToCart,
      updateCartQuantity,
      removeCartProduct
    }}>
      {children}
    </CartContext.Provider>
  )
}