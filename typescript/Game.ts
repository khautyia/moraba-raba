/**
 * Static class providing the current game state and general functions to control the game.
 */
class Game {
    /** Curent game phase */
    static phase : GamePhase;
    /** Game turn (removing stones not counting) */
    static turn : number;
    /** Current player */
    static currentPlayer : StoneColor;
    /** 
     * Numbers describing the type of AI for each player.
     */
    static playerAINumber : [GameAI, GameAI] = [GameAI.Easy,GameAI.Human];
    /** Set if a player is played by computer */
    static playerAI : Array<EnemyAI> = [null, null];
    /** How long AI will sleep/calculate before deciding its next move */
    static aiDecisionTime = 500; // ms
    /** Turns statistics mode on or off */
    static statMode = false;
    /** Telling if game is in nature design or not */
    static natureDesign = true;
    /** Activates the debug log, can be set via the browser console. */
    static debugLog = false;

    /**
     * Reset and start new game.
     */
    static Start() : void {
        Game.Reset();
        Game.phase = GamePhase.PlacingStones;

        GameBoard.UpdateProperties();
        GameBoard.TryAIMove();
    }
    
    /**
     * Reset game and set phase to menu.
     */
    static Reset() : void {
        // Create new AI players
        this.InitializeAIs();
        Game.phase = GamePhase.Menu;
        Game.turn = 0;
        Game.currentPlayer = StoneColor.White;
        
        GameBoard.Initialize();
    }

    /**
     * Triggers the winner screen after a game.
     */
    static ShowWinnerScreen() : void {
        Game.phase = GamePhase.WinnerScreen;
        GameBoard.UpdateProperties();
        winnerScreenText.innerText = (Game.currentPlayer == 1 ? "White" : "Black") + " wins!";
        winnerScreen.style.display = 'table';
    }
    /**
     * Triggers the draw screen after a game.
     */
    static ShowDrawScreen() : void {
        Game.phase = GamePhase.DrawScreen;
        GameBoard.UpdateProperties();
        winnerScreenText.innerText = "Game is drawn!";
        winnerScreen.style.display = 'table';
    }

    private static countWin : number[] = [0,0];
    private static countDraw : number = 0;
    /**
     * Initializes Statistics Mode where game restarts automatically
     * and winners will be counted and displayed in the footer.
     */
    static StartStatMode() : void {
        this.countWin = [0,0];
        this.countDraw = 0;
        this.AutoPlayStatistics();
    }
    /**
     * Checks in Stat Mode if game ended and if so logs it and restarts.
     */
    static AutoPlayStatistics() : void {
        if (Game.phase == GamePhase.WinnerScreen || Game.phase == GamePhase.DrawScreen) {
            if (Game.phase == GamePhase.WinnerScreen) this.countWin[Game.currentPlayer]++;
            else this.countDraw++;
            const infoText = `White: ${this.countWin[StoneColor.White]}`
                +` - Black: ${this.countWin[StoneColor.Black]}`
                +` - Draw: ${this.countDraw}`
                +` (Total: ${this.countWin[StoneColor.Black]+this.countWin[StoneColor.White]+this.countDraw})`;
            console.info(infoText);
            footer.innerHTML = infoText;
            Game.Start();
            winnerScreen.style.display = 'none';
        } else if (Game.phase == GamePhase.Menu) {
            return; // no new call to function (menu interrupts)
        }
        setTimeout(() => this.AutoPlayStatistics(), 100);
    }
    /**
     * Initializes the player AIs according to playerAINumber.
     */
    static InitializeAIs() : void {
        [StoneColor.Black,StoneColor.White].forEach(color => {
            switch(this.playerAINumber[color]) {
                case GameAI.Random:
                    Game.playerAI[color] = new EnemyAIRandom(color);
                    break;
                case GameAI.Easy:
                    Game.playerAI[color] = new EnemyAIPrimitive(color);
                    break;
                case GameAI.Medium:
                    Game.playerAI[color] = new EnemyAIMinimax(color, true);
                    break;
                case GameAI.Strong:
                    Game.playerAI[color] = new EnemyAIMinimax(color, false);
                    break;
                default: // human
                    Game.playerAI[color] = null;
                    break;
            }
        });
    }
}