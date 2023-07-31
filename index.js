//creating canvas
const canvas = document.querySelector("canvas");
canvas.width = innerWidth; // innerWidth innerHeight are window object properties
canvas.height = innerHeight;

//setting context
const ctx = canvas.getContext("2d");

const scoreEl = document.querySelector("#scoreEl");
const bigScoreEl = document.querySelector(".bigScoreEl");
const startGameBtn = document.querySelector(".startGameBtn");
const modalEl = document.querySelector(".modalEl");

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

const friction = 0.99; //for slowing down particles
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.velocity = velocity;
    this.color = color;
    this.alpha = 1;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 360, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }

  update() {
    this.draw();
    this.alpha -= 0.01;
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

//getting canvas center
const x = canvas.width / 2;
const y = canvas.height / 2;

//drawing player
let player = new Player(x, y, 10, "white");

let projectiles = [];
let enemies = [];
let particles = [];

function init() {
  player = new Player(x, y, 10, "white");
  projectiles = [];
  enemies = [];
  particles = [];
  score = 0;
  scoreEl.innerHTML = score;
  bigScoreEl.innerHTML = score;
}

let intervalId;
function spawnEnemies() {
  intervalId = setInterval(() => {
    let x, y;
    const radius = Math.random() * (30 - 5) + 5; //create value between 5 and 30
    let color = `hsl( ${Math.random() * 360} , 50%, 50%)`; //randomize enemy color
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
let score = 0;

function animate() {
  animationId = requestAnimationFrame(animate);
  ctx.fillStyle = "rgba( 0, 0, 0, 0.1 )"; // value of a in rgba set to 0.1 it creates opacity which creates light trails
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();

  //creating projectiles

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

  //on collision of player and enemy
  enemies.forEach((enemy, enemyIndex) => {
    enemy.update();

    const dist = Math.hypot(enemy.x - player.x, enemy.y - player.y);
    if (dist - player.radius - enemy.radius < 1) {
      cancelAnimationFrame(animationId);
      clearInterval(intervalId);
      bigScoreEl.innerHTML = score;
      modalEl.style.display = 'flex';
    }

    //on collision of projectile and enemy
    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y); //calculate distance between centres of projectile and enemy

      if (
        dist - enemy.radius - projectile.radius <
        1 /*when radius collides*/
      ) {
        //shrinking
        if (enemy.radius - 10 > 10) {
          //using gsap for smooth transition of shrinking
          gsap.to(enemy, {
            radius: enemy.radius - 10,
          });

          score += 25;
          scoreEl.innerHTML = score;
          setTimeout(() => {
            projectiles.splice(projectileIndex, 1); //we can use splice method to remove an instance from an array splice(index , how many, ...what to add after removing)
          }, 0);
        }

        //removing enemy
        else {
          //setTimeout is used for hiding flash formed because animate is trying to rerender the projectile and enemy but soon they are removed which creates a flash after we remove enemy and projectile
          setTimeout(() => {
            enemies.splice(enemyIndex, 1);
            projectiles.splice(projectileIndex, 1); //we can use splice method to remove an instance from an array splice(index , how many, ...what to add after removing)
          }, 0);
          score += 50;
          scoreEl.innerHTML = score;
        }

        //creating explosion

        for (let i = 0; i < enemy.radius; i++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 2,
              enemy.color,
              {
                x: (Math.random() - 0.5) * Math.random() * 6,
                y: (Math.random() - 0.5) * Math.random() * 6,
              }
            )
          );
        }
      }
    });
  });

  // rendering particles
  particles.forEach((particle, particleIndex) => {
    if (particle.alpha <= 0) {
      particles.splice(particleIndex, 1);
    } else {
      particle.update();
    }
  });
}

const events = ['click','touchstart'];

events.forEach(event=>{
window.addEventListener(event, (event) => {
  const angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  ); //calculating angle of mouseClick
  const velocity = { x: Math.cos(angle) * 5, y: Math.sin(angle) * 5 }; //calculating x and y components from angle for precise projection

  projectiles.push(
    new Projectile(canvas.width / 2, canvas.height / 2, 5, "white", velocity)
  );
});
})

events.forEach(event=>{
startGameBtn.addEventListener(event,()=>{
  init();
  modalEl.style.display = 'none';
  spawnEnemies();
  animate();
})})

