import React from 'react';
import {useCurrentFrame} from 'remotion';
import {abs, CText, Svg, Box, Cross, TechText, TechSub, MonoText, PersonIcon, WHITE, GREY, GREY_LINE, GREY_MID, PURPLE, PURPLE_LIGHT, ORANGE, fadeIn, scaleIn, exitOp, glowPurple, mixHex} from '../../ui';
import {clamp01, kf} from '../../common';
import {Capsule, drawOn} from '../film';

/** SC05 舌尖现象：名字在里面，取不出来（1195–1459）。
 *  节拍：1203 档案柜 + 术语 → 1285 胶囊飞出卡在管中 → 1318 「3 个字」 → 1350/1366/1382 三个候选被划 → 1420 抖动 + 橙边。 */
const F0 = 1195;
const TO = 1459;
const CAB = {x: 186, y: 245, w: 228, h: 190};
const TUBE_Y = 357;
const TX0 = 456, TX1 = 826;
const CAND = ['方案', '会议', '汇报'];

export const SC05: React.FC = () => {
  const N = useCurrentFrame() + F0;
  const op = exitOp(N, TO, 8);
  const cabP = clamp01((N - 1203) / 12);
  const termP = clamp01((N - 1244) / 10);
  const fly = clamp01((N - 1285) / 18);
  const jam = N > 1303 ? Math.sin((N - 1303) / 2.4) * 3 * Math.max(0, 1 - (N - 1303) / 26) : 0;
  const capX = kf(fly, [[0, 320], [1, 646]]) + jam;
  const jitter = N > 1420 ? (N % 2 === 0 ? 3 : -3) : 0;
  const pulse = N > 1420 ? 0.5 + 0.5 * Math.sin((N - 1420) / 3) : 0;

  return (
    <div style={{...abs(0, 0, 1280, 720), opacity: op}}>
      {/* 档案柜 */}
      <div style={{opacity: cabP, transform: `translateY(${(1 - cabP) * 20}px)`}}>
        <Box x={CAB.x} y={CAB.y} w={CAB.w} h={CAB.h} stroke={WHITE} sw={2.5} fill="rgba(0,0,0,.6)">
          {[0, 1, 2].map((r) => [0, 1].map((c) => (
            <div key={r + '-' + c} style={{...abs(8 + c * 112, 8 + r * 60, 104, 54), border: `2px solid ${WHITE}`, boxSizing: 'border-box', background: r === 0 && c === 0 ? 'rgba(102,48,248,.16)' : 'rgba(0,0,0,.4)'}}>
              <div style={{...abs(34, 32, 36, 3), background: GREY}} />
              {r === 0 && c === 0 ? <div style={{...abs(14, 6, 76, 40), border: `1.6px solid ${PURPLE_LIGHT}`, boxSizing: 'border-box'}} /> : null}
            </div>
          )))}
        </Box>
      </div>

      {/* 柜到嘴的细管 */}
      <Svg bloom={false} opacity={clamp01((N - 1262) / 12)}>
        <line x1={TX0} y1={TUBE_Y - 8} x2={TX1} y2={TUBE_Y - 8} stroke={WHITE} strokeWidth={2} />
        <line x1={TX0} y1={TUBE_Y + 8} x2={TX1} y2={TUBE_Y + 8} stroke={WHITE} strokeWidth={2} />
      </Svg>

      {/* 对方 */}
      {N > 1262 ? <PersonIcon cx={1000} cy={300} size={124} label="对方" labelSize={22} opacity={clamp01((N - 1262) / 12)} /> : null}
      {N > 1270 ? <Svg bloom={false}><ellipse cx={1000} cy={288} rx={11} ry={5.5} fill="#000" stroke={GREY} strokeWidth={2} /></Svg> : null}

      {/* 卡住的胶囊 */}
      {fly > 0 ? (
        <div style={{transform: `translateX(${capX - 320}px)`}}>
          <Capsule x={306} y={TUBE_Y - 23 + jitter} w={30} h={46} fill="#fff" stroke={pulse > 0.3 ? mixHex(WHITE, ORANGE, pulse) : WHITE} sw={2 + pulse * 1.6} lines={0} />
        </div>
      ) : null}
      {N > 1318 ? <MonoText x={620} y={300} size={22} color={GREY} opacity={fadeIn(N - 1318, 10)}>3 个字</MonoText> : null}

      {/* 三个候选词被划掉 */}
      {CAND.map((w, i) => {
        const o = clamp01((N - (1340 + i * 16)) / 8);
        if (o <= 0) return null;
        const cxX = 470 + (i % 2) * 130;
        const cyY = 432 + i * 54;
        const cross = clamp01((N - (1350 + i * 16)) / 10);
        return (
          <div key={w} style={{opacity: o}}>
            <Box x={cxX} y={cyY} w={90} h={34} stroke={GREY} sw={1.6} fill="rgba(0,0,0,.6)">
              <CText cx={45} cy={17} size={22} color={GREY} weight={700}>{w}</CText>
            </Box>
            {cross > 0 ? <Cross cx={cxX + 45} cy={cyY + 17} size={40} p={cross} color={GREY} sw={4} /> : null}
          </div>
        );
      })}
    </div>
  );
};
