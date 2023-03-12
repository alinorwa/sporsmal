require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Sporsmal = require('./models/sporsmal')



const ejs = require('ejs');

const app = express()
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({extended: true}))
// Set the view engine to EJS
app.set('view engine', 'ejs');
app.use(express.static('public'));




// mongoose 
mongoose.set('strictQuery' , false)
const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDB Connected : ${conn.connection.host}`)
    }catch (error) {
        console.log(error)
        process.exit(1)
    }
}




  
// get random list og question in index.html
app.get('/', (req, res) => {
  Sporsmal.countDocuments()
  .then(count => {
        const randomIndex = Math.floor(Math.random() * count);
        
        Sporsmal.find({}, { _id: 0 }).limit(1).skip(randomIndex).then(doc => {
          if (!doc) {
            console.error('No document found');
            res.status(404).send('No document found');
            return;
          }
          res.render('index', { data: doc[0] });
        }).catch(err => {
          console.error('Error finding document:', err);
          res.status(500).send('Error finding document');
        });
  })
  .catch(err => {
    console.error('Error counting documents:', err);
    res.status(500).send('Error counting documents');
  });
});


// get random list og question in post.html
app.get('/alipostnorway' , async (req,res) => {
  const questions = await Sporsmal.find();
  const count_questions =  questions.length;
  res.render('admin_questions', { questions  , count_questions});
 
})




// create the question in index.html
app.post('/add', async (req, res) => {

       const question = new Sporsmal({
        spør: req.body.question,
      });
      await question.save();
    
      res.redirect('/alipostnorway');

});




app.post('/delete/:id', async (req, res) => {
  await Sporsmal.findByIdAndDelete(req.params.id);
  res.redirect('/alipostnorway');
});

app.post('/update/:id', async (req, res) => {
  const question = await Sporsmal.findById(req.params.id);
  question.spør = req.body.question;
  await question.save();
  res.redirect('/alipostnorway');
  
});



// app listen
connectDB().then( () => {
    app.listen( PORT , () => {
        console.log(`Listening on port ${PORT}`)
    })
})