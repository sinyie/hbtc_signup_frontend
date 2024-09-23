//var timeout;
//var count = auto_logout; // 倒數幾秒

$(document).ready(function () {
    $(document).on("click", ".selectLang", function () {
        var thisid = $(this).prop('id');
        var thisid_array = thisid.split("_");
        var lang = thisid_array[1];

        $.cookie('system_language', lang, { expires: 30 });
        $.i18n().locale = lang;
        //$('body').i18n();
        window.location.reload();
    });

    $(document).on("click", ".reset_auto_logout", function () {
        count = parseInt(auto_logout_count);
        //timeout = setTimeout(auto_logout, 1000); // 1秒執行一次
        //clearTimeout(timeout);
    });

    $(document).on("click", ".user_logout", function () {
        if (countdownlogout == "" || countdownlogout == "0" || countdownlogout == undefined) {
            //無設定倒數自動登出則於詢問後直接登出
            if (confirm($.i18n("common_determine_the_logout_system"))) {
                logout();
            } else {
                $(".reset_auto_logout").click();
                return false;
            }
        } else {
            //倒數秒數後自動登出
            clearTimeout(countdownlogoutset);
            $('.mini.modal').modal('show');
            countdownlogoutset = setTimeout(countdown_logout, 1000);
        }

        $("#big_user_logout").removeClass("active selected");
    });

    //打開告警通知按鈕
    $(document).on("click", ".jsNoteBt", function () {
        // console.log("我有觸發click事件");
        $.ajax({
            url: CONFIG["Api_Domain_Path"] + "readalarm",
            type: "POST",
            data: { 'user_id': $.cookie('userid') },
            dataType: 'json',
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status + ":" + xhr.responseText);
                console.log(xhr.status + ":" + xhr.responseText);
                //關閉loading
                $("body").nimbleLoader("hide");
            },
            success: function (response) {
                if (response.result == false) {//已被登出或無此權限
                    alert($.i18n(response.message));
                } else {
                    $(".jsNavSmall").animate({
                        left: '-320',
                    });

                    $(".jspatSmlNavNote").animate({
                        left: '0',
                    });

                    $("#small_alarmlogsNotReadCount").html('');
                    $("#big_alarmlogsNotReadCount").html('');
                }
            }
        });
    });

    $(document).on("click", ".jsNavSmlNote-bt--close", function () {
        // console.log("我有觸發關閉事件");
        $(".jspatSmlNavNote").animate({
            left: '-320',
        });
        $(".jsNavSml-openbg").fadeOut(500);
    });

    /*小視口導覽列以及大視口導覽列第二層開合特效*/
    $(document).on("click", ".jsfirst-level-area", function () {
        if ($(this).children(".jssecond-level-area").css("display") == "none") {
            //$(".jsfirst-level-area > .jsecond-level-area").slideUp(200);
            $(this).children(".jssecond-level-area").slideDown(200);

        } else if ($(this).children(".jssecond-level-area").css("display") == "block") {
            $(this).children(".jssecond-level-area").slideUp(200);
        };

    });
});

//抓網址參數
$.UrlParam = function (name) {
    //宣告正規表達式
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    /*
        * window.location.search 獲取URL ?之後的參數(包含問號)
        * substr(1) 獲取第一個字以後的字串(就是去除掉?號)
        * match(reg) 用正規表達式檢查是否符合要查詢的參數
    */
    var r = decodeURI(window.location.search).substring(1).match(reg);
    //如果取出的參數存在則取出參數的值否則回穿null
    if (r != null) return decodeURIComponent(r[2]); return "";
}

function b64EncodeUnicode(str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
}

function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

function NumberFormat(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function escapeHtml(unsafe) {
    return unsafe
        //.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

//自動登出偵測
function auto_logout() {
    if (count == 0) {
        //alert("登出");
        if (countdownlogout == "" || countdownlogout == "0" || countdownlogout == undefined) {
            //無設定倒數自動登出則直接登出
            logout();
        } else {
            //倒數秒數後自動登出
            clearTimeout(countdownlogoutset);
            $('.mini.modal').modal('show');
            countdownlogoutset = setTimeout(countdown_logout, 1000);
        }

        clearTimeout(timeout); // 可取消由 setTimeout() 方法設置的 timeout
    } else {
        count--;
        var d = Math.floor(count / (24 * 3600));
        var h = Math.floor((count % (24 * 3600)) / 3600);
        var m = Math.floor((count % 3600) / (60));
        var s = Math.floor(count % 60);

        if (count > 0) {
            logout_time = "";
            logout_time += (h + (d * 24) > 0) ? h + (d * 24) + "：" : "00：";
            logout_time += (m > 0) ? m + "：" : "00：";
            logout_time += s + "&nbsp;";
        } else { // 避免倒數變成負的
            logout_time = "00";
        }
        $("#reset_auto_logout1").html(logout_time);
        setTimeout(auto_logout, 1000);
    }
}

//使用者登出
function logout() {
    $.post(CONFIG["Api_Domain_Path"] + "checkLogout", { 'user_id': $.cookie('userid') }, function (response, status) {
        if (response.result == true) {
            $.cookie('userid', '');
            $.cookie('LoginCode', '');
            window.location.href = escapeHtml(response.redirectTo);
        } else {
            alert($.i18n(response.message));
        }
    }, "json");
}

//倒數確認登出
function countdown_logout() {
    $(".ui.mini.modal .actions .approve").html($.i18n("common_sign_out") + ' (' + countdownlogout + ')');
    countdownlogout = countdownlogout - 1;

    if (countdownlogout < 0) {
        logout();
        $('.mini.modal').modal('hideDimmer');
    } else {
        countdownlogoutset = setTimeout(countdown_logout, 1000);
    }

}

//載入系統設定
function LoadSysConfig(sysconfig) {
    //載入系統名稱
    $(document).prop("title", "臺中市政府衛生局　" + sysconfig[1].setvalue);
}

//偵測未讀告警訊息
function chk_alarm() {
    $.ajax({
        url: CONFIG["Api_Domain_Path"] + "chkalarm",
        type: "POST",
        data: { 'user_id': $.cookie('userid') },
        dataType: 'json',
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status + ":" + xhr.responseText);
            console.log(xhr.status + ":" + xhr.responseText);
            //關閉loading
            $("body").nimbleLoader("hide");
        },
        success: function (response) {
            if (response.result == false) {//已被登出或無此權限
                alert($.i18n(response.message));
            } else {
                var alarmlogsNotReadCount = response.alarmlog_list.alarmlogsNotReadCount;
                var alarmlogs = response.alarmlog_list.alarmlogs;

                var alarmlog_list = "";
                $.each(alarmlogs, function (i, alarmlog) {
                    var alarmlog_link = (alarmlog.link == "" || alarmlog.link == undefined) ? "javascript:void(0);" : alarmlog.link;

                    alarmlog_list += '\
                    <section class="patSmlNavNote-note pt-30 pb-20 plr-30">\
                        <p class="patSmlNavNote-note--list">\
                            ' + alarmlog.title + '：\
                        </p>\
                        <a href="' + alarmlog_link + '" class="patSmlNavNote-note--list--link">\
                            ' + alarmlog.description + '\
                        </a>\
                        <h6 class="patSmlNavNote-note--time pt-15">\
                            <img class="patSmlNavNote-note--time--icon" src="images/clock-icon.svg" alt="clock icon">\
                            ' + alarmlog.created_at + '\
                        </h6>\
                    </section>\
                    ';
                });

                $("#alarmlog_list").html(alarmlog_list);

                if (alarmlogsNotReadCount != "0") {
                    $("#small_alarmlogsNotReadCount").html('<span class="elenote-count">' + alarmlogsNotReadCount + '</span>');
                    $("#big_alarmlogsNotReadCount").html('<span class="elenote-count patBigNav-note--count">' + alarmlogsNotReadCount + '</span>');
                }

                setTimeout(chk_alarm, chk_alarm_count);
            }
        }
    });
}

//依權限顯示全域導覽資料
function ShowNavigation(menu_id, sysconfig) {
    //js初始化重新載入
    $.getScript("js/semantic.min.js");
    $.getScript("js/semantic-ini.js");
    $.getScript("js/web-js.js");

    //全域導覽權限控制
    var menu_ss = "";
    if (menu_id == '0') menu_ss = "patNavMenu-list--active"; else menu_ss = "";
    if (menu_id == '1') menu_ss1 = "patNavMenu-list--active"; else menu_ss1 = "";
    if (menu_id == '2') menu_ss2 = "patNavMenu-list--active"; else menu_ss2 = "";

    $(".jsNavMain").html(`
        <a class="patSkip_main js-patNavMenu-list" href="#acckeyC" accesskey="C" title="中央內容區塊" tabindex="1" id="patSkip_main">跳到主要內容區</a>
        <!-- 漢堡選單 -->
        <header class="patSmlHeader">
            <button class="jsNavSml-bt">
                <img src="images/nav-open--gray.svg" alt="打開功能列表按鈕" width="30" height="30" class="patSmlHeader-navbt">
            </button>
        </header>
        <!-- nav功能選單 -->
        <nav class="patSmlNav jsNavSmall">
            
            <div class="patSmlNav-LogoNameBk">
                <img src="images/logo.png" alt="臺中市政府衛生局LOGO" class="patSmlNav-LogoNameBk--logo">
                <p class="patSmlNav-LogoNameBk--name">
                    臺中市政府衛生局<br />
                    <span>` + sysconfig[1].setvalue + `</span>
                </p>
            </div>
            <section class="patNavMenu">
                <ul class="jsfirst-level-area">
                    <a href="index.html" class="patNavMenu-list js-patNavMenu-list ` + menu_ss + `" title="系統總覽頁">
                        <div class="patNavMenu-iconArea">
                            <img class="patNavMenu-icon" src="images/nav-home--gray.svg" alt="" >
                        </div>
                        系統總覽頁
                    </a>
                    <div class="clear"></div>
                </ul>
                <ul class="jsfirst-level-area">
                    <a href="eventli.html" class="patNavMenu-list js-patNavMenu-list ` + menu_ss1 + `" title="報名活動一覽">
                        <div class="patNavMenu-iconArea">
                            <img class="patNavMenu-icon" src="images/nav-event--gray.svg" alt="" >
                        </div>
                        報名活動一覽
                    </a>
                    <div class="clear"></div>
                </ul>
                <ul class="jsfirst-level-area">
                    <a href="newsli.html" class="patNavMenu-list js-patNavMenu-list ` + menu_ss2 + `" title="活動消息一覽">
                        <div class="patNavMenu-iconArea">
                            <img class="patNavMenu-icon" src="images/nav-news--gray.svg" alt="" >
                        </div>
                        活動消息一覽
                    </a>
                    <div class="clear"></div>
                </ul>
            </section>
            <button class="patSmlNav-closeBt jsNavSml-bt--close js-patNavMenu-list">
                <img src="images/nav-close--gray.svg" alt="關掉功能列表按鈕" width="30" height="30">
            </button>
            <p class="patNavCopyright">
                本網站為臺中市政府衛生局版權所有，請尊重智慧財產權，未經允許請勿任意轉載、複製或做商業用途。<br /><br />
                請使用Chrome、FireFox、Edge等瀏覽器瀏覽 <br /><br />
                420206 臺中市豐原區中興路136號
            </p>

        </nav>
        <div class="patSmlNavopen_bg jsNavSml-openbg"></div>
    `);

    $('body').i18n();
}
