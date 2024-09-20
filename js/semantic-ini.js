/*semantic ini 初始化*/
$(document).ready(function() {
   
    $('.ui.dropdown').dropdown();
    $('.ui.radio').checkbox();
    $('.ui.checkbox').checkbox();
    $('#select').dropdown();
    $('.ui.accordion').accordion();
    $('.message .close').on('click', function() {
        $(this).parent().parent().transition('fade');
        $(this).closest('.message').transition('fade');
    });

    
});
