import type {ShotDef, BgSpec, FootageSpec} from '../../common';
import {SC01} from './SC01';
import {SC02} from './SC02';

export const SHOTS_G1: ShotDef[] = [
  {id: 'G1-SC01', from: 78, to: 352, Comp: SC01},
  {id: 'G1-SC02', from: 353, to: 617, Comp: SC02},
];
export const BG_G1: BgSpec[] = [];
export const FOOTAGE_G1: FootageSpec[] = [];
