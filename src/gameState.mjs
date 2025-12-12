export const gameState = {
    turn: 'white', 
    moveNumber: 1,

    canCastle: {
        white: { kingSide: true, queenSide: true },
        black: { kingSide: true, queenSide: true }
    },

    alPasoInfo: null,

    checkStatus: {               
        inCheck: false,          
        checkingPieces: []
    },
    
    halfMoveClock: 0,    
    positionHistory: [], 
    pawnPromotion: null
};