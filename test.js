import {
    f_o_file__fits__from_a_n_u8
} from "./localhost/functions.module.js"
import { encode } from "https://deno.land/x/pngs/mod.ts";
import { encode as encodejpg, Image } from "https://deno.land/x/jpegts@1.1/mod.ts"


// const a_n_u8 = await Deno.readFile('./localhost/files/2023-10-12T19-50-50_Coordinates_Halpha_200s_Jonas-.fts');
const a_n_u8 = await Deno.readFile('./localhost/files/M-31Andromed220221022931.FITS');
// const a_n_u8 = await Deno.readFile('./localhost/files/UITfuv2582gc.fits');
console.log(a_n_u8);

let o_file__fits = f_o_file__fits__from_a_n_u8(a_n_u8, false)
console.log(o_file__fits)


const MAX_16BIT = Math.pow(2, 16) - 1;

function logarithmicStretch(value) {
    return Math.log(1 + value);
}

function normalize(logValue) {
    // For the range 0 to 2^16-1, the log stretch will yield values between log(1) and log(2^16).
    const a = Math.log(1);
    const b = Math.log(1 + MAX_16BIT);
    return (logValue - a) / (b - a);
}

function to8Bit(normalizedValue) {
    return Math.round(normalizedValue * 255);
}

function powerLawTransform(value, gamma) {
    const normalizedValue = value / MAX_16BIT;  // Normalize to [0,1]
    return Math.pow(normalizedValue, gamma);
}


let a_n_u8_image_data = new Uint8Array(o_file__fits.a_n__data_typedarray.length * 4);
let n_val_max = Math.pow(2, o_file__fits.n_bits_per_pixel)-1;
for(let n_idx = 0 ; n_idx < o_file__fits.a_n__data_typedarray.length; n_idx+=1){
    let n_val_nor = o_file__fits.a_n__data_typedarray[n_idx] / n_val_max;
    let n_val_u8 = parseInt(255 * n_val_nor);


    // Example usage:
    var originalValue = o_file__fits.a_n__data_typedarray[n_idx];  // some value between 0 and 2^16-1
    var logValue = logarithmicStretch(originalValue);
    var normalizedValue = normalize(logValue);
    var byteValue = to8Bit(normalizedValue);

    // Example usage:
    var gamma = 0.5;  // Adjust this value as needed
    var transformedValue = powerLawTransform(originalValue, gamma);
    var byteValue = to8Bit(transformedValue);
    n_val_u8 = o_file__fits.a_n__data_typedarray[n_idx] >> 8;
        
    a_n_u8_image_data[n_idx*4+0] = n_val_u8;
    a_n_u8_image_data[n_idx*4+1] = n_val_u8;
    a_n_u8_image_data[n_idx*4+2] = n_val_u8;
    a_n_u8_image_data[n_idx*4+3] = 255;
}
// An array containing a RGBA sequence where the first pixel is red and second is black
const data = a_n_u8_image_data;
// Encode the image to have width 2 and height 1 pixel
const png = encode(data,  o_file__fits.n_scl_x, o_file__fits.n_scl_y);

let image = {
    width: o_file__fits.n_scl_x,
    height: o_file__fits.n_scl_y,
    data: a_n_u8_image_data
}

let raw = encodejpg(image, 100); //Quality 100 (default is 50)
//save the image
await Deno.writeFile('rgb.jpg', raw.data);


await Deno.writeFile("image.png", png);
console.log('asdf')
