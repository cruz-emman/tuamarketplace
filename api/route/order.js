import express from 'express'
import mongoose from 'mongoose';
import Order from '../model/Order.js'
import sgMail from '@sendgrid/mail'
const router = express.Router()
import {verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization} from './verifyToken.js'
import nodemailer from 'nodemailer'
const API_KEY = "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"

sgMail.setApiKey(API_KEY)

let transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: ""
  }
})

router.post("/", async (req, res) => {
    const newOrder = new Order(req.body);

    try {
      const savedOrder = await newOrder.save();
      
      res.status(200).json(savedOrder);
    } catch (err) {
      res.status(500).json({message: err.message});
      console.log({message: err.message})
    }
  });
  
  //UPDATE
  router.put("/:id", async (req, res) => {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedOrder);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //DELETE
  router.delete("/:id", async (req, res) => {
    try {
      await Order.findByIdAndDelete(req.params.id);
      res.status(200).json("Order has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  router.get("/find/:id", async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      res.status(200).json(order);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //GET USER ORDERS
  router.get("/find/:userId", async (req, res) => {
    try {
      const orders = await Order.find({ userId: req.params.userId });
      res.status(200).json(orders);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  // //GET ALL
  
  router.get("/", async (req, res) => {
    try {
      const orders = await Order.find().populate(
        [
          {path: 'userId', select: 'studentId'},
          {path: 'products.productId', select: 'title img status'},
          {path: 'products.sellerId', select: 'studentId'}
        ]).exec();
      res.status(200).json(orders);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  

  //GET MONTHLY INCOME
  
  router.get("/totalSales", async (req, res) => {
    const productId  = req.query.orderId;
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 11));
  
    try {
      const income = await Order.aggregate([
        {$match: {status: 'complete'}},
        {
          $project: {amount: 1}
        },
        {
          $group: {_id: null, total: {$sum: "$amount"}}
        }
      ]);
      res.status(200).json(income);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  router.get("/income", async (req, res) => {
    const productId  = req.query.orderId;
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 11));
  
    try {
      const income = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: previousMonth },
            ...(productId && {
              products: { $elemMatch: { productId } },
            }),
          },
        },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);
      res.status(200).json(income);
    } catch (err) {
      res.status(500).json(err);
    }
  });


  router.get('/previousSales/:id', async (req,res) => {
    const {id} = req.params
    const sellerId = mongoose.Types.ObjectId(id)

    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 11)); 


    try {
      const order = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: previousMonth
            },
            products: {
              $elemMatch: {
                sellerId: sellerId
              }
            },
            status: 'complete'
            
          }
        },
        {
          $project: {
            month: {
              $month: "$createdAt"
            },
            sales: "$amount"
          }
        },
        {$sort: {createdAt: 1}},
        {
          $group: {
            _id: "$month",
            total: {
              $sum: "$sales"
            }
          }
        }
      ]);
      res.status(200).json(order)
    } catch (error) {
      res.status(400).json({message: error.message})
    }

  })


  
  
  //GET GROSS INCOME
  router.get("/total/:id", async (req, res) => {
    const { id } = req.params;
    const sellerId = mongoose.Types.ObjectId(id)
  
    try {
      const income = await Order.aggregate([ 
      {
        $match: {"products.sellerId": sellerId, status: "complete"}
      },
      {$group: {_id: "$products.sellerId", total: {$sum: "$amount"}}}
      

      ])
      res.status(200).json(income);
    } catch (err) {
      res.status(500).json({err: err.message});
    }
  });


  router.get('/recent/:id', async (req,res) => {
    const { id } = req.params;

    try {
      const orders = await Order.find({'products.sellerId': id }).sort({createdAt: -1})
                    .populate([
                      {path: 'userId', select: 'firstname lastname studentId' },
                      {path: 'products.productId', select: 'title img status' }
                    ]).exec()
                                    
      res.status(200).json(orders);     
    }
       catch (error) {
      res.status(500).json({message: error.message});
      console.log({message: error.message});
    }

  })
  export default router