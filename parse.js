var fs = require('fs');
const path = require('path');
var obj = JSON.parse(fs.readFileSync('Data/2018_1_data.json', 'utf8'));

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
    if (obj.hasOwnProperty(key)) {
        //console.log(key + " -> " + obj[key]);
        //List of Indexes within a mod
        var indexes = obj[key]["index"];
        //iterate index
        for (var index = 0; index < indexes.length; index++) {
		    //console.log(indexes[index]["details"])
		    //List of class within an index within a mod
		    var classArray = indexes[index]["details"];
		    for (var classindex = 0; classindex < classArray.length; classindex++) {

		    	if(!TypesOfClasses.includes(classArray[classindex]["type"])){
		    		TypesOfClasses.push(classArray[classindex]["type"]);
		    	}

		    	if(!DaysOfClasses.includes(classArray[classindex]["day"])){
		    		DaysOfClasses.push(classArray[classindex]["day"]);
		    		ClassObj[classArray[classindex]["day"]] = []
		    	}

		    	if(!LocationsOfClasses.includes(classArray[classindex]["location"]) && classArray[classindex]["location"] != "" 
		    		&& classArray[classindex]["location"] != "ONLINE"){
		    		LocationsOfClasses.push(classArray[classindex]["location"]);
		    	}

	    		classArray[classindex]["ModCode"] = key;
	    		classArray[classindex]["ModName"] = obj[key]["name"];
		    	ClassObj[classArray[classindex]["day"]].push(classArray[classindex]);

			}
		}
    }
}

for (var key in ClassObj) {
	var keyName = key;
	var numberOfKeys = Object.keys(ClassObj).length;
    if (ClassObj.hasOwnProperty(key)) {
        if(keyName == ""){
			keyName = "NO"
		}
		fs.existsSync("Data/ClassList/"+keyName) || fs.mkdirSync("Data/ClassList/"+keyName);
		var iterationNumber = 0;
        fs.writeFile("Data/ClassList/" + keyName + "/classList.json", JSON.stringify(ClassObj[key]), function(err) {
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

fs.writeFile("Data/TypesOfClasses.json", JSON.stringify(TypesOfClasses), function(err) {
    if(err) {
        return console.log(err);
    }else{
    	console.log("The Types Of Classes was saved!");
    }
    
}); 

fs.writeFile("Data/LocationsOfClasses.json", JSON.stringify(LocationsOfClasses), function(err) {
    if(err) {
        return console.log(err);
    }else{
    	console.log("The Locations Of Classes was saved!");
    }
    
}); 

fs.writeFile("Data/DaysOfClasses.json", JSON.stringify(DaysOfClasses), function(err) {
    if(err) {
        return console.log(err);
    }else{
    	console.log("The Days Of Classes Of Classes was saved!");
    }
    
}); 
