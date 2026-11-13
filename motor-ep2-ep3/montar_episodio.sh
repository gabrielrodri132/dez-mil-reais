#!/bin/sh
# Prepara a pasta para um episódio: ./montar_episodio.sh ep2-lucas | ep2-isabela | ep3
# Gera script.json, vo_offsets.json e scenes.js (que o stage.html carrega).
set -e
cd "$(dirname "$0")"
case "$1" in
  ep2-lucas)   cp script_ep2_lucas.json script.json;   cat base.js shots2.js shotlist2.js > scenes.js ;;
  ep2-isabela) cp script_ep2_isabela.json script.json; cat base.js shots2.js ttl.js shots3.js shotlist3.js > scenes.js ;;
  ep3)         cp script_ep3.json script.json; cp vo_offsets_ep3.json vo_offsets.json; cat base.js shots2.js shots4.js shotlist4.js > scenes.js ;;
  *) echo "uso: $0 ep2-lucas | ep2-isabela | ep3"; exit 1 ;;
esac
[ -f vo_offsets.json ] || echo '{"SR": 44100, "off": {}}' > vo_offsets.json
echo "pronto para $1"
