# Site Tapajós Alimentos / AvisPará

Site institucional e comercial de sete páginas, em HTML, CSS e JavaScript puros.
Não precisa de build, Node nem framework: é só abrir `index.html` ou subir a pasta
inteira para qualquer hospedagem estática (GitHub Pages, Netlify, Hostinger, cPanel).

---

## Páginas

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Abertura, institucional, cadeia produtiva, produtos, usos do formato, diferenciais, unidades, cuidados com o produto, aplicações culinárias, FAQ e chamada final |
| `empresa.html` | Identificação cadastral, as três etapas da operação, unidades e registros públicos |
| `produtos.html` | Catálogo com busca e filtro, e a régua de calibre |
| `produto-frango-congelado.html` | Ficha, seletor de calibre e usos |
| `produto-galinha-pesada.html` | Ficha e indicação de uso |
| `produto-frango-resfriado.html` | Ficha e comparação resfriado × congelado |
| `contato.html` | Formulário de orçamento, dados de contato e dicas para agilizar a resposta |

Arquivos de apoio: `assets/css/estilo.css`, `assets/js/site.js`, `assets/img/`,
`robots.txt`, `sitemap.xml`, `baixar-imagens.sh`.

---

## Identidade visual

Paleta extraída diretamente do logotipo enviado:

| Papel | Cor | Uso |
|---|---|---|
| Principal | `#ED1B23` | Botões, links de destaque, numeração, faixa de unidades |
| Destaque | `#FFF100` | Etiquetas, selos, botões sobre fundo escuro |
| Superfície suave | `#FFFBD6` | Etiqueta da abertura |
| Texto e fundo escuro | `#14100E` | Preto do contorno do logotipo |
| Neutros | `#F6F3ED`, `#E4DDD2`, `#6A615A` | Fundos, divisórias e texto secundário |

O amarelo puro só aparece com texto preto por cima, para manter o contraste
acessível. A fonte é a **Archivo** (Google Fonts), usada em duas larguras: bem
condensada e pesada nos títulos, normal no texto corrido.

O logotipo foi recortado do arquivo enviado e exportado com fundo transparente
em `assets/img/logo-avispara.png` e `.webp`, mais favicon e ícone de iOS.
Se a empresa tiver o arquivo vetorial original (SVG ou AI), vale substituir.

---

## Fontes das informações

Todo o conteúdo veio da pesquisa fornecida. Nada de número de produção,
depoimento, cliente ou certificação foi inventado.

| Informação no site | Origem |
|---|---|
| Razão social, CNPJ, abertura em 2004, natureza jurídica, CNAE, bairro | Cadastro empresarial público |
| Marca AvisPará ligada à Tapajós Alimentos; venda de frango resfriado e congelado | Estudo de 2017 publicado pelo Confea |
| Caixa de 20 kg com 7, 8 ou 9 aves; galinha pesada de 20 kg | Catálogo on-line da distribuidora Fribel |
| Caixa de 20 kg de frango congelado AvisPará | Documento fiscal de 2021 no portal da Prefeitura de Óbidos |
| Abatedouro em Belterra com SIF 3553 | Relação do Ministério da Agricultura, 2019 |
| Convênio com a Ufopa (2014–2019) | Documento da Ufopa |
| Homenagem Empresa do Ano | Jornal O Impacto, 2013 |
| Matriz e três filiais | Cadastros de estabelecimentos |
| Telefone (93) 99163-7443 | Diretórios comerciais |

O peso médio por ave mostrado no seletor de calibre é um **cálculo** (20 kg ÷ nº de
aves), e está identificado como tal na página.

---

## Imagens

Não há fotografias próprias da empresa disponíveis. Todas as fotos são do
**Unsplash**, sob a [licença Unsplash](https://unsplash.com/license), que permite
uso comercial sem exigir atribuição. Mesmo assim, o crédito aparece no rodapé, e
cada foto está marcada no texto alternativo e nas legendas como **ilustrativa do
segmento**. Nenhuma delas é apresentada como instalação, equipe ou embalagem da
Tapajós Alimentos.

A foto da embalagem AvisPará que aparece no site da distribuidora **não foi usada**:
é material de terceiro, sem autorização de reutilização.

Fotógrafos usados: Muhammed Minhaj VP, Egor Myznik, Cristian Guillen, Satmar Meats,
Karyna Panchenko, Hayley Ryczek, JK Sloan, Kyle Mackie, Alison Marras, Eiliv Aceron,
Philippe Zuber, Claudio Schwarz, Kateryna Hliznitsova, Kristian Angelo, Elena Leya,
Zosia Szopka, Ben Moreland, Artem Beliaikin, Brett Jordan, Zachariah Smith, Finn Mund.

### Deixar as fotos locais (recomendado antes de publicar)

Hoje as fotos vêm do CDN do Unsplash. Para hospedar junto do site:

```bash
bash baixar-imagens.sh
```

O script baixa cada foto e converte para WebP em `assets/img/fotos/`. Depois,
troque no HTML os endereços `https://images.unsplash.com/photo-XXXX?...` pelo
arquivo local correspondente — o nome de cada arquivo está no próprio script, na
mesma ordem em que as fotos aparecem. Feito isso, dá para apagar a linha
`<link rel="preconnect" href="https://images.unsplash.com">` de cada página.

---

## Formulário de orçamento: falta configurar

O formulário de `contato.html` valida os campos, exige nome, cidade e mensagem,
pede pelo menos um telefone ou e-mail, e preserva o texto digitado se algo falhar.

**Ele ainda não envia nada**, porque não há serviço de destino definido. Enquanto
isso, ele avisa o visitante com honestidade e oferece o telefone e um botão para
copiar a mensagem. Em nenhum momento exibe uma confirmação falsa.

Para ligar o envio, abra `assets/js/site.js` e preencha a primeira variável:

```js
var ENDPOINT_ORCAMENTO = 'https://formspree.io/f/SEU_CODIGO';
```

Serve qualquer serviço que aceite `POST` de `FormData`: Formspree, Basin,
Web3Forms, FormSubmit ou um script PHP no próprio servidor. Depois de preencher,
o formulário passa a mostrar os estados de enviando, sucesso e erro sozinho.

---

## Antes de publicar: o que confirmar com a empresa

Estes pontos estão no site com base em fontes públicas, mas **precisam ser
confirmados pelo cliente**:

1. **Qual marca fica em destaque.** O site usa "Tapajós Alimentos" como nome
   principal e "AvisPará" como marca do produto. Se a empresa preferir o contrário,
   é uma troca rápida.
2. **Telefone (93) 99163-7443.** Aparece em diretórios, não foi testado. Todos os
   botões de ligação apontam para ele.
3. **Endereço completo.** As fontes divergem entre Avenida Mararu e Avenida Sérgio
   Henn. Por isso o site cita apenas "Diamantino, Santarém-PA" e **não há mapa**.
   Com o endereço confirmado, dá para incluir o mapa e o endereço completo.
4. **WhatsApp.** Não foi confirmado, então **não existe botão de WhatsApp** no site.
   Com o número confirmado, incluo o botão flutuante com mensagem já preenchida a
   partir do produto escolhido.
5. **Registro SIF 3553.** Consta em documento de 2019. Confirme se segue vigente
   antes de manter como argumento de venda.
6. **Catálogo.** Só entraram as apresentações que aparecem em fontes públicas.
   Se houver cortes, miúdos, embalagens menores ou outros itens, mande a lista.
7. **Frango resfriado.** Documentado em estudo de 2017, mas ausente do catálogo da
   distribuidora. Está no site como "sob consulta".
8. **Área de entrega, pedido mínimo, pagamento e venda a pessoa física.** Nada
   disso foi publicado, então o site direciona ao comercial em vez de inventar regra.
9. **Redes sociais.** A página `facebook.com/avispara` não pôde ser verificada, então
   **não há link para redes sociais** no rodapé.
10. **Fotos próprias.** Assim que a empresa fornecer fotos das unidades, da equipe e
    das embalagens, elas substituem as ilustrativas e o site ganha muito em confiança.
11. **Domínio.** Troque `https://www.exemplo.com.br` pelo domínio real em
    `robots.txt`, `sitemap.xml` e nas tags `canonical` de cada página.
12. **Política de privacidade.** O formulário traz um aviso curto sobre o uso dos
    dados. Se a empresa quiser uma página completa de privacidade, dá para criar.

---

## Acessibilidade e desempenho

- Navegação por teclado com foco visível e link "pular para o conteúdo".
- Títulos em ordem semântica, um `h1` por página.
- Campos de formulário com rótulo, `aria-invalid` e mensagens de erro por campo.
- `prefers-reduced-motion` respeitado: a abertura animada e as entradas ao rolar
  são desligadas para quem prefere menos movimento.
- Imagens com `width`, `height`, `loading="lazy"` fora da primeira tela e
  `fetchpriority="high"` na imagem principal.
- Sem bibliotecas externas: só a fonte do Google Fonts e as imagens.
- Nenhum rastreador foi instalado.

---

## Publicar no GitHub Pages

```bash
git init
git add .
git commit -m "Site Tapajós Alimentos / AvisPará"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git push -u origin main
```

Depois, em **Settings → Pages**, escolha a branch `main` e a pasta `/ (root)`.
