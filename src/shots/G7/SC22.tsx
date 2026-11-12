import React from 'react';
import {useCurrentFrame} from 'remotion';
import {abs, CText, Svg, Box, TechText, TechSub, WHITE, GREY, GREY_LINE, GREY_MID, PURPLE, PURPLE_LIGHT, fadeIn, exitOp, glowPurple, mixHex} from '../../ui';
import {clamp01} from '../../common';
import {Cube, drawOn} from '../film';

/** SC22 用自己的字典重建（5601–5903）。
 *  节拍：5601 传送带 → 5640 五个符号块飞向右侧城 → 5740 城逐层实体化 → 5820 「重建」。 */
const F0 = 5601;
const TO = 5903;
const BELT = {x0: 470, x1: 800, y: 380};
const SYM = ['图标', '手势', '语气', '顺序', '隐喻'];

export const SC22: React.FC = () => {
  const N = useCurrentFrame() + F0;
  const op = exitOp(N, TO, 8);
  const beltP = clamp01((N - 5601) / 16);
  const dictIn = clamp01((N - 5610) / 14);
  const solid = clamp01((N - 5740) / 40);
  const recoP = clamp01((N - 5820) / 12);
  const blockPos = (i: number) => {
    const start = 5640 + i * 14;
    const t = clamp01((N - start) / 26);
    const bx = BELT.x0 + 60 + i * 56;
    const tx = 900;
    return {x: bx + (tx - bx) * t, y: BELT.y - 20 - Math.sin(t * Math.PI) * 40, op: t >= 1 ? Math.max(0, 1 - (N - (start + 26)) / 8) : 1};
  };

  return (
    <div style={{...abs(0, 0, 1280, 720), opacity: op}}>
      {/* 字典 */}
      <div style={{opacity: dictIn}}>
        <Box x={200} y={190} w={200} h={280} stroke={WHITE} sw={2} fill="rgba(0,0,0,.7)">
          <div style={{...abs(0, 0, 14, 280), background: PURPLE}} />
          {Array.from({length: 6}, (_, i) => <div key={i} style={{...abs(34, 42 + i * 34, 130, 2), background: i === 0 ? WHITE : GREY_MID, opacity: 0.75}} />)}
        </Box>
        <CText cx={300} cy={500} size={22} color={GREY} weight={700} opacity={dictIn}>共识</CText>
      </div>

      {/* 传送带 */}
      <Svg bloom={false} opacity={beltP}>
        <line x1={BELT.x0} y1={BELT.y} x2={BELT.x0 + (BELT.x1 - BELT.x0) * beltP} y2={BELT.y} stroke={GREY} strokeWidth={2} />
        <path d={`M ${BELT.x0} ${BELT.y + 26} Q ${BELT.x0 + 20} ${BELT.y + 44} ${BELT.x0 + 40} ${BELT.y + 26}`} fill="none" stroke={GREY_LINE} strokeWidth={2} />
        <path d={`M ${BELT.x0 + 44} ${BELT.y + 26} Q ${BELT.x0 + 64} ${BELT.y + 44} ${BELT.x0 + 84} ${BELT.y + 26}`} fill="none" stroke={GREY_LINE} strokeWidth={2} />
      </Svg>

      {/* 五个符号块 */}
      {SYM.map((s, i) => {
        const p = blockPos(i);
        if (N < 5640 + i * 14) return null;
        return (
          <div key={s} style={{opacity: p.op}}>
            <Box x={p.x} y={p.y} w={46} h={36} stroke={PURPLE_LIGHT} sw={1.8} fill="rgba(102,48,248,.22)">
              <CText cx={23} cy={18} size={22} color={WHITE} weight={700}>{s[0]}</CText>
            </Box>
          </div>
        );
      })}

      {/* 城：虚线 → 实体 */}
      <div style={{opacity: 0.45 + 0.55 * solid}}>
        <Cube cx={980} cy={330} s={200} detail="city" tone={mixHex(GREY, WHITE, solid)} glowK={0.8 * solid} />
      </div>
      {recoP > 0 ? (
        <>
          <Svg bloom={false}>
            <line x1={420} y1={330} x2={860} y2={330} stroke={PURPLE_LIGHT} strokeWidth={1.6} strokeDasharray="7 7" opacity={recoP} />
            <path d="M 852 322 L 862 330 L 852 338" fill="none" stroke={PURPLE_LIGHT} strokeWidth={1.6} opacity={recoP} />
            <path d="M 428 322 L 418 330 L 428 338" fill="none" stroke={PURPLE_LIGHT} strokeWidth={1.6} opacity={recoP} />
          </Svg>
          <CText cx={640} cy={296} size={30} color={PURPLE_LIGHT} weight={800} opacity={recoP}>重建</CText>
        </>
      ) : null}
    </div>
  );
};
