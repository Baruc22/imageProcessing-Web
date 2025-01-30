var fileTypes = ["image/jpg", "image/jpeg", "image/png"];
var canvas1 = document.getElementById("canvasImagen1"); //img 1
var canvas2 = document.getElementById("canvasImagen2"); //img 2
var canvas3 = document.getElementById("canvasImagen3"); //img suma

var image1 = new Image(); //instancia de tipo de dato Image
var image2 = new Image();

var imagenes = document.getElementById("imagen1") //carga la imagen seleccionada de los archivos. Referencia a la imagen que se lee

imagenes.addEventListener("change", actualizaImagenes); //escucha si hay un evento de tipo chance, cuando se hace algo en el boton, se seleccione una imagen y se ejecuta la funcion actualizaimagen1

var ctx1 = canvas1.getContext("2d"); //obtener el contexto del canvas
var ctx2 = canvas2.getContext("2d");
var ctx3 = canvas3.getContext("2d");

function actualizaImagenes() {
    var curFile = imagenes.files;//arrego de imagenes seleccionadas
    console.log(curFile[0].name);
    console.log(curFile[1].name);
    image1.src = window.URL.createObjectURL(curFile[0]); //obtiene la los pixeles de la imagen y toda su informacion
    image2.src = window.URL.createObjectURL(curFile[1]);

    image1.onload = function () {
        image2.onload = function () {
            canvas1.width = image1.width;
            canvas1.height = image1.height;
            canvas2.width = image2.width;
            canvas2.height = image2.height;
            if (image1.width == image2.width && image1.height == image2.height) {
                ctx1.drawImage(image1, 0, 0);
                ctx2.drawImage(image2, 0, 0);
                operacion();
            } else {
                window.alert("Las imagenes deden ser de las mismas dimenciones");
            }

        }
    }
}

function operacion() {
    operacionOr();
}

operacionOr = function () {
    var image3 = new Image();
    image2 = ctx2.getImageData(0,0,canvas2.width,canvas2.height);
    image3 = ctx1.getImageData(0,0,canvas1.width,canvas1.height);

    pxls2 = image2.data;
    pxls3 = image3.data;
    
    filas = image3.height;
    columnas = image3.width;

    cols = 4 * columnas;

    for (var j=0;j<filas;j++) {
        for (var i=0;i<columnas*4;i+=4) {
            var r = ((pxls3[(cols*j)+i])|(pxls2[(cols*j)+i]));
            var g = ((pxls3[(cols*j)+i+1])|(pxls2[(cols*j)+i+1]));
            var b = ((pxls3[(cols*j)+i+2])|(pxls2[(cols*j)+i+2]));

            pxls3[(cols * j) + i] = r;
            pxls3[(cols * j) + i + 1] = g;
            pxls3[(cols * j) + i + 2] = b;
        }
    }
    canvas3.width = image3.width;
    canvas3.height = image3.height;
    ctx3.putImageData(image3, 0, 0);
}
