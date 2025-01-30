
var fileTypes = ["image/jpg", "image/jpeg", "image/png"];
var canvas1 = document.getElementById("canvasImagen1");
var canvas2 = document.getElementById("canvasImagen2");
var canvas3 = document.getElementById("canvasImagen3");
var canvas4 = document.getElementById("canvasImagen4");

var image1 = new Image(); //instancia de tipo de dato Image
var imagen1 = document.getElementById("imagen1") //carga la imagen seleccionada de los archivos. Referencia a la imagem que se lee

imagen1.addEventListener("change", actualizaImagen1); //escucha si hay un evento de tipo chance, cuando se hace algo en el boton, se seleccione una imagen y se ejecuta la funcion actualizaimagen1

var ctx1 = canvas1.getContext("2d"); //obtener el contexto del canvas
var ctx2 = canvas2.getContext("2d");
var ctx3 = canvas3.getContext("2d");
var ctx4 = canvas3.getContext("2d");

var HR = new Array(256);
var FAHR = new Array(256);

function actualizaImagen1() {
    var curFile = imagen1.files;//arrego de imagenes seleccionadas
    Source = curFile[0].name; //obtener la primera imagen del arreglo. NOmbre
    image1.src = window.URL.createObjectURL(curFile[0]); //obtiene la los pixeles de la imagen y toda su informacion
    image1.onload = function (){
        canvas1.width = image1.width;
        canvas1.height = image1.height;
        ctx1.drawImage(image1, 0, 0);
        operacion();
    }
}


function mostrarIMG(){
    var i,j;
    var image2 = new Image();
    image2 = ctx1.getImageData(0, 0, canvas1.width, canvas1.height);
    pixels = image2.data;
    filas = image2.height;
    columnas = image2.width;
    cols = 4 * columnas;

    for(var j=0;j<filas;j++){
        for(var i=0;i<columnas*4;i+=4){
            var r = pixels[(cols*j)+i];
            var g = pixels[(cols*j)+i+1];
            var b = pixels[(cols*j)+i+2];
            var prom = (r+g+b)/3;
            prom = Math.round(prom);
            pixels[(cols*j)+i] = prom;
            pixels[(cols*j)+i+1] = prom;
            pixels[(cols*j)+i+2] = prom;
        }
    }

    canvas1.width=image2.width;
    canvas1.height=image2.height;
    ctx1.putImageData(image2,0,0);
}


function operacion() {
    mostrarIMG();
    histograma();
    ecualizacion();
    histogramaEcua();
}

histogramaEcua = function(){

    var i,j;
    var image2 = new Image();
    image2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
    pixels = image2.data;
    filas = image2.height;
    columnas = image2.width;
    cols = 4 * columnas;

    for(i=0;i<256;i++){
        HR[i]=0;
    }
    for(j=0;j<filas;j++){
        for(i=0;i<cols;i+=4){
            var r = pixels[(cols*j)+i];
            HR[r]+=1;
        }
    }

    canvas3.width = 768;
    canvas3.height = 400;

    var maximoR=Math.max(...HR);

    for(i=0,j=0;i<768;i+=3,j++){
        var frecuenciaHR = (HR[j]*canvas3.height)/maximoR;
        //Dibuja histogramaNormal de la componenete R
        ctx3.fillStyle = "#000000";
        ctx3.fillRect(i,(canvas3.height-frecuenciaHR),3,frecuenciaHR);//(x,y,ancho,altura)
        ctx3.strokeStyle = "#FFFFFF";
        ctx3.strokeRect(i,(canvas3.height-frecuenciaHR),3,frecuenciaHR);
    }
}

histograma = function(){
    var i,j;
    var image2 = new Image();
    image2 = ctx1.getImageData(0, 0, canvas1.width, canvas1.height);
    pixels = image2.data;
    filas = image2.height;
    columnas = image2.width;
    cols = 4 * columnas;

    for(i=0;i<256;i++){
        HR[i]=0;
    }
    for(j=0;j<filas;j++){
        for(i=0;i<cols;i+=4){
            var r = pixels[(cols*j)+i];
            HR[r]+=1;
        }
    }

}


function frecuenciaAcumulada(){
    var i;
    for(i=0;i<256;i++){
        FAHR[i]=0;
    }

    for(i=0;i<256;i++){
        if(i==0){
            FAHR[i]=HR[i];
        }else{
            FAHR[i]=HR[i]+FAHR[i-1];
        }
    }   

}

function ecualizacion(){
    var i,j;
    var image3 = new Image();
    image3 = ctx1.getImageData(0, 0, canvas1.width, canvas1.height);
    pixels = image3.data;
    filas = image3.height;
    columnas = image3.width;
    cols = 4 * columnas;

    frecuenciaAcumulada();

    var totalPxlR = [...FAHR].pop();

    for(j=0;j<filas;j++){
        for(i=0;i<cols;i+=4){
            var r = pixels[(cols*j)+i];

            var newGris = Math.round(255*(FAHR[r]/totalPxlR));

            pixels[(cols*j)+i] = newGris;
            pixels[(cols*j)+i+1] = newGris;
            pixels[(cols*j)+i+2] = newGris;
        }
    }
    
    canvas2.width = image3.width;
    canvas2.height = image3.height;
    ctx2.putImageData(image3, 0, 0);
}

