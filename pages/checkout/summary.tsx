import React from 'react'
import { ShopLayout } from '@/components/layouts';
import NextLink from 'next/link';
import { Box, Button, Card, CardContent, Divider, Grid, Link, Typography } from '@mui/material';
import CartList from '@/components/cart/CartList';
import { OrderSummary } from '@/components/cart';

const SummaryPage = () => {
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
              <Typography variant='h2'>Resúmen (3 productos)</Typography>
              <Divider sx={{ my:1 }} />

              <Box display='flex' justifyContent='space-between'>
              <Typography variant='subtitle1'>Dirección de entrega</Typography>
                <NextLink href='/checkout/address' passHref legacyBehavior>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <Typography>Alejandro Ramos</Typography>
              <Typography>X323 Calle 5</Typography>
              <Typography>Capital Federal, Buenos Aires</Typography>
              <Typography>Argentina</Typography>
              <Typography>+1 555 5555</Typography>
              
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