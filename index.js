const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2lhfrsa.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function dbConnect() {
    try {
        await client.connect();
        console.log("Database connected");
    } catch (error) {
        console.log(error.name, error.message);
    }
}
dbConnect();

const Services = client.db("reviewService").collection("services");
const Reviews = client.db("reviewService").collection("reviews");

app.get("/services", async (req, res) => {
    try {
        const query = req.query.limit;
        const cursor = Services.find({});

        if (query == 3) {
            const services = await cursor.limit(3).toArray();
            res.send({
                success: true,
                message: "Successfully got the data",
                data: services,
            });
        } else {
            const services = await cursor.toArray();
            res.send({
                success: true,
                message: "Successfully got the data",
                data: services,
            });
        }

    } catch (error) {
        console.log(error.name, error.message);
        res.send({
            success: false,
            error: error.message,
        });
    }
});

app.get("/services/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const service = await Services.findOne(query);

        res.send({
            success: true,
            data: service,
        });
    } catch (error) {
        res.send({
            success: false,
            error: error.message,
        });
    }
});


app.post("/reviews", async (req, res) => {
    try {
        const review = req.body;
        const result = await Reviews.insertOne(review);

        res.send({
            success: true,
            data: result,
        });
    } catch (error) {
        res.send({
            success: false,
            error: error.message,
        });
    }
});





app.get('/', (req, res) => {
    res.send('photo graphy server successfully runnig')
})

app.listen(port, () => {
    console.log(`Photography server running on ${port}`);
})


