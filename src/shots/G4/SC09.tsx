import React from 'react';
import {useCurrentFrame} from 'remotion';
import {abs, CText, Svg, Box, MonoText, WHITE, GREY, GREY_LINE, GREY_MID, PURPLE, PURPLE_LIGHT, fadeIn, scaleIn, exitOp, glowPurple} from '../../ui';
import {clamp01} from '../../common';
import {BigNumber} from '../../fx';
import {DensityDots, MouthShape, drawOn} from '../film';

/** SC09 从想法到嘴：中间四步（2382–2685）。
 *  节拍：2382 四段错峰弹入 → 2410 三个箭头 draw-on → 2445 嘴开合两拍 → 2509 细尺从①拉到④ → 2520 「150」计数 → 2600 「2.5 词/秒」。 */
const F0 = 2382;
const TO = 2685;
const STAGE = [{x: 232, t: '内部'}, {x: 512, t: '选词'}, {x: 792, t: '排音'}, {x: 1052, t: '嘴'}];
const SY = 358;

export const SC09: React.FC = () => {
  const N = useCurrentFrame() + F0;
  const op = exitOp(N, TO, 8);
  const inP = (i: number) => clamp01((N - 2382 - i * 2) / 10);
  const arrowP = (i: number) => clamp01((N - 2410 - i * 6) / 8);
  const mouthOpen = N > 2445 ? 0.5 + 0.5 * Math.sin((N - 2445) / 6) * clamp01((N - 2445) / 8) : 0;
  const ruleP = clamp01((N - 2509) / 18);
  const numP = clamp01((N - 2520) / 16);
  const val = Math.round(150 * (1 - Math.pow(1 - numP, 2)));
  const secP = clamp01((N - 2600) / 12);

  return (
    <div style={{...abs(0, 0, 1280, 720), opacity: op}}>
      {/* ① 内部：密度点阵小块 */}
      <div style={{opacity: inP(0), transform: `translateY(${(1 - inP(0)) * 22}px)`}}>
        <Box x={STAGE[0].x - 50} y={SY - 50} w={100} h={100} stroke={WHITE} sw={2.2} fill="rgba(0,0,0,.55)" glow={glowPurple(0.5 * inP(0))}>
          <DensityDots cx={50} cy={50} cols={5} rows={5} cell={4} gap={17} lit={25} op={inP(0)} />
        </Box>
        <CText cx={STAGE[0].x} cy={SY + 84} size={22} color={GREY} weight={700} opacity={inP(0)}>内部</CText>
      </div>

      {/* ② 选词：三张候选卡 */}
      <div style={{opacity: inP(1), transform: `translateY(${(1 - inP(1)) * 22}px)`}}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{...abs(STAGE[1].x - 78 + i * 18, SY - 62 + i * 16, 70, 92), border: `2px solid ${i === 1 ? PURPLE : GREY}`, background: 'rgba(0,0,0,.72)', boxSizing: 'border-box'}}>
            {[0, 1, 2].map((l) => <div key={l} style={{...abs(12, 22 + l * 16, 44 - l * 8, 2), background: i === 1 ? PURPLE_LIGHT : GREY_MID}} />)}
          </div>
        ))}
        <CText cx={STAGE[1].x} cy={SY + 84} size={22} color={GREY} weight={700} opacity={inP(1)}>选词</CText>
      </div>

      {/* ③ 排音：A / B / C */}
      <div style={{opacity: inP(2), transform: `translateY(${(1 - inP(2)) * 22}px)`}}>
        {['A', 'B', 'C'].map((t, i) => (
          <Box key={t} x={STAGE[2].x - 62 + i * 42} y={SY - 26 - i * 6} w={44} h={44} stroke={i === 0 ? PURPLE : WHITE} sw={2} fill="rgba(0,0,0,.7)">
            <CText cx={22} cy={22} size={22} color={WHITE} weight={800}>{t}</CText>
          </Box>
        ))}
        <CText cx={STAGE[2].x} cy={SY + 84} size={22} color={GREY} weight={700} opacity={inP(2)}>排音</CText>
      </div>

      {/* ④ 嘴 */}
      <div style={{opacity: inP(3)}}>
        <MouthShape cx={STAGE[3].x} cy={SY - 6} w={124} open={mouthOpen} tongue={0.35} p={inP(3)} />
        <CText cx={STAGE[3].x} cy={SY + 84} size={22} color={GREY} weight={700} opacity={inP(3)}>嘴</CText>
      </div>

      {/* 段间箭头 */}
      <Svg bloom={false}>
        {[0, 1, 2].map((i) => {
          const p = arrowP(i);
          if (p <= 0) return null;
          const x0 = [322, 602, 882][i];
          return <line key={i} x1={x0} y1={SY} x2={x0 + 52 * p} y2={SY} stroke={GREY} strokeWidth={2.4} />;
        })}
        {[0, 1, 2].map((i) => {
          const p = arrowP(i);
          if (p <= 0.9) return null;
          const x1 = [374, 654, 934][i];
          return <path key={'h' + i} d={`M ${x1 - 10} ${SY - 7} L ${x1} ${SY} L ${x1 - 10} ${SY + 7}`} fill="none" stroke={GREY} strokeWidth={2.4} />;
        })}
      </Svg>

      {/* 量出来的单句：150 词/分 */}
      {ruleP > 0 ? (
        <Svg bloom={false}>
          <line x1={STAGE[0].x} y1={500} x2={STAGE[0].x + (STAGE[3].x - STAGE[0].x) * ruleP} y2={500} stroke={GREY} strokeWidth={1.5} strokeDasharray="6 8" />
        </Svg>
      ) : null}
      {numP > 0 ? (
        <BigNumber cx={620} cy={546} value={val} size={88} color={WHITE} unit="词 / 分" unitSize={24} unitColor={GREY} />
      ) : null}
      {secP > 0 ? (
        <>
          <Svg bloom={false}><line x1={760} y1={492} x2={760} y2={560} stroke={PURPLE} strokeWidth={2} /></Svg>
          <CText cx={830} cy={532} size={24} color={PURPLE_LIGHT} weight={800} opacity={secP}>2.5 词 / 秒</CText>
        </>
      ) : null}
    </div>
  );
};
