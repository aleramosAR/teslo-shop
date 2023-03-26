import React, { useContext } from 'react'
import { ShopLayout } from '@/components/layouts';
import NextLink from 'next/link';
import { Box, Button, Card, CardContent, Divider, Grid, Link, Typography } from '@mui/material';
import CartList from '@/components/cart/CartList';
import { OrderSummary } from '@/components/cart';
import { CartContext } from '@/context';
import { countries } from '@/utils';

const SummaryPage = () => {

  const {shippingAddress, numberOfItems} = useContext(CartContext);

  // Al llegar a esta pagina se da por hecho que ya tenemos una shipping address
  // Si no la hay mostrar pagina de error o redireccionar
  if(!shippingAddress) {
    return <></>;
  }

  const { firstName, lastName, address, address2 = '', city, country, phone, zip} = shippingAddress;

  return (
    <ShopLayout title='Resúmen de orden' pageDescription='Resúmen de la orden'>
      <Typography variant='h1' component='h1' sx={{ mb: 3 }}>Resúmen de la orden</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2'>Resúmen ({numberOfItems} {numberOfItems === 1 ? 'producto' : 'productos'})</Typography>
              <Divider sx={{ my:1 }} />

              <Box display='flex' justifyContent='space-between'>
              <Typography variant='subtitle1'>Dirección de entrega</Typography>
                <NextLink href='/checkout/address' passHref legacyBehavior>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <Typography>{firstName} {lastName}</Typography>
              <Typography>{address}{address2 ? `, ${address2}` : ''}</Typography>
              <Typography>{city}, {zip}</Typography>
              <Typography>{countries.find(c => c.code === country)?.name}</Typography>
              <Typography>{phone}</Typography>
              
              <Divider sx={{ mt: 1, mb: 1}} />

              <Box display='flex' justifyContent='end'>
                <NextLink href='/cart' passHref legacyBehavior>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <OrderSummary />

              <Box sx={{ mt: 3 }}>
                <Button color='secondary' className='circular-btn' fullWidth>
                  Confirmar Orden
                </Button>
              </Box>

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export default SummaryPage