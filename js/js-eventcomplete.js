/*eventcomplete.html js*/
var menu_id = "1";
$(document).ready(function() {
    reply_code = $.UrlParam("reply_code");
    $("#reply_code").val(reply_code);
    if (reply_code == "") {
        //window.location.href = "index.html";
    }

    csrf_promise.then((value) => {
        $.ajax({
            url: CONFIG["Api_Domain_Path"] + "replyjoin",
            type: "POST",
            data: { 'chk_php_self': location.pathname, 'menu_id': menu_id, 'reply_code': reply_code },
            dataType: 'json',
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status + ":" + xhr.responseText);
                console.log(xhr.status + ":" + xhr.responseText);
                //關閉loading
                $("body").nimbleLoader("hide");
            },
            success: function (response) {
                if (response.result == false) {
                    alert(response.message);
                    window.location.href = "index.html";
                } else {
                    $.getScript("js/web-js.js");

                    var sysconfig = response.sysconfig;
                    var join = response.join;
                    var activity = response.activity;
                    var activity_id = activity.id;

                    //產生全域導覽資料
                    LoadSysConfig(sysconfig);
                    ShowNavigation(menu_id, sysconfig);

                    var breadcrumb_div = "";
                    breadcrumb_div += `
                    <a href="eventli.html" class="patBiteBt">報名活動一覽</a>
                    <a href="eventin.html?activity_id=` + activity_id + `" class="patBiteBt">` + activity.name + `</a>
                    <a href="javascript:void(0);" class="patBiteBt patBiteBt--in">確認完成報名</a>
                    `
                    $("#breadcrumb_div").html(breadcrumb_div);

                    var activity_strdate_str = (activity.activity_strdate != "" && activity.activity_strdate != null) ? activity.activity_strdate.substring(0, activity.activity_strdate.length - 3) : "";
                    var activity_enddate_str = (activity.activity_enddate != "" && activity.activity_enddate != null) ? activity.activity_enddate.substring(0, activity.activity_enddate.length - 3) : "";
                    var reply_info = "";
                    reply_info += `
                    您已確認並完成報名流程，感謝您參加本次活動！<br><br>
                    以下為活動資訊，屆時請於報到時間準時參加，謝謝！<br><br>
                    活動代碼：` + activity.activity_code + `<br>
                    活動名稱：` + activity.name + `<br>
                    活動日期期間：` + activity_strdate_str + ` － ` + activity_enddate_str + `<br>
                    活動地點：` + activity.location + `<br><br>
                    聯絡人姓名：` + activity.contact_name + `<br>
                    聯絡人電話：` + activity.contact_tel + `<br>
                    聯絡人Email：` + activity.contact_email + `<br>
                    `

                    $("#reply_info").html(reply_info);

                    $(document).prop("title", "臺中市政府衛生局" + sysconfig[1].setvalue + " - 報名活動一覽 - " + " - " + activity.name);
                }
            }
        });
    });
});
