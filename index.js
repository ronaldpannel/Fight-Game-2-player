/**@type{HTMLCanvasElement} */

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;

const gravity = 0.5;

const background = new Sprite({
  pos: {
    x: 0,
    y: 0,
  },
  imageSrc: "background-2.png",
});

const shop = new Sprite({
  pos: {
    x: 600,
    y: 128,
  },
  imageSrc: "shop.png",
  scale: 2.75,
  framesMax: 6,
});

const player = new Fighter({
  pos: {
    x: 100,
    y: 100,
  },
  vel: {
    x: 0,
    y: 1,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "Idle.png",
  framesMax: 8,
  scale: 2.75,
  offset: {
    x: 215,
    y: 138,
  },
  sprites: {
    idle: {
      imageSrc: "Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "Take hit.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 120,
      y: 70,
    },
    width: 180,
    height: 50,
  },
});

const enemy = new Fighter({
  pos: {
    x: 600,
    y: 100,
  },
  vel: {
    x: 0,
    y: 1,
  },
  color: "blue",
  offset: {
    x: 50,
    y: 0,
  },
  imageSrc: "eIdle.png",
  framesMax: 4,
  scale: 2.75,
  offset: {
    x: 215,
    y: 165,
  },
  sprites: {
    idle: {
      imageSrc: "eIdle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "eRun.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "eJump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "eFall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "eAttack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "eTake hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "eDeath.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -180,
      y: 70,
    },
    width: 180,
    height: 50,
  },
});

const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  ctx.fillStyle ='rgba(255,255,255,0.15)'
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  enemy.update();
  player.update();

  requestAnimationFrame(animate);

  //attackBox collision detection
  if (
    rectangularCollision({
      object1: player,
      object2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takesHit();
    player.isAttacking = false;
    document.getElementById("enemyHealthBar").style.width = enemy.health + "%";
  }
  // if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }
  if (
    rectangularCollision({
      object1: enemy,
      object2: player,
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takesHit();
    enemy.isAttacking = false;
    document.getElementById("playerHealthBar").style.width =
      player.health + "%";
  }
  if (enemy.isAttacking && enemy.framesCurrent === 4) {
    enemy.isAttacking = false;
  }

  //game over based on health
  if (player.health <= 0 || enemy.health <= 0) {
    determineWinner({ player, enemy });
  }

  player.vel.x = 0;
  enemy.vel.x = 0;

  //player key movement

  if (keys.d.pressed && player.lastKey == "d") {
    player.vel.x = 5;
    player.switchSprite("run");
  } else if (keys.a.pressed && player.lastKey == "a") {
    player.vel.x = -5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  // player jumping
  if (player.vel.y < 0) {
    player.switchSprite("jump");
  } else if (player.vel.y > 0) {
    player.switchSprite("fall");
  }

  //enemy key movement

  if (keys.ArrowRight.pressed && enemy.lastKey == "ArrowRight") {
    enemy.vel.x = 5;
    enemy.switchSprite("run");
  } else if (keys.ArrowLeft.pressed && enemy.lastKey == "ArrowLeft") {
    enemy.vel.x = -5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  // enemy jumping
  if (enemy.vel.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.vel.y > 0) {
    enemy.switchSprite("fall");
  }
}
animate();

window.addEventListener("keydown", (e) => {
  if (!player.dead) {
    switch (e.key) {
      case "d":
        player.lastKey = "d";
        keys.d.pressed = true;
        break;
      case "a":
        player.lastKey = "a";
        keys.a.pressed = true;
        break;
      case "w":
        player.vel.y = -20;
        break;
      case " ":
        player.attack();
        break;
    }
  }

  if (!enemy.dead) {
    switch (e.key) {
      case "ArrowRight":
        enemy.lastKey = "ArrowRight";
        keys.ArrowRight.pressed = true;
        break;
      case "ArrowLeft":
        enemy.lastKey = "ArrowLeft";
        keys.ArrowLeft.pressed = true;
        break;
      case "ArrowUp":
        enemy.vel.y = -20;
        break;
      case "ArrowDown":
        enemy.attack();
        break;
    }
  }
});

window.addEventListener("keyup", (e) => {
  // console.log(e.key);
  switch (e.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
