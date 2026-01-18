const pokeApi = {}


function convertPokeApiDetailToPokemon(pokeDetail) {
  const pokemon = new Pokemon()
  pokemon.number = pokeDetail.id || pokeDetail.id || 0
  pokemon.name = pokeDetail.name || ''

  const types = (pokeDetail.types || []).map((typeSlot) => typeSlot.type.name)
  const [type] = types

  pokemon.types = types
  pokemon.type = type || 'unknown'
  pokemon.photo = (pokeDetail.sprites && pokeDetail.sprites.other && pokeDetail.sprites.other.dream_world && pokeDetail.sprites.other.dream_world.front_default)
    || (pokeDetail.sprites && pokeDetail.sprites.front_default) || ''

  return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
      .then((response) => response.json())
      .then(convertPokeApiDetailToPokemon)
}


pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    return fetch (url)

      .then((response) => response.json())
      .then((jsonBody) => jsonBody.results)
      .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
      .then((detailRequests) => Promise.all(detailRequests))
      .then((pokemonsDetails) => pokemonsDetails)
      .catch((error) => console.error(error))

}


(function(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const root = document.getElementById('detail-root');
  if (!id) { root.innerHTML = '<p>Pokémon não especificado.</p>'; return; }

  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(r => { if (!r.ok) throw r; return r.json(); })
    .then(poke => {
      root.innerHTML = `
        <section class="pokemon-detail">
          <h1>${poke.name}</h1>
          <img src="${poke.sprites.front_default}" alt="${poke.name}">
          <ul>
            <li>HP: ${poke.stats[0].base_stat}</li>
            <li>Ataque: ${poke.stats[1].base_stat}</li>
            <li>Defesa: ${poke.stats[2].base_stat}</li>
          </ul>
        </section>`;
    })
    .catch(() => { root.innerHTML = '<p>Erro ao carregar Pokémon.</p>'; });
})();