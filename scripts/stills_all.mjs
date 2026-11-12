import path from 'node:path';
import fs from 'node:fs';
import {bundle} from '@remotion/bundler';
import {getCompositions, renderStill} from '@remotion/renderer';

const root = process.cwd();
const FRAMES = {"SC01":200,"SC02":540,"SC03":860,"SC04":1130,"SC05":1400,"SC06":1700,"SC07":2100,"SC08":2280,"SC09":2640,"SC10":2880,"SC11":3160,"SC12":3480,"SC13":3680,"SC14":3970,"SC15":4140,"SC16":4400,"SC17":4600,"SC18":4870,"SC19":5110,"SC20":5370,"SC21":5580,"SC22":5890,"SC23":6100,"SC24":6280,"SC25":6490,"SC26":6710,"SC27":7100};
const outDir = path.join(root, 'qc', 'all');
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.join(root, 'src', 'index.ts')});
const comps = await getCompositions(serveUrl);
const comp = comps.find((c) => c.id === 'Video') ?? comps[0];
const frames = process.argv.slice(2).filter((a) => a in FRAMES);
const list = frames.length ? frames : Object.keys(FRAMES);
for (const key of list) {
  const frame = FRAMES[key];
  const output = path.join(outDir, key + '_' + frame + '.png');
  await renderStill({composition: comp, serveUrl, output, frame, imageFormat: 'png', logLevel: 'error'});
  console.log('ok', key, frame);
}
console.log('DONE');
