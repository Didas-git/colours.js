import { avg, mid } from "./mathExt";

export class Color extends Object {

    private _r: number;
    private _g: number;
    private _b: number;
    private _a: number;

    /** class representing a digital presentable color */
    public constructor(r: number, g: number, b: number, a: number = 1) {
        super();
        this._r = Math.min(Math.max(r, 0), 1);
        this._g = Math.min(Math.max(g, 0), 1);
        this._b = Math.min(Math.max(b, 0), 1);
        this._a = Math.min(Math.max(a, 0), 1);
    }

    /** export this color into RGB format */
    public toRGB() {
        return [this._r, this._g, this._b];
    }

    /** export this color into RGBA format */
    public toRGBA() {
        return [this._r, this._g, this._b, this._a];
    }

    /** export this color into 24-bit RGB */
    public to24BitRGB() {
        return [this.r_8b, this.g_8b, this.b_8b];
    }

    /** export this color into 32-bit RGBA */
    public to32BitRGBA() {
        return [this.r_8b, this.g_8b, this.b_8b, this.a_8b];
    }

    /** export this color into HSV format */
    public toHSV() {
        return [this.hue, this.saturation_V, this.value];
    }

    /** export this color into HSL format */
    public toHSL() {
        return [this.hue, this.saturation_L, this.lightness];
    }

    /** export this color into HSI format */
    public toHSI() {
        return [this.hue, this.saturation_I, this.intensity];
    }

    public override toString() : string {
        return `Color(r: ${this.red}, g: ${this.green}, b: ${this.blue})`;
    }

    /** the red component of this color in RGB format */
    public get red() : number {
        return this._r;
    }

    public set red(r: number) {
        this._r = Math.min(Math.max(r, 0), 1);
    }

    /** the green component of this color in RGB format */
    public get green() : number {
        return this._g;
    }

    public set green(g: number) {
        this._g = Math.min(Math.max(g, 0), 1);
    }

    /** the blue component of this color in RGB format */
    public get blue() : number {
        return this._b;
    }

    public set blue(b: number) {
        this._b = Math.min(Math.max(b, 0), 1);
    }

    /** the alpha channel of this color */
    public get alpha() : number {
        return this._a;
    }

    public set alpha(a: number) {
        this._a = Math.min(Math.max(a, 0), 1);
    }

    public get r_8b() : number { return Math.floor(this._r * 0xFF); }
    public get g_8b() : number { return Math.floor(this._g * 0xFF); }
    public get b_8b() : number { return Math.floor(this._b * 0xFF); }
    public get a_8b() : number { return Math.floor(this._a * 0xFF); }

    /** the chroma of this color */
    public get chroma() : number {
        return Math.max(this._r, this._g, this._b) - Math.min(this._r, this._g, this._b);
    }
    public set chroma(c: number) {
        if (c < 0) c = 0;
        let i = this.intensity;
        let oc = this.chroma;
        this._r = (this._r - i) * c / oc + i;
        this._g = (this._g - i) * c / oc + i;
        this._b = (this._b - i) * c / oc + i;
    }
    
    /** the hue of this color */
    public get hue() : number {
        if (this.chroma == 0) return 0;
        let hprime: number;
        switch (Math.max(this._r, this._g, this._b)) {
            case this._r:
                hprime = ((this._g - this._b) / this.chroma + 6) % 6;
                break;
            case this._g:
                hprime = (this._b - this._r) / this.chroma + 2;
                break;
            case this._b:
                hprime = (this._r - this._g) / this.chroma + 4;
                break;
            default:
                hprime = 0;
                break;
        }
        return hprime / 6;
    }
    public set hue(h: number) {
        let replacements = Color.fromHSV(h, this.saturation_V, this.value);
        this._r = replacements._r;
        this._g = replacements._g;
        this._b = replacements._b;
    }

    /** the brightness of this color in HSI format */
    public get intensity() : number {
        return avg(this._r, this._g, this._b);
    }
    public set intensity(i: number) {
        let replacements = Color.fromHSI(this.hue, this.saturation_I, i);
        this._r = replacements._r;
        this._g = replacements._g;
        this._b = replacements._b;
    }

    /** the brightness of this color in HSV format */
    public get value() : number {
        return Math.max(this._r, this._g, this._b);
    }
    public set value(v: number) {
        let replacements = Color.fromHSV(this.hue, this.saturation_V, v);
        this._r = replacements._r;
        this._g = replacements._g;
        this._b = replacements._b;
    }
    
    /** the brightness of this color in HSL format */
    public get lightness() : number {
        return mid(this._r, this._g, this._b);
    }
    public set lightness(l: number) {
        let replacements = Color.fromHSL(this.hue, this.saturation_L, l);
        this._r = replacements._r;
        this._g = replacements._g;
        this._b = replacements._b;
    }

    /** the saturation of this color in HSV format */
    public get saturation_V() : number {
        return this.value == 0 ? 0 : this.chroma / this.value;
    }
    public set saturation_V(s: number) {
        let replacements = Color.fromHSV(this.hue, s, this.value);
        this._r = replacements._r;
        this._g = replacements._g;
        this._b = replacements._b;
    }

    /** the saturation of this color in HSL format */
    public get saturation_L() : number {
        return this.lightness % 1 == 0 ? 0 : this.chroma / (1 - Math.abs(2 * this.lightness - 1));
    }
    public set saturation_L(s: number) {
        let replacements = Color.fromHSL(this.hue, s, this.lightness);
        this._r = replacements._r;
        this._g = replacements._g;
        this._b = replacements._b;
    }

    /** the saturation of this color in HSI format */
    public get saturation_I() : number {
        return this.intensity == 0 ? 0 : 1 - Math.min(this._r, this._g, this._b) / this.intensity;
    }
    public set saturation_I(s: number) {
        let replacements = Color.fromHSI(this.hue, s, this.intensity);
        this._r = replacements._r;
        this._g = replacements._g;
        this._b = replacements._b;
    }

    //#region defaults
    public static readonly ALICEBLUE = Color.fromHex("#F0F8FF");
    public static readonly ANTIQUEWHITE = Color.fromHex("#FAEBD7");
    public static readonly AQUA = Color.fromHex("#00FFFF");
    public static readonly AQUAMARINE = Color.fromHex("#7FFFD4");
    public static readonly AZURE = Color.fromHex("#F0FFFF");
    public static readonly BEIGE = Color.fromHex("#F5F5DC");
    public static readonly BISQUE = Color.fromHex("#FFE4C4");
    public static readonly BLACK = Color.fromHex("#000000");
    public static readonly BLANCHEDALMOND = Color.fromHex("#FFEBCD");
    public static readonly BLUE = Color.fromHex("#0000FF");
    public static readonly BLUEVIOLET = Color.fromHex("#8A2BE2");
    public static readonly BROWN = Color.fromHex("#A52A2A");
    public static readonly BURLYWOOD = Color.fromHex("#DEB887");
    public static readonly CADETBLUE = Color.fromHex("#5F9EA0");
    public static readonly CHARTREUSE = Color.fromHex("#7FFF00");
    public static readonly CHOCOLATE = Color.fromHex("#D2691E");
    public static readonly CORAL = Color.fromHex("#FF7F50");
    public static readonly CORNFLOWERBLUE = Color.fromHex("#6495ED");
    public static readonly CORNSILK = Color.fromHex("#FFF8DC");
    public static readonly CRIMSON = Color.fromHex("#DC143C");
    public static readonly CYAN = Color.fromHex("#00FFFF");
    public static readonly DARKBLUE = Color.fromHex("#00008B");
    public static readonly DARKCYAN = Color.fromHex("#008B8B");
    public static readonly DARKGOLDENROD = Color.fromHex("#B8860B");
    public static readonly DARKGRAY = Color.fromHex("#A9A9A9");
    public static readonly DARKGREY = Color.fromHex("#A9A9A9");
    public static readonly DARKGREEN = Color.fromHex("#006400");
    public static readonly DARKKHAKI = Color.fromHex("#BDB76B");
    public static readonly DARKMAGENTA = Color.fromHex("#8B008B");
    public static readonly DARKOLIVEGREEN = Color.fromHex("#556B2F");
    public static readonly DARKORANGE = Color.fromHex("#FF8C00");
    public static readonly DARKORCHID = Color.fromHex("#9932CC");
    public static readonly DARKRED = Color.fromHex("#8B0000");
    public static readonly DARKSALMON = Color.fromHex("#E9967A");
    public static readonly DARKSEAGREEN = Color.fromHex("#8FBC8F");
    public static readonly DARKSLATEBLUE = Color.fromHex("#483D8B");
    public static readonly DARKSLATEGRAY = Color.fromHex("#2F4F4F");
    public static readonly DARKSLATEGREY = Color.fromHex("#2F4F4F");
    public static readonly DARKTURQUOISE = Color.fromHex("#00CED1");
    public static readonly DARKVIOLET = Color.fromHex("#9400D3");
    public static readonly DEEPPINK = Color.fromHex("#FF1493");
    public static readonly DEEPSKYBLUE = Color.fromHex("#00BFFF");
    public static readonly DIMGRAY = Color.fromHex("#696969");
    public static readonly DIMGREY = Color.fromHex("#696969");
    public static readonly DODGERBLUE = Color.fromHex("#1E90FF");
    public static readonly FIREBRICK = Color.fromHex("#B22222");
    public static readonly FLORALWHITE = Color.fromHex("#FFFAF0");
    public static readonly FORESTGREEN = Color.fromHex("#228B22");
    public static readonly FUCHSIA = Color.fromHex("#FF00FF");
    public static readonly GAINSBORO = Color.fromHex("#DCDCDC");
    public static readonly GHOSTWHITE = Color.fromHex("#F8F8FF");
    public static readonly GOLD = Color.fromHex("#FFD700");
    public static readonly GOLDENROD = Color.fromHex("#DAA520");
    public static readonly GRAY = Color.fromHex("#808080");
    public static readonly GREY = Color.fromHex("#808080");
    public static readonly GREEN = Color.fromHex("#008000");
    public static readonly GREENYELLOW = Color.fromHex("#ADFF2F");
    public static readonly HONEYDEW = Color.fromHex("#F0FFF0");
    public static readonly HOTPINK = Color.fromHex("#FF69B4");
    public static readonly INDIANRED = Color.fromHex("#CD5C5C");
    public static readonly INDIGO = Color.fromHex("#4B0082");
    public static readonly IVORY = Color.fromHex("#FFFFF0");
    public static readonly KHAKI = Color.fromHex("#F0E68C");
    public static readonly LAVENDER = Color.fromHex("#E6E6FA");
    public static readonly LAVENDERBLUSH = Color.fromHex("#FFF0F5");
    public static readonly LAWNGREEN = Color.fromHex("#7CFC00");
    public static readonly LEMONCHIFFON = Color.fromHex("#FFFACD");
    public static readonly LIGHTBLUE = Color.fromHex("#ADD8E6");
    public static readonly LIGHTCORAL = Color.fromHex("#F08080");
    public static readonly LIGHTCYAN = Color.fromHex("#E0FFFF");
    public static readonly LIGHTGOLDENRODYELLOW = Color.fromHex("#FAFAD2");
    public static readonly LIGHTGRAY = Color.fromHex("#D3D3D3");
    public static readonly LIGHTGREY = Color.fromHex("#D3D3D3");
    public static readonly LIGHTGREEN = Color.fromHex("#90EE90");
    public static readonly LIGHTPINK = Color.fromHex("#FFB6C1");
    public static readonly LIGHTSALMON = Color.fromHex("#FFA07A");
    public static readonly LIGHTSEAGREEN = Color.fromHex("#20B2AA");
    public static readonly LIGHTSKYBLUE = Color.fromHex("#87CEFA");
    public static readonly LIGHTSLATEGRAY = Color.fromHex("#778899");
    public static readonly LIGHTSLATEGREY = Color.fromHex("#778899");
    public static readonly LIGHTSTEELBLUE = Color.fromHex("#B0C4DE");
    public static readonly LIGHTYELLOW = Color.fromHex("#FFFFE0");
    public static readonly LIME = Color.fromHex("#00FF00");
    public static readonly LIMEGREEN = Color.fromHex("#32CD32");
    public static readonly LINEN = Color.fromHex("#FAF0E6");
    public static readonly MAGENTA = Color.fromHex("#FF00FF");
    public static readonly MAROON = Color.fromHex("#800000");
    public static readonly MEDIUMAQUAMARINE = Color.fromHex("#66CDAA");
    public static readonly MEDIUMBLUE = Color.fromHex("#0000CD");
    public static readonly MEDIUMORCHID = Color.fromHex("#BA55D3");
    public static readonly MEDIUMPURPLE = Color.fromHex("#9370DB");
    public static readonly MEDIUMSEAGREEN = Color.fromHex("#3CB371");
    public static readonly MEDIUMSLATEBLUE = Color.fromHex("#7B68EE");
    public static readonly MEDIUMSPRINGGREEN = Color.fromHex("#00FA9A");
    public static readonly MEDIUMTURQUOISE = Color.fromHex("#48D1CC");
    public static readonly MEDIUMVIOLETRED = Color.fromHex("#C71585");
    public static readonly MIDNIGHTBLUE = Color.fromHex("#191970");
    public static readonly MINTCREAM = Color.fromHex("#F5FFFA");
    public static readonly MISTYROSE = Color.fromHex("#FFE4E1");
    public static readonly MOCCASIN = Color.fromHex("#FFE4B5");
    public static readonly NAVAJOWHITE = Color.fromHex("#FFDEAD");
    public static readonly NAVY = Color.fromHex("#000080");
    public static readonly OLDLACE = Color.fromHex("#FDF5E6");
    public static readonly OLIVE = Color.fromHex("#808000");
    public static readonly OLIVEDRAB = Color.fromHex("#6B8E23");
    public static readonly ORANGE = Color.fromHex("#FFA500");
    public static readonly ORANGERED = Color.fromHex("#FF4500");
    public static readonly ORCHID = Color.fromHex("#DA70D6");
    public static readonly PALEGOLDENROD = Color.fromHex("#EEE8AA");
    public static readonly PALEGREEN = Color.fromHex("#98FB98");
    public static readonly PALETURQUOISE = Color.fromHex("#AFEEEE");
    public static readonly PALEVIOLETRED = Color.fromHex("#DB7093");
    public static readonly PAPAYAWHIP = Color.fromHex("#FFEFD5");
    public static readonly PEACHPUFF = Color.fromHex("#FFDAB9");
    public static readonly PERU = Color.fromHex("#CD853F");
    public static readonly PINK = Color.fromHex("#FFC0CB");
    public static readonly PLUM = Color.fromHex("#DDA0DD");
    public static readonly POWDERBLUE = Color.fromHex("#B0E0E6");
    public static readonly PURPLE = Color.fromHex("#800080");
    public static readonly REBECCAPURPLE = Color.fromHex("#663399");
    public static readonly RED = Color.fromHex("#FF0000");
    public static readonly ROSYBROWN = Color.fromHex("#BC8F8F");
    public static readonly ROYALBLUE = Color.fromHex("#4169E1");
    public static readonly SADDLEBROWN = Color.fromHex("#8B4513");
    public static readonly SALMON = Color.fromHex("#FA8072");
    public static readonly SANDYBROWN = Color.fromHex("#F4A460");
    public static readonly SEAGREEN = Color.fromHex("#2E8B57");
    public static readonly SEASHELL = Color.fromHex("#FFF5EE");
    public static readonly SIENNA = Color.fromHex("#A0522D");
    public static readonly SILVER = Color.fromHex("#C0C0C0");
    public static readonly SKYBLUE = Color.fromHex("#87CEEB");
    public static readonly SLATEBLUE = Color.fromHex("#6A5ACD");
    public static readonly SLATEGRAY = Color.fromHex("#708090");
    public static readonly SLATEGREY = Color.fromHex("#708090");
    public static readonly SNOW = Color.fromHex("#FFFAFA");
    public static readonly SPRINGGREEN = Color.fromHex("#00FF7F");
    public static readonly STEELBLUE = Color.fromHex("#4682B4");
    public static readonly TAN = Color.fromHex("#D2B48C");
    public static readonly TEAL = Color.fromHex("#008080");
    public static readonly THISTLE = Color.fromHex("#D8BFD8");
    //#endregion

    /** create a color from a corresponding hex value */
    public static fromHex(hex: string) {

        // remove any leading formatting characters
        hex = hex.replace("#", "").replace("0x", "");
    
        const colorValue = Number.parseInt(hex, 16);
    
        let r: number;
        let g: number;
        let b: number;
    
        switch (hex.length) {
    
            // 8-bit color
            case 2:
                r = (colorValue & 0b1110_0000) / 0b1110_0000;
                g = (colorValue & 0b0001_1100) / 0b0001_1100;
                b = (colorValue & 0b0000_0011) / 0b0000_0011;
                break;
    
            // 12-bit color
            case 3:
                r = (colorValue & 0xF00) / 0xF00;
                g = (colorValue & 0x0F0) / 0x0F0;
                b = (colorValue & 0x00F) / 0x00F;
                break;
    
            // 16-bit color
            case 4:
                r = (colorValue & 0xF800) / 0xF800;
                g = (colorValue & 0x07E0) / 0x07E0;
                b = (colorValue & 0x001F) / 0x001F;
                break;
    
            // 24-bit color
            case 6:
                r = (colorValue & 0xFF_00_00) / 0xFF_00_00;
                g = (colorValue & 0x00_FF_00) / 0x00_FF_00;
                b = (colorValue & 0x00_00_FF) / 0x00_00_FF;
                break;
            
            // 36-bit color
            case 9:
                r = (colorValue & 0xFFF_000_000) / 0xFFF_000_000;
                g = (colorValue & 0x000_FFF_000) / 0x000_FFF_000;
                b = (colorValue & 0x000_000_FFF) / 0x000_000_FFF;
                break;
            
            // 48-bit color
            case 12:
                r = (colorValue & 0xFFFF_0000_0000) / 0xFFFF_0000_0000;
                g = (colorValue & 0x0000_FFFF_0000) / 0x0000_FFFF_0000;
                b = (colorValue & 0x0000_0000_FFFF) / 0x0000_0000_FFFF;
                break;
    
            default:
                throw new Error("Invalid color format");
        }
    
        return new Color(r, g, b);
    }

    /** create a color from HSV format */
    public static fromHSV(hue: number, saturation: number, value: number, alpha = 1) : Color {

        const chroma = value * saturation;
        const scaledHue = hue * 6;
    
        // integer to isolate the 6 separate cases for hue
        const hueRegion = Math.floor(scaledHue);
    
        // intermediate value for second largest component
        const X = chroma * (1 - Math.abs(scaledHue % 2 - 1));
    
        // constant to add to all colour components
        const m = value - chroma;
    
        return Color.fromCXM(hueRegion, chroma, X, m, alpha);
    }

    /** create a color from HSL format */
    public static fromHSL(hue: number, saturation: number, lightness: number, alpha = 1) : Color {

        const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
        const scaledHue = hue * 6;
    
        // integer to isolate the 6 separate cases for hue
        const hueRegion = Math.floor(scaledHue);
    
        // intermediate value for second largest component
        const X = chroma * (1 - Math.abs(scaledHue % 2 - 1));
    
        // constant to add to all colour components
        const m = lightness - chroma * 0.5;
    
        return Color.fromCXM(hueRegion, chroma, X, m, alpha);
    }

    /** create a color from HSI format */
    public static fromHSI(hue: number, saturation: number, intensity: number, alpha = 1) : Color {

        const scaledHue = hue * 6;
    
        // integer to isolate the 6 separate cases for hue
        const hueRegion = Math.floor(scaledHue);
    
        const Z = 1 - Math.abs(scaledHue % 2 - 1);
    
        const chroma = 3 * intensity * saturation / (1 + Z);
    
        // intermediate value for second largest component
        const X = chroma * Z;
    
        // constant to add to all colour components
        const m = intensity * (1 - saturation);
    
        return Color.fromCXM(hueRegion, chroma, X, m, alpha);
    }

    private static fromCXM(hueRegion: number, chroma: number, X: number, m: number, alpha: number) {

        switch (hueRegion) {
            case 0: // red to yellow
                return new Color(chroma + m, X + m, m, alpha);
            case 1: // yellow to green
                return new Color(X + m, chroma + m, m, alpha);
            case 2: // green to cyan
                return new Color(m, chroma + m, X + m, alpha);
            case 3: // cyan to blue
                return new Color(m, X + m, chroma + m, alpha);
            case 4: // blue to magenta
                return new Color(X + m, m, chroma + m, alpha);
            case 5: // magenta to red
                return new Color(chroma + m, m, X + m, alpha);
            default:
                return Color.BLACK;
        }
    }
}

/** the available color spaces supported by the library */
export enum ColorSpace {
    RGB,
    HSV,
    HSL,
    HSI,
}