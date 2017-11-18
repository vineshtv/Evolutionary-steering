class Vehicle {
    constructor(x, y, dna, health) {
        this.pos = createVector(x,y);
        this.vel = createVector(0,-2);
        this.accl = createVector(0, 0);
        this.size = random(10, 20);
        this.r = 5;
        if (health >= 1){
            this.health = health;
        }
        else{
            this.health = 1;
        }
        this.maxSpeed = 4;
        this.maxforce = 0.2
        
        this.dna = [];
        if(dna == undefined){
            this.dna[0] = random(-2,2);
            this.dna[1] = random(-2,2);
            this.dna[2] = random(10,100);
            this.dna[3] = random(10,100);
        }
        else{
            this.dna[0] = dna[0];
            if(random(1) < mutationRate) { this.dna[0] += random(-0.2, 0.2); }
            this.dna[1] = dna[1];
            if(random(1) < mutationRate) { this.dna[1] += random(-0.2, 0.2); }
            this.dna[2] = dna[2];
            if(random(1) < mutationRate) { this.dna[2] += random(-20, 20); }
            this.dna[3] = dna[3];
            if(random(2) < mutationRate) { this.dna[3] += random(-20, 20); }
        }
    }
    behaviours(good, bad){
        var steerG = this.eat(food, 0.3, this.dna[2]);
        var steerB = this.eat(poison, -0.5, this.dna[3]);
        
        steerG.mult(this.dna[0]);
        steerB.mult(this.dna[1]);
        
        this.applyForce(steerG);
        this.applyForce(steerB);
    }
    
    clone() {
        clones += 1;
        return (new Vehicle(this.pos.x, this.pos.y, this.dna, this.health/2));
    }
     
    eat(list, nutrition, perception) {
        var dist = Infinity;
        var closest = -1;
        for(var i = 0; i < list.length; i++){
            var d = this.pos.dist(list[i]);
            if(d < dist && d < perception){
                dist = d;
                closest = i;
            }
        }

        if(closest != -1){
            if(dist < 5){
                this.health += nutrition;
                list.splice(closest,1);
            }
            else{
                return(this.seek(list[closest]));
            }
        }
        
        return createVector(0,0);
    }
    
    calculateStats() {
        dead += 1;
    }
    
    move() {
        var mouse = createVector(mouseX, mouseY);
        mouse.sub(this.pos);
        mouse.setMag(0.1);
        this.accl = mouse;
        
        this.vel.add(this.accl);
        this.pos.add(this.vel);
        this.vel.limit(5);
    }
    
    update() {
        this.vel.add(this.accl);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        
        this.accl.mult(0);
        this.age += 0.01;
        this.health -= 0.005
    }
    
    seek(target) {
        var desired = p5.Vector.sub(target, this.pos);
        
        desired.setMag(this.maxSpeed);
        
        var steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxforce);
        return(steer);
    }
    
    applyForce(force) {
        this.accl.add(force);
    }
    /*
    checkAndRotate(){
        if(this.pos.x > width) {this.pos.x = 0}
        if(this.pos.x < 0) {this.pos.x = width}
        if(this.pos.y > height) {this.pos.y = 0}
        if(this.pos.y < 0) {this.pos.y = height}
    }
    checkAndBounce() {
        if((this.pos.x + this.size/2 > width) ||
           (this.pos.x - this.size/2) < 0) {
            this.vel.x *= -1;
        }
        if((this.pos.y + this.size/2 > height) ||
           (this.pos.y - this.size/2 < 0)) {
            this.vel.y *= -1;
        }
    }*/
    
    display() {
        // Color based on health.
        var green = color(0, 255, 0);
        var red = color(255, 0, 0);
        var col = lerpColor(red, green, this.health);
        
        var angle = this.vel.heading() + PI / 2;
        push();
        translate(this.pos.x, this.pos.y);
        rotate(angle);
        if(debug.checked()){
            stroke(0,255,0);
            noFill();
            strokeWeight(3);
            line(0,0,0, -this.dna[0] * 20);
            ellipse(0,0,this.dna[2]*2);
            stroke(255,0,0);
            strokeWeight(1);
            line(0,0,0, -this.dna[1] * 20);
            ellipse(0,0,this.dna[3]*2); 
        }
        // Draw the vehicle itself
        fill(col);
        stroke(col);
        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);
        pop();
    }
    
    boundaries() { 
        var d = 20;
        var desired = null;

        if (this.pos.x < d) {
            desired = createVector(this.maxSpeed, this.vel.y);
        }
        else if (this.pos.x > width -d) {
            desired = createVector(-this.maxSpeed, this.vel.y);
        }

        if (this.pos.y < d) {
            desired = createVector(this.vel.x, this.maxSpeed);
        }
        else if (this.pos.y > height-d) {
            desired = createVector(this.vel.x, -this.maxSpeed);
        }

        if (desired !== null) {
            desired.normalize();
            desired.mult(this.maxSpeed);
            var steer = p5.Vector.sub(desired, this.vel);
            steer.limit(this.maxforce);
            this.applyForce(steer);
        }
    }
}