obj = {
    "server_name": "mou_server",
    "server_title": "سيرفر 2",
    "server_domain": "http://192.168.1.2/admin19/",
    "working_state": false,
    "icon": `<i class="fas fa-tv"></i>`,
    "get_res": function (url = false, cat_load_type = "cats", from_action = "channels_page", callback) {
        if (url == false) {
            url = "api.php?action=cats";
        } else {
            if (cat_load_type == "cats") {
                url = "api.php?action=cats&parent=" + url;
            } else if (cat_load_type == "channels") {
                if (from_action !== "search") {
                    url = "api.php?action=channels&cat_id=" + url;
                }
            }
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
        // if (typeof window.channels_req !== "undefined") {
        //     channels_req.abort();
        // }

        $.ajax({
            type: "GET",
            url: now_channels_server.server_domain + url,
            // dataType: 'text',
            headers: {
                "Accept": "application/json",
                "User-Agent": "okhttp/4.12.0"
            },
            success: function (res, textStatus, jqXHR) {
                // key = "c!xZj+N9&G@Ev@vw" + jqXHR.getResponseHeader("t");
                // decrypted = JSON.parse(now_channels_server.Decrypt(res, key));
                decrypted = res;
                // if (typeof mouscripts !== "undefined") {
                //     decrypted = JSON.parse(convert_byte_to_string(mouscripts.decrypt_yacine(res, key)));
                // } else if (typeof what_window.electron !== "undefined") {
                //     decrypted = what_window.electron.decryptYacine(res, key);
                //     decrypted = JSON.parse(decrypted);
                // }

                for (i = 0; i < decrypted.data.length; i++) {
                    this_cat = decrypted.data[i];
                    cat = {};
                    cat["name"] = this_cat.name;

                    if (typeof this_cat["child_count"] !== "undefined" && parseInt(this_cat["child_count"]) > 0) {
                        cat["load_type"] = "cats";
                    } else {
                        cat["load_type"] = "channels";

                    }
                    cat["url"] = this_cat.id;
                    ret["cats"].push(cat);
                }
                callback(ret);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Inline error handling
                console.error('Error occurred:', textStatus, errorThrown);
            }
        });

    }, "get_channels": function (url, callback) {
        let ret = {};
        ret["server_name"] = this.server_name;
        ret["type"] = "channels";
        ret["channels"] = [];
        $.ajax({
            type: "GET",
            url: now_channels_server.server_domain + url,
            // dataType: 'text',
            headers: {
                "Accept": "application/json",
                "User-Agent": "okhttp/4.12.0"
            },
            success: function (res, textStatus, jqXHR) {
                // key = "c!xZj+N9&G@Ev@vw" + jqXHR.getResponseHeader("t");

                // decrypted = JSON.parse(now_channels_server.Decrypt(res, key));
                decrypted = res;

                // if (typeof mouscripts !== "undefined") {
                //     decrypted = JSON.parse(convert_byte_to_string(mouscripts.decrypt_yacine(res, key)));
                // } else if (typeof what_window.electron !== "undefined") {
                //     decrypted = what_window.electron.decryptYacine(res, key);
                //     decrypted = JSON.parse(decrypted);
                // }

                for (i = 0; i < decrypted.data.length; i++) {
                    this_channel = decrypted.data[i];
                    channel = {};
                    channel["id"] = this_channel["id"];
                    channel["name"] = this_channel["name"];
                    channel["url"] = this_channel["id"];
                    channel["logo"] = this_channel["logo"];;
                    ret["channels"].push(channel);
                }
                callback(ret);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Inline error handling
                console.error('Error occurred:', textStatus, errorThrown);
            }
        });
    },
    "get_channel_srcs": function (ch_name, ch_id = false, callback) {
        let ret = {};
        ret["server_name"] = this.server_name;
        ret["type"] = "srcs";
        ret["srcs"] = [];

        $.ajax({
            type: "GET",
            url: now_channels_server.server_domain + "api.php?action=channel&ch_id=" + ch_id,
            // dataType: 'text',
            headers: {
                "Accept": "application/json",
                "User-Agent": "okhttp/4.12.0"
            },
            success: function (res, textStatus, jqXHR) {
                // key = "c!xZj+N9&G@Ev@vw" + jqXHR.getResponseHeader("t");
                // decrypted = JSON.parse(now_channels_server.Decrypt(res, key));
                decrypted = res;
                // if (typeof mouscripts !== "undefined") {
                //     decrypted = JSON.parse(convert_byte_to_string(mouscripts.decrypt_yacine(res, key)));
                // } else if (typeof what_window.electron !== "undefined") {
                //     decrypted = what_window.electron.decryptYacine(res, key);
                //     decrypted = JSON.parse(decrypted);
                // }


                sources = JSON.parse(decrypted.data.sources);
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


                callback(ret);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Inline error handling
                console.error('Error occurred:', textStatus, errorThrown);
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
            if (/beIN SPORTS (.*) HD/gm.test(search_key)) {
                search_key = "beIN SPORTS " + /beIN SPORTS (.*) HD/gm.exec(search_key)[1];
            } else {
                search_map = {
                    "ON Time Sports 1": ["On Time Sport HD"],
                    "ON Time Sports 2": ["On Time Sport HD 2"],
                    "beIN Max 1": ["beIN Sports HD 1 Max"],
                    "beIN Max 2": ["beIN Sports HD 2 Max"],
                    "beIN Max 3": ["beIN Sports HD 3 Max"],
                    "beIN Max 4": ["beIN Sports HD 4 Max"],
                    "beIN SPORTS 1": ["beIN Sports 1HD"],
                    "mbc masr 2": ["MBC مصر 2"],
                    "MBC Maser": ["MBC Masr"],
                    "ssc 1": ["SSC Sport 1"],
                    "ssc 2": ["SSC Sport 2"],
                    "ssc 3": ["SSC Sport 3"],
                    "ssc 4": ["SSC Sport 4"],
                    "ssc 5": ["SSC Sport 5"],
                    "SSC Extra 1": ["SSC Sport Extra 1"],
                    "SSC Extra 2": ["SSC Sport Extra 2"],
                }
                for (i = 0; i < Object.keys(search_map).length; i++) {
                    now_search_key = Object.keys(search_map)[i];
                    now_search_keys = search_map[now_search_key];
                    if (now_search_keys.includes(search_key)) {
                        search_key = now_search_key;
                        break;
                    }
                }

            }
        }
        search_url = `/api/search?query=` + encodeURIComponent(search_key);
        return search_url;
        // now_channels_server.get_channels(search_url, function (ret) {
        //     callback(ret);
        // });

    }, Decrypt: function (encrypted, key = '') {
        // Decode the encrypted string from Base64
        encrypted = atob(encrypted);

        let result = '';
        for (let i = 0; i < encrypted.length; i++) {
            // XOR each character with the corresponding character in the key
            result += String.fromCharCode(
                encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length)
            );
        }

        return result;
    }
};
mou_channels_servers["mou_server"] = obj;