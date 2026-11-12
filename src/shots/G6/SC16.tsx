import React from 'react';
import {useCurrentFrame} from 'remotion';
import {abs, CText, Svg, Box, Pill, TechSub, MonoText, WHITE, GREY, GREY_LINE, GREY_MID, PURPLE, PURPLE_LIGHT, fadeIn, scaleIn, exitOp, glowPurple} from '../../ui';
import {GlitchIn, clamp01} from '../../common';
import {BigNumber} from '../../fx';

/** SC16 2025 Neuron：总量 10 bit/s（4159–4416）。
 *  节拍：4159 论文卡滑入 → 4200 「Neuron 2025」GlitchIn → 4250 「10」计数 + 十个比特方块。 */
const F0 = 4159;
const TO = 4416;

export const SC16: React.FC = () => {
  const N = useCurrentFrame() + F0;
  const op = exitOp(N, TO, 8);
  const cardIn = clamp01((N - 4159) / 10);
  const pillP = clamp01((N - 4200) / 10);
  const numP = clamp01((N - 4250) / 22);
  const val = (10 * (1 - Math.pow(1 - numP, 2))).toFixed(0);
  const bitsOn = clamp01((N - 4290) / 20);

  return (
    <div style={{...abs(0, 0, 1280, 720), opacity: op}}>
      {/* 论文卡 */}
      <div style={{opacity: cardIn, transform: `translateY(${(1 - cardIn) * 16}px)`}}>
        <Box x={150} y={222} w={420} h={236} stroke={WHITE} sw={2} fill="rgba(0,0,0,.8)">
          <CText cx={210} cy={52} size={22} color={WHITE} weight={800}>The unbearable</CText>
          <CText cx={196} cy={82} size={22} color={WHITE} weight={800}>slowness of being</CText>
          <TechSub cx={210} cy={122} text="Zheng & Meister · Neuron" size={22} opacity={0.85} />
          <Svg bloom={false}>
            {[0, 1, 2].map((i) => <line key={i} x1={30} y1={158 + i * 18} x2={30 + (i === 2 ? 210 : 300)} y2={158 + i * 18} stroke={GREY_MID} strokeWidth={2} />)}
          </Svg>
        </Box>
        {pillP > 0 ? (
          <div style={{opacity: pillP}}>
            <GlitchIn N={N} f0={4200} rgbSplit={4} slices={8}>
              <Pill x={470} y={206} w={118} h={38} fill={PURPLE} text="Neuron 2025" fontSize={22} />
            </GlitchIn>
          </div>
        ) : null}
      </div>

      {/* 巨字 10 */}
      {numP > 0 ? (
        <div style={{opacity: numP}}>
          <BigNumber cx={900} cy={330} value={val} size={180} color={WHITE} />
          <div style={{position: 'absolute', left: 1046, top: 248}}>
            <CText cx={0} cy={0} size={26} color={GREY} weight={700} opacity={numP}>bit</CText>
            <CText cx={0} cy={40} size={26} color={GREY} weight={700} opacity={numP}>/ s</CText>
          </div>
        </div>
      ) : null}

      {/* 十个比特方块沿圆周 */}
      {bitsOn > 0 ? (
        <Svg bloom={false}>
          {Array.from({length: 10}, (_, i) => {
            const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
            const r = 126;
            const x = 900 + Math.cos(a) * r;
            const y = 330 + Math.sin(a) * r * 0.78;
            const lit = i < Math.round(bitsOn * 10);
            return <rect key={i} x={x - 8} y={y - 8} width={16} height={16} fill={lit ? PURPLE : 'transparent'} stroke={lit ? PURPLE_LIGHT : GREY_LINE} strokeWidth={1.6} opacity={lit ? 1 : 0.5} />;
          })}
        </Svg>
      ) : null}
      {bitsOn > 0.9 ? <CText cx={640} cy={560} size={22} color={GREY} weight={700} opacity={fadeIn(N - 4310, 10)}>全部行为加起来</CText> : null}
    </div>
  );
};
