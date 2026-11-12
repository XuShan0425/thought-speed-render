import React from 'react';
import {useCurrentFrame} from 'remotion';
import {abs, CText, Svg, Cross, WHITE, GREY, GREY_LINE, GREY_MID, PURPLE, PURPLE_LIGHT, ORANGE, fadeIn, exitOp} from '../../ui';
import {GlitchIn} from '../../common';
import {clamp01, kf} from '../../common';
import {BigNumber} from '../../fx';
import {drawOn} from '../film';

/** SC07 四千词的真相（1778–2124）。
 *  节拍：1786 「4000」计数 + 引号 → 1860 速度轴 → 1900 划掉「无实测来源」 → 1946 「66.7」 → 1980 ×6 标注 → 2040 音波被截断。 */
const F0 = 1778;
const TO = 2124;
const AX = {x0: 240, x1: 1040, y: 470};
const TICK = [{v: 150, x: 400, label: '150'}, {v: 637, x: 690, label: '637'}, {v: 4000, x: 950, label: '4000'}];

export const SC07: React.FC = () => {
  const N = useCurrentFrame() + F0;
  const op = exitOp(N, TO, 8);
  const numIn = clamp01((N - 1786) / 18);
  const morph = clamp01((N - 1946) / 16);
  const axisP = clamp01((N - 1860) / 20);
  const crossP = clamp01((N - 1900) / 12);
  const braceP = clamp01((N - 1980) / 12);
  const waveP = clamp01((N - 2040) / 14);
  const cutP = clamp01((N - 2078) / 12);
  const bigVal = Math.round(4000 * (1 - Math.pow(1 - numIn, 2)));
  const size = 128 - 40 * clamp01((N - 1946) / 14);
  const dotX = kf(N, [[1900, 950], [1946, 950], [1968, 475]]);

  return (
    <div style={{...abs(0, 0, 1280, 720), opacity: op}}>
      {/* 引号 + 坊间说法 */}
      <div style={{opacity: fadeIn(N - 1800, 12) * 0.55}}>
        <CText cx={392} cy={196} size={62} color={GREY} weight={800}>“</CText>
        <CText cx={470} cy={196} size={62} color={GREY} weight={800}>”</CText>
      </div>
      {N > 1812 ? <CText cx={432} cy={248} size={22} color={GREY} weight={700} opacity={fadeIn(N - 1812, 10)}>坊间说法</CText> : null}

      {/* 巨字 4000 → 66.7 */}
      <div style={{opacity: clamp01((N - 1786) / 10)}}>
        <GlitchIn N={N} f0={1946} rgbSplit={4} slices={8}>
          <BigNumber cx={560} cy={290} value={morph > 0.02 ? '66.7' : bigVal} size={size} color={WHITE} unit={morph > 0.02 ? '词 / 秒' : '词 / 分'} unitSize={26} unitColor={GREY} />
        </GlitchIn>
      </div>

      {/* 速度轴 */}
      {axisP > 0 ? (
        <>
          <Svg bloom={false}>
            <line x1={AX.x0} y1={AX.y} x2={AX.x0 + (AX.x1 - AX.x0) * axisP} y2={AX.y} stroke={GREY} strokeWidth={1.6} />
            {TICK.map((t, i) => {
              const on = Math.abs(dotX - t.x) < 2 && N >= 1968 ? 1 : 0;
              return (
                <g key={i}>
                  <line x1={t.x} y1={AX.y - 10} x2={t.x} y2={AX.y + 10} stroke={GREY} strokeWidth={2} opacity={axisP} />
                  <circle cx={t.x} cy={AX.y} r={on ? 9 : 5} fill={on ? PURPLE : GREY_MID} opacity={axisP} />
                </g>
              );
            })}
          </Svg>
          {TICK.map((t, i) => <CText key={i} cx={t.x} cy={AX.y + 40} size={24} color={i === 2 ? WHITE : GREY} weight={800} opacity={axisP}>{t.label}</CText>)}
          {crossP > 0 ? <Cross cx={950} cy={AX.y} size={54} p={crossP} color={ORANGE} sw={6} /> : null}
          {crossP > 0.6 ? <CText cx={1046} cy={AX.y - 40} size={22} color={ORANGE} weight={700} opacity={clamp01((crossP - 0.6) / 0.4)}>无实测来源</CText> : null}
        </>
      ) : null}

      {/* ×6：66.7 的落点与 637 刻点之间 */}
      {braceP > 0 ? (
        <CText cx={582} cy={436} size={30} color={ORANGE} weight={800} opacity={braceP}>×6</CText>
      ) : null}

      {/* 音波：从 637 一侧向上射，被截断 */}
      {waveP > 0 ? (
        <Svg bloom={false}>
          {Array.from({length: 9}, (_, i) => {
            const x = 790 + i * 24;
            const h = 66 * Math.min(1, waveP * 1.6 - i * 0.06);
            return <rect key={i} x={x} y={470 - h} width={9} height={Math.max(0, h)} rx={4} fill={i < 5 ? PURPLE_LIGHT : GREY_MID} opacity={0.9} />;
          })}
          {cutP > 0 ? <line x1={894} y1={470} x2={894} y2={372} stroke={ORANGE} strokeWidth={5} opacity={cutP} {...drawOn(cutP, 110)} /> : null}
        </Svg>
      ) : null}
      {cutP > 0.5 ? <CText cx={894} cy={344} size={22} color={ORANGE} weight={700} opacity={clamp01((cutP - 0.5) / 0.5)}>发不出来</CText> : null}
    </div>
  );
};
