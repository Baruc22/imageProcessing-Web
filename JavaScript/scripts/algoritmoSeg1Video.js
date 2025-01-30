var canvasWedCam = document.getElementById("canvasVideo");
var videoElem = document.getElementById("video");

videoElem.addEventListener('mousedown', manejadorCLickRaton, false);//interrupcion para el mouse
document.addEventListener('keyup', manejadorTecladoSoltar, false);//interrupcion por presionar teclado

var ctxcWC = canvasWedCam.getContext("2d");

var pxlr,pxlg,pxlb;
var umbral;
var band=0;
var tamMat=0;

function seleccionPXL(){
    var i,j,x;
    var image2 = new Image();
    image2 = ctxcWC.getImageData(0,0,canvasWedCam.width,canvasWedCam.height);
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
            }
        }
    }
}

//SEGMENTACION POR DISTANCIA EUCLIDIANA
function segmentacionEuclidiana(){
    var i,j,x;
    var image2 = new Image();
    image2 = ctxcWC.getImageData(0,0,videoElem.width,videoElem.height);
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
    canvasWedCam.width=image2.width;
    canvasWedCam.height=image2.height;
    ctxcWC.putImageData(image2,0,0);  
}

//GENERA EL ESQUELETO EN EL VIDEO
function esqueleto(){
    var j,i,j2,i2,cont;
    var pxlMedio = Math.ceil(tamMat/2)
    if(tamMat==3){pxlMedio=1;}
    var image2 = new Image();
    var newImg = new Image();
    image2 = ctxcWC.getImageData(0,0,canvasWedCam.width,canvasWedCam.height);
    newImg = ctxcWC.getImageData(0,0,canvasWedCam.width,canvasWedCam.height);

    newPxls = newImg.data; 

    pixels = image2.data;
    filas = image2.height;
    columnas = image2.width;
    cols = 4*columnas;

    //ALGORITMO DE EROSIÓN
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

    //RESTA (usando el operador logico XOR)

    for (var j=0;j<filas;j++) {
        for (var i=0;i<columnas*4;i+=4) {
            //Operador logico XOR para calcular la resta
            var r = ((pixels[(cols*j)+i])^(newPxls[(cols*j)+i]));
            var g = ((pixels[(cols*j)+i+1])^(newPxls[(cols*j)+i+1]));
            var b = ((pixels[(cols*j)+i+2])^(newPxls[(cols*j)+i+2]));
            //Operador logico NOT para invertir los colores de la resta
            newPxls[(cols * j) + i] =  255&(~r);
            newPxls[(cols * j) + i + 1] = 255&(~g);
            newPxls[(cols * j) + i + 2] = 255&(~b);
        }
    }
    //-------------------------------------
    canvasWedCam.width=newImg.width;
    canvasWedCam.height=newImg.height;
    ctxcWC.putImageData(newImg,0,0);
}

//Obtener tamaño de la matriz
function MatrizNxN(){
    var cod = document.getElementById("tamMatriz").value;
    tamMat = parseInt(cod,10);
    console.log(tamMat);
}

//Se ejecuta con cada cambio de el slider
function tipoIMG(value){
    umbral = parseInt(value,10);
}
//Se ejecuta con cada click sobre la imagen
function manejadorCLickRaton(e){
    relativeX = e.clientX-(videoElem.offsetLeft-Math.floor(window.scrollX));
    relativeY = e.clientY-(videoElem.offsetTop-Math.floor(window.scrollY));
    console.log(relativeX,relativeY);
    seleccionPXL();
    band=1;
}


//Funciones para el video

function OpenCamera(){
    //Pedir permiso para abrir la camara
    navigator.mediaDevices.getUserMedia(constraints).then(mediaStream => {
        videoElem.srcObject = mediaStream;
        receivedMediaStream = mediaStream;
        window.requestAnimationFrame(updateCanvas);
    }).catch(erro => {
        console.log("Error al abrir la camara");
    });
}

function updateCanvas(){
    canvasWedCam.width=videoElem.width;
    canvasWedCam.height=videoElem.height;
    ctxcWC.drawImage(videoElem,0,0,canvasWedCam.width,canvasWedCam.height);
    /*Verificar que se haya dado click sobre el video 
    para realizar la segmentación y haber definido 
    el tamaño de la matriz S para el algoritmo de erosión*/
    if(band==1 && tamMat!=0){
        /*1.- Se ejecuta la segmentación conbre la imagen
        actual del video*/
        segmentacionEuclidiana();
        /*2.- Función que genera el esqueleto de las figuras
        en el video, ejecutando los siguientes algoritmos:
            a) Erosión
            b) Resta usando el operador lógico XOR */
        esqueleto();
    }
    if(tamMat==0){
        /*Alerta en pantalla por olvidar definir el tamaño de
        la matriz S*/
        alert("SE REQUIERE UN TAMAÑO DE MATRIZ ");
    }
    window.requestAnimationFrame(updateCanvas);
}

const closeCamera = () =>{
    if(!receivedMediaStream){
        console.log("Camera is closed");
    }else{
        receivedMediaStream.getTracks().forEach(mediaTrack => {
            mediaTrack.stop();
            console.log("Camara apagada");
        });
    }
}

const constraints = {
    audio:false,
    video:true
}


function manejadorTecladoSoltar(e){
    if(e.keyCode==27){
        closeCamera();
    }
}