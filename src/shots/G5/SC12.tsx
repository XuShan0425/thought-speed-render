import React from 'react';
import {useCurrentFrame} from 'remotion';
import {abs, CText, Svg, Cross, MonoText, WHITE, GREY, GREY_LINE, GREY_MID, PURPLE, PURPLE_LIGHT, fadeIn, exitOp, glowPurple} from '../../ui';
import {clamp01} from '../../common';
import {Channel, Measure} from '../film';

/** SC12 只能排队：一次一个音（3206–3505）。
 *  节拍：3214 通道 draw-on + 「排队」 → 3294 三颗点依次上行（管内始终一颗）→ 3360 第四颗被挡 → 3396 左侧三轨并行亮起 + 「3 ∥ 1」。 */
const F0 = 3206;
const TO = 3505;
const CH = {cx: 640, cy: 350, w: 90, h: 320};
const Y0 = CH.cy - CH.h / 2;
const Y1 = CH.cy + CH.h / 2;

export const SC12: React.FC = () => {
  const N = useCurrentFrame() + F0;
  const op = exitOp(N, TO, 8);
  const chP = clamp01((N - 3214) / 16);
  const queueLabel = clamp01((N - 3240) / 10);
  // 三颗点依次上行：每颗 18 帧，间隔 10 帧
  const capsuleY = (idx: number) => {
    const start = 3294 + idx * 28;
    const t = clamp01((N - start) / 18);
    return Y1 - 12 - (Y1 - Y0 - 24) * (1 - Math.pow(1 - t, 2));
  };
  const blocked = clamp01((N - 3360) / 10);
  const par = clamp01((N - 3396) / 8);

  return (
    <div style={{...abs(0, 0, 1280, 720), opacity: op}}>
      <Channel cx={CH.cx} cy={CH.cy} w={CH.w} h={CH.h} p={chP} ticks={3} glowK={0.3 * chP} />
      {queueLabel > 0 ? <CText cx={CH.cx} cy={150} size={26} color={GREY} weight={800} opacity={queueLabel}>排队</CText> : null}

      {/* 管内：一次只有一颗 */}
      {[0, 1, 2].map((i) => {
        const y = capsuleY(i);
        const on = N >= 3294 + i * 28 && N <= 3294 + i * 28 + 22;
        if (!on) return null;
        return <div key={i} style={{...abs(CH.cx - 11, y, 22, 22), borderRadius: 11, background: PURPLE, boxShadow: glowPurple(0.85)}} />;
      })}

      {/* 入口第四颗被挡 */}
      {blocked > 0 ? (
        <>
          <div style={{...abs(CH.cx - 10, Y1 - 6, 20, 20), borderRadius: 10, background: PURPLE_LIGHT, opacity: blocked * 0.9}} />
          <Cross cx={CH.cx} cy={Y1 + 40} size={28} p={blocked} color={GREY} sw={4} />
        </>
      ) : null}

      {/* 左侧三条并行轨 */}
      {[0, 1, 2].map((i) => (
        <div key={i}>
          <Svg bloom={false}>
            <line x1={196} y1={CH.cy - 84 + i * 84} x2={376} y2={CH.cy - 84 + i * 84} stroke={GREY_LINE} strokeWidth={1.5} strokeDasharray="7 9" opacity={0.9} />
          </Svg>
          <div style={{...abs(300, CH.cy - 93 + i * 84, 18, 18), borderRadius: 9, background: par > 0.4 ? PURPLE : GREY_MID, boxShadow: par > 0.4 ? glowPurple(0.8) : undefined, opacity: 0.5 + 0.5 * par}} />
        </div>
      ))}
      {par > 0 ? <CText cx={286} cy={CH.cy + 118} size={22} color={GREY} weight={700} opacity={par}>三件事并行</CText> : null}

      {/* 右侧排队点 */}
      {[0, 1, 2].map((i) => {
        const o = clamp01((N - 3300 - i * 8) / 10);
        return <div key={i} style={{...abs(950, 266 + i * 84, 16, 16), borderRadius: 8, background: GREY_MID, opacity: o * 0.9}} />;
      })}
      {par > 0.5 ? <MonoText x={800} y={CH.cy + 118} size={26} color={PURPLE_LIGHT} opacity={clamp01((par - 0.5) / 0.5)}>3 ∥ 1</MonoText> : null}
      {N > 3330 ? <Measure x0={900} y0={chY(0)} x1={900} y1={chY(1)} text="1 个" p={1} op={fadeIn(N - 3330, 10)} /> : null}
    </div>
  );
};

function chY(i: number) {
  return 266 + i * 84 + 8;
}
