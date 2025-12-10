let alPaso;
let alPasoValidation;

export function makeMove(piece, finalPosition, unidadD) {

    const [finalCol, finalRow] = finalPosition;

    const pContainer = document.querySelector(`[data-id="${piece.pId}"]`);

    if (piece.notation === 'P' && Math.abs(finalRow - piece.rank) === 2) {
        alPaso = [finalCol - 1, finalCol + 1];
        alPasoValidation = true;
    } else {
        alPaso = [];
        alPasoValidation = false;
    }

    piece.file = finalCol;
    piece.rank = finalRow;

    pContainer.dataset.file = finalCol;
    pContainer.dataset.rank = finalRow;

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

    let potentialSquares;
    let isValid;

    switch (piece.notation) {

        case "P":
            potentialSquares = validatePawnMove(piece, boardData, piecesData);
            isValid = potentialSquares.some( validS => destinationSquare.square === validS.square);

            return isValid;

        case "R":

            potentialSquares = validateRookMove(piece, boardData, piecesData);
            isValid = potentialSquares.some( validS => destinationSquare.square === validS.square);

            return isValid;

        case "N":

            potentialSquares = validateKnightMove(piece, boardData, piecesData);
            isValid = potentialSquares.some( validS => destinationSquare.square === validS.square);

            return isValid;

        case "B":

            potentialSquares = validateBishopMove(piece, boardData, piecesData);
            isValid = potentialSquares.some( validS => destinationSquare.square === validS.square);

            return isValid;

        case "Q":

            potentialSquares = validateQueenMove(piece, boardData, piecesData);
            isValid = potentialSquares.some( validS => destinationSquare.square === validS.square);

            return isValid;

        case "K":
            potentialSquares = validateKingMove(piece, boardData, piecesData);
            isValid = potentialSquares.some( validS => destinationSquare.square === validS.square);

            return isValid;


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

export function validateRookMove(rook, boardData, piecesData) {

    let potentialSquares = [];

    function checkDirection(startFile, startRank, dx, dy) {

        let f = startFile + dx;
        let r = startRank + dy;

        while (f >= 0 && f <= 7 && r >= 0 && r <= 7) {

            let pieceF = piecesData.find(p => p.file === f && p.rank === r);
            let validSquare = boardData.find(s => s.file === f && s.rank === r);

            if (pieceF) {
                if (pieceF.color != rook.color) {
                    potentialSquares.push(validSquare);
                }
                break; 
            }

            potentialSquares.push(validSquare);

            f = f + dx;
            r = r + dy;
        }
    }

    checkDirection(rook.file, rook.rank,  0, -1); 

    checkDirection(rook.file, rook.rank,  0, +1); 

    checkDirection(rook.file, rook.rank, -1,  0); 

    checkDirection(rook.file, rook.rank, +1,  0);

    return potentialSquares;
}


export function validateKnightMove(knight, boardData, piecesData) {

    let potentialSquares = [];
    potentialSquares = boardData.filter(s => {

        let lShape = false;
        let pieceSameColor;

        if (Math.abs(s.file - knight.file) === 1 && Math.abs(s.rank - knight.rank) === 2) {
            lShape = true;
        }

        if (Math.abs(s.file - knight.file) === 2 && Math.abs(s.rank - knight.rank) === 1) {
            lShape = true;
        }

        pieceSameColor = piecesData.find(ps =>
            ps.file === s.file &&
            ps.rank === s.rank &&
            ps.color === knight.color
        );

        return (lShape === true && !pieceSameColor);
    });

    return potentialSquares;
}


export function validateBishopMove(bishop, boardData, piecesData) {

    let potentialSquares = [];

    checkDirection(bishop, 1, 1, piecesData, boardData, potentialSquares);
    checkDirection(bishop, 1, -1, piecesData, boardData, potentialSquares);
    checkDirection(bishop, -1, 1, piecesData, boardData, potentialSquares);
    checkDirection(bishop, -1, -1, piecesData, boardData, potentialSquares);

    return potentialSquares;
}

function checkDirection(bishop, dx, dy, piecesData, boardData, potentialSquares) {
    let f = bishop.file + dx;
    let r = bishop.rank + dy;

    while (f >= 0 && f <= 7 && r >= 0 && r <= 7) {

        let piece = piecesData.find(p => p.file === f && p.rank === r);
        let square = boardData.find(s => s.file === f && s.rank === r);

        if (!square) break;

        if (piece) {

            if (piece.color != bishop.color) {
                potentialSquares.push(square);
            }

            break;
        }

        potentialSquares.push(square);

        f = f + dx;
        r = r + dy;
    }
}

export function validateKingMove(king, boardData, piecesData) {

    let potentialSquares = [];

    let directions = [
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 },

        { dx: 1, dy: 1 },
        { dx: 1, dy: -1 },
        { dx: -1, dy: 1 },
        { dx: -1, dy: -1 }
    ];

    directions.forEach(dir => {

        let f = king.file + dir.dx;
        let r = king.rank + dir.dy;

        if (f >= 0 && f <= 7 && r >= 0 && r <= 7) {

            let square = boardData.find(s => s.file === f && s.rank === r);
            let piece = piecesData.find(p => p.file === f && p.rank === r);

            if (piece && piece.color === king.color) {
                return;
            }

            potentialSquares.push(square);
        }
    });

    return potentialSquares;
}

export function validateQueenMove(queen, boardData, piecesData) {

    let potentialSquares = [];

    checkDirectionQueen(queen, 1, 0, piecesData, boardData, potentialSquares);   
    checkDirectionQueen(queen, -1, 0, piecesData, boardData, potentialSquares);  
    checkDirectionQueen(queen, 0, 1, piecesData, boardData, potentialSquares); 
    checkDirectionQueen(queen, 0, -1, piecesData, boardData, potentialSquares);

    checkDirectionQueen(queen, 1, 1, piecesData, boardData, potentialSquares);  
    checkDirectionQueen(queen, 1, -1, piecesData, boardData, potentialSquares); 
    checkDirectionQueen(queen, -1, 1, piecesData, boardData, potentialSquares);  
    checkDirectionQueen(queen, -1, -1, piecesData, boardData, potentialSquares);

    return potentialSquares;
}

function checkDirectionQueen(queen, dx, dy, piecesData, boardData, potentialSquares) {

    let f = queen.file + dx;
    let r = queen.rank + dy;

    while (f >= 0 && f <= 7 && r >= 0 && r <= 7) {

        let square = boardData.find(s => s.file === f && s.rank === r);
        let piece = piecesData.find(p => p.file === f && p.rank === r);

        if (!square) break;

        if (piece) {

            if (piece.color != queen.color) {
                potentialSquares.push(square);
            }

            break;
        }

        potentialSquares.push(square);

        f = f + dx;
        r = r + dy;
    }
}








