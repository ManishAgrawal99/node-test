const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

//The url will have the link to the local conFusion named database
const url = 'mongodb://localhost:27017/conFusion';

//Earlier versions used to return db but newer versions return client
//We try to connect to the above url
MongoClient.connect(url, (err, client) => {

    assert.equal(err,null);
    //We check if there is no error and continue

    console.log('Connected correctly to server');

    //Added this line because now the connect returned client and we get db from client
    var db = client.db('conFusion');
    const collection = db.collection("dishes");

    //A document is added to the collection
    collection.insertOne({"name": "Uthappizza", "description": "test"},
    (err, result) => {
        assert.equal(err,null);

        console.log("After Insert:\n");
        console.log(result.ops);

        //Empty {} finds every document in collection
        collection.find({}).toArray((err, docs) => {
            assert.equal(err,null);
            
            console.log("Found:\n");
            console.log(docs);

            //It drops the collection
            db.dropCollection("dishes", (err, result) => {
                assert.equal(err,null);

                client.close();
                //Earlier it used to be db.close(); but now after the update it is client.close();
            });
        });
    });

});