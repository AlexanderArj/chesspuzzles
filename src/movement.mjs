let alPaso;
let alPasoValidation;

export function makeMove(piece, finalPosition, unidadD) {

    const [finalCol, finalRow] = finalPosition;

    const pContainer = document.querySelector(`[data-id="${piece.pId}"]`);

    if(piece.notation === 'P' && Math.abs(finalRow - piece.rank) === 2) {
        alPaso = [finalCol - 1, finalCol + 1];
        alPasoValidation = true;
    }

    else {
        alPaso = [];
        alPasoValidation = false;
    }

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


export function moveValidation(piece, destinationSquare, boardData, piecesData) {

    const fileDiff = Math.abs(destinationSquare.file - piece.file);
    const rankDiff = Math.abs(destinationSquare.rank - piece.rank);
    const rankDirection = destinationSquare.rank - piece.rank;

    switch (piece.notation) {

        case "P":
            let potentialSquares = validatePawnMove(piece, boardData, piecesData);
            const isValid = potentialSquares.some( validS => destinationSquare.square === validS.square);

            return isValid;

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
    let piecesToConsider;
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
        
        piecesToConsider = piecesData.filter(p => p.notation === pgnArray[0] && p.color === pcolor);
        // ejemplo: todos los caballos que tiene el bando a jugar

        console.log(piecesToConsider);

        if ( pgnArray.length === 3 || (pgnArray.length === 4 && (last === "+"|| last ==="#"))) {
            // jugaada tipo Nb5
            // jugada tipo Nf6+ o Nf6#
            // este caso puede implicar el arreglo piecesToC, hay que encontrar el caballo que puede hacer el movimiento

            destinationSquare = boardData.find(s => s.square === (pgnArray[1].toString() + pgnArray[2].toString()));
            // se define el destination s con los dos ultimos elementos N, b, 5  

            if (piecesToConsider.length > 1) {
                // si hay mas de dos para considerar, entonces debemos validar para cada pieza con esta funcion
                // en este punto pieceToMove es nulo
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

        // este return es para jugadas tipo Nxd5, donde el segundo caracter es x, en teoria solo un caballo puede hacer esta jugada
        // porque de otra manera se escribiria como Nbxd5, entonces incluso si hay mas piezas del mismo tipo la funcion getPiecefromA deberia 
        // devolver sola la pieza que puede hacer el movimiento segun la funcion de validación
       
        return getPieceFromArray(pieceToMove, piecesToConsider, destinationSquare, boardData, piecesData);

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
                console.log(destinationS);
            }
            
            destinationSquare = boardData.find( s => s.square === destinationS);
            console.log(destinationSquare);

            pawnsToConsider = piecesData.filter( pawn => pawn.notation === 'P' && pawn.color === pcolor 
                && pawn.file === fileOrRankNumber);
            console.log(pawnsToConsider);
            
            if (pawnsToConsider.length > 1) {
                return getPieceFromArray(pieceToMove, pawnsToConsider, destinationSquare, boardData, piecesData);
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

function getPieceFromArray(pieceToMove, piecesToConsider, destinationSquare, boardData, piecesData) {

    for (let piece =0; piece < piecesToConsider.length; piece++){

        if (moveValidation(piecesToConsider[piece], destinationSquare, boardData, piecesData) === true){
            pieceToMove = piecesToConsider[piece];
        } 
    }

    return [pieceToMove, destinationSquare];

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

// desarrollar una funcion que evalue todas las posibles casillas para una pieza segun su posicion inicial

export function validatePawnMove(pawn, boardData, piecesData) {

    let potentialSquare;
    let pieceF;
    let startRank = false;

    if ((pawn.color === 'white' && pawn.rank === 6) || 
        (pawn.color === 'black' && pawn.rank === 1)) {
        startRank = true;
    }

    potentialSquare = boardData.filter(s => {

        let forwardMovement;

        if (pawn.color === 'white') {
            forwardMovement = s.rank < pawn.rank;
        } else {
            forwardMovement = s.rank > pawn.rank;
        }

        let diff = Math.abs(s.rank - pawn.rank);

        return (
            s.file === pawn.file &&
            forwardMovement &&
            (
                diff === 1 ||
                (diff === 2 && startRank)
            )
        );
    });

    for (let i = 0; i < potentialSquare.length; i++) {

        pieceF = piecesData.find(p =>
            p.file === potentialSquare[i].file &&
            p.rank === potentialSquare[i].rank
        );

        if (pieceF) {

            if (Math.abs(potentialSquare[i].rank - pawn.rank) === 1) {
                potentialSquare = [];
                break;
            }

            potentialSquare[i] = null;
        }
    }

    potentialSquare = potentialSquare.filter(s => s !== null);

    let captureRank;

    if (pawn.color === 'white') {
        captureRank = pawn.rank - 1;
    } else {
        captureRank = pawn.rank + 1;
    }

    let captureFiles = [pawn.file - 1, pawn.file + 1];

    for (let cf of captureFiles) {

        let captureSquare = boardData.find( s => s.file === cf && s.rank === captureRank);
        if (!captureSquare) continue;

        let pieceAtSquare = piecesData.find( p => p.file === cf && p.rank === captureRank);

        if (pieceAtSquare && pieceAtSquare.color !== pawn.color) {
            potentialSquare.push(captureSquare);
        }

        if (alPasoValidation) {
            if(pawn.file === alPaso[0] || pawn.file === alPaso[1]){
                potentialSquare.push(captureSquare);
            }
        }

    }

    return potentialSquare;
}

