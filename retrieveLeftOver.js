const rp = require('request-promise');
const querystring = require('querystring');
var fs = require('fs');
var FilteredObject = JSON.parse(fs.readFileSync('Data/LocationData.json', 'utf8'));
//var FilteredObject = [];
var UnclearedObject = JSON.parse(fs.readFileSync('Data/NotFoundLocation.json', 'utf8'));

var MapName = {
	'PIC': 'Block S3',//Professional Imaging Centre S3-B3C
	//'TBC': '',//wtf
	'SWLAB1': 'Software Lab 1',
	'SWLAB2': 'Software Lab 2',
	'SWLAB3': 'Software Lab 3',
	'HPL'   : 'Hardware Projects Lab',
	'HWLAB1': 'Hardware Lab 1',
	'HWLAB2': 'Hardware Lab 2',
	'HWLAB3': 'Hardware Lab 3',  
	'SMARTCLASS': "SMART Classroom",
	"NEWSPLEX": "WKWSCI", //NP-01 cant find
	"LRG TV STU": "WKWSCI", //CS 01-18A LIKELY
	'S3.2 SR2': "S3.2 Executive Seminar Room 1",
	"LHSTR+24": "Tutorial Room + 24 - LHS",
	"LHSTR+53": "Tutorial Room + 53 - LHS",
	"NTU SRC": "SRC",
	"SEE HY3010": "Seminar Room 9 - HSS",
	"ART B1-20": "ART-B1-20",
	"ESPACE": "E-Space @ MSE",
	"PAP YR1 LA": "1st Year Teaching Laboratory (PAP)",
	"PAP YR2 LA": "2nd Year Teaching Laboratory (PAP)",
	"PAP YR3 LA": "3rd Year Teaching Laboratory (PAP)",
	"RPR SR 1": "Hall 9",// REP Seminar Rm 1
	"RPR SR 2": "Hall 9",// REP Seminar Rm 2
	"NH SR 2":"Seminar Room 2 (NYH)",
	"NH SR 1":"Seminar Room 1 (NYH)",
	"NH SR1":"Seminar Room 1 (NYH)",
	"MAS EC RM2":"Research Colloquium Room 2 (MAS)",
	"NIE502RR07":"Labs / Subject Rooms - NIE5-02-07",
	"UGLAB": "Undergraduate Laboratory", //under grad ? ug secure room ?
	//'ONLINE': "",
	"S3.2 SR1": "S3.2 Executive Seminar Room 1",
	"LHSTR+10" : "Tutorial Room + 10 - LHS"

}





for(index in UnclearedObject){
	//console.log(UnclearedObject[index])
	for(mapIndex in MapName){
		if(UnclearedObject[index] == mapIndex) {
			UnclearedObject[index] = MapName[mapIndex];
			break;
		}
		console.log(UnclearedObject[index])
		if(UnclearedObject[index] == "ONLINE" || UnclearedObject[index] == "TBC" ){
			console.log(UnclearedObject.splice(index,1));
		}
	}
}

var obj = UnclearedObject;

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
		try{
			currentNumbering++;
			console.log(currentNumbering + " of " + objectLength)
	        if(serverResponse.status == 0){
	        	NotFoundLocation.push(serverResponse.what.name);
	        }else if(serverResponse.status == 1){
	        	var name = serverResponse.what.name;
	        	var responseObject = {};
	        	responseObject[name] = serverResponse.what;
	        	delete responseObject[name]["name"]

	        	FilteredObject.push(responseObject)
	        }
        }catch(err){
        	ErrorList.push(err);
        }
    })
    .catch(function (err) {
        ErrorList.push(err);
        // API call failed...
        console.log(err)
    });
}


var intervalID = -1;
function saveFunction() {
    // all the stuff you want to happen after that pause
    if(currentNumbering == objectLength){
    	
    	for(index in FilteredObject){
    		for(keys in FilteredObject[index]){
			//console.log(UnclearedObject[index])
				for(mapIndex in MapName){

					//console.log(keys + " " + MapName[mapIndex])
					console.log(keys + " " + MapName[mapIndex])
					if(keys == MapName[mapIndex]) {
						//console.log(index + " " + MapName[mapIndex])
						FilteredObject[index][mapIndex] = FilteredObject[index][keys];
						delete FilteredObject[index][keys];
						//console.log(FilteredObject[index])
					}
				}
			}
		}

    	fs.writeFile("Data/LocationData.json", JSON.stringify(FilteredObject), function(err) {
		    if(err) {
		        return console.log(err);
		    }else{
		    	console.log("The Location Data was saved!");
		    }
		    done[0] = true;
		}); 

		fs.writeFile("Data/NotFoundLocation.json", JSON.stringify(NotFoundLocation), function(err) {
		    if(err) {
		        return console.log(err);
		    }else{
		    	console.log("The Unfound Locations was saved!");
		    }
		    done[1] = true;
		}); 

		fs.writeFile("Data/ErrorList2.json", JSON.stringify(ErrorList), function(err) {
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









