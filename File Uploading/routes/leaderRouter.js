//When we use next(err) in this file, we are making the error to be handled
// by the error handler in the app.js

const express = require ('express');
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose');
const authenticate = require('../authenticate');

//Importing the schema we created in the models folder
const Leaders = require('../models/leaders');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')


//Setting up all the endpoints for the /leaders
.get((req,res,next) =>{
	//Here we are expecting to get all the leaders, so we need to find all the leaders in DB
	Leaders.find({})
	.then((leaders) =>{
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(leaders);
	},
	(err) =>{
		next(err);
	})
	.catch((err) =>{
		next(err);
	})
})

.post(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) =>{
	//It will take the document to be posted from the body of the request
	Leaders.create(req.body)
	.then((leader) =>{
		console.log('Leader Created ', leader);
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(leader);
	},
	(err) =>{
		next(err);
	})
	.catch((err) =>{
		next(err);
	})	
})

.put(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) =>{
	res.statusCode = 403;
	res.end('PUT operation not supported on /leaders');
})

.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) =>{
	Leaders.remove({})
	.then((resp) =>{
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(resp);
	},
	(err) =>{
		next(err);
	})
	.catch((err) =>{
		next(err);
	})
});



//Setting up all the endpoints for the /leaders/:leaderId

leaderRouter.route('/:leaderId')

.get((req,res,next) =>{
	Leaders.findById(req.params.leaderId)
	.then((leader) =>{
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(leader);
	},
	(err) =>{
		next(err);
	})
	.catch((err) =>{
		next(err);
	})	

})

.post(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) =>{
	res.statusCode = 403;
	res.end('POST operation not supported on /leaders/'+req.params.leaderId);
})

.put(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) =>{
	Leaders.findByIdAndUpdate(req.params.leaderId,{
		$set: req.body
	}, {new: true})
	.then((leader) =>{
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(leader);
	},
	(err) =>{
		next(err);
	})
	.catch((err) =>{
		next(err);
	})

})

.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = leaderRouter;
