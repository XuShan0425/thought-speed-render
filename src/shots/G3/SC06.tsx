import React from 'react';
import {useCurrentFrame} from 'remotion';
import {abs, CText, Svg, Box, Cross, WHITE, GREY, GREY_LINE, GREY_MID, PURPLE, PURPLE_LIGHT, fadeIn, scaleIn, exitOp, glowPurple} from '../../ui';
import {clamp01, kf} from '../../common';
import {drawOn} from '../film';

/** SC06 意义在，词不在（1460–1777）。
 *  节拍：1468 字形框 → 1550 五个音格 → 1607 胶囊剖成两半 → 1690 「如果思维＝语言」被划掉。 */
const F0 = 1460;
const TO = 1777;
const CAP = {cx: 620, w: 180, h: 260};

export const SC06: React.FC = () => {
  const N = useCurrentFrame() + F0;
  const op = exitOp(N, TO, 8);
  const capIn = scaleIn(N - 1462, 18);
  const glyphP = clamp01((N - 1468) / 14);
  const barsP = (i: number) => clamp01((N - 1550 - i * 2) / 6);
  const split = clamp01((N - 1607) / 16);
  const emptyK = clamp01((N - 1660) / 14);
  const lineP = clamp01((N - 1690) / 10);
  const crossP = clamp01((N - 1712) / 14);
  const halfW = (CAP.w / 2) * (1 + split * 0.28);

  return (
    <div style={{...abs(0, 0, 1280, 720), opacity: op}}>
      {/* 胶囊剖成两半：左「意义」紫，右「词」虚线空框 */}
      <div style={{opacity: capIn}}>
        <Box x={CAP.cx - halfW - 6} y={330 - CAP.h / 2} w={halfW} h={CAP.h} r={CAP.h / 2} stroke={split > 0.2 ? PURPLE : WHITE} sw={2.5} fill={split > 0.2 ? 'rgba(102,48,248,.22)' : 'rgba(0,0,0,.6)'} glow={glowPurple(0.7 * split)}>
          {split > 0.3 ? <CText cx={halfW / 2} cy={CAP.h / 2} size={34} color={WHITE} weight={800} opacity={clamp01((split - 0.3) / 0.5)}>意义</CText> : null}
        </Box>
        <Box x={CAP.cx + 6} y={330 - CAP.h / 2 + emptyK * 20} w={halfW} h={CAP.h} r={CAP.h / 2} stroke={split > 0.2 ? GREY : WHITE} sw={2.5} dashed={split > 0.3} fill="rgba(0,0,0,.6)" opacity={1 - emptyK * 0.65}>
          {split > 0.3 ? <CText cx={halfW / 2} cy={CAP.h / 2} size={34} color={GREY} weight={800} opacity={clamp01((split - 0.3) / 0.5) * (1 - emptyK * 0.6)}>词</CText> : null}
        </Box>
      </div>

      {/* 字形格 */}
      <div style={{opacity: glyphP}}>
        <Box x={870} y={186} w={130} h={130} dashed stroke={GREY} sw={2} fill="rgba(0,0,0,.5)">
          <Svg bloom={false}>
            <line x1={32} y1={40} x2={98} y2={40} stroke={GREY_MID} strokeWidth={4} {...drawOn(glyphP, 70)} />
            <line x1={65} y1={20} x2={65} y2={70} stroke={GREY_MID} strokeWidth={4} {...drawOn(glyphP, 60)} />
            <path d="M 40 62 L 40 100 L 92 100" fill="none" stroke={GREY_MID} strokeWidth={4} {...drawOn(glyphP, 90)} />
            <path d="M 52 80 L 80 80" fill="none" stroke={GREY_LINE} strokeWidth={4} {...drawOn(glyphP, 40)} />
          </Svg>
        </Box>
        <CText cx={935} cy={342} size={22} color={GREY} weight={700}>字形</CText>
      </div>

      {/* 五个音格：第一个是紫的（第一个音） */}
      <div>
        {[0, 1, 2, 3, 4].map((i) => {
          const p = barsP(i);
          if (p <= 0) return null;
          const h = 46 - Math.abs(2 - i) * 6;
          return <div key={i} style={{...abs(876 + i * 26, 430 - h * p, 14, h * p), background: i === 0 ? PURPLE : GREY_MID, opacity: i === 0 ? 1 : 0.8, boxShadow: i === 0 ? glowPurple(0.8) : undefined}} />;
        })}
        <CText cx={935} cy={502} size={22} color={GREY} weight={700} opacity={fadeIn(N - 1560, 10)}>第一个音</CText>
      </div>

      {/* 如果思维＝语言，这件事不可能发生 */}
      {lineP > 0 ? (
        <>
          <CText cx={640} cy={540} size={38} color={GREY} weight={700} opacity={lineP}>如果思维 = 语言</CText>
          {crossP > 0 ? <div style={{...abs(470, 536, 240 * crossP, 5), background: '#F16043', opacity: 0.95}} /> : null}
        </>
      ) : null}
    </div>
  );
};
