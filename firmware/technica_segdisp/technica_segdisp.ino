#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
#include <avr/power.h>
#endif

#define PIN 13
#define NUMPIXELS 184

void showPixels( uint8_t *data );
void clearPixels();

uint8_t receivedData[ NUMPIXELS * 4 ] = {};
int index = -1;

Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUMPIXELS, PIN, NEO_RGBW + NEO_KHZ800);

void setup() {

  // LEDライブラリ開始
  pixels.begin();

  // シリアルポート開始
  Serial.begin(115200);

  clearPixels();
  
}

void loop() {

  while( Serial.available() ){

    uint8_t d = Serial.read();
    
    if( d == 255 ){
      
      index = 0;
      // Serial.write( 'H' );
  
    }else if( 0 <= index && index < NUMPIXELS * 4 ){

      receivedData[ index ] = d;
      index++;
      // Serial.write( 'D' );
      
      if( NUMPIXELS * 4 <= index ){
      
        index = -1;
        showPixels( receivedData );
      // Serial.write( 'E' );

      }
      
    }

  }

}


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

void clearPixels(){
  
  for (int i = 0; i < NUMPIXELS; i++) {
    pixels.setPixelColor( i, pixels.Color( 0, 0, 0, 0 ) );
  }

  pixels.show();
  
}

