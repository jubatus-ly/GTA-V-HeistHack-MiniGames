import { sample } from "./helpers";
import { COLORS, generateRandomPuzzle } from "./laptop-puzzle-factory";
import "./laptop.scss";
import { getPuzzleSvg } from "./svg-factory";

const puzzleLength = 4;
const tryAgainButton = document.getElementById('try-again-button');
const tryAgainElements = document.querySelector('div.center-error-message');
const containerPuzzle = document.getElementById('container-puzzle');
tryAgainButton?.addEventListener('click', tryAgain);

const loadingArr = ["etablisement de la connection", "faire des trucs de hackerman...", "code d'accès indiqué; nécessite une saisie captcha humaine..."];

function loadingHack():void {
    const tryAgainImg = tryAgainElements?.getElementsByTagName('img')[0];
    const loadingText = tryAgainElements?.getElementsByTagName('h3')[0];
    tryAgainImg!.src = '../../../asset/laptop/spy.png';

    let arrPromises: Promise<void>[] = [];
    let promise: Promise<void>;

    for(let i=0; i<loadingArr.length; i++) {
    
            promise = new Promise<void>((resolve) => {
                setTimeout(() => {
                    if (loadingText) {
                        loadingText.getElementsByTagName('span')[0].innerHTML = loadingArr[i][0].toUpperCase();
                        loadingText.childNodes[2].textContent = loadingArr[i].slice(1).toUpperCase();
                        console.log("changement "+ i);
                        resolve();
                    } 
                }, i * 1000);
            })

            arrPromises.push(promise);
        
    }


    Promise.all(arrPromises).then(() => {
        setTimeout(() => {
            tryAgainElements?.classList.add('hidden');
            containerPuzzle?.classList.remove('hidden');
        }, 1000);
    });

    hack(puzzleLength);

}

async function tryAgain():Promise<void> {
    loadingHack();

}

async function init():Promise<void> {
    loadingHack();

}

function hack(numberSquare: number) {
    console.log('This is function does the logic of the hacking');
    const containerPuzzle: HTMLElement = document.getElementById("container-puzzle")!;
    const arrPuzzleNumber: number[] =  [...Array(puzzleLength)].map((_, a) => a+1);
    const arrPromisesHideNumbers: Promise<void>[] = [];
    for (let i=0; i<numberSquare; i++) {
        const divPuzzle = document.createElement('div');
        divPuzzle.classList.add('square');
        const squareNumber = i + 1;
        divPuzzle.id = "square-" + squareNumber;
        const index = Math.floor(Math.random() * arrPuzzleNumber.length);
        const p : Promise<void> = displayNumbers(divPuzzle, arrPuzzleNumber[index], i).then(() => {
            console.log(`Number ${arrPuzzleNumber[index]} has finished its animation.`);
        });
        arrPromisesHideNumbers.push(p);
        arrPuzzleNumber.splice(index, 1);
        containerPuzzle.appendChild(divPuzzle);
    }

    Promise.all(arrPromisesHideNumbers).then(() => {
        const squaresElement : NodeListOf<HTMLElement> = document.querySelectorAll('.square')!;
        squaresElement.forEach((value) => {
            value.querySelector('div')?.remove();
            const puzzle = generateRandomPuzzle();
            value.style.background = sample(Object.keys(COLORS));
            while(puzzle.shape === value.style.background) value.style.background = sample(Object.keys(COLORS)); 
            const puzzleSVG = getPuzzleSvg(puzzle);
            value.innerHTML = puzzleSVG;
            const answerSection = document.getElementById('answer-container');
            answerSection?.classList.remove('hidden');
        });
    });

}

function displayNumbers(divPuzzle: HTMLElement, num: number, index: number): Promise<void> {
    const numberContainer: HTMLElement = document.createElement('div'); 
    numberContainer.innerHTML = `${num}`;
    numberContainer.classList.add('can-shrink');
    numberContainer.id = `num-${index + 1}`;
    divPuzzle.appendChild(numberContainer);

    return new Promise<void>((resolve) => 
        setTimeout(() => {
            numberContainer.classList.add('number-shrink');
            // Listen for the transitionend event
            numberContainer.addEventListener('transitionend', () => {
                resolve();
            }, { once: true });
        }, 4000));

}


init();

