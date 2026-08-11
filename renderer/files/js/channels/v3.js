obj = {
    "server_name": "v3",
    "server_title": "سيرفر 2",
    "server_domain": "https://www.blogger.com/feeds/4509831944672887969/",
    "working_state": false,
    "icon": `<i class="fas fa-tv"></i>`,
    "get_res": function (url = false, cat_load_type = false, from_action = "channels_page", callback) {
        if (url == false) {
            url = "posts/summary?" + encodeQueryData({
                "alt": "json",
                "max-results": "0"
            });
        }
        if (typeof window.channels_req !== "undefined") {
            channels_req.abort();
        }
        if (cat_load_type == "cats") {
            now_channels_server.get_cats(url, function (ret) {
                callback(ret);
            });

        } else if (cat_load_type == "channels") {
            now_channels_server.get_channels(url, function (ret) {
                callback(ret);
            });
        }
    },
    "get_cats": function (url, callback) {
        let ret = {};
        ret["server_name"] = this.server_name;
        ret["type"] = "cats";
        ret["cats"] = [];
        if (typeof window.channels_req !== "undefined") {
            channels_req.abort();
        }
        window.channels_req = $.ajax({
            type: "GET",
            url: now_channels_server.server_domain + url,
            success: function (blog_json) {

                if (blog_json.feed.category) {
                    for (i = 0; i < blog_json.feed.category.length; i++) {
                        if (blog_json.feed.category[i].term !== "mou_player") {
                            cat_name = blog_json.feed.category[i].term;
                            cat = {};
                            cat["name"] = cat_name;
                            cat["load_type"] = "channels";
                            cat["url"] = "posts/summary/-/" + cat_name + "?" + encodeQueryData({
                                "alt": "json",
                                "max-results": 500
                            });
                            ret["cats"].push(cat);
                        }
                    }
                }
                callback(ret);
            }
        });

    }, "get_channels": function (url, callback) {
        let ret = {};
        ret["server_name"] = this.server_name;
        ret["type"] = "channels";
        ret["channels"] = [];
        if (typeof window.channels_req !== "undefined") {
            channels_req.abort();
        }
        window.channels_req = $.ajax({
            type: "GET",
            url: now_channels_server.server_domain + url,
            success: function (blog_json) {
                if (blog_json.feed.entry && blog_json.feed.entry.length > 0) {
                    for (i = 0; i < blog_json.feed.entry.length; i++) {
                        channel = {};
                        channel["id"] = /post-(.*)/gm.exec(blog_json.feed.entry[i].id.$t)[1];
                        channel["name"] = blog_json.feed.entry[i].title["$t"];
                        channel["url"] = channel["id"];
                        channel["logo"] = resize_blogger_img(blog_json.feed.entry[i].media$thumbnail["url"]);
                        ret["channels"].push(channel);

                    }
                }
                callback(ret);
            }
        })
    },
    "get_channel_srcs": function (ch_name, ch_id = false, callback) {
        let ret = {};
        ret["server_name"] = this.server_name;
        ret["type"] = "srcs";
        ret["srcs"] = [];

        if (typeof window.channels_req !== "undefined") {
            channels_req.abort();
        }

        if (ch_id !== false) {
            get_url = now_channels_server.server_domain + `posts/default/${ch_id}?alt=json`;
        } else {
            get_url = now_channels_server.server_domain + `posts/default?q="${ch_name_search_key}"&alt=json&orderby=published&start-index=1&max-results=9999`;
        }

        $.ajax({
            "type": "GET",
            "url": get_url,
            success: function (res) {
                blogger_res = res;

                if (typeof blogger_res.feed !== "undefined" && typeof blogger_res.feed.entry !== "undefined" && blogger_res.feed.entry.length > 0) {
                    for (i = 0; i < blogger_res.feed.entry.length; i++) {
                        post_contnet = blogger_res.feed.entry[i].content["$t"];
                        player_json = $("<div>" + post_contnet + "</div>").find("player_json");
                        if (typeof user_data !== "undefined") {
                            if (user_data.role !== null && user_data.role.includes("2")) {
                                // ch_id = blogger_res.feed.entry.id["$t"];
                                entry_id = blogger_res.feed.entry[i].id["$t"];
                                if (/\.post-(.*)/gm.test(entry_id)) {
                                    ch_id = /\.post-(.*)/gm.exec(entry_id)[1];
                                    $(".edit_channel_btn").attr("data-edit_ch_id", ch_id).show();
                                }
                            }
                        }
                        for (l = 0; l < blogger_res.feed.entry[i].link.length; l++) {
                            if (blogger_res.feed.entry[i].link[l].rel == "alternate") {
                                player_page_url = blogger_res.feed.entry[i].link[l].href;
                                break;
                            }
                        }
                    }
                } else if (blogger_res.entry !== "undefined") {
                    if (typeof user_data !== "undefined") {
                        if (user_data.role !== null && user_data.role.includes("2")) {
                            entry_id = blogger_res.entry.id["$t"];
                            ch_id = /\.post-(.*)/gm.exec(entry_id)[1];
                            $(".edit_channel_btn").attr("data-edit_ch_id", ch_id).show();
                        }
                    }
                    post_contnet = blogger_res.entry.content["$t"];
                    player_json = $("<div>" + post_contnet + "</div>").find("player_json");
                } else {
                    player_json = false;
                }
                if (player_json !== false) {
                    sources = JSON.parse(mou_custom_decode(player_json.html()))["sources"];
                    filterd_sources = sources.filter(function (element) {
                        return element.working;
                    });
                    if (filterd_sources.length > 0) {
                        for (s = 0; s < filterd_sources.length; s++) {
                            source = filterd_sources[s];
                            source_name = source.name == "" ? "مصدر " + (s + 1) : source.name;
                            src = {};

                            src["name"] = source_name;
                            src["data"] = {};
                            src["data"]["name"] = ch_name + " - " + src["name"];
                            src["data"]["encoded_json"] = mou_custom_encode(JSON.stringify(source));
                            ret["srcs"].push(src);
                        }
                    }
                }

                callback(ret);
            }
        });

    }, "play_src": async function (data, callback) {

        data = JSON.parse(mou_custom_decode(data));
        source_name = data.name;

        source = JSON.parse(mou_custom_decode(data.encoded_json));
        source_link = source.link;

        sourc_type = source.type;
        vid_headers = {};
        user_agent = "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36";

        if (typeof source.file_gets_data !== "undefined" && source.file_gets_data.length > 0) {

            for (a = 0; a < source.file_gets_data.length; a++) {
                source_action = source.file_gets_data[a];

                if ((typeof source_action.regex !== "undefined" && source_action.regex !== "") || (typeof source_action.function !== "undefined" && source_action.function !== "")) {

                    action_headers = typeof source_action.custom_headers !== "undefined" ? source_action.custom_headers : {};
                    if (typeof source_action.type_of_select !== "undefined" && source_action.type_of_select == "regex") {

                        regex = mou_custom_decode(source_action.regex);
                        re_matches = /\/(.*)\/(.*)/g.exec(regex);
                        re_string = re_matches[1];
                        re_letters = re_matches[2];
                        re = new RegExp(re_string, re_letters);
                        await new Promise((resolve, reject) => {
                            // $.MouAjax({
                            //     url: source_link,
                            //     headers: action_headers,
                            //     success: function (res) {
                            //         source_link = re.exec(res)[1];
                            //         resolve();
                            //     }
                            // })

                            $.ajax({
                                type: "GET",
                                url: source_link,
                                headers: action_headers,
                                success: function (res, textStatus, jqXHR) {
                                    source_link = re.exec(res)[1];
                                    resolve();
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    // Inline error handling
                                    console.error('Error occurred:', textStatus, errorThrown);
                                }
                            });

                        })

                    } else if (typeof source_action.type_of_select !== "undefined" && source_action.type_of_select == "function") {
                        await new Promise((resolve, reject) => {

                            if (source_link == "function") {
                                var this_function_text = mou_custom_decode(source_action.function);
                                new_function_name = "mou_func_" + Date.now();
                                script = $(`<script data-id='${new_function_name}'>`);
                                $(script).text(`function ${new_function_name} (callback){${this_function_text}}`);
                                $("body").append(script);

                                window[new_function_name](function (ret_url) {
                                    source_link = ret_url;
                                    $(`script[data-id='${new_function_name}']`).remove();
                                    resolve();
                                });
                            } else {
                                // $.MouAjax({
                                //     url: source_link,
                                //     headers: action_headers,
                                //     success: function (res) {
                                //         var this_function_text = mou_custom_decode(source_action.function);

                                //         new_function_name = "mou_func_" + Date.now();
                                //         script = $(`<script data-id='${new_function_name}'>`);
                                //         $(script).text(`function ${new_function_name} (page_res){${this_function_text}}`);
                                //         $("body").append(script);
                                //         source_link = window[new_function_name](res);
                                //         $(`script[data-id='${new_function_name}']`).remove();
                                //         resolve();
                                //     }
                                // })

                                $.ajax({
                                    type: "GET",
                                    url: source_link,
                                    headers: action_headers,
                                    success: function (res, textStatus, jqXHR) {
                                        var this_function_text = mou_custom_decode(source_action.function);

                                        new_function_name = "mou_func_" + Date.now();
                                        script = $(`<script data-id='${new_function_name}'>`);
                                        $(script).text(`function ${new_function_name} (page_res){${this_function_text}}`);
                                        $("body").append(script);
                                        source_link = window[new_function_name](res);
                                        $(`script[data-id='${new_function_name}']`).remove();
                                        resolve();
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        // Inline error handling
                                        console.error('Error occurred:', textStatus, errorThrown);
                                    }
                                });

                            }

                        })

                    }

                }
            }

            if (typeof source.file_gets_data[source.file_gets_data.length - 1] !== "undefined" && typeof source.file_gets_data[source.file_gets_data.length - 1].custom_headers !== "undefined") {
                vid_headers = source.file_gets_data[source.file_gets_data.length - 1].custom_headers;
            }

        }

        for (i = 0; i < Object.keys(vid_headers).length; i++) {
            if (["User-Agent", "user-agent", "useragent"].includes(Object.keys(vid_headers)[i])) {
                user_agent = vid_headers[Object.keys(vid_headers)[i]];
                delete vid_headers[Object.keys(vid_headers)[i]];
            }

        }

        if (source_link !== "") {
            play_vid(source_link, source_name, user_agent, JSON.stringify(vid_headers));
        }
        callback();

    }, search_url: function (search_key, from_where = "search") {
        if (from_where == "table") {
            search_key = search_key + "---" + search_key.length;
        }
        search_url = `posts/summary?q="${search_key}"&` + encodeQueryData({
            "alt": "json",
            "max-results": 500
        });
        return search_url;
        // now_channels_server.get_channels(search_url, function (ret) {
        //     callback(ret);
        // });

    }
};
mou_channels_servers["v3"] = obj;
