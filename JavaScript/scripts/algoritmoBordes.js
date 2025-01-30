var fileTypes=["image/jpg","image/jpeg","image/png"];
var canvas1 = document.getElementById("canvasImagen1"); //img original
var canvas2 = document.getElementById("canvasImagen2"); //img con bordes V & H
var canvas3 = document.getElementById("canvasImagen3"); //img con bordes V
var canvas4 = document.getElementById("canvasImagen4"); //img con bordes H

var image1 = new Image(); //instancia de tipo de dato Image
var imagen1 = document.getElementById("imagen1") //carga la imagen seleccionada de los archivos. Referencia a la imagen que se lee

imagen1.addEventListener("change",actualizaImagen1); //escucha si hay un evento de tipo chance, cuando se hace algo en el boton, se seleccione una imagen y se ejecuta la funcion actualizaimagen1
var ctx1 = canvas1.getContext("2d"); //obtener el contexto del canvas
var ctx2 = canvas2.getContext("2d");
var ctx3 = canvas3.getContext("2d");
var ctx4 = canvas4.getContext("2d");

function actualizaImagen1(){
    var curFile = imagen1.files;//arrego de imagenes seleccionadas
    Source = curFile[0].name; //obtener la primera imagen del arreglo: Nombre
    image1.src = window.URL.createObjectURL(curFile[0]); //obtiene la los pixeles de la imagen y toda su informacion
    image1.onload = function(){
        canvas1.width = image1.width;
        canvas1.height = image1.height;
        ctx1.drawImage(image1,0,0);
        bordes();
    }
}

function bordes(){
    bordesHorizontales();
    //bordesVerticales();
    bordesVerticales2();
    bordesVH();
    //recorreImg();
}

bordesVerticales = function(){
    var image3 = new Image();
    image3 = ctx1.getImageData(0,0,canvas1.width,canvas1.height);
    pixels = image3.data;
    numPixels = image3.width * image3.height;
    for(var i=0;i<numPixels;i++){
        var r = Math.abs(pixels[i*4]-pixels[i*4+4]);
        var g = Math.abs(pixels[i*4+1]-pixels[i*4+5]);
        var b = Math.abs(pixels[i*4+2]-pixels[i*4+6]);
        pixels[i*4]=r;
        pixels[i*4+1]=g;
        pixels[i*4+2]=b;
    }
    canvas3.width=image3.width;
    canvas3.height=image3.height;
    ctx3.putImageData(image3,0,0);  

}

bordesVerticales2 = function(){
    var image3 = new Image();
    image3 = ctx1.getImageData(0,0,canvas1.width,canvas1.height);
    pixels = image3.data;
    filas = image3.height;
    columnas = image3.width;
    cols = 4 * columnas;
    for(var j=0;j<filas-1;j++){
        for(var i=0;i<columnas*4;i+=4){
            var r = Math.abs(pixels[(cols*j)+i]-pixels[(cols*j)+i+4]);
            var g = Math.abs(pixels[(cols*j)+i+1]-pixels[(cols*j)+i+5]);
            var b = Math.abs(pixels[(cols*j)+i+2]-pixels[(cols*j)+i+6]);
            pixels[(cols*j)+i] = r;
            pixels[(cols*j)+i+1] = g;
            pixels[(cols*j)+i+2] = b;
        }
    }
    canvas3.width=image3.width;
    canvas3.height=image3.height;
    ctx3.putImageData(image3,0,0);  

}

bordesHorizontales = function(){
    var image4 = new Image();
    image4 = ctx1.getImageData(0,0,canvas1.width,canvas1.height);
    pixels = image4.data;
    filas = image4.height;
    columnas = image4.width;
    cols = 4 * columnas;
    for(var j=0;j<filas-1;j++){
        for(var i=0;i<columnas*4;i+=4){
            var r = Math.abs(pixels[(cols*j)+i]-pixels[(cols*(j+1))+i]);
            var g = Math.abs(pixels[(cols*j)+i+1]-pixels[(cols*(j+1))+i+1]);
            var b = Math.abs(pixels[(cols*j)+i+2]-pixels[(cols*(j+1))+i+2]);
            pixels[(cols*j)+i] = r;
            pixels[(cols*j)+i+1] = g;
            pixels[(cols*j)+i+2] = b;
        }
    }
    canvas4.width=image4.width;
    canvas4.height=image4.height;
    ctx4.putImageData(image4,0,0);  

}

bordesVH = function(){
    var image2 = new Image();
    image2 = ctx1.getImageData(0,0,canvas1.width,canvas1.height);
    pixels = image2.data;
    filas = image2.height;
    columnas = image2.width;
    cols = 4 * columnas;
    for(var j=0;j<filas-1;j++){
        for(var i=0;i<columnas*4;i+=4){
            var r = Math.max(Math.abs(pixels[(cols*j)+i]-pixels[(cols*(j+1))+i]),Math.abs(pixels[(cols*j)+i]-pixels[(cols*j)+i+4]));
            var g = Math.max(Math.abs(pixels[(cols*j)+i+1]-pixels[(cols*(j+1))+i+1]),Math.abs(pixels[(cols*j)+i+1]-pixels[(cols*j)+i+5]));
            var b = Math.max(Math.abs(pixels[(cols*j)+i+2]-pixels[(cols*(j+1))+i+2]),Math.abs(pixels[(cols*j)+i+2]-pixels[(cols*j)+i+6]));
            pixels[(cols*j)+i] = r;
            pixels[(cols*j)+i+1] = g;
            pixels[(cols*j)+i+2] = b;
        }
    }
    canvas2.width=image2.width;
    canvas2.height=image2.height;
    ctx2.putImageData(image2,0,0);  

}

recorreImg = function(){
    var image2 = new Image();
    image2 = ctx1.getImageData(0,0,canvas1.width,canvas1.height);
    pixels = image2.data;
    filas = image2.height;
    columnas = image2.width;
    cols = 4*columnas;
    for(var j=0;j<filas;j++){
        for(var i=0;i<columnas*4;i+=4){
            var r = pixels[(cols*j)+i];
            var g = pixels[(cols*j)+i+1];
            var b = pixels[(cols*j)+i+2];
            pixels[(cols*j)+i] = r;
            pixels[(cols*j)+i+1] = g;
            pixels[(cols*j)+i+2] = b;
        }
    }
    canvas2.width=image2.width;
    canvas2.height=image2.height;
    ctx2.putImageData(image2,0,0);                
}
