#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
#include <avr/power.h>
#endif

// 出力ピン
#define PIN 13

// シリアル接続
#define SERIAL_RATE 500000

// 発光ピクセル数
#define NUMPIXELS 184q

void showPixels( uint8_t *data );
void clearPixels();

uint8_t receivedData[ NUMPIXELS * 4 ] = {};
int index = -1;

Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUMPIXELS, PIN, NEO_RGBW + NEO_KHZ800);


void setup() {

  // LEDライブラリ開始
  pixels.begin();

  // シリアルポート開始
  Serial.begin( SERIAL_RATE );

  // 点灯状態をクリアする
  clearPixels();
  
}


void loop() {

  while( Serial.available() ){

    uint8_t d = Serial.read();

    // デリミタ（0xff）
    if( d == 255 ){

      // 配列のインデックスを初期化する
      index = 0;

    // データ
    }else if( index <= NUMPIXELS * 4 && d != -1 ){

      // 配列に格納、インデックスをひとつ進める
      receivedData[ index ] = d;
      index++;

      if( index == NUMPIXELS * 4 ){

        index = -1;
        showPixels( receivedData );
        
      }
      
    }

  }

}


/*
 * RGBWデータ配列にしたがって点灯させる
 */
void showPixels( uint8_t *data ){
  
  for (int i = 0; i < NUMPIXELS; i++) {
    pixels.setPixelColor(
      i,
      pixels.Color(
        data[ i * 4 + 1 ],
        data[ i * 4 + 0 ], 
        data[ i * 4 + 2 ],
        data[ i * 4 + 3 ]
      )
    );
  }

  pixels.show();
  
}


/*
 * 全てのドットを消灯
 */
void clearPixels(){
  
  for (int i = 0; i < NUMPIXELS; i++) {
    pixels.setPixelColor( i, pixels.Color( 0, 0, 0, 0 ) );
  }

  pixels.show();
  
}

