// starting from scratch using rows

// let's declare some globals!
// they get declared first, so we can head into setup
var height = 800;
var width = 800;
var target_framerate = 10;
var number_rows = 10;
var row_height = 0; // we'll calculate this in a second in setup()
var rowOccupants = []; // array with number of rows, with the position of occupying critter
var critterArray = [];
var emptyCellLocations = [];
var liveCritterLocations = [];
var global_food_to_allocate = 12;
var food_cost_basic = 1; // blergh
var edge_detection_visibility = 1; // flip to 1 for Cynthia-friendly mode
var edge_border_color = 180; // grey scale 0 for black, 255 for white...

function setup() {
	createCanvas(800,800);
	frameRate(10);
	colorMode(RGB); 
	// colorMode(HSB); // HSB color mode defaults to 360, 100, 100
	background(255,255,255);
	row_height = (height/number_rows);
	createCritters();
	createRows();
}


function draw() {
	drawRows();
	determineFoodAvailable();
	ageCritters();
	allocateFood();
	dinnerTime();
	catalogLiveCritters();
	catalogEmptyCells();
	fillEmptyCellsWithNew(); // just writing one method
	debugger;
		
}


function catalogLiveCritters(){
	// we need a list of the live critter locations so we can reference neighbors
	// I think. I might be high.
	liveCritterLocations = []; // empty it out before each run through
	for(var i = 0; i < critterArray.length; i++){
		if(critterArray[i].am_alive == 1) {    //if it's alive, push where we found it
			liveCritterLocations.push(i);
		}
	// liveCritterLocations should now contain an array of locations in CritterArray where that critter is alive
	}
}


function dinnerTime(){
// everybody, eat
// 	this is the basic "hanging around costs food"
// TODO, doesn't work, causes an undefined error
// 	long term when there are a ton of critters alive and dead, it's going to make sense to speed this up
// 	maybe using a live critter index

// 	for(var i = 0; i < critterArray.length; i++){
// 		critterArray[i].food = critterArray[i].food - (critterArray[i].size * food_cost_basic);	
// 		if(critterArray[rowOccupants[i]].food < 0 && critterArray[rowOccupants[i]].am_alive == 1) {
// 			critterArray[rowOccupants[i]].die();
// 		}
// 		TODO this doesn't belong here long-term
// 		critterArray[i].checkForExpansionReady();
// 	}
}


function determineFoodAvailable(){
	// this is where we could look at what the colors and whatever are and make a calculation

}


// note that this doesn't check if they're alive or not, because who cares
function allocateFood(){
	// first, take the global allowance and divide it
	let food_per_row = global_food_to_allocate/number_rows;
	// a couple ways we could do this -- I'm going to go with this very simple goldfish tank style one
	for(var i = 0; i < number_rows; i +=1){
		critterArray[rowOccupants[i]].food = critterArray[rowOccupants[i]].food + food_per_row;
	}

}


// figure out what to do with those empty cells
// TODO, something weird is happening here

function fillEmptyCellsWithNew(){
	for(var i = 0; i < emptyCellLocations.length; i++){
		tempCritter = new Critter(); // generate a new Critter
		print("length of critterarray is ", critterArray.length);
		critterArray.push(tempCritter); // add it to the critter array
		print("length of critterarray is ", critterArray.length);
		rowOccupants[emptyCellLocations[i]] = critterArray.length-1; // go to the rowOccupant where we know there's a vacancy, put the id of the new one in
		}
}

// function fillEmptyCellsWithExpansion(){
// not working

// 	for(var i = 0; i < emptyCellLocations.length; i++){
// 		let current_vacancy = emptyCellLocations[i];
// 		print("looking to fill cell ", current_vacancy);
// 		if (current_vacancy > 0) {
// 			if (critterArray[rowOccupants[current_vacancy-1]].am_alive == 1 && critterArray[rowOccupants[current_vacancy-1]].ready_to_expand == 1){
// 				critterArray[rowOccupants[current_vacancy-1]].size = critterArray[rowOccupants[current_vacancy-1]]++; // tell the creature it's bigger
// 				rowOccupants[current_vacancy] = rowOccupants[current_vacancy-1];
// 				print("attempted a fill");
// 				debugger;
// 				print(rowOccupants);
// 				debugger;
// 			}
// 		}
// 		
// 		
// 		
// 	
// 	}
	


// go through and see where there are vacancies
function catalogEmptyCells(){
	emptyCellLocations = []; // gotta empty it out before we run each time
	for(var i = 0; i < number_rows; i +=1){
		if(critterArray[rowOccupants[i]].am_alive == 0){
			// append that location to the array of empty cell locations
			emptyCellLocations.push(i);	
		}
	}
	// if they're all dead, let's just throw it into debugger
	if(emptyCellLocations.length == number_rows){
		debugger;
	}

}


// then let's go through all the critters and tell them time marches on
function ageCritters(){
	for(var i = 0; i < critterArray.length; i++){
		if(critterArray[i].am_alive == 1){
			critterArray[i].timePasses();
		} 
	}
}

// we're going to iterate through each row and fill it with the color of the critter occupying that row
function drawRows(){
	print("starting to draw rows");
	for(var i = 0; i < number_rows; i +=1){
		rectMode(CENTER);
		let centerx = (width/2);
		let centery = (row_height/2);
		let rect_width = width;
		let rect_height = row_height;		
		push();
		translate(0, (i*row_height));
		if(edge_detection_visibility == 1){    // check if we want edges
			strokeWeight(10);
			stroke(0,0,50);
		} else {
			noStroke();
		}
		// go grab the color of the critter that lives in this spot in the rowOccupants
		print("went to see who lives at ", i, "and found ", rowOccupants[i], " which is ", critterArray[rowOccupants[i]]);
		fill(critterArray[rowOccupants[i]].displayed_color);

		if(edge_detection_visibility == 1){    // check if we're varying width
			let tempWidthPercent = critterArray[rowOccupants[i]].width_percentage;
			rect(centerx, centery, rect_width*tempWidthPercent, rect_height);
		} else {
			rect(centerx, centery, rect_width, rect_height);
		}
		pop();
		}
	// we could feed here	

}


function testFunction(){
	print("test called");	
}


function createCritters(){  
    for(var i = 0; i < number_rows; i +=1){
		critterArray[i] = new Critter(); // we'll need one critter per row to start
		}
}


function createRows(){
	for(var i = 0; i < number_rows; i +=1){
		rowOccupants[i] = i; // each row starts out with the number of the critter occupying it
		}
}



// ? how do we get this to then call the stuff
//	critterArray.forEach(testFunction);
	
