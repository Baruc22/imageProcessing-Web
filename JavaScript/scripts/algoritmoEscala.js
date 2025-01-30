var fileTypes=["image/jpg","image/jpeg","image/png"];
var canvas1 = document.getElementById("canvasImagen1");
var canvas2 = document.getElementById("canvasImagen2");

var image1 = new Image(); //instancia de tipo de dato Image
var imagen1 = document.getElementById("imagen1") //carga la imagen seleccionada de los archivos. Referencia a la imagen que se lee

imagen1.addEventListener("change",actualizaImagen1); //escucha si hay un evento de tipo chance, cuando se hace algo en el boton, se seleccione una imagen y se ejecuta la funcion actualizaimagen1
var ctx1 = canvas1.getContext("2d"); //obtener el contexto del canvas
var ctx2 = canvas2.getContext("2d");

var band=1;

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

function escala(){
    var i,j,w,k,promR,promG,promB;
    var img = new Image();
    var newImg = new Image();
    img = ctx1.getImageData(0,0,canvas1.width,canvas1.height);
    newImg = ctx1.getImageData(0,0,canvas1.width/2,canvas1.height/2);
    imgPxl = img.data;
    cols2 = 4 * img.width;

    newPxl = newImg.data;
    filas = newImg.height;
    columnas = newImg.width;
    cols = 4*columnas;

    for(j=0,w=0;j<filas;j++,w+=2){
        for(i=0,k=0;i<cols;i+=4,k+=8){
            //Promedios
            promR = (imgPxl[(cols2*w)+k]+imgPxl[(cols2*w)+k+4]+imgPxl[(cols2*(w+1))+k]+imgPxl[(cols2*(w+1))+k+4])/4;
            promG = (imgPxl[(cols2*w)+k+1]+imgPxl[(cols2*w)+k+5]+imgPxl[(cols2*(w+1))+k+1]+imgPxl[(cols2*(w+1))+k+5])/4;
            promB = (imgPxl[(cols2*w)+k+2]+imgPxl[(cols2*w)+k+6]+imgPxl[(cols2*(w+1))+k+2]+imgPxl[(cols2*(w+1))+k+6])/4;

            //Asignar a la nueva imagen
            newPxl[(cols*j)+i] = Math.floor(promR);
            newPxl[(cols*j)+i+1] = Math.floor(promG);
            newPxl[(cols*j)+i+2] = Math.floor(promB);
        }
    }
    canvas1.width=newImg.width;
    canvas1.height=newImg.height;
    ctx1.putImageData(newImg,0,0);
}

//Se ejecuta con cada cambio de el slider
function tipoIMG(value){
    var opcion = parseInt(value,10);
    if(opcion>0 && band==1){
        escala();
    }
    if(opcion==3){
        band=0;
    }
    console.log(opcion);
}