import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar'
import { userRequest } from '../publicRequest';
import BeatLoader from "react-spinners/BeatLoader";
import { resetState } from '../redux/authSlice';
import { toast } from 'react-toastify';
import {  updateUser } from '../redux/apiCalls';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import {storage} from '../firebase'
import app from '../firebase'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage'
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const ID_REGEX = /^[0-9]{10}$/;



const EditProfile = () => {
  const {isUpdated, isError} = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {id} = useParams()
  const [userProfile, setUserProfile] = useState()
  const [loading,setLoading] = useState(true)
  const [file, setFile] = useState(null)
  const [itemName, setItemName] = useState()

  
  const {register, handleSubmit, watch , reset, formState: {errors}} = useForm({

  })

  useEffect(() =>{
      const getUser = async () =>{
        const res = await userRequest.get(`/users/find/${id}`)
        setUserProfile(res.data)
        let defaultValues = {}
        defaultValues.firstname = res.data?.firstname
        defaultValues.middlename = res.data?.middlename
        defaultValues.lastname = res.data?.lastname
        defaultValues.email = res.data?.email
        defaultValues.studentId = res.data?.studentId
        defaultValues.department = res.data?.department
        defaultValues.img = res.data?.img
        defaultValues.password = res.data?.password
        reset({ ...defaultValues });
        setLoading(false)
      }
      getUser()
  },[id])

  useEffect(() =>{
    if(isError){
      toast.error("Student ID or Email Already Existing")
    }
  },[dispatch,isError, setUserProfile, setItemName])

  useEffect(() =>{
    if(isUpdated){
      toast.success("Re-Login again!")
      dispatch(resetState())
      navigate('/login')
    }
  },[dispatch,isUpdated, setUserProfile, setItemName])


  
  const onSubmit =  async ({firstname, middlename, lastname, email, password, studentId, department}) => {
    let user = {firstname, middlename, lastname, email, password, studentId, department}
    let userImage = itemName?.img

    const userend = {...user, img: userImage}
    updateUser(id,userend,dispatch)

  }

  const [imgUrl, setImgUrl] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);

  const handleUpload = (e) => {
    e.preventDefault()
    const file = e.target[0]?.files[0]
    if (!file) return;
    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed",
      (snapshot) => {
        const progress =
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgresspercent(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setItemName({...itemName, img: downloadURL})
          setImgUrl(downloadURL)
          
        });
      }
    );
  }


  return (
    <Box>
      <Navbar />
      <Box p={4} m={8} sx={{display: 'flex', flexDirection: 'column',boxShadow: 3, borderRadius: '10px'}}>
        <Typography variant="h5" sx={{textTransform: 'uppercase', fontWeight: 600}}>Edit Personal Account</Typography>
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
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <form onSubmit={handleSubmit(onSubmit)} style={{display: "flex", flexDirection: 'column',gap: '10px', width: '100%'}}>
                        <Box sx={{display:'flex', alignItems:'center', justifyContent:'space-between', gap: '5px'}}>
                          <TextField   
                              variant="outlined"
                              name="Firstname"
                              fullWidth
                              label="First name"
                              autoFocus
                              {...register('firstname')}
                              error={!!errors?.firstname}
                              helperText={errors?.firstname ?errors.firstname.message: null}
                          />
                          <TextField   
                              variant="outlined"
                              name="Middlename"
                              fullWidth
                              label="Middle name"
                              {...register('middlename')}
                          />
                          <TextField   
                              variant="outlined"
                              name="Lastname"
                              fullWidth
                              label="Last name"
                              {...register('lastname')}
                              error={!!errors?.lastname}
                              helperText={errors?.lastname ?errors.lastname.message: null}
                          />
                        </Box>
                        <TextField   
                            variant="outlined"
                            name="email"
                            label="Email"
                            fullWidth
                            type="email"
                            {...register('email', {pattern: { message: "It should be a valid email address!" }})}
                            error={!!errors?.email}
                            helperText={errors?.email ?errors.email.message: null}
                        />
                        <TextField   
                            variant="outlined"
                            name="studentId"
                            label="Student ID"
                            fullWidth
                            type="text"
                            {...register('studentId', {pattern: {value: ID_REGEX,  message: "Please Enter your Student ID properly" }})}
                            error={!!errors?.studentId}
                            helperText={errors?.studentId ? errors.studentId.message: null}
                        />
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Department</InputLabel>
                              <Select
                                name="department"
                                labelId="demo-simple-select-label"
                                defaultValue={userProfile.department}
                                id="demo-simple-select"
                                label="Department"
                                {...register('department')}
                              >
                                <MenuItem value="CAHS">College of Allied Health and Sciences</MenuItem>
                                <MenuItem value="CASE">College of Arts, Sciences and Education </MenuItem>
                                <MenuItem value="CBMA">College of Business Management and Accountancy</MenuItem>
                                <MenuItem value="CEIS">College of Engineering and Information Sciences</MenuItem>
                                <MenuItem value="CHTM">College of Hospitality and Tourism Management </MenuItem>
                                <MenuItem value="CMT">College of Medical Technology</MenuItem>
                                <MenuItem value="SLCN">St. Lukes College of Nursing</MenuItem>
                              </Select>
                          </FormControl>

                        <Typography fontWeight={700}>Confirm By Re-Entering Password</Typography>
                        <TextField   
                            variant="outlined"
                            name="password"
                            label="Password"
                            defaultValue={userProfile?.password}
                            fullWidth
                            required
                            type="password"
                            {...register('password',
                             {pattern: {required: 'Required',value: PWD_REGEX,  message: "Password should be 8-24 characters and include at least 1 letter, 1 number and 1 special character!" }})}
                            error={!!errors?.password}
                            helperText={errors?.password ? errors.password.message: null}
                        />
                          <TextField   
                            variant="outlined"
                            name="password1"
                            label="Confirm Password"
                            fullWidth 
                            required
                            type="password"
                            autoFocus
                            {...register('password1', {
                              required: "Required",
                              validate: (value) => {
                                return value === watch('password') || 'Password does not match'
                              }
                            })}                                
                            error={!!errors?.password1}
                            helperText={errors?.password1 ? errors.password1.message: null}
                          />
                        <Button fullWidth type="submit" variant="contained">Update Info</Button>

                      </form>
              </Grid>


                  <Grid item xs={12} md={6}>
                  <Box sx={{display: 'flex', alingItems:'center', justifyContent: {xs: 'center', md: 'space-between'},  marginX: 'auto', gap: '10px', width: '50%',flexDirection: {xs: 'column', md:'row'}}}>

                  <Box component="img" src={imgUrl ?imgUrl: userProfile.img } sx={{height:'100%', width: '100%', objectFit: 'contain',borderRadius: '16px'}}  />                          </Box>

                    <Box sx={{marginTop: 5}}>
                        <form stlye={{display: 'flex', flexDireciton: 'column'}} onSubmit={handleUpload} className='form'>
                          <input type='file' />
                          <Button type='submit'  endIcon={<PhotoCamera />} color="secondary" size='small' variant="contained">Upload</Button>
                        </form>
                        {
                          !imgUrl &&
                          <Box>
                            <Box sx={{ width: `${progresspercent}%` }}>{progresspercent}%</Box>
                          </Box>
                        }
                      </Box>
                  </Grid>
          </Grid>
          )}
      </Box>
    </Box>
  )
}

export default EditProfile