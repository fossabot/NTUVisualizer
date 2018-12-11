const rp = require('request-promise');
const querystring = require('querystring');
var fs = require('fs');
var FilteredObject = JSON.parse(fs.readFileSync('../Data/Processed/LocationData.json', 'utf8'));
//var FilteredObject = [];
var UnclearedObject = JSON.parse(fs.readFileSync('../Data/Logs/NotFoundLocation.json', 'utf8'));

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
	"RPR SR1": "Hall 9",// REP Seminar Rm 1
	"RPR SR2": "Hall 9",// REP Seminar Rm 2
	"NH SR 2":"Seminar Room 2 (NYH)",
	"NH SR 1":"Seminar Room 1 (NYH)",
	"NH SR1":"Seminar Room 1 (NYH)",
	"NH SR2":"Seminar Room 1 (NYH)",
	"MAS EC RM2":"Research Colloquium Room 2 (MAS)",
	"NIE502RR07":"Labs / Subject Rooms - NIE5-02-07",
	"UGLAB": "Undergraduate Laboratory", //under grad ? ug secure room ?
	//'ONLINE': "",
	"S3.2 SR1": "S3.2 Executive Seminar Room 1",
	"LHSTR+10" : "Tutorial Room + 10 - LHS",
	"NIELT10" : "NIE LT10",
	"NIETRBLK3" : "National Institute of Education (NIE) - Building 3 (Arts)",
	"7-01-TR701" : "Tutorial Room 701 - NIE",
	"MAS EC RM1" : "Research Colloquium Room 1 (MAS)",
	"NIETR321" : "NIE TR321",
	"NIELT10" : "NIE LT10",
	"EMB LS": "Experimental Medicine Building",
	"SEE HY3012": "HSSSEMRM6",
	"ESTLAB1": "Engineering Software Teaching Laboratory 1 (EST Lab 1)",
	"ESTLAB2": "Engineering Software Teaching Laboratory 2 (EST Lab 2)",
	"2-B1-14": "National Institute of Education (NIE) - Building 2 (Education)",
	"PA-01-15": "Nuclear Magnetic Resonance Laboratory (PAP)"
}

var MapContains = {
	"PROJ P3.": "School of Mechanical and Aerospace Engineering (MAE)",
	"PAP": "School of Physical and Mathematical Sciences (SPMS)",
	"RPR SR": "Hall 9"
}

function getKeyByValue(value) {
  return Object.keys(MapName).find(key => object[key] === value);
}



for(index in UnclearedObject){
	//console.log(UnclearedObject[index])
	for(mapIndex in MapName){
		
		if(UnclearedObject[index] == mapIndex) {
			UnclearedObject[index] = MapName[mapIndex];
			break;
		}
		// console.log(UnclearedObject[index])
		if(UnclearedObject[index] == "ONLINE" || UnclearedObject[index] == "TBC"  || UnclearedObject[index] == "CLOSE"  
			|| UnclearedObject[index] == "ONLINE LEC"   || UnclearedObject[index] == "OVERSEAS"  ){
			UnclearedObject.splice(index,1);
			break;
		}
	}

	for(mapIndex in MapContains){
		if(UnclearedObject[index].includes(mapIndex)){
			console.log(UnclearedObject[index])
			UnclearedObject[index] = MapName;
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
				for(mapIndex in MapName){
					// console.log(keys + " " + MapName[mapIndex])
					if(keys == MapName[mapIndex]) {
						FilteredObject[index][mapIndex] = FilteredObject[index][keys];
						NotFoundLocation = NotFoundLocation.filter(e => e !== mapIndex);
						delete FilteredObject[index][keys];
					}
				}
			}
		}

		for(index in FilteredObject){
    		for(keys in FilteredObject[index]){
				for(mapIndex in MapContains){
					// console.log(keys + " " + MapContains[mapIndex])
					if(keys == MapContains[mapIndex]) {
						FilteredObject[index][mapIndex] = FilteredObject[index][keys];
					}
				}
			}
		}

		for(index in FilteredObject){
    		for(keys in FilteredObject[index]){
				for(mapIndex in MapContains){
					// console.log(keys + " " + MapContains[mapIndex])
					if(keys == MapContains[mapIndex]) {
						delete FilteredObject[index][keys];
					}
				}
			}
		}

		NotFoundLocation = NotFoundLocation.filter(e => !e.includes(mapIndex));

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

		fs.writeFile("../Data/Logs/ErrorList2.json", JSON.stringify(ErrorList), function(err) {
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
// saveFunction()
// call the rest of the code and have it execute after 3 seconds
intervalID = setInterval(saveFunction, 3000);









