$(".posts_container").html("");
load_servers_btns();
function load_servers_btns() {
    $("#search_in_channels").hide();

    for (const key in mou_channels_servers) {
        if (!mou_channels_servers[key].working_state) {
            delete mou_channels_servers[key];
        }
    }

    if (Object.keys(mou_channels_servers).length > 0) {
        if (Object.keys(mou_channels_servers).length == 1) {
            load_channels_server(Object.keys(mou_channels_servers)[0])
        } else {
            $(".channels_loading").hide();

            servers_div = $(`<div class="channels_cats_btns" data-id="0"></div>`);


            for (i = 0; i < Object.keys(mou_channels_servers).length; i++) {
                channels_server_name = Object.keys(mou_channels_servers)[i];
                channels_server = mou_channels_servers[channels_server_name];
                channels_server_title = channels_server.server_title;
                channels_working_state = channels_server.working_state;
                if (channels_working_state == true) {

                    server_btn = `<button class="server_btn mou_box_shadow" onclick="load_channels_server('${channels_server_name}')"><span class="server_icon_container"><i class="fas fa-tv"></i></span><span class="server_text">${channels_server_title}</span></button>`;
                    $(servers_div).append(server_btn);
                }

            }
            $(".channels_cats_btns_container").append(servers_div);
        }
    }

}
function load_channels_server(server_name) {

    now_channels_server = mou_channels_servers[server_name];
    get_channels_res();

    if (typeof now_channels_server["search_url"] !== "undefined") {
        $("#search_in_channels").show();
    } else {
        $("#search_in_channels").hide();
    }

}
function get_channels_res(url = false, cat_load_type = "cats", from_action = "channels_page") {
    $(".channels_ul").html("");
    $(".cat_channels").hide();
    $(".channels_loading").show();
    $(".channels_cats_btns_container").hide();

    // $(".channels_cats_btns").html("").hide();

    now_channels_server.get_res(url, cat_load_type, from_action, function (ret) {
        $(".channels_loading").hide();

        if (ret["type"] == "cats") {
            $(".channels_cats_btns_container [data-id]").hide();
            $(".channels_cats_btns_container").show();

            last_cats_id = $(".channels_cats_btns_container [data-id]").length > 0 ? $(".channels_cats_btns_container [data-id]").last().attr("data-id") : 0;

            channels_div = $(`<div class="channels_cats_btns" data-id="${last_cats_id++}"></div>`);

            for (i = 0; i < ret["cats"].length; i++) {
                cat = ret["cats"][i];
                cat_name = cat["name"];
                cat_load_type = cat["load_type"];
                cat_url = cat["url"];

                cat_btn = `<button class="server_btn mou_box_shadow" onclick="get_channels_res('${cat_url}','${cat_load_type}')"><span class="server_icon_container"><i class="fas fa-tv"></i></span><span class="server_text">${cat_name}</span></button>`;
                $(channels_div).append(cat_btn);

            }
            $(".channels_cats_btns_container").append(channels_div);
            what_window.back_buttons_functions.Unshift(function () {
                $(".channels_cats_btns_container [data-id]").last().remove();
                $(".channels_cats_btns_container [data-id]").last().show();
            });
        } else if (ret["type"] == "channels") {
            // Show_magic(function () {
            $(".cat_channels").show();


            if (ret["channels"].length > 0) {

                for (i = 0; i < ret["channels"].length; i++) {
                    channel = ret["channels"][i];

                    channel_id = channel["id"];
                    channel_name = channel["name"];
                    channel_url = channel["url"];
                    channel_logo = channel["logo"];

                    post_div = $(`<a class="vide_container" onclick="load_channel('${channel_name}','${channel_url}')">
                        <div class="vide_container_overlay"></div>
                        <span
                        class="vide_thump lazy_poster_img" data-poster_img="${channel_logo}"></span>
                        <div class="vide_disc">
                            <div class="about_vid">
                                <div class="vid_detailes_container">
                                    <h3>${channel_name}</h3>
                                </div>
                            </div>
                        </div>
                    </a>`);
                    $(".channels_ul").append($(post_div));

                }
                lazyload();

                what_window.back_buttons_functions.Unshift(function () {
                    $(".cat_channels").hide();
                    $(".channels_cats_btns_container").show();
                });
            } else {
                if (from_action == "search") {
                    $(".channels_loading").html("لا يوجد نتائج").show();
                }
            }
            // });
        }

    })
}


$("#search_in_channels").click(function () {
    $("#channels_search .aflam_search_key").val("");
    $("#channels_search").openpopup();
    $("#channels_search .aflam_search_key").focus();
    what_window.back_buttons_functions.Unshift(function () {
        $("#channels_search").closepopup();
    });
});
$("#channels_search .aflam_search_key").keypress(function (event) {
    if (event.keyCode == 13) {
        $("#submit_search_in_channels").click();
    }
});
$("#submit_search_in_channels").off("click");
$("#submit_search_in_channels").click(function () {

    search_key = $("#channels_search .aflam_search_key").val();
    if (search_key == "") {
        showToast("يرجي ادخال كلمة البحث");
    } else {
        $("#channels_search").closepopup();

        $(".channels_loading").html(`<i class="fas fa-circle-notch fa-spin"></i> جاري البحث عن ${search_key}`);

        search_url = now_channels_server.search_url(search_key);
        get_channels_res(search_url, "channels", "search");

    }


});