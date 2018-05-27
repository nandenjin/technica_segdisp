
class RGBWColor{

  constructor() {

    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.w = 0;

    return this;
    
  }

  set( r, g, b, w ) {

    this.r = r;
    this.g = g;
    this.b = b;
    this.w = w;

    return this;

  }

  copy( color ){

    this.r = color.r;
    this.g = color.g;
    this.b = color.b;
    this.w = color.w;

    return this;

  }

  clear() {

    this.set( 0, 0, 0, 0 );

  }

}

module.exports = RGBWColor;
