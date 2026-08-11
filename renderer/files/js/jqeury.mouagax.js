$.MouAjax = async function (params) {
    var Time_Out = (typeof params.Time_Out !== "undefined" && typeof params.Time_Out !== "number") ? params.Time_Out : (30 * 1000);
    if (typeof mouscripts !== "undefined") {
        var args = typeof params.arguments !== "undefined" ? params.arguments : {};
        function_token = makeid(4) + Date.now();
        var this_func_success = params.success;
        if (typeof params.fail !== "undefined") {
            var this_func_fail = params.fail;

        } else {
            var this_func_fail = function (code, msg, args, this_func_name) {
                showToast("حدث خطأ اثناء التحميل");
            }
        }

        what_window["return_success_" + function_token] = function (res, headers, this_func_name) {
            this_func_success(res, headers, this_func_name, args);
        };

        what_window["return_failer_" + function_token] = function (code, msg, args, this_func_name) {
            this_func_fail(code, msg, args, this_func_name);
        };
        req_obj = params;
        delete req_obj.success;
        delete req_obj.fail;

        // req_obj.headers["Cache-Control"] = "no-cache";

        // alert(JSON.stringify(req_obj.headers));

        req_obj["OnSuccess"] = "mou_ajax_success_" + function_token;
        req_obj["OnFailer"] = "mou_ajax_failer_" + function_token;
        what_window["mou_ajax_success_" + function_token] = function (res, fun_name, headers = "") {

            if (res == "Custom_vars") {
                res = convert_byte_to_string(mouscripts.Get_From_Custom_vars(fun_name));
                mouscripts.Remove_Custom_var(fun_name);
            } else {
                res = convert_byte_to_string(res);
            }

            this_function_token = /mou_ajax_success_(.*)/gm.exec(fun_name)[1];
            what_window["return_success_" + this_function_token](res, convert_byte_to_string(headers), fun_name);
            clearTimeout(what_window["time_out_" + this_function_token]);
        }

        what_window["mou_ajax_failer_" + function_token] = function (status_code, fun_name, msg) {
            this_function_token = /mou_ajax_failer_(.*)/gm.exec(fun_name)[1];
            what_window["return_failer_" + this_function_token](status_code, msg, fun_name);
            clearTimeout(what_window["time_out_" + this_function_token]);
        }

        what_window["time_out_" + function_token] = setTimeout(() => {
            what_window["mou_ajax_failer_" + function_token](419, "mou_ajax_failer_" + function_token, "Time Out");
            what_window["mou_ajax_failer_" + function_token] = function () { };
            what_window["mou_ajax_success_" + function_token] = function () { };
        }, Time_Out);


        mouscripts.ajax(JSON.stringify(req_obj));
        return this;
    }
    else if (typeof what_window.electron !== "undefined") {

        console.log(params);
        $.ajax(params);
        // try {
        //     req_obj = params;
        //     data = await what_window.electron.performAjaxRequest(JSON.stringify(req_obj));
        //     headers = data.headers;
        //     body = arrayBufferToString(data.body);
        //     req_obj.success(body, headers);


        // } catch (error) {
        //     console.error('Error:', error);
        // }


    }
    else {
        delete params.headers;
        $.ajax(params);
    }

};
const arrayBufferToString = (arrayBuffer) => {
    const decoder = new TextDecoder('utf-8'); // Specify the encoding if necessary (e.g., 'utf-8')
    return decoder.decode(arrayBuffer);
};