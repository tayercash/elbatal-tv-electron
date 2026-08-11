if (typeof mouscripts !== "undefined") {

    // vid_url = "https://deva-cpmav9sk6x.cimanowtv.com/e/44p43fofgxwv";
    // where_file = is_app_in_dev_mode == true ? "1" : "2";
    // mouscripts.play_vid(vid_url, "كيفية احضار كود التفعيل لتطبيق Elbatal TV", "", `{"referer":"https://bs.cimanow.cc/"}`, false, false, "", "WebPlayer", false, "files/js/helpers/cimanow_web_helper.js", where_file);

    // mouscripts.play_vid("https://ssc3-ak.akamaized.net/out/v1/42e86125555242aaa2a12056832e7814/index.mpd", "كيفية احضار كود التفعيل لتطبيق Elbatal TV", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36", `{"Origin":"https://www.ipslow.com"}`, false, false, "", "Elbatal", false, "", "");

    // mouscripts.getOstora("https://1aqb7a3082mbj7ikoi6u5ftferpqijmc9fq21po63xx2zzkyxrv8w4psdv0nl1a.ross-bass.shop/api/matches.php");

}
if (typeof mouscripts !== "undefined") {
    // what_window.check_elplayer_version();
}

function get_yacin(url) {
    get_yacin_res(url, function (res) {
        console.log(res);
    });
}
$("#open_aflam_w_muslslat").click(function () {
    $(`[data-full_iframe_target_url="movies.html"]`).parents("li").click();
})
$("#open_gdwal_elmobrayat").click(function () {
    $(`[data-full_iframe_target_url="matches_table.html"]`).parents("li").click();
});
$("#open_channels").click(function () {
    $(`[data-full_iframe_target_url="chnnels.html"]`).parents("li").click();
});
$("[data-open_server]").click(function () {
    server_name = $(this).attr("data-open_server");

    if (server_name == "quran_kareem") {
        server_url = "Quran.html";
    } else {
        server_url = "movies.html?film_server_name=" + server_name;
    }

    open_film_on_iframe("#servers_frame", server_url);
});

// $("#home_ad").html(get_ad_iframe());
// $('[data-full_iframe_target_url="matches_table.html"]').click();

window.addEventListener('resize', resize_text, true);
function resize_text() {
    var text_class = "mou_resize_text";
    var text_size = 8;
    elmnt = $("." + text_class);

    $(elmnt).each(function () {
        text_size = parseInt($(this).attr("data-textsize"));
        elmnt_width = $(this).parent().width();
        new_text_size = text_size / 100 * elmnt_width;
        $(this)[0].style.setProperty('font-size', new_text_size + "px", 'important');
    });

}
$(document).ready(function () {
    $(".preloader").css("display", "none");
    $(".home_posts_container").css("display", "block");
    resize_text();

});

function open_matches_table() {
    $(`[data-full_iframe_target_url="matches_table.html"]`).click();
}
function open_channels() {
    $(`[data-full_iframe_target_url="chnnels.html"]`).click();
}

$("#full_search").off().click(function () {
    $("#full_search_pop").openpopup();
})