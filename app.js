import express from 'express';
import bodyParser from 'body-parser';
import config from 'config'
const  app = express()

app.listen(3000,()=>{
    console.log('Running...')
})