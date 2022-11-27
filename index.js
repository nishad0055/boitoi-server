const express = require('express');
const cors = require('cors');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
 require('dotenv').config()


const port = process.env.PORT || 5000

//middleware
app.use(express.json())
app.use(cors())


app.get('/', (req, res)=>{
    res.send('book resale server')
})





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tbf6iah.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const categoryCollection = client.db('bookReSale').collection('AllCategory')
        const productCollection = client.db('bookReSale').collection('Products')
        const bookedCollection = client.db('bookReSale').collection('BookedItem')
        const usersCollection = client.db('bookReSale').collection('Users')


        //user oder
        app.get('/bookedorder', async(req, res)=>{
            const email = req.query.email
            const query = {email:email}
            const bookings = await bookedCollection.find(query).toArray()
            res.send(bookings)
        })

        //seller_add_product_get

        app.get('/seller-added-product', async(req, res)=>{
            const email = req.query.email
            const query = {email: email }
            const sellerAddedProduct = await productCollection.find(query).toArray()
            res.send(sellerAddedProduct)
        })

        //admin user_deleted
        app.delete('/users/:id', async(req, res)=>{
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const result = await usersCollection.deleteOne(filter)
            res.send(result)
        })


        //seller_deleted_product
        app.delete('/products/:id', async(req, res)=>{

            const id = req.params.id;
            const filter = { _id: ObjectId(id)}
            const result = await productCollection.deleteOne(filter)
            res.send(result)

        })

    //make admin
      app.put('/allusers/admin/:id', async(req, res)=>{
         const id = req.params.id;
         const filter = {_id: ObjectId(id)}
         const option = {upsert:true}
         updatedDoc = {
            $set: {
                role: 'admin'
            }
         }
         const result = await usersCollection.updateOne(filter, updatedDoc, option)
         res.send(result)
      })
  //verify seller
      app.put('/allsellers/:id', async(req, res)=>{
         const id = req.params.id;
         const filter = { _id: ObjectId(id) }
         const option = { upsert:true}
         updatedDoc = {
            $set: {
                Status: 'verified'
            }
         }
         const result = await usersCollection.updateOne(filter, updatedDoc, option)
         res.send(result)
      } )
        
  //admin routes
    app.get('/allusers/admin/:email', async(req, res)=>{
        const email = req.params.email 
        const query = {email}
        const user = await usersCollection.findOne(query);
        res.send( {isAdmin: user?.role === 'admin'})
        
    } )


     //seller route
      app.get('/allsellers/seller/:email', async(req, res) =>{
        const email = req.params.email 
        const query = {email}
        const user = await usersCollection.findOne(query)
        res.send({isSeller: user?.role === 'seller'})
      })

    //user_route
    app.get('/allusers/user/:email', async(req, res)=>{
        const email = req.params.email
        const query = { email }
        const user = await usersCollection.findOne(query)
        res.send( {isUser: user?.role === 'user'})
    })

    //verify route 
    // app.get('/allsellers/verify/:email', async(req, res)=>{
    //     const email = req.params.email
    //     const query = {email}
    //     const user = await usersCollection.findOne(query)
    //     res.send({isVerified: user?.Status  === 'verified'})
    // })

    //display_user
     app.get('/allusers', async(req, res)=>{
        
        const query = { role:'user' }
        const alluser = await usersCollection.find(query).toArray()
        res.send(alluser)
     })
    
     //display_seller
     app.get('/allsellers', async(req, res)=>{
        const query = { role: 'seller'}
        const allseller = await usersCollection.find(query).toArray()
        res.send(allseller)
     })

     //user data post
      app.post('/users', async(req, res)=>{

        const query = req.body;
        const users = await  usersCollection.insertOne(query)
        res.send(users)

      })

        //user_booking
        app.post('/bookedItem', async(req, res)=>{
            const query = req.body;
            const booked = await bookedCollection.insertOne(query)
            res.send(booked)
        })

        //latest upload product sorting
        app.get('/allproduct', async(req, res)=>{
            const query = {}
            const products = await productCollection.find(query).sort({_id:-1}).limit(6).toArray()
            res.send(products)

        })

        //Product_add
        app.post('/products', async(req, res)=>{
            const query = req.body;
            const products = await productCollection.insertOne(query)
            res.send(products)
        })
         

        //category_wise_product_sort
        app.get('/category/:id' , async(req, res)=>{
            const id = req.params.id
            const query = {categoryId:id}
            const product = await productCollection.find(query).toArray()
            res.send(product)
        })

        //category_load
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