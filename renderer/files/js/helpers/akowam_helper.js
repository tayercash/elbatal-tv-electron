$("body").removeAttr("style");
if ($(".g-recaptcha").length > 0) {
    capatch_container = $(`<div style="position:fixed;top: 0;left: 0;bottom: 0;right: 0;width: 100%;height: 100%;background: #141414;z-index: 10000000;"><div style="position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);"></div></div>`);
    $(capatch_container).find("div").html($(".g-recaptcha").parent("form"));
    $("body").append($(capatch_container));
}

// $("body").html($(".g-recaptcha"));