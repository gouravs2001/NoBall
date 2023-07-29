//creating canvas
const canvas = document.querySelector("canvas");
canvas.width = innerWidth; // innerWidth innerHeight are window object properties
canvas.height = innerHeight;

//setting context
const ctx = canvas.getContext("2d");

//creating player

class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    ctx.beginPath(); //specifying to start drawing
    ctx.arc(this.x, this.y, this.radius, 0, 360, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

//creating projectile

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.velocity = velocity;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 360, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

//getting canvas center
const x = canvas.width / 2;
const y = canvas.height / 2;

//drawing player
const player = new Player(x, y, 20, "blue");

//rendering prrojectile on click event
const projectiles = [];

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();
  projectiles.forEach((projectile) => {
    projectile.update();
  });
}

window.addEventListener("click", (event) => {
  const angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  ); //calculating angle of mouseClick
  const velocity = { x: Math.cos(angle), y: Math.sin(angle) };

  projectiles.push(
    new Projectile(canvas.width / 2, canvas.height / 2, 5, "red", velocity)
  );
});
animate();
