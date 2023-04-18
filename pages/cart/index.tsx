import React, { useContext, useEffect } from 'react'
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material';

import { CartContext } from '@/context';
import { ShopLayout } from '@/components/layouts';
import {CartList} from '@/components/cart/CartList';
import { OrderSummary } from '@/components/cart';
import { useRouter } from 'next/router';

const CartPage = () => {

  const { isLoaded, numberOfItems } = useContext(CartContext);
  const router = useRouter();

  useEffect(() => {
    if(isLoaded && numberOfItems === 0) {
      router.replace('/cart/empty');
    }
  }, [isLoaded, numberOfItems, router]);

  if(!isLoaded || numberOfItems === 0) {
    return (<></>);
  }
  
  return (
    <ShopLayout title='Carrito - 3' pageDescription='Carrito de compras de la tienda'>
      <Typography variant='h1' component='h1' sx={{ mb: 3 }}>Carrito</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={7}>
          <CartList editable />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2'>Orden</Typography>
              <Divider sx={{ my:1 }} />
              <OrderSummary />
              <Box sx={{ mt: 3 }}>
                <Button color='secondary' className='circular-btn' href='/checkout/address' fullWidth>
                  Checkout
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export default CartPage