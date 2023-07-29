//creating canvas
const canvas = document.querySelector("canvas");
canvas.width = innerWidth; // innerWidth innerHeight are window object properties
canvas.height = innerHeight;

//setting context
const ctx = canvas.getContext('2d');

//creating player

class Player{
    constructor(x, y, radius, color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw (){

        ctx.beginPath();//specifying to start drawing
        ctx.arc(this.x, this.y, this.radius, 0 ,360 ,false);
        ctx.fillStyle = this.color;
        ctx.fill();

    }
}

//getting canvas center
const x = canvas.width/2;
const y = canvas.height/2;

const player = new Player(x,y,20,'blue');
player.draw();