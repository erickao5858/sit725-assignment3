const MongoClient = require('mongodb').MongoClient;

//connection
const uri = "mongodb+srv://dbTest:dbTest@study.mqzkl.mongodb.net/reckoning?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });

let TestCollection;


const startDB = () => {
    client.connect((err,db) => {
        TestCollection = client.db("Test").collection("TestCollection");
        if(!err){
            console.log('Database Connected')
        }
    });
}



module.exports={
    startDB:startDB,
}