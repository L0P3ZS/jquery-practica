$("p").css("color", "blue");

//Selectores 2

$(".input").css("width", "30%");

//  $("#id_input").css("border", "2px solid red");

 $("#enviar").click(function () { 
  

    if ($('.input').val() === '') {

        $("#id_input").css("border-bottom", "2px solid red");

    }

    //Cambiar el type de un input 
    $('.input').attr('type', 'text');

    //El eq sirve para haceder al indice de un ul o div
     $(' li').eq(0).addClass('color');

     // El even es para seleccionar los numero pares del una lista 
     $('li').even().css("color" , "red");
    // El odd es para seccionar los numeros impares
     $('li').odd().css("color" , "blue");
    
});
   
