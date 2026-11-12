import React from 'react';
import {useCurrentFrame} from 'remotion';
import {abs, CText, Svg, TechSub, WHITE, GREY, GREY_LINE, GREY_MID, PURPLE, PURPLE_LIGHT, fadeIn, exitOp, glowPurple} from '../../ui';
import {clamp01, kf} from '../../common';
import {Cube, drawOn} from '../film';

/** SC27 通道唯一能加宽的地方（6749–7155）。
 *  节拍：6757 内环 + 十个刻度 → 6800 三点通过 +「说慢一点」→ 6870 共享环 2→6px → 6960 环 6→8 + 五点 → 6990 拉远 0.86 → 7125 后完全静止。 */
const F0 = 6749;
const TO = 7155;
const C = {cx: 640, cy: 330};

export const SC27: React.FC = () => {
  const N = useCurrentFrame() + F0;
  const ringP = clamp01((N - 6757) / 18);
  const tickP = clamp01((N - 6776) / 10);
  const shareW = 2 + 4 * clamp01((N - 6870) / 18) + 2 * clamp01((N - 6902) / 16);
  const dots = N > 6800 ? Math.min(5, 3 + Math.floor((N - 6896) / 14)) : 0;
  const zoom = kf(N, [[6955, 1], [6971, 0.86]]);
  const textP = clamp01((N - 6890) / 12);

  return (
    <div style={{...abs(0, 0, 1280, 720), transform: `scale(${zoom})`, transformOrigin: '640px 330px'}}>
      {/* 10 bit 管横截面 */}
      <Svg bloom={false}>
        <circle cx={C.cx} cy={C.cy} r={100} fill="none" stroke={WHITE} strokeWidth={2.5} {...drawOn(ringP, 640)} />
        {Array.from({length: 10}, (_, i) => {
          const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
          const r0 = 88;
          const x0 = C.cx + Math.cos(a) * r0;
          const y0 = C.cy + Math.sin(a) * r0;
          const x1 = C.cx + Math.cos(a) * (r0 + 14);
          const y1 = C.cy + Math.sin(a) * (r0 + 14);
          const on = (i / 10) < tickP;
          return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke={on ? PURPLE : GREY_LINE} strokeWidth={2.4} opacity={on ? 1 : 0.4} />;
        })}
        {/* 共享环 */}
        <circle cx={C.cx} cy={C.cy} r={140} fill="none" stroke={PURPLE} strokeWidth={shareW} opacity={clamp01((N - 6870) / 14)} style={{filter: 'drop-shadow(0 0 10px rgba(102,48,248,.75))'}} />
      </Svg>

      {/* 管内通过的点 */}
      {Array.from({length: dots}, (_, i) => {
        const t = ((N - 6800 - i * 24) % 48) / 48;
        if (t < 0 || t > 1) return null;
        const x = C.cx - 70 + 140 * t;
        return <div key={i} style={{...abs(x - 6, C.cy - 6 + (i % 2 === 0 ? -10 : 12), 12, 12), borderRadius: 6, background: PURPLE_LIGHT, opacity: 0.9}} />;
      })}

      {textP > 0 ? (
        <>
          <CText cx={C.cx} cy={C.cy + 176} size={30} color={PURPLE_LIGHT} weight={800} opacity={textP}>重叠的字典</CText>
          <TechSub cx={C.cx} cy={C.cy + 212} text="shared lexicon" size={22} opacity={textP} />
        </>
      ) : null}


      {/* 四周点缀 */}
      <div style={{opacity: 0.3}}><Cube cx={392} cy={306} s={64} detail="none" glowK={0} tone={GREY} /></div>
    </div>
  );
};
