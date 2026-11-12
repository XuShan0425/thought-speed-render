import React from 'react';
import {useCurrentFrame} from 'remotion';
import {abs, CText, Svg, WHITE, GREY, GREY_LINE, GREY_MID, PURPLE, PURPLE_LIGHT, fadeIn, exitOp, glowPurple} from '../../ui';
import {clamp01} from '../../common';
import {Channel, EyeShape} from '../film';

/** SC15 同一条通道：读也慢，写也慢（4002–4158）。
 *  节拍：4002 通道重描 → 4030 眼/笔交替投点（4 颗）→ 4100 左下角灰字。 */
const F0 = 4002;
const TO = 4158;
const CH = {cx: 640, cy: 350, w: 90, h: 320};
const Y1 = CH.cy + CH.h / 2;

export const SC15: React.FC = () => {
  const N = useCurrentFrame() + F0;
  const op = exitOp(N, TO, 8);
  const redraw = clamp01((N - 4002) / 12);
  const iconIn = clamp01((N - 4022) / 10);
  const dotY = (i: number) => {
    const start = 4030 + i * 14;
    const t = clamp01((N - start) / 20);
    return Y1 - 10 - (Y1 - CH.cy - 10) * (1 - Math.pow(1 - t, 2));
  };
  const textP = clamp01((N - 4100) / 12);

  return (
    <div style={{...abs(0, 0, 1280, 720), opacity: op}}>
      <Channel cx={CH.cx} cy={CH.cy} w={CH.w} h={CH.h} p={1} ticks={3} glowK={0.5 * redraw * (1 - redraw * 0.5)} />

      {/* 入口上方：眼睛 / 笔 交替 */}
      <div style={{opacity: iconIn}}>
        <EyeShape cx={580} cy={148} r={44} op={1} k={0.45} />
        <CText cx={552} cy={216} size={22} color={GREY} weight={700} opacity={iconIn}>读</CText>
        <Svg bloom={false}>
          <line x1={690} y1={182} x2={716} y2={120} stroke={WHITE} strokeWidth={3} strokeLinecap="round" />
          <path d="M 690 182 L 700 186 L 704 176 Z" fill={WHITE} />
        </Svg>
        <CText cx={714} cy={216} size={22} color={GREY} weight={700} opacity={iconIn}>写</CText>
      </div>

      {[0, 1, 2, 3].map((i) => {
        if (N < 4030 + i * 14) return null;
        const y = dotY(i);
        return <div key={i} style={{...abs(CH.cx - 10 + (i % 2 === 0 ? -10 : 10), Math.max(CH.cy - 84 + i * 22, y), 20, 20), borderRadius: 10, background: i % 2 === 0 ? PURPLE : PURPLE_LIGHT, boxShadow: glowPurple(0.8)}} />;
      })}

      {textP > 0 ? (
        <>
          <CText cx={330} cy={520} size={26} color={GREY} weight={700} opacity={textP}>读也慢</CText>
          <CText cx={330} cy={562} size={26} color={GREY} weight={700} opacity={textP}>写也慢</CText>
        </>
      ) : null}
    </div>
  );
};
