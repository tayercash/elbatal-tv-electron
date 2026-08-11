$(document).ready(function () {

    if (typeof mouscripts !== "undefined") {

        Share_or_notify = mouscripts.get_Share_or_notify();
        if (Share_or_notify == "2") {
            if (mouscripts.get_IntentExtra_string() !== "") {
                IntentExtra_string = convert_byte_to_string(mouscripts.get_IntentExtra_string());


                IntentExtra_json = JSON.parse(IntentExtra_string);
                notification_id = IntentExtra_json.notification_id;
                $.ajax({
                    type: "POST",
                    url: elbatal_api + "share/fcm.php",
                    data: {
                        action: "notified_clicked",
                        notification_id: notification_id
                    }
                });
                if (typeof IntentExtra_json.qurey_data !== "undefined") {
                    qurey_data = IntentExtra_json["qurey_data"];
                    main_qurey_data = get_Queries(2, "?" + qurey_data);
                    load_from_query(main_qurey_data);
                }
            }
        } else if (Share_or_notify == "1") {
            if (mouscripts.get_Share_data() !== "") {
                share_data = mouscripts.get_Share_data();

                qurey_data = get_Queries(2, "?" + share_data);
                share_id = qurey_data.share_id;

                if (typeof qurey_data.share_data !== "undefined") {
                    qurey_data = decodeURIComponent(mou_custom_decode(qurey_data.share_data));
                    main_qurey_data = get_Queries(2, "?" + qurey_data);
                    load_from_query(main_qurey_data);
                } else {

                    $.ajax({
                        type: "GET",
                        url: elbatal_api + "share/share.php",
                        data: {
                            action: "app",
                            share_id: share_id
                        }, success: function (data) {
                            qurey_data = data.qurey_data;
                            qurey_data = get_Queries(2, "?" + qurey_data);
                            // console.log("qurey_data => " + qurey_data);

                            qurey_data = decodeURIComponent(mou_custom_decode(qurey_data.share_data));
                            main_qurey_data = get_Queries(2, "?" + qurey_data);
                            load_from_query(main_qurey_data);

                        }, error: function (jqXHR, error, errorThrown) {
                            // alert(jqXHR.responseText);
                            showToast("Error While Get query !");

                        }
                    });
                }



                $.ajax({
                    type: "POST",
                    url: elbatal_api + "share/fcm.php",
                    data: {
                        action: "share_opend",
                        share_id: share_id
                    }
                });
                // open_film_on_iframe("share_page.html?" + share_data);


            }
        }
    } else if (typeof what_window.electron !== "undefined") {

        qurey_data = get_Queries();
        if (typeof qurey_data.share_data !== "undefined") {
            console.log(qurey_data.share_data);

            qurey_data = decodeURIComponent(mou_custom_decode(qurey_data.share_data));
            main_qurey_data = get_Queries(2, "?" + qurey_data);
            load_from_query(main_qurey_data);
        }


    }
});


function load_from_query(this_query_data) {
    if (typeof this_query_data["film_server_name"] !== "undefined") {
        this_film_server = this_query_data["film_server_name"];
        this_query = encodeQueryData(this_query_data);

        open_film_on_iframe("#watch_frame", "movies.html?" + this_query);
    }
}


// IntentExtra_string = '{"qurey_data":"film_title=%25D9%2583%25D9%2588%25D8%25A8%25D8%25B1%25D8%25A7&film_server_name=akowam&film_url=%252Fseries%252F4831%252F%2525D9%252583%2525D9%252588%2525D8%2525A8%2525D8%2525B1%2525D8%2525A7&film_type=muslsal&halka_num=3","notification_id":"693","body":"مشاهدة كوبرا الحلقة 3","image":"https:\/\/mou.elbatal-app.com\/users\/share\/imgs\/l1Apo_1711798729.png","sound":"default","title":"كوبرا الحلقة 3","Action_title":"مشاهدة"}';


// console.log(main_qurey_data);

// share_data = "share_id=689&share_data=AnohyE09zCIhAHFaIXFbMGR8IWtoNqFbMFV6QGR8NqEVLHFbMGR8LWJoNqFbMFJ4QGR8NqF5NbFbMGR8IWtoNqFbMFV5QGR8NqEVLHFbMGR8LVVoNqFbMFJ5QGR8NqEXNHFbMGR8NqZoNqFbMFJ5QGR8NqEYNbFbMGR8IWpoNqFbMGt5QGR8NqEVLHFbMGR8LVVoNqFbMGRdQGR8NqEVLXFbMGR8JGxoNqFbMFJ4QGR8NqF5MXFbMGR8IWpoNqFbMGt8QGR8NqEVLHFbMGR8LWtoNqFbMFJ5QGR8NqEXNbFbMGR8IWpoNqFbMGt8QGR8NqFbNXFbMGR8IWtoNqFbMFV6QGR8NqEVLHFbMGR8LWJoNqFbMFJ5QGR8NqEYJrFbMGR8IWtoNqFbMFV6QGR8NqEVLHFbMGR8LWFoNqFbMFJ4QGR8NqF5MrFbMnAkyT8ux7EbwnEbC74syDFoN9Isz706BD9oNqAnzDcgC6EbyXFaIXFbMGR8NpAaACQkACNoNqFbMGQTMWtcLHFbMGR8NpBoNqFbMGR8IWtoNqFbMGR8JGxoNqFbMGR8IWpoNqFbMGR8LWJoNqFbMGR8IWpoNqFbMGR8LWNoNqFbMGR8IWtoNqFbMGR8JGtoNqFbMGR8IWpoNqFbMGR8LVVoNqFbMGR8IWtoNqFbMGR8JqVgQGR8NqFbMFJ5QGR8NqFbMFVaQGR8NqFbMFJ4QGR8NqFbMGt5QGR8NqFbMFJ4QGR8NqFbMGsYOHFbMGR8NqEVLXFbMGR8NqEYMbFbMGR8NqEVLHFbMGR8NqF5MXFbMGR8NqEVLHFbMGR8NqF5MHFbMGR8NqEVLHFbMGR8NqF5LXFbMGR8NqEVLXFbMGR8NqEXNbFbMGR8NqEVLHFbMGR8NqF5MH9oNqFbMGR8IWtoNqFbMGR8JGxoNqFbMGR8IWpoNqFbMGR8LWJoNqFbMGR8IWtoNqFbMGR8JFRoNqFbMGR8IWtoNqFbMGR8JGxoNqFbMGR8IWpoNqFbMGR8LWFoNqFbMGR8IWpoNqFbMGR8LWBoNqAnzDcgC6I4xTFoN9IgwCMhx7UhQGR7zTUhz7UuymEgQGMVNGt=";

// qurey_data = get_Queries(2, "?" + share_data);
// share_id = qurey_data.share_id;
// qurey_data = decodeURIComponent(mou_custom_decode(qurey_data.share_data));

// main_qurey_data = get_Queries(2, "?" + qurey_data);
// if (typeof main_qurey_data["film_server_name"] !== "undefined") {
//     this_film_server = main_qurey_data["film_server_name"];
//     open_film_on_iframe("#watch_frame", "movies.html?" + qurey_data);
// }

// if (getQueryVariable("intent_data")) {
//     intent_data = mou_custom_decode(getQueryVariable("intent_data"));
//     intent_data = JSON.parse(intent_data);
//     qurey_data = decodeURIComponent(intent_data.qurey_data);

// } else {
//     qurey_data = get_Queries();
//     if (qurey_data.from_fav) {
//         qurey_data = decodeURIComponent(encodeQueryData(qurey_data));
//     } if (typeof qurey_data.share_data !== "undefined") {

//         share_id = qurey_data.share_id;
//         qurey_data = decodeURIComponent(mou_custom_decode(qurey_data.share_data));
//     }

// }
// if (typeof qurey_data !== "undefined") {

//     film_server_name = getQueryVariable("film_server_name", 2, "?" + qurey_data);


//     if (film_server_name !== false) {

//         // console.log(film_server_name);

//         if (typeof servers_obj[film_server_name] !== "undefined") {
//             local_path = servers_obj[film_server_name].local_path;
//             redrict_to = local_path + "?" + qurey_data;
//             window.location.replace(redrict_to);
//         }
//     }
// }
