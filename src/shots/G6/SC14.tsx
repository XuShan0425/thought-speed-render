import React from 'react';
import {useCurrentFrame} from 'remotion';
import {abs, CText, Svg, Box, Pill, TechSub, MonoText, WHITE, GREY, GREY_LINE, GREY_MID, PURPLE, PURPLE_LIGHT, fadeIn, scaleIn, exitOp, glowPurple} from '../../ui';
import {GlitchIn, clamp01, kf} from '../../common';
import {BigNumber} from '../../fx';
import {BookShape} from '../film';

/** SC14 默读也慢：2019 研究（3697–4001）。
 *  节拍：3697 书页 + 视线 → 3760 研究卡 GlitchIn → 3800 「18,000」计数 → 3860 「238」计数 → 3940 两条对比柱。 */
const F0 = 3697;
const TO = 4001;

export const SC14: React.FC = () => {
  const N = useCurrentFrame() + F0;
  const op = exitOp(N, TO, 8);
  const bookIn = clamp01((N - 3697) / 14);
  const sightP = clamp01((N - 3720) / 16);
  const cardIn = clamp01((N - 3760) / 10);
  const subj = Math.round(18000 * (1 - Math.pow(1 - clamp01((N - 3800) / 16), 2)));
  const numP = clamp01((N - 3860) / 18);
  const val = Math.round(238 * (1 - Math.pow(1 - numP, 2)));
  const barP = clamp01((N - 3940) / 14);

  return (
    <div style={{...abs(0, 0, 1280, 720), opacity: op}}>
      <div style={{opacity: bookIn, transform: `translateY(${(1 - bookIn) * 18}px)`}}>
        <BookShape cx={320} cy={340} w={260} h={200} p={bookIn} />
      </div>
      {sightP > 0 ? (
        <Svg bloom={false}>
          <line x1={420} y1={252} x2={420 + 120 * sightP} y2={252 + 60 * sightP} stroke={GREY_LINE} strokeWidth={1.5} strokeDasharray="6 7" />
        </Svg>
      ) : null}
      {N > 3712 ? <CText cx={320} cy={472} size={22} color={GREY} weight={700} opacity={fadeIn(N - 3712, 10)}>不出声也一样</CText> : null}

      {/* 研究卡 */}
      {cardIn > 0 ? (
        <div style={{opacity: cardIn}}>
          <GlitchIn N={N} f0={3760} rgbSplit={3} slices={8}>
            <Box x={730} y={196} w={400} h={196} stroke={WHITE} sw={2} fill="rgba(0,0,0,.78)">
              <Pill x={286} y={14} w={96} h={30} fill={PURPLE} text="Meta" fontSize={22} />
            </Box>
          </GlitchIn>
          <TechSub cx={930} cy={238} text="2019 · 阅读元分析" size={22} opacity={cardIn} />
          <CText cx={826} cy={284} size={40} color={WHITE} weight={800} opacity={clamp01((N - 3790) / 10)}>{subj.toLocaleString('en-US')}</CText>
          <CText cx={1000} cy={290} size={22} color={GREY} weight={700} opacity={clamp01((N - 3790) / 10)}>名被试</CText>
          <CText cx={930} cy={344} size={22} color={GREY_LINE} weight={600} opacity={cardIn}>190 项研究汇总</CText>
        </div>
      ) : null}

      {/* 238 词/分 */}
      {numP > 0 ? <BigNumber cx={960} cy={500} value={val} size={96} color={WHITE} unit="词 / 分 · 默读" unitSize={24} unitColor={GREY} /> : null}

      {/* 两条对比柱 */}
      {barP > 0 ? (
        <div>
          <div style={{...abs(1090, 600 - 34 * barP, 34, 34 * barP), background: GREY_MID}} />
          <div style={{...abs(1134, 600 - 54 * barP, 34, 54 * barP), background: PURPLE, boxShadow: glowPurple(0.6 * barP)}} />
          <CText cx={1150} cy={624} size={22} color={GREY} weight={700} opacity={barP}>只快一点</CText>
        </div>
      ) : null}
    </div>
  );
};
