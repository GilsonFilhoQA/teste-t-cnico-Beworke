# Desafio QA Beworke - Automacao Cypress

Automacao dos fluxos descritos nos PDFs do desafio tecnico e do relatorio de bugs para o Swag Labs.

## Como executar

```bash
npm install
npm test
```

Para abrir a interface do Cypress:

```bash
npm run cy:open
```

O `baseUrl` padrao esta configurado para `https://www.saucedemo.com`, porque a URL historica da V1 (`/v1`) esta retornando uma pagina 404/redirecionamento no momento da implementacao. Caso a V1 esteja disponivel no ambiente de avaliacao, rode:

```bash
npx cypress run --config baseUrl=http://www.saucedemo.com/v1
```

## Cobertura

- `cypress/e2e/compra-standard-user.cy.js`: compra bem-sucedida com `standard_user`, adicionando 3 produtos e validando a mensagem final.
- `cypress/e2e/regressao-bugs.cy.js`: cenarios de reproducao dos bugs de imagens incorretas, botao Remove, checkout com carrinho vazio, ordenacao por preco, alinhamento visual e performance de login.

Os testes de bugs retornam sucesso quando conseguem reproduzir o comportamento incorreto documentado no relatorio.
