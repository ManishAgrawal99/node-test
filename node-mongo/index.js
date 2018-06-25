const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const dboper = require('./operations');

//The url will have the link to the local conFusion named database
//Not necessary to give the name of the database /conFusion in end
const url = 'mongodb://localhost:27017/conFusion';

//Earlier versions used to return db but newer versions return client
//We try to connect to the above url
MongoClient.connect(url).then((client) => {

    //assert.equal(err,null);
    //We check if there is no error and continue

    console.log('Connected correctly to server');

    //Added this line because now the connect returned client and we get db from client
    var db = client.db('conFusion');

    console.log('Connected correctly to the database');

    dboper.insertDocument(db, {"name": "Vadonut", "description":"test"}, "dishes")
    .then((result) =>{
    	console.log("Insert Document:\n", result.ops);

    	//We have made the call to find op within the call to insert operation 
    	return dboper.findDocuments(db, "dishes");
    })

    .then((docs) =>{
    	console.log("Found the Documents: \n", docs);

    	return dboper.updateDocument(db , {"name": "Vadonut" }, {"description": "updated test"},
    		 "dishes");
	})
    	
    .then((result) =>{
    	console.log("Updated Document: \n", result.result);

    	return dboper.findDocuments(db, "dishes");
    })
    	
	.then((docs) =>{
    	console.log("Found the updated Documents: \n", docs);

    	return db.dropCollection("dishes");
    })

    .then((result) =>{
    	console.log("dropped collection: \n",result);

    	return client.close();
    })
    .catch((err) => {console.log(err);});
    

}, (err) => {console.log(err);})
.catch((err) => {console.log(err);});