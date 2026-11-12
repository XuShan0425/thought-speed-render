import React from 'react';
import {useCurrentFrame} from 'remotion';
import {abs, CText, Svg, Box, Cross, TechText, TechSub, WHITE, GREY, GREY_LINE, GREY_MID, PURPLE, PURPLE_LIGHT, fadeIn, scaleIn, exitOp, glowPurple} from '../../ui';
import {clamp01, kf} from '../../common';
import {drawOn} from '../film';
import {GlitchIn} from '../../common';

/** SC04 四分之一：无词无画面，只有「知道」（910–1194）。
 *  节拍：918 四宫格弹入 → 968 词被划 → 1010 画面被划 → 1046 「知道」圆环亮起 → 1093 术语落位。 */
const F0 = 910;
const TO = 1194;
const GX = 760, GY = 250, CW = 180, CH = 150, GAP = 12;
const cell = (i: number) => ({x: GX + (i % 2) * (CW + GAP), y: GY + Math.floor(i / 2) * (CH + GAP)});

export const SC04: React.FC = () => {
  const N = useCurrentFrame() + F0;
  const op = exitOp(N, TO, 8);
  const inP = (i: number) => clamp01((N - 918 - i * 2) / 10);
  const cross1 = clamp01((N - 968) / 12);
  const cross2 = clamp01((N - 1010) / 12);
  const ringP = clamp01((N - 1046) / 14);
  const shrink = kf(N, [[1093, 1], [1110, 0.86]]);
  const termIn = clamp01((N - 1102) / 10);
  const headIn = scaleIn(N - 914, 16);

  return (
    <div style={{...abs(0, 0, 1280, 720), opacity: op}}>
      {/* 头像缩到左侧 */}
      <div style={{opacity: headIn}}>
        <Svg bloom={false}>
          <circle cx={330} cy={330} r={62} fill="none" stroke={GREY} strokeWidth={2} />
          <path d="M 260 420 Q 330 352 400 420" fill="none" stroke={GREY} strokeWidth={2} />
        </Svg>
      </div>

      {/* 2×2 四宫格 */}
      <div style={{transform: `scale(${shrink})`, transformOrigin: '860px 400px'}}>
        {[0, 1, 2, 3].map((i) => {
          const c = cell(i);
          const o = inP(i);
          const dead = i === 0 ? cross1 : i === 1 ? cross2 : 0;
          return (
            <div key={i} style={{opacity: o, transform: `translateY(${(1 - o) * 26}px)`}}>
              <Box x={c.x} y={c.y} w={CW} h={CH} stroke={WHITE} sw={2} fill="rgba(0,0,0,.55)">
                {i === 0 ? (
                  <Svg bloom={false}>
                    <line x1={30} y1={58} x2={142} y2={58} stroke={GREY_MID} strokeWidth={3} />
                    <line x1={30} y1={80} x2={118} y2={80} stroke={GREY_MID} strokeWidth={3} />
                    <line x1={30} y1={102} x2={134} y2={102} stroke={GREY_MID} strokeWidth={3} />
                  </Svg>
                ) : null}
                {i === 1 ? (
                  <Svg bloom={false}>
                    <path d="M 26 108 L 62 58 L 92 92 L 118 62 L 154 108" fill="none" stroke={GREY_MID} strokeWidth={3} />
                    <circle cx={128} cy={44} r={11} fill="none" stroke={GREY_MID} strokeWidth={3} />
                  </Svg>
                ) : null}
                {i === 2 ? (
                  <Svg bloom={false}>
                    {[0, 1, 2, 3, 4].map((b) => <rect key={b} x={40 + b * 22} y={76 - Math.abs(2 - b) * 14} width={9} height={44 + Math.abs(2 - b) * 28} rx={4} fill={GREY_MID} />)}
                  </Svg>
                ) : null}
                {i === 3 ? (
                  <>
                    <Svg bloom={false}>
                      <circle cx={90} cy={75} r={44} fill="none" stroke={ringP > 0 ? PURPLE : GREY_LINE} strokeWidth={3} opacity={Math.max(0.25, ringP)} {...drawOn(ringP, 300)} />
                    </Svg>
                    {ringP > 0 ? <CText cx={90} cy={75} size={24} color={WHITE} weight={700} opacity={ringP}>知道</CText> : null}
                    {ringP > 0.8 ? <div style={{...abs(16, 6, CW - 32, CH - 12), boxShadow: glowPurple(0.8 * ringP), borderRadius: 40}} /> : null}
                  </>
                ) : null}
              </Box>
              {dead > 0 ? <Cross cx={c.x + CW / 2} cy={c.y + CH / 2} size={86} p={dead} color={GREY} sw={6} /> : null}
              {i < 3 ? <CText cx={c.x + 34} cy={c.y + 22} size={22} color={GREY_LINE} weight={700} opacity={0.95}>{['词', '画面', '内语音'][i]}</CText> : null}
            </div>
          );
        })}
      </div>

      {/* 1102 术语落点（HUD 已显示同名词，这里只让「知道」圆环向外扩一圈） */}
      {N > 1102 && N < 1146 ? (
        <Svg bloom={false}>
          <circle cx={cell(3).x + 90} cy={cell(3).y + 75} r={44 + (N - 1102) * 1.5} fill="none" stroke={PURPLE} strokeWidth={3} opacity={Math.max(0, 1 - (N - 1102) / 40)} />
        </Svg>
      ) : null}
      {N > 940 ? <CText cx={330} cy={238} size={22} color={GREY} weight={700} opacity={fadeIn(N - 940, 10)}>四分之一</CText> : null}
    </div>
  );
};
