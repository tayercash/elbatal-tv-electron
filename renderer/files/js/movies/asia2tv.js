obj = {
    "main_domain": "https://ww1.asia2tv.pw/",
    "server_domain": "https://ww1.asia2tv.pw/",
    "working_state": true,
    "type": "cats",
    "server_name": "asia2tv",
    "server_title": "Asia2tv",
    "icon": `<i class="fas fa-film"></i>`,
    "notification_detected_tobics": ["movies"],
    "get_latest_domain": function () {
        server_title = mou_aflam_server["server_title"];
        server_domain = mou_aflam_server["server_domain"];
        $(".domain_checker .server_name").text(server_title)
        if (typeof local_servers_domains[server_requested] !== "undefined") {
            if (isOnlineUrl(local_servers_domains[server_requested])) {
                server_domain = local_servers_domains[server_requested];
                mou_aflam_server.server_domain = server_domain;
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
                                actv_domain = false;
                                domain_doc = new DOMParser().parseFromString(domain_res, "text/html");
                                this_domain_full_url = this.url;
                                active_domain = new URL(this_domain_full_url);
                                active_domain = active_domain.protocol + "//" + active_domain.hostname;

                                if ($(domain_doc).find("head title").text().trim() == "مشاهدة المسلسلات الكورية  والآسيوية بالعربي | Asia2Tv دراما") {
                                    actv_domain = active_domain;
                                }
                                if (actv_domain !== false) {
                                    for (let e = 0; e < window.now_domains_length; e++) {
                                        window["get_prop_domain_" + e].abort();
                                    }
                                    domain_found(actv_domain);
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
        // var g_searsh_key = "asia2tv";
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
        //                 if (domain.includes("asia2tv.")) {
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


            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/new-episodes/">احدث الحلقات</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/asian-drama/">قائمة الدراما</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/asian-drama/korean/">الدراما الكورية</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/asian-drama/japanese/">الدراما اليابانية</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/asian-drama/chinese-taiwanese/">الدراما الصينية والتايوانية</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/asian-drama/thai/">الدراما التايلاندية</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="completed-dramas/">الدراما المكتملة</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="status/ongoing-drama/">دراما تبث حاليا</button>`);

            // $("#custom_selectors").append(`<button class="custom_cat" data-url="category/asian-movies//">الأفلام الأسيوية</button>`);


            $(document).on("click", ".custom_cat", function () {
                if (!$(this).hasClass("disabled")) {
                    $(".posts_ul").html("");
                    $(".custom_cat").addClass("disabled");
                    $(this).addClass("loading_elemnt");
                    $(this).removeClass("disabled");

                    $("#load_more_posts_btn").html(`<i class="fad fa-spinner-third fa-spin"></i> جاري التحميل`);
                    $(".custom_cat").removeClass("disabled").removeClass("active");

                    this_cat_url = $(this).attr("data-url");
                    this_cat_btn = $(this);
                    $.ajax({
                        "type": "GET",
                        "url": server_domain + this_cat_url,
                        success: function (res) {
                            doc = new DOMParser().parseFromString(res, "text/html");

                            $(this_cat_btn).addClass("active");
                            $(".custom_cat.loading_elemnt").removeClass("loading_elemnt");
                            $("#cats_container select").remove();

                            $(".full_cats_container hr").hide();
                            $("#cats_container").hide();

                            mou_aflam_server.load_list_function(res, "first_load");
                        }
                    });

                }
            });

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

        $(doc).find(".wrapper,.itemscopebox").find(".box-item .postmovie").each(function () {
            film = {};
            film.url = $(this).find("a[href]").attr("href");
            film.title = $(this).find("a[href]").text().trim();

            if (/الحلقة (\d+)/gm.test(film.title)) {
                film.type = "muslsal";
                film.eposide = parseInt(/الحلقة (\d+)/gm.exec(film.title)[1], 10);
                film.title = film.title.replace(/الحلقة (\d+)/, "").trim();
            } else if (/فيلم/gm.test(film.title)) {
                film.type = "film";
            } else {
                film.type = "muslsal";
            }


            // if ($(this).find(`.number`).length > 0) {
            //     film.eposide = parseInt($(this).find(`.number span`).text().trim().match(/(\d+)/)[0], 10);
            // }
            film.img = $(this).find("img").attr("src");
            aflam_posts.push(film);
        });
        // aflam_json.server_title = now_server_title;
        aflam_json.aflam = aflam_posts;

        $(doc).find(`.nav-links .page-numbers`).each(function (index) {
            if ($(this).hasClass("current")) {
                next_button = $(doc).find(`.nav-links .page-numbers`).eq(index + 1);
                if (next_button.length > 0) {
                    next_page_link = $(next_button).attr("href")[0] == "/" ? $(next_button).attr("href").substring(1) : $(next_button).attr("href");
                    aflam_json.next_page = now_aflam_server_domain + next_page_link;
                }
            }
        });

        load_aflam_posts(aflam_json, load_type);
    }, search_function: function (key) {
        search_url = "?s=" + key;
        $("#load_more_posts_btn").attr("onclick", `mou_aflam_server.get_list_function('${search_url}',this)`).removeAttr("disabled").show().click();
    },
    load_film_function: function (film) {
        film_title = decodeURIComponent(decodeURIComponent(decodeURIComponent(film.film_title)));
        film_url = decodeURIComponent(decodeURIComponent(decodeURIComponent(film.film_url)));
        film_url = isValidUrl(film_url) ? film_url : server_domain + film_url;
        film_img = decodeURIComponent(decodeURIComponent(film.film_img));

        page_type = film.film_type;

        $.ajax({
            "type": "GET",
            "url": film_url,
            success: function (res) {
                film_data = {};
                film_trs = {};
                doc = new DOMParser().parseFromString(res, "text/html");


                if ($(doc).find(".loop-episode .drama-name").length > 0) {

                    drama_info_url = $(doc).find(".loop-episode .drama-name").attr("href");
                    $.ajax({
                        "type": "GET",
                        "url": drama_info_url,
                        success: function (res) {
                            film_data = {};
                            doc_drama = new DOMParser().parseFromString(res, "text/html");

                            film_data.title = film_title;
                            film_data.film_type = page_type;

                            if (typeof film.film_img == "undefined" || film_img == "") {
                                film_data.img = $(doc_drama).find(`.single-thumb-bg img`).attr("src");
                            } else {
                                film_data.img = film_img;
                            }

                            film_data.description = $(doc_drama).find(`.getcontent`).find("p").eq(0).text();

                            $(doc_drama).find(`.info-detail-single li`).each(function () {
                                tr = {};
                                tr_key = $(this).find("span").text().replace(":", "").trim();
                                $(this).find("span").remove();
                                tr_val = $(this).text().trim();
                                film_trs[tr_key] = tr_val;

                                // if (["مدة العرض", "السنه", "اللغة", "الجودة", "الدولة"].includes(tr_key)) {
                                // }
                            })
                            film_data.trs = film_trs;


                            
                            show_film_data(film_data);
                            mou_aflam_server.show_muslsal_data(doc);


                        }
                    });

                } else {

                    film_data.title = film_title;
                    film_data.film_type = page_type;

                    if (typeof film.film_img == "undefined" || film_img == "") {
                        film_data.img = $(doc).find(`.single-thumb-bg img`).attr("src");
                    } else {
                        film_data.img = film_img;
                    }

                    film_data.description = $(doc).find(`.getcontent`).find("p").eq(0).text();

                    $(doc).find(`.info-detail-single li`).each(function () {
                        tr = {};
                        tr_key = $(this).find("span").text().replace(":", "").trim();
                        $(this).find("span").remove();
                        tr_val = $(this).text().trim();
                        film_trs[tr_key] = tr_val;

                        // if (["مدة العرض", "السنه", "اللغة", "الجودة", "الدولة"].includes(tr_key)) {
                        // }
                    })
                    film_data.trs = film_trs;



                    show_film_data(film_data);
                    mou_aflam_server.show_muslsal_data(doc);

                    if (page_type == "film") {


                    } else {



                    }
                }


                // if (page_type == "film") {
                //     watch_url = $(doc).find(`.WatchButtons .watchBTn`).attr("href");

                //     mou_aflam_server.load_arab_seed_watch_server(watch_url, "film", film_url);

                // } 

            }
        });

    }, show_muslsal_data: function (doc) {
        if ($(doc).find(".box-episode .loop-episode")) {

            halkat_num = $(doc).find(`.box-episode .loop-episode`).eq(0).find("a").length;


            $(doc).find(`.box-episode .loop-episode`).eq(0).find("a").each(function () {
                if (!$(this).hasClass("drama-name")) {

                    if (/(\d+)/.test($(this).find(".titlepisode").text().trim())) {
                        halka_num = parseInt($(this).find(".titlepisode").text().trim().match(/(\d+)/)[0], 10);
                    } else {
                        halka_num = "*";
                    }

                    epo_link = $(this).attr("href");
                    active_class = "";
                    if ($(this).hasClass("current")) {
                        active_class = " activee";
                    }

                    $("#hlakat_elmoslsal").append(`<a class="mou_eps_num${active_class}" onclick="mou_aflam_server.load_asia2tv_watch_servers('${epo_link}','muslsal',this)"><em>${halka_num}</em><span>حلقة</span></a>`);
                } else {
                    halkat_num--;
                }

            });
            $("#eposids_num").text(` ( ${halkat_num} ) `);

            $('#hlakat_elmoslsal').find('.mou_eps_num').sort(function (a, b) {
                return $(b).find("em").text().trim() - $(a).find("em").text().trim();
            }).appendTo('#hlakat_elmoslsal');

            if (getQueryVariable("halka_num") !== false) {
                halka_num = getQueryVariable("halka_num");
                check_7alakat_loded = setInterval(function () {
                    if ($("#hlakat_elmoslsal .mou_eps_num").length > 0) {
                        $("#hlakat_elmoslsal .mou_eps_num").each(function () {
                            if ($(this).find("em").text() == halka_num) {
                                $(this).click();
                            }
                        });
                        clearInterval(check_7alakat_loded);
                    }
                }, 100);
            } else {
                $(".mou_eps_num.activee").click();
            }


            $("#hlakat_elmoslsal_container").show();


        }
    }, load_asia2tv_watch_servers: function (link, type, this_btn = false) {

        if (this_btn !== false) {
            $("#hlakat_elmoslsal_container .mou_eps_num").removeClass("activee");
            $(this_btn).addClass("activee");
            $(".watch_srces_btns").html("");
            $(".dl_srces_btns").html("");
            // $(".loading_watch_srces").show();
            mosem_num = $("#moasm_elmoslsal .mou_eps_num.activee").find("em").text().trim();
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
                    $(doc).find(".server-list-menu .serverslist[data-server]").each(function () {
                        this_server_url = $(this).attr("data-server");
                        console.log(this_server_url);

                        mou_cust_server = what_window.is_in_mou_servers(this_server_url);
                        if (mou_cust_server !== false) {

                            add_to_title = page_type == "muslsal" ? " - حلقة " + $("#hlakat_elmoslsal .mou_eps_num.activee em").text() : "";
                            full_title = film_data.title + add_to_title;

                            this_halka_text = ($("#moasm_elmoslsal .mou_eps_num.activee").length > 0 ? " - الموسم " + $("#moasm_elmoslsal .mou_eps_num.activee").find("em").text() : "") + ($("#hlakat_elmoslsal .mou_eps_num.activee ,#hlakat_elmoslsal .mou_eps_num.loading").length > 0 ? " - الحلقة " + $("#hlakat_elmoslsal .mou_eps_num.activee ,#hlakat_elmoslsal .mou_eps_num.loading").find("em").text() : "");

                            continue_watch_code = film_data.title + (film_data.film_type == "film" ? "" : this_halka_text);

                            $(`<span class="mou_btn watch_btn" data-full_title="${full_title}" data-continue_watch_code="${continue_watch_code}" onclick="what_window.play_dl_mou_cust_server('${mou_cust_server}','${full_title}','${this_server_url}',true,this)">${mou_cust_server}</span>`).appendTo(".watch_srces_btns");


                            $(`<span class="mou_btn watch_btn" data-full_title="${full_title}" data-continue_watch_code="${continue_watch_code}" onclick="what_window.play_dl_mou_cust_server('${mou_cust_server}','${full_title}','${this_server_url}',false,this)">${mou_cust_server}</span>`).appendTo(".dl_srces_btns");

                            // what_window.cust_servers[mou_cust_server]["get_srcs"](this_server_url, function (srcs) {
                            //     srcs.forEach(src => {

                            //         mou_aflam_server.add_watch_dl_src(src);
                            //     });
                            // })
                        }

                        $(".loading_watch_srces").hide();


                    });
                }
            });
        } else {
            mou_aflam_server.load_msadr_watch(link, type);
        }

    }, add_watch_dl_src(src) {

        add_to_title = page_type == "muslsal" ? " - حلقة " + $("#hlakat_elmoslsal .mou_eps_num.activee em").text() : "";
        full_title = film_data.title + add_to_title + " - " + src["name"];

        this_halka_text = ($("#moasm_elmoslsal .mou_eps_num.activee").length > 0 ? " - الموسم " + $("#moasm_elmoslsal .mou_eps_num.activee").find("em").text() : "") + ($("#hlakat_elmoslsal .mou_eps_num.activee ,#hlakat_elmoslsal .mou_eps_num.loading").length > 0 ? " - الحلقة " + $("#hlakat_elmoslsal .mou_eps_num.activee ,#hlakat_elmoslsal .mou_eps_num.loading").find("em").text() : "");

        continue_watch_code = film_data.title + (film_data.film_type == "film" ? "" : this_halka_text);

        this_src_link = src["url"];
        this_src_name = src["name"];

        this_src_header = typeof src["headers"] !== "undefined" ? JSON.stringify(src["headers"]).replace(/"/g, "'") : '{}';

        $(`<span class="mou_btn watch_btn" data-full_title="" onclick="mou_aflam_server.load_custom_watch_server('${src["url"]}',true,this)">${this_src_name}</span>`).appendTo(".watch_srces_btns");

        // $(".dl_srces_btns").append(`<span class="mou_btn download_btn" data-full_title="${full_title}" onclick="mou_aflam_server.load_custom_watch_server('${src["url"]}',true,this)">${src["name"]}</span>`);


    }, load_custom_watch_server: function (link, isDownload = false, this_btn = false) {

        this_halka_text = $("#hlakat_elmoslsal .mou_eps_num.activee ,#hlakat_elmoslsal .mou_eps_num.loading").length > 0 ? " الحلقة " + $("#hlakat_elmoslsal .mou_eps_num.activee ,#hlakat_elmoslsal .mou_eps_num.loading").find("em").text() : "";
        continue_watch_code = film_data.title + (film_data.film_type == "film" ? "" : this_halka_text);

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




    },
    load_7alakat_function: function (this_btn) {
        data_id = $(this_btn).attr("data-id");
        season_id = $(this_btn).attr("data-season");

        $("#moasm_elmoslsal .mou_eps_num").removeClass("activee");
        $(this_btn).addClass("activee");
        $("#hlakat_elmoslsal").html("");
        $("#eposids_num").html("");

        $.ajax({
            "type": "POST",
            "url": mou_aflam_server.server_domain + "wp-content/themes/Elshaikh2021/Ajaxat/Single/Episodes.php",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            "data": {
                "post_id": data_id,
                "season": season_id
            },
            success: function (res) {
                doc = new DOMParser().parseFromString(res, "text/html");
                halkat_num = $(doc).find(`a`).length;
                $("#eposids_num").text(` ( ${halkat_num} ) `);
                $(doc).find(`a`).each(function () {
                    halka_num = parseInt($(this).find("em").text().trim().match(/(\d+)/)[0], 10);
                    epo_link = $(this).attr("href");
                    $("#hlakat_elmoslsal").append(`<a class="mou_eps_num" onclick="mou_aflam_server.load_arab_seed_watch_server('${epo_link}','muslsal','${film_url}',this)"><em>${halka_num}</em><span>حلقة</span></a>`);
                });
                $('#hlakat_elmoslsal').find('.mou_eps_num').sort(function (a, b) {
                    return $(b).find("em").text().trim() - $(a).find("em").text().trim();
                }).appendTo('#hlakat_elmoslsal');
            }
        })
    }, load_msadr_watch: function (link, watch_type, this_btn = false) {
        this_halka_text = ($("#moasm_elmoslsal .mou_eps_num.activee").length > 0 ? " - الموسم " + $("#moasm_elmoslsal .mou_eps_num.activee").find("em").text() : "") + ($("#hlakat_elmoslsal .mou_eps_num.activee ,#hlakat_elmoslsal .mou_eps_num.loading").length > 0 ? " - الحلقة " + $("#hlakat_elmoslsal .mou_eps_num.activee ,#hlakat_elmoslsal .mou_eps_num.loading").find("em").text() : "");

        continue_watch_code = film_data.title + (film_data.film_type == "film" ? "" : this_halka_text);
        ajax_headers = {
            "Referer": mou_aflam_server.server_domain,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
        };
        // $.MouAjax({
        //     "type": "GET",
        //     "url": link,
        //     "headers": ajax_headers,
        //     success: async function (watching_res) {
        //         watching_doc = new DOMParser().parseFromString(watching_res, "text/html");
        //         srces_div = $("<div/>");

        //         $(watching_doc).find(".containerServers ul *").each(function () {
        //             if ($(this).prop("tagName") == "H3") {
        //                 new_div = $(`<div class="srcs"/>`).attr("data-srces_name", $(this).text()).appendTo(srces_div);
        //             } else if ($(this).prop("tagName") == "LI") {
        //                 if ($(this).find("span").text() == "سيرفر عرب سيد") {
        //                     $(this).attr("data-moutype", "direct");
        //                 } else {
        //                     $(this).attr("data-moutype", "web");
        //                 }
        //                 $(this).appendTo($(srces_div).find(".srcs").last());

        //             }
        //         });


        //         for (i = 0; i < $(srces_div).find(".srcs").length; i++) {
        //             this_srcs = $(srces_div).find(".srcs").eq(i);

        //             for (e = 0; e < $(this_srcs).find("li").length; e++) {
        //                 try {
        //                     this_src = $(this_srcs).find("li").eq(e);
        //                     moutype = $(this_src).attr("data-moutype");
        //                     src_link = $(this_src).attr("data-link");

        //                     quality_name = parseInt($(this_srcs).attr("data-srces_name").replace(/[^\d.]/g, '')) + "p";
        //                     add_to_title = "";
        //                     if ($("#moasm_elmoslsal .mou_eps_num").length > 1) {
        //                         add_to_title = watch_type == "muslsal" ? " - موسم " + $("#moasm_elmoslsal .mou_eps_num.activee em").text() : "";
        //                     }
        //                     add_to_title += watch_type == "muslsal" ? " - حلقة " + $("#hlakat_elmoslsal .mou_eps_num.activee em").text() : "";
        //                     full_title = film_data.title + add_to_title + " - " + quality_name;

        //                     if (moutype == "direct") {
        //                         await $.ajax({
        //                             "type": "GET",
        //                             "url": src_link,
        //                             success: function (embed_watching_res) {
        //                                 embed_watching_doc = new DOMParser().parseFromString(embed_watching_res, "text/html");
        //                                 this_src_link = $(embed_watching_doc).find("#player_code source").attr("src");

        //                                 $(`<span class="mou_btn watch_btn" onclick="play_vid(\`${this_src_link}\`, \`${full_title}\`, \`Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36\`, \`{}\`,\`${continue_watch_code}\`)">${quality_name}</span>`).appendTo(".watch_srces_btns");

        //                                 $(".dl_srces_btns").append(`<span class="mou_btn download_btn" onclick="add_for_downlaod(\`downloads/\`,\`${full_title}\`, false, \`${this_src_link}\`,\`video\`, \`{}\`)">${quality_name}</span>`);

        //                             }

        //                         });
        //                     } else {
        //                         server_title = "سيرفر ويب";
        //                         where_file = is_app_in_dev_mode == true ? "1" : "2";

        //                         disallowed_servers = ["d0000d.com"];
        //                         if (!disallowed_servers.includes(src_link)) {
        //                             $(`<span class="mou_btn watch_btn" onclick="play_vid(\`${src_link}\`, \`${full_title}\` , \`Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36\`, \`{}\`,false, false, \`WebPlayer\`, \`${where_file}\`)">سيرفر ويب - ${quality_name}</span>`).appendTo(".watch_srces_btns");
        //                         }

        //                     }




        //                 } catch (error) {
        //                     // (perhaps report error here)
        //                 }
        //                 if (i + 1 == $(srces_div).find(".srcs").length) {
        //                     $(".loading_watch_srces").hide();
        //                 }

        //             }
        //         }

        //         // $(srces_div).find(".srcs").each(function () {


        //         // });


        //     }
        // });

        $.ajax({
            type: "GET",
            url: link,
            headers: ajax_headers,
            success: async function (watching_res, textStatus, jqXHR) {

                watching_doc = new DOMParser().parseFromString(watching_res, "text/html");
                srces_div = $("<div/>");

                $(watching_doc).find(".containerServers ul *").each(function () {
                    if ($(this).prop("tagName") == "H3") {
                        new_div = $(`<div class="srcs"/>`).attr("data-srces_name", $(this).text()).appendTo(srces_div);
                    } else if ($(this).prop("tagName") == "LI") {
                        if ($(this).find("span").text() == "سيرفر عرب سيد") {
                            $(this).attr("data-moutype", "direct");
                        } else {
                            $(this).attr("data-moutype", "web");
                        }
                        $(this).appendTo($(srces_div).find(".srcs").last());

                    }
                });


                for (i = 0; i < $(srces_div).find(".srcs").length; i++) {
                    this_srcs = $(srces_div).find(".srcs").eq(i);

                    for (e = 0; e < $(this_srcs).find("li").length; e++) {
                        try {
                            this_src = $(this_srcs).find("li").eq(e);
                            moutype = $(this_src).attr("data-moutype");
                            src_link = $(this_src).attr("data-link");

                            quality_name = parseInt($(this_srcs).attr("data-srces_name").replace(/[^\d.]/g, '')) + "p";
                            add_to_title = "";
                            if ($("#moasm_elmoslsal .mou_eps_num").length > 1) {
                                add_to_title = watch_type == "muslsal" ? " - موسم " + $("#moasm_elmoslsal .mou_eps_num.activee em").text() : "";
                            }
                            add_to_title += watch_type == "muslsal" ? " - حلقة " + $("#hlakat_elmoslsal .mou_eps_num.activee em").text() : "";
                            full_title = film_data.title + add_to_title + " - " + quality_name;

                            if (moutype == "direct") {
                                await $.ajax({
                                    "type": "GET",
                                    "url": src_link,
                                    success: function (embed_watching_res) {
                                        embed_watching_doc = new DOMParser().parseFromString(embed_watching_res, "text/html");
                                        this_src_link = $(embed_watching_doc).find("#player_code source").attr("src");

                                        $(`<span class="mou_btn watch_btn" onclick="play_vid(\`${this_src_link}\`, \`${full_title}\`, \`Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36\`, \`{}\`,\`${continue_watch_code}\`)">${quality_name}</span>`).appendTo(".watch_srces_btns");

                                        $(".dl_srces_btns").append(`<span class="mou_btn download_btn" onclick="add_for_downlaod(\`downloads/\`,\`${full_title}\`, false, \`${this_src_link}\`,\`video\`, \`{}\`)">${quality_name}</span>`);

                                    }

                                });
                            } else {
                                server_title = "سيرفر ويب";
                                where_file = is_app_in_dev_mode == true ? "1" : "2";

                                disallowed_servers = ["d0000d.com"];
                                if (!disallowed_servers.includes(src_link)) {
                                    $(`<span class="mou_btn watch_btn" onclick="play_vid(\`${src_link}\`, \`${full_title}\` , \`Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36\`, \`{}\`,false, false, \`WebPlayer\`, \`${where_file}\`)">سيرفر ويب - ${quality_name}</span>`).appendTo(".watch_srces_btns");
                                }

                            }




                        } catch (error) {
                            // (perhaps report error here)
                        }
                        if (i + 1 == $(srces_div).find(".srcs").length) {
                            $(".loading_watch_srces").hide();
                        }

                    }
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Inline error handling
                console.error('Error occurred:', textStatus, errorThrown);
            }
        });

    }
};

mou_aflam_servers_array["asia2tv"] = obj;