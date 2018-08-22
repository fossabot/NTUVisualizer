var fs = require('fs');
var FilteredObject = JSON.parse(fs.readFileSync('Data/LocationData.json', 'utf8'));
var BadData = [];
var SuggestiveData = [];
var counter = 0;

var FinalData = {};
for(index in FilteredObject){
	for(key in FilteredObject[index]){

		if(FilteredObject[index][key]["name"] == "LAB" || FilteredObject[index][key]["name"] == "LAB ROOM" 
			|| FilteredObject[index][key]["name"] == ""){
			FilteredObject.slice(index,1)
			break;
		}

		if(FilteredObject[index][key].businesses != null){
			if(FilteredObject[index][key]["businesses"][0] != undefined){
				counter++
				FinalData["" + key] = FilteredObject[index][key]["businesses"][0]["location"]["geometry"]["location"];
			}else{
				SuggestiveData.push(FilteredObject[index][key])
			}
			
			//FinalData[""] = FilteredObject[index][key].businesses
			//console.log(FilteredObject[index][key].businesses[0]);
		}else if(FilteredObject[index][key].markers[0] != null){
			SuggestiveData.push(FilteredObject[index][key])
		}else{
			BadData.push(FilteredObject[index][key]);
		}
	}
}
//console.log(JSON.stringify(BadData))
//console.log(FinalData)
for(index in SuggestiveData){
	if(SuggestiveData[index].markers != undefined){
		FinalData["" + SuggestiveData[index]["name"]] = SuggestiveData[index].markers[0].latlng
	}else{
		BadData.push(SuggestiveData[index])
	}
}

console.log(JSON.stringify(FinalData))

