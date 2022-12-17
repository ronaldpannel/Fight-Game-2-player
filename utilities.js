function rectangularCollision({ object1, object2 }) {
  return (
    object1.attackBox.pos.x + object1.attackBox.width >= object2.pos.x &&
    object1.attackBox.pos.x <= object2.pos.x + object2.width &&
    object1.attackBox.pos.y + object1.attackBox.height >= object2.pos.y &&
    object1.attackBox.pos.y <= object2.pos.y + object2.height
  );
}

function determineWinner({ player, enemy }) {
  document.getElementById("gameState").style.display = "flex";
  if (player.health === enemy.health) {
    document.getElementById("gameState").innerHTML = "Tie";
  } else if (player.health > enemy.health) {
    document.getElementById("gameState").innerHTML = "Player1 Wins";
  } else if (player.health < enemy.health) {
    document.getElementById("gameState").innerHTML = "Player2 Wins";
  }
}
let timer = 40;
function decreaseTimer() {
  if (timer > 0) {
    setTimeout(decreaseTimer, 1000);
    timer--;
    document.getElementById("time").innerHTML = timer;
  }
  if (timer === 0) {
    determineWinner({ player, enemy });
  }
}
decreaseTimer();
