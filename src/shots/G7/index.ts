import type {ShotDef, BgSpec, FootageSpec} from '../../common';
import {SC19} from './SC19';
import {SC20} from './SC20';
import {SC21} from './SC21';
import {SC22} from './SC22';

export const SHOTS_G7: ShotDef[] = [
  {id: 'G7-SC19', from: 4940, to: 5121, Comp: SC19},
  {id: 'G7-SC20', from: 5122, to: 5389, Comp: SC20},
  {id: 'G7-SC21', from: 5390, to: 5600, Comp: SC21},
  {id: 'G7-SC22', from: 5601, to: 5903, Comp: SC22},
];
export const BG_G7: BgSpec[] = [];
export const FOOTAGE_G7: FootageSpec[] = [];
