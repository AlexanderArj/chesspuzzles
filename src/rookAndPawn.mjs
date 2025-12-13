
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

    }

    return potentialSquare;
}