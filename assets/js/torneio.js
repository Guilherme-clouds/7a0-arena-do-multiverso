/* 7 a 0: Arena Multiverso — Copa do Multiverso (mata-mata):
   lobby só inicia com todos prontos, timer de escolha no draft e batalhas ao vivo no chaveamento. */
(function () {
  const PICK_SECONDS = 20;   // tempo por escolha no draft do mata-mata
  const INTRO_MS = 3000;     // análise pré-duelo antes do 1º ato
  const ACT_MS = 2500;       // intervalo entre os atos da batalha
  const LIVE_WINDOW_MS = 90000;

  let ctx = null;
  const T = {
    pickKey: null, deadline: 0, pickTimer: null, autoBusy: false,
    seenMatches: new Set(), firstBracketView: true, watching: null, liveTimer: null, liveSig: '',
    autoStartTimer: null
  };

  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const cleanName = s => String(s == null ? '' : s).replace(/[<>"'`&\\]/g, '').trim().slice(0, 24);

  function init(c) { ctx = c; }

  // ---------- Higiene dos dados vindos da sala online ----------
  function cleanRoom(t, prevParts) {
    (t.participants || []).forEach((p, i) => {
      if (!p) return;
      p.name = cleanName(p.name) || `Vaga #${i + 1}`;
      if (p.squad) p.squad.ownerName = cleanName(p.squad.ownerName) || p.name;
      const prev = prevParts && prevParts[i];
      // Não deixa um snapshot atrasado apagar picks que este aparelho acabou de fazer
      if (prev && prev.playerId === ctx.localSessionId && p.playerId === ctx.localSessionId) {
        const cPrev = ctx.getSquadTotals(prev.squad).count, cNew = ctx.getSquadTotals(p.squad).count;
        if (cPrev > cNew) { p.squad = prev.squad; p.draftProgress = prev.draftProgress; }
      }
    });
  }

  // ---------- Lobby ----------
  function lobbyStatus(t) {
    const parts = t.participants || [];
    const players = parts.filter(p => p.occupantType === 'PLAYER');
    const empty = parts.filter(p => p.occupantType === 'EMPTY').length;
    const ready = players.filter(p => p.ready).length;
    let reason = '';
    if (!players.length) reason = 'Assuma pelo menos 1 vaga para começar.';
    else if (empty) reason = `Ainda há ${empty} vaga(s) aberta(s): espere os amigos entrarem ou complete com bots.`;
    else if (ready < players.length) reason = `Aguardando ${players.length - ready} jogador(es) marcar(em) Pronto.`;
    const canStart = !reason;
    const html = `<div class="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-bold ${canStart ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'}">
      ${canStart ? '✅ Todos prontos! Os drafts começam automaticamente…' : `⏳ ${ready}/${players.length} prontos • ${esc(reason)}`}
    </div>`;
    return { canStart, reason, html, ready, total: players.length };
  }

  function isLeader(t) {
    const first = (t.participants || []).find(p => p.occupantType === 'PLAYER');
    return !!first && first.playerId === ctx.localSessionId;
  }

  function handleAutoStart() {
    const s = ctx.state, t = s.tournament;
    const onLobby = s.screen === 'TOURNAMENT' && t && t.phase === 'LOBBY';
    if (!onLobby || !lobbyStatus(t).canStart || !isLeader(t)) {
      if (T.autoStartTimer) { clearTimeout(T.autoStartTimer); T.autoStartTimer = null; }
      return;
    }
    if (T.autoStartTimer) return;
    ctx.showToast('Todos prontos! Drafts começam em 3 segundos…', 'success');
    T.autoStartTimer = setTimeout(() => {
      T.autoStartTimer = null;
      const t2 = ctx.state.tournament;
      if (ctx.state.screen === 'TOURNAMENT' && t2.phase === 'LOBBY' && lobbyStatus(t2).canStart) ctx.launchDrafts();
    }, 3000);
  }

  // ---------- Timer de escolha no draft ----------
  function timerBox() {
    const s = ctx && ctx.state;
    if (!s || s.mode !== 'TOURNAMENT_DRAFT') return '';
    return `<div class="rounded-2xl bg-slate-950/90 border border-slate-800 px-4 py-3 flex items-center gap-4">
      <div class="font-display text-xs font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">⏱️ Tempo da escolha</div>
      <div class="flex-1 h-3 rounded-full bg-slate-800 overflow-hidden"><div id="pick-timer-bar" class="h-full bg-emerald-500 transition-all duration-200" style="width:100%"></div></div>
      <div id="pick-timer-text" class="font-display text-lg font-black text-emerald-300 w-12 text-right">${PICK_SECONDS}s</div>
    </div>`;
  }

  function bestAutoPick() {
    const s = ctx.state, squad = s.squads[s.activeDraftPlayer];
    const free = squad.slots.map((sl, i) => ({ sl, i })).filter(x => !x.sl.charId);
    const opts = s.draft.selectedCharId ? [ctx.CHAR_MAP[s.draft.selectedCharId]] : s.draft.options;
    let best = null;
    opts.filter(ch => ch && !ctx.getCardLockReason(ch)).forEach(ch => {
      free.forEach(({ sl, i }) => {
        const ovr = ctx.computeSlotEffectiveStats(ch, sl.role).ovr;
        if (!best || ovr > best.ovr) best = { ch, i, ovr };
      });
    });
    return best;
  }

  function autoPick() {
    const s = ctx.state;
    if (T.autoBusy || s.screen !== 'DRAFT' || s.mode !== 'TOURNAMENT_DRAFT') return;
    if (s.draft.spinning) return; // espera a roleta terminar
    if (s.draft.awaitingSpin) { T.autoBusy = true; ctx.spinEraRoulette(false); setTimeout(() => { T.autoBusy = false; autoPick(); }, 1800); return; }
    let pick = bestAutoPick();
    if (!pick) { // todos os cards bloqueados: sorteia outra obra
      const eras = Object.keys(ctx.ERAS);
      ctx.dealDraftOptionsForEra(eras[Math.floor(Math.random() * eras.length)]);
      pick = bestAutoPick();
      if (!pick) return;
    }
    ctx.showToast(`⏱️ Tempo esgotado! ${pick.ch.name} foi escalado automaticamente.`, 'warning');
    s.draft.selectedCharId = pick.ch.id;
    ctx.assignSelectedCardToSlot(pick.i);
  }

  function tickPick() {
    const s = ctx.state;
    if (s.screen !== 'DRAFT' || s.mode !== 'TOURNAMENT_DRAFT') { stopPick(); return; }
    const left = Math.max(0, T.deadline - Date.now());
    const sec = Math.ceil(left / 1000);
    const bar = document.getElementById('pick-timer-bar');
    const txt = document.getElementById('pick-timer-text');
    if (bar && txt) {
      const pct = (left / (PICK_SECONDS * 1000)) * 100;
      bar.style.width = pct + '%';
      const color = sec <= 5 ? 'bg-rose-500' : (sec <= 10 ? 'bg-amber-400' : 'bg-emerald-500');
      bar.className = `h-full ${color} transition-all duration-200`;
      txt.textContent = sec + 's';
      txt.className = `font-display text-lg font-black w-12 text-right ${sec <= 5 ? 'text-rose-400 animate-pulse' : (sec <= 10 ? 'text-amber-300' : 'text-emerald-300')}`;
    }
    if (left <= 0) autoPick();
  }

  function stopPick() { if (T.pickTimer) { clearInterval(T.pickTimer); T.pickTimer = null; } T.pickKey = null; }

  function handlePickTimer() {
    const s = ctx.state;
    if (s.screen !== 'DRAFT' || s.mode !== 'TOURNAMENT_DRAFT') { stopPick(); return; }
    const key = `${s.tournament.targetSlotIndex}-${s.draft.round}`;
    if (key !== T.pickKey) { T.pickKey = key; T.deadline = Date.now() + PICK_SECONDS * 1000; T.autoBusy = false; }
    if (!T.pickTimer) T.pickTimer = setInterval(tickPick, 200);
    tickPick();
  }

  // ---------- Batalhas ao vivo no chaveamento ----------
  function findMatch(id) {
    const rounds = ctx.state.tournament.rounds || [];
    for (let r = 0; r < rounds.length; r++) for (let m = 0; m < rounds[r].length; m++) if (rounds[r][m].id === id) return { m: rounds[r][m], r, i: m };
    return null;
  }

  function watch(id) {
    T.watching = { id, localStart: Date.now() };
    T.seenMatches.add(id);
    startLiveTimer();
    ctx.render();
    setTimeout(() => document.getElementById('live-match-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  }

  function closeLive() { T.watching = null; stopLiveTimer(); ctx.render(); }

  function liveProgress() {
    if (!T.watching) return null;
    const f = findMatch(T.watching.id);
    if (!f || !f.m.winner || !f.m.p1 || !f.m.p2) return null;
    const res = ctx.simulateFullBattleActs(f.m.p1.squad, f.m.p2.squad);
    const el = Date.now() - T.watching.localStart;
    const shown = el < INTRO_MS ? 0 : Math.min(res.acts.length, Math.floor((el - INTRO_MS) / ACT_MS) + 1);
    const done = el >= INTRO_MS + res.acts.length * ACT_MS;
    return { f, res, shown, done };
  }

  function isPlaying(id) {
    if (!T.watching || T.watching.id !== id) return false;
    const p = liveProgress();
    return !!p && !p.done;
  }

  function startLiveTimer() {
    if (T.liveTimer) return;
    T.liveTimer = setInterval(() => {
      const p = liveProgress();
      if (!p) { stopLiveTimer(); return; }
      const sig = `${T.watching.id}|${p.shown}|${p.done}`;
      if (sig !== T.liveSig) { T.liveSig = sig; if (ctx.state.screen === 'TOURNAMENT') ctx.render(); }
      if (p.done) stopLiveTimer();
    }, 200);
  }
  function stopLiveTimer() { if (T.liveTimer) { clearInterval(T.liveTimer); T.liveTimer = null; } }

  function handleLiveMatches() {
    const s = ctx.state, t = s.tournament;
    if (s.screen !== 'TOURNAMENT' || !t || t.phase !== 'BRACKET') return;
    const all = (t.rounds || []).flat();
    if (T.firstBracketView) {
      T.firstBracketView = false;
      all.forEach(m => { if (m.winner && !(m.startedAt && Date.now() - m.startedAt < 15000)) T.seenMatches.add(m.id); });
    }
    const fresh = all.find(m => m.winner && m.startedAt && !T.seenMatches.has(m.id) && Date.now() - m.startedAt < LIVE_WINDOW_MS);
    if (fresh && !(T.watching && isPlaying(T.watching.id))) setTimeout(() => watch(fresh.id), 0);
    else all.forEach(m => { if (m.winner) T.seenMatches.add(m.id); });
  }

  function revealed(r, i) {
    const m = ctx.state.tournament.rounds[r][i];
    if (!m || !m.winner) return false;
    if (isPlaying(m.id)) return false;
    return true;
  }

  function sideLabel(r, i, side) {
    // Na rodada seguinte, só mostra quem avançou depois que a batalha de origem terminou de passar
    if (r === 0) return null;
    const src = i * 2 + (side === 1 ? 0 : 1);
    return revealed(r - 1, src) ? null : 'A definir…';
  }

  function scoreAt(acts, n) {
    let a = 0, b = 0;
    acts.slice(0, n).forEach(x => { if (x.winner === 1) a += x.pts; else if (x.winner === 2) b += x.pts; else { a += x.pts / 2; b += x.pts / 2; } });
    return [a, b];
  }

  function renderLivePanel() {
    const p = liveProgress();
    if (!p) return '';
    const { f, res, shown, done } = p;
    const s1 = f.m.p1.squad, s2 = f.m.p2.squad;
    const n1 = esc(f.m.p1.name), n2 = esc(f.m.p2.name);
    const an = ctx.analyzeMatchup(s1, s2);
    const [c1, c2] = scoreAt(res.acts, shown);
    const next = !done && shown < res.acts.length ? res.acts[shown] : null;
    const winnerName = res.winner === 1 ? n1 : n2;
    const t1 = ctx.getSquadTotals(s1), t2 = ctx.getSquadTotals(s2);
    return `
      <div id="live-match-panel" class="rounded-3xl bg-surface border-2 ${done ? 'border-emerald-500/60' : 'border-rose-500/60'} p-5 sm:p-6 space-y-4 shadow-2xl animate-enter">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="px-2.5 py-0.5 rounded-lg text-xs font-extrabold ${done ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300 animate-pulse'}">${done ? '✅ Confronto encerrado' : '🔴 AO VIVO'}</span>
          <button onclick="ArenaTorneio.closeLive()" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-300">✕ Fechar</button>
        </div>
        <div class="flex items-center justify-center gap-4 sm:gap-10 text-center">
          <div class="flex-1 text-right"><div class="font-display text-sm sm:text-xl font-bold text-purple-300 truncate">${n1}</div><div class="text-xs text-slate-400">OVR ${t1.ovr} • ${f.m.p1.formationKey || ''}</div></div>
          <div class="px-5 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 font-display text-2xl sm:text-4xl font-black text-white">${c1} <span class="text-slate-600 text-xl">x</span> ${c2}</div>
          <div class="flex-1 text-left"><div class="font-display text-sm sm:text-xl font-bold text-amber-300 truncate">${n2}</div><div class="text-xs text-slate-400">OVR ${t2.ovr} • ${f.m.p2.formationKey || ''}</div></div>
        </div>
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs font-display font-black"><span class="text-purple-300">${an.prob1}%</span><span class="text-amber-300">${an.prob2}%</span></div>
          <div class="w-full h-3 rounded-full bg-slate-950 border border-slate-700 overflow-hidden flex">
            <div style="width:${an.prob1}%" class="h-full bg-gradient-to-r from-purple-600 to-sky-500"></div><div style="width:${an.prob2}%" class="h-full bg-gradient-to-r from-amber-500 to-rose-600"></div>
          </div>
        </div>
        <div class="rounded-2xl bg-slate-950/90 border border-slate-800 p-4 space-y-1.5">
          <div class="font-display text-sm font-bold text-white">${an.verdictTitle}</div>
          <div class="text-xs sm:text-sm text-slate-300 leading-relaxed">${an.verdictLog}</div>
        </div>
        <div class="space-y-3">
          ${res.acts.slice(0, shown).map(a => `
            <div class="rounded-2xl bg-slate-950/70 border ${a.winner === 1 ? 'border-purple-500/40' : (a.winner === 2 ? 'border-amber-500/40' : 'border-slate-700')} p-4 space-y-1.5 animate-enter">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="font-display text-sm font-bold text-white">${a.title}</span>
                <span class="px-2 py-0.5 rounded-lg text-[11px] font-extrabold ${a.winner === 1 ? 'bg-purple-500/20 text-purple-300' : (a.winner === 2 ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-300')}">${a.winner === 1 ? `${n1} +${a.pts}` : (a.winner === 2 ? `${n2} +${a.pts}` : 'Empate')}</span>
              </div>
              <p class="text-xs sm:text-sm text-slate-200">${a.narrative}</p>
            </div>`).join('')}
          ${next ? `<div class="rounded-2xl border border-dashed border-slate-700 p-3 text-center text-xs text-slate-400 animate-pulse">⚔️ ${shown === 0 ? 'Analisando os esquadrões…' : 'Próximo:'} ${esc(next.title)}</div>` : ''}
        </div>
        ${done ? `
          <div class="rounded-2xl bg-gradient-to-r from-emerald-950/80 to-purple-950/80 border border-emerald-400/50 p-4 text-center space-y-1">
            ${res.is7a0Sweep ? '<div class="text-[11px] font-black uppercase tracking-widest text-amber-300">🔥 Massacre histórico • 7 a 0 no Multiverso! 🔥</div>' : ''}
            <div class="font-display text-lg sm:text-2xl font-black text-white">🏆 ${winnerName} avança! <span class="text-slate-400 text-base">(${res.score1} x ${res.score2})</span></div>
          </div>
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
            ${[[f.m.p1, n1, res.winner === 1], [f.m.p2, n2, res.winner === 2]].map(([pp, nm, won]) => `
              <div class="rounded-2xl bg-slate-950/60 border ${won ? 'border-emerald-500/50' : 'border-slate-800'} p-3 space-y-2">
                <div class="text-xs font-bold ${won ? 'text-emerald-300' : 'text-slate-400'}">${won ? '🏆' : '💀'} ${nm}</div>
                <div class="grid grid-cols-4 sm:grid-cols-7 gap-2">${pp.squad.slots.map((sl, i) => ctx.renderSquareSquadCard(sl, i, false)).join('')}</div>
              </div>`).join('')}
          </div>` : ''}
      </div>`;
  }

  function renderBracket() {
    const t = ctx.state.tournament;
    const rounds = t.rounds || [];
    const final = rounds.length && rounds[rounds.length - 1].length === 1 ? rounds[rounds.length - 1][0] : null;
    const showChampion = t.champion && final && revealed(rounds.length - 1, 0);
    const roundName = (ms, r) => (ms.length === 1 ? 'Grande Final' : (ms.length === 2 ? 'Semifinais' : `Rodada ${r + 1}`));
    return `
      <div class="space-y-6 animate-enter">
        <div class="rounded-3xl bg-surface border border-slate-800 p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span class="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-extrabold">Sala ${esc(t.roomCode)} • Chaveamento</span>
            <h2 class="font-display text-xl sm:text-2xl font-black text-white mt-1">Copa Mata-Mata do Multiverso</h2>
            <p class="text-xs text-slate-400">Quando um confronto começa, todos na sala acompanham a batalha ao vivo, ato por ato.</p>
          </div>
          <button onclick="goHome()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white">Voltar ao Início</button>
        </div>
        ${showChampion ? `
          <div class="rounded-3xl bg-gradient-to-r from-amber-950/90 via-surface to-emerald-950/90 border-2 border-amber-400 p-6 text-center space-y-2 shadow-2xl">
            <div class="text-xs font-extrabold uppercase tracking-widest text-amber-300">👑 Grande Campeão do Torneio 👑</div>
            <h3 class="font-display text-2xl sm:text-4xl font-black text-white">${esc(t.champion.name)}</h3>
          </div>` : ''}
        ${renderLivePanel()}
        <div class="grid grid-cols-1 md:grid-cols-${Math.max(1, rounds.length)} gap-5">
          ${rounds.map((ms, r) => `
            <div class="space-y-3">
              <div class="text-xs font-display font-bold uppercase text-slate-400 text-center">${roundName(ms, r)}</div>
              ${ms.map((m, i) => {
                const l1 = sideLabel(r, i, 1), l2 = sideLabel(r, i, 2);
                const playing = isPlaying(m.id);
                const shownWinner = revealed(r, i);
                const w = shownWinner ? m.winner : null;
                const row = (pp, lbl) => `
                  <div class="flex items-center justify-between text-xs ${w && w.name === pp.name ? 'text-emerald-300 font-extrabold' : 'text-slate-300'}">
                    <span class="truncate">${lbl ? `<em class="text-slate-500">${lbl}</em>` : esc(pp.name)}</span>
                    <span>${lbl ? '' : `OVR ${ctx.getSquadTotals(pp.squad).ovr}`}</span>
                  </div>`;
                return `
                  <div class="rounded-2xl bg-surface border ${playing ? 'border-rose-500/60' : 'border-slate-800'} p-4 space-y-2.5 shadow-lg">
                    ${row(m.p1, l1)}${row(m.p2, l2)}
                    ${playing ? `<button onclick="ArenaTorneio.watch('${m.id}')" class="w-full py-2 rounded-xl bg-rose-600/80 text-xs font-bold text-white animate-pulse">🔴 Ao vivo — assistir</button>` :
                      (w ? `
                        <div class="pt-1 border-t border-slate-800 flex items-center justify-between text-[11px] font-bold text-amber-300">
                          <span class="truncate">Vencedor: ${esc(w.name)}</span><span>${esc(m.scoreText)}</span>
                        </div>
                        <button onclick="ArenaTorneio.watch('${m.id}')" class="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-300">🔁 Rever batalha</button>` :
                      (l1 || l2 ? `<div class="text-center text-[11px] text-slate-500">Aguardando confrontos anteriores…</div>` : `
                        <button onclick="simulateTournamentMatch(${r}, ${i})" class="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white">⚔️ Iniciar confronto ao vivo</button>`))}
                  </div>`;
              }).join('')}
            </div>`).join('')}
        </div>
      </div>`;
  }

  function afterRender() {
    if (!ctx) return;
    handlePickTimer();
    handleAutoStart();
    handleLiveMatches();
  }

  window.ArenaTorneio = { init, cleanRoom, cleanName, lobbyStatus, timerBox, renderBracket, watch, closeLive, afterRender, PICK_SECONDS };
})();
