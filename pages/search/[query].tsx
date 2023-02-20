import { GetServerSideProps, NextPage } from "next"
import { ShopLayout } from "@/components/layouts"
import { Box, Typography } from "@mui/material"
import { ProductList } from "@/components/products";
import { dbProducts } from "@/database";
import { IProduct } from "@/interfaces";

interface Props {
  products: IProduct[];
  foundProducts: boolean;
  query: string
}

const SearchPage:NextPage<Props> = ({ products, foundProducts, query }) => {

  // const { products, isLoading } = useProducts('/products');

  return (
    <ShopLayout title={"Teslo-shop - Home"} pageDescription={"Encuentra los mejores productos de Teslo aquí."}>
      <Typography variant="h1" component="h1">Buscar productos</Typography>

      {
        foundProducts
          ? <Typography variant="h2" sx={{ mb: 2 }} textTransform='capitalize'>Término { query }</Typography>
          : <Box display='flex'>
              <Typography variant="h2" sx={{ mb: 1 }}>No se ha encontrado ningun producto.</Typography>
              <Typography variant="h2" sx={{ ml: 1 }} color="secondary" textTransform='capitalize'>{ query }</Typography>
            </Box>
      }
      
      
      <ProductList products={products} />

      {/* {
        isLoading
          ? <FullScreenLoading />
          : <ProductList products={products} />
      } */}

    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = '' } = params as { query: string };

  if(query.length === 0) {
    return {
      redirect: {
        destination: '/',
        permanent: true
        // Pongo permanent: true, porque nunca voy a necesitar undexar un resultado de busqueda vacio.
      }
    }
  }

  let products = await dbProducts.getProductsByTerm(query);
  const foundProducts = products.length > 0;

  if(!foundProducts) {
    products = await dbProducts.getAllProducts()
  }

  return {
    props: {
      products,
      foundProducts,
      query
    }
  }
}

export default SearchPage