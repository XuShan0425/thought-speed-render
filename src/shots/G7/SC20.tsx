import React from 'react';
import {useCurrentFrame} from 'remotion';
import {abs, CText, Svg, Box, MonoText, WHITE, GREY, GREY_LINE, GREY_MID, PURPLE, PURPLE_LIGHT, fadeIn, exitOp, glowPurple} from '../../ui';
import {clamp01} from '../../common';
import {RoomShape, FaceShape, DocSheet, drawOn} from '../film';

/** SC20 你只传了索引，他自己解压（5122–5389）。
 *  节拍：5122 压缩盒缩 0.8 → 5150 会议室 → 5190 老板的脸 → 5240 未通过的文件 → 5300 「索引」+ 三条连线 → 5340 「1 / N」。 */
const F0 = 5122;
const TO = 5389;

export const SC20: React.FC = () => {
  const N = useCurrentFrame() + F0;
  const op = exitOp(N, TO, 8);
  const boxIn = clamp01((N - 5122) / 10);
  const roomP = clamp01((N - 5150) / 16);
  const faceP = clamp01((N - 5190) / 12);
  const angry = clamp01((N - 5210) / 3);
  const docP = clamp01((N - 5240) / 12);
  const idxP = clamp01((N - 5300) / 10);
  const lineP = (i: number) => clamp01((N - 5308 - i * 6) / 10);

  return (
    <div style={{...abs(0, 0, 1280, 720), opacity: op}}>
      {/* 压缩盒 */}
      <div style={{opacity: boxIn}}>
        <Box x={640 - 68} y={330 - 68} w={136} h={136} stroke={WHITE} sw={2.5} fill="rgba(0,0,0,.7)" glow={glowPurple(0.6)}>
          <Svg bloom={false}>
            {[0, 1].map((i) => <line key={i} x1={20} y1={48 + i * 34} x2={116} y2={48 + i * 34} stroke={GREY_LINE} strokeWidth={2} strokeDasharray="6 6" />)}
          </Svg>
        </Box>
        {idxP > 0 ? <CText cx={640} cy={334} size={30} color={PURPLE_LIGHT} weight={800} opacity={idxP}>索引</CText> : null}
      </div>

      {/* 会议室 */}
      <div style={{opacity: roomP}}>
        <RoomShape cx={250} cy={300} w={210} p={roomP} />
        <CText cx={250} cy={392} size={22} color={GREY} weight={700} opacity={roomP}>会议室</CText>
      </div>

      {/* 老板的脸 */}
      <div style={{opacity: faceP}}>
        <FaceShape cx={1020} cy={250} s={150} angry={angry} p={faceP} />
        <CText cx={1020} cy={352} size={22} color={GREY} weight={700} opacity={faceP}>老板的表情</CText>
      </div>

      {/* 未通过的方案 */}
      <div style={{opacity: docP}}>
        <DocSheet x={946} y={404} w={128} h={150} lines={6} cross={clamp01((N - 5270) / 12)} label="未通过" />
      </div>

      {/* 三条连线 */}
      <Svg bloom={false}>
        {[0, 1, 2].map((i) => {
          const p = lineP(i);
          if (p <= 0) return null;
          const target = [[368, 300], [946, 262], [946, 470]][i];
          const d = `M 640 ${330 + (i - 1) * 24} Q ${(640 + target[0]) / 2} ${target[1] - 40} ${target[0]} ${target[1]}`;
          return <path key={i} d={d} fill="none" stroke={PURPLE_LIGHT} strokeWidth={1.8} opacity={0.85} {...drawOn(p, 420)} />;
        })}
      </Svg>
      {N > 5340 ? <MonoText x={660} y={412} size={24} color={PURPLE_LIGHT} opacity={fadeIn(N - 5340, 10)}>1 / N</MonoText> : null}
    </div>
  );
};
