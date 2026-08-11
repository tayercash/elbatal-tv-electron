var now_server_url = null;

$(document).ready(async function () {
    arrabic_letters = ["أ", "إ", "ا", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "ه", "و", "ي"];
    arrabic_letters.forEach(letter => {
        $(".full_reciters_lists").append(`<div class="reciters_container"><span class="header_title letter">${letter}</span><div class="btns_list reciters" data-letter="${letter}"></div></div>`);
    });
    for (reciter = 0; reciter < reciters_json.length; reciter++) {
        reciter_data = reciters_json[reciter];

        reciter_id = reciter_data["id"];
        reciter_name = reciter_data["name"];

        $(`.reciters[data-letter="${reciter_data.letter}"]`).append(`<button class="mou_btn item" data-reciter_id="${reciter_id}">
                            <span class="item_icon"><i class="fas fa-user"></i></span>
                            <span class="item_text">${reciter_name}</span>
                        </button>`);
    }
    $(".reciters_container").each(function () {
        if ($(this).find(".reciters .item").length == 0) {
            $(this).remove();
        }
    })
    $("[data-reciter_id]").click(function () {
        reciter_id = $(this).attr("data-reciter_id");
        for (reciter = 0; reciter < reciters_json.length; reciter++) {
            search_reciter_data = reciters_json[reciter];
            search_reciter_id = search_reciter_data["id"];
            if (search_reciter_id == reciter_id) {
                this_reciter_data = search_reciter_data;
                break;
            }
        }
        reciter_name = this_reciter_data["name"];
        reciter_moshaf_data = this_reciter_data["moshaf"];
        $("#rewayat").html("");

        for (i = 0; i < reciter_moshaf_data.length; i++) {
            moshaf = reciter_moshaf_data[i];
            moshaf_id = moshaf["id"];
            moshaf_name = moshaf["name"];
            $("#rewayat").append(`<option value="${moshaf_id}">${moshaf_name}</option>`);
        }
        $("#rewayat").val(reciter_moshaf_data[0]["id"]).change();

        $(".reciter_name").text(reciter_name);
        $(".reciters_container").addClass("hide");
        $(".suwar_container").removeClass("hide");


        reciters_content_scrolled_from_top = $(document).scrollTop();
        $(window).scrollTop(0);

        what_window.back_buttons_functions.Unshift(function () {
            $(".suwar_container").addClass("hide");
            $(`.reciters_container`).removeClass("hide");
            $(document).scrollTop(reciters_content_scrolled_from_top);
        });
    })

    for (sora = 0; sora < suwar_json.length; sora++) {
        sora_data = suwar_json[sora];
        sora_id = sora_data["id"];
        sora_num = zeroFill(sora_id, 3);
        sora_name = sora_data["name"];

        $(".suwar").append(`<button class="mou_btn item" data-sora_num="${sora_num}">
                                <span class="item_icon"><i class="fas fa-play"></i></span>
                                <span class="item_text">${sora_num} - ${sora_name}</span>
                            </button>`);
    }

    $("[data-sora_num]").click(function () {
        page_function = $(".toggle_page_function").attr("data-func");
        $("[data-sora_num]").removeClass("active");
        $(this).addClass("active");
        sora_name = $(this).text().trim();
        sora_num = $(this).attr("data-sora_num");
        sora_link = now_server_url + sora_num + ".mp3";
        if (page_function == "play") {
            var audio = $("#player_audio")[0];
            $("#player_popup").openpopup();
            $("#player_popup").on_closepopup(function () {
                audio.pause();
                audio.currentTime = 0;
                $("[data-sora_num]").removeClass("active");
            });
            $("#player_audio source").attr("src", sora_link);
            $("#sora_popup_name").text(`${sora_name} - ${reciter_name}`);

            $("#audioSource").attr("src", sora_link);
            audio.load(); //call this to just preload the audio without playing
            audio.play(); //call this to 
        } else if (page_function == "download") {
            add_for_downlaod(`downloads/`, `${sora_name} - ${reciter_name}`, "mp3", sora_link, `sound`, `{}`);
        }

    })
    $("#rewayat").change(function () {
        moshaf_id = $(this).val();
        for (i = 0; i < reciter_moshaf_data.length; i++) {
            search_moshaf_data = reciter_moshaf_data[i];
            if (moshaf_id == search_moshaf_data["id"]) {
                break;
            }
        }
        now_server_url = search_moshaf_data["server"];
        moshaf_surah_list = moshaf["surah_list"].split(",");
        $(".suwar .item").addClass("hide");
        for (i = 1; i <= 114; i++) {
            if (moshaf_surah_list.includes("" + i)) {
                $(`.suwar .item[data-sora_num="${zeroFill(i, 3)}"]`).removeClass("hide");
            }
        }
    });
    $(".toggle_page_function").click(function () {
        if ($(this).attr("data-func") == "play") {
            $(this).attr("data-func", "download");
            $(this).find(".text").text("التحميل");
            $(this).find(".icon").html(`<i class="fas fa-download"></i>`);
            $(".suwar .item .item_icon").html(`<i class="fas fa-download"></i>`);
        } else {
            $(this).attr("data-func", "play");
            $(this).find(".text").text("الإستماع");
            $(this).find(".icon").html(`<i class="fas fa-play"></i>`);
            $(".suwar .item .item_icon").html(`<i class="fas fa-play"></i>`);

        }
    });
});

const player = new Plyr('#player_audio', {
    controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume'],
});
player.on('ended', (event) => {
    $("[data-sora_num]:not(.hide)").each(function (indexx) {
        if ($(this).hasClass("active")) {
            if ($(this).is($("[data-sora_num]:not(.hide)").last())) {
                $("#player_popup").closepopup();
            } else {
                $("[data-sora_num]:not(.hide)").eq(indexx + 1).click();
            }
            return false;
        }
    })
});

$(".player_container").on("focus.spt", "*", function (e) {
    e.stopPropagation();
    $this = $(this);
    $this.blur();
    var next = $this.nextAll().find('a,input');
    if (next.length > 0) next[0].focus();
});