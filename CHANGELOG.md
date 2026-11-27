# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [SemVer](https://semver.org/lang/pt-BR/).

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
