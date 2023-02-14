import React from 'react'
import { ShopLayout } from '@/components/layouts';
import NextLink from 'next/link';
import { Box, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material';
import CartList from '@/components/cart/CartList';
import { OrderSummary } from '@/components/cart';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

const OrderPage = () => {
  return (
    <ShopLayout title='Resúmen de la orden 1212121' pageDescription='Resúmen de la orden'>
      <Typography variant='h1' component='h1' sx={{ mb: 3 }}>Orden: ABC123</Typography>

      {/* <Chip
        sx={{ my: 2 }}
        label="Pendiente de pago"
        variant="outlined"
        color="error"
        icon={<CreditCardOffOutlined />}
      /> */}
      <Chip
        sx={{ my: 2 }}
        label="Orden ya fue pagada"
        variant="outlined"
        color="success"
        icon={<CreditScoreOutlined />}
      />

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
                {/* TODO: Agregar pagos */}
                <h1>Pagar</h1>
                <Chip
                  sx={{ my: 2 }}
                  label="Orden ya fue pagada"
                  variant="outlined"
                  color="success"
                  icon={<CreditScoreOutlined />}
                />
              </Box>

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export default OrderPage;