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

class Enemy {
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
const enemies = [];

function spawnEnemies() {
  setInterval(() => {
    let x, y;
    const radius = Math.random() * (30 - 5) + 5; //create value between 5 and 30
    let color = "green";
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 1000);
}

let animationId;

function animate() {
  animationId = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();
  projectiles.forEach((projectile, projectileIndex) => {
    projectile.update();

    //removing offscreen projectiles
    setTimeout(() => {
      if (
        projectile.x + projectile.radius < 0 ||
        projectile.x - projectile.radius > canvas.width ||
        projectile.y + projectile.radius < 0 ||
        projectile.y - projectile.radius > canvas.height
      ) {
        projectiles.splice(projectileIndex, 1);
      }
    });
  });
  enemies.forEach((enemy, enemyIndex) => {
    enemy.update();
    //detecting collision of enemy and player

    const dist = Math.hypot(enemy.x - player.x, enemy.y - player.y);
    if (dist - player.radius - enemy.radius < 1) {
      cancelAnimationFrame(animationId);
    }

    //detecting collision of projectile and eenemy
    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y); //calculate distance between centres of projectile and enemy

      if (
        dist - enemy.radius - projectile.radius <
        1 /*when radius collides*/
      ) {
        setTimeout(() => {
          //setTimeout is used for hiding flash formed because animate is trying to rerender the projectile and enemy but soon they are removed which creates a flash after we remove enemy and projectile

          enemies.splice(enemyIndex, 1);
          projectiles.splice(projectileIndex, 1); //we can use splice method to remove an instance from an array splice(index , how many, ...what to add after removing)
        }, 0);
      }
    });
  });
}

window.addEventListener("click", (event) => {
  const angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  ); //calculating angle of mouseClick
  const velocity = { x: Math.cos(angle), y: Math.sin(angle) }; //calculating x and y components from angle for precise projection

  projectiles.push(
    new Projectile(canvas.width / 2, canvas.height / 2, 5, "red", velocity)
  );
});
spawnEnemies();
animate();
