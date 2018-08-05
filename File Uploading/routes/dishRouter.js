//When we use next(err) in this file, we are making the error to be handled
// by the error handler in the ap.js

const express = require ('express');
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose');
const authenticate = require('../authenticate');
//authenticate file is imported to make the user access only the specified functionalities

const cors = require('./cors');


//Importing the schema we created in the models folder
const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.options(cors.corsWithOptions, (req, res) =>{
	res.sendStatus(200);
})

//Setting up all the endpoints for the /dishes
.get(cors.cors, (req,res,next) =>{
	//Here we are expecting to get all the dishes, so we need to find all the dishes in DB
	Dishes.find({})
	.populate('comments.author')
	//The populate is used so that the the data from User document is brought in and fetched to dishes
	.then((dishes) =>{
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(dishes);
	},
	(err) =>{
		next(err);
	})
	.catch((err) =>{
		next(err);
	})
})

.post(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin , (req,res,next) =>{
	//It will take the document to be posted from the body of the request
	Dishes.create(req.body)
	.then((dish) =>{
		console.log('Dish Created ', dish);
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(dish);
	},
	(err) =>{
		next(err);
	})
	.catch((err) =>{
		next(err);
	})	
})

.put(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin , (req,res,next) =>{
	res.statusCode = 403;
	res.end('PUT operation not supported on /dishes');
})

.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin , (req,res,next) =>{
	Dishes.remove({})
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



//Setting up all the endpoints for the /dishes/:dishId

dishRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) =>{
	res.sendStatus(200);
})

.get(cors.cors, (req,res,next) =>{
	Dishes.findById(req.params.dishId)
	.populate('comments.author')
	.then((dish) =>{
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(dish);
	},
	(err) =>{
		next(err);
	})
	.catch((err) =>{
		next(err);
	})	

})

.post(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin , (req,res,next) =>{
	res.statusCode = 403;
	res.end('POST operation not supported on /dishes/'+req.params.dishId);
})

.put(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin , (req,res,next) =>{
	Dishes.findByIdAndUpdate(req.params.dishId,{
		$set: req.body
	}, {new: true})
	.then((dish) =>{
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(dish);
	},
	(err) =>{
		next(err);
	})
	.catch((err) =>{
		next(err);
	})

})

.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin , (req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});


//Now we handle the comments


dishRouter.route('/:dishId/comments')
.options(cors.corsWithOptions, (req, res) =>{
	res.sendStatus(200);
})


//Setting up all the endpoints for the /dishes/:dishId/comments
.get(cors.cors, (req,res,next) =>{
	//Here we are expecting to get all the comments for a dish, so we need to find all the comments in DB
	Dishes.findById(req.params.dishId)
	.populate('comments.author')
	.then((dish) =>{
		if(dish != null){
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(dish.comments);
		}
		else{
			err = new Error('Dish '+ req.params.dishId+ ' not found');
			err.status = 404; //statusCode
			return next(err);
		}
	},
	(err) =>{
		next(err);
	})
	.catch((err) =>{
		next(err);
	})
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) =>{
	//It will take the document to be posted from the body of the request
	Dishes.findById(req.params.dishId)
	.then((dish) =>{
		if(dish != null){
			req.body.author = req.user._id;
			dish.comments.push(req.body);
			dish.save()
			.then((dish) =>{
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(dish);
			},(err) =>{
				next(err);
			})
		}
		else{
			err = new Error('Dish '+ req.params.dishId+ ' not found');
			err.status = 404; //statusCode
			return next(err);
		}
	},
	(err) =>{
		next(err);
	})
	.catch((err) =>{
		next(err);
	})	
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) =>{
	res.statusCode = 403;
	res.end('PUT operation not supported on /dishes/' + req.params.dishId + '/comments');
})

.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin , (req,res,next) =>{
	Dishes.findById(req.params.dishId)
	.then((dish) =>{
		if(dish != null){
			for(var i=(dish.comments.length - 1) ; i>=0 ;i-- ){
				dish.comments.id(dish.comments[i]._id).remove();
			}
			dish.save()
			.then((dish) =>{
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(dish);
			},(err) =>{
				next(err);
			})
		}
		else{
			err = new Error('Dish '+ req.params.dishId+ ' not found');
			err.status = 404; //statusCode
			return next(err);
		}
	},
	(err) =>{
		next(err);
	})
	.catch((err) =>{
		next(err);
	})
});



//Setting up all the endpoints for the /dishes/:dishId/comments/:commentId

dishRouter.route('/:dishId/comments/:commentId')
.options(cors.corsWithOptions, (req, res) =>{
	res.sendStatus(200);
})

//We set up a middleware cors.cors ahead of our req & res callback fn
.get(cors.cors, (req,res,next) =>{
	Dishes.findById(req.params.dishId)
	.populate('comments.author')
	.then((dish) =>{
		if(dish != null && dish.comments.id(req.params.commentId) != null){
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(dish.comments.id(req.params.commentId));
		}
		else if(dish == null){
			err = new Error('Dish '+ req.params.dishId+ ' not found');
			err.status = 404; //statusCode
			return next(err);
		}
		else{
			err = new Error('Comment '+ req.params.commentId+ ' not found');
			err.status = 404; //statusCode
			return next(err);
		}
	},
	(err) =>{
		next(err);
	})
	.catch((err) =>{
		next(err);
	})	

})

//We set up a middleware cors.corsWithOptions ahead of our req & res callback fn
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) =>{
	res.statusCode = 403;
	res.end('POST operation not supported on /dishes/'+req.params.dishId +'/comments/'+req.params.commentId);
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) =>{
	Dishes.findById(req.params.dishId)
	.then((dish) =>{

		if(dish != null && dish.comments.id(req.params.commentId) != null){
			//The below if statement checks for the author
			if(dish.comments.id(req.params.commentId).author._id.equals(req.user._id)){
				if(req.body.rating){
					dish.comments.id(req.params.commentId).rating = req.body.rating;
				}
				if(req.body.comment){
					dish.comments.id(req.params.commentId).comment = req.body.comment;
				}
				dish.save()
				.then((dish) =>{
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(dish);
				},(err) =>{
					next(err);
				})
			}
			else{
				err = new Error('Not an author!');
				err.status = 403; //statusCode
				return next(err);
			}
		}
		else if(dish == null){
			err = new Error('Dish '+ req.params.dishId+ ' not found');
			err.status = 404; //statusCode
			return next(err);
		}
		else{
			err = new Error('Comment '+ req.params.commentId+ ' not found');
			err.status = 404; //statusCode
			return next(err);
		}
	},
	(err) =>{
		next(err);
	})
	.catch((err) =>{
		next(err);
	})

})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
	.then((dish) =>{
		
		if(dish != null && dish.comments.id(req.params.commentId) != null){
			//The below if statement checks for the author
			if(dish.comments.id(req.params.commentId).author._id.equals(req.user._id)){
				dish.comments.id(req.params.commentId).remove();
				dish.save()
				.then((dish) =>{
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(dish);
				},(err) =>{
					next(err);
				})
			}
			else{
				err = new Error('Not an author!');
				err.status = 403; //statusCode
				return next(err);
			}
			
		}
		else if(dish == null){
			err = new Error('Dish '+ req.params.dishId+ ' not found');
			err.status = 404; //statusCode
			return next(err);
		}
		else{
			err = new Error('Comment '+ req.params.commentId+ ' not found');
			err.status = 404; //statusCode
			return next(err);
		}
	},
	(err) =>{
		next(err);
	})
    .catch((err) => next(err));
});


module.exports = dishRouter;
