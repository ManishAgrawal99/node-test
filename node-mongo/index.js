const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const dboper = require('./operations');

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

    console.log('Connected correctly to the database');

    dboper.insertDocument(db, {"name": "Vadonut", "description":"test"}, "dishes", (result) =>{
    	console.log("Insert Document:\n", result.ops);

    	//We have made the call to find op within the call to insert operation 
    	dboper.findDocuments(db, "dishes", (docs) =>{
    		console.log("Found the Documents: \n", docs);

    		dboper.updateDocument(db , {"name": "Vadonut" }, {"description": "updated test"},
    		 "dishes", (result) =>{
    		 	console.log("Updated Document: \n", result.result);

    		 	dboper.findDocuments(db, "dishes", (docs) =>{
    				console.log("Found the updated Documents: \n", docs);

    				db.dropCollection("dishes", (result) =>{
    					console.log("dropped collection: \n",result);

    					client.close();
    				});
    			});
    		 });
    	});
    });
    

});