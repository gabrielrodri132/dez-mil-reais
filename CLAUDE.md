# Dez Mil Reais — novela interativa vertical (projeto "projeto 1")

Contexto passado do Claude (conversas no claude.ai) para o Claude Code. Leia antes de mexer.
O usuário é o Gabriel. Escreve em português, informal. **"el" = ElevenLabs.** Ele quer o vídeo pronto, não explicação de processo.

## O que é
Minissérie animada 9:16 de 15 episódios, ~1min50–2min cada, para Shorts/TikTok. Cada episódio termina com uma votação nos comentários (1 ou 2) que decide o próximo, e uma pista extra "para quem se inscrever".
Cada número de episódio pode ter duas versões: a visão do **Lucas** e a visão da **Isabela**.

**A bíblia da série está em `docs/bíblia_dez_mil_reais.md`** (cópia do doc "Dez Mil Reais — Ep. 2 (Lucas) e bíblia dos 15 episódios"). Ela tem: verdades fixas (o crime de 2006, quem é o número desconhecido), quem é quem, objetos que atravessam a série, arco dos 15 episódios, regras anti-furo, subtramas, roteiros dos Eps. 2 e 3 e as regras de produção. Ela manda; este arquivo só resume.
O doc original continua no claude.ai: https://claude.ai/artifact/X229EXHLaJNAiEWXcXV7Yp

## Onde a série parou (12/11/2026)
- Prontos: Ep. 1, Ep. 2 Lucas, Ep. 2 Isabela, Ep. 3 Lucas (MP4s ficaram nas saídas da conversa "projeto 1").
- Thumbs do Ep. 3 feitas (vertical e 16:9).
- **Próximo:** Ep. 3 da Isabela. Falta o Gabriel dizer qual opção ganhou na votação do Ep. 2 dela: **1 = depor pelo Lucas** ou **2 = seguir o pai até o "assunto das nove"**. Não comece sem isso.
- A partir do Ep. 3, os dois têm **subtramas próprias** (seção "Subtramas" da bíblia): no máximo uma cena em comum por par de episódios.

## Padrões combinados com o Gabriel
- **Título:** `[gancho do episódio] | Dez Mil Reais Ep.N · Novela que você decide`
  Isabela: `[gancho] | Dez Mil Reais Ep.N (Isabela) · Novela que você decide`. O gancho vem primeiro.
- **Hashtags:** sempre `#DezMilReais #NovelaInterativa #VocêDecide` primeiro, depois até 2 do episódio.
- **Thumb:** selo "DEZ MIL REAIS + EP N" no canto superior esquerdo ("EP N · ISABELA" na versão dela); um rosto com emoção forte; um objeto circulado em vermelho (o mistério do episódio); 2–3 palavras que não repetem o título. Versão vertical (Shorts) e 16:9 (busca).
- **Playlist:** "Dez Mil Reais — Novela que você decide", em ordem; a visão da Isabela logo depois do episódio do Lucas de mesmo número.
- **Retenção (aprendido com as métricas):** injustiça na primeira frase, zero recapitulação longa, a maior virada perto dos 50 s (onde o público saía), uma pergunta nova antes de fechar a anterior, placa de lugar e hora em cenário novo, plano aberto antes do close, planos de no mínimo ~2,5 s, um título grande por virada, fim com pista nova (não despedida).
- **Legenda:** maiúsculas, branca com contorno preto, palavra atual em amarelo, **na parte de baixo** (nunca no meio da tela), fora da faixa inferior de 380 px e da coluna direita de 160 px (botões do app).
- **Contador** "N/15" no canto superior esquerdo do primeiro ao último quadro.
- **Qualidade:** ver "Produção" na bíblia (render em dobro e reduzir, granulado leve, áudio em -14 LUFS, subir o arquivo original sem reexportar no CapCut).

## Vozes (ElevenLabs, modelo eleven_v4)
| Personagem | voice_id |
|---|---|
| Lucas | `p8HXKcaTnWpjHFZFBDE8` (Victor) |
| Ricardo | `jKCVPYeBYhiBZRS5hbIL` (Rozeng) |
| Dona Vera | `B2J9b1PGBDt65GMZeYtU` (Clarice Rodrigues) |
| Número desconhecido | `T2qRqqooUigDNZPs6usG` (Torlien), com filtro de telefone aplicado no `build_timeline.py` |
Isabela, Célia, Graça, Delegado Moura e Paula foram escolhidas nas conversas dos Eps. 2 e 3; o perfil de cada voz está na bíblia ("Vozes novas"). Pegue os IDs na conta do ElevenLabs (fluxos dos Eps. 2 e 3) em vez de inventar.
Gerar voz gasta créditos: não repita geração sem o Gabriel pedir.

Desde o Ep. 3 as falas vêm num **MP3 único por episódio** (o Gabriel baixa do ElevenLabs e manda). `vo_offsets_ep3.json` diz onde começa cada fala dentro dele (`vozes_ep3.wav`).

## Pastas
- `motor-ep2-ep3/` — **motor atual** (use este para episódios novos). Personagens com todo o elenco, cenários e cenas dos Eps. 2 e 3, trilha e render.
- `ep1-refeito/` — versão do Ep. 1 refeita com vozes do ElevenLabs (tem o próprio CLAUDE.md). O `chars.js` dele é mais antigo que o do motor.
- `docs/` — a bíblia.

## Como rodar o motor
Requisitos: Python 3 (numpy, scipy), Node com `playwright` e Chromium, ffmpeg, fontes Inter e Noto Color Emoji. Se o Chromium não for achado, defina `CHROME_PATH`.

```sh
cd motor-ep2-ep3
./montar_episodio.sh ep3          # ou ep2-lucas / ep2-isabela: monta script.json, vo_offsets.json e scenes.js
# coloque as falas em vo/<clipe>.mp3, ou o MP3/WAV único com o vo_offsets.json certo
python3 build_timeline.py         # sincroniza falas, boca e legenda -> timeline.json + voice.f32
sh mktl.sh                        # timeline.json -> tl.js
node export_shots.js              # cortes -> shots.json
python3 sfx4.py                   # trilha do episódio (sfx2 = Ep.2 Lucas, sfx3 = Ep.2 Isabela, sfx4 = Ep.3)
rm -rf parts && for w in 0 1 2 3; do node render.js $w 4 & done; wait
ffmpeg -f concat -safe 0 -i parts/list.txt -c copy mudo.mp4
ffmpeg -i mudo.mp4 -f f32le -ar 48000 -ac 2 -i mix.f32 -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -shortest saida.mp4
```
Sem áudio real, `build_timeline.py` usa um tom de teste (só para mexer no visual).
`scenes.js` é montado juntando `base.js` + `shots2.js` (+ `shots3.js`/`shots4.js`) + `shotlistN.js`; o `montar_episodio.sh` faz isso. Os três episódios montaram e geraram a lista de cortes num teste, mas confira o primeiro render antes de confiar.
Para um episódio novo: copie o padrão (novo `script_epN.json`, `shotsN.js`, `shotlistN.js`, `sfxN.py`) e acrescente uma linha no `montar_episodio.sh`.

Conferir quadros: `node snap.js 2 10 30` gera `snaps/t_*.jpg`; `python3 sheet.py folha.jpg "2 10 30"` junta numa folha.

## Cuidado
- Downloads do ElevenLabs: as URLs assinadas expiram. Na nuvem do claude.ai o domínio `elevenlabsusercontent.com` era bloqueado; na máquina do Gabriel deve funcionar.
- Não mude fatos fixos da bíblia (datas, quem é o número desconhecido, senha do cofre 140306 etc.) sem o Gabriel pedir.
