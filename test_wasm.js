// let wasmCode = await Deno.readFile('./wasm_project/pkg/wasm_project_bg.wasm')
//   const wasmModule = new WebAssembly.Module(wasmCode);
  
//   const wasmInstance = new WebAssembly.Instance(wasmModule);
  
//   const s = wasmInstance.exports.greet('asdf');

import { 
    mean, median, standardDeviation
  } from "https://deno.land/x/simplestatistics@v7.8.3/index.js"
  import {
    f_measure_time
  } from "https://deno.land/x/date_functions@1.2/mod.js"
  
  import init, { greet, f_a_n_random, compute_stats_u8, compute_stats_u16} from "./localhost/wasm_project/pkg/wasm_project.js";
  
  // Initialize the WASM module
  await init();
  // Use the exported function
  console.log(greet("asdf"));
  
  // let a_n_random = f_a_n_random(4096*4096*4);
  
  const length = 4096 * 4096 ;
  const a_n_random = new Uint16Array(length);
  
  for (let i = 0; i < length; i++) {
    a_n_random[i] = Math.floor(Math.random() * 65000); // Since Uint8Array values range from 0 to 255
  }
  a_n_random[0] = 44000;
  
  console.log(a_n_random)
  let o_stats = compute_stats_u16(a_n_random);
  
  console.log(o_stats);
  console.log("mean", o_stats.mean);
  console.log("median", o_stats.median);
  console.log("std_dev", o_stats.std_dev);
  console.log("min", o_stats.min);
  console.log("max", o_stats.max);
  console.log("sorted_data", o_stats.sorted_data());
  console.log("a_n_f64_autostretched", o_stats.a_n_f64_autostretched());
  
  
  // f_measure_time('compute stats js')
  // console.log("Mean:", mean(a_n_random));
  // console.log("Median:", median(a_n_random));
  // console.log("Standard Deviation:", standardDeviation(a_n_random));
  // f_measure_time()