import express from 'express'
const router = express.Router()
import User from '../model/User.js'
import CryptoJS from 'crypto-js'
import jwt from 'jsonwebtoken'


//REGISTER
router.post("/register", async (req,res) =>{
    const {firstname, middlename, lastname, email, password,department,  studentId} = req.body

    if(!firstname | !department | !lastname | !email | !password | !studentId){
        res.status(400).json("Please add all fields")
    }else{
        try {
            const newUser = new User({
                firstname :req.body.firstname,
                middlename :req.body.middlename,
                lastname :req.body.lastname,
                department :req.body.department,
                email :req.body.email,
                studentId :req.body.studentId,
                password : CryptoJS.AES.encrypt(req.body.password, 
                            process.env.PASSWORD_SEC)
                            .toString(),
                        })
                    const savedUser = await newUser.save()
            res.status(200).json(savedUser)
            } catch (error) {
                res.status(400).json({message:error.message})
            }
        }  
})


//LOGIN
router.post('/login', async (req,res) =>{
    try {
        const studentId = await User.findOne({studentId: req.body.studentId})
        if(!studentId) return res.status(404).json("User is not yet accepted")
        
        
            const isPasswordCorrect = CryptoJS.AES.decrypt(
                studentId.password,
                process.env.PASSWORD_SEC
                )
            
            const originalPassowrd = isPasswordCorrect.toString(CryptoJS.enc.Utf8)
                if(originalPassowrd !== req.body.password) 
                 return res.status(400).json("Incorrect password")
    
                 const acessToken = jwt.sign({
                    id:studentId._id, isAdmin: studentId.isAdmin
                 }, process.env.JWT_KEY, {expiresIn: "3d"})
    
            const {password, ...others} = studentId._doc

            if(others.status === 'active'){
                res.status(200).json({...others, acessToken})
            }
            else{
                res.status(404).json("Account still Pending")
            }        

        } catch (error) {
        res.status(400).json({message:error.message})
    }
})

export default router