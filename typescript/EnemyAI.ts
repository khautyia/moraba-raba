/**
 * Interface defining which methods and properties an AI has to implement
 */
interface EnemyAI {
    /** Color the enemy AI plays for */
    color : StoneColor;
    /**
     * Method that is called if AI has to perform a move.
     * Depending on Game.phase a move should be done using functions:
     * - GameBoard.MoveCurrentStoneToField(field)
     * - GameBoard.MoveStoneToField(stone, field)
     * - GameBoard.RemoveStoneFromField(stone)
     * @returns {boolean} if the AI performed a move.
     */
    MakeMove() : boolean;
    
}