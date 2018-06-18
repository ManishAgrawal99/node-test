//callback is a function that is supplied in when the module is called
module.exports = (x,y,callback) =>{
	if (x<=0 || y<=0) {
		setTimeout(() => 
			callback(new Error("rectangle dimensions must be greater than 0"),
				null),
			2000);//The program will wait for 2000ms as delay for getting a callback from other side
		//console.log('rectangle dimensions must be greater than 0');
	}
	else{
		setTimeout(() => 
			callback(null,//Since the case is now valid we do not want any error
				{//Passing an object with two functions
					perimeter: () => (2*(x+y)), //No params needed since they take
					area: () => (x*y)			//values of x & y from earlier param
				}),
			2000);//The program will wait for 2000ms as delay for getting a callback from other side
	}
}







