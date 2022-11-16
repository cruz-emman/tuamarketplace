import express from "express";
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRouter from './route/auth.js'
import userRouter from './route/user.js'
import productRouter from './route/product.js'
import cartRouter from './route/cart.js'
import orderRouter from './route/order.js'
const PORT = 5000

const app = express()
dotenv.config()

const dbConnect = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Database is connected to MongoDB")

    } catch (error) {
        throw error
    }
}

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)




app.listen(PORT, () =>{
    dbConnect()
    console.log(`Connected to Backend on PORT: http://localhost:${PORT}`)
})