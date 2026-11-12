import type {ShotDef, BgSpec, FootageSpec} from '../../common';
import {SC05} from './SC05';
import {SC06} from './SC06';
import {SC07} from './SC07';
import {SC08} from './SC08';

export const SHOTS_G3: ShotDef[] = [
  {id: 'G3-SC05', from: 1195, to: 1459, Comp: SC05},
  {id: 'G3-SC06', from: 1460, to: 1777, Comp: SC06},
  {id: 'G3-SC07', from: 1778, to: 2124, Comp: SC07},
  {id: 'G3-SC08', from: 2125, to: 2327, Comp: SC08},
];
export const BG_G3: BgSpec[] = [];
export const FOOTAGE_G3: FootageSpec[] = [];
