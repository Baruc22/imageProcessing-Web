
var fileTypes = ["image/jpg", "image/jpeg", "image/png"];
var canvas1 = document.getElementById("canvasImagen1");
var canvas2 = document.getElementById("canvasImagen2");
var image1 = new Image(); //instancia de tipo de dato Image
var imagen1 = document.getElementById("imagen1") //carga la imagen seleccionada de los archivos. Referencia a la imagem que se lee

imagen1.addEventListener("change", actualizaImagen1); //escucha si hay un evento de tipo chance, cuando se hace algo en el boton, se seleccione una imagen y se ejecuta la funcion actualizaimagen1
var ctx1 = canvas1.getContext("2d"); //obtener el contexto del canvas
var ctx2 = canvas2.getContext("2d");

function actualizaImagen1() {
    var curFile = imagen1.files;//arrego de imagenes seleccionadas
    Source = curFile[0].name; //obtener la primera imagen del arreglo. NOmbre
    image1.src = window.URL.createObjectURL(curFile[0]); //obtiene la los pixeles de la imagen y toda su informacion
    image1.onload = function () {
        canvas1.width = image1.width;
        canvas1.height = image1.height;
        ctx1.drawImage(image1, 0, 0);
        
        operacion();
    }
}

function operacion() {
    operacionNot();
}

operacionNot = function () {
    var image2 = new Image();
    image2 = ctx1.getImageData(0, 0, canvas1.width, canvas1.height);
    pixels = image2.data;
    numPixels = image2.width * image2.height;
    for (var i = 0; i < numPixels; i++) {
        var r = Math.abs(255&(~pixels[i * 4]));
        var g = Math.abs(255&(~pixels[i * 4 + 1]));
        var b = Math.abs(255&(~pixels[i * 4 + 2]));
        pixels[i * 4] = r;
        pixels[i * 4 + 1] = g;
        pixels[i * 4 + 2] = b;
    }

    canvas2.width = image2.width;
    canvas2.height = image2.height;
    ctx2.putImageData(image2, 0, 0);
}