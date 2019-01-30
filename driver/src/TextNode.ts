
import { DisplayDataFragment } from './DisplayDataFragment';
import { Node } from './Node';

import segmentPresets from './presets/segments';
import characterPresets from './presets/characters';

const PIXELS_PER_UNIT = segmentPresets._PIXELS_PER_UNIT;

const KANAMAP = {
  'ガ': 'ｶﾞ', 'ギ': 'ｷﾞ', 'グ': 'ｸﾞ', 'ゲ': 'ｹﾞ', 'ゴ': 'ｺﾞ',
  'ザ': 'ｻﾞ', 'ジ': 'ｼﾞ', 'ズ': 'ｽﾞ', 'ゼ': 'ｾﾞ', 'ゾ': 'ｿﾞ',
  'ダ': 'ﾀﾞ', 'ヂ': 'ﾁﾞ', 'ヅ': 'ﾂﾞ', 'デ': 'ﾃﾞ', 'ド': 'ﾄﾞ',
  'バ': 'ﾊﾞ', 'ビ': 'ﾋﾞ', 'ブ': 'ﾌﾞ', 'ベ': 'ﾍﾞ', 'ボ': 'ﾎﾞ',
  'パ': 'ﾊﾟ', 'ピ': 'ﾋﾟ', 'プ': 'ﾌﾟ', 'ペ': 'ﾍﾟ', 'ポ': 'ﾎﾟ',
  'ヴ': 'ｳﾞ', 'ヷ': 'ﾜﾞ', 'ヺ': 'ｦﾞ',
  'ア': 'ｱ', 'イ': 'ｲ', 'ウ': 'ｳ', 'エ': 'ｴ', 'オ': 'ｵ',
  'カ': 'ｶ', 'キ': 'ｷ', 'ク': 'ｸ', 'ケ': 'ｹ', 'コ': 'ｺ',
  'サ': 'ｻ', 'シ': 'ｼ', 'ス': 'ｽ', 'セ': 'ｾ', 'ソ': 'ｿ',
  'タ': 'ﾀ', 'チ': 'ﾁ', 'ツ': 'ﾂ', 'テ': 'ﾃ', 'ト': 'ﾄ',
  'ナ': 'ﾅ', 'ニ': 'ﾆ', 'ヌ': 'ﾇ', 'ネ': 'ﾈ', 'ノ': 'ﾉ',
  'ハ': 'ﾊ', 'ヒ': 'ﾋ', 'フ': 'ﾌ', 'ヘ': 'ﾍ', 'ホ': 'ﾎ',
  'マ': 'ﾏ', 'ミ': 'ﾐ', 'ム': 'ﾑ', 'メ': 'ﾒ', 'モ': 'ﾓ',
  'ヤ': 'ﾔ', 'ユ': 'ﾕ', 'ヨ': 'ﾖ',
  'ラ': 'ﾗ', 'リ': 'ﾘ', 'ル': 'ﾙ', 'レ': 'ﾚ', 'ロ': 'ﾛ',
  'ワ': 'ﾜ', 'ヲ': 'ｦ', 'ン': 'ﾝ',
  'ァ': 'ｧ', 'ィ': 'ｨ', 'ゥ': 'ｩ', 'ェ': 'ｪ', 'ォ': 'ｫ',
  'ッ': 'ｯ', 'ャ': 'ｬ', 'ュ': 'ｭ', 'ョ': 'ｮ',
  '。': '｡', '、': '､', 'ー': 'ｰ', '「': '｢', '」': '｣', '・': '･',
};

class TextNode extends Node {

  type: string = 'TextNode';

  options = {
    text: 'hello',
    offset: 0,
    speed: 0,
    noBlank: false,
  };

  constructor( init? :Partial<TextNode> ) {

    super( init );
    (<any>Object).assign( this, init );

  }


  render( data: DisplayDataFragment, time: number ): DisplayDataFragment {

    super.render( data, time );

    const options = this.options;

    let offset = Math.floor( options.offset || 0 );
    const speed = options.speed;

    let text = options.text;

    if( speed !== 0 ) {

      const stepLength = text.length + ( options.noBlank ? 0 : 4 );
      const stepTimeMs = 1000 / speed;
      const loopCycleMs = stepTimeMs * stepLength;
      const step = Math.floor( ( time / loopCycleMs % 1 ) * stepLength );
      offset = ( options.noBlank ? 0 : -4 ) + step;

      if( options.noBlank ) {
        text += text;
      }

    }

    if( offset >= 0 ) text = text.slice( offset );
    else text = new Array( -offset ).fill( ' ' ).join( '' ) + text;

    Object.keys( KANAMAP ).forEach( k => text = text.replace( k, KANAMAP[k] ) );

    data.length = text.length * PIXELS_PER_UNIT;

    for( let i = 0; i < text.length; i++ ) {

      let char = text.charAt( i ).toUpperCase();

      const offsetPixel = i * PIXELS_PER_UNIT;

      const indexes = characterPresets[ char ];

      for( let j = 0; j < PIXELS_PER_UNIT; j++ ) {

        const pixel = data.pixels[ j + offsetPixel ];
        if( !pixel ) continue;

        if( indexes && indexes.includes( j ) )
          pixel.set( 0, 0, 0, 1 );
        else
          pixel.set( 0, 0, 0, 0 );

      }

    }

    return data;

  }

}

export { TextNode };
