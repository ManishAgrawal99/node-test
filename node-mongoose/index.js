const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url, {
    //useMongoClient: true
});

connect.then((db) => {

    
    console.log('Connected correctly to server');

    Dishes.create({
        name: 'Uthappizza',
        description: 'test'
    })
        .then((dish) => {
            console.log("\nCreated the document:\n");
            console.log(dish);
            console.log("\n\n");

            return Dishes.findByIdAndUpdate(dish._id,{
                $set: { description: "Updated test"}
            },{
                new : true
            })
            .exec();
        })
        .then((dish) => {
            console.log("\nFound the document:\n");
            console.log(dish);
            console.log("\n\n");
            dish.comments.push({
                rating: 5,
                comment: "I am a genius",
                author: "Tony Stark"
            });

            return dish.save();
        })
        .then((dish) =>{
            console.log("\n\nTony Stark added a comment");
            console.log(dish);

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