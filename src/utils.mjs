
 export function resizeBoard() {
    const boardElement = document.querySelector("#chess-board");
    const pieces = document.querySelectorAll(".piece");

    const unidad = boardElement.clientWidth / 8;

    pieces.forEach(piece => {
      const file = Number(piece.dataset.file);
      const rank = Number(piece.dataset.rank);
      piece.style.transform = `translate(${file * unidad}px, ${rank * unidad}px)`;
    });
}

 export function sleepPgn(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

export function deletePiece(boardContainer, pContainer) {

    boardContainer.removeChild(pContainer);

}