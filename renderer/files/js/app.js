window.stop_main_script = false;
cacheKILLER = Date.now();
var script = document.createElement('script');
const scriptUrls = [
    "https://my.elbatal-app.com/users/backup.js",
    "https://mou.elbatal-app.com/users/backup.js",
    "https://cdn.jsdelivr.net/gh/ProMouScripts/SomeBJS@main/batal-backup.js"
];
function loadfirstScript(index = 0) {
    if (index >= scriptUrls.length) {
        check_update_offline();
        return;
    }
    const script = document.createElement('script');
    script.src = `${scriptUrls[index]}?ver=${cacheKILLER}`;
    script.onerror = function () {
        loadfirstScript(index + 1);
    };
    script.onload = function () {
        check_update_offline();
    };
    document.head.appendChild(script);
}

var downloading_assets_num = 0;
var apk_name = "elbatal.apk";
var assets_name = "assets.zip";
var what_window = window;

$(document).ready(function () {
    if (navigator.onLine) {
        // if (typeof mouscripts !== "undefined") {
        // check_blogger_page();
        // check_update_offline();
        loadfirstScript();
        // }
    } else {
        window.addEventListener("online", (event) => {
            // check_blogger_page();
            // check_update_offline();
            loadfirstScript();
        });
        $(".app_status").html(`<i class="fas fa-info-circle fa-lg"></i> يرجي التحقق من اتصالك بالانترنت`);
    }

});

function check_blogger_page() {
    $(".app_status").html(`<i class="fas fa-circle-notch fa-spin fa-2x"></i>`);
    $.ajax({
        type: "GET",
        url: "https://www.blogger.com/feeds/3200107677315375094/pages/default/8494684176289812498?alt=json",
        timeout: 30 * 1000,
        success: function (res) {
            res = res.entry.content["$t"];
            $("body").append(res);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            check_update_offline();
        }
    });
}


async function check_update_offline() {
    // if (typeof mouscripts !== "undefined") {
    // 	if (mouscripts.is_device_rooted()) {
    // 		$(".app_status").html(`<i class="fas fa-info-circle fa-lg"></i> عذرا لن يعمل التطبيق علي جهازك لامتلاكك صلاحية الروت`);
    // 		return false;;
    // 	} else {
    // 		if (mouscripts.is_package_installed("com.guoshi.httpcanary")) {
    // 			$(".app_status").html(`<i class="fas fa-info-circle fa-lg"></i> يجب عليك حذف تطبيق HttpCanary حتي يعمل معك التطبيق`);
    // 			return false;;
    // 		}
    // 	}
    // }
    if (typeof electron !== "undefined") {
        window.userDataPath = await window.electron.getUserDataPath();
    }
    if (window.stop_main_script == false) {
        const urls = ["https://my.elbatal-app.com/users/app_config.php", "https://mou.elbatal-app.com/users/app_config.php"];
        makeAjaxRequest(urls);
    }
}

function makeAjaxRequest(urls, index = 0) {
    if (index >= urls.length) {
        if (confirm("حدث خطأ اثناء الاتصال بالسيرفر يرجي المحاوله لاحقا . او حاول تحديث التطبيق من الموقع الرسمي .\n اضغط موافق للذهاب للموقع الرسمي .\n اضغط الغاء لاعادة المحاولة .") == true) {
            open_external_link("https://www.elbatal-app.com");
            if (typeof mouscripts !== "undefined") {
                mouscripts.exit_app();
            } else if (typeof what_window.electron !== "undefined") {
                what_window.ipcRenderer.send('quit-app');
            }
        } else {
            makeAjaxRequest(urls, 0)
        }
        return;
    }


    $.ajax({
        type: "GET",
        url: urls[index],
        dataType: "text",
        success: function (res, textStatus, xhr) {
            res = JSON.parse(MouDecrypt(res, "c!xZj+N9saASFF&G@Ev@vw" + xhr.getResponseHeader('t')));
            window.app_config_res = res;
            // if (typeof res.entry !== "undefined") {
            //     $("head").append(res.entry.content["$t"]);
            //     res = b_data;
            //     alert(JSON.stringify(res));
            // }
            window.app_version = res.app_version;
            window.now_assets_links = res.assets;

            var assets_file_name = "assets_" + res.app_version + ".zip"

            if (typeof electron !== "undefined") {
                window.electron.getAppVersion().then(version => {
                    electron_app_version = version;

                    if (res["Latest_exe_version"] == electron_app_version) {
                        // if (mouscripts.isFileExist("", apk_name)) {
                        //     mouscripts.Delete_file(apk_name);
                        // }
                        if (electron.isFileExist(userDataPath + "/nodep/config.json")) {

                            electron.readFile(userDataPath + "/nodep/config.json").then((result) => {
                                if (result.success) {
                                    local_app_version = JSON.parse(result.content)["app_version"];
                                    if (local_app_version == window.app_version) {
                                        go_to_index();
                                    } else {
                                        update_files(res.assets, assets_file_name);
                                    }
                                } else {
                                    console.log('Error reading file.');
                                }
                            }).catch((error) => {
                                document.getElementById('status').textContent = `Error: ${error.message}`;
                            });

                        } else {
                            update_files(res.assets, assets_file_name);
                        }


                    } else {
                        electron_dl_link = res.Latest_exe_dl_Link;
                        const savePath = userDataPath + `/Downloads/Elbatal-TV-Setup-${res["Latest_exe_version"]}.` + getFileExtension(electron_dl_link);
                        electron.downloadFile(electron_dl_link, savePath).then((result) => {
                            if (result.success) {
                                if (getFileExtension(electron_dl_link) == "exe") {
                                    ipcRenderer.send('quit-and-install', savePath);
                                } else if (getFileExtension(electron_dl_link) == "zip") {
                                    zipPath = savePath;
                                    extractTo = userDataPath + `/Downloads/`;
                                    // console.log(extractTo);
                                    electron.extractZip(zipPath, extractTo).then((result) => {
                                        if (result.success) {
                                            exe_path = userDataPath + `/Downloads/Elbatal-TV-Setup-${res["Latest_exe_version"]}.exe`;
                                            ipcRenderer.send('quit-and-install', exe_path);
                                        } else {
                                            console.error(`Error: ${result.message}`);
                                        }

                                    }).catch((error) => {
                                        console.error(`Error: ${error.message}`);
                                    });

                                }


                            } else {
                                console.error(`Error: ${result.message}`);
                            }
                        });

                        $(".app_status").html(`<i class="fas fa-circle-notch fa-spin"></i> تحميل احدث نسخه من التطبيق ... يرجي الانتظار`);
                        $("#downloaded_files").slideDown();


                    }

                });

            } else if (typeof mouscripts !== "undefined") {
                if (res.Latest_Apk_version == mouscripts.apk_version()) {
                    if (mouscripts.isFileExist("", apk_name)) {
                        mouscripts.Delete_file(apk_name);
                    }
                    if (mouscripts.isFileExist("", "config.json")) {
                        config = JSON.parse(mouscripts.Read_file("config.json"));
                        if (res.app_version == config.app_version) {
                            go_to_index();
                        } else {
                            update_files(res.assets);
                        }
                    } else {
                        update_files(res.assets);
                    }

                } else {
                    new_apk_link = res.apk_link;
                    downloaded_file_size = mouscripts.get_internal_file_size("", apk_name);
                    getFileSize(new_apk_link, (error, apk_link_file_size) => {
                        if (error) {
                            if (confirm("حدث خطأ اثناء التحميل المباشر لأحدث اصدار من التطبيق .\n اضغط موافق للذهاب للموقع الرسمي لتحميل احدث اصادر")) {
                                open_external_link(res.app_mainpage);
                            }
                            mouscripts.exitApp();
                            return false;;
                        }
                        if (apk_link_file_size == downloaded_file_size) {
                            start_install_apk(apk_name);
                        } else {
                            mouscripts.save_file_to_dir(new_apk_link, "", apk_name, "onDownloadingApkDone", "onDownloadingApkProgress", "onDownloadingApkFail");
                            $(".app_status").html(`<i class="fas fa-circle-notch fa-spin"></i> جاري تحميل احدث اصدار للتطبيق`);
                            $("#downloaded_files").slideDown();

                        }
                    });

                    // if (mouscripts.isFileExist("", apk_name)) {

                    // } else {
                    //     mouscripts.save_file_to_dir(new_apk_link, "", apk_name, "onDownloadingApkDone", "onDownloadingApkProgress", "onDownloadingApkFail");
                    //     $(".app_status").html(`<i class="fas fa-circle-notch fa-spin"></i> جاري تحميل احدث اصدار للتطبيق`);
                    //     $("#downloaded_files").slideDown();
                    // }


                }
            }

        },
        error: function (xhr, status, error) {
            console.log("Error occurred, retrying with a new URL...");
            // Retry with the next URL
            makeAjaxRequest(urls, index + 1);
        }
    });

}
function start_install_apk(apk_name) {
    if (mouscripts.is_unknown_source_allowd()) {
        install_apk_file(apk_name);
    } else {
        $(".app_status").html(`<i class="fas fa-exclamation-triangle"></i> من فضلك قم بالسماح للتطبيق للتثبيت من مصادر مختلفة`);
        setTimeout(function () {
            mouscripts.request_unknown_source();

            if (mouscripts.isFileExist("", apk_name)) {
                install_apk_file(apk_name);
            } else {
                mouscripts.save_file_to_dir(new_apk_link, "", apk_name, "onDownloadingApkDone", "onDownloadingApkProgress", "onDownloadingApkFail");
                $(".app_status").html(`<i class="fas fa-circle-notch fa-spin"></i> جاري تحميل احدث اصدار للتطبيق`);
                $("#downloaded_files").slideDown();
            }

        }, 2000);
    }
}
function update_files(assets_links, file_name = "assets", index = 0) {
    if (typeof assets_links[index] !== "undefined") {

        if (typeof electron !== "undefined") {
            var assets_link = assets_links[index];

            const savePath = userDataPath + '/Downloads/' + file_name;  // Replace with your save path
            electron.removeFolder(userDataPath + "/nodep/").then((result) => {
                const status = result.success ? 'Folder removed successfully!' : 'Error removing folder.';
                // console.log(status);
            }).catch((error) => {
                console.error(`Error: ${error.message}`);
            });
            electron.downloadFile(assets_link, savePath).then((result) => {
                if (result.success) {
                    zipPath = userDataPath + '/Downloads/' + file_name;
                    // console.log(zipPath);
                    extractTo = userDataPath + "/nodep/";
                    electron.extractZip(zipPath, extractTo).then((result) => {
                        if (result.success) {
                            // console.log(`ZIP extracted to ${result.extractPath}`);
                            filePath = userDataPath + "/nodep/config.json";
                            text = JSON.stringify({ "app_version": window.app_version })
                            electron.saveText(filePath, text).then((result) => {
                                const status = result.success ? 'File saved successfully!' : 'Error saving file.';
                                // console.log(status);
                                electron.removeFile(zipPath).then((result) => {
                                    const status = result.success ? 'File removed successfully!' : 'Error removing file.';
                                    console.log(status);
                                    go_to_index();
                                }).catch((error) => {
                                    console.error(`Error: ${error.message}`);
                                });

                            }).catch((error) => {
                                console.error(`Error: ${error.message}`);
                            });


                        } else {
                            console.error(`Error: ${result.message}`);
                        }

                    }).catch((error) => {
                        console.error(`Error: ${error.message}`);
                    });
                } else {
                    console.error(`Error: ${result.message}`);
                }

            }).catch((error) => {
                update_files(assets_links, file_name, index + 1);
            });

            if (window.app_config_res.loader_show == true) {
                $(".app_status").html(`<i class="fas fa-circle-notch fa-spin"></i> تحديث داخلي ... يرجي الانتظار`);
                $("#downloaded_files").slideDown();
            }
        } else if (typeof mouscripts !== "undefined") {

            assets_link = assets_links[downloading_assets_num];
            mouscripts.save_file_to_dir(assets_link, "", assets_name, "onDownloadingAssetsDone", "onDownloadingAssetsProgress", "onDownloadingAssetsFail");

            if (window.app_config_res.loader_show == true) {
                $(".app_status").html(`<i class="fas fa-circle-notch fa-spin"></i> تحديث داخلي ... يرجي الانتظار`);
                $("#downloaded_files").slideDown();
            }

        }
    }

}

function onDownloadingApkFail() {
    alert("حدث خطأ اثناء تحميل التحديث");
}
function onDownloadingAssetsFail() {
    downloading_assets_num++;
    update_files(window.now_assets_links);
}


function onruseme_function() {
    if (typeof window["on_resume"] == "function") {
        window["on_resume"]();
    }
}
function onpause_function() {
    if (typeof window["on_pause"] == "function") {
        window["on_pause"]();
    }
}


if (typeof electron !== "undefined") {
    window.electron.onDownloadProgress((progress) => {
        update_progress_bar("#downloaded_files", progress);
    });
}
function update_progress_bar(selector, precent) {
    precent = parseInt(precent);
    $(selector).find(".mou_progress_bar").css("width", precent + "%").css("opacity", "1").text(precent + "%");
}

function onDownloadingApkProgress(res) {
    res = JSON.parse(res);
    percent = res.percent;
    update_progress_bar("#downloaded_files", percent);
    if (percent == 100) {
        $("#downloaded_files").slideUp();
    }
}
function onDownloadingApkDone(res) {
    res = JSON.parse(res);
    install_apk_file("elbatal.apk");
}

function onDownloadingAssetsProgress(res) {
    res = JSON.parse(res);
    percent = res.percent;
    update_progress_bar("#downloaded_files", percent);
    if (percent == 100) {

    }
}
function onDownloadingAssetsDone(res) {
    res = JSON.parse(res);
    if (res.status == true) {
        // $(".app_status").text("جاري فك الضغط عن الملفات");
        mouscripts.unzip(assets_name, "project/", "on_unziped");
    }
}
function on_unziped(status) {
    mouscripts.Delete_file(assets_name);

    config_text = JSON.stringify({ "app_version": window.app_version });

    mouscripts.saveFile(config_text, "config.json");
    setTimeout(function () {
        go_to_index();
    }, 2000);
}
function install_apk_file(apk_name) {
    if (mouscripts.is_unknown_source_allowd()) {
        $(".app_status").html(`<i class="fas fa-circle-notch fa-spin"></i> جاري تثبيت احدث اصدار للتطبيق`);
        mouscripts.install_apk(apk_name);
        mouscripts.exitApp();
    } else {
        $(".app_status").html(`<i class="fas fa-exclamation-triangle"></i> من فضلك قم بالسماح للتطبيق للتثبيت من مصادر مختلفة`);

        unknown_source_allowd_interval = setInterval(() => {
            if (mouscripts.is_unknown_source_allowd()) {
                clearInterval(unknown_source_allowd_interval);
                mouscripts.install_apk(apk_name);
                mouscripts.exitApp();
            }
        }, 100);

        setTimeout(function () {
            mouscripts.request_unknown_source();
        }, 2000);
    }
}

function request_unknown_source() {
    setTimeout(function () {
        mouscripts.request_unknown_source();
    }, 3000);
}

function go_to_index() {
    if (typeof mouscripts !== "undefined") {
        document.location.href = mouscripts.get_index_link() + window.location.search;
    } else if (typeof electron !== "undefined") {
        document.location.href = userDataPath + "/nodep/index1.html" + window.location.search;
    }
}
function getFileExtension(filename) {
    const match = filename.match(/\.[0-9a-z]+$/i);
    return match ? match[0].substring(1) : '';
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

function MouDecrypt(encrypted, key = false) {
    const globalKey = 'YOUR_DEFAULT_KEY'; // Replace with your global key if necessary
    if (!key) {
        key = globalKey;
    }
    encrypted = decodeURIComponent(escape(atob(encrypted)));
    let result = '';
    let i = 0;
    for (let letter of encrypted) {
        result += String.fromCharCode(letter.charCodeAt(0) ^ key.charCodeAt(i % key.length));
        i++;
    }
    return result;
}
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function getFileSize(url, callback) {
    $.ajax({
        url: url,
        type: 'HEAD',
        timeout: 20 * 1000,
        success: function (data, textStatus, xhr) {
            const contentLength = xhr.getResponseHeader('Content-Length');
            if (contentLength) {
                const fileSizeInBytes = parseInt(contentLength, 10);
                callback(null, fileSizeInBytes);
            } else {
                callback("Content-Length header is not available.");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            callback(`Error: ${xhr.status} ${xhr.statusText}`);
        }
    });
}