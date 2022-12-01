import { Box, Button, Container, Grid, IconButton, TextField, Typography } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import React from 'react'
import Navbar from '../components/Navbar'
import { useDispatch, useSelector } from 'react-redux'
import DeleteIcon from '@mui/icons-material/Delete';
import {deleteProduct, resetStateCart} from '../redux/cartSlice' 
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { userRequest } from '../publicRequest'
import { toast } from 'react-toastify'
import BeatLoader from "react-spinners/BeatLoader";
import {sendEmail} from '../utils/sendEmail'
import axios from 'axios'


import { useEffect } from 'react'
const Cart = () => {
    
    const currentUser = useSelector((state) => state.auth.currentUser)
    const cart = useSelector((state) => state.cart)
    const [getProductId, setGetProductId] = useState("")
    const [productQuantity, setProductQuantity] = useState()
    const [loading, setLoading] = useState(true)
    const soldItem = cart?.products[0]?.quantity



    // console.log(cart.products[0]._id)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleClick =(id,price) =>{
        const itemPrice = Number(price)
        dispatch(deleteProduct({id,quantity: cart.quantity, price: itemPrice}))
    } 



    useEffect(() => {

            const getIdofProduct = async () => {
                try {
                    setGetProductId(cart.products[0]?._id)      
                    const res = await userRequest.get(`/products/find/${cart.products[0]?._id}`)
                    setProductQuantity(res.data.quantity)
                    setLoading(false)
                } catch (error) {
                    console.log({error: error.messsage})
                }
                
            }
            getIdofProduct()

   
    },[dispatch, cart, currentUser])


    const [orderSummary, setOrderSummary] = useState({
        location: '',
        time: ''
    })


  
    const [value, setValue] = React.useState(dayjs());

    const handleChange = (newValue) => {
      setValue(newValue);
    };



    const handleSubmit = async (e) =>{
        const totalSell = productQuantity - soldItem
        console.log(totalSell)
        e.preventDefault()
        //const getSellerId = cart.products.map((item) => console.log(item.user_id.studentId))
        try {
         await userRequest.post(`/order`,{
                //userId here is the one who is login, i'm trying to get the seller of the product
                userId: currentUser._id,
                products: cart.products.map((item) =>({
                    productId: item._id,
                    quantity: item._quantity,
                    sellerId: item.seller_id._id
                })),
                amount: cart.total,
                time: value,
                location: orderSummary.location,
                tax: (cart.total * 0.01).toFixed(2),
                boughtItem: soldItem
            }) 

        await userRequest.put(`/products/${getProductId}`, {
            quantity: (productQuantity - soldItem)
            
        })

            dispatch(resetStateCart())
             navigate('/')
            
            toast.success("Order Submited!")

        } catch (error) {
            toast.error("Please put a Location and Time!")
        }
    }

  return (
    <Box>
        <Navbar />
        <Container maxWidth="xl">
          {loading ? (
          <BeatLoader 
          color="#36d7b7" 
          loading={loading}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
          ):(
            <Box mt={7}>
            <Typography fontWeight={600} variant="h3">Shopping Cart</Typography>
            <Grid mt={4} container >
                <Grid xs={12} md={8} item >
                    {cart.products.map((product, i) =>(
                        <Box key={i} sx={{display: 'flex', alignItems:'center', justifyContent:'space-between', paddingY: '10px', borderBottom: 1}}>
                            <Box component="img" sx={{height: '120px', width: '120px'}} src={product.img} />
                            <Typography variant="h6" sx={{fontWeight: 700}}>{product.title}</Typography>
                            <Typography variant="h6">₱ {product.price}</Typography>
                            <Typography variant="h6"> {product.quantity}x</Typography>
                            <IconButton onClick={() => handleClick(product._id, product.price)} bgcolor="skyblue"> 
                                <DeleteIcon color="error" sx={{fontSize: '30px'}} />
                            </IconButton>
                        </Box>
                        
                    ))}
                </Grid>
                
                {cart.quantity === 0 ? ("Cart is Empty") : (
                    <Grid  xs={12} md={4} item >
                    <Box sx={{boxShadow:2, padding: 5, marginLeft: {xs: 0, md: 6}, height: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
                        <Typography variant='h4' sx={{fontWeight: 700, padding: '10px'}}>Order Summary</Typography>
                        <Box sx={{display: 'flex', width: '100%', justifyContent: 'space-between', gap: '5px',flexDirection: 'column'
                            }}>
                            <Box sx={{display: 'flex', alignItems:"center", justifyContent: 'space-between', gap: '10px'}}>
                                <Typography sx={{fontWeight: 600, color: 'gray'}}>Location for meet up: </Typography> 
                                <TextField onChange={(e) => setOrderSummary({...orderSummary, location: e.target.value})}  required variant="standard" placeholder='e.g gym, guardhouse, canteen' />
                            </Box>
                            <LocalizationProvider dateAdapter={AdapterDayjs }>
                                <Box sx={{display: 'flex', alignItems:"center", justifyContent: 'space-between', gap: '10px'}}>
                                    <Typography sx={{fontWeight: 600, color: 'gray'}} >Time of meet up: </Typography> 
                                    <DateTimePicker
                                        label="Date&Time picker"
                                        value={value}
                                        onChange={handleChange}
                                        renderInput={(params) => <TextField {...params} />}
                                     />
                                </Box>
                            </LocalizationProvider>

                            <Box sx={{display: 'flex', alignItems:"center", justifyContent: 'space-between', gap: '10px'}}>
                                <Typography sx={{fontWeight: 600, color: 'gray'}}>Total Amount: </Typography> 
                                <Typography sx={{fontWeight: 'bold'}}>₱ {cart.total}</Typography> 
                            </Box>
                           

                        </Box>
                        {!currentUser ? (
                        <Box sx={{display:'flex', alignItems:'center', justifyContent:'center', padding: '20px'}}>
                            <Link to="/login" style={{textDecoration: 'none'}}>
                                <Button variant="contained" size="large"  fullWidth>Login</Button>
                            </Link>
                        </Box>
                        ): (
                        <Box sx={{display:'flex', alignItems:'center', justifyContent:'center', padding: '20px'}}>
                            <Button variant="contained" size="large" onClick={handleSubmit} fullWidth>PAY CASH</Button>
                        </Box>
                        )}

                    </Box>
                </Grid>
                )}
                
            </Grid>
        </Box>
          )}
        </Container>
    </Box>
  )
}

export default Cart