/*newsli.html js*/
var menu_id = "2";
var viewlimit = 0, editlimit = 0, userpermission = "";
var keywords = '';
var _class = '';
/*
$("body").nimbleLoader("show", {
	position: "fixed",
	loaderClass: "loading_bar_body",
	debug: true,
	speed: 1000,
	hasBackground: true,
	zIndex: 899,
	backgroundColor: "rgba(51,102,255,1)",
	backgroundOpacity: 0.8
});
 */
$(document).ready(function () {
    var page = ($.UrlParam("page") == "") ? 1 : $.UrlParam("page");
    keywords = $.UrlParam("keywords");
    $("#keywords").val(keywords);
    _class = $.UrlParam("_class");

    csrf_promise.then((value) => {
        $.ajax({
            url: CONFIG["Api_Domain_Path"] + "frontend_newslist",
            type: "POST",
            data: { 'chk_php_self': location.pathname, 'menu_id': menu_id, 'keywords': escapeHtml(keywords), '_class': _class, 'page': page },
            dataType: 'json',
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status + ":" + xhr.responseText);
                console.log(xhr.status + ":" + xhr.responseText);
                //關閉loading
                $("body").nimbleLoader("hide");
            },
            success: function (response) {
                //js初始化重新載入
                $.getScript("js/semantic.min.js");
                $.getScript("js/semantic-ini.js");
                $.getScript("js/web-js.js");

                var sysconfig = response.sysconfig;
                var user_array = response.user_array;
                var news_list = response.news_list;

                //產生全域導覽資料
                LoadSysConfig(sysconfig);
                ShowNavigation(menu_id, sysconfig);

                var list_str = "";

                //分類選單
                /* var news_class = response.news_class;
                $.each(news_class, function (key, values) {
                    var varItem = new Option(values, key);//(objItemText, objItemValue)
                    document.getElementById('_class').options.add(varItem);
                });
                $("#_class").val(_class); */

                /* $("#Total_Count").html(news_list.total);
                //$("#span_page").html(news_list.current_page + " " + $.i18n("common_of") + " " + news_list.last_page);
                for (let i = 1; i <= news_list.last_page; i++) {
                    var varItem = new Option(i, i);//(objItemText, objItemValue)
                    document.getElementById('page_sel').options.add(varItem);
                }
                $("#page_sel").val(news_list.current_page);
                $("#page").val(news_list.current_page);
                $("#last_page").val(news_list.last_page); */

                $.each(news_list, function (i, news) {
                    /* var str_date_array = news.str_date.split("-");
                    var str_date = (parseInt(str_date_array[0]) - 1911) + "/" + str_date_array[1] + "/" + str_date_array[2];
                    var end_date_array = news.end_date.split("-");
                    var end_date = (parseInt(end_date_array[0]) - 1911) + "/" + end_date_array[1] + "/" + end_date_array[2];
                    var date_str = (str_date == end_date) ? str_date : str_date + " ~ " + end_date; */
                    var str_date_array = news.str_date.split("-");
                    var news_date = (parseInt(str_date_array[0]) - 1911) + "/" + str_date_array[1] + "/" + str_date_array[2];

                    list_str += `
                    <article class="pagNewsList">
                        <ul class="pagNewsList--maxcomBk">
                            <li class="modPhoneCardMaxcomTable-dataArea pagNewsList-dataArea">
                                <a href="newsin.html?nid=` + news.id + `">
                                    <h3 class="pagEventList-statusOrder--phone--text pr-30">
                                        ` + news.title + `
                                    </h3>
                                </a>
                            </li>
                            <li class="modPhoneCardMaxcomTable-dataArea pagNewsList-dataArea">
                                <h6 class="eleDataTit pagNewsList-dataArea--tit--phone pr-20">發佈日期</h6>
                                <p class="eleData pagNewsList-dataArea--data">
                                    <img src="images/clock--gray--15.svg" alt="clock" class="eleTextinIcon">
                                    ` + news.str_date + `
                                </p>
                            </li>
                            <li class="modPhoneCardMaxcomTable-dataArea pagNewsList-dataArea">
                                <h6 class="eleDataTit pagNewsList-dataArea--tit--phone pr-20">發佈人</h6>
                                <p class="eleData pagNewsList-dataArea--data pr-30">
                                    ` + user_array[news.poster] + `
                                </p>
                            </li>
                        </ul>
                    </article>
                    `
                });

                $("#list_div").html(list_str);

                $(document).prop("title", "臺中市政府衛生局" + sysconfig[1].setvalue + " - 活動消息一覽");

                //關閉loading
                $("body").nimbleLoader("hide");
            }
        });
    });

    //搜尋列表
    $(document).on("click", "#search_btn", function () {
        window.location.href = escapeHtml("?keywords=" + $("#keywords").val() + "&_class=" + $("#_class").val());
    });

    //上一頁
    $(document).on("click", "#pre_page", function () {
        var page = parseInt($("#page").val());
        var search_param = "";
        search_param += ($("#_class").val() != "") ? "&_class=" + $("#_class").val() : "";

        if (page == 1) {
            alert($.i18n("common_is_first_page"));
        } else {
            window.location.href = escapeHtml("?page=" + (page - 1) + "&keywords=" + keywords + search_param);
        }
    });

    //選擇分頁
    $(document).on("change", "#page_sel", function () {
        var page = parseInt($(this).val());
        var search_param = "";
        search_param += ($("#_class").val() != "") ? "&_class=" + $("#_class").val() : "";

        window.location.href = escapeHtml("?page=" + page + "&keywords=" + keywords + search_param);
    });

    //下一頁
    $(document).on("click", "#next_page", function () {
        var page = parseInt($("#page").val());
        var search_param = "";
        search_param += ($("#_class").val() != "") ? "&_class=" + $("#_class").val() : "";

        if (page == $("#last_page").val()) {
            alert($.i18n("common_is_last_page"));
        } else {
            window.location.href = escapeHtml("?page=" + (page + 1) + "&keywords=" + keywords + search_param);
        }
    });

    //清除搜尋條件
    $(document).on("click", "#reset_btn", function () {
        $('.selectItem').dropdown('clear');
        $(".inputItem").val('');
        $(".dateItem").val('');
        /* $(".dateItem").flatpickr({
            //設定時間
            //enableTime: true,
            dateFormat: "Y-m-d",
            //mode: "range"
            // minTime: "16:00",
            // maxTime: "22:00",
            //設定起始天數
            //minDate: "2019-01",
            defaultDate: ""
        }); */
    });
});
