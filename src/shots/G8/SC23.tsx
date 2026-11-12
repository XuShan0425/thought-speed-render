import React from 'react';
import {useCurrentFrame} from 'remotion';
import {abs, CText, Svg, TechSub, WHITE, GREY, GREY_LINE, GREY_MID, PURPLE, PURPLE_LIGHT, fadeIn, exitOp, glowPurple, mixHex} from '../../ui';
import {GlitchIn, clamp01} from '../../common';
import {HandShape, MouthShape, drawOn} from '../film';

/** SC23 语言怎么来的：先有手势（5904–6112）。
 *  节拍：5912 「？」GlitchIn → 5960 手 + 嘴 → 6040 虚线箭头前半 → 6070 后半 + 手降到 50%、嘴转紫。 */
const F0 = 5904;
const TO = 6112;

export const SC23: React.FC = () => {
  const N = useCurrentFrame() + F0;
  const op = exitOp(N, TO, 8);
  const qP = clamp01((N - 5912) / 10);
  const handIn = clamp01((N - 5960) / 12);
  const half1 = clamp01((N - 6040) / 16);
  const half2 = clamp01((N - 6070) / 12);
  const handDim = 1 - 0.5 * half2;
  const mouthPurple = half2;

  return (
    <div style={{...abs(0, 0, 1280, 720), opacity: op}}>
      {qP > 0 ? (
        <div style={{opacity: qP * (1 - clamp01((N - 5966) / 14))}}>
          <GlitchIn N={N} f0={5912} rgbSplit={4} slices={10}>
            <CText cx={640} cy={250} size={86} color={WHITE} weight={800}>？</CText>
          </GlitchIn>
        </div>
      ) : null}
      {N > 5924 ? <CText cx={640} cy={182} size={22} color={GREY} weight={700} opacity={fadeIn(N - 5924, 10)}>语言是怎么来的</CText> : null}

      {/* 手 */}
      <div style={{opacity: handIn * handDim}}>
        <HandShape cx={340} cy={330} s={210} p={handIn} tone={mixHex(WHITE, PURPLE_LIGHT, half2)} />
        <CText cx={340} cy={470} size={24} color={half2 > 0.4 ? PURPLE_LIGHT : GREY} weight={800}>手势</CText>
      </div>

      {/* 嘴 */}
      <div style={{opacity: handIn}}>
        <MouthShape cx={970} cy={330} w={180} open={0.45} p={handIn} tongue={0.3} />
        <CText cx={970} cy={470} size={24} color={mouthPurple > 0.4 ? PURPLE_LIGHT : GREY} weight={800}>嘴</CText>
      </div>

      {/* 虚线迁移箭头 */}
      <Svg bloom={false}>
        <path d="M 470 330 L 630 330" stroke={GREY} strokeWidth={2} {...drawOn(half1, 160)} opacity={0.9} />
        <path d="M 650 330 L 850 330" stroke={GREY} strokeWidth={2} {...drawOn(half2, 200)} opacity={0.9} />
        {half2 > 0.9 ? <path d="M 840 322 L 852 330 L 840 338" fill="none" stroke={GREY} strokeWidth={2} /> : null}
        {half1 > 0.9 ? <line x1={640} y1={316} x2={640} y2={344} stroke={GREY_LINE} strokeWidth={2} /> : null}
      </Svg>
      {half1 > 0.9 ? <CText cx={640} cy={296} size={22} color={GREY_MID} weight={700}>后来</CText> : null}
    </div>
  );
};
