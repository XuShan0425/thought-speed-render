# thought-speed-render

《思维的速度》——本地项目 `H:\ARCHIVE\anything2explainer\works\thought-speed` 的云端渲染仓库。
本机只开 Studio 调动画，成片交给 GitHub Actions 的 Linux 机器跑（Public 仓库免费、不限分钟）。

合成：`Video` 是成片（1280×720 · 30fps · 7155 帧 ≈ 3 分 58 秒，含配音与配乐）；`Overlay` 与 `G1`–`G8` 是分组建镜头预览，没有音频。

## 每次渲染

1. 本地改完：`git add -A && git commit -m "tweak" && git push`（push 不会自动渲染）。
2. 仓库 **Actions** → **Render thought-speed** → **Run workflow**
   - `composition`：`Video`（成片）或 `Overlay` / `G1`…`G8`（预览）
   - `concurrency`：默认 3；日志里出现渲染进程被杀或内存报错就改 2
3. 跑完在该次运行页最底部 **Artifacts** 下载 MP4（保留 3 天）。

## 素材现状

| 文件 | 体积 | 是否入 git |
|---|---|---|
| `public/fonts/*.ttf` | 17.8 MB（NotoSansSC 最大） | 是 |
| `public/assets/thought-speed/bgm.mp3` | 5.5 MB | 是 |
| `public/assets/thought-speed/audio.wav` | 44 MB | 否，走 Release（见下） |
| `audio/bgm/raw.wav`、`audio/cache/`、`qc/`、`renders/`、`node_modules/` | — | 否 |

配音不进 git 的渲染会静音出片，所以 `cloud/audio.restore.sh` 负责在云端补齐。一次配置：

1. 本地执行 `gh release create footage-v1 public/assets/thought-speed/audio.wav`
2. `sha256sum public/assets/thought-speed/audio.wav` 取出哈希，填进 `cloud/audio.restore.sh` 的 `SHA256`
3. 在 `render.yml` 的 **Install dependencies** 后加一步 `run: bash cloud/audio.restore.sh`

## 已知限制

- Public 仓库：代码、字体（含 SIL OFL 许可证）、配乐公开可见；配乐版权归原曲方，仅作本片配乐使用。
- Artifact 单文件上限 500 MB、账号总量 500 MB；`retention-days: 3` 已设，成片要及时下载。
- Runner 4 核 / 16 GB 内存 / 14 GB 磁盘，单任务 6 小时上限；无 GPU，走 CPU 渲染。
- Remotion 商业许可：个人或 ≤3 人公司免费，接单成规模前看 remotion.dev/license。
