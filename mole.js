let currMoleTile; // 현재 두더지가 있는 타일
let currPlantTile; // 현재 식물이 있는 타일
let currGoldenMushroomTile; // 현재 황금버섯이 있는 타일(2일차)
let score = 0; // 점수 초기화
let gameOver = false; // 게임 종료 상태 초기화
let moleCount = 0; // 두더지가 나온 횟수(2일차)
let lives = 3; // 목숨 초기화(2일차)
const lifeImage = "./heart.png"; // 정상 목숨 아이콘 (2일차)
const lifeImageEmpty = "./unheart.png"; // 깎인 목숨 아이콘 (2일차) 
let timer; // 타이머 변수 (3일차)

window.onload = function() {
    document.getElementById("start-button").addEventListener("click", startGame);
}

// 게임 시작 함수
function startGame() {
    document.getElementById("start-screen").style.display = "none";
    setTimeout(() => {
        document.getElementById("game-screen").style.display = "block";
        initLives(); // 목숨 초기화(2일차)
        setGame();
        startTimer(); // 타이머 시작(3일차)
    }, 300);
}

// 타이머 시작 함수 (3일차)
function startTimer() {
    let timeRemaining = 60;
    document.getElementById("timer").innerHTML = timeRemaining;

    timer = setInterval(() => {
        timeRemaining--;
        document.getElementById("timer").innerHTML = timeRemaining;

        if (timeRemaining <= 0) {
            clearInterval(timer);
            if(score < 200) {
                document.getElementById("score").innerHTML = "GAME OVER: " + score.toString();
                gameOver = true;
            }
        }
    }, 1000);
}

// 게임 설정 함수
function setGame() {
    for (let i = 0; i < 9; i++) {
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        document.getElementById("board").appendChild(tile);
    }

    setInterval(setMole, 1000); // 매 1초마다 두더지 설정
    setInterval(setPlant, 2000); // 매 2초마다 식물 설정
}

// 랜덤 타일 번호 생성 함수
function getRandomTile() {
    let num = Math.floor(Math.random() * 9);
    return num.toString();
}

// 두더지 설정 함수
function setMole() {
    if (gameOver) {
        return;
    }

    if (currMoleTile) {
        currMoleTile.innerHTML = "";
    }

    let mole = document.createElement("img");
    mole.src = "./monty-mole.png";

    let num = getRandomTile();
    if ((currPlantTile && currPlantTile.id == num) || (currGoldenMushroomTile && currGoldenMushroomTile.id == num)) {
        return;
    }
    currMoleTile = document.getElementById(num);
    currMoleTile.appendChild(mole);
    moleCount++;

    //2일차
    if (moleCount >= 10) {
        setGoldenMushroom();
        moleCount = 0; // 황금버섯이 나타난 후 두더지 카운트를 초기화
    }
}

// 식물 설정 함수
function setPlant() {
    if (gameOver) {
        return;
    }

    if (currPlantTile) {
        currPlantTile.innerHTML = "";
    }

    let plant = document.createElement("img");
    plant.src = "./piranha-plant.png";

    let num = getRandomTile();
    if ((currMoleTile && currMoleTile.id == num) || (currGoldenMushroomTile && currGoldenMushroomTile.id == num)) {
        return;
    }
    currPlantTile = document.getElementById(num);
    currPlantTile.appendChild(plant);
}

// 황금버섯 설정 함수(2일차)
function setGoldenMushroom() {
    if (gameOver) {
        return;
    }

    if (currGoldenMushroomTile) {
        currGoldenMushroomTile.innerHTML = "";
    }

    let goldenMushroom = document.createElement("img");
    goldenMushroom.src = "./golden-mushroom.png";

    let num = getRandomTile();
    if ((currMoleTile && currMoleTile.id == num) || (currPlantTile && currPlantTile.id == num)) {
        return;
    }
    currGoldenMushroomTile = document.getElementById(num);
    currGoldenMushroomTile.appendChild(goldenMushroom);

    // 1초 후에 황금버섯 제거
    setTimeout(() => {
        if (currGoldenMushroomTile) {
            currGoldenMushroomTile.innerHTML = "";
            currGoldenMushroomTile = null;
        }
    }, 1000);
}

// 타일 선택 함수
function selectTile() {
    if (gameOver) {
        return;
    }

    if (this == currMoleTile) {
        score += 10;
        document.getElementById("score").innerHTML = score.toString();
        setMole(); // 두더지를 새로운 위치로 이동
        if (score >= 200) {
            document.getElementById("score").innerHTML = "YOU WIN: " + score.toString();
            gameOver = true;
        }
    } else if (this == currPlantTile) { //2일차
        lives -= 1; // 목숨 감소
        updateLives(); // 목숨 업데이트
        if (lives <= 0) {
            document.getElementById("score").innerHTML = "GAME OVER: " + score.toString();
            gameOver = true;
        }
    } else if (this == currGoldenMushroomTile) {
        score += 50;
        document.getElementById("score").innerHTML = score.toString();
        currGoldenMushroomTile.innerHTML = "";
        currGoldenMushroomTile = null;
    }
}

// 목숨 이미지 배열(2일차)
function initLives() {
    let container = document.getElementById("lives-container");
    container.innerHTML = ""; // 기존 목숨 아이콘 제거

    for (let i = 0; i < lives; i++) {
        let img = document.createElement("img");
        img.src = lifeImage;
        container.appendChild(img);
    }
}

// 목숨 업데이트 함수(2일차)
function updateLives() {
    let container = document.getElementById("lives-container");
    let children = container.children;
    
    for (let i = 0; i < children.length; i++) {
        if (i < lives) {
            children[i].src = lifeImage;
        } else {
            children[i].src = lifeImageEmpty;
        }
    }
}

