get_window_id(async function (id) {
    webContentsId = id;
    // window.electron.onRedirect((data) => {
    //     console.log("Redirect detected:");
    //     console.log("Original:", data.original);
    //     console.log("Redirect:", data.redirect);
    //     console.log("Status:", data.statusCode);
    // });

    if (getQueryVariable("data")) {
        data = decodeURI(atob(getQueryVariable("data")));
        data = getQueryParams("?" + data)
        console.log(data);
        $("head title").text(data.vid_title);

        if (isYouTubeVideoLink(data.vid_link)) {
            // $("#loading-screen").removeClass("d-none");
            yt_link = "https://www.youtube.com/watch?v=" + extractYouTubeVideoId(data.vid_link);
            yt_formats = await what_window.electron.getYoutubeVideo(yt_link);
            // return false;
            const videoEl = $('#plyr');

            const audioFormat = yt_formats.find(f => f.quality === 'audio');
            window.formats = yt_formats.filter(f => f.quality !== 'audio');

            vid_options = [];
            window.formats.forEach(f => {
                // source = {};
                // source["src"] = f.url;
                // source["type"] = 'video/mp4';
                // source["size"] = parseInt(f.quality);
                // player_sources.push(source);
                data_quality = parseInt(f.quality);


                if (f.format_id == "299") {
                    data_quality = 108060;
                } else if (f.format_id == "298") {
                    data_quality = 72060;
                }
                vid_options.push(data_quality);
                const source = document.createElement('source');
                source.setAttribute('src', f.url);
                source.setAttribute('type', 'video/mp4');
                source.setAttribute('data-quality', data_quality);
                videoEl[0].appendChild(source);
            });



            const player = new Plyr(videoEl[0], {
                controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen'],
                settings: ['quality'],
                autoPlay: false,
                quality: {
                    default: 360,
                    options: vid_options,
                    forced: true
                },
                i18n: {
                    qualityLabel: {
                        144: '144p LOW',
                        240: '240p LOW',
                        360: '360p SD',
                        480: '480p SD',
                        720: '720p HD',
                        1080: 'HD 1080p',
                        72060: '⭐ 720p 60 FPS',
                        108060: '⭐ HD 1080p 60 FPS',
                    }
                }
            });

            player.config.quality.onChange = (newQuality) => {
                const currentTime = player.currentTime;
                const isPaused = player.paused;

                console.log('Switched quality to', newQuality);
                vid_link = $(videoEl).find(`source[data-quality="${newQuality}"]`).attr("src");

                $(videoEl).attr("src", vid_link);

                player.once('loadedmetadata', () => {
                    console.log(currentTime);
                    player.currentTime = currentTime;
                    if (!isPaused) player.play();
                });
            };


            player.once('ready', () => {
                player.play(); // start playback manually (fallback)
                $("#player-container").removeClass("d-none");
                $("#loading-screen").hide();
            });


            if (audioFormat) {
                audioEl = new Audio(audioFormat.url);
                player.on('play', () => audioEl.play());
                player.on('pause', () => audioEl.pause());
                player.on('seeked', () => audioEl.currentTime = plyr.currentTime);
                player.on('volumechange', () => {
                    audioEl.volume = plyr.volume;
                    audioEl.muted = plyr.muted;
                });
                // Native HTML5 media events

                player.media.addEventListener('loadstart', () => {
                    audioEl.volume = plyr.volume;
                    audioEl.muted = plyr.muted;
                });

                player.media.addEventListener('waiting', () => {
                    audioEl.muted = true;
                    console.log('Video is buffering...');
                });

                player.media.addEventListener('playing', () => {
                    console.log('Video is playing');

                    audioEl.volume = plyr.volume;
                    audioEl.muted = plyr.muted;
                });
                player.media.addEventListener('canplay', () => {
                    audioEl.volume = plyr.volume;
                    audioEl.muted = plyr.muted;
                    console.log('New video is ready');

                }, { once: true });

            }

        } else if (data.DrmLicenceUrl) {


            // 1. إعداد العناصر
            const container = document.createElement('div');
            container.style.width = '100%';
            container.style.height = '100vh';
            container.style.backgroundColor = '#000';

            const videoEl = document.createElement('video');
            videoEl.id = 'plyr-player';
            videoEl.setAttribute('playsinline', '');
            // التأكيد على سرعة التشغيل الافتراضية من المتصفح
            videoEl.playbackRate = 1.0;
            container.appendChild(videoEl);
            document.body.appendChild(container);

            var decrypted_DrmLicenceUrl = atob(data.DrmLicenceUrl.split("").reverse().join(""));
            window.DrmLicenceUrl = decrypted_DrmLicenceUrl;

            shaka.polyfill.installAll();

            if (shaka.Player.isBrowserSupported()) {
                const shakaPlayer = new shaka.Player(videoEl);
                window.shakaPlayer = shakaPlayer;
                let playerInstance = null;

                shakaPlayer.getNetworkingEngine().registerRequestFilter((type, request) => {
                    request.headers['User-Agent'] = data.useragent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
                    delete request.headers['Referer'];
                    if (data.headers) {
                        const extraHeaders = JSON.parse(data.headers);
                        Object.keys(extraHeaders).forEach(key => { request.headers[key] = extraHeaders[key]; });
                    }
                });

                shakaPlayer.configure({
                    drm: { clearKeys: getClearKeys(window.DrmLicenceUrl) },
                    manifest: { dash: { ignoreDrmInfo: true } },
                    abr: { enabled: true }
                });

                // 2. بناء Plyr مع إصلاح السرعة وزر Auto
                const createPlyr = (qualities = []) => {
                    if (playerInstance) return;

                    const qualityOptions = [0, ...qualities];

                    playerInstance = new Plyr(videoEl, {
                        controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen'],
                        settings: ['quality', 'speed'],
                        speed: {
                            selected: 1, // إجبار السرعة على 1 عند البداية
                            options: [0.5, 0.75, 1, 1.25, 1.5, 2]
                        },
                        muted: false,
                        volume: 1,
                        quality: {
                            default: 0,
                            options: qualityOptions,
                            forced: true,
                            onChange: (q) => {
                                if (q === 0) {
                                    shakaPlayer.configure({ abr: { enabled: true } });
                                } else {
                                    const currentTime = videoEl.currentTime;
                                    const isPaused = videoEl.paused;
                                    shakaPlayer.configure({ abr: { enabled: false } });
                                    const target = shakaPlayer.getVariantTracks().find(t => t.height === q);
                                    if (target) {
                                        shakaPlayer.selectVariantTrack(target, true);
                                        setTimeout(() => {
                                            videoEl.currentTime = currentTime;
                                            // نأكد على السرعة 1 بعد تغيير الجودة برضه
                                            videoEl.playbackRate = 1.0;
                                            if (!isPaused) videoEl.play();
                                        }, 100);
                                    }
                                }
                            }
                        },
                        i18n: {
                            qualityLabel: { 0: 'Auto' }
                        }
                    });

                    playerInstance.on('ready', () => {
                        // ضمان أن السرعة 1.0 بمجرد أن المشغل يكون جاهز
                        videoEl.playbackRate = 1.0;
                        setTimeout(() => {
                            playerInstance.fullscreen.enter().catch(() => { });
                        }, 1500);
                    });

                    // منع أي تغيير عشوائي في السرعة أثناء التشغيل
                    playerInstance.on('ratechange', () => {
                        if (videoEl.playbackRate === 0) return; // السماح بالإيقاف
                        console.log("Current Rate:", videoEl.playbackRate);
                    });
                };

                shakaPlayer.addEventListener('trackschanged', () => {
                    const tracks = shakaPlayer.getVariantTracks();
                    const qualities = [...new Set(tracks.filter(t => t.height).map(t => t.height))].sort((a, b) => b - a);
                    if (qualities.length > 0) {
                        createPlyr(qualities);
                    }
                });

                try {
                    await shakaPlayer.load(data.vid_link);

                    // إجبار السرعة قبل التشغيل
                    videoEl.playbackRate = 1.0;
                    videoEl.defaultPlaybackRate = 1.0;

                    videoEl.play().catch(error => {
                        window.addEventListener('click', () => {
                            videoEl.playbackRate = 1.0;
                            videoEl.play();
                        }, { once: true });
                    });

                    setTimeout(() => { if (!playerInstance) createPlyr([1080, 720, 480]); }, 5000);

                } catch (e) {
                    console.error('Error:', e);
                }
            }


        } else {
            userId = data.userId;
            continue_watch = data.continue_watch;
            continue_watch_code = data.continue_watch_code;

            if (data.agent || data.useragent) {
                if (!data.headers) data.headers = {};
                data.headers["User-Agent"] = data.agent || data.useragent;
            }

            const video = $("#videoPlayer")[0];
            // const player = new Plyr('#videoPlayer');
            data.headers = JSON.parse(fixSingleQuotes(data.headers));
            // window.DrmLicenceUrl = data.DrmLicenceUrl;
            var decrypted_DrmLicenceUrl = atob(data.DrmLicenceUrl.split("").reverse().join(""));
            window.DrmLicenceUrl = decrypted_DrmLicenceUrl;

            // console.log("Decrypted DrmLicenceUrl:", window.DrmLicenceUrl);
            // if (typeof data.useragent !== "undefined") {
            //     data.headers["User-Agent"] = data.useragent;
            // }

            updateHeaders(webContentsId, data.headers);

            getFinalUrlAndType(data.vid_link, data.headers, async function (link_data) {
                console.log("Final URL and Type:", link_data);
                vid_type = link_data["type"];
                finalUrl = link_data["url"];
                const originalUrl = finalUrl;
                var proxyUrl = null;
                var isEncryptedBinary = false;

                function switchToProxyUrl(reason) {
                    if (useStreamingProxy) return false;
                    if (!originalUrl) return false;
                    if (!reason || !reason.includes('Unsupported HEVC in M2TS found')) return false;

                    const headersPayload = data.headers ? btoa(JSON.stringify(data.headers)) : null;
                    proxyUrl = `http://localhost:9876/stream-proxy?url=${encodeURIComponent(originalUrl)}`;
                    if (headersPayload) {
                        proxyUrl += `&proxy_headers=${encodeURIComponent(headersPayload)}`;
                    }
                    finalUrl = proxyUrl;
                    vid_type = 'video/mp4';
                    isEncryptedBinary = false;
                    useStreamingProxy = true;
                    console.warn('[HEVC Fallback] switch to streaming proxy because of Clappr error:', reason);
                    try {
                        var playback = window.player.core ? window.player.core.currentPlayback : null;
                        if (playback && playback.hls) {
                            playback.hls.destroy();
                        }
                    } catch (e) { }
                    try {
                        if (typeof window.player.load === 'function') {
                            window.player.load(finalUrl, vid_type);
                        } else {
                            window.player.configure({ source: finalUrl, mimeType: vid_type });
                            window.player.load(finalUrl);
                        }
                        window.player.play();
                    } catch (e) {
                        console.error('[HEVC Fallback Error] failed to reload proxy source', e);
                    }
                    return true;
                }

                // استخدام streaming proxy للملفات HEVC والمشفرة
                var useStreamingProxy = false;
                if (isEncryptedBinary) {
                    try {
                        console.log('[Streaming Proxy] استخدام streaming proxy للتحويل السريع');
                        const headersPayload = data.headers ? btoa(JSON.stringify(data.headers)) : null;
                        proxyUrl = `http://localhost:9876/stream-proxy?url=${encodeURIComponent(finalUrl)}`;
                        if (headersPayload) {
                            proxyUrl += `&proxy_headers=${encodeURIComponent(headersPayload)}`;
                        }
                        finalUrl = proxyUrl;
                        vid_type = 'video/mp4';
                        isHevc = false;
                        isEncryptedBinary = false;
                        useStreamingProxy = true;
                    } catch (err) {
                        console.error('[Proxy Error]', err);
                    }
                }

                Clappr_Plugins = [DashShakaPlayback, LevelSelector, ClapprImaPlugin, Clappr.MediaControl];
                if (continue_watch) {
                    Clappr_Plugins.push(ContinueWatching);
                }
                // if (["application/dash+xml", "application/dash+xml"].includes(vid_type)) {
                //     Clappr_Plugins.push(DashShakaPlayback);
                // }
                // if (["application/octet-stream"].includes(vid_type) && (link_data.ext == "mkv" || link_data.ext == "mp4")) {
                //     vid_type = "video/mp4";
                // }

                if (vid_type && vid_type.includes("application/octet-stream")) {
                    if (finalUrl.toLowerCase().includes(".mp4")) {
                        vid_type = "video/mp4";
                    } else if (finalUrl.toLowerCase().includes(".mkv")) {
                        vid_type = "video/x-matroska";
                    } else if (finalUrl.toLowerCase().includes(".h265") || finalUrl.toLowerCase().includes(".hevc")) {
                        vid_type = "video/hevc";
                    }
                } else if (vid_type) {
                    vid_type = vid_type.split(',')[0].trim();
                    // دعم HEVC MIME types المختلفة
                    if (vid_type.includes('hevc') || vid_type.includes('h265') || vid_type.includes('h.265')) {
                        vid_type = "video/hevc";
                    }
                }

                Clappr_config = {
                    source: finalUrl,
                    width: '100%',
                    height: '100%',
                    mimeType: vid_type,
                    autoPlay: true,
                    plugins: Clappr_Plugins,

                    // تأكد أن useStreamingProxy لا تقتل HLS إلا في الضرورة القصوى
                    disableHLS: (useStreamingProxy || isEncryptedBinary),

                    hlsjsConfig: {
                        // إعدادات البافر (ممتازة عندك ولكن سنزيدها قليلاً)
                        maxBufferLength: 60,
                        maxMaxBufferLength: 120, // زيادة الحد الأقصى
                        maxBufferSize: 90 * 1000 * 1000, // 90 ميجا بايت

                        // --- الجزء الأهم لمنع التوقف بعد أول قطعة ---
                        enableWorker: true,
                        nudgeMaxRetries: 10,       // يحاول دفع المشغل لو وقف
                        nudgeOffset: 0.1,          // دفع بسيط للأمام لو البافر علق

                        // استعادة البث تلقائياً عند حدوث خطأ في الميديا
                        manifestLoadingMaxRetry: Infinity,
                        manifestLoadingRetryDelay: 1000,
                        fragLoadingMaxRetry: 10,

                        // الحفاظ على التزامن (مهم جداً للبروكسي)
                        appendErrorMaxRetry: 10,
                        // هذا الخيار يمنع المشغل من رفض القطع التي لا تنتهي بـ .ts
                        allowScriptTag: true
                    },

                    levelSelectorConfig: {
                        // كود الـ labelCallback الخاص بك هنا (ممتاز ولا غبار عليه)
                    },

                    streaming: {
                        jumpLargeGaps: true, // مهم جداً للقفز فوق الأجزاء التالفة
                    }
                };
                if (continue_watch) {
                    Clappr_config["continueWatching"] = {
                        userId: userId,             // 👤 رقم المستخدم
                        videoId: continue_watch_code,    // 🎬 رقم الفيديو
                        apiUrl: 'https://my.elbatal-app.com/users/api/continue_watching.php',
                        autoResume: true,
                        showPrompt: true,
                        minSeconds: 30,
                        nearEndGap: 15,
                        writeInterval: 5000
                    }
                }

                // للملفات DASH استخدم Shaka
                if (vid_type == "application/dash+xml") {
                    // استخراج المفاتيح باستخدام الدالة المحدثة
                    var keys = getClearKeys(window.DrmLicenceUrl);
                    console.log("Injected Keys for Shakaaaaa:", keys);

                    Clappr_config.playback = {
                        playInline: true,
                        shakaConfiguration: {
                            drm: {
                                clearKeys: keys,
                                advanced: {
                                    'org.w3.clearkey': {
                                        videoRobustness: 'SW_SECURE_DECODE',
                                        audioRobustness: 'SW_SECURE_DECODE'
                                    }
                                }
                            }
                        }
                    };
                }
                // للملفات HEVC المباشرة - استخدم native HTML5 video فقط (بدون Shaka)
                else if (isEncryptedBinary || vid_type == "video/hevc" || vid_type.includes('hevc')) {
                    // تجنب استخدام Shaka مع HEVC في M2TS (يسبب transmux errors)
                    // استخدم native HTML5 video element بدلاً من ذلك
                    console.log('[HEVC/Encrypted Native Playback] استخدام HTML5 video native codec');
                    // لا نضع أي playback config - دع Clappr يستخدم HTML5 native
                }
                // للملفات الأخرى DASH مع HEVC
                else if (vid_type.split(',').length > 0 && (vid_type.includes('hevc') || vid_type.includes('h265'))) {
                    console.log('[Multi-codec DASH] قد يحتوي على HEVC');
                    var keys = getClearKeys(window.DrmLicenceUrl);

                    Clappr_config.playback = {
                        playInline: true,
                        shakaConfiguration: {
                            manifest: {
                                dash: {
                                    ignoreDrmInfo: true // تجاهل التشفير الداخلي والاعتماد على clearKeys فقط
                                }
                            },
                            drm: {
                                clearKeys: keys,
                                advanced: {
                                    'org.w3.clearkey': {
                                        // هذه السطور تحل مشكلة الـ Robustness في النسخ القديمة والجديدة
                                        videoRobustness: 'SW_SECURE_DECODE',
                                        audioRobustness: 'SW_SECURE_DECODE',
                                        'distinctiveIdentifierRequired': false,
                                        'persistentStateRequired': false,
                                        'serverCertificate': null
                                    }
                                }
                            },
                            streaming: {
                                bufferingGoal: 10,
                                jumpLargeGaps: true
                            }
                        }
                    };


                }

                window.player = new Clappr.Player(Clappr_config);

                // معالج فوري لإيقاف HLS.js قبل بدء التحميل
                if (Clappr_config.disableHLS) {
                    // إيقاف HLS.js قبل بدء أي تحميل
                    var stopHLS = function () {
                        try {
                            setTimeout(function () {
                                var playback = window.player.core ? window.player.core.currentPlayback : null;
                                if (playback && playback.hls) {
                                    playback.hls.destroy();
                                    console.log('[HLS.js Force Disabled] استخدام native video player فقط');
                                }
                            }, 100);
                        } catch (e) { }
                    };

                    // استدعاء فوري
                    stopHLS();

                    // وكذلك عند أي محاولة تشغيل أو تحميل
                    window.player.on('playback:play', stopHLS);
                    window.player.on('playback:buffering', stopHLS);
                    window.player.on('playback:loadstart', stopHLS);
                    window.player.on('playback:loadedmetadata', stopHLS);

                    // معالج آخر لإيقاف HLS عند أي محاولة تحميل fragment
                    window.player.on('playback:seek', function () {
                        try {
                            var playback = window.player.core.currentPlayback;
                            if (playback && playback.hls) {
                                playback.hls.destroy();
                            }
                        } catch (e) { }
                    });
                }

                function extractClapprErrorMessage(error, seen = new Set()) {
                    if (!error) return '';
                    if (seen.has(error)) return '';
                    if (typeof error === 'string') return error;
                    if (error instanceof Error) return error.message || '';
                    seen.add(error);

                    var parts = [];
                    if (error.error) parts.push(extractClapprErrorMessage(error.error, seen));
                    if (error.data) parts.push(extractClapprErrorMessage(error.data, seen));
                    if (error.description) parts.push(extractClapprErrorMessage(error.description, seen));
                    if (error.reason) parts.push(extractClapprErrorMessage(error.reason, seen));
                    if (error.details) parts.push(extractClapprErrorMessage(error.details, seen));
                    if (error.message && typeof error.message === 'string') parts.push(error.message);
                    if (Array.isArray(error)) parts.push(error.map((item) => extractClapprErrorMessage(item, seen)).filter(Boolean).join(' | '));

                    try {
                        Object.keys(error).forEach((key) => {
                            if (['error', 'data', 'description', 'reason', 'details', 'message'].includes(key)) return;
                            parts.push(extractClapprErrorMessage(error[key], seen));
                        });
                    } catch (e) {
                        // ignore
                    }

                    return parts.filter(Boolean).join(' | ');
                }

                // معالج الأخطاء الشامل
                window.player.on(Clappr.Events.PLAYER_ERROR, function (error) {
                    var message = extractClapprErrorMessage(error);
                    if (message && message.includes('Unsupported HEVC in M2TS found')) {
                        console.warn('[Clappr HEVC Error] detected, switching to proxy', message);
                        if (switchToProxyUrl(message)) {
                            return;
                        }
                    }
                    if (message && (message.includes('HEVC') || message.includes('fragParsingError') || message.includes('Unsupported'))) {
                        console.warn('[Compatibility Warning]', message);
                        if (Clappr_config.disableHLS) {
                            try {
                                var pb = window.player.core.currentPlayback;
                                if (pb && pb.hls) {
                                    pb.hls.destroy();
                                }
                            } catch (e) { }
                        }
                        return;
                    }
                    console.warn('[Player Error]', error, 'message=', message);
                });

                // معالج أخطاء HLS مع تجنب الأخطاء الفادحة
                window.player.on('playback:hlserror', function (error) {
                    var reason = extractClapprErrorMessage(error);
                    if (reason && reason.includes('Unsupported HEVC in M2TS found')) {
                        console.warn('[Clappr HEVC playback error] switching to proxy', reason);
                        if (switchToProxyUrl(reason)) {
                            return;
                        }
                    }
                    if (reason && (reason.includes('HEVC') || reason.includes('fragParsing') || reason.includes('Unsupported'))) {
                        console.warn('[Skipping Playback Error]', reason);
                        try {
                            var playback = window.player.core.currentPlayback;
                            if (playback && playback.hls) {
                                console.log('[Force Destroying HLS]');
                                playback.hls.destroy();
                            }
                        } catch (e) {
                            console.log('[HLS Destroy failed]');
                        }
                        return;
                    }
                    console.warn('[HLS Error - Recovering]', error, 'reason=', reason);
                });

                // معالج إضافي للأحداث الفادحة - يمنع الإيقاف الفوري
                window.player.on('playback:fatal', function (error) {
                    console.warn('[Fatal Event - Attempting Recovery]', error);
                    // لا نوقف - نحاول المتابعة
                    if (Clappr_config.disableHLS) {
                        try {
                            var pb = window.player.core.currentPlayback;
                            if (pb && pb.hls) {
                                pb.hls.destroy();
                            }
                        } catch (e) { }
                    }
                    try {
                        window.player.play();
                    } catch (e) {
                        console.log('[Playback recovery failed]');
                    }
                });

                // معالج شامل لأي حدث قد يكون خطأ
                window.player.on('error', function (error) {
                    console.warn('[Generic Error Handler]', error);
                    if (Clappr_config.disableHLS && error && error.type) {
                        try {
                            var pb = window.player.core.currentPlayback;
                            if (pb && pb.hls) {
                                pb.hls.destroy();
                            }
                        } catch (e) { }
                    }
                });

                // مراقب مستمر يوقف HLS.js كل 500ms إذا كان موجوداً
                if (Clappr_config.disableHLS) {
                    var hlsKiller = setInterval(function () {
                        try {
                            var playback = window.player.core ? window.player.core.currentPlayback : null;
                            if (playback && playback.hls) {
                                playback.hls.destroy();
                                console.log('[HLS Killer] HLS.js تم إيقافه');
                                // بعد الإيقاف الأول، نوقف المراقب
                                clearInterval(hlsKiller);
                            }
                        } catch (e) {
                            // لا نفعل شيء عند الخطأ
                        }
                    }, 500);

                    // توقف المراقب بعد 10 ثوان على الأكثر
                    setTimeout(function () {
                        clearInterval(hlsKiller);
                    }, 10000);
                }

                // 3. الحل السحري: إجبار القائمة على الظهور بعد التحميل
                // طريقة الرسم المضمونة التي استخدمتها أنت مع تعديل بسيط
                window.player.on(Clappr.Events.PLAYER_READY, function () {
                    setTimeout(function () {
                        var ls = window.player.getPlugin('level_selector');
                        if (ls) {
                            ls.render(); // رسم أولي
                            // محاولة ثانية بعد ثانية أخرى للتأكد من امتلاء البيانات
                            setTimeout(function () { ls.render(); }, 1000);
                        }
                    }, 500);
                });

                // Check if a mode (fit or fill) is stored in localStorage
                const savedMode = localStorage.getItem('videoFitMode');
                const initialMode = savedMode === 'fill' ? 'fill' : 'contain'; // Default to 'contain' if not found

                window.player.listenTo(window.player, Clappr.Events.PLAYER_READY, () => {
                    try {
                        window.player.core.toggleFullscreen(); // Safe way to toggle full-screen mode
                    } catch (e) { console.log("Fullscreen blocked by browser policies"); }


                    const mediaControl = player.getPlugin('media_control');
                    // Wait until the media control is rendered
                    window.player.listenTo(mediaControl, Clappr.Events.MEDIACONTROL_RENDERED, () => {
                        const videoElement = $(what_window.player.core.$el).find("video")[0];
                        if (videoElement) {
                            videoElement.style.objectFit = initialMode; // Apply the saved mode
                        }
                        // Use jQuery to create the custom button
                        const $button = $('<button>', {
                            class: 'fitfill-button',  // Add a custom class for styling
                            text: 'Fill'  // Set initial text for the button
                        });

                        // Append the button to the right controls section
                        $('.media-control-right-panel').append($button);

                        // Add a click event to toggle the fit and fill mode
                        $button.on('click', function () {
                            const videoElement = $(what_window.player.core.$el).find("video")[0];
                            const isFill = videoElement.style.objectFit === 'fill';
                            videoElement.style.objectFit = isFill ? 'contain' : 'fill';
                            $button.text(isFill ? 'Fill' : 'Fit');  // Toggle button text
                            localStorage.setItem('videoFitMode', isFill ? 'contain' : 'fill');

                        });
                    });


                });

                window.player.attachTo($('#player')[0]);

                // معالج على video element مباشرة
                if (Clappr_config.disableHLS) {
                    setTimeout(function () {
                        try {
                            var videoEl = $('#player video')[0];
                            if (videoEl) {
                                // معالج عند محاولة تحميل / تشغيل من خلال MSE
                                videoEl.addEventListener('loadstart', function () {
                                    console.log('[Video loadstart] إيقاف HLS.js');
                                    var pb = window.player.core.currentPlayback;
                                    if (pb && pb.hls) {
                                        pb.hls.destroy();
                                    }
                                });

                                videoEl.addEventListener('play', function () {
                                    try {
                                        var pb = window.player.core.currentPlayback;
                                        if (pb && pb.hls) {
                                            pb.hls.destroy();
                                        }
                                    } catch (e) { }
                                });
                            }
                        } catch (e) { }
                    }, 500);
                }

                // معالجات إضافية لتقليل الأخطاء
                window.player.on('playback:play', () => {
                    // مسح أي تحذيرات عند البدء
                    console.log('[Playback] Starting playback...');
                });

                window.player.on('playback:pause', () => {
                    console.log('[Playback] Paused');
                });

                window.player.on('playback:ended', () => {
                    console.log('[Playback] Ended');
                });

                window.player.on('playback:loadedmetadata', () => {
                    console.log('[Playback] Metadata loaded');
                });

                window.player.on('playback:seeked', function () {
                    console.log('[Playback] Seek completed');
                });

                // Add the custom button manually

                //     console.log('Player is ready with multi-quality selector');
                // });
            });
        }

    }
})


function get_window_id(callback) {
    if (typeof window.electron !== "undefined") {
        ipcRenderer.on('window-id', (id) => {
            callback(id);
        });
    } else {
        callback("normal");
    }
};
function updateHeaders(windowId, headers) {
    if (headers) {

        if (typeof window.electron !== "undefined") {
            window.ipcRenderer.send('update-headers',
                {
                    window_id: windowId,
                    custom_headers: headers
                }
            );
        }
    }
}

function fixSingleQuotes(jsonStr) {
    // Replace single quotes with double quotes
    const fixedStr = jsonStr.replace(/'/g, '"');
    try {
        // Try to parse the fixed JSON string
        return fixedStr;
    } catch (error) {
        console.error("Invalid JSON string", error);
        return null;
    }
}
function getQueryVariable(variable, meth = 1, link = "") {
    if (meth == 1) {
        var query = window.location.search.substring(1);
    } else {
        var query = link.split("?")[1];
    }
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return (false);
}
function getQueryParams(url) {
    let params = {};
    let queryString = url.split('?')[1]; // Get the part after '?'

    if (queryString) {
        let queries = queryString.split('&'); // Split into individual parameters

        queries.forEach(function (query) {
            let [key, value] = query.split('='); // Split into key and value
            params[decodeURIComponent(key)] = decodeURIComponent(value || ''); // Decode URI components
        });
    }

    return params;
}
async function getVideoTypeFromResponse(url, headers) {
    const proxyUrl = `http://localhost:3000/proxy?url=${encodeURIComponent(url)}&proxy_headers=${btoa(encodeURIComponent(headers))}`;

    try {
        const response = await fetch(proxyUrl);
        const data = await response.json();
        return data.contentType || 'unknown';
    } catch (error) {
        console.error('Failed to fetch content type:', error);
        return 'unknown';
    }
}

// دالة للتحقق من دعم HEVC في المتصفح
function checkHEVCSupport() {
    try {
        const video = document.createElement('video');

        // اختبار MIME types مختلفة للـ HEVC
        const hevcCodecs = [
            'video/hevc',
            'video/hevc;codecs="hev1.1.6.L93.B0"',
            'video/hevc;codecs="hev1.1.6.L120.B0"',
            'video/hevc;codecs="hev1.1.6.L153.B0"',
            'video/mp4;codecs="hev1.1.6.L93.B0"',
            'video/mp4;codecs="hev1.1.6.L120.B0"',
            'video/mp4;codecs="hev1.1.6.L153.B0"',
            'video/mp4;codecs="hev1"'
        ];

        for (let codec of hevcCodecs) {
            if (video.canPlayType(codec) !== '') {
                console.log('HEVC Support detected with codec:', codec);
                return true;
            }
        }

        console.warn('HEVC not supported in this environment, will attempt fallback');
        return false;
    } catch (error) {
        console.error('Error checking HEVC support:', error);
        return false;
    }
}

// دالة لتحويل HEVC إلى صيغة متوافقة إذا لم يتم دعمها مباشرة
function handleHEVCFallback(url, mimeType) {
    // إذا كان الـ HEVC مدعوماً، لا توجد الحاجة للتحويل
    if (checkHEVCSupport()) {
        return { url: url, mimeType: mimeType };
    }

    // محاولة تشغيل من خلال Shaka Player حتى لو لم يكن مدعوماً مباشرة
    console.warn('HEVC not supported directly, using Shaka Player for compatibility');
    return { url: url, mimeType: 'application/dash+xml', useShakaPlayer: true };
}

function getFinalUrlAndType(url, customHeaders, callback) {
    var videoMimeTypes = {
        'mp4': 'video/mp4', 'mkv': 'video/x-matroska', 'm3u8': 'application/vnd.apple.mpegurl',
        'mpd': 'application/dash+xml', 'hevc': 'video/hevc', 'h265': 'video/hevc'
    };

    if (url.startsWith("//")) url = "http:" + url;
    let res = { url: url.trim(), type: null };

    // فحص أولي بناءً على الرابط قبل الـ fetch
    let urlObj = new URL(res.url);
    let extension = urlObj.pathname.split('.').pop().toLowerCase();
    res.type = videoMimeTypes[extension] || null;

    // تمرير الهيدرز للـ fetch لضمان عدم الرفض (403)
    fetch(res.url, {
        method: 'HEAD',
        headers: customHeaders || {}, // تمرير الهيدرز الأصلية (Referer, User-Agent)
        redirect: 'follow'
    })
        .then(response => {
            let finalUrl = response.url;

            // 1. معالجة تحويل البروتوكول (HTTP -> HTTPS) أو العكس
            // ملحوظة: الـ payload يجب أن يأتي من customHeaders
            if (res.url.startsWith("http://") && finalUrl.startsWith("https://")) {
                const headersPayload = customHeaders ? btoa(JSON.stringify(customHeaders)) : '';
                finalUrl = `http://localhost:9876/hls-proxy?url=${encodeURIComponent(res.url)}&proxy_headers=${headersPayload}`;
            }

            res.url = finalUrl;

            // 2. تصحيح النوع (بما أننا في Electron، الـ Headers ستكون متاحة لو الـ CORS مسموح)
            let contentType = response.headers.get("content-type");
            if (contentType) {
                res.type = contentType.split(';')[0].trim();
            }

            // 3. تأكيدات إجبارية (Overriding)
            if (res.url.includes("hls-proxy") || res.url.includes(".m3u8")) {
                res.type = "application/vnd.apple.mpegurl";
            } else if (res.url.includes(".mpd")) {
                res.type = "application/dash+xml";
            }

            console.log("Final Resolved:", res.url, "Type:", res.type);
            callback(res);
        })
        .catch(error => {
            console.warn('HEAD request failed, using fallback logic:', error);
            // Fallback: إذا فشل الـ fetch، نعتمد على الامتداد فقط
            if (res.url.includes(".m3u8")) res.type = "application/vnd.apple.mpegurl";
            callback(res);
        });
}

function HexTobase64(hexString) {
    const byteArray = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    return btoa(String.fromCharCode.apply(null, byteArray))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function hexStringToByteArray(hex) {
    const len = hex.length;
    const byteArray = new Uint8Array(len / 2);
    for (let i = 0; i < len; i += 2) {
        byteArray[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return byteArray;
}
function convertToJSONObject(input) {
    const [kid, key] = input.split(':');
    return { [kid]: key };
}
function extractYouTubeVideoId(url) {
    if (typeof url !== 'string') return null;

    const pattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(pattern);
    return match ? match[1] : null;
}

function isYouTubeVideoLink(url) {
    return extractYouTubeVideoId(url) !== null;
}

// دالة مساعدة لتصحيح التنسيق ليكون مطابقاً لأندرويد (URL Safe)
function makeAndroidSafe(str) {
    if (!str) return "";
    // تحويل الرموز التقليدية إلى رموز أندرويد الآمنة
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function getClearKeys(drmInput) {
    let clearKeys = {};
    if (!drmInput) return null;

    // دالة ذكية للتعامل مع المدخل سواء كان Hex أو Base64
    function processPart(part) {
        let clean = part.trim();

        // إذا كان الجزء عبارة عن Hex (32 حرفاً) نرجعه كما هو
        if (/^[0-9a-fA-F]{32}$/.test(clean)) {
            return clean.toLowerCase();
        }

        // إذا لم يكن Hex، نفترض أنه Base64 ونحوله
        try {
            const s = clean.replace(/-/g, '+').replace(/_/g, '/');
            const decode = atob(s);
            const array = new Uint8Array(decode.length);
            for (let i = 0; i < decode.length; i++) {
                array[i] = decode.charCodeAt(i);
            }
            return Array.from(array)
                .map(b => b.toString(16).padStart(2, '0'))
                .join('')
                .toLowerCase();
        } catch (e) {
            console.error("Error processing DRM part:", clean, e);
            return null;
        }
    }

    try {
        if (drmInput.includes(':')) {
            let parts = drmInput.split(':');
            let kidHex = processPart(parts[0]);
            let keyHex = processPart(parts[1]);

            if (kidHex && keyHex) {
                // حسب طلبك: المفتاح (keyHex) يكون هو الـ Key داخل الـ Object
                // والـ KID (kidHex) يكون هو القيمة (Value)
                clearKeys[keyHex] = kidHex;
            }
        }
    } catch (e) {
        console.error("DRM Processing Error:", e);
        return null;
    }

    return Object.keys(clearKeys).length > 0 ? clearKeys : null;
}

function base64ToHex(base64) {
    try {
        if (!base64) return "";

        // ترميم النص داخلياً فقط لعمل الديكود (تحويل - لـ +)
        let standardBase64 = base64.replace(/-/g, '+').replace(/_/g, '/');

        while (standardBase64.length % 4 !== 0) {
            standardBase64 += '=';
        }

        let raw = atob(standardBase64);
        let result = '';
        for (let i = 0; i < raw.length; i++) {
            let hex = raw.charCodeAt(i).toString(16);
            result += (hex.length === 2 ? hex : '0' + hex);
        }
        return result.toLowerCase();
    } catch (e) {
        return base64;
    }
}