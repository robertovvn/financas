# Finanças (app pessoal)

App web instalável (PWA) para controle de finanças pessoais. Os dados ficam salvos só no aparelho (localStorage); nada é enviado para servidor.

## Instalar no iPhone
1. Abra o endereço do app no **Safari**.
2. Toque em Compartilhar (quadrado com seta) › **Adicionar à Tela de Início**.
3. Abra pelo ícone. Em Mais › Ajustes › Privacidade, ative a senha.

## Arquivos
- `index.html`, `styles.css`, `app.js`: o app.
- `manifest.json`, `sw.js`, `icon-*.png`: instalação e funcionamento sem internet.
  Ao publicar uma atualização, troque `CACHE` em `sw.js` (ex.: `financas-v2`).

## Backup
Mais › Ajustes › Backup: baixe o JSON de vez em quando (e antes de trocar de celular).
