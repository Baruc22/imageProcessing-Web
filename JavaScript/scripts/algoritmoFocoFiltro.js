
var fileTypes = ["image/jpg", "image/jpeg", "image/png"];
var canvas1 = document.getElementById("canvasImagen1");
var canvas2 = document.getElementById("canvasImagen2");
var slider = document.getElementById("radio");

var image1 = new Image(); //instancia de tipo de dato Image
var imagen1 = document.getElementById("imagen1") //carga la imagen seleccionada de los archivos. Referencia a la imagem que se lee

//slider.addEventListener("change",actualizaRadio);
canvas2.addEventListener('mousemove', manejadorRaton, false);//interrupcion para el mouse


//Variables de las imagenes mostradas
var img = new Image();
var newImg = new Image();

//Variables para matriz máscara
var mascara = Array();
var columnasMascara;
var filasMascara;

//Variables para el foco
var relativeX;
var relativeY;
var radio = 10;

imagen1.addEventListener("change", actualizaImagen1); //escucha si hay un evento de tipo chance, cuando se hace algo en el boton, se seleccione una imagen y se ejecuta la funcion actualizaimagen1
var ctx1 = canvas1.getContext("2d"); //obtener el contexto del canvas
var ctx2 = canvas2.getContext("2d");

function actualizaImagen1() {
    var curFile = imagen1.files;//arrego de imagenes seleccionadas
    Source = curFile[0].name; //obtener la primera imagen del arreglo. Nombre
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
    filtro();    
}

function textArea(){
    var cad = document.getElementById("mascara").value;
    var fondo = document.getElementById("mascara");
    for(var i= 0;i<cad.length;i++){
        if(cad[i]>='0' && cad[i]<='9'){
            mascara.push(parseInt(cad[i],10));
        }if(cad[i]=='-'){
            var n = cad[i]+cad[i+1];
            i++;
            mascara.push(parseInt(n,10));
        }
    }
    fondo.style.background = '#AEFF75';
}

foco = function(){
    ctx2.putImageData(img, 0, 0);
    ctx2.fillStyle = "#000000";
    ctx2.arc(relativeX,relativeY,radio,0,2*Math.PI);
    ctx2.fill();
}

filtro = function (){
    var i, j, k, w, i2, j2,r,g,b;
    var sumMascara = 0;
    var sumatoriaR;
    var sumatoriaG;
    var sumatoriaB;
    filasMascara = mascara[0];
    columnasMascara = mascara[1];

    for (j = 0; j < filasMascara; j++) {
        for (i = 2; (i-2) < columnasMascara; i++) {
            sumMascara += mascara[(j*filasMascara)+i];
        }
    }
    if(sumMascara==0){
        sumMascara=1;
    }

    img = ctx1.getImageData(0, 0, canvas1.width, canvas1.height);
    newImg = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
    newPxls = newImg.data;
    imgPxls = img.data;
    filas = img.height;
    columnas = img.width;
    cols = 4 * columnas;
    for (j = 0; j < filas; j++) {
        for (i = 0; i < cols; i += 4) {

            r = newPxls[(cols*j)+i];
            g = newPxls[(cols*j)+i+1];
            b = newPxls[(cols*j)+i+2];

            if(r==0 && g==0 && b==0){
                sumatoriaR = 0;
                sumatoriaG = 0;
                sumatoriaB = 0;
                for (j2 = 0, k = j; j2 < filasMascara; k++, j2++) {
                    for (i2 = 2, w = i; (i2-2) < columnasMascara; w+=4, i2++) {
                        r = imgPxls[(cols * k) + w]; //r
                        g = imgPxls[(cols * k) + w + 1]; //g
                        b = imgPxls[(cols * k) + w + 2]; //b
                        sumatoriaR+=(r*mascara[(j2*filasMascara)+i2]); 
                        sumatoriaG+=(g*mascara[(j2*filasMascara)+i2]);
                        sumatoriaB+=(b*mascara[(j2*filasMascara)+i2]);
                    }
                }
                var divR = Math.abs(sumatoriaR)/sumMascara;
                var divG = Math.abs(sumatoriaG)/sumMascara;
                var divB = Math.abs(sumatoriaB)/sumMascara;
                newPxls[(cols * (j+1)) + (i+4)] = divR;
                newPxls[(cols * (j+1)) + (i+5)] = divG;
                newPxls[(cols * (j+1)) + (i+6)] = divB;
            }

        }
    }
    canvas2.width = newImg.width;
    canvas2.height = newImg.height;
    ctx2.putImageData(newImg, 0, 0);
}


function manejadorRaton(e) {
    relativeX = e.clientX-(canvas2.offsetLeft-Math.floor(window.scrollX));
    relativeY = e.clientY-(canvas2.offsetTop-Math.floor(window.scrollY));
    foco();
    filtro();
              
}

function cambioFoco(value){
    radio = parseInt(value,10);
    console.log(radio);
}