/**
 * Stupid AI implementation using random selection among all possibilities.
 */
class EnemyAIRandom implements EnemyAI {
    /** Color the AI plays for */
    color : StoneColor;

    /** 
     * Instantiates a random AI.
     * @param {number} _color The color the AI plays for
     * @constructor
     */
    constructor(_color : StoneColor) {
        this.color = _color;
    }

    /**
     * Function that invokes the AI if a move has to be performed.
     * @returns {boolean} if a move could be performed.
     */
    MakeMove() : boolean {
        if (Game.currentPlayer != this.color) {
            // this should not be necessary but just in case lets log if it happens
            console.error("[AI] Current player is not AI.");
            return false;
        }

        // Wait the given time before executing actual move calculation as this is done in no time
        let result = false;
        setTimeout(() => result = this.MakeMoveIntern(), Game.aiDecisionTime);
        return result;
    }

    /**
     * Calculates and executes the next move.
     * @returns {boolean} if a move could be performed.
     */
    MakeMoveIntern() : boolean {
        switch (Game.phase) {
            case GamePhase.PlacingStones:
                // get possible fields where new stone can be placed at
                var possibleFields = GameBoard.gameFields.filter(f => !f.owner);
                if (possibleFields.length < 1) {
                    console.error("[AI] No fields to place stone at.");
                    return false;
                }
                // select random field and place active stone
                var field = possibleFields[Math.floor(Math.random() * possibleFields.length)];
                GameBoard.MoveCurrentStoneToField(field);
                return true;
            case GamePhase.MovingStones:
                // this should not happen but check if there are stones on the field
                if (!GameBoard.GetStonesOnField(this.color)) {
                    console.error("[AI] No own stones exist.");
                    return false;
                }
                // get moveable stones
                const moveableStones = GameBoard.GetStonesOnField(this.color).filter(s => s.isMoveable);
                if (moveableStones.length < 1) {
                    console.error("[AI] No moveable stones available.");
                    return false;
                }
                // select random stone
                var stone = moveableStones[Math.floor(Math.random() * moveableStones.length)];
                // get possible fields where the stone can move to
                var possibleFields = GameBoard.gameFields.filter(f => f.CanStoneMoveTo(stone));
                // again this should not have happend as only moveable stones are used
                if (possibleFields.length < 1) {
                    console.error("[AI] No fields to move stone to.");
                    return false;
                }
                // select random field and move stone on it
                var field = possibleFields[Math.floor(Math.random() * possibleFields.length)];
                return GameBoard.MoveStoneToField(stone, field);
            case GamePhase.RemovingStone:
                // should not happen but check if enemy has stones
                if (!GameBoard.GetStonesOnField(1 - this.color)) {
                    console.error("[AI] No enemy stones exist.");
                    return false;
                }
                // get all removeable enemy stones
                const removeableStones = GameBoard.GetStonesOnField(1 - this.color).filter(s => !s.isInClosedMill);
                if (removeableStones.length < 1) {
                    console.error("[AI] No removeable stones available.");
                    return false;
                }
                // select a random stone and remove it
                var stone = removeableStones[Math.floor(Math.random() * removeableStones.length)];
                return GameBoard.RemoveStoneFromField(stone);
            default:
                // normally this should not happen as AI is not called then but if, log it
                console.error(`[AI] No action possible at game phase ${Game.phase}!`);
                return false;
        }
    } 
}