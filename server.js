
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
var bodyParser = require('body-parser') 
const multer  = require('multer')
const upload = multer({ 
    dest: __dirname+"/uploads/videos",
    limits: {fileSize: 50 * 1024 * 1024},
    fileFilter: (req,file,cb) => {
        if(!file.originalname.match(/\.(mov|avi|mp4)$/)){
            return new Error("video files are allowed")
        }
        cb(null,true);
    }
 })
const fs = require('fs')

app.use(express.static(__dirname+"/public"))
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.options('*',cors())
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json()) 

app.get('/',(req,res) => {
    res.send(`welcome to home page`)
})

app.post('/uploadFile',upload.single('myImage'),(req,res) => {
   const username = req.body.username;
   const userFolder = __dirname+"/uploads/videos/"+username
   if(!fs.existsSync(userFolder)){
    fs.mkdirSync(userFolder)
   }
   fs.rename(__dirname+"/uploads/videos/"+req.file.filename,userFolder+"/"+req.file.originalname,function(a){
    console.log(a)
   })
    res.send(`image is being uploaded with username ${req.body.username}`)
})
const port = 3500

app.listen(port,() => {
    console.log(`server is running on port ${port}`)
})