import { GetServerSideProps, NextPage } from 'next'
import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material';
import { AirplaneTicketOutlined, CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

import { AdminLayout } from '@/components/layouts';
import {CartList} from '@/components/cart/CartList';
import { OrderSummary } from '@/components/cart';
import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';

interface Props {
  order:IOrder
}

const OrderPage:NextPage<Props> = ({ order }) => {

  const { shippingAddress } = order;

  return (
    <AdminLayout
      title='Resúmen de la orden'
      subTitle={`OrdenId: ${ order._id }`}
      icon={<AirplaneTicketOutlined />}
    >
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

              <OrderSummary orderValues={{
                numberOfItems: order.numberOfItems,
                subTotal: order.subTotal,
                tax: order.tax,
                total: order.total
              }} />

              <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
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
              </Box>

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  
  const { id = '' } = query;
  const order = await dbOrders.getOrderById(id.toString());

  if(!order) {
    return {
      redirect: {
        destination: '/admin/orders',
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