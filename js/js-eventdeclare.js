/*eventdeclare.html js*/
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
                $.getScript("js/web-js.js");

                var sysconfig = response.sysconfig;
                var activity_class = response.activity_class;
                var activity = response.activity;
                var join_total = parseInt(response.join_total);
                var join_status2 = parseInt(response.join_status2);
                var join_limit = parseInt(activity.join_limit);
                var article_info = response.article_info.info;

                var startArray = activity.str_date.split(" ");
                var startdateArray = startArray[0].split("-");
                var starttimeArray = startArray[1].split(":");
                var endArray = activity.end_date.split(" ");
                var enddateArray = endArray[0].split("-");
                var endtimeArray = endArray[1].split(":");
                var chk_star_date = new Date(startdateArray[0], startdateArray[1] - 1, startdateArray[2], starttimeArray[0], starttimeArray[1]);
                var chk_end_date = new Date(enddateArray[0], enddateArray[1] - 1, enddateArray[2], endtimeArray[0], endtimeArray[1]);

                if (formattedDate < chk_star_date) {
                    alert("此活動尚未開始報名！");
                    window.location.href = "index.html";
                } else if (formattedDate > chk_end_date) {
                    alert("此活動已超過報名時間！");
                    window.location.href = "index.html";
                } else if (join_limit <= join_status2) {
                    alert("此活動已超過報名人數上限！");
                    window.location.href = "index.html";
                }

                //產生全域導覽資料
                LoadSysConfig(sysconfig);
                ShowNavigation(menu_id, sysconfig);

                var breadcrumb_div = "";
                breadcrumb_div += `
                <a href="eventli.html" class="patBiteBt" title="報名活動一覽">報名活動一覽</a>
                <a href="eventin.html?activity_id=` + activity_id + `" class="patBiteBt" title="` + activity.name + `">` + activity.name + `</a>
                <a href="javascript:void(0);" class="patBiteBt patBiteBt--in">活動報名：隱私權及資訊安全政策</a>
                `
                $("#breadcrumb_div").html(breadcrumb_div);

                $("#article_info").html(article_info);

                $(document).prop("title", "臺中市政府衛生局" + sysconfig[1].setvalue + " - 報名活動一覽 - " + " - " + activity.name);
            }
        });
    });

    $(document).on("click", ".join_activity_btn", function () {
        if ($("#chk_policy").prop("checked") == false) {
            alert("*請詳讀並了解本局蒐集、處理您的個人資料的目的後，勾選確認！");
            $("#chk_policy").focus();
            return false;
        }

        $.cookie('chk_policy', activity_id);

        window.location.href = escapeHtml("eventadd.html?activity_id=" + activity_id);
    });
});
