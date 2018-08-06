//When we use next(err) in this file, we are making the error to be handled
// by the error handler in the ap.js

const express = require ('express');
const bodyParser = require ('body-parser');
const authenticate = require('../authenticate');
//authenticate file is imported to make the user access only the specified functionalities
const multer = require('multer');

const cors = require('./cors');

//Configuring multer to accept files
const storage = multer.diskStorage({
    //Here we can set the destination of file storage bu giving dest: file location
    destination: (req, file, cb) =>{
        cb(null, 'public/images');
    },
    filename: (req, file, cb) =>{
        //file.originalname stores the image by the same name as the user have uploaded
        cb(null, file.originalname);
    }
});

const imageFileFilter = (req, file, cb) =>{
    //The function sets a filter on the types of file the server will want to accept 
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error('You can upload only image files'), false);
    }
    cb(null, true);
}; 

//It sets the storage type and file filter as they are defined above
const upload = multer({ storage: storage, fileFilter: imageFileFilter});

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

//Setting Up the end points
//
//-------------------------
//Uploading available only to the admin
uploadRouter.route('/')
.options(cors.corsWithOptions, (req, res) =>{
	res.sendStatus(200);
})


.get(cors.cors, authenticate.verifyUser,authenticate.verifyAdmin , (req,res,next) =>{
	res.statusCode = 403;
	res.end('GET operation not supported on /imageUpload');
})

.post(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,upload.single('imageFile'), (req,res) =>{
    //upload.single restricts the user to upload only a single file
    res.statusCode =200;
    res.setHeader('Content-Type', 'application/json');
    //We will be sending back the file received in req.file
    //The req.file also holds the location of the file
    res.json(req.file);

})

.put(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin , (req,res,next) =>{
	res.statusCode = 403;
	res.end('PUT operation not supported on /imageUpload');
})

.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin , (req,res,next) =>{
	res.statusCode = 403;
	res.end('DELETE operation not supported on /imageUpload');
})


module.exports = uploadRouter;