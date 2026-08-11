obj = {
    "main_domain": "https://www.tuktukcinma.com/",
    "server_domain": "https://www.tuktukcinmaaaa.com/",
    "working_state": true,
    "type": "cats",
    "server_name": "tuktukcinma",
    "server_title": "توك توك سيما",
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
                            "type": "HEAD",
                            "url": domain,
                            success: function (domain_res) {
                                // doc = new DOMParser().parseFromString(domain_res, "text/html");
                                this_domain_full_url = this.url;
                                active_domain = new URL(this_domain_full_url);
                                active_domain = active_domain.protocol + "//" + active_domain.hostname;
                                // if ($(doc).find("head title").text().trim() == "توك توك سينما | TukTukCinema مشاهده وتحميل افلام ومسلسلات") {
                                domain_found(active_domain);
                                for (let e = 0; e < window.now_domains_length; e++) {
                                    window["get_prop_domain_" + e].abort();
                                }
                                // }
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
        // var g_searsh_key = "tuktukcinma";
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
        //                 if (domain.includes("tuktukcinma.")) {
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

            $("#custom_selectors").append(`<button class="custom_cat" data-url="recent/">احدث الاضافات</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/movies-2/">الأفلام</button>`);

            $("#custom_selectors").append(`<button class="custom_cat" data-url="channel/film-netflix-1/">افلام نتفلكس</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/movies-2/افلام-اجنبي/">افلام اجنبي</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/movies-2/افلام-هندى/">افلام هندي</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/movies-2/افلام-اسيوي/">افلام اسيوي</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/anime-6/افلام-انمي/">افلام انمي</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="category/movies-2/افلام-تركي/">افلام تركي</button>`);

            $("#custom_selectors").append(`<button class="custom_cat" data-url="sercat/مسلسلات-اجنبي/">المسلسلات</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="sercat/مسلسلات-تركي/">مسلسلات تركي</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="sercat/مسلسلات-أسيوي/">مسلسلات اسيوي</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="channel/series-netflix-2/">مسلسلات نتفليكس</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="sercat/قائمة-الانمي/">احدث الانميات</button>`);
            $("#custom_selectors").append(`<button class="custom_cat" data-url="sercat/مسلسلات-هندي/">مسلسلات هندي</button>`);

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
        page_url = page_url.startsWith("/") ? page_url.slice(1) : page_url;
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
        $(doc).find(".Blocks--List").find(".Block--Item").each(function () {
            film = {};
            film.url = $(this).find("a[href]").attr("href");
            film.title = $(this).find(".Block--Info h2").text().trim();
            if (/مسلسل(.*)/gm.test(film.title) == true) {
                film.title = /^مسلسل(.*)/gm.exec(film.title)[1].trim();
                film.type = "muslsal";
            } if (/(.*)مترجم/gm.test(film.title) == true) {
                film.title = /^(.*)مترجم/gm.exec(film.title)[1].trim();
                film.type = "muslsal";
            } else if (/فيلم(.*)/gm.test(film.title) == true) {
                film.title = /^فيلم(.*)اون لاين/gm.exec(film.title)[1].trim();
                film.type = "film";
            }

            // if ($(this).find(`.Episode--number`).length > 0) {
            //     film.eposide = parseInt($(this).find(`.Episode--number span`).text().trim().match(/(\d+)/)[0], 10);
            //     film.type = "muslsal"
            // }

            film.img = $(this).find(".Poster--Block img").attr("data-src");
            if (!film.title.toLowerCase().includes("iptv")) {
                aflam_posts.push(film);

            }
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
                film_data = {};
                film_trs = {};
                doc = new DOMParser().parseFromString(res, "text/html");
                film_data.title = film_title;
                film_data.film_type = page_type;

                if (film_img == false || film_img == "" || !isValidUrl(film_img)) {
                    film_data.img = $(doc).find(`.MainSingle img[data-src]`).attr("data-src");
                } else {
                    film_data.img = film_img;
                }
                film_data.description = $(doc).find(`.story p`).text();


                $(doc).find(`.MediaQueryRight li`).each(function () {
                    tr = {};
                    tr_key = $(this).find("span").text().replace(":", "").trim();
                    $(this).find("span").remove();
                    tr_val = $(this).text().trim();
                    if (["جودة الفيلم", "موعد الصدور", "دولة الفيلم", "توقيت الفيلم",
                        "توقيت المسلسل", "لغة المسلسل", "جودة المسلسل", "دولة المسلسل", "العمر"
                    ].includes(tr_key)) {
                        film_trs[tr_key] = tr_val;
                    }
                })

                film_data.trs = film_trs;

                // if ($(doc).find(".WatcHTrailer").length > 0) {
                //     data_trailer_id = $(doc).find(".WatcHTrailer").attr("data-id");
                //     $.ajax({
                //         type: "POST",
                //         url: mou_aflam_server.server_domain + "wp-content/themes/TukTukCinema3/Inc/Ajax/Single/Trailer.php",
                //         data: {
                //             "id": data_trailer_id
                //         },
                //         headers: {
                //             "X-Requested-With": "XMLHttpRequest"
                //         },
                //         success: function (trailer_res) {
                //             trailer_doc = new DOMParser().parseFromString(trailer_res, "text/html");
                //             trailer_url = $(trailer_doc).attr("src");
                //             if (isYouTubeVideoLink(trailer_url)) {
                //                 show_trailer_btn(trailer_url);
                //             }
                //         }
                //     })

                // }
                show_film_data(film_data);


                if ($(doc).find(".allepcont").length > 0) {
                    page_type = "muslsal";
                } else {
                    page_type = "film";

                }


                if (page_type == "film") {
                    mou_aflam_server.load_msadr_watch(film_url, "film");
                } else if (page_type == "muslsal") {

                    moasm_num = $(doc).find(".allseasonss .Block--Item").length;
                    if (moasm_num > 0) {
                        $("#moasm_num").text(` ( ${moasm_num} ) `);
                        $("#moasm_elmoslsal_container").show();
                        $(doc).find(".allseasonss .Block--Item a").each(function () {
                            mosem_text = $(this).find(".Block--Info h3").text().trim();
                            mosem_num = /الموسم (.*)/gm.exec(mosem_text)[1];
                            mosem_link = $(this).attr("href");
                            if ($(this).hasClass("selected")) {
                                active_mosem = mosem_num;
                                active_mosem_link = mosem_link;
                            }
                            $("#moasm_elmoslsal").append(`<a class="mou_eps_num" data-link="${mosem_link}" onclick="mou_aflam_server.load_7alakat_function(this)"><em>${mosem_num}</em><span>موسم</span></a>`);
                        });
                        // $("#moasm_elmoslsal .mou_eps_num").each(function (index) {
                        //     if ($(this).find("em").text() == active_mosem) {
                        //         active_mosem_index = index;
                        //     }
                        // })
                        // $("#moasm_elmoslsal .mou_eps_num").eq(active_mosem_index).addClass("activee");

                        // if (!$(`#moasm_elmoslsal .mou_eps_num[data-7alkat_link="${active_mosem_link}"]`).hasClass("activee")) {
                        //     $(`#moasm_elmoslsal .mou_eps_num[data-7alkat_link="${active_mosem_link}"]`).addClass("activee");
                        // }

                    }

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



                    if (film_eposide !== "" && typeof film_eposide !== "undefined") {
                        if (moasm_num > 0) {
                            $(`#moasm_elmoslsal .mou_eps_num[data-7alkat_link="${active_mosem_link}"]`).click();
                        }
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

                    halkat_num = $(doc).find(`.allepcont a`).length;
                    $("#eposids_num").text(` ( ${halkat_num} ) `);

                    $(doc).find(`.allepcont a`).each(function () {
                        $(this).find(".epnum span").remove();
                        halka_num = parseInt($(this).find(".epnum").text().trim().match(/(\d+)/)[0], 10);
                        epo_link = $(this).attr("href");

                        $("#hlakat_elmoslsal").append(`<a class="mou_eps_num" onclick="mou_aflam_server.load_msadr_watch('${epo_link}','muslsal',this)"><em>${halka_num}</em><span>حلقة</span></a>`);
                    });


                    // get muslsal 7lkat

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

            }, error: function (xhr, textStatus, errorThrown) {
                // console.log(this.url + " => " + xhr.status);
                $(".domain_checker span").html(`<i class="far fa-exclamation-triangle" style="color: #ffc800;"></i> حدث خطأ اثناء الاتصال بسيرفر ` + mou_aflam_server["server_title"] + `</br><a href="javascript:window.location.href=window.location.href">إعادة التحميل</a>`);
                $(".domain_checker_container").removeClass("d-none");
            }
        });


    }, get_all_7alkat_links: function (from_7alkat_num, data_term, all_7alkat_links, callback) {
        $.ajax({
            "type": "GET",
            "url": server_domain + `/AjaxCenter/MoreEpisodes/${data_term}/${from_7alkat_num}/`,
            success: function (res) {
                if (typeof res == "string") {
                    res = JSON.parse(res);
                }
                let items = $("<div>" + res.output + "</div>").find("a");
                let items_length = items.length;
                if (items_length == 0) {
                    callback(all_7alkat_links);
                } else {

                    let completed = 0;
                    $(items).each(function () {
                        completed++;
                        halka_num = parseInt($(this).find("episodetitle").text().trim().match(/(\d+)/)[0], 10);
                        epo_link = $(this).attr("href");
                        halka = {};
                        halka["num"] = halka_num;
                        halka["link"] = epo_link;
                        all_7alkat_links.push(halka);
                        if (completed == items_length) {
                            from_7alkat_num = all_7alkat_links.length;
                            mou_aflam_server.get_all_7alkat_links(from_7alkat_num, data_term, all_7alkat_links, callback);
                        }



                    });

                }


            }
        });
    },
    load_7alakat_function: function (this_btn) {
        link = $(this_btn).attr("data-link");
        $("#msader_elmoshda,#msader_eltahmel").hide();
        $("#hlakat_elmoslsal").html(`<span><i class="fas fa-circle-notch fa-spin fa-lg"></i> جاري التحميل</span>`);

        $("#moasm_elmoslsal .mou_eps_num").removeClass("activee");
        $(this_btn).addClass("activee");

        $.ajax({
            "type": "GET",
            "url": link,
            success: function (res) {
                doc = new DOMParser().parseFromString(res, "text/html");
                // halkat_num = $(doc).find(`.Episodes--Seasons--Episodes a`).length;
                $("#hlakat_elmoslsal").html("");

                halkat_num = $(doc).find(`.allepcont a`).length;
                $("#eposids_num").text(` ( ${halkat_num} ) `);

                $(doc).find(`.allepcont a`).each(function () {
                    $(this).find(".epnum span").remove();
                    halka_num = parseInt($(this).find(".epnum").text().trim().match(/(\d+)/)[0], 10);
                    epo_link = $(this).attr("href");

                    $("#hlakat_elmoslsal").append(`<a class="mou_eps_num" onclick="mou_aflam_server.load_msadr_watch('${epo_link}','muslsal',this)"><em>${halka_num}</em><span>حلقة</span></a>`);
                });

                // $(doc).find(`.Episodes--Seasons--Episodes a`).each(function () {
                //     halka_num = parseInt($(this).find("episodetitle").text().trim().match(/(\d+)/)[0], 10);
                //     epo_link = $(this).attr("href");
                //     active_class = "";
                //     if ($(this).hasClass("active")) {
                //         active_class = " activee";
                //     }
                //     $("#hlakat_elmoslsal").append(`<a class="mou_eps_num${active_class}" onclick="mou_aflam_server.load_msadr_watch('${epo_link}','muslsal',this)"><em>${halka_num}</em><span>حلقة</span></a>`);

                // });
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
            success: function (watching_res, textStatus, jqXHR) {
                watching_doc = new DOMParser().parseFromString(watching_res, "text/html");
                $(watching_doc).find(".watch--servers--list .server--item[data-link]").each(function () {
                    // watching_source = $(this).attr("data-url").split('\n')[0];
                    watching_source = $(this).attr("data-link").replace(/\s+/g, '');
                    watching_source = watching_source.split('').reverse().join('');
                    watching_source = watching_source.slice(17);
                    watching_source = atob(watching_source);
                    watch_text = $(this).find("span").text().trim();

                    if (watch_text == "⭐  TukTuk Vip") {

                        $.ajax({
                            "type": "GET",
                            "url": watching_source,
                            "headers": {
                                "User-Agent": what_window.Main_USER_AGENT,
                                "Referer": mou_aflam_server.server_domain,
                            },
                            success: function (res, textStatus, jqXHR) {
                                cookie_ = jqXHR.getResponseHeader("set-cookie");
                                const match = cookie_.match(/XSRF-TOKEN=([^;]+)/);
                                const xsrfToken = match ? match[1] : null;
                                $.ajax({
                                    "type": "GET",
                                    "url": watching_source,
                                    "headers": {
                                        "X-Inertia-Partial-Data": "streams",
                                        "X-Inertia-Version": "d98bcc9c79d1c5ff36a86cc41dfcd275",
                                        "X-Inertia": true,
                                        "X-Inertia-Partial-Component": "files/mirror/video"
                                    },
                                    success: function (links_json, textStatus, jqXHR) {

                                        const data = links_json?.props?.streams?.data || [];

                                        for (i = 0; i < data.length; i++) {
                                            mirrors_label = data[i]["label"];
                                            mirrors = data[i]["mirrors"];
                                            for (m = 0; m < mirrors.length; m++) {
                                                mirror = mirrors[m];
                                                mirror_link = "https:" + mirror["link"];
                                                mou_cust_server = what_window.is_in_mou_servers(mirror_link);
                                                if (mou_cust_server !== false) {

                                                    add_to_title = page_type == "muslsal" ? " - حلقة " + $("#hlakat_elmoslsal .mou_eps_num.activee em").text() : "";
                                                    full_title = film_data.title + add_to_title;

                                                    continue_watch_code = film_data.title + (film_data.film_type == "film" ? "" : this_halka_text);

                                                    $(`<span class="mou_btn watch_btn" data-full_title="${full_title}" data-continue_watch_code="${continue_watch_code}" onclick="what_window.play_dl_mou_cust_server('${mou_cust_server}','${full_title}','${mirror_link}',true,this,\`{'Referer':'${mou_aflam_server.server_domain}'}\`)">${mirrors_label} - ${mou_cust_server}</span>`).appendTo(".watch_srces_btns");


                                                    add_to_dls = true;
                                                    if (typeof what_window.cust_servers[mou_cust_server]["dl_status"] !== "undefined" && what_window.cust_servers[mou_cust_server]["dl_status"] == false) {
                                                        add_to_dls = false;
                                                    }
                                                    if (add_to_dls) {

                                                        $(`<span class="mou_btn watch_btn" data-full_title="${full_title}" data-continue_watch_code="${continue_watch_code}" onclick="what_window.play_dl_mou_cust_server('${mou_cust_server}','${full_title}','${mirror_link}',false,this,\`{'Referer':'${mou_aflam_server.server_domain}'}\`)">${mirrors_label} - ${mou_cust_server}</span>`).appendTo(".dl_srces_btns");
                                                    }

                                                    // what_window.cust_servers[mou_cust_server]["get_srcs"](this_server_url, function (srcs) {
                                                    //     srcs.forEach(src => {

                                                    //         mou_aflam_server.add_watch_dl_src(src);
                                                    //     });
                                                    // })

                                                    $(".loading_watch_srces").hide();
                                                }

                                            }

                                        }

                                    }
                                });

                            }
                        });
                    }




                })


                // if ($(watching_doc).find(".WatchServersList .MyCimaServer").length > 0) {
                //     MyCimaServerUrl = $(watching_doc).find(".WatchServersList .MyCimaServer btn").attr("data-url");
                //     $.ajax({
                //         "type": "GET",
                //         "url": MyCimaServerUrl,
                //         success: function (watching_res) {
                //             $(".loading_watch_srces").hide();
                //             watching_doc = new DOMParser().parseFromString(watching_res, "text/html");

                //             if (/sources: (\[.*]),.*formats/sg.test(watching_res)) {
                //                 bad_json = /sources: (\[.*]),.*formats/sg.exec(watching_res)[1];
                //                 eval(`srcs_array = ` + bad_json.replace(/\s*(['"])?([a-z0-9A-Z_\.]+)(['"])?\s*:([^,\}]+)(,)?/g, '"$2": $4$5'));
                //             } else {
                //                 srcs_array = [];
                //                 src = {};
                //                 src["src"] = $(watching_doc).find("video source").attr("src");
                //                 src["format"] = /(\d+)p\./gm.test(src["src"]) ? /(\d+)p\./gm.exec(src["src"])[1] : "جودة غير معروفة";
                //                 srcs_array.push(src);
                //             }

                //             for (i = 0; i < srcs_array.length; i++) {
                //                 src = srcs_array[i];
                //                 if (src.format !== "auto") {
                //                     quality_name = src.format == "جودة غير معروفة" ? "720p" : parseInt(src.format.replace(/[^\d.]/g, '')) + "p";
                //                     src_link = src.src;

                //                     console.log(src_link);

                //                     src_name = quality_name;
                //                     add_to_title = watch_type == "muslsal" ? " - موسم " + $("#moasm_elmoslsal .mou_eps_num.activee em").text() : "";
                //                     add_to_title += watch_type == "muslsal" ? " - حلقة " + $("#hlakat_elmoslsal .mou_eps_num.activee em").text() : "";
                //                     full_title = film_data.title + add_to_title + " - " + src_name;

                //                     $(`<span class="mou_btn watch_btn" onclick="play_vid(\`${src_link}\`,\`${film_data.title + " - " + src_name}\` , \`Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36\`, \`{'Referer':'${server_domain}'}\`,\`${continue_watch_code}\`)">${src_name}</span>`).appendTo(".watch_srces_btns");


                //                     $(".dl_srces_btns").append(`<span class="mou_btn download_btn" onclick="add_for_downlaod(\`downloads/\`,\`${film_data.title + " - " + src_name}\`, false, \`${src_link}\`,\`video\`, \`{'Referer':'${server_domain}'}\`)">${src_name}</span>`);



                //                 }
                //             }

                //         }
                //     });
                // }


            }
        });


    }
};

mou_aflam_servers_array["tuktukcinma"] = obj;