import React from 'react';
import {useCurrentFrame} from 'remotion';
import {abs, CText, Svg, Box, Cross, Check, Pill, PersonIcon, WHITE, GREY, GREY_LINE, GREY_MID, PURPLE, PURPLE_LIGHT, ORANGE, fadeIn, exitOp, glowPurple} from '../../ui';
import {clamp01} from '../../common';
import {drawOn} from '../film';

/** SC21 同一句话，两种意思 / 压缩一定失真（5390–5600）。
 *  节拍：5390 句块 + 两条分叉 → 5440 两个气泡（左勾右叉）→ 5510 「失真」抖动 → 5530 两条带宽条 + 「省下来」。 */
const F0 = 5390;
const TO = 5600;
const FORK_Y = 330;

export const SC21: React.FC = () => {
  const N = useCurrentFrame() + F0;
  const op = exitOp(N, TO, 8);
  const forkP = clamp01((N - 5390) / 14);
  const bubP = (i: number) => clamp01((N - 5440 - i * 2) / 10);
  const shake = N > 5510 && N < 5526 ? (N % 2 === 0 ? 2 : -2) : 0;
  const barP = clamp01((N - 5530) / 16);
  const savedP = clamp01((N - 5552) / 10);

  return (
    <div style={{...abs(0, 0, 1280, 720), opacity: op}}>
      {/* 同一句话 */}
      <Pill x={520} y={196} w={240} h={54} fill="#000" stroke={WHITE} sw={2} text="昨天那个会" fontSize={28} />
      <Svg bloom={false}>
        <path d={`M 600 250 Q 460 300 330 ${FORK_Y}`} fill="none" stroke={GREY} strokeWidth={1.8} {...drawOn(forkP, 320)} />
        <path d={`M 680 250 Q 840 300 950 ${FORK_Y}`} fill="none" stroke={GREY} strokeWidth={1.8} {...drawOn(forkP, 320)} />
      </Svg>

      {/* 两个人 */}
      <div style={{opacity: clamp01((N - 5420) / 10)}}>
        <PersonIcon cx={300} cy={420} size={110} label="A" labelSize={22} />
        <PersonIcon cx={980} cy={420} size={110} label="B" labelSize={22} />
      </div>

      {/* 两个气泡 */}
      {[0, 1].map((i) => {
        const p = bubP(i);
        if (p <= 0) return null;
        const x = i === 0 ? 178 : 858;
        return (
          <div key={i} style={{opacity: p, transform: `translateY(${(1 - p) * 10}px)`}}>
            <Box x={x} y={512} w={170} h={44} stroke={GREY} sw={1.6} dashed fill="rgba(0,0,0,.7)">
              <CText cx={85} cy={22} size={22} color={GREY} weight={700}>{i === 0 ? '会议室 + 方案' : '只记得被否'}</CText>
            </Box>
            {i === 0 ? <Check cx={x + 194} cy={534} size={30} p={p} /> : <Cross cx={x + 194} cy={534} size={30} p={p} />}
          </div>
        );
      })}

      {/* 失真 */}
      {N > 5510 ? (
        <div style={{transform: `translateX(${shake}px)`}}>
          <CText cx={640} cy={534} size={24} color={ORANGE} weight={800} opacity={fadeIn(N - 5510, 8)}>会失真</CText>
        </div>
      ) : null}

      {/* 带宽条：原始 vs 压缩 */}
      {barP > 0 ? (
        <div>
          <div style={{...abs(390, 566, 500 * barP, 13), border: `1.6px dashed ${GREY}`, boxSizing: 'border-box', opacity: 0.8}} />
          <div style={{...abs(390, 591, 130 * barP, 13), background: PURPLE, boxShadow: glowPurple(0.6 * barP)}} />
          <CText cx={344} cy={572} size={20} color={GREY} weight={700} opacity={barP}>原始</CText>
          <CText cx={344} cy={597} size={20} color={PURPLE_LIGHT} weight={700} opacity={barP}>压缩</CText>
          {savedP > 0 ? <CText cx={710} cy={597} size={20} color={GREY} weight={700} opacity={savedP}>省下来的带宽</CText> : null}
        </div>
      ) : null}
    </div>
  );
};
