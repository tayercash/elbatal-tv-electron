obj = {
    "main_domain": "https://www.btolat.com/",
    "server_domain": "https://www.btolat.com/",
    "working_state": true,
    "type": "cats",
    "server_name": "btolat",
    "server_title": "فيديو رياضي",
    "icon": `<i class="fas fa-ball"></i>`,
    "notification_detected_tobics": ["sports"],
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
                            timeout: time_out_for_domain_searching * 1000,
                            success: function (domain_res) {
                                doc = new DOMParser().parseFromString(domain_res, "text/html");
                                this_domain_full_url = this.url;
                                active_domain = new URL(this_domain_full_url);
                                active_domain = active_domain.protocol + "//" + active_domain.hostname;
                                domin_found(active_domain);

                                for (let e = 0; e < window.now_domains_length; e++) {
                                    window["get_prop_domain_" + e].abort();
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
        // var g_searsh_key = "btolat";
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
        //                 if (domain.includes(".btolat.")) {
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
            $(".closer_cats_container hr").hide();
            $("#cats_container").hide();

            $.ajax({
                "type": "GET",
                "url": server_domain + "video",
                success: function (res) {
                    doc = new DOMParser().parseFromString(res, "text/html");
                    if ($(doc).find(".desktopMenu").length > 0) {
                        videos_panal = $(doc).find(".desktopMenu > li").eq(3);
                    } else {
                        videos_panal = $(doc).find(".btolatMenuMobile > div > ul > li").eq(2);
                    }


                    // console.log($(doc).find(".btolatMenuMobile > div > ul")[0]);

                    $("#custom_selectors").append(`<button class="custom_cat" data-loadtype="json" data-url="99999999">احدث الفيديوهات</buuton>`);

                    $(videos_panal).find(".panel li a").each(function () {
                        text = $(this).text().trim();
                        link = $(this).attr("href").trim();
                        if (link !== "#" && link !== "/video") {
                            if (isValidUrl(link)) {
                                dummy_link = new URL(link);
                                dummy_link = dummy_link.pathname + dummy_link.search;
                            } else {
                                dummy_link = link;
                            }
                            $("#custom_selectors").append(`<button class="custom_cat" data-url="${dummy_link}">${text}</buuton>`);
                        }
                    });

                    $(".custom_cat").eq(0).click();

                    // mou_aflam_server.load_list_function(res, "load_more");

                }
            })

            $(document).on("click", ".custom_cat", function () {
                if (!$(this).hasClass("disabled")) {

                    $(".posts_ul").html("");
                    $(".custom_cat").addClass("disabled");
                    $(this).addClass("loading_elemnt");
                    $(this).removeClass("disabled");
                    this_cat_url = $(this).attr("data-url");
                    this_cat_btn = $(this);


                    // const lstID = lastRow ? lastRow.getAttribute("data-val") : null;
                    // const lasRowDate = lastRow ? lastRow.getAttribute("data-date") : null;
                    const lstID = 999999999;
                    // const lasRowDate = "10/22/2025 5:46:00 PM";
                    const now = new Date().toLocaleString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                    }).replace(',', '');

                    const lasRowDate = now;
                    if ($(this).attr("data-loadtype") == "json") {
                        loading_more_type = "json";
                        $.ajax({
                            "type": "POST",
                            "url": server_domain + "api/video/LoadMore/0",
                            "data": {
                                lastRowId: lstID,
                                lasRowDate: lasRowDate
                            },
                            "headers": {
                                "X-Requested-With": "XMLHttpRequest",
                                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                            },
                            success: function (res) {
                                // doc = new DOMParser().parseFromString(res, "text/html");
                                $(".custom_cat").removeClass("disabled").removeClass("active");
                                $(this_cat_btn).addClass("active");
                                $(".custom_cat.loading_elemnt").removeClass("loading_elemnt");
                                $("#cats_container select").remove();


                                mou_aflam_server.load_list_function(res, "first_load");


                            }, error: function (jqXHR, error, errorThrown) {


                            }
                        });

                    } else {
                        loading_more_type = "normal";
                        $.ajax({
                            "type": "GET",
                            "url": server_domain + this_cat_url,
                            success: function (res) {
                                doc = new DOMParser().parseFromString(res, "text/html");
                                $(".custom_cat").removeClass("disabled").removeClass("active");
                                $(this_cat_btn).addClass("active");
                                $(".custom_cat.loading_elemnt").removeClass("loading_elemnt");
                                $("#cats_container select").remove();

                                mou_aflam_server.load_list_function(res, "first_load");

                            }, error: function (jqXHR, error, errorThrown) {

                                showToast("Error");
                            }
                        });


                    }

                }

            });


        }
    },
    get_list_function: function (page_url, this_btn) {
        disable_attr = $(this_btn).attr('disabled');
        if (!(typeof disable_attr !== 'undefined' && disable_attr !== false)) {
            if (loading_more_posts == false) {
                loading_more_posts = true;

                $(this_btn).html(`<i class="fad fa-spinner-third fa-spin"></i> جاري التحميل`);

                if (loading_more_type == "normal") {

                    page_url = isValidUrl(page_url) ? page_url : server_domain + page_url;
                    $.ajax({
                        "type": "GET",
                        "url": page_url,
                        success: function (res) {
                            mou_aflam_server.load_list_function(res, "load_more");
                            loading_more_posts = false;
                            $(this_btn).html(`تحميل المزيد`);

                        }, error: function (jqXHR, error, errorThrown) {
                            loading_more_posts = false;
                            $(this_btn).html(`تحميل المزيد`);
                        }
                    });



                } else if (loading_more_type == "json") {

                    lstID = what_window.getQueryVariable("lstID", 2, "?" + page_url);
                    lasRowDate = what_window.getQueryVariable("lasRowDate", 2, "?" + page_url);

                    $.ajax({
                        "type": "POST",
                        "url": server_domain + "api/video/LoadMore/0",
                        "data": {
                            lastRowId: lstID,
                            lasRowDate: lasRowDate
                        },
                        "headers": {
                            "X-Requested-With": "XMLHttpRequest",
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                        },
                        success: function (res) {
                            mou_aflam_server.load_list_function(res, "load_more");
                            loading_more_posts = false;
                            $(this_btn).html(`تحميل المزيد`);
                        }, error: function (jqXHR, error, errorThrown) {
                            $(this_btn).html(`تحميل المزيد`);
                            loading_more_posts = false;
                        }
                    });
                }
            }
        }

    },
    "load_list_function": function (res, load_type = "first_load") {
        aflam_json = {};
        aflam_posts = [];
        aflam_json.aspect_ratio = "wide";
        if (typeof res == "object") {

            if (typeof res["html"] !== "undefined") {
                rows_container = $("<div>" + res["html"] + "</div>");
                $(rows_container).find(".xrow").each(function () {
                    console.log($(this)[0]);
                    film_html = $(this);

                    // $(film_html).find(".topData").remove();
                    // $(film_html).find(".postDate").remove();
                    // $(film_html).find("img.player").remove();
                    // $(film_html).find(".categoryTag").remove();
                    film = {};
                    film.url = $(film_html).find("a[href]").attr("href");
                    film.url = film.url[0] == "/" ? server_domain + film.url : film.url;
                    film.type = "film";
                    film.title = $(film_html).find("h3").text().trim();
                    film.img = $(film_html).find("img").attr("data-src");
                    aflam_posts.push(film);
                })


                aflam_json.aflam = aflam_posts;
                last_div = $(rows_container).find(".xrow").last();

                const lstID = $(last_div).attr("data-val");
                const lasRowDate = $(last_div).attr("data-date");

                aflam_json.next_page = what_window.encodeQueryData({
                    lstID: lstID,
                    lasRowDate: lasRowDate
                });

            } else {

                for (i = 0; i < res.length; i++) {
                    vid_res = res[i];
                    can_add = false;
                    var film = {};

                    film.url = vid_res.SeName;
                    if (film.url.includes("video/")) {
                        can_add = true;
                    }
                    film.url = film.url[0] == "/" ? server_domain + film.url : film.url;
                    film.type = "film";
                    film.title = vid_res.Title;
                    film.img = vid_res.FullSizeImageUrl;
                    if (can_add) {
                        aflam_posts.push(film);
                    }
                }

                aflam_json.aflam = aflam_posts;
            }


        } else if (typeof res == "string") {
            doc = new DOMParser().parseFromString(res, "text/html");


            if ($(doc).find(".categoryBox.ofVideos .categoryNewsCard").length > 0) {


                $(doc).find(".categoryBox.ofVideos").find(".categoryNewsCard").each(function () {
                    film = {};
                    $(this).find("a.categoryTag").remove();
                    film.url = $(this).find("a[href]").attr("href");
                    film.url = film.url[0] == "/" ? server_domain + film.url : film.url;
                    film.type = "film";
                    film.title = $(this).find("h3").text().trim();
                    film.img = $(this).find("img.lazy").attr("data-original");
                    aflam_posts.push(film);
                });
                aflam_json.aflam = aflam_posts;

                if ($(doc).find(`.pagination-container ul.pagination li.next-page`).length) {
                    next_button = $(doc).find(`.pagination-container ul.pagination li.next-page a`);
                    next_page_link = $(next_button).attr("href");
                    aflam_json.next_page = next_page_link;
                }

            } else if ($(doc).find(".videosocial-item").length > 0) {



                $(doc).find(".videosocial-item").each(function () {
                    var film = {};
                    $(this).find(".topData").remove();
                    $(this).find(".postDate").remove();
                    $(this).find("img.player").remove();
                    film.url = $(this).find("a[href]").attr("href");
                    film.url = film.url[0] == "/" ? server_domain + film.url : film.url;
                    film.type = "film";
                    film.title = $(this).find("h3.title").text().trim();
                    film.img = $(this).find("img.lazy").attr("data-original");
                    aflam_posts.push(film);
                });
                aflam_json.aflam = aflam_posts;
                last_vid_id = $(doc).find(".big-video-box").last().attr("data-val");
                // next_page_link = now_aflam_server_domain + `video/LoadMore/${last_vid_id}?VideoID=${last_vid_id}&cat=`;
                next_page_link = server_domain + `video/LoadMore?VideoID=${last_vid_id}`;
                aflam_json.next_page = next_page_link;

            }


        }
        load_aflam_posts(aflam_json, load_type);
    }, search_function: function (key) {
        $.ajax({
            "type": "POST",
            "url": server_domain + "news/Search",
            data: {
                word: key
            },
            "headers": {
                "X-Requested-With": "XMLHttpRequest"
            },
            success: function (res) {
                mou_aflam_server.load_list_function(res, "first_load");
            }, error: function (jqXHR, error, errorThrown) {
            }
        });
        // $("#load_more_posts_btn").attr("onclick", `mou_aflam_server.get_list_function('${search_url}',this)`).click();
    },
    load_film_function: function (film) {
        film_title = decodeURIComponent(decodeURIComponent(decodeURIComponent(film.film_title)));
        film_url = decodeURIComponent(decodeURIComponent(decodeURIComponent(film.film_url)));
        film_img = film.film_img;
        page_type = film.film_type;
        film_url = isValidUrl(film_url) ? film_url : server_domain + film_url;
        $.ajax({
            "type": "GET",
            "url": film_url,
            success: function (res) {
                film_data = {};
                film_trs = {};
                doc = new DOMParser().parseFromString(res, "text/html");
                film_data.title = film_title;
                film_data.film_type = page_type;

                if (film_img == false || typeof film_img == "undefined" || film_img == "") {
                    film_data.img = $(doc).find(`meta[name="thumbnail"]`).attr("content");
                } else {
                    film_data.img = decodeURIComponent(film_img);
                }
                film_data.img_style = "wide";
                show_film_data(film_data);
                if ($(doc).find(`iframe.contentVencher`).length > 0) {
                    watch_url = $(doc).find(`iframe.contentVencher`).attr("src");
                    mou_aflam_server.load_msadr_watch(watch_url, "film", film_url);

                } else {
                    watch_url = $(doc).find(`article.card iframe`).attr("src");
                    watch_title = "Web";
                    console.log(watch_url);
                    if (watch_url.includes("facebook.com")) {
                        watch_title = "Facebook";
                    } if (watch_url.includes("youtube.com")) {
                        watch_title = "Youtube";
                    }

                    // $(`<span class="mou_btn watch_btn" onclick="open_external_link(\`${watch_url}\`)">${watch_title}</span>`).appendTo(".watch_srces_btns");
                    $(`<span class="mou_btn watch_btn" data-trailer_link="${watch_url}">${watch_title}</span>`).appendTo(".watch_srces_btns");


                    $(".loading_watch_srces").hide();

                }

            }
        });


    }, load_msadr_watch: function (link, watch_type, referer = "") {


        $(".watch_srces_btns").html("");
        $(".dl_srces_btns").html("");
        $(".loading_watch_srces").show();

        $.ajax({
            "type": "GET",
            "url": link,
            success: async function (watching_res) {
                $(".loading_watch_srces").hide();
                // watching_doc = new DOMParser().parseFromString(watching_res, "text/html");


                src_link = /hls:'(.*?)'},backupSrc/gm.exec(watching_res)[1];
                src_link_360p = src_link.replace("/0.m3u8", "/360p.m3u8");
                src_link_720p = src_link.replace("/0.m3u8", "/720p.m3u8");

                referer = what_window.extractDomainWithProtocol(link)


                $(`<span class="mou_btn watch_btn" onclick="play_vid(\`${src_link}\`,\`${film_data.title + " - جوده تلقائية"}\` , \`Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36\`, \`{'Referer':'${referer}'}\`,\`${film_data.title}\`)">جوده تلقائيه</span>`).appendTo(".watch_srces_btns");

                $(`<span class="mou_btn watch_btn" onclick="play_vid(\`${src_link_360p}\`,\`${film_data.title + " - 360p"}\` , \`Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36\`, \`{'Referer':'${referer}'}\`,\`${film_data.title}\`)"> 360p</span>`).appendTo(".watch_srces_btns");

                $(`<span class="mou_btn watch_btn" onclick="play_vid(\`${src_link_720p}\`,\`${film_data.title + " - 720p"}\` , \`Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36\`, \`{'Referer':'${referer}'}\`,\`${film_data.title}\`)">720p</span>`).appendTo(".watch_srces_btns");

                $(".dl_srces_btns").append(`<span class="mou_btn download_btn" onclick="add_for_downlaod(\`downloads/\`,\`${film_data.title + " - 360p"}\`, false, \`${src_link_360p}\`,\`video\`, \`{'Referer':'${referer}'}\`)">360p</span>`);
                $(".dl_srces_btns").append(`<span class="mou_btn download_btn" onclick="add_for_downlaod(\`downloads/\`,\`${film_data.title + " - 720p"}\`, false, \`${src_link_720p}\`,\`video\`, \`{'Referer':'${referer}'}\`)">720p</span>`);

            }
        });




    }
};

mou_aflam_servers_array["btolat"] = obj;
