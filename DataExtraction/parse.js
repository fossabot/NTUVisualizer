var fs = require('fs');
const path = require('path');
var obj = JSON.parse(fs.readFileSync('../Data/Raw/ClassScheldule/2018;2.json'));

// Break down by ending time to diff file
// Find out last time for class
// Get list of all locations of class
// Get coordinates of all class

var DaysOfClasses = [];
var ClassObj = {};
var TypesOfClasses = [];
var LocationsOfClasses = [];

//Iterate Mod
for (var key in obj) {
        //console.log(key + " -> " + obj[key]);
        //List of Indexes within a mod
        var sessions = obj[key]["modSessions"];
        //iterate index
        for (var index = 0; index < sessions.length; index++) {
		    //console.log(indexes[index]["details"])
		    //List of class within an index within a mod
		    var classArray = sessions[index];
		    // for (var classindex = 0; classindex < classArray.length; classindex++) {

		    	if(!TypesOfClasses.includes(sessions[index]["type"])){
		    		TypesOfClasses.push(sessions[index]["type"]);
		    	}

		    	if(!DaysOfClasses.includes(sessions[index]["day"])){
		    		DaysOfClasses.push(sessions[index]["day"]);
		    		ClassObj[sessions[index]["day"]] = []
		    	}

		    	if(!LocationsOfClasses.includes(sessions[index]["venue"]) && sessions[index]["venue"] != "" 
		    		&& sessions[index]["venue"] != "ONLINE"){
		    		LocationsOfClasses.push(sessions[index]["venue"]);
		    	}

	    		classArray["ModCode"] = key;
	    		classArray["ModName"] = obj[key]["modTitle"];
	    		classArray["location"] = classArray["venue"];
	    		delete classArray["venue"]
	    		classArray["remarks"] = classArray["remark"];
	    		delete classArray["remark"]
	    		var timeArray = classArray["time"].split("-")
	    		classArray["time"] = { 
	    			'start': classArray["time"].split("-")[0], 
		    		'end': classArray["time"].split("-")[1], 
		    		'full': classArray["time"]
		    	};



		    	ClassObj[sessions[index]["day"]].push(classArray);

			// }
		}
}

for (var key in ClassObj) {
	
	var numberOfKeys = Object.keys(ClassObj).length;
    if (ClassObj.hasOwnProperty(key)) {

        if(key == ""){
			key = "None"
		}
		var keyName=key[0].toUpperCase() + key.substr(1).toLowerCase()
		fs.existsSync("../Data/Web/Classes/"+keyName) || fs.mkdirSync("../Data/Web/Classes/"+keyName);
		var iterationNumber = 0;
        fs.writeFile("../Data/Web/Classes/" + keyName + "/classList.json", JSON.stringify(ClassObj[key]), function(err) {
		    if(err) {
		        return console.log(err);
		    }
	    	iterationNumber++;
		    if(iterationNumber == numberOfKeys){
		    	console.log("The " + numberOfKeys + " days of Classes was saved!");

		    }
		}); 
    }
}

fs.writeFile("../Data/Processed/TypesOfClasses.json", JSON.stringify(TypesOfClasses), function(err) {
    if(err) {
        return console.log(err);
    }else{
    	console.log("The Types Of Classes was saved!");
    }
    
}); 

fs.writeFile("../Data/Processed/LocationsOfClasses.json", JSON.stringify(LocationsOfClasses), function(err) {
    if(err) {
        return console.log(err);
    }else{
    	console.log("The Locations Of Classes was saved!");
    }
    
}); 

fs.writeFile("../Data/Processed/DaysOfClasses.json", JSON.stringify(DaysOfClasses), function(err) {
    if(err) {
        return console.log(err);
    }else{
    	console.log("The Days Of Classes Of Classes was saved!");
    }
    
}); 
