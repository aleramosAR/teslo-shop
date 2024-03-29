import { ICartProduct, ShippingAddress } from '@/interfaces';
import { CartState } from './';

type CartActionType =
  | { type: '[Cart] - LoadCart from cookies | storage', payload: ICartProduct[] }
  | { type: '[Cart] - Update products in cart', payload: ICartProduct[] }
  | { type: '[Cart] - Change product quantity on cart', payload: ICartProduct }
  | { type: '[Cart] - Remove product in cart', payload: ICartProduct }
  | { type: '[Cart] - Load Address from Cookies', payload: ShippingAddress }
  | { type: '[Cart] - Update Address', payload: ShippingAddress }
  | {
      type: '[Cart] - Update order summary',
      payload: {
        numberOfItems: number;
        subTotal: number;
        tax: number;
        total: number;
      }
    }
  | { type: '[Cart] - Order complete' }

export const cartReducer = ( state: CartState, action: CartActionType ): CartState => {

  switch (action.type) {

    case '[Cart] - LoadCart from cookies | storage':
      return {
        ...state,
        isLoaded: true,
        cart: action.payload
      }

    case '[Cart] - Update products in cart':
      return {
        ...state,
        cart: [ ...action.payload ]
        // cart: [...state.cart, action.payload]
      }

    case '[Cart] - Change product quantity on cart':
      return {
        ...state,
        cart: state.cart.map(product => {
          if(product._id !== action.payload._id) return product;
          if(product.size !== action.payload.size) return product;
          // Al ser el payload un producto completo, puedo devolverlo completo y se actualiza
          return action.payload;
        })
      }

    case '[Cart] - Remove product in cart':
      return {
        ...state,
        // Las 2 maneras que hay debajo hacen lo mismo
        cart: state.cart.filter(product => !(product._id === action.payload._id && product.size === action.payload.size))
        // cart: state.cart.filter(product => {
        //   if(product._id === action.payload._id && product.size === action.payload.size) {
        //     return false;
        //   }
        //   return true;
        // })
      }

    case '[Cart] - Update order summary':
      return {
        ...state,
        ...action.payload
      }

    case '[Cart] - Load Address from Cookies':
    case '[Cart] - Update Address':
      return {
        ...state,
       shippingAddress: action.payload
      }

    case '[Cart] - Order complete':
      return {
        ...state,
        cart: [],
        numberOfItems: 0,
        subTotal: 0,
        tax: 0,
        total: 0
      }

    default:
        return state;
  }

}