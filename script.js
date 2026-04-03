const doc = document.documentElement;
const landscape = window.matchMedia("(orientation: landscape)");
const board = document.querySelector(".board");
const fragment = document.createDocumentFragment();
const gameBoard = document.querySelector(".game-board");
const line = document.querySelector("#line");
const game = document.querySelector("#game");
const instructions = document.querySelector("#message");
const begin = document.querySelector("#begin");
const startWindow = document.querySelector(".start-window");
const dice = document.querySelectorAll(".dices span");
const rollDice = document.querySelector("#roll-dice");
const submit = document.querySelector("#submit");
const rolled = document.querySelector("#rolled");
const mode = document.querySelector(".mode");
const player2 = document.querySelector(".player2");
const scores = document.querySelectorAll(".score div");
const gameOverbase = document.querySelector(".game-over-base");
const message1 = document.querySelector(".game-over1");
const message2 = document.querySelector(".game-over2");
const continue2 = document.querySelector("#continue2");
const showScore = document.querySelector("#final-score");
const showScoreBtn = document.querySelector("#continue1");
const wrongCombo = document.querySelector("#wrong-combo");
const meme = document.querySelector("#meme-base");
const video = document.querySelector("#main-meme");
const backMessage = document.querySelector("#back-message");
const endButton = document.querySelector("#end");
const returnButton = document.querySelector("#return");
const beginAudio = new Audio("memes for game/Begin.mp3");
const endAudio = new Audio("memes for game/end.mp3");
const backAudio = new Audio("memes for game/back meme/back.mp3");
const click1 = new Audio("click-1.mp3");
const click2 = new Audio("click-2.mp3");
const diceSound = new Audio("dice sound.mp3");
let tiles, tileCount, tilesList, twoPlayer, point1, point2, previousRolled, end = false,
    downTiles = [],
    currentTiles;


// showing rules and begin button
gameOverbase.style.display = "none";
game.style.display = "none";
begin.addEventListener("click", e => {
    if (Number(mode.value) >= 9) {
        doc.requestFullscreen().then(() => {
            screen.orientation.lock("landscape");
        }).then(() => {
            beginAudio.play();

            game.style.display = "block";
            startWindow.style.display = "none";

            // seting mode of game whether it is 9 tiles or 12 tiles
            tileCount = Number(mode.value);
            tilesList = (tileCount == 9) ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            for (let i = 1; i <= tileCount; i++) {
                const box = document.createElement("button");
                box.id = i;
                box.className = "box";
                box.innerText = i;
                fragment.appendChild(box)
            }
            board.appendChild(fragment);
            tiles = document.querySelectorAll(".board .box")
            if (tileCount > 9) {
                board.style.gap = `${tileCount / 2.5}px`;
                gameBoard.style.width = "92vw"
                line.style.width = "92vw"
            } else {
                board.style.gap = `${tileCount / 1.5}px`;
                gameBoard.style.width = "72vw"
                line.style.width = "72vw"
            }
            if (Number(mode.options[mode.selectedIndex].id) == 91 || Number(mode.options[mode.selectedIndex].id) == 121) {
                player2.style.display = "none";
                twoPlayer = false;
            } else {
                twoPlayer = true;
            }
        });
    } else {
        alert("Please Select Mode First...");
    }
});

// if try to escape the game
landscape.addEventListener("change", e => {
    if (!landscape.matches) {
        backAudio.play();
        game.style.display = "none";
        instructions.style.display = "none";
        backMessage.style.display = "flex";
        startWindow.style.display = "flex";

        returnButton.addEventListener("click", e => {
            doc.requestFullscreen().then(() => {
                screen.orientation.lock("landscape");
            }).then(() => {
                backAudio.pause();
                startWindow.style.display = "none";
                game.style.display = "block";
            });
        });

        endButton.addEventListener("click", e => {
            location.reload();
        })
    }
});


// all the working of dice and action on rolled dice clicked
for (let i = 0; i <= 1; i++) {
    dice[i].style.backgroundImage = "url(6.jpg)";
}
let dice1, dice2, rolledNo;
rollDice.addEventListener("click", e => {
    diceSound.play();
    for (let j = 1; j <= 7; j++) {
        const rollTImeout = setTimeout(() => {
            for (let i = 0; i <= 1; i++) {
                if (i == 0) {
                    dice1 = Math.floor(Math.random() * 6) + 1;
                    dice[i].style.backgroundImage = `url(${dice1}.jpg)`;
                } else {
                    dice2 = Math.floor(Math.random() * 6) + 1;
                    dice[i].style.backgroundImage = `url(${dice2}.jpg)`;
                }
            }
            if (j == 7) {
                rolled.style.visibility = "visible";
                rolledNo = dice1 + dice2;
                if (rolledNo == previousRolled) {
                    rolledSame();
                    wrongCombo.innerText = `ROLLED ${rolledNo} AGAIN`;
                    wrongCombo.style.visibility = "visible";
                    setTimeout(() => {
                        wrongCombo.style.visibility = "hidden";
                        wrongCombo.innerText = "WRONG COMBINATION";
                    }, 1000);
                }
                previousRolled = rolledNo;
                rolled.innerText = rolledNo;
                rollDice.disabled = true;
                if (rolledNo == 12) {
                    rolled12();
                }
                main();
            }
        }, j * 50);
    }
})


// main game logic (submit button working)
function main() {

    // tiles clicks
    for (let i = 0; i <= tileCount - 1; i++) {
        tiles[i].onclick = () => {
            console.log("clicked");
            if (tiles[i].style.top == "25vh") {
                tiles[i].style.top = "0";
                click2.play();
                downTiles.splice(downTiles.indexOf(i + 1), 1);
            } else {
                tiles[i].style.top = "25vh";
                click1.play();
                downTiles.push(i + 1);
            }
        };
    }

    let high = rolledNo;
    while (!tilesList.includes(high)) {
        high -= 1;
        if (tilesList[0] > high) {
            break
        }
        if (high < 0) {
            break
        }
    }
    currentTiles = tilesList.slice(0, tilesList.indexOf(high) + 1);
    downTiles.sort((a, b) => a - b);

    submit.addEventListener("click", () => {
        if (tilesList.length == 0) {
            gameOver();
            allTilesDown();
        }
        if (downTiles.length == 1) {
            if (downTiles[0] == rolledNo) {
                tiles.forEach(e => {
                    if (e.id == downTiles[0]) {
                        e.disabled = true;
                    }
                });
                tilesList.splice(tilesList.indexOf(downTiles[0]), 1);
                downTiles = [];
                rollDice.disabled = false;
        rolledNo = null;
        rolled.style.visibility = "hidden";

            } else {
                // console.log("wrong combination...");
                wrongCombination();
                wrongCombo.style.visibility = "visible";
                setTimeout(() => {
                    wrongCombo.style.visibility = "hidden";
                }, 1000);
            }
        } else if (downTiles.length == 2) {
            if (downTiles[0] + downTiles[1] == rolledNo) {
                for (let i = 0; i < tiles.length; i++) {
                    if (tiles[i].id == downTiles[0] || tiles[i].id == downTiles[1]) {
                        tiles[i].disabled = true;
                    }
                }
                tilesList.splice(tilesList.indexOf(downTiles[0]), 1);
                tilesList.splice(tilesList.indexOf(downTiles[1]), 1);
                downTiles = [];
                rollDice.disabled = false;
        rolledNo = null;
        rolled.style.visibility = "hidden";
            } else {
                // console.log("wrong combination...");
                wrongCombination();
                wrongCombo.style.visibility = "visible";
                setTimeout(() => {
                    wrongCombo.style.visibility = "hidden";
                }, 1000);
            }
        } else if (downTiles.length == 3) {
            if (downTiles[0] + downTiles[1] + downTiles[2] == rolledNo) {
                for (let i = 0; i < tiles.length; i++) {
                    if (tiles[i].id == downTiles[0] || tiles[i].id == downTiles[1] || tiles[i].id == downTiles[2]) {
                        tiles[i].disabled = true;
                    }
                }
                tilesList.splice(tilesList.indexOf(downTiles[0]), 1);
                tilesList.splice(tilesList.indexOf(downTiles[1]), 1);
                tilesList.splice(tilesList.indexOf(downTiles[2]), 1);
                downTiles = [];
                rollDice.disabled = false;
        rolledNo = null;
        rolled.style.visibility = "hidden";
                tripleDown();
            } else {
                // console.log("wrong combination...");
                wrongCombination();
                wrongCombo.style.visibility = "visible";
                setTimeout(() => {
                    wrongCombo.style.visibility = "hidden";
                }, 1000);
            }
        }


        if (downTiles.length > 3) {
            // console.log("max 3 tiles should down");
            wrongCombination();
            wrongCombo.innerText = "ONLY 3 TILES DOWN";
            wrongCombo.style.visibility = "visible";
            setTimeout(() => {
                wrongCombo.style.visibility = "hidden";
                wrongCombo.innerText = "WRONG COMBINATION";
            }, 1000);
        }
    })

    console.log(tilesList, currentTiles, downTiles)
    check();

}


// function for checking if rolled dice combination is possible or not,
// otherwise terminating the program and displaying gameover screen
function check() {

    let stopdb = false;
    for (let i = 0; i < currentTiles.length; i++) {
        if (stopdb) {
            break;
        }
        let j = i + 1;
        for (j; j < currentTiles.length; j++) {
            let sumdb = currentTiles[i] + currentTiles[j];
            if (sumdb == rolledNo) {
                stopdb = true;
                console.log("db possible")
                break;
            }
        }
    }

    let stoptp = false;
    if (rolledNo > 5) {
        for (let i = 0; i < currentTiles.length; i++) {
            if (stoptp) {
                break;
            }
            let l = i + 1;
            for (l; l < currentTiles.length; l++) {
                if (stoptp) {
                    break;
                }
                let k = l + 1;
                for (k; k < currentTiles.length; k++) {
                    let sumtp = currentTiles[i] + currentTiles[l] + currentTiles[k];
                    if (sumtp == rolledNo) {
                        stoptp = true;
                        console.log("tp possible")
                        break;
                    }
                }
            }
        }
    }


    if (!stoptp) { //checking if triple tiles down are possible
        console.log("tp not possible");
        if (!stopdb) { //checking if double tiles down are possible
            console.log("db not possible");
            if (!currentTiles.includes(rolledNo)) { //checking if single tile down is possible
                console.log("single not possible");
                gameOver();
                gameOverMeme();
            }
        }
    }

}


// game over function
function gameOver() {
    if (twoPlayer) {
        if (end) {
            point2 = 0;
            for (let i = 0; i < tilesList.length; i++) {
                point2 = point2 + tilesList[i];
            }
            scores[3].innerText = point2;
            finalOver();
        } else {
            changeTurn();
        }
    } else {
        finalOver();
    }
}


// changing turns of player
function changeTurn() {
    gameOverbase.style.display = "flex";
    continue2.addEventListener("click", e => {
        for (let i = 0; i < tileCount; i++) {
            tiles[i].style.top = "0";
            tiles[i].disabled = false;
        }
        rolled.style.visibility = "hidden";
        rollDice.disabled = false;
        rolledNo = null;
        point1 = 0;
        for (let i = 0; i < tilesList.length; i++) {
            point1 = point1 + tilesList[i];
        }
        scores[1].innerText = point1;
        tilesList = (tileCount == 9) ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        gameOverbase.style.display = "none";
        end = true;
    })
}


// final over function
function finalOver() {
    gameOverbase.style.display = "flex";
    message1.style.display = "flex";
    message2.style.display = "none";
    showScoreBtn.addEventListener("click", () => {
        if (twoPlayer) {
            let winner = (point1 > point2) ? "Player 2 Won" : "Player 1 Won";
            showScore.innerText = `Player 1: ${point1} || Player 2: ${point2} \n------- ${winner} -------`;
            showScoreBtn.innerText = "End";
            showScoreBtn.addEventListener("click", () => {
                video.pause();
                endAudio.play();
                game.style.display = "none";
                startWindow.style.display = "none";
                endAudio.addEventListener("ended", () => {
                // document.exitFullscreen();
                    location.reload();
                })
            });
        } else {
            let point = 0;
            for (let i = 0; i < tilesList.length; i++) {
                point = point + tilesList[i];
            }
            scores[1].innerText = point;
            showScore.innerText = `Your Score: ${point}`;
            showScoreBtn.innerText = "End";
            showScoreBtn.addEventListener("click", () => {
                video.pause();
                endAudio.play();
                game.style.display = "none";
                startWindow.style.display = "none";
                endAudio.addEventListener("ended", () => {
                // document.exitFullscreen();
                    location.reload();
                })
            });
        }
        showScore.style.visibility = "visible";
    });
    console.log("game over");
}


function rolled12() {
    meme.style.visibility = "visible";
    let srcCode = Math.floor(Math.random() * 7) + 1;
    video.src = `memes for game/rolled_12/${srcCode}.mp4`;
    video.muted = false;
    video.play();
    video.addEventListener("ended", () => {
        video.pause();
        meme.style.visibility = "hidden";
    })
}

function wrongCombination() {
    meme.style.visibility = "visible";
    let srcCode = Math.floor(Math.random() * 5) + 1;
    video.src = `https://github.com/Himanshu-thakre/Shut-The-Box-Game/raw/refs/heads/main/memes%20for%20game/all%20tiles%20down/${srcCode}.mp4`;
    video.muted = false;
    video.load();
    video.play();
    video.addEventListener("ended", () => {
        video.pause();
        meme.style.visibility = "hidden";
    });
}

function gameOverMeme() {
    meme.style.visibility = "visible";
    let srcCode = Math.floor(Math.random() * 5) + 1;
    video.src = `memes for game/game over/${srcCode}.mp4`;
    video.muted = false;
    video.play();
    video.addEventListener("ended", () => {
        video.pause();
        meme.style.visibility = "hidden";
    });
}

function allTilesDown() {
    meme.style.visibility = "visible";
    let srcCode = Math.floor(Math.random() * 7) + 1;
    video.src = `memes for game/all tiles down/${srcCode}.mp4`;
    video.muted = false;
    video.play();
    video.addEventListener("ended", () => {
        video.pause();
        meme.style.visibility = "hidden";
    });
}

function tripleDown() {
    meme.style.visibility = "visible";
    let srcCode = Math.floor(Math.random() * 10) + 1;
    video.src = `memes for game/triple down/${srcCode}.mp4`;
    video.muted = false;
    video.play();
    video.addEventListener("ended", () => {
        video.pause();
        meme.style.visibility = "hidden";
    });
}

function rolledSame() {
    meme.style.visibility = "visible";
    let srcCode = Math.floor(Math.random() * 10) + 1;
    video.src = `memes for game/rolled same/${srcCode}.mp4`;
    video.muted = false;
    video.play();
    video.addEventListener("ended", () => {
        video.pause();
        meme.style.visibility = "hidden";
    });
}




































// end
