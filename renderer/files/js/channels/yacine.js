obj = {
    "server_name": "yacin",
    "server_title": "سيرفر 1",
    "server_domain": "http://a2.apk-api.com",
    "working_state": true,
    "icon": `<i class="fas fa-tv"></i>`,
    "get_res": function (url = false, cat_load_type = "cats", from_action = "channels_page", callback) {
        const self = this; // تعريف self
        if (url == false) {
            url = "/api/categories";
        } else {
            if (cat_load_type == "cats") {
                url = "/api/categories/" + url;
            } else if (cat_load_type == "channels") {
                if (from_action !== "search") {
                    url = "/api/categories/" + url + "/channels";
                }
            }
        }
        if (typeof window.channels_req !== "undefined") {
            channels_req.abort();
        }
        if (cat_load_type == "cats") {
            self.get_cats(url, function (ret) { // تعديل ليعتمد على self
                callback(ret);
            });

        } else if (cat_load_type == "channels") {
            self.get_channels(url, function (ret) { // تعديل ليعتمد على self
                callback(ret);
            });
        }
    },
    "get_cats": function (url, callback) {
        const self = this; // تعريف self
        let ret = {};
        ret["server_name"] = self.server_name;
        ret["type"] = "cats";
        ret["cats"] = [];
        // if (typeof window.channels_req !== "undefined") {
        //     channels_req.abort();
        // }

        $.ajax({
            type: "GET",
            url: self.server_domain + url, // تعديل ليعتمد على self
            dataType: 'text',
            headers: {
                "Accept": "application/json",
                "User-Agent": "okhttp/4.12.0"
            },
            success: function (res, textStatus, jqXHR) {
                key = "c!xZj+N9&G@Ev@vw" + jqXHR.getResponseHeader("t");
                decrypted = JSON.parse(self.Decrypt(res, key)); // تعديل ليعتمد على self
                console.log(decrypted);
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
        const self = this; // تعريف self
        let ret = {};
        ret["server_name"] = self.server_name;
        ret["type"] = "channels";
        ret["channels"] = [];
        $.ajax({
            type: "GET",
            url: self.server_domain + url, // تعديل ليعتمد على self
            dataType: 'text',
            headers: {
                "Accept": "application/json",
                "User-Agent": "okhttp/4.12.0"
            },
            success: function (res, textStatus, jqXHR) {
                key = "c!xZj+N9&G@Ev@vw" + jqXHR.getResponseHeader("t");

                decrypted = JSON.parse(self.Decrypt(res, key)); // تعديل ليعتمد على self
                console.log(decrypted);

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
        const self = this; // تعريف self
        let ret = {};
        ret["server_name"] = self.server_name;
        ret["type"] = "srcs";
        ret["srcs"] = [];

        $.ajax({
            type: "GET",
            url: self.server_domain + "/api/channel/" + ch_id, // تعديل ليعتمد على self
            dataType: 'text',
            headers: {
                "Accept": "application/json",
                "User-Agent": "okhttp/4.12.0"
            },
            success: function (res, textStatus, jqXHR) {
                key = "c!xZj+N9&G@Ev@vw" + jqXHR.getResponseHeader("t");
                decrypted = JSON.parse(self.Decrypt(res, key)); // تعديل ليعتمد على self
                console.log(decrypted);

                // if (typeof mouscripts !== "undefined") {
                //     decrypted = JSON.parse(convert_byte_to_string(mouscripts.decrypt_yacine(res, key)));
                // } else if (typeof what_window.electron !== "undefined") {
                //     decrypted = what_window.electron.decryptYacine(res, key);
                //     decrypted = JSON.parse(decrypted);
                // }


                for (i = 0; i < decrypted.data.length; i++) {
                    this_src = decrypted.data[i];
                    src = {};
                    src["name"] = this_src["name"];
                    src["data"] = {};
                    // src["data"]["name"] = ch_name + " - " + src["name"];
                    src["data"]["name"] = ch_name;
                    src["data"]["url"] = this_src["url"];
                    src["data"]["headers"] = mou_custom_encode(JSON.stringify(this_src["headers"]));
                    if (typeof this_src["drm"] !== "undefined" && this_src["drm"] !== null) {

                        src["data"]["drm"] = convertJWKToKidKeyFormat(JSON.parse(this_src["drm"]["license"]));


                    }
                    ret["srcs"].push(src);
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

        source_name = data["name"];
        // source_name = "";
        source_link = data["url"];
        source_headers = JSON.parse(mou_custom_decode(data["headers"]));
        user_agent = typeof source_headers["User-Agent"] !== "undefined" ? source_headers["User-Agent"] : "";
        // what_window.settings_vars.watching_apk
        if (typeof data["drm"] !== "undefined") {
            source_drm = data["drm"];
            play_vid(source_link, source_name, user_agent, JSON.stringify(source_headers), "", false, "Elbatal", false, "", "", "clearkey", source_drm, "localWebPlayer")
        } else {
         
            play_vid(source_link, source_name, user_agent, JSON.stringify(source_headers));

        }


        callback();

    }, search_url: function (search_key, from_where = "search") {
        let final_search_key = search_key;

        if (from_where == "table") {
            const search_map = {
                "ON Time Sports 1": ["On Time Sport HD"],
                "ON Time Sports 2": ["On Time Sport HD 2"],
                "beIN MAX 1": ["beIN SPORTS MAX 1 HD"],
                "beIN MAX 2": ["beIN SPORTS MAX 2 HD"],
                "beIN MAX 3": ["beIN SPORTS MAX 3 HD"],
                "beIN MAX 4": ["beIN SPORTS MAX 4 HD"],
                "beIN SPORTS 1": ["beIN Sports 1", "beIN Sports 1 HD"],
                "beIN SPORTS 2": ["beIN SPORTS 2", "beIN SPORTS 2 HD"],
                "mbc masr 2": ["MBC مصر 2"],
                "MBC Maser": ["MBC Masr"],
                "ssc 1": ["SSC Sport 1"],
                "ssc 2": ["SSC Sport 2"],
                "ssc 3": ["SSC Sport 3"],
                "ssc 4": ["SSC Sport 4"],
                "ssc 5": ["SSC Sport 5"],
                "SSC Extra 1": ["SSC Sport Extra 1"],
                "SSC Extra 2": ["SSC Sport Extra 2"],
            };

            // البحث عن المفتاح الذي يحتوي على القيمة المطلوبة
            const found_key = Object.keys(search_map).find(key =>
                search_map[key].some(val => val.toLowerCase() === search_key.toLowerCase())
            );

            if (found_key) {
                final_search_key = found_key;
                console.log("Matched Key:", final_search_key);
            }
        }

        const search_url = `/api/search?query=` + encodeURIComponent(final_search_key);
        return search_url;
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
mou_channels_servers["yacin"] = obj;