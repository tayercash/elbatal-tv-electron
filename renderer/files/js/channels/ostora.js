obj = {
    "server_name": "ostora",
    "server_title": "سيرفر 2",
    "server_domain": async function () {
        if (this.temp_server_domain) {
            return this.temp_server_domain;
        }
        const self = this; // مرجع للأوبجكت الحالي
        const seed = "lmWqTW6yPAoclJQWaBxA8w==";
        const hostname = self.decryptData(seed);

        try {
            // ننتظر نتيجة طلب DNS
            const dnsRes = await $.ajax({
                url: `https://dns.google/resolve?name=${hostname}&type=txt`,
                method: 'GET'
            });

            if (!dnsRes.Answer) throw new Error("DNS record not found");

            const encryptedConfig = dnsRes.Answer[0].data.replace(/"/g, '').trim();
            const configText = self.decryptData(encryptedConfig);
            const config = JSON.parse(configText);
            self.server_user_agent = atob(config.ua);
            self.temp_server_domain = "https://" + atob(config.x0);
            return self.temp_server_domain;

        } catch (error) {
            console.error("Error in get_domain:", error);
            throw error;
        }
    },
    "server_user_agent": null,
    "working_state": true,
    "icon": `<i class="fas fa-tv"></i>`,
    "get_res": function (url = false, cat_load_type = "cats", from_action = "channels_page", callback) {
        const self = this;
        if (url == false) {
            url = "/api/v6.2/main?page=1";
        } else {
            if (from_action == "search") {

                url = "/api/search?query=" + encodeURIComponent(url);
                cat_load_type = "channels";
            } else if (cat_load_type == "cats") {
                url = `/api/v6.2/category/${url}?page=1`;
            } else if (cat_load_type == "channels") {
                if (from_action == "channels_page") {
                    url = `/api/v6.2/category/${url}?page=1`;
                }
            }
        }

        // if (typeof window.channels_req !== "undefined") {
        //     channels_req.abort();
        // }
        if (cat_load_type == "cats") {
            self.get_cats(url, function (ret) {
                callback(ret);
            });

        } else if (cat_load_type == "channels") {
            self.get_channels(url, function (ret) {
                console.log(ret);
                callback(ret);
            });
        }
    },
    "get_cats": async function (url, callback) {
        const self = this;
        let ret = {};
        ret["server_name"] = self.server_name;

        let n_url = await self.server_domain() + url;
        console.log(`[*] Requesting: ${n_url}`);
        $.ajax({
            type: "GET",
            url: n_url,
            success: function (res, textStatus, jqXHR) {
                decrypted = self.decryptData(res);
                try {
                    decrypted = JSON.parse(decrypted);
                } catch (e) {
                    console.error("البيانات المفكوكة ليست JSON صالح");
                }
                console.log(decrypted);
                // تأكد من تعريف ret قبل الحلقة إذا لم تكن معرفة مسبقاً

                if (decrypted.data.type) {
                    if (decrypted.data.type == "category") {
                        ret["type"] = "cats";
                        ret["cats"] = [];

                        for (var i = 0; i < decrypted.data.items.length; i++) {
                            var this_cat = decrypted.data.items[i];
                            var cat = {};

                            cat["name"] = this_cat.name;
                            cat["url"] = this_cat.id;
                            cat["image"] = this_cat.image; // إضافة الصورة إذا كنت تحتاجها
                            cat["load_type"] = "cats";

                            ret["cats"].push(cat);
                        }
                    } else if (decrypted.data.type == "streams") {
                        ret["type"] = "channels";
                        ret["channels"] = [];

                        self.temp_channels_items = decrypted.data.items;

                        for (var i = 0; i < decrypted.data.items.length; i++) {
                            var this_channel = decrypted.data.items[i];
                            var channel = {};

                            // تعبئة البيانات الأساسية
                            channel["id"] = this_channel["id"];
                            channel["name"] = this_channel["name"];
                            channel["url"] = this_channel["id"];

                            // في الداتا الجديدة المفتاح هو image وليس logo
                            channel["logo"] = this_channel["image"];

                            // إضافة نوع التحميل بناءً على adp إذا كنت تستخدمه في القنوات أيضاً
                            // عادة adp: "1" تعني قناة بث مباشر
                            channel["adp"] = this_channel["adp"];


                            ret["channels"].push(channel);
                        }


                    }
                } else {

                    ret["type"] = "cats";
                    ret["cats"] = [];

                    for (var i = 0; i < decrypted.data.length; i++) {
                        var this_cat = decrypted.data[i];
                        var cat = {};

                        cat["name"] = this_cat.name;
                        cat["url"] = this_cat.id;
                        cat["image"] = this_cat.image; // إضافة الصورة إذا كنت تحتاجها
                        cat["load_type"] = "cats";

                        ret["cats"].push(cat);
                    }

                }

                callback(ret);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Inline error handling
                console.error('Error occurred:', textStatus, errorThrown);
            }
        });

    }, "get_channels": async function (url, callback) {
        const self = this;
        let ret = {};
        ret["server_name"] = self.server_name;
        ret["type"] = "channels";
        ret["channels"] = [];

        // --- التعديل الجديد: التحقق من وجود استعلام بحث في الرابط ---
        if (url.includes("query=")) {
            console.log("هذا رابط بحث، سيتم جلب البيانات يدوياً إذا كانت متوفرة");

            // 1. استخراج الكلمة المبحوث عنها
            var urlParams = new URLSearchParams(url.split('?')[1]);
            var searchQuery = urlParams.get('query');

            if (searchQuery && searchQuery.includes("query=")) {
                searchQuery = new URLSearchParams(searchQuery.split('?')[1]).get('query');
            }

            if (searchQuery && self.search_dic_items && self.search_dic_items.length > 0) {
                searchQuery = searchQuery.toLowerCase().trim();

                // نبحث عن العنصر المطابق أولاً
                var matchedItem = self.search_dic_items.find(function (item) {
                    return item.keys.some(function (key) {
                        return key.toLowerCase() === searchQuery;
                    });
                });

                if (matchedItem) {

                    // 2. استخدام get_res لجلب داتا القنوات الفعليّة
                    // لاحظ أننا نمرر "channels" كنوع تحميل إذا كنت تريد قائمة القنوات داخل هذا القسم
                    // استخدم self بدلاً من this
                    self.get_res(matchedItem["chs_id"], "channels", "channels_page", function (res) {
                        if (res && res.channels) {
                            // فلترة النتائج لجلب القناة التي يتطابق اسمها مع server_ch_name
                            var filteredChannel = res.channels.find(function (ch) {
                                return ch.name === matchedItem.server_ch_name;
                            });

                            if (filteredChannel) {
                                // نضع القناة المفلترة في مصفوفة لأن الـ UI يتوقع مصفوفة
                                ret["channels"] = [filteredChannel];
                                console.log("تم العثور على القناة المطلوبة:", filteredChannel);
                            } else {
                                // إذا لم يجد الاسم المطابق، يمكنك إما إرجاع كل القنوات أو مصفوفة فارغة
                                console.log("لم يتم العثور على اسم مطابق لـ " + matchedItem.server_ch_name);
                                ret["channels"] = [];
                            }

                            callback(ret);
                        } else {
                            console.log("القسم لا يحتوي على قنوات.");
                            callback(ret);
                        }
                    });

                    return; // نوقف تنفيذ الدالة هنا لأن الـ callback سيتم استدعاؤه داخل get_res
                }
            }
            console.log("لم يتم العثور على تطابق في القاموس، سيتم الانتقال لطلب السيرفر...");
        } else {


            let n_url = await self.server_domain() + url;
            $.ajax({
                type: "GET",
                url: n_url,
                success: function (res, textStatus, jqXHR) {
                    decrypted = self.decryptData(res);
                    try {
                        decrypted = JSON.parse(decrypted);
                    } catch (e) {
                        console.error("البيانات المفكوكة ليست JSON صالح");
                    }
                    console.log(decrypted);
                    console.log(decrypted.data.items);

                    self.temp_channels_items = decrypted.data.items;

                    for (var i = 0; i < decrypted.data.items.length; i++) {
                        var this_channel = decrypted.data.items[i];
                        var channel = {};

                        // تعبئة البيانات الأساسية
                        channel["id"] = this_channel["id"];
                        channel["name"] = this_channel["name"];
                        channel["url"] = this_channel["id"];

                        // في الداتا الجديدة المفتاح هو image وليس logo
                        channel["logo"] = this_channel["image"];

                        // إضافة نوع التحميل بناءً على adp إذا كنت تستخدمه في القنوات أيضاً
                        // عادة adp: "1" تعني قناة بث مباشر
                        channel["adp"] = this_channel["adp"];

                        console.log(channel);

                        ret["channels"].push(channel);
                    }

                    callback(ret);

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    // Inline error handling
                    console.error('Error occurred:', textStatus, errorThrown);
                }
            });
        }        // -------------------------------------------------------

    },
    "get_channel_srcs": function (ch_name, ch_id = false, callback) {
        const self = this;
        let ret = {};
        ret["server_name"] = self.server_name;
        ret["type"] = "srcs";
        ret["srcs"] = [];

        const this_src = self.temp_channels_items.find(item => item.id === ch_id);


        var src = {};
        var raw_source = this_src["source"]; // الرابط الكامل الذي يحتوي على الرموز

        src["name"] = this_src["name"];
        src["data"] = {};
        src["data"]["name"] = ch_name;

        // 1. منطق فصل الرابط عن مفاتيح التشفير
        if (raw_source.includes("###")) {
            var parts = raw_source.split("###");
            src["data"]["url"] = parts[0];
            var drm_key = parts[1];
            src["data"]["drm"] = drm_key;
        } else {
            src["data"]["url"] = raw_source;
            src["data"]["drm"] = null;
        }

        if (this_src["type"] == "live") {
            src["data"]["ReqBefLoad"] = true;
        }

        // 3. بناء الـ Headers وتضمين الـ User-Agent
        var custom_headers = {
            "User-Agent": this_src["agent"]
        };
        src["data"]["headers"] = mou_custom_encode(JSON.stringify(custom_headers));

        // 4. التأكد من النوع (MimeType)
        // بما أن الرابط ينتهي بـ .mpd، الكود الأصلي لديك سيتعرف عليه كـ application/dash+xml
        ret["srcs"].push(src);


        callback(ret);



    }, "play_src": async function (data, callback) {

        data = JSON.parse(mou_custom_decode(data));

        source_name = data["name"];
        // source_name = "";
        source_link = data["url"];
        source_headers = JSON.parse(mou_custom_decode(data["headers"]));
        user_agent = typeof source_headers["User-Agent"] !== "undefined" ? source_headers["User-Agent"] : "";
        console.log("data", data)

        if (data["ReqBefLoad"]) {
            $.ajax({
                url: source_link,
                method: 'GET',
                headers: source_headers,
            })
        }

        // what_window.settings_vars.watching_apk
        if (typeof data["drm"] !== "undefined" && data["drm"] !== null && data["drm"] !== "") {
            source_drm = data["drm"];
            play_vid(source_link, source_name, user_agent, JSON.stringify(source_headers), "", false, "Elbatal", false, "", "", "clearkey", source_drm, "localWebPlayer")
        } else {


            play_vid(source_link, source_name, user_agent, JSON.stringify(source_headers), "", false, "Elbatal", true);

        }


        callback();

    }, search_url: function (search_key, from_where = "search") {
        if (from_where == "table") {
            // if (/beIN SPORTS (.*) HD/gm.test(search_key)) {
            //     search_key = "beIN SPORTS " + /beIN SPORTS (.*) HD/gm.exec(search_key)[1];
            // } else {
            search_map = {
                "ON Time Sports 1": ["On Time Sport HD"],
                "ON Time Sports 2": ["On Time Sport HD 2"],
                "beIN MAX 1": ["beIN SPORTS MAX 1 HD"],
                "beIN MAX 2": ["beIN SPORTS MAX 2 HD"],
                "beIN MAX 3": ["beIN SPORTS MAX 3 HD"],
                "beIN MAX 4": ["beIN SPORTS MAX 4 HD"],
                "beIN SPORTS 1": ["beIN Sports 1 HD"],
                "beIN SPORTS 2": ["beIN SPORTS 2 HD"],
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
                    console.log(search_key);
                    break;
                }
            }

            // }
        }
        search_url = `/api/search?query=` + encodeURIComponent(search_key);
        return search_url;
        // now_channels_server.get_channels(search_url, function (ret) {
        //     callback(ret);
        // });

    }, decryptData: function (inputData) {
        try {
            const key = CryptoJS.enc.Hex.parse("4e5c6d1a8b3fe8137a3b9df26a9c4de195267b8e6f6c0b4e1c3ae1d27f2b4e6f");
            const iv = CryptoJS.enc.Hex.parse("a9c21f8d7e6b4a9db12e4f9d5c1a7b8e");
            let base64 = inputData.replace(/-/g, '+').replace(/_/g, '/');

            const decrypted = CryptoJS.AES.decrypt(base64, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

            const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

            try {
                const binaryString = atob(decryptedText);
                const charData = binaryString.split('').map(x => x.charCodeAt(0));
                const binData = new Uint8Array(charData);
                const data = pako.inflate(binData);
                return new TextDecoder("utf-8").decode(data);
            } catch (e) {
                return decryptedText;
            }
        } catch (error) {
            return null;
        }
    },
    search_dic_items: [
        { chs_id: 1070, server_ch_name: "بي ان سبورت 2", keys: ["beIN SPORTS 2", "beIN SPORTS 2 HD"] },
        { chs_id: 1070, server_ch_name: "بي ان سبورت 1", keys: ["beIN SPORTS 1", "beIN SPORTS 1 HD"] },
    ]
};
mou_channels_servers["ostora"] = obj;