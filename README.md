# webPliss

Interface visual da WebCivil para escadas. O protótipo atual funciona sem
chamadas de API: a prévia geométrica e o download da configuração JSON são
executados diretamente no navegador.

## Desenvolvimento

```bash
npm install
npm run dev
```

O build produzido pelo Vite pode ser publicado no GitHub Pages. O fluxo de
publicação está em `.github/workflows/publicar-pages.yml` e usa caminhos
relativos, compatíveis com a página do projeto.
