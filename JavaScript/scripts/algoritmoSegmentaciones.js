var fileTypes=["image/jpg","image/jpeg","image/png"];
var canvas1 = document.getElementById("canvasImagen1");
var canvas2 = document.getElementById("canvasImagen2");
var canvas3 = document.getElementById("canvasImagen3");
var canvas4 = document.getElementById("canvasImagen4");

var image1 = new Image(); //instancia de tipo de dato Image
var imagen1 = document.getElementById("imagen1") //carga la imagen seleccionada de los archivos. Referencia a la imagen que se lee

imagen1.addEventListener("change",actualizaImagen1); //escucha si hay un evento de tipo chance, cuando se hace algo en el boton, se seleccione una imagen y se ejecuta la funcion actualizaimagen1
canvas1.addEventListener('mousedown', manejadorCLickRaton, false);//interrupcion para el mouse

var ctx1 = canvas1.getContext("2d"); //obtener el contexto del canvas
var ctx2 = canvas2.getContext("2d");
var ctx3 = canvas3.getContext("2d");
var ctx4 = canvas4.getContext("2d");

var pxlr,pxlg,pxlb;
var umbral;
var band=0;
var bandClik=0;
var yprima,xprima;
//Variables para secmentacion por Mahalanobis
var puntoAx,puntoAy,puntoBx,puntoBy;
var conjuntoPxls = new Array();
//Matriz inversa
var matrizInversa = new Array(3);
for(i=0;i<3;i++){
    matrizInversa[i] = new Array(3);
}

var grosor = 1;

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
    var i,j,x,r,g,b;
    var image2 = new Image();
    image2 = ctx1.getImageData(0,0,canvas1.width,canvas1.height);
    var colorPxl = document.getElementById("pxl");
    pixels = image2.data;
    filas = image2.height;
    columnas = image2.width;
    cols = 4*columnas;
    for(j=0;j<filas;j++){
        for(i=0,x=0;i<columnas*4;i+=4,x++){

            //Seleccion de pxl para Cubo y Euclidiana
            if(j==yprima && x==xprima){
                pxlr = pixels[(cols*j)+i];
                pxlg = pixels[(cols*j)+i+1];
                pxlb = pixels[(cols*j)+i+2];
                var color = "#"+pxlr.toString(16)+pxlg.toString(16)+pxlb.toString(16);
                //console.log(color);
                colorPxl.style.background = color;
                //console.log(x,j);
            }

            //Seleccion de pixeles para Mahalanobis
            if( i>=(puntoAx*4) && j>=puntoAy && i<=(puntoBx*4) && j<=puntoBy){
                r = pixels[(cols*j)+i];
                g = pixels[(cols*j)+i+1];
                b = pixels[(cols*j)+i+2];

                conjuntoPxls.push(r);
                conjuntoPxls.push(g);
                conjuntoPxls.push(b);
            }
            //Remarcar el area seleccionada
            if((i>=puntoAx*4 && i<=puntoBx*4 && j>=puntoAy && j<=puntoAy+grosor) || (i>=puntoAx*4 && i<=puntoBx*4 && j<=puntoBy && j>=puntoBy-grosor) || (j>=puntoAy && j<=puntoBy && i>=puntoAx*4 && i<=(puntoAx*4)+(grosor*4)) || (j>=puntoAy && j<=puntoBy && i<=(puntoBx*4) && i>=(puntoBx*4)-(grosor*4)))
            {
                r = pixels[(cols*j)+i];
                g = pixels[(cols*j)+i+1];
                b = pixels[(cols*j)+i+2];
                pixels[(cols*j)+i] = Math.abs(255-r);
                pixels[(cols*j)+i+1] = Math.abs(255-g);
                pixels[(cols*j)+i+2] = Math.abs(255-b);
            }

        }
    }

    //console.log(conjuntoPxls);
    canvas1.width = image2.width;
    canvas1.height = image2.height;
    ctx1.putImageData(image2, 0, 0);
}

//SEGMENTACION CON DISTANCIA EUCLIDIANA
function segmentacionCubo(){
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
                var prom = (r+g+b)/3
                pixels[(cols*j)+i] = prom;
                pixels[(cols*j)+i+1] = prom;
                pixels[(cols*j)+i+2] = prom;
            }

            if((i>=puntoAx*4 && i<=puntoBx*4 && j>=puntoAy && j<=puntoAy+grosor) || (i>=puntoAx*4 && i<=puntoBx*4 && j<=puntoBy && j>=puntoBy-grosor) || (j>=puntoAy && j<=puntoBy && i>=puntoAx*4 && i<=(puntoAx*4)+(grosor*4)) || (j>=puntoAy && j<=puntoBy && i<=(puntoBx*4) && i>=(puntoBx*4)-(grosor*4))){
                pixels[(cols*j)+i] = Math.abs(255-r);
                pixels[(cols*j)+i+1] = Math.abs(255-g);
                pixels[(cols*j)+i+2] = Math.abs(255-b);
            }
        }
    }
    canvas3.width=image2.width;
    canvas3.height=image2.height;
    ctx3.putImageData(image2,0,0); 
}
//-----------------------------------------------------------

//SEGMENTACION CON DISTANCIA DE CUBO
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
            
            var difr = Math.abs(r-pxlr);
            var difg = Math.abs(g-pxlg);
            var difb = Math.abs(b-pxlb);

            if((difr+difg+difb)>umbral){
                var prom = (r+g+b)/3
                pixels[(cols*j)+i] = prom;
                pixels[(cols*j)+i+1] = prom;
                pixels[(cols*j)+i+2] = prom;
            }

            if((i>=puntoAx*4 && i<=puntoBx*4 && j>=puntoAy && j<=puntoAy+grosor) || (i>=puntoAx*4 && i<=puntoBx*4 && j<=puntoBy && j>=puntoBy-grosor) || (j>=puntoAy && j<=puntoBy && i>=puntoAx*4 && i<=(puntoAx*4)+(grosor*4)) || (j>=puntoAy && j<=puntoBy && i<=(puntoBx*4) && i>=(puntoBx*4)-(grosor*4))){
                pixels[(cols*j)+i] = Math.abs(255-r);
                pixels[(cols*j)+i+1] = Math.abs(255-g);
                pixels[(cols*j)+i+2] = Math.abs(255-b);
            }
        }
    }
    canvas2.width=image2.width;
    canvas2.height=image2.height;
    ctx2.putImageData(image2,0,0); 
}
//-------------------------------------------------------- 


//SEGMENTACION CON DISTANCIA MAHALANOBIS
function segmentacionMahalanobis(){
    var i,j,k,r,g,b,dist;
    var sumatoriaR,sumatoriaG,sumatoriaB;
    var promedioR,promedioG,promedioB;

    //Creacion de la matriz RGB
    var filas=conjuntoPxls.length/3;
    var matrizRGB = new Array(filas);
    for(i=0;i<filas;i++){
        matrizRGB[i]=new Array(3);
    }
    //Llenado de la matriz RGB
    for(j=0,k=0;j<filas;j++){
        for(i=0;i<3;i++){
            matrizRGB[j][i] = conjuntoPxls[k];
            k++;
        }
    }
    //Sumatorias R,G,B
    sumatoriaR=0;
    sumatoriaG=0;
    sumatoriaB=0;
    for(j=0;j<filas;j++){
        for(i=0;i<3;i++){
            if(i==0){//R
                sumatoriaR+=matrizRGB[j][i];
            }else if(i==1){//G
                sumatoriaG+=matrizRGB[j][i];
            }else if(i==2){//B
                sumatoriaB+=matrizRGB[j][i];
            }
        }
    }
    
    //Promedios
    promedioR = sumatoriaR/filas; 
    promedioG = sumatoriaG/filas;
    promedioB = sumatoriaB/filas;

    //Matriz de restas
    for(j=0;j<filas;j++){
        for(i=0;i<3;i++){
            if(i==0){//R
                matrizRGB[j][i]=matrizRGB[j][i]-promedioR;
            }else if(i==1){//G
                matrizRGB[j][i]=matrizRGB[j][i]-promedioG;
            }else if(i==2){//B
                matrizRGB[j][i]=matrizRGB[j][i]-promedioB;
            }
        }
    }

    //Declarar matriz de covarianza
    var matrizCov = new Array(3);
    for(i=0;i<3;i++){
        matrizCov[i] =  new Array(3);
    }

    matrizCovarianza(matrizRGB,matrizCov,filas);
    inversa(matrizCov,matrizInversa);

    //APLICAR LA FORMULA
    //Clacular el pxl medio del conjunto seleccionado
    var pxlMedio = new Array(3);
    pxlA(pxlMedio);

    //SE REALIZA LA SEGMENTACION DE LA IMAGEN
    var image2 = new Image();
    var pxlActual = new Array(3);
    image2 = ctx1.getImageData(0,0,canvas1.width,canvas1.height);
    pixels = image2.data;
    filas = image2.height;
    columnas = image2.width;
    cols = 4*columnas;
    for(var j=0;j<filas;j++){
        for(var i=0;i<columnas*4;i+=4){
            r = pixels[(cols*j)+i];
            g = pixels[(cols*j)+i+1];
            b = pixels[(cols*j)+i+2];
            
            pxlActual[0]=r;
            pxlActual[1]=g;
            pxlActual[2]=b;

            dist = distancia(pxlActual,pxlMedio,matrizInversa);
            //console.log("distancia ",dist);

            if(dist>umbral){
                var prom = (r+g+b)/3
                pixels[(cols*j)+i] = prom;
                pixels[(cols*j)+i+1] = prom;
                pixels[(cols*j)+i+2] = prom;
            }

            if((i>=puntoAx*4 && i<=puntoBx*4 && j>=puntoAy && j<=puntoAy+grosor) || (i>=puntoAx*4 && i<=puntoBx*4 && j<=puntoBy && j>=puntoBy-grosor) || (j>=puntoAy && j<=puntoBy && i>=puntoAx*4 && i<=(puntoAx*4)+(grosor*4)) || (j>=puntoAy && j<=puntoBy && i<=(puntoBx*4) && i>=(puntoBx*4)-(grosor*4))){
                pixels[(cols*j)+i] = Math.abs(255-r);
                pixels[(cols*j)+i+1] = Math.abs(255-g);
                pixels[(cols*j)+i+2] = Math.abs(255-b);
            }
        }
    }
    canvas4.width=image2.width;
    canvas4.height=image2.height;
    ctx4.putImageData(image2,0,0);

}

function distancia(pxlActual,pxlMedio,matrizInversa){
    var ZCA = new Array(3);

    ZCA[0] = (pxlActual[0]-pxlMedio[0])*matrizInversa[0][0]+(pxlActual[1]-pxlMedio[1])*matrizInversa[1][0]+(pxlActual[2]-pxlMedio[2])*matrizInversa[2][0];
    ZCA[1] = (pxlActual[0]-pxlMedio[0])*matrizInversa[0][1]+(pxlActual[1]-pxlMedio[1])*matrizInversa[1][1]+(pxlActual[2]-pxlMedio[2])*matrizInversa[2][1];
    ZCA[2] = (pxlActual[0]-pxlMedio[0])*matrizInversa[0][2]+(pxlActual[1]-pxlMedio[1])*matrizInversa[1][2]+(pxlActual[2]-pxlMedio[2])*matrizInversa[2][2];

    return Math.sqrt(ZCA[0]*(pxlActual[0]-pxlMedio[0])+ZCA[1]*(pxlActual[1]-pxlMedio[1])+ZCA[2]*(pxlActual[2]-pxlMedio[2]));
}

function pxlA(pxlMedio){
    var i;
    var promR=0,promG=0,promB=0;
    for(i=0;i<conjuntoPxls.length;i+=3){
        promR+=conjuntoPxls[i];
        promG+=conjuntoPxls[i+1];
        promB+=conjuntoPxls[i+2];
    }
    pxlMedio[0]=promR/(conjuntoPxls.length/3);
    pxlMedio[1]=promG/(conjuntoPxls.length/3);
    pxlMedio[2]=promB/(conjuntoPxls.length/3);
}

function matrizCovarianza(matrizRGB,matrizCov,filas){
    var i,j,suma;
    //Crear matriz transpuesta
    var matrizTrans = new Array(3);//columnas
    for(i=0;i<3;i++){
        matrizTrans[i] = new Array(filas);
    }
    //Llenado de matriz transpuesta
    for(j=0;j<filas;j++){
        for(i=0;i<3;i++){
            matrizTrans[i][j] = matrizRGB[j][i];
        }
    }
    //Llenado de matriz 3x3 
    for(j=0;j<3;j++){
        suma=0;
        for(i=0;i<filas;i++){
            suma+=matrizTrans[j][i]*matrizRGB[i][0];
        }
        matrizCov[j][0]=suma;
        suma=0;
        for(i=0;i<filas;i++){
            suma+=matrizTrans[j][i]*matrizRGB[i][1];
        }
        matrizCov[j][1]=suma;
        suma=0;
        for(i=0;i<filas;i++){
            suma+=matrizTrans[j][i]*matrizRGB[i][2];
        }
        matrizCov[j][2]=suma;
    }
    //Matriz de covarianza
    for(j=0;j<3;j++){
        for(i=0;i<3;i++){
            matrizCov[j][i] = matrizCov[j][i]/(filas-1);
        }
    }
}

function inversa(matrizCov,matrizInversa){
    var det,i,j;
    //det = 0 -> no se puede invertir
    //Calcular el det de la matriz
    det = matrizCov[0][0]*matrizCov[1][1]*matrizCov[2][2]+matrizCov[0][1]*matrizCov[1][2]*matrizCov[2][0]+matrizCov[1][0]*matrizCov[2][1]*matrizCov[0][2]-matrizCov[0][2]*matrizCov[1][1]*matrizCov[2][0]-matrizCov[0][1]*matrizCov[1][0]*matrizCov[2][2]-matrizCov[1][2]*matrizCov[2][1]*matrizCov[0][0];

    //Transpuesta de matriz3x3
    var matriz3x3trans = new Array(3);
    for(i=0;i<3;i++){
        matriz3x3trans[i] = new Array(3);
    }
    //Calculo de la matriz transpuesta de matriz3x3
    for(j=0;j<3;j++){
        for(i=0;i<3;i++){
            matriz3x3trans[i][j]=matrizCov[j][i];
        }
    }
    //Matriz adjunta
    var matrizAdj = new Array(3);
    for(i=0;i<3;i++){
        matrizAdj[i] = new Array(3);
    }
    //Llenado de la matriz adjunta
    matrizAdj[0][0] = matriz3x3trans[1][1]*matriz3x3trans[2][2]-matriz3x3trans[2][1]*matriz3x3trans[1][2];
    matrizAdj[0][1] = -1*(matriz3x3trans[1][0]*matriz3x3trans[2][2]-matriz3x3trans[2][0]*matriz3x3trans[1][2]);
    matrizAdj[0][2] = matriz3x3trans[1][0]*matriz3x3trans[2][1]-matriz3x3trans[2][0]*matriz3x3trans[1][1];

    matrizAdj[1][0] = -1*(matriz3x3trans[0][1]*matriz3x3trans[2][2]-matriz3x3trans[2][1]*matriz3x3trans[0][2]);
    matrizAdj[1][1] = matriz3x3trans[0][0]*matriz3x3trans[2][2]-matriz3x3trans[2][0]*matriz3x3trans[0][2];
    matrizAdj[1][2] = -1*(matriz3x3trans[0][0]*matriz3x3trans[2][1]-matriz3x3trans[2][0]*matriz3x3trans[0][1]);

    matrizAdj[2][0] = matriz3x3trans[0][1]*matriz3x3trans[1][2]-matriz3x3trans[1][1]*matriz3x3trans[0][2];
    matrizAdj[2][1] = -1*(matriz3x3trans[0][0]*matriz3x3trans[1][2]-matriz3x3trans[1][0]*matriz3x3trans[0][2]);
    matrizAdj[2][2] = matriz3x3trans[0][0]*matriz3x3trans[1][1]-matriz3x3trans[1][0]*matriz3x3trans[0][1];

    //Calcular matriz inversa
    for(j=0;j<3;j++){
        for(i=0;i<3;i++){
            matrizInversa[j][i] = matrizAdj[j][i]/det;
        }
    }
}
//-------------------------------------

//Se ejecuta con cada cambio de el slider
function tipoIMG(value){
    umbral = parseInt(value,10);
    if(band==1){
        segmentacionCubo();
        segmentacionEuclidiana();
        segmentacionMahalanobis();
    }

}

//Se ejecuta con cada click sobre la imagen
function manejadorCLickRaton(e){
    band=1;
    relativeX = e.clientX-(canvas1.offsetLeft-Math.floor(window.scrollX));
    relativeY = e.clientY-(canvas1.offsetTop-Math.floor(window.scrollY));
    

    if(bandClik==0){
        puntoAx = relativeX;
        puntoAy = relativeY;
        bandClik=1;
    }else if(bandClik==1){
        puntoBx = relativeX;
        puntoBy = relativeY;
        bandClik=2;
        var tmpx = (puntoBx-puntoAx)/2;
        var tmpy = (puntoBy-puntoAy)/2;
        xprima = Math.floor(tmpx+puntoAx);
        yprima = Math.floor(tmpy+puntoAy);
        //console.log(puntoAx,puntoAy);
        //console.log(puntoBx,puntoBy);
        //console.log(xprima,yprima);
    }    

    if(bandClik==2){
        seleccionPXL();
        var start1 = window.performance.now();
        segmentacionCubo();
        var end1 = window.performance.now();
        console.log(`Execution time: ${end1 - start1} ms`);
        var start2 = window.performance.now();
        segmentacionEuclidiana();
        var end2 = window.performance.now();
        console.log(`Execution time: ${end2 - start2} ms`);
        var start3 = window.performance.now();
        segmentacionMahalanobis();
        var end3 = window.performance.now();
        console.log(`Execution time: ${end3 - start3} ms`);
    }
}