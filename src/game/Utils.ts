
import { Geometry, Mesh, Point, Shader } from "pixi.js";

const SCALE = 600;
const WIDTH = 8 * SCALE, 
      HEIGHT = 8 * SCALE;

interface ShaderUtils { 
    scale : number
    alpha : number
    color : { 
        bgColor : string, 
        fgColor : string
    }

}

export class BoardSettings { 
    static blackCheck : boolean = false;
    static blackMate : boolean = false;
    static whiteCheck : boolean = false;
    static whiteMate : boolean = false;
    static staleMate : boolean = false;
    static blackCastled : boolean = false;
    static whiteCastle : boolean = false;
    static endGamePhase : boolean = false;
    static enPassantColor : "white" | "black" = "white"
    static enPassantPosition : number = 0;
    static moveCount : number = 0;
    static chessPieceColor : "white" | "black" = "white"

}

function GraphShader(data : ShaderUtils):Shader{
    return Shader.from(
        `
        #version 300 es

        in vec2 aVertexPosition;
        in vec2 aTextureCoord;
        
        uniform mat3 translationMatrix;
        uniform mat3 projectionMatrix;

        out vec2 vTextureCoord;
        out vec4 vPosition;
        void main(void)
        {
            vPosition = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
            vec4 pos = vec4(vPosition.xyz/vPosition.w, 1.);
            pos.w = 1./vPosition.w;
            gl_Position = pos;
            vTextureCoord = aTextureCoord;
        }
        
        
        `, 
        `
        #version 300 es
        precision mediump float;
        vec2 pitch  = vec2(${SCALE / 2}. - .125, ${SCALE / 2}. - .125);
        
        out vec4 color;

        void main() {    
            int rIntValue;
            int gIntValue;
            int bIntValue;
            if (mod(gl_FragCoord.x, pitch[0]) < 1. ||
                mod(gl_FragCoord.y, pitch[1]) < 1.) {
                    color = vec4(0.125, .25, .0, 0.125);
            } else {
                if(mod((8. * floor(gl_FragCoord.x / pitch[0])) + (8. * floor(gl_FragCoord.y / pitch[1])), 16.) < 1.) { 
                    rIntValue = (${data.color.bgColor} / 256 / 256) % 256;
                    gIntValue = (${data.color.bgColor} / 256      ) % 256;
                    bIntValue = (${data.color.bgColor}            ) % 256;
                }
                else { 
                    rIntValue = (${data.color.fgColor} / 256 / 256) % 256;
                    gIntValue = (${data.color.fgColor} / 256      ) % 256;
                    bIntValue = (${data.color.fgColor}            ) % 256;
                }
                vec3 c =  vec3(float(rIntValue) / 255.0f, float(gIntValue) / 255.0f, float(bIntValue) / 255.0f);
                color.rgb =  c.rgb;
                color.a = float(${data.alpha});
            }
        }
        `);
}




export const CreateBoard = (mode : string) => {

    let geometry = new Geometry()
    .addAttribute('aVertexPosition', 
        [
            -WIDTH / 2, -HEIGHT / 2,
            WIDTH / 2, -HEIGHT / 2,
            WIDTH / 2, HEIGHT / 2,
            -WIDTH / 2, HEIGHT / 2,
            -WIDTH / 2, -HEIGHT / 2,
            WIDTH / 2, HEIGHT / 2, 
        ]
    )
    .addAttribute('aTextureCoord', 
        [
            0, 0, 
            1, 0, 
            1, 1, 
            0, 1, 
            0, 0,
            1, 1
        ]
    )

    let shader = GraphShader({
        scale : SCALE,
        alpha : 1.0, 
        color : ModeColors[mode]
    })

    return new Mesh(geometry, shader)
}

export interface PieceVariables {
    type : "queen" | "rook" | "pawn" | "king" | "knight" | "bishop";
    color : "black" | "white"
    mode : "classic" | "custom"
    coords : number
}


export const ModeColors = { 
    "classic" : {
        bgColor : "0x5e8053", 
        fgColor : "0xdfedda"
    }, 
    "custom" : {
        bgColor : "0xb3fcd1", 
        fgColor : "0x454657", 
    }
}

// column = int % 8
// row floor(int / 8)

export const BoardPositions = {
    0 : "A8", 
    1 : "B8", 
    2 : "C8", 
    3 : "D8", 
    4 : "E8", 
    5 : "F8", 
    6 : "G8", 
    7 : "H8",
    8 : "A7", 
    9 : "B7", 
    10 : "C7", 
    11 : "D7", 
    12 : "E7", 
    13: "F7", 
    14 : "G7", 
    15 : "H7",
    16 : "A6", 
    17 : "B6", 
    18 : "C6", 
    19: "D6", 
    20 : "E6", 
    21 : "F6", 
    22 : "G6", 
    23 : "H6",
    24: "A5", 
    25 : "B5", 
    26 : "C5", 
    27 : "D5", 
    28 : "E5", 
    29: "F5", 
    30 : "G5", 
    31 : "H5",
    32 : "A4", 
    33 : "B4", 
    34: "C4", 
    35 : "D4", 
    36 : "E4", 
    37 : "F4", 
    38 : "G4", 
    39 : "H4",
    40 : "A3", 
    41 : "B3", 
    42 : "C3", 
    43 : "D3", 
    44 : "E3", 
    45 : "F3", 
    46 : "G3", 
    47 : "H3",
    48 : "A2", 
    49 : "B2", 
    50 : "C2", 
    51 : "D2", 
    52 : "E2", 
    53 : "F2", 
    54 : "G2", 
    55 : "H2",
    56 : "A1", 
    57 : "B1", 
    58 : "C1", 
    59 : "D1", 
    60 : "E1", 
    61 : "F1", 
    62 : "G1", 
    63 : "H1"
}


export class PieceMoveSet {
    public moves : Array<number>;

    constructor(moves : Array<number>){
        this.moves = moves;
    }
}


export function coordsToPos(coords : number) : Point { 
    let col = coords % 8;
    let row = Math.floor(coords / 8)

    return new Point(col, row);

}


export const pieceTypeValue = { 

}