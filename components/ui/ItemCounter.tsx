import { RemoveCircleOutline, AddCircleOutline } from "@mui/icons-material"
import { Box, IconButton, Typography } from "@mui/material"
import { FC } from "react"

interface Props {
  currentValue: number;
  maxValue: number;

  // Methods
  updateQuantity: (num:number) => void;
}

export const ItemCounter:FC<Props> = ({ currentValue, maxValue, updateQuantity }) => {
  
  const onClickedRemove = () => {
    const value = currentValue-1;
    if(value > 0) {
      updateQuantity(value);
    }
  }
  
  const onClickedAdd = () => {
    const value = currentValue+1;
    if(value <= maxValue) {
      updateQuantity(value);
    }
  }

  return (
    <Box display="flex" alignItems="center">
      <IconButton onClick={onClickedRemove}>
        <RemoveCircleOutline />
      </IconButton>
      <Typography sx={{ width: 40, textAlign:"center" }}>{currentValue}</Typography>
      <IconButton onClick={onClickedAdd}>
        <AddCircleOutline />
      </IconButton>
    </Box>
  )
}
