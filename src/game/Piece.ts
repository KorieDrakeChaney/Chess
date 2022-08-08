import { Sprite, Texture, InteractionEvent, Point,  Container, SCALE_MODES} from "pixi.js";
import { BoardSettings, coordsToPos, PieceVariables } from "./Utils";

const SCALE = 600;
const WIDTH = 8 * SCALE, 
      HEIGHT = 8 * SCALE;

const CELLSIZE = (WIDTH / 16);



export class Piece extends Sprite {
    public coords : number = 0;

    private isClicked : boolean = false;
    private clickTime : number = 0;
    private dragging : boolean = false;

    public type : "queen" | "rook" | "pawn" | "king" | "knight" | "bishop";
    public color : "white" | "black"

    public isValidMove : boolean = false;
    public validMoves : Array<number>;

    static ID : number = 0;

    public id : number = 0;

    public hasMoved : boolean = false; // for kings pawns and rooks

    public value : number = 0;
    public removed : boolean = false;

    constructor(piece : PieceVariables, view : Container) {
        let color = piece.color == "black" ? "b" : "w";
        let name = color +  piece.type.charAt(0).toUpperCase() + piece.type.slice(1);
        super(Texture.from(`${piece.mode}/${name}` + ".png", {
            resolution : 2,
            scaleMode : SCALE_MODES.NEAREST
        }));
        Piece.ID += 1;

        this.id = Piece.ID;
        this.type = piece.type;

        if(this.type == "pawn"){
            this.value = 100;
        }
        else if(this.type =="knight"){
            this.value = 320
        }
        else if(this.type == "bishop"){
            this.value = 325
        }
        else if(this.type == "rook"){
            this.value = 500
        }
        else if(this.type == "queen"){
            this.value = 975
        }
        else if(this.type == "king"){
            this.value = 9999
        }
        
        this.color = piece.color;
        
        this.coords = piece.coords;
        
        let gridCoords = coordsToPos(this.coords);
        this.position.x =  gridCoords.x * CELLSIZE;
        this.position.y =  gridCoords.y * CELLSIZE;
        this.width = CELLSIZE;
        this.height = CELLSIZE;


        this.interactive = true;
        this.buttonMode = true;

        this
            .on('pointerdown', this.onDragStart.bind(this))
            .on('pointerup', this.onDragEnd.bind(this))
            .on('pointerupoutside', this.onDragEnd.bind(this))
            .on('pointermove', this.onDragMove.bind(this))
            .on('pointerover', this.hover.bind(this))
            .on('pointerout', this.pointerOut.bind(this))
        view.addChild(this);
    }


    onDragStart(event : InteractionEvent){
        if(BoardSettings.chessPieceColor != this.color) return;
        if(event.data.button == 0){
            if(!this.isClicked){
                this.clickTime = Date.now();
            }
    
            this.dragging = true;
        }
    }

    onDragEnd(event : InteractionEvent){
        if(event.data.button == 0){
        let time = Date.now();
        let pos = new Point(event.data.global.x - CELLSIZE, event.data.global.y - CELLSIZE);
        
        let potentialCoord = Math.ceil(pos.x / CELLSIZE) + (Math.ceil(pos.y / CELLSIZE) * 8);

        window.postMessage({
            type : 'checkMove', 
            data : { 
                id : this.id, 
                coords : potentialCoord
            }
        }, '*');

        // double click
        this.isClicked = true;
        if(this.isClicked) {
            if(time - this.clickTime < 250){
            }
            this.clickTime = time;
            this.isClicked = false;
        }
        this.dragging = false
        }
    }

    movePiece(coords : number){
        if(this.removed) return;
        if(!this.hasMoved) this.hasMoved = true;
        this.coords = coords;
        let gridCoords = coordsToPos(this.coords);
        this.position.x =  gridCoords.x * CELLSIZE;
        this.position.y =  gridCoords.y * CELLSIZE;
    }

    hover(){

    }

    onDragMove(event : InteractionEvent){
        if(this.dragging){

            this.position.x =  event.data.global.x - (CELLSIZE / 2);
            this.position.y =  event.data.global.y - (CELLSIZE / 2)
        }
    }

    pointerOut(){

    }

 

}