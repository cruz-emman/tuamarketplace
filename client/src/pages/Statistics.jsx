import { Box, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Button, Card, CardContent } from '@mui/material'
import React from 'react'
import dayjs from 'dayjs';

import { useEffect } from 'react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Chart from '../components/Chart'
import Navbar from '../components/Navbar'
import { userRequest } from '../publicRequest'
import BeatLoader from "react-spinners/BeatLoader";
import { useMemo, useRef } from 'react'


const Statistics = () => {

    const navigate = useNavigate()

    const [grossIncome , setGrossIncome] = useState()
    const [spent , setSpent] = useState()

    const [recentTransaction, setRecentTransaction] = useState([])
    const [productQuantity, setProductQuantity] = useState()
    const [orderStats, setOrderStats] = useState([])
    const [executing, setExecuting] = useState(false);


    const [loading, setLoading] = useState(true)
    const {id} = useParams()

    const statusColor={
        complete:'lime',
        pending:'yellow',
        initiate:'blue',
        }

        

    const MONTHS = useMemo(
        () => [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
        ],[]
    )

    useEffect(() => {
        const getStats = async () =>{
              try {
                const res = await userRequest.get(`/order/total/${id}`)
                setGrossIncome(res.data[0].total)
                setLoading(false)
              } catch (error) {
              }
        }   
        getStats()
    },[id,setGrossIncome,setRecentTransaction,setOrderStats, MONTHS])

    
    useEffect(() =>{
        const getIncomeStats = async () =>{
            try {
                const res = await userRequest.get(`/order/previousSales/${id}`)
                const list = res.data.sort((a,b)=>{
                    return a._id - b._id
                })

                list.map((item) =>
                setOrderStats((prev) => [
                  ...prev,
                  { name: MONTHS[item._id - 1], "Total Sales": item.total },
                ])
              );
                
                // res.data.map((item) => {
                //     // //Since ang value sa backend is _id: 10 which is eqal to October, dahil sa spread operator
                //     // //ginawan ng name, so name:MONTHS na equal sa use memo, then kung ano ung current Id. 
                //     setOrderStats(prev=>[
                //         ...prev,
                //         {name:MONTHS[item._id - 1], "Total Sales": item.total}
                        
                //         ])
                // })
            } catch (error) {
            }
        }
        getIncomeStats()
    },[id,setGrossIncome,setRecentTransaction,setOrderStats, MONTHS])


    useEffect(() => {
        const getStats = async () =>{
              try {
                const res = await userRequest.get(`/order/totalbuy/${id}`)
                setSpent(res.data[0].total)
                setLoading(false)
              } catch (error) {
              }
        }   
        getStats()
    },[id,setGrossIncome,setRecentTransaction,setOrderStats, MONTHS, setSpent])

    
    useEffect(() => {
        const getStats = async () =>{
          
            try {
                const res = await userRequest.get(`/order/recent/${id}`)
                setRecentTransaction(res.data)
                setLoading(false)
            } catch (error) {
                console.log({error: error.message})
            }

        }   
    getStats()
},[id,setGrossIncome,setRecentTransaction,setOrderStats, MONTHS])

    const confirmSell = async (e) => {
        try {
            await userRequest.put(`/order/${e}`, {status: 'complete'})
            navigate(0);

        } catch (error) {
            console.log({error: error.message})
        }
    }

    const cancelOrder = async (e, quantityItem) => {
       try {
        const res = await userRequest.get(`/order/find/${e}`)
        const orderQuantity = res.data?.boughtItem
        const product = res.data?.products[0]
        const itemId = product?.productId
        const getProduct = await userRequest.get(`/products/find/${itemId}`)
        const stockQuantity = getProduct?.data.quantity
        console.log(orderQuantity, stockQuantity)
        await userRequest.put(`/products/${itemId}`, {quantity: (stockQuantity - stockQuantity) + (stockQuantity + orderQuantity)})
        await userRequest.delete(`/order/${e}`)
        navigate(0);

       } catch (error) {
        
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
           ):
           (
            <Box sx={{display:'flex', alignItems:'center', justifyContent: 'center', flexDirection: 'column', marginTop: {xs: 0, md: 10}}}>

                <Box  sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alingItems:'center', gap: 5}}>

                    <Box sx={{display:'flex', justifyContent: 'space-evenly', gap:2, flexDirection: {xs: 'column', md: 'row'}}}>
                        <Paper  elevation={3} sx={{width: {xs: '100%', md: '50%'}, padding: 2}}>
                            <Box sx={{display:'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 2}}>
                                <Typography variant="body1" fontWeight={700} color="text.disabled">Income (SELL)</Typography>
                                <Typography sx={{fontSize: '28px', fontWeight: 300}} color="success.main"> ??? {grossIncome || 0}</Typography>
                            </Box>
                        </Paper>
                    
                        <Paper  elevation={3} sx={{width: {xs: '100%', md: '50%'}, padding: 2}}>
                            <Box sx={{display:'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 2}}>
                                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                    <Typography variant="body1" fontWeight={700} color="text.disabled">Spent (BUY) </Typography>
                                    <Button component={Link} to={`/spentdashboard/${id}`} variant="outlined" color="error" size="small">View</Button>
                                </Box>
                                <Typography sx={{fontSize: '28px', fontWeight: 300}} color="error.main"> ??? {spent || 0}</Typography>
                            </Box>
                        </Paper>
                    </Box>

                    <Box  sx={{display: {xs: 'none', md: 'flex', width: '100%'}}}>
                        <Paper elevate={3} sx={{padding: 4}}>
                        <Typography variant="h6" textAlign="center" fontWeight={700} color="text.disabled" marginBottom={2}>Total Sales</Typography>
                            <Chart data={orderStats} stroke="#76ff03" color="#00e676" />
                        </Paper>     
                    </Box>
                </Box>


                <Box sx={{marginTop: 10, width: '100%', display:'flex', justifyContent: 'center', flexDirection: 'column'}}>
                    <Typography variant="h4" sx={{fontWeight: 600, color: '#9e9e9e', textAlign: 'start'}}>Latest Transaction (SELL) </Typography>
                    <Box>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                <TableRow>
                                    <TableCell>Order ID</TableCell>
                                    <TableCell align="left">Name</TableCell>
                                    <TableCell align="left">Student ID</TableCell>
                                    <TableCell align="left">Product</TableCell>
                                    <TableCell align="left">Qty</TableCell>
                                    <TableCell align="left">Amount</TableCell>
                                    <TableCell align="left">Location & Time</TableCell>
                                    <TableCell align="left">Status</TableCell>
                                    <TableCell align="center">Action</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {recentTransaction.map((recent) => (
                                    <TableRow key={recent._id}>
                                    <TableCell component="th" scope="row">
                                        {recent._id}
                                    </TableCell>
                                    <TableCell align="left">{recent.userId.firstname} {recent.userId.lastname} </TableCell>
                                    <TableCell align="left">{recent.userId.studentId}</TableCell>
                                    <TableCell align="left">
                                        {recent.products.map((product) => (
                                            <Box key={recent._id} sx={{display: 'flex', alingItems:'center'}}>
                                                <Typography mr={1} sx={{display:'flex', alignItems:'center',justifyContent:'center',width: '50px'}}>{product?.productId?.title}</Typography>
                                                <Box component="img" src={product?.productId?.img} sx={{display:'flex', alignItems:'center',justifyContent:'center',width: '50px'}} />  
                                            </Box>
                                        ))}
                                    </TableCell>
                                        <TableCell align="left">{recent?.boughtItem}</TableCell>


                                    <TableCell align="left">??? {recent.amount}</TableCell>
                                    <TableCell align="left">{recent.location} & {dayjs(recent.time).format('llll')}</TableCell>
                                    <TableCell align="left" sx={{display:'flex', alignItems:'center', borderRadius: '5px'}}>
                                    <Typography sx={{padding:1, backgroundColor: statusColor[recent.status]}}>
                                            {recent.status}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box sx={{display: 'flex', alignItems:'center', justifyContent:'center', gap: '5px'}}>
                                            {recent.status === "complete" ? <Button variant="contained" disabled
                                                                color="success">Confirm </Button> :<Button variant="contained"
                                                                onClick={(e) => confirmSell(recent._id)} 
                                                                color="success">Confirm </Button>}
                                        {recent.products.map((product) => (
                                            <React.Fragment  key={recent._id}>
                                        <Button variant="contained" color="secondary"  onClick={(e) => cancelOrder(recent._id, product?.productId?.quantity)}>Cancel </Button>
                                            </React.Fragment>
                                        ))}
                                        </Box>
                                    </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            </Box>
           )}

        </Container>
    </Box>
  )
}

export default Statistics