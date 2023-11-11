<!-- {"s_msg":"this file was automatically generated","s_by":"f_generate_markdown.module.js","s_ts_created":"Sat Nov 11 2023 02:25:30 GMT+0100 (Central European Standard Time)","n_ts_created":1699665930054} -->
# import functions
```javascript
import {
    f_o_file__fits__from_a_n_u8__fetch_from_s_url,
    f_o_canvas_nonmanipulated__from_o_file__fits,
    f_o_canvas_autostretched__from_o_file__fits,
    f_o_file__fits__from_a_n_u8, 
    f_a_n_u8__from_s_url
} from './functions.module.js'
let b_deno  = 'Deno' in window


let o_select = document.createElement("input");
o_select.type = 'file'
document.body.appendChild(
    o_select
);
window.o_file__fits = null;
if(!b_deno){
    o_select.onchange = function(o_e){
    
            let o_freader = new FileReader();
            o_freader.onload = async function() {
            
                let o_array_buffer = this.result;
                let a_n_u8 = new Uint8Array(o_array_buffer);
                let b_strict = false;
                console.log('trying to load fits...')
                window.o_file__fits = await f_o_file__fits__from_a_n_u8(a_n_u8, b_strict);
                console.log('window.o_file__fits')
                console.log(window.o_file__fits)
                let o_canvas = f_o_canvas_nonmanipulated__from_o_file__fits(o_file__fits)
                let o_canvas_autostretched = await f_o_canvas_autostretched__from_o_file__fits(o_file__fits)
                document.body.appendChild(o_canvas)
                document.body.appendChild(o_canvas_autostretched)
                
            }
            o_freader.readAsArrayBuffer(this.files[0]);
    }
}

```
## load fits file (load the bytes int Uint8Array)
```javascript
let s_path_file = './files/stellarium-gornergrat.ch_portal_files_telescop-pictures_20231010_100_2023-10-10T23-04-21_Coordinates_Blue_180s_Jonas-.fts'

let a_n_u8 = null;
// fetch a file (get the bytes)
if(b_deno){
    a_n_u8 = await Deno.readFile(s_path_file);
}
if(!b_deno){
    a_n_u8 = await f_a_n_u8__from_s_url(s_path_file);
}


```
## get a o_file object
```javascript
let o_file__fits = await f_o_file__fits__from_a_n_u8(
    a_n_u8,
    false //b_strict (some fits have comments exceeding 80characters etc, wich may break the parsing if here is passed 'true')
);

```
## get a canvas with the image data already on it
```javascript
let o_canvas = await f_o_canvas_nonmanipulated__from_o_file__fits(o_file__fits);
// console.log(o_canvas)
// document.body.appendChild(o_canvas)

```
## get a canvas with the autostretched image data
```javascript
f_measure_time('time autostretch')
let o_canvas_autostretched = await f_o_canvas_autostretched__from_o_file__fits(o_file__fits);
// console.log(o_canvas_autostretched)
f_measure_time()


// document.body.appendChild(o_canvas_autostretched)
// console.log(o_file__fits)
// console.log('done')

let a_s_part = s_path_file.split('/').pop().split('.');
let s_name_file_out = [...a_s_part.slice(0,-1), '_done', a_s_part.at(-1), 'png'].join('.')

```
## download as image
```javascript
if(b_deno){
    let o_mod_png = await import('https://deno.land/x/pngs/mod.ts');
    let encode = o_mod_png.encode;
    const png = encode(
        o_canvas_autostretched.getContext('2d').getImageData(
            0,0,
            o_canvas_autostretched.width,
            o_canvas_autostretched.height,
        ).data,
        o_canvas_autostretched.width,
        o_canvas_autostretched.height
    );
    
    
    // console.log(s_name_file_out)
    await Deno.writeFile(s_name_file_out, png);
    // console.log('asdf')
}
if(!b_deno){
    document.body.appendChild(o_canvas)
    document.body.appendChild(o_canvas_autostretched)
    o_canvas_autostretched.toBlob(function(blob) {
        
        const a = document.createElement('a');
        const url = URL.createObjectURL(blob);
    
        a.href = url;
        a.download = s_name_file_out; 
        a.style.display = 'none';
    
        document.body.appendChild(a);
        a.click();
        // Clean up to avoid memory leaks
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 'image/png');
}



```