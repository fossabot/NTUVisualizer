var fs = require('fs');
var FinalData = JSON.parse(fs.readFileSync('../Data/FinalData.json', 'utf8'));

var GeoJSONData = [];

for(key in FinalData){

	var GeoJSONObject = {
	    "type": "Feature",
	    "properties": {
	        "name": key
	    },
	    "geometry": {
	        "type": "Point",
	        "coordinates": FinalData["" + key]
	    }
	};

	var lat = GeoJSONObject["geometry"]["coordinates"][0];
	GeoJSONObject["geometry"]["coordinates"][0] = GeoJSONObject["geometry"]["coordinates"][1];
	GeoJSONObject["geometry"]["coordinates"][1] = lat;

	GeoJSONData.push(GeoJSONObject);
}


function saveFunction() {
    // all the stuff you want to happen after that pause

	fs.writeFile("../Data/GeoJSONData.json", JSON.stringify(GeoJSONData), function(err) {
	    if(err) {
	        return console.log(err);
	    }else{
	    	console.log("The GeoJSONData Data is saved!");
	    }
	}); 
}

// call the rest of the code and have it execute after 3 seconds
saveFunction();




