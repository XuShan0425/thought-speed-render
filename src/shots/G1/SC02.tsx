import React from 'react';
import {useCurrentFrame} from 'remotion';
import {abs, CText, MonoText, Svg, Cross, WHITE, GREY, GREY_MID, GREY_LINE, PURPLE, PURPLE_LIGHT, fadeIn, exitOp, glowPurple} from '../../ui';
import {clamp01, kf, rnd} from '../../common';
import {Channel} from '../film';

/** SC02 三件事并行，一根管子（353–617）。
 *  节拍：361 三条轨道 draw-on + 三颗点错峰跑 → 452 竖直管 + 管内占用 + 第四颗点被挡 → 500 刻度尺 draw-on（快 / ?）。 */
const F0 = 353;
const TO = 617;
const TRACKS = [
  {y: 290, v: 1.0, ph: 0},
  {y: 355, v: 1.4, ph: 0.35},
  {y: 420, v: 0.8, ph: 0.7},
];
const TX0 = 110;
const TX1 = 370;
const TUBE_CX = 600;
const TUBE_CY = 355;
const RULER_X0 = 340;
const RULER_X1 = 940;
const RULER_Y = 545;

export const SC02: React.FC = () => {
  const N = useCurrentFrame() + F0;
  const op = 1; // 硬切进 SC03，不离场
  const trackP = clamp01((N - 361) / 18);
  const tubeP = clamp01((N - 452) / 14);
  const rulerP = clamp01((N - 500) / 20);
  const blockP = clamp01((N - 470) / 8);
  const dim = N >= 500 ? 0.1 * clamp01((N - 500) / 8) : 0;

  return (
    <div style={{...abs(0, 0, 1280, 720), opacity: op}}>
      {/* 三条并行轨道 */}
      {TRACKS.map((t, i) => {
        const run = ((N - 361) * 7 * t.v + t.ph * 260) % 260;
        const dotX = TX0 + run;
        return (
          <div key={i}>
            <Svg bloom={false}>
              <line x1={TX0} y1={t.y} x2={TX0 + (TX1 - TX0) * trackP} y2={t.y} stroke={GREY_LINE} strokeWidth={1.5} strokeDasharray="7 9" />
            </Svg>
            {trackP > 0.6 ? <div style={{...abs(dotX - 9, t.y - 9, 18, 18), borderRadius: 9, background: PURPLE, boxShadow: glowPurple(0.8 * trackP)}} /> : null}
          </div>
        );
      })}
      {N > 380 ? <CText cx={240} cy={236} size={22} color={GREY} weight={700} opacity={fadeIn(N - 380, 10)}>三件事</CText> : null}

      {/* 一根竖直管 */}
      <Channel cx={TUBE_CX} cy={TUBE_CY} w={48} h={220} p={tubeP} ticks={2} glowK={0.35 * tubeP} />
      {tubeP > 0.9 ? (
        <div style={{...abs(TUBE_CX - 16, TUBE_CY - 96 + 12 * Math.sin(N / 9), 32, 42), background: PURPLE, opacity: 0.55, boxShadow: glowPurple(0.6)}} />
      ) : null}
      {N > 462 ? <CText cx={TUBE_CX} cy={215} size={22} color={GREY} weight={700} opacity={fadeIn(N - 462, 10)}>一条</CText> : null}

      {/* 出口三个灰点 */}
      {[860, 940, 1020].map((x, i) => (
        <div key={i} style={{...abs(x, TUBE_CY - 7, 14, 14), borderRadius: 7, background: GREY_MID, opacity: fadeIn(N - 470 - i * 4, 10) * 0.85}} />
      ))}

      {/* 第四颗点被挡在入口 */}
      {blockP > 0 ? (
        <>
          <div style={{...abs(TUBE_CX - 9, TUBE_CY + 96 - 30 + 6 * Math.sin((N - 470) / 6), 18, 18), borderRadius: 9, background: PURPLE_LIGHT, opacity: blockP * 0.9}} />
          <Cross cx={TUBE_CX} cy={TUBE_CY + 108} size={26} p={blockP} color={GREY} sw={4} />
        </>
      ) : null}

      {/* 刻度尺：把「快」量一量 */}
      {rulerP > 0 ? (
        <div style={{opacity: 1}}>
          <Svg bloom={false}>
            <line x1={RULER_X0} y1={RULER_Y} x2={RULER_X0 + (RULER_X1 - RULER_X0) * rulerP} y2={RULER_Y} stroke={GREY} strokeWidth={1.5} />
            {Array.from({length: 13}, (_, i) => {
              const x = RULER_X0 + ((RULER_X1 - RULER_X0) * i) / 12;
              const shown = clamp01((RULER_X0 + (RULER_X1 - RULER_X0) * rulerP - x) / 6);
              return <line key={i} x1={x} y1={RULER_Y} x2={x} y2={RULER_Y - (i % 3 === 0 ? 16 : 9)} stroke={GREY} strokeWidth={1.5} opacity={shown} />;
            })}
          </Svg>
          <CText cx={RULER_X0 - 26} cy={RULER_Y - 4} size={22} color={GREY} weight={700} opacity={rulerP}>快</CText>
          <CText cx={RULER_X1 + 30} cy={RULER_Y - 4} size={30} color={GREY} weight={800} opacity={rulerP}>?</CText>
        </div>
      ) : null}

      {/* 500 起全画面压 10% 黑，把注意力收到尺子上 */}
      {dim > 0 ? <div style={{...abs(0, 0, 1280, 720), background: '#000', opacity: dim * 0.9, pointerEvents: 'none'}} /> : null}
    </div>
  );
};
