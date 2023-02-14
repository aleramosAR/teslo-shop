import { ShopLayout } from '@/components/layouts'
import { Chip, Grid, Link, Typography } from '@mui/material'
import NextLink from 'next/link';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import React from 'react'

const columns:GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'fullName', headerName: 'Nombre', width: 300 },
  {
    field: 'paid',
    headerName: 'Pagada',
    description: 'Muestra información para saber si la orden esta pagada',
    width: 200,
    renderCell: (params: GridRenderCellParams) => {
      return (
        params.row.paid
          ? <Chip color="success" label="Pagada" variant="outlined" />
          : <Chip color="error" label="No pagada" variant="outlined" />
      )
    }
  },
  {
    field: 'orden',
    headerName: 'Ver Orden',
    width: 200,
    sortable: false,
    renderCell: (params: GridRenderCellParams) => {
      return (
        <NextLink href={`/orders/${params.row.id}`} passHref legacyBehavior>
          <Link underline='always'>
            Ver orden
          </Link>
        </NextLink>
      )
    },
  }
]

const rows = [
  { id: 1, paid: true, fullName: 'Alejandro Ramos' },
  { id: 2, paid: false, fullName: 'Fernando Herrera' },
  { id: 3, paid: true, fullName: 'Hernando Vallejo' },
  { id: 4, paid: true, fullName: 'Melisa Flores' },
  { id: 5, paid: false, fullName: 'Eduardo Rios' },
  { id: 6, paid: true, fullName: 'Natalia Herrera' }
]

const HistoryPage = () => {
  return (
    <ShopLayout title='Historial de ordenes' pageDescription='Historial de ordenes del cliente.'>
      <Typography variant="h1" component="h1">Historial de ordenes</Typography>

      <Grid container>
        <Grid item xs={12} sx={{ height: 650 , width: '100%' }}>
          <DataGrid
            columns={columns}
            rows={rows}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>

    </ShopLayout>
  )
}

export default HistoryPage