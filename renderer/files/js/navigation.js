var now_navigation_link_index = 0;
$(".navigation ul li.list").click(function () {
    scrolled_from_top = $(document).scrollTop();
    $(".navigation ul li.list").eq(now_navigation_link_index).attr("data-scrolled_from_top", scrolled_from_top);
    old_navigation_link = $(".navigation ul li.list").eq(now_navigation_link_index).find("a").attr("data-full_iframe_target_url");
    // $("#header_title").text("البطل");

    $(".navigation ul li.list").removeClass("active");
    $(this).addClass("active");



    now_navigation_link_index = $(".navigation ul li.list").index(this);
    fix_indicator_positon();
    new_navigation_link = $(this).find("a").attr("data-full_iframe_target_url");

    $("[data-side_full_iframe_target_url]").removeClass("active");
    $(`[data-side_full_iframe_target_url="${new_navigation_link}"]`).addClass("active");


    $("[data-navigation_url]").addClass("hidden");

    nav_header_title = typeof $(this).attr("data-header_title") !== "undefined" ? " - " + $(this).attr("data-header_title") : "";
    $("#extra_title").text(nav_header_title);


    if ($(`[data-navigation_url="${new_navigation_link}"]`).length > 0) {
        $(`[data-navigation_url="${new_navigation_link}"]`).removeClass("hidden");

        if (new_navigation_link == old_navigation_link) {
            load_navigation_html_content(new_navigation_link, "reload");
        } else {
            latest_scrolled_from_top = parseInt($(this).attr("data-scrolled_from_top"));
            $(document).scrollTop(latest_scrolled_from_top);
            resize_text();
        }
    } else {
        load_navigation_html_content(new_navigation_link);
    }



});
$("[data-side_full_iframe_target_url]").click(function () {
    scrolled_from_top = $("#content").scrollTop();
    $("[data-side_full_iframe_target_url].active").attr("data-scrolled_from_top", scrolled_from_top);

    old_navigation_link = $("[data-side_full_iframe_target_url].active").attr("data-side_full_iframe_target_url");
    new_navigation_link = $(this).attr("data-side_full_iframe_target_url");

    $(".navigation ul li.list").removeClass("active");
    $(`[data-full_iframe_target_url="${new_navigation_link}"]`).parents(".list").addClass("active");
    now_navigation_link_index = $(".navigation ul li.list").index($(`[data-full_iframe_target_url="${new_navigation_link}"]`).parents(".list"));
    fix_indicator_positon();


    $("[data-side_full_iframe_target_url]").removeClass("active");
    $(this).addClass("active");

    $("[data-navigation_url]").addClass("hidden");

    if ($(`[data-navigation_url="${new_navigation_link}"]`).length > 0) {
        $(`[data-navigation_url="${new_navigation_link}"]`).removeClass("hidden");

        if (new_navigation_link == old_navigation_link) {
            load_navigation_html_content(new_navigation_link, "reload");
        } else {
            latest_scrolled_from_top = parseInt($(this).attr("data-scrolled_from_top"));
            $("#content").scrollTop(latest_scrolled_from_top);
            resize_text();
        }
    } else {
        load_navigation_html_content(new_navigation_link);
    }

})

function load_navigation_html_content(new_navigation_link, type = "first_load") {
    $(document).ready(function () {

        $.ajax({
            "type": "GET",
            "url": new_navigation_link,
            success: function (res, status, xhr) {
                if (xhr.status == 200) {

                    doc = $(res).wrapAll('<div>').parent();
                    $(doc).find("script[src]").each(function () {
                        source_link = $(this).attr("src");
                        new_source_link = source_link.includes("?") ? source_link + "&" : source_link + "?" + "token=" + Date.now();
                        $(this).attr("src", new_source_link);
                    });
                    res = $(doc).html();
                    new_html = $(`<div data-navigation_url="${new_navigation_link}" class="show">${res}</div>`);

                    if (type == "reload") {
                        $(`[data-navigation_url="${new_navigation_link}"]`).remove();
                    }

                    if ($(new_html).find("#header_actions").length > 0) {
                        action_btns = $(new_html).find("#header_actions").html();
                        $("#header_actions").append(`<div data-navigation_url="${new_navigation_link}">` + action_btns + `<div>`);
                        $(new_html).find("#header_actions").remove();
                    }
                    $("#content").append(new_html);
                    now_active_panal = $(".navigation ul li.list.active").index();
                    if (typeof what_window["back_buttons_functions_" + what_window.now_active_panal] == "undefined") {
                        what_window["back_buttons_functions_" + what_window.now_active_panal] = [];
                    }
                    readypopups();
                    resize_text();
                    fix_tabindex();

                }
            }
        });
    });


}

function fix_indicator_positon(animation = true) {
    if (document.querySelectorAll(".navigation ul").length == 0) {
        return false;
    }
    navigation_width = document.querySelectorAll(".navigation ul")[0].getBoundingClientRect().width;
    navigation_link_width = document.querySelectorAll(".navigation ul li")[0].getBoundingClientRect().width;
    // navigation_links_num = navigation_width / navigation_link_width;
    navigation_links_num = document.querySelectorAll(".navigation ul li").length;
    indicator = document.querySelectorAll(".navigation .indicator");
    indicator_width = indicator[0].getBoundingClientRect().width;
    if (animation == true) {
        indicator[0].classList.add("animation");
    } else {
        indicator[0].classList.remove("animation");
    }
    if (typeof document.getElementsByTagName('html')[0].getAttribute('dir') !== "undefined" && document.getElementsByTagName('html')[0].getAttribute('dir') == "rtl") {
        indicator[0].style.cssText += `transform: translateX(-${now_navigation_link_index * navigation_link_width}px);`;
    } else {
        indicator[0].style.cssText += `transform: translateX(${now_navigation_link_index * navigation_link_width}px);`;
    }
}
// fix_indicator_positon(false);
window.onresize = function (event) {
    fix_indicator_positon(false);
};

$(".navigation ul li.active").eq(0).click();