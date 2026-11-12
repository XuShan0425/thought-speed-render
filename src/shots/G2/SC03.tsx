import React from 'react';
import {useCurrentFrame} from 'remotion';
import {abs, CText, Svg, Box, WHITE, GREY, GREY_LINE, PURPLE, PURPLE_LIGHT, fadeIn, scaleIn, exitOp, glowPurple} from '../../ui';
import {clamp01} from '../../common';

/** SC03 想的时候没有字 + 随身提示器（618–909）。
 *  节拍：626 五个词牌浮出 → 742 词牌全灭、中心紫雾 → 760 提示器 + 信号弧 → 828 问句气泡飞出。 */
const F0 = 618;
const TO = 909;
const HEAD = {cx: 640, cy: 330, r: 95};
const WORDS = ['方案', '预算', '老板', '时间', '为什么'];
const POS = [[-56, -62], [52, -68], [-68, 0], [44, -2], [-20, 56]];

export const SC03: React.FC = () => {
  const N = useCurrentFrame() + F0;
  const op = exitOp(N, TO, 8);
  const headIn = scaleIn(N - 620, 18);
  const chipIn = (i: number) => clamp01((N - 626 - i * 2) / 8);
  const chipOut = (i: number) => 1 - clamp01((N - 720 - i * 2) / 8);
  const fog = scaleIn(N - 742, 18);
  const prompterIn = clamp01((N - 760) / 12);
  const arcP = clamp01((N - 772) / 16);
  const shake = N > 796 && N < 806 ? (N % 2 === 0 ? 2 : -2) : 0;
  const bubbleP = clamp01((N - 828) / 22);

  return (
    <div style={{...abs(0, 0, 1280, 720), opacity: op}}>
      <Svg bloom={false} opacity={headIn}>
        <circle cx={HEAD.cx} cy={HEAD.cy} r={HEAD.r} fill="none" stroke={WHITE} strokeWidth={2.5} />
        <path d={`M ${HEAD.cx - 108} ${HEAD.cy + 168} Q ${HEAD.cx} ${HEAD.cy + 62} ${HEAD.cx + 108} ${HEAD.cy + 168}`} fill="none" stroke={WHITE} strokeWidth={2.5} />
      </Svg>

      {WORDS.map((w, i) => {
        const o = chipIn(i) * chipOut(i);
        if (o <= 0.01) return null;
        const [dx, dy] = POS[i];
        const breathe = Math.sin((N + i * 13) / 17) * 4;
        return (
          <div key={w} style={{opacity: o * 0.92}}>
            <Box x={HEAD.cx + dx - 31} y={HEAD.cy + dy - 13 + breathe} w={62} h={26} stroke={GREY} sw={1.6} fill="rgba(0,0,0,.55)">
              <CText cx={31} cy={13} size={22} color={GREY_LINE} weight={700}>{w}</CText>
            </Box>
          </div>
        );
      })}

      {fog > 0 ? (
        <div style={{...abs(HEAD.cx - 46, HEAD.cy - 46, 92, 92), borderRadius: 46, background: 'radial-gradient(circle, rgba(196,172,255,.85) 0%, rgba(122,74,250,.5) 42%, rgba(102,48,248,.18) 66%, rgba(0,0,0,0) 76%)', transform: `scale(${fog})`, boxShadow: glowPurple(0.9 * fog)}} />
      ) : null}
      {N > 748 ? <CText cx={HEAD.cx} cy={478} size={22} color={GREY} weight={700} opacity={fadeIn(N - 748, 10)}>没有字</CText> : null}

      <div style={{opacity: prompterIn, transform: `translateX(${shake}px)`}}>
        <Box x={1004} y={154} w={56} h={96} r={6} stroke={WHITE} sw={2.5} fill="rgba(0,0,0,.7)" glow={glowPurple(0.4 * prompterIn)}>
          <div style={{...abs(12, 16, 32, 26), border: `1.6px solid ${GREY}`, boxSizing: 'border-box'}} />
          <div style={{...abs(12, 58, 32, 3), background: PURPLE}} />
        </Box>
        <Svg bloom={false}>
          {[0, 1, 2].map((i) => {
            const p = clamp01((arcP - i * 0.18) / 0.5);
            return <path key={i} d={`M 1004 ${202 - i * 12} Q ${960 - i * 12} ${202 - i * 14} ${966 - i * 18} ${202 + 26 + i * 14}`} fill="none" stroke={PURPLE_LIGHT} strokeWidth={2} opacity={0.75 * p} strokeDasharray="120" strokeDashoffset={120 * (1 - p)} />;
          })}
        </Svg>
      </div>

      {bubbleP > 0 ? (
        <div style={{opacity: bubbleP, transform: `translate(${(1 - bubbleP) * 180}px, ${(1 - bubbleP) * -50}px)`}}>
          <Box x={744} y={176} w={250} h={58} r={10} stroke={WHITE} sw={2} fill="rgba(0,0,0,.82)">
            <CText cx={125} cy={29} size={24} color={WHITE} weight={700}>此刻你在想什么？</CText>
          </Box>
          <Svg bloom={false}><path d="M 790 234 L 776 258 L 806 234" fill="rgba(0,0,0,.82)" stroke={WHITE} strokeWidth={2} /></Svg>
        </div>
      ) : null}
    </div>
  );
};
