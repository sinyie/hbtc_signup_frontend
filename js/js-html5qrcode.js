/*html5qrcode.html js*/
var cameraId = "";
$(document).ready(function () {
    //html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
    //html5QrcodeScanner.render(onScanSuccess, onScanError);

    //取得攝影機裝置ID
    Html5Qrcode.getCameras().then(devices => {
    /**
     * devices would be an array of objects of type:
     * { id: "id", label: "label" }
     */
    if (devices && devices.length) {
        cameraId = devices[0].id;
        // .. use this to start scanning.
    }
    }).catch(err => {
        // handle err
        alert("找不到攝影機！");
    });

    csrf_promise.then((value) => {

    });

    //開啟攝影機開始掃描
    $(document).on("click", "#star_scan", function () {
        if (cameraId == "") {
            alert("找不到攝影機！");
        } else {
            html5QrCode = new Html5Qrcode("reader");
            const qrCodeSuccessCallback = (decodedText, decodedResult) => {
                /* handle success */
                alert(decodedText);
            };
            const qrCodeErrorCallback = (errorMessage) => {
                // handle on error condition, with error message
                //console.log(errorMessage);
            };
            const config = { fps: 10, qrbox: { width: 250, height: 250 } };

            //html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback, qrCodeErrorCallback);
            html5QrCode.start({ deviceId: { exact: cameraId} }, config, qrCodeSuccessCallback, qrCodeErrorCallback);

            /* html5QrCode = new Html5Qrcode("reader");
            html5QrCode.start(
            cameraId,
            {
                fps: 10,    // Optional, frame per seconds for qr code scanning
                qrbox: { width: 250, height: 250 }  // Optional, if you want bounded box UI
            },
            (decodedText, decodedResult) => {
                // do something when code is read
                alert(decodedText);
            },
            (errorMessage) => {
                // parse error, ignore it.
            })
            .catch((err) => {
                // Start failed, handle it.
            }); */
        }
    });

    //關閉攝影機停止掃描
    $(document).on("click", "#stop_scan", function () {
        if (cameraId == "") {
            alert("找不到攝影機！");
        } else {
            html5QrCode.stop().then((ignore) => {
                // QR Code scanning is stopped.
            }).catch((err) => {
                // Stop failed, handle it.
            });
        }
    });
});

function onScanSuccess(decodedText, decodedResult) {
    // Handle on success condition with the decoded text or result.
    alert(decodedText);
    html5QrcodeScanner.clear();
    console.log(`Scan result: ${decodedText}`, decodedResult);

}

function onScanError(errorMessage) {
    // handle on error condition, with error message
    //console.log(errorMessage);
}
