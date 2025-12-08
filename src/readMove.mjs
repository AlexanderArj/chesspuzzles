const movesJson = './json/testJson1.json';

export async function getMoves() {
    const response = await fetch(movesJson);
    const moves = await response.json();
    return moves;
}

export function splitMoves(moves) {
    return moves.game.split(" ");
}

export function splitAlgebraicNotation(move) {
    return {
      piece: move.slice(0, 2),
      destinationSquare: move.slice(2, 4)
    };
}

export function getPgnMoves(pgn) {
  return pgn.trim().split(/\s+/);
}

export function pgnEachMoveToArray(pgnMove) {
    return pgnMove.replace(/\s+/g, "").split("");
}






