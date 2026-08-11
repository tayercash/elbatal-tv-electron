var time_out_for_domain_searching = 30;

// }).ajaxError(function (event, jqxhr, settings, thrownError) {
//     if (jqxhr.status == 403) {
//         settings.url = "https://webcache.googleusercontent.com/search?q=cache:" + settings.url;
//         $.ajax(settings);
//     }
// });

$("#open_cats_pop").click(function () {
    $("#cats_pop").openpopup();
});
$("#search_in_aflam").click(function () {
    $("#aflam_search .aflam_search_key").val("");
    $("#aflam_search").openpopup();
    $("#aflam_search .aflam_search_key").focus();
});
$("#aflam_search .aflam_search_key").keypress(function (event) {
    if (event.keyCode == 13) {
        $("#submit_search_in_aflam").click();
    }
});


var mou_aflam_server = null;

var loading_posts = false;
var now_aflam_cats = false;
var now_load_list_function = false;
var now_load_film_function = false;
var now_load_7alakat_function = false;
var now_load_msadr_watch_function = false;
var now_aflam_server_domain = "";
var now_aflam_main_domain = "";
var now_server_title = false;
var now_server_name = false;
var now_aflam_search_function = false;
var local_servers_domains = typeof localStorage.getItem("local_servers_domains") == "string" ? JSON.parse(localStorage.getItem("local_servers_domains")) : {};

$(document).ready(function () {
    // load_aflam_servers();

    // obj = { "User-Agent": what_window.Main_USER_AGENT };
    // what_window.updateHeaders(what_window.mainWindow_contentID, obj);

    load_server = getQueryVariable("film_server_name");
    if (load_server !== false) {
        server_requested = load_server;

        if (typeof mou_aflam_servers_array[server_requested] !== "undefined") {
            mou_aflam_server = mou_aflam_servers_array[server_requested];
            if (typeof mou_aflam_server["get_latest_domain"] !== "undefined") {
                mou_aflam_server["get_latest_domain"]();
            } else {
                alert("get_latest_domain Error !");
            }
        }

        if (getQueryVariable("film_url")) {
            // add preloader for film
            $(".preloader_post").remove();
            $(".preloader").append(`<div class="mou_vid_container post_content preloader_post"><div class="post_img_container loading_elemnt"></div><h3 class="post_title loading_elemnt" style="height: 30px;max-width: 500px;margin: 1rem auto;overflow: hidden;border-radius: 4px;"></h3></div>`);

        } else {
            // add preloader for aflam
            for (i = 0; i < 30; i++) {
                $(".preloader .posts_ul").append(`<a class="vide_container my_box_shadow preloader_item"><span class="vide_thump loading_elemnt"></span></a>`);

            }
        }

    }
});


function domain_found(url) {
    obj = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36", "Referer": url };
    what_window.updateHeaders(what_window.mainWindow_contentID, obj);

    $(".website_name_container").show();
    $(".website_name").text(server_title);
    if (typeof mou_aflam_server["search_function"] !== "undefined") {
        $("#search_in_aflam").show();
    }
    if (typeof domain_search_timeout !== "undefined") {
        clearTimeout(domain_search_timeout);
    }
    get_latest_url_redrict(url, function (status, latest_domain) {
        latest_domain = new URL(latest_domain);
        latest_domain = latest_domain.protocol + "//" + latest_domain.hostname + "/";
        local_servers_domains[server_requested] = latest_domain;
        mou_aflam_server["server_domain"] = latest_domain;
        server_domain = latest_domain;
        localStorage.setItem("local_servers_domains", JSON.stringify(local_servers_domains));
        $(".preloader").remove();
        mou_aflam_server["start_website"]();

        // $(".domain_checker span").html(`<i class="fas fa-badge-check fa-lg green"></i> تم الاتصال بسيرفر ${server_title} بنجاح`);
        // setTimeout(() => {
        //     $(".domain_checker_container").hide();
        //     $(".website_name_container").show();
        //     $(".website_name").text(server_title);
        //     if (typeof mou_aflam_server["search_function"] !== "undefined") {
        //         $("#search_in_aflam").show();
        //     }
        //     mou_aflam_server["start_website"]();
        // }, 800);

    });
}

function domain_search_timeout_fun() {
    domain_search_timeout = setTimeout(function () {
        $(".preloader").remove();
        $(".domain_checker span").html(`<i class="far fa-exclamation-triangle" style="color: #ffc800;"></i> حدث خطأ اثناء الاتصال بسيرفر ` + mou_aflam_server["server_title"] + `</br><a href="javascript:window.location.href=window.location.href">إعادة التحميل</a>`);
        $(".domain_checker_container").removeClass("d-none");

        if (typeof window.now_domains_length !== "undefined") {
            for (let e = 0; e < window.now_domains_length; e++) {
                window["get_prop_domain_" + e].abort();
            }
        }

    }, time_out_for_domain_searching * 1000);
}

now_cats_array = [];
servers_btns_id = 1;
function load_aflam_servers() {
    $(".temp_server_btns").hide();
    server_btns_id = `servers_btns_${servers_btns_id}`;
    server_btns_container = $(`<div class="temp_server_btns" id="${server_btns_id}"></div>`);
    $(".servers_btns_container").append(server_btns_container);
    now_aflam_cats = mou_aflam_servers_array;
    aflam_servers_id = server_btns_id;
    now_cats_array = [];
    now_cats_array.push(now_aflam_cats);
    for (let i = 0; i < Object.keys(now_aflam_cats).length; i++) {
        cat_name = Object.keys(now_aflam_cats)[i];
        cat_name_text = "سيرفر " + (i + 1);
        cat_val = now_aflam_cats[cat_name];
        cat_title = cat_val.server_title;
        main_domain = cat_val.main_domain;
        server_domain = cat_val.server_domain;
        if (typeof cat_val.working_state !== "undefined" && cat_val.working_state !== true) {
            continue;
        }

        $(`#${aflam_servers_id}`).append(`<button class="server_btn disabled" data-server_name="${cat_name}" data-server_domain="${server_domain}" data-main_domain="${main_domain}" data-server_load="false" onclick="load_aflam_server('${cat_name}',this)">${cat_val.icon} ${cat_title}</button>`);

        // $(`.server_btn[data-check_server="${main_domain}"]`).slideDown();

        updated_server_domain = typeof localStorage.getItem("updated_server_domain") == "string" ? JSON.parse(localStorage.getItem("updated_server_domain")) : {};

        if (main_domain !== "undefined") {

            if (typeof updated_server_domain[main_domain] !== "undefined") {
                custom_server_domain = updated_server_domain[main_domain];
                $(`.server_btn[data-server_domain="${server_domain}"]`).attr("data-server_domain", custom_server_domain);
                for (e = 0; e < Object.keys(now_aflam_cats).length; e++) {
                    cat_name = Object.keys(now_aflam_cats)[e];
                    cat_val = now_aflam_cats[cat_name];
                    if (main_domain == cat_val.main_domain) {
                        cat_val.server_domain = custom_server_domain;
                    }
                }
                server_domain = custom_server_domain;
            }



            $.ajax({
                type: "HEAD",
                url: server_domain,
                timeout: 5000,
                success: function (data, textStatus, xhr) {

                    $(`.server_btn[data-server_domain="${this.url}"]`).removeClass("disabled");
                    $(`.server_btn[data-server_domain="${this.url}"]`).attr("data-server_load", "true");
                },
                error: function (xhr, textStatus, errorThrown) {
                    for (e = 0; e < Object.keys(now_aflam_cats).length; e++) {
                        cat_name = Object.keys(now_aflam_cats)[e];
                        cat_val = now_aflam_cats[cat_name];
                        if (this.url == cat_val.server_domain) {
                            main_domain = cat_val.main_domain;
                            break;
                        }
                    }



                    get_latest_url_redrict(main_domain, main_domain, function (status, this_now_main_domain, latest_url) {
                        if (status == true) {

                            for (e = 0; e < Object.keys(now_aflam_cats).length; e++) {
                                cat_name = Object.keys(now_aflam_cats)[e];
                                cat_val = now_aflam_cats[cat_name];
                                if (req_url == cat_val.main_domain && res_url !== "") {
                                    cat_val.server_domain = res_url;
                                }
                            }
                            $(`.server_btn[data-main_domain="${this_now_main_domain}"]`).attr("data-server_domain", latest_url);

                            $(`.server_btn[data-main_domain="${this_now_main_domain}"]`).removeClass("disabled");
                            $(`.server_btn[data-main_domain="${this_now_main_domain}"]`).attr("data-server_load", "true");

                            updated_server_domain[this_now_main_domain] = latest_url;
                            localStorage.setItem("updated_server_domain", JSON.stringify(updated_server_domain));

                            for (e = 0; e < Object.keys(now_aflam_cats).length; e++) {
                                cat_name = Object.keys(now_aflam_cats)[e];
                                cat_val = now_aflam_cats[cat_name];
                                if (this_now_main_domain == cat_val.main_domain) {
                                    cat_val.server_domain = latest_url;
                                }
                            }
                        } else {


                            if (typeof updated_server_domain[this_now_main_domain] !== "undefined") {
                                delete updated_server_domain[this_now_main_domain];
                                localStorage.setItem("updated_server_domain", JSON.stringify(updated_server_domain));

                            }


                            if (typeof cat_val.get_server_domain !== "undefined") {

                                cat_val.get_server_domain(this_now_main_domain, function (this_noww_main_domain, latest_url) {

                                    get_latest_url_redrict(latest_url, this_noww_main_domain, function (status, this_now_main_domain, latest_url) {
                                        if (status == true) {
                                            $(`.server_btn[data-main_domain="${this_now_main_domain}"]`).attr("data-server_domain", latest_url);

                                            $(`.server_btn[data-main_domain="${this_now_main_domain}"]`).removeClass("disabled");
                                            $(`.server_btn[data-main_domain="${this_now_main_domain}"]`).attr("data-server_load", "true");

                                            updated_server_domain[this_now_main_domain] = latest_url;
                                            localStorage.setItem("updated_server_domain", JSON.stringify(updated_server_domain));

                                            for (e = 0; e < Object.keys(now_aflam_cats).length; e++) {
                                                cat_name = Object.keys(now_aflam_cats)[e];
                                                cat_val = now_aflam_cats[cat_name];
                                                if (this_now_main_domain == cat_val.main_domain) {
                                                    cat_val.server_domain = latest_url;
                                                }
                                            }
                                        }

                                    })


                                })
                            }

                        }





                    });

                }
            })

        }
    }
}

old_aflam_cats = false;
function load_aflam_server(server_name, this_btn) {
    if ($(this_btn).hasClass("disabled")) {
        return false;
    }
    $(".temp_server_btns").hide();
    if (typeof $(this_btn).attr("data-server_name") !== "undefined" && $(this_btn).attr("data-server_name") !== "") {
        now_server_name = $(this_btn).attr("data-server_name");
    }
    for (let i = 0; i < Object.keys(now_aflam_cats).length; i++) {
        cat_name = Object.keys(now_aflam_cats)[i];
        cat_val = now_aflam_cats[Object.keys(now_aflam_cats)[i]];
        if (cat_name == server_name) {
            if (typeof cat_val.server_title !== "undefined") {
                now_server_title = cat_val.server_title;
            }
            if (typeof cat_val.load_list_function == "function") {
                now_load_list_function = cat_val.load_list_function;
            }
            if (typeof cat_val.load_film_function == "function") {
                now_load_film_function = cat_val.load_film_function;
            }
            if (typeof cat_val.load_7alakat_function == "function") {
                now_load_7alakat_function = cat_val.load_7alakat_function;
            }
            if (typeof cat_val.load_msadr_watch_function == "function") {
                now_load_msadr_watch_function = cat_val.load_msadr_watch_function;
            }
            if (typeof cat_val.server_domain !== "undefined") {
                now_aflam_server_domain = cat_val.server_domain;
            }
            if (typeof cat_val.main_domain !== "undefined") {
                now_aflam_main_domain = cat_val.main_domain;
            }
            if (typeof cat_val.search_function !== "undefined") {
                now_aflam_search_function = cat_val.search_function;
                $("#search_in_aflam").show();
            }

            if (cat_val.type == "cats" && typeof cat_val.cats !== "undefined") {

                now_cats_array.push(cat_val.cats);

                servers_btns_id++;
                title_before = $("#extra_title").text();
                what_window.back_buttons_functions.Unshift(function () {
                    $("#extra_title").text(title_before);
                    if (now_cats_array.length > 1) {
                        now_cats_array.pop()
                    }
                    now_aflam_cats = now_cats_array[now_cats_array.length - 1];
                    $(`#servers_btns_${servers_btns_id}`).remove();
                    servers_btns_id--;
                    $(`#servers_btns_${servers_btns_id}`).show();
                });



                server_btns_id = `servers_btns_${servers_btns_id}`;
                server_btns_container = $(`<div class="temp_server_btns" id="${server_btns_id}"></div>`);
                $(".servers_btns_container").append(server_btns_container);

                if (typeof $(this_btn).attr("data-server_load") !== "undefined") {
                    server_name = $(this_btn).text();
                }

                $("#extra_title").text(" - " + server_name);

                if (typeof cat_val.cats == "function") {

                    // $(server_btns_container).html(`<span class="loading_span"><i class="fas fa-circle-notch fa-spin fa-lg"></i> جاري التحميل</span>`);
                    cat_val.cats(function (cats) {
                        $(server_btns_container).find(".loading_span").remove();
                        cat_val.cats = cats;
                        for (let i = 0; i < Object.keys(cat_val.cats).length; i++) {
                            cat_name = Object.keys(cat_val.cats)[i];
                            this_cat_val = cat_val.cats[Object.keys(cat_val.cats)[i]];
                            $(server_btns_container).append(`<button class="server_btn" onclick="load_aflam_server('${cat_name}',this)">${this_cat_val.icon} ${cat_name}</button>`);
                        }
                        now_aflam_cats = cat_val.cats;
                    });
                } else if (typeof cat_val.cats == "object") {

                    for (let i = 0; i < Object.keys(cat_val.cats).length; i++) {
                        cat_name = Object.keys(cat_val.cats)[i];
                        this_cat_val = cat_val.cats[Object.keys(cat_val.cats)[i]];
                        $(server_btns_container).append(`<button class="server_btn" onclick="load_aflam_server('${cat_name}',this)">${this_cat_val.icon} ${cat_name}</button>`);
                    }
                    now_aflam_cats = cat_val.cats;
                }

            } else if (cat_val.type == "list") {
                title_before = $("#extra_title").text();
                what_window.back_buttons_functions.Unshift(function () {
                    $("#extra_title").text(title_before);
                    $(".server_content").hide().find("#posts_ul").html("");
                    $(`.servers_btns_container`).show();
                    $(`#servers_btns_${servers_btns_id}`).show();
                });
                $("#extra_title").text(" - " + server_name);
                $("#load_more_posts_btn").html("جاري التحميل");
                $(".servers_btns_container").hide();
                $(".server_content").show();
                $.ajax({
                    "type": "GET",
                    "url": now_aflam_server_domain + cat_val.url,
                    success: function (res) {
                        now_load_list_function(res, "first_load");
                        $("#load_more_posts_btn").html("تحميل المزيد");
                    }, error: function (jqXHR, error, errorThrown) {
                        delete updated_server_domain[now_aflam_main_domain];
                        localStorage.setItem("updated_server_domain", JSON.stringify(updated_server_domain));
                    }
                });
            }

            break;
        }
    }

}
function load_aflam_posts(aflam_json, load_type) {
    $(".no_res_alert").remove();
    if (load_type == "search") {

        if (aflam_json.aflam.length == 0) {
            $("#posts_ul").parent().prepend(`<span class="mou_btn alert no_res_alert"><i class="fas fa-exclamation-triangle yellow"></i>لا يوجد نتائج</span>`);
        }
    }

    if (load_type == "first_load") {
        if (aflam_json.aflam.length == 0) {
            // delete updated_server_domain[now_aflam_main_domain];
            // localStorage.setItem("updated_server_domain", JSON.stringify(updated_server_domain));
            $("#posts_ul").parent().prepend(`<span class="mou_btn alert no_res_alert"><i class="fas fa-exclamation-triangle yellow"></i>لا يوجد نتائج</span>`);
        }

        $("#posts_ul").html("");
        $("#posts_ul").removeClass("wide");

    }
    aspect_ratio = typeof aflam_json.aspect_ratio !== "undefined" ? aflam_json.aspect_ratio : "tall";

    if (aspect_ratio == "wide") {
        $("#posts_ul").addClass("wide");
    }

    post_added_num = 1;

    aflam = aflam_json.aflam;
    for (let index = 0; index < aflam.length; index++) {
        const film = aflam[index];

        post_div = $(`<a class="vide_container my_box_shadow" data-film_title="${film.title}" data-film_url="${film.url}" data-film_img="${film.img}" data-server_title="${now_server_title}" data-film_type="${film.type}">
        <div class="vide_container_overlay"></div>
        <span
        class="vide_thump lazy_poster_img" data-poster_img="${film.img}"></span>
    <div class="vide_disc">
        <div class="about_vid">
            <div class="vid_detailes_container">
                <h3>${film.title}</h3>
            </div>
        </div>
    </div>
</a>`);
        if (typeof film.eposide !== "undefined") {
            $(post_div).find(".vide_container_overlay").append(`<span class="mou_eps_num mou_vid_container"><em>${film.eposide}</em><span>حلقة</span></span>`);
            $(post_div).attr("data-eposide", film.eposide);
        }


        $("#posts_ul").append($(post_div));
        post_added_num++;
    }
    lazyload();
    document.addEventListener("scroll", lazyload);
    window.addEventListener("resize", lazyload);
    window.addEventListener("orientationChange", lazyload);

    // console.log(aflam_json.next_page);
    if (typeof aflam_json.next_page !== "undefined") {
        next_page = aflam_json.next_page;
        $("#load_more_posts_btn").attr("onclick", `mou_aflam_server.get_list_function('${next_page}',this)`);
    } else {
        $("#load_more_posts_btn").attr("disabled", "disabled").hide();
    }

    $(document).off("scroll");
    $(document).scroll(function () {
        if ($('#load_more_posts_btn').length > 0) {
            if (is_elment_in_view_port('#load_more_posts_btn', 0, 5000)) {
                $("#load_more_posts_btn").click();
            }
        }
    });
}
var loading_more_posts = false;
function load_more_posts(page_url, server_title) {
    if (loading_more_posts == false) {
        loading_more_posts = true;
        $.ajax({
            "type": "GET",
            "url": page_url,
            success: function (res) {
                now_load_list_function(res, "load_more");
                loading_more_posts = false;
            }
        });
    }
}
function load_7alakat(this_btn) {
    $("#hlakat_elmoslsal_container").show();
    $("#hlakat_elmoslsal").html("");
    $("#moasm_elmoslsal .mou_eps_num").removeClass("activee");
    $(this_btn).addClass("activee");

    now_load_7alakat_function(this_btn);
}
function load_msadr_watch(watch_msdar_link, watch_type, this_btn = false) {
    // $("#msader_elmoshda,#msader_eltahmel").prepend(`<span class="loading_span"><i class="fas fa-circle-notch fa-spin fa-lg"></i></span>`);

    $("#msader_elmoshda").show();
    $("#msader_eltahmel").show();
    $("#hlakat_elmoslsal_container .mou_eps_num").removeClass("activee");
    if (this_btn !== false) {
        $(this_btn).addClass("activee");
    }

    now_load_msadr_watch_function(watch_msdar_link, watch_type);
}
$(document).on("click", "#hlakat_elmoslsal .mou_eps_num", function () {
    // Show_magic();
});
$(document).on("click", "#moasm_elmoslsal .mou_eps_num", function () {
    // Show_magic();
});

function load_film(this_btn) {

    aflams_content_scrolled_from_top = $(document).scrollTop();

    $(".post_content").html(`<div class="mou_vid_container"><div class="post_img_container" style="width:200px;height: 306px;margin-bottom: 0.5rem;"><div class="loader_content"></div></div><span class="post_title" style="height: 20px;"><div class="loader_content"></div></span></div>`);
    $(".server_content").hide();
    $(".post_content").show();

    now_load_film_function($(this_btn)[0].dataset);

    // $(".post_content").attr("data-scrolled", aflams_content_scrolled_from_top);
    what_window.back_buttons_functions.Unshift(function () {
        $(".post_content").hide();
        $(`.server_content`).show();
        $(document).scrollTop(aflams_content_scrolled_from_top);
    });

}


function show_film_data(film_data) {
    table_trs = ``;
    if (typeof film_data.trs !== "undefined" && Object.keys(film_data.trs).length > 0) {
        for (index = 0; index < Object.keys(film_data.trs).length; index++) {
            key = Object.keys(film_data.trs)[index];
            val = film_data.trs[key];
            table_trs += `<span>${val}</span>`;
            if (index < Object.keys(film_data.trs).length - 2) {
                table_trs += " • ";
            }
            // table_trs += `<tr><td>${key}</td><td>${val}</td></tr>`;
            // console.log(key);
        }
    }

    now_film_url = new URL(film_url);
    film_url_path = now_film_url.pathname;
    film_url_path = film_url_path.startsWith("//") ? film_url_path.slice(1) : film_url_path;

    query_data = encodeQueryData({
        "film_title": film_data.title,
        "film_server_name": mou_aflam_server.server_name,
        "film_url": film_url_path,
        "film_type": film_data.film_type
    });
    notify_btn = "";
    if (typeof user_data !== "undefined") {
        if (user_data.role !== null && user_data.role.includes("1")) {
            notify_btn = `<button class="post_action_btn" id="notify_this_post"><i class="fad fa-bells"></i></button>`;
        }
    }
    film_data.description = typeof film_data.description !== "undefined" ? film_data.description : "";
    img_class = "";
    if (film_data.img_style == "wide") {
        img_class = " wide";
    }
    if (film_data.img == "undefined") {
        film_data.img = "files/images/logo.png";
    }

    watch_trailer_btn = ``;
    if (typeof film_data.trailer !== "undefined" && film_data.trailer !== "") {

        watch_trailer_btn = `<button class="mou_watch_btn" id="watch_trailer_btn" data-trailer_link="${film_data.trailer}"><i class="fas fa-play"></i>مشاهدة التريلر</button>`;

    }

    post_html = $(`<div>
            <div class="mou_vid_container full_post_container">
                <button class="close_video_btn"><i class="far fa-long-arrow-left"></i></button>
                <div class="img_background_container">
                    <div class="img_background" style="background-image: url(${film_data.img});"></div>
                    <div class="back_outro"></div>
                </div>
                <div class="video_post_data">
                    <div class="post_img_full_container">
                        <div class="post_img_container${img_class}" style="background:url(${film_data.img}) no-repeat center center;background-size: contain">
                            <img src="${film_data.img}">
                        </div>
                    </div>
                    <div class="film_data">
                        <h3 class="post_title">${film_data.title}</h3>
                        <div class="post_info">${table_trs}</div>
                        <div class="watch_and_actions">
                            <button class="mou_watch_btn" id="mou_watch_btn"><i class="fas fa-play"></i> شاهد الأن</button>
                            <div class="post_action_btns">
                                <button class="post_action_btn add_to_fav" id="add_to_fav" data-first_load="false"><i class="far fa-circle-notch fa-spin-center"></i></button>
                                <button class="post_action_btn share_this_post"><i class="fal fa-share-alt"></i></button>
                                <button class="post_action_btn" id="download_this_post"><i class="fas fa-long-arrow-down"></i></button>
                                ${notify_btn}
                            </div>
                            ${watch_trailer_btn}
                        </div>
                        <span class="post_description" id="video_description">${film_data.description}</span>
                    </div>
                </div>

            </div>
            <div class="moasm_and_7alakat">
                <div class="mou_vid_container" id="moasm_elmoslsal_container" style="display:none;">
                    <h5 class="header-title">المواسم<span id="moasm_num"></span></h5>
                    <div class="halakat_container" data-add_tabindex>
                        <div class="halakat_btns" id="moasm_elmoslsal"></div>
                    </div>
                </div>
                <div class="mou_vid_container" id="hlakat_elmoslsal_container" style="display:none;">
                    <h5 class="header-title">الحلقات<span id="eposids_num"></span></h5>
                    <div class="halakat_container" data-add_tabindex>
                        <div class="halakat_btns" id="hlakat_elmoslsal" ></div>
                    </div>
                </div>
            </div>
            </div>`);
    if (typeof film_data.hide_story !== "undefined" && film_data.hide_story == true) {
        $(post_html).find("#story_container").hide();
    }

    $(".post_content").html(post_html).show();

    fix_tabindex();

    $(".share_urls_loading").hide();
    $(".share_btns").show();

    // get_app_db(function (app_db) {
    //     search_request = app_db.transaction("favs", "readwrite").objectStore('favs').index("title").getAll(film_data.title);
    //     search_request.onsuccess = function (event) {
    //         results = event.target.result;
    //         for (i = 0; i < results.length; i++) {
    //             obj = results[i];
    //             if (obj["server_name"] == mou_aflam_server.server_name) {
    //                 $(".add_to_fav").addClass("active");
    //                 $(".add_to_fav").html(`<i class="fad fa-heart"></i>`);
    //                 $(".add_to_fav").attr("data-vid_id", obj["synced_vid_id"]);
    //                 break;
    //             }
    //         }
    //     };
    // });

    $.ajax({
        type: "POST",
        url: elbatal_api + "share/fcm.php",
        data: {
            action: "is_query_in_fav",
            query: query_data,
            token: mou_custom_encode(user_data.user_id + "#" + what_window.dev_id)
        },
        success: function (data, textStatus, xhr) {
            $(".add_to_fav").attr("data-first_load", "true");
            $(".add_to_fav").html(`<i class="fal fa-plus"></i>`);

            for (var i = 0; i < Object.keys(data.messages).length; i++) {
                message_code = Object.keys(data.messages)[i];
                message = data.messages[message_code];
                if (message_code == "200") {
                    $(".add_to_fav").addClass("active");
                    $(".add_to_fav").html(`<i class="fad fa-heart"></i>`);
                    $(".add_to_fav").attr("data-vid_id", data.messages["vid_id"]);

                }
            }


        }, error: function (jqXHR, error, errorThrown) {
            $(".add_to_fav").attr("data-first_load", "true");

        }
    });



}

// if (query_play_film == false) {
//     $("style#servers_btns_container").remove();
// }

function get_latest_url_redrict(url, callback) {
    $.ajax({
        type: "HEAD",
        url: url,
        xhr: function () {
            this.http_req = "http_" + Date.now();
            window[this.http_req] = new XMLHttpRequest();
            return window[this.http_req];
        },
        success: function (data, textStatus, xhr) {
            req_url = this.url;
            res_url = window[this.http_req].responseURL;
            if (res_url !== req_url) {
                get_latest_url_redrict(res_url, callback);
            } else {
                callback(true, res_url);
            }
        }, error: function (jqXHR, error, errorThrown) {
            res_url = window[this.http_req].responseURL;
            callback(false, res_url);
        }
    });
}
function get_web_video_server_name(name = false, link = false) {
    if (name !== false) {
        for (i = 0; i < Object.keys(web_video_servers).length; i++) {
            web_video_key = Object.keys(web_video_servers)[i];
            for (n = 0; n < web_video_servers[web_video_key]["names"].length; n++) {
                s_name = web_video_servers[web_video_key]["names"][n];
                if (s_name == name) {
                    return web_video_key;
                }
            }
        }
    }
    if (link !== false) {
        this_link_domain = getDomainWithoutSubdomain(link);
        for (i = 0; i < Object.keys(web_video_servers).length; i++) {
            web_video_key = Object.keys(web_video_servers)[i];
            for (n = 0; n < web_video_servers[web_video_key]["domains"].length; n++) {
                s_domain = web_video_servers[web_video_key]["domains"][n];
                if (s_domain == this_link_domain) {
                    return web_video_key;
                }
            }
        }
    }
    return false;
}
web_video_servers = {
    "VidPro": {
        names: ["VidPro", "vidpro"],
        domains: ["vidpro.net"],
        get_server_urls: function (this_btn, link, referer, callback) {
            $.MouAjax({
                "type": "GET",
                "url": link,
                "headers": { "referer": referer },
                success: function (res) {
                    structure_doc = new DOMParser().parseFromString(res, "text/html");
                    srces = [];
                    src = {};
                    $(structure_doc).find("script[type='text/javascript']").each(function () {
                        this_script = $(this).text();
                        if (/eval\((.*)\)/gm.test(this_script)) {
                            unpacked = unPack(this_script).replace(/(\r\n|\n|\r|\t)/gm, "");
                            eval("vid_srces = " + /sources:(\[{file:".*}\]),image/gm.exec(unpacked)[1]);
                            for (i = 0; i < vid_srces.length; i++) {
                                src["src_name"] = vid_srces[i].label;
                                src["src_link"] = vid_srces[i].file;
                                srces.push(src);
                            }
                            callback(this_btn, srces);
                        }

                    })
                }
            });


        }
    },
    "vedbom": {
        names: ["vedbom"],
        domains: ["vadbam.net"],
        get_server_urls: function (this_btn, link, referer, callback) {

            $.MouAjax({
                "type": "GET",
                "url": link,
                "headers": { "referer": referer },
                success: function (res) {
                    structure_doc = new DOMParser().parseFromString(res, "text/html");
                    srces = [];
                    src = {};

                    eval("vid_srces = " + /sources:.*(\[{file:".*}\]),/gm.exec(res)[1]);
                    for (i = 0; i < vid_srces.length; i++) {
                        src["src_name"] = vid_srces[i].label;
                        src["src_link"] = vid_srces[i].file;
                        srces.push(src);
                    }
                    callback(this_btn, srces);

                }
            });

        }

    }
};
function getDomainWithoutSubdomain(url) {
    const urlParts = new URL(url).hostname.split('.')

    return urlParts
        .slice(0)
        .slice(-(urlParts.length === 4 ? 3 : 2))
        .join('.')
}

$("#fix_movies_servers").click(function () {
    updated_server_domain = {};
    localStorage.setItem("updated_server_domain", JSON.stringify(updated_server_domain));
    $(`[data-full_iframe_target_url="movies.html"]`).click();
});

jQuery.fn.rotate = function (degrees) {
    $(this).css({ 'transform': 'rotate(' + degrees + 'deg)' });
    return $(this);
};
// $(document).on("click", "#toggle_cats_container", function () {
//     if ($(this).attr("data-is_opend") == "true") {
//         close_cats_container();
//     } else {
//         open_cats_container();
//     }
// });
// function open_cats_container() {
//     $(".closer_cats_container").removeClass("hide");
//     $("#toggle_cats_container").attr("data-is_opend", "true");
//     $("#toggle_cats_container i").rotate(0);
// }
// function close_cats_container() {
//     $(".closer_cats_container").addClass("hide");
//     $("#toggle_cats_container").attr("data-is_opend", "false");
//     $("#toggle_cats_container i").rotate(180);
// }


$(document).on("click", ".vide_container", function (e) {
    e.preventDefault();
    if (!$(this).hasClass("preloader_item")) {

        query_data = JSON.parse(JSON.stringify($(this)[0].dataset));
        query_data["film_server_name"] = mou_aflam_server.server_name;
        query_data = encodeQueryData(query_data);
        vid_url = window.location.origin + window.location.pathname + "?" + query_data;
        what_window.Show_magic(function () {
            if (window.parent) {
                window.parent.open_film_on_iframe("#watch_frame", vid_url);
            } else {
                open_film_on_iframe("#watch_frame", vid_url);
            }
        })
    }

});


$(document).on("click", "#mou_watch_btn", function () {
    $("#watch_popup").openpopup();
});

$(document).on("click", "#download_this_post", function () {
    $("#dl_popup").openpopup();
});

$(document).on("click", ".share_this_post", function () {
    $(".share_this_post").html(`<i class="far fa-circle-notch fa-spin-center"></i>`);
    share_title = film_data.title;
    share_body = "";
    if (typeof notification_detected_tobics !== "undefined" && notification_detected_tobics.includes("movies")) {
        halka_text = $("#hlakat_elmoslsal .mou_eps_num.activee ,#hlakat_elmoslsal .mou_eps_num.loading").length > 0 ? " الحلقة " + $("#hlakat_elmoslsal .mou_eps_num.activee ,#hlakat_elmoslsal .mou_eps_num.loading").find("em").text() : "";

        share_title = film_data.title + (film_data.film_type == "film" ? "" : halka_text);

        share_body = "مشاهدة " + film_data.title + (film_data.film_type == "film" ? "" : " الحلقة " + $("#hlakat_elmoslsal .mou_eps_num.activee ,#hlakat_elmoslsal .mou_eps_num.loading").find("em").text());
        $("#notify_body").val(notify_body);


    }
    this_vid_img = $(".post_img_container img")[0];
    this_vid_img_width = $(".post_img_container img").width();
    this_vid_img_height = $(".post_img_container img").height();
    $("#canvasElement").attr("width", this_vid_img_width).attr("height", this_vid_img_height);
    canvasElmt = $("#canvasElement")[0];
    ctx = canvasElmt.getContext("2d");
    ctx.drawImage(this_vid_img, 0, 0, this_vid_img_width, this_vid_img_height);
    img_base64 = $("#canvasElement")[0].toDataURL();
    // var share_server_api = "https://mou.elbatal-app.com/app/share.php";
    var share_server_api = elbatal_api + "share/fcm.php";
    $.ajax({
        type: "POST",
        url: share_server_api,
        data: {
            action: "share",
            share_title: share_title,
            share_body: share_body,
            qurey_data: query_data,
            img_base64: img_base64,
            token: mou_custom_encode(user_data.user_id + "#" + what_window.dev_id),
        },
        success: function (data, textStatus, xhr) {
            $(".share_this_post").html(`<i class="fal fa-share-alt"></i>`);

            for (var i = 0; i < Object.keys(data.messages).length; i++) {
                message_code = Object.keys(data.messages)[i];
                message = data.messages[message_code];
                if (message_code == 200) {

                    share_link = message;
                    share_subject = share_title + "\n" + share_link;
                    if (typeof mouscripts !== "undefined") {
                        share_text_to_apps(share_subject, share_link);
                    } else {
                        console.log(share_subject);
                    }


                } else if (message_code == 402) {
                    $("#verify_alert").removeClass("d-none");
                    $("#submit_notify").text("تأكيد");
                    $("#verify_notify").val("true");
                }
            }


        }, error: function (jqXHR, error, errorThrown) {

        }
    });
});


$(document).on("click", ".add_to_fav", function () {
    this_btn = $(this);
    if ($(this_btn).attr("data-first_load") !== "false") {

        if ($(this_btn).attr("data-canclick") !== "false") {
            $(this_btn).attr("data-canclick", "false");
            $(this_btn).html(`<i class="far fa-circle-notch fa-spin-center"></i>`);

            if (typeof $(this_btn).attr("data-vid_id") == "undefined") {

                get_app_db(function (app_db) {
                    this_vid_img = $(".post_img_container img")[0];
                    this_vid_img_width = $(".post_img_container img").width();
                    this_vid_img_height = $(".post_img_container img").height();
                    canvasElmtWidth = 360;
                    canvasElmtHeight = canvasElmtWidth * this_vid_img_height / this_vid_img_width;


                    $("#canvasElement").attr("width", canvasElmtWidth).attr("height", canvasElmtHeight);
                    canvasElmt = $("#canvasElement")[0];
                    ctx = canvasElmt.getContext("2d");
                    ctx.drawImage(this_vid_img, 0, 0, canvasElmtWidth, canvasElmtHeight);
                    img_base64 = $("#canvasElement")[0].toDataURL();

                    db_transaction = app_db.transaction("favs", "readwrite");
                    FavsStore = db_transaction.objectStore("favs");
                    db_request = FavsStore.add({
                        "title": film_data.title,
                        "query": query_data,
                        "img_file": img_base64,
                        "server_img_url": film_data.img,
                        "server_name": mou_aflam_server.server_name,
                        "synced": false
                    });
                    db_request.onsuccess = function (e) { // (4)
                        lastInsertId = db_request.result;


                        $(what_window.document).find("#no_favs_alert").hide();
                        $(what_window.document).find("#fav_posts").prepend(`<a data-id="${lastInsertId}" data-href="${query_data}" class="vide_container my_box_shadow">
            <div class="vide_container_overlay"></div>
            <span class="vide_thump" style="background:url(${img_base64}) no-repeat center center;background-size: cover"></span>
            <div class="vide_disc">
                <div class="about_vid">
                    <div class="vid_detailes_container">
                        <h3>${film_data.title}</h3>
                    </div>
                </div>
            </div>
        </a>`);

                        what_window.sync_vid_to_server({
                            "title": film_data.title,
                            "query": query_data,
                            "img_file": img_base64,
                            "server_img_url": film_data.img,
                            "server_name": mou_aflam_server.server_name,
                            "local_vid_id": lastInsertId
                        }, "fav", $(this_btn))
                    };
                    db_request.onerror = function () {
                        if (db_request.error.name == "ConstraintError") {
                            console.log(db_request.error);

                        } else {
                            console.log("Error", db_request.error);
                        }
                    };
                });

            } else {
                synced_vid_id = $(this_btn).attr("data-vid_id");

                what_window.delete_fav(synced_vid_id, "server", $(this_btn));


            }


            // get_app_db(function (app_db) {
            //     search_request = app_db.transaction("favs", "readwrite").objectStore('favs').index("title").getAll(film_data.title);
            //     search_request.onsuccess = function (event) {
            //         results = event.target.result;
            //         fav_found_id = false;
            //         for (i = 0; i < results.length; i++) {
            //             obj = results[i];
            //             if (obj["server_name"] == mou_aflam_server.server_name) {
            //                 fav_found_id = obj["id"];
            //                 break;
            //             }
            //         }
            //         if (fav_found_id == false) {
            //             this_vid_img = $(".post_img_container img")[0];
            //             this_vid_img_width = $(".post_img_container img").width();
            //             this_vid_img_height = $(".post_img_container img").height();
            //             canvasElmtWidth = 360;
            //             canvasElmtHeight = canvasElmtWidth * this_vid_img_height / this_vid_img_width;


            //             $("#canvasElement").attr("width", canvasElmtWidth).attr("height", canvasElmtHeight);
            //             canvasElmt = $("#canvasElement")[0];
            //             ctx = canvasElmt.getContext("2d");
            //             ctx.drawImage(this_vid_img, 0, 0, canvasElmtWidth, canvasElmtHeight);
            //             img_base64 = $("#canvasElement")[0].toDataURL();

            //             db_transaction = app_db.transaction("favs", "readwrite");
            //             FavsStore = db_transaction.objectStore("favs");
            //             db_request = FavsStore.add({
            //                 "title": film_data.title,
            //                 "query": query_data,
            //                 "img_file": img_base64,
            //                 "server_img_url": film_data.img,
            //                 "server_name": mou_aflam_server.server_name,
            //                 "synced": false
            //             });
            //             db_request.onsuccess = function (e) { // (4)
            //                 lastInsertId = db_request.result;


            //                 $(what_window.document).find("#no_favs_alert").hide();
            //                 $(what_window.document).find("#fav_posts").prepend(`<a data-id="${lastInsertId}" data-href="${query_data}" class="vide_container my_box_shadow">
            //         <div class="vide_container_overlay"></div>
            //         <span class="vide_thump" style="background:url(${img_base64}) no-repeat center center;background-size: cover"></span>
            //         <div class="vide_disc">
            //             <div class="about_vid">
            //                 <div class="vid_detailes_container">
            //                     <h3>${film_data.title}</h3>
            //                 </div>
            //             </div>
            //         </div>
            //     </a>`);

            //                 what_window.sync_vid_to_server({
            //                     "title": film_data.title,
            //                     "query": query_data,
            //                     "img_file": img_base64,
            //                     "server_img_url": film_data.img,
            //                     "server_name": mou_aflam_server.server_name,
            //                     "local_vid_id": lastInsertId
            //                 }, "fav", $(this_btn))
            //             };
            //             db_request.onerror = function () {
            //                 if (db_request.error.name == "ConstraintError") {
            //                     console.log(db_request.error);

            //                 } else {
            //                     console.log("Error", db_request.error);
            //                 }
            //             };
            //         } else {
            //             delete_fav(fav_found_id, $(this_btn));
            //         }


            //     };



            // })


        }
    }
});


if (typeof notify_topics !== "undefined") {
    for (i = 0; i < Object.keys(notify_topics).length; i++) {
        notify_title = Object.keys(notify_topics)[i];
        notify_topic = notify_topics[notify_title];
        switch_html = $(`<label class="mou_check_box_container" data-tobic="${notify_topic}">${notify_title}<input type="checkbox"><span class="checkmark"></span></label>`);
        $(".notify_select").append(switch_html);
    }
}

$("#send_notify_with_img").change(function () {
    if ($("#send_notify_with_img").is(":checked") == true) {
        $("#canvasElement").slideDown();
    } else {
        $("#canvasElement").slideUp();
    }
});
$(document).on("click", "#notify_this_post", function () {

    if (film_data.film_type == "muslsal" && $("#hlakat_elmoslsal .mou_eps_num.activee ,#hlakat_elmoslsal .mou_eps_num.loading").length == 0) {
        showToast('يرجي اختيار حلقة .');
        return false;;
    }

    this_vid_img = $(".post_img_container img")[0];
    this_vid_img_width = $(".post_img_container img").width();
    this_vid_img_height = $(".post_img_container img").height();
    $("#canvasElement").attr("width", this_vid_img_width).attr("height", this_vid_img_height);
    canvasElmt = $("#canvasElement")[0];
    ctx = canvasElmt.getContext("2d");
    ctx.drawImage(this_vid_img, 0, 0, this_vid_img_width, this_vid_img_height);
    $("#notify_title").val(film_data.title);

    if (typeof mou_aflam_server.notification_detected_tobics !== "undefined" && mou_aflam_server.notification_detected_tobics.includes("movies")) {

        halka_text = $("#hlakat_elmoslsal .mou_eps_num.activee ,#hlakat_elmoslsal .mou_eps_num.loading").length > 0 ? " الحلقة " + $("#hlakat_elmoslsal .mou_eps_num.activee ,#hlakat_elmoslsal .mou_eps_num.loading").find("em").text() : "";

        $("#notify_title").val(film_data.title + (film_data.film_type == "film" ? "" : halka_text));

        notify_body = "مشاهدة " + film_data.title + (film_data.film_type == "film" ? "" : halka_text);
        $("#notify_body").val(notify_body);
    }


    $("#verify_notify").val("false");
    $("#verify_alert").addClass("d-none");
    $("#submit_notify").text("ارسال");

    if (typeof mou_aflam_server.notification_detected_tobics !== "undefined") {
        for (i = 0; i < mou_aflam_server.notification_detected_tobics.length; i++) {
            detected_tobic = mou_aflam_server.notification_detected_tobics[i];
            $(`.notify_select [data-tobic="${detected_tobic}"]`).find("input").attr("checked", true);
        }
    }

    $("#notify_popup").openpopup();
});
$(document).on("click", "#submit_notify", function () {
    tobics_selected = [];
    $(".notify_select .mou_check_box_container").each(function () {
        notify_tobic = $(this).attr("data-tobic");
        is_notify_selected = $(this).find("input").is(":checked");
        if (is_notify_selected) {
            tobics_selected.push(notify_tobic);
        }
    });


    notify_title = $("#notify_title").val();
    notify_body = $("#notify_body").val();
    send_notify_with_img = $("#send_notify_with_img").is(":checked");
    verify_notify = $("#verify_notify").val() == "true" ? true : false;

    if (send_notify_with_img) {
        img_base64 = $("#canvasElement")[0].toDataURL();
    } else {
        img_base64 = false;
    }

    now_query_data = query_data;

    $.ajax({
        type: "POST",
        url: elbatal_api + "share/fcm.php",
        data: {
            action: "sent_to_tobic",
            notify_title: notify_title,
            notify_body: notify_body,
            send_notify_with_img: send_notify_with_img,
            img_base64: img_base64,
            qurey_data: now_query_data,
            to_topics: JSON.stringify(tobics_selected),
            token: mou_custom_encode(user_data.user_id + "#" + what_window.dev_id),
            verify_notify: verify_notify
        },
        success: function (data, textStatus, xhr) {
            for (var i = 0; i < Object.keys(data.messages).length; i++) {
                message_code = Object.keys(data.messages)[i];
                message = data.messages[message_code];
                if (message_code == 200) {
                    $("#notify_popup").closepopup();

                    alert("تم ارسال الاشعار بنجاح");

                } else if (message_code == 402) {
                    $("#verify_alert").removeClass("d-none");
                    $("#submit_notify").text("تأكيد");
                    $("#verify_notify").val("true");
                }
            }


        }, error: function (jqXHR, error, errorThrown) {

        }
    });


});
$(document).on("click", "#submit_search_in_aflam", function () {

    $(".post_content").hide();
    $("#posts_ul").html("");
    $("#extra_title").text(" - البحث");
    search_key = $("#aflam_search .aflam_search_key").val();
    if (search_key == "") {
        showToast("يرجي ادخال كلمة البحث");
    } else {
        mou_aflam_server["search_function"](search_key);
        $("#aflam_search").closepopup();
    }

});

function show_trailer_btn(trailer_url) {
    $("#watch_trailer_btn").remove();
    trailer_btn = `<button class="mou_watch_btn" id="watch_trailer_btn" data-trailer_link="${trailer_url}"><i class="fas fa-play"></i>مشاهدة التريلر</button>`;
    $(".watch_and_actions").append(trailer_btn);

}
