


class PixelDataSet{

  constructor() {

    this.pixels = [];

  }

  setIntensity( intensity ) {

    this.pixels.forEach( p => p.setIntensity( intensity ) );

    return this;

  }

  copyColor( color ){

    this.pixels.forEach( p => p.color.copy( color ) )

    return this;

  }

  copy( pixel ){

    this.pixels.forEach( p => p.copy( pixel ) );

    return this;

  }

}

module.exports = PixelDataSet;
