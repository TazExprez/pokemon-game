// This is the database.
var pokemonDB = [
  {
    name: "charmander",
    type: "fire",
    hp: 39,
    attack: 52,
    defense: 43,
    level: 1,
    img: "http://www.smogon.com/dex/media/sprites/xy/charmander.gif"
  },
  {
    name: "bulbasaur",
    type: "overgrow",
    hp: 45,
    attack: 49,
    defense: 49,
    level: 1,
    img: "http://www.smogon.com/dex/media/sprites/xy/bulbasaur.gif"
  },
  {
    name: "squirtle",
    type: "water",
    hp: 44,
    attack: 48,
    defense: 65,
    level: 1,
    img: "http://www.smogon.com/dex/media/sprites/xy/squirtle.gif"
  }
];

// This keeps track of the state.
var gameState = {
  userPokemon: "",
  rivalPokemon: ""
};

console.log(gameState);

// These are the Pokemons elements.
var pokemonsEl = document
  .querySelector(".select-screen")
  .querySelectorAll(".character");

console.log(pokemonsEl);

var battleScreenEl = document.getElementById("battle-screen");

var attackBtnsEl = document
  .getElementById("battle-screen")
  .querySelectorAll(".attack");

console.log(attackBtnsEl);

// This is the initial loop that assigns an onclick event function to each pokemon element.
var i = 0;
while (i < pokemonsEl.length) {
  // This adds a function to all characters on the select screen.
  pokemonsEl[i].onclick = function () {
    // Here you get the name of the currently selected pokemon and assign it to a variable that will be used to give the game state a value.
    var pokemonName = this.dataset.pokemon;

    // Here you are selecting the elements for the images on the battle screen.  You will manipulate these elements and potentially change the images.  You will directly choose your pokemon, while the CPU will randomly select its pokemon.
    var player1Img = document
      .querySelector(".player1")
      .getElementsByTagName("img");
    var player2Img = document
      .querySelector(".player2")
      .getElementsByTagName("img");

    // console.log("I pressed this pokemon: " + pokemonName);

    // Here we save the current pokemon to the userPokemon property of the gameState state object.
    gameState.userPokemon = pokemonName;

    // This is the function used for the CPU to randomly select the rival pokemon.
    cpuPick();

    // This changes the screen to the battle scene.
    battleScreenEl.classList.toggle("active");

    // console.log(gameState);

    // This selects the data for the current user pokemon object.  Here you are specifically getting an object from the pokemonDB database array and assigning it to the currentPokemon array.
    // var currentPokemon = pokemonDB.filter(function (pokemon) {
    //   return pokemon.name == gameState.userPokemon;
    // });

    gameState.currentPokemon = pokemonDB.filter(function (pokemon) {
      return pokemon.name == gameState.userPokemon;
    });

    // Here you are setting the image for the user pokemon from the object inside the currentPokemon array.
    // player1Img[0].src = currentPokemon[0].img;
    player1Img[0].src = gameState.currentPokemon[0].img;

    // This selects the data for the current cpu pokemon object.  Here you are specifically getting an object from the pokemonDB database array and assigning it to the currentRivalPokemon array.
    // var currentRivalPokemon = pokemonDB.filter(function (pokemon) {
    //   return pokemon.name == gameState.rivalPokemon;
    // });
    gameState.currentRivalPokemon = pokemonDB.filter(function (pokemon) {
      return pokemon.name == gameState.rivalPokemon;
    });

    // Here you are setting the image for the cpu pokemon from the object inside the currentRivalPokemon array.
    // player2Img[0].src = currentRivalPokemon[0].img;
    player2Img[0].src = gameState.currentRivalPokemon[0].img;

    // player1Img[0].src =
    //   "http://www.smogon.com/dex/media/sprites/xy/squirtle.gif";

    // console.log(player1Img[0]);

    // console.log(currentPokemon);

    // current user and cpu pokemon initial health.
    gameState.currentPokemon[0].health = calculateInitialHealth(
      gameState.currentPokemon
    );
    gameState.currentRivalPokemon[0].health = calculateInitialHealth(
      gameState.currentRivalPokemon
    );

    console.log(gameState);

    // console.log(calculateInitialHealth(gameState.currentPokemon));

    // User choose attack.

    // cpu health goes down.

    // cpu attack.

    // User health goes down.

    // Rock, Paper, Scissors Logic

    // rock > scissors

    // paper > rock

    // scissors > paper

    // Depending on pokemon type and defense is how hard the attack is going to be and how much health it will take out.

    // Then whoever gets to health <= 0 loses.
  };

  i++;
}

var a = 0;
while (a < attackBtnsEl.length) {
  attackBtnsEl[a].onclick = function () {
    var attackName = this.dataset.attack;

    gameState.currentUserAttack = attackName;

    // console.log(attackName);

    // console.log(gameState.currentUserAttack);

    play(attackName, cpuAttack());
  };

  a++;
}

var cpuAttack = function () {
  var attacks = ["rock", "paper", "scissors"];

  return attacks[randomNumber(0, 3)];
};

var calculateInitialHealth = function (user) {
  // console.log(user[0].level);

  return 0.2 * Math.sqrt(user[0].level) * user[0].defense * user[0].hp;
};

var attackMove = function (attack, level, stack, critical, enemy, attacker) {
  console.log(enemy.name + " before: " + enemy.health);

  var attackAmount = attack * level * (stack + critical);

  enemy.health = enemy.health - attackAmount;

  checkWinner(enemy, attacker);

  console.log(enemy.name + " after: " + enemy.health);
};

// var currentPokemon = gameState.currentPokemon[0];
// var currentRivalPokemon = gameState.currentRivalPokemon[0];

var checkWinner = function (enemy, attacker) {
  if (enemy.health <= 0) {
    console.log("HEY WINNER!" + attacker.name);
  }
};

var play = function (userAttack, cpuAttack) {
  var currentPokemon = gameState.currentPokemon[0];
  var currentRivalPokemon = gameState.currentRivalPokemon[0];

  switch (userAttack) {
    case "rock":
      if (cpuAttack == "paper") {
        if (currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
          // user move.
          attackMove(
            currentPokemon.attack,
            currentPokemon.level,
            0.8,
            0.5,
            currentRivalPokemon,
            currentPokemon
          );
          if (currentRivalPokemon.health >= 1) {
            //cpu move.
            // We changed the critical value from 0.5 to 2 for the cpu because paper beats rock, so the attack is supposed to be more damaging if the user has rock, while the cpu has paper.
            attackMove(
              currentRivalPokemon.attack,
              currentRivalPokemon.level,
              0.8,
              2,
              currentPokemon,
              currentRivalPokemon
            );
          }
        }
      }
      if (cpuAttack == "scissors") {
        if (currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
          // user move.
          attackMove(
            currentPokemon.attack,
            currentPokemon.level,
            0.8,
            2,
            currentRivalPokemon,
            currentPokemon
          );
          if (currentRivalPokemon.health >= 1) {
            //cpu move.
            attackMove(
              currentRivalPokemon.attack,
              currentRivalPokemon.level,
              0.8,
              0.5,
              currentPokemon,
              currentRivalPokemon
            );
          }
        }
      }
      if (cpuAttack == "rock") {
        if (currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
          // user move.
          attackMove(
            currentPokemon.attack,
            currentPokemon.level,
            0.8,
            1,
            currentRivalPokemon,
            currentPokemon
          );
          if (currentRivalPokemon.health >= 1) {
            //cpu move.
            attackMove(
              currentRivalPokemon.attack,
              currentRivalPokemon.level,
              0.8,
              1,
              currentPokemon,
              currentRivalPokemon
            );
          }
        }
      }
      break;
    case "paper":
      if (cpuAttack == "paper") {
        if (currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
          // user move.
          attackMove(
            currentPokemon.attack,
            currentPokemon.level,
            0.8,
            1,
            currentRivalPokemon,
            currentPokemon
          );
          if (currentRivalPokemon.health >= 1) {
            //cpu move.
            attackMove(
              currentRivalPokemon.attack,
              currentRivalPokemon.level,
              0.8,
              1,
              currentPokemon,
              currentRivalPokemon
            );
          }
        }
      }
      if (cpuAttack == "scissors") {
        if (currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
          // user move.
          attackMove(
            currentPokemon.attack,
            currentPokemon.level,
            0.8,
            0.5,
            currentRivalPokemon,
            currentPokemon
          );
          if (currentRivalPokemon.health >= 1) {
            //cpu move.
            attackMove(
              currentRivalPokemon.attack,
              currentRivalPokemon.level,
              0.8,
              2,
              currentPokemon,
              currentRivalPokemon
            );
          }
        }
      }
      if (cpuAttack == "rock") {
        if (currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
          // user move.
          attackMove(
            currentPokemon.attack,
            currentPokemon.level,
            0.8,
            2,
            currentRivalPokemon,
            currentPokemon
          );
          if (currentRivalPokemon.health >= 1) {
            //cpu move.
            attackMove(
              currentRivalPokemon.attack,
              currentRivalPokemon.level,
              0.8,
              0.5,
              currentPokemon,
              currentRivalPokemon
            );
          }
        }
      }
      break;
    case "scissors":
      if (cpuAttack == "paper") {
        if (currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
          // user move.
          attackMove(
            currentPokemon.attack,
            currentPokemon.level,
            0.8,
            2,
            currentRivalPokemon,
            currentPokemon
          );
          if (currentRivalPokemon.health >= 1) {
            //cpu move.
            attackMove(
              currentRivalPokemon.attack,
              currentRivalPokemon.level,
              0.8,
              0.5,
              currentPokemon,
              currentRivalPokemon
            );
          }
        }
      }
      if (cpuAttack == "scissors") {
        if (currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
          // user move.
          attackMove(
            currentPokemon.attack,
            currentPokemon.level,
            0.8,
            1,
            currentRivalPokemon,
            currentPokemon
          );
          if (currentRivalPokemon.health >= 1) {
            //cpu move.
            attackMove(
              currentRivalPokemon.attack,
              currentRivalPokemon.level,
              0.8,
              1,
              currentPokemon,
              currentRivalPokemon
            );
          }
        }
      }
      if (cpuAttack == "rock") {
        if (currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
          // user move.
          attackMove(
            currentPokemon.attack,
            currentPokemon.level,
            0.8,
            2,
            currentRivalPokemon,
            currentPokemon
          );
          if (currentRivalPokemon.health >= 1) {
            //cpu move.
            attackMove(
              currentRivalPokemon.attack,
              currentRivalPokemon.level,
              0.8,
              0.5,
              currentPokemon,
              currentRivalPokemon
            );
          }
        }
      }
      break;
    // There is no need for the default case here.
  }
};

// This function will find a random number from 0 to wherever we want.
// This is saved in a global variable, but we will change this below.
// function randomNumber(min, max) {
//   return Math.floor(Math.random() * (max - min)) + min;
// }
var randomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// The CPU picks the rival pokemon using the random number generator above.
// This is saved in a global variable, but we will change this below.
// function cpuPick() {
// This is going to start at 0 and when it gets to 2 it is going to stop.
// pokemonsEl[randomNumber(0, 3)];

//   gameState.rivalPokemon = pokemonsEl[randomNumber(0, 3)].dataset.pokemon;
// }
var cpuPick = function () {
  gameState.rivalPokemon = pokemonsEl[randomNumber(0, 3)].dataset.pokemon;
};

// // pokemon
// // create data for 3 different pokemons, with their names, type, weaknesses, health, and attack moves(name, attack stat, maximum)
// var pokemons = [
//   {
//     name: "charmander",
//     type: "fire",
//     attack: 52,
//     defense: 39,
//     level: 1
//   },
//   {
//     name: "charmander",
//     type: "fire",
//     attack: 52,
//     defense: 39,
//     level: 1
//   }
// ];

// var attack = 20;
// var level = 10;
// var stack = 1.3;
// var defense = 39;

// // create a formula for attacks
// console.log((attack * level * stack) / 7);

// // create a formula for health
// //HP = 0.20 x Sqrt(Pokemon_level) x (HP_base_stat)
// console.log(0.2 * Math.sqrt(level) * defense * 15);

// // let user choose 1 and then assign a random pokemon to battle thats not the users pokemon
// // p1 vs p2

// // when one user loses all his health declare a winner
