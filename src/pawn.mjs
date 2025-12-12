import { gameState } from "./gameState.mjs";

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

        if (pieceAtSquare) {

            if(pieceAtSquare.color !== pawn.color) {
                potentialSquare.push(captureSquare);
            }
        }

        else {

            let alPaso = gameState.alPasoInfo;

            const objeto = validateEnPassant(pawn, captureSquare, piecesData, alPaso);

            if(objeto.isValidEnPassant) {
                potentialSquare.push(captureSquare);

                return [potentialSquare, objeto.capturedPiece];
            }

        }

        // el peon se mueve diagonal pero no hay pieza


    }

    return potentialSquare;
}

export function validateEnPassant(pawn, targetSquare, piecesData, alPasoInfo) {
    const fromFile = pawn.file; 
    // ok

    const fromRank = pawn.rank;

    // ok

    const toFile = targetSquare.file;
    // ok


    const toRank = targetSquare.rank;
    // ok

    const isWhite = pawn.color === 'white';

    // ok
    if (Math.abs(toFile - fromFile) !== 1) {
        return { isValidEnPassant: false, capturedPiece: null };
    }

    // ok
    
    const expectedRankMovement = isWhite ? -1 : 1;
    if (toRank - fromRank !== expectedRankMovement) {
        return { isValidEnPassant: false, capturedPiece: null };
    }

    // ok, logica para actualizar estado al paso pendiente

    if (!alPasoInfo) {
        // No hay oportunidad de captura al paso en este turno
        return { isValidEnPassant: false, capturedPiece: null };
    }

    // ok
    const targetMatches = (
        toFile === alPasoInfo.targetFile &&
        toRank === alPasoInfo.targetRank
    );

    if (!targetMatches) {
        return { isValidEnPassant: false, capturedPiece: null };
    }

    // ok

    const capturedPiece = piecesData.find(p => 
        p.pId === alPasoInfo.capturedPieceId &&
        p.file === alPasoInfo.capturedPieceFile &&
        p.rank === alPasoInfo.capturedPieceRank
    );

    if (capturedPiece && capturedPiece.color !== pawn.color && capturedPiece.notation === 'P') {
        return { 
            isValidEnPassant: true, 
            capturedPiece: capturedPiece 
        };
    }

    return { isValidEnPassant: false, capturedPiece: null };
}
