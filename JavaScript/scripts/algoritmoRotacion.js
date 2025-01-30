var fileTypes=["image/jpg","image/jpeg","image/png"];
var canvas1 = document.getElementById("canvasImagen1");
var canvas2 = document.getElementById("canvasImagen2");

var image1 = new Image(); //instancia de tipo de dato Image
var imagen1 = document.getElementById("imagen1") //carga la imagen seleccionada de los archivos. Referencia a la imagen que se lee

imagen1.addEventListener("change",actualizaImagen1); //escucha si hay un evento de tipo chance, cuando se hace algo en el boton, se seleccione una imagen y se ejecuta la funcion actualizaimagen1
var ctx1 = canvas1.getContext("2d"); //obtener el contexto del canvas
var ctx2 = canvas2.getContext("2d");

function actualizaImagen1(){
    var curFile = imagen1.files;//arrego de imagenes seleccionadas
    Source = curFile[0].name; //obtener la primera imagen del arreglo: Nombre
    image1.src = window.URL.createObjectURL(curFile[0]); //obtiene la los pixeles de la imagen y toda su informacion
    image1.onload = function(){
        canvas1.width = image1.width;
        canvas1.height = image1.height;
        ctx1.drawImage(image1,0,0);
        canvas2.width = image1.width;
        canvas2.height = image1.height;
        ctx2.drawImage(image1,0,0);
    }
}

function rotacion(grados){
    var i,j,filas,columnas,grad;
    var nuevasFilas, nuevasColumnas,refx,refy,xoffset,yoffset
    var Yprima,Xprima,nuevaY,nuevaX;

    var img = new Image();
    var newImg = new Image();

    img = ctx1.getImageData(0,0,canvas1.width,canvas1.height);
    grad =  convierte(grados);

    //console.log(grad);

    filas = img.height;
    columnas = img.width;

    nuevasFilas = Math.floor((filas*Math.abs(Math.cos(grad)))+(columnas*Math.abs(Math.sin(grad))));
    nuevasColumnas = Math.floor((filas*Math.abs(Math.sin(grad)))+(columnas*Math.abs(Math.cos(grad))));

    newImg = ctx2.getImageData(0,0,nuevasColumnas,nuevasFilas);
    
    //console.log("cos",Math.cos(grad));
    //console.log("sin",Math.sin(grad));

    //console.log("filas",nuevasFilas);
    //console.log("columnas",nuevasColumnas);

    refx = Math.floor(nuevasColumnas/2);
    refy = Math.floor(nuevasFilas/2);

    //console.log("refx",refx);
    //console.log("refy",refy);

    xoffset = refx-Math.floor(columnas/2);
    yoffset = refy-Math.floor(filas/2);

    //console.log("xoffset",xoffset);
    //console.log("yoffset",yoffset);

    newPxl = newImg.data;
    imgPxl = img.data;
    cols = 4*columnas;
    cols2 = 4 * newImg.width;

    for(i=0;i<newImg.data.length;i++){
        if((i+1)%4==0){
            newPxl[i]=255;
        }else{
            newPxl[i]=0;
        }
    }

    for(j=0;j<filas;j++){
        for(i=0;i<columnas;i++){

            nuevaX = i-refx+xoffset;
            nuevaY = j-refy+yoffset;

            Yprima = Math.floor(refy+(nuevaY*Math.cos(grad)-nuevaX*Math.sin(grad)))-1;
            Xprima = Math.floor(refx+(nuevaY*Math.sin(grad)+nuevaX*Math.cos(grad)));
         
            //console.log("Xprima",Xprima);
            //console.log("Yprima",Yprima);
            
            if(Yprima>=0 && Yprima<nuevasFilas && Xprima>=0 && Xprima<nuevasColumnas){
                var r = imgPxl[(cols*j)+(i*4)];
                var g = imgPxl[(cols*j)+(i*4)+1];
                var b = imgPxl[(cols*j)+(i*4)+2];

                newPxl[(cols2*Yprima)+(Xprima*4)] = r;
                newPxl[(cols2*Yprima)+(Xprima*4+1)] = g; 
                newPxl[(cols2*Yprima)+(Xprima*4+2)] = b;
            }
        }
    }

    canvas2.width = nuevasColumnas;
    canvas2.height = nuevasFilas;
    ctx2.putImageData(newImg,0,0);
}

//Se ejecuta con cada cambio de el slider
function tipoIMG(value){
    grados= parseInt(value,10);
    rotacion(grados);
}

function convierte(g){
    return g*(Math.PI/180)
}