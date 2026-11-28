/* 7 a 0: Arena Multiverso — artes padrão dos cards (pixel art original, gerada por código).
   Símbolos genéricos (objetos/elementos), sem logos nem emblemas oficiais.
   Legenda: a = cor de destaque do card | b = branco | c = cinza | . = transparente */
(function () {
  const S = {
    bolt: ['......aaaa..', '.....aaaa...', '....aaab....', '...aaab.....', '..aaaaaaaa..', '.....aaab...', '....aaab....', '...aaa......', '..aab.......', '..aa........', '.aa.........', '.a..........'],
    axe: ['..aaaa......', '.aabbaa.....', 'aaabbaac....', 'aaaaaac.c...', '.aaaac...c..', '..aac.....c.', '.....c......', '......c.....', '.......c....', '........c...', '.........c..', '..........c.'],
    hammer: ['.aaaaaaaaaa.', '.abbbbbbbba.', '.aaaaaaaaaa.', '.aaaaaaaaaa.', '.....cc.....', '.....cc.....', '.....cc.....', '.....cc.....', '.....cc.....', '.....cc.....', '....aaaa....', '....aaaa....'],
    shield: ['.aaaaaaaaaa.', '.abbbbbbbba.', '.abaaaaaaba.', '.abaaaaaaba.', '.abaaaaaaba.', '.abaaaaaaba.', '..abaaaaba..', '..abaaaaba..', '...abaaba...', '....abba....', '.....aa.....'],
    gem: ['....aaaa....', '...abbbba...', '..abbaabba..', '.aaaaaaaaaa.', '.aabaaaabaa.', '..aabaabaa..', '...aabbaa...', '....aaaa....', '.....aa.....'],
    sword: ['.........bb.', '........bab.', '.......bab..', '......bab...', '.....bab....', '....bab.....', '.c.bab......', '..cab.......', '...cc.......', '..c..c......', '.c..........'],
    claw: ['..a...a...a.', '..a...a...a.', '.ab..ab..ab.', '.ab..ab..ab.', '.a...a...a..', 'a...a...a...', 'a...a...a...', 'a...a...a...', '.b...b...b..', '..bbbbbbbbb.'],
    comet: ['.........aa.', '........abba', '........abba', '.......aaaa.', '......aa....', '.....aa.....', '....aa......', '...ab.......', '..ab........', '.b..........'],
    spear: ['..........a.', '.........aaa', '........aba.', '.......ab...', '......cc....', '.....cc.....', '....cc......', '...cc.......', '..cc........', '.cc.........', 'cc..........'],
    laser: ['............', '.aaaaaaaaaa.', 'abbbbbbbbbba', '.aaaaaaaaaa.', '............', '....aaaa....', '...aabbaa...', '..aabbbbaa..', '.aabbbbbbaa.'],
    crown: ['a....a....a.', 'aa..aaa..aa.', 'aaa.aaa.aaa.', 'aaaaaaaaaaa.', 'abababababa.', 'aaaaaaaaaaa.', '.cccccccccc.'],
    brain: ['...aaaaaa...', '..abaababa..', '.aabaaabaaa.', '.abaaaabaaba', '.aaabaaaabaa', '.abaabaabaa.', '..aaaaaaaa..', '....aa......', '....aa......'],
    fist: ['..aaaaaaaa..', '.abababababa', '.aaaaaaaaaaa', '.aaaaaaaaaaa', 'aaaaaaaaaaa.', 'aaaaaaaaaa..', '.aaaaaaaa...', '..aaaaaa....', '..aaaaaa....', '..cccccc....'],
    reactor: ['...aaaaaa...', '..a......a..', '.a..bbbb..a.', 'a..b....b..a', 'a.b..aa..b.a', 'a.b.aaaa.b.a', 'a.b.aaaa.b.a', 'a.b..aa..b.a', 'a..b....b..a', '.a..bbbb..a.', '..a......a..', '...aaaaaa...'],
    rune: ['...aaaaaa...', '..aa.bb.aa..', '.a...bb...a.', 'aa.bbbbbb.aa', 'a..b.aa.b..a', 'abbbaaaabbba', 'abbbaaaabbba', 'a..b.aa.b..a', 'aa.bbbbbb.aa', '.a...bb...a.', '..aa.bb.aa..', '...aaaaaa...'],
    flame: ['.....a......', '....aa......', '....aaa..a..', '...aaaa.aa..', '..aaabaaaa..', '..aabbbaaa..', '.aabbbbbaaa.', '.aabbbbbbaa.', '.aabbbbbbaa.', '..aabbbbaa..', '...aaaaaa...'],
    snake: ['......aaaa..', '.....abbba..', '.....aa.....', '......aa....', '.......aa...', '......aa....', '....aaa.....', '...aa.......', '..aa........', '...aaa......', '.....aaaa...'],
    magnet: ['bbbb....bbbb', 'bbbb....bbbb', 'aaaa....aaaa', 'aaaa....aaaa', 'aaaa....aaaa', 'aaaa....aaaa', 'aaaaa..aaaaa', '.aaaaaaaaaa.', '..aaaaaaaa..'],
    spring: ['..aaaaaaaa..', '.a........a.', '..aaaaaaaa..', '.a........a.', '..aaaaaaaa..', '.a........a.', '..aaaaaaaa..', '.a........a.', '..aaaaaaaa..'],
    bubble: ['...aaaaaa...', '..a......a..', '.a..bb....a.', 'a..b.......a', 'a..b.......a', 'a..........a', 'a..........a', '.a........a.', '..a......a..', '...aaaaaa...'],
    mask: ['.aaaaaaaaaa.', 'aaaaaaaaaaaa', 'aa..aaaa..aa', 'aa..aaaa..aa', 'aaaaaaaaaaaa', 'aaaaabbaaaaa', '.aaa....aaa.', '..aaa..aaa..', '...aaaaaa...'],
    dagger: ['.....bb.....', '.....bb.....', '....bbbb....', '....babb....', '....babb....', '....babb....', '....babb....', '..aaaaaaaa..', '.....cc.....', '.....cc.....', '....aaaa....'],
    smoke: ['..aaa..aaa..', '.abbaaabbaa.', 'aaaaaaaaaaaa', 'aaaaaaaaaaaa', '.aaaaaaaaaa.', '..aa.aa.aa..', '...a..a..a..'],
    ant: ['..a......a..', '...a....a...', '....aaaa....', '...abaaba...', '....aaaa....', '.a..aaaa..a.', '..aaaaaaaa..', '....aaaa....', '.a.aaaaaa.a.', '..aaaaaaaa..', '...aaaaaa...', '.a..aaaa..a.'],
    chip: ['.a.a.a.a.a..', 'aaaaaaaaaaa.', '.abbbbbbba..', 'aab.....baa.', '.ab.aaa.ba..', 'aab.aaa.baa.', '.ab.....ba..', 'aabbbbbbbaa.', '.aaaaaaaaa..', '.a.a.a.a.a..'],
    leaf: ['........aaa.', '......aaaaa.', '....aaaabaa.', '...aaabaaa..', '..aaabaaa...', '..aabaaa....', '..abaa......', '.bb.........', 'b...........'],
    web: ['a....a....a.', '.a...a...a..', '..aaaaaaa...', '..a.aaa.a...', 'aaaaabaaaaa.', '..a.aaa.a...', '..aaaaaaa...', '.a...a...a..', 'a....a....a.'],
    sun: ['.....a......', '..a..a..a...', '...aaaaa....', '..aabbbaa...', 'aaabbbbbaaa.', '..aabbbaa...', '...aaaaa....', '..a..a..a...', '.....a......'],
    rings: ['..aaa...aaa.', '.a...a.a...a', '.a...a.a...a', '..aaa...aaa.', '.....aaa....', '....a...a...', '....a...a...', '.....aaa....'],
    wings: ['a..........a', 'aa........aa', 'aaa......aaa', 'aaaa.bb.aaaa', '.aaaabbaaaa.', '..aaabbaaa..', '...aa..aa...'],
    robot: ['.....a......', '...aaaaaa...', '..aaaaaaaa..', '.aaaaaaaaaa.', '.aabbaabbaa.', '.aabbaabbaa.', '.aaaaaaaaaa.', '.aa.cccc.aa.', '.aaaaaaaaaa.', '..a.a..a.a..'],
    target: ['.....a......', '...aaaaa....', '..a..a..a...', '.a...a...a..', '.a..bbb..a..', 'aaaabbbaaaa.', '.a..bbb..a..', '.a...a...a..', '..a..a..a...', '...aaaaa....', '.....a......'],
    arrow: ['.........aaa', '..........aa', '.........a.a', '........c...', '.......c....', '......c.....', '.....c......', '....c.......', '.bbc........', '.bb.........', 'b.b.........'],
    swirl: ['...aaaaa....', '..a.....a...', '.a..aaa..a..', '.a.a...a.a..', '.a.a.b.a.a..', '.a.a..a..a..', '.a..aa...a..', '..a.....a...', '...aaaaa....']
  };

  const BY_EMBLEM = {
    infinity: 'gem', mind: 'gem', axe: 'axe', bolt: 'bolt', mandala: 'rune', chaos: 'swirl', arc: 'reactor',
    psi: 'brain', claw: 'claw', hammer: 'hammer', shield: 'shield', glaive: 'spear', spear: 'spear', web: 'web',
    tech: 'chip', target: 'target', hourglass: 'dagger', star: 'comet', sword: 'sword', quantum: 'ant', blade: 'sword',
    bot: 'robot', fist: 'fist', arrow: 'arrow', phoenix: 'flame', magnet: 'magnet', visor: 'laser', mask: 'mask',
    bamf: 'smoke', doom: 'crown', horns: 'snake', sun: 'sun', four: 'bubble', rings: 'rings', wings: 'wings'
  };
  const BY_HERO = { MISTER_FANTASTIC: 'spring', ROCKET_GROOT: 'leaf', STORM: 'bolt', QUICKSILVER: 'arrow' };
  const ROLE_ICON = { OFE: '⚔', EST: '◆', SUP: '✚' };

  function spriteFor(char) {
    return S[BY_HERO[char.baseHero]] || S[BY_EMBLEM[char.emblem]] || S.gem;
  }

  function spriteRects(rows, x0, y0, px, palette) {
    let out = '';
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        const col = palette[row[x]];
        if (col) out += `<rect x="${x0 + x * px}" y="${y0 + y * px}" width="${px}" height="${px}" fill="${col}"/>`;
      }
    });
    return out;
  }

  function renderCardSvg(char) {
    const c1 = (char.colors && char.colors[0]) || '#1e293b';
    const c2 = (char.colors && char.colors[1]) || '#38bdf8';
    const id = 'art-' + char.id;
    const rows = spriteFor(char);
    const w = Math.max(...rows.map(r => r.length));
    const px = 8;
    const x0 = 100 - (w * px) / 2;
    const y0 = 104 - (rows.length * px) / 2;
    const shadow = spriteRects(rows, x0 + 4, y0 + 5, px, { a: '#000', b: '#000', c: '#000' });
    const sprite = spriteRects(rows, x0, y0, px, { a: c2, b: '#f8fafc', c: '#94a3b8' });
    const role = ROLE_ICON[char.primary] || '◆';
    return `
      <svg viewBox="0 0 200 260" class="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="${id}-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${c1}"/><stop offset="70%" stop-color="#0b0f1a"/><stop offset="100%" stop-color="#05070d"/>
          </linearGradient>
          <radialGradient id="${id}-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${c2}" stop-opacity="0.45"/><stop offset="100%" stop-color="${c2}" stop-opacity="0"/>
          </radialGradient>
          <pattern id="${id}-grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M10 0H0V10" fill="none" stroke="${c2}" stroke-opacity="0.08" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="200" height="260" fill="url(#${id}-bg)"/>
        <rect width="200" height="260" fill="url(#${id}-grid)"/>
        <circle cx="100" cy="104" r="86" fill="url(#${id}-glow)"/>
        <polygon points="100,26 168,65 168,143 100,182 32,143 32,65" fill="none" stroke="${c2}" stroke-opacity="0.35" stroke-width="2"/>
        <polygon points="100,38 158,71 158,137 100,170 42,137 42,71" fill="#05070d" fill-opacity="0.35" stroke="${c2}" stroke-opacity="0.15" stroke-width="1"/>
        <g shape-rendering="crispEdges">
          <g opacity="0.45">${shadow}</g>
          ${sprite}
        </g>
        <path d="M10 22V10H22M178 10H190V22M190 238V250H178M22 250H10V238" fill="none" stroke="${c2}" stroke-opacity="0.6" stroke-width="2"/>
        <text x="100" y="212" text-anchor="middle" fill="${c2}" fill-opacity="0.9" font-family="Orbitron, sans-serif" font-weight="900" font-size="20" letter-spacing="4">${char.mono || '7A0'}</text>
        <text x="100" y="232" text-anchor="middle" fill="#f8fafc" fill-opacity="0.5" font-family="Orbitron, sans-serif" font-weight="700" font-size="10" letter-spacing="2">${role} ${char.primary || ''}</text>
      </svg>`;
  }

  window.ArenaArt = { renderCardSvg, sprites: S };
})();
