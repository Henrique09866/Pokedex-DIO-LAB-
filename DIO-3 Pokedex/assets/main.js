
const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('LoreMoreButton')
const maxRecords = 151
const limit = 10
let offset = 0


function loadPokemonItems(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(pokemon => `
        <li class="pokemon pokemon-card ${pokemon.type}" data-id="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
                     
            </div>
        </li>
        `).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItems(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit

    const qtdRecordsNexPage = offset + limit

    if (qtdRecordsNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItems(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)

    }else {

        loadPokemonItems(offset, limit)
    }
})

pokemonList.addEventListener('click', (e) => {
    const li = e.target.closest('li[data-id]');
    if (!li) return;
    const id = li.dataset.id;
    if (!id) return;
    if (typeof openPokemonModal === 'function') {
        openPokemonModal(id);
    } else {
        window.open(`pokemon.html?id=${encodeURIComponent(id)}`, '_blank');
    }
});