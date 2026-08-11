obj = {
    "main_domain": "https://arabseed.show/",
    "server_domain": "https://m15.asd.rest/",
    "working_state": true,
    "type": "cats",
    "server_name": "arabseed",
    "server_title": "عرب سيد",
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
        // headers: {
        //     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
        //     "Cookie": "cf_clearance=LMeLFQHvMcA8HMhdOvZyC6O06QD6j9KXe.LvbQ6fM9w-1742146521-1.2.1.1-wPnMuSKr0H6AOEQlFshrWLRyCgPJVMmldfUrD8gcc2xZwytXRWpDWauOBOzLPzc6S7.2J9nwMZcjQxSwW96DYHLm6CmcxYtyeLRwPadnOClql8wZHZBPLcIZe_fTFSOTWX9EyK3wAFEwv7CQ3SfzrGX2Z_sh1LWSGsjlITQskA58cERLVW7WxWZsmPhEf0oyB7VhXNcplrFiMWHzMvyiDwqvsvJJhPdmIlzk5PJavFmdduPcpDUJOCXDk3XOJkqVSa8rtnZ76YnydQS9oxMM1jDrlQwY4DDNZDIZuIzCq62KPEVHXgvKJKZk2h_AoE5vQJX5AZyTffetSGBgIQZ5KSert1bcqVGquBuIykafQq5SC.9yz9UEVmdpiJsX7o2K93k9mv5Va88UBilYUWAHbnSgiOoIk2EhF5fjnUHjiPQ"
        // },
        $.ajax({
            type: "GET",
            url: server_domain,
            timeout: 5000,
            success: function (data, textStatus, xhr) {
                domain_found(server_domain);
            },
            error: function (xhr, textStatus, errorThrown) {
                if (xhr.status == "403") {
                    doc = new DOMParser().parseFromString(xhr.responseText, "text/html");
                    error_page_title = $(doc).find("title").text().trim();
                    if (error_page_title == "Just a moment...") {
                        what_window.bypass_cloud_flare("", function () {

                        });
                    }
                } else {
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

                                    if ($(domain_doc).find(".page-content .openNow").length > 0) {
                                        actv_domain = $(domain_doc).find(".page-content .openNow").attr("href");
                                    } else if ($(domain_doc).find(".goHomePage").length > 0) {
                                        actv_domain = $(domain_doc).find("a.goHomePage").attr("href");
                                    } else {
                                        actv_domain = $(domain_doc).find(".leftContents a[href]").attr("href");
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
                }

                domain_search_timeout_fun();

            }
        });
    },
    "get_prop_domains": function (callback) {
        // var g_searsh_key = "موقع عرب سيد";
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
        //                 if (domain.includes("arabseed.") || domain.includes("asd.")) {
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



            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/netfilx/افلام-netfilx/">أفلام NetFilx</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/foreign-movies/">أفلام أجنبي</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/arabic-movies-5/">افلام عربي</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/asian-movies/">افلام اسيوية</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/turkish-movies/">افلام تركية</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/indian-movies/">افلام هندى</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/افلام-انيميشن/">افلام انيميشن</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/افلام-كلاسيكيه/">افلام كلاسيكيه</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/افلام-مدبلجة/">افلام مدبلجة</button>`);

            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/arabic-series/">مسلسلات عربية</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/foreign-series/">مسلسلات اجنبي</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/turkish-series-1/">مسلسلات تركيه</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/مسلسلات-كوريه/">مسلسلات كوريه</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/cartoon-series/">مسلسلات كرتون</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/برامج-تلفزيونية/">برامج تلفزيونية</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/netfilx/مسلسلات-netfilz/">مسلسلات Netfilx</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/wwe-shows/">مصارعة</button>`);


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
        if ($(doc).find(".movie__blocks .movie__blocks__ul").length > 0) {
            movies_blocks = $(doc).find(".movie__blocks .movie__blocks__ul");
        } else if ($(doc).find(".blocks__ul ").length > 0) {
            movies_blocks = $(doc).find(".blocks__ul");
        } else {
            return aflam_posts;
        }
        $(movies_blocks).find(".item__contents").each(function () {
            film = {};
            film.url = $(this).find("a[href]").attr("href");
            film.type = $(this).find(".__number").length > 0 ? "muslsal" : "film";
            film.title = $(this).find(".post__info h3").text().trim();

            if (/^مسلسل(.*)الحلقة/gm.test(film.title) == true) {
                film.title = /^مسلسل(.*)الحلقة/gm.exec(film.title)[1].trim();
            } else if (/^فيلم(.*)/gm.test(film.title) == true) {
                film.title = /^فيلم(.*)/gm.exec(film.title)[1].trim();
            }
            if (/\d+ مترجم/gm.test(film.title) == true) {
                film.title = film.title.replace(/\d+ مترجم/gm, '');
            }
            if ($(this).find(`.__number`).length > 0) {
                film.eposide = parseInt($(this).find(`.__number span`).text().trim().match(/(\d+)/)[0], 10);
            }
            film.img = $(this).find("img").attr("data-src");
            aflam_posts.push(film);
        });
        aflam_json.server_title = now_server_title;
        aflam_json.aflam = aflam_posts;

        $(doc).find(`.paginate ul.page-numbers *.page-numbers`).each(function (index) {
            if ($(this).hasClass("current")) {
                next_button = $(doc).find(`.paginate ul.page-numbers .page-numbers`).eq(index + 1);
                if (next_button.length > 0) {
                    next_page_link = $(next_button).attr("href")[0] == "/" ? $(next_button).attr("href").substring(1) : $(next_button).attr("href");

                    aflam_json.next_page = now_aflam_server_domain + next_page_link;
                }
            }
        });

        load_aflam_posts(aflam_json, load_type);
    }, search_function: function (key) {
        search_url = "find/?word=" + key;
        $("#load_more_posts_btn").attr("onclick", `mou_aflam_server.get_list_function('${search_url}',this)`).removeAttr("disabled").show().click();
    },
    load_film_function: function (film) {
        film_title = decodeURIComponent(decodeURIComponent(decodeURIComponent(film.film_title)));
        film_url = decodeURIComponent(decodeURIComponent(decodeURIComponent(film.film_url)));
        film_url = isValidUrl(film_url) ? film_url : server_domain + film_url;
        film_img = decodeURIComponent(decodeURIComponent(film.film_img));
        film_episod = film.eposide;

        page_type = film.film_type;

        $.ajax({
            "type": "GET",
            "url": film_url,
            "headers": {
                "User-Agent": what_window.Main_USER_AGENT,
                "referer": mou_aflam_server.server_domain
            },
            success: function (res, textStatus, jqXHR) {
                film_data = {};
                film_trs = {};
                doc = new DOMParser().parseFromString(res, "text/html");

                now_csrf__token = /'csrf__token':.*"(.*?)"/gm.exec(res)[1];
                now_home__url = /'home__url':.*'(.*?)',/gm.exec(res)[1];
                film_data.title = film_title;
                film_data.film_type = page_type;

                if (typeof film.film_img == "undefined" || film_img == "") {
                    film_data.img = $(doc).find(`.poster__single img`).attr("data-src");
                } else {
                    film_data.img = film_img;
                }


                film_data.description = $(doc).find(`.post__story`).find("p").text();

                $(doc).find(`.info__area__ul li`).each(function () {
                    tr = {};
                    tr_key = $(this).find(".title__kit span").text().replace(":", "").trim();
                    $(this).find(".title__kit").remove();
                    tr_val = $(this).text().trim();
                    if (["سنة العرض", "لغة العرض", "جودة العرض", "بلد العرض", "تاريخ الاضافة"].includes(tr_key)) {
                        film_trs[tr_key] = tr_val;
                    }
                })
                film_data.trs = film_trs;

                // film_data.trailer = $(doc).find(".poster__single .show__trailer").attr("data-iframe");


                show_film_data(film_data);

                if (page_type == "film") {
                    watch_url = $(doc).find(`.watch__and__download a[href]`).attr("href");
                    mou_aflam_server.load_msadr_watch(watch_url, "film");

                } else if (page_type == "muslsal") {




                    if ($(doc).find(".episodes__section .list__sub__cats ul li").length > 1) {

                        $("#moasm_elmoslsal_container").show();
                        moasm_num = $(doc).find(".episodes__section .list__sub__cats ul li").length;
                        $("#moasm_num").text(` ( ${moasm_num} ) `);

                        $(doc).find(".episodes__section .list__sub__cats ul li").each(function () {

                            moasem_dic = {
                                1: ["الأول", "الاول"],
                                2: ["الثاني"],
                                3: ["الثالث"],
                                4: ["الرابع"],
                                5: ["الخامس"],
                                6: ["السادس"],
                                7: ["السابع"],
                                8: ["الثامن"],
                                9: ["التاسع"]
                            }

                            mosem_text = $(this).find("span").text().trim();

                            if ($(this).find("span").text() !== "") {


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
                                data_term = $(this).attr("data-term");
                                $("#moasm_elmoslsal").append(`<a class="mou_eps_num" data-term="${data_term}" onclick="mou_aflam_server.load_7alakat_function(this,'${now_home__url}','${now_csrf__token}')"><em>${mosem_num}</em><span>موسم</span></a>`);
                            }

                        });

                        $("#moasm_elmoslsal .mou_eps_num").each(function (index) {
                            if ($(this).find("em").text() == active_mosem) {
                                active_mosem_index = index;
                            }
                        });
                        $("#moasm_elmoslsal .mou_eps_num").eq(active_mosem_index).addClass("activee");


                        $('#moasm_elmoslsal').find('.mou_eps_num').sort(function (a, b) {
                            return $(a).find("em").text().trim() - $(b).find("em").text().trim();
                        }).appendTo('#moasm_elmoslsal');
                    }

                    halkat_num = $(doc).find(`.episodes__section .episodes__list a`).length;
                    $("#eposids_num").text(` ( ${halkat_num} ) `);

                    $(doc).find(`.episodes__section .episodes__list a`).each(function () {

                        halka_num = parseInt($(this).find(".epi__num b").text().trim().match(/(\d+)/)[0], 10);

                        epo_link = $(this).attr("href");
                        active_class = "";
                        if ($(this).hasClass("active")) {
                            active_class = " activee";
                        }

                        $("#hlakat_elmoslsal").append(`<a class="mou_eps_num${active_class}" onclick="mou_aflam_server.load_arab_seed_watch_server('${epo_link}','muslsal',this)"><em>${halka_num}</em><span>حلقة</span></a>`);
                    });

                    $('#hlakat_elmoslsal').find('.mou_eps_num').sort(function (a, b) {
                        return $(b).find("em").text().trim() - $(a).find("em").text().trim();
                    }).appendTo('#hlakat_elmoslsal');

                    // $(".mou_eps_num.activee").click();
                    $("#hlakat_elmoslsal_container").show();

                    if (getQueryVariable("halka_num") !== false || typeof film_episod !== "undefined") {
                        if (getQueryVariable("halka_num") !== false) {
                            preload_halka_num = getQueryVariable("halka_num");

                        } else if (typeof film_episod !== "undefined") {
                            preload_halka_num = film_episod;
                        }
                        check_7alakat_loded = setInterval(function () {
                            if ($("#hlakat_elmoslsal .mou_eps_num").length > 0) {
                                $("#hlakat_elmoslsal .mou_eps_num").each(function () {
                                    if ($(this).find("em").text() == preload_halka_num) {
                                        $(this).click();
                                    }
                                });
                                clearInterval(check_7alakat_loded);
                            }
                        }, 100);
                    }
                }

            }
        });

    },
    load_7alakat_function: async function (this_btn, home__url, csrf__token) {
        data_term = $(this_btn).attr("data-term");
        $("#moasm_elmoslsal .mou_eps_num").removeClass("activee");
        $(this_btn).addClass("activee");
        $("#hlakat_elmoslsal").html("");
        $("#eposids_num").html("");


        $.ajax({
            type: 'POST',
            url: home__url + "season__episodes/",
            dataType: "json",
            data: {
                "season_id": data_term,
                "csrf_token": csrf__token
            },
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "User-Agent": what_window.Main_USER_AGENT,
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Referer": mou_aflam_server.server_domain,
            },
            success: function (response) {
                // doc = new DOMParser().parseFromString(res, "text/html");

                doc = $(`<div>${response.html}</div>`);

                halkat_num = $(doc).find(`a`).length;
                $("#eposids_num").text(` ( ${halkat_num} ) `);
                $(doc).find(`a`).each(function () {
                    halka_num = parseInt($(this).find(".epi__num b").text().trim().match(/(\d+)/)[0], 10);
                    epo_link = $(this).attr("href");
                    $("#hlakat_elmoslsal").append(`<a class="mou_eps_num" onclick="mou_aflam_server.load_arab_seed_watch_server('${epo_link}','muslsal',this)"><em>${halka_num}</em><span>حلقة</span></a>`);
                });
                $('#hlakat_elmoslsal').find('.mou_eps_num').sort(function (a, b) {
                    return $(b).find("em").text().trim() - $(a).find("em").text().trim();
                }).appendTo('#hlakat_elmoslsal');

            }
        });

    }, load_arab_seed_watch_server: function (link, type, this_btn = false) {

        if (this_btn !== false) {
            $("#hlakat_elmoslsal_container .mou_eps_num").removeClass("activee");
            $(this_btn).addClass("activee");
            $(".watch_srces_btns").html("");
            $(".dl_srces_btns").html("");
            // $(".loading_watch_srces").show();
            mosem_num = $("#moasm_elmoslsal .mou_eps_num.activee").find("em").text().trim();
            halka_num = $(this_btn).find("em").text().trim();
            now_query_data = get_Queries(2, "?" + query_data);
            now_query_data["mosem_num"] = mosem_num;
            now_query_data["halka_num"] = halka_num;
            query_data = decodeURIComponent(encodeQueryData(now_query_data));
            $("#mou_watch_btn").click();

            $.ajax({
                "type": "GET",
                "url": link,
                success: function (res) {
                    doc = new DOMParser().parseFromString(res, "text/html");
                    watch_url = $(doc).find(`.watch__and__download a[href]`).attr("href");
                    mou_aflam_server.load_msadr_watch(watch_url, type, this_btn);

                }
            });
        } else {
            mou_aflam_server.load_msadr_watch(link, type);
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

        this_halka_text = ($("#moasm_elmoslsal .mou_eps_num.activee").length > 0 ? " - الموسم " + $("#moasm_elmoslsal .mou_eps_num.activee").find("em").text() : "") + ($("#hlakat_elmoslsal .mou_eps_num.activee ,#hlakat_elmoslsal .mou_eps_num.loading").length > 0 ? " - الحلقة " + $("#hlakat_elmoslsal .mou_eps_num.activee ,#hlakat_elmoslsal .mou_eps_num.loading").find("em").text() : "");
        continue_watch_code = film_data.title + (film_data.film_type == "film" ? "" : this_halka_text);

        $.ajax({
            "type": "GET",
            "url": link,
            headers: {
                "User-Agent": what_window.Main_USER_AGENT,
                "Referer": mou_aflam_server.server_domain,
            },
            success: async function (watching_res, textStatus, jqXHR) {

                watching_doc = new DOMParser().parseFromString(watching_res, "text/html");
                csrf__token = /'csrf__token':.*"(.*?)"/gm.exec(watching_res)[1];
                home__url = /'home__url':.*'(.*?)',/gm.exec(watching_res)[1];
                post__id = /'psot_id':.*'(.*?)'/gm.exec(watching_res)[1];
                cookie_ = jqXHR.getResponseHeader("set-cookie");
                
                qualities_srcs = $(watching_doc).find(".quality__swither .qualities__list");

                for (i = 0; i < $(qualities_srcs).find("li").length; i++) {
                    try {
                        this_qualities_srcs = $(qualities_srcs).find("li").eq(i);
                        // $(watching_doc).find(".quality__swither .qualities__list li").each(function () {
                        server_quality = $(this_qualities_srcs).attr("data-quality");

                        response = await mou_aflam_server.get_data_from_server_ajax(home__url + "get__quality__servers/", {
                            quality: server_quality,
                            csrf_token: csrf__token,
                            post_id: post__id
                        }, {
                            "X-Requested-With": "XMLHttpRequest",
                            "User-Agent": what_window.Main_USER_AGENT,
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                            "Referer": link,
                            "Cookie": cookie_
                        });

                        if (response.type == "error" && response.message == "unauthorized request") {
                            return;
                        }
                        if (response.type == 'success') {

                            this_srcs = $(`<div>${response.html}</div>`);
                            for (o = 0; o < $(this_srcs).find("li").length; o++) {
                                try {
                                    this_src = $(this_srcs).find("li").eq(o);
                                    data_server = $(this_src).attr("data-server");
                                    data_q = $(this_src).attr("data-qu");
                                    data_server_name = $(this_src).find("span").text().trim();

                                    watch__server_response = await mou_aflam_server.get_data_from_server_ajax(home__url + "get__watch__server/", {
                                        quality: data_q,
                                        server: data_server,
                                        post_id: post__id,
                                        csrf_token: csrf__token
                                    }, {
                                        "X-Requested-With": "XMLHttpRequest",
                                        "User-Agent": what_window.Main_USER_AGENT,
                                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                                        "Referer": link,
                                        "Cookie": cookie_
                                    });

                                    if (watch__server_response.type == "error" && watch__server_response.message == "unauthorized request") {
                                        return;
                                    }
                                    if (watch__server_response.type == 'success') {

                                        data_q = data_q + "p";

                                        console.log(data_server_name + " - " + data_q + " : " + watch__server_response.server);

                                        watching_source = watch__server_response.server;
                                        mou_cust_server = what_window.is_in_mou_servers(watching_source);
                                        if (data_server_name.trim() == "سيرفر عرب سيد") {
                                            mou_cust_server = "arabseed";
                                        }
                                        if (mou_cust_server !== false) {

                                            add_to_title = page_type == "muslsal" ? " - حلقة " + $("#hlakat_elmoslsal .mou_eps_num.activee em").text() : "";
                                            full_title = film_data.title + add_to_title;

                                            continue_watch_code = film_data.title + (film_data.film_type == "film" ? "" : this_halka_text);


                                            $(`<span class="mou_btn watch_btn" data-full_title="${full_title}" data-continue_watch_code="${continue_watch_code}" onclick="what_window.play_dl_mou_cust_server('${mou_cust_server}','${full_title}', '${watching_source}',true,this,\`{'X-Requested-With':'XMLHttpRequest', 'User-Agent':'${what_window.Main_USER_AGENT}', 'Referer':'${mou_aflam_server.server_domain}'}\`)">${mou_cust_server} - ${data_q}</span>`).appendTo(".watch_srces_btns");

                                            add_to_dls = true;
                                            
                                            if (typeof what_window.cust_servers[mou_cust_server]["dl_status"] !== "undefined" && what_window.cust_servers[mou_cust_server]["dl_status"] == false) {
                                                add_to_dls = false;
                                            }
                                            if (add_to_dls) {

                                                $(`<span class="mou_btn watch_btn" data-full_title="${full_title}" data-continue_watch_code="${continue_watch_code}" onclick="what_window.play_dl_mou_cust_server('${mou_cust_server}','${full_title}', '${watching_source}',false,this,\`{'Referer':'${mou_aflam_server.server_domain}'}\`)">${mou_cust_server} - ${data_q}</span>`).appendTo(".dl_srces_btns");
                                            }

                                            // what_window.cust_servers[mou_cust_server]["get_srcs"](this_server_url, function (srcs) {
                                            //     srcs.forEach(src => {

                                            //         mou_aflam_server.add_watch_dl_src(src);
                                            //     });
                                            // })
                                        }


                                    }


                                } catch (error) {
                                    console.log(error);
                                }
                            }


                        }
                    } catch (error) {
                        console.log(error);
                    }
                    if (i + 1 == $(qualities_srcs).find("li").length) {
                        $(".loading_watch_srces").hide();


                    }

                    // })
                    // break;
                }
            }
        });




    }, get_data_from_server_ajax: async function (url, data, headers, callback = null) {

        res = await new Promise(async (resolve) => {
            $.ajax({
                type: 'POST',
                url: url,
                dataType: "json",
                data: data,
                headers: headers,
                success: function (response) {
                    resolve(response);
                }
            });
        });
        if (callback === null) {
            return res;
        } else {
            callback(res);
        }
    }, play_embed_server_from_arabseed: function (src_link, title) {

        $.ajax({
            "type": "GET",
            "url": src_link,
            success: function (embed_watching_res) {
                embed_watching_doc = new DOMParser().parseFromString(embed_watching_res, "text/html");
                this_src_link = $(embed_watching_doc).find("#player_code source").attr("src");

                play_vid(this_src_link, title, `Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36`, `{}`);
            }
        });
    }
};

mou_aflam_servers_array["arabseed"] = obj;