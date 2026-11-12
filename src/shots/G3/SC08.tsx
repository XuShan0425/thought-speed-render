import React from 'react';
import {useCurrentFrame} from 'remotion';
import {abs, CText, Svg, Box, Cross, WHITE, GREY, GREY_LINE, GREY_MID, PURPLE, PURPLE_LIGHT, fadeIn, scaleIn, exitOp, glowPurple, mixHex} from '../../ui';
import {GlitchIn, clamp01} from '../../common';
import {DensityDots} from '../film';

/** SC08 不是速度，是密度（2125–2327）。
 *  节拍：2125 「速度」块 → 2146 划叉下沉 → 2175 密度方块 GlitchIn + 点阵逐点点亮 → 2256 「词」被划。 */
const F0 = 2125;
const TO = 2327;

export const SC08: React.FC = () => {
  const N = useCurrentFrame() + F0;
  const op = exitOp(N, TO, 8);
  const speedIn = clamp01((N - 2125) / 8);
  const crossP = clamp01((N - 2146) / 12);
  const sink = clamp01((N - 2158) / 12);
  const boxIn = clamp01((N - 2175) / 12);
  const lit = Math.round((1 - Math.pow(1 - clamp01((N - 2186) / 40), 2)) * 64);
  const wordP = clamp01((N - 2256) / 10);
  const wordX = clamp01((N - 2266) / 10);

  return (
    <div style={{...abs(0, 0, 1280, 720), opacity: op}}>
      {/* 速度块：被否掉 */}
      <div style={{opacity: speedIn * (1 - sink * 0.7), transform: `translateY(${sink * 18}px)`}}>
        <Box x={430} y={196} w={220} h={72} stroke={GREY} sw={2} dashed fill="rgba(0,0,0,.6)">
          <CText cx={110} cy={36} size={38} color={GREY} weight={800}>速度</CText>
        </Box>
        {crossP > 0 ? <Cross cx={540} cy={232} size={96} p={crossP} color={GREY} sw={7} /> : null}
        <Svg bloom={false}><line x1={676} y1={232} x2={736 * crossP + 676 * (1 - crossP)} y2={232} stroke={GREY_LINE} strokeWidth={2} /></Svg>
      </div>
      {N > 2168 ? <CText cx={700} cy={232} size={22} color={GREY_MID} weight={700} opacity={fadeIn(N - 2168, 10)}>不是速度</CText> : null}

      {/* 密度方块：8×8 点阵 */}
      {boxIn > 0 ? (
        <GlitchIn N={N} f0={2175} rgbSplit={4} slices={10}>
          <Box x={530} y={320} w={220} h={220} stroke={WHITE} sw={2.5} fill="rgba(0,0,0,.55)" glow={glowPurple(0.8 * boxIn)}>
            <DensityDots cx={110} cy={110} cols={8} rows={8} cell={5} gap={24} lit={lit} op={boxIn} />
          </Box>
        </GlitchIn>
      ) : null}
      {N > 2196 ? <CText cx={640} cy={572} size={26} color={PURPLE_LIGHT} weight={800} opacity={fadeIn(N - 2196, 10)}>密度</CText> : null}

      {/* 「词」被否掉 */}
      {wordP > 0 ? (
        <>
          <Box x={900} y={404} w={110} h={44} r={22} stroke={GREY} sw={2} dashed fill="rgba(0,0,0,.5)" opacity={wordP}>
            <CText cx={55} cy={22} size={26} color={GREY} weight={800}>词</CText>
          </Box>
          {wordP > 0.4 ? <Cross cx={955} cy={426} size={54} p={clamp01((wordP - 0.4) / 0.6)} color={GREY} sw={5} /> : null}
        </>
      ) : null}
      {wordX > 0 ? <CText cx={955} cy={500} size={22} color={GREY_MID} weight={700} opacity={wordX}>根本不是词</CText> : null}
    </div>
  );
};
