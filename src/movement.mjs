export function makeMove(piece, finalPosition, unidadD) {

    const [finalCol, finalRow] = finalPosition;

    const pContainer = document.querySelector(`[data-id="${piece.pId}"]`);
    piece.file = finalCol;
    piece.rank = finalRow;

    const pixelC = finalCol * unidadD;
    const pixelR = finalRow * unidadD;

    pContainer.style.transform = `translate(${pixelC}px, ${pixelR}px)`;
}


export function initialPositionAllPieces(pieces, unidadD) {

    pieces.forEach(piece => {

        const finalCol = piece.file;
        const finalRow = piece.rank;

        makeMove(piece, [finalCol, finalRow], unidadD);
    });
}


export function moveValidation(piece, destinationSquare) {

    const fileDiff = Math.abs(destinationSquare.file - piece.file);
    const rankDiff = Math.abs(destinationSquare.rank - piece.rank);
    const rankDirection = destinationSquare.rank - piece.rank;

    switch (piece.notation) {

        case "P":

            let forward;

            if (piece.color === "white") {
                forward = -1;
            } else {
                forward = 1;
            }

            if (rankDirection * forward <= 0) {
                return { message: "Invalid", validMove: false };
            }

            if (rankDirection === 2 * forward && fileDiff === 0) {

                let startRank;

                if (piece.color === "white") {
                    startRank = 6;
                } else {
                    startRank = 1;
                }

                if (piece.rank === startRank) {
                    return true;
                }

                return { message: "Invalid", validMove: false };
            }

            if (rankDirection === forward) {

                if (fileDiff === 0) {
                    return true;
                }

                if (fileDiff === 1) {
                    return true;
                }

                return { message: "Invalid", validMove: false };
            }

            return { message: "Invalid", validMove: false };


        case "R":

            if (piece.rank === destinationSquare.rank) {
                return true;
            }

            if (piece.file === destinationSquare.file) {
                return true;
            }

            return { message: "Invalid", validMove: false };


        case "N":

            if (fileDiff === 1 && rankDiff === 2) {
                return true;
            }

            if (fileDiff === 2 && rankDiff === 1) {
                return true;
            }

            return { message: "Invalid", validMove: false };


        case "B":

            if (fileDiff === rankDiff) {
                return true;
            }

            return { message: "Invalid", validMove: false };


        case "Q":

            if (fileDiff === rankDiff) {
                return true;
            }

            if (piece.rank === destinationSquare.rank) {
                return true;
            }

            if (piece.file === destinationSquare.file) {
                return true;
            }

            return { message: "Invalid", validMove: false };


        case "K":

            if (fileDiff <= 1 && rankDiff <= 1) {

                if (fileDiff === 0 && rankDiff === 0) {
                    return { message: "Invalid", validMove: false };
                }

                return true;
            }

            return { message: "Invalid", validMove: false };


        default:
            return { message: "Invalid", validMove: false };
    }
}



export function findPieceByPgn (piecesData, boardData, pgnArray, pcolor) {

    // caso enrroque
    let pieceToMove;
    let destinationSquare;
    let destinationS;
    let pawnsToConsider;
    let interior;
    let fileOrRankNumber;
    const last = pgnArray[pgnArray.length - 1];
    const piecesNotation = ['K', 'Q', 'R', 'B', 'N'];
    let promoPiece;
    let auxMinDiff = 9;

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
        
        
        const piecesToConsider = piecesData.filter(p => p.notation === pgnArray[0] && p.color === pcolor);

        if ( pgnArray.length === 3) {

            destinationSquare = boardData.find(s => s.square === (pgnArray[1].toString() + pgnArray[2].toString()));

            if (piecesToConsider.length > 1) {
                return getPieceFromArray(pieceToMove, piecesToConsider, destinationSquare);
            }
        }

        if(pgnArray[1].toLowerCase() != 'x') {

            interior = pgnArray[1];

            if (interior >= "a" && interior <= "h") {
                fileOrRankNumber = interior.charCodeAt(0) - "a".charCodeAt(0);
                pieceToMove = piecesData.find(p => p.notation === pgnArray[0] && p.color === pcolor && p.file === fileOrRankNumber);
            }

            else {
                
                const interiorNum = Number(interior);
                if (interiorNum >= 1 && interiorNum <= 8) {
                    fileOrRankNumber = interiorNum - 1;
                    pieceToMove = piecesData.find(p => p.notation === pgnArray[0] && p.color === pcolor && p.rank === fileOrRankNumber);
                }
            }
        }

        if (last === '+' || last === '#') {
            destinationS = pgnArray[pgnArray.length - 3].toString() + pgnArray[pgnArray.length - 2].toString();
        } 
        
        else {
            destinationS = pgnArray[pgnArray.length - 2].toString() + pgnArray[pgnArray.length - 1].toString();
        }

        destinationSquare = boardData.find( s => s.square === destinationS);

        if (!destinationSquare) {
            return { error: "Destination square not found", piece: pieceToMove, destinationSquare: null };
        }

        return getPieceFromArray(pieceToMove, piecesToConsider, destinationSquare);

    }

    else {
        
        if (pgnArray[0].toLowerCase() >= "a" && pgnArray[0].toLowerCase() <= "h") {
        
            interior = pgnArray[0];
            fileOrRankNumber = interior.charCodeAt(0) - "a".charCodeAt(0);
            // siempre fila

            // encontrar destination square

            // promotion case

            if (piecesNotation.includes(last) && last != 'K') {
                destinationS = pgnArray[pgnArray.length - 4].toString() + pgnArray[pgnArray.length - 3].toString();
                promoPiece = last;
            }

            if (last === '+' || last === '#') {

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
                if (piecesNotation.includes(last) && last !== 'K') {
                    destinationS = pgnArray[pgnArray.length - 3].toString() + pgnArray[pgnArray.length - 2].toString();
                    promoPiece = last;
                } else if (last === '+' || last === '#') {
                    if (piecesNotation.includes(pgnArray[pgnArray.length - 2])) {
                        promoPiece = pgnArray[pgnArray.length - 2];
                        destinationS = pgnArray[pgnArray.length - 5].toString() + pgnArray[pgnArray.length - 4].toString();
                    } else {
                        destinationS = pgnArray[pgnArray.length - 3].toString() + pgnArray[pgnArray.length - 2].toString();
                    }
                } else {
                    destinationS = pgnArray[pgnArray.length - 2].toString() + pgnArray[pgnArray.length - 1].toString();
                }
            }

            destinationSquare = boardData.find( s => s.square === destinationS);

            pawnsToConsider = piecesData.filter( pawn => pawn.notation === 'P' && pawn.color === pcolor 
                && pawn.file === fileOrRankNumber);
            
            if (pawnsToConsider.length > 1) {

                for (let p = 0; p < pawnsToConsider.length; p++) {

                    const min = Math.abs(pawnsToConsider[p].rank - destinationSquare.rank)
                    if ( min < auxMinDiff) {
                        pieceToMove = pawnsToConsider[p];
                        auxMinDiff = min;
                    }
                }
            }

            else {
                if (pawnsToConsider.length === 0) {
                    return { error: "No pawn found for the given file and color", piece: null, destinationSquare };
                }
                pieceToMove = pawnsToConsider[0];
            }

        }

    }
    
    return [pieceToMove, destinationSquare];

}

function getPieceFromArray(pieceToMove, piecesToConsider, destinationSquare) {
    for (let piece =0; piece < piecesToConsider.length; piece++){
        if (moveValidation(piecesToConsider[piece], destinationSquare) === true){
            pieceToMove = piecesToConsider[piece];
        
        } 
    }

    return [pieceToMove, destinationSquare];

}