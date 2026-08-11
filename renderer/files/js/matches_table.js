active_table = "filgoal";

loader_match_div = `<div class="match mou_box_shadow"><div class="mou_match"><div class="team team_1"><div class="team_logo"><div class="loader_content"></div></div><span class="team_name" style="width: 60%;"><div class="loader_content"></div></span></div><div class="match_center" style="grid-template-columns: 1fr;"><div><div class="loader_content"></div></div></div><div class="team team_2"><div class="team_logo"><div class="loader_content"></div></div><span class="team_name" style="width: 60%;"><div class="loader_content"></div></span></div></div></div>`;
for (i = 0; i < 5; i++) {
    $(".matches_container").append(loader_match_div);
}

var date_ob = new Date();
var date = date_ob.getDate();
var month = date_ob.getMonth() + 1;
var date_string = ("0" + date).slice(-2);
var month_string = ("0" + month).slice(-2);
var year_string = date_ob.getFullYear();

var today_date = year_string + "-" + month_string + "-" + date_string;
// var today_date = "2023-08-03";

$("#matches_date").val(today_date);
var min_date = year_string + "-" + ("0" + (month - 1)).slice(-2) + "-01";
$("#matches_date").attr("min", min_date);
var max_date = year_string + "-" + ("0" + (month + 1)).slice(-2) + "-" + ("0" + date).slice(-2);
$("#matches_date").attr("max", max_date);

now_table_api_url = mou_matches_table_servers_array[active_table]["api_url"] + "?date=" + today_date;

mou_matches_table_servers_array[active_table]["get_matches_json"]();

function show_matches(matches) {
    $(".match").remove();
    all_matches_div = "";

    liga_names = [];

    if (matches.length == 0) {
        $(".matches_container").parent().prepend(`<span class="mou_btn alert no_matches_alert"><i class="fas fa-exclamation-triangle yellow"></i>  لا يوجد مباريات هامه لهذا اليوم</span>`);
    }

    for (i = 0; i < matches.length; i++) {
        let match = matches[i];

        new_time = new Date(match.time_stamp);
        match_hour = new_time.getHours();
        suffix = match_hour >= 12 ? "م" : "ص";
        match_hours = ((match_hour + 11) % 12 + 1);
        match_time_text = zeroFill(match_hours, 2) + ":" + zeroFill(new_time.getMinutes(), 2) + " " + suffix;

        match_channels = match["channels"];

        stad_div = (typeof match.stadium_Name !== "undefined" && match.stadium_Name !== null) ? `<li class="match_stad"><span><svg class="mou_icon icon-soccer-court"><use xlink:href="#icon-soccer-court"></use></svg><span class="stad_name">${match.stadium_Name}</span></span></li>` : "";

        match_ch_name = typeof match["tv_channel_name"] !== "undefined" ? match["tv_channel_name"] : "";

        matche_div = `<button class="match mou_box_shadow" data-match_id="${match.id}"><mou_json style="display:none;">${JSON.stringify(match)}</mou_json><div class="mou_match" >
        <div class="team team_1">
            <img src="${match.team_1_logo}" class="team_logo" width="40" height="40">
            <span class="team_name"><span>${match.team_1_name}</span></span>
        </div>
        <div class="match_center">
            <div class="team_score team_1_score">${match.team_1_score}</div>
            <div class="time_center">
                <span class="mou_match_time">${match_time_text}</span>
                <span class="mou_match_status"></span>
            </div>
            <div class="team_score team_2_score">${match.team_2_score}</div>
        </div>
        <div class="team team_2">
            <img src="${match.team_2_logo}" class="team_logo">
            <span class="team_name"><span>${match.team_2_name}</span></span>
        </div>
    </div>
    
    <div class="info">

        <div class="countdown">

            <div class="match_start_in countdown_timer" data-mou_match_status="${match.status}" data-mou_match_start_in="${match.time_stamp}">
            
            </div>

        </div>

        <ul>
            ${stad_div}
        </ul>

    </div>

    </button>`;


        if (liga_names.includes(match.league_name)) {



        } else {
            liga_names.push(match.league_name);

            liga_div = `<div class="liga_container" data-liga_name="${match.league_name}"><div class="liga_name mou_box_shadow" style="border-color:${stringToColour(match.league_name)};">${match.league_name}</div><div class="liga_matches"></div></div>`;
            $(".matches_container").append(liga_div);
        }


        $(`.liga_container[data-liga_name='${match.league_name}'] .liga_matches`).append(matche_div);

    }

    // sorter_matches = $("<div>" + all_matches_div + "</div>");

    // if (order_matches == true) {

    //     matches_div_array = $(sorter_matches).find(".match");
    //     matches_div_array.sort(function (a, b) {
    //         a_attr = parseInt($(a).find("[data-mou_match_start_in]").attr('data-mou_match_start_in'));
    //         b_attr = parseInt($(b).find("[data-mou_match_start_in]").attr('data-mou_match_start_in'));
    //         now_now = new Date().getTime();
    //         if (a_attr - now_now < -(105 * 60000)) {
    //             return 1;
    //         }
    //         if (b_attr - now_now < -(105 * 60000)) {
    //             return -1;
    //         }
    //         if (a_attr > b_attr) {
    //             return 1;
    //         } else if (a_attr < b_attr) {
    //             return -1;
    //         } else {
    //             return 0;
    //         }
    //     }).appendTo(".matches_container");
    //     // $(".matches_container").html($(matches_div_array));
    // } else {
    //     $(".matches_container").html(all_matches_div);
    // }

    ready_mou_matches_timers();
}

if (typeof timerArray !== "undefined") {
    for (var i = 0; i < timerArray.length; i++) {
        clearInterval(timerArray[i]);
    }
}

var timerArray = [];
function ready_mou_matches_timers() {
    for (var i = 0; i < timerArray.length; i++) {
        clearInterval(timerArray[i]);
    }

    timerArray = [];
    $('[data-mou_match_start_in]').each(function (index) {
        var finalTime = $(this).attr('data-mou_match_start_in');
        ready_mou_matches_timers_loop(index, finalTime);
        var x = setInterval(function () {
            ready_mou_matches_timers_loop(index, finalTime);
        }, 1000);
        timerArray.push(x);
    });
}

function ready_mou_matches_timers_loop(thisIndex, finalTime) {
    var now = new Date().getTime();

    var distance = finalTime - now;
    var timers_days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var timers_hours = zeroFill(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), 2);
    var timers_minutes = zeroFill(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)), 2);
    var timers_seconds = zeroFill(Math.floor((distance % (1000 * 60)) / 1000), 2);
    timer_html = "";
    if (timers_days > 0) {
        timer_html += `<div class="mou_box_shadow"><span class="count">${timers_days}</span><div class="name">يوم</div></div>`;
    }
    // timer_html = `<h4 class="title">باقي علي المباراة : </h4>`;
    timer_html += `<div class="mou_box_shadow"><span class="count">${timers_hours}</span><div class="name">ساعة</div></div>`;
    timer_html += `<div class="mou_box_shadow"><span class="count">${timers_minutes}</span><div class="name">دقيقة</div></div>`;
    timer_html += `<div class="mou_box_shadow"><span class="count">${timers_seconds}</span><div class="name">ثانيه</div></div>`;

    $('[data-mou_match_start_in]').eq(thisIndex).html(timer_html);

    $('[data-mou_match_start_in]').eq(thisIndex).parents(".match").find(".mou_match_time").css("display", "block");

    if (distance < 15 * 60000) {

        $('[data-mou_match_start_in]').eq(thisIndex).parents(".match").addClass("animation").addClass("Nearstart");

        $('[data-mou_match_start_in]').eq(thisIndex).parents(".match").find(".mou_match_time").css("display", "none");
        $('[data-mou_match_start_in]').eq(thisIndex).parents(".match").find(".mou_match_status").html(`<span>اقتربت</span>`);
    }
    if (distance < 0) {
        $('[data-mou_match_start_in]').eq(thisIndex).parents(".match").removeClass("Nearstart").addClass("live");

        $('[data-mou_match_start_in]').eq(thisIndex).parents(".match").find(".mou_match_time").css("display", "none");
        $('[data-mou_match_start_in]').eq(thisIndex).parents(".countdown").css("display", "none");
        $('[data-mou_match_start_in]').eq(thisIndex).parents(".match").find(".mou_match_status").html(`<span>مباشر ${Math.abs(timers_minutes)}\'</span>`);
        $('[data-mou_match_start_in]').eq(thisIndex).html(``);

    }
    if (distance < -(45 * 60000)) {
        $('[data-mou_match_start_in]').eq(thisIndex).parents(".match").removeClass("Nearstart").removeClass("live").addClass("betmatch");

        $('[data-mou_match_start_in]').eq(thisIndex).parents(".match").find(".mou_match_time").css("display", "none");
        $('[data-mou_match_start_in]').eq(thisIndex).parents(".match").find(".mou_match_status").html(`<span>بين الشوطين</span>`);
        $('[data-mou_match_start_in]').eq(thisIndex).html(``);

    }
    if (distance < -(62 * 60000)) {
        $('[data-mou_match_start_in]').eq(thisIndex).parents(".match").removeClass("Nearstart").removeClass("betmatch").addClass("live");
        $('[data-mou_match_start_in]').eq(thisIndex).parents(".match").find(".mou_match_time").css("display", "none");
        $('[data-mou_match_start_in]').eq(thisIndex).parents(".match").find(".mou_match_status").html(`<span>مباشر ${Math.abs(timers_minutes - 43)}\'</span>`);
        $('[data-mou_match_start_in]').eq(thisIndex).html(``);

    }
    if (distance < -(107 * 60000)) {
        end_match(thisIndex);
    }
}

function end_match(thisIndex) {
    clearInterval(timerArray[thisIndex]);

    $('[data-mou_match_start_in]').eq(thisIndex).parents(".match").removeClass("Nearstart").removeClass("betmatch").removeClass("live").removeClass("animation").addClass("match_ended");
    $('[data-mou_match_start_in]').eq(thisIndex).parents(".match").find(".mou_match_time").css("display", "block");
    $('[data-mou_match_start_in]').eq(thisIndex).parents(".match").find(".mou_match_status").html(`<span>انتهت</span>`);
    $('[data-mou_match_start_in]').eq(thisIndex).html(``);
}

function zeroFill(number, width) {
    width -= number.toString().length;
    if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number + ""; // always return a string
}

$(document).on("click", ".ch_box", function () {
    ch_name = $(this).find(".ch_name").text().trim();
    get_ch_sources_from_blogger(ch_name);
});
function play_ch_box(ch_name) {
    // 1. استخدام jQuery لفتح البوب أب وتعيين النصوص
    $("#full_ch_search").openpopup(ch_name);
    $(".full_ch_searching_for").text(ch_name);
    $(".search_servers_container").empty(); // أسرع من html("")

    // 2. تصفية السيرفرات: الأفضل إنشاء نسخة جديدة بدل الحذف أثناء الـ Loop
    const activeServers = Object.keys(mou_channels_servers).filter(key => {
        return mou_channels_servers[key].working_state;
    });

    // 3. Loop نظيف باستخدام forEach لضمان عزل المتغيرات (Scope)
    activeServers.forEach(server_key => {
        const now_server = mou_channels_servers[server_key];
        const server_title = now_server.server_title;

        // إضافة حاوية السيرفر
        const $serverContainer = $(`
            <div class="search_server_container" data-server_name="${server_key}">
                <span class="header_title">${server_title}</span>
                <div class="channels_loading">
                    <i class="fas fa-circle-notch fa-spin"></i> جاري التحميل...
                </div>
            </div>
        `);

        $(".search_servers_container").append($serverContainer);

        // 4. طلب البحث
        const search_url = now_server.search_url(ch_name, "table");

        now_server.get_res(search_url, "channels", "search", function (ret) {
            // نستخدم server_key الأصلي هنا لضمان الدقة في الـ Callback
            const $currentContainer = $(`.search_server_container[data-server_name='${server_key}']`);
            const $loader = $currentContainer.find(".channels_loading");

            if (ret && ret.channels && ret.channels.length > 0) {
                const $channels_ul = $('<div class="channels_ul"/>');

                ret.channels.forEach(channel => {
                    const ch_item = `
                        <a class="vide_container" onclick="load_channel('${channel.name.replace(/'/g, "\\'")}','${channel.url}','${server_key}')">
                            <div class="vide_container_overlay"></div>
                            <span class="vide_thump lazy_poster_img" data-poster_img="${channel.logo}"></span>
                            <div class="vide_disc">
                                <div class="about_vid">
                                    <div class="vid_detailes_container">
                                        <h3>${channel.name}</h3>
                                    </div>
                                </div>
                            </div>
                        </a>`;
                    $channels_ul.append(ch_item);
                });

                $loader.hide();
                $currentContainer.append($channels_ul);

                // تشغيل اللازي لود بعد إضافة العناصر
                if (typeof lazyload === "function") lazyload();

            } else {
                $loader.html('<i class="fas fa-exclamation-circle"></i> لا يوجد نتائج').show();
            }
        });
    });
}

function ready_match_click() {
    $(".mou_match").off("click");
    // $(".ch_box").off("click");

    $(".mou_match").click(function () {


        // if (!$(this).hasClass("active")) {
        //     // $(this).parents(".match").find(".info").removeClass("slideUp").addClass("slideDown");
        //     $(this).parents(".match").find(".info").slideDown(150);

        //     $(this).addClass("active");
        // } else {
        //     // $(this).parents(".match").find(".info").removeClass("slideDown").addClass("slideUp");

        //     $(this).parents(".match").find(".info").slideUp(150);


        //     $(this).removeClass("active");
        // }
    });


}

function stringToColour(string, saturation = 100, lightness = 75) {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    return `hsl(${(hash % 360)}, ${saturation}%, ${lightness}%)`;
}


function copy_to_clipboard(text = "") {
    text_area = $(`<textarea style="position:fixed;"></textarea>`);
    $(text_area).text(text);
    $(text_area).appendTo("body");
    $(text_area).focus();
    $(text_area).select();
    try {
        successful = document.execCommand('copy');
        msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
    }
    $(text_area).remove();
}

// $("#change_date").click(function(){
//     $("#matches_date").click();
// })

$("#matches_date").change(function () {
    $(".no_matches_alert").remove();

    $(".matches_container").html("");
    ready_mou_matches_timers();
    loader_match_div = `<button class="match mou_box_shadow"><div class="mou_match"><div class="team team_1"><div class="team_logo"><div class="loader_content"></div></div><span class="team_name" style="width: 60%;"><div class="loader_content"></div></span></div><div class="match_center" style="grid-template-columns: 1fr;"><div><div class="loader_content"></div></div></div><div class="team team_2"><div class="team_logo"><div class="loader_content"></div></div><span class="team_name" style="width: 60%;"><div class="loader_content"></div></span></div></div></button>`;
    for (i = 0; i < 5; i++) {
        $(".matches_container").append(loader_match_div);
    }


    new_date = $(this).val();
    if (new_date == "") {
        var date_ob = new Date();
        var date = date_ob.getDate();
        var month = date_ob.getMonth() + 1;
        var date_string = ("0" + date).slice(-2);
        var month_string = ("0" + month).slice(-2);
        var year_string = date_ob.getFullYear();

        var today_date = year_string + "-" + month_string + "-" + date_string;
        new_date = today_date;
        $("#matches_date").val(today_date);
        return false;;
    }
    now_table_api_url = mou_matches_table_servers_array[active_table]["api_url"] + "?date=" + new_date;
    mou_matches_table_servers_array[active_table]["get_matches_json"]();
});



$(document).off("click", ".mou_match");
$(document).on("click", "button.match", function () {
    if ($(this).parents(".match_container").length == 0) {

        matches_content_scrolled_from_top = $(document).scrollTop();
        $(".matches_container").hide();
        $("#matches_date").hide();

        title_before = $("#extra_title").text();
        what_window.back_buttons_functions.Unshift(function () {
            $("#extra_title").text(title_before);
            $(".matches_container").show();
            $("#matches_date").show();
            $(".full_match_container").hide();
            $(document).scrollTop(matches_content_scrolled_from_top);

        });

        loader_match_div = `<div class="match mou_box_shadow"><div class="mou_match"><div class="team team_1"><div class="team_logo"><div class="loader_content"></div></div><span class="team_name" style="width: 60%;"><div class="loader_content"></div></span></div><div class="match_center" style="grid-template-columns: 1fr;"><div><div class="loader_content"></div></div></div><div class="team team_2"><div class="team_logo"><div class="loader_content"></div></div><span class="team_name" style="width: 60%;"><div class="loader_content"></div></span></div></div></div>`;

        $(".match_container").html(loader_match_div);
        $(".full_match_container").show();


        mou_matches_table_servers_array[active_table]["load_match_data"]($(this), function (match_data) {


            match = match_data;
            $("#extra_title").text(" - " + match.team_1_name + " ضد " + match.team_2_name);


            match_channels = match["channels"];

            new_time = new Date(match.time_stamp);
            match_hour = new_time.getHours();
            suffix = match_hour >= 12 ? "م" : "ص";
            match_hours = ((match_hour + 11) % 12 + 1);
            match_time_text = zeroFill(match_hours, 2) + ":" + zeroFill(new_time.getMinutes(), 2) + " " + suffix;


            channels_div = "";
            if (match_channels.length > 0) {
                channels_div = `<div class="mou_vid_container" id="msader_elmoshda" style="">
                <h5 class="header-title">المشاهدة</h5>
                <div class="watch_sources">`;
                for (e = 0; e < match_channels.length; e++) {

                    ch_name = match_channels[e]["tv_channel_name"];
                    ch_comentator = match_channels[e]["commenter_name"];
                    ch_title = ch_name;
                    if (typeof ch_comentator !== "undefined" && ch_comentator !== null) {
                        ch_title = ch_title + " - تعليق " + ch_comentator;
                        // channels_div += `<span class="ch_comentator">${ch_comentator}</span>`;
                    }

                    channels_div = channels_div + `<span class="mou_btn" onclick="play_ch_box(\`${ch_name}\`)"><svg class="mou_icon icon-soccer-court"><use xlink:href="#fb_screen"></use></svg>${ch_title}</span>`;

                }
                channels_div += '</div></div>';
            }

            match_data = "";

            if (typeof match.stadium_Name !== "undefined" && match.stadium_Name !== null) {
                match_data += `<div><svg class="mou_icon"><use xlink:href="#icon-soccer-court"></use></svg><span class="stad_name">${match.stadium_Name}</span></div>`;
            }
            dateFormat = new Date(match.time_stamp);
            match_full_date = zeroFill(dateFormat.getDate(), 2) +
                " " + get_month_name(dateFormat.getMonth() + 1) +
                " " + dateFormat.getFullYear() +
                " " + zeroFill(dateFormat.getHours(), 2) +
                ":" + zeroFill(dateFormat.getMinutes(), 2);
            match_data += `<div><svg class="mou_icon"><use xlink:href="#fb_calendar"></use></svg><span class="fulldate">${match_full_date}</span></div>`;

            this_matche_div = `<div class="match mou_box_shadow" data-match_id="${match.id}"><mou_json style="display:none;">${JSON.stringify(match)}</mou_json><div class="mou_match" >
        <div class="team team_1">
            <img src="${match.team_1_logo}" class="team_logo" width="40" height="40">
            <span class="team_name"><span>${match.team_1_name}</span></span>
        </div>
        <div class="match_center">
            <div class="team_score team_1_score">${match.team_1_score}</div>
            <div class="time_center">
                <span class="mou_match_time">${match_time_text}</span>
                <span class="mou_match_status"></span>
            </div>
            <div class="team_score team_2_score">${match.team_2_score}</div>
        </div>
        <div class="team team_2">
            <img src="${match.team_2_logo}" class="team_logo">
            <span class="team_name"><span>${match.team_2_name}</span></span>
        </div>
    </div>
    
    <div class="info">

        <div class="countdown">

            <div class="match_start_in match_countdown_timer countdown_timer" data-mou_match_start_in="${match.time_stamp}">
            
            </div>

        </div>
        
        <div class="match_data">${match_data}</div>
    </div>

    </div>   

    ${channels_div}
    
    `;
            $(".match_container").html(this_matche_div);

            if (ready_match_timer() !== false) {
                match_timer = setInterval(function () {
                    ready_match_timer();
                }, 1000);
            }


        });

    }

});

function ready_match_timer() {

    var finalTime = $('.match_container .match').find("[data-mou_match_start_in]").attr('data-mou_match_start_in');

    var now = new Date().getTime();
    var distance = finalTime - now;
    var timers_days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var timers_hours = zeroFill(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), 2);
    var timers_minutes = zeroFill(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)), 2);
    var timers_seconds = zeroFill(Math.floor((distance % (1000 * 60)) / 1000), 2);
    timer_html = "";
    if (timers_days > 0) {
        timer_html += `<div class="mou_box_shadow"><span class="count">${timers_days}</span><div class="name">يوم</div></div>`;
    }
    // timer_html = `<h4 class="title">باقي علي المباراة : </h4>`;
    timer_html += `<div class="mou_box_shadow"><span class="count">${timers_hours}</span><div class="name">ساعة</div></div>`;
    timer_html += `<div class="mou_box_shadow"><span class="count">${timers_minutes}</span><div class="name">دقيقة</div></div>`;
    timer_html += `<div class="mou_box_shadow"><span class="count">${timers_seconds}</span><div class="name">ثانيه</div></div>`;

    $('.match_container .match').find("[data-mou_match_start_in]").html(timer_html);

    $('.match_container .match').find(".mou_match_time").css("display", "block");

    if (distance < 15 * 60000) {

        $('.match_container .match').addClass("animation").addClass("Nearstart");

        $('.match_container .match').find(".mou_match_time").css("display", "none");
        $('.match_container .match').find(".mou_match_status").html(`<span>اقتربت</span>`);
    }
    if (distance < 0) {
        $('.match_container .match').removeClass("Nearstart").addClass("live");

        $('.match_container .match').find(".mou_match_time").css("display", "none");
        $('.match_container .match .countdown').css("display", "none");
        $('.match_container .match').find(".mou_match_status").html(`<span>مباشر ${Math.abs(timers_minutes)}\'</span>`);
        $('.match_container .match').find("[data-mou_match_start_in]").html(``);

    }
    if (distance < -(45 * 60000)) {
        $('.match_container .match').removeClass("Nearstart").removeClass("live").addClass("betmatch");

        $('.match_container .match').find(".mou_match_time").css("display", "none");
        $('.match_container .match').find(".mou_match_status").html(`<span>بين الشوطين</span>`);
        $('.match_container .match').find('[data-mou_match_start_in]').html(``);

    }
    if (distance < -(62 * 60000)) {
        $('.match_container .match').removeClass("Nearstart").removeClass("betmatch").addClass("live");
        $('.match_container .match').find(".mou_match_time").css("display", "none");
        $('.match_container .match').find(".mou_match_status").html(`<span>مباشر ${Math.abs(timers_minutes - 43)}\'</span>`);
        $('.match_container .match').find('[data-mou_match_start_in]').html(``);

    }
    if (distance < -(107 * 60000)) {

        $('.match_container .match').removeClass("Nearstart").removeClass("betmatch").removeClass("live").removeClass("animation").addClass("match_ended");
        $('.match_container .match').find(".mou_match_time").css("display", "block");
        $('.match_container .match').find(".mou_match_status").html(`<span>انتهت</span>`);
        $('.match_container .match').find('[data-mou_match_start_in]').html(``);
        if (typeof match_timer == "number") {
            clearInterval(match_timer);
        }
        return false;
    }
}