import { Box, Button, Container, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import React, {useState} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import app from '../firebase'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage'
import {itemTables} from '../dataTables'
import { addProduct } from '../redux/apiCalls'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import BeatLoader from "react-spinners/BeatLoader";

const AddProduct = () => {

  const currentUser = useSelector((state) => state.auth.currentUser)
  const [loading,setLoading] = useState(false)
  const location = useLocation()
  const id = location.pathname.split('/')[2]
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [file, setFile] = useState(null)

  const [itemName, setItemName] = useState({
    seller_id: currentUser._id,
    title: '',
    description: '',
    category: '',
    price: ''
  })

  
  const handleClick = (e) =>{

    e.preventDefault();
    const fileName = new Date().getTime() + file
    const storage = getStorage(app)
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)

    try {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log('Upload is ' + progress + '% done')
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused')
              break
            case 'running':
              console.log('Upload is running')
              break
            default:
          }
        },
        (error) => {
          // Handle unsuccessful uploads
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const product = { ...itemName, img: downloadURL }
             addProduct(product, dispatch)
            toast.success("Added New Product")
             navigate('/')
          })
        }
      )
    } catch (error) {
      console.log({error: error.message})
    }

   
  }



  return (
    <Box>
        <Navbar />
        {loading ? (
           <BeatLoader 
           color="#36d7b7" 
           loading={loading}
           size={50}
           aria-label="Loading Spinner"
           data-testid="loader"
         />
        ): (
          <Container maxWidth="xl" >
          <Box p={4} sx={{display:'flex'}}>
              <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                  <Typography variant="body2">Marketplace</Typography>
            <Typography variant="h6" fontWeight={700}>Item For Sale</Typography>
                  <Stack
                direction="column"
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={2}
                py={2}
            >
                <TextField variant="outlined" required label="Title"
                  onChange={(e) => setItemName({...itemName, title: e.target.value })}
                  fullWidth name="title" />
                <TextField variant="outlined" required label="Price" type="number" 
                      onChange={(e) => setItemName({...itemName, price: e.target.value })}
                      fullWidth name="price" />
                <FormControl fullWidth>  
                  <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                  fullWidth
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="categories"
                  defaultValue=""
                  label="categories"
                  onChange={(e) => setItemName({...itemName, category: e.target.value})}
                  required
                >
                    {itemTables.map((item) =>(
                      <MenuItem key={item.id} value={item.cat}>
                          {item.name}
                      </MenuItem>              
                  ))}
                    
                </Select>
                </FormControl>
                <TextField variant="outlined" label="Description" 
                    onChange={(e) => setItemName({...itemName, description: e.target.value})} 
                    fullWidth name="description" rows={4} multiline />
                <Button variant="contained" component="label">
                  Upload File
                  <input 
                    type="file"
                    id="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    hidden
                  />
                </Button>
            </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                      <Box  
                        sx=
                          {{display: 'flex', flexDirection: 'column', justifyContent:'center', paddingX: 5,
                          width: '100%', height: '700px', border: 1, borderColor: 'grey.500', borderRadius: '10px', boxShadow: 2, 
                          }}>
                      
                            <Typography variant="h5" sx={{fontWeight: 'bold'}}>
                              Preview
                            </Typography>
                            <Box sx={{display:'flex', width: '100%', justifyContent: 'space-between', flexDirection: {xs: 'column', md: 'row'}}}>
                              <Box sx={{width: {xs: 150, md: '300'} }}>
                                <Box component="img" src={file ? URL.createObjectURL(file) :'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'} sx={{height:'100%', width: '100%', objectFit: 'contain',borderRadius: '16px'}}  />
                              </Box>
                              <Box sx={{display: 'flex', flexDirection: 'column', height: '100%', gap: '20px'}}>
                                <TextField 
                                    id="outlined-multiline-static"
                                    label="Title"
                                    multiline
                                    variant="outlined"
                                    value={itemName.title || "Title"}
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                  />
                                <TextField 
                                    id="outlined-multiline-static"
                                    label="Price"
                                    multiline
                                    variant="outlined"
                                    value = {`₱ ${itemName.price}` ||  "₱ 500"}
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                  />
                                <TextField 
                                    id="outlined-multiline-static"
                                    label="Category"
                                    multiline
                                    variant="outlined"
                                    value = { itemName.category || ""}
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                  />
                                  <TextField 
                                    id="outlined-multiline-static"
                                    multiline
                                    label="Description"
                                    rows={6}
                                    variant="outlined"
                                    value = {itemName.description || ""}
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                  />
                                  <Box mt={5}>
                                    <Button onClick={handleClick} variant="contained" type="submit"  sx={{alignSelf: 'center'}}>
                                      Sell Product
                                    </Button>
                                  </Box>
                              </Box>
                        </Box>     
                      </Box>
                  </Grid>
              </Grid>
                  
          </Box>
      </Container>
        )}
    </Box>
  )
}

export default AddProduct