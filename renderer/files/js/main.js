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
// mouscripts.ajax(JSON.stringify({
//     "type": "GET",
//     "url": "https://mouapi.herokuapp.com/videoserver/test_get.php",
//     "headers": {
//         "User-Agent": "mou_user_agent",
//         "Referer": "mou_referrer",
//         "Origin": "mou_origin"
//     },
//     "OnSuccess": "ongetgoogle"
// }));

// show_unity_rewardedAd("Rewarded_Android", function (ad_status) {
//     if (ad_status == true) {

//     } else {

//     }
// });
// show_unity_Interstitial();

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
var now_unity_rewardedAd = "";
function show_unity_rewardedAd(adUnitId, callback) {
    now_unity_rewardedAd = callback;
    mouscripts.load_unity_ad(adUnitId);
}

function unity_reward_status(user_status) {
    window["now_unity_rewardedAd"](user_status);
}
var unity_Interstitial_ids = ["video", "interstitial_2"];
var unity_Interstitial_ids_will_show = 0;
function show_unity_Interstitial() {
    if (unity_Interstitial_ids.length > 0) {
        if (typeof unity_Interstitial_ids[unity_Interstitial_ids_will_show] !== "undefined") {
            adUnitId = unity_Interstitial_ids[unity_Interstitial_ids_will_show];
            unity_Interstitial_ids_will_show++;
        } else {
            adUnitId = unity_Interstitial_ids[0];
            unity_Interstitial_ids_will_show = 1;
        }
        mouscripts.load_unity_ad(adUnitId);
    }
}
$("[data-target_view]").click(function () {
    $(".mou_panal").removeClass("active").addClass("hiden");
    target_view = $(this).attr("data-target_view");
    $("#" + target_view).addClass("active").removeClass("hiden");
});

function convert_byte_to_string(array) {
    array = JSON.parse(array);
    bytesView = new Uint8Array(array);
    return new TextDecoder().decode(bytesView);
}
function fireWith(context, args) {
    if (!locked) {
        args = args || [];
        args = [context, args.slice ? args.slice() : args];
        queue.push(args);
        if (!firing) {
            fire();
        }
    }
    return this;
}

function strtr(t, r, s) { var i, e, h, n, o = "", f = 0, p = 0, a = !1, c = "", g = [], l = [], u = "", b = !1; if ("object" == typeof r) { for (o in a = this.ini_set("phpjs.strictForIn", !1), r = this.krsort(r), this.ini_set("phpjs.strictForIn", a), r) r.hasOwnProperty(o) && (g.push(o), l.push(r[o])); r = g, s = l } for (i = t.length, e = r.length, h = "string" == typeof r, n = "string" == typeof s, f = 0; f < i; f++) { if (b = !1, h) { for (c = t.charAt(f), p = 0; p < e; p++)if (c == r.charAt(p)) { b = !0; break } } else for (p = 0; p < e; p++)if (t.substr(f, r[p].length) == r[p]) { b = !0, f = f + r[p].length - 1; break } u += b ? n ? s.charAt(p) : s[p] : t.charAt(f) } return u }

function mou_custom_encode($txt, $num = 1) {
    $default = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    $custom = "ZYXWVUTSRQPONMLKJIHGFEDCBAzyxwvutsrqponmlkjihgfedcba9876543210+/";
    $encoded = escape($txt);
    for ($i = 1; $i <= $num; $i++) {
        $encoded = strtr(btoa($encoded), $custom, $default);
    }
    return $encoded;
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


function get_yacin_res(url, callback) {
    var callback_token = makeid(6) + Date.now();
    var callback_function = callback;
    window["return_yacin_res_" + callback_token] = function (res) {
        callback_function(JSON.parse(convert_byte_to_string(res)));
    };
    mouscripts.get_yacin_res(url, "return_yacin_res_" + callback_token);
}


function fix_tabindex() {
    if (typeof mouscripts !== "undefined") {
        if (mouscripts.is_run_from_tv() || window.innerWidth > window.innerHeight) {
            $("[data-add_tabindex]").attr("tabindex", "0");
        }
    }
}