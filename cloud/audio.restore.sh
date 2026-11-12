#!/usr/bin/env bash
# 项目：anything2explainer / works/thought-speed（《思维的速度》）
# 本仓库渲染前需要配音，但 audio.wav（44 MB，单人声）不进 git，
# 请在 README 的「素材」一节建立 Release 后同步修改下面的 URL 与 sha256。
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
