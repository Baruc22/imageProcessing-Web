var fileTypes=["image/jpg","image/jpeg","image/png"];
var canvas1 = document.getElementById("canvasImagen1");
var canvas2 = document.getElementById("canvasImagen2");

var image1 = new Image(); //instancia de tipo de dato Image
var imagen1 = document.getElementById("imagen1") //carga la imagen seleccionada de los archivos. Referencia a la imagen que se lee

imagen1.addEventListener("change",actualizaImagen1); //escucha si hay un evento de tipo chance, cuando se hace algo en el boton, se seleccione una imagen y se ejecuta la funcion actualizaimagen1
canvas1.addEventListener('mousedown', manejadorCLickRaton, false);//interrupcion para el mouse

var ctx1 = canvas1.getContext("2d"); //obtener el contexto del canvas
var ctx2 = canvas2.getContext("2d");

var pxlr,pxlg,pxlb;
var umbral;

function actualizaImagen1(){
    var curFile = imagen1.files;//arrego de imagenes seleccionadas
    Source = curFile[0].name; //obtener la primera imagen del arreglo: Nombre
    image1.src = window.URL.createObjectURL(curFile[0]); //obtiene la los pixeles de la imagen y toda su informacion
    image1.onload = function(){
        canvas1.width = image1.width;
        canvas1.height = image1.height;
        ctx1.drawImage(image1,0,0);

    }
}

function seleccionPXL(){
    var i,j,x;
    var image2 = new Image();
    image2 = ctx1.getImageData(0,0,canvas1.width,canvas1.height);
    var colorPxl = document.getElementById("pxl");
    pixels = image2.data;
    filas = image2.height;
    columnas = image2.width;
    cols = 4*columnas;
    for(j=0;j<filas;j++){
        for(i=0,x=0;i<columnas*4;i+=4,x++){

            if(j==relativeY && x==relativeX){
                pxlr = pixels[(cols*j)+i];
                pxlg = pixels[(cols*j)+i+1];
                pxlb = pixels[(cols*j)+i+2];
                var color = "#"+pxlr.toString(16)+pxlg.toString(16)+pxlb.toString(16);
                //console.log(color);
                colorPxl.style.background = color;
                console.log(x,j);
            }
        }
    }
}


function segmentacionDif(){
    var i,j,x;
    var image2 = new Image();
    image2 = ctx1.getImageData(0,0,canvas1.width,canvas1.height);
    pixels = image2.data;
    filas = image2.height;
    columnas = image2.width;
    cols = 4*columnas;
    for(j=0;j<filas;j++){
        for(i=0;i<columnas*4;i+=4){
            var r = pixels[(cols*j)+i];
            var g = pixels[(cols*j)+i+1];
            var b = pixels[(cols*j)+i+2];
            
            var difr = Math.abs(r-pxlr);
            var difg = Math.abs(g-pxlg);
            var difb = Math.abs(b-pxlb);

            if((difr+difg+difb)<=umbral){
                pixels[(cols*j)+i] = 255;
                pixels[(cols*j)+i+1] = 255;
                pixels[(cols*j)+i+2] = 255;
            }else{
                pixels[(cols*j)+i] = 0;
                pixels[(cols*j)+i+1] = 0;
                pixels[(cols*j)+i+2] = 0;
            }
        }
    }
    canvas2.width=image2.width;
    canvas2.height=image2.height;
    ctx2.putImageData(image2,0,0); 
}


//Se ejecuta con cada cambio de el slider
function tipoIMG(value){
    umbral = parseInt(value,10);
}
//Se ejecuta con cada click sobre la imagen
function manejadorCLickRaton(e){
    relativeX = e.clientX-(canvas1.offsetLeft-Math.floor(window.scrollX));
    relativeY = e.clientY-(canvas1.offsetTop-Math.floor(window.scrollY));
    console.log(relativeX,relativeY);
    seleccionPXL();
    segmentacionDif();
}