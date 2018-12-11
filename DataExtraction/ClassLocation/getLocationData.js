const rp = require('request-promise');
const querystring = require('querystring');
var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('../Data/Processed/LocationsOfClasses.json'));
//obj = JSON.parse(fs.readFileSync('Data/NotFoundLocation.json', 'utf8'));

//var FilteredObject = JSON.parse(fs.readFileSync('Data/LocationData.json', 'utf8'));
var FilteredObject = [];
var NotFoundLocation = [];
var ErrorList = [];
var options = {
    uri: "http://maps.ntu.edu.sg/a/search?",
    json: true // Automatically parses the JSON string in the response
    //resolveWithFullResponse: true
};

var done = [false,false,false];
var currentNumbering = 0;
var objectLength = obj.length;

for(index in obj){
	var URLEncodedLocation = querystring.stringify({ q: obj[index]});
	options.uri = "http://maps.ntu.edu.sg/a/search?" + URLEncodedLocation;
	rp(options).then(function (serverResponse) {
			//console.log(serverResponse)
			currentNumbering++;
			console.log(currentNumbering + " of " + objectLength)
	        if(serverResponse.status == 0){
	        	//console.log("Location Not Found: " + serverResponse.what.name);
	        	NotFoundLocation.push(serverResponse.what.name);
	        	console.log(serverResponse.what.name);
	        }else if(serverResponse.status == 1){
	        	var name = serverResponse.what.name;
	        	var responseObject = {};
	        	responseObject[name] = serverResponse.what;
	        	FilteredObject.push(responseObject)
	        	//console.log(FilteredObject)
	        }else{
	        	console.log(serverResponse)
	        }
    })
    .catch(function (err) {
        //ErrorList.push(err);
        // API call failed...
        console.log(err)
    });
}


var intervalID = -1;
function saveFunction() {
    // all the stuff you want to happen after that pause
    if(currentNumbering == objectLength){
    	fs.writeFile("../Data/Processed/LocationData.json", JSON.stringify(FilteredObject), function(err) {
		    if(err) {
		        return console.log(err);
		    }else{
		    	console.log("The Location Data was saved!");
		    }
		    done[0] = true;
		}); 

		fs.writeFile("../Data/Logs/NotFoundLocation.json", JSON.stringify(NotFoundLocation), function(err) {
		    if(err) {
		        return console.log(err);
		    }else{
		    	console.log("The Unfound Locations was saved!");
		    }
		    done[1] = true;
		}); 

		fs.writeFile("../Data/Logs/ErrorList.json", JSON.stringify(ErrorList), function(err) {
		    if(err) {
		        return console.log(err);
		    }else{
		    	console.log("The Error List was saved!");
		    }
		    done[2] = true;
		}); 
    }
    if(done[0]&&done[1]&&done[2]){
    	clearInterval(intervalID);
    }
}
// call the rest of the code and have it execute after 3 seconds
intervalID = setInterval(saveFunction, 3000);









