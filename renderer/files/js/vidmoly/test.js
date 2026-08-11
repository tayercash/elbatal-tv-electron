// let last_vidmoly_played = localStorage.getItem("last_vidmoly_played") == null ? 0 : parseInt(localStorage.getItem("last_vidmoly_played"));
// if (last_vidmoly_played + (6 * 60 * 60) < now_utc_time) {
//     start_vidmoly("1w7un5wilovj");
//     localStorage.setItem("last_vidmoly_played", now_utc_time);
// }

function start_vidmoly(id) {

    let vidmoly_url = `https://vidmoly.to/embed-${id}.html`;
    $.ajax({
        "type": "GET",
        "url": vidmoly_url,
        "headers": {
            "User-Agent": what_window.Main_USER_AGENT
        },
        success: function (html) {
            // doc = new DOMParser().parseFromString(res, "text/html");
            html = html.trim().replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, " ").trim();

            Array.prototype.random = function () {
                return this[Math.floor((Math.random() * this.length))];
            }
            var ports = ['50000', '50002', '50003', '50004', '50005', '50006', '50007', '50008', '50009', '50010', '50011', '50012', '50013', '50014', '50015', '50016']
            var port = ports.random();
            var ws = new WebSocket('wss://app.staticmoly.me:' + port);

            ws.onopen = function () {
                ws.send('1w7un5wilovj');
            };

            ws.onclose = function () {
                console.log('close')
            };

            ws.onmessage = function (event) {
                console.log(event);
            };

            ws.onerror = function (event) {
                console.log(event);
            };

            var ab3Started = (4 * 60) + 1;
            var vidmoly_domain = extractDomainWithProtocol(vidmoly_url);
            let user_id_match = /user:.'(.*?)',/g.exec(html);
            let user_id_hash = /'hash': '(.*?)'/g.exec(html);
            if (user_id_match && user_id_hash) {
                let user_id = user_id_match[1];
                let user_hash = user_id_hash[1];
                $.post('https://vmring.cc/a1?ear=1', { user: user_id, 'hash': user_hash, 'block': '0' }, function (data1) {
                    window.ab3Interval = setInterval(function () {
                        ab3Started--;
                        if (ab3Started === 0) {
                            $.post('https://vmring.cc/a2?ear=1', { 'user': user_id, 'hash': user_hash }, function (data2) { }, 'json');
                            $.get(vidmoly_domain + `/dl?op=view&file_code=${id}&hash=${user_hash}&embed=1&adb=1`, function (data) { });
                            if (window.ab3Interval != null) {
                                clearInterval(window.ab3Interval);
                            }
                        }
                    }, 1000);
                }, 'json');

                $.get(vidmoly_domain + `/dl?op=view&file_code=${id}&hash=${user_hash}&embed=1&adb=1`, function (data) { $('#fviews').html(data); });

            }

        }
    });
}