import React from 'react';
import {useCurrentFrame} from 'remotion';
import {abs, CText, Svg, Box, PersonIcon, WHITE, GREY, GREY_LINE, GREY_MID, PURPLE, PURPLE_LIGHT, fadeIn, exitOp, glowPurple} from '../../ui';
import {clamp01} from '../../common';
import {Channel} from '../film';

/** SC13 听的人也在队里（3506–3696）。
 *  节拍：3506 通道左移 + 人出现 → 3540 短管 → 3580 耳旁 200ms 游标走到一半 → 3620 预测气泡 + 三个候选（第一个紫）。 */
const F0 = 3506;
const TO = 3696;
const CH = {cx: 520, cy: 350, w: 90, h: 288};

export const SC13: React.FC = () => {
  const N = useCurrentFrame() + F0;
  const op = exitOp(N, TO, 8);
  const personIn = clamp01((N - 3506) / 12);
  const tubeP = clamp01((N - 3540) / 12);
  const sweepP = clamp01((N - 3580) / 14) * 0.55;
  const bubbleP = clamp01((N - 3620) / 14);
  const chipP = (i: number) => clamp01((N - 3628 - i * 2) / 8);

  return (
    <div style={{...abs(0, 0, 1280, 720), opacity: op}}>
      <Channel cx={CH.cx} cy={CH.cy} w={CH.w} h={CH.h} p={1} ticks={3} glowK={0.25} />

      {/* 通道到耳的短管 */}
      {tubeP > 0 ? (
        <Svg bloom={false}>
          <line x1={576} y1={340} x2={576 + 190 * tubeP} y2={340} stroke={WHITE} strokeWidth={2} />
          <line x1={576} y1={360} x2={576 + 190 * tubeP} y2={360} stroke={WHITE} strokeWidth={2} />
        </Svg>
      ) : null}

      {/* 听者 */}
      <div style={{opacity: personIn, transform: `translateY(${(1 - personIn) * 20}px)`}}>
        <PersonIcon cx={880} cy={352} size={150} label="听者" labelSize={22} />
      </div>

      {/* 耳旁 200ms */}
      {sweepP > 0 ? (
        <Svg bloom={false}>
          <line x1={820} y1={474} x2={970} y2={474} stroke={GREY} strokeWidth={1.4} />
          <line x1={820} y1={474} x2={820 + 150 * sweepP * 1.8} y2={474} stroke={PURPLE_LIGHT} strokeWidth={3} />
        </Svg>
      ) : null}
      {sweepP > 0 ? <CText cx={895} cy={508} size={22} color={GREY} weight={700} opacity={clamp01((N - 3586) / 8)}>200 ms</CText> : null}

      {/* 预测气泡 */}
      {bubbleP > 0 ? (
        <div style={{opacity: bubbleP, transform: `scale(${0.9 + 0.1 * bubbleP})`}}>
          <Box x={780} y={170} w={220} h={64} r={10} dashed stroke={GREY} sw={2} fill="rgba(0,0,0,.75)">
            {['下一个', '词', '…'].map((t, i) => (
              <div key={t} style={{opacity: chipP(i)}}>
                <Box x={14 + i * 68} y={16} w={58} h={32} stroke={i === 0 ? PURPLE : GREY_LINE} sw={1.6} fill={i === 0 ? 'rgba(102,48,248,.28)' : 'rgba(0,0,0,.5)'}>
                  <CText cx={29} cy={16} size={22} color={i === 0 ? WHITE : GREY} weight={700}>{t}</CText>
                </Box>
              </div>
            ))}
          </Box>
          <CText cx={890} cy={252} size={22} color={GREY} weight={700} opacity={bubbleP}>提前猜</CText>
        </div>
      ) : null}
    </div>
  );
};
