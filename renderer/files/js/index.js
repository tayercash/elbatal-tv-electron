var fav_imgs_dir = "/user_data/fav_imgs/";
var db;
let dbName = "Elbatal_app";

what_window.enable_play_on_another_dev = true;

var get_app_db = function (callback) {

    if (typeof what_window.db !== "undefined") {
        callback(what_window.db);
    } else {
        let openRequest = indexedDB.open(dbName, 1);
        openRequest.onsuccess = (event) => {
            db = event.target.result;
            callback(db);
        };
        openRequest.onerror = (event) => {
            console.error("Why didn't you allow my web app to use IndexedDB?!");
        };

        openRequest.onupgradeneeded = (event) => {
            const db = event.target.result;
            const storeName = 'favs';


            if (db.objectStoreNames.contains(storeName)) {
                const store = request.transaction.objectStore(storeName);
                store.createIndex('synced_vid_id', 'synced_vid_id', { unique: false });
            } else {
                // Or create it from scratch if needed
                const FavsStore = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
                FavsStore.createIndex("title", "title", { unique: false });
                FavsStore.createIndex("query", "query", { unique: true });
                FavsStore.createIndex("img_file", "img_file", { unique: false });
                FavsStore.createIndex("server_img_url", "server_img_url", { unique: false });
                FavsStore.createIndex("server_name", "server_name", { unique: false });
                FavsStore.createIndex("synced", "synced", { unique: false });
                FavsStore.createIndex('synced_vid_id', 'synced_vid_id', { unique: false });
            }

            // switch (event.oldVersion) { // existing db version
            //     case 0:
            //         FavsStore = db.createObjectStore("favs", { keyPath: 'id', autoIncrement: true });
            //         FavsStore.createIndex("title", "title", { unique: false });
            //         FavsStore.createIndex("query", "query", { unique: true });
            //         FavsStore.createIndex("img_file", "img_file", { unique: false });
            //         FavsStore.createIndex("server_img_url", "server_img_url", { unique: false });
            //         FavsStore.createIndex("server_name", "server_name", { unique: false });
            //         FavsStore.createIndex("synced", "synced", { unique: false });
            //         FavsStore.createIndex('synced_vid_id', 'synced_vid_id', { unique: false });

            //         FavsStore.transaction.oncomplete = (event) => { };

            //     case 1:
            //         FavsStore.createIndex('synced_vid_id', 'synced_vid_id', { unique: false });

            // }


        };
    }

};



function onruseme_function() {
}
function onpause_function() {
}


// side nav
var close_on_mouse_up = false;

$(".openside_nav").click(function () {
    $(".sidenav").show_side_nav();
});

var mousePos = { x: undefined, y: undefined };
function update_mouse_pos(event) {
    if (typeof event.touches !== "undefined") {
        mousePos = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    } else {
        mousePos = { x: event.clientX, y: event.clientY };
    }
}
$(window).off('mousemove touchstart', update_mouse_pos).on('mousemove touchstart', update_mouse_pos);


$(".sidenav").on("mousedown touchstart", function (e) {
    close_on_mouse_up = false;
    if (typeof e.touches !== "undefined") {
        now_mouse_x = e.touches[0].clientX;
    } else {
        now_mouse_x = mousePos.x;
    }

    $(".sidenav").off('mousemove touchmove').on('mousemove touchmove', (event) => {
        if (typeof event.touches !== "undefined") {
            new_mouse_x = event.touches[0].clientX;
        } else {
            new_mouse_x = event.clientX;
        }

        distance = new_mouse_x - now_mouse_x;


        html_dir = $("html").attr("dir");
        if (html_dir == "rtl") {

            if (distance > 0) {
                $(".app_sidenav").attr("style", `transform:translateX(${distance}px);`).addClass("app_sidenav_zero_trans");
                close_on_mouse_up = true;

            } else if (distance < 0) {
                close_on_mouse_up = false;
            }

        } else if ("ltr") {

            if (distance < 0) {
                $(".app_sidenav").attr("style", `transform:translateX(${distance}px);`).addClass("app_sidenav_zero_trans");
                close_on_mouse_up = true;

            } else {
                close_on_mouse_up = false;
            }

        }


    });


}).on("mouseup touchend", function () {

    if (close_on_mouse_up) {
        $(".app_sidenav").removeClass("app_sidenav_zero_trans");

        $("#" + $(this).attr("id")).hide_side_nav();
    }
    $(".sidenav").off('mousemove');
    $(".app_sidenav").removeAttr("style");
}).click(function () {
    $(".app_sidenav").removeClass("app_sidenav_zero_trans");
    if ($(this).attr("data-lockpopup") !== "true") {
        $("#" + $(this).attr("id")).hide_side_nav();
    }

}).children().click(function (e) {
    return false;
});


$(".sidenav").click(function () {
    if ($(this).attr("data-lockpopup") !== "true") {
        $("#" + $(this).attr("id")).hide_side_nav();
    }
}).children().click(function (e) {
    return false;
});

(function ($) {
    $.fn.extend({
        show_side_nav: function () {
            $(this).addClass("show").removeClass("hide");
            $("body").css("overflow", "hidden");
            this_side_nav = $(this);
            what_window.back_buttons_functions.Unshift(function () {
                $(this_side_nav).closepopup();
            });
        }
    });
})(jQuery);
(function ($) {
    $.fn.extend({
        hide_side_nav: function () {
            $(this).removeClass("show").addClass("hide");
            $("body").css("overflow", "unset");
            now_active_panal = $(".navigation ul li.list.active").index();
            what_window["back_buttons_functions_" + now_active_panal].shift();
        }
    });
})(jQuery);

$(".side_nav_drop_down_container").click(function () {

    $(this).toggleClass("active");

});

// End Sidenav
// dropdown
function open_dropdown(this_btn) {
    this_drop_down = $(this_btn).parents(".dropdown").find(".dropdown-content");
    $(".dropdown-content.show").not(this_drop_down).removeClass("show");

    $(this_btn).parents(".dropdown").find(".dropdown-content").toggleClass("show");
}
$(window).on("click", function (event) {
    can_close = true;
    if ($(event.target).parents(".dropdown").length > 0) {
        can_close = false;
    }
    if ($(event.target).hasClass("dropdown-content") || $(event.target).parents(".dropdown-content").length > 0) {
        can_close = true;
    }
    if (can_close) {
        $(".dropdown-content").removeClass("show");
    }
});
// End dropdown
// downloads js
function open_downloads() {
    $(".sidenav").hide_side_nav();
    // $("#downloads").openpopup();
    // what_window.back_buttons_functions.Unshift(function () {
    //     $("#downloads").closepopup();
    // });
    // alert(mouscripts.is_package_installed("com.dv.adm"));
    if (settings_vars.download_apk == "adm") {
        mouscripts.open_adm();
    } else if (settings_vars.download_apk == "1dm") {
        mouscripts.open_1dm();
    } else if (settings_vars.download_apk == "1dm+") {
        mouscripts.open_1dm_pluse();
    }
}
function open_settings() {
    init_settings();
    $(".sidenav").hide_side_nav();
    $("#settings").openpopup();
}
function open_app_info() {
    $("#app_info").openpopup();

    config_file_link = "https://mou.elbatal-app.com/users/app_config.php";
    $.ajax({
        type: "GET",
        url: config_file_link,
        dataType: "text",
        success: function (res, textStatus, xhr) {
            res = JSON.parse(what_window.MouDecrypt(res, "c!xZj+N9saASFF&G@Ev@vw" + xhr.getResponseHeader('t')));

            if (typeof mouscripts !== "undefined") {
                $("#app_version").text(res.Latest_Apk_version);

            } else if (typeof what_window.electron !== "undefined") {
                $("#app_version").text(res.Latest_exe_version);

            }

            $("#app_files_version").text(res.app_version);
        }
    });
    if (typeof mouscripts !== "undefined") {
        webview_data = JSON.parse(mouscripts.get_webview_data());
        $("#webview_app").text(webview_data.packageName);
        $("#webview_app_version").text(webview_data.version_name);
        $("#Update_webview_app").attr("data-update_url", "https://play.google.com/store/apps/details?id=" + webview_data.packageName);
    }
    $("#screen_width").text(screen.width);
    $("#screen_height").text(screen.height);
    $("#screen_dpi").text(Detector.dpi);
}
function copy_app_info() {
    info_text = "";
    $(".info_container").each(function () {
        info_text += $(this).find("h1").text().trim() + "\n";
        $(this).find("a.an_info").each(function () {
            info_text += $(this).text().trim() + "\n";
        });
        info_text += "\n";
    });
    copyTextToClipboard(info_text);
}
$(document).on("click", "#Update_webview_app", function () {
    open_external_link($("#Update_webview_app").attr("data-update_url"));
});
function open_favs() {
    $(".sidenav").hide_side_nav();

    $('[data-full_iframe_target_url="favs.html"]').click();

    // $("#favs").openpopup();
    // what_window.back_buttons_functions.Unshift(function () {
    //     $("#favs").closepopup();
    // });
}
function open_contact_us() {
    $(".sidenav").hide_side_nav();
    $("#contact_us").openpopup();
    // back_buttons_functions.Unshift(function () {
    //     $("#contact_us").closepopup();
    // });
}

// var downloads_db = openDatabase('app_Downloads_db', '1.0', 'Downloads', 5 * 1024 * 1024);
// downloads_db.transaction(function (transaction) {
//     transaction.executeSql(`CREATE TABLE IF NOT EXISTS downloads 
//     (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
//     path TEXT NOT NULL,
//     file_name TEXT NOT NULL,
//     file_ext VARCHAR(50) NOT NULL,
//     file_link TEXT NOT NULL,
//     start_at int(20) NOT NULL,
//     full_size VARCHAR(50) NOT NULL,
//     downloaded_size VARCHAR(50) NOT NULL,
//     dl_status int(1) not NULL,
//     stoped_by_user int(1) not NULL,
//     type VARCHAR(50) NOT NULL,
// 	err_res TEXT NOT NULL,
// 	custom_headers TEXT NOT NULL
//     )`, undefined, function () { }, function (transaction, err) {
//         console.log(err.message);
//     });
// });

// downloads_db.transaction(function (transaction) {
//     transaction.executeSql("SELECT * FROM downloads ORDER BY id DESC", undefined, function (transaction, result) {
//         if (result.rows.length) {
//             for (var i = 0; i < result.rows.length; i++) {
//                 row = result.rows.item(i);
//                 id = row.id;
//                 path = row.path;
//                 file_name = row.file_name;
//                 file_ext = row.file_ext;
//                 file_link = row.file_link;
//                 start_at = row.start_at;
//                 full_size = row.full_size;
//                 downloaded_size = row.downloaded_size;
//                 dl_status = row.dl_status;
//                 stoped_by_user = row.stoped_by_user;
//                 type = row.type;
//                 err_res = row.err_res;
//                 custom_headers = row.custom_headers;
//                 add_download_div(id, path, file_name, file_ext, file_link, start_at, full_size, downloaded_size, dl_status, type, stoped_by_user, err_res, custom_headers);
//             }
//             ready_downloading_progress();
//         }
//     })
// });
function get_extension_from_link(link) {
    return link.split(/[#?]/)[0].split('.').pop().trim();
}
function getFileExtension(url) {
    const match = url.match(/\.(\w+)(?:\?|$)/);
    return match ? match[1] : null;
}
function add_for_downlaod(file_dir = "", file_name = "", file_ext = false, file_link = false, type = "", custom_headers = "{}") {

    new_downlaod({
        file_dir: file_dir,
        file_name: file_name,
        file_ext: file_ext,
        file_link: file_link,
        type: type,
        custom_headers: custom_headers
    });
    // if (file_ext == false) {
    //     file_ext = getFileExtension(file_link);
    //     if (file_ext == "m3u8") {
    //         file_ext = "mp4";
    //     }
    // }
    // file_name = file_name.trim();

    // if (typeof mouscripts !== "undefined") {
    //     if (settings_vars.download_apk == "adm") {
    //         mouscripts.download_with_adm(file_link, file_name + file_ext);
    //     } else if (settings_vars.download_apk == "1dm") {
    //         mouscripts.download_with_1dm(file_link, file_name + file_ext);
    //     } else if (settings_vars.download_apk == "1dm+") {
    //         mouscripts.download_with_1dm_pluse(file_link, file_name + file_ext);
    //     }
    // } else if (typeof what_window.electron !== "undefined") {
    //     // what_window.ipcRenderer.send('check-idm');

    //     what_window.ipcRenderer.send('download-m3u8', [file_link, file_name + "." + file_ext, JSON.parse(fixSingleQuotes(custom_headers))]);
    // } else {
    //     link_elmnt = $("<a/>").attr("href", file_link).attr("download", "").attr("_target", "blank").attr("style", "display:none;");
    //     $("body").prepend(link_elmnt);
    //     $(link_elmnt)[0].click();
    //     $(link_elmnt).remove();
    // }

}

function getFinalUrlAndType(url, callback) {
    var videoMimeTypes = {
        'mp4': 'video/mp4',
        'avi': 'video/x-msvideo',
        'mkv': 'video/x-matroska',
        'mov': 'video/quicktime',
        'webm': 'video/webm',
        'flv': 'video/x-flv',
        'wmv': 'video/x-ms-wmv',
        'm4v': 'video/x-m4v',
        '3gp': 'video/3gpp',
        'mpd': 'application/dash+xml',
        'mp3': 'audio/mpeg',
        'aac': 'audio/aac',
        'wav': 'audio/wav',
        'ogg': 'audio/ogg',
        'flac': 'audio/flac',
        'm4a': 'audio/x-m4a',
        'wma': 'audio/x-ms-wma',
        'm3u8': 'application/vnd.apple.mpegurl'
    };

    res = {};
    res["url"] = url;
    url = res["url"].trim();

    urlObj = new URL(url);
    pathname = urlObj.pathname;
    extension = pathname.substring(pathname.lastIndexOf('.') + 1);
    res["type"] = videoMimeTypes[extension] || null;  // Returns the MIME type or null if not found
    res["ext"] = Object.keys(videoMimeTypes).find(key => videoMimeTypes[key] === res["type"]) || null;

    fetch(url, {
        method: 'HEAD',
        redirect: 'follow' // Follow redirects
    })
        .then(response => {
            res["url"] = response.url;

            url = res["url"].trim();
            urlObj = new URL(url);
            pathname = urlObj.pathname;
            extension = pathname.substring(pathname.lastIndexOf('.') + 1);


            response.headers.forEach((value, name) => {
                if (name == "content-type") {
                    res["type"] = value.split(',')[0].trim();
                }
            });
            res["ext"] = Object.keys(videoMimeTypes).find(key => videoMimeTypes[key] === res["type"]) || extension || null;

            res["type"] = res["type"] !== null ? res["type"] : videoMimeTypes[extension] || null;  // Returns the MIME type or null if not found

            callback(res); // Return the final URL after redirects
        })
        .catch(error => {
            console.error('Error fetching URL:', error);
            callback(res);
        });
}
function fast_download(title, link, headers = '{}', file_ext = false) {
    new_downlaod({
        file_name: title,
        file_link: link,
        custom_headers: headers,
        file_ext: file_ext
    });
}
function new_downlaod({
    file_dir = "",
    file_name = "",
    file_ext = false,
    file_link = false,
    type = "",
    custom_headers = "{}"
} = {}) {

    if (file_ext == false) {
        file_ext = getFileExtension(file_link);
        if (file_ext == "m3u8") {
            file_ext = "mp4";
        }
    }
    file_name = file_name.trim();
    custom_headers = fixSingleQuotes(custom_headers);

    if (typeof what_window.electron !== "undefined") {
        getFinalUrlAndType(file_link, function (data) {
            file_link = data["url"];
            file_ext = data["ext"];
            // what_window.ipcRenderer.send('check-idm');

            if (file_ext == "m3u8") {
                console.log(file_ext);
            }

            what_window.ipcRenderer.send('download-m3u8', [file_link, file_name + "." + file_ext, JSON.parse(custom_headers)]);


        })
    } else if (typeof mouscripts !== "undefined") {
        if (settings_vars.download_apk == "adm") {
            mouscripts.download_with_adm(file_link, file_name, custom_headers);
        } else if (settings_vars.download_apk == "1dm") {
            mouscripts.download_with_1dm(file_link, file_name, custom_headers);
        } else if (settings_vars.download_apk == "1dm+") {
            mouscripts.download_with_1dm_pluse(file_link, file_name, custom_headers);
        }

    } else {
        link_elmnt = $("<a/>").attr("href", file_link).attr("download", "").attr("_target", "blank").attr("style", "display:none;");
        $("body").prepend(link_elmnt);
        $(link_elmnt)[0].click();
        $(link_elmnt).remove();
    }
}
function request_storage_permissoin(callback) {
    var callback_function = callback;
    window["return_request_storage_permissoin"] = function (res) {
        callback_function(res);
    };
    mouscripts.request_storage_permissoin("return_request_storage_permissoin");
}

function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

function toggle_pause(this_btn) {
    file = $(this_btn).parents(".file");
    is_paused = $(this_btn).attr("data-is_paused") == "false" ? false : true;
    file_id = $(file).attr("data-file_id");
    if (is_paused) {
        file_link = $(file).attr("data-file_link");
        file_dir = $(file).attr("data-file_dir");
        file_name = $(file).attr("data-file_name");
        file_ext = $(file).attr("data-file_ext");
        custom_headers = $(file).find("data#custom_headers").html();
        mouscripts.download_file_now(file_link, file_dir, file_name + "." + file_ext, file_id, true, custom_headers);

        downloads_db.transaction(function (transaction) {
            transaction.executeSql(`UPDATE downloads SET dl_status=1 WHERE id='${file_id}'`, undefined, function () {
                $(this_btn).attr("data-is_paused", "false");
                $(this_btn).attr("data-dl_status", "1");

            }, function (transaction, err) {
                alert(err.message);
            })
        });

    } else {
        mouscripts.pause_downloading(file_id);
        downloads_db.transaction(function (transaction) {
            transaction.executeSql(`UPDATE downloads SET stoped_by_user=1 WHERE id='${file_id}'`, undefined, function () {
                $(this_btn).attr("data-is_paused", "true");
                $(this_btn).attr("data-dl_status", "2");

            }, function (transaction, err) {
                alert(err.message);
            });
        });
    }
    ready_downloading_progress();

}
function file_resuming(file_id) {
    $("#download_files .file[data-file_id='" + file_id + "'] .toggle_pause").attr("data-is_paused", "false").html(`<i class="fal fa-pause-circle fa-lg"></i>`);
}

function contact_us_submit() {
    contact_user_name = $("#contact_user_name").val();
    contact_email = $("#contact_email").val();
    contact_message = $("#contact_message").val();
    if (contact_user_name == "") {
        showToast("يرجي ادخال الاسم !");
    }
    if (contact_email == "") {
        showToast("يرجي ادخال الايميل !");
    }
    if (contact_message == "") {
        showToast("يرجي ادخال الرساله !");
    }
    if (contact_user_name == "" || contact_email == "" || contact_message == "") {
        return;;
    }
    telegram_msg = encodeURIComponent(`<b>الاسم</b> : <strong>${contact_user_name}</strong>\n<b>ايميل</b> : <strong>${contact_email}</strong>\n\n${contact_message}`);

    telegram_token = "6220016110:AAFD5xCKAmFZgDUL3FTmMV_MpwLBMLm1FHY";
    chat_id = "2140799570";
    telegram_msg_link = `https://api.telegram.org/bot${telegram_token}/sendMessage?chat_id=${chat_id}&parse_mode=HTML&text=${telegram_msg}`;
    $.ajax({
        "type": "GET",
        "url": telegram_msg_link,
        success: function (res) {
            if (typeof res.ok !== "undefined" && res.ok == true) {
                $("#contact_us").closepopup();
                $("#contact_user_name").val("");
                $("#contact_email").val("");
                $("#contact_message").val("");
                showToast("تم الارسال بنجاح");
            } else {
                showToast("حدث خطأ اثناء الارسال");
            }
        }
    })
}

function showToast(msg) {
    if (typeof mouscripts !== "undefined") {
        mouscripts.showToast(msg);
    } else {
        alert(msg);
    }
}
function share_app() {
    app_version = mouscripts.apk_version();

    share_text = `تطبيق البطل\nالاصدار الاخير : ${app_version}\n\n✅ افضل تطبيق لمشاهدة المباريات والأفلام والمسلسلات مجانا\nيجمع التطبيق محتوي اكبر المنصات في تطبيق واحد\nكما يعرض جدول المباريات ، وفيديوهات رياضية\n\n✅ رابط تحميل التطبيق\n\nhttps://www.elbatal-app.com`;
    share_text_to_apps(share_text, share_text);
}
function share_text_to_apps(title = "", text = false) {
    if (text !== false) {
        mouscripts.share_text_to_apps(title, text);
    }
}
function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'نجح' : 'فشل';
        showToast('حالة النسخ : ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
    }
    document.body.removeChild(textArea);
}

function base64ToHex(base64) {
    // Decode base64 to binary string
    if (typeof what_window.electron !== "undefined") {
        binary = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    } else if (typeof what_window.mouscripts !== "undefined") {
        binary = atob(base64.replace(/-/g, '+').replace(/_/g, '/').replace(/=+$/, ''));
    }

    // Convert binary string to hexadecimal
    return Array.from(binary, byte => byte.charCodeAt(0).toString(16).padStart(2, '0')).join('');
}
function convertJWKToKidKeyFormat(jwk) {
    const kidHex = base64ToHex(jwk.keys[0].kid);
    const keyHex = base64ToHex(jwk.keys[0].k);
    return `${kidHex}:${keyHex}`;
}


function play_vid(src_link, full_title, useragent, headers, continue_watch_code = "", continue_watch = false, Player_name = window.parent.settings_vars.watching_apk, is_hls_checked = false, assets_js = "", where_assets_js_file = "", DrmScheme = "clearkey", DrmLicenceUrl = "", whatWebPlayer = "onlineWebPlayer") {
    if (typeof mouscripts !== "undefined") {
        if (continue_watch == false) {
            continue_watch = settings_vars.continue_watch;
        }

        // if (typeof settings_vars.watching_apk !== "undefined" && settings_vars.watching_apk !== "") {
        //     watching_player = settings_vars.watching_apk;
        // } else {
        //     watching_player = "Elbatal";
        // }

        now_watching_apk = Player_name;
        // if (now_watching_apk == "Elbatal") {
        //     if (!mouscripts.is_package_installed("com.mouscripts.bplayer")) {
        //         Mx_Prompt = confirm("تطبيق ELPlayer غير موجود \n يرجي تثبيت ELPlayer حتي تستطيع المشاهدة .");
        //         if (Mx_Prompt) {
        //             open_external_link("https://play.google.com/store/apps/details?id=com.mouscripts.bplayer");
        //         }
        //         return false;;
        //     }
        // } else

        if (now_watching_apk == "MX_Player") {
            if (!mouscripts.is_package_installed("com.mxtech.videoplayer.ad")) {
                Mx_Prompt = confirm("تطبيق MX Player غير موجود \n يرجي تثبيت MX Player حتي تستطيع المشاهدة .");
                if (Mx_Prompt) {
                    open_external_link("https://play.google.com/store/apps/details?id=com.mxtech.videoplayer.ad");
                }
                return false;;
            }
        } else if (now_watching_apk == "MX_Player_Pro") {
            if (!mouscripts.is_package_installed("com.mxtech.videoplayer.pro")) {
                Mx_Prompt = confirm("تطبيق MX Player Pro غير موجود \n يرجي تثبيت MX Player Pro حتي تستطيع المشاهدة .");
                if (Mx_Prompt) {
                    open_external_link("https://play.google.com/store/apps/details?id=com.mxtech.videoplayer.pro");
                }
                return false;;
            }
        }

        // if (DrmLicenceUrl !== "") {

        //     now_watching_apk = "WebPlayer";

        //     player_file_path = is_app_in_dev_mode ? getFolderPathUntil("project") : ("file://" + getFolderPathUntil("project", mouscripts.get_index_link()) + "/");

        //     var DrmLicenceUrl = btoa(DrmLicenceUrl).split("").reverse().join("");


        //     src_link = player_file_path + "files/plyr/plyr.html?data=" + btoa(encodeURI(encodeQueryData({
        //         vid_title: full_title,
        //         vid_link: src_link,
        //         useragent: useragent,
        //         headers: headers,
        //         DrmLicenceUrl: encrypted_drm
        //     })));

        // }

        // mouscripts.play_vid(src_link, full_title, useragent, headers, what_window["e_m"], continue_watch, continue_watch_code, now_watching_apk, is_hls_checked, assets_js, where_assets_js_file, DrmScheme, DrmLicenceUrl);



        if (DrmLicenceUrl !== "") {
            DrmLicenceUrl = mouFormatDRM(DrmLicenceUrl);
        }
        var encrypted_drm = DrmLicenceUrl == "" ? "" : btoa(DrmLicenceUrl).split("").reverse().join("");


        mouscripts.play_vid(src_link, full_title, useragent, headers, what_window["e_m"], continue_watch, continue_watch_code, now_watching_apk, is_hls_checked, assets_js, where_assets_js_file, DrmScheme, encrypted_drm, whatWebPlayer);


    } else if (typeof what_window.electron !== "undefined") {

        if (DrmLicenceUrl !== "") {
            DrmLicenceUrl = mouFormatDRM(DrmLicenceUrl);
            console.log(DrmLicenceUrl);
        }
        var encrypted_drm = btoa(DrmLicenceUrl).split("").reverse().join("");

        window.open("files/plyr/plyr.html?data=" + btoa(encodeURI(encodeQueryData({
            vid_title: full_title,
            vid_link: src_link,
            useragent: useragent,
            headers: headers,
            DrmLicenceUrl: encrypted_drm,
            continue_watch: continue_watch,
            continue_watch_code: continue_watch_code,
            userId: user_data.user_id,
        })), "_blank"));
        // headers = JSON.parse(fixSingleQuotes(headers));
        // const headersArray = JSON.stringify(Object.entries(headers).map(([key, value]) => `${key}: ${value}`));
        // what_window.ipcRenderer.send('launch-mpv', [encodeURI(src_link), encodeURIComponent(headersArray)]);


    } else {
        console.log(full_title + "\n" + src_link + "\n" + useragent + "\n" + headers);
    }
}


function mouFormatDRM(drmInput) {
    if (!drmInput) return null;

    // 1. دالة ذكية للتحويل إلى Hex سواء كان المدخل Base64 أو هو أصلاً Hex
    function ensureHex(input) {
        let cleanInput = input.trim();

        // فحص: هل النص عبارة عن Hex (يتكون فقط من 0-9 و a-f وطوله 32 حرفاً للـ DRM)
        const isHex = /^[0-9a-fA-F]{32}$/.test(cleanInput);
        if (isHex) return cleanInput.toLowerCase();

        // إذا لم يكن Hex، نفترض أنه Base64 ونقوم بتحويله
        try {
            // معالجة صيغة URL Safe و Padding
            const s = cleanInput.replace(/-/g, '+').replace(/_/g, '/');
            const decoded = atob(s);
            const array = new Uint8Array(decoded.length);
            for (let i = 0; i < decoded.length; i++) {
                array[i] = decoded.charCodeAt(i);
            }
            // تحويل الـ Array إلى Hex
            return Array.from(array)
                .map(b => b.toString(16).padStart(2, '0'))
                .join('')
                .toLowerCase();
        } catch (e) {
            console.error("خطأ في معالجة المدخل (ليس Hex ولا Base64 سليم):", input);
            return null;
        }
    }

    try {
        let trimmedInput = drmInput.trim();

        if (trimmedInput.includes(':')) {
            let parts = trimmedInput.split(':');
            let rawKid = parts[0].trim();
            let rawKey = parts[1].trim();

            let kidHex = ensureHex(rawKid);
            let keyHex = ensureHex(rawKey);

            if (kidHex && keyHex) {
                // إرجاع النتيجة بالهيئة المطلوبة (KID:KEY)
                return `${kidHex}:${keyHex}`;
            }
        }
    } catch (e) {
        console.error("DRM Processing Error:", e);
        return null;
    }
    return null;
}

function getFolderPathUntil(folderName, cust_path = false) {
    let path = cust_path != false ? cust_path : window.location.href; // Get the full file URL
    let index = path.indexOf(`/${folderName}/`);

    if (index !== -1) {
        return path.substring(0, index + folderName.length + 1);
    }

    // If "project" is not found, remove the filename and return the folder path
    return path.substring(0, path.lastIndexOf("/") + 1);
}


function fixSingleQuotes(jsonStr) {
    // Replace single quotes with double quotes
    const fixedStr = jsonStr.replace(/'/g, '"');

    try {
        // Try to parse the fixed JSON string
        return fixedStr;
    } catch (error) {
        console.error("Invalid JSON string", error);
        return null;
    }
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
            return decodeURIComponent(pair[1]);
        }
    }
    return (false);
}
function get_share_qery(callback) {
    if (getQueryVariable("share_id") !== false || getQueryVariable("opend_link") !== false) {

        if (getQueryVariable("share_id") !== false) {
            share_id = getQueryVariable("share_id");
        }
        link_want_open = getQueryVariable("opend_link");
        if (/\/share\/[0-9]+/.test(link_want_open)) {
            share_id = /\/share\/([0-9]+)/.exec(link_want_open)[1];
        }
        $.ajax({
            type: "POST",
            url: "https://mou.elbatal-app.com/app/share.php",
            data: {
                action: "get_share_id",
                share_id: share_id,
            },
            success: function (data, textStatus, xhr) {
                callback(true, "?" + data.share_query)
            }, error: function (jqXHR, error, errorThrown) {
                callback(false);
            }
        });
    } else if (getQueryVariable("play_film") !== false) {
        callback(true, window.location.search);
    }
}

$(".app_sidenav").on("click", ".app_icons a", function () {
    this_btn_link = $(this).attr("href");
    mouscripts.open_external_link(this_btn_link);
});

// alert(mouscripts.isproinstalled());


$(document).on("click", "[data-open_tab_id]", function () {
    tabs_container = $(this).attr("data-tabs_container");
    tab_id = $(this).attr("data-open_tab_id");
    $("[data-tabs_container] .tab_contnet").removeClass("active");
    $(`[data-tabs_container="${tabs_container}"] .tab_contnet[data-tab_id="${tab_id}"]`).addClass("active");
    $(this).parents(".tabs_buttons").find(".tab_button").removeClass("active");
    $(this).addClass("active");
});

// $(document).on("click", ".add_to_fav", function () {
//     this_btn = $(this);
//     app_db.transaction(function (transactionn) {
//         transactionn.executeSql(`SELECT id FROM favs WHERE title='${film_data.title}' AND server_name='${now_server_name}'`, undefined, function (transaction, result) {

//             if (result.rows.length > 0) {
//                 // remove from fav
//                 if (result.rows.length > 0) {
//                     row = result.rows.item(0);
//                     id = row.id;
//                     app_db.transaction(function (transaction) {
//                         transaction.executeSql(`DELETE FROM favs WHERE title='${film_data.title}' AND server_name='${now_server_name}'`, [], function () {
//                             $(this_btn).removeClass("active");
//                             $(this_btn).find("i").remove();
//                             $(this_btn).html(`<i class="fal fa-heart"></i>`);
//                             $(`#fav_posts a[data-id='${id}']`).remove();
//                         }, function (transaction, err) {
//                             console.log(err.message);
//                         })
//                     })

//                 }
//             } else {
//                 // add to fav

//                 local_img_name = film_data.img;
//                 app_db.transaction(function (transaction) {
//                     transaction.executeSql("INSERT INTO favs(title,query,img_url,server_img_url,server_name) VALUES(?,?,?,?,?)", [film_data.title, query_data, local_img_name, film_data.img, now_server_name], function (tx, sql_res) {
//                         lastInsertId = sql_res.insertId;

//                         $(this_btn).addClass("active");
//                         $(this_btn).find("i").remove();
//                         $(this_btn).html(`<i class="fad fa-heart"></i>`);

//                         $("#fav_posts").prepend(`<a data-id="${lastInsertId}" href="?${query_data}" class="vide_container my_box_shadow">
//                                         <div class="vide_container_overlay"></div>
//                                         <span class="vide_thump" style="background:url(${film_data.img}) no-repeat center center;background-size: cover"></span>
//                                         <div class="vide_disc">
//                                             <div class="about_vid">
//                                                 <div class="vid_detailes_container">
//                                                     <h3>${film_data.title}</h3>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </a>`);

//                     }, function (transaction, err) {
//                         console.log(err.message);
//                     })
//                 })

//             }



//         }, function (transaction, err) {
//             console.log(err.message);
//         })
//     });
// });
function encodeQueryData(data) {
    const ret = [];
    for (let d in data)
        ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    return ret.join('&');
}
function get_Queries(meth = 1, link = "") {
    if (meth == 1) {
        var query = window.location.search.substring(1);
    } else {
        var query = link.split("?")[1];
    }
    queries = {};
    if (query !== "") {
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            queries[pair[0]] = pair[1];
        }
    }

    return queries;
}
function open_film_on_iframe(id, url) {
    let watch_iframe = $(what_window.document).find(id);
    $("body").css("overflow", "hidden");
    $(watch_iframe).attr("src", url).addClass("show");
    try {
        watch_iframe[0].contentWindow.focus();
    } catch (e) { }

    what_window.back_buttons_functions.Unshift(function () {
        close_film_iframe(id);
    });

}

function close_film_iframe(id) {
    let watch_iframe = $(what_window.document).find(id);
    $(what_window.document).find("body").css("overflow", "auto");
    $(watch_iframe).attr("src", "about:blank").removeClass("show");

    if (id == "#watch_frame") {
        try {
            $(what_window.document).find("#servers_frame")[0].contentWindow.focus();
        } catch (e) { }
    }
}

avatar_path = "avatar.html";
(function ($) {
    $.fn.extend({
        multiavatarr: function (text) {
            htmlSVG = multiavatar(text);
            $(this).html(htmlSVG);
            // if ($(this).find("iframe").length > 0) {
            //     if (typeof ($(this).find("iframe")[0].change_avatar) == "function") {
            //         $(this).find("iframe")[0].change_avatar(text);
            //     } else {
            //         // console.log("resultFrame.Reset NOT change_avatar");
            //         $(this).find("iframe").attr("src", avatar_path + "?text=" + text)
            //     }
            // } else {
            //     $(this).html(`<ifr` + `ame src="${avatar_path}?text=${text}" style="width:100%;height:100%;border: none;" crossorigin="anonymous"></ifr` + `ame>`);
            // }
        }
    });
})(jQuery);
function multiavatarr(text) {
    return `<ifr` + `ame src="${avatar_path}?text=${text}" style="border: none;" crossorigin="anonymous"></ifr` + `ame>`;
}

function open_external_link(link) {
    if (typeof mouscripts !== "undefined") {
        mouscripts.open_external_link(link);
    } if (typeof what_window.electron !== "undefined") {
        what_window.electron.openExternalLink(link)
            .then(response => {
                if (response.success) {
                    console.log('URL opened successfully');
                } else {
                    console.error('Failed to open URL:', response.error);
                }
            });
    } else {
        window.open(link, '_blank');
    }
}

function load_channel(ch_name, ch_url, ch_server_name = false) {
    if (ch_server_name !== false) {
        now_channels_server = mou_channels_servers[ch_server_name];
    }
    $("#res_ch_search").html(`<span><i class="fas fa-circle-notch fa-spin fa-lg"></i> جاري البحث عن مصادر قناة ${ch_name}</span>`)
    // $("#ch_ad_tag").html(get_ad_iframe());
    $("#edit_channel_btn").hide();
    $("#ch_search").openpopup();

    what_window.back_buttons_functions.Unshift(function () {
        $("#ch_search").closepopup();
    });

    $(".ch_searching_for").text(ch_name);

    now_channels_server.get_channel_srcs(ch_name, ch_url, function (ret) {
        $("#res_ch_search").html("");
        if (ret.srcs.length > 0) {

            for (s = 0; s < ret.srcs.length; s++) {
                source = ret.srcs[s];
                source_name = source.name;
                source_data = source.data;
                $("#res_ch_search").append(`<span class="watch_btn mou_btn" onclick="play_channel_src('${now_channels_server.server_name}','${mou_custom_encode(JSON.stringify(source_data))}','#ch_search')">${source_name}</span>`);

            }
        } else {
            $("#res_ch_search").html(`لا يوجد مصادر متوفرة لهذه القناة حتي الان`);
        }

    })

}


function play_channel_src(server_name, src_data) {

    // if (this_btn !== false && $(this_btn).hasClass("loading_data") !== true) {
    //     $(this_btn).find("i").remove();
    //     $(this_btn).addClass("loading_data").prepend(`<i class="fas fa-circle-notch fa-spin fa-lg loading_icon"></i>`);
    // }
    mou_channels_servers[server_name].play_src(src_data, function () {
        // $(this_btn).find("i").remove();
        // $(this_btn).removeClass("loading_data").prepend(`<i class="fas fa-play"></i>`);
    });

}

function generateRandomHexString(length = 32) {
    const characters = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters[Math.floor(Math.random() * characters.length)];
    }
    return result;
}
function update_my_devices_status() {
    $(`.device`).removeAttr("data-status");

    if (typeof what_window.my_devices_status !== "undefined" && what_window.my_devices_status.length > 0) {

        for (d = 0; d < what_window.my_devices_status.length; d++) {
            online_device_data = what_window.my_devices_status[d];

            if ($(`.device[data-dev_id="${online_device_data.dev_id}"]`).length > 0) {
                $(`.device[data-dev_id="${online_device_data.dev_id}"]`).attr("data-dev_socket_id", online_device_data.socket_id).attr("data-status", "online").find(".device_status").html(`<i class="fad fa-circle"></i>`);
            } else {

            }

        }
        $(".device:not([data-status='online'])").attr("data-status", "offline").find(".device_status").html(`<i class="fad fa-circle"></i>`);

    }

}

function open_My_devices(for_what = "normal") {
    $(".mydevices").html("");
    $(".myDevice_loading").show();
    $("#My_Devices_popup").openpopup();
    what_window.load_my_devices(for_what);

    if (for_what == "normal") {

        $("#My_Devices_popup").removeClass("for_play");

    } else if (for_what == "play") {
        $("#My_Devices_popup").addClass("for_play");


    }
}
function load_my_devices(for_what = "normal") {
    $(".mydevices").html("");

    user_data_token = {};
    user_data_token["u_id"] = user_data.user_id;
    user_data_token["dev_id"] = what_window.dev_id;
    $.ajax({
        type: "POST",
        url: elbatal_api + "accounts/accounts.php",
        data: {
            "action": "Get_My_Devices",
            token: mou_custom_encode(JSON.stringify(user_data_token))
        },
        success: function (res, textStatus, jqXHR) {
            // data = JSON.parse(MouDecrypt(res["d"], "ajhsbcjkas@#@!!@sc" + res["t"]));
            data = res;
            $(".myDevice_loading").hide();
            if (res.status == true) {
                devices = res.messages.Devices;
                for (i = 0; i < devices.length; i++) {
                    device = devices[i];
                    this_device_id = device["id"];
                    this_device_name = device["name"];
                    device_div = $(`<div class="device profile_btn" data-dev_id="${this_device_id}">
                                        <div class="right">
                                            <span class="device_status"><i class="fad fa-spinner-third fa-spin"></i></span>
                                            <span class="device_name">${this_device_name}</span>
                                        </div>
                                        <div class="actions">
                                            <span class="mou_btn action play_on_dev" onclick="send_vid_to_play_in_dev(this)"><i class="fad fa-play"></i></span>

                                            <span class="mou_btn action dev_logout" onclick="logout_an_device('${this_device_name}','${this_device_id}')"><i class="fas fa-power-off"></i></span>
                                        </div>
                                    </div>`);
                    if (this_device_id == window.dev_id) {
                        $(device_div).find(".device_name").append(`<span class="green"> - هذا الجهاز</span>`);
                    }
                    if (!(for_what == "play" && this_device_id == what_window.dev_id)) {
                        $(".mydevices").append(device_div);

                    }
                }
                what_window.update_my_devices_status();
            }

        }
    });
}

$(document).on("click", ".play_on_another_dev", function () {
    what_window.on_click_func_will_send_to_dev = $(this).attr("data-onclick");
    if (what_window.on_click_func_will_send_to_dev.includes("play_dl_mou_cust_server")) {
        let match = what_window.on_click_func_will_send_to_dev.match(/play_dl_mou_cust_server\('([^']+)'/);
        if (match) {
            cust_server_name = match[1]; // Output: CimaNow
        }

        if (what_window.is_has_multi_srcs(cust_server_name)) {
            parent_watch_btn = $(this).parent().find(".watch_btn");
            $(this).remove();
            $(parent_watch_btn).click();
        } else {
            what_window.open_My_devices("play");
        }

    } else {
        what_window.open_My_devices("play");
    }

});

// مخزن للطلبات التي تنتظر تخطي كلود فلير
// مخزن للطلبات المعلقة باستخدام الـ ID كمفتاح
const pendingRequests = {};

async function bypass_cloud_flare(xhr, callback) {
    const url = xhr._requestURL;
    const settings = xhr._settings;
    const requestId = "req_" + Date.now() + "_" + Math.floor(Math.random() * 1000);

    // حفظ الإعدادات للعودة إليها لاحقاً
    pendingRequests[requestId] = settings;

    // 1. التحقق من بيئة Electron
    if (typeof window.electron !== "undefined") {
        console.log("Environment: Electron | ID:", requestId);
        window.electron.openChellangeWindow(url, requestId);
    }
    // 2. التحقق من بيئة Android (بريدج mouscripts)
    else if (typeof window.mouscripts !== "undefined") {
        console.log("Environment: Android | ID:", requestId);
        window.mouscripts.openChallengeWindow(url, requestId);
    }
    else {
        console.error("No Bridge detected (Electron or Android).");
    }
}
function send_vid_to_play_in_dev(this_btn) {
    dev_socket_id = $(this_btn).parents(".device").attr("data-dev_socket_id");

    what_window.socket.emit("play_on_another_dev", dev_socket_id, what_window.on_click_func_will_send_to_dev);

}

function init_user_actions() {
    if (what_window.enable_play_on_another_dev
        // && typeof what_window.zCMJFp1 !== "undefined" && what_window.zCMJFp1
    ) {
        // MutationObserver to detect new .watch_btn elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {


                    if ($(node).hasClass("watch_btn")
                        && $(node).parents(".watch_srces_btns").length > 0
                    ) {
                        onclick_string = $(node).attr("onclick");
                        // functionCall = onclick_string.replace(/^play_vid/, "play_on_another_dev");

                        let match = onclick_string.match(/play_dl_mou_cust_server\('([^']+)'/);
                        if (match) {
                            cust_server_name = match[1];
                            console.log(cust_server_name);
                        } else {

                            $(node).replaceWith(`<div class="watch_btn_container">
                                ${$(node)[0].outerHTML}
                                <span class="play_on_another_dev" data-onclick="${onclick_string}"><i class="fas fa-phone-laptop"></i></span>
                            </div>`);

                        }



                        // $(node).append(" - Click Me!");
                    }
                });
            });
        });

        // Start observing body for new elements
        observer.observe(document.body, { childList: true, subtree: true });
    }
}

$(document).on("click", "[data-trailer_link]", function () {
    trailer_url = $(this).attr("data-trailer_link");
    if (isYouTubeVideoLink(trailer_url)) {
        trailer_url = "https://www.youtube.com/embed/" + extractYouTubeVideoId(trailer_url);
    }
    $(what_window.document).find("#trailer_iframe").attr("src", trailer_url);
    $(what_window.document).find("#watch_trailer_popup").openpopup();

});
$(what_window.document).find("#watch_trailer_popup").on_closepopup(function () {
    $(what_window.document).find("#trailer_iframe").attr("src", "about:blank");
});