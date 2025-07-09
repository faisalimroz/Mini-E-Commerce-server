const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port =process.env.PORT || 3000

app.use(express.json())
app.use(cors())


const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const uri=`mongodb+srv://${process.env.DB_Name}:${process.env.DB_Password}@cluster0.tort7uo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const database = client.db("qtechdb");
    const productCollection = database.collection("products");
   
    app.get("/products", async (req, res) => {
      try {
        const products = await productCollection.find({}).toArray();
        res.json(products);
      
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch products", error });
      }
    });
  
app.get("/products/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const product = await productCollection.findOne(query);

        if (product) {
          res.send(product);
        } else {
          res.status(404).json({ message: "Product not found" });
        }
      } catch (error) {
        console.error("Failed to fetch product details:", error);
        res.status(500).json({ message: "Failed to fetch product details" });
      }
    });

   
    await client.connect();

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Server Running!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})