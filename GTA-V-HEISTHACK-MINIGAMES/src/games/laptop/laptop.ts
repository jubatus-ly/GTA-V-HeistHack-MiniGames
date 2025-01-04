import { sample } from './helpers'
import {
  COLORS,
  generateQuestionAndAnswer,
  generateRandomPuzzle,
  PuzzleData,
} from './laptop-puzzle-factory'
import './laptop.scss'
import { getPuzzleSvg } from './svg-factory'

const puzzleLength = 4
const tryAgainButton = document.getElementById('try-again-button')
const tryAgainElements = document.querySelector('div.center-error-message')
const containerPuzzle: HTMLElement =
  document.getElementById('container-puzzle')!
tryAgainButton?.addEventListener('click', tryAgain)

const loadingArr = [
  'etablisement de la connection',
  'faire des trucs de hackerman...',
  "code d'accès indiqué; nécessite une saisie captcha humaine...",
]

function loadingHack(): void {
  const tryAgainImg = tryAgainElements?.getElementsByTagName('img')[0]
  const loadingText = tryAgainElements?.getElementsByTagName('h3')[0]
  tryAgainImg!.src = '../../../asset/laptop/spy.png'

  const arrPromises: Promise<void>[] = []
  let promise: Promise<void>

  for (let i = 0; i < loadingArr.length; i++) {
    promise = new Promise<void>((resolve) => {
      setTimeout(() => {
        if (loadingText) {
          loadingText.getElementsByTagName('span')[0].innerHTML =
            loadingArr[i][0].toUpperCase()
          loadingText.childNodes[2].textContent = loadingArr[i]
            .slice(1)
            .toUpperCase()
          console.log('changement ' + i)
          resolve()
        }
      }, i * 1000)
    })

    arrPromises.push(promise)
  }

  Promise.all(arrPromises).then(() => {
    setTimeout(() => {
      tryAgainElements?.classList.add('hidden')
      containerPuzzle?.classList.remove('hidden')
    }, 1000)
  })

  hack(puzzleLength)
}

async function tryAgain(): Promise<void> {
  loadingHack()
}

async function init(): Promise<void> {
  loadingHack()
}

function hack(numberSquare: number) {
  console.log('This is function does the logic of the hacking')
  // const containerPuzzle: HTMLElement = document.getElementById("container-puzzle")!;
  const arrPuzzleNumber: number[] = [...Array(puzzleLength)].map(
    (_, a) => a + 1
  )
  const arrPromisesHideNumbers: Promise<void>[] = []
  const arrIndexPuzzleNumber: number[] = []
  for (let i = 0; i < numberSquare; i++) {
    const divPuzzle = document.createElement('div')
    divPuzzle.classList.add('square')
    const squareNumber = i + 1
    divPuzzle.id = 'square-' + squareNumber
    const index = Math.floor(Math.random() * arrPuzzleNumber.length)
    arrIndexPuzzleNumber.push(arrPuzzleNumber[index])
    const p: Promise<void> = displayNumbers(
      divPuzzle,
      arrPuzzleNumber[index],
      i
    ).then(() => {
      console.log(
        `Number ${arrPuzzleNumber[index]} has finished its animation.`
      )
    })
    arrPromisesHideNumbers.push(p)
    arrPuzzleNumber.splice(index, 1)
    containerPuzzle.appendChild(divPuzzle)
  }

  const arrGeneratedPuzzle: PuzzleData[] = []
  Promise.all(arrPromisesHideNumbers).then(async () => {
    const squaresElement: NodeListOf<HTMLElement> =
      document.querySelectorAll('.square')!
    squaresElement.forEach((value) => {
      value.querySelector('div')?.remove()
      const puzzle = generateRandomPuzzle()
      arrGeneratedPuzzle.push(puzzle)
      value.style.background = sample(Object.keys(COLORS))
      while (puzzle.shape === value.style.background)
        value.style.background = sample(Object.keys(COLORS))
      const puzzleSVG = getPuzzleSvg(puzzle)
      value.innerHTML = puzzleSVG
    })

    const answerSection = document.getElementById('answer-container')
    answerSection?.classList.remove('hidden')
    const [question, answer] = generateQuestionAndAnswer(
      arrIndexPuzzleNumber,
      arrGeneratedPuzzle
    )
    const questionDiv = answerSection!.querySelector('.question')!
    questionDiv.innerHTML = question
    console.log('Question: ' + question + ' Answer: ' + answer)

    ResultPuzzle(answer)
  })
}

function displayNumbers(
  divPuzzle: HTMLElement,
  num: number,
  index: number
): Promise<void> {
  const numberContainer: HTMLElement = document.createElement('div')
  numberContainer.innerHTML = `${num}`
  numberContainer.classList.add('can-shrink')
  numberContainer.id = `num-${index + 1}`
  divPuzzle.appendChild(numberContainer)

  return new Promise<void>((resolve) =>
    setTimeout(() => {
      numberContainer.classList.add('number-shrink')
      // Listen for the transitionend event
      numberContainer.addEventListener(
        'transitionend',
        () => {
          resolve()
        },
        { once: true }
      )
    }, 4000)
  )
}

const timerPuzzleSecond = 10
const answerContainer: HTMLElement =
  document.getElementById('answer-container')!
const progressBar: HTMLElement = document.querySelector('div.progress-bar')!
const inputPuzzle: HTMLInputElement = document.getElementById(
  'answer-placeholder'
) as HTMLInputElement
// the doPuzzle() function either shows the visual try again or visual new puzzle
function doPuzzle(timerMs: number): Promise<string | null> {
  progressBar.style.transition = `width ${timerMs}ms linear`
  setTimeout(() => {
    progressBar.classList.add('progress-bar-shrink')
  }, 0)

  return new Promise((resolve) => {
    inputPuzzle.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        resolve(inputPuzzle.value)
      }
    })

    setTimeout(() => {
      resolve(null)
    }, timerMs)
  })
  // waiting for an answer and if it returns a respond and enter ==> stop (get the result)
  // waiting for an answer but there is not input or there is and timer finished without enter ==> stop (get the result)
  // final: hide the visual answer question and either show the visual try again or the visual new puzzle
}

async function ResultPuzzle(answer: string): Promise<void> {
  const tryAgainImg = tryAgainElements?.getElementsByTagName('img')[0]
  const loadingText = tryAgainElements?.getElementsByTagName('h3')[0]
  tryAgainImg!.src = '../../../asset/laptop/spy.png'

  let result = true

  for (let i = 0; i < 4 && result; i++) {
    const response = await doPuzzle(timerPuzzleSecond * 10000).then()
    result = response != null && response === answer
  }

  if (result) {
    // For the system to be Bypassed it needs to have 4 puzzles
    console.log('The System Has Been Bypassed By The Hacker')
  } else {
    console.log(containerPuzzle)
    containerPuzzle.classList.add('hidden')
    tryAgainElements!.classList.remove('hidden')
    answerContainer.classList.add('hidden')
    tryAgainImg!.src = '../../../asset/laptop/failed.png'
    loadingText!.innerHTML = "THE SYSTEM DIDN'T ACCEPT YOUR ANSWERS"
  }
}

init()
