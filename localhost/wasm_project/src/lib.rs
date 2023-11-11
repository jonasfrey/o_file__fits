use wasm_bindgen::prelude::*;

pub trait StatComputable: Copy + Into<f64> + PartialOrd + Clone {
    fn zero() -> Self;
    fn one() -> Self;
    fn into_f64(self) -> f64;
}
impl StatComputable for u8 {
    fn zero() -> Self {
        0
    }
    fn one() -> Self {
        1
    }
    fn into_f64(self) -> f64 {
        self as f64
    }
}

impl StatComputable for u16 {
    fn zero() -> Self {
        0
    }
    fn one() -> Self {
        1
    }
    fn into_f64(self) -> f64 {
        self as f64
    }
}

impl StatComputable for u32 {
    fn zero() -> Self {
        0
    }
    fn one() -> Self {
        1
    }
    fn into_f64(self) -> f64 {
        self as f64
    }
}

impl StatComputable for f32 {
    fn zero() -> Self {
        0.0
    }
    fn one() -> Self {
        1.0
    }
    fn into_f64(self) -> f64 {
        self as f64
    }
}

impl StatComputable for f64 {
    fn zero() -> Self {
        0.0
    }
    fn one() -> Self {
        1.0
    }
    fn into_f64(self) -> f64 {
        self  // Since it's already f64, just return self.
    }
}

// Rest of your code...

// use rand::Rng;
// extern crate rand;

fn f_n_mtf__from_numbers(m: f64, x: f64) -> f64 {
    if x == 0.0 {
        0.0
    } else if x == m {
        0.5
    } else if x == 1.0 {
        1.0
    } else {
        (m - 1.0) * x / (((2.0 * m) - 1.0) * x - m)
    }
}
#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

#[wasm_bindgen]
pub fn f_n() -> u64 {
    return 1123581321
}

#[wasm_bindgen]
pub fn f_a_n_random(n_len: u32) -> Vec<u8> {
    // let mut rng = rand::thread_rng();
    // (0..n_len).map(|_| rng.gen::<u8>()).collect()
    (0..n_len).map(|_| 1).collect()
}




#[wasm_bindgen]
pub struct Stats {
    pub mean: f64,
    pub median: f64,
    pub avg_deviation: f64,
    pub min: f64,        
    pub max: f64,    
    pub n_shadow_clipping_point: f64, 
    pub n_midtone_balance: f64, 
    sorted_data: Vec<f64>,
    a_n_f64_autostretched: Vec<f64>

}
#[wasm_bindgen]
impl Stats {
    pub fn sorted_data(&self) -> Vec<f64> {
        self.sorted_data.clone()
    }
    pub fn a_n_f64_autostretched(&self) -> Vec<f64> {
        self.a_n_f64_autostretched.clone()
    }
    // other methods...
}



#[wasm_bindgen]
pub fn compute_stats_u8(
    data: &[u8],
    n_target_bkg: f64,
    n_shadows_clip: f64
) -> Stats {
    compute_stats::<u8>(data, Some(n_target_bkg), Some(n_shadows_clip))
}

#[wasm_bindgen]
pub fn compute_stats_u16(
    data: &[u16],
    n_target_bkg: f64,
    n_shadows_clip: f64
) -> Stats {
    // return compute_stats::<u16>(data, Some(n_target_bkg), Some(n_shadows_clip));
    let n_len_data = data.len();
    let a_n_u16__init = [u16::MAX, u16::MIN];
    let a_n_u16__result = data.iter().fold(a_n_u16__init, |mut a_n_acc, &val| {
        a_n_acc[0] = a_n_acc[0].min(val);
        a_n_acc[1] = a_n_acc[1].max(val);
        a_n_acc
    });
    let n_min = a_n_u16__result[0];
    let n_max = a_n_u16__result[1];

    let mut a_n_u16__normalized_minmax = Vec::with_capacity(data.len());
    let n_range = n_max - n_min; 
    if n_range as f64 != 0.0 {
        for &n_value in data {
            let normalized_value = 
                (((n_value as f64 - n_min as f64) / n_range as f64) * u16::MAX as f64) as u16;
            a_n_u16__normalized_minmax.push(normalized_value);
        }
    } else {
        // Handle the case where all values in data are the same
        for _ in data {
            a_n_u16__normalized_minmax.push(0); // or some default value
        }
    }

    let mut a_n_u16_sorted = a_n_u16__normalized_minmax.to_vec();
    a_n_u16_sorted.sort_unstable();

    
    let mut n_median_f = 0.0;
    let n_idx_center = (n_len_data / 2);
    if data.len() % 2 == 0 {
        n_median_f = (a_n_u16_sorted[n_idx_center - 1] as f64 + (a_n_u16_sorted[n_idx_center]) as f64) / 2.0
    } else {
        n_median_f = a_n_u16_sorted[n_idx_center] as f64
    };
    let n_median = n_median_f as u16;
    let n_median_nor = n_median_f / u16::MAX as f64;


    // Compute average deviation
    let n_median_absolute_deviation: u16 = (a_n_u16_sorted.iter().map(|&value| {
        (value as i32 -n_median as i32).abs() as u64
    }).sum::<u64>() as usize / n_len_data as usize) as u16;
    
    // let n_sum = a_n_u16_sorted.iter().map(|&x| x as u32).sum::<u32>() as f64;
    // let mean = n_sum as f64 / a_n_u16_sorted.len() as f64;

    let n_median_absolute_deviation_nor = (n_median_absolute_deviation as f64 / u16::MAX as f64);
    let n_tmp = n_median_nor + (n_shadows_clip * n_median_absolute_deviation_nor);

    let n_shadow_clipping_point = n_tmp.min(1.).max(0.);

    let n_midtone_balance = f_n_mtf__from_numbers(
        n_target_bkg,
        n_median_nor - n_shadow_clipping_point
    );

    let mut a_n_f64_autostretched = a_n_u16__normalized_minmax.iter()
        .map(|&value| {
            let mut n_auto_stretched: f64 = 0.;
            let n_val_nor = (value as f64/ u16::MAX as f64) as f64;
            // return n_val_nor;
            if n_val_nor >= n_shadow_clipping_point {
                n_auto_stretched = f_n_mtf__from_numbers(
                    n_midtone_balance, 
                    (n_val_nor-n_shadow_clipping_point) / (1.-n_shadow_clipping_point)
                );
            }
            return n_auto_stretched;
        })
        .collect();


    Stats { 
        mean: 1.0,
        median: n_median_nor as f64 / u16::MAX as f64,
        avg_deviation: n_median_absolute_deviation_nor,
        min: n_min as f64, /// u16::MAX as f64,
        max: n_max as f64, /// u16::MAX as f64,
        n_midtone_balance, 
        n_shadow_clipping_point,
        sorted_data: vec![0.0],
        a_n_f64_autostretched
     }
     
}

#[wasm_bindgen]
pub fn compute_stats_u32(
    data: &[u32],
    n_target_bkg: f64,
    n_shadows_clip: f64
) -> Stats {
    compute_stats::<u32>(data, Some(n_target_bkg), Some(n_shadows_clip))
}

#[wasm_bindgen]
pub fn compute_stats_f32(
    data: &[f32],
    n_target_bkg: f64,
    n_shadows_clip: f64
) -> Stats {
    compute_stats::<f32>(data, Some(n_target_bkg), Some(n_shadows_clip))
}

// pub fn compute_stats<T: StatComputable>(data: &[T]) -> Stats {
//     let mean = data.iter().map(|&x| x.into()).sum::<f64>() / data.len() as f64;

//     let mut sorted: Vec<_> = data.iter().map(|&x| x.into()).collect();
//     sorted.sort_by(|a, b| a.partial_cmp(b).unwrap());  // Correct the sorting syntax

//     let median = if data.len() % 2 == 0 {
//         (sorted[data.len() / 2 - 1] + sorted[data.len() / 2]) / 2.0
//     } else {
//         sorted[data.len() / 2]
//     };

//     let min = sorted[0];
//     let max = sorted[sorted.len() - 1];

//     let variance: f64 = data.iter().map(|&value| {
//         let diff = mean - value.into();
//         diff * diff
//     }).sum::<f64>() / data.len() as f64;

//     let avg_deviation = variance.sqrt();

//     Stats { mean, median, avg_deviation, min, max, sorted_data: sorted }
// }

// Expose a simplified version to JS


pub fn compute_stats<T: StatComputable>(
    data: &[T], 
    n_target_bkg: Option<f64>,
    n_shadows_clip: Option<f64>
) -> Stats {
    let n_target_bkg = n_target_bkg.unwrap_or(0.25);
    let n_shadows_clip = n_shadows_clip.unwrap_or(-1.25);
    // Convert the data into f64 for easier operations.

    let f64_data: Vec<f64> = data.iter().map(|&x| x.into_f64()).collect();
    // let f64_data: Vec<f64> = data.par_iter().map(|&x| x.into_f64()).collect();
    // let f64_data: Vec<f64> = data.to_vec().par_iter().map(|&x| x.into_f64()).collect();

    // Find min and max
    let min = *f64_data.iter().min_by(|a, b| a.partial_cmp(b).unwrap()).unwrap();
    let max = *f64_data.iter().max_by(|a, b| a.partial_cmp(b).unwrap()).unwrap();    

    // Normalize the data
    let normalized_data: Vec<f64> = f64_data.iter().map(|&x| (x - min) / (max - min)).collect();

    // Compute mean
    let mean = normalized_data.iter().sum::<f64>() / normalized_data.len() as f64;

    // Compute median
    let mut sorted = normalized_data.clone();
    sorted.sort_by(|a, b| a.partial_cmp(b).unwrap());

    let median = if normalized_data.len() % 2 == 0 {
        (sorted[normalized_data.len() / 2 - 1] + sorted[normalized_data.len() / 2]) / 2.0
    } else {
        sorted[normalized_data.len() / 2]
    };

    // Compute average deviation
    let avg_deviation: f64 = normalized_data.iter().map(|&value| {
        (value-median).abs()
    }).sum::<f64>() / normalized_data.len() as f64;

    let n_tmp = median + (n_shadows_clip * avg_deviation);

    let n_shadow_clipping_point = n_tmp.min(1.).max(0.);

    let n_midtone_balance = f_n_mtf__from_numbers(
        n_target_bkg,
        median - n_shadow_clipping_point
    );

    let mut a_n_f64_autostretched = normalized_data.iter()
        .map(|&value| {
            let mut n_auto_stretched: f64 = 0.;
            if value >= n_shadow_clipping_point {
                n_auto_stretched = f_n_mtf__from_numbers(
                    n_midtone_balance, 
                    (value-n_shadow_clipping_point) / (1.-n_shadow_clipping_point)
                );
            }
            return n_auto_stretched;
        })
        .collect();



    // o_file__fits.n_f_midtone_balance = 
    // f_n_mtf__from_numbers(n_target_bkg, o_file__fits.n_f__median - o_file__fits.n_f_shadow_clipping_point)



    Stats { 
        mean,
        median,
        avg_deviation,
        min,
        max,
        n_midtone_balance, 
        n_shadow_clipping_point,
        sorted_data: sorted,
        a_n_f64_autostretched
     }
}

