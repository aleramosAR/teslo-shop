import React from 'react'
import { ShopLayout } from '@/components/layouts';
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import CartList from '@/components/cart/CartList';
import { OrderSummary } from '@/components/cart';

const CartPage = () => {
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
                <Button color='secondary' className='circular-btn' fullWidth>
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