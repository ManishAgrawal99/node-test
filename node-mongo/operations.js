const assert = require ('assert');

//From here we will be exporting several methods
//document in the params is the one that we want to insert in the collection of the db
//callback fn will be called once the operation is completed
exports.insertDocument = (db, document, collection, callback) =>{
	const coll = db.collection(collection);
	coll.insert(document, (err, result) =>{
		assert.equal(err, null);
		console.log("inserted " + result.result.n + " documents into the collection");
		callback(result);
	});
};

//collection is the one in which we will be searching
exports.findDocuments = (db, collection, callback) =>{
	const coll = db.collection(collection);
	coll.find({}).toArray((err, docs) =>{
		assert.equal(err, null);
		callback(docs);
	});
};



exports.removeDocument = (db, document, collection, callback) =>{
	const coll = db.collection(collection);
	coll.deleteOne(document, (err, result) =>{
		assert.equal(err, null);
		console.log("Removed the document ", document);
		callback(result);
	});
}


exports.updateDocument = (db, document, update, collection, callback) =>{
	const coll = db.collection(collection);
	coll.updateOne(document, { $set: update}, null, (err, result) =>{
		assert.equal(err, null);
		console.log("updated the document with ",update);
		callback(result);
	});
};