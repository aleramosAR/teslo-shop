import { NextPage } from "next"
import { ShopLayout } from "@/components/layouts"
import { Typography } from "@mui/material"
import { ProductList } from "@/components/products";
import { useProducts } from "@/hooks";
import { FullScreenLoading } from "@/components/ui";

const MensPage:NextPage = () => {

  const { products, isLoading } = useProducts('/products?gender=men');

  return (
    <ShopLayout title={"Teslo-shop - Men"} pageDescription={"Encuentra los mejores productos de Teslo para hombres."}>
      <Typography variant="h1" component="h1">Hombres</Typography>
      <Typography variant="h2" sx={{ marginBottom: 1 }}>Productos para hombres</Typography>

      {
        isLoading
          ? <FullScreenLoading />
          : <ProductList products={products} />
      }

    </ShopLayout>
  )
}

export default MensPage