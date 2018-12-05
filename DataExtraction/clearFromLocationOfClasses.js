const rp = require('request-promise');
const querystring = require('querystring');
var fs = require('fs');
var FilteredObject = JSON.parse(fs.readFileSync('Data/LocationData.json', 'utf8'));
var ReferenceObject = JSON.parse(fs.readFileSync('Data/LocationsOfClasses.json', 'utf8'));
var UnclearedObject = JSON.parse(fs.readFileSync('Data/NotFoundLocation.json', 'utf8'));

//var i = 0;
//access array of LocationData
for (var i in FilteredObject) {
  //Access Key Of LocationData
  for (var key in FilteredObject[i]) {
	    if (FilteredObject[i].hasOwnProperty(key)) {
	        //Iterate LocationOfClasses
	        for(referenceIndex in ReferenceObject){
				if(ReferenceObject[referenceIndex] == key){
					ReferenceObject.splice( referenceIndex, 1 );
					//console.log(key)
					break;
				}
			}
	    }
	}
}


//return;

var intervalID = -1;
function saveFunction() {
    // all the stuff you want to happen after that pause
    	fs.writeFile("Data/LocationData.json", JSON.stringify(FilteredObject), function(err) {
		    if(err) {
		        return console.log(err);
		    }else{
		    	console.log("The Location Data was saved!");
		    }
		}); 

		fs.writeFile("Data/LocationsOfClasses.json", JSON.stringify(ReferenceObject), function(err) {
		    if(err) {
		        return console.log(err);
		    }else{
		    	console.log("The ReferenceObject Locations was saved!");
		    }
		}); 
    
}
saveFunction();
// call the rest of the code and have it execute after 3 seconds
//intervalID = setInterval(saveFunction, 3000);









