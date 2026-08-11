obj = {
    "main_domain": "https://3isk.biz/",
    "server_domain": "https://3isk.biz/",
    "working_state": true,
    "type": "cats",
    "server_name": "qsteshq",
    "server_title": "قصة عشق",
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
                                if ($(doc).find("head title").text().trim() == "قصة عشق") {
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
        // var g_searsh_key = "3isk website";
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
        //                 if (domain.includes("3isk.")) {
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

            $("#custom_selectors").append(`<button class="custom_cat" data-url="watch/tvshows/">المسلسلات</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="genre/series-mudablij-121/">مسلسلات مدبلجة</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="watch/movies/">الأفلام</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="">احدث الإضافات</button>`);

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
                        "headers": {
                            "referer": mou_aflam_server.server_domain
                        },
                        success: function (res, status, xhr) {
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
                    headers: {
                        "referer": mou_aflam_server.server_domain
                    },
                    success: function (res) {
                        mou_aflam_server.load_list_function(res, "load_more");
                        loading_more_posts = false;

                        $(this_btn).html(`تحميل المزيد`);

                    },
                    error: function (xhr, status, error) {
                        if (xhr.status === 403) {
                            mou_aflam_server.load_list_function(xhr.responseText, "load_more");
                            loading_more_posts = false;
                            $(this_btn).html(`تحميل المزيد`);
                        } else {
                            console.warn("Other error:", status, error);
                        }
                    }

                });
            }

        }
    },
    "load_list_function": function (res, load_type = "first_load") {
        aflam_json = {};
        aflam_posts = [];
        doc = new DOMParser().parseFromString(res, "text/html");
        $(doc).find(".home-items-container").find(".type_item_box").each(function () {
            film = {};
            // film.url = $(this).find("a[href]").attr("href");
            film.url = atob($(this).find("a[href]").attr("data-clse"));

            film.title = $(this).find(".item_title").text().trim();
            film.img = $(this).find("img").attr("data-image");
            film.type = $(this).find(`.item_overlap em`).text().trim() == "فلم" ? "film" : "muslsal";
            if (film.type == "muslsal" && $(this).find(`.item_overlap span`).length > 0) {
                film.eposide = parseInt($(this).find(`.item_overlap span`).text().trim(), 10);
            }
            aflam_posts.push(film);
        });
        aflam_json.aflam = aflam_posts;
        if ($(doc).find(`.icon-chevron-right`).length > 0) {
            next_page_link = $(doc).find(`.icon-chevron-right`).parents("a[href]").attr("href");
            aflam_json.next_page = next_page_link;
        }
        $(load_more_posts_btn).removeAttr("disabled").show()

        load_aflam_posts(aflam_json, load_type);
    }, search_function: function (key) {
        search_url = `search/${key}/`;
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
            "headers": {
                "referer": mou_aflam_server.server_domain,
            },
            success: function (res) {
                film_data = {};
                film_trs = {};
                doc = new DOMParser().parseFromString(res, "text/html");
                film_data.title = film_title;
                film_data.film_type = page_type;

                if (film_img == false || film_img == "" || !isValidUrl(film_img)) {
                    film_data.img = $(doc).find(`.poster-wrapper img`).attr("src");
                } else {
                    film_data.img = film_img;
                }
                film_data.description = $(doc).find(`.description span`).text().trim();

                // $(doc).find(`section[aria-label="details"]`).find(".tabcontent#details li").each(function () {
                //     tr = {};
                //     tr_key = $(this).find("strong").text().replace(":", "").trim();
                //     $(this).find("strong").remove();
                //     tr_val = $(this).text().trim();
                //     film_trs[tr_key] = tr_val;
                // })
                film_data.trs = film_trs;



                if ($(doc).find(".single-trailer-btn").length > 0) {

                    post_id = $(doc).find(".single-trailer-btn").attr("data-post");
                    $.ajax({
                        type: "POST",
                        url: mou_aflam_server.server_domain + "wp-admin/admin-ajax.php",
                        data: {
                            "action": "doo_player_embed_ajax",
                            "post": post_id,
                            "nume": "trailer",
                            "type": "tv"
                        },
                        success: function (trailer_res) {
                            trailer_doc = new DOMParser().parseFromString(trailer_res, "text/html");
                            trailer_url = $(trailer_doc).find("#trailer_player").attr("src");
                            show_trailer_btn(trailer_url);
                        }
                    })

                }

                show_film_data(film_data);
                if (page_type == "film") {
                    mou_aflam_server.load_msadr_watch(film_url, "film");
                } else if (page_type == "muslsal") {

                    // $("#moasm_elmoslsal_container").show();
                    // moasm_num = $(doc).find(`#episodes .ep-num`).length;
                    // $("#moasm_num").text(` ( ${moasm_num} ) `);


                    // if (film_eposide !== "" && typeof film_eposide !== "undefined") {

                    // $(`#moasm_elmoslsal .mou_eps_num[data-7alkat_link="${active_mosem_link}"]`).click();
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


                    // $(doc).find(`section[aria-label="seasons"] ul li`).each(function () {
                    //     $(this).find("a em").remove();
                    //     mosem_num = $(this).find("a").text().trim().match(/(\d+)/)[0];
                    //     epo_link = $(this).find("a").attr("href");
                    //     $("#moasm_elmoslsal").append(`<a class="mou_eps_num" data-7alkat_link="${epo_link}" onclick="mou_aflam_server.load_7alakat_function(this)" data-mosem_num="${mosem_num}"><em>${mosem_num}</em><span>موسم</span></a>`);

                    //     if ($(this).hasClass("active")) {
                    //         active_mosem_link = epo_link;
                    //     }
                    // });
                    // if (!$(`#moasm_elmoslsal .mou_eps_num[data-7alkat_link="${active_mosem_link}"]`).hasClass("activee")) {
                    //     $(`#moasm_elmoslsal .mou_eps_num[data-7alkat_link="${active_mosem_link}"]`).addClass("activee");
                    // }

                    if (film_eposide !== "" && typeof film_eposide !== "undefined") {
                        // $(`#moasm_elmoslsal .mou_eps_num[data-7alkat_link="${active_mosem_link}"]`).click();
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

                    halkat_num = $(doc).find(`#episodes .ep-num`).length
                    $("#eposids_num").text(` ( ${halkat_num} ) `);
                    $(doc).find(`#episodes .ep-num`).each(function () {
                        halka_num = parseInt($(this).find("b").text().trim().match(/(\d+)/)[0], 10);
                        // epo_link = $(this).attr("href");
                        epo_link = atob($(this).attr("data-clse"));
                        $("#hlakat_elmoslsal").append(`<a class="mou_eps_num" onclick="mou_aflam_server.load_msadr_watch('${epo_link}','muslsal',this)" data-halka_num="${halka_num}"><em>${halka_num}</em><span>حلقة</span></a>`);
                    });

                    $('#hlakat_elmoslsal').find('.mou_eps_num').sort(function (a, b) {
                        return $(b).find("em").text().trim() - $(a).find("em").text().trim();
                    }).appendTo('#hlakat_elmoslsal');

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
                    // epo_link = $(this).find("a").attr("href");
                    epo_link = atob($(this).find("a").attr("data-clse"));

                    $("#hlakat_elmoslsal").append(`<a class="mou_eps_num" onclick="mou_aflam_server.load_msadr_watch('${epo_link}','muslsal',this)" data-halka_num="${halka_num}"><em>${halka_num}</em><span>حلقة</span></a>`);
                });
                $('#hlakat_elmoslsal').find('.mou_eps_num').sort(function (a, b) {
                    return $(b).find("em").text().trim() - $(a).find("em").text().trim();
                }).appendTo('#hlakat_elmoslsal');
            }
        })
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
            // now_query_data["mosem_num"] = mosem_num;
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

        $.ajax({
            "type": "GET",
            "url": link + "see/",
            headers: {
                "Cookie": `PHPSESSID=${mou_aflam_server.getPHPSESSID()};`,
            },
            success: function (watching_res, status, xhr) {

                loading_msadr_ajax = $.ajax({
                    "type": "GET",
                    "url": link + "see/",
                    headers: {
                        "Cookie": `PHPSESSID=${mou_aflam_server.getPHPSESSID()};`,
                    },
                    success: function (watching_res, status, xhr) {
                        $(".loading_watch_srces").hide();

                        // watching_domain = what_window.extractDomainWithProtocol(link + "watching/");

                        $(watching_res).find("#player_servers").find("[data-post]").each(function () {

                            server_type = $(this).attr("data-type");
                            server_post_index = $(this).attr("data-post");
                            server_nume_index = $(this).attr("data-nume");

                            watching_core = mou_aflam_server.server_domain + `embed/${server_nume_index}/${server_post_index}/2/`;

                            $.ajax({
                                "type": "GET",
                                "url": watching_core,
                                headers: {
                                    "User-Agent": what_window.Main_USER_AGENT,
                                    "Referer": mou_aflam_server.server_domain
                                },
                                success: function (server_res) {
                                    doc = new DOMParser().parseFromString(server_res, "text/html");
                                    watching_source = $(doc).find(".Video iframe").attr("src");

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
            }
        })

    }, getPHPSESSID: function () {
        if (typeof what_window.QSTESHQ_PHPSESSID == "undefined") {
            what_window.QSTESHQ_PHPSESSID = generateRandomHexString();
        }
        return what_window.QSTESHQ_PHPSESSID;
    }
};

mou_aflam_servers_array["qsteshq"] = obj;