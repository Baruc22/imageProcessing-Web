var fileTypes=["image/jpg","image/jpeg","image/png"];
var canvas1 = document.getElementById("canvasImagen1");

var image1 = new Image(); //instancia de tipo de dato Image
var imagen1 = document.getElementById("imagen1") //carga la imagen seleccionada de los archivos. Referencia a la imagen que se lee

imagen1.addEventListener("change",actualizaImagen1); //escucha si hay un evento de tipo chance, cuando se hace algo en el boton, se seleccione una imagen y se ejecuta la funcion actualizaimagen1
canvas1.addEventListener('mousedown', manejadorClickRaton , false);//interrupcion para el mouse

var ctx1 = canvas1.getContext("2d"); //obtener el contexto del canvas

var relativeX;
var relativeY;
var pila = new Array();
var colorR=0;
var colorG=0;
var colorB=255;
var inicio=0;

function actualizaImagen1(){
    var curFile = imagen1.files;//arrego de imagenes seleccionadas
    Source = curFile[0].name; //obtener la primera imagen del arreglo: Nombre
    image1.src = window.URL.createObjectURL(curFile[0]); //obtiene la los pixeles de la imagen y toda su informacion
    image1.onload = function(){
        canvas1.width = image1.width;
        canvas1.height = image1.height;
        ctx1.drawImage(image1,0,0);
        //operacion();
    }
}

/*function operacion(){
    segmentacion();
}*/


function seleccionPxl(){
    var i,j,x,r,g,b;
    var image2 = new Image();
    image2 = ctx1.getImageData(0,0,canvas1.width,canvas1.height);
    pixels = image2.data;
    filas = image2.height;
    columnas = image2.width;
    cols = 4*columnas;
    for(j=0;j<filas;j++){
        for(i=0,x=0;i<columnas*4;i+=4,x++){
            /*Identificar donde se dio clik en la imagen*/
            if(j==relativeY && x==relativeX){
                r = pixels[(cols*j)+i];
                g = pixels[(cols*j)+i+1];
                b = pixels[(cols*j)+i+2];
                /*Verificar que el pixel seleccionado
                sea diferente del color negro */
                if(r!=0 && g!=0 && r!=0){
                    inicio=1;
                }else{
                    inicio=0;
                }
            }
        }
    }
}

function pintar(){
    var x,y;
    var arriba,derecha,abajo,izquierda;
    var img = new Image();
    img = ctx1.getImageData(0,0,canvas1.width,canvas1.height);
    pixels = img.data;
    columnas = img.width;
    cols = 4*columnas;

    //Pixel actual (pintar)
    pixels[(cols*relativeY)+(relativeX*4)] = colorR;
    pixels[(cols*relativeY)+(relativeX*4)+1] = colorG;
    pixels[(cols*relativeY)+(relativeX*4)+2] = colorB;

    /*Obtener el valor de los 4 pixeles alrededor del pixel
    seleccionado*/
    arriba = pixels[(cols*(relativeY-1))+(relativeX*4)];
    derecha = pixels[(cols*(relativeY))+(relativeX*4)+4];
    abajo = pixels[(cols*(relativeY+1))+(relativeX*4)];
    izquierda = pixels[(cols*(relativeY))+(relativeX*4)-4];

    //Iniciar la pila de coordenadas
    pila.push(relativeX,relativeY);//Pxl seleccionado

    /*Verificar que los pixeles vecinos no sean de color negro 
    y meterlos a la pila*/
    if(arriba!=0){ //Arriba
        pila.push(relativeX,relativeY-1);
    }
    if(derecha!=0){ //Derecha
        pila.push(relativeX+1,relativeY);
    }
    if(abajo!=0){ //Abajo
        pila.push(relativeX,relativeY+1);
    }
    if(izquierda!=0){ //Izquierda
        pila.push(relativeX-1,relativeY);
    }

    //Mientras la pila no este vacia.
    while (pila.length!=0) {
        y=pila.pop();
        x=pila.pop();
    
        /*Pintar el pixel recuperado de la pila*/
        pixels[(cols*y)+(x*4)] = colorR;
        pixels[(cols*y)+(x*4)+1] = colorG;
        pixels[(cols*y)+(x*4)+2] = colorB;
        
        /*Obtener el valor de los 4 pixeles alrededor del pixel
        obtenido de la pila*/
        arriba = pixels[(cols*(y-1))+(x*4)];
        derecha = pixels[(cols*(y))+(x*4)+4];
        abajo = pixels[(cols*(y+1))+(x*4)];
        izquierda = pixels[(cols*(y))+(x*4)-4];

        /*Verificar que los pixeles vecinos no sean de color negro 
        y meterlos a la pila*/
        if(arriba!=0){ //Arriba
            pila.push(x,y-1);
        }
        if(derecha!=0){ //Derecha
            pila.push(x+1,y);
        }
        if(abajo!=0){ //Abajo
            pila.push(x,y+1);
        }
        if(izquierda!=0){ //Izquierda
            pila.push(x-1,y);
        }
    }

    /*Dibuajr nueva imagen con el área coloreada*/
    canvas1.width=img.width;
    canvas1.height=img.height;
    ctx1.putImageData(img,0,0);
}

//Componentes de arriba
//pixels[(cols*(relativeY-1))+(relativeX*4)] -> R
//pixels[(cols*(relativeY-1))+(relativeX*4)+1] -> G
//pixels[(cols*(relativeY-1))+(relativeX*4)+2] -> B
//Componenstes de derecha
//pixels[(cols*(relativeY))+(relativeX*4)+4] -> R
//pixels[(cols*(relativeY))+(relativeX*4)+5] -> G
//pixels[(cols*(relativeY))+(relativeX*4)+6] -> B
//Componentes de abajo
//pixels[(cols*(relativeY+1))+(relativeX*4)] -> R
//pixels[(cols*(relativeY+1))+(relativeX*4)+1] -> G
//pixels[(cols*(relativeY+1))+(relativeX*4)+2] -> B
//Componentes de izquierda
//pixels[(cols*(relativeY))+(relativeX*4)-4] -> R
//pixels[(cols*(relativeY))+(relativeX*4)-3] -> G
//pixels[(cols*(relativeY))+(relativeX*4)-2] -> B


function manejadorClickRaton(e){
    relativeX = e.clientX-(canvas1.offsetLeft-Math.floor(window.scrollX));
    relativeY = e.clientY-(canvas1.offsetTop-Math.floor(window.scrollY));

    seleccionPxl();
    if(inicio==1){
        pintar();
    }
}