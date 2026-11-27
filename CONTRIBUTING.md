# Contribuindo / Publicando versões

## Fluxo de branches

```
develop  ──●──●──●──┐            (desenvolvimento e testes)
                    │ Pull Request
main     ──●────────●──► GitHub Pages (site no ar)
```

- **main**: só recebe código testado. Cada commit na `main` atualiza o site em ~1 minuto, no mesmo link.
- **develop**: onde as mudanças são feitas.

## Publicando uma nova versão

1. Na branch `develop`, substitua o `index.html` pela versão nova (pelo site: *Add file → Upload files*, ou via git).
2. Atualize o `CHANGELOG.md` com o que mudou.
3. Abra um **Pull Request** de `develop` → `main` e faça o merge.
4. (Opcional) Crie uma *Release* com a tag da versão, ex.: `v1.1.0`.

O link dos jogadores não muda: https://guilherme-clouds.github.io/7a0-arena-do-multiverso/

## Padrão de commits

`feat:` nova funcionalidade · `fix:` correção · `docs:` documentação · `style:` visual · `refactor:` reorganização de código
