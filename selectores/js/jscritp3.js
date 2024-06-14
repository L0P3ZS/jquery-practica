// $(".conte").find("p").eq(0).css("color", "red");

//Con el first selecciona el primer parrafo 
$("p").first().css('color', 'red');
//Con el last selecciona el ultimo parrafo
$("p").last().css("color", "green");

$(".contenido:contains('hola')").css("color", "blue");

$("a[href^='https://']").css("color", "red");


