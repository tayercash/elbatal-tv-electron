obj = {
    "main_domain": "https://bs.cimanow.cc/",
    "server_domain": "https://cc.cimanow.online/",
    "working_state": true,
    "type": "cats",
    "server_name": "CimaNow",
    "server_title": "سيما ناو",
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
                                if (domain_res.includes("adilbo_HTML_encoder") || $(doc).find("head title").text().trim() == "سيما ناو | عندما يكون للمشاهدة متعة خاصة") {
                                    domain_found(active_domain);
                                    for (let e = 0; e < window.now_domains_length; e++) {
                                        window["get_prop_domain_" + e].abort();
                                    }
                                }

                            }, error: function (xhr, textStatus, errorThrown) {
                                // console.log(this.url + " => " + xhr.status);
                            }
                        });
                    }
                    domain_search_timeout_fun();

                });


            }
        });
    },
    "get_prop_domains": function (callback) {
        // var g_searsh_key = "cimanow";
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
        //                 if (domain.includes(".cimanow.")) {
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



        if (getQueryVariable("film_url")) {
            qurey_data = get_Queries();
            mou_aflam_server.load_film_function(qurey_data);
        } else {
            $(".header").show();
            $(".server_content").show();
            $(".closer_cats_container hr").hide();
            $("#cats_container").hide();

            $("#custom_selectors").append(`<button class="custom_cat" data-url="الاحدث/">احدث الاضافات</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/رمضان/رمضان-2025/">رمضان 2025</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="/الاكثر-مشاهدة">الأكثر مشاهدة</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/مسلسلات-عربية/">مسلسلات عربية</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/مسلسلات-اجنبية/">مسلسلات اجنبية</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/مسلسلات-تركية/">مسلسلات تركية</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/افلام-عربية/">افلام عربية</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/افلام-اجنبية/">افلام اجنبية</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/افلام-تركية/">افلام تركية</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/افلام-هندية/">افلام هندية</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/البرامج-التلفزيونية/">البرامج التلفزيونية</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/مسرحيات/">مسرحيات</button>`);

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
                            mou_aflam_server.load_list_function(res, "first_load");
                        }
                    });

                }
            });
            // $("#load_more_posts_btn").attr("onclick", `mou_aflam_server.get_list_function('movies',this)`).click();

            $("#custom_selectors .custom_cat").eq(0).click();
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
        res = mou_aflam_server.get_cima_now_res(res);

        aflam_json = {};
        aflam_posts = [];
        doc = new DOMParser().parseFromString(res, "text/html");

        $(doc).find("section[aria-label='posts']").find("article[aria-label='post']").each(function () {
            film = {};
            $(this).find("li[aria-label='title']").find("em").remove();
            film.url = $(this).find("a[href]").attr("href");
            film.type = $(this).find(`[aria-label="episode"]`).length > 0 || film.url.includes("/selary/") ? "muslsal" : "film";
            film.title = $(this).find("li[aria-label='title']").text().trim();
            film.img = $(this).find("img").attr("data-src");
            if ($(this).find(`[aria-label="episode"]`).length > 0) {
                $(this).find(`[aria-label="episode"] em`).remove();
                film.eposide = parseInt($(this).find(`[aria-label="episode"]`).text().trim().match(/(\d+)/)[0], 10);
            }

            aflam_posts.push(film);
        });
        aflam_json.aflam = aflam_posts;
        next_button = $(doc).find(`ul[aria-label="pagination"] li`).eq(($(doc).find(`ul[aria-label="pagination"] li.active`).index() + 1));
        if (next_button.length > 0) {
            next_page_link = $(next_button).find("a[href]").attr("href");
            aflam_json.next_page = next_page_link;
        }

        load_aflam_posts(aflam_json, load_type);
    }, search_function: function (key) {
        search_url = "?s=" + key;
        $("#load_more_posts_btn").attr("onclick", `mou_aflam_server.get_list_function('${search_url}',this)`).removeAttr("disabled").show().click();
    },
    load_film_function: function (film) {
        film_title = decodeURIComponent(decodeURIComponent(decodeURIComponent(film.film_title)));
        film_url = decodeURIComponent(decodeURIComponent(decodeURIComponent(decodeURIComponent(film.film_url))));
        film_url = isValidUrl(film_url) ? film_url : server_domain + film_url;
        film_img = decodeURIComponent(film.film_img);

        page_type = film.film_type;
        film_eposide = film.eposide;
        $.ajax({
            "type": "GET",
            "url": film_url,
            success: function (res) {
                res = mou_aflam_server.get_cima_now_res(res);

                film_data = {};
                film_trs = {};
                doc = new DOMParser().parseFromString(res, "text/html");
                film_data.title = film_title;
                film_data.film_type = page_type;


                if (film_img == false || film_img == "" || !isValidUrl(film_img)) {
                    film_data.img = $(doc).find(`meta[property="og:image"]`).attr("content");
                } else {
                    film_data.img = film_img;
                }
                film_data.description = $(doc).find(`section[aria-label="details"]`).find(".tabcontent#details li").eq(0).find("p").text().trim();

                $(doc).find(`section[aria-label="details"]`).find(".tabcontent#details li").eq(0).remove();
                $(doc).find(`section[aria-label="details"]`).find(".tabcontent#details li").each(function () {
                    tr = {};
                    tr_key = $(this).find("strong").text().replace(":", "").trim();
                    $(this).find("strong").remove();
                    tr_val = $(this).text().trim();
                    film_trs[tr_key] = tr_val;
                })
                film_data.trs = film_trs;

                if ($(doc).find(`section[aria-label="details"]`).find(".tabcontent.trailer iframe").length > 0) {
                    film_data.trailer = $(doc).find(`section[aria-label="details"]`).find(".tabcontent.trailer iframe").attr("src");

                }



                show_film_data(film_data);
                if (page_type == "film") {
                    mou_aflam_server.load_msadr_watch(film_url, "film");
                } else if (page_type == "muslsal") {

                    $("#moasm_elmoslsal_container").show();
                    moasm_num = $(doc).find(`section[aria-label="seasons"] ul li`).length;
                    $("#moasm_num").text(` ( ${moasm_num} ) `);


                    // if (film_eposide !== "" && typeof film_eposide !== "undefined") {

                    // $(`#moasm_elmoslsal .mou_eps_num[data-7alkat_link="${active_mosem_link}"]`).click();
                    if (getQueryVariable("halka_num") !== false) {
                        const preload_halka_num = getQueryVariable("halka_num");
                        check_7alakat_loded = setInterval(function () {
                            if ($("#hlakat_elmoslsal .mou_eps_num").length > 0) {
                                // alert(preload_halka_num);

                                $("#hlakat_elmoslsal .mou_eps_num").each(function () {
                                    if ($(this).find("em").text() == preload_halka_num) {
                                        $(this).click();
                                    }
                                });
                                clearInterval(check_7alakat_loded);
                            }
                        }, 100);
                    }

                    // check_7alakat_loded = setInterval(function () {
                    //     if ($("#hlakat_elmoslsal .mou_eps_num").length > 0) {
                    //         $("#hlakat_elmoslsal .mou_eps_num").each(function () {
                    //             if ($(this).find("em").text() == film_eposide) {
                    //                 $(this).click();
                    //             }
                    //         });
                    //         clearInterval(check_7alakat_loded);
                    //     }
                    // }, 100);
                    // }


                    $(doc).find(`section[aria-label="seasons"] ul li`).each(function () {
                        $(this).find("a em").remove();
                        mosem_num = $(this).find("a").text().trim().match(/(\d+)/)[0];
                        epo_link = $(this).find("a").attr("href");
                        $("#moasm_elmoslsal").append(`<a class="mou_eps_num" data-7alkat_link="${epo_link}" onclick="mou_aflam_server.load_7alakat_function(this)" data-mosem_num="${mosem_num}"><em>${mosem_num}</em><span>موسم</span></a>`);

                        if ($(this).hasClass("active")) {
                            active_mosem_link = epo_link;
                        }
                    });
                    if (!$(`#moasm_elmoslsal .mou_eps_num[data-7alkat_link="${active_mosem_link}"]`).hasClass("activee")) {
                        $(`#moasm_elmoslsal .mou_eps_num[data-7alkat_link="${active_mosem_link}"]`).addClass("activee");
                    }
                    if (film_eposide !== "" && typeof film_eposide !== "undefined") {
                        $(`#moasm_elmoslsal .mou_eps_num[data-7alkat_link="${active_mosem_link}"]`).click();
                        check_7alakat_loded = setInterval(function () {
                            if ($("#hlakat_elmoslsal .mou_eps_num").length > 0) {
                                $("#hlakat_elmoslsal .mou_eps_num").each(function () {
                                    if ($(this).find("em").text() == film_eposide) {
                                        $(this).click();
                                    }
                                });
                                clearInterval(check_7alakat_loded);
                            }
                        }, 100);
                    }

                    // halkat_num = $(doc).find(`#episodes li`).length;
                    // $("#eposids_num").text(` ( ${halkat_num} ) `);
                    // console.log(halkat_num);
                    // $(doc).find(`#episodes li`).each(function () {
                    //     halka_num = parseInt($(this).find("a").text().trim().match(/(\d+)/)[0], 10);
                    //     epo_link = $(this).find("a").attr("href");
                    //     $("#hlakat_elmoslsal").append(`<a class="mou_eps_num" onclick="mou_aflam_server.load_msadr_watch('${epo_link}','muslsal',this)" data-halka_num="${halka_num}"><em>${halka_num}</em><span>حلقة</span></a>`);
                    // });

                    // $('#hlakat_elmoslsal').find('.mou_eps_num').sort(function (a, b) {
                    //     return $(b).find("em").text().trim() - $(a).find("em").text().trim();
                    // }).appendTo('#hlakat_elmoslsal');

                    $("#hlakat_elmoslsal_container").show();


                    if (getQueryVariable("mosem_num") !== false) {
                        mosem_num = getQueryVariable("mosem_num");
                        $(`[data-mosem_num="${mosem_num}"]`).click();
                    }
                    // if (getQueryVariable("halka_num") !== false) {
                    //     halka_num = getQueryVariable("halka_num");
                    //     $(`[data-halka_num="${halka_num}"]`).click();
                    // }
                }

            }
        });


    },
    load_7alakat_function: function (this_btn) {
        link = $(this_btn).attr("data-7alkat_link");
        $("#moasm_elmoslsal .mou_eps_num").removeClass("activee");
        $(this_btn).addClass("activee");
        // $("#hlakat_elmoslsal").html(`<span><i class="fas fa-circle-notch fa-spin fa-lg"></i> جاري التحميل</span>`);
        $("#hlakat_elmoslsal").html("");
        $("#eposids_num").html("");

        $.ajax({
            "type": "GET",
            "url": link,
            success: function (res) {
                res = mou_aflam_server.get_cima_now_res(res);
                doc = new DOMParser().parseFromString(res, "text/html");

                halkat_num = $(doc).find(`#eps li`).length;

                $("#eposids_num").text(` ( ${halkat_num} ) `);

                $(doc).find(`#eps li`).each(function () {
                    halka_num = parseInt($(this).find("em").text().trim().match(/(\d+)/)[0], 10);
                    epo_link = $(this).find("a").attr("href");

                    $("#hlakat_elmoslsal").append(`<a class="mou_eps_num" onclick="mou_aflam_server.load_msadr_watch('${epo_link}','muslsal',this)" data-halka_num="${halka_num}"><em>${halka_num}</em><span>حلقة</span></a>`);
                });
                $('#hlakat_elmoslsal').find('.mou_eps_num').sort(function (a, b) {
                    return $(b).find("em").text().trim() - $(a).find("em").text().trim();
                }).appendTo('#hlakat_elmoslsal');
            }
        })
    }, load_cimanow_watch_server: function (link, isDownload = false, this_btn = false) {

        this_halka_text = $("#hlakat_elmoslsal .mou_eps_num.activee ,#hlakat_elmoslsal .mou_eps_num.loading").length > 0 ? " الحلقة " + $("#hlakat_elmoslsal .mou_eps_num.activee ,#hlakat_elmoslsal .mou_eps_num.loading").find("em").text() : "";
        continue_watch_code = film_data.title + (film_data.film_type == "film" ? "" : this_halka_text);


        if (isValidUrl(link)) {

            link_ext = get_url_extension(link);
            if (link_ext == "mp4") {
                if (isDownload == false) {
                    full_title = $(this_btn).attr("data-full_title");
                    play_vid(src_link, `${full_title}`, `Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36`, `{'Referer':'${server_domain}'}`, continue_watch_code);
                } else {
                    add_for_downlaod(`downloads/`, full_title, false, src_link, `video`, `{'Referer':'${server_domain}'}`);
                }

            } else {
                $(this_btn).addClass("loading_elemnt");
                dummy_link = new URL(link);
                if (dummy_link.host == "vk.com") {
                    $.ajax({
                        "type": "GET",
                        "url": link,
                        success: function (res) {
                            doc = new DOMParser().parseFromString(res, "text/html");
                            $(this_btn).removeClass("loading_elemnt");

                            watch_link = $(doc).find(".docs_no_preview_download_btn_container").find("a[href]").attr("href");

                            if (isDownload == false) {
                                full_title = $(this_btn).attr("data-full_title");
                                play_vid(watch_link, `${full_title}`, `Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36`, `{'Referer':'${server_domain}'}`, continue_watch_code);
                            } else {
                                add_for_downlaod(`downloads/`, full_title, false, watch_link, `video`, `{'Referer':'${server_domain}'}`);
                            }

                        }
                    });


                } else {
                    console.log(link);
                }



            }

        }

    }, load_msadr_watch: function (link, watch_type, this_btn = false) {
        $(".watch_srces_btns").html("");
        $(".dl_srces_btns").html("");
        $(".loading_watch_srces").show();


        if (this_btn !== false) {
            $("#hlakat_elmoslsal .mou_eps_num").removeClass("activee");
            $(this_btn).addClass("activee");

            halka_num = $(this_btn).find("em").text().trim();
            mosem_num = $("#moasm_elmoslsal .mou_eps_num.activee").find("em").text().trim();
            now_query_data = get_Queries(2, "?" + query_data);
            now_query_data["mosem_num"] = mosem_num;
            now_query_data["halka_num"] = halka_num;
            query_data = encodeQueryData(now_query_data);

            $("#mou_watch_btn").click();
        }
        // if (this_btn !== false) {

        //     $(this_btn).addClass("activee");
        //     halka_num = $(this_btn).find("em").text().trim();
        //     now_query_data = get_Queries(2, "?" + query_data);
        //     now_query_data["halka_num"] = halka_num;
        //     query_data = encodeQueryData(now_query_data);
        // }

        this_halka_text = $("#hlakat_elmoslsal .mou_eps_num.activee ,#hlakat_elmoslsal .mou_eps_num.loading").length > 0 ? " الحلقة " + $("#hlakat_elmoslsal .mou_eps_num.activee ,#hlakat_elmoslsal .mou_eps_num.loading").find("em").text() : "";
        continue_watch_code = film_data.title + (film_data.film_type == "film" ? "" : this_halka_text);

        if (typeof loading_msadr_ajax !== "undefined" && loading_msadr_ajax !== false) {
            loading_msadr_ajax.abort();
        }

        watch_btn_link = $(doc).find("body > main > article a.shine").attr("href");

        console.log(watch_btn_link);

        mou_aflam_server.get_wathing_url(watch_btn_link, function (watching_url) {


            loading_msadr_ajax = $.ajax({
                "type": "GET",
                "url": decodeURIComponent(decodeURI(watching_url)),
                "headers": {
                    "User-Agent": what_window.Main_USER_AGENT,
                    "Referer": watch_btn_link
                },
                success: function (watching_res) {
                    watching_res = mou_aflam_server.get_cima_now_res(watching_res);
                    watching_doc = new DOMParser().parseFromString(watching_res, "text/html");


                    $(".loading_watch_srces").hide();

                    watching_domain = what_window.extractDomainWithProtocol(link + "watching/");

                    $(watching_doc).find("#watch").find("[data-id]").each(function () {

                        server_data_id = $(this).attr("data-id");
                        server_data_index = $(this).attr("data-index");

                        watching_core = watching_domain + `/wp-content/themes/Cima%20Now%20New/core.php?action=switch&index=${server_data_index}&id=${server_data_id}`;

                        $.ajax({
                            "type": "GET",
                            "url": watching_core,
                            headers: {
                                "User-Agent": what_window.Main_USER_AGENT,
                                "Referer": watching_domain
                            },
                            success: function (server_res) {
                                watching_source = $(server_res).attr("src");

                                mou_cust_server = what_window.is_in_mou_servers(watching_source);
                                if (mou_cust_server !== false) {

                                    add_to_title = page_type == "muslsal" ? " - حلقة " + $("#hlakat_elmoslsal .mou_eps_num.activee em").text() : "";
                                    full_title = film_data.title + add_to_title;

                                    continue_watch_code = film_data.title + (film_data.film_type == "film" ? "" : this_halka_text);

                                    $(`<span class="mou_btn watch_btn" data-full_title="${full_title}" data-continue_watch_code="${continue_watch_code}" onclick="what_window.play_dl_mou_cust_server('${mou_cust_server}','${full_title}','${watching_source}',true,this,\`{'Referer':'${mou_aflam_server.server_domain}'}\`)">${mou_cust_server}</span>`).appendTo(".watch_srces_btns");


                                    add_to_dls = true;
                                    if (typeof what_window.cust_servers[mou_cust_server]["dl_status"] !== "undefined" && what_window.cust_servers[mou_cust_server]["dl_status"] == false) {
                                        add_to_dls = false;
                                    }
                                    if (add_to_dls) {

                                        $(`<span class="mou_btn watch_btn" data-full_title="${full_title}" data-continue_watch_code="${continue_watch_code}" onclick="what_window.play_dl_mou_cust_server('${mou_cust_server}','${full_title}','${watching_source}',false,this,\`{'Referer':'${mou_aflam_server.server_domain}'}\`)">${mou_cust_server}</span>`).appendTo(".dl_srces_btns");
                                    }

                                    // what_window.cust_servers[mou_cust_server]["get_srcs"](this_server_url, function (srcs) {
                                    //     srcs.forEach(src => {

                                    //         mou_aflam_server.add_watch_dl_src(src);
                                    //     });
                                    // })
                                }


                            }
                        });


                    })


                }
            })
        });
    }, get_cima_now_res: function (res) {
        console.log("%c[CimaNow Debug] فحص كتل البيانات الضخمة المجمعة...", "color: cyan; font-weight: bold;");

        try {
            let encodedData = "";
            let offset = 87653;

            // 1. استخراج أضخم نص مجمع بعلامة +
            // هذا الـ Regex يبحث عن السلاسل النصية التي تتبعها علامة + وتستمر لأسطر عديدة
            const megaPattern = /(['"][\w\d~\\/+=]+['"](?:\s*\+\s*['"][\w\d~\\/+=]+['"])+)/g;
            let matches = res.match(megaPattern);

            if (matches) {
                let longestMatch = "";
                matches.forEach(m => {
                    if (m.length > longestMatch.length) longestMatch = m;
                });

                // تنظيف الكتلة المكتشفة وتجميعها في نص واحد
                encodedData = longestMatch.replace(/['"]\s*\+\s*['"]/g, '').replace(/['"]/g, '').replace(/\s+/g, '');
                console.log("[CimaNow Debug] تم تجميع الكتلة الضخمة بنجاح. الطول: " + encodedData.length);
            }

            // 2. إذا فشل الحل الأول، نبحث عن المتغير المرتبط بـ split (الخطة ب)
            if (!encodedData) {
                const varMatch = res.match(/([\w\d_]+)\.split\(/);
                if (varMatch) {
                    const varName = varMatch[1];
                    const lines = res.split('\n');
                    lines.forEach(line => {
                        if (line.includes(varName) && (line.includes("'") || line.includes('"'))) {
                            let content = line.match(/['"]([^'"]+)['"]/);
                            if (content) encodedData += content[1];
                        }
                    });
                }
            }

            if (!encodedData || encodedData.length < 1000) {
                console.error("[CimaNow Debug] فشل استخراج البيانات الحقيقية.");
                return res;
            }

            // 3. استخراج الـ Offset (رقم الطرح)
            const offsetMatch = res.match(/_r\s*=\s*(\d+)/) || res.match(/-\s*(\d{5,6})/);
            if (offsetMatch) {
                offset = parseInt(offsetMatch[1]);
                console.log("[CimaNow Debug] الـ Offset النشط: " + offset);
            }

            // 4. فك التشفير الحسابي
            let decoded_html = '';
            let parts = encodedData.split('~');

            for (let i = 0; i < parts.length; i++) {
                let part = parts[i].trim();
                if (part) {
                    try {
                        let rawDecoded = atob(part);
                        let numValue = parseInt(rawDecoded.replace(/\D/g, ''));
                        if (!isNaN(numValue)) {
                            decoded_html += String.fromCharCode(numValue - offset);
                        }
                    } catch (e) { continue; }
                }
            }

            if (decoded_html.length > 500) {
                try {
                    let finalHtml = decodeURIComponent(escape(decoded_html));
                    console.log("%c[CimaNow Debug] SUCCESS! تم استرجاع الصفحة. الطول: " + finalHtml.length, "color: white; background: green;");
                    return finalHtml;
                } catch (e) {
                    return decoded_html;
                }
            } else {
                console.warn("[CimaNow Debug] النتيجة لا تزال صغيرة جداً.");
            }

        } catch (err) {
            console.error("[CimaNow Debug] خطأ:", err);
        }

        return res;
    }, get_wathing_url: function (watch_btn_link, callback) {

        loading_msadr_ajax = $.ajax({
            "type": "GET",
            "url": watch_btn_link,
            "headers": {
                "User-Agent": what_window.Main_USER_AGENT,
                "Referer": mou_aflam_server.server_domain
            },
            success: function (res, textStatus, xhr) {

                // محاولة استخراج الهيدر set-cookie
                var setCookie = xhr.getResponseHeader('Set-Cookie');
                mou_aflam_server.phpSessId = null;

                if (setCookie) {
                    // استخدام Regex لاستخراج قيمة PHPSESSID فقط
                    var match = setCookie.match(/PHPSESSID=([^;]+)/);
                    if (match) {
                        mou_aflam_server.phpSessId = match[1];
                        console.log("تم استخراج PHPSESSID بنجاح: " + mou_aflam_server.phpSessId);
                    }
                } else {
                    // في حال لم يسمح المتصفح بالوصول للهيدر مباشرة، نبحث في كل الهيدرز المتاحة
                    console.log("لم يتم العثور على Set-Cookie في الهيدرز المباشرة، جاري الفحص الشامل...");
                    var allHeaders = xhr.getAllResponseHeaders().toLowerCase();
                    var matchAll = allHeaders.match(/phpsessid=([^;|\s|\n]+)/);
                    if (matchAll) {
                        mou_aflam_server.phpSessId = matchAll[1];
                        console.log("تم العثور على القيمة في الهيدرز العامة: " + mou_aflam_server.phpSessId);
                    }
                }

                if (!mou_aflam_server.phpSessId) {
                    console.warn("تعذر الوصول لـ PHPSESSID. قد يكون السبب قيود CORS من المتصفح.");
                }

                loading_msadr_ajax = $.ajax({
                    "type": "GET",
                    "url": "https://rm.freex2line.online/2020/02/blog-post.html/",
                    "headers": {
                        "User-Agent": what_window.Main_USER_AGENT,
                        "Referer": watch_btn_link,
                        "Cookie": mou_aflam_server.phpSessId ? `PHPSESSID=${mou_aflam_server.phpSessId}` : ""
                    },
                    success: function (redrict_res, textStatus, xhr) {

                        mou_aflam_server.get_direct_watch_link(redrict_res, function (err, finalUrl) {
                            if (err) {
                                console.error("[✘] خطأ في عملية التشفير: " + err.message);
                            } else {
                                console.log("%c[✔] تم توليد الرابط بنجاح:", "color: #4caf50; font-size: 14px; font-weight: bold;");
                                console.info(finalUrl);

                                setTimeout(function () {

                                    $.ajax({
                                        "type": "GET",
                                        "url": finalUrl,
                                        "headers": {
                                            "User-Agent": what_window.Main_USER_AGENT,
                                            "Referer": "https://rm.freex2line.online/2020/02/blog-post.html/",
                                            "Cookie": mou_aflam_server.phpSessId ? `PHPSESSID=${mou_aflam_server.phpSessId}` : ""
                                        },
                                        success: function (redrict_res, textStatus, xhr) {
                                            callback(decodeURIComponent(decodeURI(redrict_res)));
                                        }
                                    });
                                }, 10 * 1000);

                            }
                        });

                    }
                });



            }
        });

    }, get_direct_watch_link: function (res, callback) {
        try {
            const extract = (regex) => {
                const match = res.match(regex);
                return match ? match[1] : "";
            };

            // 1. استخراج أسماء المتغيرات العشوائية من كائن الإعدادات _0x_cfg
            const cKey = extract(/c\s*:\s*['"]([^'"]+)['"]/); // اسم متغير الـ ch
            const rKey = extract(/r\s*:\s*['"]([^'"]+)['"]/); // اسم متغير الـ rid
            const kKey = extract(/k\s*:\s*['"]([^'"]+)['"]/); // اسم متغير المفتاح المشفر
            const salt = extract(/s\s*:\s*['"]([^'"]+)['"]/); // قيمة الـ salt

            // 2. استخراج القيم الفعلية من الـ HTML بناءً على الأسماء المستخرجة
            const ch = extract(new RegExp(`window\\.${cKey}\\s*=\\s*['"]([^'"]+)['"]`));
            const rid = extract(new RegExp(`window\\.${rKey}\\s*=\\s*['"]([^'"]+)['"]`));
            const encodedKey = extract(new RegExp(`window\\.${kKey}\\s*=\\s*['"]([^'"]+)['"]`));

            if (!rid || !ch || !encodedKey || !salt) {
                throw new Error("فشل استخراج بيانات التشفير الديناميكية (V5)");
            }

            // 3. فك تشفير المفتاح السري (XOR Logic)
            const decodeSecret = (str, s) => {
                let k = atob(str), resStr = "";
                for (let i = 0; i < k.length; i++) {
                    resStr += String.fromCharCode(k.charCodeAt(i) ^ s.charCodeAt(i % s.length));
                }
                return resStr;
            };
            const secretKey = decodeSecret(encodedKey, salt);

            // 4. إعداد التوقيع الرقمي (استخدام محمي لـ Crypto API)
            const encoder = new TextEncoder();

            // محاولة الوصول لـ crypto.subtle بشكل آمن لتجنب مشكلة الـ undefined
            const cryptoLib = (window.crypto && window.crypto.subtle) || window.crypto.subtle;

            if (!cryptoLib) {
                throw new Error("مكتبة Crypto غير متاحة في هذا المتصفح أو تم حظرها");
            }

            cryptoLib.importKey(
                "raw",
                encoder.encode(secretKey),
                { name: "HMAC", hash: "SHA-256" },
                false,
                ["sign"]
            )
                .then(key => {
                    // القيمة الثابتة للبصمة المعتمدة
                    const fp = "TW96aWxsYS81LjIw";

                    // الترتيب الذي رصده سكربت الصيد: RID + CH + FP
                    const dataToSign = encoder.encode(rid + ch + fp);

                    return cryptoLib.sign("HMAC", key, dataToSign);
                })
                .then(signature => {
                    // تحويل التوقيع (ArrayBuffer) إلى Base64
                    const hashArray = Array.from(new Uint8Array(signature));
                    const b64Token = btoa(String.fromCharCode.apply(null, hashArray));
                    const fp = "TW96aWxsYS81LjIw";

                    // تجميع الرابط النهائي
                    const finalUrl = `https://rm.freex2line.online/2020/02/blog-post.html/get-link.php?request_id=${rid}&hmac_token=${encodeURIComponent(b64Token)}&ch=${ch}&fp=${fp}`;

                    if (typeof callback === "function") {
                        callback(null, finalUrl);
                    }
                })
                .catch(err => {
                    if (typeof callback === "function") callback(err, null);
                });

        } catch (err) {
            if (typeof callback === "function") callback(err, null);
        }
    }
    // get_direct_watch_link: function (res, callback) {
    //     try {
    //         const extract = (regex) => {
    //             const match = res.match(regex);
    //             return match ? match[1] : "";
    //         };
    //         const rid = extract(/window\.__requestId\s*=\s*['"]([^'"]+)['"]/);
    //         const ch = extract(/window\.__ch\s*=\s*['"]([^'"]+)['"]/);
    //         const m = parseInt(extract(/window\._0x_m\s*=\s*(\d+)/)) || 0;
    //         const r = parseInt(extract(/window\._0x_r\s*=\s*(\d+)/)) || 0;
    //         if (!rid || !ch) {
    //             throw new Error("تعذر استخراج rid أو ch من الاستجابة");
    //         }
    //         const secretKey = "[pW4X+6B4(pf&-dQ";
    //         const encoder = new TextEncoder();
    //         crypto.subtle.importKey(
    //             "raw",
    //             encoder.encode(secretKey),
    //             { name: "HMAC", hash: "SHA-256" },
    //             false,
    //             ["sign"]
    //         )
    //             .then(key => {
    //                 const fp = "TW96aWxsYTIwNzM2";
    //                 const dataToSign = encoder.encode(rid + ch + fp);

    //                 return crypto.subtle.sign("HMAC", key, dataToSign);
    //             })
    //             .then(signature => {
    //                 const hashArray = Array.from(new Uint8Array(signature));
    //                 const b64Token = btoa(String.fromCharCode.apply(null, hashArray));
    //                 const fp = "TW96aWxsYTIwNzM2";
    //                 const finalUrl = `https://rm.freex2line.online/2020/02/blog-post.html/get-link.php?request_id=${rid}&hmac_token=${encodeURIComponent(b64Token)}&ch=${ch}&fp=${fp}`;
    //                 if (typeof callback === "function") {
    //                     callback(null, finalUrl);
    //                 }
    //             })
    //             .catch(err => {
    //                 if (typeof callback === "function") callback(err, null);
    //             });

    //     } catch (err) {
    //         if (typeof callback === "function") callback(err, null);
    //     }
    // }

    // get_direct_watch_link: async function (rid, ch, callback) {


    //     // const secretKey = "[pW4X+6B4(pf&-dQ";
    //     const secretKey = "S8fXftT";
    //     const encoder = new TextEncoder();

    //     try {
    //         const keyData = encoder.encode(secretKey);
    //         const key = await crypto.subtle.importKey(
    //             "raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
    //         );

    //         const dataToSign = encoder.encode(rid + ch);
    //         const signature = await crypto.subtle.sign("HMAC", key, dataToSign);

    //         const hashArray = Array.from(new Uint8Array(signature));
    //         const b64Token = btoa(String.fromCharCode.apply(null, hashArray));

    //         const finalUrl = `https://rm.freex2line.online/2020/02/blog-post.html/get-link.php?request_id=${rid}&hmac_token=${encodeURIComponent(b64Token)}&ch=${ch}`;

    //         // إرجاع الرابط عبر الـ callback
    //         if (typeof callback === "function") {
    //             callback(null, finalUrl);
    //         }

    //     } catch (err) {
    //         console.error("[✘] خطأ في عملية التشفير: " + err.message);

    //         // تمرير الخطأ للـ callback إذا حدثت مشكلة
    //         if (typeof callback === "function") {
    //             callback(err, null);
    //         }
    //     }

    // }
};

mou_aflam_servers_array["CimaNow"] = obj;