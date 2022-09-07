# Sistema de Requisições
<em><strong>Angular CLI 13.3.6</strong></em>
## Como configurar

Crie a pasta <strong>environments</strong> dentro de <strong>src</strong> e inclua o arquivo <strong>environment.ts</strong> com a sua chave de aplicação do firebase.

O arquivo <strong>environment.ts</strong> deve exportar uma constante contendo as informações que obtidas nas configurações de projeto do Console do Firebase.


```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  }
};
```
---

## Servindo a aplicação

No terminal, instale as dependências do node_modules pelo npm.
```bash
npm install
```

Sirva a aplicação através da Angular CLI.
```bash
ng serve --o
```
<small>A flag <strong>--o</strong> sinaliza à CLI para abrir a aplicação no seu navegador padrão</small>.

