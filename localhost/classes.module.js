class O_byte_offset_property{
    constructor(
        s_name, 
        n_bits, // 1, 2, 3, 4, 5, if type int or float it will get ceiled to multiple of 8
        s_type, // int, float, string
        b_negative,
        value_default,
        b_big_endian = false, 
        f_callback_before_get = ()=>{},
        f_callback_after_set = ()=>{},
        f_callback_after_update_a_n_u8 = (o_file)=>{},
    ){
        
        this.s_name = s_name
        this.n_bits = n_bits
        this.s_type = s_type
        this.b_negative = b_negative
        this.value_default = value_default
        this.b_big_endian = b_big_endian
        this.f_callback_before_get = f_callback_before_get
        this.f_callback_after_set = f_callback_after_set
        this.f_callback_after_update_a_n_u8 = f_callback_after_update_a_n_u8

        this.n_bits = n_bits
        this.n_bytes_ceiled_to_multiple_of_8 = Math.ceil((this.n_bits)/8);
        this.n_bits_ceiled_to_multiple_of_8 = this.n_bytes_ceiled_to_multiple_of_8*8;
        this.s_name = s_name 
        this.s_type = s_type
        this.b_negative = b_negative
        this.value_default = value_default

        this.b_big_endian = b_big_endian

        this.o_dataview_a_nu8 = null
       
        //
        this.o_text_decoder_utf8 = new TextDecoder("utf-8")
        this.o_text_encoder_utf8 = new TextEncoder("utf-8")
    }
    f_value(){
        var s_function_name = `get${this.f_s_dataview_function_suffix()}`;

        if(this.s_type == "string"){
            
            var value = this.o_text_decoder_utf8.decode(this.o_dataview_a_nu8); //version 1 thanks @AapoAlas 
        }
        if(this.s_type != "string"){
            var value = this.o_dataview_a_nu8[s_function_name](0, !this.b_big_endian);
        }

        // console.log("---")
        // console.log("this.s_name")
        // console.log(this.s_name)
        // console.log("this.o_dataview_a_nu8")
        // console.log(this.o_dataview_a_nu8)
        // console.log("value")
        // console.log(value)

        return value;
    }
    f_set_value(value){
        var n_byte_length = this.n_bits_ceiled_to_multiple_of_8/8;

        var s_function_name = `set${this.f_s_dataview_function_suffix()}`;

        if(this.s_type == "string"){
            var a_n_u8 = this.o_text_encoder_utf8.encode(value); //version 1 thanks @AapoAlas 
            if(a_n_u8.byteLength > n_byte_length){
                console.log(`warning: byte length of input string ${value} is bigger than 'n_bits_ceiled_to_multiple_of_8/8' ${this.n_bits_ceiled_to_multiple_of_8}`);
            }
            a_n_u8 = a_n_u8.subarray(0, n_byte_length);
            var n_i = 0; 
            while(n_i < n_byte_length){
                this.o_dataview_a_nu8.setUint8(((!this.b_big_endian) ? (n_byte_length-1)-n_i : n_i), a_n_u8[n_i], !this.b_big_endian);
                n_i+=1;
            }

            //we cannot easily set a string on a dataview so we have to convert it into a number
        }

        if(this.s_type != "string"){
            this.o_dataview_a_nu8[s_function_name](0, value, !this.b_big_endian);
        }


       
    }
    f_s_dataview_function_suffix(){
        //possible function names: getUint8,getUint16,getUint32,getUint64,getInt8,getInt16,getInt32,getFloat32,getFloat64
        if(this.b_negative){
            var s_type_abb = "Float";
            if(this.s_type.toLowerCase().includes("int")){
                s_type_abb = "Int"
            }
        }else{
            var s_type_abb = "Float";
            if(this.s_type.toLowerCase().includes("int")){
                s_type_abb = "int"
                s_type_abb = "U"+s_type_abb;
            }
        }
        return `${s_type_abb}${this.n_bits_ceiled_to_multiple_of_8}`
    }

}

class O_data_unit {
    constructor(
        s_keyword, 
        s_value, 
        s_comment
    ){
        this.s_keyword = s_keyword  
        this.s_value = s_value  
        this.s_comment = s_comment  
    }
}

class O_file__fits{
    constructor(
        s_name = 'file.wav'
    ){
        let o_self = this
        this.s_name = s_name;
        this.a_n_u8 = null;
        this.a_o_data_unit = []
        this.a_n_u8__data_after_header = null;
        this.n_dimensions = null;
        this.n_scl_x = null; 
        this.n_scl_y = null;
        this.n_scl_z = null;
        this.n_scl_w = null;
        this.n_bits_per_pixel = null;
        this.n_index_data_start = null;
        this.n_index_data_end = null;
        this.a_n_u__data_typedarray = null; 
        this.n_bytes_per_datapoint = null;
        this.n_bscale = null;
        this.n_bzero = null;
        this.a_n_f__image_data__normalized = null;
        this.a_n_f__image_data__normalized_minmax = null;
        this.a_n_f__image_data__sorted = null;
        this.a_n_f__image_data__auto_stretched = null;
        this.n_u__max = null;
        this.n_f__max = null;
        this.n_u__min = null;
        this.n_f__min = null;
        this.n_u__range = null;
        this.n_f__range = null;
        this.n_u__sum = null;
        this.n_f__sum = null;
        this.n_u__avg = null;
        this.n_f__avg = null;
        this.n_u__median = null;
        this.n_f__median = null;
        this.n_u__avg_deviation = null;
        this.n_f__avg_deviation = null;
        this.n_u__max_possible = null;
        this.n_f_shadow_clipping_point = null;
        this.n_f_highlights_clipping_point = null;
        this.n_f_midtone_balance = null;
        
    }

}


export {
    O_file__fits, 
    O_data_unit
}