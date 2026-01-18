(function () {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const root = document.getElementById('detail-root');
  if (!root) return;

  if (!id) {
    root.innerHTML = '<p>Pokémon não especificado.</p>';
    return;
  }

  root.innerHTML = '<p>Carregando...</p>';

  fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(id)}`)
    .then((res) => {
      if (!res.ok) throw new Error('Não encontrado');
      return res.json();
    })
    .then((poke) => {
      const types = (poke.types || []).map(t => t.type.name).join(', ');
      const img = (poke.sprites && (poke.sprites.other && poke.sprites.other.dream_world && poke.sprites.other.dream_world.front_default)) || poke.sprites.front_default || '';

      root.innerHTML = `
        <section class="pokemon-detail-box">
          <a class="back-link" href="index.htm">← Voltar</a>
          <div class="header">
            <h1 class="poke-name">${poke.name}</h1>
            <span class="poke-number">#${poke.id}</span>
          </div>
          <div class="detail-card">
            <div class="image-wrap">
              <img src="${img}" alt="${poke.name}">
            </div>
            <div class="info">
              <p><strong>Tipos:</strong> ${types || '—'}</p>
              <ul class="stats">
                ${poke.stats.map(s => `<li><strong>${s.stat.name}:</strong> ${s.base_stat}</li>`).join('')}
              </ul>
            </div>
          </div>
        </section>
      `;
    })
    .catch((err) => {
      console.error(err);
      root.innerHTML = '<p>Erro ao carregar Pokémon.</p>';
    });
})();
