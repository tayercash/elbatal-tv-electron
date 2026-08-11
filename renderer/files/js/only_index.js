$(document).ready(async function () {

    if (typeof what_window.electron !== "undefined") {
        // yt_data = await what_window.electron.getYoutubeVideo("https://www.youtube.com/watch?v=VD6yLhfy6LU");

        // console.log(yt_data);


        // play_vid('https://www.youtube.com/watch?v=HaEgtJfqboE', "تجربة فيديو يوتيوب");
        // play_vid('http://192.168.1.2/film.mp4', "تجربة فيديو مباشر", `mou_user_agent`, `{"Referer":"mou_referrer"}`, 'test_code', true);
    }

    // play_vid("https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.mpd", "TEST", "", `{}`, "", false, what_window.settings_vars.watching_apk, false, "", "", "clearkey", JSON.stringify({ "keys": [{ "kty": "oct", "kid": "MDAwMDAwMDAwMDAwMDAwMA", "k": "MDAwMDAwMDAwMDAwMDAwMA" }], "type": "temporary" })
    //     , "localWebPlayer"
    // );
    // play_vid('http://192.168.1.13/film.mp4', "تجربة فيديو مباشر", `mou_user_agent`, `{"Referer":"mou_referrer"}`, 'test_code', true);
})



// $(document).ready(function () {
//     mou_channels_servers["yacin"].play_src(mou_custom_encode(`{"name":"SSC Extra 1","url":"https://ssc-extra-1-enc.edgenextcdn.net/out/v1/647c58693f1d46af92bd7e69f17912cb/index.mpd","headers":"QGEXQGEV","drm":"ecbc9e6fe6b145efb6658fb5cf7427f8:03c17e28911f71221acbc0b11f900401"}`), function () {
//         // $(this_btn).find("i").remove();
//         // $(this_btn).removeClass("loading_data").prepend(`<i class="fas fa-play"></i>`);
//     });
// })

// play_vid("https://ssc-1-enc.edgenextcdn.net/out/v1/c696e4819b55414388a1a487e8a45ca1/index.mpd", "TEST", "", `{}`, "", false, window.parent.settings_vars.watching_apk, false, "", "", "clearkey", "5c672f6b85a94638872d0214f7806ed4:bf8756fbb866ee2d5c701c2289dd8de3", "localWebPlayer")
window.mainWindow_contentID = null;
// .Youtube_Extractor("https://www.youtube.com/watch?v=Lg5vxOotePU");
// play_vid('http://192.168.1.2/api/videoserver/video.m3u8', "تجربة فيديو مباشر", `mou_user_agent`, `{"Referer":"mou_referrer"}`);
// alert(`window.screen.availHeight => ${window.screen.availHeight} \n window.screen.availWidth => ${window.screen.availWidth}`);
// auto subscripe to notification topics
if (typeof mouscripts !== "undefined") {

    // what_window.open_active_player();

    // vid_url = "http://192.168.1.2:3000/video.mp4";
    // mouscripts.play_vid(vid_url, "كيفية احضار كود التفعيل لتطبيق Elbatal TV", "", "{}", true, false, "", "Elbatal", false);


    // encoded = mouscripts.mou_encrypt("string Will Encoded");

    // decoded = mouscripts.mou_decrypt(encoded);

    // alert(decoded);

}

what_window.Main_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";

var back_buttons_functions = [];
var close_app_now = false;
function back_button_clicked(index = false) {
    if (index == true) {

    } else {

        now_active_panal = $(".navigation ul li.list.active").index();

        if (typeof what_window["back_buttons_functions_" + now_active_panal] !== "undefined" && what_window["back_buttons_functions_" + now_active_panal].length > 0) {
            if (typeof what_window["back_buttons_functions_" + now_active_panal][0] == "function") {
                what_window["back_buttons_functions_" + now_active_panal][0]();
            }
            what_window["back_buttons_functions_" + now_active_panal].shift();
        } else {

            if (close_app_now == true) {
                if (typeof mouscripts !== "undefined") {
                    mouscripts.exit_app();
                } else if (typeof what_window.electron !== "undefined") {
                    what_window.ipcRenderer.send('quit-app');
                }
            } else {
                Toastify({
                    text: "اضغط  مجددا للخروج من التطبيق .",
                    duration: 2000,
                    newWindow: true,
                    close: false,
                    gravity: "bottom", // `top` or `bottom`
                    position: "center",
                    backgroundColor: "linear-gradient(-45deg, #ff0000, #c70000)",
                    offset: {
                        y: 100
                    },
                }).showToast();

                close_app_now = true;
                close_app_now_time_out = setTimeout(function () {
                    close_app_now = false;
                }, 1000 * 2);
            }

        }
    }
}
Array.prototype.Unshift = function (val) {
    now_active_panal = $(what_window.document).find(".navigation ul li.list.active").index();
    if (typeof what_window["back_buttons_functions_" + what_window.now_active_panal] == "undefined") {
        what_window["back_buttons_functions_" + what_window.now_active_panal] = [];
    }
    what_window["back_buttons_functions_" + what_window.now_active_panal].unshift(val);
    // this.unshift(val);
}
now_date = new Date();
var now_utc_time = Math.floor((new Date()).getTime() / 1000);
setInterval(function () {
    window.now_utc_time = window.now_utc_time + 1;
}, 1000);


if (typeof mouscripts !== "undefined") {
    for (i = 0; i < Object.keys(settings_vars.notify_data).length; i++) {
        notify_key = Object.keys(settings_vars.notify_data)[i];
        notify_val = settings_vars.notify_data[notify_key];
        if (notify_val == true) {
            mouscripts.subscribeNotificationsTopic(notify_key);
        }
    }
}

var e_m = "true";
var e_f_v_m = "false"; // my custom ad
var e_v_m = "true";
var f_v_m = "true";
var enable_move_mouscripts = "true";
if (typeof mouscripts !== "undefined") {
    mouscripts.change_custom_var("a_i_a", "ca-app-pub-1789959428115714/5652324572");
    mouscripts.change_custom_var("u_i_a", "video");
    mouscripts.change_custom_var("u_r_a", "Rewarded_Android");
    mouscripts.change_custom_var("e_m", e_m);
    mouscripts.change_custom_var("e_f_v_m", e_f_v_m);
    mouscripts.change_custom_var("e_v_m", e_v_m);
    mouscripts.change_custom_var("f_v_m", f_v_m);
    mouscripts.change_custom_var("AD_TAG_URI", "https://mou.elbatal-app.com/users/video/dev_video_loader.php");

}
var loader_test = false;
var u_ad_ready = false;
function unity_ads_loaded() {
    u_ad_ready = true;
    // if (loader_test == false) {

    //     Show_Unity_Interstitial(function () {
    //         loader_test = true;
    //     });
    // }
}
var first_unity_check = false;
function unity_Interstitial_end(status, msg) {
    valid_user = true;
    u_ad_ready = false;
    ancontinue = true;
    if (status == false) {
        if (msg !== "NO_FILL" && msg !== "NOT_READY") {
            $(".loading_ad_msg").hide();
            $(".ad_load_error").show();
        }

        ancontinue = false;

        if (msg == "NOT_READY") {
            mouscripts.load_Unity_Ads();

            // window["on_refresh_ads"] = function () {
            // }
        } else if (msg == "NO_FILL") {
            ancontinue = true;
            $("#ad_loading").closepopup();
        } else {

            window["on_refresh_ads"] = function () {
                mouscripts.initialize_Unity_Ads();
            }
        }

    }
    if (ancontinue == true) {
        first_unity_check = true;
        what_window["on_unity_Interstitial_end"](status);
    }


}
function refresh_ads() {
    $(".loading_ad_msg").show();
    $(".ad_load_error").hide();
    window["on_refresh_ads"]();
}
function Show_Unity_Interstitial(callback = false) {
    what_window = window;
    if (window.parent) {
        what_window = window.parent;
    }
    if (typeof mouscripts !== "undefined") {
        mouscripts.Show_Unity_Interstitial();
        if (u_ad_ready == false) {
            $("#ad_loading").openpopup();
            $("#ad_loading").on_closepopup(function () {
                clearInterval(u_ad_ready_interval);
            });
            u_ad_ready_interval = setInterval(function () {
                if (u_ad_ready) {
                    mouscripts.Show_Unity_Interstitial();
                    $("#ad_loading").closepopup();
                    clearInterval(u_ad_ready_interval);
                }
            }, 100);
        }
    } else {
        // alert("show Unity");
    }
    if (callback !== false) {
        what_window["on_unity_Interstitial_end"] = callback;
        if (typeof mouscripts == "undefined") {
            callback();
        }
    } else {
        what_window["on_unity_Interstitial_end"] = function () {

        };
    }

}
var now_interstitial_trys = 0;
function Show_magic(callback) {
    if (typeof what_window.electron !== "undefined") {
        callback();
        return;
    }
    if (e_m == "false") {
        callback();
        return false;
    } else {
        if (enable_move_mouscripts == "false") {
            callback();
            return false;
        }
    }
    localStorage.setItem("now_interstitial_trys", now_interstitial_trys);
    if (now_interstitial_trys % 3 == 0 || now_interstitial_trys == 0 || first_unity_check == false) {
        Show_Unity_Interstitial(callback);
    } else {
        callback();
    }
    now_interstitial_trys = now_interstitial_trys + 1;
}
what_window["backup_e_m"] = what_window["e_m"];
function valid_active_data(data) {
    data = parseInt(mou_custom_decode(data));
    an_id = makeid(10);
    window[an_id] = data;
    active_interval_function(an_id);
    if (typeof active_inter_val !== "undefined") {
        clearInterval(active_inter_val);
    }
    if (data > now_utc_time) {
        active_inter_val = setInterval(function () {
            active_interval_function(an_id);
        }, 1000);
    }
}
function active_interval_function(an_id) {

    if (window[an_id] > window.now_utc_time) {
        $(".active_with_code_div").show();
        $(".code_activation").hide();
        what_window["e_m"] = "false";

        distance = (window[an_id] - window.now_utc_time) * 1000;
        timers_days = Math.floor(distance / (1000 * 60 * 60 * 24));
        timers_hours = zeroFill(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), 2);
        timers_minutes = zeroFill(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)), 2);
        timers_seconds = zeroFill(Math.floor((distance % (1000 * 60)) / 1000), 2);

        timers_days = timers_days > 0 ? timers_days + "d : " : "";

        countdown = timers_days + timers_hours + "h : " + timers_minutes + "m : " + timers_seconds + "s";

        $("#active_with_code_until").text(countdown);
    } else {
        what_window["e_m"] = what_window["backup_e_m"];
        $(".active_with_code_div").hide();
        $(".code_activation").show();
        $(".profile_data .code_activation").css("display", "flex");
        if (typeof active_inter_val !== "undefined") {
            clearInterval(active_inter_val);
        }
    }
}
// code activation
$(".code_activation").click(function () {
    if ($(this).attr('disabled')) return false;;
    $(".sidenav").hide_side_nav();
    $("#code_activation_popup").openpopup();
});
// code

otpInputs = $("#user_code input");
$("#user_code input").each(function (i, input) {
    input.addEventListener('keypress', handlekeypress);
    input.addEventListener('input', handleInput);
    input.addEventListener('keydown', handleBackspace);
    input.addEventListener('paste', handlePaste); // Add event listener for paste
});
$("#user_code input").on("focus", function (e) {
    foucsed_input = $(this);
    $("#user_code input").each(function (index, input) {
        if ($(this).val().length == 0) {
            if ($(foucsed_input)[0] == $(this)[0]) {
                return false;
            } else {
                $(this).focus();
                return false;
            }
        }
    })
});
function handlekeypress(e) {
    const input = e.target;
    const regex = new RegExp(/[^0-9]/, 'g');
    if (e.key.match(regex) !== null) {
        e.preventDefault();
        return false;
    } else {
        if (input.value.length == 1) {
            e.preventDefault();
            $(input).val(e.key);
            if ($(input).is(':last-child')) {
                $("#active_with_code").click();
            } else {
                input.nextElementSibling.focus();
            }
        }
    }
}
// Function to focus next input field when a character is entered
function handleInput(e) {
    const input = e.target;
    if (input.value.length > 0 && input.value) {
        if ($(input).is(':last-child')) {
            $("#active_with_code").click();
        } else {
            input.nextElementSibling.focus();
        }

    }
}
// Function to focus previous input field when backspace is pressed
function handleBackspace(e) {
    const input = e.target;
    if (e.which === 38) {
        e.preventDefault();
    } else if (e.which === 40) {
        e.preventDefault();
        $("#get_my_activation_code").focus();
    } else if (e.key === 'Backspace' && input.previousElementSibling) {
        if ($(input).is(':last-child') && $(input).val() !== "") {
            $(input).val("");
        } else {
            $(input.previousElementSibling).val("");
            input.previousElementSibling.focus();
        }
    } else if (e.key === 'Enter' && $(input).is(':last-child')) {
        $("#active_with_code").click();
    }
}

function handlePaste(e) {
    e.preventDefault(); // Prevent the default paste action
    const pastedText = e.clipboardData.getData('text/plain').trim(); // Get pasted text
    if (pastedText.length === otpInputs.length) {
        $("#user_code input").each(function (index, input) {
            $(input).val(pastedText[index]); // Assign each digit to respective input
        });
        $("#active_with_code").click();
    }
}

$("#get_my_activation_code").click(function () {
    create_url = "https://www.elbatal-app.com/?getCode=" + user_data.user_id;
    if (typeof mouscripts !== "undefined") {
        mouscripts.open_external_link(create_url);
    } else {
        window.open(create_url);
    }
});
$("#how_to_get_code").click(function () {
    vid_url = "https://s01.babup.com/uploads/Get-Code-Elbatal.mp4";
    play_vid(vid_url, "كيفية احضار كود التفعيل لتطبيق Elbatal TV", "", "{}", false, false);
});
$("#paste_active_code").click(function () {
    if (typeof mouscripts !== "undefined") {
        code_will_paste = mouscripts.get_data_from_clipboard();
        paste_code(code_will_paste);
    } else {
        setTimeout(async () => {
            const code_will_paste = await navigator.clipboard.readText();
            paste_code(code_will_paste);

        }, 0);
    }

})
function paste_code(pastedText) {
    otpInputs = $("#user_code input");
    if (pastedText.length === otpInputs.length) {
        $("#user_code input").each(function (index, input) {
            $(input).val(pastedText[index]); // Assign each digit to respective input
        });
        $("#active_with_code").click();
    }
}

can_submit_code = true;
$("#active_with_code").click(function () {

    user_code = "";
    $("#user_code input").each(function () {
        user_code += $(this).val();
    });

    if (can_submit_code == true) {
        if (user_code.length == 0) {
            Toastify({
                text: "ادخل كود التفعيل !",
                duration: 3000,
                newWindow: true,
                close: false,
                gravity: "bottom", // `top` or `bottom`
                positionLeft: false, // `true` or `false`
                backgroundColor: "linear-gradient(-45deg, #ff0000, #c70000)",
            }).showToast();
            return false;
        } else if (user_code.length !== 6) {
            Toastify({
                text: "يجب ان يكون الكود 6 ارقام",
                duration: 3000,
                newWindow: true,
                close: false,
                gravity: "bottom", // `top` or `bottom`
                positionLeft: false, // `true` or `false`
                backgroundColor: "linear-gradient(-45deg, #ff0000, #c70000)",
            }).showToast();
            // alert("يجب ان يكون الكود 6 ارقام");
            return false;
        }
        can_submit_code = false;
        $("#active_with_code").html(`<i class="fas fa-circle-notch fa-spin"></i> جاري التحقق من الكود`)
        code_token = {};
        code_token["user_id"] = user_data.user_id;
        code_token["code"] = user_code;
        code_token = mou_custom_encode(JSON.stringify(code_token));
        $.ajax({
            url: elbatal_api + "/accounts/code_1.php",
            type: 'POST',
            timeout: 30 * 1000,
            data: {
                action: "validate_code",
                token: code_token
            },
            success: function (data) {
                can_submit_code = true;
                $("#active_with_code").html(`تفعيل`);
                // console.log(JSON.stringify(data));
                for (var i = 0; i < Object.keys(data.messages).length; i++) {
                    message_code = Object.keys(data.messages)[i];
                    message = data.messages[message_code];
                    if (data.status == true) {
                        if (message_code == 200) {
                            Toastify({
                                text: "نجح تفعيل حسابك",
                                duration: 1500,
                                newWindow: true,
                                close: false,
                                gravity: "bottom", // `top` or `bottom`
                                positionLeft: false, // `true` or `false`
                                backgroundColor: "#198754",
                            }).showToast();
                            $("#code_activation_popup").closepopup();
                            if (typeof data.messages["B70pAE0sB6IkwnEuwD49zDd="] !== "undefined") {
                                what_window.valid_active_data(data.messages["B70pAE0sB6IkwnEuwD49zDd="]);
                            }
                            if (typeof data.messages["yn06C6E9Bd=="] !== "undefined") {
                                what_window.now_utc_time = parseInt(mou_custom_decode(data.messages["yn06C6E9Bd=="]));
                            }

                        }
                    } else {

                        if (message_code == 400) {
                            console.log(message);
                            $("#user_code input").val("");
                            $("#user_code input").eq(0).focus();
                            Toastify({
                                text: "كود خطأ !",
                                duration: 2000,
                                newWindow: true,
                                close: false,
                                gravity: "bottom", // `top` or `bottom`
                                positionLeft: false, // `true` or `false`
                                backgroundColor: "linear-gradient(-45deg, #ff0000, #c70000)",
                            }).showToast();
                        }
                    }

                }

            }, error: function (jqXHR, error, errorThrown) {
                can_submit_code = true;

                // alert(jqXHR.responseText);

            }
        });

    }

});
// end code

function ref_log_me() {
    user_data_token = {};
    user_data_token["u_id"] = user_data.user_id;
    user_data_token["dev_id"] = what_window.dev_id;
    user_data_token["u_client"] = what_window.u_client;
    $.ajax({
        type: "POST",
        url: elbatal_api + "accounts/accounts.php",
        data: {
            "action": "ref_log_me",
            token: mou_custom_encode(JSON.stringify(user_data_token))
        },
        dataType: "text",  // Treats JSON response as a string
        success: function (res, textStatus, jqXHR) {
            if (res.length > 0) {
                // data = {};
                // data = JSON.parse(MouDecrypt(res["d"], "ajhsbcjkas@#@!!@sc" + res["t"]));
                data = JSON.parse(res);
                if (typeof data !== "undefined" && typeof data.messages !== "undefined") {
                    if (typeof data.messages[400] !== "undefined") {
                        logout_from_elbatal();
                    } else if (typeof data.messages[401] !== "undefined") {
                        logout_for_code();
                    }
                }
            }

        }
    });
}

if (typeof window.electron !== "undefined") {
    ipcRenderer.on('idm-check-result', (isInstalled) => {
        console.log("isInstalled", isInstalled);
        if (isInstalled) {

        } else {

        }
    });
}

// document.addEventListener('keydown', function (event) {
//     if (event.key === 'Escape' || event.key === 'Esc') {
//         back_button_clicked();
//     }
// });
if (typeof window.electron !== "undefined") {

    ipcRenderer.on('Esc_clicked', () => {
        back_button_clicked();
    });

    ipcRenderer.on('window-id', (id) => {
        window.mainWindow_contentID = id;
    });
}
function updateHeaders(windowId, headers) {
    if (headers) {
        if (typeof mouscripts !== "undefined") {
            mouscripts.updateHeaders(JSON.stringify(headers));
        } else if (typeof what_window.electron !== "undefined") {
            ipcRenderer.send('update-headers',
                {
                    window_id: windowId,
                    custom_headers: headers
                }
            );
        }
    }
}

function extractDomainWithProtocol(url) {
    try {
        if (url.startsWith("//")) {
            url = "https:" + url;
        }
        let parsedUrl = new URL(url);
        return `${parsedUrl.protocol}//${parsedUrl.hostname}`;
    } catch (e) {
        console.error("Invalid URL", e);
        return null; // Return null or handle the error based on your use case
    }
}

var latest_elplayer_data = false;
function get_latest_elplayer_data(callback) {
    if (latest_elplayer_data == false) {
        $.ajax({
            type: "GET",
            url: "https://elplayer.elbatal-app.com/version.php",
            success: function (res) {
                latest_elplayer_data = res;
                callback(latest_elplayer_data);
            }
        });
    } else {
        callback(latest_elplayer_data);
    }
}
function check_elplayer_version() {
    elplayer_pkg = "com.mouscripts.bplayer";
    if (mouscripts.is_package_installed(elplayer_pkg)) {
        elplayer_app_data = JSON.parse(mouscripts.get_app_version(elplayer_pkg));
        get_latest_elplayer_data(function (elplayer_latest_data) {
            elplayer_latest_version = elplayer_latest_data.version;
            elplayer_app_version = elplayer_app_data["version_name"];
            if (elplayer_app_version !== elplayer_latest_version) {
                $("#update_elplayer_alert .mou_alert-message").attr("onclick", `open_external_link('${elplayer_latest_data.update_url}')`);
                $("#update_elplayer_alert .mou_alert-message").html(`يرجي تحديث مشغل ELPlayer حتي تستطيع المشاهدة . اضعط هنا لتحديث تطبيق ELPlayer`)
                $("#update_elplayer_alert").removeClass("d-none");
            }
        })
    } else {
        $("#update_elplayer_alert .mou_alert-message").attr("onclick", `open_external_link('https://www.elbatal-app.com/')`);
        $("#update_elplayer_alert .mou_alert-message").html(`يرجي تثبيت مشغل ELPlayer حتي تستطيع المشاهدة . اضعط هنا لتثبيت تطبيق ELPlayer`);
        $("#update_elplayer_alert").removeClass("d-none");
    }
}
function open_active_player() {
    elplayer_pkg = "com.mouscripts.bplayer";
    if (mouscripts.is_package_installed(elplayer_pkg)) {
        elplayer_app_data = JSON.parse(mouscripts.get_app_version(elplayer_pkg));

        elplayer_app_version = elplayer_app_data["version_name"];
        if (elplayer_app_version == "1.4") {
            mouscripts.active_app(user_data.user_id);
        }
    } else {

    }
}
function countLetter(str, letter) {
    return [...str].filter(char => char === letter).length;
}

/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/
var Base64 = {

    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        }
        return output;
    },

    // public method for decoding
    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }

        output = Base64._utf8_decode(output);

        return output;
    },

    // private method for UTF-8 encoding
    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode: function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}


function sync_vid_to_server(vid_data, to_where, this_btn = false, callback = false) {
    if (to_where) {

        if (to_where == "fav") {


        }

        this_qurey_data = vid_data.query;
        this_qurey_data = get_Queries(2, "?" + this_qurey_data);
        delete this_qurey_data["mosem_num"];
        delete this_qurey_data["halka_num"];
        this_qurey_data = decodeURIComponent(encodeQueryData(this_qurey_data));

        $.ajax({
            type: "POST",
            url: elbatal_api + "share/fcm.php",
            data: {
                action: "add_to_fav",
                title: vid_data.title,
                img_base64: vid_data.img_file,
                qurey_data: this_qurey_data,
                server_name: vid_data.server_name,
                token: mou_custom_encode(user_data.user_id + "#" + what_window.dev_id)
            },
            success: async function (data, textStatus, xhr) {
                for (var i = 0; i < Object.keys(data.messages).length; i++) {
                    message_code = Object.keys(data.messages)[i];
                    message = data.messages[message_code];
                    if (message_code == 200) {
                        vid_id = data.messages[201];

                        if (this_btn !== false) {
                            $(this_btn).addClass("active");
                            $(this_btn).find("i").remove();
                            $(this_btn).html(`<i class="fad fa-heart"></i>`);
                            $(this_btn).attr("data-canclick", "true");
                            $(this_btn).attr("data-vid_id", vid_id);
                        }
                        $(what_window.document).find("#fav_posts").find(`[data-id='${vid_data.local_vid_id}']`).attr("data-id", vid_id);

                        delete_fav(vid_data.local_vid_id, "local");

                        // await delete_fav_from_server(vid_data.local_vid_id);

                        if (callback !== false) {
                            callback(vid_data);
                        }
                        // get_app_db(function (app_db) {
                        //     store = app_db.transaction("favs", "readwrite").objectStore('favs');
                        //     const getOne = store.get(vid_data.local_vid_id); // get by primary key
                        //     getOne.onsuccess = function () {
                        //         const record = getOne.result;
                        //         if (record) {
                        //             record.synced_vid_id = vid_id;
                        //             record.synced = true;
                        //             store.put(record); // update the record
                        //         } else {
                        //             console.warn('Record not found');
                        //         }
                        //         if (callback !== false) {
                        //             callback(vid_data.local_vid_id);
                        //         }
                        //     };
                        // });
                    }
                }


            }, error: function (jqXHR, error, errorThrown) {

            }
        });
    }

}
function delete_fav_from_server(local_vid_id) {
    return new Promise((resolve, reject) => {
        what_window.delete_fav(local_vid_id, "local", function (vid_data) {
            resolve(vid_data);
        });
    });
}
function delete_fav(id, from_where = "local", this_btn = false) {
    if (from_where == "local") {

        get_app_db(function (app_db) {

            delete_db_request = app_db.transaction("favs", "readwrite").objectStore('favs').delete(id);
            delete_db_request.onsuccess = () => {
                // console.log(`Student deleted, email: ${db_request.result}`);
                if (this_btn !== false) {


                    if ($("#fav_posts > a").length == 0) {
                        $("#no_favs_alert").show();
                    }

                    if (typeof $(this_btn).attr("data-vid_id") !== "undefined") {

                    } else {
                        $(this_btn).removeClass("active");
                        $(this_btn).find("i").remove();
                        $(this_btn).html(`<i class="fal fa-plus"></i>`);
                        $(this_btn).attr("data-canclick", "true");
                        $(window.parent.document).find("#fav_posts").find(`[data-id='${id}']`).remove();
                    }



                }

            }

            delete_db_request.onerror = (err) => {
                console.error(`Error to delete student: ${err}`)
            }
        });

    } else if (from_where == "server") {
        vid_btn_id = $(this_btn).attr("data-vid_id");
        $.ajax({
            type: "POST",
            url: elbatal_api + "share/fcm.php",
            data: {
                action: "remove_fav",
                vid_id: vid_btn_id,
                token: mou_custom_encode(user_data.user_id + "#" + what_window.dev_id)
            },
            success: function (data, textStatus, xhr) {
                for (var i = 0; i < Object.keys(data.messages).length; i++) {
                    message_code = Object.keys(data.messages)[i];
                    message = data.messages[message_code];
                    if (message_code == 200) {


                        $(this_btn).removeAttr("data-vid_id");
                        $(this_btn).removeClass("active");
                        $(this_btn).find("i").remove();
                        $(this_btn).html(`<i class="fal fa-plus"></i>`);
                        $(this_btn).attr("data-canclick", "true");
                        $(what_window.document).find("#fav_posts").find(`[data-id='${vid_btn_id}']`).remove();

                        if ($("#fav_posts > a").length == 0) {
                            $("#no_favs_alert").show();
                        }

                    }
                }


            }, error: function (jqXHR, error, errorThrown) {

            }
        });

    }



}
function ActiveElbatalTv_RESUlt(res) {
    // alert(res) 
}

function handleBypassResult(requestId, html, cookies) {
    if (pendingRequests[requestId]) {
        const originalSettings = pendingRequests[requestId];

        console.log(`Success for ${requestId}. Injecting HTML to success callback.`);

        if (typeof originalSettings.success === "function") {
            // تمرير الـ HTML للـ success الأصلي للـ AJAX
            // 1. تجهيز الكائن الوهمي للـ XHR ليحتوي على الـ HTML المستلم
            const mockXHR = {
                responseText: html,
                status: 200,
                statusText: "OK",
                getAllResponseHeaders: () => "", // يمكنك إضافة هيدرز وهمية هنا إذا لزم الأمر
                readyState: 4
            };

            console.log("html => " + html);

            // 2. تمرير كافة المعاملات الثلاثة القياسية لـ jQuery success
            // المعامل 1: البيانات (الـ HTML)
            // المعامل 2: حالة النص (success)
            // المعامل 3: كائن الـ XHR
            originalSettings.success(html, "success", mockXHR);
        }

        // تنظيف الذاكرة
        delete pendingRequests[requestId];
    }
}

// ربط الدالة بـ window لضمان وصول الأندرويد والإلكترون لها
window.onCloudflareResult = handleBypassResult;

// في حالة Electron: نحتاج للاستماع لـ IPC وتحويله للدالة الموحدة
if (typeof window.electron !== "undefined") {
    // ipcRenderer.on('cloudflare-html', (data) => {
    //     if (data && data.requestId) {
    //         handleBypassResult(data.requestId, data.html);
    //     }
    // });

    ipcRenderer.on('cloudflare-html', (data) => {
        // ملاحظة: أول باراميتر في Electron هو الـ event دائمًا
        if (data && data.requestId && data.html) {
            console.log(`📥 Received HTML for request: ${data.requestId}`);
            handleBypassResult(data.requestId, data.html);
        } else {
            console.error("⚠️ Received incomplete cloudflare-html data", data);
        }
    });
}

async function resetChallenge() {
    await electron.clearAllData();
    alert("تم حذف جميع بيانات التخطي، يمكنك المحاولة الآن.");
}