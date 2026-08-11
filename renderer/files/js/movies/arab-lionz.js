obj =
{
    "main_domain": "https://arlionztv.click/",
    "server_domain": "https://arlionztv.rest/",
    "get_server_domain": function (this_noww_main_domain, callback) {
        $.ajax({
            "type": "GET",
            "url": "https://www.google.com/search?q=arlionztv",
            success: function (res) {
                doc = new DOMParser().parseFromString(res, "text/html");

                $(doc).find(".MjjYud").each(function () {
                    url = $(this).find("a[href]").attr("href");
                    if (isValidUrl(url)) {

                        domain = new URL(url);
                        domain = domain.protocol + "//" + domain.hostname;

                        if (domain.includes("arlionztv.")) {
                            $.ajax({
                                "type": "GET",
                                "url": domain,
                                success: function (domain_res) {
                                    // domain_doc = new DOMParser().parseFromString(domain_res, "text/html");
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
    "server_title": "عرب ليونز",
    "icon": `<i class="fas fa-film"></i>`,
    "load_list_function": function (res, load_type = "first_load") {
        aflam_json = {};
        aflam_posts = [];
        doc = new DOMParser().parseFromString(res, "text/html");

        blocked_posts_from_title = ["عرض الصيف على سيرفر Shof TV السنة بقت 15 شهر", "سيرفر عرب ليونز IPTV"];

        $(doc).find("boxed--is-box .Grid--ArabLionz").find(".Posts--Single--Box").each(function () {
            film = {};
            film.url = $(this).find("a[href]").attr("href");

            film.type = $(this).find("epsnumber--tag").length > 0 ? "muslsal" : "film";

            film.title = $(this).find("inner--title h2").text().trim();

            if (/^مشاهدة مسلسل(.*)/gm.test(film.title) == true) {
                film.title = /^مشاهدة مسلسل(.*)/gm.exec(film.title)[1].trim();
            }

            if ($(this).find(`epsnumber--tag`).length > 0) {
                film.eposide = parseInt($(this).find(`epsnumber--tag span`).text().trim().match(/(\d+)/)[0], 10);
            }

            film.img = $(this).find(".Box--Poster img").attr("data-image");

            show_post = true;
            for (i = 0; i < blocked_posts_from_title.length; i++) {
                if (film.title.includes(blocked_posts_from_title[i])) {
                    show_post = false;
                    break;
                }
            }
            if (show_post == true) {
                aflam_posts.push(film);
            }


        });
        aflam_json.server_title = now_server_title;
        aflam_json.aflam = aflam_posts;

        $(doc).find(`.paginate ul.page-numbers li`).each(function (index) {
            if ($(this).hasClass("active")) {
                next_button = $(doc).find(`.paginate ul.page-numbers li`).eq(index + 1);
                if (next_button.length > 0) {
                    next_page_link = $(next_button).find("a[href]").attr("href");
                    aflam_json.next_page = next_page_link;
                }
            }
        });
        load_aflam_posts(aflam_json, load_type);
    }, search_function: function (key) {
        search_url = now_aflam_server_domain + "search/" + key + "/";
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

                if (film_img == false || film_img == "") {
                    film_data.img = $(doc).find(`.Box--S--Poster img`).attr("src");
                } else {
                    film_data.img = film_img;
                }

                film_data.description = $(doc).find(`p.Singular--Story-P`).text().trim();

                $(doc).find(`.Index--Tax .Pop--Actors`).each(function () {
                    tr_key = $(this).find("h2 span").text().trim();
                    tr_val = $(this).find("ul li").text().trim();
                    if (["الجودات", "اللغات", "الجودات", "سنة الاصدار", "الفئة العمرية", "الاسم الاصلى", "الاسم بالعربى"].includes(tr_key)) {
                        film_trs[tr_key] = tr_val;
                    }
                })

                film_data.trs = film_trs;
                show_film_data(film_data);
                watch_url = this.url;
                if (page_type == "film") {
                    // load_this_watch_server(watch_url, "film", film_url);
                    load_arab_lionz_watch_server(watch_url, "film", film_url);
                } else if (page_type == "muslsal") {
                    if ($(doc).find("custom--select ul li").length > 0) {

                        $("#moasm_elmoslsal_container").show();
                        moasm_num = $(doc).find("custom--select ul li").length;
                        $("#moasm_num").text(` ( ${moasm_num} ) `);

                        $(doc).find("custom--select ul li").each(function () {

                            moasem_dic = {
                                1: ["الأول", "الاول", "1"],
                                2: ["الثاني", "2"],
                                3: ["الثالث", "3"],
                                4: ["الرابع", "4"],
                                5: ["الخامس", "5"],
                                6: ["السادس", "6"],
                                7: ["السابع", "7"],
                                8: ["الثامن", "8"],
                                9: ["التاسع", "9"]
                            }

                            mosem_text = $(this).find("span").text().trim();
                            mosem_link = $(this).find("a").attr("href");
                            if (mosem_text !== "") {

                                for (i = 0; i < Object.keys(moasem_dic).length; i++) {
                                    mosem_texts = moasem_dic[Object.keys(moasem_dic)[i]];
                                    for (e = 0; e < mosem_texts.length; e++) {
                                        this_mosem_text = mosem_texts[e];

                                        if (mosem_text.includes(this_mosem_text)) {
                                            mosem_num = Object.keys(moasem_dic)[i];
                                        }
                                    }
                                    if ($(this).hasClass("active")) {
                                        active_mosem = mosem_num;
                                    }
                                }
                                $("#moasm_elmoslsal").append(`<a class="mou_eps_num" data-link="${mosem_link}" onclick="load_7alakat(this)"><em>${mosem_num}</em><span>موسم</span></a>`);
                            }

                        });

                        $("#moasm_elmoslsal .mou_eps_num").each(function (index) {
                            if ($(this).find("em").text() == active_mosem) {
                                active_mosem_index = index;
                            }
                        })
                        $("#moasm_elmoslsal .mou_eps_num").eq(active_mosem_index).addClass("activee");
                    }

                    halkat_num = $(doc).find(`.Episode--Lists .JsutNumber`).length;
                    $("#eposids_num").text(` ( ${halkat_num} ) `);
                    $(doc).find(`.Episode--Lists .JsutNumber`).each(function () {
                        halka_num = parseInt($(this).find("a").text().trim().match(/(\d+)/)[0], 10);
                        epo_link = $(this).find("a").attr("href");
                        active_class = "";
                        if ($(this).hasClass("active")) {
                            active_class = " activee";
                        }

                        $("#hlakat_elmoslsal").append(`<a class="mou_eps_num${active_class}" onclick="load_arab_lionz_watch_server('${epo_link}','muslsal','${epo_link}',this)"><em>${halka_num}</em><span>حلقة</span></a>`);
                    });

                    $(".mou_eps_num.activee").click();
                    $("#hlakat_elmoslsal_container").show();
                }

            }
        });

    },
    load_7alakat_function: function (this_btn) {
        link = $(this_btn).attr("data-link");
        $("#msader_elmoshda,#msader_eltahmel").hide();
        // $("#hlakat_elmoslsal").html(`<span><i class="fas fa-circle-notch fa-spin fa-lg"></i> جاري التحميل</span>`);
        $("#hlakat_elmoslsal_container").prepend(`<span class="loading_span"><i class="fas fa-circle-notch fa-spin fa-lg"></i></span>`);
        $.ajax({
            "type": "POST",
            "url": link,
            "headers": {
                "X-Requested-With": "XMLHttpRequest"
            },
            success: function (res) {
                $("#hlakat_elmoslsal_container .loading_span").remove();
                $("#hlakat_elmoslsal").html("");
                // doc = new DOMParser().parseFromString(res, "text/html");
                doc = $(`<div>${res}</div>`);
                halkat_num = $(doc).find(`.JsutNumber`).length;
                $("#eposids_num").text(` ( ${halkat_num} ) `);
                $(doc).find(`.JsutNumber`).each(function () {
                    halka_num = parseInt($(this).find("a").text().trim().match(/(\d+)/)[0], 10);
                    epo_link = $(this).find("a").attr("href");
                    active_class = "";
                    if ($(this).hasClass("active")) {
                        active_class = " activee";
                    }

                    $("#hlakat_elmoslsal").append(`<a class="mou_eps_num${active_class}" onclick="load_arab_lionz_watch_server('${epo_link}','muslsal','${epo_link}',this)"><em>${halka_num}</em><span>حلقة</span></a>`);
                });

            }
        })
    }, load_msadr_watch_function: function (link, watch_type, referer = "") {

        $(".watch_sources,.download_sources").html("");

        $.ajax({
            "type": "GET",
            "url": link,
            success: function (watching_res) {
                watching_doc = new DOMParser().parseFromString(watching_res, "text/html");

                $.ajax({
                    "type": "POST",
                    "url": "https://arlionztv.rest/PostServersWatch/" + $(watching_doc).find(".WatchBtn").attr("data-id"),
                    "headers": {
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    success: function (watching_servers) {
                        watching_servers_doc = new DOMParser().parseFromString(watching_servers, "text/html");

                        $(watching_servers_doc).find("servers--selected li").each(function () {
                            servre_name = $(this).find("em").text().trim();
                            server_link = now_aflam_server_domain + "Embedder/" + $(this).attr("data-id") + "/" + $(this).attr("data-i");
                            server_srces_available = get_web_video_server_name(servre_name);
                            if (server_srces_available !== false) {

                                $(`<span class="mou_btn" onclick="play_arab_lionz_web_server(this,\`${server_link}\`,\`${server_srces_available}\`, \`${link}\`)">${server_srces_available}</span>`).appendTo(".watch_sources");

                                $(`<span class="mou_btn" onclick="play_arab_lionz_web_server(this,\`${server_link}\`,\`${server_srces_available}\`, \`${link}\`)">${server_srces_available}</span>`).appendTo(".download_sources");

                            }
                            // if (servre_name == "Vadbam") {
                            //     $.ajax({
                            //         "type": "POST",
                            //         "url": server_link,
                            //         success: function (structure) {
                            //             structure_doc = new DOMParser().parseFromString(structure, "text/html");
                            //             link = $(structure_doc).find("iframe").attr("src");
                            //             get_video_src_vidbam(link, function (srces) {
                            //                 $(".watch_sources span.loading_span,.download_sources span.loading_span").remove();
                            //                 for (i = 0; i < srces.sources.length; i++) {
                            //                     src = srces.sources[i];
                            //                     quality_name = src.quality;
                            //                     src_link = src.link;
                            //                     src_name = quality_name;
                            //                     // add_to_title = watch_type == "muslsal" ? " - موسم " + $("#moasm_elmoslsal .mou_eps_num.activee em").text() : "";
                            //                     add_to_title = watch_type == "muslsal" ? " - حلقة " + $("#hlakat_elmoslsal .mou_eps_num.activee em").text() : "";
                            //                     full_title = film_data.title + add_to_title + " - " + src_name;
                            //                     $(`<span class="mou_btn" onclick="play_embed_server_from_this_server(\`${src_link}\`,\`${full_title}\`, \`{}\`)">${src_name}</span>`).appendTo(".watch_sources");

                            //                     $(".download_sources").append(`<span class="mou_btn" onclick="add_for_downlaod_this_server(\`downloads/\`,\`${full_title}\`, false, \`${src_link}\`,\`video\`, \`{}\`)">${src_name}</span>`);
                            //                 }
                            //             });
                            //         }
                            //     });
                            // }
                            // if (servre_name == "Uqload") {

                            //     $.ajax({
                            //         "type": "POST",
                            //         "url": server_link,
                            //         success: function (structure) {
                            //             structure_doc = new DOMParser().parseFromString(structure, "text/html");
                            //             link = $(structure_doc).find("iframe").attr("src");
                            //             get_video_src_Uqload(link, function (srces) {
                            //                 $(".watch_sources span.loading_span,.download_sources span.loading_span").remove();
                            //                 referer = srces.referer;
                            //                 for (i = 0; i < srces.sources.length; i++) {
                            //                     src = srces.sources[i];
                            //                     quality_name = src.quality;
                            //                     src_link = src.link;
                            //                     src_name = quality_name;
                            //                     // add_to_title = watch_type == "muslsal" ? " - موسم " + $("#moasm_elmoslsal .mou_eps_num.activee em").text() : "";
                            //                     add_to_title = watch_type == "muslsal" ? " - حلقة " + $("#hlakat_elmoslsal .mou_eps_num.activee em").text() : "";
                            //                     full_title = film_data.title + add_to_title + " - " + src_name;
                            //                     $(`<span class="mou_btn" onclick="play_embed_server_from_this_server(\`${src_link}\`,\`${full_title}\` , \`{'Referer':'${referer}'}\`)">${src_name}</span>`).appendTo(".watch_sources");

                            //                     // $(".download_sources").append(`<span class="mou_btn" onclick="add_for_downlaod_this_server(\`downloads/\`,\`${full_title}\`, false, \`${src_link}\`,\`video\`, \`{'Referer':'${referer}'}\`)">${src_name}</span>`);
                            //                 }
                            //             });
                            //         }
                            //     });

                            // }

                        })



                    }
                })




            }
        });


    }
    ,
    "cats":
    {
        "الافلام":
        {
            "type": "cats",
            "icon": `<i class="fas fa-film"></i>`,
            "cats":
            {
                "افلام اجنبية": {
                    "type": "list",
                    "url": "category/movies/english-movies/",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "افلام اسيوية": {
                    "type": "list",
                    "url": "category/movies/asian-movies/",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "افلام هندية": {
                    "type": "list",
                    "url": "category/افلام/افلام-هندي-indian-movies/",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "افلام كرتون": {
                    "type": "list",
                    "url": "category/movies/cartoon/",
                    "icon": `<i class="fas fa-film"></i>`
                }
            }

        },
        "المسلسلات":
        {
            "type": "cats",
            "icon": `<i class="fas fa-tv"></i>`,
            "cats":
            {
                "مسلسلات اجنبية": {
                    "type": "list",
                    "url": "category/series/english-series/",
                    "icon": `<i class="fas fa-tv"></i>`
                },
                "مسلسلات اسيوية": {
                    "type": "list",
                    "url": "category/series/asian-series/",
                    "icon": `<i class="fas fa-tv"></i>`
                },
                "مسلسلات انمي مترجمة": {
                    "type": "list",
                    "url": "category/series/anime/",
                    "icon": `<i class="fas fa-tv"></i>`
                },
                "مسلسلات تركية": {
                    "type": "list",
                    "url": "category/series/turkish-series/",
                    "icon": `<i class="fas fa-tv"></i>`
                },
                "مسلسلات تركية مترجمة": {
                    "type": "list",
                    "url": "category/series/turkish-series-translated-20221/",
                    "icon": `<i class="fas fa-tv"></i>`
                },
                "مسلسلات تركية مدبلجة": {
                    "type": "list",
                    "url": "category/series/turkish-series-dubbed/",
                    "icon": `<i class="fas fa-tv"></i>`
                },
                "مسلسلات كورية": {
                    "type": "list",
                    "url": "category/series/korean-series/",
                    "icon": `<i class="fas fa-tv"></i>`
                },
                "مسلسلات مكسيكي": {
                    "type": "list",
                    "url": "category/series/مسلسلات-مكسيكي/",
                    "icon": `<i class="fas fa-tv"></i>`
                },
                "مسلسلات هندية": {
                    "type": "list",
                    "url": "category/series/مسلسلات-هندية/",
                    "icon": `<i class="fas fa-tv"></i>`
                },
            }
        }

    }
};

function load_arab_lionz_watch_server(link, type, referer = "", this_btn = false) {
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

function play_embed_server_from_this_server(src_link, title) {

    play_vid(src_link, title, `Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36`, `{}`);


}
function add_for_downlaod_this_server(dir, full_title, typee, src_link, type, headers) {

    add_for_downlaod(dir, full_title, typee, src_link, type, headers);

}
mou_aflam_servers_array["عرب لايونز"] = obj;

function get_arab_lionz_watch_server_link(this_btn, server_link, server_name, referer_link, callback) {
    $.ajax({
        "type": "POST",
        "url": server_link,
        "headers": {
            "X-Requested-With": "XMLHttpRequest"
        },
        success: function (structure) {
            structure_doc = new DOMParser().parseFromString(structure, "text/html");
            watch_link = $(structure_doc).find("iframe").attr("src").replace(/(\r\n|\n|\r)/gm, "");
            callback(this_btn, watch_link, server_name, referer_link);
        }
    });
}
function play_arab_lionz_web_server(this_btn, server_link, server_name, referer_link) {
    if ($(this_btn).parents('.has_child_servers').length) {
        $(this_btn).parents('.has_child_servers').find(".child_servers").remove();
        $(this_btn).unwrap(".has_child_servers");

    } else {
        $(this_btn).wrap("<div class='has_child_servers'></div>");
        $(this_btn).parents('.has_child_servers').append("<div class='child_servers'></div>");

        get_arab_lionz_watch_server_link(this_btn, server_link, server_name, referer_link, function (this_btn, watch_link, server_name, referer_link) {
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