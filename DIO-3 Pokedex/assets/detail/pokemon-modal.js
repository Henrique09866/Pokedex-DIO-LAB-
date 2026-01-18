(function () {
  // Expose global function openPokemonModal(id)
  function createModalIfNeeded() {
    let modal = document.getElementById('pokemon-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'pokemon-modal';
      document.body.appendChild(modal);
    }
    return modal;
  }

  function closeModal() {
    const modal = document.getElementById('pokemon-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.innerHTML = '';
    document.body.classList.remove('modal-open');
    modal.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', onKeyDown);
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') closeModal();
  }

  function openPokemonModal(id) {
    const modal = createModalIfNeeded();
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    modal.innerHTML = '<div class="pm-loading">Carregando...</div>';

    // Fetch data directly from PokeAPI by id
    fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(id)}`)
      .then(res => { if (!res.ok) throw new Error('Não encontrado'); return res.json(); })
      .then(poke => {
        const types = (poke.types || []).map(t => t.type.name).join(', ');
        const img = (poke.sprites && (poke.sprites.other && poke.sprites.other.dream_world && poke.sprites.other.dream_world.front_default)) || poke.sprites.front_default || '';

        modal.innerHTML = `
          <div class="pm-overlay" tabindex="-1">
            <div class="pm-dialog" role="dialog" aria-modal="true">
              <button class="pm-close" aria-label="Fechar">×</button>
              <div class="pm-header">
                <h2 class="pm-name">${poke.name}</h2>
                <span class="pm-number">#${poke.id}</span>
              </div>
              <div class="pm-body">
                <div class="pm-image"><img src="${img}" alt="${poke.name}"></div>
                <div class="pm-info">
                  <p><strong>Tipos:</strong> ${types || '—'}</p>
                  <ul class="pm-stats">
                    ${poke.stats.map(s => `<li><strong>${s.stat.name}:</strong> ${s.base_stat}</li>`).join('')}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        `;

        // events
        const closeBtn = modal.querySelector('.pm-close');
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        const overlay = modal.querySelector('.pm-overlay');
        if (overlay) overlay.addEventListener('click', (ev) => {
          if (ev.target.classList.contains('pm-overlay')) closeModal();
        });
        document.addEventListener('keydown', onKeyDown);
      })
      .catch(err => {
        console.error(err);
        modal.innerHTML = '<div class="pm-error">Erro ao carregar. <button class="pm-close">Fechar</button></div>';
        const closeBtn = modal.querySelector('.pm-close');
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
      });
  }

  // expose globally
  window.openPokemonModal = openPokemonModal;
  window.closePokemonModal = closeModal;
})();
