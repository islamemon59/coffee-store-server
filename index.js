require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.anxcgnq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)

    const coffeesCollection = client.db("coffeesdb").collection("coffees");
    const userCollection = client.db("coffeesdb").collection("users");

    app.get("/coffees", async (req, res) => {
      const cursor = coffeesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await coffeesCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    app.post("/coffees", async (req, res) => {
      const newCoffee = req.body;
      const result = await coffeesCollection.insertOne(newCoffee);
      res.send(result);
      console.log("New coffee hit the database", newCoffee);
    });

    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeesCollection.deleteOne(query);
      res.send(result);
    });

    //this is users data center

    // get user data
    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    //post user data
    app.post("/users", async (req, res) => {
      const userData = req.body;
      console.log(userData);
      const result = await userCollection.insertOne(userData);
      res.send(result);
    });

    app.patch("/users", async (req, res) => {
      const {email, lastSignInTime} = req.body;
      const filter = {email: email}
      const updatedDoc = {
        $set: {
          lastSignInTime : lastSignInTime,
        }
      }
      const result = await userCollection.updateOne(filter, updatedDoc)
      res.send(result)
    })

    //delete user from database
    app.delete("/users/:id", async (req, res)=> {
      const id = req.params.id;
      console.log(id);
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.deleteOne(query)
      res.send(result)
    })

  } finally {
    
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Make server hotter with Coffee");
});

app.listen(port, () => {
  console.log("Our server running in this port: ", port);
});
