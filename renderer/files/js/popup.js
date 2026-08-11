// start pop_up_script
readypopups();
function readypopups() {
    $("[data-openpopup]").off("click");
    $('[data-closepopup],[data-dismisspopup]').off("click");
    $(".mou_popup").off("click");
    $("[data-openpopup]").click(function () {
        fadein_sec = 1;
        this_popup_id = $(this).attr("data-openpopup");
        $("#" + this_popup_id).openpopup();
    });
    $('[data-closepopup],[data-dismisspopup]').click(function (e) {
        e.preventDefault();
        this_popup_id = $(this).parents(".mou_popup");
        $(this_popup_id).closepopup();
    });
    $(".mou_popup").click(function (e) {
        if (e.target !== this) {
            return;
        }

        if ($(this).attr("data-lockpopup") !== "true") {
            $("#" + $(this).attr("id")).closepopup();
        }
    })

}
var on_closepopups = {};
(function ($) {
    $.fn.extend({
        openpopup: function () {
            $(this).addClass("show").removeClass("hide");
            $("body").css("overflow", "hidden");
            this_popup = $(this);
            what_window["back_buttons_functions_" + what_window.now_active_panal].Unshift(function () {
                // what_window.back_button_clicked();
                $(this_popup).closepopup("back_button");
            });
        },
        closepopup: function (from_where = "normal") {

            $(this).removeClass("show").addClass("hide");
            $("body").css("overflow", "unset");
            now_active_panal = $(".navigation ul li.list.active").index();
            if (from_where !== "back_button") {
                what_window["back_buttons_functions_" + what_window.now_active_panal].shift();
            }
            if (typeof on_closepopups[$(this).attr("id")] !== "undefined") {
                on_closepopups[$(this).attr("id")]();
            }
        },
        on_closepopup: function (callback) {
            on_closepopups[$(this).attr("id")] = callback;
        }
    });
})(jQuery);
// end popup scrpit