const csrf_promise = new Promise((resolve, reject) => {
    $.ajax({
        url: "http://35.185.155.151/api/getCSRFToken",
        type: "GET",
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status + ":" + xhr.responseText);
            console.log(xhr.status + ":" + xhr.responseText);
        },
        success: function (response) {
            $('meta[name="csrf-token"]').attr('content', response);

			$.ajaxSetup({
				headers: {
					'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
				}
			});
            resolve(response);
        }
    });
});
