import './App.css';
import { useState } from "react";
import Axios from 'axios';

function App() {
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonChosen, setPokemonChosen] = useState(false);
  const [pokemon, setPokemon] = useState({name: "", image: "", stats: [], types: [], abilities: []});
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      document.getElementById("pkmnSubmit").click();
    } 
  }
  const searchPokemon = () => {
    Axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`).then(
      (response) => {
        setPokemon({
          name: capName(pokemonName),
          img: response.data.sprites.front_default,
          stats: response.data.stats,
          types: response.data.types,
          abilities: response.data.abilities,
          dexNum: response.data.id
        });
        setPokemonChosen(true);
    }).catch((error) => {
      console.error(error);
    });
  }

  function capName(pokeName) {
    let name = pokeName;
    let replDash = false;
    const wordArr = name.split(" ");
    let assembledName = "";
    for(let i = 0; i < wordArr.length; i++) {
      if(i > 0) {
        assembledName = assembledName + " ";
      }
      const firstLetter = wordArr[i].charAt(0).toUpperCase();
      const restName = wordArr[i].slice(1);
      assembledName = assembledName + firstLetter + restName;
    }
    if(replDash === true) {
      assembledName = assembledName.replaceAll(" ", "-");
    }
    return assembledName;
  }

  function genStatNames(poke_stats) {
    /* poke_stats.map((stat) => console.log("stat: ", stat.base_stat)); */
    const arrayItems = poke_stats.map((stat, index) => <h3 key={stat.stat.name} className={stat.stat.name}>{stat.stat.name.toUpperCase().replace("-", " ")}:</h3>);
    return arrayItems;
  }

  function genStats(poke_stats) {
    const arrayItems = poke_stats.map((stat, index) => <h3 key={stat.base_stat + index}>{stat.base_stat}</h3>);
    return arrayItems;
  }

  function genAbilities(abilities) {
    abilities.map((stat) => console.log("abilities: ", stat));
    const arrayItems = abilities.map((ability) => <h4 key={ability.ability.name}>{capName(ability.ability.name.replaceAll("-"," "))}</h4>);
    return arrayItems;
  }

  return (
    <div className="App">
      <div className="TitleSection">
        <h1>Pokemon Stats</h1>
        <input 
          id="pkmnInput"
          type="text" 
          onChange={(event) => {
            setPokemonName(event.target.value)
          }}
          onKeyDown={handleKeyDown}
          ></input>
        <button 
          id="pkmnSubmit"
          onClick={searchPokemon}>Search Pokemon</button>
      </div>
      <div className = "DisplaySection">
        {!pokemonChosen ? (
            <h1>Please choose a Pokemon</h1>
          ) : (
            <>
              <h1>#{pokemon.dexNum} - {capName(pokemon.name.toLowerCase())}</h1>
              <img className="Pokemon" src={pokemon.img} alt="Pokemon's sprite"/>
              <div className="Types">
                <img className="Type" src={"https://www.serebii.net/pokedex-bw/type/" + pokemon.types[0].type.name + ".gif"} alt ="Pokemon's type"/>
                {pokemon.types[1] && <img className="Type" src={"https://www.serebii.net/pokedex-bw/type/" + pokemon.types[1].type.name + ".gif"} alt ="Pokemon's Second type"/>}
              </div>
              <h3>Abilities</h3>
              <ul>{genAbilities(pokemon.abilities)}</ul>
              <div></div>
              <div className="StatSection">
                <div className="row">
                  <div className="column">
                    <div className="column1">
                      <ul>{genStatNames(pokemon.stats)}</ul>
                    </div>
                  </div>
                  <div className="column">
                    <div className="column2">
                      <ul>{genStats(pokemon.stats)}</ul>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
      </div>
    </div>
  );
}

export default App;
