let vehicles = [];
let food = [];
let poison = [];
let avgDna = [0,0,0,0];
var dead = 0;
var averageAge = 0
var averageSize = 0;
var clones = 0;
var cloningRate = 0.001;
var mutationRate = 0.1;
var debug;
var vehicleReg = 0;

function setup() {
	createCanvas(windowWidth, windowHeight - 50);
    background(51);
    
    debug = createCheckbox('Show Debuginfo');
    stats = createCheckbox('Show Stats');
}

function draw() {
    background(51);
    var rand = random(1);
    if (rand < 0.1){
        food.push(createVector(random(width), random(height)));
        if (rand < 0.04){
            poison.push(createVector(random(width), random(height)));
        }
    }
    
    noStroke();
    for(var i = 0; i < food.length; i++){
        fill(0,255,0);
        ellipse(food[i].x, food[i].y, 4);
    }
    for(var i = 0; i < poison.length; i++){
        fill(255,0,0);
        ellipse(poison[i].x, poison[i].y, 4);
    }
    
    for(var i = vehicles.length - 1; i >=0; i--){
        vehicles[i].behaviours(food, poison);
        vehicles[i].boundaries();
        vehicles[i].update();
        vehicles[i].display();
        
        // Check for cloning.
        if (random(1) < cloningRate) {
            var newVehicle = vehicles[i].clone();
            vehicles.push(newVehicle);
        }
        
        // Death of a vehicle.
        if(vehicles[i].health <= 0){
            // Calculate stats
            vehicles[i].calculateStats();
            // Create a food where it died.
            food.push(createVector(vehicles[i].pos.x, vehicles[i].pos.y));
            vehicles.splice(i,1);
            // Calculate average DNA of the remaining vehicles.
            calculateAverage();
        }
    }
    
    if(stats.checked()){
        drawingContext.font = 'normal 12px courier';
        noStroke();
        fill(0);
        text('TOTAL VEHICLES = '+ vehicles.length, 10, height -36);
        text('TOTAL CLONES = ' + clones, 10, height - 24)
        text('AVERAGE DNA = ' + avgDna, 10, height - 12);
    }
//    if(vehicles.length == 0){
//        clones = 0;
//    }
    
    if(vehicles.length == 2){
        poison.splice(0, poison.length/2);
    }
    
}

function calculateAverage(){
    if(stats.checked()){
        if (vehicles.length == 0) {
            avgDna = [0,0,0,0];
            return;
        }
        var totalFoodAttr = 0;
        var totalPoisonAttr = 0;
        var totalFoodPerception = 0;
        var totalPoisonPerception = 0;

        var length = vehicles.length;
        for(var i = 0; i < vehicles.length; i++){
            var dna = vehicles[i].dna;
            totalFoodAttr         += dna[0];
            totalPoisonAttr       += dna[1];
            totalFoodPerception   += dna[2];
            totalPoisonPerception += dna[3];
        }

        avgDna[0] = totalFoodAttr         / length;
        avgDna[1] = totalPoisonAttr       / length;
        avgDna[2] = totalFoodPerception   / length;
        avgDna[3] = totalPoisonPerception / length;
    }
}

function keyPressed() {
    if(key == ' ') {
        vehicles.push(new Vehicle(random(width), random(height), null, 0));
        calculateAverage();
    }
    
    if(key == 'D') {
        if(vehicles.length > 0){
            vehicles.splice(0,1);
        }
    }
}