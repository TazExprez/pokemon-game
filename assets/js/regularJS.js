// This keeps track of the state.
var gameState = {
  userPokemon: "",

  rivalPokemon: "",

  // This is the database.
  pokemonDB: [
    {
      name: "charmander",
      type: "fire",
      hp: 39,
      attack: 52,
      defense: 43,
      level: 1,
      img: "/img/charmander.gif"
    },
    {
      name: "bulbasaur",
      type: "overgrow",
      hp: 45,
      attack: 49,
      defense: 49,
      level: 1,
      img: "/img/bulbasaur.gif"
    },
    {
      name: "squirtle",
      type: "water",
      hp: 44,
      attack: 48,
      defense: 65,
      level: 1,
      img: "/img/squirtle.gif"
    }
  ],

  elements: {
    pokemonsEl: document
      .querySelector(".select-screen")
      .querySelectorAll(".character"),
    battleScreenEl: document.getElementById("battle-screen"),
    attackBtnsEl: document
      .getElementById("battle-screen")
      .querySelectorAll(".attack"),

    winnerScreenEl: document.getElementById("winner-screen"),
    winnerNameEl: document.querySelector(".winner-name"),
    winnerImgEl: document
      .querySelector(".winner-pokemon")
      .getElementsByTagName("img")
  },

  init: function () {
    // This is the initial loop that assigns an onclick event function to each pokemon element.
    var i = 0;
    while (i < gameState.elements.pokemonsEl.length) {
      // This adds a function to all characters on the select screen.
      gameState.elements.pokemonsEl[i].onclick = function () {
        // Here you get the name of the currently selected pokemon and assign it to a variable that will be used to give the game state a value.
        var pokemonName = this.dataset.pokemon;

        // Here you are selecting the Pokemon's name in the health bar.
        var player1StatsName = document
          .querySelector(".player1")
          .querySelector(".stats")
          .querySelector(".name")
          .getElementsByTagName("span");
        var player2StatsName = document
          .querySelector(".player2")
          .querySelector(".stats")
          .querySelector(".name")
          .getElementsByTagName("span");

        var player1StatsLevel = document
          .querySelector(".player1")
          .querySelector(".stats")
          .querySelector(".name")
          .querySelector(".level");
        var player2StatsLevel = document
          .querySelector(".player2")
          .querySelector(".stats")
          .querySelector(".name")
          .querySelector(".level");

        // Here you are selecting the elements for the images on the battle screen.  You will manipulate these elements and potentially change the images after the Pokemon are chosen by you and the CPU.  You will directly choose your pokemon, while the CPU will randomly select its pokemon.
        var player1Img = document
          .querySelector(".player1")
          .getElementsByTagName("img");
        var player2Img = document
          .querySelector(".player2")
          .getElementsByTagName("img");

        // Here we save the current pokemon to the userPokemon property of the gameState state object.
        gameState.userPokemon = pokemonName;

        // This is the function used for the CPU to randomly select the rival pokemon.
        gameState.cpuPick();

        // This changes the screen to the battle scene.
        gameState.elements.battleScreenEl.classList.toggle("active");

        // This selects the data for the current user pokemon object.  Here you are specifically getting an object from the gameState.pokemonDB database array and assigning it to the currentPokemon array.
        gameState.currentPokemon = gameState.pokemonDB.filter(function (
          pokemon
        ) {
          return pokemon.name == gameState.userPokemon;
        });

        // Here you are setting the Pokemon name in the health bar.
        player1StatsName[0].innerHTML = gameState.currentPokemon[0].name;
        player1StatsName[0].innerHTML =
          player1StatsName[0].innerHTML.charAt(0).toUpperCase() +
          player1StatsName[0].innerHTML.slice(1);

        // Here you are setting the Pokemon level in the health bar.
        player1StatsLevel.innerHTML =
          "Lvl:" + gameState.currentPokemon[0].level;

        // Here you are setting the image for the user pokemon from the object inside the currentPokemon array.
        player1Img[0].src = gameState.currentPokemon[0].img;

        // This selects the data for the current cpu pokemon object.  Here you are specifically getting an object from the gameState.pokemonDB database array and assigning it to the currentRivalPokemon array.
        gameState.currentRivalPokemon = gameState.pokemonDB.filter(function (
          pokemon
        ) {
          return pokemon.name == gameState.rivalPokemon;
        });

        // Here you are setting the Pokemon name in the health bar.
        player2StatsName[0].innerHTML = gameState.currentRivalPokemon[0].name;
        player2StatsName[0].innerHTML =
          player2StatsName[0].innerHTML.charAt(0).toUpperCase() +
          player2StatsName[0].innerHTML.slice(1);

        // Here you are setting the Pokemon level in the health bar.
        player2StatsLevel.innerHTML =
          "Lvl:" + gameState.currentRivalPokemon[0].level;

        // Here you are setting the image for the cpu pokemon from the object inside the currentRivalPokemon array.
        player2Img[0].src = gameState.currentRivalPokemon[0].img;

        // current user and cpu pokemon initial health.
        gameState.currentPokemon[0].health = gameState.calculateInitialHealth(
          gameState.currentPokemon
        );
        gameState.currentPokemon[0].originalHealth = gameState.calculateInitialHealth(
          gameState.currentPokemon
        );

        gameState.currentRivalPokemon[0].health = gameState.calculateInitialHealth(
          gameState.currentRivalPokemon
        );
        gameState.currentRivalPokemon[0].originalHealth = gameState.calculateInitialHealth(
          gameState.currentRivalPokemon
        );
      };

      i++;
    }

    var a = 0;
    while (a < gameState.elements.attackBtnsEl.length) {
      gameState.elements.attackBtnsEl[a].onclick = function () {
        var attackName = this.dataset.attack;

        gameState.currentUserAttack = attackName;

        gameState.play(attackName, gameState.cpuAttack());
      };

      a++;
    }
  },

  cpuAttack: function () {
    var attacks = ["rock", "paper", "scissors"];

    return attacks[gameState.randomNumber(0, 3)];
  },

  calculateInitialHealth: function (user) {
    return 0.2 * Math.sqrt(user[0].level) * user[0].defense * user[0].hp;
  },

  attackMove: function (attack, level, stack, critical, enemy, attacker) {
    var attackAmount = attack * level * (stack + critical);

    enemy.health = enemy.health - attackAmount;

    var userHP = document
      .querySelector(".player1")
      .querySelector(".stats")
      .querySelector(".health")
      .querySelector(".health-bar")
      .querySelector(".inside");

    var cpuHP = document
      .querySelector(".player2")
      .querySelector(".stats")
      .querySelector(".health")
      .querySelector(".health-bar")
      .querySelector(".inside");

    // If enemy.owner == 'user', then we are going to bring down the health of the user visually.  We are already bringing down the health in the background with the other code in the attackmove function.
    if (enemy.owner == "user") {
      var minusPercent = (enemy.health * 100) / enemy.originalHealth;

      userHP.style.width = (minusPercent < 0 ? 0 : minusPercent) + "%";
    } else {
      var minusPercent = (enemy.health * 100) / enemy.originalHealth;

      cpuHP.style.width = (minusPercent < 0 ? 0 : minusPercent) + "%";
    }

    gameState.checkWinner(enemy, attacker);
  },

  checkWinner: function (enemy, attacker) {
    if (enemy.health <= 0) {
      // This displays the winner's name.
      gameState.elements.winnerNameEl.innerHTML = attacker.name;

      // This displays the winner's image.
      gameState.elements.winnerImgEl[0].src = attacker.img;

      // This shows the background for the winner.
      gameState.elements.winnerScreenEl.classList.toggle("active");
    }
  },

  // This function will find a random number from 0 to wherever we want.
  randomNumber: function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  },

  // The CPU picks the rival pokemon using the random number generator above.
  cpuPick: function () {
    do {
      gameState.rivalPokemon =
        gameState.elements.pokemonsEl[
          gameState.randomNumber(0, 3)
        ].dataset.pokemon;
    } while (gameState.userPokemon == gameState.rivalPokemon);
  },

  play: function (userAttack, cpuAttack) {
    var currentPokemon = gameState.currentPokemon[0];
    var currentRivalPokemon = gameState.currentRivalPokemon[0];
    // The reason we are creating and adding the two properties below is so that we know who is doing the attacking in the attackMove function.
    currentPokemon.owner = "user";
    currentRivalPokemon.owner = "cpu";

    switch (userAttack) {
      case "rock":
        if (cpuAttack == "paper") {
          if (currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
            // user move.
            gameState.attackMove(
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
              gameState.attackMove(
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
            gameState.attackMove(
              currentPokemon.attack,
              currentPokemon.level,
              0.8,
              2,
              currentRivalPokemon,
              currentPokemon
            );
            if (currentRivalPokemon.health >= 1) {
              //cpu move.
              gameState.attackMove(
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
            gameState.attackMove(
              currentPokemon.attack,
              currentPokemon.level,
              0.8,
              1,
              currentRivalPokemon,
              currentPokemon
            );
            if (currentRivalPokemon.health >= 1) {
              //cpu move.
              gameState.attackMove(
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
            gameState.attackMove(
              currentPokemon.attack,
              currentPokemon.level,
              0.8,
              1,
              currentRivalPokemon,
              currentPokemon
            );
            if (currentRivalPokemon.health >= 1) {
              //cpu move.
              gameState.attackMove(
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
            gameState.attackMove(
              currentPokemon.attack,
              currentPokemon.level,
              0.8,
              0.5,
              currentRivalPokemon,
              currentPokemon
            );
            if (currentRivalPokemon.health >= 1) {
              //cpu move.
              gameState.attackMove(
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
            gameState.attackMove(
              currentPokemon.attack,
              currentPokemon.level,
              0.8,
              2,
              currentRivalPokemon,
              currentPokemon
            );
            if (currentRivalPokemon.health >= 1) {
              //cpu move.
              gameState.attackMove(
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
            gameState.attackMove(
              currentPokemon.attack,
              currentPokemon.level,
              0.8,
              2,
              currentRivalPokemon,
              currentPokemon
            );
            if (currentRivalPokemon.health >= 1) {
              //cpu move.
              gameState.attackMove(
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
            gameState.attackMove(
              currentPokemon.attack,
              currentPokemon.level,
              0.8,
              1,
              currentRivalPokemon,
              currentPokemon
            );
            if (currentRivalPokemon.health >= 1) {
              //cpu move.
              gameState.attackMove(
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
            gameState.attackMove(
              currentPokemon.attack,
              currentPokemon.level,
              0.8,
              2,
              currentRivalPokemon,
              currentPokemon
            );
            if (currentRivalPokemon.health >= 1) {
              //cpu move.
              gameState.attackMove(
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
  }
};
gameState.init();

var arrowUp = document.querySelector(".arrow-up");
var arrowDown = document.querySelector(".arrow-down");
var pokemonArray = document.querySelectorAll(".character");
var currentPokemonSlot = 0;
// This function removes a pokemon from the select screen.
var removePokemon = function () {
  pokemonArray[currentPokemonSlot].style.setProperty("display", "none");
};
// This function adds a pokemon to the select screen.
var displayPokemon = function () {
  pokemonArray[currentPokemonSlot].style.setProperty("display", "flex");
};

// This function is basically a carousel that will display or remove a pokemon on the screen when you press the up arrow or the down arrow.  All of the pokemon are in an array and will appear or disappear in order, both backwards and forwards.
var selectPokemonMobile = function (direction) {
  if (direction === "up") {
    if (currentPokemonSlot === 0) {
      removePokemon();
      currentPokemonSlot = pokemonArray.length - 1;
      displayPokemon();
    } else {
      removePokemon();
      currentPokemonSlot -= 1;
      displayPokemon();
    }
  } else {
    if (currentPokemonSlot === pokemonArray.length - 1) {
      removePokemon();
      currentPokemonSlot = 0;
      displayPokemon();
    } else {
      removePokemon();
      currentPokemonSlot += 1;
      displayPokemon();
    }
  }
};

// This function will display all of the pokemon on the select screen together, if the screen width is at least 768 pixels.  If the width is less than 768 pixels, only one pokemon will be displayed at a time, starting with Charmander as the default pokemon.
var pokemonNotMobile = function () {
  if (window.innerWidth >= 768) {
    for (var i = 0; i < pokemonArray.length; i++) {
      pokemonArray[i].style.setProperty("display", "flex");
    }
  } else {
    for (var i = 0; i < pokemonArray.length; i++) {
      if (i === 0) {
        pokemonArray[i].style.setProperty("display", "flex");
      } else {
        pokemonArray[i].style.setProperty("display", "none");
      }
    }
  }
};

// The following two event listeners contain functions inside of anonymous functions because the functions have arguments.
arrowUp.addEventListener("click", function () {
  selectPokemonMobile("up");
});
arrowDown.addEventListener("click", function () {
  selectPokemonMobile("down");
});

window.addEventListener("resize", pokemonNotMobile);
