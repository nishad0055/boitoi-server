const express = require('express');
const cors = require('cors');
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
 require('dotenv').config()


const port = process.env.PORT || 5000

//middleware
app.use(express.json())
app.use(cors())


app.get('/', (req, res)=>{
    res.send('book resale server')
})





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tbf6iah.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const categoryCollection = client.db('bookReSale').collection('AllCategory')
        const productCollection = client.db('bookReSale').collection('Products')
        const bookedCollection = client.db('bookReSale').collection('BookedItem')

        app.post('/bookedItem', async(req, res)=>{
            const query = req.body;
            const booked = await bookedCollection.insertOne(query)
            res.send(booked)
        })


        app.post('/products', async(req, res)=>{
            const query = req.body;
            const products = await productCollection.insertOne(query)
            res.send(products)
        })
         
        app.get('/category/:id' , async(req, res)=>{
            const id = req.params.id
            const query = {categoryId:id}
            const product = await productCollection.find(query).toArray()
            res.send(product)
        })

        app.get('/category', async(req, res)=>{

            const query = {}
            const result = await categoryCollection.find(query).toArray()
            res.send(result)

        })
    }
    finally{

    }
}
run().catch(e=>console.log(e))











app.listen(port, ()=>{
    console.log(`Book resale server is running on port ${port}`)
})