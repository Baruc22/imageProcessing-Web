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
var tamMat=0;
var nEjec;

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
                //var color = "#"+pxlr.toString(16)+pxlg.toString(16)+pxlb.toString(16);
                //console.log(color);
                //colorPxl.style.background = color;
                console.log(x,j);
            }
        }
    }
}


//SEGMENTACION POR DISTANCIA EUCLIDIANA
function segmentacionEuclidiana(){
    var i,j,x;
    var image2 = new Image();
    image2 = ctx1.getImageData(0,0,canvas1.width,canvas1.height);
    pixels = image2.data;
    filas = image2.height;
    columnas = image2.width;
    cols = 4*columnas;
    for(j=0;j<filas;j++){
        for(i=0,x=0;i<columnas*4;i+=4,x++){
            var r = pixels[(cols*j)+i];
            var g = pixels[(cols*j)+i+1];
            var b = pixels[(cols*j)+i+2];
            
            var disr = Math.pow(r-pxlr,2);
            var disg = Math.pow(g-pxlg,2);
            var disb = Math.pow(b-pxlb,2);
            var distancia = Math.sqrt(disr+disg+disb,2);

            if(distancia>umbral){
                pixels[(cols*j)+i] = 0;
                pixels[(cols*j)+i+1] = 0;
                pixels[(cols*j)+i+2] = 0;
            }else{
                pixels[(cols*j)+i] = 255;
                pixels[(cols*j)+i+1] = 255;
                pixels[(cols*j)+i+2] = 255;
            }
        }
    }
    canvas2.width=image2.width;
    canvas2.height=image2.height;
    ctx1.putImageData(image2,0,0);
    ctx2.putImageData(image2,0,0); 
}

//ALGORITMO DILATACIÓN
function dilatacion(){
    var j,i,j2,i2;
    var pxlMedio = Math.ceil(tamMat/2)
    if(tamMat==3){pxlMedio=1;}
    var image2 = new Image();
    var newImg = new Image();
    var band = 0;
    image2 = ctx2.getImageData(0,0,canvas2.width,canvas2.height);
    newImg = ctx2.getImageData(0,0,canvas2.width,canvas2.height);

    newPxls = newImg.data; 

    pixels = image2.data;
    filas = image2.height;
    columnas = image2.width;
    cols = 4*columnas;
    for(j=0;j<filas;j++){
        for(i=0;i<columnas*4;i+=4){

            band=0;
            for(j2=j;j2<(j+tamMat);j2++){
                for(i2=i;i2<(i+(tamMat*4));i2+=4){
                    var x = pixels[(cols*j2)+i2];
                    if(x==0){
                        band=1;
                    }
                }
            }

           if(band==1){
                newPxls[(cols*(j+1))+(i+(pxlMedio*4))] = 0;
                newPxls[(cols*(j+1))+(i+(pxlMedio*4)+1)] = 0;
                newPxls[(cols*(j+1))+(i+(pxlMedio*4)+2)] = 0;
            }else{
                newPxls[(cols*(j+1))+(i+(pxlMedio*4))] = 255;
                newPxls[(cols*(j+1))+(i+(pxlMedio*4)+1)] = 255;
                newPxls[(cols*(j+1))+(i+(pxlMedio*4)+2)] = 255;
            }

        }
    }
    canvas2.width=newImg.width;
    canvas2.height=newImg.height;
    ctx2.putImageData(newImg,0,0); 
}

//ALGORITMO EROSIÓN
function erosion(){
    var j,i,j2,i2,cont;
    var pxlMedio = Math.ceil(tamMat/2)
    if(tamMat==3){pxlMedio=1;}
    var image2 = new Image();
    var newImg = new Image();
    image2 = ctx2.getImageData(0,0,canvas2.width,canvas2.height);
    newImg = ctx2.getImageData(0,0,canvas2.width,canvas2.height);

    newPxls = newImg.data; 

    pixels = image2.data;
    filas = image2.height;
    columnas = image2.width;
    cols = 4*columnas;
    for(j=0;j<filas;j++){
        for(i=0;i<columnas*4;i+=4){

            cont=0;
            for(j2=j;j2<(j+tamMat);j2++){
                for(i2=i;i2<(i+(tamMat*4));i2+=4){
                    var x = pixels[(cols*j2)+i2];
                    if(x==0){
                        cont++;
                    }
                }
            }

           if(cont==(tamMat*tamMat)){
                newPxls[(cols*(j+1))+(i+(pxlMedio*4))] = 0;
                newPxls[(cols*(j+1))+(i+(pxlMedio*4)+1)] = 0;
                newPxls[(cols*(j+1))+(i+(pxlMedio*4)+2)] = 0;
            }else{
                newPxls[(cols*(j+1))+(i+(pxlMedio*4))] = 255;
                newPxls[(cols*(j+1))+(i+(pxlMedio*4)+1)] = 255;
                newPxls[(cols*(j+1))+(i+(pxlMedio*4)+2)] = 255;
            }

        }
    }
    canvas2.width=newImg.width;
    canvas2.height=newImg.height;
    ctx2.putImageData(newImg,0,0); 
}

function dilaEros(){
    for(var i=0;i<nEjec;i++){
        dilatacion();
        erosion();
    }
}

function repeticiones(){
    var n = document.getElementById("Nejecuciones").value;
    nEjec = parseInt(n,10);
}


//Se ejecuta con cada cambio de el slider
function tipoIMG(value){
    umbral = parseInt(value,10);
}

//Obtener tamaño de la matriz
function MatrizNxN(){
    var cod = document.getElementById("tamMatriz").value;
    tamMat = parseInt(cod,10);
    console.log(tamMat);
}

//Se ejecuta con cada click sobre la imagen
function manejadorCLickRaton(e){
    relativeX = e.clientX-(canvas1.offsetLeft-Math.floor(window.scrollX));
    relativeY = e.clientY-(canvas1.offsetTop-Math.floor(window.scrollY));
    console.log(relativeX,relativeY);

    if(tamMat!=0){
        seleccionPXL();
        segmentacionEuclidiana();
        dilaEros();
    }else{
        alert("SE REQUIERE UN TAMAÑO DE MATRIZ ")
    }
}