
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
