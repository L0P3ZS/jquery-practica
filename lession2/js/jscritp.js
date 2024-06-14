$('#cambiar').click(function () { 
    $('img')
        .attr("src", "../img/Sin título.jpg")
        //El removeClass es para remover clases de las etiquetas 
        .removeClass("img-circle")
        // Y LA addClass es para agregar clases 
        .addClass("img-lop")
    
    $('.texto-cambio')
        //lo que hace find es buscar dentro de la clases texto-cambio y busca la etiqueta p
        .find("p")
        .html("hola se cambio el texto al click del boton")

    $("ul li")
        .eq(0).css("color", "red")
});