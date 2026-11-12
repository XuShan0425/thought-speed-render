import React from 'react';
import {useCurrentFrame} from 'remotion';
import {abs, CText, Svg, TechSub, WHITE, GREY, GREY_LINE, GREY_MID, PURPLE, PURPLE_LIGHT, fadeIn, exitOp, glowPurple} from '../../ui';
import {GlitchIn, clamp01} from '../../common';
import {DnaShape, drawOn} from '../film';

/** SC24 FOXP2（6113–6300）。
 *  节拍：6121 双螺旋 draw-on → 6170 第 7 横档变紫 + 引出线 → 6220 「FOXP2」GlitchIn。 */
const F0 = 6113;
const TO = 6300;

export const SC24: React.FC = () => {
  const N = useCurrentFrame() + F0;
  const op = exitOp(N, TO, 8);
  const dnaP = clamp01((N - 6121) / 22);
  const hi = N > 6170 ? 7 : -1;
  const leadP = clamp01((N - 6180) / 12);
  const nameP = clamp01((N - 6220) / 10);

  return (
    <div style={{...abs(0, 0, 1280, 720), opacity: op}}>
      <DnaShape x0={360} x1={920} cy={270} amp={64} rungs={12} p={dnaP} hi={hi} />
      {leadP > 0 ? (
        <>
          <Svg bloom={false}>
            <path d="M 660 236 Q 760 200 900 186" fill="none" stroke={PURPLE_LIGHT} strokeWidth={1.8} {...drawOn(leadP, 260)} />
          </Svg>
          <CText cx={1010} cy={182} size={24} color={PURPLE_LIGHT} weight={800} opacity={leadP}>被强烈选择</CText>
        </>
      ) : null}

      {nameP > 0 ? (
        <div style={{opacity: nameP}}>
          <GlitchIn N={N} f0={6220} rgbSplit={5} slices={14}>
            <CText cx={640} cy={492} size={76} color={WHITE} weight={800} letterSpacing={6}>FOXP2</CText>
          </GlitchIn>
          <CText cx={640} cy={556} size={24} color={GREY} weight={700} opacity={clamp01((N - 6242) / 10)}>嘴部肌肉的精细控制</CText>
        </div>
      ) : null}
    </div>
  );
};
