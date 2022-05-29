/**
 * Own primitive datatype for storing positions ((0,0) is top left field).
 */
interface FieldPosition { x: number; y: number; }

/**
 * Enum for the different possible game phases
 */
const enum GamePhase {Menu, PlacingStones, MovingStones, RemovingStone, WinnerScreen, DrawScreen};
/**
 * Enum for the two player colors
 */
const enum StoneColor {Black, White};
/** Enum with the different possible AIs */
enum GameAI {Human, Random, Easy, Medium, Strong};

// Declare variables to globally access gameBoard and gameMenu
let gameMenu : HTMLDivElement;
let gameBoard : HTMLDivElement;
let winnerScreen : HTMLDivElement;
let winnerScreenText : HTMLSpanElement;
let footer : HTMLParagraphElement;

/**
 * This function is called when page finished loading.
 */
function onLoad() : void {
    gameMenu = <HTMLDivElement> document.getElementById("gameMenu");
    gameBoard = <HTMLDivElement> document.getElementById("gameBoard");
    winnerScreen = <HTMLDivElement> document.getElementById("winnerScreen");
    winnerScreenText = <HTMLSpanElement> document.getElementById("winnerScreenText");
    footer = document.getElementsByTagName('footer')[0].getElementsByTagName('p')[0];
    Game.Reset();

    // Needed for menu:
    // Close the dropdown menu if the user clicks outside of it
    window.onclick = function(event) {
        if (!(<HTMLElement> event.target).matches('.dropbtn')) {
            const dropdowns = document.getElementsByClassName("dropdown-content");
            for (let i = 0; i < dropdowns.length; i++)
                dropdowns[i].classList.remove('show');
        }
    }

    Menu.ShowInfoOverlay(
        "In the menu you can set who will play for the white and the black stones. "
        +"'Human' means this color will be played by you or a partner and all other "
        +"possibilities refer to the strength of a computer enemy.<br>"
        +"Have fun!", "Welcome!");
}