var pokemonDB=[{name:"charmander",type:"fire",hp:39,attack:52,defense:43,level:1,img:"http://www.smogon.com/dex/media/sprites/xy/charmander.gif"},{name:"bulbasaur",type:"overgrow",hp:45,attack:49,defense:49,level:1,img:"http://www.smogon.com/dex/media/sprites/xy/bulbasaur.gif"},{name:"squirtle",type:"water",hp:44,attack:48,defense:65,level:1,img:"http://www.smogon.com/dex/media/sprites/xy/squirtle.gif"}],gameState={userPokemon:"",rivalPokemon:""};console.log(gameState);var pokemonsEl=document.querySelector(".select-screen").querySelectorAll(".character");console.log(pokemonsEl);for(var battleScreenEl=document.getElementById("battle-screen"),i=0;i<pokemonsEl.length;)pokemonsEl[i].onclick=function(){var e=this.dataset.pokemon,t=document.querySelector(".player1").getElementsByTagName("img"),o=document.querySelector(".player2").getElementsByTagName("img");gameState.userPokemon=e,cpuPick(),battleScreenEl.classList.toggle("active");var a=pokemonDB.filter((function(e){return e.name==gameState.userPokemon})),n=pokemonDB.filter((function(e){return e.name==gameState.rivalPokemon}));t[0].src=a[0].img,o[0].src=n[0].img,console.log(a)},i++;function randomNumber(e,t){return Math.floor(Math.random()*(t-e))+e}function cpuPick(){gameState.rivalPokemon=pokemonsEl[randomNumber(0,3)].dataset.pokemon}