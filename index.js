require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')

const router = express.Router();
// image 
const multer = require('multer');
const sharp = require('sharp');
const ImageModel = require('./models/images')

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(express.static('public'));
app.set('view engine' , 'ejs')
const mongodb = process.env.MONGO_URL 
const PORT = process.env.PORT || 5000


// ===== start image
const storage = multer.memoryStorage();
const upload = multer({ storage }); 
// ===== end image 

// ========================================== start  mongodb connect

mongoose.connect(mongodb)
.then(() => { console.log('Mongo-DB its Connecting ....')})
.catch((error) => {console.log(error)})
// ========================================== end  mongodb connect


// image 
app.post('/upload', upload.single('image'), async (req, res) => {
  const image = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).toBuffer();
  const newImage = new ImageModel({
    image: image,
    title: req.body.title
  });
  await newImage.save();
  // res.send('File uploaded successfully');
  res.redirect('/');
});

app.get('/', async (req, res) => {
  try {
    const images = await ImageModel.find({});
    res.render('index', { images });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});


app.listen(PORT , () => {
    console.log(`server is working on PORT http://http://127.0.0.1:${PORT} ..........`)
})












