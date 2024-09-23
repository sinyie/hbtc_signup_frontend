/*index.html js*/
var menu_id = 0;
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

$(document).ready(function () {
    csrf_promise.then((value) => {
        $.ajax({
            url: CONFIG["Api_Domain_Path"] + "index",
            type: "POST",
            data: { 'chk_php_self': location.pathname, 'menu_id': menu_id },
            dataType: 'json',
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status + ":" + xhr.responseText);
                console.log(xhr.status + ":" + xhr.responseText);
            },
            success: function (response) {

                var sysconfig = response.sysconfig;
                var user_array = response.user_array;
                var news_list = response.news_list;
                var activity_list = response.activity_list.activitys;
                var join_count_array = response.activity_list.join_count_array;

                //產生全域導覽資料
                LoadSysConfig(sysconfig);
                ShowNavigation(menu_id, sysconfig);

                //最新消息列表
                var list_str = '';
                $.each(news_list, function (i, news) {

                    list_str += `
                    <article class="pagNewsList">
                        <ul class="pagNewsList--maxcomBk">
                            <li class="modPhoneCardMaxcomTable-dataArea pagNewsList-dataArea">
                                <a href="newsin.html?nid=` + news.id + `">
                                    <p class="pagEventList-statusOrder--phone--text pr-30">
                                        ` + news.title + `
                                    </p>
                                </a>
                            </li>
                            <li class="modPhoneCardMaxcomTable-dataArea pagNewsList-dataArea">
                                <p class="eleDataTit pagNewsList-dataArea--tit--phone pr-20">發佈日期</p>
                                <p class="eleData pagNewsList-dataArea--data">
                                    <img src="images/clock--gray--15.svg" alt="" class="eleTextinIcon">
                                    ` + news.str_date + `
                                </p>
                            </li>
                            <li class="modPhoneCardMaxcomTable-dataArea pagNewsList-dataArea">
                                <p class="eleDataTit pagNewsList-dataArea--tit--phone pr-20">發佈人</p>
                                <p class="eleData pagNewsList-dataArea--data pr-30">
                                    ` + user_array[news.poster] + `
                                </p>
                            </li>
                        </ul>
                    </article>
                    `;
                });

                $("#news_list").html(list_str);
                if (news_list.length > 0) {
                    $("#news_div").show();
                }

                //最新報名活動列表
                var list_str = '';
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
                                <a href="eventin.html?activity_id=` + activity.id + `" class="pagEventList-statusOrder--phone--text pr-30">
                                    <p class="eleData typoMainColor">
                                        ` + activity.activity_code + `
                                    </p>
                                    ` + activity.name + `
                                </a>
                            </li>
                            <li class="modPhoneCardMaxcomTable-dataArea pagEventList-dataArea">
                                <p class="eleDataTit pagEventList-dataArea--tit--phone pr-20">活動日期與時間</p>
                                <p class="eleData pagEventList-dataArea--data">
                                    <img src="images/clock--gray--15.svg" alt="" class="eleTextinIcon" width="16">
                                    ` + activity_strdate_str + `
                                    － <br />
                                    <img src="images/clock--gray--15.svg" alt="" class="eleTextinIcon" width="16">
                                    ` + activity_enddate_str + `
                                </p>
                            </li>
                            <li class="modPhoneCardMaxcomTable-dataArea pagEventList-dataArea">
                                <p class="eleDataTit pagEventList-dataArea--tit--phone pr-20">參加對象</p>
                                <p class="eleData pagEventList-dataArea--data pr-30">
                                    ` + activity.target + `
                                </p>
                            </li>
                            <li class="modPhoneCardMaxcomTable-dataArea pagEventList-dataArea">
                                <p class="eleDataTit pagEventList-dataArea--tit--phone pr-20">報名期間</p>
                                <p class="eleData pagEventList-dataArea--data">
                                ` + activity_str_date_str + ` － <br /> ` + activity_end_date_str + `
                                </p>
                            </li>
                            <li class="modPhoneCardMaxcomTable-dataArea pagEventList-dataArea">
                                <p class="eleDataTit pagEventList-dataArea--tit--phone pr-20">活動名額</p>
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
                                        <img src="images/search--white--30.svg" alt="" class="btn-circleBase--icon">
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
                                        <img src="images/search--white--30.svg" alt="" class="btn-circleBase--icon">
                                    </a>
                                </li>
                                `
                            } else {
                                list_str += `
                                <li class="modPhoneCardMaxcomTable-dataArea pagEventList-dataArea pagEventList-btArea">
                                    <a href="eventdeclare.html?activity_id=` + activity.id + `" class="btnCircleMainColor mr-5" data-tooltip="報名活動" data-position="top center">
                                        <img src="images/add--white--30.svg" alt="" class="btn-circleBase--icon">
                                    </a>
                                </li>
                                `
                                list_str += `
                                <li class="modPhoneCardMaxcomTable-dataArea pagEventList-dataArea pagEventList-btArea">
                                    <a href="eventsearch.html?activity_id=` + activity.id + `" class="btnCircleSecondColor mr-5" data-tooltip="查詢修改 / 取消報名" data-position="top center">
                                        <img src="images/search--white--30.svg" alt="" class="btn-circleBase--icon">
                                    </a>
                                </li>
                                `
                            }
                            list_str += `
                        </ul>
                    </article>
                    `;
                });

                $("#activit_list").html(list_str);
            }
        });
    });
});
