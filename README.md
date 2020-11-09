# Mail Reader

O projeto é uma brincadeira usando a API do google Gmail que vai mostrar os e-mails não lidos, e você poderá selecionar qual e-mail será lido automaticamente através do SpeechSynthesis (feature disponível nos navegadores baseados em Chrome)

# Requisitos

* Ter Deno instalado na versão 1.4 (de preferência) ou acima;
* Crie um ID do cliente OAuth 2.0 cadastrado na [Google Cloud Platform](https://cloud.google.com/) 
* Atualize `[YOUR_CLIENT_ID]` em index.html a tag `<meta name="google-signin-client_id" ...` no head da página com o ID que vc criou na Google Cloud (a chave vai parecer com `lksalkfjsdk.apps.googleusercontent.com`)
* Execute o comando `deno run --allow-net --allow-read server.ts`