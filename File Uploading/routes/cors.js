const express = require('express');
const cors = require('cors');
const app = express();


//The whitelist contains all the origins that the server is ready to accept
const whitelist = ['http://localhost:3000','https://localhost:3443'];

var corsOptionsDelegate = (req, callback) =>{
    var corsOptions;

    //Checking if the requested origin is present in the whitelist
    if(whitelist.indexOf(req.header('Origin')) !== -1){
        //The below line declares that the original link in the request is present in the whitelist
        corsOptions = {origin: true};
    }
    else{
        corsOptions = {origin: false};
    }
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
//If we need to supply a CORS with specific options, we will be using the below function