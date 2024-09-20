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

    if (activity_id != $.cookie('chk_policy')) {
        window.location.href = escapeHtml("eventdeclare.html?activity_id=" + activity_id);
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
                var join_total = parseInt(response.join_total);
                var join_status2 = parseInt(response.join_status2);
                var join_limit = parseInt(activity.join_limit);
                var captcha = response.captcha;

                var startArray = activity.str_date.split(" ");
                var startdateArray = startArray[0].split("-");
                var starttimeArray = startArray[1].split(":");
                var endArray = activity.end_date.split(" ");
                var enddateArray = endArray[0].split("-");
                var endtimeArray = endArray[1].split(":");
                chk_star_date = new Date(startdateArray[0], startdateArray[1] - 1, startdateArray[2], starttimeArray[0], starttimeArray[1]);
                chk_end_date = new Date(enddateArray[0], enddateArray[1] - 1, enddateArray[2], endtimeArray[0], endtimeArray[1]);

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

                supply_food = activity.supply_food;
                if (supply_food == "1") {
                    $("#need_food_div").show();
                } else {
                    $("#need_food_div").hide();
                }

                $.each(CONFIG_NEED_FOOD, function (key, values) {
                    var varItem = new Option($.i18n(values), key);//(objItemText, objItemValue)
                    document.getElementById('join_edit_need_food').options.add(varItem);
                });

                var breadcrumb_div = "";
                breadcrumb_div += `
                <a href="eventli.html" class="patBiteBt" title="報名活動一覽">報名活動一覽</a>
                <a href="eventin.html?activity_id=` + activity_id + `" class="patBiteBt" title="` + activity.name + `">` + activity.name + `</a>
                <a href="javascript:void(0);" class="patBiteBt patBiteBt--in">活動報名</a>
                `
                $("#breadcrumb_div").html(breadcrumb_div);

                var startArray = activity.str_date.split(" ");
                var startdateArray = startArray[0].split("-");
                var starttimeArray = startArray[1].split(":");
                var endArray = activity.end_date.split(" ");
                var enddateArray = endArray[0].split("-");
                var endtimeArray = endArray[1].split(":");
                chk_star_date = new Date(startdateArray[0], startdateArray[1] - 1, startdateArray[2], starttimeArray[0], starttimeArray[1]);
                chk_end_date = new Date(enddateArray[0], enddateArray[1] - 1, enddateArray[2], endtimeArray[0], endtimeArray[1]);

                $("#activity_name").html(activity.activity_code + "：" + activity.name);

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
    $(document).on("click", "#chk_button", function () {
        var chkDate = new Date();
        if (chkDate > chk_end_date) {
            alert("*已超過報名日期與時間！");
            return false;
        }

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

        if ($.trim($("#join_edit_name").val()) == "") {
            $("#errMsg_name").html($.i18n("*請輸入姓名"));
            $("#join_edit_name").focus();
            return false;
        } else {
            $("#errMsg_name").html("&nbsp;");
        }

        if ($.trim($("#join_edit_organs").val()) == "") {
            $("#errMsg_organs").html($.i18n("*請輸入機關名稱"));
            $("#join_edit_organs").focus();
            return false;
        } else {
            $("#errMsg_organs").html("&nbsp;");
        }

        /* if ($.trim($("#join_edit_department").val()) == "") {
            $("#errMsg_department").html($.i18n("*請輸入部門"));
            $("#join_edit_department").focus();
            return false;
        } else {
            $("#errMsg_department").html("&nbsp;");
        } */

        if ($.trim($("#join_edit_title").val()) == "") {
            $("#errMsg_title").html($.i18n("*請輸入職稱"));
            $("#join_edit_title").focus();
            return false;
        } else {
            $("#errMsg_title").html("&nbsp;");
        }

        if ($.trim($("#join_edit_tel").val()) == "") {
            $("#errMsg_tel").html($.i18n("*請輸入連絡電話"));
            $("#join_edit_tel").focus();
            return false;
        } else {
            $("#errMsg_tel").html("&nbsp;");
        }

        if (supply_food == "1" && $.trim($("#join_edit_need_food").val()) == "") {
            $("#errMsg_need_food").html($.i18n("*請選擇是否用餐"));
            $("#join_edit_need_food").focus();
            return false;
        } else {
            $("#errMsg_need_food").html("&nbsp;");
        }

        if ($.trim($("#captchaCode").val()) == "") {
            $("#errMsg_captchaCode").html($.i18n("*請輸入驗證碼"));
            $("#captchaCode").focus();
            return false;
        } else {
            $("#errMsg_captchaCode").html("&nbsp;");
        }

        if (confirm("確定送出申請嗎？")) {

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
                url: CONFIG["Api_Domain_Path"] + "frontend_createjoin",
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
                        alert("送出成功！\n\n系統已經發送確認信件到您的E-mail信箱，請確認是否有收到信件，確保您有完成報名流程！");

                        $.cookie('chk_policy', '');
                        window.location.href = "index.html";
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
