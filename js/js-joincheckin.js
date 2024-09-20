/*joincheckin.html js*/

$(document).ready(function () {
    activity_id = $.UrlParam("activity_id");
    $("#activity_id").val(activity_id);
    internal_id = $.UrlParam("internal_id");
    $("#internal_id").val(internal_id);
    join_code = $.UrlParam("join_code");
    $("#join_code").val(join_code);
    if (activity_id == "" || join_code == "") {
        window.location.href = "index.html";
    }

    csrf_promise.then((value) => {
        $.ajax({
            url: CONFIG["Api_Domain_Path"] + "getjoincode",
            type: "POST",
            data: { 'activity_id': activity_id, 'internal_id': internal_id, 'join_code': join_code },
            dataType: 'json',
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status + ":" + xhr.responseText);
                console.log(xhr.status + ":" + xhr.responseText);
            },
            success: function (response) {
                if (response.result == false) {//已被登出或無此權限
                    alert($.i18n(response.message));
                    window.location.href = "index.html";

                } else {
                    var joinQRCode = response.joinQRCode;

                    $("#qrcode_img").prop('src', "data:image/png;base64, " + joinQRCode);
                    $("#qrcode_img").show();

                }
            }
        });
    });
});
