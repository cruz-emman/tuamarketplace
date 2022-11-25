import { Box, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Button } from '@mui/material'
import React from 'react'
import dayjs from 'dayjs';

import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Chart from '../components/Chart'
import Navbar from '../components/Navbar'
import { userRequest } from '../publicRequest'
import BeatLoader from "react-spinners/BeatLoader";
import { useMemo, useRef } from 'react'


const Statistics = () => {

    const navigate = useNavigate()

    const [grossIncome , setGrossIncome] = useState()
    const [recentTransaction, setRecentTransaction] = useState([])
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

    const cancelOrder = async (e) => {
       try {
        const res = await userRequest.get(`/order/find/${e}`)
        const product = res.data?.products[0]
        const itemId = product?.productId
        await userRequest.put(`/products/${itemId}`, {status: 'available'})
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
            <Box sx={{display:'flex', alignItems:'center', justifyContent: 'center', flexDirection: 'column', marginTop: 10}}>
                
            <Typography variant="h3" sx={{fontWeight: 700, textTransform:'uppercase'}}>Dashboard</Typography>
            <Box sx={{display:'flex', alignItems:'center', justifyContent:'space-evenly',flexDirection:'column',
                        marginTop: '50px', textAlign:'center'}}>
                <Box sx={{display: {xs: 'none', md: 'flex'}}}>
                    <Typography variant="h5" sx={{fontWeight: 'light', color: '#9e9e9e'}} >Sales</Typography>
                    <Chart data={orderStats} stroke="#76ff03" color="#00e676" />
                </Box>
                <Box sx={{display:'flex', alignItems:'center', justifyContent:{xs: 'center', md: 'space-evenly'}, marginTop: 10, width: '100%', flexDirection: {xs: 'column', md: 'row'}, gap: '10px'}}>
                        <Typography variant="h5" sx={{fontWeight: 400, borderBottom: 1}}>Gross Income</Typography>
                        <Typography variant="h5" sx={{fontWeight: 700, color: '#00e676'}}> ₱ {grossIncome || 0}</Typography>
                    </Box>
            </Box>

            <Box sx={{marginTop: 10, width: '100%', display:'flex', justifyContent: 'center', flexDirection: 'column'}}>
                <Typography variant="h4" sx={{fontWeight: 600, color: '#9e9e9e', textAlign: 'start'}}>Latest Transaction</Typography>
                <Box>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell align="left">Name</TableCell>
                                <TableCell align="left">Student ID</TableCell>
                                <TableCell align="left">Product</TableCell>
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
                                            <Typography mr={1}>{product?.productId?.title}</Typography>
                                            <Box component="img" src={product?.productId?.img} sx={{width: '50px'}} />
                                        </Box>
                                    ))}
                                 </TableCell>
                                 <TableCell align="left">₱ {recent.amount}</TableCell>
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
                                    <Button variant="contained" color="secondary"  onClick={(e) => cancelOrder(recent._id)}>Cancel </Button>
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