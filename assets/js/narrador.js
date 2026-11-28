/* 7 a 0: Arena Multiverso — narrador dos logs de pré-duelo e dos atos da batalha.
   Textos determinísticos (mesmo confronto = mesmo texto em todos os aparelhos). */
(function () {
  const AREA = { est: 'Estratégia', sup: 'Suporte', ofe: 'Ataque', ovr: 'Overall' };
  const ATO = { est: 'Ato I', sup: 'Ato II', ofe: 'Ato III', ovr: 'Ato IV' };

  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return Math.abs(h);
  }
  const pick = (list, seed) => list[hash(seed) % list.length];
  const fill = (tpl, v) => tpl.replace(/\{(\w+)\}/g, (_, k) => (v[k] !== undefined ? v[k] : ''));
  const best = (rows, key) => rows.reduce((b, r) => (!b || r[key] > b[key] ? r : b), null);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const b = s => `<strong class="text-white">${s}</strong>`;

  function level(v1, v2) {
    const m = Math.abs(v1 - v2) / Math.max(v1, v2, 1);
    if (v1 === v2) return 'tie';
    if (m < 0.03) return 'close';
    if (m < 0.1) return 'solid';
    return 'rout';
  }

  function preDuel({ s1, s2, t1, t2, prob1, prob2, rows1, rows2 }) {
    const n1 = esc(s1.ownerName), n2 = esc(s2.ownerName);
    const fav = prob1 === prob2 ? 0 : (prob1 > prob2 ? 1 : 2);
    const gap = Math.abs(prob1 - prob2);
    let title;
    if (gap <= 6) title = `⚖️ Confronto acirrado — ${prob1}% x ${prob2}%`;
    else if (gap <= 30) title = `${fav === 1 ? '🔥' : '⚡'} ${fav === 1 ? n1 : n2} chega como favorito (${Math.max(prob1, prob2)}%)`;
    else title = `${fav === 1 ? '🔥' : '⚡'} Amplo favoritismo de ${fav === 1 ? n1 : n2} (${Math.max(prob1, prob2)}%)`;

    const lines = [];
    const ovrDiff = Math.abs(t1.ovr - t2.ovr);
    lines.push(ovrDiff === 0
      ? `Overall idêntico (${t1.ovr}): o encaixe das posições vai fazer a diferença.`
      : `${b(t1.ovr > t2.ovr ? n1 : n2)} soma ${ovrDiff} pontos a mais de Overall (${Math.max(t1.ovr, t2.ovr)} x ${Math.min(t1.ovr, t2.ovr)}).`);

    const keys = ['est', 'sup', 'ofe', 'ovr'];
    const lead1 = keys.filter(k => t1[k] > t2[k]);
    const lead2 = keys.filter(k => t2[k] > t1[k]);
    const areaTxt = (ks, t, o) => ks.filter(k => k !== 'ovr').map(k => `${AREA[k]} ${t[k]} x ${o[k]}`).join(', ');
    if (lead1.length) lines.push(`${b(n1)} leva vantagem em ${areaTxt(lead1, t1, t2) || 'Overall'}.`);
    if (lead2.length) lines.push(`${b(n2)} leva vantagem em ${areaTxt(lead2, t2, t1) || 'Overall'}.`);

    const tight = keys.slice(0, 3).map(k => ({ k, d: Math.abs(t1[k] - t2[k]) })).sort((x, y) => x.d - y.d)[0];
    if (tight) lines.push(`🎯 Ponto-chave: ${ATO[tight.k]} (${AREA[tight.k]}) — diferença de só ${tight.d} ponto${tight.d === 1 ? '' : 's'}.`);

    const st1 = best(rows1, 'ovr'), st2 = best(rows2, 'ovr');
    if (st1 && st2) lines.push(`⭐ Destaques: ${b(esc(st1.name))} (${st1.ovr}) por ${n1} e ${b(esc(st2.name))} (${st2.ovr}) por ${n2}.`);

    const fit = rows => rows.filter(r => r.mult === 1).length;
    const f1 = fit(rows1), f2 = fit(rows2);
    lines.push(`🧩 Encaixe: ${f1}/${rows1.length} na posição ideal em ${n1}, ${f2}/${rows2.length} em ${n2}.`);

    if (lead1.length === 4 || lead2.length === 4) {
      lines.push(`🚨 Alerta de 7 a 0: ${b(lead1.length === 4 ? n1 : n2)} lidera todos os atos no papel!`);
    }

    const html = `<ul class="space-y-1.5 list-none">${lines.map(l => `<li>${l}</li>`).join('')}</ul>`;
    return { title, html };
  }

  const TPL = {
    est: {
      rout: ['{mvp} leu o campo antes de todos e {owner} controlou o tabuleiro de ponta a ponta.', 'Aula de estratégia: {mvp} desmontou cada plano de {rival}.'],
      solid: ['{mvp} encontrou a brecha certa e colocou {owner} na frente.', 'Com {mvp} ditando o ritmo, {owner} sai em vantagem.'],
      close: ['Jogo de xadrez: {mvp} achou o lance decisivo por um detalhe, mesmo com {mvpL} resistindo.', 'Quase empate, mas a leitura de {mvp} garantiu o ato para {owner}.']
    },
    sup: {
      rout: ['{mvp} segurou o time inteiro e {rival} não conseguiu reagir.', 'Controle total: {mvp} transformou o suporte de {owner} numa muralha.'],
      solid: ['{mvp} manteve {owner} de pé nos momentos críticos.', 'O suporte de {owner}, puxado por {mvp}, fez a diferença.'],
      close: ['Por pouco! {mvp} salvou {owner} no último instante enquanto {mvpL} tentava virar.', 'Disputa apertada no controle, decidida por um movimento de {mvp}.']
    },
    ofe: {
      rout: ['{mvp} abriu caminho na força e {owner} atropelou a defesa de {rival}.', 'Impacto devastador: {mvp} não deu chance para {rival}.'],
      solid: ['{mvp} acertou os golpes certos e {owner} venceu a troca de ataques.', 'O ataque de {owner}, liderado por {mvp}, foi mais eficiente.'],
      close: ['Troca de golpes até o fim — {mvp} acertou o último, mesmo com {mvpL} no contra-ataque.', 'Ato equilibrado no ataque, decidido no detalhe por {mvp}.']
    },
    ovr: {
      rout: ['No clímax, {owner} mostrou um elenco superior e {mvp} fechou a conta.', '{mvp} liderou {owner} num clímax sem resposta de {rival}.'],
      solid: ['O conjunto de {owner} pesou no fim, com {mvp} como referência.', 'Na soma de tudo, {owner} foi mais time — e {mvp} brilhou.'],
      close: ['Clímax de tirar o fôlego: {owner} venceu por um fio, com {mvp} decisivo e {mvpL} lutando até o fim.', 'Decisão no limite! O elenco de {owner} passou na frente por detalhes.']
    },
    tie: ['Empate perfeito: {mvp1} e {mvp2} se anularam. Pontos divididos.', 'Ninguém cedeu! {mvp1} e {mvp2} terminaram o ato lado a lado.']
  };

  function act({ act: a, s1, s2, rows1, rows2 }) {
    if (!TPL[a.key]) return null;
    const lv = level(a.v1, a.v2);
    const seed = `${a.key}|${s1.ownerName}|${s2.ownerName}|${a.v1}|${a.v2}`;
    const score = `(${a.v1} x ${a.v2})`;
    if (lv === 'tie') {
      return `${fill(pick(TPL.tie, seed), { mvp1: b(esc(a.mvp1)), mvp2: b(esc(a.mvp2)) })} ${score} +${a.pts / 2} pt para cada lado.`;
    }
    const w = a.winner === 1;
    const owner = esc(w ? s1.ownerName : s2.ownerName);
    const rival = esc(w ? s2.ownerName : s1.ownerName);
    const mvpRaw = w ? a.mvp1 : a.mvp2;
    const mvp = esc(mvpRaw);
    const mvpL = esc(w ? a.mvp2 : a.mvp1);
    const rows = w ? rows1 : rows2;
    const star = rows.find(r => r.name === mvpRaw);
    let txt = fill(pick(TPL[a.key][lv], seed), { mvp: b(mvp), mvpL, owner: b(owner), rival });
    if (lv === 'rout' && star && star.feat) txt += ` <span class="text-slate-400 italic">“${esc(star.feat)}”</span>`;
    return `${txt} ${score} → +${a.pts} pts para ${owner}.`;
  }

  window.ArenaNarrador = { preDuel, act };
})();
