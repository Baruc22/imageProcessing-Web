
var fileTypes = ["image/jpg", "image/jpeg", "image/png"];
var canvas1 = document.getElementById("canvasImagen1");
var canvas2 = document.getElementById("canvasImagen2");
var canvas3 = document.getElementById("canvasImagen3");
var canvas4 = document.getElementById("canvasImagen4");
var canvas5 = document.getElementById("canvasImagen5");

var image1 = new Image(); //instancia de tipo de dato Image
var imagen1 = document.getElementById("imagen1") //carga la imagen seleccionada de los archivos. Referencia a la imagem que se lee

imagen1.addEventListener("change", actualizaImagen1); //escucha si hay un evento de tipo chance, cuando se hace algo en el boton, se seleccione una imagen y se ejecuta la funcion actualizaimagen1

var ctx1 = canvas1.getContext("2d"); //obtener el contexto del canvas
var ctx2 = canvas2.getContext("2d");
var ctx3 = canvas3.getContext("2d");
var ctx4 = canvas4.getContext("2d");
var ctx5 = canvas5.getContext("2d");


var HR = new Array(256);
var HG = new Array(256);
var HB = new Array(256);

var FAHR = new Array(256);
var FAHG = new Array(256);
var FAHB = new Array(256);


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
    histograma1();
    ecualizacion();
    histograma();
}

histograma = function(){
    var i,j;
    var image2 = new Image();
    image2 = ctx5.getImageData(0, 0, canvas5.width, canvas5.height);
    pixels = image2.data;
    filas = image2.height;
    columnas = image2.width;
    cols = 4 * columnas;

    for(i=0;i<256;i++){
        HR[i]=0;
        HG[i]=0;
        HB[i]=0;
    }

    for(j=0;j<filas;j++){
        for(i=0;i<cols;i+=4){
            var r = pixels[(cols*j)+i];
            var g = pixels[(cols*j)+i+1];
            var b = pixels[(cols*j)+i+2];
            HR[r]+=1;
            HG[g]+=1;
            HB[b]+=1;
        }
    }

    canvas2.width = 768;
    canvas2.height = 400;
    canvas3.width = 768;
    canvas3.height = 400;
    canvas4.width = 768;
    canvas4.height = 400;

    var maximoR=Math.max(...HR);
    var maximoG=Math.max(...HG);
    var maximoB=Math.max(...HB);

    for(i=0,j=0;i<768;i+=3,j++){
        var frecuenciaHR = (HR[j]*canvas2.height)/maximoR;
        var frecuenciaHG = (HG[j]*canvas2.height)/maximoG;
        var frecuenciaHB = (HB[j]*canvas2.height)/maximoB;
        //Dibuja histograma de la componenete R
        ctx2.fillStyle = "#FF0000";
        ctx2.fillRect(i,(canvas2.height-frecuenciaHR),3,frecuenciaHR);
        ctx2.strokeStyle = "#FFFFFF";
        ctx2.strokeRect(i,(canvas2.height-frecuenciaHR),3, frecuenciaHR);
        //Dibuja histograma de la componente G
        ctx3.fillStyle = "#00FF00";
        ctx3.fillRect(i,(canvas3.height-frecuenciaHG),3,frecuenciaHG);
        ctx3.strokeStyle = "#FFFFFF";
        ctx3.strokeRect(i,(canvas3.height-frecuenciaHG),3, frecuenciaHG);
        //Dibuja histograma de la componente B
        ctx4.fillStyle = "#0000FF";
        ctx4.fillRect(i,(canvas4.height-frecuenciaHB),3,frecuenciaHB);
        ctx4.strokeStyle = "#FFFFFF";
        ctx4.strokeRect(i,(canvas4.height-frecuenciaHB),3, frecuenciaHB);
    }
}


histograma1 = function(){
    var i,j;
    var image2 = new Image();
    image2 = ctx1.getImageData(0, 0, canvas1.width, canvas1.height);
    pixels = image2.data;
    filas = image2.height;
    columnas = image2.width;
    cols = 4 * columnas;

    for(i=0;i<256;i++){
        HR[i]=0;
        HG[i]=0;
        HB[i]=0;
    }

    for(j=0;j<filas;j++){
        for(i=0;i<cols;i+=4){
            var r = pixels[(cols*j)+i];
            var g = pixels[(cols*j)+i+1];
            var b = pixels[(cols*j)+i+2];
            HR[r]+=1;
            HG[g]+=1;
            HB[b]+=1;
        }
    }
}

function frecuenciaAcumulada(){
    var i;
    for(i=0;i<256;i++){
        FAHR[i]=0;
        FAHG[i]=0;
        FAHB[i]=0;

    }

    for(i=0;i<256;i++){
        if(i==0){
            FAHR[i]=HR[i];
            FAHG[i]=HG[i];
            FAHB[i]=HB[i];
        }else{
            FAHR[i]=HR[i]+FAHR[i-1];
            FAHG[i]=HG[i]+FAHG[i-1];
            FAHB[i]=HB[i]+FAHB[i-1];
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
    var totalPxlG = [...FAHG].pop();
    var totalPxlB = [...FAHB].pop();

    console.log(totalPxlR);

    for(j=0;j<filas;j++){
        for(i=0;i<cols;i+=4){
            var r = pixels[(cols*j)+i];
            var g = pixels[(cols*j)+i+1];
            var b = pixels[(cols*j)+i+2];

            var newr = Math.round(255*(FAHR[r]/totalPxlR));
            var newg = Math.round(255*(FAHG[g]/totalPxlG));
            var newb = Math.round(255*(FAHB[b]/totalPxlB));

            pixels[(cols*j)+i] = newr;
            pixels[(cols*j)+i+1] = newg;
            pixels[(cols*j)+i+2] = newb;
        }
    }
    
    canvas5.width = image3.width;
    canvas5.height = image3.height;
    ctx5.putImageData(image3, 0, 0);
}

