export function findPiece(sfile, srank, piecesData) {
    const pieceF = piecesData.find(
        piece => piece.file === sfile && piece.rank === srank);
    return pieceF;
}

export function deletePiece(boardContainer, pContainer) {

    boardContainer.removeChild(pContainer);
    console.log("A piece has been deleted");

}

export function castling(piecesData, file, rank) {

    if ( file === 2 && rank === 7) {
        return findPiece(0, 7, piecesData);
    }

    else {
        
        if (file === 6 && rank === 7) {
            return findPiece(6, 7, piecesData);
        }
    }
}