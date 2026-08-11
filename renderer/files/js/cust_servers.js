var cust_servers = {
    "vidmoly": {
        "names": ["Vidmoly"],
        "domains": ["vidmoly.to"],
        "status": true,
        "get_srcs": function (link, callback, headers = {}) {
            $.ajax({
                "type": "GET",
                "url": link,
                "headers": {
                    "User-Agent": what_window.Main_USER_AGENT
                },
                success: function (res) {
                    // doc = new DOMParser().parseFromString(res, "text/html");
                    var srces = [];
                    eval("web_sources = " + /sources: (\[.*])/gm.exec(res)[1]);
                    web_sources.forEach(web_source => {
                        src = {};
                        src["name"] = "Vidmoly";
                        src["url"] = web_source["file"];
                        src["headers"] = { "Referer": "https://vidmoly.to/" };
                        srces.push(src);
                    });
                    callback(srces);
                }
            });
        }
        , "has_multi_srcs": false
    }, "vidhidepre": {
        "status": true,
        "names": ["vidhidepre"],
        "domains": ["nikaplayer.com", "vidhidepre.com", "vidhidepro.com", "vidhide.fun"],
        "get_srcs": function (link, callback, headers = {}) {
            $.ajax({
                "type": "GET",
                "url": link,
                headers: headers,
                success: function (res) {
                    doc = new DOMParser().parseFromString(res, "text/html");

                    $(doc).find('script[type="text/javascript"]').each(function () {
                        script_text = $(this).text();
                        if (script_text.includes("eval")) {
                            unpaced = unPack(script_text).replace(/[\r\n\t]/g, '');

                            var srces = [];
                            hls_url = /"hls2":"(.*?)"/gm.exec(unpaced)[1];

                            src = {};
                            src["name"] = "vidhidepre";
                            src["url"] = hls_url;
                            src["headers"] = headers;
                            srces.push(src);

                            // web_sources.forEach(web_source => {
                            //     src = {};
                            //     src["name"] = "vidhidepre";
                            //     src["url"] = web_source["file"];
                            //     src["headers"] = headers;
                            //     srces.push(src);
                            // });
                            callback(srces);

                            return;
                        }
                    })


                }
            });

            // callback(link);

        }
        , "has_multi_srcs": false
    }, "Dood": {
        "status": true,
        "names": ["dood"],
        "domains": ["dood.li", "d0000d.com", "d0o0d.com", "dood.re", "dood.work", "dood.ws", "vide0.net"],
        "get_srcs": function (link, callback, headers = {}) {
            getFinalUrl(link, function (dood_link) {
                $.ajax({
                    "type": "GET",
                    "url": dood_link,
                    headers: headers,
                    success: function (res) {
                        // doc = new DOMParser().parseFromString(res, "text/html");
                        pass_md5_url = extractDomainWithProtocol(dood_link) + /\$\.get\('(\/pass_md5.*?)'/gm.exec(res)[1];
                        $.ajax({
                            "type": "GET",
                            "url": pass_md5_url,
                            "headers": {
                                Referer: dood_link,
                            },
                            success: function (md5_res) {
                                for (var a = "", t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", n = t.length, o = 0; 10 > o; o++) a += t.charAt(Math.floor(Math.random() * n));
                                Watch_url = md5_res + a + "?token=rfpmaqf72ul3miajmbttlafd&expiry=" + Date.now();

                                var srces = [];
                                src = {};
                                src["name"] = "DOOD";
                                src["url"] = Watch_url;
                                src["headers"] = { "Referer": extractDomainWithProtocol(link) };
                                srces.push(src);
                                callback(srces);

                            }
                        });

                    }
                });
            })
        }
        , "has_multi_srcs": false
    }, "VK": {
        "status": true,
        "names": ["Vk"],
        "domains": ["vk.com"],
        "get_srcs": function (link, callback, headers = {}) {
            $.ajax({
                "type": "GET",
                "url": link,
                headers: headers,
                success: function (res) {
                    // doc = new DOMParser().parseFromString(res, "text/html");
                    var srces = [];
                    var regexes = {
                        "متعدد": /"hls":"(.*?)"/gm,
                        "144p": /"url144":"(.*?)"/gm,
                        "240p": /"url240":"(.*?)"/gm,
                        "360p": /"url360":"(.*?)"/gm,
                        "480p": /"url480":"(.*?)"/gm,
                        "720p HD": /"url720":"(.*?)"/gm,
                        "1080p FHD": /"url1080":"(.*?)"/gm,
                    };

                    for (let r = 0; r < Object.keys(regexes).length; r++) {
                        let quality_name = Object.keys(regexes)[r];
                        let quality_regex = regexes[quality_name];
                        let match; // Initialize match variable

                        while ((match = quality_regex.exec(res)) !== null) {
                            let hls_url = decodeURIComponent(match[1]).replace(/\\\//g, "/");

                            let src = {
                                name: quality_name,
                                url: hls_url,
                                headers: { "User-Agent": Main_USER_AGENT }
                            };
                            srces.push(src);
                        }
                    }

                    callback(srces);

                }
            });
        }
        , "has_multi_srcs": false
    }, "OKRU": {
        "status": true,
        "names": ["OK"],
        "domains": ["ok.ru"],
        "get_srcs": function (link, callback, headers = {}) {
            link = link.startsWith("//") ? "https:" + link : link;
            $.ajax({
                "type": "GET",
                "url": link,
                headers: headers,
                success: function (res) {
                    // doc = new DOMParser().parseFromString(res, "text/html");
                    var srces = [];
                    if (/hlsManifestUrl\\&quot;:\\&quot;(.*?)\\&quot;/gm.test(res)) {
                        hls_url = decodeURIComponent(/hlsManifestUrl\\&quot;:\\&quot;(.*?)\\&quot;/gm.exec(res)[1]).replace(/\\\\u0026/g, "&");
                        src = {};
                        src["name"] = "VK";
                        src["url"] = hls_url;
                        src["headers"] = { "User-Agent": Main_USER_AGENT };
                        srces.push(src);
                    }
                    callback(srces);
                }
            });
        }
        , "has_multi_srcs": false
    },
    "Streamtape": {
        "status": true,
        "names": ["streamtape"],
        "domains": ["streamtape.com"],
        "get_srcs": function (streamtape_link, callback, headers = {}) {
            if (streamtape_link.includes("streamtape.com")) {
                streamtape_link = streamtape_link.replace("streamtape.com", "stape.fun");
            }
            if (streamtape_link.includes("/v/")) {
                streamtape_link = streamtape_link.replace("/v/", "/e/");
            }
            vid_id = streamtape_link.split("/")[4];
            $.ajax({
                "type": "GET",
                "url": streamtape_link,
                "headers": {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",
                    "authority": "stape.fun",
                    "Referer": "https://streamtape.com/",
                    "path": "/e/" + vid_id
                },
                success: function (res) {
                    doc = new DOMParser().parseFromString(res, "text/html");
                    var srces = [];
                    tokens = /&token=([^\s]*)\'\)/.exec(res);
                    token = tokens[tokens.length - 1];
                    strRobotLink = $(doc).find("#robotlink").text();
                    match = strRobotLink.match(/stape\.fun\/(.+)/);
                    if (match) {
                        strRobotLink = match[1];
                    }
                    strRobotLink = strRobotLink.substring(0, strRobotLink.lastIndexOf("="));
                    Stream_url = extractDomainWithProtocol(streamtape_link) + "/" + strRobotLink + "=" + token + "&stream=1";
                    src = {};
                    src["name"] = "Streamtape";
                    src["url"] = Stream_url;
                    src["headers"] = {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",
                        "Referer": "https://streamtape.com/",
                    };
                    srces.push(src);
                    callback(srces);
                }
            });

            // callback(link);

        }
        , "has_multi_srcs": false
    }, "VidTubePro": {
        "names": ["vidtubepro"],
        "domains": ["vidtube.pro"],
        "status": true,
        "dl_status": false,
        "get_srcs": function (link, callback, headers = {}) {
            $.ajax({
                "type": "GET",
                "url": link,
                "headers": {
                    "User-Agent": what_window.Main_USER_AGENT
                },
                success: function (res) {
                    doc = new DOMParser().parseFromString(res, "text/html");
                    $(doc).find('script[type="text/javascript"]').each(function () {
                        script_text = $(this).text();
                        if (script_text.includes("eval")) {
                            unpaced = unPack(script_text).replace(/[\r\n\t]/g, '');


                            var srces = [];
                            eval("web_sources = " + /sources:(\[.*\]),image/gm.exec(unpaced)[1]);
                            web_sources.forEach(web_source => {
                                src = {};
                                src["name"] = web_source["label"];
                                src["url"] = web_source["file"];
                                src["headers"] = { "Referer": "https://vidtube.pro/" };
                                srces.push(src);
                            });
                            callback(srces);

                        }
                    })
                }
            });
        }
        , "has_multi_srcs": false
    },
    "CimaNow": {
        "names": ["Cima Now"],
        "domains": [".cimanowtv.com"],
        "status": true,
        "dl_status": true,
        "get_srcs": function (link, callback, headers = {}) {
            $.ajax({
                "type": "GET",
                "url": link,
                "headers": {
                    "User-Agent": what_window.Main_USER_AGENT,
                    "Referer": "https://bs.cimanow.cc/"
                },
                success: function (res) {
                    doc = new DOMParser().parseFromString(res, "text/html");
                    var srces = [];
                    const regex = /\[(\d+p)]\s([^,]+)"/g;
                    let match;

                    while ((match = regex.exec(res)) !== null) {
                        src = {};
                        src["name"] = match[1];
                        // src["url"] = extractDomainWithProtocol(link) + encodeURI(match[2].trim());
                        src["url"] = extractDomainWithProtocol(link) + match[2].trim();
                        src["headers"] = { "Referer": "https://bs.cimanow.cc/" };
                        srces.push(src);
                    }


                    // $(doc).find('video source').each(function () {
                    //     src = {};
                    //     src["name"] = $(this).attr("size") + "p";
                    //     src["url"] = extractDomainWithProtocol(link) + $(this).attr("src");


                    //     src["headers"] = { "Referer": "https://bs.cimanow.cc/" };
                    //     srces.push(src);
                    // })
                    callback(srces);
                }
            });
        }
        , "has_multi_srcs": true
    },
    "StreamHG": {
        "names": ["4yftwvrdz7"],
        "domains": ["4yftwvrdz7.sbs", "edbrdl7pab.sbs"],
        "status": true,
        "get_srcs": function (link, callback, headers = {}) {
            $.ajax({
                "type": "GET",
                "url": link,
                "headers": {
                    "User-Agent": what_window.Main_USER_AGENT
                },
                success: function (res) {
                    doc = new DOMParser().parseFromString(res, "text/html");
                    var srces = [];
                    $(doc).find('script[type="text/javascript"]').each(function () {
                        script_text = $(this).text();
                        if (script_text.includes("eval")) {
                            unpaced = unPack(script_text).replace(/[\r\n\t]/g, '');
                            src = {};
                            src["name"] = "B1";
                            src["url"] = /(?:sources:\[\{file:"(.*?)"\}\],|links={".*":"(.*?)"};)/gm.exec(unpaced)[2];
                            // src["headers"] = { "Referer": "https://vidmoly.to/" };
                            srces.push(src);
                        }
                    });
                    callback(srces);
                }
            });
        }
        , "has_multi_srcs": false
    },
    "ForaFile": {
        "names": ["4yftwvrdz7"],
        "domains": ["6sfkrspw4u.sbs", "cd189tryo7.sbs"],
        "status": true,
        "get_srcs": function (link, callback, headers = {}) {
            $.ajax({
                "type": "GET",
                "url": link,
                "headers": {
                    "User-Agent": what_window.Main_USER_AGENT
                },
                success: function (res) {
                    doc = new DOMParser().parseFromString(res, "text/html");
                    var srces = [];
                    $(doc).find('script[type="text/javascript"]').each(function () {
                        script_text = $(this).text();
                        if (script_text.includes("eval")) {
                            unpaced = unPack(script_text).replace(/[\r\n\t]/g, '');
                            src = {};
                            src["name"] = "B1";
                            src["url"] = /sources:\[\{file:"(.*?)".*\}\],/gm.exec(unpaced)[1];
                            // src["headers"] = { "Referer": "https://vidmoly.to/" };
                            srces.push(src);
                        }
                    });
                    callback(srces);
                }
            });
        }
        , "has_multi_srcs": false
    },
    "bigwarp": {
        "names": ["bigwarp"],
        "domains": ["bigwarp.cc", "bigwarp.io"],
        "status": true,
        "get_srcs": function (link, callback, headers = {}) {
            $.ajax({
                "type": "GET",
                "url": link,
                "headers": {
                    "User-Agent": what_window.Main_USER_AGENT
                },
                success: function (res) {
                    doc = new DOMParser().parseFromString(res, "text/html");
                    var srces = [];
                    src = {};
                    src["name"] = "bigwarp";
                    src["url"] = /sources:.*\[\{file:"(.*?)".*\}\],/gm.exec(res)[1];
                    // src["headers"] = { "Referer": "https://vidmoly.to/" };
                    srces.push(src);
                    callback(srces);
                }
            });
        }
        , "has_multi_srcs": false
    },
    "EarnVids": {
        "names": ["EarnVids"],
        "domains": ["e4xb5c2xnz.sbs"],
        "status": true,
        "get_srcs": function (link, callback, headers = {}) {
            $.ajax({
                "type": "GET",
                "url": link,
                "headers": {
                    "User-Agent": what_window.Main_USER_AGENT
                },
                success: function (res) {
                    doc = new DOMParser().parseFromString(res, "text/html");
                    var srces = [];
                    $(doc).find('script[type="text/javascript"]').each(function () {
                        script_text = $(this).text();
                        if (script_text.includes("eval")) {
                            unpaced = unPack(script_text).replace(/[\r\n\t]/g, '');
                            src = {};
                            src["name"] = "B1";
                            src["url"] = /(?:sources:\[\{file:"(.*?)"\}\],|links={".*":"(.*?)"};)/gm.exec(unpaced)[2];
                            // src["headers"] = { "Referer": "https://vidmoly.to/" };
                            srces.push(src);
                        }
                    });
                    callback(srces);
                }
            });
        }
        , "has_multi_srcs": false
    },
    "MixDrop": {
        "names": ["mixdrop"],
        "domains": ["mixdrop.my", "mxdrop.to", "mixdrop."],
        "status": true,
        // what_window.Main_USER_AGENT
        "get_srcs": function (link, callback, headers = {}) {
            $.ajax({
                "type": "GET",
                "url": link,
                "headers": headers,
                success: function (res) {
                    doc = new DOMParser().parseFromString(res, "text/html");
                    var srces = [];

                    const found = extractEvalCallsFromHTML(res);

                    found.forEach(f => {
                        unpaced = unPack(f.evalCall).replace(/[\r\n\t]/g, '');
                        if (unpaced.includes("MDCore")) {

                            src = {};
                            src["name"] = "B1";
                            src["url"] = "https://" + /MDCore\.wurl="(.*?)"\;/gm.exec(unpaced)[1];
                            src["headers"] = { "user-agent": what_window.Main_USER_AGENT };
                            srces.push(src);
                        }
                    });

                    callback(srces);
                }
            });
        }
        , "has_multi_srcs": false
    },
    "We-Cima": {
        "names": ["WeCima"],
        "domains": ["wecima.movie", "wecima.watch", "wecima.tube", "wecima."],
        "status": true,
        "get_srcs": function (link, callback, headers = {}) {
            $.ajax({
                "type": "GET",
                "url": link,
                "headers": headers,
                success: function (watching_res) {
                    watching_doc = new DOMParser().parseFromString(watching_res, "text/html");
                    var srces = [];
                    if (/sources = (\[.*]);/sg.test(watching_res)) {
                        bad_json = /sources = (\[.*]);/sg.exec(watching_res)[1];
                        // eval(`srcs_array = ` + bad_json.replace(/\s*(['"])?([a-z0-9A-Z_\.]+)(['"])?\s*:([^,\}]+)(,)?/g, '"$2": $4$5'));
                        eval(`srcs_array = ${bad_json}`);
                    } else {
                        srcs_array = [];
                        src = {};
                        src["src"] = $(watching_doc).find("video source").attr("src");
                        src["format"] = /(\d+)p\./gm.test(src["src"]) ? /(\d+)p\./gm.exec(src["src"])[1] : "جودة غير معروفة";
                        srcs_array.push(src);
                    }
                    for (i = 0; i < srcs_array.length; i++) {
                        src = srcs_array[i];
                        if (src.format !== "auto") {
                            quality_name = src.label == "جودة غير معروفة" ? "720p" : parseInt(src.label.replace(/[^\d.]/g, '')) + "p";
                            src_link = src.src;

                            src = {};
                            src["name"] = quality_name;
                            src["file_ext"] = "mp4";
                            src["url"] = src_link;
                            src["headers"] = headers;
                            srces.push(src);

                        }
                    }

                    callback(srces);
                }
            });
        }
        , "has_multi_srcs": false
    },
    "GoVid": {
        "names": ["GoVid"],
        "domains": [".goveed1.space"],
        "status": true,
        "get_srcs": function (link, callback, headers = {}) {
            $.ajax({
                "type": "GET",
                "url": link,
                "headers": headers,
                success: function (res) {
                    doc = new DOMParser().parseFromString(res, "text/html");
                    $(doc).find('script[type="text/javascript"]').each(function () {
                        script_text = $(this).text();
                        if (script_text.includes("eval")) {
                            unpaced = unPack(script_text).replace(/[\r\n\t]/g, '');
                            var srces = [];
                            eval("web_sources = " + /sources:(\[.*?])/gm.exec(unpaced)[1]);
                            web_sources.forEach(web_source => {
                                src = {};
                                src["name"] = "VIDBOM";
                                src["url"] = web_source["file"];
                                src["headers"] = headers;
                                srces.push(src);
                            });
                            callback(srces);
                        }
                    });
                }
            });
        }
        , "has_multi_srcs": false
    },
    "VIDBOM": {
        "names": ["VIDBOM"],
        "domains": [".vdbtm.shop"],
        "status": true,
        "get_srcs": function (link, callback, headers = {}) {
            $.ajax({
                "type": "GET",
                "url": link,
                "headers": headers,
                success: function (res) {
                    doc = new DOMParser().parseFromString(res, "text/html");
                    $(doc).find('script[type="text/javascript"]').each(function () {
                        script_text = $(this).text();
                        if (script_text.includes("eval")) {
                            unpaced = unPack(script_text).replace(/[\r\n\t]/g, '');
                            var srces = [];
                            eval("web_sources = " + /sources:(\[.*?])/gm.exec(unpaced)[1]);
                            web_sources.forEach(web_source => {
                                src = {};
                                src["name"] = "VIDBOM";
                                src["url"] = web_source["file"];
                                src["headers"] = headers;
                                srces.push(src);
                            });
                            callback(srces);
                        }
                    });


                }
            });
        }
        , "has_multi_srcs": false
    },
    "vidshare": {
        "names": ["vidshare"],
        "domains": [".1vid1shar.space"],
        "status": true,
        "get_srcs": function (link, callback, headers = {}) {
            $.ajax({
                "type": "GET",
                "url": link,
                "headers": headers,
                success: function (res) {
                    doc = new DOMParser().parseFromString(res, "text/html");
                    $(doc).find('script[type="text/javascript"]').each(function () {
                        script_text = $(this).text();
                        if (script_text.includes("eval")) {
                            unpaced = unPack(script_text).replace(/[\r\n\t]/g, '');
                            var srces = [];
                            eval("web_sources = " + /sources:(\[.*?])/gm.exec(unpaced)[1]);
                            web_sources.forEach(web_source => {
                                src = {};
                                src["name"] = "VIDBOM";
                                src["url"] = web_source["file"];
                                src["headers"] = headers;
                                srces.push(src);
                            });
                            callback(srces);
                        }
                    });
                }
            });
        }
        , "has_multi_srcs": false
    },
    "Miravd": {
        "names": ["Miravd"],
        "domains": ["miravd.com"],
        "status": true,
        "get_srcs": function (link, callback, headers = null) {
            $.ajax({
                "type": "GET",
                "url": link,
                "headers": headers,
                success: function (res) {
                    doc = new DOMParser().parseFromString(res, "text/html");
                    $(doc).find('script[type]').each(function () {
                        script_text = $(this).text();
                        if (script_text.includes("eval")) {
                            unpaced = unPack(script_text).replace(/[\r\n\t]/g, '');
                            var srces = [];
                            eval("web_sources = " + /sources:(\[.*\]),image/gm.exec(unpaced)[1]);
                            web_sources.forEach(web_source => {
                                src = {};
                                src["name"] = "vidhidepre";
                                src["url"] = web_source["file"];
                                srces.push(src);
                            });
                            callback(srces);
                            return;
                        }
                    });

                }
            });
        }
        , "has_multi_srcs": false
    },
    "Mwdy": {
        "names": ["Mwdy"],
        "domains": ["mwdy.cc"],
        "status": true,
        "get_srcs": function (link, callback, headers = null) {
            $.ajax({
                "type": "GET",
                "url": link,
                "headers": headers,
                success: function (res) {
                    doc = new DOMParser().parseFromString(res, "text/html");
                    $(doc).find('script[type="text/javascript"]').each(function () {
                        script_text = $(this).text();
                        if (script_text.includes("eval")) {
                            unpaced = unPack(script_text).replace(/[\r\n\t]/g, '');
                            var srces = [];
                            eval("web_sources = " + /sources:(\[.*\]),image/gm.exec(unpaced)[1]);
                            web_sources.forEach(web_source => {
                                src = {};
                                src["name"] = "vidhidepre";
                                src["url"] = web_source["file"];
                                srces.push(src);
                            });
                            callback(srces);
                            return;
                        }
                    });

                }
            });
        }
        , "has_multi_srcs": false
    },
    "Vidoba": {
        "names": ["Vidoba"],
        "domains": ["vidoba.cc"],
        "status": true,
        "get_srcs": function (link, callback, headers = null) {
            $.ajax({
                "type": "GET",
                "url": link,
                "headers": headers,
                success: function (res) {
                    doc = new DOMParser().parseFromString(res, "text/html");
                    var srces = [];
                    eval("web_sources = " + /sources: (\[.*])/gm.exec(res)[1]);
                    web_sources.forEach(web_source => {
                        src = {};
                        src["name"] = "Vidoba";
                        src["url"] = web_source["file"];
                        if (getURLExtension(src["url"]) == "m3u8") {
                            srces.push(src);
                        }
                    });
                    callback(srces);

                }
            });
        }
        , "has_multi_srcs": false
    },
    "Fasel-HD": {
        "names": ["Fasel-HD"],
        "domains": [".faselhd.", ".faselhds.", ".faselhdx."],
        "status": true,
        "dl_status": true,
        "get_srcs": function (link, callback, headers = {}) {

            $.ajax({
                type: "GET",
                url: link,
                success: function (watching_res) {
                    var srces = [];
                    let watching_doc = new DOMParser().parseFromString(watching_res, "text/html");

                    let scripts = $(watching_doc).find("body script");
                    let file_link = null;

                    scripts.each(function () {
                        let enc_script = $(this).text().trim();
                        if (!enc_script) return; // skip empty scripts

                        try {
                            let decrypted_script = what_window.deobfuscator.deobfuscate(enc_script);
                            // look for file: "..." or video.src = "..."
                            const match = /("file":.*?|file:.*?|video\.src.*?=)\s*['"]([^'"]+)['"]/m.exec(decrypted_script);

                            if (match) {
                                file_link = match[2];
                                return false; // stop loop after finding the first valid link
                            }
                        } catch (e) {
                            console.warn("Failed to deobfuscate script:", e);
                        }
                    });

                    if (!file_link) {
                        console.log("No match found in any script");
                        return;
                    }

                    // build Auto source
                    let src = { name: "Auto", url: file_link };
                    srces.push(src);

                    // now fetch M3U8 playlist
                    fetchM3U8Manifest(file_link).then(segments => {
                        for (let i = 0; i < segments.length; i++) {
                            const segment = segments[i];
                            srces.push({
                                name: segment.qualityName,
                                url: segment.url,
                                headers: headers
                            });
                        }
                        callback(srces);
                    });
                }
            });
        }
        , "has_multi_srcs": true
    },
    "arabseed": {
        "names": ["Arabseed"],
        "domains": [".gamehub.", "m.reviewrate.net"],
        "status": true,
        "dl_status": true,
        "get_srcs": function (link, callback, headers = {}) {

            $.ajax({
                "type": "GET",
                "url": link,
                "headers": headers,
                success: function (res) {
                    doc = new DOMParser().parseFromString(res, "text/html");
                    var srces = [];
                    vid_src = $(doc).find("video source").attr("src");
                    src = {};
                    src["name"] = "عرب سيد";
                    src["url"] = vid_src;
                    src["headers"] = { "Referer": link };
                    srces.push(src);
                    callback(srces);
                }
            });
        }
        , "has_multi_srcs": false
    },
    "Filemoon": {
        "status": true,
        "names": ["filemoon"],
        "domains": ["filemoon.sx"],
        "get_srcs": function (link, callback, headers = {}) {
            $.ajax({
                "type": "GET",
                "url": link,
                headers: headers,
                success: function (res) {
                    doc = new DOMParser().parseFromString(res, "text/html");
                    iframe_src = $(doc).find("iframe").attr("src");
                    $.ajax({
                        "type": "GET",
                        "url": iframe_src,
                        headers: headers,
                        success: function (res) {
                            doc = new DOMParser().parseFromString(res, "text/html");

                            $(doc).find('script[type="text/javascript"]').each(function () {
                                script_text = $(this).text();
                                if (script_text.includes("eval")) {
                                    unpaced = unPack(script_text).replace(/[\r\n\t]/g, '');

                                    var srces = [];
                                    hls_url = /file:"(.*?)"/gm.exec(unpaced)[1];

                                    src = {};
                                    src["name"] = "vidhidepre";
                                    src["url"] = hls_url;
                                    src["headers"] = headers;
                                    srces.push(src);

                                    // web_sources.forEach(web_source => {
                                    //     src = {};
                                    //     src["name"] = "vidhidepre";
                                    //     src["url"] = web_source["file"];
                                    //     src["headers"] = headers;
                                    //     srces.push(src);
                                    // });
                                    callback(srces);

                                    return;
                                }
                            })
                        }
                    });

                }
            });

            // callback(link);

        }
        , "has_multi_srcs": false
    },

}

// play_dl_mou_cust_server("MixDrop", "TEST", "https://mixdrop.ag/e/r606negjcv4vpe7", true, null, `{}`);

function getURLExtension(url) {
    const parts = url.split('.');
    return parts.length > 1 ? parts.pop().split('?')[0] : '';
}
function play_dl_mou_cust_server(server_name, title = "", server_link, watch_or_dl = true, this_btn = false, headers = "{}") {
    continue_watch_code = "";
    full_title = "";
    if (this_btn !== false) {
        $(this_btn).addClass("loading_elemnt");
        full_title = $(this_btn).attr("data-full_title");
        continue_watch_code = $(this_btn).attr("data-continue_watch_code");


        if ($(this_btn).parent().hasClass('multi_srcs_container')) {
            parent_container = $(this_btn).parent();
            $(this_btn).insertAfter(parent_container);
            $(parent_container).remove();
        }
    }

    what_window.cust_servers[server_name]["get_srcs"](server_link, function (srcs) {
        full_title = title;
        if (this_btn !== false) {
            $(this_btn).removeClass("loading_elemnt");
            full_title = $(this_btn).attr("data-full_title");
            continue_watch_code = $(this_btn).attr("data-continue_watch_code");
        }
        if (srcs.length > 0) {
            if (srcs.length == 1) {
                src = srcs[0];
                this_src_link = src["url"];
                this_src_header = typeof src["headers"] !== "undefined" ? JSON.stringify(src["headers"]).replace(/"/g, "'") : '{}';

                if (watch_or_dl) {
                    play_vid(this_src_link, full_title, "", this_src_header, continue_watch_code);
                } else {
                    fast_download(full_title, this_src_link, this_src_header);
                }
            } else {
                srcs_html = $('<div>', { class: 'direct_srces' });
                if (this_btn !== false) {

                    if ($(this).closest(".watch_btn_container").find(".multi_srcs_container").length == 0) {
                        let container = $('<div>', { class: 'multi_srcs_container' });
                        $(this_btn).before(container);
                        container.append($(this_btn));
                        container.append(srcs_html);
                    }

                    srcs.forEach(src => {
                        this_src_name = src["name"];
                        this_src_link = src["url"];
                        this_src_header = typeof src["headers"] !== "undefined" ? JSON.stringify(src["headers"]).replace(/"/g, "'") : '{}';

                        this_src_file_ext = typeof src["file_ext"] !== "undefined" ? src["file_ext"] : false;
                        if (watch_or_dl) {
                            srcs_html.append(`<span class="mou_btn watch_btn" onclick="play_vid(\`${this_src_link}\`, \`${full_title}\`, \`\`, \`${this_src_header}\`, \`${continue_watch_code}\`)">${this_src_name}</span>`);
                        } else {

                            srcs_html.append(`<span class="mou_btn watch_btn" onclick="fast_download(\`${full_title}\`, \`${this_src_link}\`, \`${this_src_header}\`, '${this_src_file_ext}')">${this_src_name}</span>`);


                        }
                    });

                } else {

                    console.log(srcs);
                }
            }
        } else {

        }
    }, JSON.parse(fixSingleQuotes(headers)))

}
async function fetchM3U8Manifest(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch M3U8 manifest: ${response.statusText}`);
        }

        const manifestText = await response.text();
        const lines = manifestText.split('\n').map(line => line.trim()).filter(Boolean);

        const baseURL = new URL(url);
        const results = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            if (line.startsWith("#EXT-X-STREAM-INF")) {
                // Master playlist variant
                const resolutionMatch = line.match(/RESOLUTION=(\d+)x(\d+)/);
                const bandwidthMatch = line.match(/BANDWIDTH=(\d+)/);

                let resolution = null;
                let qualityName = null;

                if (resolutionMatch) {
                    const height = resolutionMatch[2]; // second capture group
                    resolution = `${resolutionMatch[1]}x${resolutionMatch[2]}`;
                    qualityName = `${height}p`;
                }

                const bandwidth = bandwidthMatch ? (bandwidthMatch[1] / 1000) + ' kbps' : null;

                const variantUrl = lines[i + 1];
                const fullVariantUrl = new URL(variantUrl, baseURL).href;

                results.push({ resolution, qualityName, bandwidth, url: fullVariantUrl });
                i++; // skip next line since it's already processed
            }
            else if (line.startsWith("#EXTINF")) {
                // Media playlist segment
                const segmentUrl = lines[i + 1];
                const fullSegmentUrl = new URL(segmentUrl, baseURL).href;

                results.push(fullSegmentUrl);
                i++;
            }
        }

        return results;
    } catch (error) {
        console.error("Error fetching or parsing M3U8 manifest:", error);
    }
}
function is_has_multi_srcs(server_name) {
    return what_window.cust_servers[server_name]["has_multi_srcs"];
}
function is_in_mou_servers(link) {
    returnn = false;
    link_domain = extractDomain(link);
    Object.keys(cust_servers).forEach(key => {
        element = cust_servers[key];
        for (let domain of element["domains"]) {
            if (link_domain.includes(domain)) {
                if (cust_servers[key]["status"] === true) {
                    returnn = key;
                }
                break;
            }
        };
    });

    return returnn;
}

function extractDomain(url) {
    try {
        // Add protocol if missing
        if (url.startsWith("//")) {
            url = "https:" + url;
        }
        let domain = new URL(url).hostname;
        return domain;
    } catch (e) {
        console.error("Invalid URL", e);
        return null;
    }
}
function extractDomainWithProtocol(url) {
    try {
        if (url.startsWith("//")) {
            url = "https:" + url;
        }
        let parsedUrl = new URL(url);
        return `${parsedUrl.protocol}//${parsedUrl.hostname}`;
    } catch (e) {
        console.error("Invalid URL", e);
        return null; // Return null or handle the error based on your use case
    }
}

function getFinalUrl(url, callback) {

    fetch(url, {
        method: 'GET',
        redirect: 'follow' // Follow redirects
    })
        .then(response => {
            callback(response.url); // Return the final URL after redirects
        })
        .catch(error => {
            console.error('Error fetching URL:', error);
            callback(null); // Return null on error
        });
}
