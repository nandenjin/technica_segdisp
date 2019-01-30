
class Pixel {

  r: number = 0;
  g: number = 0;
  b: number = 0;
  w: number = 0;

  constructor( init? :Partial<Pixel> ) {

    (<any>Object).assign( this, init );

  }

  set( r: number, g: number, b: number, w: number ): Pixel {

    this.r = r;
    this.g = g;
    this.b = b;
    this.w = w;

    return this;

  }

  dimming( dimming ): Pixel {

    const scale = 1 / Math.max( this.r, this.g, this.b, this.w ) * dimming;

    this.r *= scale;
    this.g *= scale;
    this.b *= scale;
    this.w *= scale;

    return this;

  }

  toDMXArray() :Uint8ClampedArray {

    return Uint8ClampedArray.from( [
      this.g * 255,
      this.r * 255,
      this.b * 255,
      this.w * 255,
    ] );

  }

}

export { Pixel };
