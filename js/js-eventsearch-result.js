/*eventsearch-result.html js*/
var menu_id = "1";
$(document).ready(function() {
    activity_id = $.UrlParam("activity_id");
    $("#activity_id").val(activity_id);
    if (activity_id == "" || $.cookie('chk_search') == "" || $.cookie('chk_search') == undefined) {
        window.location.href = "index.html";
    }

    csrf_promise.then((value) => {
        $.ajax({
            url: CONFIG["Api_Domain_Path"] + "frontend_getjoin",
            type: "POST",
            data: { 'chk_php_self': location.pathname, 'menu_id': menu_id, 'activity_id': activity_id, 'chk_search': $.cookie('chk_search') },
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
                var join = response.joinData.join;
                var joinfields = response.joinData.joinfields;
                var activity = response.joinData.activity;
                var captcha = response.captcha;

                //產生全域導覽資料
                LoadSysConfig(sysconfig);
                ShowNavigation(menu_id, sysconfig);

                var breadcrumb_div = "";
                breadcrumb_div += `
                <a href="eventli.html" class="patBiteBt" title="報名活動一覽">報名活動一覽</a>
                <a href="eventin.html?activity_id=` + activity_id + `" class="patBiteBt" title="` + activity.name + `">` + activity.name + `</a>
                <a href="javascript:void(0);" class="patBiteBt patBiteBt--in">查詢報名資料</a>
                `
                $("#breadcrumb_div").html(breadcrumb_div);

                $("#activity_name").html("查詢報名資料：" + activity.activity_code + "：" + activity.name);

                $("#join_name").html(join.name);
                $("#join_email").html(join.email);
                $("#join_id_number").html(join.id_number);

                if (join.status == "0") {
                    $("#join_status").html(`<p class="typoText-20 typo-contentIcon typoGrayColor-200"><img src="images/status--unstage.svg" alt="審核中" class="typo-contentIcon--icon mr-5">審核中</p>`);
                } else if (join.status == "1") {
                    $("#join_status").html(`<p class="typoText-20 typo-contentIcon typoSuccessColor"><img src="images/status--ok.svg" alt="已審核" class="typo-contentIcon--icon mr-5">已審核</p>`);
                    $("#errMsg_status").html("※提醒您！需於 " + join.url_expire_date + " 前，至您的信箱點擊確認報名連結，才算完成報名流程喔！");
                } else if (join.status == "2") {
                    $("#join_status").html(`<p class="typoText-20 typo-contentIcon typoSuccessColor"><img src="images/status--ok.svg" alt="已確認" class="typo-contentIcon--icon mr-5">已確認</p>`);
                } else if (join.status == "4") {
                    $("#join_status").html(`<p class="typoText-20 typo-contentIcon typoDangerColor"><img src="images/status--no.svg" alt="審核未通過" class="typo-contentIcon--icon mr-5">審核未通過</p>`);
                }

                $("#join_organs").html(join.organs);
                $("#join_department").html(join.department);
                $("#join_title").html(join.title);
                $("#join_tel").html(join.tel);
                $("#join_need_food").html(STATUS_OPTION[join.need_food]);
                $("#join_remarks").html(join.remarks.replace(/\n/g, "<br>").replace(/ /g, "&nbsp;"));

                $(document).prop("title", "臺中市政府衛生局" + sysconfig[1].setvalue + " - 報名活動一覽 - " + " - " + activity.name);
            }
        });
    });

    //退出查詢
    $(document).on("click", "#chk_logout", function () {
        if (confirm("確定退出查詢嗎？")) {
            $.cookie('chk_search', '');
            window.location.href = "index.html";
        }
    });
});
