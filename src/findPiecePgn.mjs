import { moveValidation } from "./moveValidation.mjs";

export function findPieceByPgn (piecesData, boardData, pgnArray, pcolor) {

    // caso enrroque
    let pieceToMove;
    let piecesToConsider;
    let destinationSquare;
    let destinationS;
    let pawnsToConsider;
    let interior;
    let fileOrRankNumber;
    const last = pgnArray[pgnArray.length - 1];
    const piecesNotation = ['K', 'Q', 'R', 'B', 'N'];
    let promoPiece;

    if ( pgnArray[0].toLowerCase() === 'o') {

        
        pieceToMove = piecesData.find( k => k.notation === 'K' && k.color === pcolor);

        if ( pgnArray.length === 3) {
            // enrroque corto
            

            if( pcolor === 'black') {
                let blackKingsideRook = piecesData.find(r => r.notation === 'R' && r.color === pcolor && r.file === 7 && r.rank === 0);
                return [pieceToMove, [6,0], blackKingsideRook, [5, 0]];
            }
            else {
                let whiteKingsideRook = piecesData.find(r => r.notation === 'R' && r.color === pcolor && r.file === 7 && r.rank === 7);

                return [pieceToMove, [6,7], whiteKingsideRook, [5, 7]];
            }
        }

        else {

            if( pcolor === 'black') {
                let blackQueensideRook = piecesData.find(r => r.notation === 'R' && r.color === pcolor && r.file === 0 && r.rank === 0);
                return [pieceToMove, [2,0], blackQueensideRook, [3, 0]];
            }
            else {
                let whiteQueensideRook = piecesData.find(r => r.notation === 'R' && r.color === pcolor && r.file === 0 && r.rank === 7);

                return [pieceToMove, [2,7], whiteQueensideRook, [3, 7]];
            }
        }
    }

    // piezas

    if ( piecesNotation.includes(pgnArray[0])) {
        
        piecesToConsider = piecesData.filter(p => p.notation === pgnArray[0] && p.color === pcolor);
        // ok

        if ( pgnArray.length === 3 || (pgnArray.length === 4 && (last === "+"|| last ==="#"))) {
            // jugaada tipo Nb5
            // jugada tipo Nf6+ o Nf6#
            // este caso puede implicar el arreglo piecesToC, hay que encontrar el caballo que puede hacer el movimiento
            // ok

            destinationSquare = boardData.find(s => s.square === (pgnArray[1].toString() + pgnArray[2].toString()));
            // se define el destination s con los dos ultimos elementos N, b, 5  
            // ok

            if (piecesToConsider.length > 1) {
                // si hay mas de dos para considerar, entonces debemos validar para cada pieza con esta funcion
                // en este punto pieceToMove es nulo
                // ok

                return getPieceFromArray(pieceToMove, piecesToConsider, destinationSquare, boardData, piecesData);
            }

            // si no tiene mas un mismo tipo de pieza repetido
            // no se valida el movimiento en este caso, asumiendo que el pgn es correcto
            else {
                pieceToMove = piecesToConsider[0];
                return [pieceToMove, destinationSquare];
            }

        }

        // encontrar la casilla destino primero para poder retornar la pieza segun el caso.

        if (last === '+' || last === '#') {
            destinationS = pgnArray[pgnArray.length - 3].toString() + pgnArray[pgnArray.length - 2].toString();
        } 
        
        else {
            destinationS = pgnArray[pgnArray.length - 2].toString() + pgnArray[pgnArray.length - 1].toString();
        }

        destinationSquare = boardData.find( s => s.square === destinationS);
        
        if (!destinationSquare) { return { error: "Destination square not found", piece: pieceToMove, destinationSquare: null };}

        if(pgnArray[1].toLowerCase() != 'x') {

            interior = pgnArray[1];

            // casos para jugadas no ambiguas, Nbd7
            // no hay conjunto de piezas para hacer el movimiento ya que solo una lo hace, en este caso el caballo en la fila b

            // 1 2 3 4 5 6 7 8
            // 1  2  4  3  2  1  0

            if (interior >= "a" && interior <= "h") {
                fileOrRankNumber = interior.charCodeAt(0) - "a".charCodeAt(0);
                pieceToMove = piecesData.find(p => p.notation === pgnArray[0] && p.color === pcolor && p.file === fileOrRankNumber);
            }

            else {
                const interiorNum = Number(interior);
                if (interiorNum >= 1 && interiorNum <= 8) {
                    fileOrRankNumber = rankReferences(interiorNum);
                    pieceToMove = piecesData.find(p => p.notation === pgnArray[0] && p.color === pcolor && p.rank === fileOrRankNumber);
                }
            }
            
            return [pieceToMove, destinationSquare];

        }

        // ok

        // este return es para jugadas tipo Nxd5, donde el segundo caracter es x, en teoria solo un caballo puede hacer esta jugada
        // porque de otra manera se escribiria como Nbxd5, entonces incluso si hay mas piezas del mismo tipo la funcion getPiecefromA deberia 
        // devolver sola la pieza que puede hacer el movimiento segun la funcion de validación
       
        return getPieceFromArray(pieceToMove, piecesToConsider, destinationSquare, boardData, piecesData);

    }

    // PEONES!!!!!!!

    else {
        
        if (pgnArray[0].toLowerCase() >= "a" && pgnArray[0].toLowerCase() <= "h") {
        
            // siempre fila
            interior = pgnArray[0]; 

            fileOrRankNumber = interior.charCodeAt(0) - "a".charCodeAt(0);

            // encontrar destination square

            // promotion case

            if (piecesNotation.includes(last) && last != 'K') {
                destinationS = pgnArray[pgnArray.length - 4].toString() + pgnArray[pgnArray.length - 3].toString();
                promoPiece = last;
            }

            else if (last === '+' || last === '#') {

                // promo with check

                if (piecesNotation.includes(pgnArray[pgnArray.length - 2])) {
                    promoPiece = pgnArray[pgnArray.length - 2];
                    destinationS = pgnArray[pgnArray.length - 5].toString() + pgnArray[pgnArray.length - 4].toString();
                }

                else {
                    destinationS = pgnArray[pgnArray.length - 3].toString() + pgnArray[pgnArray.length - 2].toString();
                }

            }

            else {
                destinationS = pgnArray[pgnArray.length - 2].toString() + pgnArray[pgnArray.length - 1].toString();
            }
            
            destinationSquare = boardData.find( s => s.square === destinationS);

            // filtrar para saber si hay peones doblados

            pawnsToConsider = piecesData.filter( pawn => pawn.notation === 'P' && pawn.color === pcolor 
                && pawn.file === fileOrRankNumber);
            
            if (pawnsToConsider.length > 1) {
                return getPieceFromArray(pieceToMove, pawnsToConsider, destinationSquare, boardData, piecesData);

                // retornamos solo peon y
            }

            else {
                if (pawnsToConsider.length === 0) {
                    return { error: "No pawn found for the given file and color", piece: null, destinationSquare };
                }

                pieceToMove = pawnsToConsider[0];

            }

        }


        // regresa jugadas tipo e4
        return [pieceToMove, destinationSquare];


    }



}


// revisar esta funcion

function getPieceFromArray(pieceToMove, piecesToConsider, destinationSquare, boardData, piecesData) {

    for (let piece =0; piece < piecesToConsider.length; piece++){

        if (moveValidation(piecesToConsider[piece], destinationSquare, boardData, piecesData) === true) {
            pieceToMove = piecesToConsider[piece];
        } 
    }

    return [pieceToMove, destinationSquare];
    // regresa solo pieza y casilla destino, aca se podria implementar otras cosas tal vez
    // para actualizar el estado del juego

}

function rankReferences (num) {

    switch (num) {
        case 1:
            
            return 7;

        case 2:
            return 6;
        
        case 3:
            return 5;
        
        case 4:
            return 4;
        
        case 5:
            return 3;
        case 6:
            return 2;
        case 7:
            return 1;
        case 8:
            return 0;
    
        default:
            return;
    }
}