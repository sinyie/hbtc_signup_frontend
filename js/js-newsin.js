/*newsin.html js*/
var menu_id = "2";
$(document).ready(function() {
    nid = $.UrlParam("nid");
    $("#nid").val(nid);
    if (nid == "") {
        window.location.href = "index.html";
    }

    csrf_promise.then((value) => {
        $.ajax({
            url: CONFIG["Api_Domain_Path"] + "frontend_getnews",
            type: "POST",
            data: { 'chk_php_self': location.pathname, 'menu_id': menu_id, 'nid': nid },
            dataType: 'json',
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status + ":" + xhr.responseText);
                console.log(xhr.status + ":" + xhr.responseText);
                //關閉loading
                $("body").nimbleLoader("hide");
            },
            success: function (response) {
                $.getScript("js/web-js.js");

                var sysconfig = response.sysconfig;
                var user_array = response.user_array;
                var news_class = response.news_class;
                var news = response.news;
                var newsFileData = response.fileData;
                var news_class_str = news_class[news.class];

                //產生全域導覽資料
                LoadSysConfig(sysconfig);
                ShowNavigation(menu_id, sysconfig);

                var breadcrumb_div = "";
                breadcrumb_div += `
                <a href="newsli.html" class="patBiteBt" title="活動消息一覽">活動消息一覽</a>
                <a href="newsin.html?nid=` + nid + `" class="patBiteBt patBiteBt--in" title="` + news.title + `">` + news.title + `</a>
                `
                $("#breadcrumb_div").html(breadcrumb_div);

                //var news_str_date = (news.str_date == "" || news.str_date == undefined) ? "--" : news.str_date;
                //var news_end_date = (news.end_date == "" || news.end_date == undefined) ? "--" : news.end_date;
                var str_date_array = news.str_date.split("-");
                var end_date_array = news.end_date.split("-");
                var news_str_date = str_date_array[1] + '/' + str_date_array[2] + '/0' + (str_date_array[0]);
                var news_end_date = end_date_array[1] + '/' + end_date_array[2] + '/0' + (end_date_array[0]);
                var news_date = (news_str_date == news_end_date) ? news_str_date : news_str_date + " ~ " + news_end_date;
                var news_title = (news.title == "" || news.title == undefined) ? "--" : news.title;
                var news_info = (news.info == "" || news.info == undefined) ? "--" : news.info;
                //news_info = news_info.replace(/\n/g, "<br>").replace(/ /g, "&nbsp;");
                var news_view = (news.view == "" || news.view == undefined) ? "0" : news.view;

                $("#news_date").html(`<img src="images/clock--gray--15.svg" alt="clock" class="eleTextinIcon">` + news.str_date);
                $("#news_poster").html(user_array[news.poster]);
                //$("#news_class").html(news_class);
                //$("#news_str_date_day").html(str_date_array[2]);
                //$("#news_str_date_month").html(str_date_array[0] + '-' + str_date_array[1]);
                //$("#news_end_date_day").html(end_date_array[2]);
                //$("#news_end_date_month").html(end_date_array[0] + '-' + end_date_array[1]);
                //$("news_view").html(news_view);
                $("#news_title").html(news_title);
                $("#news_info").html(news_info);

                /* var file_list = "";
                $.each(newsFileData, function (i, file) {
                    file_list +=`
                    <li class="modDownload-list">
                        <div class="modDownload-list--listDec"></div>
                        <a href="`+ CONFIG["Api_Domain_Path"] + 'news/' + nid + '/' + file.value +`" title="` + file.name + `" download="` + file.name + `" class="modDownload-list--link">
                            ` + file.name + `
                            <span class="modDownload-list--link--format">` + file.name.split(".").pop() + `</span>
                        </a>
                    </li>
                    `
                });

                if (file_list == "") {
                    $("#file_div").hide();
                }
                $("#file_list").html(file_list); */

                $(document).prop("title", "臺中市政府衛生局" + sysconfig[1].setvalue + " - 活動消息一覽 - " + " - " + news_title);
            }
        });
    });
});
