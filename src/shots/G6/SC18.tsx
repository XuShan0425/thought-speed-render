import React from 'react';
import {useCurrentFrame} from 'remotion';
import {abs, CText, Svg, Box, WHITE, GREY, GREY_LINE, GREY_MID, PURPLE, PURPLE_LIGHT, ORANGE, fadeIn, exitOp, glowPurple} from '../../ui';
import {GlitchIn, clamp01, kf} from '../../common';
import {Cube, drawOn} from '../film';

/** SC18 瀑布进水，吸管出水（4618–4885）。
 *  节拍：4626 城 → 4700 城压进中央吸管 → 4756 瀑布 → 4800 小勺 + 三滴水 → 4830 「？」。 */
const F0 = 4618;
const TO = 4885;
const STRAW = {cx: 640, w: 26, h: 300};

export const SC18: React.FC = () => {
  const N = useCurrentFrame() + F0;
  const op = exitOp(N, TO, 8);
  const cityIn = clamp01((N - 4626) / 14);
  const squeeze = kf(N, [[4700, 1], [4726, 0.1]]);
  const strawP = clamp01((N - 4700) / 20);
  const fall = clamp01((N - 4756) / 18);
  const spoonIn = clamp01((N - 4800) / 12);
  const qIn = clamp01((N - 4830) / 10);
  const dropT = (i: number) => clamp01((N - 4812 - i * 12) / 8);

  return (
    <div style={{...abs(0, 0, 1280, 720), opacity: op}}>
      {/* 城：整座的那部分 */}
      <Cube cx={300} cy={330} s={260} op={cityIn} detail="city" glowK={0.7 * cityIn} scaleX={squeeze} />

      {/* 吸管 */}
      {strawP > 0 ? (
        <Svg bloom={false}>
          <line x1={STRAW.cx - STRAW.w / 2} y1={330 - STRAW.h / 2} x2={STRAW.cx - STRAW.w / 2} y2={330 - STRAW.h / 2 + STRAW.h * strawP} stroke={WHITE} strokeWidth={3} />
          <line x1={STRAW.cx + STRAW.w / 2} y1={330 - STRAW.h / 2} x2={STRAW.cx + STRAW.w / 2} y2={330 - STRAW.h / 2 + STRAW.h * strawP} stroke={WHITE} strokeWidth={3} />
          <path d={`M ${STRAW.cx - STRAW.w / 2} ${330 - STRAW.h / 2} L ${STRAW.cx + STRAW.w / 2 + 4} ${330 - STRAW.h / 2 - 8}`} stroke={WHITE} strokeWidth={3} opacity={strawP > 0.9 ? 1 : 0} />
        </Svg>
      ) : null}
      {strawP > 0.9 ? <div style={{...abs(STRAW.cx - STRAW.w / 2 - 4, 330 - STRAW.h / 2, STRAW.w + 8, STRAW.h), boxShadow: glowPurple(0.35), borderRadius: 18}} /> : null}

      {/* 进水：瀑布 */}
      {fall > 0 ? (
        <Svg bloom={false}>
          {[0, 1, 2, 3, 4].map((i) => {
            const x0 = 470 + i * 18;
            return <line key={i} x1={x0} y1={168} x2={x0 - 30 * fall} y2={168 + 150 * fall} stroke={i % 2 === 0 ? WHITE : GREY} strokeWidth={i % 2 === 0 ? 3 : 2} opacity={0.85} />;
          })}
          {[0, 1, 2, 3, 4, 5].map((i) => <circle key={'s' + i} cx={480 + i * 14} cy={330 + (i % 2) * 8} r={3} fill={WHITE} opacity={fall * 0.8} />)}
        </Svg>
      ) : null}
      {fall > 0 ? <CText cx={540} cy={140} size={22} color={GREY} weight={700} opacity={fall}>进水</CText> : null}

      {/* 出水：小勺 + 三滴水 */}
      {spoonIn > 0 ? (
        <div style={{opacity: spoonIn}}>
          <Svg bloom={false}>
            <ellipse cx={900} cy={400} rx={54} ry={26} fill="none" stroke={WHITE} strokeWidth={2.4} />
            <line x1={954} y1={400} x2={1010} y2={380} stroke={WHITE} strokeWidth={2.4} />
            <path d="M 880 396 Q 900 410 920 396" fill="none" stroke={PURPLE_LIGHT} strokeWidth={4} />
          </Svg>
          <CText cx={900} cy={452} size={22} color={GREY} weight={700}>出水</CText>
        </div>
      ) : null}
      {[0, 1, 2].map((i) => {
        const t = dropT(i);
        if (t <= 0 || t >= 1) return null;
        return <div key={i} style={{...abs(STRAW.cx - 4, 480 + 40 * (1 - t) + i * 6, 8, 12), borderRadius: 6, background: PURPLE_LIGHT, opacity: 1 - t * 0.7}} />;
      })}

      {/* 为什么还够用 */}
      {qIn > 0 ? (
        <div style={{opacity: qIn}}>
          <GlitchIn N={N} f0={4830} rgbSplit={5} slices={10}>
            <CText cx={768} cy={166} size={78} color={WHITE} weight={800}>？</CText>
          </GlitchIn>
        </div>
      ) : null}
    </div>
  );
};
