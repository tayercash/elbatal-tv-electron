// mouscripts.play_vid("https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8", "TEST", "", "{}", false, false);
// mouscripts.play_vid("http://192.168.1.2/api/videoserver/m3u8/test.m3u8", "TEST", "", "{}", false, false);
var elbatal_api = "https://mou.elbatal-app.com/users";
// var elbatal_api = "http://192.168.1.6";

var api_link = elbatal_api + "/accounts/accounts.php";
var api_time_out = 30 * 1000;
var dev_id, dev_name;
if (typeof mouscripts !== "undefined") {
    dev_id = mouscripts.getUniqueDeviceID();
    dev_name = mouscripts.getUserDeviceName();
    var u_client = "mouscripts";
} else if (typeof window.electron !== "undefined") {
    dev_id = window.electron.getMachineId();
    dev_id = hexToUUID(dev_id); // Convert the ID
    dev_name = window.electron.GetDeviceName();
    var u_client = "electron";
} else {
    dev_id = new DeviceUUID().get();
    dev_name = getDeviceName();
    var u_client = "electron";
}

var now_user_data = localStorage.getItem("user_data");

if (typeof mouscripts == "undefined" || mouscripts.is_network_available()) {
    if (getQueryVariable("action") == "code") {
        if (now_user_data !== null) {
            now_user_data = JSON.parse(now_user_data);
            window.user_id_want_active = now_user_data.user_id;
            show_activation_form(window.user_id_want_active);
            window.log_after_code_validation = function () {
                window.location.href = "index1.html";
            }
        }
    } else {
        Start_Login();
    }

} else {
    window.addEventListener("online", (event) => {
        Start_Login();
    });
    $(".user_log_stats").show().find("a").html(`<i class="fas fa-info-circle fa-lg"></i> يرجي التحقق من اتصالك بالانترنت`);
}


// $.ajaxSetup({
//     beforeSend: function (jqXHR, settings) {
//         if (settings.url.includes("/accounts/accounts.php")) {
//             // Modify the data object as needed
//             let dataObj = Object.fromEntries(new URLSearchParams(settings.data));
//             timestamp = new Date().getTime();
//             dataObjenc = MouEncrypt(JSON.stringify(dataObj), "ajkhsbcjk#&#&*@@ds" + timestamp);
//             req_data = {};
//             req_data["t"] = timestamp;
//             req_data["d"] = dataObjenc;

//             settings.data = $.param(req_data);
//         }
//     }
// });

// Example AJAX request

function Start_Login() {
    $(".user_log_stats").show().find("a").html(`<i class="fas fa-circle-notch fa-spin"></i> جاري تسجيل الدخول`);

    if (now_user_data !== null) {
        now_user_data = JSON.parse(now_user_data);
        is_loged_in_with_email = now_user_data.loged_in_with_email;
        if (is_loged_in_with_email) {
            // auto login with what
            what_loged_in_with = now_user_data.loged_in_with;
            if (what_loged_in_with == "account") {
                log_with_email = now_user_data.email;
                log_with_password = now_user_data.pass;
                $("#in_username").val(log_with_email);
                $("#in_password").val(log_with_password);

                $(document).ready(function () {
                    $(".user_log_stats").css("display", "flex");
                    setTimeout(function () {
                        $("#sign_in").click();
                    }, 1000);
                });

            } else if (what_loged_in_with == "google") {

                $(document).ready(function () {
                    $(".user_log_stats").css("display", "flex");

                    setTimeout(function () {
                        $("#login_with_google").click();

                    }, 1000);

                });

            }
        } else if (now_user_data.loged_in_with == "guest") {
            $(".full_logo").hide();
            $(".mou_login").show();
        }
    } else {
        $(".full_logo").hide();
        $(".mou_login").show();
    }

}

var can_use_login_with_google = true;
$("#login_with_google").click(function () {
    if (can_use_login_with_google == true) {
        can_use_login_with_google = false;
        $("#login_with_google").addClass("loading");


        if (typeof mouscripts !== "undefined") {
            mouscripts.login_with_google();
        } else if (typeof window.electron !== "undefined") {

            window.electron.signInWithGoogle();

        }
    }

});
function on_google_signed_error() {
    can_use_login_with_google = true;
    $("#login_with_google").removeClass("loading");
    Toastify({
        text: "حدث خطأ اثناء التسجيل بحساب جوجل . يرجي المحاوله مجددا",
        duration: 3000,
        newWindow: true,
        close: false,
        gravity: "bottom", // `top` or `bottom`
        position: "center",
        backgroundColor: "linear-gradient(-45deg, #ffcc00, #ff6600, #ff3300)",
    }).showToast();
    // alert("حدث خطأ اثناء التسجيل بحساب جوجل . يرجي المحاوله مجددا");
}
if (typeof window.electron !== "undefined") {
    ipcRenderer.on('g_profile', (profile) => {
        on_google_signed_success(profile.id, profile.name, mou_custom_encode(profile.email), profile.picture);
    });
    ipcRenderer.on('g_error', (msg) => {
        console.log(msg);
        on_google_signed_error();
    });
    ipcRenderer.on('activation_code', (code) => {
        paste_code(code);
    })
}
function on_google_signed_success(personID, personName, personEmail, personImg) {
    can_use_login_with_google = false;
    user_name = personName;
    email = personEmail;
    gid = personID;
    avatar_code = "10b15ef17da8534081";
    g_icon = personImg == "null" ? null : personImg;
    // alert("تم تسجيل الدخول بنجاح : " + "\n" + gid + "\n" + user_name + "\n" + email + "\n" + avatar_code);
    $.ajax({
        url: api_link,
        type: 'POST',
        timeout: api_time_out,
        data: {
            action: "login_account_with_google",
            gid: gid,
            username: user_name,
            email: email,
            avatar_code: avatar_code,
            g_icon: g_icon,
            u_id: dev_id,
            u_name: dev_name,
            u_client: u_client
        },
        success: function (res, textStatus, jqXHR) {
            // data = JSON.parse(MouDecrypt(res["d"], "ajhsbcjkas@#@!!@sc" + res["t"]));

            data = res;
            can_use_login_with_google = true;
            $("#login_with_google").removeClass("loading");

            $("#sign_in").html(`<i class="fas fa-sign-in"></i> تسجيل
                    الدخول`);

            if (data.status == false) {
                // showToast("من فضلك قم بالتحقق من بيانات تسجيل الدخول وحاول مجددا.");
                // $(".full_logo").hide();
                // $(".mou_login").show();
                for (var i = 0; i < Object.keys(data.messages).length; i++) {
                    message_code = Object.keys(data.messages)[i];
                    message = data.messages[message_code];
                    if (message_code == 405) {
                        window.user_id_want_active = data.messages["u_id"];
                        show_activation_form(user_id_want_active);
                        window.log_after_code_validation = function () {
                            $("#login_with_google").click();
                        }
                        break;
                    } else if (message_code == 409) {
                        mouscripts.logout_with_google();
                        // alert(message);
                        Toastify({
                            text: message,
                            duration: 3000,
                            newWindow: true,
                            close: false,
                            gravity: "bottom", // `top` or `bottom`
                            position: "center",
                            backgroundColor: "linear-gradient(-45deg, #ff0000, #c70000)",
                        }).showToast();
                    } else {
                        showToast("من فضلك قم بالتحقق من بيانات تسجيل الدخول وحاول مجددا.");
                        $(".full_logo").hide();
                        $(".mou_login").show();
                    }
                }
            } else {
                for (var i = 0; i < Object.keys(data.messages).length; i++) {
                    message_code = Object.keys(data.messages)[i];
                    message = data.messages[message_code];
                    if (message_code == 200) {
                        loged_in_u_id = data.messages.loged_in_u_id;
                        user_name = data.messages.user_name;
                        email = data.messages.email;
                        avatar_code = data.messages.avatar;
                        loged_in_with = "google";
                        g_icon = data.messages.g_icon;
                        avatar_or_g_icon = data.messages.avatar_or_g_icon;
                        role = data.messages.role;
                        loged_in_success(false, user_name, loged_in_u_id, email, avatar_code, g_icon, avatar_or_g_icon, loged_in_with, false, role, data.messages);
                    } else if (message_code == 409) {
                        mouscripts.logout_with_google();
                        showToast(message);
                    }
                }
            }

        }, error: function (jqXHR, error, errorThrown) {
            // alert(jqXHR.responseText);
            // return;
            can_use_login_with_google = true;
            $("#login_with_google").removeClass("loading");
            handel_server_error(jqXHR, error, errorThrown);
        }
    })
}

$("#go_for_signup").click(function () {
    $("#mou_login_container").attr("data-what", "sign_up");
    $("#login_with_google").show();

});
$(".go_for_login").click(function () {
    $("#mou_login_container").attr("data-what", "sign_in");
    $("#login_with_google").show();
});
$("#login_without_account").click(function () {
    $("#mou_login_container").attr("data-what", "gust");
});
$("#go_for_passowrd_forget").click(function () {
    $("#mou_login_container").attr("data-what", "forget_password");
    $("#login_with_google").hide();

    $(".forget_password_alert").hide();
    $("#forget_password_elmnts").show();
    $("#forgeted_email").val("");
});

$("#signin_without_account_form").submit(function (e) {
    e.preventDefault();
    return false;;
    if ($(this).valid()) {
        var gust_user_name = $("#gust_username").val();
        var gust_user_id = String(new Date().getTime()).slice(-8);
        var avatar_code = makeid(10);
        var g_icon = null;
        var avatar_or_g_icon = 1;
        loged_in_with = "guest";
        loged_in_success(true, gust_user_name, gust_user_id, null, avatar_code, g_icon, avatar_or_g_icon, loged_in_with);
    }
});
var now_user_ip = false;
function get_ip(callback) {
    if (now_user_ip == false) {
        $.ajax({
            "type": "GET",
            "url": "https://www.cloudflare.com/cdn-cgi/trace",
            success: function (res) {
                now_user_ip = /ip=(.*)/gm.exec(res)[1].trim();
                callback(now_user_ip);
            }
        });
    } else {
        callback(now_user_ip);
    }
}

function getFcmToken(callback) {
    if (typeof mouscripts !== "undefined") {

        var FcmToken = mouscripts.getFcmToken();
        if (FcmToken !== "empty") {
            callback(FcmToken);
        } else {

            var FcmToken_interval = setInterval(function () {
                if (mouscripts.getFcmToken() !== "empty") {
                    clearInterval(FcmToken_interval);
                    FcmToken = mouscripts.getFcmToken();
                    callback(FcmToken);

                }
            }, 50);
        }
    } else {
        callback("null");
    }
}


can_use_login_form = true;
$("#signinform").submit(function (e) {
    e.preventDefault();
    if ($(this).valid()) {

        var user_name_email = $("#in_username").val();
        var password = $("#in_password").val();

        if (can_use_login_form == true) {
            if (valid_aouth_token(user_name_email + password)) {
                can_use_login_form = false;
                $("#sign_in").addClass("loading");
                $("#sign_in").html(`<i class="fas fa-circle-notch fa-spin"></i> جاري تسجيل الدخول`);

                $.ajax({
                    url: api_link,
                    type: 'POST',
                    timeout: api_time_out,
                    data: {
                        action: "login_account_with_data",
                        user_name_email: user_name_email,
                        password: password,
                        u_id: dev_id,
                        u_name: dev_name,
                        aouth_token: valid_aouth_token(user_name_email + password),
                        u_client: u_client
                    },
                    success: function (res, textStatus, jqXHR) {
                        // data = JSON.parse(MouDecrypt(res, "ajhsbcjkas@#@!!@sc" + jqXHR.getResponseHeader("t")));

                        // data = JSON.parse(MouDecrypt(res["d"], "ajhsbcjkas@#@!!@sc" + res["t"]));
                        data = res;


                        can_use_login_form = true;
                        $("#sign_in").removeClass("loading");
                        $("#sign_in").html(`<i class="fas fa-sign-in"></i> تسجيل
                        الدخول`);

                        if (data.status == false) {
                            // showToast("من فضلك قم بالتحقق من بيانات تسجيل الدخول وحاول مجددا.");
                            // $(".full_logo").hide();
                            // $(".mou_login").show();

                            for (var i = 0; i < Object.keys(data.messages).length; i++) {
                                message_code = Object.keys(data.messages)[i];
                                message = data.messages[message_code];
                                if (message_code == 405) {
                                    window.user_id_want_active = data.messages["u_id"];
                                    show_activation_form(user_id_want_active);

                                    window.log_after_code_validation = function () {
                                        $("#sign_in").click();
                                    }
                                    break;
                                } else if (message_code == 409) {
                                    alert(message);
                                } else {
                                    showToast("من فضلك قم بالتحقق من بيانات تسجيل الدخول وحاول مجددا.");
                                    $(".full_logo").hide();
                                    $(".mou_login").show();
                                }
                            }
                        } else {


                            for (var i = 0; i < Object.keys(data.messages).length; i++) {
                                message_code = Object.keys(data.messages)[i];
                                message = data.messages[message_code];
                                if (message_code == 200) {
                                    loged_in_u_id = data.messages.loged_in_u_id;
                                    user_name = data.messages.user_name;
                                    email = data.messages.email;
                                    avatar_code = data.messages.avatar;
                                    g_icon = data.messages.g_icon;
                                    avatar_or_g_icon = data.messages.avatar_or_g_icon;
                                    loged_in_with = "account";
                                    role = data.messages.role;
                                    loged_in_success(false, user_name, loged_in_u_id, email, avatar_code, g_icon, avatar_or_g_icon, loged_in_with, password, role, data.messages);
                                } else if (message_code == 409) {
                                    // alert(message);
                                    Toastify({
                                        text: message,
                                        duration: 3000,
                                        newWindow: true,
                                        close: false,
                                        gravity: "bottom", // `top` or `bottom`
                                        position: "center",
                                        backgroundColor: "linear-gradient(-45deg, #ff0000, #c70000)",
                                    }).showToast();
                                }
                            }
                        }

                    }, error: function (jqXHR, error, errorThrown) {
                        can_use_login_form = true;
                        $("#sign_in").removeClass("loading");

                        $("#sign_in").html(`<i class="fas fa-sign-in"></i> تسجيل
                        الدخول`);
                        handel_server_error(jqXHR, error, errorThrown);
                    }
                })
            } else {
                Toastify({
                    text: "حدث خطأ غير متوقع . حاول مجددا",
                    duration: 3000,
                    newWindow: true,
                    close: false,
                    gravity: "bottom", // `top` or `bottom`
                    position: "center",
                    backgroundColor: "linear-gradient(-45deg, #ff0000, #c70000)",
                }).showToast();
            }
        }

    }

});

function show_activation_form(user_id_want_active) {
    $("#user_id_want_active").text(user_id_want_active);

    $(".full_logo").hide();
    $(".mou_login").hide();
    $(".full_code_container").show();
}

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
        $("#active_with_code").focus();
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
    create_url = "https://www.elbatal-app.com/?getCode=" + user_id_want_active;
    // create_url = "file:///C:/android/%D9%82%D8%A7%D9%84%D8%A8%20%D8%A7%D9%84%D8%AA%D8%AD%D9%85%D9%8A%D9%84/index.html?getCode=" + user_id_want_active;
    if (typeof mouscripts !== "undefined") {
        mouscripts.open_external_link(create_url);
    } else {
        window.open(create_url);
    }
});
$("#how_to_get_code").click(function () {
    vid_url = "https://s01.babup.com/uploads/Get-Code-Elbatal.mp4";
    vid_title = "كيفية احضار كود التفعيل لتطبيق Elbatal TV";
    if (typeof mouscripts !== "undefined") {
        mouscripts.play_vid(vid_url, vid_title, "", "{}", false, false, "", "Elbatal", "", "");

    } if (typeof electron !== "undefined") {
        window.open("files/plyr/plyr.html?data=" + btoa(encodeURI(encodeQueryData({
            vid_title: vid_title,
            vid_link: vid_url,
            useragent: "",
            headers: "{}"
        })), "_blank"));
    }
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
                position: "center",
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
                position: "center",
                backgroundColor: "linear-gradient(-45deg, #ff0000, #c70000)",
            }).showToast();
            // alert("يجب ان يكون الكود 6 ارقام");
            return false;
        }
        can_submit_code = false;

        $("#active_with_code").html(`<i class="fas fa-circle-notch fa-spin"></i> جاري التحقق من الكود`)
        code_token = {};
        code_token["user_id"] = user_id_want_active;
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
                                position: "center",
                                backgroundColor: "#198754",
                            }).showToast();

                            $(".full_logo").show();
                            $(".full_code_container").hide();


                            window.log_after_code_validation();

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
                                position: "center",
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

$("#log_out").click(function () {
    localStorage.removeItem("user_data");
    if (typeof mouscripts !== "undefined") {
        mouscripts.logout_with_google();
    }

    $(".full_code_container").hide();
    $(".mou_login").show();
});

can_use_signup_form = true;
$("#signupform").submit(function (e) {
    e.preventDefault();
    if ($(this).valid()) {
        var username = $("#up_username").val();
        var email = $("#up_email").val();
        var password = $("#up_password").val();
        var retype_password = $("#up_repassword").val();
        // var avatar_code = makeid(10);
        var avatar_code = "10b15ef17da8534081";

        if (can_use_signup_form == true) {
            if (valid_aouth_token(username + password)) {
                can_use_signup_form = false;

                $("#sign_up").html(`<i class="fas fa-circle-notch fa-spin"></i> جاري تسجيل الحساب`);
                $.ajax({
                    url: api_link,
                    type: 'POST',
                    timeout: api_time_out,
                    data: {
                        action: "register_account_with_data",
                        username: username,
                        email: email,
                        password: password,
                        retype_password: retype_password,
                        avatar_code: avatar_code,
                        u_id: dev_id,
                        u_name: dev_name,
                        u_client: u_client
                    },
                    success: function (res, textStatus, jqXHR) {
                        // data = JSON.parse(MouDecrypt(res["d"], "ajhsbcjkas@#@!!@sc" + res["t"]));
                        data = res;

                        can_use_signup_form = true;
                        $("#sign_up").html(`<i class="fas fa-sign-in"></i> تسجيل حساب جديد`);


                        if (data.status == false) {
                            // showToast("من فضلك قم بالتحقق من بيانات تسجيل الدخول وحاول مجددا.");
                            // $(".full_logo").hide();
                            // $(".mou_login").show();

                            for (var i = 0; i < Object.keys(data.messages).length; i++) {
                                message_code = Object.keys(data.messages)[i];
                                message = data.messages[message_code];
                                if (message_code == 405) {
                                    window.user_id_want_active = data.messages["u_id"];
                                    show_activation_form(user_id_want_active);
                                    $("#in_username").val($("#up_email").val());
                                    $("#in_password").val($("#up_password").val());
                                    window.log_after_code_validation = function () {
                                        $("#sign_in").click();
                                    }
                                    break;
                                } else if (message_code == 402) {
                                    showToast("هذا الايميل مستخدم من قبل جرب تسجيل الدخول");
                                } else {
                                    showToast("حدث خطأ");
                                }
                            }
                        } else {


                            for (var i = 0; i < Object.keys(data.messages).length; i++) {
                                message_code = Object.keys(data.messages)[i];
                                message = data.messages[message_code];
                                if (message_code == 200) {
                                    loged_in_u_id = data.messages.loged_in_u_id;
                                    username = data.messages.user_name;
                                    email = data.messages.email;
                                    avatar_code = data.messages.avatar;
                                    g_icon = data.messages.g_icon;
                                    avatar_or_g_icon = data.messages.avatar_or_g_icon;
                                    loged_in_with = "account";
                                    role = data.messages.role;
                                    loged_in_success(false, username, loged_in_u_id, email, avatar_code, g_icon, avatar_or_g_icon, loged_in_with, password, role, data.messages);
                                }
                            }
                        }

                    }, error: function (jqXHR, error, errorThrown) {
                        can_use_signup_form = true;
                        $("#sign_up").html(`<i class="fas fa-sign-in"></i> تسجيل حساب جديد`);
                        handel_server_error(jqXHR, error, errorThrown);
                    }
                });
            } else {
                Toastify({
                    text: "حدث خطأ غير متوقع . حاول مجددا",
                    duration: 3000,
                    newWindow: true,
                    close: false,
                    gravity: "bottom",
                    position: "center",
                    backgroundColor: "linear-gradient(-45deg, #ff0000, #c70000)",
                }).showToast();
            }
        }
    }
});

function valid_aouth_token(data) {
    if (typeof mouscripts == "undefined") {
        return true;
    }
    return mouscripts.validAauthToken(data);
}

function loged_in_success(is_gust = true, username, user_id, email, avatar, g_icon, avatar_or_g_icon, loged_in_with, password = false, role = null, full_data = false) {
    user_obj = {};

    if (is_gust == false) {
        user_obj["loged_in_with_email"] = true;
        user_obj["email"] = email;
    } else {
        user_obj["loged_in_with_email"] = false;
    }
    user_obj["username"] = username;
    user_obj["user_id"] = user_id;
    user_obj["avatar"] = avatar;
    user_obj["g_icon"] = g_icon;
    user_obj["avatar_or_g_icon"] = avatar_or_g_icon;
    user_obj["loged_in_with"] = loged_in_with;
    user_obj["role"] = role == null ? null : role.split(",");
    if (password !== false) {
        user_obj["pass"] = password;
    }
    localStorage.setItem("user_data", JSON.stringify(user_obj));

    window.location.replace("index1.html");
}

$(document).ready(function () {
    $("#signin_without_account_form").validate({
        rules: {
            gust_username: {
                required: true,
                minlength: 6
            }
        },
        messages: {
            gust_username: {
                required: "من فضلك ادخل اسم المستخدم",
                minlength: "يجب أن يتكون اسم المستخدم الخاص بك من 6 أحرف على الأقل"
            }
        },
        errorElement: "span",
        errorPlacement: function (error, element) {
            error.addClass("invalid-feedback alert-danger");
            error.insertAfter(element.parents(".mou_input_container"));
        }
    });

    $("#signinform").validate({
        rules: {
            in_username: {
                required: true,
            },
            in_password: {
                required: true,
            }
        },
        messages: {
            in_username: "من فضلك ادخل  ايميل صحيح",
            in_password: "قم بادخال الباسورد"
        },
        errorElement: "span",
        errorPlacement: function (error, element) {
            error.addClass("invalid-feedback alert-danger");
            error.insertAfter(element.parents(".mou_input_container"));
        }
    });

    $("#signupform").validate({
        rules: {
            up_username: {
                required: true,
                minlength: 6,
            },
            up_email: {
                required: true,
                email: true
            },
            up_password: {
                required: true,
                minlength: 6
            },
            up_repassword: {
                required: true,
                minlength: 6,
                equalTo: "#up_password"
            }
        },
        messages: {

            up_username: {
                required: "من فضلك ادخل اسم المستخدم",
                minlength: "يجب أن يتكون اسم المستخدم الخاص بك من 6 أحرف على الأقل"
            },
            up_email: "يرجى إدخال عنوان بريد إلكتروني صالح",
            up_password: {
                required: "من فضلك ادخل الباسورد",
                minlength: "يجب أن تتكون الباسورد الخاصة بك من 6 أحرف على الأقل"
            },
            up_repassword: {
                required: "من فضلك قم بإعادة كتابة الباسورد",
                minlength: "يجب أن تتكون الباسورد الخاصة بك من 6 أحرف على الأقل",
                equalTo: "تاكيد الباسورد مختلف عن الباسورد"
            }

        },
        errorElement: "span",
        errorPlacement: function (error, element) {
            error.addClass("invalid-feedback alert-danger");
            error.insertAfter(element.parents(".mou_input_container"));
        }
    });
    $("#forget_password").validate({
        rules: {
            forgeted_email: {
                required: true,
                email: true
            }
        },
        messages: {
            forgeted_email: "من فضلك ادخل  ايميل صحيح",
        },
        errorElement: "span",
        errorPlacement: function (error, element) {
            error.addClass("invalid-feedback alert-danger");
            error.insertAfter(element.parents(".mou_input_container"));
        }
    });
});

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

function showToast(msg) {
    if (typeof mouscripts !== "undefined") {
        mouscripts.showToast(msg);
    } else if (typeof window.electron !== "undefined") {
        Toastify({
            text: msg,
            duration: 3000,
            newWindow: true,
            close: false,
            gravity: "bottom", // `top` or `bottom`
            position: "center",
            backgroundColor: "linear-gradient(-45deg, #ffcc00, #ff6600, #ff3300)",
        }).showToast();
    } else {
        alert(msg);
    }
}

function handel_server_error(jqXHR, error, errorThrown) {
    showToast("حدث خطأ غير متوقع اثناء تسجيل الدخول حاول مجددا .");
    $(".full_logo").hide();
    $(".mou_login").show();
}
function strtr(t, r, s) { var i, e, h, n, o = "", f = 0, p = 0, a = !1, c = "", g = [], l = [], u = "", b = !1; if ("object" == typeof r) { for (o in a = this.ini_set("phpjs.strictForIn", !1), r = this.krsort(r), this.ini_set("phpjs.strictForIn", a), r) r.hasOwnProperty(o) && (g.push(o), l.push(r[o])); r = g, s = l } for (i = t.length, e = r.length, h = "string" == typeof r, n = "string" == typeof s, f = 0; f < i; f++) { if (b = !1, h) { for (c = t.charAt(f), p = 0; p < e; p++)if (c == r.charAt(p)) { b = !0; break } } else for (p = 0; p < e; p++)if (t.substr(f, r[p].length) == r[p]) { b = !0, f = f + r[p].length - 1; break } u += b ? n ? s.charAt(p) : s[p] : t.charAt(f) } return u }

function mou_custom_encode($txt, $num = 1) {
    $default = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    $custom = "ZYXWVUTSRQPONMLKJIHGFEDCBAzyxwvutsrqponmlkjihgfedcba9876543210+/";
    $encoded = escape($txt);
    for ($i = 1; $i <= $num; $i++) {
        $encoded = strtr(btoa($encoded), $custom, $default);
    }
    return $encoded.replace(/\=/g, "");
}

function mou_custom_decode($txt, $num = 1) {
    $default = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    $custom = "ZYXWVUTSRQPONMLKJIHGFEDCBAzyxwvutsrqponmlkjihgfedcba9876543210+/";
    $decoded = decodeURIComponent($txt);
    for ($i = 1; $i <= $num; $i++) {
        $decoded = atob(strtr($decoded, $custom, $default));
    }
    try {
        return decodeURIComponent(decodeURI($decoded));
    } catch (error) {
        console.error(error);
        return unescape($decoded);
        // Expected output: ReferenceError: nonExistentFunction is not defined
        // (Note: the exact output may be browser-dependent)
    }
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

can_use_forget_password_form = true;
$("#forget_password").submit(function (e) {
    e.preventDefault();
    if ($(this).valid()) {

        var forgeted_email = $("#forgeted_email").val();

        if (can_use_forget_password_form == true) {
            if (valid_aouth_token(forgeted_email)) {
                can_use_forget_password_form = false;
                $("#send_confirm_forget").html(`<i class="fas fa-circle-notch fa-spin"></i> جاري ارسال معلومات استعادة الباسورد`);
                $.ajax({
                    url: api_link,
                    type: 'POST',
                    timeout: api_time_out,
                    data: {
                        action: "forget_password",
                        forgeted_email: forgeted_email,
                        u_id: dev_id,
                        u_name: dev_name,
                        aouth_token: valid_aouth_token(forgeted_email)
                    },
                    success: function (res, textStatus, jqXHR) {
                        // data = JSON.parse(MouDecrypt(res["d"], "ajhsbcjkas@#@!!@sc" + res["t"]));
                        data = res;


                        can_use_forget_password_form = true;
                        $("#send_confirm_forget").html(`<i class="fas fa-paper-plane"></i> استعادة الباسورد`);


                        if (data.status == false) {
                            for (var i = 0; i < Object.keys(data.messages).length; i++) {
                                message_code = Object.keys(data.messages)[i];
                                message = data.messages[message_code];
                                if (message_code == 407) {
                                    $("#forget_password_elmnts").hide();
                                    $(".can_send_forget_timer_alert").css("display", "flex");

                                    can_send_forget_timer_distance = (parseInt(message) * 1000);

                                    timers_minutes = zeroFill(Math.floor((can_send_forget_timer_distance % (1000 * 60 * 60)) / (1000 * 60)), 2);
                                    timers_seconds = zeroFill(Math.floor((can_send_forget_timer_distance % (1000 * 60)) / 1000), 2);

                                    $(".can_send_forget_timer_after").text(timers_minutes + ":" + timers_seconds);

                                    send_donation_timer = setInterval(function () {
                                        can_send_forget_timer_distance = can_send_forget_timer_distance - 1000;
                                        timers_minutes = zeroFill(Math.floor((can_send_forget_timer_distance % (1000 * 60 * 60)) / (1000 * 60)), 2);
                                        timers_seconds = zeroFill(Math.floor((can_send_forget_timer_distance % (1000 * 60)) / 1000), 2);

                                        $(".can_send_forget_timer_after").text(timers_minutes + ":" + timers_seconds);

                                        if (can_send_forget_timer_distance <= 0) {
                                            clearInterval(send_donation_timer);
                                            $(".forget_password_alert").hide();
                                            $("#forget_password_elmnts").show();
                                            can_use_forget_password_form = true;
                                        }
                                    }, 1000);


                                } else {

                                    Toastify({
                                        text: message,
                                        duration: 3000,
                                        newWindow: true,
                                        close: false,
                                        gravity: "bottom", // `top` or `bottom`
                                        position: "center",
                                        backgroundColor: "linear-gradient(-45deg, #ff0000, #c70000)",
                                    }).showToast();
                                }

                            }
                        } else {

                            for (var i = 0; i < Object.keys(data.messages).length; i++) {
                                message_code = Object.keys(data.messages)[i];
                                message = data.messages[message_code];
                                if (message_code == 200) {

                                    $("#forget_password_elmnts").hide();
                                    $(".forget_password_sent_alert").css("display", "flex");
                                    $(".forget_password_sent_alert .mou_alert-message").html(message);

                                    Toastify({
                                        text: "تم ارسال الايميل بنجاح .",
                                        duration: 3000,
                                        newWindow: true,
                                        close: false,
                                        gravity: "bottom", // `top` or `bottom`
                                        position: "center",
                                        backgroundColor: "#198754",
                                    }).showToast();

                                }
                            }
                        }

                    }, error: function (jqXHR, error, errorThrown) {
                        can_use_forget_password_form = true;
                        $("#send_confirm_forget").html(`<i class="fas fa-paper-plane"></i> استعادة الباسورد`);
                        handel_server_error(jqXHR, error, errorThrown);
                    }
                })
            } else {
                Toastify({
                    text: "حدث خطأ غير متوقع . حاول مجددا",
                    duration: 3000,
                    newWindow: true,
                    close: false,
                    gravity: "bottom", // `top` or `bottom`
                    position: "center",
                    backgroundColor: "linear-gradient(-45deg, #ff0000, #c70000)",
                }).showToast();
            }
        }

    }
})

function zeroFill(number, width) {
    width -= number.toString().length;
    if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number + ""; // always return a string
}
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
function encodeQueryData(data) {
    const ret = [];
    for (let d in data)
        ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    return ret.join('&');
}

function MouEncrypt(plainText, key = '') {
    let result = '';
    for (let i = 0; i < plainText.length; i++) {
        // XOR each character with the corresponding character in the key
        result += String.fromCharCode(
            plainText.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
    }

    // Encode the result in Base64
    return btoa(result);
}
function MouDecrypt(encrypted, key = '') {
    encrypted = atob(encrypted);
    let result = '';
    for (let i = 0; i < encrypted.length; i++) {
        // XOR each character with the corresponding character in the key
        result += String.fromCharCode(
            encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
    }
    return result;
}
function getQueryVariable(variable, meth = 1, link = "") {
    if (meth == 1) {
        var query = window.location.search.substring(1);
    } else {
        var query = link.split("?")[1];
    }
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}