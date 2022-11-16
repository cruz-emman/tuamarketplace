import { Box, Card, CardActionArea, CardContent, CardMedia, Container, Grid, Tooltip, Typography } from '@mui/material'
import {itemTables} from '../dataTables'
import React from 'react'
import med from '../assets/med1.jpg'
import tour from '../assets/toursim.jpg'
import tech from '../assets/tech.jpg'
import educ from '../assets/educ.jpg'
import { Link } from 'react-router-dom'

const Category = () => {
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{textAlign:'center', paddingY: '40px', textTransform: 'uppercase', fontWeight: 600, color: '#757575'}}>Courses</Typography>

      <Box sx={{display: 'flex', justifyContent: 'space-evenly', alingItems:'center', flexWrap: 'wrap', marginX: {xs: '20px', md: '0px'}, gap: 2, padding: {xs: 2, md: 4},  boxShadow: 2, marginY: 2 }}>
          {itemTables.map((data) => (
                  <Link to={data.to} key={data.id}>
                    <Card sx={{height: {xs: 100, md: 150}, width: {xs: 100, md: 150}, borderRadius: '50%', boxShadow: 3}}>
                      <CardActionArea>
                        <Tooltip title={data.name}>
                          <CardMedia component='img'  
                                image={data.img}
                            />
                        </Tooltip>
                      </CardActionArea>
                    </Card>
                </Link>
          ))}
      </Box>

    </Container>
  )
}

export default Category