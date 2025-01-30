#include <stdio.h>
#include <stdlib.h>
#include <opencv2/opencv.hpp>
#include <math.h>

using namespace cv;

int main(int argc, char** argv){

    int canales,filas,columnas,i,j;

    if(argc!=2){
        printf("Se necesita un argumento <path imagen>\n");
        return -1;
    }

    Mat img = imread(argv[1],0);

    filas = img.rows;
    columnas = img.cols;
    canales = img.channels();

    Mat newImg(filas,columnas,CV_8UC1);

    for(j=0;j<(filas-1);j++){        
        uchar *imgPtr = img.ptr<uchar>(j);
        uchar *imgPtr2 = img.ptr<uchar>(j+1);
        uchar *newImgPtr = newImg.ptr<uchar>(j);
        for(i=0;i<(columnas*canales)-canales;i+=canales){
        
            *(newImgPtr + i) = abs(*(imgPtr + i) - *(imgPtr2 + i));
            *(newImgPtr + i) = abs(*(imgPtr + i) - *(imgPtr + i + canales));
            
        }            
    }
    

    namedWindow("imagen",WINDOW_AUTOSIZE);
    imshow("imagen", newImg);

    int tecla;
    while(true)
    {
        tecla=waitKey(0);
        if(tecla==27)
            break;
    }

    return 0;

}