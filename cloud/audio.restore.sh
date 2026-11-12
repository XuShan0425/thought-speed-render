#!/usr/bin/env bash
# 项目：anything2explainer / works/thought-speed（《思维的速度》）
# 配音 audio.wav（44 MB 单人声，已超过 GitHub 100 MB 单文件带宽余量）不进 git。
# 一次性准备：按 README「素材」一节建立 Release（tag footage-v1，附 audio.wav），
# 把下面的 URL 与 sha256 填实；workflow 在 Render 前调用本脚本补齐。
set -euo pipefail
SLUG=thought-speed
OUT="public/assets/$SLUG/audio.wav"
URL="https://github.com/XuShan0425/thought-speed-render/releases/download/footage-v1/audio.wav"
SHA256="REPLACE_WITH_SHA256"
if [ -f "$OUT" ]; then echo "audio present"; exit 0; fi
mkdir -p "$(dirname "$OUT")"
curl -fL --retry 3 -o "$OUT" "$URL"
echo "$SHA256  $OUT" | sha256sum -c -
echo "restored $OUT"
