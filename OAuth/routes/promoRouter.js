//When we use next(err) in this file, we are making the error to be handled
// by the error handler in the app.js

const express = require ('express');
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose');
const authenticate = require('../authenticate');

const cors = require('./cors');

//Importing the schema we created in the models folder
const Promotions = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.options(cors.corsWithOptions, (req, res) =>{
	res.sendStatus(200);
})

//Setting up all the endpoints for the /promotions
.get(cors.cors, (req,res,next) =>{
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

.post(cors.corsWithOptions, authenticate.verifyUser ,authenticate.verifyAdmin ,(req,res,next) =>{
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

.put(cors.corsWithOptions, authenticate.verifyUser ,authenticate.verifyAdmin ,(req,res,next) =>{
	res.statusCode = 403;
	res.end('PUT operation not supported on /promotions');
})

.delete(cors.corsWithOptions, authenticate.verifyUser ,authenticate.verifyAdmin , (req,res,next) =>{
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
.options(cors.corsWithOptions, (req, res) =>{
	res.sendStatus(200);
})

.get(cors.cors, (req,res,next) =>{
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

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin , (req,res,next) =>{
	res.statusCode = 403;
	res.end('POST operation not supported on /promotions/'+req.params.promoId);
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin , (req,res,next) =>{
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

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin , (req, res, next) => {
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = promoRouter;
