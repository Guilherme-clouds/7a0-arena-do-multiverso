# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [SemVer](https://semver.org/lang/pt-BR/).

## [1.4.0] - 2026-11-27

### Adicionado
- Copa do Multiverso: o lobby só inicia os drafts quando não há vagas abertas e todos os jogadores marcaram Pronto; com tudo pronto, os drafts começam sozinhos em 3 s.
- Timer de 20 s por escolha no draft do mata-mata (verde → amarelo → vermelho). Se o tempo acabar, o jogo sorteia a obra e escala o melhor card na melhor vaga.
- Batalhas ao vivo no chaveamento: análise pré-duelo (3 s) e um ato a cada 2,5 s, com os mesmos logs do 1v1. Todos na sala veem o confronto automaticamente; dá para rever depois.
- O vencedor e a próxima fase só aparecem quando a batalha termina de passar.

### Corrigido
- O chaveamento não sincronizava online (o Firestore não aceita listas dentro de listas): agora as rodadas são salvas como objetos.
- Picks recém-feitos não são mais apagados por uma atualização atrasada da sala.
- Nomes de jogadores sem caracteres especiais (proteção contra injeção de HTML).

## [1.3.1] - 2026-11-27

### Corrigido
- Arte em pixel art aparece mais para cima nos cards quadrados do time, fora da área dos textos.
- A citação de feito do personagem aparece só uma vez por duelo, sem repetir em todos os atos.
- "diferença de só X pontos" só usa "só" quando a diferença é pequena.

## [1.3.0] - 2026-11-27

### Adicionado
- Artes dos cards em pixel art: símbolo genérico por personagem, moldura hexagonal, brilho e grade nas cores do card (`assets/js/pixel-art.js`).
- Narrador dos logs (`assets/js/narrador.js`): pré-duelo com vantagens por atributo, ponto-chave, destaques, encaixe e alerta de 7 a 0; atos com textos que variam conforme a margem (apertado, sólido, domínio).

### Segurança
- Nomes de jogadores escapados nos novos logs (evita injeção de HTML vinda das salas online).

## [1.2.0] - 2026-11-27

### Adicionado
- Salas online em tempo real usando o Firebase `arena-multiverso-7a0` (login anônimo + Firestore em São Paulo).
- `firestore.rules` com as regras de segurança publicadas (somente salas do mata-mata; resto bloqueado).

## [1.1.0] - 2026-11-27

### Alterado
- Novo nome: **7 a 0: Arena Multiverso** (sem "Marvel" no título e nos textos do jogo).
- Cards usam somente as artes padrão geradas pelo jogo; todas as fotos externas foram removidas.
- Imagens personalizadas (Dev / Imagens) ficam apenas no navegador de cada jogador e não são mais enviadas ao servidor.

## [1.0.0] - 2026-11-27

### Adicionado
- Nome oficial **7 a 0: Arena do Multiverso**.
- 51 cards com imagens de 5 obras (Guerra Infinita, Ultimato, Era de Ultron, X-Men, Doomsday).
- Roleta de filme/série (~1,5 s) com destaque da obra sorteada.
- Tela de pré-duelo com barra de % de vitória, análise de favoritismo e botões de Pronto.
- Botão **Convidar Amigos** com links diretos (`?room=` e `?challenge=`).
- Copa do Multiverso (4 ou 8 times) com lobby, formação, pronto e drafts simultâneos.
- Bloqueio de cards já escolhidos por outros players e de versões repetidas no mesmo time.
- Times completos na tela de vitória/derrota.
- Hook opcional `firebase-config.js` para ativar as salas online fora do ambiente de preview.

### Corrigido
- Bots preenchendo a vaga do jogador no mata-mata.
- Erros de sintaxe (`renderFallbackSvg`, bloco `try` do cache de imagens).
