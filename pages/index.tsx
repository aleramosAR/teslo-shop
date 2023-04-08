import { NextPage } from "next"
import { useProducts } from "@/hooks";
import { ShopLayout } from "@/components/layouts"
import { ProductList } from "@/components/products";
import { FullScreenLoading } from "@/components/ui";
import { Typography } from "@mui/material"

const HomePage:NextPage = () => {

  const { products, isLoading } = useProducts('/products');

  return (
    <ShopLayout title={"Teslo-shop - Home"} pageDescription={"Encuentra los mejores productos de Teslo aquí."}>
      <Typography variant="h1" component="h1">Tienda</Typography>
      <Typography variant="h2" sx={{ marginBottom: 1 }}>Todos los productos</Typography>

      {
        isLoading
          ? <FullScreenLoading />
          : <ProductList products={products} />
      }

    </ShopLayout>
  )
}

export default HomePage