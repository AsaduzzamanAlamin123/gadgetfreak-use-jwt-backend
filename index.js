const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { query } = require('express');

require('dotenv').config()

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mycluster.k9hdqqy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    
    try{
        await client.connect();
    console.log('db connected');
    const productCollection = client.db("gadgetFreak").collection("products");

    app.post('/login', (req , res)=>{
        const email = req.body;
        const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET);
        
        res.send({token})

    })
    app.get('/products', async(req , res)=>{
        const query = {};
        const products = await productCollection.find(query).toArray()
        res.send(products);
    })

    // app.post('/addorder')


    app.post('/uploadpd', async(req , res)=>{
        const product = req.body;
        const tokenInfo = req.headers.authoraization;
       
        const [email , accessToken]=  tokenInfo.split(" ");
        const decoded = verifyToken(accessToken);
        console.log(decoded, decoded.email);

        if(email ===  decoded.email){
         const result = await productCollection.insertOne(product);
        res.send({success:'product upload successfully'})

        }
        else{
            res.send({unsuccess:'unauthorize access'})
        }
        


    })

    }
    finally{

    }

}
run().catch(console.dir);



app.get('/', (req , res)=>{
    res.send('running my server');
})
app.listen(port , (req ,res)=>{
    console.log('my server run id port no',port);
})
// dbuser2
// Xrn4QxLcf827Dxfz
// json web token generate secret key
// json wev token serach and chk token

function verifyToken(token){
    let email;
    // verify a token symmetric - synchronous
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
        if(err){
            email='invalid email'
        }
        if(decoded){
            console.log(decoded);
            
            email=decoded;
        }
      });
      return email;

}