import { useContext } from "react";
import NextLink from "next/link";

import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material";
import { UiContext } from "@/context";

export const AdminNavBar = () => {

  const { toggleSideMenu } = useContext(UiContext);

  return (
    <AppBar>
      <Toolbar>
        <NextLink href='/' passHref legacyBehavior>
          <Link display='flex' alignItems='center'>
            <Typography variant="h6">Teslo |</Typography>
            <Typography sx={{ marginLeft: 0.5 }}>Shop</Typography>
          </Link>
        </NextLink>
        <Box flex={1} />
        <Button onClick={toggleSideMenu}>
          Menú
        </Button>
      </Toolbar>
    </AppBar>
  )
}
