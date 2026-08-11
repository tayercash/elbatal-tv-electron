obj = {
    "main_domain": "https://egydeadw.sbs/",
    "server_domain": "https://egydeadw.sbs/",
    "working_state": true,
    "type": "cats",
    "server_name": "egydead",
    "server_title": "إيجي ديد",
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
                                console.log(active_domain);
                                if ($(doc).find("head title").text().trim() == "ايجي ديد | مشاهدة افلام و مسلسلات و انمي مترجم و مدبلج اونلاين") {
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
        // var g_searsh_key = "topcinema";
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
        //                 if (domain.includes("topcinema.")) {
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

            $("#custom_selectors").append(`<button class="custom_cat" data-url="/category/english-movies/">افلام اجنبي</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="/category/%d8%a7%d9%81%d9%84%d8%a7%d9%85-%d9%83%d8%b1%d8%aa%d9%88%d9%86/">افلام كرتون</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/افلام-اسيوية/">أفلام اسيوية</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/افلام-تركية/">أفلام تركية</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/افلام-وثائقية/">أفلام وثائقية</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/افلام-اجنبية-مدبلجة/">أفلام أجنبية مدبلجة</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/ترجمات-اسلام-الجيزاوي/">أفلام اسلام الجيزاوي</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/افلام-كرتون/افلام-كرتون-ديزني-باللهجة-المصرية/">أفلام كرتون مدبلجة بالمصري</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/افلام-هندية/">أفلام هندية</button>`);

            $("#custom_selectors").append(`<button class="custom_cat" data-url="/series-category/english-series/">مسلسلات اجنبي</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="/series-category/arabic-series/">مسلسلات عربي</button>`);

            $("#custom_selectors").append(`<button class="custom_cat" data-url="/series-category/cartoon-series/">مسلسلات كرتون</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="/series-category/asian-series/">مسلسلات اسيوية</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="/series-category/turkish-series/">مسلسلات تركية</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="/series-category/latino-series/">مسلسلات لاتينية</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="/series-category/documentary-series/">مسلسلات وثائقية</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="/series-category/african-series/">مسلسلات افريقية</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="/series-category/anime-series/">مسلسلات انمي</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="/series-category/anime-movies/">افلام انمي</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="/series-category/anime-series-dubbed/">مسلسلات انمي مدبلجة</button>`);

            // $("#custom_selectors").append(`<button class="custom_cat" data-url="series-category/مسلسلات-اجنبي-1/">مسلسلات اجنبي</button>`);

            // $("#custom_selectors").append(`<button class="custom_cat" data-url="series-category/مسلسلات-كرتون/">مسلسلات كرتون</button>`);
            // $("#custom_selectors").append(`<button class="custom_cat" data-url="series-category/مسلسلات-اسيوية/">مسلسلات اسيوية</button>`);
            // $("#custom_selectors").append(`<button class="custom_cat" data-url="series-category/مسلسلات-تركية-ا/">مسلسلات تركية</button>`);
            // $("#custom_selectors").append(`<button class="custom_cat" data-url="series-category/مسلسلات-لاتينية/">مسلسلات لاتينية</button>`);
            // $("#custom_selectors").append(`<button class="custom_cat" data-url="series-category/مسلسلات-وثائقية/">مسلسلات وثائقية</button>`);
            // $("#custom_selectors").append(`<button class="custom_cat" data-url="series-category/مسلسلات-انمي/">مسلسلات انمي</button>`);
            // $("#custom_selectors").append(`<button class="custom_cat" data-url="category/افلام-انمي/">أفلام انمي</button>`);
            // $("#custom_selectors").append(`<button class="custom_cat" data-url="tag/انميات-شتاء-2025/">انميات شتاء 2025</button>`);
            // $("#custom_selectors").append(`<button class="custom_cat" data-url="series-category/مسلسلات-انمي-مدبلجة/">مسلسلات انمي مدبلجة</button>`);
            // $("#custom_selectors").append(`<button class="custom_cat" data-url="series-category/افلام-انمي/">افلام انمي</button>`);
            // $("#custom_selectors").append(`<button class="custom_cat" data-url="series-category/انميات-صينية/">انميات صينية</button>`);
            // $("#custom_selectors").append(`<button class="custom_cat" data-url="series-category/انميات-كورية/">انميات كورية</button>`);
            // $("#custom_selectors").append(`<button class="custom_cat" data-url="series-category/مسلسلات-اجنبي-مدبلجة/">مسلسلات اجنبية مدبلجة</button>`);
            // $("#custom_selectors").append(`<button class="custom_cat" data-url="series-category/مسلسلات-تركية-مدبلجة/">مسلسلات تركية مدبلجة</button>`);
            // $("#custom_selectors").append(`<button class="custom_cat" data-url="series-category/مسلسلات-كرتون-مدبلجة/">مسلسلات كرتون مدبلجة</button>`);
            // $("#custom_selectors").append(`<button class="custom_cat" data-url="series-category/مسلسلات-لاتينية-مدبلجة/">مسلسلات لاتينية مدبلجة</button>`);


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
        aflam_json = {};
        aflam_posts = [];
        doc = new DOMParser().parseFromString(res, "text/html");
        $(doc).find(".posts-list").find(".movieItem").each(function () {
            film = {};
            film.url = $(this).find("a[href]").attr("href");
            film.title = $(this).find(".BottomTitle").text().trim();
            film.type = "film";
            if (/^مسلسل(.*)/gm.test(film.title) == true) {
                film.title = /^مسلسل(.*)/gm.exec(film.title)[1].trim();
                film.type = "muslsal"
            }
            if (["/serie/", "/season/", "/episode/"].some(substring => film.url.includes(substring))) {
                film.type = "muslsal"
            }
            if ($(this).find(`.number_episode`).length > 0) {
                $(this).find(`.number_episode b`).remove();
                num_text = $(this).find(`.number_episode em`).text();
                film.type = "muslsal"
                film.eposide = num_text;
            }
            film.img = $(this).find("img").attr("src");
            aflam_posts.push(film);
        });
        aflam_json.server_title = now_server_title;
        aflam_json.aflam = aflam_posts;
        // $(doc).find(`.paginate ul.page-numbers a[href]`).each(function (index) {
        //     if ($(this).parents("li").hasClass("active")) {
        //         next_button = $(doc).find(`.paginate ul.page-numbers a[href]`).eq(index + 1);
        //         if (next_button.length > 0) {
        //             next_page_link = $(next_button).attr("href");
        //             aflam_json.next_page = next_page_link;
        //         }
        //     }
        // });
        if ($(doc).find(`.pagination ul.page-numbers .page-numbers.next`).length > 0) {
            next_button = $(doc).find(`.pagination ul.page-numbers .page-numbers.next`);
            next_page_link = $(next_button).attr("href");
            aflam_json.next_page = next_page_link;
        }

        load_aflam_posts(aflam_json, load_type);
    }, search_function: function (key) {
        search_url = `?s=${key}`;
        $("#load_more_posts_btn").attr("onclick", `mou_aflam_server.get_list_function('${search_url}',this)`).removeAttr("disabled").show().click();
    },
    load_film_function: function (film) {
        film_title = decodeURIComponent(decodeURIComponent(decodeURIComponent(film.film_title)));
        film_url = decodeURIComponent(decodeURIComponent(decodeURIComponent(decodeURIComponent(film.film_url))));
        film_url = isValidUrl(film_url) ? film_url : server_domain + film_url;
        film_img = decodeURIComponent(film.film_img);

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

                if (film_img == false || film_img == "" || !isValidUrl(film_img)) {
                    film_data.img = $(doc).find(`.single-thumbnail img`).attr("src");
                } else {
                    film_data.img = film_img;
                }

                film_data.description = $(doc).find(`.infoBox .extra-content p`).text().trim();
                film_data.eposide = film.eposide;

                film_data.trailer = $(doc).find("#trailerPopup iframe").attr("src");
                $(doc).find(`.left .LeftBox li`).each(function () {
                    tr = {};
                    tr_key = $(this).find("span").text().replace(":", "").trim();
                    $(this).find("span").remove();
                    tr_val = $(this).find("a").text();



                    if (["القسم", "النوع", "الجوده", "اللغه", "البلد", "السنه", "مده العرض", "القناه"].includes(tr_key)) {
                        film_trs[tr_key] = tr_val;
                    }
                })

                film_data.trs = film_trs;
                show_film_data(film_data);

                if (page_type == "film") {
                    mou_aflam_server.load_msadr_watch(film_url, "film");
                } else if (page_type == "muslsal") {

                    mou_aflam_server.get_main_muslsal_doc(doc, function (main_muslsal_doc) {


                        moasm_num = $(main_muslsal_doc).find(".seasons-list .movieItem").length;
                        if (moasm_num > 0) {
                            $("#moasm_num").text(` ( ${moasm_num} ) `);
                            $("#moasm_elmoslsal_container").show();

                            $(main_muslsal_doc).find(".seasons-list .movieItem").each(function () {



                                mosem_text = $(this).find(".BottomTitle").text().trim();
                                mosem_link = $(this).find("a").attr("href");
                                mosem_num = null;
                                moasem_dic = {
                                    1: ["الأول", "الاول", "1"],
                                    2: ["الثاني", "الثانى", "2"],
                                    3: ["الثالث", "3"],
                                    4: ["الرابع", "4"],
                                    5: ["الخامس", "5"],
                                    6: ["السادس", "6"],
                                    7: ["السابع", "7"],
                                    8: ["الثامن", "8"],
                                    9: ["التاسع", "9"]
                                }

                                for (const [key, values] of Object.entries(moasem_dic)) {
                                    if (values.some(substring => mosem_text.includes(substring))) {

                                        mosem_num = parseInt(key);
                                        break;
                                    }
                                }

                                $("#moasm_elmoslsal").append(`<a class="mou_eps_num" data-link="${mosem_link}" onclick="mou_aflam_server.load_7alakat_function(this)"><em>${mosem_num}</em><span>موسم</span></a>`);

                            });

                            if (getQueryVariable("mosem_num") !== false) {
                                mosem_num = getQueryVariable("mosem_num");
                                $(`[data-mosem_num="${mosem_num}"]`).click();
                            } else {
                                if (typeof film_data.eposide !== "undefined") {
                                    mou_aflam_server.load_7alakat_function(false, film_url);
                                } else {
                                    $("#moasm_elmoslsal .mou_eps_num").first().click();
                                }
                            }
                        }
                        // else {
                        //     mou_aflam_server.load_7alakat_function(false, film_url);
                        // }
                        mou_aflam_server.load_7alakat_from_doc_function(main_muslsal_doc);
                    })

                    // main_muslsal_link = $(doc).find("#breadcrumbs a[href]").eq(1).attr("href");
                    // $.ajax({
                    //     "type": "GET",
                    //     "url": main_muslsal_link,
                    //     success: function (main_muslsal_res) {
                    //         main_muslsal_doc = new DOMParser().parseFromString(main_muslsal_res, "text/html");




                    //     }
                    // });


                    $("#hlakat_elmoslsal_container").show();


                    // if (getQueryVariable("halka_num") !== false) {
                    //     halka_num = getQueryVariable("halka_num");
                    //     $(`[data-halka_num="${halka_num}"]`).click();
                    // }
                }

            }, error: function (xhr, textStatus, errorThrown) {
                // console.log(this.url + " => " + xhr.status);
                $(".domain_checker span").html(`<i class="far fa-exclamation-triangle" style="color: #ffc800;"></i> حدث خطأ اثناء الاتصال بسيرفر ` + mou_aflam_server["server_title"] + `</br><a href="javascript:window.location.href=window.location.href">إعادة التحميل</a>`);
                $(".domain_checker_container").removeClass("d-none");
            }
        });


    },
    get_main_muslsal_doc: function (link_doc, callback) {
        if ($(link_doc).find(".seasons-list").length > 0) {
            callback(link_doc);

        } else if ($(link_doc).find(".episodes-list").length > 0) {
            callback(link_doc);

        } else {
            main_muslsal_link = $(link_doc).find("#breadcrumbs a[href]").eq(1).attr("href");
            $.ajax({
                "type": "GET",
                "url": main_muslsal_link,
                success: function (main_muslsal_res) {
                    main_muslsal_doc = new DOMParser().parseFromString(main_muslsal_res, "text/html");
                    callback(main_muslsal_doc);

                }
            });
        }




    },
    load_7alakat_function: function (this_btn = false, link = "") {
        $("#moasm_elmoslsal .mou_eps_num").removeClass("activee");
        if (this_btn !== false) {
            $(this_btn).addClass("activee");
            link = $(this_btn).attr("data-link");
        }

        // $("#hlakat_elmoslsal").html(`<span><i class="fas fa-circle-notch fa-spin fa-lg"></i> جاري التحميل</span>`);
        $("#hlakat_elmoslsal").html("");
        $("#eposids_num").html("");

        $.ajax({
            "type": "GET",
            "url": link,
            success: function (res) {
                doc = new DOMParser().parseFromString(res, "text/html");
                mou_aflam_server.load_7alakat_from_doc_function(doc);
            }
        })



    },
    load_7alakat_from_doc_function: function (doc) {

        $("#hlakat_elmoslsal").html("");
        halkat_num = $(doc).find(`.episodes-list .EpsList li`).length;
        $("#eposids_num").text(` ( ${halkat_num} ) `);
        $(doc).find(`.episodes-list .EpsList li`).each(function () {
            let match = $(this).find("a").text().trim().match(/\d+/);
            if (match) {
                halka_num = parseInt(match[0], 10);
            }

            epo_link = $(this).find("a").attr("href");
            active_class = "";
            if ($(this).hasClass("active")) {
                active_class = " activee";
            }
            $("#hlakat_elmoslsal").append(`<a class="mou_eps_num${active_class}" onclick="mou_aflam_server.load_msadr_watch('${epo_link}','muslsal',this)"><em>${halka_num}</em><span>حلقة</span></a>`);

        });

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
            if (typeof film_data.eposide !== "undefined") {
                $("#hlakat_elmoslsal .mou_eps_num").each(function () {
                    if ($(this).find("em").text() == film_data.eposide) {
                        $(this).click();
                    }
                });
            } else {
                $("#hlakat_elmoslsal .mou_eps_num").first().click();
            }


        }


    }
    , load_msadr_watch: function (link, watch_type, this_btn = false) {
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

        this_halka_text = ($("#moasm_elmoslsal .mou_eps_num.activee").length > 0 ? " - الموسم " + $("#moasm_elmoslsal .mou_eps_num.activee").find("em").text() : "") + ($("#hlakat_elmoslsal .mou_eps_num.activee ,#hlakat_elmoslsal .mou_eps_num.loading").length > 0 ? " - الحلقة " + $("#hlakat_elmoslsal .mou_eps_num.activee ,#hlakat_elmoslsal .mou_eps_num.loading").find("em").text() : "");
        continue_watch_code = film_data.title + (film_data.film_type == "film" ? "" : this_halka_text);

        $.ajax({
            "type": "POST",
            "url": link,
            "data": {
                "View": "1"
            },
            success: function (watching_res) {
                $(".loading_watch_srces").hide();

                watching_doc = new DOMParser().parseFromString(watching_res, "text/html");

                $(watching_doc).find(".watchAreaMaster .serversList li, .mob-servers li").each(function () {


                    watching_source = $(this).attr("data-link");
                    mou_cust_server = what_window.is_in_mou_servers(watching_source);
                    if (mou_cust_server !== false) {

                        add_to_title = page_type == "muslsal" ? " - حلقة " + $("#hlakat_elmoslsal .mou_eps_num.activee em").text() : "";
                        full_title = film_data.title + add_to_title;

                        continue_watch_code = film_data.title + (film_data.film_type == "film" ? "" : this_halka_text);

                        $(`<span class="mou_btn watch_btn" data-full_title="${full_title}" data-continue_watch_code="${continue_watch_code}" onclick="what_window.play_dl_mou_cust_server('${mou_cust_server}','${full_title}', '${watching_source}',true,this,\`{'Referer':'${mou_aflam_server.server_domain}'}\`)">${mou_cust_server}</span>`).appendTo(".watch_srces_btns");


                        add_to_dls = true;
                        if (typeof what_window.cust_servers[mou_cust_server]["dl_status"] !== "undefined" && what_window.cust_servers[mou_cust_server]["dl_status"] == false) {
                            add_to_dls = false;
                        }
                        if (add_to_dls) {

                            $(`<span class="mou_btn watch_btn" data-full_title="${full_title}" data-continue_watch_code="${continue_watch_code}" onclick="what_window.play_dl_mou_cust_server('${mou_cust_server}','${full_title}', '${watching_source}',false,this,\`{'Referer':'${mou_aflam_server.server_domain}'}\`)">${mou_cust_server}</span>`).appendTo(".dl_srces_btns");
                        }

                        // what_window.cust_servers[mou_cust_server]["get_srcs"](this_server_url, function (srcs) {
                        //     srcs.forEach(src => {

                        //         mou_aflam_server.add_watch_dl_src(src);
                        //     });
                        // })
                    }


                })



            }
        });


    }
};

mou_aflam_servers_array["egydead"] = obj;