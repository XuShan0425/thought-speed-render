import React from 'react';
import {useCurrentFrame} from 'remotion';
import {abs, CText, MonoText, Svg, LineArrow, PersonIcon, Cross, WHITE, GREY, GREY_MID, PURPLE, PURPLE_LIGHT, ORANGE, fadeIn, scaleIn, exitOp, glowPurple, mixHex} from '../../ui';
import {clamp01, kf, rnd} from '../../common';
import {Cube} from '../film';

/** SC01 说出口的只是九分之一（78–352）。
 *  节拍：86 立方入场 → 150 立方被压扁成一条缝 → 176 管子 draw-on → 190 出口弹出一个小方块 → 254 对方出现点头 → 292 裂纹 + 「没传过去」。 */
const F0 = 78;
const TO = 352;
const TUBE_Y0 = 349;
const TUBE_Y1 = 361;
const TUBE_X0 = 420;
const TUBE_X1 = 800;

export const SC01: React.FC = () => {
  const N = useCurrentFrame() + F0;
  const op = exitOp(N, TO, 8);

  const cubeIn = scaleIn(N - 82, 21);
  const squeeze = kf(N, [[150, 1], [172, 0.12]]);
  const tubeP = clamp01((N - 176) / 14);
  const boxP = clamp01((N - 190) / 14);
  const boxX = 830 + (1 - boxP) * 0;
  const boxY = 323 - 10 * (1 - boxP);
  const crackP = clamp01((N - 292) / 12);
  const nodUp = N >= 258 && N < 264 ? -8 * (1 - Math.abs(N - 261) / 3) : N >= 270 && N < 276 ? -8 * (1 - Math.abs(N - 273) / 3) : 0;
  const personOp = clamp01((N - 250) / 10);

  return (
    <div style={{...abs(0, 0, 1280, 720), opacity: op}}>
      {/* 内部立方：全片贯穿造型 */}
      <Cube cx={300} cy={355} s={200} op={cubeIn} detail="mind" glowK={0.9 * cubeIn} scaleX={squeeze} dx={104 * (1 - squeeze)} />

      {/* 细管：上下两条 2px 白线 */}
      {tubeP > 0 ? (
        <Svg bloom={false}>
          <line x1={TUBE_X0} y1={TUBE_Y0} x2={TUBE_X0 + (TUBE_X1 - TUBE_X0) * tubeP} y2={TUBE_Y0} stroke={WHITE} strokeWidth={2} />
          <line x1={TUBE_X0} y1={TUBE_Y1} x2={TUBE_X0 + (TUBE_X1 - TUBE_X0) * tubeP} y2={TUBE_Y1} stroke={WHITE} strokeWidth={2} />
          <line x1={TUBE_X0} y1={TUBE_Y0 - 8} x2={TUBE_X0} y2={TUBE_Y1 + 8} stroke={GREY} strokeWidth={1.6} opacity={tubeP > 0.9 ? 1 : 0} />
        </Svg>
      ) : null}

      {/* 出去的那一点：64×64 小方块 */}
      {boxP > 0 ? (
        <div style={{...abs(boxX, boxY, 64, 64), border: `2px solid ${WHITE}`, background: 'rgba(0,0,0,.7)', boxSizing: 'border-box', opacity: boxP, boxShadow: glowPurple(0.5 * boxP)}}>
          <div style={{...abs(14, 22, 36, 2), background: GREY_MID}} />
          <div style={{...abs(14, 34, 24, 2), background: GREY_MID}} />
        </div>
      ) : null}
      {N > 206 ? <MonoText x={boxX - 4} y={boxY + 86} size={22} color={GREY} opacity={clamp01((N - 206) / 10)}>1 / 9</MonoText> : null}

      {/* 对方 */}
      {personOp > 0 ? <div style={{opacity: personOp, transform: `translateY(${nodUp}px)`}}><PersonIcon cx={1090} cy={262 + 0} size={96} label="对方" labelSize={22} /></div> : null}

      {/* 裂纹 + 没传过去 */}
      {crackP > 0 ? (
        <>
          <Svg bloom={false} opacity={crackP}>
            <path d={`M 800 322 L 812 344 L 798 356 L 814 372 L 800 392`} fill="none" stroke={mixHex(GREY, ORANGE, crackP)} strokeWidth={3} />
            <path d={`M 806 320 L 818 342 L 804 358`} fill="none" stroke={mixHex(GREY, ORANGE, crackP)} strokeWidth={2} opacity={0.6} />
          </Svg>
          <CText cx={880} cy={430} size={26} color={mixHex(GREY, ORANGE, crackP)} weight={700} opacity={crackP}>没传过去</CText>
        </>
      ) : null}

    </div>
  );
};
