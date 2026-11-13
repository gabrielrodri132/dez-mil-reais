# Dez Mil Reais — Episódio 1 (minissérie animada vertical)

Contexto passado do Claude (modo conversa) para o Claude Code. Leia tudo antes de mexer.

## Quem é o usuário e como ele fala
- Cria vídeos curtos verticais (9:16) para um canal. Escreve em português, informal.
- **"el" = ElevenLabs.** Sempre que ele escrever "el", é o ElevenLabs.
- Ele quer o vídeo pronto (MP4), não explicação de processo.

## O que ele pediu nesta rodada (requisitos)
1. Vozes do ElevenLabs condizentes com cada personagem, **sincronizadas** com a legenda e com o que aparece na tela (boca mexendo junto).
2. Duração **entre 90 e 110 segundos** (a versão anterior tinha 1min54, longa demais).
3. Personagens com **mais expressões** e desenho mais bem feito (a versão anterior estava pobre).
4. **Legenda mais embaixo.** Antes ficava quase no meio da tela (66% da altura); agora fica a ~82% (`#cap { bottom: 15.5% }` em `stage.html`). Não subir de novo.
5. **Ganchos** ao longo do vídeo para prender até o fim.
6. No final, **estímulo para se inscrever como se fosse ganhar uma recompensa**.
7. Liberdade para mudar elementos narrativos para deixar mais dinâmico/viciante.

## História (roteiro atual, ~105 s)
Lucas, 22, entregador de bike, mãe doente, 7 dias para pagar R$ 3.800 ou ir pra rua. Namora a Isabela (rica).
No jantar, o pai dela (Ricardo) e a mãe (Dona Vera) humilham o Lucas; Ricardo joga R$ 100 no chão.
Na chuva, um **número desconhecido** manda mensagem: "Olhe pra baixo." Lucas acha uma carteira com R$ 10.000.
**Reviravolta: a carteira é do Ricardo.** Final: enquete "1 = devolver / 2 = ficar" + inscrição.

Ganchos usados, em ordem: abre direto no dinheiro → ameaça "Eu vou saber" → vulto vigiando ("QUEM?") →
"48 horas antes" com efeito de rebobinar → "o pior ainda não tinha acontecido" → pista plantada
(Ricardo guarda a carteira no paletó, "👀 GUARDA ESSE DETALHE") → chat misterioso → contagem do dinheiro →
habilitação revela "O PAI DELA!" com flashback "LEMBRA?" → ameaça repetida → enquete → CTA com recompensa
("inscritos descobrem primeiro quem é o número desconhecido no ep. 2").

Falas completas: `script.json` (campo `clips`). A ordem e as pausas ficam em `segments`.

## Vozes (ElevenLabs, modelo eleven_v4)
Fluxo no ElevenLabs: **"Dez Mil Reais – Ep. 1 vozes"**, flow_id `BtAgaqWciXEcrlsYUZrh`.

| Personagem | Voz | voice_id |
|---|---|---|
| Lucas (narrador) | Victor – Warm, Expressive | `p8HXKcaTnWpjHFZFBDE8` |
| Ricardo (pai rico, arrogante) | Rozeng (grave, firme) | `jKCVPYeBYhiBZRS5hbIL` |
| Dona Vera (mãe esnobe) | Clarice Rodrigues (grave feminina) | `B2J9b1PGBDt65GMZeYtU` |
| Número desconhecido (sussurro) | Torlien (misterioso) | `T2qRqqooUigDNZPs6usG` |

As 13 falas **já foram geradas** (2 takes cada). Os IDs de geração estão em `gens.json` (chave = clipe do `script.json`; use o primeiro ID de cada par, a menos que o usuário escolha outro take).
**Não gere de novo** sem ele pedir: gasta créditos.

⚠️ As URLs assinadas de download expiram. Peça URLs novas com a ferramenta do ElevenLabs
`creative_get_generations` (flow_id acima + os generation_ids) e baixe cada `full_res_url`.
Salve como `vo/L1.mp3`, `vo/U1.mp3`, `vo/L2.mp3`, … (mesmos nomes das chaves de `gens.json`).
Se não houver ferramenta do ElevenLabs aqui, peça ao usuário para conectar o ElevenLabs ou baixar os 13 áudios do fluxo e colocar em `vo/`.

O efeito de "voz de telefone" do número desconhecido é aplicado em `build_timeline.py` (filtro ffmpeg), não na geração.

## Por que o vídeo não ficou pronto no modo conversa
O ambiente na nuvem bloqueava o domínio `elevenlabsusercontent.com` (erro 403 no proxy), então os áudios não puderam ser baixados.
Ativar "Permitir saída de rede" nas Configurações só vale para conversas novas. Na máquina do usuário isso não deve acontecer.

## Pipeline (rodar nesta ordem)
Requisitos: Python 3 com numpy e scipy, Node com `playwright` (Chromium instalado), ffmpeg, e as fontes Inter e Noto Color Emoji.
Se o Chromium do Playwright não for achado, defina `CHROME_PATH` com o caminho do Chrome.

```sh
# 0. áudios em vo/*.mp3 (ver acima)
python3 build_timeline.py   # alinha falas/palavras, envelope da boca -> timeline.json + voice.f32
./mktl.sh                   # timeline.json -> tl.js (lido pelo stage.html)
node export_shots.js        # cortes de cena -> shots.json
python3 sfx.py              # trilha + efeitos + ducking da voz -> mix.f32
rm -rf parts && for w in 0 1 2 3; do node render.js $w 4 & done; wait   # renderiza 1080x1920 30fps por cena
./mux.sh                    # junta tudo -> dez_mil_reais_ep1.mp4
```
Sem os áudios reais, `build_timeline.py` usa um tom de teste no lugar (serve só para mexer no visual).
Depois de trocar os áudios, **refaça tudo do passo 1**: os tempos de cena, legenda e boca vêm da duração real das falas.

Conferir: `ffprobe` na duração (tem que dar 90–110 s; se passar, ajuste `pre`/`post` em `script.json` ou rode com `TEMPO=1.05 python3 build_timeline.py`).
Para olhar quadros: `node snap.js 2 10 28.5 39.5 84.6` gera `snaps/t_*.jpg`; `python3 sheet.py snaps/folha.jpg "2 10 28.5"` monta uma folha de contato.

## Arquivos
- `chars.js` — rig dos personagens (SVG): olhos com pálpebra real, sobrancelhas, boca com fala (`talk`), lágrima, suor, rubor, respiração, piscada automática. `charBust(nome, x, y, escala, {expressões})`.
- `scenes.js` — todas as cenas (`SH.*`), lista de cortes em `buildShots()` ancorada nas falas (ex.: `"L3.p2-0.1"` = 0,1 s antes da 3ª frase do clipe L3), e legendas palavra por palavra.
- `stage.html` — palco 1080×1920, legenda, etiqueta com nome de quem fala (RICARDO / DONA VERA / NÚMERO DESCONHECIDO), granulado.
- `previa_personagens.jpg` — como o visual ficou (aprovado para seguir).

## Decisões de estilo que o usuário já viu
- Contorno escuro, sombreado chapado, luz de recorte azul nas cenas de chuva, tons quentes na mansão.
- Ricardo e Dona Vera com olhar de desdém (pálpebra baixa, meio sorriso torto). Ao falar, a boca do Ricardo não deve abrir demais.
- Legenda: maiúsculas, branca com contorno preto, palavra atual em amarelo; fala do número desconhecido em vermelho.
- Nada de texto do cenário atrás da legenda: os personagens em close ficam mais altos para a legenda não cobrir a boca.

## Entrega
1. O MP4 final para o usuário.
2. Atualizar a página antiga do episódio "Dez Mil Reais" (artifact `https://claude.ai/code/artifact/f7e03690-85e4-4afe-92ed-373bf2e32bfb`) se houver ferramenta de artefatos; senão, só o MP4.
Backup deste projeto também está no artifact "Dez Mil Reais — projeto do episódio 1" (`https://claude.ai/artifact/U5kpNTLYmNJiRU4m4ihDBF`).
