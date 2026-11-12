import React from 'react';
import {abs, CText, Svg, WHITE, GREY, GREY_LINE, GREY_MID, PURPLE, PURPLE_LIGHT, ORANGE, CORAL, GREEN, glowPurple, mixHex} from '../ui';
import {clamp01, rnd} from '../common';

/** 全片共用造型语言：内部立方 / 城 / 单向通道 / 密度点阵 / 简笔物件。
 *  所有组件都是 N 的纯函数（动画值由调用方算好传进来），绝对定位在 1280×720 画布上。 */

/** 描边 draw-on：p 0→1 */
export const drawOn = (p: number, len: number) => ({strokeDasharray: len, strokeDashoffset: len * (1 - clamp01(p))});

/** 节点：小圆 + 一条手臂线（立方内部与「知道」层用） */
const Node: React.FC<{cx: number; cy: number; r?: number; k?: number}> = ({cx, cy, r = 6, k = 1}) => (
  <>
    <circle cx={cx} cy={cy} r={r} fill="#000" stroke={WHITE} strokeWidth={2} />
    <circle cx={cx} cy={cy} r={r * 0.4} fill={WHITE} opacity={0.9 * k} />
  </>
);

/** 立方正面里的「思维」细节：三个节点 + 两条连接线 + 一道弧 */
const MindDetail: React.FC<{s: number}> = ({s}) => (
  <Svg bloom={false}>
    <line x1={s * 0.24} y1={s * 0.62} x2={s * 0.76} y2={s * 0.62} stroke={GREY_LINE} strokeWidth={1.5} />
    <Node cx={s * 0.3} cy={s * 0.36} r={6} />
    <Node cx={s * 0.5} cy={s * 0.5} r={8} />
    <Node cx={s * 0.7} cy={s * 0.3} r={5} />
    <line x1={s * 0.3} y1={s * 0.36} x2={s * 0.5} y2={s * 0.5} stroke={GREY} strokeWidth={1.5} />
    <line x1={s * 0.5} y1={s * 0.5} x2={s * 0.7} y2={s * 0.3} stroke={GREY} strokeWidth={1.5} />
    <path d={`M ${s * 0.16} ${s * 0.8} Q ${s * 0.5} ${s * 0.9} ${s * 0.84} ${s * 0.8}`} fill="none" stroke={PURPLE} strokeWidth={1.6} opacity={0.85} />
  </Svg>
);

/** 立方正面里的「城市」细节：街道网格 + 四栋楼 */
const CityDetail: React.FC<{s: number}> = ({s}) => (
  <Svg bloom={false}>
    {[1, 2, 3].map((i) => <line key={'v' + i} x1={(s * i) / 4} y1={s * 0.12} x2={(s * i) / 4} y2={s * 0.88} stroke={GREY_LINE} strokeWidth={1.2} />)}
    {[1, 2, 3].map((i) => <line key={'h' + i} x1={s * 0.1} y1={(s * i) / 4} x2={s * 0.9} y2={(s * i) / 4} stroke={GREY_LINE} strokeWidth={1.2} />)}
    {[[0.18, 0.16, 0.16, 0.3], [0.44, 0.24, 0.14, 0.22], [0.66, 0.12, 0.2, 0.36], [0.3, 0.58, 0.18, 0.26], [0.62, 0.62, 0.22, 0.2]].map((b, i) => (
      <rect key={i} x={s * b[0]} y={s * b[1]} width={s * b[2]} height={s * b[3]} fill="rgba(102,48,248,.16)" stroke={WHITE} strokeWidth={1.6} />
    ))}
  </Svg>
);

/** 贯穿造型：三层错位立方（正面 2.5px 白边 + 黑底，后层细线）。s 为正面边长。 */
export const Cube: React.FC<{cx: number; cy: number; s?: number; op?: number; detail?: 'mind' | 'city' | 'none'; glowK?: number; tone?: string; scaleX?: number; dx?: number; dy?: number}> = ({cx, cy, s = 200, op = 1, detail = 'mind', glowK = 1, tone = WHITE, scaleX = 1, dx = 0, dy = 0}) => (
  <div style={{...abs(cx - s / 2, cy - s / 2, s, s), opacity: op * clamp01(scaleX * 8), transform: `translate(${dx}px, ${dy}px)`, transformOrigin: 'center'}}>
    <div style={{...abs(0, 0, s, s), transform: `scaleX(${Math.max(scaleX, 0.02)})`, transformOrigin: 'center', boxShadow: glowK > 0.05 ? glowPurple(glowK) : undefined}}>
      {[2, 1, 0].map((i) => (
        <div key={i} style={{...abs(i * 18, -i * 18, s, s), border: `${i === 0 ? 2.5 : 1.6}px solid ${i === 0 ? tone : '#8A8A8C'}`, opacity: i === 0 ? 1 : 0.5, background: i === 0 ? 'rgba(0,0,0,.8)' : 'transparent', boxSizing: 'border-box'}}>
          {i === 0 && detail === 'mind' ? <MindDetail s={s} /> : null}
          {i === 0 && detail === 'city' ? <CityDetail s={s} /> : null}
        </div>
      ))}
    </div>
  </div>
);

/** 密度点阵：cols×rows 小圆点，i<lit 的按顺序点亮（表示信息密度，不是速度） */
export const DensityDots: React.FC<{cx: number; cy: number; cols?: number; rows?: number; cell?: number; gap?: number; lit?: number; op?: number; seed?: number}> = ({cx, cy, cols = 8, rows = 8, cell = 5, gap = 19, lit = 64, op = 1, seed = 3}) => {
  const w = (cols - 1) * gap + cell;
  const h = (rows - 1) * gap + cell;
  const x0 = cx - w / 2;
  const y0 = cy - h / 2;
  return (
    <Svg bloom={false} opacity={op}>
      {Array.from({length: cols * rows}, (_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const on = i < lit;
        const isEdge = i === 0 || i === cols - 1 || r === 0 || r === rows - 1;
        const k = on ? 0.55 + 0.45 * rnd(i, seed) : 0.18;
        return <circle key={i} cx={x0 + c * gap + cell / 2} cy={y0 + r * gap + cell / 2} r={cell / 2} fill={on ? mixHex(PURPLE, PURPLE_LIGHT, rnd(i, seed + 1)) : GREY_LINE} opacity={isEdge ? Math.min(1, k + 0.2) : k} />;
      })}
    </Svg>
  );
};

/** 单向通道：竖管（两条竖线 + 上下开口 + 内部等距横虚线刻度） */
export const Channel: React.FC<{cx: number; cy: number; w?: number; h?: number; op?: number; p?: number; tone?: string; ticks?: number; glowK?: number}> = ({cx, cy, w = 90, h = 320, op = 1, p = 1, tone = WHITE, ticks = 3, glowK = 0}) => {
  const x1 = cx - w / 2;
  const x2 = cx + w / 2;
  const y0 = cy - h / 2;
  const y1 = cy + h / 2;
  return (
    <div style={{opacity: op}}>
      <Svg bloom={false}>
        {[-1, 1].map((sg, i) => <line key={i} x1={sg < 0 ? x1 : x2} y1={y0} x2={sg < 0 ? x1 : x2} y2={y0 + h * p} stroke={tone} strokeWidth={2.5} />)}
        {p > 0.9 ? [0, 1].map((sg, i) => <line key={'o' + i} x1={x1 - 14} y1={sg === 0 ? y0 : y1} x2={x2 + 14} y2={sg === 0 ? y0 : y1} stroke={tone} strokeWidth={2.5} opacity={clamp01((p - 0.85) / 0.15)} />) : null}
        {Array.from({length: ticks}, (_, i) => {
          const y = y0 + ((i + 1) * h) / (ticks + 1);
          return <line key={'t' + i} x1={x1 + 6} y1={y} x2={x2 - 6} y2={y} stroke={GREY_LINE} strokeWidth={1.4} strokeDasharray="5 6" />;
        })}
      </Svg>
      {glowK > 0.05 ? <div style={{...abs(x1 - 6, y0, w + 12, h), boxShadow: glowPurple(glowK), borderRadius: 20}} /> : null}
    </div>
  );
};

/** 胶囊（一颗词 / 一个音） */
export const Capsule: React.FC<{x: number; y: number; w?: number; h?: number; op?: number; fill?: string; stroke?: string; sw?: number; lines?: number; r?: number}> = ({x, y, w = 30, h = 46, op = 1, fill = WHITE, stroke = WHITE, sw = 2, lines = 2, r}) => (
  <div style={{...abs(x, y, w, h), opacity: op, background: fill, border: `${sw}px solid ${stroke}`, borderRadius: r ?? w / 2, boxSizing: 'border-box'}}>
    {lines > 0 && w > 44 ? [0, 1].map((i) => <div key={i} style={{...abs(w * 0.2, h * (0.38 + i * 0.22), w * 0.6, 2), background: i === 0 ? '#00000088' : '#00000044'}} />) : null}
  </div>
);

/** 口腔剖面：上腭 + 下颌 + 舌（一条可弯粗线）+ 两条声带。open 0→1 张嘴。 */
export const MouthShape: React.FC<{cx: number; cy: number; w?: number; open?: number; op?: number; p?: number; tongue?: number}> = ({cx, cy, w = 200, open = 0.5, op = 1, p = 1, tongue = 0.5}) => {
  const hw = w / 2;
  const hh = 95;
  const gap = 26 + 34 * open;
  return (
    <Svg bloom={false} opacity={op}>
      <path d={`M ${cx - hw} ${cy} Q ${cx} ${cy - hh} ${cx + hw} ${cy}`} fill="none" stroke={WHITE} strokeWidth={2.5} {...drawOn(p, w * 1.2)} />
      <path d={`M ${cx - hw} ${cy} Q ${cx} ${cy + hh * 0.9 + gap * 0.4} ${cx + hw} ${cy}`} fill="none" stroke={WHITE} strokeWidth={2.5} {...drawOn(p, w * 1.2)} />
      <path d={`M ${cx - hw * 0.86} ${cy + hh * 0.62} Q ${cx - hw * 0.1} ${cy + 8 - 22 * tongue} ${cx + hw * 0.72} ${cy + hh * 0.3 - 10 * tongue}`} fill="none" stroke={PURPLE_LIGHT} strokeWidth={8} strokeLinecap="round" opacity={clamp01(p * 1.4)} />
      <line x1={cx - hw * 0.34} y1={cy - hh * 0.72} x2={cx - hw * 0.34} y2={cy - hh * 0.72 + 18} stroke={GREY} strokeWidth={2} />
      <line x1={cx + hw * 0.34} y1={cy - hh * 0.72} x2={cx + hw * 0.34} y2={cy - hh * 0.72 + 18} stroke={GREY} strokeWidth={2} />
    </Svg>
  );
};

/** 简笔手（五指张开） */
export const HandShape: React.FC<{cx: number; cy: number; s?: number; op?: number; p?: number; tone?: string}> = ({cx, cy, s = 200, op = 1, p = 1, tone = WHITE}) => {
  const pw = s * 0.5;
  const ph = s * 0.42;
  const top = cy + s * 0.06;
  return (
    <Svg bloom={false} opacity={op}>
      {/* 掌：圆角矩形 */}
      <rect x={cx - pw / 2} y={top} width={pw} height={ph} rx={s * 0.1} fill="rgba(0,0,0,.55)" stroke={tone} strokeWidth={3} {...drawOn(p, s * 1.2)} />
      {/* 四指 */}
      {[-0.19, -0.065, 0.065, 0.19].map((dx, i) => {
        const len = s * (i === 1 || i === 2 ? 0.26 : 0.21);
        const x = cx + s * dx;
        return <line key={i} x1={x} y1={top + 4} x2={x} y2={top - len} stroke={tone} strokeWidth={3} strokeLinecap="round" {...drawOn(clamp01(p * 1.3 - 0.1 - i * 0.05), len + 10)} />;
      })}
      {/* 拇指 */}
      <line x1={cx - pw / 2 + 2} y1={top + ph * 0.42} x2={cx - pw / 2 - s * 0.16} y2={top + ph * 0.08} stroke={tone} strokeWidth={3} strokeLinecap="round" {...drawOn(clamp01(p * 1.3 - 0.25), s * 0.3)} />
      {/* 腕 */}
      <line x1={cx - pw * 0.34} y1={top + ph} x2={cx - pw * 0.34} y2={top + ph + s * 0.16} stroke={tone} strokeWidth={3} strokeLinecap="round" {...drawOn(clamp01(p * 1.3 - 0.3), s * 0.2)} />
      <line x1={cx + pw * 0.34} y1={top + ph} x2={cx + pw * 0.34} y2={top + ph + s * 0.16} stroke={tone} strokeWidth={3} strokeLinecap="round" {...drawOn(clamp01(p * 1.3 - 0.3), s * 0.2)} />
    </Svg>
  );
};

/** 眼睛：上下眼睑弧 + 虹膜 + 瞳孔 */
export const EyeShape: React.FC<{cx: number; cy: number; r?: number; op?: number; k?: number; lid?: number}> = ({cx, cy, r = 105, op = 1, k = 0, lid = 0}) => (
  <Svg bloom={false} opacity={op}>
    <path d={`M ${cx - r * 1.35} ${cy} Q ${cx} ${cy - r * (1.02 - lid * 0.5)} ${cx + r * 1.35} ${cy}`} fill="none" stroke={WHITE} strokeWidth={2.5} />
    <path d={`M ${cx - r * 1.35} ${cy} Q ${cx} ${cy + r * (0.92 - lid * 0.5)} ${cx + r * 1.35} ${cy}`} fill="none" stroke={WHITE} strokeWidth={2.5} />
    <circle cx={cx} cy={cy} r={r * 0.42} fill="none" stroke={mixHex(GREY, WHITE, k)} strokeWidth={2.5} />
    <circle cx={cx} cy={cy} r={r * 0.2} fill={mixHex('#111111', PURPLE, k)} stroke={GREY_MID} strokeWidth={1.5} />
  </Svg>
);

/** 简笔脸：两条眉 + 一条嘴弧，angry 0→1 眉线下压、嘴下弯 */
export const FaceShape: React.FC<{cx: number; cy: number; s?: number; op?: number; angry?: number; p?: number}> = ({cx, cy, s = 150, op = 1, angry = 0, p = 1}) => (
  <Svg bloom={false} opacity={op}>
    <circle cx={cx} cy={cy} r={s * 0.5} fill="none" stroke={GREY_LINE} strokeWidth={2} strokeDasharray="6 8" />
    <line x1={cx - s * 0.28} y1={cy - s * 0.1 + angry * s * 0.06} x2={cx - s * 0.06} y2={cy - s * 0.16 - angry * s * 0.04} stroke={WHITE} strokeWidth={3.5} {...drawOn(p, s * 0.3)} />
    <line x1={cx + s * 0.06} y1={cy - s * 0.16 - angry * s * 0.04} x2={cx + s * 0.28} y2={cy - s * 0.1 + angry * s * 0.06} stroke={WHITE} strokeWidth={3.5} {...drawOn(p, s * 0.3)} />
    <path d={`M ${cx - s * 0.18} ${cy + s * 0.2 - angry * s * 0.04} Q ${cx} ${cy + s * (0.12 - 0.2 * angry)} ${cx + s * 0.18} ${cy + s * 0.2 - angry * s * 0.04}`} fill="none" stroke={mixHex(WHITE, CORAL, angry)} strokeWidth={3} {...drawOn(p, s * 0.4)} />
  </Svg>
);

/** 会议室：长桌 + 三把椅 */
export const RoomShape: React.FC<{cx: number; cy: number; w?: number; op?: number; p?: number}> = ({cx, cy, w = 230, op = 1, p = 1}) => {
  const tw = w;
  return (
    <Svg bloom={false} opacity={op}>
      <rect x={cx - tw / 2} y={cy - 26} width={tw} height={52} rx={6} fill="none" stroke={WHITE} strokeWidth={2.2} {...drawOn(p, tw * 2)} />
      {[-0.34, 0, 0.34].map((k, i) => (
        <g key={i}>
          <rect x={cx + tw * k - 18} y={cy - 74} width={36} height={30} rx={4} fill="none" stroke={GREY} strokeWidth={2} {...drawOn(p, 100)} />
          <line x1={cx + tw * k} y1={cy - 44} x2={cx + tw * k} y2={cy - 26} stroke={GREY} strokeWidth={2} {...drawOn(p, 20)} />
        </g>
      ))}
    </Svg>
  );
};

/** 文件页：白边黑底 + 文字线 +（可选）红叉 */
export const DocSheet: React.FC<{x: number; y: number; w?: number; h?: number; op?: number; cross?: number; lines?: number; label?: string}> = ({x, y, w = 130, h = 170, op = 1, cross = 0, lines = 7, label}) => (
  <div style={{opacity: op}}>
    <div style={{...abs(x, y, w, h), border: `2px solid ${WHITE}`, background: 'rgba(0,0,0,.7)', boxSizing: 'border-box'}}>
      {Array.from({length: lines}, (_, i) => <div key={i} style={{...abs(w * 0.16, h * (0.16 + i * 0.1), w * (i === 0 ? 0.44 : 0.66), 2), background: i === 0 ? WHITE : GREY_MID, opacity: i === 0 ? 0.9 : 0.6}} />)}
      {cross > 0 ? <Svg bloom={false}><line x1={w * 0.78} y1={h * 0.16} x2={w * 0.98} y2={h * 0.26} stroke={CORAL} strokeWidth={4} opacity={cross} /><line x1={w * 0.98} y1={h * 0.16} x2={w * 0.78} y2={h * 0.26} stroke={CORAL} strokeWidth={4} opacity={cross} /></Svg> : null}
    </div>
    {label ? <CText cx={x + w / 2} cy={y + h + 24} size={22} color={cross > 0.5 ? CORAL : GREY} weight={700}>{label}</CText> : null}
  </div>
);

/** 翻开的书：两页 + 中缝 + 文字线 */
export const BookShape: React.FC<{cx: number; cy: number; w?: number; h?: number; op?: number; p?: number}> = ({cx, cy, w = 260, h = 200, op = 1, p = 1}) => (
  <Svg bloom={false} opacity={op}>
    <path d={`M ${cx} ${cy - h * 0.36} L ${cx - w / 2} ${cy - h * 0.5} L ${cx - w / 2} ${cy + h * 0.42} L ${cx} ${cy + h * 0.5} Z`} fill="rgba(0,0,0,.6)" stroke={WHITE} strokeWidth={2.2} {...drawOn(p, w * 1.6)} />
    <path d={`M ${cx} ${cy - h * 0.36} L ${cx + w / 2} ${cy - h * 0.5} L ${cx + w / 2} ${cy + h * 0.42} L ${cx} ${cy + h * 0.5} Z`} fill="rgba(0,0,0,.6)" stroke={WHITE} strokeWidth={2.2} {...drawOn(p, w * 1.6)} />
    {[0, 1].map((pg) => Array.from({length: 4}, (_, i) => {
      const y = cy - h * 0.3 + i * h * 0.18;
      const x1 = pg === 0 ? cx - w * 0.42 : cx + w * 0.08;
      return <line key={pg + '-' + i} x1={x1} y1={y} x2={x1 + w * (pg === 0 ? 0.34 : 0.34)} y2={y + (pg === 0 ? 6 : -6)} stroke={GREY_MID} strokeWidth={1.6} opacity={clamp01(p * 1.6 - 0.4)} />;
    }))}
  </Svg>
);

/** DNA 双螺旋：两条正弦 + 横档，hi 指定高亮的横档序号（1 起） */
export const DnaShape: React.FC<{x0: number; x1: number; cy: number; amp?: number; rungs?: number; p?: number; hi?: number; op?: number}> = ({x0, x1, cy, amp = 62, rungs = 12, p = 1, hi = -1, op = 1}) => {
  const path = (ph: number) => {
    let d = '';
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const x = x0 + (x1 - x0) * t;
      const y = cy + amp * Math.sin(t * Math.PI * 2.4 + ph);
      d += (i === 0 ? 'M ' : 'L ') + x.toFixed(1) + ' ' + y.toFixed(1) + ' ';
    }
    return d;
  };
  return (
    <Svg bloom={false} opacity={op}>
      <path d={path(0)} fill="none" stroke={WHITE} strokeWidth={2.5} {...drawOn(p, (x1 - x0) * 1.6)} />
      <path d={path(Math.PI)} fill="none" stroke={WHITE} strokeWidth={2.5} {...drawOn(p, (x1 - x0) * 1.6)} />
      {Array.from({length: rungs}, (_, i) => {
        const t = (i + 0.5) / rungs;
        const x = x0 + (x1 - x0) * t;
        const y1 = cy + amp * Math.sin(t * Math.PI * 2.4);
        const y2 = cy + amp * Math.sin(t * Math.PI * 2.4 + Math.PI);
        const on = i + 1 === hi;
        return <line key={i} x1={x} y1={y1} x2={x} y2={y2} stroke={on ? PURPLE : GREY} strokeWidth={on ? 5 : 2.5} opacity={on ? 1 : 0.75} style={on ? {filter: 'drop-shadow(0 0 10px rgba(102,48,248,.9))'} : undefined} {...drawOn(clamp01(p * 1.4 - i / rungs), 90)} />;
      })}
    </Svg>
  );
};

/** 尺寸标注：双箭头线 + 中段文字 */
export const Measure: React.FC<{x0: number; y0: number; x1: number; y1: number; text?: string; color?: string; op?: number; p?: number; size?: number}> = ({x0, y0, x1, y1, text, color = GREY, op = 1, p = 1, size = 22}) => {
  const mx = (x0 + x1) / 2;
  const my = (y0 + y1) / 2;
  return (
    <div style={{opacity: op}}>
      <Svg bloom={false}>
        <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={color} strokeWidth={1.6} {...drawOn(p, Math.hypot(x1 - x0, y1 - y0) * 1.05)} />
        <line x1={x0} y1={y0 - 6} x2={x0} y2={y0 + 6} stroke={color} strokeWidth={2} />
        <line x1={x1} y1={y1 - 6} x2={x1} y2={y1 + 6} stroke={color} strokeWidth={2} />
      </Svg>
      {text ? <CText cx={mx} cy={my - 16} size={size} color={color} weight={700}>{text}</CText> : null}
    </div>
  );
};
