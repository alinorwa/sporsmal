require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const Question = require('./models/questions')
const AskAndTheAnswer = require('./models/askAndTheAnswer')
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



// ========================================== all function

// get the index page and send the random Question data to there 
app.get('/', (req,res) => {
    Question.countDocuments()
    .then(count => {
        const randomIndex = Math.floor(Math.random() * count)
            Question.find({} , {_id : 0}).limit(1).skip(randomIndex)
            .then(doc => {
                if(!doc){
                    console.error('No document Found')
                    res.status(404).send('No document found')
                    return
                }
                res.render('index' , { data : doc[0]})
            })
            .catch(error => {
                console.error('Error finding document : ' , error)
                res.status(500).send('Error finding document')
            })
    })
    .catch(error => {
        console.error('Error counting documents:', err);
        res.status(500).send('Error counting documents');
    })

})

// data to post the answer and take tge ask random
app.post('/data' , async(req ,res) => {

    const askAndTheAnswer = new AskAndTheAnswer({
      
        ask : req.body.askvalue ,
       answer  : req.body.answervalue
    })
    askAndTheAnswer.save()
    
    res.redirect('/')
   
  })  

// to get all the ask and the answer
app.get('/all', async (req ,res) => {
    const askAndTheAnswer = await AskAndTheAnswer.find()
    const count = askAndTheAnswer.length
    res.render('all' , {askAndTheAnswer , count})
})


// get random list og question ============================ start admin_questions.ejs
app.get('/alipostnorway' , async (req,res) => {
    const questions = await Question.find();
    const count_questions =  questions.length;
    res.render('admin_questions', { questions  , count_questions});
   
  })
  
  // create the question  
  app.post('/add', async (req, res) => {
         
         const question = new Question({
            question: req.body.question,
        });
        await question.save();
      
        res.redirect('/alipostnorway');
  
  });
  // delete 
  app.post('/delete/:id', async (req, res) => {
    await Question.findByIdAndDelete(req.params.id);
    res.redirect('/alipostnorway');
  });
  
  // update 
  app.post('/update/:id', async (req, res) => {
    const question = await Question.findById(req.params.id);
    question.question = req.body.question;
    await question.save();
    res.redirect('/alipostnorway');
    
  });
  
  // ========================================================= end admin_questions.ejs
  

// ==================================================================== start  Delete all skAndTheAnswer data 

 



let intervalId = null;
const deleteAllData = async () => {
  try {
    const count = await AskAndTheAnswer.countDocuments();
    if (count > 0) {
      await AskAndTheAnswer.deleteMany({});
      console.log('All data deleted successfully');
    } else {
      console.log('No data to delete');
      clearInterval(intervalId); // stop the interval timer
    }
  } catch (error) {
    console.error('An error occurred while deleting data:', error);
  }
};

//  120 000 that mean 2 minutes 
//  18 000 000 that mean five hours 
//  24 * 60 * 60 * 1000  that mean 24 hours 
// intervalId = setInterval(deleteAllData, 24 * 60 * 60 * 1000);
intervalId = setInterval(deleteAllData, 120000);

app.delete('/delete-all', async (req, res) => {
  try {
    const count = await AskAndTheAnswer.countDocuments();
    if (count > 0) {
      await AskAndTheAnswer.deleteMany({});
      res.redirect('/');
    } else {
      res.redirect('/');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while deleting data');
  }
});


// ==================================================================== end  Delete all skAndTheAnswer data 


// image 
app.post('/upload', upload.single('image'), async (req, res) => {
  const image = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).toBuffer();
  const newImage = new ImageModel({
    image: image,
    title: req.body.title
  });
  await newImage.save();
  // res.send('File uploaded successfully');
  res.redirect('/img');
});

app.get('/img', async (req, res) => {
  try {
    const images = await ImageModel.find({});
    res.render('image', { images });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});














app.listen(PORT , () => {
    console.log(`server is working on PORT http://http://127.0.0.1:${PORT} ..........`)
})












