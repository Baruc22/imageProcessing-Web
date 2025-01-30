
var fileTypes = ["image/jpg", "image/jpeg", "image/png"];
var canvas1 = document.getElementById("canvasImagen1");
var canvas2 = document.getElementById("canvasImagen2");
var image1 = new Image(); //instancia de tipo de dato Image
var imagen1 = document.getElementById("imagen1") //carga la imagen seleccionada de los archivos. Referencia a la imagem que se lee

canvas2.addEventListener('mousemove', manejadorRaton, false);//interrupcion para el mouse
imagen1.addEventListener("change", actualizaImagen1); //escucha si hay un evento de tipo chance, cuando se hace algo en el boton, se seleccione una imagen y se ejecuta la funcion actualizaimagen1
var ctx1 = canvas1.getContext("2d"); //obtener el contexto del canvas
var ctx2 = canvas2.getContext("2d");

var img = new Image();
var newImg = new Image();
var radio = 20;
var relativeX;
var relativeY;

function actualizaImagen1() {
    var curFile = imagen1.files;//arrego de imagenes seleccionadas
    Source = curFile[0].name; //obtener la primera imagen del arreglo. NOmbre
    image1.src = window.URL.createObjectURL(curFile[0]); //obtiene la los pixeles de la imagen y toda su informacion
    image1.onload = function () {
        canvas1.width = image1.width;
        canvas1.height = image1.height;
        ctx1.drawImage(image1, 0, 0);
        canvas2.width = image1.width;
        canvas2.height = image1.height;
        ctx2.drawImage(image1, 0, 0);
        operacion();
    }
}

function operacion() {
    funcionGris();
}

funcionGris = function(){
    var i,j;
    img = ctx1.getImageData(0,0,canvas1.width,canvas1.height);
    imgPxl = img.data;

    newImg = ctx2.getImageData(0,0,canvas2.width,canvas2.height);
    newPxl = newImg.data; 

    
    filas = img.height;
    columnas = img.width;
    cols = 4 * columnas;

    for(j=0;j<filas;j++){
        for(i=0;i<cols;i+=4){

            var r = newPxl[(cols*j)+i];
            var g = newPxl[(cols*j)+i+1];
            var b = newPxl[(cols*j)+i+2];
            
            if(r==255 && g==0 && b==0){
                newPxl[(cols*j)+i] = imgPxl[(cols*j)+i];
                newPxl[(cols*j)+i+1] = imgPxl[(cols*j)+i+1];
                newPxl[(cols*j)+i+2] = imgPxl[(cols*j)+i+2];
            }else{
                var prom = (r+g+b)/3;
                newPxl[(cols*j)+i] = prom;
                newPxl[(cols*j)+i+1] = prom;
                newPxl[(cols*j)+i+2] = prom;
            }
        }
    }
    canvas2.width=newImg.width;
    canvas2.height=newImg.height;
    ctx2.putImageData(newImg,0,0);                
}

function tamFoco(value){
    radio = parseInt(value,10);
}

foco = function(){
    ctx2.putImageData(img, 0, 0);
    ctx2.fillStyle = "#FF0000";
    //ctx2.strokeStyle = "#00FF00";
    //ctx2.lineWidth = 4;
    ctx2.arc(relativeX,relativeY,radio,0,2*Math.PI);
    ctx2.fill();
    //ctx2.stroke();
}

function manejadorRaton(e) {
    relativeX = e.clientX-(canvas2.offsetLeft-Math.floor(window.scrollX));
    relativeY = e.clientY-(canvas2.offsetTop-Math.floor(window.scrollY));
    foco();
    funcionGris();    
}

