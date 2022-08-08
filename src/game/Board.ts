import {Application, Container, ENV, Point, settings, utils, Text} from "pixi.js"
import {Piece} from "./Piece"
import {BoardPositions, BoardSettings, coordsToPos, CreateBoard, PieceMoveSet} from "./Utils";
const startFEN : string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"



class PieceValidMoves { 
    static BlackAttackBoard : Array<boolean>;
    static WhiteAttackBoard : Array<boolean>;

    static BlackKingPosition : number;
    static WhiteKingPosition : number;

}

let pieceToClear = 999;

class MoveArrays {

    static BishopMoves1 : Array<PieceMoveSet> = Array<PieceMoveSet>(64);
    static BishopTotalMoves1 : Array<number> = Array<number>(64); 
    static BishopMoves2 : Array<PieceMoveSet> = Array<PieceMoveSet>(64);
    static BishopTotalMoves2 : Array<number> = Array<number>(64);;
    static BishopMoves3 : Array<PieceMoveSet> = Array<PieceMoveSet>(64);
    static BishopTotalMoves3 : Array<number> = Array<number>(64);;
    static BishopMoves4 : Array<PieceMoveSet> = Array<PieceMoveSet>(64);
    static BishopTotalMoves4 : Array<number> = Array<number>(64);;

    static WhitePawnMoves : Array<PieceMoveSet> = Array<PieceMoveSet>(64);
    static WhitePawnTotalMoves: Array<number> = Array<number>(64);;

    static BlackPawnMoves : Array<PieceMoveSet> = Array<PieceMoveSet>(64);
    static BlackPawnTotalMoves: Array<number> = Array<number>(64);;

    static KnightMoves : Array<PieceMoveSet> = Array<PieceMoveSet>(64);
    static KnightTotalMoves: Array<number> = Array<number>(64);;
    static QueenMoves1 : Array<PieceMoveSet> = Array<PieceMoveSet>(64);
    static QueenTotalMoves1: Array<number> = Array<number>(64);;
    static QueenMoves2 : Array<PieceMoveSet> = Array<PieceMoveSet>(64);
    static QueenTotalMoves2: Array<number> = Array<number>(64);;
    static QueenMoves3 : Array<PieceMoveSet> = Array<PieceMoveSet>(64);
    static QueenTotalMoves3: Array<number> = Array<number>(64);;
    static QueenMoves4 : Array<PieceMoveSet> = Array<PieceMoveSet>(64);
    static QueenTotalMoves4: Array<number> = Array<number>(64);;
    static QueenMoves5 : Array<PieceMoveSet> = Array<PieceMoveSet>(64);
    static QueenTotalMoves5: Array<number> = Array<number>(64);;
    static QueenMoves6 : Array<PieceMoveSet> = Array<PieceMoveSet>(64);
    static QueenTotalMoves6: Array<number> = Array<number>(64);;
    static QueenMoves7 : Array<PieceMoveSet> = Array<PieceMoveSet>(64);
    static QueenTotalMoves7: Array<number> = Array<number>(64);;
    static QueenMoves8 : Array<PieceMoveSet> = Array<PieceMoveSet>(64);
    static QueenTotalMoves8: Array<number> = Array<number>(64);;
    static RookMoves1 : Array<PieceMoveSet> = Array<PieceMoveSet>(64);
    static RookTotalMoves1: Array<number> = Array<number>(64);;
    static RookMoves2 : Array<PieceMoveSet> = Array<PieceMoveSet>(64);
    static RookTotalMoves2: Array<number> = Array<number>(64);;
    static RookMoves3 : Array<PieceMoveSet> = Array<PieceMoveSet>(64);
    static RookTotalMoves3: Array<number> = Array<number>(64);;
    static RookMoves4 : Array<PieceMoveSet> = Array<PieceMoveSet>(64);
    static RookTotalMoves4: Array<number> = Array<number>(64);;
    static KingMoves : Array<PieceMoveSet> = Array<PieceMoveSet>(64);
    static KingTotalMoves: Array<number> = Array<number>(64);;

    private constructor(){
        
    }
}



export default class Board {
    static App : Application ;
    public Mode : any = "classic"



    

    private pieces : Array<Piece> = [];
    private board : Float32Array = new Float32Array(64);

    /*
    private board : Array<number> = [
        0, 0, 0, 0, 0, 0, 0, 0, // A8 -> H8
        0, 0, 0, 0, 0, 0, 0, 0, // A7 -> H7
        0, 0, 0, 0, 0, 0, 0, 0, // A6 -> H6
        0, 0, 0, 0, 0, 0, 0, 0, // A6 -> H6
        0, 0, 0, 0, 0, 0, 0, 0, // A5 -> H5
        0, 0, 0, 0, 0, 0, 0, 0, // A4 -> H4
        0, 0, 0, 0, 0, 0, 0, 0, // A3 -> H3
        0, 0, 0, 0, 0, 0, 0, 0, // A2 -> H2
        0, 0, 0, 0, 0, 0, 0, 0, // A1 -> H1
    ]
    */

    private container : Container = new Container();

    constructor(view : HTMLCanvasElement){
        settings.PREFER_ENV = ENV.WEBGL2 
        utils.skipHello();
        Board.App = new Application({
            view : view, 
            width : view.width * 8, 
            height : view.width * 8,
            resolution : 1, 
            antialias : true
            
        })
        Board.App.stage.addChild(CreateBoard(this.Mode));

        window.onmessage = function({data : {data, type}}){
            if(type == "checkMove"){
                this.checkMove(data)
            }
        }.bind(this)

        this.loadPositionFromFen(startFEN);
        Board.App.stage.addChild(this.container);


        for(let i = 0; i < 64 ; i++){
            // let text = new Text(BoardPositions[i], {fontFamily: 'Arial', fontSize : '28px', fill : 'black', fontStyle : 'italic', fontWeight : 'bold'})
            let text = new Text(i.toString(), {fontFamily: 'Arial', fontSize : '28px', fill : 'black', fontStyle : 'italic', fontWeight : 'bold'})
            let pos = coordsToPos(i);
            text.x = pos.x * 300 + 255;
            text.y = pos.y * 300 + 255;
            Board.App.stage.addChild(text);
        }

        this.setMovesBlackPawn()
        this.setMovesWhitePawn()
        
        this.setMovesKing()
        this.setMovesQueen()
        this.setMovesKnight()
        this.setMovesBishop()
        this.setMovesRook()

        this.generateValidMoves();
        let wasmSupported = typeof WebAssembly === 'object' && WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));

        let stockfish = new Worker(wasmSupported ? './stockfish/stockfish.wasm.js' : './stockfish/stockfish.js');
        stockfish.postMessage("uci");
        stockfish.postMessage('go depth 15');
        stockfish.postMessage("isready");
        stockfish.postMessage("position");

        stockfish.onmessage = (e) => {
            let info = e.data ? e.data : e;
            if (String(info).includes('bestmove') || String(info).includes('ponder')) {
                const bestmove = info.split(/ +/)[1];
                const ponder = info.split(/ +/)[3];
                stockfish.postMessage(`position fen ${startFEN}`); 
            }
        };
 
    }

    generateValidMoves(){
        BoardSettings.blackCheck = false;
        BoardSettings.whiteCheck = false;

        PieceValidMoves.WhiteAttackBoard = Array<boolean>(64);
        PieceValidMoves.BlackAttackBoard = Array<boolean>(64);


        for(let x = 0; x < 64; x++){
            if(this.board[x] != 0){
                let piece = this.pieces[this.findPiece(this.board[x])];
                
                piece.validMoves = [];

                switch(piece.type){
                    case "pawn":
                        if(x > 55 || x < 8) {
                            this.promotePawn(piece, "queen");
                            break;
                        }
                        if(piece.color == "white"){
                            this.checkValidPawnMoves(MoveArrays.WhitePawnMoves[x].moves, piece, x, MoveArrays.WhitePawnTotalMoves[x]);
                        }else if(piece.color == "black"){ 
                            this.checkValidPawnMoves(MoveArrays.BlackPawnMoves[x].moves, piece, x, MoveArrays.BlackPawnTotalMoves[x]);
                        }
                        break;
                    case "knight":
                        for(let i =0; i < MoveArrays.KnightTotalMoves[x]; i++){
                            this.analyzeMove(MoveArrays.KnightMoves[x].moves[i], piece);
                        }
                        break;
                    case "bishop":
                        for(let i = 0; i < MoveArrays.BishopTotalMoves1[x]; i++){
                            if(this.analyzeMove(MoveArrays.BishopMoves1[x].moves[i], piece) == false){
                                break;
                            }
                        }
                        for(let i =0; i < MoveArrays.BishopTotalMoves2[x]; i++){
                            if(this.analyzeMove(MoveArrays.BishopMoves2[x].moves[i], piece) == false){
                                break;
                            }
                        }
                        for(let i =0; i < MoveArrays.BishopTotalMoves3[x]; i++){
                            if(this.analyzeMove(MoveArrays.BishopMoves3[x].moves[i], piece) == false){
                                break;
                            }
                        }
                        for(let i =0; i < MoveArrays.BishopTotalMoves4[x]; i++){
                            if(this.analyzeMove(MoveArrays.BishopMoves4[x].moves[i], piece) == false){
                                break;
                            }
                        }
                        break;
                    case "rook":
                        for(let i =0; i < MoveArrays.RookTotalMoves1[x]; i++){
                            if(this.analyzeMove(MoveArrays.RookMoves1[x].moves[i], piece) == false){
                                break;
                            }
                        }
                        for(let i =0; i < MoveArrays.RookTotalMoves2[x]; i++){
                            if(this.analyzeMove(MoveArrays.RookMoves2[x].moves[i], piece) == false){
                                break;
                            }
                        }
                        for(let i =0; i < MoveArrays.RookTotalMoves3[x]; i++){
                            if(this.analyzeMove(MoveArrays.RookMoves3[x].moves[i], piece) == false){
                                break;
                            }
                        }
                        for(let i =0; i < MoveArrays.RookTotalMoves4[x]; i++){
                            if(this.analyzeMove(MoveArrays.RookMoves4[x].moves[i], piece) == false){
                                break;
                            }
                        }
                        break;
                    case "queen":
                        for(let i =0; i < MoveArrays.QueenTotalMoves1[x]; i++){
                            if(this.analyzeMove(MoveArrays.QueenMoves1[x].moves[i], piece) == false){
                                break;
                            }
                        }
                        for(let i =0; i < MoveArrays.QueenTotalMoves2[x]; i++){
                            if(this.analyzeMove(MoveArrays.QueenMoves2[x].moves[i], piece) == false){
                                break;
                            }
                        }
                        for(let i =0; i < MoveArrays.QueenTotalMoves3[x]; i++){
                            if(this.analyzeMove(MoveArrays.QueenMoves3[x].moves[i], piece) == false){
                                break;
                            }
                        }
                        for(let i =0; i < MoveArrays.QueenTotalMoves4[x]; i++){
                            if(this.analyzeMove(MoveArrays.QueenMoves4[x].moves[i], piece) == false){
                                break;
                            }
                        }
                        for(let i =0; i < MoveArrays.QueenTotalMoves5[x]; i++){
                            if(this.analyzeMove(MoveArrays.QueenMoves5[x].moves[i], piece) == false){
                                break;
                            }
                        }
                        for(let i =0; i < MoveArrays.QueenTotalMoves6[x]; i++){
                            if(this.analyzeMove(MoveArrays.QueenMoves6[x].moves[i], piece) == false){
                                break;
                            }
                        }
                        for(let i =0; i < MoveArrays.QueenTotalMoves7[x]; i++){
                            if(this.analyzeMove(MoveArrays.QueenMoves7[x].moves[i], piece) == false){
                                break;
                            }
                        }
                        for(let i =0; i < MoveArrays.QueenTotalMoves8[x]; i++){
                            if(this.analyzeMove(MoveArrays.QueenMoves8[x].moves[i], piece) == false){
                                break;
                            }
                        }
                        break;
                    case "king":
                        if(piece.color == "white"){
                            PieceValidMoves.WhiteKingPosition = x;
                        }
                        else { 
                            PieceValidMoves.BlackKingPosition = x;
                        }
                        break;
                }
            }
        }
    }


    private checkValidKingMoves(){
        
    }

    private checkMove(data : { id : number, coords : number } ){
        let id = this.findPiece(data.id);
        if(id != -1){
            let color = this.pieces[id].color;
            let coords = data.coords;
            let count = 0;
            if(this.pieces[id].type == "king"){
                console.log(MoveArrays.KingMoves[this.pieces[id].coords])
            }
            if(color == BoardSettings.chessPieceColor){
                for(let i = 0; i < this.pieces[id].validMoves.length; i++){
                    if(coords == this.pieces[id].validMoves[i]){
                        this.board[this.pieces[id].coords] = 0;
                        if(this.board[coords] != 0) this.removePiece(this.board[coords] )
                        this.board[coords] = this.pieces[id].id;
                        this.pieces[id].movePiece(coords);
                        BoardSettings.chessPieceColor = BoardSettings.chessPieceColor == "white" ? "black" : "white";
                        BoardSettings.moveCount += BoardSettings.chessPieceColor == "black" ? 1 : 0;
                        count = 1;
                        this.generateValidMoves();
                        this.generateFenFromBoard();
                    }
                }
                if(count == 0){
                    this.pieces[id].movePiece(this.pieces[id].coords);
                }
            }
        }
    }   

    private generateFenFromBoard() :string {
        let string = "";

        for(let x = 0; x < 8; x++){
            let gap = 0;
            for(let y = 0; y < 8; y++){
                let index = (y + (x * 8))
                if(this.board[index] != 0){
                    if(gap != 0){
                        string += gap.toString();
                    }
                    let piece = this.pieces[this.findPiece(this.board[index])]
                    let type = piece.type;
                    let color = piece.color;
                    if(type == "pawn") string += color == "white" ? "P" : "p"
                    else if(type == "bishop") string += color == "white" ? "B" : "b"
                    else if(type == "knight") string += color == "white" ? "N" : "n"
                    else if(type == "queen") string += color == "white" ? "Q" : "q"
                    else if(type == "king") string += color == "white" ? "K" : "k"
                    else if(type == "rook") string += color == "white" ? "R" : "r"

                    gap = 0;
                }else { 
                    gap += 1;
                }
                
            }
            if(gap != 0){
                string += gap.toString();
            }
            if(x < 7) string += "/"
        }
        
        //turn
        string += BoardSettings.chessPieceColor == "white" ? " w" : " b"
        string += " "

        //available castles

        // en passant

        // 50 turn

        // turn

        return string
    };

    private loadPositionFromFen(fen : string){
        this.clearBoard();
        let reg = /^-?[\d.]+(?:e-?\d+)?$/;
        let values = fen.replaceAll("/", " ").split(' ');
        let coords = 0;
        for(let i = 0; i < values.length; i++){
            if(i < 8){
                for(let j = 0; j < values[i].length; j++){
                    let offset = 0;
                    if(reg.test(values[i][j])){
                        coords += Number(values[i][j])
                    }
                    else 
                    {
                        let type : any = values[i][j].toLowerCase();
             
                        if(type == "p") type = "pawn"
                        else if(type == "q") type = "queen"
                        else if(type == "k") type = "king"
                        else if(type == "b") type = "bishop"
                        else if(type == "n") type = "knight"
                        else if(type == "r") type = "rook"
                        else { 
                            type = "blank"
                        }
                        if(type != "blank"){
                                let color : "white" | "black" = values[i][j] == values[i][j].toUpperCase() ? "white" : "black";
                                
                                this.pieces.push(     
                                    new Piece({
                                        type : type, color : color, mode : this.Mode, coords : coords
                                    }, this.container));
                                this.board[coords] = this.pieces[this.pieces.length - 1].id;
                                coords += 1
                                
                        }
                    }
                }
            }else { 
                if(i == 8){
                    let value = values[i];
                    BoardSettings.chessPieceColor = value == "w" ? "white" : "black";
                }
                if(i == 9){
                    for(let j = 0; j < values[i].length; j++){
                        let color : "white" | "black" = values[i][j] == values[i][j].toUpperCase() ? "white" : "black";

                        if(values[i][j].toLowerCase() == "q"){
                        }
                        else if(values[i][j].toLowerCase() == "k") {
                        }
                    }
                }
                if(i == 10){
                    if(values[i].includes("-")){
                    }
                }
                if(i == 11){
                    let value = values[i];
                }
                if(i == 12){
                    let value = values[i];
                }
            }
        }
    }

    private findPiece(pieceID : number) : number{
       let id = this.pieces.findIndex((value) => value.id == pieceID);
       return id
    }

    private clearBoard(){
        this.container.removeChildren(0, this.container.children.length)
    }

    private promotePawn(piece : Piece,  type : "queen" | "rook" | "knight" | "bishop"){
        this.pieces.push(     
            new Piece({
                type : type, color : piece.color, mode : this.Mode, coords : piece.coords
            }, this.container));
        this.board[piece.coords] = this.pieces[this.pieces.length - 1].id;
        this.removePiece(piece.id);


    }

    private kingCastle(piece : Piece, pos : Point, dstPos : Point){
        return;
    }

    private analyzeMove(dstPos : number, pcMoving : Piece):boolean{
        if(pcMoving.color == BoardSettings.chessPieceColor){

        }
        else { 

        }

        if(this.board[dstPos] == 0){
            pcMoving.validMoves.push(dstPos);
            return true;
        }
        if(dstPos){
            let pcAttacked = this.pieces[this.findPiece(this.board[dstPos])];
            if(pcAttacked.color != pcMoving.color){
                if(pcAttacked.type == "king"){
                    if(pcAttacked.color == "black"){
                        BoardSettings.blackCheck = true;
                    }
                    else {
                        BoardSettings.whiteCheck = true;
                    }
                }
                else { 
                    pcMoving.validMoves.push(dstPos);
                }
    
            }
        }
        return false
    }

    private checkValidPawnMoves(moves : Array<number>, pcMoving : Piece, srcPos : number, count : number){
        for(let i = 0; i < count; i++){
            let dstPos = moves[i];
            if(this.board[dstPos] != 0){
                let pcAttacked = this.pieces[this.findPiece(this.board[dstPos])];
                if(pcAttacked.color != pcMoving.color){
                    let inc = pcMoving.color == "white" ? -1 : 1;
                        if(dstPos == (srcPos + 9 * inc) || (dstPos == srcPos + 7 * inc)){
                            pcMoving.validMoves.push(dstPos);
                        }
       
                }
            }
            else {
                let inc = pcMoving.color == "white" ? -1 : 1;
                if(dstPos != (srcPos + 9 * inc) && (dstPos != srcPos + 7 * inc)){
                    pcMoving.validMoves.push(dstPos);
                }
            }
        }
    }


    private removePiece(id : number){
        let index = this.findPiece(id);
        this.pieces[index].removed = true;
        this.pieces[index].destroy();
        Board.App.stage.removeChild(this.pieces[this.findPiece(id)]);
    }

    private setMovesWhitePawn(){
        for(let i = 8; i <= 55; i++){
            let x = i % 8;
            let y = Math.floor(i / 8);
            MoveArrays.WhitePawnTotalMoves[i] = 0;

            let moveset = new PieceMoveSet([]);

            if(x < 7 && y > 0){
                moveset.moves.push(i - 8 + 1);
                MoveArrays.WhitePawnTotalMoves[i]++;
            }
            if( x > 0 && y > 0 ){
                moveset.moves.push(i - 8 - 1);
                MoveArrays.WhitePawnTotalMoves[i]++
            }

            moveset.moves.push(i-8);
            MoveArrays.WhitePawnTotalMoves[i]++
            if(y==6){
                moveset.moves.push(i - 16);
                MoveArrays.WhitePawnTotalMoves[i]++
            }
            MoveArrays.WhitePawnMoves[i] = moveset
        }
    }

    private setMovesBlackPawn(){
        for(let i = 8; i <= 55; i++){
            let x = i % 8;
            let y = Math.floor(i / 8);
            MoveArrays.BlackPawnTotalMoves[i] = 0;
            let moveset = new PieceMoveSet([]);
            if(x < 7 && y < 7){
                moveset.moves.push(i + 8 + 1);
                MoveArrays.BlackPawnTotalMoves[i]++;
            }
            if( x > 0 && y < 7){
                moveset.moves.push(i + 8 - 1);
                MoveArrays.BlackPawnTotalMoves[i]++
            }
            
            moveset.moves.push(i+8);
            MoveArrays.BlackPawnTotalMoves[i]++
            if(y==1){
                moveset.moves.push(i + 16);
                MoveArrays.BlackPawnTotalMoves[i]++
            }
        
            MoveArrays.BlackPawnMoves[i] = moveset
        }
    }

    private setMovesQueen(){
        for(let y = 0; y < 8; y++){
            for(let x = 0; x < 8; x++){
                let index = (y + (x * 8))
                MoveArrays.QueenTotalMoves1[index] = 0;
                let moveset = new PieceMoveSet([]);
                let move : number;
                
                let row = x;
                let col = y;

                while(row < 7)
                {
                    row++
                    move = Position(col, row);
                    moveset.moves.push(move);
                    MoveArrays.QueenTotalMoves1[index]++;
                }
                MoveArrays.QueenMoves1[index] = moveset;
                MoveArrays.QueenTotalMoves2[index] = 0;
                moveset = new PieceMoveSet([]);
                row = x; 
                col = y;
                while(row > 0)
                {
                    row--;
                    move = Position(col, row);
                    moveset.moves.push(move);
                    MoveArrays.QueenTotalMoves2[index]++;
                }
                MoveArrays.QueenMoves2[index] = moveset;
                MoveArrays.QueenTotalMoves3[index] = 0;
                moveset = new PieceMoveSet([]);
                row = x; 
                col = y;
                while(col > 0){
                    col--
                    move = Position(col, row)
                    moveset.moves.push(move);
                    MoveArrays.QueenTotalMoves3[index]++;
                }
                MoveArrays.QueenMoves3[index] = moveset;
                MoveArrays.QueenTotalMoves4[index] = 0;
                moveset = new PieceMoveSet([]);
                row = x; 
                col = y;
                while(col < 7){
                    col ++;
                    move = Position(col, row);
                    moveset.moves.push(move);
                    MoveArrays.QueenTotalMoves4[index]++;
                }


                
                MoveArrays.QueenMoves4[index] = moveset;
                MoveArrays.QueenTotalMoves5[index] = 0;
                moveset = new PieceMoveSet([])
                row = x;
                col = y;

                 while(row < 7 && col < 7)
                {
                    row++;
                    col++;
                    move = Position(col, row);
                    moveset.moves.push(move);
                    MoveArrays.QueenTotalMoves5[index]++
                }
                MoveArrays.QueenMoves5[index] = moveset;
                MoveArrays.QueenTotalMoves6[index] = 0;
                moveset = new PieceMoveSet([])
                row = x;
                col = y;
                while(row < 7 && col > 0){
                    row++;
                    col--;
                    move = Position(col, row);
                    moveset.moves.push(move);
                    MoveArrays.QueenTotalMoves6[index]++
                }
                MoveArrays.QueenMoves6[index] = moveset;
                MoveArrays.QueenTotalMoves7[index] = 0;
                moveset = new PieceMoveSet([])
                row = x;
                col = y;
                while(row > 0 && col < 7){
                    row--;
                    col++;
                    move = Position(col, row);
                    moveset.moves.push(move);
                    MoveArrays.QueenTotalMoves7[index]++
                }
                MoveArrays.QueenMoves7[index] = moveset;
                MoveArrays.QueenTotalMoves8[index] = 0;
                moveset = new PieceMoveSet([])
                row = x;
                col = y;
                while(row > 0 && col > 0){
                    row--;
                    col--;
                    move = Position(col, row);
                    moveset.moves.push(move);
                    MoveArrays.QueenTotalMoves8[index]++
                }
                MoveArrays.QueenMoves8[index] = moveset;
            }
        }
    }

    private setMovesKing(){
        for(let y = 0; y < 8; y++){
            for(let x = 0; x < 8; x++){
                let index = (y + (x * 8))
                MoveArrays.KnightTotalMoves[index] = 0;
                let moveset = new PieceMoveSet([]);
                let move : number;

                let row = x;
                let col = y;


                if(row < 7){
                    row++;
                    move = Position(col, row);
                    moveset.moves.push(move);
                    MoveArrays.KingTotalMoves[index]++;
                }
                row = x;
                col = y;
                if(row > 0){
                    row --;
                    move = Position(col, row);
                    moveset.moves.push(move);
                    MoveArrays.KingTotalMoves[index]++;
                }
                row = x;
                col = y;
                if(col > 0){
                    col--;
                    move = Position(col, row);
                    moveset.moves.push(move);
                    MoveArrays.KingTotalMoves[index]++;
                }
                row = x;
                col = y;
                if(col < 7){
                    col ++;
                    move = Position(col, row);
                    moveset.moves.push(move);
                    MoveArrays.KingTotalMoves[index]++;
                }
                row = x;
                col = y;
                if(col < 7 && row < 7){
                    col ++;
                    row++
                    move = Position(col, row);
                    moveset.moves.push(move);
                    MoveArrays.KingTotalMoves[index]++;
                }
                row = x;
                col = y;
                if(col > 0 && row < 7){
                    col --
                    row ++
                    move = Position(col, row);
                    moveset.moves.push(move);
                    MoveArrays.KingTotalMoves[index]++;
                }
                row = x;
                col = y;
                if(col < 7 && row > 0){
                    col++;
                    row--;
                    move = Position(col, row);
                    moveset.moves.push(move);
                    MoveArrays.KingTotalMoves[index]++;
                }
                row = x;
                col = y;
                if(col > 0 && row > 0){
                    col--
                    row--;
                    move = Position(col, row);
                    moveset.moves.push(move);
                    MoveArrays.KingTotalMoves[index]++;
                }
                MoveArrays.KingMoves[index] = moveset;
            }
        }
    }

    private setMovesRook(){
        for(let y = 0; y < 8; y++){
            for(let x = 0; x < 8; x++){
                let index = (y + (x * 8))
                MoveArrays.RookTotalMoves1[index] = 0
                let moveset = new PieceMoveSet([]);
                let move : number;

                let row = x;
                let col = y;

                while(row < 7)
                {
                    row++
                    move = Position(col, row);
                    moveset.moves.push(move);
                    MoveArrays.RookTotalMoves1[index]++;
                }
                MoveArrays.RookMoves1[index] = moveset;
                MoveArrays.RookTotalMoves2[index] = 0
                moveset = new PieceMoveSet([]);
                row = x; 
                col = y;
                while(row > 0)
                {
                    row--;
                    move = Position(col, row);
                    moveset.moves.push(move);
                    MoveArrays.RookTotalMoves2[index]++;
                }
                MoveArrays.RookMoves2[index] = moveset;
                MoveArrays.RookTotalMoves3[index] = 0
                moveset = new PieceMoveSet([]);
                row = x; 
                col = y;
                while(col > 0){
                    col--
                    move = Position(col, row)
                    moveset.moves.push(move);
                    MoveArrays.RookTotalMoves3[index]++;
                }
                MoveArrays.RookMoves3[index] = moveset;
                MoveArrays.RookTotalMoves4[index] = 0
                moveset = new PieceMoveSet([]);
                row = x; 
                col = y;
                while(col < 7){
                    col ++;
                    move = Position(col, row);
                    moveset.moves.push(move);
                    MoveArrays.RookTotalMoves4[index]++;
                }
                MoveArrays.RookMoves4[index] = moveset;

            }
        }
    }

    private setMovesBishop(){
        for(let y = 0; y < 8; y++){
            for(let x = 0; x < 8; x++){
                let index = (y + (x * 8))
                MoveArrays.BishopTotalMoves1[index] = 0;
                let moveset = new PieceMoveSet([])
                let move : number;
                let row = x;
                let col = y;
                while(row < 7 && col < 7)
                {
                    row++;
                    col++;
                    move = Position(col, row);
                    moveset.moves.push(move);
                    MoveArrays.BishopTotalMoves1[index]++
                }
                MoveArrays.BishopMoves1[index] = moveset;
                MoveArrays.BishopTotalMoves2[index] = 0;
                moveset = new PieceMoveSet([])
                row = x;
                col = y;
                while(row < 7 && col > 0){
                    row++;
                    col--;
                    move = Position(col, row);
                    moveset.moves.push(move);
                    MoveArrays.BishopTotalMoves2[index]++
                }
                MoveArrays.BishopMoves2[index] = moveset;
                MoveArrays.BishopTotalMoves3[index] = 0;
                moveset = new PieceMoveSet([])
                row = x;
                col = y;
                while(row > 0 && col < 7){
                    row--;
                    col++;
                    move = Position(col, row);
                    moveset.moves.push(move);
                    MoveArrays.BishopTotalMoves3[index]++
                }
                MoveArrays.BishopMoves3[index] = moveset;
                MoveArrays.BishopTotalMoves4[index] = 0;
                moveset = new PieceMoveSet([])
                row = x;
                col = y;
                while(row > 0 && col > 0){
                    row--;
                    col--;
                    move = Position(col, row);
                    moveset.moves.push(move);
                    MoveArrays.BishopTotalMoves4[index]++
                }
                MoveArrays.BishopMoves4[index] = moveset;
            }
        }

    }
    private setMovesKnight(){
        for(let y = 0; y < 8; y++){
            for(let x = 0; x < 8; x++){
                let index = (y + (x * 8))
                MoveArrays.KnightTotalMoves[index] = 0;
                let moveset = new PieceMoveSet([]);


                let move : number;

                if(y < 6 && x > 0){
                    move = Position(y + 2, x - 1);
                    if(move < 64)
                    {
                        moveset.moves.push(move)
                        MoveArrays.KnightTotalMoves[index]++;
                    }
                }
                if(y > 1 && x < 7)
                {
                    move = Position(y - 2, x + 1)
                    if(move < 64){
                        moveset.moves.push(move)
                        MoveArrays.KnightTotalMoves[index]++;
                    }
                }
                if(y > 1 && x > 0){
                    move = Position(y - 2, x - 1);
                    if(move < 64){
                        moveset.moves.push(move)
                        MoveArrays.KnightTotalMoves[index]++;
                    }
                }
                if(y < 6 && x < 7){
                    move = Position(y + 2, x + 1);
                    if(move < 64){
                        moveset.moves.push(move)
                        MoveArrays.KnightTotalMoves[index]++;
                    }
                }
                if(y > 0 && x < 6){
                    move = Position(y - 1, x + 2)
                    if(move < 64){
                        moveset.moves.push(move)
                        MoveArrays.KnightTotalMoves[index]++;
                    }
                }
                if(y < 7 && x > 1){
                    move = Position(y + 1, x - 2)
                    if(move < 64){
                        moveset.moves.push(move)
                        MoveArrays.KnightTotalMoves[index]++;
                    }
                }
                if(y > 0 && x > 1){
                    move = Position(y - 1, x - 2)
                    if(move < 64){
                        moveset.moves.push(move)
                        MoveArrays.KnightTotalMoves[index]++;
                    }
                }
                if(y < 7 && x < 6){
                    move = Position(y + 1, x + 2)
                    if(move < 64){
                        moveset.moves.push(move)
                        MoveArrays.KnightTotalMoves[index]++;
                    }
                }
                MoveArrays.KnightMoves[index] = moveset
            }
        }

    }


}    

function Position(col : number, row : number){
    return (col + (row*8))
}