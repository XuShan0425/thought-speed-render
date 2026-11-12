# thought-speed-render

《思维的速度》——本地项目 `H:\ARCHIVE\anything2explainer\works\thought-speed` 对应仓库（**不是** `art-film-2026-11-12`，也不是云端其他项目）。
本机只开 Studio 调动画，成片交给 GitHub Actions 的 Linux 机器跑（Public 仓库免费、不限分钟）。

合成：`Video` 是成片（1280×720 · 30fps · 7155 帧 ≈ 3 分 58 秒）；`Overlay` 与 `G1`–`G8` 是分组建镜头预览。预览合成本来就没有音频。

## 当前模式：无配音（NO_VOICE）

本片走**无配音**：成片里没有人声、也没有配乐，画面 / 字幕 / 章节进度条 / 片尾卡照常。
落地方式是 `src/config.ts` 的 `noVoice: true` 加 `src/Main.tsx` 的 `noVoice` 开关——为真时 `<Audio>` 完全不挂载，**也不会去读 `audio.wav` / `bgm.mp3`**，所以云端不需要还原任何音频文件。

云端用 props 文件传这个开关（命令行内联 JSON 在 Windows/Linux 上引号都不可靠）：

| 文件 | 内容 | 用途 |
|---|---|---|
| `cloud/props-silent.json` | `{ "noVoice": true }` | 无配音（默认） |
| `cloud/props-voiced.json` | `{ "noVoice": false }` | 回头要配音时 |

本机自检（已跑通，帧 6000 出图正常）：

```bash
npx remotion still src/index.ts Video out/verify/f6000.png --frame=6000 --props=cloud/props-silent.json
```

Studio 里也可以直接在右侧 Input Props 填 `{"noVoice": true}` 听静音版。

## 每次渲染

1. 本地改完：`git add -A && git commit -m "tweak" && git push`（push 不会自动渲染）。
2. 仓库 **Actions** → **Render thought-speed** → **Run workflow**
   - `composition`：`Video`（成片）或 `Overlay` / `G1`…`G8`（预览）
   - `concurrency`：默认 3；日志里出现渲染进程被杀或内存报错就改 2
   - `no_voice`：**默认 true（静音）**；设 false 才走 `cloud/audio.restore.sh` 还原人声 + 配乐
3. 跑完在该次运行页最底部 **Artifacts** 下载 MP4（保留 3 天，静音版名字带 `-silent`）。

## 素材现状

| 文件 | 体积 | 是否入 git |
|---|---|---|
| `public/fonts/*.ttf` | 17.8 MB（NotoSansSC 最大） | 是（渲染必需，SIL OFL） |
| `public/assets/thought-speed/bgm.mp3` | 5.5 MB | 否（无配音模式用不到） |
| `public/assets/thought-speed/audio.wav` | 44 MB | 否，走 Release |
| `audio/bgm/raw.wav`、`audio/cache/`、`qc/`、`renders/`、`out/verify/`、`node_modules/` | — | 否 |

以后真要出厂带配音的版本：先 `gh release create footage-v1 public/assets/thought-speed/audio.wav`，把 `sha256sum` 结果填进 `cloud/audio.restore.sh` 的 `SHA256`，再把 `no_voice` 设成 false 重跑。

## 已知限制

- Public 仓库：代码、字体（含 SIL OFL 许可证）公开可见。无配音模式下仓库里没有音频，版权面更干净。
- Artifact 单文件上限 500 MB、账号总量 500 MB；`retention-days: 3` 已设，成片要及时下载。
- Runner 4 核 / 16 GB 内存 / 14 GB 磁盘，单任务 6 小时上限；无 GPU，走 CPU 渲染。
- Remotion 商业许可：个人或 ≤3 人公司免费，接单成规模前看 remotion.dev/license。
