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

function escalar(){
    var i,j,w,k,promR,promG,promB;

    //Imagen nueva
    var newImg = new Image();
    newImg = ctx1.getImageData(0,0,canvas1.width*2,canvas1.height*2);
    cols2 = 4 * newImg.width;
    newPxl = newImg.data;

    //Imagen original
    var img = new Image();
    img = ctx1.getImageData(0,0,canvas1.width,canvas1.height);
    imgPxl = img.data;
    filas = img.height;
    columnas = img.width;
    cols = 4*columnas;

    for(i=0;i<newImg.data.length;i++){
        if((i+1)%4==0){
            newPxl[i]=255;
        }else{
            newPxl[i]=0;
        }
    }

    for(j=0,w=0;j<filas;j++,w+=2){
        for(i=0,k=0;i<cols;i+=4,k+=8){

            newPxl[(cols2*w)+k] = imgPxl[(cols*j)+i];
            newPxl[(cols2*w)+k+1] = imgPxl[(cols*j)+i+1];
            newPxl[(cols2*w)+k+2] = imgPxl[(cols*j)+i+2];

            //Promedios
            promR = (imgPxl[(cols*j)+i]+imgPxl[(cols*j)+i+4])/2;
            promG = (imgPxl[(cols*j)+i+1]+imgPxl[(cols*j)+i+5])/2;
            promB = (imgPxl[(cols*j)+i+2]+imgPxl[(cols*j)+i+6])/2;

            //Asignar a la nueva imagen
            newPxl[(cols2*w)+k+4] = Math.round(promR);
            newPxl[(cols2*w)+k+5] = Math.round(promG);
            newPxl[(cols2*w)+k+6] = Math.round(promB);

            //Promedios
            promR = (imgPxl[(cols*j)+i]+imgPxl[(cols*(j+1))+i])/2;
            promG = (imgPxl[(cols*j)+i+1]+imgPxl[(cols*(j+1))+i+1])/2;
            promB = (imgPxl[(cols*j)+i+2]+imgPxl[(cols*(j+1))+i+2])/2;

            //Asignar a la nueva imagen
            newPxl[(cols2*(w+1))+k] = Math.round(promR);
            newPxl[(cols2*(w+1))+k+1] = Math.round(promG);
            newPxl[(cols2*(w+1))+k+2] = Math.round(promB);

            //Promedios
            promR = (newPxl[(cols2*w)+k]+newPxl[(cols2*w)+k+4]+newPxl[(cols2*(w+1))+k])/3;
            promG = (newPxl[(cols2*w)+k+1]+newPxl[(cols2*w)+k+5]+newPxl[(cols2*(w+1))+k+1])/3;
            promB = (newPxl[(cols2*w)+k+2]+newPxl[(cols2*w)+k+6]+newPxl[(cols2*(w+1))+k+2])/3;

            //Asignar a la nueva imagen
            newPxl[(cols2*(w+1))+k+4] = Math.round(promR);
            newPxl[(cols2*(w+1))+k+5] = Math.round(promG);
            newPxl[(cols2*(w+1))+k+6] = Math.round(promB);
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
        escalar();
        //recorreImg();
    }
    if(opcion==3){
        band=0;
    }
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

            console.log(r,g,b);
        }
        console.log("----------------");
    }              
}