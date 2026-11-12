import React from 'react';
import {useCurrentFrame} from 'remotion';
import {abs, CText, Svg, Box, WHITE, GREY, GREY_LINE, GREY_MID, PURPLE, PURPLE_LIGHT, ORANGE, fadeIn, exitOp, glowPurple, mixHex} from '../../ui';
import {clamp01, kf, rnd} from '../../common';
import {BigNumber} from '../../fx';
import {EyeShape} from '../film';

/** SC17 一个词 vs 一只眼睛（4417–4617）。
 *  节拍：4417 十个比特块飞进「词」胶囊 → 4480 眼睛 + 扫光 → 4530 点阵铺满 → 4560 「1.6 × 10⁹」。 */
const F0 = 4417;
const TO = 4617;

export const SC17: React.FC = () => {
  const N = useCurrentFrame() + F0;
  const op = exitOp(N, TO, 8);
  const fly = clamp01((N - 4417) / 16);
  const pillPurple = clamp01((N - 4440) / 10);
  const eyeIn = clamp01((N - 4462) / 18);
  const sweep = clamp01((N - 4490) / 12);
  const field = clamp01((N - 4520) / 10);
  const numP = clamp01((N - 4556) / 14);

  return (
    <div style={{...abs(0, 0, 1280, 720), opacity: op}}>
      {/* 十个比特 → 一个词 */}
      {Array.from({length: 10}, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const r0 = 130;
        const sx = 300 + Math.cos(a) * r0;
        const sy = 300 + Math.sin(a) * r0 * 0.7;
        const tx = 240 + i * 12;
        const ty = 330;
        const x = sx + (tx - sx) * fly;
        const y = sy + (ty - sy) * fly;
        return <div key={i} style={{...abs(x - 7, y - 7, 14, 14), background: PURPLE, opacity: Math.max(0, 0.9 - fly * 1.5), boxShadow: glowPurple(0.5)}} />;
      })}
      {pillPurple > 0 ? (
        <Box x={228} y={306} w={144} h={48} r={24} stroke={PURPLE_LIGHT} sw={2.4} fill="rgba(102,48,248,.28)" glow={glowPurple(0.8 * pillPurple)} opacity={pillPurple}>
          <CText cx={72} cy={24} size={26} color={WHITE} weight={800}>一个词</CText>
        </Box>
      ) : null}
      {N > 4452 ? <CText cx={300} cy={392} size={22} color={GREY} weight={700} opacity={fadeIn(N - 4452, 10)}>≈ 10 比特</CText> : null}

      {/* 眼睛 + 点阵 */}
      <div style={{opacity: eyeIn}}>
        <EyeShape cx={860} cy={330} r={105} k={0.6 + 0.4 * sweep} />
      </div>
      {field > 0 ? (
        <Svg bloom={false} opacity={field * 0.55}>
          {Array.from({length: 16 * 12}, (_, i) => {
            const c = i % 16;
            const r = Math.floor(i / 16);
            const lit = (c / 16) < sweep;
            return <circle key={i} cx={1010 + c * 14} cy={186 + r * 14} r={3} fill={lit ? PURPLE_LIGHT : GREY_LINE} opacity={lit ? 0.9 : 0.35} />;
          })}
        </Svg>
      ) : null}
      {numP > 0 ? <BigNumber cx={1120} cy={488} value="1.6 × 10⁹" size={44} color={ORANGE} /> : null}
      {numP > 0 ? <CText cx={1120} cy={528} size={22} color={GREY} weight={700} opacity={numP}>单眼每秒 bit</CText> : null}
    </div>
  );
};
