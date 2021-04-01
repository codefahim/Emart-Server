const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const ObjectID = require('mongodb').ObjectID;  
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//db connection is

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2xris.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  //Product Collection
  const collection = client
    .db(process.env.DB_NAME)
    .collection(process.env.DB_COLLECT);
  //Order Collection
   const orderCollection = client
    .db(process.env.DB_NAME)
    .collection(process.env.DB_COLLECT_USER);
  //adding Order 
  app.post('/addOrder', (req, res) => {
    const order = req.body;
    orderCollection.insertOne(order)
    .then((result) => {
        res.send('order added');
      });
   
   
  })
  //Delete item from admin panel
  app.delete('/delete/:id', (req, res) =>
  {
    // const user = req.body.id;
    const id=ObjectID(req.params.id)
    collection.deleteOne({ _id: id })
   .then(result=>{
     console.log(result.deletedCount)
     if(result.deletedCount>0){
       res.send(result.deletedCount)
     }
   })

  
    
})

  //showing Order
  app.get('/order/:email', (req, res) => {
    const email = req.params.email
    console.log(email)
    orderCollection.find({email:email}).toArray((err, documents) => {
      res.send(documents);
    });
   res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      })
  })
  
  
  // product adding
  app.post('/addProduct', (req, res) => {
    const product = req.body;
    console.log(product);
    collection
      .insertOne(product)
      .then((result) => {
        res.send('Hello man');
      });
  });
  //Product Data Share to user
  app.get('/product', (req, res) => {
    collection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  console.log('bd connection ready');
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port);
