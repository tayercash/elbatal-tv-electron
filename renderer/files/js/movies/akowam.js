obj = {
    "main_domain": "https://akw.to/",
    "server_domain": "https://ak.sv/",
    "working_state": true,
    "type": "cats",
    "server_name": "akowam",
    "server_title": "أكوام",
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

                                if ($(doc).find("head title").text().trim() == "اكوام | موقع التحميل و المشاهدة العربي الاول" && $(doc).find(".main-logo img").attr("src") == "/style/assets/images/logo-white.svg") {
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
        // var g_searsh_key = "akwam";
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
        //                 prop_domains.push(domain);
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


            mou_aflam_server.get_catigories(function (selectors) {
                // $(".closer_cats_container").prepend("<hr/>");

                // $(".closer_cats_container").prepend(`<div class="cats_container" id="custom_selectors"></div>`);
                // $("#custom_selectors").append(`<button class="custom_cat" data-url="?movies_or_series=series&section=29&category=87&year=2024">رمضان 2024</buuton>`)
                // $("#custom_selectors").append(`<button class="custom_cat" data-url="?movies_or_series=series&section=29&category=87&year=2023">رمضان 2023</buuton>`);


                select_div = $(`<select name="movies_or_series"></select>`);
                $(select_div).append(`<option value="movies">أفلام</option>`);
                $(select_div).append(`<option value="series">مسلسلات</option>`);
                $("#cats_container").append(select_div);
                for (i = 0; i < selectors.length; i++) {
                    select = selectors[i];
                    select_div = $(`<select class="custom_select select_cats" name="${select.name}"></select>`);
                    for (e = 0; e < select.options.length; e++) {
                        option = select.options[e];
                        $(select_div).append(`<option value="${option["value"]}">${option["name"]}</option>`);
                    }
                    $("#cats_container").append(select_div);
                }
            });

            $(document).on("click", ".custom_cat", function () {
                this_cat_data = get_Queries(2, $(this).attr("data-url"));

                for (i = 0; i < Object.keys(this_cat_data).length; i++) {
                    select_name = Object.keys(this_cat_data)[i];
                    select_value = this_cat_data[select_name];
                    $(`select[name="${select_name}"]`).val(select_value);
                }
                $("#cats_container select").change();


            });
            $(document).on("change", "#cats_container select", function () {
                $(".posts_ul_container .load_more_btn").remove();
                $(".posts_ul_container .posts_ul").html("");

                $(".posts_ul_container").append(`<button class="load_more_btn" id="load_more_posts_btn"><i class="fad fa-spinner-third fa-spin"></i> جاري التحميل</button>`);

                movies_or_series = $(`select[name="movies_or_series"]`).val();
                url_parameters = {};
                $("#cats_container .custom_select").each(function () {
                    url_parameters[$(this).attr("name")] = $(this).val();
                })
                load_url = movies_or_series + "?" + encodeQueryData(url_parameters);
                $("#load_more_posts_btn").attr("onclick", `mou_aflam_server.get_list_function('${load_url}',this)`).click();

            });
            $("#load_more_posts_btn").attr("onclick", `mou_aflam_server.get_list_function('movies',this)`).click();


        }
    },
    get_catigories: function (callback) {
        $.ajax({
            "type": "GET",
            "url": server_domain + "movies",
            success: function (res) {
                doc = new DOMParser().parseFromString(res, "text/html");
                filter_src = $(doc).find("#filter");
                selectors = [];

                $(filter_src).find("select").each(function () {
                    select = {};
                    select_options = [];
                    select["name"] = $(this).attr("name");

                    $(this).find("option").each(function (index) {
                        select_option = {};
                        select_option["name"] = $(this).text();
                        select_option["value"] = $(this).attr("value");


                        if (select["name"] == "year" || select["name"] == "formats" || select["name"] == "quality") {
                            if (index == 0) {
                                select_option["value"] = 0;
                            } else {
                                select_option["value"] = select_option["name"];
                            }
                        }
                        select_options.push(select_option);
                    });
                    select["options"] = select_options;
                    selectors.push(select);
                });

                callback(selectors);
            }
        });
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
                        $(this_btn).html(`تحميل المزيد`);

                        mou_aflam_server.load_list_function(res, "load_more");
                        loading_more_posts = false;
                    }
                });
            }

        }
    },
    "load_list_function": function (res, load_type = "first_load") {
        aflam_json = {};
        aflam_posts = [];
        doc = new DOMParser().parseFromString(res, "text/html");
        $(doc).find(".widget-body").find(".entry-box").each(function () {
            film = {};
            film.url = $(this).find("a[href]").attr("href");
            dummy_url = new URL(film.url);
            film.url = dummy_url.pathname + dummy_url.search;

            film.type = false;
            if (film.url.includes("/series/")) {
                film.type = "muslsal";
            } else if (film.url.includes("/movie/")) {
                film.type = "film";
            }
            film.title = $(this).find(".entry-title a").text().trim();
            film.img = $(this).find("img").attr("data-src");


            if ($(this).find(`[aria-label="episode"]`).length > 0) {
                $(this).find(`[aria-label="episode"] em`).remove();
                film.eposide = parseInt($(this).find(`[aria-label="episode"]`).text().trim().match(/(\d+)/)[0], 10);
            }

            if (film.type !== false) {
                aflam_posts.push(film);
            }
        });
        aflam_json.server_title = now_server_title;
        aflam_json.aflam = aflam_posts;

        next_button = $(doc).find(`ul.pagination .page-item`).eq(($(doc).find(`ul.pagination .page-item.active`).index() + 1));
        if (next_button.length > 0) {
            next_page_link = $(next_button).find("a[href]").attr("href");
            aflam_json.next_page = next_page_link;
        }

        load_aflam_posts(aflam_json, load_type);
    }, search_function: function (key) {
        search_url = "search?q=" + key;
        $("#load_more_posts_btn").attr("onclick", `mou_aflam_server.get_list_function('${search_url}',this)`).removeAttr("disabled").show().click();
    },
    load_film_function: function (film) {

        film_title = decodeURIComponent(decodeURIComponent(decodeURIComponent(film.film_title)));
        film_url = decodeURIComponent(decodeURIComponent(decodeURIComponent(film.film_url)));
        film_url = isValidUrl(film_url) ? film_url : server_domain + film_url;
        film_img = decodeURIComponent(decodeURIComponent(film.film_img));
        page_type = decodeURIComponent(decodeURIComponent(film.film_type));
        film_eposide = decodeURIComponent(decodeURIComponent(film.eposide));

        $.ajax({
            "type": "GET",
            "url": film_url,
            success: function (res) {
                film_data = {};
                film_trs = {};
                doc = new DOMParser().parseFromString(res, "text/html");
                film_data.title = film_title;
                film_data.film_type = page_type;
                film_data.img = film_img;

                if (film_img == false || film_img == "" || !isValidUrl(film_img)) {
                    film_data.img = $(doc).find(`.movie-cover picture img`).attr("src");
                } else {
                    film_data.img = film_img;
                }
                film_data.description = $(doc).find(`.page`).find(".widget-body h2 p").text().trim();

                $(doc).find(`.page .container .row>div`).eq(1).find("div span").each(function () {
                    span_text = $(this).text();
                    if (/.*:.*/gm.test(span_text)) {
                        span_matches = /(.*):(.*)/gm.exec(span_text);
                        tr = {};
                        tr_key = span_matches[1].trim();
                        tr_val = span_matches[2].trim();
                        if (["مدة الفيلم", "السنة", "اللغة", "جودة الفيلم", "انتاج"].includes(tr_key)) {
                            film_trs[tr_key] = tr_val;
                        }
                    }
                });
                film_data.trs = film_trs;

                film_data.trailer = $(doc).find(".movie-cover .col-lg-2 a[data-fancybox]").attr("href");


                show_film_data(film_data);
                if (page_type == "film") {
                    mou_aflam_server.load_msadr_watch(film_url, "film");
                } else if (page_type == "muslsal") {

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

                    $(doc).find(".widget#series-episodes").each(function () {
                        if ($(this).find("header span.header-link").text().trim() == "الحلقات") {
                            halkat_num = $(this).find(".widget-body .row div h2 a").length;
                            $("#eposids_num").text(` ( ${halkat_num} ) `);

                            $(this).find(".widget-body .row div h2 a").each(function () {
                                halaka_text = $(this).text().trim();
                                halka_num = /حلقة ([\d+]+)/g.exec(halaka_text)[1];
                                epo_link = $(this).attr("href");
                                $("#hlakat_elmoslsal").append(`<a class="mou_eps_num" onclick="mou_aflam_server.load_msadr_watch('${epo_link}','muslsal',this)" data-halka_num="${halka_num}"><em>${halka_num}</em><span>حلقة</span></a>`);
                            });
                            $("#hlakat_elmoslsal_container").show();
                            return false;
                        }
                    });
                    $('#hlakat_elmoslsal').find('.mou_eps_num').sort(function (a, b) {
                        return $(b).find("em").text().trim() - $(a).find("em").text().trim();
                    }).appendTo('#hlakat_elmoslsal');

                    if (getQueryVariable("halka_num") !== false) {
                        preload_halka_num = getQueryVariable("halka_num");
                        $(`[data-halka_num="${preload_halka_num}"]`).click();
                    }

                }


            }
        });

    },
    load_7alakat_function: function (this_btn) {
        link = $(this_btn).attr("data-7alkat_link");

        $.ajax({
            "type": "GET",
            "url": link,
            success: function (res) {
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
    }, load_msadr_watch: function (link, watch_type, this_btn = false) {

        $(".watch_srces_btns").html("");
        $(".dl_srces_btns").html("");
        $(".loading_watch_srces").show();
        $("#hlakat_elmoslsal .mou_eps_num").removeClass("loading");


        if (this_btn !== false) {
            $(this_btn).addClass("loading");
            halka_num = $(this_btn).find("em").text().trim();
            now_query_data = get_Queries(2, "?" + query_data);
            now_query_data["halka_num"] = halka_num;
            query_data = encodeQueryData(now_query_data);

            $("#mou_watch_btn").click();
        }

        this_halka_text = ($("#moasm_elmoslsal .mou_eps_num.activee").length > 0 ? " - الموسم " + $("#moasm_elmoslsal .mou_eps_num.activee").find("em").text() : "") + ($("#hlakat_elmoslsal .mou_eps_num.activee ,#hlakat_elmoslsal .mou_eps_num.loading").length > 0 ? " - الحلقة " + $("#hlakat_elmoslsal .mou_eps_num.activee ,#hlakat_elmoslsal .mou_eps_num.loading").find("em").text() : "");

        continue_watch_code = film_data.title + (film_data.film_type == "film" ? "" : this_halka_text);

        $.ajax({
            "type": "GET",
            "url": link,
            success: function (watch_page) {
                watch_page_doc = new DOMParser().parseFromString(watch_page, "text/html");
                watch_url = $(watch_page_doc).find(".qualities a[href]").eq(0).attr("href");
                red_watch_link = new URL(watch_url);

                red_watch_link = red_watch_link.pathname.substring(1).split("/");

                // watch_link = mou_aflam_server.server_domain + red_watch_link.pathname.substring(1) + "/1";
                watch_link = mou_aflam_server.server_domain + "watch/" + red_watch_link[1] + (typeof red_watch_link[2] !== "undefined" ? "/" + red_watch_link[2] : "") + "/1";

                $.ajax({
                    "type": "GET",
                    "url": watch_link,
                    success: function (watch_page) {
                        watching_doc = new DOMParser().parseFromString(watch_page, "text/html");


                        $(".loading_watch_srces").hide();
                        if (this_btn !== false) {
                            $("#hlakat_elmoslsal .mou_eps_num").removeClass("activee");
                            $(this_btn).addClass("activee");
                            $(this_btn).removeClass("loading");
                        }


                        added_src = [];
                        $(watching_doc).find(`video#player source`).each(function () {
                            src_size = $(this).attr("size");
                            if (!added_src.includes(src_size)) {


                                src_link = $(this).attr("src");
                                quality_name = src_size + "p";
                                src_name = quality_name;
                                // add_to_title = watch_type == "muslsal" ? " - موسم " + $("#moasm_elmoslsal .mou_eps_num.activee em").text() : "";
                                add_to_title = watch_type == "muslsal" ? " - حلقة " + $("#hlakat_elmoslsal .mou_eps_num.activee em").text() : "";
                                full_title = film_data.title + add_to_title + " - " + src_name;

                                $(`<span class="mou_btn watch_btn" onclick="play_vid(\`${src_link}\`,\`${full_title}\`,'','{}',\`${continue_watch_code}\`)">${src_name}</span>`).appendTo(".watch_srces_btns");
                                $(".dl_srces_btns").append(`<span class="mou_btn download_btn" onclick="add_for_downlaod(\`downloads/\`,\`${full_title}\`, false, \`${src_link}\`,\`video\`, \`{}\`)">${src_name}</span>`);
                                added_src.push(src_size);
                            }
                        });



                    }
                });


                // if (typeof mouscripts !== "undefined") {
                //     where_file = is_app_in_dev_mode == true ? "1" : "2";
                //     mouscripts.load_url_in_helper_webview(watch_link, "files/js/helpers/akowam_helper.js", where_file, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36", watch_url);
                //     window.parent.html_on_helper_webview = function (html) {
                //         html = convert_byte_to_string(html);
                //         watching_doc = new DOMParser().parseFromString(html, "text/html");

                //         $(".loading_watch_srces").hide();
                //         if (this_btn !== false) {
                //             $("#hlakat_elmoslsal .mou_eps_num").removeClass("activee");
                //             $(this_btn).addClass("activee");
                //             $(this_btn).removeClass("loading");
                //         }

                //         if ($(watching_doc).find(".g-recaptcha").length > 0) {
                //             mouscripts.hide_Loader_HelperWebView();
                //             mouscripts.Show_helper_dialog();
                //         } else {
                //             mouscripts.dismiss_HelperWebView();
                //             mouscripts.unload_helper_webview();
                //             added_src = [];
                //             $(watching_doc).find(`video#player source`).each(function () {
                //                 src_size = $(this).attr("size");
                //                 if (!added_src.includes(src_size)) {


                //                     src_link = $(this).attr("src");
                //                     quality_name = src_size + "p";
                //                     src_name = quality_name;
                //                     // add_to_title = watch_type == "muslsal" ? " - موسم " + $("#moasm_elmoslsal .mou_eps_num.activee em").text() : "";
                //                     add_to_title = watch_type == "muslsal" ? " - حلقة " + $("#hlakat_elmoslsal .mou_eps_num.activee em").text() : "";
                //                     full_title = film_data.title + add_to_title + " - " + src_name;

                //                     $(`<span class="mou_btn watch_btn" onclick="play_vid(\`${src_link}\`,\`${full_title}\`,'','{}',\`${continue_watch_code}\`)">${src_name}</span>`).appendTo(".watch_srces_btns");
                //                     $(".dl_srces_btns").append(`<span class="mou_btn download_btn" onclick="add_for_downlaod(\`downloads/\`,\`${full_title}\`, false, \`${src_link}\`,\`video\`, \`{}\`)">${src_name}</span>`);
                //                     added_src.push(src_size);
                //                 }

                //             })
                //         }
                //     }


                // }

                return false;;
            }
        })



    }
};

mou_aflam_servers_array["akowam"] = obj;