/*eventin.html js*/
var menu_id = "1";
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

$(document).ready(function() {
    activity_id = $.UrlParam("activity_id");
    $("#activity_id").val(activity_id);
    if (activity_id == "") {
        window.location.href = "index.html";
    }

    csrf_promise.then((value) => {
        $.ajax({
            url: CONFIG["Api_Domain_Path"] + "frontend_getactivity",
            type: "POST",
            data: { 'chk_php_self': location.pathname, 'menu_id': menu_id, 'activity_id': activity_id },
            dataType: 'json',
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status + ":" + xhr.responseText);
                console.log(xhr.status + ":" + xhr.responseText);
                //關閉loading
                $("body").nimbleLoader("hide");
            },
            success: function (response) {
                if (response.result == false) {
                    alert($.i18n(response.message));
                    window.location.href = "index.html";
                } else {
                    $.getScript("js/web-js.js");

                    var sysconfig = response.sysconfig;
                    var activity_class = response.activity_class;
                    var activity = response.activity;
                    var fileData = response.fileData;
                    var join_total = parseInt(response.join_total);
                    var join_status2 = parseInt(response.join_status2);
                    var join_limit = parseInt(activity.join_limit);

                    //產生全域導覽資料
                    LoadSysConfig(sysconfig);
                    ShowNavigation(menu_id, sysconfig);

                    var breadcrumb_div = "";
                    breadcrumb_div += `
                    <a href="eventli.html" class="patBiteBt" title="報名活動一覽">報名活動一覽</a>
                    <a href="eventin.html?activity_id=` + activity_id + `" class="patBiteBt patBiteBt--in" title="` + activity.name + `">` + activity.name + `</a>
                    `
                    $("#breadcrumb_div").html(breadcrumb_div);

                    var activity_strdate_str = (activity.activity_strdate != "" && activity.activity_strdate != null) ? activity.activity_strdate.substring(0, activity.activity_strdate.length - 3) : "";
                    var activity_enddate_str = (activity.activity_enddate != "" && activity.activity_enddate != null) ? activity.activity_enddate.substring(0, activity.activity_enddate.length - 3) : "";
                    var activity_str_date_str = (activity.str_date != "" && activity.str_date != null) ? activity.str_date.substring(0, activity.str_date.length - 3) : "";
                    var activity_end_date_str = (activity.end_date != "" && activity.end_date != null) ? activity.end_date.substring(0, activity.end_date.length - 3) : "";
                    var join_limit_str = (activity.join_limit == "0") ? "無限制" : activity.join_limit;
                    var join_price_str = (activity.price == "0") ? "免費" : "$ " + activity.price;
                    var need_food_str = CONFIG_NEED_FOOD[activity.need_food];
                    var activity_mode_str = CONFIG_ACTIVITY_MODE[activity.mode];
                    //activity_info = activity_info.replace(/\n/g, "<br>").replace(/ /g, "&nbsp;");

                    var startArray = activity.str_date.split(" ");
                    var startdateArray = startArray[0].split("-");
                    var starttimeArray = startArray[1].split(":");
                    var endArray = activity.end_date.split(" ");
                    var enddateArray = endArray[0].split("-");
                    var endtimeArray = endArray[1].split(":");
                    var chk_star_date = new Date(startdateArray[0], startdateArray[1] - 1, startdateArray[2], starttimeArray[0], starttimeArray[1]);
                    var chk_end_date = new Date(enddateArray[0], enddateArray[1] - 1, enddateArray[2], endtimeArray[0], endtimeArray[1]);

                    $(".activity_code").html(activity.activity_code);
                    $("#activity_name").html(activity.name);
                    $("#activity_strdate").html(`<img src="images/clock--gray--15.svg" alt="clock" class="eleTextinIcon">` + activity_strdate_str + ` － ` + activity_enddate_str);
                    $("#join_limit").html(join_limit_str);
                    $("#join_total").html(join_total);
                    $("#join_status2").html(join_status2);
                    $("#join_price").html(join_price_str);
                    $("#join_date").html(activity_str_date_str + " － " + activity_end_date_str);
                    $("#activity_code").html(activity.activity_code);
                    $("#activity_location").html(activity.location);
                    $("#activity_info").html(activity.info);
                    $("#activity_remarks").html(activity.remarks);

                    $("#activity_target").html(activity.target);
                    $("#activity_mode").html(activity_mode_str);
                    $("#activity_need_food").html(need_food_str);

                    $("#activity_contact_name").html(activity.contact_name);
                    $("#activity_contact_tel").html(activity.contact_tel);
                    $("#activity_contact_email").html('<a href="mailto:' + activity.contact_email + '" class="typoMainColor typo-wordBreak--all">' + activity.contact_email + '</a>');

                    /* var file_list = "";
                    $.each(fileData, function (i, file) {
                        file_list +=`
                        <li class="modDownload-list">
                            <div class="modDownload-list--listDec"></div>
                            <a href="`+ CONFIG["Api_Domain_Path"] + 'activity/' + nid + '/' + file.value +`" title="` + file.name + `" download="` + file.name + `" class="modDownload-list--link">
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

                    if (formattedDate >= chk_star_date && formattedDate <= chk_end_date && join_limit > join_status2) {
                        $(".join_activity_btn").show();
                    }
                    if (formattedDate >= chk_star_date) {
                        $(".search_activity_btn").show();
                    }

                    $(".join_activity_btn").prop("href", "eventdeclare.html?activity_id=" + activity.id);
                    $(".search_activity_btn").prop("href", "eventsearch.html?activity_id=" + activity.id);
                    $(document).prop("title", "臺中市政府衛生局" + sysconfig[1].setvalue + " - 報名活動一覽 - " + " - " + activity.name);
                }
            }
        });
    });
});
