import React from 'react';
import {useCurrentFrame} from 'remotion';
import {abs, CText, Svg, Cross, MonoText, WHITE, GREY, GREY_LINE, GREY_MID, PURPLE, PURPLE_LIGHT, ORANGE, fadeIn, exitOp, glowPurple} from '../../ui';
import {clamp01} from '../../common';
import {MouthShape, drawOn} from '../film';

/** SC11 说话是机械活（2908–3205）。
 *  节拍：2908 口腔剖面 draw-on → 2960 「机械活」舌抬一次 → 2990 200ms 刻度条 + 游标走两趟 → 3060 五个音点亮 + 「5–7 音/秒」 → 3130 光纤被划。 */
const F0 = 2908;
const TO = 3205;
const BAR = {x0: 460, x1: 820, y: 176};

export const SC11: React.FC = () => {
  const N = useCurrentFrame() + F0;
  const op = exitOp(N, TO, 8);
  const p = clamp01((N - 2908) / 20);
  const lift = N > 2960 && N < 2990 ? Math.sin(((N - 2960) / 30) * Math.PI) : 0;
  const barP = clamp01((N - 2990) / 12);
  const sweepN = clamp01((N - 3002) / 12);
  const pass = N >= 3014 ? clamp01((N - 3014) / 12) : sweepN;
  const curX = BAR.x0 + (BAR.x1 - BAR.x0) * pass;
  const dotP = (i: number) => clamp01((N - 3060 - i * 2) / 8);
  const fiberP = clamp01((N - 3120) / 12);
  const fiberCross = clamp01((N - 3150) / 12);

  return (
    <div style={{...abs(0, 0, 1280, 720), opacity: op}}>
      {/* 口腔剖面 */}
      <MouthShape cx={640} cy={340} w={210} open={0.55} tongue={0.4 + lift * 0.5} p={p} />
      {N > 2940 ? <CText cx={640} cy={456} size={24} color={GREY} weight={700} opacity={fadeIn(N - 2940, 10)}>机械活</CText> : null}

      {/* 200ms 刻度条 */}
      {barP > 0 ? (
        <>
          <Svg bloom={false}>
            <line x1={BAR.x0} y1={BAR.y} x2={BAR.x0 + (BAR.x1 - BAR.x0) * barP} y2={BAR.y} stroke={GREY} strokeWidth={1.6} />
            {Array.from({length: 12}, (_, i) => {
              const x = BAR.x0 + ((BAR.x1 - BAR.x0) * i) / 12;
              return <line key={i} x1={x} y1={BAR.y} x2={x} y2={BAR.y - 10} stroke={GREY} strokeWidth={1.4} opacity={clamp01((BAR.x0 + (BAR.x1 - BAR.x0) * barP - x) / 8)} />;
            })}
            <line x1={curX} y1={BAR.y - 26} x2={curX} y2={BAR.y + 12} stroke={PURPLE_LIGHT} strokeWidth={2.4} opacity={barP} />
          </Svg>
          <CText cx={640} cy={146} size={28} color={WHITE} weight={800} opacity={barP}>200 ms</CText>
        </>
      ) : null}

      {/* 五个音点 + 上限 */}
      <div>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{...abs(560 + i * 40 - 8, 548, 16, 16), borderRadius: 8, background: dotP(i) > 0 ? PURPLE : GREY_LINE, boxShadow: dotP(i) > 0.9 ? glowPurple(0.7) : undefined, opacity: 0.4 + 0.6 * dotP(i)}} />
        ))}
        <CText cx={640} cy={596} size={22} color={GREY} weight={700} opacity={dotP(4)}>5–7 音 / 秒</CText>
      </div>

      {/* 不是光纤 */}
      {fiberP > 0 ? (
        <Svg bloom={false}>
          <line x1={940} y1={340} x2={940 + 240 * fiberP} y2={340} stroke={PURPLE} strokeWidth={3} {...drawOn(fiberP, 240)} style={{filter: 'drop-shadow(0 0 8px rgba(102,48,248,.9))'}} />
          <circle cx={940} cy={340} r={6} fill={PURPLE_LIGHT} opacity={fiberP} />
          <circle cx={940 + 240 * fiberP} cy={340} r={6} fill={PURPLE_LIGHT} opacity={fiberP} />
          {fiberCross > 0 ? <Cross cx={1060} cy={340} size={78} p={fiberCross} color={ORANGE} sw={6} /> : null}
        </Svg>
      ) : null}
    </div>
  );
};
