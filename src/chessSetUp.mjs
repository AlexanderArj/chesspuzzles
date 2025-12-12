const boardJson = "json/board.json";
const piecesJson = "json/pieces.json";

const dailyPuzzleUrl = 'https://lichess.org/api/puzzle/daily';
const randomPuzzleUrl = 'https://lichess.org/api/puzzle/next?angle=&difficulty=easiest&color=white';


export async function getSquares() {
    const response = await fetch(boardJson);
    const dataBoard = await response.json();
    return dataBoard;
}

export async function getPieces() {
    const response = await fetch(piecesJson);
    const dataPieces = await response.json();
    return dataPieces;
}

export async function getDailyPuzzle() {
  try {
    const response = await fetch(dailyPuzzleUrl);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const dailyPuzzleData = await response.json();
    
    return dailyPuzzleData;
    
  } catch (error) {

    console.error("There was an error loading the daily puzzle:", error);
    return null; 
  }
}

export async function getRandomPuzzle() {
  try {
    const response = await fetch(randomPuzzleUrl);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const randomPuzzleData = await response.json();
    
    return randomPuzzleData;
    
  } catch (error) {

    console.error("There was an error loading the puzzle:", error);
    return null; 
  }
}


