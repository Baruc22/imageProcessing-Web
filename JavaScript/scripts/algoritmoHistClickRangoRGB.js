
var fileTypes = ["image/jpg", "image/jpeg", "image/png"];
var canvas1 = document.getElementById("canvasImagen1");
var canvas2 = document.getElementById("canvasImagen2");
var canvas3 = document.getElementById("canvasImagen3");
var canvas4 = document.getElementById("canvasImagen4");
var canvas5 = document.getElementById("canvasImagen5");

var image1 = new Image(); //instancia de tipo de dato Image
var imagen1 = document.getElementById("imagen1") //carga la imagen seleccionada de los archivos. Referencia a la imagem que se lee

imagen1.addEventListener("change", actualizaImagen1); //escucha si hay un evento de tipo chance, cuando se hace algo en el boton, se seleccione una imagen y se ejecuta la funcion actualizaimagen1
canvas2.addEventListener('mousedown', ClickRatonC2, false);
canvas3.addEventListener('mousedown', ClickRatonC3, false);
canvas4.addEventListener('mousedown', ClickRatonC4, false);


var ctx1 = canvas1.getContext("2d"); //obtener el contexto del canvas
var ctx2 = canvas2.getContext("2d");
var ctx3 = canvas3.getContext("2d");
var ctx4 = canvas4.getContext("2d");
var ctx5 = canvas5.getContext("2d");

var relativeX;
var relativeY;
var pxl1=-1,pxl2=-1;
var bandClik=0;
var HR = new Array(256);
var HG = new Array(256);
var HB = new Array(256);
var grfR=0,grfG=0,grfB=0;


function actualizaImagen1() {
    var curFile = imagen1.files;//arrego de imagenes seleccionadas
    Source = curFile[0].name; //obtener la primera imagen del arreglo. NOmbre
    image1.src = window.URL.createObjectURL(curFile[0]); //obtiene la los pixeles de la imagen y toda su informacion
    image1.onload = function () {
        canvas1.width = image1.width;
        canvas1.height = image1.height;
        ctx1.drawImage(image1, 0, 0);
        canvas5.width = image1.width;
        canvas5.height = image1.height;
        ctx5.drawImage(image1, 0, 0);
        operacion();
    }
}

function operacion() {
    histograma();
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

        //Detectar interaccion con el histograma de R
        if((relativeX>=i && relativeX<=i+3) && relativeY>=(canvas2.height-frecuenciaHR) && grfR==1){
            if(bandClik==0){
                pxl1 = j;
                bandClik=1;
            }else if(bandClik==1){
                pxl2 = j;
                bandClik=-1;               
            }
            
        }
        //Detectar interaccion con el histograma de G
        if((relativeX>=i && relativeX<=i+3) && relativeY>=(canvas3.height-frecuenciaHG) && grfG==1){
            if(bandClik==0){
                pxl1 = j;
                bandClik=1;
            }else if(bandClik==1){
                pxl2 = j;
                bandClik=-1;
            }
            
        }
        //Detectar interaccion con el histograma de B
        if((relativeX>=i && relativeX<=i+3) && relativeY>=(canvas3.height-frecuenciaHG) && grfB==1){
            if(bandClik==0){
                pxl1 = j;
                bandClik=1;
            }else if(bandClik==1){
                pxl2 = j;
                bandClik=-1;
            }
            
        }
    }
}

function imgSeccionada(){
    var image2 = new Image();
    image2 = ctx1.getImageData(0,0,canvas1.width,canvas1.height);
    pixels = image2.data;
    filas = image2.height;
    columnas = image2.width;
    cols = 4 * columnas;    
    var tmp;
    if(pxl1>pxl2 && bandClik==-1){
        tmp = pxl1;
        pxl1 = pxl2;
        pxl2 = tmp;
    }

   for(var j=0;j<filas;j++){
        for(var i=0;i<columnas*4;i+=4){
            var r = pixels[(cols*j)+i];
            var g = pixels[(cols*j)+i+1];
            var b = pixels[(cols*j)+i+2];
            var prom = (r+g+b)/3;
            if(r<=pxl1 || r>=pxl2){
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

histogramaRango = function(){
    var i,j;
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

        if(i<=pxl1*3 || i>=pxl2*3){
            ctx2.fillStyle = "#8E8E8E";
            ctx3.fillStyle = "#8E8E8E";
            ctx4.fillStyle = "#8E8E8E";
        }else{
            ctx2.fillStyle = "#FF0000";
            ctx3.fillStyle = "#00FF00";
            ctx4.fillStyle = "#0000FF";
        }        
        ctx2.fillRect(i,(canvas2.height-frecuenciaHR),3,frecuenciaHR);
        ctx2.strokeStyle = "#FFFFFF";
        ctx2.strokeRect(i,(canvas2.height-frecuenciaHR),3, frecuenciaHR);

        ctx3.fillRect(i,(canvas3.height-frecuenciaHG),3,frecuenciaHG);
        ctx3.strokeStyle = "#FFFFFF";
        ctx3.strokeRect(i,(canvas3.height-frecuenciaHG),3, frecuenciaHG);

        ctx4.fillRect(i,(canvas4.height-frecuenciaHB),3,frecuenciaHB);
        ctx4.strokeStyle = "#FFFFFF";
        ctx4.strokeRect(i,(canvas4.height-frecuenciaHB),3, frecuenciaHB);
    }
}

function ClickRatonC2(e){
    grfR=1;
    relativeX = e.clientX-(canvas2.offsetLeft-Math.floor(window.scrollX));
    relativeY = e.clientY-(canvas2.offsetTop-Math.floor(window.scrollY));
    
    histograma();
    imgSeccionada();
    if(bandClik==-1){
        histogramaRango();
    }
}

function ClickRatonC3(e){
    grfG=1;
    relativeX = e.clientX-(canvas2.offsetLeft-Math.floor(window.scrollX));
    relativeY = e.clientY-(canvas2.offsetTop-Math.floor(window.scrollY));
    
    histograma();
    imgSeccionada();
    if(bandClik==-1){
        histogramaRango();
    }
}

function ClickRatonC4(e){
    grfB=1;
    relativeX = e.clientX-(canvas2.offsetLeft-Math.floor(window.scrollX));
    relativeY = e.clientY-(canvas2.offsetTop-Math.floor(window.scrollY));
    
    histograma();
    imgSeccionada();
    if(bandClik==-1){
        histogramaRango();
    }
}