const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 7000
const {MONGOURI} = require('./keys')
const cors = require('cors')
app.use(cors())
mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology:true
})
mongoose.connection.on('connected',()=>{
    console.log("Mongoose CONNECTED!!")
})
mongoose.connection.on('error',(err)=>{
    console.log("err connection",err)
})


require('./models/user')
require('./models/post')
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.listen(PORT,()=>{
    console.log("Server is Running",PORT); 
})