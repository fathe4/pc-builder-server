const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const objectId = require("mongodb").ObjectId;
require("dotenv").config();
const port = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wanl6.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("PC");
    const categoriesCollection = database.collection("categories");
    const productsCollection = database.collection("products");

    app.get("/categories", async (req, res) => {
      const result = await categoriesCollection.find({}).toArray();
      res.send(result);
    });
    app.get("/products", async (req, res) => {
      const categoryId = req.query.categoryId;
      const result = await productsCollection
        .find(categoryId ? { categoryId } : {})
        .toArray();
      res.send(result);
    });
    app.get("/product/:id", async (req, res) => {
      const productId = new ObjectId(req.params.id);
      const result = await productsCollection.findOne({ _id: productId });
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
