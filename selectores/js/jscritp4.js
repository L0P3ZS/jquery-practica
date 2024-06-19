$('#lista > li').css('color', 'red');

$("div[data-color='rojo']").css('color', 'blue');

//el not es para buscar un elemento
$("p ").not('.oculto').css('color', 'green');
//sirve para seleccionar una clase
$(selector).hasClass(className);