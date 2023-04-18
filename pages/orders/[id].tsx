import { GetServerSideProps, NextPage } from 'next'
import NextLink from 'next/link';
import { getSession } from 'next-auth/react';

import { Box, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

import { ShopLayout } from '@/components/layouts';
import {CartList} from '@/components/cart/CartList';
import { OrderSummary } from '@/components/cart';
import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';

interface Props {
  order:IOrder
}

const OrderPage:NextPage<Props> = ({ order }) => {

  const { shippingAddress } = order;
  const orderValues = {
    numberOfItems: order.numberOfItems,
    subTotal: order.subTotal,
    tax: order.tax,
    total: order.total
  }

  return (
    <ShopLayout title='Resúmen de la orden' pageDescription='Resúmen de la orden'>
      <Typography variant='h1' component='h1' sx={{ mb: 3 }}>Orden: { order._id }</Typography>

      {
        order.isPaid ? (
          <Chip
            sx={{ my: 2 }}
            label="Orden ya fue pagada"
            variant="outlined"
            color="success"
            icon={<CreditScoreOutlined />}
          />
        ) : (
          <Chip
            sx={{ my: 2 }}
            label="Pendiente de pago"
            variant="outlined"
            color="error"
            icon={<CreditCardOffOutlined />}
          />
        )
      }

      <Grid container spacing={2} className='fadeIn'>
        <Grid item xs={12} sm={7}>
          <CartList products={order.orderItems} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2'>Resúmen ({ order.numberOfItems } { order.numberOfItems > 1 ? 'productos' : 'producto' })</Typography>
              <Divider sx={{ my:1 }} />

              <Box display='flex' justifyContent='space-between'>
                <Typography variant='subtitle1'>Dirección de entrega</Typography>
              </Box>

              <Typography>{ shippingAddress.firstName } { shippingAddress.lastName }</Typography>
              <Typography>{ shippingAddress.address }{ shippingAddress.address2 ? `, ${shippingAddress.address2}` : '' }</Typography>
              <Typography>{ shippingAddress.city }, { shippingAddress.zip }</Typography>
              <Typography>{ shippingAddress.country }</Typography>
              <Typography>{ shippingAddress.phone }</Typography>
              
              <Divider sx={{ mt: 1, mb: 1}} />

              <OrderSummary orderValues={orderValues} />

              {/* TODO: Agregar pagos */}
              <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                {
                  order.isPaid ?
                  (
                    <Chip
                    sx={{ my: 2 }}
                    label="Orden ya fue pagada"
                    variant="outlined"
                    color="success"
                    icon={<CreditScoreOutlined />}
                    />
                    ) : (
                      <h1>Pagar</h1>
                    )
                }
              </Box>

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  
  const { id = '' } = query;
  // El chequeo de session puedo hacerlo desde el middleware pero lo hacemos aca para testear
  const session:any = await getSession({ req });

  if(!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false
      }
    }
  }

  const order = await dbOrders.getOrderById(id.toString());

  if(!order) {
    return {
      redirect: {
        destination: '/orders/history',
        permanent: false
      }
    }
  }

  if(order.user !== session.user._id) {
    return {
      redirect: {
        destination: '/orders/history',
        permanent: false
      }
    }
  }

  return {
    props: {
      order
    }
  }
}

export default OrderPage;