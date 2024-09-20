// function updateText() {
// 	var i18n = $.i18n();
// 	// i18n.locale = 'zh-TW';

	
// 	i18n.locale = navigator.language;
// 	file = 'i18n/demo-'+i18n.locale + '.json';

// 	// http://localhost/jquery.i18n-master/demo/test.html
// 	var zh= 'zh-TW';

// 	//$(html).i18n();

// 	if (i18n.locale == zh ) {
// 		i18n.load( 'i18n/json/lan-' + i18n.locale + '.json', i18n.locale ).done(
// 			function () {
// 				$(".i18n").each(function(){
// 					var data = $(this).attr("data-i18n");
// 					// console.log(data);
// 					$(this).html($.i18n( data ));
// 				});
// 			}
// 		);
// 	}else{
// 		i18n.load({en:'i18n/json/lan-en-US.json'}).done(
// 			function () {
// 				$(".i18n").each(function(){
// 					var data = $(this).attr("data-i18n");
// 					// console.log(data);
// 					$(this).html($.i18n( data ));
// 				});
// 			} 
// 		);
// 	}

	

// }

// $.i18n.debug = true;

// $( document ).ready( function ( $ ) {
// 	console.log(navigator.language);
// 	updateText();
	
	
// } );

$.i18n().locale=navigator.language;
 $.i18n().load({
  'en': 'i18n/json/lan-en-US.json',
  'zh': 'i18n/json/lan-zh-TW.json'
 }).done(function() {
  $('body').i18n();
  //alert($.i18n('common_password'));
 });