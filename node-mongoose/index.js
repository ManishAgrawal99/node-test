const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url, {
    //useMongoClient: true
});

connect.then((db) => {

    
    console.log('Connected correctly to server');

    var newDish = Dishes({
        name: 'Uthappizza',
        description: 'test'
    });

    newDish.save()
        .then((dish) => {
            console.log("\nCreated the document:\n");
            console.log(dish);
            console.log("\n\n");

            return Dishes.find({}).exec();
        })
        .then((dishes) => {
            console.log("\nFound the document:\n");
            console.log(dishes);
            console.log("\n\n");

            //return db.collection('dishes').drop();
            return Dishes.remove({});
        })
        .then(() => {
            //return db.close();
            return mongoose.disconnect()
        })
        .catch((err) => {
            console.log(err);
        });

}); 