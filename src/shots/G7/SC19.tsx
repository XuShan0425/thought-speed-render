import React from 'react';
import {useCurrentFrame} from 'remotion';
import {abs, CText, Svg, Box, Cross, Pill, WHITE, GREY, GREY_LINE, GREY_MID, PURPLE, PURPLE_LIGHT, fadeIn, exitOp, glowPurple} from '../../ui';
import {clamp01} from '../../common';
import {Cube, drawOn} from '../film';

/** SC19 语言不是复制，是压缩（4940–5121）。
 *  节拍：4940 灰城 +「复制」被划 → 4986 压缩盒 + 拉链 → 5069 四个字块落入 → 5100 合成一个紫胶囊。 */
const F0 = 4940;
const TO = 5121;
const BOX = {cx: 760, cy: 340, s: 170};
const CHARS = ['昨', '天', '那', '个'];

export const SC19: React.FC = () => {
  const N = useCurrentFrame() + F0;
  const op = exitOp(N, TO, 8);
  const cityIn = clamp01((N - 4940) / 14);
  const copyCross = clamp01((N - 4962) / 12);
  const boxIn = clamp01((N - 4986) / 12);
  const zipP = clamp01((N - 5000) / 14);
  const blockP = (i: number) => clamp01((N - 5069 - i * 1) / 10);
  const merge = clamp01((N - 5100) / 12);

  return (
    <div style={{...abs(0, 0, 1280, 720), opacity: op}}>
      {/* 灰城 */}
      <div style={{opacity: 0.55 * cityIn}}>
        <Cube cx={300} cy={340} s={200} detail="city" tone={GREY} glowK={0} />
      </div>
      {N > 4952 ? <CText cx={300} cy={208} size={26} color={GREY} weight={800} opacity={fadeIn(N - 4952, 10)}>复制</CText> : null}
      {copyCross > 0 ? <Cross cx={300} cy={208} size={64} p={copyCross} color={GREY} sw={6} /> : null}

      {/* 压缩盒 + 拉链 */}
      {boxIn > 0 ? (
        <div style={{opacity: boxIn}}>
          <Box x={BOX.cx - BOX.s / 2} y={BOX.cy - BOX.s / 2} w={BOX.s} h={BOX.s} stroke={WHITE} sw={2.5} fill="rgba(0,0,0,.6)" glow={glowPurple(0.6 * boxIn)}>
            <Svg bloom={false}>
              {[0, 1, 2].map((i) => <path key={i} d={`M ${BOX.s * 0.42} ${BOX.s * (0.3 + i * 0.2)} L ${BOX.s * 0.58} ${BOX.s * (0.2 + i * 0.2)}`} stroke={PURPLE_LIGHT} strokeWidth={3} {...drawOn(zipP, 40)} />)}
            </Svg>
          </Box>
          <CText cx={BOX.cx} cy={BOX.cy + BOX.s / 2 + 34} size={24} color={PURPLE_LIGHT} weight={800}>压缩</CText>
        </div>
      ) : null}

      {/* 四个字块 → 一个胶囊 */}
      {CHARS.map((c, i) => {
        const p = blockP(i);
        if (p <= 0) return null;
        const y = 236 + i * 56 - (1 - p) * 18;
        return (
          <div key={c} style={{opacity: Math.max(0, p * (1 - merge * 1.6))}}>
            <Box x={960} y={y} w={92} h={50} stroke={i === 0 ? PURPLE : WHITE} sw={2} fill="rgba(0,0,0,.75)">
              <CText cx={46} cy={25} size={30} color={WHITE} weight={800}>{c}</CText>
            </Box>
          </div>
        );
      })}
      {merge > 0 ? (
        <div style={{opacity: merge}}>
          <Pill x={880} y={318} w={240} h={54} fill={PURPLE} text="昨天那个会" fontSize={28} glow={glowPurple(0.8)} />
          <CText cx={1000} cy={478} size={22} color={GREY} weight={700} opacity={merge}>4 个字</CText>
        </div>
      ) : null}
    </div>
  );
};
