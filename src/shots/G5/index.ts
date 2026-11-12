import type {ShotDef, BgSpec, FootageSpec} from '../../common';
import {SC11} from './SC11';
import {SC12} from './SC12';
import {SC13} from './SC13';

export const SHOTS_G5: ShotDef[] = [
  {id: 'G5-SC11', from: 2908, to: 3205, Comp: SC11},
  {id: 'G5-SC12', from: 3206, to: 3505, Comp: SC12},
  {id: 'G5-SC13', from: 3506, to: 3696, Comp: SC13},
];
export const BG_G5: BgSpec[] = [];
export const FOOTAGE_G5: FootageSpec[] = [];
