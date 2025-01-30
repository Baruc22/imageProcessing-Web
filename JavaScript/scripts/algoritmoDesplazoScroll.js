
var fileTypes = ["image/jpg", "image/jpeg", "image/png"];
var canvas1 = document.getElementById("canvasImagen1");
var canvas2 = document.getElementById("canvasImagen2");
var image1 = new Image(); //instancia de tipo de dato Image
var imagen1 = document.getElementById("imagen1") //carga la imagen seleccionada de los archivos. Referencia a la imagem que se lee

imagen1.addEventListener("change", actualizaImagen1); //escucha si hay un evento de tipo chance, cuando se hace algo en el boton, se seleccione una imagen y se ejecuta la funcion actualizaimagen1
var ctx1 = canvas1.getContext("2d"); //obtener el contexto del canvas
var ctx2 = canvas2.getContext("2d");


//Variables para el desplazamiento
var offsety = 0;
var offsetx = 0;
//Obtener referencia de los slider
var sliderx = document.getElementById("valorx");
var slidery = document.getElementById("valory");

function actualizaImagen1() {
    var curFile = imagen1.files;//arrego de imagenes seleccionadas
    Source = curFile[0].name; //obtener la primera imagen del arreglo. NOmbre
    image1.src = window.URL.createObjectURL(curFile[0]); //obtiene la los pixeles de la imagen y toda su informacion
    image1.onload = function () {
        //Inicialización de los sliders
        var width = image1.width*-1;
        sliderx.setAttribute("min",width.toString());
        sliderx.setAttribute("max",image1.width.toString());
        var height = image1.height*-1;
        slidery.setAttribute("min",height.toString());
        slidery.setAttribute("max",image1.height.toString());

        canvas1.width = image1.width;
        canvas1.height = image1.height;
        ctx1.drawImage(image1, 0, 0);
        operacion();
    }
}

function operacion() {
    desplazo();
}

function desplazo(){
    var j,i,j2;
    var img = new Image();
    var newImg = new Image();
    img = ctx1.getImageData(0,0,canvas1.width,canvas1.height);
    newImg = ctx1.getImageData(0,0,canvas1.width,canvas1.height);
    
    imgNegro(newImg);

    filas = img.height;
    columnas = img.width;
    imgPxls = img.data;
    newPxls = newImg.data  
    cols = 4*columnas;

    for(j=0;j<(filas-Math.abs(offsety));j++){
        if(offsety<0){
            j2 = j+Math.abs(offsety)
            for(i=0;i<(columnas-Math.abs(offsetx))*4;i+=4){
                if(offsetx<0){
                    var r = imgPxls[(cols*j)+i+(Math.abs(offsetx)*4)];
                    var g = imgPxls[(cols*j)+i+(Math.abs(offsetx)*4)+1];
                    var b = imgPxls[(cols*j)+i+(Math.abs(offsetx)*4)+2];
                    newPxls[(cols*j2)+i] = r;
                    newPxls[(cols*j2)+i+1] = g;
                    newPxls[(cols*j2)+i+2] = b;
                }else{
                    var r = imgPxls[(cols*j)+i];
                    var g = imgPxls[(cols*j)+i+1];
                    var b = imgPxls[(cols*j)+i+2];
                    newPxls[(cols*j2)+i+(Math.abs(offsetx)*4)] = r;
                    newPxls[(cols*j2)+i+(Math.abs(offsetx)*4)+1] = g;
                    newPxls[(cols*j2)+i+(Math.abs(offsetx)*4)+2] = b;
                }

            }
        }else{
            j2 = j+Math.abs(offsety)
            for(i=0;i<(columnas-Math.abs(offsetx))*4;i+=4){
                if(offsetx<0){
                    var r = imgPxls[(cols*j2)+i+(Math.abs(offsetx)*4)];
                    var g = imgPxls[(cols*j2)+i+(Math.abs(offsetx)*4)+1];
                    var b = imgPxls[(cols*j2)+i+(Math.abs(offsetx)*4)+2];
                    newPxls[(cols*j)+i] = r;
                    newPxls[(cols*j)+i+1] = g;
                    newPxls[(cols*j)+i+2] = b;                    
                }else{
                    var r = imgPxls[(cols*j2)+i];
                    var g = imgPxls[(cols*j2)+i+1];
                    var b = imgPxls[(cols*j2)+i+2];
                    newPxls[(cols*j)+i+(Math.abs(offsetx)*4)] = r;
                    newPxls[(cols*j)+i+(Math.abs(offsetx)*4)+1] = g;
                    newPxls[(cols*j)+i+(Math.abs(offsetx)*4)+2] = b;

                }
            }
        }
    }
    canvas2.width=newImg.width;
    canvas2.height=newImg.height;
    ctx2.putImageData(newImg,0,0);                
}

function valorX(x){
    offsetx = parseInt(x,10);
    desplazo();
}

function valorY(y){
    offsety = parseInt(y,10);
    desplazo();
}


function imgNegro(img2){
    pixels = img2.data;
    filas = img2.height;
    columnas = img2.width;
    cols = 4*columnas;
    for(var j=0;j<filas;j++){
        for(var i=0;i<columnas*4;i+=4){
            pixels[(cols*j)+i] = 0;
            pixels[(cols*j)+i+1] = 0;
            pixels[(cols*j)+i+2] = 0;
        }
    }
}
