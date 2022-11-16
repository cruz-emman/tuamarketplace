import { Box, Button, Container, Grid, IconButton, TextField, Typography } from '@mui/material'
import React, {useState} from 'react'
import item from '../assets/item.png'
import BeatLoader from "react-spinners/BeatLoader";
import { addProduct } from '../redux/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

const SingleProduct = ({singleProduct, quantity, setQuantity}) => {
    const cart = useSelector((state) => state.cart.products)
    const cartAddedAlready = cart[0]?._id


    const dispatch = useDispatch()
    const handleClick = () =>{
        dispatch(addProduct({...singleProduct, quantity }) )
    }


  return (
    <Box sx={{ height: '100%', width: '100%', marginTop: {xs: 2, md: 10}}}>
        <Container maxWidth="lg">
        <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
                <Box sx={{height: {xs: 150, md: 300}, width: '300px', border:{xs: 0, md: 1}, padding: {xs: 0, md: 4}, borderRadius: '10px', display: {xs: 'flex'}}}>
                    <Box component="img" sx={{height: '100%', width: '100%', objectFit: 'contain'}} src={singleProduct.img}/>
                </Box>
            </Grid>

            <Grid container item xs={12} md={8}>
               <Box sx={{display:'flex', flexDirection: 'column', margin:'auto'}}>
                <Typography sx={{fontWeight: 'bold', textTransform: 'uppercase', fontSize: {xs: "20px", md: '30px'}}}> {singleProduct.title}</Typography>  
                <Box sx={{height: '40px', width: '100%', paddingY:  {xs: '0px', md: '20px'},paddingX: {xs: '0px', md: '20px'}, display:'flex', alignItems:'center', borderBottom: {xs: 0, md: 1}}}>
                   <Typography  sx={{color: '#00c853', fontWeight: 800, typography: {xs: 'h4', md:'h3'}}}> ₱ {singleProduct.price}.00</Typography>
                </Box>

                <Grid sx={{width: {xs: '100%', md: 500}}} container spacing={2} pt={4}>
                    <Grid item xs={4} sx={{lineHeight: 2}}>
                        <Typography variant="body1" fontWeight={600} color="#757575">Seller: </Typography>
                        <Typography variant="body1" fontWeight={600} color="#757575">StudentID: </Typography>
                        <Typography variant="body1" fontWeight={600} color="#757575">Dept: </Typography>
                        <Typography variant="body1" fontWeight={600} color="#757575">Desc: </Typography>
                    </Grid>
                    <Grid item xs={8} >
                        <Typography variant="body1" fontWeight={700} color="#212121">{singleProduct.seller_id?.firstname} {singleProduct.seller_id?.lastname}</Typography>
                        <Typography variant="body1" fontWeight={700} color="#212121">{singleProduct.seller_id?.studentId}</Typography>
                        <Typography variant="body1" fontWeight={700} color="#212121">{singleProduct.seller_id?.department}</Typography>
                        <Typography variant="body1" fontWeight={700} color="#212121"
                         sx={{overflowWrap: 'break-word', width: {xs: 150, md: '100%'}}}>{singleProduct.description}</Typography>

                            
                        </Grid>
{/* 
                    <Box mt={4} sx={{display: 'flex',alignItems:"center", justifyContent:'space-between', width: 200}}>
                    <Box sx={{display: 'flex', width: '100%', justifyContent: 'space-evenly', fontSize: "20px"}}>
                        <IconButton onClick={() => handleQuantity("dec")}>
                        <RemoveCircleIcon />

                        </IconButton>
                        <IconButton onClick={() => handleQuantity("inc")}>
                        <AddCircleIcon />

                        </IconButton>
                    </Box>

                        <Box sx={{border: 1, padding: 2, borderRadius: '10px'}}>
                            <Typography>1</Typography>
                        </Box>

                    </Box> */}
                </Grid>

                <Box py={4}>
                   {cartAddedAlready ? (
                      <Button
                        color="error"
                      variant="contained"
                      onClick={handleClick}
                      disabled
                      >
                      One Purchase only
                  </Button>
                   ) :   
                   (
                    <Button
                        sx={{
                            borderRadius: 10,
                            backgroundColor: "#00c853",
                            padding: "15px 25px",
                            fontSize: "18px"
                        }}
                        variant="contained"
                        onClick={handleClick}
                        >
                        BUY NOW
                    </Button>
                   ) 
                   }
                 
                </Box>
               </Box>
            </Grid>
        </Grid>
        </Container>
    </Box>
  )
}

export default SingleProduct