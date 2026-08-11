obj = {
    title: "filgoal",
    main_url: "https://www.filgoal.com",
    api_url: "https://www.filgoal.com/matches/ajaxlist",
    get_matches_json: function () {

        // $.MouAjax({
        //     "type": "GET",
        //     "url": now_table_api_url,
        //     "headers": {
        //         "user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
        //         "referer": "https://www.filgoal.com/matches/"
        //     },
        //     success: function (res) {

        //         if (typeof mouscripts !== "undefined" || typeof what_window.electron !== "undefined") {
        //             table_res = JSON.parse(res);
        //         } else {
        //             table_res = res;
        //         }

        //         matches_json = [];

        //         for (i = 0; i < table_res.length; i++) {
        //             match = {};
        //             match["id"] = table_res[i].Id;
        //             match["link"] = "https://www.filgoal.com/matches/" + table_res[i].Id + "/coverage\/" + table_res[i].Slug + "/#id=0";
        //             match["Slug"] = table_res[i].Slug;
        //             match["team_1_name"] = table_res[i].HomeTeamName;
        //             match["team_1_logo"] = "https:" + table_res[i].HomeTeamLogoUrl;
        //             match["team_1_score"] = table_res[i].HomeScore == null ? "-" : table_res[i].HomeScore;
        //             match["team_1_pen_score"] = table_res[i].HomePenaltyScore;
        //             match["team_2_name"] = table_res[i].AwayTeamName;
        //             match["team_2_logo"] = "https:" + table_res[i].AwayTeamLogoUrl;
        //             match["team_2_score"] = table_res[i].AwayScore == null ? "-" : table_res[i].AwayScore;
        //             match["team_2_pen_score"] = table_res[i].AwayPenaltyScore;
        //             match["league_name"] = table_res[i].ChampionshipName;
        //             match["stadium_Name"] = table_res[i].StadiumName;
        //             match_channels = [];
        //             if (typeof table_res[i].TvCoverage !== "undefined" && table_res[i].TvCoverage.length > 0) {
        //                 for (o = 0; o < table_res[i].TvCoverage.length; o++) {
        //                     ch = {};
        //                     ch["tv_channel_name"] = table_res[i].TvCoverage[o].TvChannelName;
        //                     ch["commenter_name"] = table_res[i].TvCoverage[o].CommenterName;
        //                     match_channels.push(ch);
        //                 }

        //             }
        //             match["channels"] = match_channels;
        //             match["ChampionshipId"] = table_res[i].ChampionshipId;
        //             match_date = new Date(parseInt(/\((.*?)\)/gm.exec(table_res[i].Date)[1])).getTime();

        //             // match_date = match_date - ((3 * 60 * 60) - (15 * 60)) * 1000;
        //             match["SatrtAt"] = table_res[i].MatchStatusHistory[0].StartAt;
        //             match["time_stamp"] = match_date;
        //             match["status"] = table_res[i].MatchStatusHistory[0].MatchStatusName;
        //             matches_json.push(match);
        //         }
        //         show_matches(matches_json);

        //     },
        //     fail: function (code, msg) {

        //     }
        // });
        $.ajax({
            type: "GET",
            url: now_table_api_url,
            headers: {
                "user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
                "referer": "https://www.filgoal.com/matches/"
            },
            success: function (table_res, textStatus, jqXHR) {
                // if (typeof mouscripts !== "undefined" || typeof what_window.electron !== "undefined") {
                //     table_res = JSON.parse(res);
                // } else {
                //     table_res = res;
                // }

                matches_json = [];

                for (i = 0; i < table_res.length; i++) {
                    match = {};
                    match["id"] = table_res[i].Id;
                    match["link"] = "https://www.filgoal.com/matches/" + table_res[i].Id + "/coverage\/" + table_res[i].Slug + "/#id=0";
                    match["Slug"] = table_res[i].Slug;
                    match["team_1_name"] = table_res[i].HomeTeamName;
                    match["team_1_logo"] = "https:" + table_res[i].HomeTeamLogoUrl;
                    match["team_1_score"] = table_res[i].HomeScore == null ? "-" : table_res[i].HomeScore;
                    match["team_1_pen_score"] = table_res[i].HomePenaltyScore;
                    match["team_2_name"] = table_res[i].AwayTeamName;
                    match["team_2_logo"] = "https:" + table_res[i].AwayTeamLogoUrl;
                    match["team_2_score"] = table_res[i].AwayScore == null ? "-" : table_res[i].AwayScore;
                    match["team_2_pen_score"] = table_res[i].AwayPenaltyScore;
                    match["league_name"] = table_res[i].ChampionshipName;
                    match["stadium_Name"] = table_res[i].StadiumName;
                    match_channels = [];
                    if (typeof table_res[i].TvCoverage !== "undefined" && table_res[i].TvCoverage.length > 0) {
                        for (o = 0; o < table_res[i].TvCoverage.length; o++) {
                            ch = {};
                            ch["tv_channel_name"] = table_res[i].TvCoverage[o].TvChannelName;
                            ch["commenter_name"] = table_res[i].TvCoverage[o].CommenterName;
                            match_channels.push(ch);
                        }

                    }
                    match["channels"] = match_channels;
                    match["ChampionshipId"] = table_res[i].ChampionshipId;
                    match_date = new Date(parseInt(/\((.*?)\)/gm.exec(table_res[i].Date)[1])).getTime();

                    // match_date = match_date - ((3 * 60 * 60) - (15 * 60)) * 1000;
                    match["SatrtAt"] = table_res[i].MatchStatusHistory[0].StartAt;
                    match["time_stamp"] = match_date;
                    match["status"] = table_res[i].MatchStatusHistory[0].MatchStatusName;
                    matches_json.push(match);
                }
                show_matches(matches_json);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Inline error handling
                console.error('Error occurred:', textStatus, errorThrown);
            }
        });
    },
    load_match_data: function (this_match_div, callback) {
        match_json = JSON.parse($(this_match_div).find("mou_json").html());

        match_link_tashkeel = "https://www.filgoal.com/matches/" + match_json.id + "/coverage\/" + match_json.Slug + "/#id=0";

        match_link_coverage = "https://www.filgoal.com/matches/" + match_json.id + "/coverage\/" + match_json.Slug + "/#id=0";


        $.ajax({
            type: "GET",
            url: match_link_tashkeel,
            success: function (res) {
                doc = new DOMParser().parseFromString(res, "text/html");

                tashkeel = {};
                team_1_data = {};
                team_2_data = {};
                team_1_data["num"] = $(doc).find("#mformation #mfm_num .f").text().trim();
                team_1_data["asasy"] = [];
                team_1_data["badeel"] = [];
                team_2_data["num"] = $(doc).find("#mformation #mfm_num .s").text().trim();
                team_2_data["asasy"] = [];
                team_2_data["badeel"] = [];
                $(doc).find("#mformation .mfm_block").eq(0).find("ul li").each(function () {
                    if ($(this).find(".f").length > 0) {
                        team_1_player = {};
                        team_1_player["name"] = $(this).find(".f div b a").text().trim();
                        team_1_player["num"] = $(this).find(".f span").text().trim();
                        $(this).find(".f div b").remove();
                        team_1_player["position"] = $(this).find(".f div").text().trim();
                        team_1_data["asasy"].push(team_1_player);
                    }

                    if ($(this).find(".s").length > 0) {
                        team_2_player = {};
                        team_2_player["name"] = $(this).find(".s div b a").text().trim();
                        team_2_player["num"] = $(this).find(".s span").text().trim();
                        $(this).find(".s div b").remove();
                        team_2_player["position"] = $(this).find(".s div").text().trim();
                        team_2_data["asasy"].push(team_2_player);
                    }
                });

                $(doc).find("#mformation .mfm_block").eq(1).find("ul li").each(function () {
                    if ($(this).find(".f").length > 0) {
                        team_1_player = {};
                        team_1_player["name"] = $(this).find(".f div b a").text().trim();
                        team_1_player["num"] = $(this).find(".f span").text().trim();
                        $(this).find(".f div b").remove();
                        team_1_player["position"] = $(this).find(".f div").text().trim();
                        team_1_data["badeel"].push(team_1_player);
                    }

                    if ($(this).find(".s").length > 0) {
                        team_2_player = {};
                        team_2_player["name"] = $(this).find(".s div b a").text().trim();
                        team_2_player["num"] = $(this).find(".s span").text().trim();
                        $(this).find(".s div b").remove();
                        team_2_player["position"] = $(this).find(".s div").text().trim();
                        team_2_data["badeel"].push(team_2_player);
                    }

                })



                tashkeel["team_1_data"] = team_1_data;
                tashkeel["team_2_data"] = team_2_data;
                // $(doc).find("")
                match_json["tashkeel"] = tashkeel;


                match_json["team_1_manger_name"] = $(doc).find(".match-center-info .clubs-info .c-i-next .f").find("a").eq(2).text();
                match_json["team_2_manger_name"] = $(doc).find(".match-center-info .clubs-info .c-i-next .s").find("a").eq(2).text();

                team_1_sorers = [];
                team_2_sorers = [];

                $(doc).find(".match-center-info .clubs-info .c-i-next .f ul li").each(function () {
                    goal = {};
                    goal["scorer_name"] = $(this).find("a").text().trim();
                    goal["scorer_time"] = $(this).find("span").text().trim();
                    team_1_sorers.push(goal);
                });
                $(doc).find(".match-center-info .clubs-info .c-i-next .s ul li").each(function () {
                    goal = {};
                    goal["scorer_name"] = $(this).find("a").text().trim();
                    goal["scorer_time"] = $(this).find("span").text().trim();
                    team_2_sorers.push(goal);
                });

                match_json["team_1_sorers"] = team_1_sorers;
                match_json["team_2_sorers"] = team_2_sorers;
                callback(match_json);
            }
        })


    }
};
mou_matches_table_servers_array["filgoal"] = obj;