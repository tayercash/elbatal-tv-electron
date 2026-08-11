what_window.get_app_db(function (app_db) {
    // get local favs
    db_transaction = app_db.transaction("favs", "readwrite");
    FavsStore = db_transaction.objectStore("favs");
    let db_request = FavsStore.getAll();
    db_request.onsuccess = async function () { // (4)
        if (db_request.result.length > 0) {
            $("#no_favs_alert").hide();
            local_favs_length = db_request.result.length;
            for (i = 0; i < local_favs_length; i++) {
                let row = db_request.result[i];

                id = row.id;
                title = row.title;
                query = row.query;
                img_file = row.img_file;
                server_img_url = row.server_img_url;
                server_name = row.server_name;
                is_synced = row.synced;
                synced_vid_id = row.synced_vid_id;

                if (!is_synced) {
                    row["local_vid_id"] = id;

                    const vid_data = await syncVidToServer(row);


                    // what_window.sync_vid_to_server(row, "fav", false, function (vid_data) {

                    id = vid_data.id;
                    title = vid_data.title;
                    query = vid_data.query;
                    img_file = vid_data.img_file;
                    server_img_url = vid_data.server_img_url;
                    server_name = vid_data.server_name;


                    const new_div = `<a data-id="${id}" data-href="${query}" class="vide_container my_box_shadow">
                                   <div class="vide_container_overlay"></div>
                                   <span class="vide_thump" style="background:url(${img_file}) no-repeat center center;background-size: cover"></span>
                                   <div class="vide_disc">
                                       <div class="about_vid">
                                           <div class="vid_detailes_container">
                                               <h3>${title}</h3>
                                           </div>
                                       </div>
                                   </div>
                               </a>`;
                    $("#fav_posts").append(new_div);

                    // });

                } else {

                }

                if (local_favs_length == i + 1) {
                    // $("#favs_loading").hide();
                    load_favs_from_server();

                    // lazyload();
                    // document.addEventListener("scroll", lazyload);
                    // window.addEventListener("resize", lazyload);
                    // window.addEventListener("orientationChange", lazyload);
                }




            }

        } else {
            load_favs_from_server();

        }

    };


});
$(document).on("click", "#fav_posts [data-href]", function () {
    data_query = $(this).attr("data-href");
    $("#favs").closepopup();
    open_film_on_iframe("#watch_frame", "movies.html?" + data_query);
});



function load_favs_from_server() {
    $("#favs_loading").show();
    $("#no_favs_alert").hide();
    $("#fav_posts").html("");
    $.ajax({
        type: "POST",
        url: elbatal_api + "share/fcm.php",
        data: {
            action: "get_favs",
            token: mou_custom_encode(user_data.user_id + "#" + what_window.dev_id)
        },
        success: function (data, textStatus, xhr) {
            $("#favs_loading").hide();
            $("#fav_posts").html("");

            for (var i = 0; i < Object.keys(data.messages).length; i++) {
                message_code = Object.keys(data.messages)[i];
                message = data.messages[message_code];
                if (message_code == 200) {
                    if (data.messages["favs"].length > 0) {
                        for (i = 0; i < data.messages["favs"].length; i++) {
                            row = data.messages["favs"][i];
                            id = row.vid_id;
                            title = row.title;
                            query = row.query;
                            img_file = row.img_url;


                            const new_div = `<a data-id="${id}" data-href="${query}" class="vide_container my_box_shadow">
                        <div class="vide_container_overlay"></div>
                        <span class="vide_thump" style="background:url(${img_file}) no-repeat center center;background-size: cover"></span>
                        <div class="vide_disc">
                            <div class="about_vid">
                                <div class="vid_detailes_container">
                                    <h3>${title}</h3>
                                </div>
                            </div>
                        </div>
                    </a>`;
                            $("#fav_posts").append(new_div);


                        }
                    } else {
                        $("#no_favs_alert").show();

                    }

                }



            }


        }, error: function (jqXHR, error, errorThrown) {

        }
    });

}

function syncVidToServer(row) {
    return new Promise((resolve, reject) => {
        what_window.sync_vid_to_server(row, "fav", false, function (vid_data) {
            resolve(vid_data);
        });
    });
}
