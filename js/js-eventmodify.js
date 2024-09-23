/*eventmodify.html js*/
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
                <a href="eventli.html" class="patBiteBt">報名活動一覽</a>
                <a href="eventin.html?activity_id=` + activity_id + `" class="patBiteBt">` + activity.name + `</a>
                <a href="javascript:void(0);" class="patBiteBt patBiteBt--in">修改報名資料</a>
                `
                $("#breadcrumb_div").html(breadcrumb_div);

                $("#activity_name").html("修改報名資料：" + activity.activity_code + "：" + activity.name);

                $("#join_name").html(join.name);
                $("#join_email").html(join.email);
                $("#join_id_number").html(join.id_number);

                $("#join_edit_email").val(join.email);
                $("#join_edit_id_number").val(join.id_number);
                $("#join_edit_name").val(join.name);
                $("#join_edit_organs").val(join.organs);
                $("#join_edit_department").val(join.department);
                $("#join_edit_title").val(join.title);
                $("#join_edit_tel").val(join.tel);
                $("#join_edit_need_food").val(join.need_food);
                $("#join_edit_remarks").val(join.remarks);

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

    //退出查詢
    $(document).on("click", "#chk_logout", function () {
        if (confirm("確定退出查詢嗎？")) {
            $.cookie('chk_search', '');
            window.location.href = "index.html";
        }
    });

    //確認新增、修改欄位並送出
    $(document).on("click", "#chk_button", function () {
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

        if ($.trim($("#join_edit_need_food").val()) == "") {
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

        if (confirm("確定修改報名資料嗎？")) {

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

            var theFormData = new FormData($("#myform")[0]);
            theFormData.append('chk_search', $.cookie('chk_search'));

            $.ajax({
                url: CONFIG["Api_Domain_Path"] + "frontend_editjoin",
                type: "POST",
                cache: false,
                data: theFormData,
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
                        alert("修改成功！");
                        $.cookie('chk_search', '');
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
