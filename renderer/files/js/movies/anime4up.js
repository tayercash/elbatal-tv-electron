obj =
{
    "main_domain": "https://anime4up.store/",
    "server_domain": "https://anime4up.store/",
    "get_server_domain": function (this_noww_main_domain, callback) {
        $.ajax({
            "type": "GET",
            "url": "https://www.google.com/search?q=anime4up",
            success: function (res) {
                doc = new DOMParser().parseFromString(res, "text/html");

                $(doc).find(".MjjYud").each(function () {
                    url = $(this).find("a[href]").attr("href");
                    if (isValidUrl(url)) {

                        domain = new URL(url);
                        domain = domain.protocol + "//" + domain.hostname;

                        if (domain.includes(".wecima")) {

                            $.ajax({
                                "type": "GET",
                                "url": domain,
                                success: function (domain_res) {
                                    domain_doc = new DOMParser().parseFromString(domain_res, "text/html");
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
    "server_title": "انمي فور اب",
    "icon": `<i class="fas fa-film"></i>`,
    "load_list_function": function (res, load_type = "first_load") {
        aflam_json = {};
        aflam_posts = [];
        doc = new DOMParser().parseFromString(res, "text/html");
        $(doc).find(".anime-list-content").find(".anime-card-container").each(function () {
            film = {};
            film.url = $(this).find(".anime-card-poster a.overlay").attr("href");
            // film.type = film.url.includes("/series/") ? "muslsal" : "film";
            film.type = "muslsal";

            // $(this).find("strong .year").remove();
            film.title = $(this).find(".anime-card-title a").text().trim();

            img_style_string = $(this).find(".BG--GridItem").attr("data-lazy-style");
            film.img = $(this).find(".anime-card-poster img").attr("src");
            aflam_posts.push(film);
        });
        aflam_json.server_title = now_server_title;
        aflam_json.aflam = aflam_posts;

        $(doc).find(`ul.pagination .page-numbers`).each(function (index) {
            if ($(this).hasClass("current")) {
                next_button = $(doc).find(`ul.pagination .page-numbers`).eq(index + 1);
                if (next_button.length > 0) {
                    next_page_link = $(next_button).attr("href");
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
                    film_data.img = $(doc).find(`meta[itemprop="thumbnailUrl"]`).attr("content");
                } else {
                    film_data.img = film_img;
                }

                if ($(doc).find(`.StoryMovieContent`).text() !== "") {
                    film_data.description = $(doc).find(`.StoryMovieContent`).text();
                } else {
                    film_data.description = $(doc).find(".PostItemContent").text();
                }

                $(doc).find(`.Terms--Content--Single-begin li`).each(function () {
                    tr = {};
                    tr_key = $(this).find("span").text().replace(":", "").trim();
                    tr_val = $(this).find("a").text().trim();
                    if (["مدة العرض", "السنه", "اللغة", "الجودة", "الدولة"].includes(tr_key)) {
                        film_trs[tr_key] = tr_val;
                    }
                })
                film_trs["التاريخ"] = $(doc).find(`.Title--Content--Single-begin .unline`).text();
                film_data.trs = film_trs;
                show_film_data(film_data);

                if (page_type == "film") {
                    watch_url = $(doc).find(`.MyCimaServer btn`).attr("data-url");
                    load_this_watch_server(watch_url, "film", film_url);
                } else if (page_type == "muslsal") {
                    if ($(doc).find(".List--Seasons--Episodes a").length > 0) {

                        $("#moasm_elmoslsal_container").show();
                        moasm_num = $(doc).find(".List--Seasons--Episodes a").length;
                        $("#moasm_num").text(` ( ${moasm_num} ) `);

                        $(doc).find(".List--Seasons--Episodes a").each(function () {

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

                            mosem_text = $(this).text().trim();
                            mosem_link = $(this).attr("href");
                            if (mosem_text !== "") {

                                for (i = 0; i < Object.keys(moasem_dic).length; i++) {
                                    mosem_texts = moasem_dic[Object.keys(moasem_dic)[i]];
                                    for (e = 0; e < mosem_texts.length; e++) {
                                        this_mosem_text = mosem_texts[e];

                                        if (mosem_text.includes(this_mosem_text)) {
                                            mosem_num = Object.keys(moasem_dic)[i];
                                        }
                                    }
                                    if ($(this).hasClass("selected")) {
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

                    $(".mou_eps_num.activee").click();
                    $("#hlakat_elmoslsal_container").show();
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

        $("#msader_elmoshda,#msader_eltahmel").prepend(`<span class="loading_span"><i class="fas fa-circle-notch fa-spin fa-lg"></i></span>`);
        $(".watch_sources,.download_sources").html("");

        // if (referer !== "") {
        //     opts["headers"] = {
        //         "referer": referer
        //     };
        // }
        $.ajax({
            "type": "GET",
            "url": link,
            success: function (watching_res) {
                $("#msader_elmoshda .loading_span,#msader_eltahmel .loading_span").remove();
                watching_doc = new DOMParser().parseFromString(watching_res, "text/html");


                if (/sources: (\[.*]),.*formats/sg.test(watching_res)) {
                    bad_json = /sources: (\[.*]),.*formats/sg.exec(watching_res)[1];
                    eval(`srcs_array = ` + bad_json.replace(/\s*(['"])?([a-z0-9A-Z_\.]+)(['"])?\s*:([^,\}]+)(,)?/g, '"$2": $4$5'));
                } else {
                    srcs_array = [];
                    src = {};
                    src["src"] = $(watching_doc).find("video source").attr("src");
                    src["format"] = /(\d+)p\./gm.test(src["src"]) ? /(\d+)p\./gm.exec(src["src"])[1] : "جودة غير معروفة";
                    srcs_array.push(src);
                }


                for (i = 0; i < srcs_array.length; i++) {
                    src = srcs_array[i];

                    if (src.format !== "auto") {
                        quality_name = src.format == "جودة غير معروفة" ? "720p" : parseInt(src.format.replace(/[^\d.]/g, '')) + "p";
                        src_link = src.src;

                        src_name = quality_name;
                        add_to_title = watch_type == "muslsal" ? " - موسم " + $("#moasm_elmoslsal .mou_eps_num.activee em").text() : "";
                        add_to_title += watch_type == "muslsal" ? " - حلقة " + $("#hlakat_elmoslsal .mou_eps_num.activee em").text() : "";
                        full_title = film_data.title + add_to_title + " - " + src_name;

                        $(`<span class="mou_btn" onclick="play_embed_server_from_this_server(\`${src_link}\`,\`${full_title}\`)">${src_name}</span>`).appendTo(".watch_sources");

                        $(".download_sources").append(`<span class="mou_btn" onclick="add_for_downlaod_this_server(\`downloads/\`,\`${full_title}\`, false, \`${src_link}\`,\`video\`, \`{}\`)">${src_name}</span>`);


                    }
                }


            }
        });


    }
    ,
    "cats":
    {
        "قائمة الأنميات":
        {
            "type": "cats",
            "icon": `<i class="fas fa-film"></i>`,
            "cats":
            {
                "كل الانميات": {
                    "type": "list",
                    "url": "anime-list-3",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "أطفال": {
                    "type": "list",
                    "url": "anime-genre/أطفال",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "أكشن": {
                    "type": "list",
                    "url": "anime-genre/أكشن",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "إيتشي": {
                    "type": "list",
                    "url": "anime-genre/إيتشي",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "اثارة": {
                    "type": "list",
                    "url": "anime-genre/اثارة",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "العاب": {
                    "type": "list",
                    "url": "anime-genre/العاب",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "اثارة": {
                    "type": "list",
                    "url": "anime-genre/اثارة",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "اثارة": {
                    "type": "list",
                    "url": "anime-genre/اثارة",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "اثارة": {
                    "type": "list",
                    "url": "anime-genre/اثارة",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "اثارة": {
                    "type": "list",
                    "url": "anime-genre/اثارة",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "اثارة": {
                    "type": "list",
                    "url": "anime-genre/اثارة",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "اثارة": {
                    "type": "list",
                    "url": "anime-genre/اثارة",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "اثارة": {
                    "type": "list",
                    "url": "anime-genre/اثارة",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "اثارة": {
                    "type": "list",
                    "url": "anime-genre/اثارة",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "اثارة": {
                    "type": "list",
                    "url": "anime-genre/اثارة",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "اثارة": {
                    "type": "list",
                    "url": "anime-genre/اثارة",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "اثارة": {
                    "type": "list",
                    "url": "anime-genre/اثارة",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "اثارة": {
                    "type": "list",
                    "url": "anime-genre/اثارة",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "اثارة": {
                    "type": "list",
                    "url": "anime-genre/اثارة",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "اثارة": {
                    "type": "list",
                    "url": "anime-genre/اثارة",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "اثارة": {
                    "type": "list",
                    "url": "anime-genre/اثارة",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "اثارة": {
                    "type": "list",
                    "url": "anime-genre/اثارة",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "اثارة": {
                    "type": "list",
                    "url": "anime-genre/اثارة",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "اثارة": {
                    "type": "list",
                    "url": "anime-genre/اثارة",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "اثارة": {
                    "type": "list",
                    "url": "anime-genre/اثارة",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "اثارة": {
                    "type": "list",
                    "url": "anime-genre/اثارة",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "اثارة": {
                    "type": "list",
                    "url": "anime-genre/اثارة",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "اثارة": {
                    "type": "list",
                    "url": "anime-genre/اثارة",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "اثارة": {
                    "type": "list",
                    "url": "anime-genre/اثارة",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "اثارة": {
                    "type": "list",
                    "url": "anime-genre/اثارة",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "اثارة": {
                    "type": "list",
                    "url": "anime-genre/اثارة",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "اثارة": {
                    "type": "list",
                    "url": "anime-genre/اثارة",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "اثارة": {
                    "type": "list",
                    "url": "anime-genre/اثارة",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "اثارة": {
                    "type": "list",
                    "url": "anime-genre/اثارة",
                    "icon": `<i class="fas fa-film"></i>`
                },
                "اثارة": {
                    "type": "list",
                    "url": "anime-genre/اثارة",
                    "icon": `<i class="fas fa-film"></i>`
                }
            }

        },
        "افلام الانمي":
        {
            "type": "cats",
            "icon": `<i class="fas fa-tv"></i>`,
            "cats":
            {
                "مسلسلات عربية": {
                    "type": "list",
                    "url": "category/مسلسلات/13-مسلسلات-عربيه-arabic-series/list/",
                    "icon": `<i class="fas fa-tv"></i>`
                },
                "مسلسلات أجنبية": {
                    "type": "list",
                    "url": "category/مسلسلات/5-series-english-مسلسلات-اجنبي/list/",
                    "icon": `<i class="fas fa-tv"></i>`
                },
                "مسلسلات تركية": {
                    "type": "list",
                    "url": "category/مسلسلات/8-مسلسلات-تركية-turkish-series/list/",
                    "icon": `<i class="fas fa-tv"></i>`
                },
                "مسلسلات كرتون": {
                    "type": "list",
                    "url": "category/مسلسلات-كرتون/",
                    "icon": `<i class="fas fa-tv"></i>`
                }
            }
        }
    }
};

function load_this_watch_server(link, type, referer = "", this_btn = false) {
    $("#msader_elmoshda").show();
    $("#msader_eltahmel").show();
    $(".watch_sources,.download_sources").html(`<span><i class="fas fa-circle-notch fa-spin fa-lg"></i> جاري التحميل</span>`);

    if (this_btn !== false) {
        $("#hlakat_elmoslsal_container .mou_eps_num").removeClass("activee");
        $(this_btn).addClass("activee");
        $.ajax({
            "type": "GET",
            "url": link,
            success: function (res) {
                doc = new DOMParser().parseFromString(res, "text/html");
                watch_url = $(doc).find(`.MyCimaServer btn`).attr("data-url");
                now_load_msadr_watch_function(watch_url, type, referer);
            }
        });
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
mou_aflam_servers_array["anime4up"] = obj;