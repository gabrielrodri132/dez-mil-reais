#!/bin/sh
# Junta os trechos renderizados e coloca o som (voz + trilha + efeitos).
set -e
cd "$(dirname "$0")"
ffmpeg -v error -y -f concat -safe 0 -i parts/list.txt -c copy video_mudo.mp4
ffmpeg -v error -y -i video_mudo.mp4 -f f32le -ar 48000 -ac 2 -i mix.f32 \
  -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart dez_mil_reais_ep1.mp4
echo "pronto: dez_mil_reais_ep1.mp4"
