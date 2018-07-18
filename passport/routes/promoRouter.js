//When we use next(err) in this file, we are making the error to be handled
// by the error handler in the app.js

const express = require ('express');
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose');
const authenticate = require('../authenticate');

//Importing the schema we created in the models folder
const Promotions = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')


//Setting up all the endpoints for the /promotions
.get((req,res,next) =>{
	//Here we are expecting to get all the promotions, so we need to find all the promotions in DB
	Promotions.find({})
	.then((promotions) =>{
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(promotions);
	},
	(err) =>{
		next(err);
	})
	.catch((err) =>{
		next(err);
	})
})

.post(authenticate.verifyUser, (req,res,next) =>{
	//It will take the document to be posted from the body of the request
	Promotions.create(req.body)
	.then((promotion) =>{
		console.log('Promotion Created ', promotion);
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(promotion);
	},
	(err) =>{
		next(err);
	})
	.catch((err) =>{
		next(err);
	})	
})

.put(authenticate.verifyUser, (req,res,next) =>{
	res.statusCode = 403;
	res.end('PUT operation not supported on /promotions');
})

.delete(authenticate.verifyUser, (req,res,next) =>{
	Promotions.remove({})
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



//Setting up all the endpoints for the /promotions/:promoId

promoRouter.route('/:promoId')

.get((req,res,next) =>{
	Promotions.findById(req.params.promoId)
	.then((promo) =>{
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(promo);
	},
	(err) =>{
		next(err);
	})
	.catch((err) =>{
		next(err);
	})	

})

.post(authenticate.verifyUser, (req,res,next) =>{
	res.statusCode = 403;
	res.end('POST operation not supported on /promotions/'+req.params.promoId);
})

.put(authenticate.verifyUser, (req,res,next) =>{
	Promotions.findByIdAndUpdate(req.params.promoId,{
		$set: req.body
	}, {new: true})
	.then((promo) =>{
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(promo);
	},
	(err) =>{
		next(err);
	})
	.catch((err) =>{
		next(err);
	})

})

.delete(authenticate.verifyUser, (req, res, next) => {
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = promoRouter;
