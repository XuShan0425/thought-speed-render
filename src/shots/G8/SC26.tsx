import React from 'react';
import {useCurrentFrame} from 'remotion';
import {abs, CText, Svg, MonoText, PersonIcon, WHITE, GREY, GREY_LINE, GREY_MID, PURPLE, PURPLE_LIGHT, fadeIn, exitOp, glowPurple} from '../../ui';
import {clamp01, kf} from '../../common';
import {Cube, drawOn} from '../film';

/** SC26 把一座三维的城，压成一条一维的线（6508–6728）。
 *  节拍：6508 人影 + 「未必是没想清楚」被轻轻划掉 → 6620 城沿 x 挤压 → 6660 接上右侧细线 → 6700 「一维」。 */
const F0 = 6508;
const TO = 6748;

export const SC26: React.FC = () => {
  const N = useCurrentFrame() + F0;
  const op = exitOp(N, TO, 8);
  const manIn = clamp01((N - 6508) / 12);
  const crossP = clamp01((N - 6560) / 8);
  const squeeze = kf(N, [[6620, 1], [6646, 0.06]]);
  const lineP = clamp01((N - 6660) / 18);
  const oneD = clamp01((N - 6690) / 10);

  return (
    <div style={{...abs(0, 0, 1280, 720), opacity: op}}>
      <Cube cx={560} cy={330} s={300} detail="city" glowK={0.7 * (1 - clamp01((N - 6620) / 20)) + 0.2} scaleX={squeeze} />

      <div style={{opacity: manIn}}>
        <PersonIcon cx={190} cy={420} size={96} />
      </div>
      {N > 6520 ? (
        <>
    
          {crossP > 0 ? <div style={{...abs(120, 514, 264 * crossP, 4), background: GREY_MID, opacity: 0.9}} /> : null}
        </>
      ) : null}

      {lineP > 0 ? (
        <Svg bloom={false}>
          <line x1={580} y1={330} x2={580 + (1240 - 580) * lineP} y2={330} stroke={WHITE} strokeWidth={2.4} {...drawOn(lineP, 660)} />
          <circle cx={580 + (1240 - 580) * lineP} cy={330} r={6} fill={PURPLE_LIGHT} style={{filter: 'drop-shadow(0 0 10px rgba(161,117,241,.9))'}} />
        </Svg>
      ) : null}
      {oneD > 0 ? <MonoText x={1120} y={368} size={24} color={PURPLE_LIGHT} opacity={oneD}>一维</MonoText> : null}
      {N > 6580 ? <CText cx={880} cy={238} size={22} color={GREY} weight={700} opacity={fadeIn(N - 6580, 10) * (1 - clamp01((N - 6660) / 12))}>三维的城</CText> : null}
    </div>
  );
};
