#!/usr/bin/env bash
# =============================================================================
#  Baixa as fotos do Unsplash usadas no site e converte para WebP local.
#
#  Por que isso existe: o site foi montado com as fotos servidas pelo CDN do
#  Unsplash. Funciona assim mesmo, mas hospedar as imagens junto do site deixa
#  a página mais rápida e independente de terceiros.
#
#  Como usar (no seu computador, dentro da pasta do site):
#      bash baixar-imagens.sh
#      node trocar-para-local.js      # opcional, ver README
#
#  Requisitos: curl e cwebp (pacote webp). No Ubuntu/WSL:
#      sudo apt install curl webp
# =============================================================================
set -euo pipefail

DEST="assets/img/fotos"
mkdir -p "$DEST"

# nome-do-arquivo|id-da-foto|largura
FOTOS="
hero-aviario|photo-1694854038360-56b29a16fb0c|1900
institucional-lote|photo-1619598951257-68e45c835908|1100
cadeia-criacao|photo-1630090374791-c9eb7bab3935|1000
cadeia-abate|photo-1682991136736-a2b44623eeba|1000
cadeia-venda|photo-1759493321741-883fbf9f433c|1000
produto-congelado|photo-1642102903909-560c5a7665bf|1100
produto-galinha|photo-1672787153655-0c19308dcc60|1100
produto-resfriado|photo-1587593810167-a84920ea0781|1100
segmento-acougue|photo-1597417321971-45e034f7a993|1000
segmento-cozinha|photo-1630564510761-a560db92a09b|1000
segmento-distribuicao|photo-1604503468506-a8da13d82791|1000
cuidados-frio|photo-1633096013004-e2cb4023b560|1000
prato-assado|photo-1606728035253-49e8a23146de|600
prato-assadeira|photo-1501200291289-c5a76c232e5f|600
prato-porcao|photo-1630564510846-09d14907db47|600
prato-fatiado|photo-1670398564097-0762e1b30b3a|600
cta-home|photo-1538170989343-ce003278e1a3|1600
cta-empresa|photo-1541329444622-e85b1a8980df|1600
cta-produtos|photo-1553531009-c4605f302b47|1600
cta-resfriado|photo-1604272451012-c1928e953064|1600
empresa-topo|photo-1535275226173-7ee8b465f0c1|1100
empresa-criacao|photo-1556316918-880f9e893822|1000
empresa-abate|photo-1642497394469-188b0f4bcae6|1000
empresa-venda|photo-1672787380739-6bd96bd86d4a|1000
catalogo-calibre|photo-1642102904019-2eb4c4d2b492|1000
congelado-uso|photo-1630564510846-09d14907db47|1000
galinha-uso|photo-1672787153720-e85fe802fd9f|1000
"

echo "$FOTOS" | while IFS='|' read -r nome id largura; do
  [ -z "${nome:-}" ] && continue
  url="https://images.unsplash.com/${id}?auto=format&fit=crop&w=${largura}&q=78"
  echo "→ ${nome} (${largura}px)"
  curl -fsSL "$url" -o "${DEST}/${nome}.jpg"
  if command -v cwebp >/dev/null 2>&1; then
    cwebp -quiet -q 80 "${DEST}/${nome}.jpg" -o "${DEST}/${nome}.webp"
    rm -f "${DEST}/${nome}.jpg"
    echo "   ${DEST}/${nome}.webp"
  else
    echo "   cwebp não encontrado — ficou em JPG. Instale com: sudo apt install webp"
  fi
done

echo
echo "Pronto. As fotos estão em ${DEST}/."
echo "O próximo passo (trocar os endereços no HTML) está explicado no README.md."
