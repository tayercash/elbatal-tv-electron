obj =
{
    "main_domain": "https://cima4u1.cyou",
    "server_domain": "https://cima4u3.bond/",
    "get_server_domain": function (this_noww_main_domain, callback = callback) {
        $.ajax({
            "type": "GET",
            "url": "https://www.google.com/search?q=cima4u",
            success: function (res) {
                doc = new DOMParser().parseFromString(res, "text/html");
                $(doc).find(".MjjYud").each(function () {
                    url = $(this).find("a[href]").attr("href");
                    if (isValidUrl(url)) {
                        domain = new URL(url);
                        domain = domain.protocol + "//" + domain.hostname;

                        if (domain.includes("cima4u.")) {
                            $.ajax({
                                "type": "GET",
                                "url": domain,
                                success: function (domain_res) {
                                    callback(this_noww_main_domain, this.url);
                                }
                            });
                        }
                    }
                });
            }
        })
    },
    "working_state": true,
    "type": "cats",
    "server_title": "سيما فور يو",
    "icon": `<i class="fas fa-film"></i>`,
    "load_list_function": function (res, load_type = "first_load") {
        aflam_json = {};
        aflam_posts = [];
        doc = new DOMParser().parseFromString(res, "text/html");

        $(doc).find(".Cima4uBlocks").find(".MovieBlock").each(function () {
            film = {};
            film.url = decodeURI($(this).find("a[href]").attr("href"));
            film.type = $(this).find(".Number").length > 0 ? "muslsal" : "film";
            film.type = film.url.includes("/Episode/") || film.url.includes("مسلسل") || $(this).find(".Number").length > 0 ? "muslsal" : "film";

            $(this).find(".BoxTitleInfo").remove();
            film.title = $(this).find(".BoxTitle").text().trim();

            if (/^مشاهدة مسلسل(.*)حلقه/gm.test(film.title) == true) {
                film.title = /^مشاهدة مسلسل(.*)حلقه/gm.exec(film.title)[1].trim();
            } else if (/^مشاهدة مسلسل(.*)/gm.test(film.title) == true) {
                film.title = /^مشاهدة مسلسل(.*)/gm.exec(film.title)[1].trim();
            } else if (/^مشاهدة فيلم(.*)/gm.test(film.title) == true) {
                film.title = /^مشاهدة فيلم(.*)/gm.exec(film.title)[1].trim();
            }

            if (/ حلقة \d+/gm.test(film.title) == true) {
                film.title = film.title.replace(/( حلقة \d+)/gm, "");
            }
            if ($(this).find(`.Number`).length > 0) {
                film.eposide = parseInt($(this).find(`.Number span`).text().trim().match(/(\d+)/)[0], 10);
            }

            img_style_string = $(this).find(".Thumb .Half1").attr("style");
            film.img = /(https.*)\)/gm.exec(img_style_string)[1];


            aflam_posts.push(film);
        });
        aflam_json.server_title = now_server_title;
        aflam_json.aflam = aflam_posts;

        $(doc).find(`.pagination ul.page-numbers *.page-numbers`).each(function (index) {
            if ($(this).hasClass("current")) {
                next_button = $(doc).find(`.pagination ul.page-numbers .page-numbers`).eq(index + 1);
                if (next_button.length > 0) {
                    next_page_link = $(next_button).attr("href");
                    aflam_json.next_page = next_page_link;
                }
            }
        });
        load_aflam_posts(aflam_json, load_type);
    },
    search_function: function (key) {
        search_url = now_aflam_server_domain + "/search/" + key + "/";
        $("#load_more_posts_btn").html("جاري التحميل");
        $(".servers_btns_container").hide();
        $(".server_content").show();
        $.ajax({
            "type": "GET",
            "url": search_url,
            success: function (res) {
                now_load_list_function(res, "search");
                $("#load_more_posts_btn").html("تحميل المزيد");
            }
        });
    },
    load_film_function: function (film) {
        film_title = film.film_title;
        film_url = film.film_url;
        film_img = film.film_img;
        page_type = film.film_type;
        $.ajax({
            "type": "GET",
            "url": film_url,
            success: function (res) {
                film_data = {};
                film_trs = {};
                doc = new DOMParser().parseFromString(res, "text/html");
                film_data.title = film_title;
                film_data.film_type = page_type;

                if (/ حلقة \d+/gm.test(film_data.title) == true) {
                    film_data.title = film_data.title.replace(/( حلقة \d+)/gm, "");
                }

                if (film_img == false || film_img == "") {
                    film_data.img = $(doc).find(`.SinglePoster img`).attr("src");
                } else {
                    film_data.img = film_img;
                }

                film_data.description = $(doc).find(`.Story p`).text();

                $(doc).find(`.InformationList li`).each(function () {
                    tr = {};
                    tr_key = $(this).find("span").text().replace(":", "").trim();
                    tr_val = $(this).find("a").text().trim();
                    if (["مدة العرض", "السنه", "السنة", "اللغة", "الجودة", "الدولة"].includes(tr_key)) {
                        film_trs[tr_key] = tr_val;
                    }
                })
                film_data.trs = film_trs;
                show_film_data(film_data);
                watch_url = $(doc).find(`.WatchNow`).parents("a").attr("href");

                if (page_type == "film") {
                    load_cima_4u_watch_server(watch_url, "film", film_url);
                } else if (page_type == "muslsal") {
                    $.ajax({
                        "type": "GET",
                        "url": watch_url,
                        success: function (doc) {

                            if ($(doc).find(".EpisodesSection .EpisodeItem").length > 0) {

                                halkat_num = $(doc).find(".EpisodesSection .EpisodeItem").length;
                                $("#eposids_num").text(` ( ${halkat_num} ) `);
                                $(doc).find(`.EpisodesSection .EpisodeItem`).each(function () {

                                    halka_num = parseInt($(this).find("span").text().trim().match(/(\d+)/)[0], 10);
                                    epo_link = $(this).find("a").attr("href");
                                    active_class = "";
                                    if ($(this).hasClass("active")) {
                                        active_class = " activee";
                                    }

                                    $("#hlakat_elmoslsal").append(`<a class="mou_eps_num${active_class}" onclick="load_cima_4u_watch_server('${epo_link}','muslsal','${epo_link}',this)"><em>${halka_num}</em><span>حلقة</span></a>`);
                                });

                                $(".mou_eps_num.activee").click();
                                $("#hlakat_elmoslsal_container").show();
                            }

                        }
                    })
                }

            }
        });

    },
    load_7alakat_function: function (this_btn) {
        link = $(this_btn).attr("data-link");
        $("#msader_elmoshda,#msader_eltahmel").hide();
        $("#hlakat_elmoslsal").html(`<span><i class="fas fa-circle-notch fa-spin fa-lg"></i> جاري التحميل</span>`);
        $.ajax({
            "type": "GET",
            "url": link,
            success: function (res) {
                $("#hlakat_elmoslsal").html("");
                doc = new DOMParser().parseFromString(res, "text/html");
                halkat_num = $(doc).find(`.Episodes--Seasons--Episodes a`).length;
                $("#eposids_num").text(` ( ${halkat_num} ) `);
                $(doc).find(`.Episodes--Seasons--Episodes a`).each(function () {
                    halka_num = parseInt($(this).find("episodetitle").text().trim().match(/(\d+)/)[0], 10);
                    epo_link = $(this).attr("href");
                    active_class = "";
                    if ($(this).hasClass("active")) {
                        active_class = " activee";
                    }

                    $("#hlakat_elmoslsal").append(`<a class="mou_eps_num${active_class}" onclick="load_this_watch_server('${epo_link}','muslsal','${epo_link}',this)"><em>${halka_num}</em><span>حلقة</span></a>`);
                });



            }
        })
    }, load_msadr_watch_function: function (link, watch_type, referer = "") {
        // $("#msader_elmoshda,#msader_eltahmel").prepend(`<span class="loading_span"><i class="fas fa-circle-notch fa-spin fa-lg"></i></span>`);
        $(".watch_sources,.download_sources").html("");

        $.ajax({
            "type": "GET",
            "url": link,
            success: function (watching_res) {
                watching_doc = new DOMParser().parseFromString(watching_res, "text/html");
                latest_domain = $(watching_doc).find(".NavigationMenu li a[href]").attr("href");
                latest_domain = new URL(latest_domain);
                latest_domain = latest_domain.protocol + "//" + latest_domain.hostname + "/";
                $(watching_doc).find(".serversWatchSide a").each(function () {
                    servre_name = $(this).text().trim();
                    server_link = change_subdomain(now_aflam_server_domain, "tv22") + "structure/server.php?id=" + $(this).attr("data-link");
                    server_link = latest_domain + "structure/server.php?id=" + $(this).attr("data-link");
                    server_srces_available = get_web_video_server_name(servre_name);
                    if (server_srces_available !== false) {

                        $(`<span class="mou_btn" onclick="play_cima4u_web_server(this,\`${server_link}\`,\`${server_srces_available}\`, \`${link}\`)">${server_srces_available}</span>`).appendTo(".watch_sources");

                        $(`<span class="mou_btn" onclick="play_cima4u_web_server(this,\`${server_link}\`,\`${server_srces_available}\`, \`${link}\`)">${server_srces_available}</span>`).appendTo(".download_sources");

                    }


                })


            }
        });


    }
    ,
    "cats": function (callback) {
        $(".servers_btns_container").prepend(`<span class="mou_btn alert"><i class="fas fa-circle-notch fa-spin fa-lg"></i> جاري التحميل </span>`)

        $.ajax({
            "type": "GET",
            "url": now_aflam_server_domain,
            success: function (homepage) {
                $(".servers_btns_container .alert").remove();
                doc = new DOMParser().parseFromString(homepage, "text/html");
                cats_obj = {};
                cats_obj["الافلام"] = {};
                cats_obj["الافلام"]["type"] = "cats";
                cats_obj["الافلام"]["icon"] = `<i class="fas fa-film"></i>`;
                cats_obj["الافلام"]["cats"] = {};
                cats_obj["المسلسلات"] = {};
                cats_obj["المسلسلات"]["type"] = "cats";
                cats_obj["المسلسلات"]["icon"] = `<i class="fas fa-film"></i>`;
                cats_obj["المسلسلات"]["cats"] = {};

                $(doc).find(".NavigationMenu > .menu-item").eq(1).find(".sub-menu li a").each(function () {
                    link_url = $(this).attr("href").replace(/^.*\/\/[^\/]+/, '');
                    link_text = $(this).text().trim();
                    if (["افلام اجنبي", "افلام هندي", "افلام كرتون", "افلام اسيوية", "افلام عربي", "افلام تركية"].includes(link_text)) {

                        cats_obj["الافلام"]["cats"][link_text] = {};
                        cats_obj["الافلام"]["cats"][link_text]["type"] = "list";
                        cats_obj["الافلام"]["cats"][link_text]["url"] = link_url;
                        cats_obj["الافلام"]["cats"][link_text]["icon"] = `<i class="fas fa-film"></i>`;
                    }
                });

                $(doc).find(".NavigationMenu > .menu-item").eq(2).find(".sub-menu li a").each(function () {
                    link_url = $(this).attr("href").replace(/^.*\/\/[^\/]+/, '');
                    link_text = $(this).text().trim();
                    if (["مسلسلات اجنبي", "مسلسلات اسيوية", "مسلسلات كرتون", "مسلسلات تركية", "مسلسلات هندية", "مسلسلات عربية", "مسلسلات رمضان 2023", "مسلسلات لاتينية"].includes(link_text)) {
                        cats_obj["المسلسلات"]["cats"][link_text] = {};
                        cats_obj["المسلسلات"]["cats"][link_text]["type"] = "list";
                        cats_obj["المسلسلات"]["cats"][link_text]["url"] = link_url;
                        cats_obj["المسلسلات"]["cats"][link_text]["icon"] = `<i class="fas fa-film"></i>`;
                    }
                });

                callback(cats_obj);

            }
        })



    }
};
function get_cima4u_watch_server_link(this_btn, server_link, server_name, referer_link, callback) {
    $.ajax({
        "type": "get",
        "url": server_link,
        success: function (structure) {
            structure_doc = new DOMParser().parseFromString(structure, "text/html");
            watch_link = $(structure_doc).find("iframe").attr("src").replace(/(\r\n|\n|\r)/gm, "");
            callback(this_btn, watch_link, server_name, referer_link);
        }
    });
}
function load_cima_4u_watch_server(link, type, referer = "", this_btn = false) {
    $("#msader_elmoshda").show();
    $("#msader_eltahmel").show();

    if (this_btn !== false) {


        $("#hlakat_elmoslsal_container .mou_eps_num").removeClass("activee");
        $(this_btn).addClass("activee");
        now_load_msadr_watch_function(link, type, referer);
        // $.ajax({
        //     "type": "GET",
        //     "url": link,
        //     success: function (res) {
        //         doc = new DOMParser().parseFromString(res, "text/html");
        //         watch_url = $(doc).find(`.MyCimaServer btn`).attr("data-url");
        //     }
        // });
    } else {
        now_load_msadr_watch_function(link, type, referer);
    }
}

function play_embed_server_from_this_server(src_link, title, referer) {
    play_vid(src_link, title, `Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36`, referer);

}
function add_for_downlaod_this_server(dir, full_title, typee, src_link, type, headers) {

    add_for_downlaod(dir, full_title, typee, src_link, type, headers);

}
function change_subdomain(url, toSubdomain) {
    const replace = "://" + toSubdomain + ".";
    if (!/^\w*:\/\//.test(url)) {
        url = "http://" + url;
    }
    // Check if we got a subdomain in url
    if (url.match(/\.\w*\b/g).length > 1) {
        return url.replace(/(:\/\/\w+\.)/, replace)
    }
    return url.replace(/:\/\/(\w*\.)/, `${replace}$1`)
}
mou_aflam_servers_array["سيما فور يو"] = obj;

function get_video_src_vidbam(link, callback) {
    $.ajax({
        "type": "GET",
        "url": link,
        success: function (html) {
            if (/sources:.*(\[.*\]),/gm.test(html)) {
                bad_json = /sources:.*(\[.*\]),/gm.exec(html)[1];
                eval(`srcs_array = ` + bad_json.replace(/\s*(['"])?([a-z0-9A-Z_\.]+)(['"])?\s*:([^,\}]+)(,)?/g, '"$2": $4$5'));
                srces = {};
                srces["sources"] = [];
                for (i = 0; i < srcs_array.length; i++) {
                    src = srcs_array[i];
                    quality_name = src.label;
                    src_link = src.file;
                    src_obj = {};
                    src_obj["quality"] = quality_name;
                    src_obj["link"] = src_link;
                    srces["sources"].push(src_obj);
                }
                // srces["referer"] = "";
                callback(srces);
            }

        }
    });
}
function get_video_src_Uqload(link, callback) {
    $.ajax({
        "type": "GET",
        "url": link,
        success: function (html) {

            if (/sources:.*(\[.*\]),/gm.test(html)) {
                bad_json = /sources:.*(\[.*\]),/gm.exec(html)[1];
                eval(`srcs_array = ` + bad_json);

                srces = {};
                srces["sources"] = [];
                for (i = 0; i < srcs_array.length; i++) {
                    src = srcs_array[i];
                    quality_name = "360p";
                    src_obj = {};
                    src_obj["quality"] = quality_name;
                    src_obj["link"] = src;
                    srces["sources"].push(src_obj);
                }
                srces["referer"] = "https://uqload.co/";
                callback(srces);

            }
        }
    });
}

function play_cima4u_web_server(this_btn, server_link, server_name, referer_link) {
    if ($(this_btn).parents('.has_child_servers').length) {
        $(this_btn).parents('.has_child_servers').find(".child_servers").remove();
        $(this_btn).unwrap(".has_child_servers");

    } else {
        $(this_btn).wrap("<div class='has_child_servers'></div>");
        $(this_btn).parents('.has_child_servers').append("<div class='child_servers'></div>");

        get_cima4u_watch_server_link(this_btn, server_link, server_name, referer_link, function (this_btn, watch_link, server_name, referer_link) {
            referer_link = encodeURI(referer_link);
            web_video_servers[server_name].get_server_urls(this_btn, watch_link, referer_link, function (this_btn, srces) {
                watch_html = "";
                download_html = "";
                for (i = 0; i < srces.length; i++) {
                    src_name = srces[i].src_name;
                    src_link = srces[i].src_link;


                    watch_html += `<span class="mou_btn" onclick="play_vid('${src_link}', '${film_title + " - " + src_name}','Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36', \`{'Referer':'${referer_link}'}\`)">${src_name}</span>`;

                    download_html += `<span class="mou_btn" onclick="add_for_downlaod('downloads','${film_title + " - " + src_name}', false,'${src_link}' ,'video', \`{ 'Referer': 'https://cc.cimanow.cc/' } \`)">${src_name}</span>`;

                }
                if ($(this_btn).parents('#msader_elmoshda').length) {
                    $(this_btn).parents(".has_child_servers").find(".child_servers").html(watch_html);

                }
                if ($(this_btn).parents('#msader_eltahmel').length) {
                    $(this_btn).parents(".has_child_servers").find(".child_servers").html(download_html);

                }

            });
        });
    }

}