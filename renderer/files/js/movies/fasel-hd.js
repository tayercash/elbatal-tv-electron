obj = {
    "main_domain": "https://www.faselhds.world/",
    "server_domain": "https://web184.faselhd.cafe/",
    "working_state": false,
    "type": "cats",
    "server_name": "fasel-hd",
    "server_title": "فاصل HD",
    "icon": `<i class="fas fa-film"></i>`,
    "notification_detected_tobics": ["movies"],
    "get_latest_domain": function () {
        server_title = mou_aflam_server["server_title"];
        server_domain = mou_aflam_server["server_domain"];
        $(".domain_checker .server_name").text(server_title)
        if (typeof local_servers_domains[server_requested] !== "undefined") {
            if (isOnlineUrl(local_servers_domains[server_requested])) {
                server_domain = local_servers_domains[server_requested];
            }
        }

        $.ajax({
            type: "HEAD",
            url: server_domain,
            timeout: 5000,
            success: function (data, textStatus, xhr) {
                domain_found(server_domain);
            },
            error: function (xhr, textStatus, errorThrown) {
                mou_aflam_server["get_prop_domains"](function (domains) {
                    window.now_domains_length = domains.length;
                    for (i = 0; i < window.now_domains_length; i++) {
                        var domain = domains[i];
                        window["get_prop_domain_" + i] = $.ajax({
                            "type": "GET",
                            "url": domain,
                            success: function (domain_res) {
                                doc = new DOMParser().parseFromString(domain_res, "text/html");
                                this_domain_full_url = this.url;
                                active_domain = new URL(this_domain_full_url);
                                active_domain = active_domain.protocol + "//" + active_domain.hostname;
                                if ($(doc).find("head title").text().trim().includes("فاصل اعلاني")) {
                                    for (let e = 0; e < window.now_domains_length; e++) {
                                        window["get_prop_domain_" + e].abort();
                                    }
                                    domain_found(active_domain);
                                }
                            }, error: function (xhr, textStatus, errorThrown) {
                                // console.log(this.url + " => " + xhr.status);
                            }
                        });
                    }

                });
                domain_search_timeout_fun();

            }
        });
    },
    "get_prop_domains": function (callback) {
        // var g_searsh_key = "موقع فاصل hd";
        // $.ajax({
        //     "type": "GET",
        //     "url": "https://www.google.com/search?q=" + g_searsh_key,
        //     timeout: time_out_for_domain_searching * 1000,
        //     success: function (res) {
        //         doc = new DOMParser().parseFromString(res, "text/html");
        //         prop_domains = [];
        //         $(doc).find(".MjjYud").each(function () {
        //             url = $(this).find("a[href]").attr("href");
        //             if (isValidUrl(url)) {
        //                 domain = new URL(url);
        //                 domain = domain.protocol + "//" + domain.hostname;
        //                 console.log(domain);
        //                 if (domain.includes(".faselhd")) {
        //                     prop_domains.push(domain);
        //                 }
        //             }

        //         });
        //         callback(prop_domains);
        //     }
        // })
        prop_domains = [];
        $.ajax({
            type: "GET",
            url: what_window.elbatal_api + "panels/aflamservers/api.php",
            data: { "name": mou_aflam_server["server_name"] },
            success: function (res) {
                prop_domains.push(res.url);
                callback(prop_domains);
            }
        });
    },
    start_website: function () {
        // for (i = 0; i < mou_aflam_server.catigories.length; i++) {
        //     cati = mou_aflam_server.catigories[i];
        //     cati_name = cati.name;
        //     cati_url = cati.url;
        // }
        if (getQueryVariable("film_url")) {
            qurey_data = get_Queries();
            mou_aflam_server.load_film_function(qurey_data);

        } else {
            $(".header").show();
            $(".server_content").show();

            $("#custom_selectors").append(`<button class="custom_cat" data-url="most_recent">المضاف حديثا</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="all-movies">الأفلام</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="movies_top_views">الأفلام الأعلي مشاهدة</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="series">المسلسلات</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="series_top_views">المسلسلات الأعلي مشاهدة</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="tvshows">البرامج التليفزيونية</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="asian-series">مسلسلات اسيوية</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="anime">انمي</button>`);


            $(document).on("click", ".custom_cat", function () {
                if (!$(this).hasClass("disabled")) {
                    $(".posts_ul").html("");
                    $(".custom_cat").addClass("disabled");
                    $(this).addClass("loading_elemnt");
                    $(this).removeClass("disabled");
                    $("#load_more_posts_btn").html(`<i class="fad fa-spinner-third fa-spin"></i> جاري التحميل`);

                    this_cat_url = $(this).attr("data-url");
                    this_cat_btn = $(this);
                    $.ajax({
                        "type": "GET",
                        "url": server_domain + this_cat_url,
                        success: function (res) {
                            doc = new DOMParser().parseFromString(res, "text/html");
                            $(".custom_cat").removeClass("disabled").removeClass("active");
                            $(this_cat_btn).addClass("active");
                            $(".custom_cat.loading_elemnt").removeClass("loading_elemnt");
                            $("#cats_container select").remove();

                            if ($(doc).find(".webFilter").length > 0) {
                                webfilter = $(doc).find(".webFilter");
                                $("#cats_container").attr("data-webfilter_action", $(webfilter).find("[name='action']").val());
                                $("#cats_container").attr("data-webfilter_action_url", $(webfilter).attr("action"));
                                $("#cats_container").show();

                                $(".full_cats_container hr").show();

                                $(webfilter).find("select").each(function () {
                                    $(this).appendTo("#cats_container");
                                });
                                // callback(selectors);
                            } else {
                                $(".full_cats_container hr").hide();
                                $("#cats_container").hide();
                            }
                            mou_aflam_server.load_list_function(res, "load_more");

                        }
                    });

                }
            });
            $(document).on("change", "#cats_container select", function () {
                $(".posts_ul_container .load_more_btn").remove();
                // $(".posts_ul_container .posts_ul").html("");
                $(".posts_ul_container").append(`<button class="load_more_btn" id="load_more_posts_btn">تحميل المزيد</button>`);


                $("#load_more_posts_btn").attr("onclick", `mou_aflam_server.get_list_from_ajax('1',this,"first_load")`).click();

            });
            // $("#load_more_posts_btn").attr("onclick", `mou_aflam_server.get_list_function('movies',this)`).click();

            $("#custom_selectors .custom_cat").eq(0).click();
        }
    },
    get_list_from_ajax: function (next_page, this_btn = false, load_type = "load_more") {

        if (loading_more_posts == false) {
            filter_action = $("#cats_container").attr("data-webfilter_action");
            filter_action_url = $("#cats_container").attr("data-webfilter_action_url");
            loading_more_posts = true;
            $(this_btn).html(`<i class="fad fa-spinner-third fa-spin"></i> جاري التحميل`);

            var now_filter_keys = {};
            $("#cats_container").find("select").each(function () {
                key_name = $(this).attr("name");
                key_val = $(this).val();
                now_filter_keys[key_name] = key_val;
            });
            now_filter_keys["pagenum"] = next_page;
            now_filter_keys["action"] = filter_action;

            $.ajax({
                "type": "POST",
                "url": filter_action_url,
                "data": now_filter_keys,
                "headers": {
                    "X-Requested-With": "XMLHttpRequest"
                },
                success: function (res) {
                    doc = new DOMParser().parseFromString(res, "text/html");
                    loading_more_posts = false;
                    mou_aflam_server.load_list_function(res, load_type);
                    $(this_btn).html(`تحميل المزيد`);

                    if (typeof aflam_json.next_page !== "undefined") {
                        this_next_page = aflam_json.next_page;
                        $(this_btn).attr("onclick", `mou_aflam_server.get_list_from_ajax('${this_next_page}',this)`);
                    }

                }, error: function (jqXHR, error, errorThrown) {
                    loading_more_posts = false;

                }
            });


        }


    }, get_list_function: function (page_url, this_btn) {
        page_url = isValidUrl(page_url) ? page_url : server_domain + page_url;
        disable_attr = $(this_btn).attr('disabled');
        if (loading_more_posts == false) {
            if (!(typeof disable_attr !== 'undefined' && disable_attr !== false)) {
                loading_more_posts = true;
                $(this_btn).html(`<i class="fad fa-spinner-third fa-spin"></i> جاري التحميل`);

                $.ajax({
                    "type": "GET",
                    "url": page_url,
                    success: function (res) {
                        mou_aflam_server.load_list_function(res, "load_more");
                        loading_more_posts = false;

                        $(this_btn).html(`تحميل المزيد`);
                    }
                });
            }

        }
    },
    "load_list_function": function (res, load_type = "first_load") {
        aflam_json = {};
        aflam_posts = [];
        doc = new DOMParser().parseFromString(res, "text/html");

        if ($(doc).find("#postList").length > 0) {
            post_div = $(doc).find("#postList").find(".postDiv");
        } else {
            post_div = $(doc).find(".postDiv");
        }

        $(post_div).each(function () {

            film = {};
            film.url = $(this).find("a[href]").attr("href");
            film.type = film.url.includes("/seasons/") || film.url.includes("/anime/") || film.url.includes("/tvepisodes/") || film.url.includes("/tvseasons/") || film.url.includes("-series/") || film.url.includes("-episodes/") ? "muslsal" : "film";

            film.title = $(this).find("div.h1").text().trim();

            if (/^مشاهدة مسلسل(.*)/gm.test(film.title) == true) {
                film.title = /^مشاهدة مسلسل(.*)/gm.exec(film.title)[1].trim();
            }

            if (/حلقة (\d+)/gm.test(film.title) == true) {
                film.eposide = /حلقة (\d+)/gm.exec(film.title)[1].trim()
            }

            if (/مسلسل(.*)الموسم/gm.test(film.title) == true) {
                film.title = /مسلسل(.*)الموسم/gm.exec(film.title)[1].trim()
            }
            if (/مسلسل(.*)المووسم/gm.test(film.title) == true) {
                film.title = /مسلسل(.*)المووسم/gm.exec(film.title)[1].trim()
            }

            if (/– الحلقة [\d]+/gm.test(film.title) == true) {
                film.title = film.title.replace(/انمي /gm, '');
                film.title = film.title.replace(/– الحلقة [\d]+/gm, '');
            }

            if ($(this).find("img[data-src]").length > 0) {
                film.img = $(this).find("img[data-src]").attr("data-src");
            } else {
                film.img = $(this).find("img").attr("src");
            }

            aflam_posts.push(film);
        });
        aflam_json.aflam = aflam_posts;


        if ($(doc).find(`ul.pagination .page-item`).length > 0) {

            $(doc).find(`ul.pagination .page-item`).each(function (indexx) {
                if ($(this).hasClass("active")) {
                    next_button = $(doc).find(`ul.pagination .page-item`).eq(indexx + 1);
                    if (next_button.length > 0) {
                        next_page_link = $(next_button).find(".page-link").attr("href");
                        aflam_json.next_page = next_page_link;
                    }
                    return false;
                }
            });
        } else if ($(doc).find(`ul.pagination .page-numbers`).length > 0) {


            $(doc).find(`ul.pagination .page-numbers`).each(function (index) {
                if ($(this).hasClass("current")) {
                    next_button = $(doc).find(`ul.pagination .page-numbers`).eq(index + 1);
                    if (next_button.length > 0) {
                        var pagneum = $(next_button).attr('href').replace(/\D/g, '');
                        // next_page_link = pagneum;
                        aflam_json.next_page = pagneum;
                    }
                }
            });

        }

        load_aflam_posts(aflam_json, load_type);
    }, search_function: function (key) {
        search_url = "?s=" + key;
        $("#load_more_posts_btn").attr("onclick", `mou_aflam_server.get_list_function('${search_url}',this)`).removeAttr("disabled").show().click();
    },
    load_film_function: function (film) {
        film_title = decodeURIComponent(decodeURIComponent(decodeURIComponent(film.film_title)));
        film_url = decodeURIComponent(decodeURIComponent(decodeURIComponent(film.film_url)));
        film_url = isValidUrl(film_url) ? film_url : server_domain + film_url;
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

                if (film_img == false || film_img == "" || typeof film_img == "undefined") {
                    if ($(doc).find(`.posterImg img`).attr("src") !== "") {
                        film_data.img = $(doc).find(`.posterImg img`).attr("src");
                    } else if ($(doc).find(`.seasonDiv img`).length > 0) {
                        film_data.img = $(doc).find(`.seasonDiv img`).attr("data-src");
                    }
                } else {
                    film_data.img = film_img;
                }
                film_data.img = decodeURIComponent(decodeURIComponent(decodeURI(film_data.img)));
                film_data.description = $(doc).find(`.singleDesc`).text().trim();

                if ($(doc).find(".seasonLoop").length > 0) {
                    page_type = "muslsal";
                } else {
                    page_type = "film";
                }


                $(doc).find(`#singleList>div`).each(function () {
                    full_data = $(this).find("span").text().trim();
                    full_data = full_data.split(":");
                    if (typeof full_data[0] !== "undefined" && typeof full_data[1] !== "undefined") {
                        tr_key = full_data[0].trim();
                        tr_val = full_data[1].trim();
                        if (["تصنيف الفيلم", "جودة الفيلم", "سنة الإنتاج", " مدة الفيلم", "دول الأنتاج", "بطولة", "تصنيف المسلسل", "حالة المسلسل", "الحلقات", "لغة المسلسل", " دولة المسلسل", "توقيت الحلقات"].includes(tr_key)) {
                            film_trs[tr_key] = tr_val;
                        }
                    }
                })

                film_data.trs = film_trs;

                if ($(doc).find(".posterImg .open-video").length > 0) {
                    film_data.trailer = $(doc).find(".posterImg .open-video").attr("href");
                }


                show_film_data(film_data);


                if (page_type == "film") {
                    watch_url = $(doc).find(`.signleWatch .tabs-ul li`).attr("onclick");
                    watch_url = /'(.*)'/gm.exec(watch_url)[1];

                    download_link = $(doc).find(".downloadLinks a[href]").attr("href");


                    mou_aflam_server.load_fasel_watch_server(watch_url, "film", film_url);
                } else if (page_type == "muslsal") {
                    if ($(doc).find("#seasonList .seasonDiv").length > 0) {

                        $("#moasm_elmoslsal_container").show();
                        moasm_num = $(doc).find("#seasonList .seasonDiv").length;
                        $("#moasm_num").text(` ( ${moasm_num} ) `);

                        $(doc).find("#seasonList .seasonDiv").each(function () {

                            moasem_dic = {
                                1: ["الأول", "الاول", "1"],
                                2: ["الثاني", "2"],
                                3: ["الثالث", "3"],
                                4: ["الرابع", "4"],
                                5: ["الخامس", "5"],
                                6: ["السادس", "6"],
                                7: ["السابع", "7"],
                                8: ["الثامن", "8"],
                                9: ["التاسع", "9"],
                                10: ["العاشر", "10"],
                                11: ["الحادي عشر", "11"],
                                12: ["الثاني عشر", "12"],
                                13: ["الثالث عشر", "13"],
                                14: ["الرابع عشر", "14"],
                                15: ["الخامس عشر", "15"],
                                16: ["السادس عشر", "16"],
                                17: ["السابع عشر", "17"]
                            }

                            mosem_text = $(this).find("div.title").text().trim();
                            mosem_link = server_domain + /'\/(.*)'/gm.exec($(this).attr("onclick"))[1];
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
                                $("#moasm_elmoslsal").append(`<a class="mou_eps_num" data-link="${mosem_link}" onclick="mou_aflam_server.load_7alakat_function(this)"><em>${mosem_num}</em><span>موسم</span></a>`);
                            }

                        });

                        $("#moasm_elmoslsal .mou_eps_num").each(function (index) {
                            if ($(this).find("em").text() == active_mosem) {
                                active_mosem_index = index;
                            }
                        })
                        $("#moasm_elmoslsal .mou_eps_num").eq(active_mosem_index).addClass("activee");
                    }
                    halkat_num = $(doc).find(`#epAll a`).length;
                    $("#eposids_num").text(` ( ${halkat_num} ) `);
                    $(doc).find(`#epAll a`).each(function () {

                        halka_num = parseInt($(this).text().trim().match(/(\d+)/)[0], 10);
                        epo_link = $(this).attr("href");
                        active_class = "";
                        if ($(this).hasClass("active")) {
                            active_class = " activee";
                        }

                        $("#hlakat_elmoslsal").append(`<a class="mou_eps_num${active_class}" onclick="mou_aflam_server.load_fasel_watch_server('${epo_link}','muslsal','${epo_link}',this)" data-halka_num="${halka_num}"><em>${halka_num}</em><span>حلقة</span></a>`);
                    });
                    $('#hlakat_elmoslsal').find('.mou_eps_num').sort(function (a, b) {
                        return $(b).find("em").text().trim() - $(a).find("em").text().trim();
                    }).appendTo('#hlakat_elmoslsal');

                    $("#hlakat_elmoslsal_container").show();

                    if (getQueryVariable("halka_num") !== false) {
                        halka_num = getQueryVariable("halka_num");
                        $(`[data-halka_num="${halka_num}"]`).click();
                    } else {
                        $("#hlakat_elmoslsal .mou_eps_num.activee").click();

                    }

                }

            }

        });

    },
    load_7alakat_function: function (this_btn) {
        link = $(this_btn).attr("data-link");
        $("#moasm_elmoslsal .mou_eps_num").removeClass("activee");
        $(this_btn).addClass("activee");
        // $("#hlakat_elmoslsal").html(`<span><i class="fas fa-circle-notch fa-spin fa-lg"></i> جاري التحميل</span>`);
        $("#hlakat_elmoslsal").html("");
        $("#eposids_num").html("");

        $.ajax({
            "type": "GET",
            "url": link,
            success: function (res) {
                doc = new DOMParser().parseFromString(res, "text/html");
                halkat_num = $(doc).find(`#epAll a`).length;
                $("#eposids_num").text(` ( ${halkat_num} ) `);
                $(doc).find(`#epAll a`).each(function () {

                    halka_num = parseInt($(this).text().trim().match(/(\d+)/)[0], 10);
                    epo_link = $(this).attr("href");
                    active_class = "";
                    if ($(this).hasClass("active")) {
                        active_class = " activee";
                    }

                    $("#hlakat_elmoslsal").append(`<a class="mou_eps_num${active_class}" onclick="mou_aflam_server.load_fasel_watch_server('${epo_link}','muslsal','${epo_link}',this)"><em>${halka_num}</em><span>حلقة</span></a>`);
                });

                $('#hlakat_elmoslsal').find('.mou_eps_num').sort(function (a, b) {
                    return $(b).find("em").text().trim() - $(a).find("em").text().trim();
                }).appendTo('#hlakat_elmoslsal');
            }
        })
    }, load_fasel_watch_server: function (link, type, referer = "", this_btn = false) {
        if (this_btn !== false) {
            $("#hlakat_elmoslsal_container .mou_eps_num").removeClass("activee");
            $(this_btn).addClass("activee");

            $(".watch_srces_btns").html("");
            $(".dl_srces_btns").html("");
            $(".loading_watch_srces").show();

            halka_num = $(this_btn).find("em").text().trim();
            now_query_data = get_Queries(2, "?" + query_data);
            now_query_data["halka_num"] = halka_num;
            query_data = encodeQueryData(now_query_data);

            $("#mou_watch_btn").click();
            $.ajax({
                "type": "GET",
                "url": link,
                success: function (res) {
                    doc = new DOMParser().parseFromString(res, "text/html");
                    watch_url = $(doc).find(`.signleWatch .tabs-ul li`).eq(0).attr("onclick");
                    watch_url = /'(.*)'/gm.exec(watch_url)[1];
                    console.log(watch_url);

                    mou_aflam_server.load_msadr_watch(watch_url, type, this_btn);
                }
            });
        } else {
            mou_aflam_server.load_msadr_watch(link, type);
        }

    }, load_msadr_watch: function (link, watch_type, this_btn = false) {

        this_halka_text = ($("#moasm_elmoslsal .mou_eps_num.activee").length > 0 ? " - الموسم " + $("#moasm_elmoslsal .mou_eps_num.activee").find("em").text() : "") + ($("#hlakat_elmoslsal .mou_eps_num.activee ,#hlakat_elmoslsal .mou_eps_num.loading").length > 0 ? " - الحلقة " + $("#hlakat_elmoslsal .mou_eps_num.activee ,#hlakat_elmoslsal .mou_eps_num.loading").find("em").text() : "");

        mou_cust_server = what_window.is_in_mou_servers(link);
        console.log(mou_cust_server);
        if (mou_cust_server !== false) {
            $(".loading_watch_srces").hide();

            add_to_title = page_type == "muslsal" ? " - حلقة " + $("#hlakat_elmoslsal .mou_eps_num.activee em").text() : "";
            full_title = film_data.title + add_to_title;

            continue_watch_code = film_data.title + (film_data.film_type == "film" ? "" : this_halka_text);

            $(`<span class="mou_btn watch_btn" data-full_title="${full_title}" data-continue_watch_code="${continue_watch_code}" onclick="what_window.play_dl_mou_cust_server('${mou_cust_server}','${full_title}','${link}',true,this,\`{'Referer':'${mou_aflam_server.server_domain}'}\`)">${mou_cust_server}</span>`).appendTo(".watch_srces_btns").click();


            add_to_dls = true;
            if (typeof what_window.cust_servers[mou_cust_server]["dl_status"] !== "undefined" && what_window.cust_servers[mou_cust_server]["dl_status"] == false) {
                add_to_dls = false;
            }
            if (add_to_dls) {

                $(`<span class="mou_btn watch_btn" data-full_title="${full_title}" data-continue_watch_code="${continue_watch_code}" onclick="what_window.play_dl_mou_cust_server('${mou_cust_server}','${full_title}','${link}',false,this,\`{'Referer':'${mou_aflam_server.server_domain}'}\`)">${mou_cust_server}</span>`).appendTo(".dl_srces_btns");
            }

            // what_window.cust_servers[mou_cust_server]["get_srcs"](this_server_url, function (srcs) {
            //     srcs.forEach(src => {

            //         mou_aflam_server.add_watch_dl_src(src);
            //     });
            // })
        }

        return false;


        continue_watch_code = film_data.title + (film_data.film_type == "film" ? "" : this_halka_text);

        $.ajax({
            "type": "GET",
            "url": link,
            success: function (watching_res) {
                $(".loading_watch_srces").hide();
                // watching_res = get_html_from_hide_html_fun(watching_res);
                watching_doc = new DOMParser().parseFromString(watching_res, "text/html");
                enc_script = $(watching_doc).find("body script").eq(0).text();
                console.log(enc_script);

                decrypted_script = what_window.deobfuscator.deobfuscate(enc_script);
                console.log(decrypted_script);
                file_link = /file:.*"(.*)"/gm.exec(decrypted_script)[1];
                // decrypted_script = decrypted_script.replace(/\\"/g, '"');
                // watching_doc = $(`<div>${decrypted_script}</div>`);

                console.log(file_link);

                $(watching_doc).find("button[data-url]").each(function () {
                    quality_name = $(this).text().trim() == "auto" ? "تلقائيه" : $(this).text().trim();
                    src_name = quality_name;
                    src_link = $(this).attr("data-url");

                    add_to_title = watch_type == "muslsal" ? " - موسم " + $("#moasm_elmoslsal .mou_eps_num.activee em").text() : "";
                    add_to_title += watch_type == "muslsal" ? " - حلقة " + $("#hlakat_elmoslsal .mou_eps_num.activee em").text() : "";
                    full_title = film_data.title + add_to_title + " - " + src_name;



                    $(`<span class="mou_btn watch_btn" onclick="play_vid(\`${src_link}\`,\`${full_title}\` , \`Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36\`, \`{}\`,\`${continue_watch_code}\`)">${src_name}</span>`).appendTo(".watch_srces_btns");


                    // $(`<span class="mou_btn" onclick="play_embed_server_from_this_server(\`${src_link}\`,\`${full_title}\`)">${src_name}</span>`).appendTo(".watch_sources");

                    if (quality_name !== "تلقائيه") {
                        // $(".download_sources").append(`<span class="mou_btn" onclick="add_for_downlaod_this_server(\`downloads/\`,\`${full_title}\`, false, \`${src_link}\`,\`video\`, \`{}\`)">${src_name}</span>`);

                        $(".dl_srces_btns").append(`<span class="mou_btn download_btn" onclick="add_for_downlaod(\`downloads/\`,\`${full_title}\`, false, \`${src_link}\`,\`video\`, \`{}\`)">${src_name}</span>`);

                    }

                });



            }
        });

    }
};

mou_aflam_servers_array["fasel-hd"] = obj;