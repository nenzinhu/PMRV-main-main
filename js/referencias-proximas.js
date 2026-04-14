/**
 * Modulo: Referencias Proximas - Base Local 100m + 50m Perpendiculares (Sem API Externa)
 * v2.0: Suporta TODAS as rodovias + pontos perpendiculares
 */

(function() {
  window.ref_prox_init = function() {
    if (typeof gps_preencherSelects === 'function') {
      gps_preencherSelects();
    }
    window.ref_prox_atualizarReferenciaPrincipal();
  };

  window.ref_prox_toggleCat = function(btn, catId) {
    // Categorias não são mais usadas na busca local fixa de 100m,
    // mas mantemos a UI para compatibilidade futura se necessário.
    btn.classList.toggle('btn-primary');
    btn.classList.toggle('btn-outline');
  };

  window.ref_prox_togglePerp = function() {
    const checkbox = document.getElementById('ref_prox_include_perp');
    if (checkbox) {
      // Refazer a busca com nova preferência
      const rodovia = document.getElementById('ref_prox_rodovia')?.value;
      const kmManualStr = document.getElementById('ref_prox_km')?.value;
      if (rodovia) {
        window.ref_prox_buscar();
      }
    }
  };

  window.ref_prox_buscar = async function() {
    const rodovia = document.getElementById('ref_prox_rodovia').value;
    const kmManualStr = document.getElementById('ref_prox_km').value;
    const includePerp = document.getElementById('ref_prox_include_perp')?.checked || false;
    const resultsContainer = document.getElementById('ref_prox_results');
    const statusEl = document.getElementById('ref_prox_status');
    const btnBusca = document.getElementById('btn-ref-prox-buscar');

    if (!rodovia) {
      alert('Selecione uma rodovia primeiro.');
      return;
    }

    let kmManual = -1;
    if (kmManualStr) {
      kmManual = parseFloat(kmManualStr.replace(',', '.'));
      if (isNaN(kmManual)) kmManual = -1;
    }

    btnBusca.disabled = true;
    btnBusca.innerText = 'Buscando Local...';
    resultsContainer.innerHTML = '';
    statusEl.innerText = 'Consultando base local de 100 metros...';

    // Simular delay para feedback visual
    await new Promise(r => setTimeout(r, 400));

    try {
      const results = getLocalReferences(rodovia, kmManual, includePerp);
      renderLocalResults(results, rodovia, kmManual, includePerp);
      statusEl.innerText = `Encontrados ${results.length} pontos de referência na base local.`;
    } catch (error) {
      console.error(error);
      statusEl.innerText = 'Erro na busca: ' + error.message;
      resultsContainer.innerHTML = `<p style="color:red; text-align:center;">${error.message}</p>`;
    } finally {
      btnBusca.disabled = false;
      btnBusca.innerText = 'Buscar ao longo da rota';
    }
  };

  function getLocalReferences(roadName, startKm = -1, includePerp = false) {
    // ⭐ Suporta AMBOS os nomes de variáveis globais
    const allRefs = window.GRANDE_FLORIANOPOLIS_REFERENCIAS?.rows || 
                    window.GRANDE_FLORIANOPOLIS_REFERENCIAS_100M?.rows || [];
    
    // Filtrar pela rodovia
    let filtered = allRefs.filter(r => r.rodovia === roadName);
    
    // Se não incluir perpendiculares, remover
    if (!includePerp) {
      filtered = filtered.filter(r => r.offset_m === 0 || r.offset_m === undefined);
    }
    
    if (startKm >= 0) {
      // Mostrar referências PRÓXIMAS (2km para trás e 3km para frente para dar contexto)
      filtered = filtered.filter(r => r.km >= (startKm - 2.0) && r.km <= (startKm + 3.0));
      // Ordenar por proximidade absoluta ao KM informado
      filtered.sort((a, b) => Math.abs(a.km - startKm) - Math.abs(b.km - startKm));
    } else {
      // Ordenar por KM
      filtered.sort((a, b) => a.km - b.km);
    }
    
    return filtered;
  }

  function formatKmLabel(value) {
    if (value === null || value === undefined || value === '') return '';
    if (typeof value === 'string') return value.replace('.', ',');
    return Number(value).toFixed(3).replace('.', ',');
  }

  function buildSearchReferenceHeader(roadName, startKm, includePerp, totalRefs) {
    if (!roadName) {
      return `
        <div class="card" style="border:1px dashed var(--border); background:rgba(255,255,255,0.02);">
          <div style="font-size:11px; font-weight:800; letter-spacing:.6px; text-transform:uppercase; color:var(--primary);">Referência Operacional Local</div>
          <div style="margin-top:6px; font-size:16px; font-weight:900; color:var(--text);">Aguardando seleção de rodovia</div>
          <div style="margin-top:4px; font-size:12px; color:var(--label);">A base local contém marcos georreferenciados a cada 100 metros na Grande Florianópolis${includePerp ? ' + pontos perpendiculares' : ''}.</div>
        </div>
      `;
    }

    const kmInfo = startKm >= 0
      ? `${roadName} km ${formatKmLabel(startKm)} (Próximos 5km)`
      : `${roadName} - Rodovia Completa (${totalRefs} pontos)`;

    const badge = includePerp 
      ? 'MARCO 100M + PERPENDICULARES'
      : 'MARCO 100M';

    return `
      <div class="card" style="border:1px solid rgba(249, 115, 22, 0.24); background:linear-gradient(180deg, rgba(249, 115, 22, 0.10), rgba(255,255,255,0.02));">
        <div style="font-size:11px; font-weight:800; letter-spacing:.6px; text-transform:uppercase; color:var(--primary);">${badge}</div>
        <div style="margin-top:6px; font-size:18px; font-weight:900; color:var(--text);">${kmInfo}</div>
        <div style="margin-top:4px; font-size:12px; color:var(--label);">Dados validados${includePerp ? ' com pontos perpendiculares a 50m do domínio' : ''} com coordenadas GPS e descrições operacionais.</div>
      </div>
    `;
  }

  window.ref_prox_atualizarReferenciaPrincipal = function(roadName, startKm) {
    const rodovia = roadName !== undefined ? roadName : document.getElementById('ref_prox_rodovia')?.value;
    const kmRaw = startKm !== undefined ? startKm : document.getElementById('ref_prox_km')?.value;
    const includePerp = document.getElementById('ref_prox_include_perp')?.checked || false;
    let km = -1;

    if (typeof kmRaw === 'number') {
      km = kmRaw;
    } else if (kmRaw) {
      km = parseFloat(String(kmRaw).replace(',', '.'));
      if (isNaN(km)) km = -1;
    }

    const container = document.getElementById('ref_prox_results');
    if (!container) return;
    
    const allRefs = window.GRANDE_FLORIANOPOLIS_REFERENCIAS?.rows || 
                    window.GRANDE_FLORIANOPOLIS_REFERENCIAS_100M?.rows || [];
    const roadRefs = allRefs.filter(r => r.rodovia === (rodovia || ''));
    
    container.innerHTML = buildSearchReferenceHeader(rodovia || '', km, includePerp, roadRefs.length);
  };

  function renderLocalResults(results, roadName, startKm, includePerp) {
    const container = document.getElementById('ref_prox_results');

    if (results.length === 0) {
      container.innerHTML = `<div class="card" style="text-align:center; padding:20px; color:var(--muted);">Nenhum ponto encontrado para esta rodovia/km na base local.</div>`;
      return;
    }

    const allRefs = window.GRANDE_FLORIANOPOLIS_REFERENCIAS?.rows || 
                    window.GRANDE_FLORIANOPOLIS_REFERENCIAS_100M?.rows || [];
    const roadRefs = allRefs.filter(r => r.rodovia === roadName);

    container.innerHTML = buildSearchReferenceHeader(roadName, startKm, includePerp, roadRefs.length);

    // ⭐ Agrupar por tipo para melhor visualização
    const principais = results.filter(r => r.offset_m === 0 || r.offset_m === undefined);
    const perpendiculares = results.filter(r => r.offset_m === 50);

    // Renderizar principais
    if (principais.length > 0) {
      const header = document.createElement('div');
      header.style.cssText = `
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--primary);
        margin-top: 16px;
        margin-bottom: 8px;
        letter-spacing: 0.5px;
      `;
      header.innerHTML = `🔴 ${principais.length} Ponto(s) Principal(is)`;
      container.appendChild(header);

      principais.forEach(ref => {
        container.appendChild(createReferenceCard(ref));
      });
    }

    // Renderizar perpendiculares
    if (perpendiculares.length > 0) {
      const header = document.createElement('div');
      header.style.cssText = `
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        color: #6366f1;
        margin-top: 16px;
        margin-bottom: 8px;
        letter-spacing: 0.5px;
      `;
      header.innerHTML = `🔵 ${perpendiculares.length} Ponto(s) Perpendicular(es) (+50m)`;
      container.appendChild(header);

      perpendiculares.forEach(ref => {
        container.appendChild(createReferenceCard(ref, true));
      });
    }
  }

  function createReferenceCard(ref, isPerp = false) {
    const card = document.createElement('div');
    card.className = 'poi-card';
    
    const badgeColor = isPerp ? '#6366f1' : 'rgba(249, 115, 22, 1)';
    const badgeText = isPerp 
      ? `PERPENDICULAR ${ref.direcao.toUpperCase()}`
      : 'MARCO 100M';

    card.style = `
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 12px;
      border-left: 4px solid ${badgeColor};
    `;

    const googleMapsUrl = `https://www.google.com/maps?q=${ref.latitude},${ref.longitude}`;

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
        <strong style="font-size:16px; color:var(--text);">${ref.rodovia} KM ${ref.km_label || formatKmLabel(ref.km)}</strong>
        <span style="font-size:10px; padding:2px 6px; border-radius:4px; background:rgba(${isPerp ? '99, 102, 241' : '249, 115, 22'}, 0.1); color:${badgeColor}; font-weight:700;">${badgeText}</span>
      </div>
      
      <div style="font-size:13px; color:var(--text); font-weight:600;">
        ${ref.nome_local || ref.descricao}
      </div>

      <div style="font-size:12px; color:var(--muted); line-height:1.4;">
        ${ref.descricao}${isPerp ? `<br><span style="color:#6366f1;">⊥ Offset: +${ref.offset_m}m (${ref.direcao})</span>` : ''}
      </div>

      <div style="font-size:11px; font-family:monospace; color:var(--label); background:rgba(0,0,0,0.1); padding:8px; border-radius:4px;">
        LAT: ${ref.latitude.toFixed(6)} | LON: ${ref.longitude.toFixed(6)}
      </div>

      <div style="display:grid; grid-template-columns: 1fr; gap:8px; margin-top:8px;">
        <button class="btn btn-sm btn-primary" style="width:100%;" onclick="window.open('${googleMapsUrl}', '_blank')">📍 Abrir no Google Maps</button>
      </div>
    `;
    
    return card;
  }

  const originalGo = window.go;
  window.go = function(screenId) {
    if (originalGo) originalGo(screenId);
    if (screenId === 'referencias-proximas') {
      ref_prox_init();
    }
  };
})();

