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
        const borrowBookCollection = client.db('borrowBookDB').collection('borrowBooks')


        app.post('/books', async (req, res) => {
            const newBook = req.body;
            console.log(newBook);
            const result = await bookCollection.insertOne(newBook);
            res.send(result)
        })

        app.post('/borrowbooks', async (req, res) => {
            const borrowBooksDetails = req.body;
            // delete borrowBooksDetails._id
            const result = await borrowBookCollection.insertOne(borrowBooksDetails);
            res.send(result);
        });

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

        app.get('/books/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await bookCollection.findOne(query);
            res.send(result)
        })

        app.get('/borrowbooks', async (req, res) => {
            const cursor = borrowBookCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })



        app.put('/books/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatebooks = req.body;
            const books = {
                $set: {
                    name: updatebooks.name,
                    author: updatebooks.author,
                    category: updatebooks.category,
                    quantity: updatebooks.quantity,
                    rating: updatebooks.rating,
                    description: updatebooks.description,
                    image: updatebooks.image,
                }
            }
            const result = await bookCollection.updateOne(filter, books, options);

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