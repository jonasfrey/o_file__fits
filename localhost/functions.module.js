import {
    O_data_unit, 
    O_file__fits, 
} from "./classes.module.js"

let f_o_canvas = null;
let o_mod_canvas = null;
if('Deno' in window){
    // import {  createCanvas } from "https://deno.land/x/canvas/mod.ts";
    o_mod_canvas = await import("https://deno.land/x/canvas/mod.ts")
    f_o_canvas = o_mod_canvas.createCanvas;
}else{
    f_o_canvas = function(
        n_scl_x_px, 
        n_scl_y_px
    ){
        let o_el_canvas = document.createElement("canvas");
        o_el_canvas.width = n_scl_x_px
        o_el_canvas.height = n_scl_y_px
        return o_el_canvas
    }
}

let n_length_max_s_data_unit_line = 80;

let f_o_data_unit__from_s = function(s, b_strict){
        if(s.length > n_length_max_s_data_unit_line && b_strict){
        throw Error(`input string is bigger than allowed ${n_length_max_s_data_unit_line} chars, string is ${s}, (length: ${s.length})`);
    }
    let a_s = s.split('=');
    let s_keyword = a_s.shift();
    if(s_keyword.length > 8 && b_strict){
        throw Error(`keyword string is bigger than allowed 8 chars, string is ${s_keyword}, full string is ${s}, (length: ${s.length})`);
    }
    let s_value_and_potentially_comment = a_s.join("=");
    a_s = s_value_and_potentially_comment.split('/');
    let s_value = s_value_and_potentially_comment
    let s_comment = ''
    if(a_s.length > 1){
        s_value = a_s.shift()
        s_comment = a_s.join('/');
    }
    // we could now parse the value 

    // In the FITS header, each card is 80 characters long. The format of a card is as follows:
    // Keyword: Up to 8 characters (positions 1-8).
    // Equals Sign and Spaces: Positions 9-10. Usually, it is an equals sign = followed by a space.
    // Value: Positions 11-30. This is where the value associated with the keyword is written.
    // Comment: Can start as early as position 32 and extend to position 80.
    // The possible characters for the value depend on the data type of the value:

    // Logical: A single character, either T (true) or F (false).

    // Integer: A sequence of digits, potentially preceded by a plus + or minus - sign. No commas or other delimiters are used.

    // Floating-point: This includes numbers that can be represented in decimal notation or exponential notation. Examples:

    // 0.12345
    // -0.12345
    // 1.2345E-04
    // -1.2345E-04
    // Complex: A pair of floating-point numbers representing the real and imaginary parts, separated by a comma and enclosed in parentheses. Example: (0.12345, -0.98765)

    // Character String: Enclosed in single quotes '. For example, 'This is a string'. If a string contains a single quote, it can be represented by two single quotes. For example, the string It's a FITS file would be represented as 'It''s a FITS file'.

    // Undefined: The value field can be blank, indicating no value.

    // Any other character or set of characters that doesn't fit the above types would be non-standard and might not be properly read by standard FITS file parsers.

    // Special notes:

    // Spaces: Leading and trailing spaces in character string values are significant and must be preserved.
    // Null Values: If a keyword has a null or undefined value, the value field should be filled with ASCII blanks.
    // Comments: Often, a / (slash) is used as a separator between the value and the comment. If there's no slash, the comment immediately follows the value.
    // To ensure maximum compatibility, it's always best to adhere to the FITS standard when creating or modifying FITS files.

    return new O_data_unit(
        s_keyword, 
        s_value, 
        s_comment
    );

}
let f_n_index_of = function(a_n_u8, a_n_u8_searchbytes){
    for (let n_i = 0; n_i < a_n_u8.length - a_n_u8_searchbytes.length + 1; n_i++) {
        let b_match = true;
        for (let n_j = 0; n_j < a_n_u8_searchbytes.length; n_j++) {
            if (a_n_u8[n_i + n_j] !== a_n_u8_searchbytes[n_j]) {
                b_match = false;
                break;
            }
        }
        if (b_match) {
            return n_i;
        }
    }
    return -1;
}
let f_o_file__fits__from_a_n_u8 = function(a_n_u8, b_strict = true){

    let n_mod = 2880;
    const o_text_encoder = new TextEncoder();
    const o_text_decoder = new TextDecoder();
    let a_n_u8__end = o_text_encoder.encode(' END');
    let n_index__end = f_n_index_of(a_n_u8, a_n_u8__end);
    if(n_index__end < 0){
        throw Error(`invalid fits file, could not find 'END' keyword that marks the end of header`);
    }
    console.log('n_index__end')
    console.log(n_index__end)

    let o_file__fits = new O_file__fits();
    o_file__fits.a_n_u8 = a_n_u8;
    let a_n_u8__header = a_n_u8.slice(0, n_index__end);
    let s_header = o_text_decoder.decode(a_n_u8__header);
    console.log('s_header')
    console.log(s_header)
    for(let n_i = 0; n_i < n_index__end; n_i+=n_length_max_s_data_unit_line){
        let s_line = o_text_decoder.decode(a_n_u8.slice(n_i, n_i+n_length_max_s_data_unit_line));
        // let s_line_next = o_text_decoder.decode(a_n_u8.slice(n_i+n_length_max_s_data_unit_line, n_i+n_length_max_s_data_unit_line+n_length_max_s_data_unit_line));
        console.log(s_line)
        // console.log(s_line_next)
        if(!b_strict){
            if(s_line.indexOf('=') == -1){
                o_file__fits.a_o_data_unit.at(-1).s_comment += s_line;
                continue
            }
        }
        let o_data_unit = f_o_data_unit__from_s(
            s_line, 
            b_strict
        )

        o_file__fits.a_o_data_unit.push(
            o_data_unit
        )
    }
    console.log(
        o_file__fits
    )
    // Deno.writeTextFile('./o_file__fits.json', JSON.stringify(o_file__fits, null, 4));

    let o_data_unit = o_file__fits.a_o_data_unit.find(o=>o.s_keyword.indexOf("NAXIS")!=-1);
    if(o_data_unit){
        o_file__fits.n_dimensions = parseFloat(o_data_unit.s_value)
    }
    o_data_unit = o_file__fits.a_o_data_unit.find(o=>o.s_keyword.indexOf("NAXIS1")!=-1);
    if(o_data_unit){
        o_file__fits.n_scl_x = parseFloat(o_data_unit.s_value)
    }
    o_data_unit = o_file__fits.a_o_data_unit.find(o=>o.s_keyword.indexOf("NAXIS2")!=-1);
    if(o_data_unit){
        o_file__fits.n_scl_y = parseFloat(o_data_unit.s_value)
    }
    o_data_unit = o_file__fits.a_o_data_unit.find(o=>o.s_keyword.indexOf("NAXIS3")!=-1);
    if(o_data_unit){
        o_file__fits.n_scl_z = parseFloat(o_data_unit.s_value)
    }
    o_data_unit = o_file__fits.a_o_data_unit.find(o=>o.s_keyword.indexOf("NAXIS4")!=-1);
    if(o_data_unit){
        o_file__fits.n_scl_w = parseFloat(o_data_unit.s_value)
    }

    o_data_unit = o_file__fits.a_o_data_unit.find(o=>o.s_keyword.indexOf("BITPIX")!=-1);
    if(o_data_unit){
        o_file__fits.n_bits_per_pixel = parseFloat(o_data_unit.s_value)
    }

    o_data_unit = o_file__fits.a_o_data_unit.find(o=>o.s_keyword.indexOf("BSCALE")!=-1);
    if(o_data_unit){
        o_file__fits.n_bscale = parseFloat(o_data_unit.s_value)
    }
    o_data_unit = o_file__fits.a_o_data_unit.find(o=>o.s_keyword.indexOf("BZERO")!=-1);
    if(o_data_unit){
        o_file__fits.n_bzero = parseFloat(o_data_unit.s_value)
    }

    o_file__fits.n_index_data_start = (n_index__end+a_n_u8__end.length);
    const n_remainder = o_file__fits.n_index_data_start % n_mod;
    if (n_remainder !== 0) {
        o_file__fits.n_index_data_start += (n_mod - n_remainder);
    }

    o_file__fits.n_bytes_per_datapoint = Math.abs(parseInt(o_file__fits.n_bits_per_pixel / 8));

    let n_length_pixels = o_file__fits.n_scl_x * o_file__fits.n_scl_y;
    o_file__fits.n_index_data_end = o_file__fits.n_index_data_start + (n_length_pixels*o_file__fits.n_bytes_per_datapoint);

    // The resulting Uint16Array will be half the length of the Uint8Array
    let O_typed_array = Uint8Array;
    let s_name_function = 'getUint8';
    if(o_file__fits.n_bits_per_pixel == 16){
        O_typed_array = Uint16Array;
        s_name_function = 'getUint16';
    }
    if(o_file__fits.n_bits_per_pixel == 32){
        O_typed_array = Uint32Array;
        s_name_function = 'getUint32';
    }
    if(o_file__fits.n_bits_per_pixel == -32){
        O_typed_array = Float32Array;
        s_name_function = 'getFloat32';
    }
    if(o_file__fits.n_bits_per_pixel == -64){
        O_typed_array = Float64Array;
        s_name_function = 'getFloat64';
    }

    let n_len_a_n_u8_data = o_file__fits.n_index_data_end - o_file__fits.n_index_data_start;
    let n_pixels = n_len_a_n_u8_data / o_file__fits.n_bytes_per_datapoint;
    o_file__fits.a_n_u__data_typedarray = new O_typed_array(n_pixels);
    o_file__fits.a_n_u__data_typedarray_y_flipped = new O_typed_array(n_pixels);
    let O_float_type_array = f_O_float_type_array__from_o_file__fits(o_file__fits);
    o_file__fits.a_n_f__image_data__normalized = new O_float_type_array(n_pixels);

    // Create a DataView for the Uint8Array's buffer
    const o_view = new DataView(o_file__fits.a_n_u8.buffer);

    o_file__fits.n_u__max_possible = Math.pow(2, Math.abs(o_file__fits.n_bits_per_pixel))-1;

    // Convert each pair of bytes in the Uint8Array to Uint16
    for (let n_idx_byte = 0, n_idx_datapoint = 0; n_idx_byte < n_len_a_n_u8_data; n_idx_byte += o_file__fits.n_bytes_per_datapoint, n_idx_datapoint++) {
        let n_trn_x_pixel = o_file__fits.n_scl_x - 1 - (n_idx_datapoint % o_file__fits.n_scl_x); 
        // let n_trn_y_pixel = o_file__fits.n_scl_y - 1 - parseInt(n_idx_datapoint / o_file__fits.n_scl_x);
        let n_trn_y_pixel = parseInt(n_idx_datapoint / o_file__fits.n_scl_x);
        let n_idx_real = n_trn_y_pixel * o_file__fits.n_scl_x + n_trn_x_pixel;
        
        let n_array_value = o_view[s_name_function](n_idx_byte+o_file__fits.n_index_data_start, false); // Using little-endian format;
        
        // let n_physical_value = 32768 + 1 * n_array_value;
        // let n_physical_value = getOriginalValue(n_array_value);
        let n_physical_value = n_array_value;

        if(o_file__fits.n_bscale && o_file__fits.n_bzero){
            // i think an overflow is intended here , or wtf is going on ????....
            n_physical_value = o_file__fits.n_bzero + o_file__fits.n_bscale * n_array_value
        }

        o_file__fits.a_n_u__data_typedarray[n_idx_datapoint] = n_physical_value; 
        o_file__fits.a_n_u__data_typedarray_y_flipped[n_idx_real] = n_physical_value;
        let n_nor = (n_physical_value / o_file__fits.n_u__max_possible)
        o_file__fits.a_n_f__image_data__normalized[n_idx_datapoint] = n_nor - parseInt(n_nor) ;//cut away the overflow

    }

    return o_file__fits
}

let f_a_n_u8__from_s_url = async function(
    s_url
){
    return new Promise(
        (f_resolve)=>{
            fetch(s_url).then(
                o_resp =>{
                    console.log("is the data here already on my local machine?") // here
                    // o_resp.body()
        
                    o_resp.arrayBuffer().then(
                        (o_buffer)=>{
                            return f_resolve(new Uint8Array(o_buffer));
                        }
                    );
                    
                }
            )
        }
    )
}
let f_o_file__fits__from_a_n_u8__fetch_from_s_url = async function(s_url, b_strict = true){
    return f_a_n_u8__from_s_url(s_url).then(
        (a_n_u8) =>{
            let s_name_file = s_url.split("/").pop();
            return f_o_file__fits__from_a_n_u8(a_n_u8, b_strict)
        }
    )
}


function f_n_clamped(n, n_min, m_max) {
    return Math.min(Math.max(n, n_min), m_max);
}
function f_n_mtf__from_numbers(m, x) {
    if (x === 0) {
        return 0;
    } else if (x === m) {
        return 0.5;
    } else if (x === 1) {
        return 1;
    } else {
        return (m - 1) * x / (((2 * m) - 1) * x - m);
    }
}
let f_O_float_type_array__from_o_file__fits = function(o_file__fits){

    if(o_file__fits.n_bits_per_pixel > 32){
        console.log(`unfortunately i was to lazy to implement handling of pixels with values bigger than 32bits per pixel, so data will get lost and this function wont work properly, sry mate!`)
    }

    let O_float_type_array = Float32Array;
    if(o_file__fits.n_bits_per_pixel > 24){
        O_float_type_array = Float64Array;
    }
    return O_float_type_array
}

let f_calculate_a_n_f__image_data__auto_stretched = async function(
    o_file__fits, 
    n_target_bkg = 0.25,
    n_shadows_clip = -1.25
){
    
    let O_float_type_array = f_O_float_type_array__from_o_file__fits(o_file__fits);
    o_file__fits.a_n_f__image_data__normalized_minmax = new O_float_type_array(o_file__fits.a_n_u__data_typedarray.length);

    o_file__fits.n_u__min = o_file__fits.n_u__max_possible;

    
    for (let n_idx = 0; n_idx < o_file__fits.a_n_u__data_typedarray.length; n_idx++) {
        
        let n_u = o_file__fits.a_n_u__data_typedarray[n_idx];
        if(n_u <= o_file__fits.n_u__min){
            o_file__fits.n_u__min = n_u;
        }
        if(n_u >= o_file__fits.n_u__max){
            o_file__fits.n_u__max = n_u;
        }
    }
    console.log('computed min max')

    o_file__fits.n_f__max = o_file__fits.n_u__max / o_file__fits.n_u__max_possible;
    o_file__fits.n_f__min = o_file__fits.n_u__min / o_file__fits.n_u__max_possible;

    o_file__fits.n_u__range = o_file__fits.n_u__max-o_file__fits.n_u__min;
    o_file__fits.n_f__range = o_file__fits.n_f__max-o_file__fits.n_f__min;

    o_file__fits.n_f__sum = 0;

    for (let n_idx = 0; n_idx < o_file__fits.a_n_u__data_typedarray.length; n_idx++) {

        // const n_f = (o_file__fits.a_n_u__data_typedarray[n_idx]-n_u__min) / (o_file__fits.n_u__max);
        const n_f = (o_file__fits.a_n_u__data_typedarray[n_idx]-o_file__fits.n_u__min) / (o_file__fits.n_u__range);

        o_file__fits.a_n_f__image_data__normalized_minmax[n_idx] = n_f;
        
        o_file__fits.n_f__sum += n_f;

    }
    
    console.log('computed normalized minmax')

    o_file__fits.n_u__sum = BigInt(parseInt(o_file__fits.n_f__sum) * o_file__fits.n_u__max_possible);

    o_file__fits.n_f__avg = o_file__fits.n_f__sum / o_file__fits.a_n_u__data_typedarray.length;
    o_file__fits.n_u__avg = parseInt(o_file__fits.n_f__avg * o_file__fits.n_u__max_possible)


    let n_f__sum_deviations = 0;
    o_file__fits.a_n_f__image_data__sorted = new O_float_type_array(o_file__fits.a_n_f__image_data__normalized_minmax);
    o_file__fits.a_n_f__image_data__sorted.sort((a, b) => {
        return a - b;
    });

    console.log('sorted')

    let n_idx_middle = Math.floor(o_file__fits.a_n_u__data_typedarray.length / 2);
    o_file__fits.n_f__median = o_file__fits.a_n_f__image_data__sorted[n_idx_middle]

    if((o_file__fits.a_n_u__data_typedarray.length % 2 === 0)){
        o_file__fits.n_f__median = (o_file__fits.a_n_f__image_data__sorted[n_idx_middle - 1] + o_file__fits.a_n_f__image_data__sorted[n_idx_middle]) / 2
    }

    o_file__fits.n_u__median = parseInt(o_file__fits.n_f__median * o_file__fits.n_u__max_possible)


    for (let n_idx = 0; n_idx < o_file__fits.a_n_u__data_typedarray.length; n_idx++) {
        n_f__sum_deviations += Math.abs(o_file__fits.a_n_f__image_data__sorted[n_idx] - o_file__fits.n_f__median);
    }
    o_file__fits.n_f__avg_deviation = n_f__sum_deviations / o_file__fits.a_n_u__data_typedarray.length;
    o_file__fits.n_u__avg_deviation = parseInt(o_file__fits.n_f__avg_deviation * o_file__fits.n_u__max_possible)


    
    o_file__fits.n_f_shadow_clipping_point = f_n_clamped(o_file__fits.n_f__median + (n_shadows_clip * o_file__fits.n_f__avg_deviation), 0, 1)
    o_file__fits.n_f_highlights_clipping_point = o_file__fits.n_f__max;

    o_file__fits.n_f_midtone_balance = f_n_mtf__from_numbers(n_target_bkg, o_file__fits.n_f__median - o_file__fits.n_f_shadow_clipping_point)

    o_file__fits.a_n_f__image_data__auto_stretched = new O_float_type_array(o_file__fits.a_n_u__data_typedarray.length);

    for (let n_idx = 0; n_idx < o_file__fits.a_n_f__image_data__normalized_minmax.length; n_idx++) {
        let nf = o_file__fits.a_n_f__image_data__normalized_minmax[n_idx];
        let n_f__auto_streched = 0;
        if(nf >= o_file__fits.n_f_shadow_clipping_point){
            n_f__auto_streched = f_n_mtf__from_numbers(o_file__fits.n_f_midtone_balance, (nf - o_file__fits.n_f_shadow_clipping_point) / (1 - o_file__fits.n_f_shadow_clipping_point));
            // if(n_idx % 100000 == 0){
            //     console.log(n_f__auto_streched)
            // }
        }
        o_file__fits.a_n_f__image_data__auto_stretched[n_idx] = n_f__auto_streched   
    }
    console.log('stretched')


    return true
}

let f_o_canvas_nonmanipulated__from_o_file__fits = function(
    o_file__fits
){
    
    let n_color_channels = 4;
    let a_n_u8__image_data = new Uint8Array(o_file__fits.a_n_u__data_typedarray.length*n_color_channels);

    for(let n_idx = 0 ; n_idx < o_file__fits.a_n_f__image_data__normalized.length; n_idx+=1){

        let n_val = o_file__fits.a_n_f__image_data__normalized[n_idx]*255;
        a_n_u8__image_data[n_idx*4+0] = n_val;
        a_n_u8__image_data[n_idx*4+1] = n_val;
        a_n_u8__image_data[n_idx*4+2] = n_val;
        a_n_u8__image_data[n_idx*4+3] = 255;
    }

    const o_canvas = f_o_canvas(
        o_file__fits.n_scl_x,
        o_file__fits.n_scl_y
    );
    // const o_ctx = o_canvas.getContext("2d");
    const o_ctx = o_canvas.getContext('2d', { alpha: true });


    const o_image_data = o_ctx.createImageData(o_canvas.width, o_canvas.height);

    // Copy your data into the ImageData object
    o_image_data.data.set(a_n_u8__image_data);

    o_ctx.putImageData(o_image_data, 0, 0);

    o_ctx.font = '18px Sans-serif';

    return o_canvas;

}

let f_o_canvas_autostretched__from_o_file__fits = async function(
    o_file__fits
){

    return new Promise(async (f_resolve)=>{

        let n_color_channels = 4;
        let a_n_u8__image_data = new Uint8Array(o_file__fits.a_n_u__data_typedarray.length*n_color_channels);

        await f_calculate_a_n_f__image_data__auto_stretched(o_file__fits);

        for(let n_idx = 0 ; n_idx < o_file__fits.a_n_f__image_data__auto_stretched.length; n_idx+=1){
    
            let n_val = o_file__fits.a_n_f__image_data__auto_stretched[n_idx]*255;
            a_n_u8__image_data[n_idx*4+0] = n_val;
            a_n_u8__image_data[n_idx*4+1] = n_val;
            a_n_u8__image_data[n_idx*4+2] = n_val;
            a_n_u8__image_data[n_idx*4+3] = 255;
        }
    
        const o_canvas = f_o_canvas(
            o_file__fits.n_scl_x,
            o_file__fits.n_scl_y
        );
        // const o_ctx = o_canvas.getContext("2d");
        const o_ctx = o_canvas.getContext('2d', { alpha: true });
    
    
        const o_image_data = o_ctx.createImageData(o_canvas.width, o_canvas.height);
    
        // Copy your data into the ImageData object
        o_image_data.data.set(a_n_u8__image_data);
    
        o_ctx.putImageData(o_image_data, 0, 0);
    
        o_ctx.font = '18px Sans-serif';
    
        return f_resolve(o_canvas);
    })
    
}

export {
    f_o_file__fits__from_a_n_u8, 
    f_a_n_u8__from_s_url, 
    f_o_file__fits__from_a_n_u8__fetch_from_s_url, 
    f_o_canvas_nonmanipulated__from_o_file__fits,
    f_o_canvas_autostretched__from_o_file__fits
}