import React from 'react';
import {useCurrentFrame} from 'remotion';
import {abs, CText, Svg, TechSub, MonoText, WHITE, GREY, GREY_LINE, GREY_MID, PURPLE, PURPLE_LIGHT, ORANGE, fadeIn, exitOp, glowPurple} from '../../ui';
import {clamp01, kf} from '../../common';
import {drawOn} from '../film';

/** SC25 五万年到五十万年，没有定论（6301–6507）。
 *  节拍：6301 时间轴自右向左 draw-on → 6340 紫标「5 万」落位 → 6380 灰标「50 万」闪 → 6410 橙虚线来回两趟 + no consensus。 */
const F0 = 6301;
const TO = 6507;
const AX = {x0: 200, x1: 1080, y: 380};

export const SC25: React.FC = () => {
  const N = useCurrentFrame() + F0;
  const op = exitOp(N, TO, 8);
  const axisP = clamp01((N - 6301) / 20);
  const markP = clamp01((N - 6340) / 12);
  const oldP = clamp01((N - 6380) / 8);
  const noP = clamp01((N - 6410) / 10);
  const sweepT = kf(N, [[6410, 0], [6422, 1], [6434, 0], [6446, 1]]);
  const dashX = 340 + 340 * sweepT;

  return (
    <div style={{...abs(0, 0, 1280, 720), opacity: op}}>
      <Svg bloom={false}>
        <line x1={AX.x0 + (AX.x1 - AX.x0) * (1 - axisP)} y1={AX.y} x2={AX.x1} y2={AX.y} stroke={WHITE} strokeWidth={2} />
        {Array.from({length: 23}, (_, i) => {
          const x = AX.x0 + i * 40;
          const shown = clamp01((AX.x1 - x) / 40 - (1 - axisP) * 2);
          return <line key={i} x1={x} y1={AX.y - 9} x2={x} y2={AX.y + 9} stroke={GREY} strokeWidth={1.4} opacity={shown} />;
        })}
        {markP > 0 ? <line x1={640} y1={AX.y - 40} x2={640} y2={AX.y + 22} stroke={PURPLE} strokeWidth={3} opacity={markP} /> : null}
        {noP > 0 ? <line x1={dashX - 170} y1={AX.y - 96} x2={dashX + 170} y2={AX.y - 96} stroke={ORANGE} strokeWidth={2} strokeDasharray="9 9" opacity={noP * 0.9} /> : null}
      </Svg>

      <CText cx={AX.x1 + 4} cy={AX.y - 30} size={22} color={GREY} weight={700}>今天</CText>
      <CText cx={AX.x0 + 16} cy={AX.y - 30} size={22} color={GREY} weight={700}>50 万年前</CText>
      {markP > 0 ? <CText cx={640} cy={AX.y + 54} size={30} color={PURPLE_LIGHT} weight={800} opacity={markP}>5 万</CText> : null}
      {noP > 0 ? <CText cx={640} cy={AX.y - 128} size={40} color={ORANGE} weight={800} opacity={noP}>？</CText> : null}
      {N > 6450 ? <TechSub cx={640} cy={AX.y + 106} text="no consensus" size={24} opacity={fadeIn(N - 6450, 12)} color={GREY} /> : null}
    </div>
  );
};
