const express = require('express');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j6xnqa4.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {



        const bookCollection = client.db('bookDB').collection('books')
        const categoryCollection = client.db('bookCategoryDB').collection('categories')
        const authorCollection = client.db('popularAuthor').collection('authors')
        const newBookCollection = client.db('newBookDB').collection('newBooks')


        app.post('/books', async (req, res) => {
            const newBook = req.body;
            console.log(newBook);
            const result = await bookCollection.insertOne(newBook);
            res.send(result)
        })

        app.get('/books', async (req, res) => {
            const cursor = bookCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/categories', async (req, res) => {
            const cursor = categoryCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/authors', async (req, res) => {
            const cursor = authorCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/newBooks', async (req, res) => {
            const cursor = newBookCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();





        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('book library server is running')


})


app.listen(port, () => {
    console.log(`book library server is running on port : ${port} `);
})