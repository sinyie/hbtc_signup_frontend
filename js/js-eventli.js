/*eventli.html js*/
var menu_id = "1";
var viewlimit = 0, editlimit = 0, userpermission = "";
var keywords = '';
var _class = '';
var formattedDate = new Date();
var ss = formattedDate.getSeconds().toString().padStart(2, '0');
var ii = formattedDate.getMinutes().toString().padStart(2, '0');
var HH = formattedDate.getHours().toString().padStart(2, '0');
var dd = formattedDate.getDate().toString().padStart(2, '0');
var mm = formattedDate.getMonth();
mm = (mm + 1).toString().padStart(2, '0');  // JavaScript months are 0-11
var yy = formattedDate.getFullYear();
var Today = yy + "-" + mm + "-" + dd;
var NowTime = HH + ":" + ii;
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
            url: CONFIG["Api_Domain_Path"] + "frontend_activitylist",
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
                var activity_class = response.activity_class;
                var activity_list = response.activity_list.activitys;
                var join_count_array = response.activity_list.join_count_array;


                //產生全域導覽資料
                LoadSysConfig(sysconfig);
                ShowNavigation(menu_id, sysconfig);

                var list_str = "";

                //分類選單
                /* var activity_class = response.activity_class;
                $.each(activity_class, function (key, values) {
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

                $.each(activity_list, function (i, activity) {
                    var activity_strdate_str = activity.activity_strdate.substring(0, activity.activity_strdate.length - 3);
                    var activity_enddate_str = activity.activity_enddate.substring(0, activity.activity_enddate.length - 3);
                    var activity_str_date_str = activity.str_date.substring(0, activity.str_date.length - 3);
                    var activity_end_date_str = activity.end_date.substring(0, activity.end_date.length - 3);
                    var join_limit = parseInt(activity.join_limit);
                    var join_total = parseInt(activity.join_total);
                    var join_limit_str = (activity.join_limit == "0") ? "無限制" : join_total + " / " + activity.join_limit;

                    var startArray = activity.str_date.split(" ");
                    var startdateArray = startArray[0].split("-");
                    var starttimeArray = startArray[1].split(":");
                    var endArray = activity.end_date.split(" ");
                    var enddateArray = endArray[0].split("-");
                    var endtimeArray = endArray[1].split(":");
                    var chk_star_date = new Date(startdateArray[0], startdateArray[1] - 1, startdateArray[2], starttimeArray[0], starttimeArray[1]);
                    var chk_end_date = new Date(enddateArray[0], enddateArray[1] - 1, enddateArray[2], endtimeArray[0], endtimeArray[1]);

                    list_str += `
                    <article class="pagEventList">
                        <ul class="pagEventList--maxcomBk">
                            <li class="modPhoneCardMaxcomTable-dataArea pagEventList-dataArea">
                                <a href="eventin.html?activity_id=` + activity.id + `">
                                    <h3 class="pagEventList-statusOrder--phone--text pr-30">
                                        <p class="eleData typoMainColor">
                                            ` + activity.activity_code + `
                                        </p>
                                        ` + activity.name + `
                                    </h3>
                                </a>
                            </li>
                            <li class="modPhoneCardMaxcomTable-dataArea pagEventList-dataArea">
                                <h6 class="eleDataTit pagEventList-dataArea--tit--phone pr-20">活動日期與時間</h6>
                                <p class="eleData pagEventList-dataArea--data">
                                    <img src="images/clock--gray--15.svg" alt="clock" class="eleTextinIcon">
                                    ` + activity_strdate_str + `
                                    － <br />
                                    <img src="images/clock--gray--15.svg" alt="clock" class="eleTextinIcon">
                                    ` + activity_enddate_str + `
                                </p>
                            </li>
                            <li class="modPhoneCardMaxcomTable-dataArea pagEventList-dataArea">
                                <h6 class="eleDataTit pagEventList-dataArea--tit--phone pr-20">參加對象</h6>
                                <p class="eleData pagEventList-dataArea--data pr-30">
                                    ` + activity.target + `
                                </p>
                            </li>
                            <li class="modPhoneCardMaxcomTable-dataArea pagEventList-dataArea">
                                <h6 class="eleDataTit pagEventList-dataArea--tit--phone pr-20">報名期間</h6>
                                <p class="eleData pagEventList-dataArea--data">
                                ` + activity_str_date_str + ` － <br /> ` + activity_end_date_str + `
                                </p>
                            </li>
                            <li class="modPhoneCardMaxcomTable-dataArea pagEventList-dataArea">
                                <h6 class="eleDataTit pagEventList-dataArea--tit--phone pr-20">活動名額</h6>
                                <p class="eleData pagEventList-dataArea--data">` + join_limit_str + `</p>
                            </li>
                            `
                            if (formattedDate < chk_star_date) {
                                list_str += `
                                <li class="modPhoneCardMaxcomTable-dataArea pagEventList-dataArea pagEventList-btArea">
                                    <p class="eleData pagEventList-dataArea--data">尚未開始報名</p>
                                </li>
                                `
                            } else if (formattedDate > chk_end_date) {
                                list_str += `
                                <li class="modPhoneCardMaxcomTable-dataArea pagEventList-dataArea pagEventList-btArea">
                                    <p class="eleData pagEventList-dataArea--data">已超過報名時間</p>
                                </li>
                                `
                                list_str += `
                                <li class="modPhoneCardMaxcomTable-dataArea pagEventList-dataArea pagEventList-btArea">
                                    <a href="eventsearch.html?activity_id=` + activity.id + `" class="btnCircleSecondColor mr-5" data-tooltip="查詢修改 / 取消報名" data-position="top center">
                                        <img src="images/search--white--30.svg" alt="edit" class="btn-circleBase--icon">
                                    </a>
                                </li>
                                `
                            } else if (join_limit <= join_total) {
                                list_str += `
                                <li class="modPhoneCardMaxcomTable-dataArea pagEventList-dataArea pagEventList-btArea">
                                    <p class="eleData pagEventList-dataArea--data">已超過報名人數上限</p>
                                </li>
                                `
                                list_str += `
                                <li class="modPhoneCardMaxcomTable-dataArea pagEventList-dataArea pagEventList-btArea">
                                    <a href="eventsearch.html?activity_id=` + activity.id + `" class="btnCircleSecondColor mr-5" data-tooltip="查詢修改 / 取消報名" data-position="top center">
                                        <img src="images/search--white--30.svg" alt="edit" class="btn-circleBase--icon">
                                    </a>
                                </li>
                                `
                            } else {
                                list_str += `
                                <li class="modPhoneCardMaxcomTable-dataArea pagEventList-dataArea pagEventList-btArea">
                                    <a href="eventdeclare.html?activity_id=` + activity.id + `" class="btnCircleMainColor mr-5" data-tooltip="報名活動" data-position="top center">
                                        <img src="images/add--white--30.svg" alt="print" class="btn-circleBase--icon">
                                    </a>
                                </li>
                                `
                                list_str += `
                                <li class="modPhoneCardMaxcomTable-dataArea pagEventList-dataArea pagEventList-btArea">
                                    <a href="eventsearch.html?activity_id=` + activity.id + `" class="btnCircleSecondColor mr-5" data-tooltip="查詢修改 / 取消報名" data-position="top center">
                                        <img src="images/search--white--30.svg" alt="edit" class="btn-circleBase--icon">
                                    </a>
                                </li>
                                `
                            }
                            list_str += `
                        </ul>
                    </article>
                    `;
                });

                $("#list_div").html(list_str);

                $(document).prop("title", "臺中市政府衛生局" + sysconfig[1].setvalue + " - 報名活動一覽");

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
