var default_settings_vars = {
    download_apk: "1dm",
    continue_watch: true,
    watching_apk: "Elbatal",
    notify_data: {
        "movies": true,
        "sports": true
    }
};
var settings_vars = default_settings_vars;
if (localStorage.getItem("settings_vars") !== null) {
    settings_vars = JSON.parse(localStorage.getItem("settings_vars"));
    for (i = 0; i < Object.keys(default_settings_vars).length; i++) {
        default_settings_var = Object.keys(default_settings_vars)[i];
        if (typeof settings_vars[default_settings_var] == "undefined") {
            window.parent.settings_vars[default_settings_var] = default_settings_vars[default_settings_var];
        }
    }
}

notify_topics = {
    "افلام و مسلسلات": "movies",
    "رياضة": "sports"
};

for (i = 0; i < Object.keys(notify_topics).length; i++) {
    notify_title = Object.keys(notify_topics)[i];
    notify_topic = notify_topics[notify_title];
    switch_html = $(`
                <div class="setting_div_container">
                    <label for="${notify_topic}">${notify_title} : </label>
                    <label for="${notify_topic}" class="switch">
                        <input id="${notify_topic}" type="checkbox">
                        <span class="slider round"></span>
                    </label>
                </div>
           `);
    $(".notify_switches").append(switch_html);
}


init_settings();
function init_settings() {

    $(".notify_settings input").prop("checked", false);
    for (i = 0; i < Object.keys(notify_topics).length; i++) {
        notify_title = Object.keys(notify_topics)[i];
        notify_topic = notify_topics[notify_title];
        if (typeof window.parent.settings_vars.notify_data !== undefined) {
            notify_value = window.parent.settings_vars.notify_data[notify_topic];
            $(".notify_settings input#" + notify_topic).prop("checked", notify_value);
        }
    }
    $("#download_app_setting").val(window.parent.settings_vars.download_apk);
    $("#watching_app_setting").val(window.parent.settings_vars.watching_apk);

    $("#video_continue_watch").prop("checked", window.parent.settings_vars.continue_watch);
}
$("#Save_settings").click(function () {

    notify_data = {};
    $(".notify_switches .setting_div_container").each(function () {
        notify_key = $(this).find(`input`).attr("id");
        notify_val = $(this).find(`input`).is(":checked");
        notify_data[notify_key] = notify_val;
        if (typeof mouscripts !== "undefined") {
            if (notify_data[notify_key] == true) {
                mouscripts.subscribeNotificationsTopic(notify_key);
            } else {
                mouscripts.UnsubscribeNotificationsTopic(notify_key);
            }
        }
    })
    window.parent.settings_vars.notify_data = notify_data;
    window.parent.settings_vars.download_apk = $("#download_app_setting").val();
    window.parent.settings_vars.watching_apk = $("#watching_app_setting").val();
    window.parent.settings_vars.continue_watch = $("#video_continue_watch").is(":checked");
    localStorage.setItem("settings_vars", JSON.stringify(window.parent.settings_vars));


    Toastify({
        text: "تم حفظ الإعدادات بنجاح",
        duration: 3000,
        newWindow: true,
        close: false,
        gravity: "bottom", // `top` or `bottom`
        position: "center",
        backgroundColor: "#198754",
    }).showToast();
});


$("#fix_watch_servers").click(function () {
    localStorage.removeItem("local_servers_domains");
    showToast("تم الإصلاح بنجاح .")
});

// localStorage.setItem("settings_vars", JSON.stringify(settings_vars));

// $("#download_app_setting").change(function () {
//     settings_vars.download_apk = $(this).val();
//     save_settings();
// });

// $("#video_continue_watch").change(function () {
//     settings_vars.continue_watch = $("#video_continue_watch").is(":checked");
//     save_settings();
// });
// $("#video_continue_watch").attr("checked", settings_vars.continue_watch);

// $("#download_app_setting").val(settings_vars.download_apk);

// function save_settings() {
//     localStorage.setItem("settings_vars", JSON.stringify(settings_vars));
// }
