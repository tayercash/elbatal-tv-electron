$(document).ready(function () {
    $(".preloader").css("display", "none");
});
avatar_selector_data = [
    "10b15ef17da8534081",
    "mido",
    "7oda",
    "mouscripts",
    'Clementine',
    'Morty',
    'Rodion Raskolnikov',
    'Sam Solo',
    'Starcrasher',
    'Shack',
    'Desmond',
    'Snake Harrison',
    'Pandemonium',
    'Broomhilda',
    'Cosmo Blue',
    'Blue Meal Shake',
    'Cryptonaut',
    'Maggot',
    'Matrix',
    'Hiro',
    'Mavericat',
    'Huxley',
    'Elton David-Black',
    'Katerina Zoo',
    'Bloomdalf',
    'Emma',
    'The Elephant\'s Cat',
    'Nigel Ziemssen',
    'Sir Henchard',
    'Philip Klaus',
    'Daniel Marlowe',
    'Joachim Molesworth',
    'Molly Deronda',
    'Protagonist',
    'Lancelot',
    'Pechorin Bloom',
    'Kim',
    'Kim Patel',
    'Lorelei',
    'Battle Wooster',
    'Horatius',
    'Rhett James',
    'Moby Dick',
    'James Bolling',
    'Binx Bond',
    'Patrick Gatsby',
    'Inigo Argo',
    'Jay Bateman',
    'Victor Montoya',
    'Angela Flagg',
    'Randall Zone',
    'Major Salt',
    'Milo Minderbender',
    'Major Machine',
    'Skeleto',
    'Heep Starr',
    '11th Monster',
    'Wunderlick',
    'Big Brother',
    'Gonlithli',
    'Ebenezer Dimmsdale',
    'Hester Vega',
    'Honey Bunny',
    'Vincent Plant',
    'Butch Wallace',
    'Marsellus Coolidge',
    'Tuco',
    'Angel Boy',
    'Pablo Grimes',
    'Bounty Hunter',
    'Agent Smith',
    'Oracle',
    'Apoc State',
    'Switch',
    'Choi',
    'Angel Eyes',
    'Spoon Eyes',
    'Papillon',
    'Snooze 11',
    'Projectionist',
    'Landlady',
    'Ned Ramirez',
    'Pablo Shimada',
    'Sonny Zen',
    'Bruno Fox',
    'Joker',
    'Lucius Tattaglia',
    'Scareblow',
    'Sugar Crash',
    'Neurostatic',
    'Kambei Corleone',
    'Shichiroji Karatoza',
    'Kuninori Bun Lord',
    'Bun Pusher',
    'Etno',
    'Wiggly Corleone',
    'Magnetofon',
    'Hitpagadee',
    'Doge',
    'Doge Panda',
    'Doge Locamotiv',
    'Doge Bulls',
    'Doge Lavrinovich',
    'Dogecoin',
    'Ethereum',
    'BTC',
    'Cardano',
    'ETH',
    'Weeberblitz',
    'Arkadion',
    'Ninesouls',
    'Psycat',
    'Indoqueen',
    'DoubleDanceDragon',
    'Kinestetic Moves',
    'Zen Flash',
    'Orbit Escape',
    'Sin Azucar',
    'Particle Machine',
    'Spanglinga',
    'Pandalion',
    'Music Razor',
    'Bugzilla',
    'Bugz Bunuel',
    'Satoshi',
    'Nakamoto',
    'МЦ ДРУИД',
    'Jekaterina',
    'Quito',
    'Ouarzazate',
    'Bogota',
    'Essaouira',
    'Extremadura',
    'Guadalajara',
    'Apex',
    'Squarepusher',
    'Orbital',
    'Copycat',
    'Mozart',
    'Tesla',
    'Linux',
    'Ki',
    'Aphex Maiden',
    'Iron Twin'
]
avatar_path = "avatar.html";

if (user_data.g_icon == "") {
    user_data.g_icon = no_g_icon_img_url;
}
$("#user_name").text(user_data.username);
$("#user_email").text(user_data.email);
$("#user_id").text(user_data.user_id);
if (user_data.avatar_or_g_icon == 2 && user_data.g_icon !== null) {
    $(".profile_img_container").attr("data-avatar_or_google", "google");
    $("#profile_g_ico img").attr("src", user_data.g_icon);
} else {
    $(".profile_img_container").attr("data-avatar_or_google", "avatar");
    $("#profile_avatar").multiavatarr(user_data.avatar);
}
refresh_user_data();
$("#logout_from_elbatal").click(function () {

    if (user_data.loged_in_with_email == true) {
        user_data_token = {};
        user_data_token["u_id"] = user_data.user_id;
        user_data_token["dev_id"] = what_window.dev_id;
        $.ajax({
            url: elbatal_api + "accounts/accounts.php",
            type: 'POST',
            data: {
                action: "logout",
                token: mou_custom_encode(JSON.stringify(user_data_token))
            },
            success: function (res, textStatus, jqXHR) {
                // data = JSON.parse(MouDecrypt(res["d"], "ajhsbcjkas@#@!!@sc" + res["t"]));
                data = res;
                for (var i = 0; i < Object.keys(data.messages).length; i++) {
                    message_code = Object.keys(data.messages)[i];
                    message = data.messages[message_code];
                    if (message_code == 200) {
                        logout_from_elbatal();
                    }
                }

            }, error: function (jqXHR, error, errorThrown) {
                logout_from_elbatal();
            }
        })

    } else {
        logout_from_elbatal();
        // localStorage.removeItem("user_data");
        // if (typeof mouscripts !== "undefined") {
        //     mouscripts.logout_with_google();
        // }
        // window.parent.location.href = "index.html";
    }

})
$("#edit_user_data").click(function () {

    $("#user_data_editor").openpopup();
    console.log(user_data);
    $("#editor_user_name").val(user_data.username);
    $("#editor_user_email").val(user_data.email);
    $("#editor_user_id").val(user_data.user_id);
    $("#editor_profile_avatar").multiavatarr(user_data.avatar);
    $("#editor_profile_avatar").attr("data-avatar_code", user_data.avatar);

    $(".mou_avatars").html("");

    $(".editor_profile_img_container").attr("data-avatar_or_google", $(".profile_img_container").attr("data-avatar_or_google"));


    if ($(".profile_img_container").attr("data-avatar_or_google") == "google") {
        $("#editor_profile_g_icon img").attr("src", user_data.g_icon);
        g_img_active_class = " active";
        avatar_active_class = "";
    } else if ($(".profile_img_container").attr("data-avatar_or_google") == "avatar") {
        g_img_active_class = "";
        avatar_active_class = " active";
    }

    if (user_data.g_icon !== null) {

        an_avatar = $(`<div class="an_avatar${g_img_active_class}" data-avatar_or_google="google"><div class="img_container"><img src="${user_data.g_icon}"></div></div>`);
        $(".mou_avatars").append(an_avatar);
    }

    an_avatar = $(`<div class="an_avatar old_avatar ${avatar_active_class}" data-avatar_or_google="avatar" data-avatar_code="${user_data.avatar}"><div class="profile_image"></div></div>`);
    $(an_avatar).find(".profile_image").multiavatarr(user_data.avatar);
    $(".mou_avatars").append(an_avatar);

    for (i = 0; i < avatar_selector_data.length; i++) {
        this_avatar_code = avatar_selector_data[i];

        an_avatar = $(`<div class="an_avatar" data-avatar_or_google="avatar" data-avatar_code="${this_avatar_code}"><div class="profile_image"></div></div>`);
        $(an_avatar).find(".profile_image").multiavatarr(this_avatar_code);
        $(".mou_avatars").append(an_avatar);
    }


    old_avatar = $(".an_avatar.old_avatar").attr("data-avatar_code");
    $(".an_avatar .profile_image").each(function () {
        if (!$(this).parents(".an_avatar").hasClass("old_avatar")) {
            this_avatar_code = $(this).parents(".an_avatar").attr("data-avatar_code");
            if (old_avatar == this_avatar_code) {
                $(this).parents(".an_avatar").remove();
            }
        }
    });

});

$(".edit_avatar_btn").click(function () {
    $(".mou_avatars_selector_container").slideToggle(100);
});
var mouseDown = false;
var startX, scrollLeft, now_transformed;

(function ($) {
    $.fn.extend({
        add_mouse_scroller: function () {
            $this_div = $(this);

            $($this_div).on('mousemove', function (e) {
                e.preventDefault();
                if (!mouseDown) { return; } else {
                    $(this).attr("data-can_click", "false");
                }
                const x = e.pageX - $(this)[0].offsetLeft;
                const scroll = x - startX;
                $($this_div)[0].scrollLeft = scrollLeft - scroll;

            });
            $($this_div).on('mousedown', function (e) {

                mouseDown = true;
                startX = e.pageX - $(this)[0].offsetLeft;
                scrollLeft = $(this)[0].scrollLeft;
                // $(this).removeClass("scroll-snap");
            });
            $($this_div).on('mouseup', function () {
                mouseDown = false;
                setTimeout(function () {
                    $($this_div).attr("data-can_click", "true");
                }, 10);
                // $(this).addClass("scroll-snap");
                $(this)[0].scrollLeft = $(this)[0].scrollLeft;

            });
            $($this_div).on('mouseleave', function () {
                mouseDown = false;
            });

        }
    });
})(jQuery);

$(".mou_avatars_selector_container").add_mouse_scroller();

// $(document).on("click", ".an_avatar", function () {
//     $(".an_avatar").removeClass("active");
//     $(this).addClass("active");

// })

$(document).on("click", ".an_avatar ", function () {

    can_click = typeof $(this).parents(".mou_avatars_selector_container").attr("data-can_click") == "undefined" ? "true" : $(this).parents(".mou_avatars_selector_container").attr("data-can_click");

    if (can_click == "true") {
        if (!$(this).hasClass("active")) {

            avatar_or_google = $(this).attr("data-avatar_or_google");
            if (avatar_or_google == "avatar") {
                new_avatar_code = $(this).attr("data-avatar_code");
                $("#editor_profile_avatar").multiavatarr(new_avatar_code);
                $("#editor_profile_avatar").attr("data-avatar_code", new_avatar_code);
            } else {
                $("#editor_profile_g_icon img").attr("src", user_data.g_icon);
            }
            $(".editor_profile_img_container").attr("data-avatar_or_google", avatar_or_google);
            $(".an_avatar").removeClass("active");
            $(this).addClass("active");
        }
    }
});

$("#save_user_data").click(function () {
    new_user_name = $("#editor_user_name").val();
    new_user_id = $("#editor_user_id").val();
    new_user_email = $("#editor_user_email").val();
    new_user_avatar = $("#editor_profile_avatar").attr("data-avatar_code");
    avatar_or_g_icon = $(".editor_profile_img_container").attr("data-avatar_or_google") == "google" ? 2 : 1;
    var api_link = elbatal_api + "accounts/accounts.php";
    var api_time_out = 20 * 1000;

    if (new_user_name == "") {
        alert("يرجي ملئ البيانات المطلوبة .");
    } else {

        $.ajax({
            url: api_link,
            type: 'POST',
            timeout: api_time_out,
            data: {
                action: "update_user_data",
                new_user_name: new_user_name,
                new_user_id: new_user_id,
                new_user_email: new_user_email,
                new_user_avatar: new_user_avatar,
                avatar_or_g_icon: avatar_or_g_icon,
                dev_id: what_window.dev_id
            },
            success: function (res, textStatus, jqXHR) {
                // data = JSON.parse(MouDecrypt(res["d"], "ajhsbcjkas@#@!!@sc" + res["t"]));
                data = res;
                can_use_signup_form = true;
                $("#sign_up").html(`<i class="fas fa-sign-in"></i> تسجيل حساب جديد`);

                for (var i = 0; i < Object.keys(data.messages).length; i++) {
                    message_code = Object.keys(data.messages)[i];
                    message = data.messages[message_code];
                    if (message_code == 200) {
                        new_user_name = data.messages.user_name;
                        new_avatar_code = data.messages.avatar;
                        avatar_or_g_icon = data.messages.avatar_or_g_icon;

                        user_data.avatar = new_avatar_code;
                        user_data.user_name = new_user_name;
                        user_data.avatar_or_g_icon = avatar_or_g_icon;
                        $("#user_name").text(new_user_name);

                        if (avatar_or_g_icon == 1) {
                            $(".profile_img_container").attr("data-avatar_or_google", "avatar");
                            $("#profile_avatar").multiavatarr(new_avatar_code);
                        } else if (avatar_or_g_icon == 2) {
                            $(".profile_img_container").attr("data-avatar_or_google", "google");

                            $(".profile_img_container img").attr("src", user_data.g_icon)
                        }

                        localStorage.setItem("user_data", JSON.stringify(user_data));
                        $("#user_data_editor").closepopup();

                    }
                }

            }, error: function (jqXHR, error, errorThrown) {
                alert("خطأ");
            }
        })

    }




});

if (user_data.loged_in_with_email == false) {
    $("#edit_user_data").hide();
    $("#sub_btn").hide();
    $("#user_id_container").hide();
}


$("#sub_btn").on("click", function () {
    if ($(this).attr('disabled')) return false;;

    $("#subscription_container").show();
    $("#profile_container").hide();
    load_packs();
})

// [ START Subscription Scripts ]

var phone_payments_link = elbatal_api + "/accounts/phone_payments.php";
vodafone_num_for_send = "";
paypal_email_for_send = "";
etislat_num_for_send = "";
dollar_to_pound = "0";
function load_packs() {
    $("#pro_packs_list").html("");
    $.ajax({
        type: "POST",
        url: elbatal_api + "accounts/subscriptions/api.php",
        data: {
            action: "get_sub_packs",
        },
        success: function (data, textStatus, xhr) {
            $(".loader_packs").remove();
            for (var i = 0; i < Object.keys(data.messages).length; i++) {
                message_code = Object.keys(data.messages)[i];
                message = data.messages[message_code];
                if (message_code == 200) {
                    dollar_to_pound = data.messages.dollar_to_pound;
                    paypal_email_for_send = data.messages.paypal_email_for_send;
                    vodafone_num_for_send = data.messages.vodafone_num_for_send;
                    etislat_num_for_send = data.messages.etislat_num_for_send;
                    enable_paypal = data.messages.enable_paypal;

                    if (enable_paypal == true) {
                        $(`[data-meth="paypal"]`).show();
                    } else {
                        $(`[data-meth="paypal"]`).hide();
                    }
                    pro_packs = message;
                    for (i = 0; i < pro_packs.length; i++) {
                        pro_pack = pro_packs[i];
                        pro_pack_id = pro_pack["id"];
                        pro_pack_name = pro_pack["name"];
                        pro_pack_price = pro_pack["price"];
                        pro_pack_image = pro_pack["image"];
                        pro_pack_offer = pro_pack["offer"];

                        offer_div = "";
                        if (pro_pack_offer !== null) {
                            offer_div = `<div class="offer">${pro_pack_offer}</div>`
                        }
                        $("#pro_packs_list").append(`<button class="sub_card select_value" data-id="${pro_pack_id}" data-val="${pro_pack_price}">
                                    ${offer_div}
                                    <span class="vide_thump"></span>
                                    <div class="sub_container">
                                        <div class="sub_icon">
                                            <img class="sub_img" src="${pro_pack_image}" alt="">
                                        </div>
                                        <div class="sub_title">${pro_pack_name} - ${pro_pack_price}$</div>
                                    </div>
                                </button>`);

                    }


                    $("#paypal_email_for_send").text(paypal_email_for_send);
                    $("#vodafone_num_for_send").text(vodafone_num_for_send);
                    $("#etislat_num_for_send").text(etislat_num_for_send);
                    $(".dollar_to_pound").text(dollar_to_pound + " جنية");
                }
            }
        }, error: function (jqXHR, error, errorThrown) {

        }
    });
}

// $(document).on("click", ".subscribe_pro", function () {
//     var user_token = mou_custom_encode(JSON.stringify(user_data));
//     var sub_url = "http://192.168.1.2:8080/elbatal_users/subscription.php?token=" + user_token;
//     open_new_window_ext(sub_url);
// });
var donation_val = 0;
$(document).on("click", ".select_value", function () {
    user_id = user_data.user_id;
    product_id_selected = $(this).attr("data-id");
    donation_val = $(this).attr("data-val");

    $(".donation_val").text(donation_val + "$");
    $("#select_purchase_meth_popup").openpopup();
});
$(document).off("click", ".select_purchase");
$(document).on("click", ".select_purchase", function () {
    user_id = user_data.user_id;
    meth = $(this).attr("data-meth");
    if (meth == "paypal") {

        // paypal_fees = (4.9 * donation_val / 100) + 0.3;
        // $(".paypal_fees").text(paypal_fees.toFixed(2) + "$");
        // pay_val = (parseFloat(donation_val) + paypal_fees).toFixed(2);
        // $(".pounds_will_send").text(pay_val + "$");
        // $(`#${meth}`).openpopup();
        // paypal_me_link = `https://www.paypal.com/paypalme/MahmoudNabil1/${pay_val}usd`;
        // $("#paypalme").attr("onclick", `open_external_link(\`${paypal_me_link}\`)`)
        pay_link = elbatal_api + "paypal/buy/buy.php?u_id=" + user_id + "&p_id=" + product_id_selected;
        // if (typeof mouscripts !== "undefined") {
        open_external_link(pay_link);
        // } else {
        // open_external_link(pay_link);

        // myWindow = window.open(pay_link, '_blank', 'noopener, noreferrer');
        // }
    } else if (meth == "usdt") {
        pay_link = elbatal_api + "crypto/buy/buy.php?u_id=" + user_id + "&p_id=" + product_id_selected;
        open_external_link(pay_link);

    } else {
        pounds_will_send = parseFloat(donation_val) * parseFloat(dollar_to_pound);
        $(".pounds_will_send").text(pounds_will_send + " جنية");
        $(`#${meth}`).openpopup();
    }
    $("#select_purchase_meth_popup").closepopup();

});
var can_send_paypal_submit = true;
$("#submit_paypal").click(function () {
    user_id = user_data.user_id;
    paypal_sender_email = $("#paypal_sender_email").val();
    if (can_send_paypal_submit == true && can_send_donation_submit == true) {
        if (validateEmail(paypal_sender_email)) {
            $.ajax({
                url: phone_payments_link,
                type: 'POST',
                data: {
                    action: "donation_with_phone_cash",
                    user_id: user_id,
                    donation_value: donation_val,
                    sender_number: paypal_sender_email,
                    phone_cash_name: "PayPal",
                    product_id: product_id_selected
                },
                success: function (data) {

                    for (var i = 0; i < Object.keys(data.messages).length; i++) {
                        message_code = Object.keys(data.messages)[i];
                        message = data.messages[message_code];
                        if (message_code == 200) {
                            alert("تم ارسال بيانات الدفع بنجاح . شكرا لدعمك 😍");
                            $(`#${meth}`).closepopup();
                            $("#paypal_sender_email").val("");
                        } else if (message_code == 409) {
                            can_send_donation_submit = false;
                            donation_timer_distance = (parseInt(message) * 1000);
                            set_send_donation_timer();

                        }
                    }
                }, error: function (jqXHR, error, errorThrown) {

                }
            });


        } else {
            alert("يرجي التأكد من حساب الباي بال المرسل منه .");
        }
    }

});
var donation_timer_distance = 0;
var can_send_vf_cash_submit = true;
var can_send_donation_submit = true;
$("#submit_vodafone_cash").click(function () {
    user_id = user_data.user_id;
    vodafone_sender_number = $("#vodafone_sender_number").val();
    if (can_send_vf_cash_submit == true && can_send_donation_submit == true) {
        if (vodafone_sender_number.length == 11 && vodafone_sender_number.substring(0, 3) == "010") {
            can_send_vf_cash_submit = false;
            $.ajax({
                url: phone_payments_link,
                type: 'POST',
                data: {
                    action: "donation_with_phone_cash",
                    user_id: user_id,
                    donation_value: donation_val,
                    sender_number: vodafone_sender_number,
                    phone_cash_name: "VF-Cash",
                    product_id: product_id_selected
                },
                success: function (data) {
                    can_send_vf_cash_submit = true;

                    for (var i = 0; i < Object.keys(data.messages).length; i++) {
                        message_code = Object.keys(data.messages)[i];
                        message = data.messages[message_code];
                        if (message_code == 200) {
                            alert("تم ارسال بيانات الدفع بنجاح . شكرا لدعمك 😍");
                            $(`#${meth}`).closepopup();
                            $("#vodafone_sender_number").val("");
                        } else if (message_code == 409) {
                            can_send_donation_submit = false;
                            donation_timer_distance = (parseInt(message) * 1000);
                            set_send_donation_timer();


                        }
                    }
                }, error: function (jqXHR, error, errorThrown) {

                }
            });


        } else {
            alert("رقم هاتف خطأ. تأكد من رقم الهاتف الذي قمت بارسال المبلغ منه");
        }
    }

});

function set_send_donation_timer() {
    timers_minutes = zeroFill(Math.floor((donation_timer_distance % (1000 * 60 * 60)) / (1000 * 60)), 2);
    timers_seconds = zeroFill(Math.floor((donation_timer_distance % (1000 * 60)) / 1000), 2);
    $(`.purchase_meth_popup .mou_popup_body`).append(`<div class="mou_alert mou_danger donation_timer_alert"><div class="mou_alert-icon"><i class="far fa-exclamation-circle"></i></div><div class="mou_alert-message"><a>لا يمكن ارسال التأكيد مره اخري الا بعد <span class="donation_timer">${timers_seconds} : ${timers_minutes}</span></a></div></div>`);
    send_donation_timer = setInterval(function () {
        donation_timer_distance = donation_timer_distance - 1000;
        timers_minutes = zeroFill(Math.floor((donation_timer_distance % (1000 * 60 * 60)) / (1000 * 60)), 2);
        timers_seconds = zeroFill(Math.floor((donation_timer_distance % (1000 * 60)) / 1000), 2);
        $(".donation_timer").text(timers_minutes + ":" + timers_seconds);
        if (donation_timer_distance <= 0) {
            clearInterval(send_donation_timer);
            $(".donation_timer_alert").remove();
            can_send_donation_submit = true;
        }
    }, 1000);
}

var can_send_Etislat_cash_submit = true;
$("#submit_etislat_cash").click(function () {
    user_id = user_data.user_id;
    sender_number = $("#Etislat_sender_number").val();
    if (can_send_Etislat_cash_submit == true && can_send_donation_submit == true) {
        if (sender_number.length == 11 && sender_number.substring(0, 3) == "011") {
            $.ajax({
                url: phone_payments_link,
                type: 'POST',
                data: {
                    action: "donation_with_phone_cash",
                    user_id: user_id,
                    donation_value: donation_val,
                    sender_number: sender_number,
                    phone_cash_name: "Etislat-Cash",
                    product_id: product_id_selected
                },
                success: function (data) {

                    for (var i = 0; i < Object.keys(data.messages).length; i++) {
                        message_code = Object.keys(data.messages)[i];
                        message = data.messages[message_code];
                        if (message_code == 200) {
                            alert("تم ارسال بيانات الدفع بنجاح . شكرا لدعمك 😍");
                            $(`#${meth}`).closepopup();
                            $("#Etislat_sender_number").val("");
                        } else if (message_code == 409) {
                            can_send_donation_submit = false;
                            donation_timer_distance = (parseInt(message) * 1000);
                            set_send_donation_timer();

                        }
                    }
                }, error: function (jqXHR, error, errorThrown) {

                }
            });


        } else {
            alert("رقم هاتف خطأ. تأكد من رقم الهاتف الذي قمت بارسال المبلغ منه");
        }
    }

});

// [ END Subscription Scripts ]
$(".code_activation").click(function () {
    if ($(this).attr('disabled')) return false;;
    $("#code_activation_popup").openpopup();
});



function logout_an_device(device_name_will_logout, device_id_will_logout) {
    if (device_id_will_logout == what_window.dev_id) {
        if (!confirm("هل انت متأكد من تسجيل الخروج من حسابك علي هذا الجهاز ؟")) return false;
        $("#logout_from_elbatal").click();
    } else {
        if (!confirm("هل انت متأكد من تسجيل الخروج من حسابك علي جهاز \n" + device_name_will_logout)) return false;
    }
    user_data_token = {};
    user_data_token["u_id"] = user_data.user_id;
    user_data_token["dev_id"] = what_window.dev_id;
    user_data_token["device_id_will_logout"] = device_id_will_logout;
    $.ajax({
        type: "POST",
        url: elbatal_api + "accounts/accounts.php",
        data: {
            "action": "logout_an_device",
            token: mou_custom_encode(JSON.stringify(user_data_token))
        },
        success: function (res, textStatus, jqXHR) {
            // data = JSON.parse(MouDecrypt(res["d"], "ajhsbcjkas@#@!!@sc" + res["t"]));
            data = res;
            if (typeof res.messages[200] !== "undefined") {
                device_id_loged_out = res.messages[201];
                $(`[data-dev_id="${device_id_loged_out}"]`).remove();
            }
        }
    });

}

function open_distributors() {
    if (what_window.user_data.is_distributor) {
        open_external_link("https://distributors.elbatal-app.com/");

    }
}