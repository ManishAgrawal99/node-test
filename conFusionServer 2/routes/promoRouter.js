const express = require ('express');
const bodyParser = require ('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')


//Setting up all the endpoints for the /promotions
.all((req, res, next) =>{
	res.statusCode = 200;
	res.setHeader('Content-Type','text/plain');
	next();
})

.get((req,res,next) =>{
	res.end("will send all the promotions to you!");
})

.post((req,res,next) =>{
	res.end('Will add the promo: ' + req.body.name +' with details: ' + req.body.description);
})

.put((req,res,next) =>{
	res.statusCode = 403;
	res.end('PUT operation not supported on /promotions');
})

.delete((req,res,next) =>{
	res.end("deleting all the promotions!");
});



//Setting up all the endpoints for the /promotions/:promoId

promoRouter.route('/:promoId')

.get((req,res,next) =>{
	res.end("will send details of the promo: " + req.params.promoId + " to you!");
})

.post((req,res,next) =>{
	res.statusCode = 403;
	res.end('POST operation not supported on /promotions/'+req.params.promoId);
})

.put((req,res,next) =>{
	res.write('Updating the promo: '+req.params.promoId + '\n');
	res.end('will update the promo :'+req.body.name + ' with details '+ req.body.description);
})

.delete((req,res,next) =>{
	res.end("deleting the promo: "+req.params.promoId);
});


module.exports = promoRouter;
