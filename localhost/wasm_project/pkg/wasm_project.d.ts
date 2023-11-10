/* tslint:disable */
/* eslint-disable */
/**
* @param {string} name
* @returns {string}
*/
export function greet(name: string): string;
/**
* @returns {bigint}
*/
export function f_n(): bigint;
/**
* @param {number} n_len
* @returns {Uint8Array}
*/
export function f_a_n_random(n_len: number): Uint8Array;
/**
* @param {Uint8Array} data
* @param {number} n_target_bkg
* @param {number} n_shadows_clip
* @returns {Stats}
*/
export function compute_stats_u8(data: Uint8Array, n_target_bkg: number, n_shadows_clip: number): Stats;
/**
* @param {Uint16Array} data
* @param {number} n_target_bkg
* @param {number} n_shadows_clip
* @returns {Stats}
*/
export function compute_stats_u16(data: Uint16Array, n_target_bkg: number, n_shadows_clip: number): Stats;
/**
* @param {Uint32Array} data
* @param {number} n_target_bkg
* @param {number} n_shadows_clip
* @returns {Stats}
*/
export function compute_stats_u32(data: Uint32Array, n_target_bkg: number, n_shadows_clip: number): Stats;
/**
* @param {Float32Array} data
* @param {number} n_target_bkg
* @param {number} n_shadows_clip
* @returns {Stats}
*/
export function compute_stats_f32(data: Float32Array, n_target_bkg: number, n_shadows_clip: number): Stats;
/**
*/
export class Stats {
  free(): void;
/**
* @returns {Float64Array}
*/
  sorted_data(): Float64Array;
/**
* @returns {Float64Array}
*/
  a_n_f64_autostretched(): Float64Array;
/**
*/
  avg_deviation: number;
/**
*/
  max: number;
/**
*/
  mean: number;
/**
*/
  median: number;
/**
*/
  min: number;
/**
*/
  n_midtone_balance: number;
/**
*/
  n_shadow_clipping_point: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly greet: (a: number, b: number, c: number) => void;
  readonly f_n: () => number;
  readonly f_a_n_random: (a: number, b: number) => void;
  readonly __wbg_stats_free: (a: number) => void;
  readonly __wbg_get_stats_mean: (a: number) => number;
  readonly __wbg_set_stats_mean: (a: number, b: number) => void;
  readonly __wbg_get_stats_median: (a: number) => number;
  readonly __wbg_set_stats_median: (a: number, b: number) => void;
  readonly __wbg_get_stats_avg_deviation: (a: number) => number;
  readonly __wbg_set_stats_avg_deviation: (a: number, b: number) => void;
  readonly __wbg_get_stats_min: (a: number) => number;
  readonly __wbg_set_stats_min: (a: number, b: number) => void;
  readonly __wbg_get_stats_max: (a: number) => number;
  readonly __wbg_set_stats_max: (a: number, b: number) => void;
  readonly __wbg_get_stats_n_shadow_clipping_point: (a: number) => number;
  readonly __wbg_set_stats_n_shadow_clipping_point: (a: number, b: number) => void;
  readonly __wbg_get_stats_n_midtone_balance: (a: number) => number;
  readonly __wbg_set_stats_n_midtone_balance: (a: number, b: number) => void;
  readonly stats_sorted_data: (a: number, b: number) => void;
  readonly stats_a_n_f64_autostretched: (a: number, b: number) => void;
  readonly compute_stats_u8: (a: number, b: number, c: number, d: number) => number;
  readonly compute_stats_u16: (a: number, b: number, c: number, d: number) => number;
  readonly compute_stats_u32: (a: number, b: number, c: number, d: number) => number;
  readonly compute_stats_f32: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
