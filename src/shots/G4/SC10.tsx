import React from 'react';
import {useCurrentFrame} from 'remotion';
import {abs, CText, Svg, Cross, MonoText, PersonIcon, WHITE, GREY, GREY_LINE, GREY_MID, PURPLE, PURPLE_LIGHT, ORANGE, fadeIn, exitOp, glowPurple} from '../../ui';
import {clamp01, kf} from '../../common';
import {BigNumber} from '../../fx';

/** SC10 637 词/分：没人听得懂（2686–2907）。
 *  节拍：2686 高柱长出 → 2700 「637」计数 → 2760 十二个音块闪完 → 2820 人歪头「？」+ 柱顶划叉。 */
const F0 = 2686;
const TO = 2907;

export const SC10: React.FC = () => {
  const N = useCurrentFrame() + F0;
  const op = exitOp(N, TO, 8);
  const grow = clamp01((N - 2686) / 18);
  const count = clamp01((N - 2700) / 18);
  const val = Math.round(150 + 487 * (1 - Math.pow(1 - count, 2)));
  const blocks = Math.round(clamp01((N - 2760) / 20) * 12);
  const tilt = N > 2820 ? Math.min(6, (N - 2820) * 0.8) : 0;
  const qOp = clamp01((N - 2826) / 10);
  const crossP = clamp01((N - 2856) / 12);

  return (
    <div style={{...abs(0, 0, 1280, 720), opacity: op}}>
      {/* 常规 150：矮柱 */}
      <div style={{...abs(376, 430, 48, 60), border: `2px solid ${GREY}`, borderBottom: 'none', boxSizing: 'border-box', background: 'rgba(0,0,0,.4)'}} />
      <CText cx={400} cy={518} size={24} color={GREY} weight={800}>150</CText>
      <CText cx={400} cy={556} size={22} color={GREY_LINE} weight={700}>正常语速</CText>

      {/* 637：高柱（灰→紫渐变） */}
      <div style={{...abs(732, 515 - 250 * grow, 56, 250 * grow), background: 'linear-gradient(180deg, #A175F1 0%, #6630F8 60%, rgba(102,48,248,.25) 100%)', boxShadow: glowPurple(0.7 * grow)}} />
      <CText cx={900} cy={216} size={22} color={GREY} weight={700} opacity={fadeIn(N - 2694, 10)}>世界纪录</CText>
      {count > 0 ? <BigNumber cx={760} cy={216} value={val} size={64} color={WHITE} /> : null}
      {crossP > 0 ? <Cross cx={760} cy={216} size={76} p={crossP} color={ORANGE} sw={6} /> : null}

      {/* 十二个音块：一闪而过 */}
      <div>
        {Array.from({length: 12}, (_, i) => {
          const on = i < blocks;
          const tail = i >= 9 && on ? 0.4 : 1;
          return <div key={i} style={{...abs(300 + i * 26, 232, 20, 20), border: `2px solid ${on ? PURPLE_LIGHT : GREY_LINE}`, background: on ? 'rgba(102,48,248,.5)' : 'transparent', boxSizing: 'border-box', opacity: on ? tail : 0.5}} />;
        })}
        <CText cx={548} cy={200} size={22} color={GREY} weight={700} opacity={fadeIn(N - 2764, 10)}>每秒十个词</CText>
      </div>

      {/* 听的人：歪头 + ？ */}
      <div style={{transform: `rotate(${tilt}deg)`, transformOrigin: '1030px 420px', opacity: fadeIn(N - 2820, 10) * op}}>
        <PersonIcon cx={1030} cy={360} size={110} label="对方" labelSize={22} />
      </div>
      {qOp > 0 ? <CText cx={1030} cy={250} size={54} color={ORANGE} weight={800} opacity={qOp}>?</CText> : null}
      {N > 2864 ? <CText cx={1030} cy={470} size={24} color={ORANGE} weight={700} opacity={fadeIn(N - 2864, 10)}>听不懂</CText> : null}
    </div>
  );
};
