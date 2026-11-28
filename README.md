<div align="center">

# ⚡ 7 a 0: Arena Multiverso

**Monte seu esquadrão de 7 heróis e vilões do multiverso e vença duelos em 4 atos.**

[![Jogar agora](https://img.shields.io/badge/%E2%96%B6%20JOGAR%20AGORA-GitHub%20Pages-e11d48?style=for-the-badge)](https://guilherme-clouds.github.io/7a0-arena-do-multiverso/)
![HTML5](https://img.shields.io/badge/HTML5-single%20file-orange?style=flat-square)
![Tailwind](https://img.shields.io/badge/Tailwind-CDN-38bdf8?style=flat-square)
![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-green?style=flat-square)

### 👉 [https://guilherme-clouds.github.io/7a0-arena-do-multiverso/](https://guilherme-clouds.github.io/7a0-arena-do-multiverso/)

</div>

---

## 🎮 Como jogar

Não precisa instalar nada: abra o link acima no navegador (PC ou celular) e jogue.
Para chamar amigos, use o botão **🔗 Convidar Amigos** no topo do jogo — ele gera um link direto para a partida.

1. **Sorteie a obra** — a roleta 🎰 gira por ~1,5 s e revela o filme/série da rodada.
2. **Draft** — escolha 1 entre 3 cards em cada rodada até completar 7 integrantes.
3. **Formação** — 3-2-2, 2-3-2 ou 2-2-3.
4. **Pré-duelo** — veja os dois esquadrões, a barra de % de vitória e a análise de favoritismo; os dois lados marcam **Pronto**.
5. **Duelo em 4 atos** — no final, os dois times completos aparecem na tela de vitória/derrota.

## 🕹️ Modos

| Modo | Descrição |
|---|---|
| Duelo Rápido contra a IA | Você contra um esquadrão montado pela IA |
| Duelo Local (1v1) | Dois jogadores no mesmo dispositivo |
| Desafiar Esquadrão de Amigo | Cole o código `MRV2-...` que um amigo gerou e enfrente o time dele |
| Copa do Multiverso | Mata-mata de 4 ou 8 times: lobby (começa só com todos prontos), drafts simultâneos com **20 s por escolha** e batalhas **ao vivo** que todos na sala acompanham |

**Regras de draft entre players:** um card já escolhido por outro player fica bloqueado para os demais, e um mesmo personagem não pode aparecer em duas versões no mesmo time (ex.: dois Homens de Ferro).

## 🗂️ Catálogo

Os cards usam artes originais em **pixel art** geradas pelo próprio jogo (`assets/js/pixel-art.js`): cada personagem tem um símbolo genérico ligado ao seu estilo (raio, martelo, chama, ímã...), sem logos ou fotos oficiais. Cada jogador pode colocar imagens próprias em **⚙️ Dev / Imagens** — elas ficam salvas só no navegador dele.

51 cards de 5 obras: *Vingadores: Guerra Infinita*, *Vingadores: Ultimato*, *Vingadores: Era de Ultron*, *X-Men* e *Vingadores: Doomsday*.

## 🧱 Estrutura do repositório

```
7a0-arena-do-multiverso/
├── index.html                  # O jogo (HTML + CSS + motor do jogo)
├── assets/js/pixel-art.js      # Artes dos cards em pixel art
├── assets/js/narrador.js       # Textos dos logs de pré-duelo e dos atos
├── assets/js/torneio.js        # Copa do Multiverso: lobby, timer de escolha e batalhas ao vivo
├── firebase-config.js          # Configuração do Firebase (salas online)
├── firebase-config.example.js  # Modelo para usar outro projeto Firebase
├── firestore.rules             # Regras de segurança do banco
├── .nojekyll                   # Serve os arquivos como estão no GitHub Pages
├── CHANGELOG.md                # Histórico de versões
├── CONTRIBUTING.md             # Fluxo de branches e como publicar uma versão
└── LICENSE
```

## 🌿 Branches

| Branch | Papel |
|---|---|
| `main` | **Versão estável e publicada.** Tudo que entra aqui vai ao ar automaticamente em https://guilherme-clouds.github.io/7a0-arena-do-multiverso/ |
| `develop` | Desenvolvimento e testes. Novas versões nascem aqui e só vão para a `main` via Pull Request |

Detalhes em [CONTRIBUTING.md](CONTRIBUTING.md).

## 🌐 Modo online

As **salas online em tempo real** (Copa do Multiverso) já estão ativas no site, usando o Firebase do projeto `arena-multiverso-7a0`:

- **Login anônimo** — ninguém precisa criar conta para jogar.
- **Firestore (São Paulo)** — guarda só as salas do mata-mata.
- **Regras de segurança** em [`firestore.rules`](firestore.rules): só é possível ler/gravar salas com código `SL-0000` e no formato do jogo; todo o resto é bloqueado e salas não podem ser apagadas por jogadores.

A configuração fica em `firebase-config.js`. Os valores ali são públicos por natureza no Firebase Web — a segurança vem das regras. Para usar outro projeto Firebase, edite esse arquivo seguindo o modelo `firebase-config.example.js`.

## 💻 Rodar localmente

```bash
git clone https://github.com/Guilherme-clouds/7a0-arena-do-multiverso.git
cd 7a0-arena-do-multiverso
# abra o index.html no navegador, ou sirva a pasta:
python -m http.server 8000   # http://localhost:8000
```

## ⚖️ Aviso

Projeto de fã, sem fins lucrativos e sem afiliação com a Marvel, Disney ou qualquer estúdio. Nomes e personagens pertencem aos seus respectivos donos; as imagens são carregadas por link externo e não ficam armazenadas neste repositório. A licença MIT cobre apenas o código.
