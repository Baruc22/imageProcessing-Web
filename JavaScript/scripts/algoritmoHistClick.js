
var fileTypes = ["image/jpg", "image/jpeg", "image/png"];
var canvas1 = document.getElementById("canvasImagen1");
var canvas2 = document.getElementById("canvasImagen2");
var canvas3 = document.getElementById("canvasImagen3");
var canvas4 = document.getElementById("canvasImagen4");
var canvas5 = document.getElementById("canvasImagen5");

var image1 = new Image(); //instancia de tipo de dato Image
var imagen1 = document.getElementById("imagen1") //carga la imagen seleccionada de los archivos. Referencia a la imagem que se lee

imagen1.addEventListener("change", actualizaImagen1); //escucha si hay un evento de tipo chance, cuando se hace algo en el boton, se seleccione una imagen y se ejecuta la funcion actualizaimagen1
canvas2.addEventListener('mousedown', manejadorCLickRaton, false);//interrupcion para el mouse

var ctx1 = canvas1.getContext("2d"); //obtener el contexto del canvas
var ctx2 = canvas2.getContext("2d");
var ctx5 = canvas5.getContext("2d");

var relativeX;
var relativeY;
var pxl=-1;
var HR = new Array(256);

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
    imgGris();
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
    }
    for(j=0;j<filas;j++){
        for(i=0;i<cols;i+=4){
            var r = pixels[(cols*j)+i];
            HR[r]+=1;
        }
    }
    canvas2.width = 768;
    canvas2.height = 400;

    var maximoR=Math.max(...HR);

    for(i=0,j=0;i<768;i+=3,j++){
        var frecuenciaHR = (HR[j]*canvas2.height)/maximoR;
        //Dibuja histograma de la componenete R
        ctx2.fillStyle = "#000000";
        ctx2.fillRect(i,(canvas2.height-frecuenciaHR),3,frecuenciaHR);//(x,y,ancho,altura)
        ctx2.strokeStyle = "#FFFFFF";
        ctx2.strokeRect(i,(canvas2.height-frecuenciaHR),3, frecuenciaHR);

        if((relativeX>=i && relativeX<=i+3) && relativeY>=(canvas2.height-frecuenciaHR)){
            pxl =  j;
        }

    }

    //console.log(pxl);
}

histogramaEleccion = function(){
    var i,j;
    canvas2.width = 768;
    canvas2.height = 400;

    var maximoR=Math.max(...HR);
    
    for(i=0,j=0;i<768;i+=3,j++){
        var frecuenciaHR = (HR[j]*canvas2.height)/maximoR;

        if(i==pxl*3){
            ctx2.fillStyle = "#FF0000";
        }else{
            ctx2.fillStyle = "#000000";
        }
        ctx2.fillRect(i,(canvas2.height-frecuenciaHR),3,frecuenciaHR);//(x,y,ancho,altura)
        ctx2.strokeStyle = "#FFFFFF";
        ctx2.strokeRect(i,(canvas2.height-frecuenciaHR),3, frecuenciaHR);

    }
}



function imgGris(){
    image2 = ctx1.getImageData(0,0,canvas1.width,canvas1.height);
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
            pixels[(cols*j)+i] = prom;
            pixels[(cols*j)+i+1] = prom;
            pixels[(cols*j)+i+2] = prom;
        }
    }
    canvas5.width=image2.width;
    canvas5.height=image2.height;
    ctx5.putImageData(image2,0,0);                
}

function imgRoja(){
    image2 = ctx1.getImageData(0,0,canvas1.width,canvas1.height);
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
            if(r==pxl){
                pixels[(cols*j)+i] = 255;
                pixels[(cols*j)+i+1] = 0;
                pixels[(cols*j)+i+2] = 0;
            }else{
                pixels[(cols*j)+i] = prom;
                pixels[(cols*j)+i+1] = prom;
                pixels[(cols*j)+i+2] = prom;
            }
        }
    }
    canvas5.width=image2.width;
    canvas5.height=image2.height;
    ctx5.putImageData(image2,0,0);                
}

function manejadorCLickRaton(e){
    relativeX = e.clientX-(canvas2.offsetLeft-Math.floor(window.scrollX));
    relativeY = e.clientY-(canvas2.offsetTop-Math.floor(window.scrollY));
    console.log(relativeX,relativeY);

    imgGris();
    histograma();
    imgRoja();
    histogramaEleccion();
}