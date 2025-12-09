import Board from "./board.mjs";
import { getSquares, getPieces, getDailyPuzzle, getRandomPuzzle } from "./chessSetUp.mjs";
import { createAllPieces } from "./piecesFactory.mjs";
import { initialPositionAllPieces, makeMove, findPieceByPgn} from "./movement.mjs";
import { getMoves, splitMoves, splitAlgebraicNotation, getPgnMoves, pgnEachMoveToArray, getTestMoves} from "./readMove.mjs";
import { deletePiece, castling } from "./findPiece.mjs";

export async function initApp() {
  
  const tablero = document.getElementById('chess-board');

  const boardData = await getSquares();
  let piecesData = await getPieces();


  const unidadPX = tablero.clientWidth / 8;

  const board = new Board(boardData, tablero);
  board.init();

  await createAllPieces();

  initialPositionAllPieces(piecesData, unidadPX);

  const moves = await getMoves();
  // console.log(moves);

  // daily puzzle

  const dailyPuzzleMoves = await getDailyPuzzle();
  // console.log(dailyPuzzleMoves);

  const randomPuzzleMoves = await getRandomPuzzle();
  // console.log(randomPuzzleMoves);

  // test

  const testMoves = await getTestMoves();

  const testMovesString = testMoves.game.pgn;

  const testToPlay = getPgnMoves(testMovesString);

  // 
  // 

  const movesToPlay = splitMoves(moves);
  // console.log(movesToPlay);

  

  const pgnMoves = dailyPuzzleMoves.game.pgn;

  const pgnToPlay = getPgnMoves(pgnMoves);
  console.log(pgnToPlay);

  // pgnToPlay.forEach(pgnNotation => {

  //   pgnNotation = pgnEachMoveToArray(pgnNotation);
  //   console.log(pgnNotation);
  
  // });

   function sleepPgn(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  } 
  
  async function playPgn() {
    for (let i = 0; i < testToPlay.length; i++) {

      let pcolor = "";

      if( i === 0 || i%2 === 0) {

        pcolor = 'white';

      }

      else {
        pcolor ='black';
      }

      const pgnNotation = pgnEachMoveToArray(testToPlay[i]);
      console.log(pgnNotation);

      const pieceAndSquare = findPieceByPgn(piecesData, boardData, pgnNotation, pcolor);
      console.log(pieceAndSquare);

      let piecePgnToMove;
      let finalSquare;
      let king;
      let rookToMovePgn;

      if ( pieceAndSquare.length === 2) {

        piecePgnToMove = pieceAndSquare[0];
        finalSquare = pieceAndSquare[1];
        
        let enemyPiece = piecesData.find( ep => ep.file === finalSquare.file && ep.rank === finalSquare.rank && ep.color != piecePgnToMove.color);

        if (enemyPiece) {
          let enemyPieceContainer = document.querySelector(`[data-id="${enemyPiece.pId}"]`);
          piecesData = piecesData.filter(p => p.pId !== enemyPiece.pId);
          deletePiece(tablero, enemyPieceContainer);
        } else { enemyPiece = null;}

        // console.log(piecesData);

        makeMove(piecePgnToMove, [finalSquare.file, finalSquare.rank], unidadPX);

      }

      else {
        king = pieceAndSquare[0];
        rookToMovePgn = pieceAndSquare[2];
        makeMove(king, [pieceAndSquare[1][0], pieceAndSquare[1][1]], unidadPX);
        makeMove(rookToMovePgn, [pieceAndSquare[3][0], pieceAndSquare[3][1]], unidadPX);
      }

      // const move = splitAlgebraicNotation(movesToPlay[i]);
      // const pieceSquare = move.piece;
      // const pieceDestination = move.destinationSquare;

      // const squareR = boardData.find(s => pieceSquare === s.square);
      // const squareD = boardData.find(d => pieceDestination === d.square);

      // const pieceToMove = piecesData.find( p => p.file === squareR.file && p.rank === squareR.rank);

      // let enemyPiece = piecesData.find( ep => ep.file === squareD.file && ep.rank === squareD.rank && ep.color != pieceToMove.color);

      // if (enemyPiece) {
      //   let enemyPieceContainer = document.querySelector(`[data-id="${enemyPiece.pId}"]`);

      //   piecesData = piecesData.filter(p => p.pId !== enemyPiece.pId);

      //   deletePiece(tablero, enemyPieceContainer);
      // } else {
      //   enemyPiece = null;
      // }

      // makeMove(pieceToMove, [squareD.file, squareD.rank], unidadPX);

      // if (pieceToMove.category === 'king') {
      //   const rookToMove = castling(piecesData, squareD.file, squareD.rank);
      //   makeMove(rookToMove, [3, 7], unidadPX);
      // }

      // if (i === movesToPlay.length - 1) {
      //   document.getElementById('move-notation').textContent = "Checkmate!";
      // }

      await sleepPgn(2000);
    }
  }

  playPgn();
 




  // function sleep(ms) {
  //   return new Promise(resolve => setTimeout(resolve, ms));
  // } 

  // async function play() {
  //   for (let i = 0; i < movesToPlay.length; i++) {

  //     const move = splitAlgebraicNotation(movesToPlay[i]);
  //     const pieceSquare = move.piece;
  //     const pieceDestination = move.destinationSquare;

  //     const squareR = boardData.find(s => pieceSquare === s.square);
  //     const squareD = boardData.find(d => pieceDestination === d.square);

  //     const pieceToMove = piecesData.find( p => p.file === squareR.file && p.rank === squareR.rank);

  //     let enemyPiece = piecesData.find( ep => ep.file === squareD.file && ep.rank === squareD.rank && ep.color != pieceToMove.color);

  //     if (enemyPiece) {
  //       let enemyPieceContainer = document.querySelector(`[data-id="${enemyPiece.pId}"]`);

  //       piecesData = piecesData.filter(p => p.pId !== enemyPiece.pId);

  //       deletePiece(tablero, enemyPieceContainer);
  //     } else {
  //       enemyPiece = null;
  //     }

  //     makeMove(pieceToMove, [squareD.file, squareD.rank], unidadPX);

  //     if (pieceToMove.category === 'king') {
  //       const rookToMove = castling(piecesData, squareD.file, squareD.rank);
  //       makeMove(rookToMove, [3, 7], unidadPX);
  //     }

  //     if (i === movesToPlay.length - 1) {
  //       document.getElementById('move-notation').textContent = "Checkmate!";
  //     }

  //     await sleep(2000);
  //   }
  // }

  // play();
}
