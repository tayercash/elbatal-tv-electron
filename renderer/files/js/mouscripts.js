var is_app_in_dev_mode = true;
var what_window = window;
if (window.frameElement) {
    what_window = window.parent;
}
var elbatal_api = "https://mou.elbatal-app.com/users/";
// var elbatal_api = "http://192.168.1.6/users/";
no_g_icon_img_url = "files/images/no_user.png";

if (typeof what_window.electron !== "undefined") {
    $("html").addClass("electron");
}

function MouEncrypt(plainText, key = '') {

    let result = '';
    for (let i = 0; i < plainText.length; i++) {
        // XOR each character with the corresponding character in the key
        result += String.fromCharCode(
            plainText.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
    }
    let bytes = new TextEncoder().encode(result);
    let base64 = btoa(String.fromCharCode(...bytes));
    // Encode the result in Base64
    return base64;
}
function MouDecrypt(encrypted, key = '') {

    let bytes = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
    let decodedStr = new TextDecoder().decode(bytes);
    encrypted = decodedStr;
    let result = '';
    for (let i = 0; i < encrypted.length; i++) {
        // XOR each character with the corresponding character in the key
        result += String.fromCharCode(
            encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
    }
    return result;
}

$.ajaxSetup({
    beforeSend: async function (xhr, settings) {
        xhr._requestURL = settings.url;
        xhr._settings = settings;

        // if (settings.url.includes("/accounts/accounts.php")) {
        //     // Modify the data object as needed
        //     let dataObj = Object.fromEntries(new URLSearchParams(settings.data));
        //     timestamp = new Date().getTime();
        //     dataObjenc = MouEncrypt(JSON.stringify(dataObj), "ajkhsbcjk#&#&*@@ds" + timestamp);
        //     req_data = {};
        //     req_data["t"] = timestamp;
        //     req_data["d"] = dataObjenc;

        //     settings.data = $.param(req_data);
        // }

        // List of unsafe headers that cannot be set
        const unsafeHeaders = [
            'User-Agent', 'Referer', 'Host', 'Connection', 'Content-Length',
            'Cookie', 'Origin', 'Date',
            'sec-ch-ua', 'sec-ch-ua-mobile', 'sec-ch-ua-platform',
            'Sec-Fetch-Site', 'Sec-Fetch-Mode', 'Sec-Fetch-User', 'Sec-Fetch-Dest'
        ];
        let unsafeHeadersBypass = {};
        // Check if headers are set

        // expected_cookies = await what_window.electron.GetChallengeWindowCookies(xhr._requestURL);
        // if (expected_cookies) {
        //     const cookie = expected_cookies.map(c => `${c.name}=${c.value}`).join('; ');
        //     settings.headers = {};
        //     settings.headers["Cookie"] = cookie;
        // }
        if (settings.headers) {
            // Iterate over each header and filter out the unsafe ones


            if (typeof settings.headers["User-Agent"] == "undefined") {
                settings.headers["User-Agent"] = what_window.Main_USER_AGENT;
            }

            // const currentPlatform = (typeof mouscripts !== "undefined") ? 'android' : 'windows';
            // const modernHeaders = getModernHeaders(currentPlatform);

            // إضافة كل هيدر للطلب
            // Object.keys(modernHeaders).forEach(key => {
                // settings.headers[key] = modernHeaders[key];
            // });

            for (let key in settings.headers) {
                // console.log(key);
                if (settings.headers.hasOwnProperty(key)) {
                    // Skip setting unsafe headers
                    if (!unsafeHeaders.includes(key)) {
                        xhr.setRequestHeader(key, settings.headers[key]);

                    } else {
                        console.warn(`Skipping unsafe header: ${key}`);
                        unsafeHeadersBypass[key] = settings.headers[key];
                        delete settings.headers[key];
                    }
                }
            }
            console.log('unsafeHeadersBypass', unsafeHeadersBypass);
            if (Object.keys(unsafeHeadersBypass).length > 0) {
                // unsafeHeadersBypass["MOuCustomREQUEST"] = "NICE";
                if (typeof mouscripts !== "undefined") {
                    xhr.setRequestHeader("MOuCustomREQUEST", "NICE");
                    if (settings.type.toLowerCase() == "post") {
                        urlParams = new URLSearchParams(settings.data).toString();
                        settings.url = settings.url + "?" + urlParams;
                    }
                }

                what_window.updateHeaders(what_window.mainWindow_contentID, unsafeHeadersBypass);

            }



        }
    },
    statusCode: {
        403: async function (xhr) {
            // console.log("403 Forbidden");
            // console.log("Response Text:", xhr.responseText);

            doc = new DOMParser().parseFromString(xhr.responseText, "text/html");
            error_page_title = $(doc).find("title").text().trim();
            if (error_page_title == "Just a moment...") {


                what_window.bypass_cloud_flare(xhr, function (res) {

                });

            }

        }
    }
});

// $(document).ready(function () {

//     $.ajax({
//         "type": "POST",
//         "url": "https://web2.topcinema.cam//wp-content/themes/movies2023/Ajaxat/Single/Server.php",
//         "data": {
//             id: '110144',
//             i: '0'
//         },
//         "headers": {
//             "x-requested-with": "XMLHttpRequest",
//             "Referer": 'https://web2.topcinema.cam/'
//         },
//         success: function (server_res) {
//             alert(server_res);
//         }
//     });
// })


if (typeof mouscripts !== "undefined") {
    what_window.dev_id = mouscripts.getUniqueDeviceID();
    what_window.dev_name = mouscripts.getUserDeviceName();
    what_window.u_client = "mouscripts";

} else if (typeof what_window.electron !== "undefined") {
    what_window.dev_id = what_window.electron.getMachineId();
    what_window.dev_id = hexToUUID(what_window.dev_id); // Convert the ID
    what_window.dev_name = what_window.electron.GetDeviceName();
    what_window.u_client = "electron";

} else {
    what_window.dev_id = new DeviceUUID().get();
    what_window.dev_name = getDeviceName();
    what_window.u_client = "electron";

}

var user_data = typeof localStorage.getItem("user_data") !== "undefined" ? JSON.parse(localStorage.getItem("user_data")) : false;

if (typeof user_data == "undefined" || user_data == null) {
    window.location.replace("index.html");
} else {
    $(".full_app_loader").remove();
    if (user_data.loged_in_with_email == true) {
        refresh_user_data();
    }
}

function refresh_user_data(data = "") {
    if (valid_aouth_token(data)) {
        var api_link = elbatal_api + "accounts/accounts.php";
        user_data_token = {};
        user_data_token["u_id"] = user_data.user_id;
        user_data_token["dev_id"] = what_window.dev_id;
        user_data_token["dev_name"] = what_window.dev_name;
        user_data_token["u_client"] = what_window.u_client;
        $.ajax({
            url: api_link,
            type: 'POST',
            data: {
                action: "get_user_data",
                token: mou_custom_encode(JSON.stringify(user_data_token))
            },
            success: function (res, textStatus, jqXHR) {
                // data = JSON.parse(MouDecrypt(res["d"], "ajhsbcjkas@#@!!@sc" + res["t"]));
                data = res;
                log_out = false;
                for (var i = 0; i < Object.keys(data.messages).length; i++) {
                    message_code = Object.keys(data.messages)[i];
                    message = data.messages[message_code];
                    if (message_code == 200) {
                        what_window.now_utc_time = parseInt(mou_custom_decode(data.messages["yn06C6E9Bd=="]));
                        if (typeof data.messages.xSQeC6EfwToh !== "undefined") {
                            what_window.xSQeC6EfwToh = parseInt(mou_custom_decode(data.messages.xSQeC6EfwToh));
                        } else {
                            what_window.xSQeC6EfwToh = 0;
                        }
                        window.ATE7C7op = mou_custom_decode(data.messages.ATE7C7op);
                        user_data.username = data.messages["username"];
                        user_data.email = mou_custom_decode(data.messages["AD8szDd="]);
                        user_data.avatar = data.messages["avatar"];
                        user_data.g_icon = data.messages["g_icon"];
                        user_data.is_distributor = data.messages["is_distributor"];
                        user_data.avatar_or_g_icon = data.messages["avatar_or_g_icon"];
                        user_data.role = mou_custom_decode(data.messages["xn0hAJ=="]);

                        if (user_data.is_distributor) {
                            $(".distributor_btn").css("display", "flex");
                        } else {
                            $(".distributor_btn").hide();
                        }

                        if (typeof what_window.xSQeC6EfwToh !== "undefined" && what_window.xSQeC6EfwToh > what_window.now_utc_time) {
                            what_window.zCMJFp1 = true;
                            $(".pro_div").addClass("show");
                            $(".active_with_code_div").hide();
                            $(".code_activation").attr("disabled", "");
                            $("#sub_btn").attr("disabled", "");

                            var xSQeC6EfwToh_date = new Date(window.parent.xSQeC6EfwToh * 1000);
                            var formattedDate = xSQeC6EfwToh_date.getFullYear() + '-' + zeroFill(xSQeC6EfwToh_date.getMonth() + 1, 2) + '-' + zeroFill(xSQeC6EfwToh_date.getDate(), 2);
                            $("#pro_to_date").text(formattedDate);

                            what_window.start_socket();

                            if (typeof active_inter_val !== "undefined") {
                                clearInterval(active_inter_val);
                            }
                            what_window["e_m"] = "false";
                        } else {
                            $(".code_activation").removeAttr("disabled");
                            $("#sub_btn").removeAttr("disabled");

                            if (typeof data.messages["B70pAE0sB6IkwnEuwD49zDd="] !== "undefined") {
                                what_window.valid_active_data(data.messages["B70pAE0sB6IkwnEuwD49zDd="]);
                            }
                        }


                        localStorage.setItem("user_data", JSON.stringify(user_data));
                        if (window.ATE7C7op !== what_window.dev_id) {
                            log_out = true;
                        }

                        init_user_actions();

                    } else if (message_code == 400) {
                        log_out = true;
                    } else if (message_code == 401) {
                        logout_for_code();
                    }
                }
                // if (typeof window.xSQeC6EfwToh !== "undefined" && window.xSQeC6EfwToh > window.now_utc_time) {
                // } 
                if (log_out == true) {
                    logout_from_elbatal();
                } else {
                    $("#user_name").text(user_data.username);
                    if (user_data.g_icon == "") {
                        user_data.g_icon = no_g_icon_img_url;
                    }
                    if (what_window.ref_log_me_interval == undefined) {
                        what_window.ref_log_me_interval = setInterval(ref_log_me, 10 * 1000);
                    }
                }
            }, error: function (jqXHR, error, errorThrown) {
                // alert(jqXHR.responseText);
                // return;
                // can_use_login_with_google = true;
                // handel_server_error(jqXHR, error, errorThrown);
                window.location.replace("index.html");
            }
        });
    } else {
        window.location.replace("index.html");
    }
}
function valid_aouth_token(data) {
    if (typeof mouscripts == "undefined") {
        return true;
    }
    return mouscripts.validAauthToken(data);
}
// mouscripts.change_custom_var("e_v_m", e_v_m);

// mouscripts.change_ima_ads_string("https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=");

if (typeof mouscripts !== "undefined") {
    // mouscripts.subscribeNotificationsTopic("aflam");
    // mouscripts.UnsubscribeNotificationsTopic("aflam");
}

function subscriped_to_notification_topic(status, topic) {
    if (status == true) {
        status_text = "تم الاشتراك في اشعارات " + topic;
    } else {
        status_text = "حدث خطأ اثناء الاشتراك في اشعارات " + topic;
    }
    // mouscripts.showToast(status_text);
}
function unsubscriped_to_notification_topic(status, topic) {
    if (status == true) {
        status_text = "تم الغاء الاشتراك في اشعارات " + topic;
    } else {
        status_text = "حدث خطأ اثناء الغاء الاشتراك في اشعارات " + topic;
    }
    // mouscripts.showToast(status_text);
}



function get_html_from_hide_html_fun(enc_html) {
    enc_html = enc_html.replace(/[\r\n]/gm, '');
    full_enc_js = /<script.*>(.*)<\/script>/gm.exec(enc_html)[1].replace(/;document.*/gm, "");
    adilbo_HTML_encoder_var = "adilbo_HTML_encoder_" + /var.adilbo_HTML_encoder_(.*?).=/gm.exec(full_enc_js)[1];
    hide_my_HTML_var = "hide_my_HTML_" + /var.hide_my_HTML_(.*?).=/gm.exec(full_enc_js)[1];
    eval(`${full_enc_js}
    window["decoded_html"] = decodeURIComponent(escape(${adilbo_HTML_encoder_var}));`);
    return decoded_html;
}


var lazyloadThrottleTimeout;
function lazyload() {
    var lazyloadImages = $('.lazy_poster_img:not(.LazyLoaded)');
    if (lazyloadThrottleTimeout) {
        clearTimeout(lazyloadThrottleTimeout);
    }

    lazyloadThrottleTimeout = setTimeout(function () {
        var scrollTop = window.scrollY;
        $('.lazy_poster_img:not(.LazyLoaded)').each(function () {
            if ($(this).offset().top < (window.innerHeight + scrollTop + 1000)) {
                $(this).attr(`style`, `background:url(${$(this).attr("data-poster_img")}) no-repeat center center;background-size: cover`);
                $(this).removeClass('lazy_poster_img');
                $(this).addClass('LazyLoaded');

                $('<img>').attr('src', $(this).attr("data-poster_img")).on('error', () => {
                    $(this).attr(`style`, `background:url('files/images/logo.png') no-repeat center center;background-size: contain`);
                });
            }

        });
        // if (lazyloadImages.length == 0) {
        //     document.removeEventListener("scroll", lazyload);
        //     window.removeEventListener("resize", lazyload);
        //     window.removeEventListener("orientationChange", lazyload);
        // }
    }, 20);
}

function is_elment_in_view_port(elm, top = 0, bottom = 0, left = 0, right = 0) {

    stop_for_unvisable = false;
    $(elm).parents().each(function () {
        if ($(this).css("display") == "none") {
            stop_for_unvisable = true;
        }
    });

    if (stop_for_unvisable == true) {
        return false;
    }

    bounding = document.querySelector(elm).getBoundingClientRect();
    if (
        bounding.top >= top &&
        bounding.left >= left &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth) + right &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) + bottom
    ) {
        return true;
    } else {
        return false;
    }
}

const isValidUrl = urlString => {
    try {
        return Boolean(new URL(urlString));
    }
    catch (e) {
        return false;
    }
}
$(".edit_channel_btn").click(function () {
    this_ch_id = $(this).attr("data-edit_ch_id");
    edit_link = "https://player.elbatal-app.com/p/editor.html?action=edit&post_id=" + this_ch_id;
    if (typeof mouscripts !== "undefined") {
        mouscripts.open_external_link(edit_link);
    } else {
        window.open(edit_link);
    }
})

function get_month_name(month_num, lang = "ar") {
    monthes = [
        {
            "ar": "يناير",
            "en": "January"
        },
        {
            "ar": "فبراير",
            "en": "February"
        },
        {
            "ar": "مارس",
            "en": "March"
        },
        {
            "ar": "ابريل",
            "en": "April"
        },
        {
            "ar": "مايو",
            "en": "May"
        },
        {
            "ar": "يونيو",
            "en": "June"
        },
        {
            "ar": "يوليو",
            "en": "July"
        },
        {
            "ar": "أغسطس",
            "en": "August"
        },
        {
            "ar": "سبتمبر",
            "en": "September"
        },
        {
            "ar": "اكتوبر",
            "en": "October"
        },
        {
            "ar": "نوفمبر",
            "en": "November"
        },
        {
            "ar": "ديسمبر",
            "en": "December"
        },
    ]
    return monthes[month_num - 1][lang];
}

function get_ch_sources_from_blogger(ch_name, ch_id = false) {
    $(".ch_searching_for").text(ch_name);
    ch_name_search_key = ch_name + "---" + ch_name.length;
    $("#res_ch_search").html(`<span><i class="fas fa-circle-notch fa-spin fa-lg"></i> جاري البحث عن مصادر قناة ${ch_name}</span>`)
    // $("#ch_ad_tag").html(get_ad_iframe());
    $("#ch_search").openpopup();

    what_window.back_buttons_functions.Unshift(function () {
        $("#ch_search").closepopup();
    });
    if (ch_id !== false) {
        get_url = `https://www.blogger.com/feeds/4509831944672887969/posts/default/${ch_id}?alt=json`;
    } else {
        get_url = `https://www.blogger.com/feeds/4509831944672887969/posts/default?q="${ch_name_search_key}"&alt=json&orderby=published&start-index=1&max-results=9999`;
    }

    $.ajax({
        "type": "GET",
        "url": get_url,
        "headers": {
            "user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36"
        },
        success: function (res) {
            blogger_res = res;
            // if (typeof mouscripts !== "undefined") {
            //     blogger_res = JSON.parse(res);
            // } else {
            //     blogger_res = res;
            // }

            if (typeof blogger_res.feed !== "undefined" && typeof blogger_res.feed.entry !== "undefined" && blogger_res.feed.entry.length > 0) {
                for (i = 0; i < blogger_res.feed.entry.length; i++) {

                    post_contnet = blogger_res.feed.entry[i].content["$t"];
                    player_json = $("<div>" + post_contnet + "</div>").find("player_json");

                    if (typeof user_data !== "undefined") {
                        if (user_data.role !== null && user_data.role.includes("2")) {
                            // ch_id = blogger_res.feed.entry.id["$t"];
                            entry_id = blogger_res.feed.entry[i].id["$t"];
                            if (/\.post-(.*)/gm.test(entry_id)) {
                                ch_id = /\.post-(.*)/gm.exec(entry_id)[1];
                                $(".edit_channel_btn").attr("data-edit_ch_id", ch_id).show();
                            }
                        }
                    }

                    for (l = 0; l < blogger_res.feed.entry[i].link.length; l++) {
                        if (blogger_res.feed.entry[i].link[l].rel == "alternate") {
                            player_page_url = blogger_res.feed.entry[i].link[l].href;
                            break;
                        }
                    }

                }

            } else if (blogger_res.entry !== "undefined") {

                if (typeof user_data !== "undefined") {
                    if (user_data.role !== null && user_data.role.includes("2")) {
                        entry_id = blogger_res.entry.id["$t"];
                        ch_id = /\.post-(.*)/gm.exec(entry_id)[1];
                        $(".edit_channel_btn").attr("data-edit_ch_id", ch_id).show();
                    }
                }
                post_contnet = blogger_res.entry.content["$t"];
                player_json = $("<div>" + post_contnet + "</div>").find("player_json");

            } else {
                $("#res_ch_search").html(`لا يوجد مصادر متوفرة لهذه القناة حتي الان`);
                player_json = false;
            }

            if (player_json !== false) {
                sources = JSON.parse(mou_custom_decode(player_json.html()))["sources"];

                filterd_sources = sources.filter(function (element) {
                    return element.working;
                });
                if (filterd_sources.length > 0) {

                    $("#res_ch_search").html("");
                    for (s = 0; s < filterd_sources.length; s++) {

                        source = filterd_sources[s];

                        source_name = source.name == "" ? "مصدر " + (s + 1) : source.name;
                        source.name = ch_name + " - " + source_name;

                        $("#res_ch_search").append(`<span class="mou_btn" onclick="custom_play_vid(this,'${mou_custom_encode(JSON.stringify(source))}','#ch_search')"><i class="fas fa-play"></i> ${source_name}</span>`);

                    }
                } else {
                    $("#res_ch_search").html(`لا يوجد مصادر متوفرة لهذه القناة حتي الان`);
                }
            }

        }
    });



}

async function custom_play_vid(this_btn, encoded_json) {
    this_btn = $(this_btn);

    if ($(this_btn).hasClass("loading_data") !== true) {
        $(this_btn).addClass("loading_data").prepend(`<i class="fas fa-circle-notch fa-spin fa-lg loading_icon">  `);
    }

    source = JSON.parse(mou_custom_decode(encoded_json));
    source_link = source.link;
    source_name = source.name == "" ? "مصدر " + (s + 1) : source.name;
    sourc_type = source.type;
    vid_headers = {};
    user_agent = "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36";


    if (typeof source.file_gets_data !== "undefined" && source.file_gets_data.length > 0) {

        for (a = 0; a < source.file_gets_data.length; a++) {
            source_action = source.file_gets_data[a];


            if ((typeof source_action.regex !== "undefined" && source_action.regex !== "") || (typeof source_action.function !== "undefined" && source_action.function !== "")) {

                action_headers = typeof source_action.custom_headers !== "undefined" ? source_action.custom_headers : {};
                if (typeof source_action.type_of_select !== "undefined" && source_action.type_of_select == "regex") {

                    regex = mou_custom_decode(source_action.regex);
                    re_matches = /\/(.*)\/(.*)/g.exec(regex);
                    re_string = re_matches[1];
                    re_letters = re_matches[2];
                    re = new RegExp(re_string, re_letters);
                    await new Promise((resolve, reject) => {
                        // $.MouAjax({
                        //     url: source_link,
                        //     headers: action_headers,
                        //     success: function (res) {
                        //         source_link = re.exec(res)[1];
                        //         resolve();
                        //     }
                        // })

                        $.ajax({
                            type: "GET",
                            url: source_link,
                            headers: action_headers,
                            success: function (res, textStatus, jqXHR) {
                                source_link = re.exec(res)[1];
                                resolve();
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                // Inline error handling
                                console.error('Error occurred:', textStatus, errorThrown);
                            }
                        });
                    })

                } else if (typeof source_action.type_of_select !== "undefined" && source_action.type_of_select == "function") {
                    await new Promise((resolve, reject) => {

                        if (source_link == "function") {
                            var this_function_text = mou_custom_decode(source_action.function);
                            new_function_name = "mou_func_" + Date.now();
                            script = $(`<script data-id='${new_function_name}'>`);
                            $(script).text(`function ${new_function_name} (callback){${this_function_text}}`);
                            $("body").append(script);

                            window[new_function_name](function (ret_url) {
                                source_link = ret_url;
                                $(`script[data-id='${new_function_name}']`).remove();
                                resolve();
                            });
                        } else {
                            // $.MouAjax({
                            //     url: source_link,
                            //     headers: action_headers,
                            //     success: function (res) {
                            //         var this_function_text = mou_custom_decode(source_action.function);

                            //         new_function_name = "mou_func_" + Date.now();
                            //         script = $(`<script data-id='${new_function_name}'>`);
                            //         $(script).text(`function ${new_function_name} (page_res){${this_function_text}}`);
                            //         $("body").append(script);

                            //         source_link = window[new_function_name](res);

                            //         $(`script[data-id='${new_function_name}']`).remove();


                            //         resolve();

                            //     }
                            // })
                            $.ajax({
                                type: "GET",
                                url: source_link,
                                headers: action_headers,
                                success: function (res, textStatus, jqXHR) {
                                    var this_function_text = mou_custom_decode(source_action.function);

                                    new_function_name = "mou_func_" + Date.now();
                                    script = $(`<script data-id='${new_function_name}'>`);
                                    $(script).text(`function ${new_function_name} (page_res){${this_function_text}}`);
                                    $("body").append(script);
                                    source_link = window[new_function_name](res);
                                    $(`script[data-id='${new_function_name}']`).remove();
                                    resolve();
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    // Inline error handling
                                    console.error('Error occurred:', textStatus, errorThrown);
                                }
                            });
                        }

                    })

                }




            }
        }

        if (typeof source.file_gets_data[source.file_gets_data.length - 1] !== "undefined" && typeof source.file_gets_data[source.file_gets_data.length - 1].custom_headers !== "undefined") {
            vid_headers = source.file_gets_data[source.file_gets_data.length - 1].custom_headers;
        }

    }

    for (i = 0; i < Object.keys(vid_headers).length; i++) {
        if (["User-agent", "user-agent", "useragent"].includes(Object.keys(vid_headers)[i])) {
            user_agent = vid_headers[Object.keys(vid_headers)[i]];
            delete vid_headers[Object.keys(vid_headers)[i]];
        }

    }
    $(this_btn).removeClass("loading_data").find(".loading_icon").remove();

    if (source_link !== "" && typeof mouscripts !== "undefined") {
        play_vid(source_link, source_name, user_agent, JSON.stringify(vid_headers));

    }

}


// $.ajax({
//     "type": "GET",
//     "url": "https://vk.com/video_ext.php?oid=566755643&id=456239041&hd=2",
//     success: function (res) {
//         hls_url = /hls":"(.*?)"/m.exec(res)[1].replace(/\\(.)/mg, "$1");
//         // console.log("hls_url => " + hls_url + "\n" + "mouscripts.get_vk_src() => " + mouscripts.get_vk_src());
//     }
// });
// mouscripts.open_external_link(mouscripts.get_vk_src());

// get_ip(function (user_ip) {

// })
function get_ip(callback) {
    $.ajax({
        "type": "GET",
        "url": "https://www.cloudflare.com/cdn-cgi/trace",
        success: function (res) {
            ip = /ip=(.*)/gm.exec(res)[1].trim();
            callback(ip);
        }
    });
}

// alert(mouscripts.getUniqueDeviceID());

function get_ad_iframe(type = 1) {
    return "";
    if (type = 1) {

    }
    return `<iframe src="https://www.elbatal-app.com/p/ads-for-elbatal-app.html" class="mou_frame"></iframe>`;
}
const isOnlineUrl = urlString => {
    if (urlString.includes("https://") || urlString.includes("http://")) {

        try {
            return Boolean(new URL(urlString));
        }
        catch (e) {
            return false;
        }
    } else {
        return false;

    }

}
function zeroFill(number, width) {
    width -= number.toString().length;
    if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number + ""; // always return a string
}

function logout_from_elbatal() {
    localStorage.removeItem("user_data");
    if (typeof mouscripts !== "undefined") {
        mouscripts.logout_with_google();
    }
    if (typeof what_window.electron !== "undefined") {
        what_window.ipcRenderer.send('log_out');
    }
    window.location.href = "index.html";
}
function logout_for_code() {
    window.location.href = "index.html?action=code";
}
function get_url_extension(url) {
    return url.split(/[#?]/)[0].split('.').pop().trim();
}
function resize_blogger_img(url, width = 500) {
    if (/\/(s[0-9]+.*)\//gm.test(url)) {
        return url.replace(/\/(s[0-9]+.*)\//gm, "/s" + width + "/");
    }
    return url;
}

function fix_Res_headers(headersString) {
    headers = headersString.split("%n");
    headers_obj = {};
    for (i = 0; i < headers.length; i++) {
        headerline = headers[i];
        KeyValue = headerline.split(":");
        headers_obj[KeyValue[0]] = KeyValue[1];
    }
    return headers_obj;
}
function getDeviceName() {
    let device = "Unknown";
    const ua = {
        "Generic Linux": /Linux/i,
        "Android": /Android/i,
        "BlackBerry": /BlackBerry/i,
        "Bluebird": /EF500/i,
        "Chrome OS": /CrOS/i,
        "Datalogic": /DL-AXIS/i,
        "Honeywell": /CT50/i,
        "iPad": /iPad/i,
        "iPhone": /iPhone/i,
        "iPod": /iPod/i,
        "macOS": /Macintosh/i,
        "Windows": /IEMobile|Windows/i,
        "Zebra": /TC70|TC55/i,
    }
    Object.keys(ua).map(v => navigator.userAgent.match(ua[v]) && (device = v));
    return device;
}
function validateEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

$(document).on("click", ".close_iframe_btn", function () {
    iframe_id = $(this).attr("data-close_id");
    if (window.parent) {
        window.parent.focus();
    }
    what_window.back_button_clicked();

})
$(document).on("click", ".close_video_btn", function () {
    if (window.parent) {
        window.parent.focus();

    }
    what_window.back_button_clicked();

});

function hexToUUID(hex) {
    // Ensure the string is long enough
    if (hex.length < 32) {
        throw new Error('Hex string is too short to be converted to UUID');
    }

    // Extract the first 32 characters
    let shortHex = hex.substring(0, 32);

    // Format into UUID: 8-4-4-4-12
    return `${shortHex.substring(0, 8)}-${shortHex.substring(8, 12)}-${shortHex.substring(12, 16)}-${shortHex.substring(16, 20)}-${shortHex.substring(20)}`;
}


function extractYouTubeVideoId(url) {
    if (typeof url !== 'string') return null;

    const pattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(pattern);
    return match ? match[1] : null;
}

function isYouTubeVideoLink(url) {
    return extractYouTubeVideoId(url) !== null;
}


// console.log(deobfuscator.deobfuscate(obfuscated));


function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}