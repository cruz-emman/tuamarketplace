import { Box, Container, ListItem, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import ProductItem from './ProductItem'
import BeatLoader from "react-spinners/BeatLoader";

const ProductList = ({products, category}) => {
  const [filteredProducts, setFilteredProducts]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() =>{
    const isAvailable = products.filter((product) => product.quantity !== 0 )
    setFilteredProducts(isAvailable)
    setLoading(false)
  },[setFilteredProducts, category,products])

  return (
    <>
    {loading ?
      <BeatLoader 
      color="#36d7b7" 
      loading={loading}
      size={50}
      aria-label="Loading Spinner"
      data-testid="loader"
      />
      :
      (
        <Box sx={{backgroundColor: '#f5f5f5', display:'flex', marginTop:2}}>
      <Container maxWidth="xl">
        <Typography sx={{textAlign: 'center', paddingY: '20px', fontWeight: 700, color: '#212121', typography: {xs: "h6", md: "h4"}}}>Products</Typography>
          <Box sx={{display: 'flex', alignItems:'center',justifyContent: 'space-evenly', flexWrap: 'wrap', gap: '10px'}}>
            {filteredProducts.map((product) => (
              <ProductItem  key={product._id} product={product} />
              ))}
          </Box>
      </Container>
    </Box>
    )
  }
  </>
  )
}

export default ProductList