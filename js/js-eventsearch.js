/*eventsearch.html js*/
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
            data: { 'chk_php_self': location.pathname, 'menu_id': menu_id, 'activity_id': activity_id, 'mode': 'join' },
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
                var captcha = response.captcha;

                //產生全域導覽資料
                LoadSysConfig(sysconfig);
                ShowNavigation(menu_id, sysconfig);

                var breadcrumb_div = "";
                breadcrumb_div += `
                <a href="eventli.html" class="patBiteBt" title="報名活動一覽">報名活動一覽</a>
                <a href="eventin.html?activity_id=` + activity_id + `" class="patBiteBt" title="` + activity.name + `">` + activity.name + `</a>
                <a href="javascript:void(0);" class="patBiteBt patBiteBt--in">活動查詢 / 修改 / 取消</a>
                `
                $("#breadcrumb_div").html(breadcrumb_div);

                $("#activity_name").html("活動查詢 / 取消：" + activity.activity_code + "：" + activity.name);

                $("#captcha_img").prop("src", captcha.img);
                $("#captcha_key").val(captcha.key);

                $(document).prop("title", "臺中市政府衛生局" + sysconfig[1].setvalue + " - 報名活動一覽 - " + " - " + activity.name);
            }
        });
    });

    $(document).on("blur", ".chkNumber", function () {
        $(this).val($(this).val().replace(/[^0-9]/g, ''));
    });

    function isEmail(toTest) {
        var regDoNot = /(@.*@)|(\.\.)|(@\.)|(\.@)|(^\.)/;
        var regMust = /^[a-zA-Z0-9\-\.\_]+\@[a-zA-Z0-9\-\.]+\.([a-zA-Z]{2,3})$/;
        var ok = false;
        if (!regDoNot.test(toTest) && regMust.test(toTest)) {
            ok = true;
        }
        return ok;
    }

    $(document).on("click", "#captcha_img", function () {
        $.ajax({
            url: CONFIG["Api_Domain_Path"] + "captcha",
            type: "POST",
            data: { 'chk_php_self': location.pathname, 'chk_user_id': '1' },
            dataType: 'json',
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status + ":" + xhr.responseText);
                console.log(xhr.status + ":" + xhr.responseText);
            },
            success: function (response) {
                //console.log(response);
                var captcha = response.captcha;

                $("#captchaCode").val('');
                $("#captcha_img").prop("src", captcha.img);
                $("#captcha_key").val(captcha.key);
                $("#captchaCode").focus();
            }
        });
    });

    //確認新增、修改欄位並送出
    $(document).on("click", ".chk_button", function () {
        var thisid = $(this).prop('id');

        if ($.trim($("#join_edit_email").val()) == "") {
            $("#errMsg_email").html($.i18n("*請輸入Email"));
            $("#join_edit_email").focus();
            return false;
        } else {
            $("#errMsg_email").html("&nbsp;");
        }

        if (!isEmail($.trim($("#join_edit_email").val()))) {
            $("#errMsg_email").html($.i18n("*Email格式錯誤"));
            $("#join_edit_email").focus();
            return false;
        } else {
            $("#errMsg_email").html("&nbsp;");
        }

        if ($.trim($("#join_edit_id_number").val()) == "") {
            $("#errMsg_id_number").html($.i18n("*請輸入身分證字號後4碼"));
            $("#join_edit_id_number").focus();
            return false;
        } else {
            $("#errMsg_id_number").html("&nbsp;");
        }

        if ($.trim($("#join_edit_id_number").val()).length < 4) {
            $("#errMsg_id_number").html($.i18n("*長度不足4碼"));
            $("#join_edit_id_number").focus();
            return false;
        } else {
            $("#errMsg_id_number").html("&nbsp;");
        }

        if ($.trim($("#captchaCode").val()) == "") {
            $("#errMsg_captchaCode").html($.i18n("*請輸入驗證碼"));
            $("#captchaCode").focus();
            return false;
        } else {
            $("#errMsg_captchaCode").html("&nbsp;");
        }

        if (thisid == "chk_del") {
            alert("提醒您！取消報名後，系統會將您的報名紀錄刪除！\n\n如果要再報名，需重新申請報名活動！");
            var confirm_str = "確定取消報名嗎？";
            var doact = "frontend_deletejoin";
        } else {
            var confirm_str = "確定送出查詢嗎？";
            var doact = "checkjoin";
        }

        if (confirm(confirm_str)) {

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

            $.ajax({
                url: CONFIG["Api_Domain_Path"] + doact,
                type: "POST",
                cache: false,
                data: new FormData($("#myform")[0]),
                processData: false,
                contentType: false,
                error: function (xhr, ajaxOptions, thrownError) {
                    alert(xhr.status + ":" + xhr.responseText);
                    console.log(xhr.status + ":" + xhr.responseText);
                    //關閉loading
                    $("body").nimbleLoader("hide");
                },
                success: function (response) {
                    //請求成功時處理
                    if (response.result == true) {
                        if (thisid == "chk_del") {
                            alert("取消成功！\n\n系統已經發送確認信件到您的E-mail信箱，請確認是否有收到信件，確保您有完成取消報名流程！");

                            window.location.href = "index.html";
                        } else {
                            $.cookie('chk_search', response.join_id);
                            window.location.href = escapeHtml(response.redirectTo + "?activity_id=" + activity_id);
                        }

                    } else {
                        alert($.i18n(response.message));
                        console.log(response.message);
                        $("#captcha_img").click();
                    }
                    //關閉loading
                    $("body").nimbleLoader("hide");
                },
            });
        }
    });
});
