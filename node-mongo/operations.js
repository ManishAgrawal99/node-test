const assert = require ('assert');

//From here we will be exporting several methods
//document in the params is the one that we want to insert in the collection of the db
//callback fn will be called once the operation is completed
exports.insertDocument = (db, document, collection, callback) =>{
	const coll = db.collection(collection);
	return coll.insert(document);
};

//collection is the one in which we will be searching
exports.findDocuments = (db, collection, callback) =>{
	const coll = db.collection(collection);
	return coll.find({}).toArray();
};



exports.removeDocument = (db, document, collection, callback) =>{
	const coll = db.collection(collection);
	return coll.deleteOne(document);
};


exports.updateDocument = (db, document, update, collection, callback) =>{
	const coll = db.collection(collection);
	return coll.updateOne(document, { $set: update}, null);
};