import { sample } from './helpers'
import {
  COLORS,
  generateQuestionAndAnswer,
  generateRandomPuzzle,
  PuzzleData,
} from './laptop-puzzle-factory'
import './laptop.scss'
import { getPuzzleSvg } from './svg-factory'

const totalPuzzles = 4
const tryAgainContainer = document.getElementById('try-again-id')!
const tryAgainButton = document.getElementById('try-again-button')
const centerMessageContainer = document.querySelector('div.center-message')!
const puzzlesContainer: HTMLElement =
  document.getElementById('container-puzzle')!
tryAgainButton?.addEventListener('click', tryAgain)
const arrGeneratedPuzzle: PuzzleData[] = []
const arrIndexPuzzleNumber: number[] = []
let submitted: string | null
let result: boolean = true
let answer: string = ''
const loadingArr = [
  'etablisement de la connection',
  'faire des trucs de hackerman...',
  "code d'accès indiqué; nécessite une saisie captcha humaine...",
]
const timerPuzzleSecond = 10
const answerContainer: HTMLElement =
  document.getElementById('answer-container')!
const progressBar: HTMLElement = document.querySelector('div.progress-bar')!
const inputPuzzle: HTMLInputElement = document.getElementById(
  'answer-placeholder'
) as HTMLInputElement
const tryAgainImg = centerMessageContainer.getElementsByTagName('img')[0]
const loadingText = centerMessageContainer.getElementsByTagName('h3')[0]
const tryAgainHint = document.querySelector('.try-again-hint')!

async function loadingHack(): Promise<void> {
  tryAgainImg!.src = '../../../asset/laptop/spy.png'

  const arrPromises: Promise<void>[] = []
  let promise: Promise<void>

  for (let i = 0; i < loadingArr.length; i++) {
    promise = new Promise<void>((resolve) => {
      setTimeout(() => {
        loadingText.getElementsByTagName('span')[0].innerHTML =
          loadingArr[i][0].toUpperCase()
        loadingText.childNodes[2].textContent = loadingArr[i]
          .slice(1)
          .toUpperCase()
        resolve()
      }, i * 1000)
    })

    arrPromises.push(promise)
  }

  Promise.all(arrPromises).then(() => {
    setTimeout(() => {
      centerMessageContainer?.classList.add('hidden')
      puzzlesContainer?.classList.remove('hidden')
    }, 1000)
  })

  hack(totalPuzzles)
}

async function tryAgain(): Promise<void> {
  loadingHack()
}

async function init(): Promise<void> {
  loadingHack()
}

function hack(numberSquares: number) {
  result = true
  if (!tryAgainContainer.classList.contains('hidden'))
    tryAgainContainer.classList.add('hidden')
  centerMessageContainer!.classList.remove('margin-top-auto')
  const arrPuzzleNumber: number[] = [...Array(numberSquares)].map(
    (_, a) => a + 1
  )
  const arrPromisesHideNumbers: Promise<string>[] = []

  for (let i = 0; i < numberSquares; i++) {
    const divPuzzle = document.createElement('div')
    divPuzzle.classList.add('square')
    const squareNumber = i + 1
    divPuzzle.id = 'square-' + squareNumber
    const index = Math.floor(Math.random() * arrPuzzleNumber.length)
    arrIndexPuzzleNumber.push(arrPuzzleNumber[index])

    const puzzleNumber = arrPuzzleNumber[index]
    const p: Promise<string> = displayNumber(
      divPuzzle,
      arrPuzzleNumber[index],
      i
    ).then(() => {
      return `Number ${puzzleNumber} has finished its animation.`
    })

    arrPuzzleNumber.splice(index, 1)
    arrPromisesHideNumbers.push(p)
    puzzlesContainer.appendChild(divPuzzle)
  }

  Promise.all(arrPromisesHideNumbers).then(async () => {
    const squaresElement: NodeListOf<HTMLElement> =
      document.querySelectorAll('.square')!

    for (let i = 0; i < 4 && result; i++) {
      ;[submitted, answer] = await displayPuzzles(squaresElement)
      result = submitted === answer ? true : false
    }

    resultPuzzle(result, answer)

    document
      .querySelectorAll('div[id^="square-"]')
      .forEach((div) => div.remove())

    return 'Promise all resolved'
  })
}

function displayNumber(
  divPuzzle: HTMLElement,
  num: number,
  index: number
): Promise<string> {
  const numberContainer: HTMLElement = document.createElement('div')
  numberContainer.innerHTML = `${num}`
  numberContainer.classList.add('can-shrink')
  numberContainer.id = `num-${index + 1}`
  divPuzzle.appendChild(numberContainer)

  return new Promise<string>((resolve) =>
    setTimeout(() => {
      numberContainer.classList.add('number-shrink')
      // Listen for the transitionend event
      numberContainer.addEventListener(
        'transitionend',
        () => {
          return resolve('foo')
        },
        { once: true }
      )
    }, 4000)
  )
}

function counter(timerMs: number): Promise<string | null> {
  inputPuzzle.value = ''
  progressBar.style.transition = 'none'
  progressBar.classList.remove('progress-bar-shrink')

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      progressBar.style.transition = `width ${timerMs}ms linear`
      progressBar.classList.add('progress-bar-shrink')
    })
  })

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
}

function resultPuzzle(result: boolean, answer: string): void {
  if (result) {
    displayMessageAfterPuzzle(
      '../../../asset/laptop/spy.png',
      'LE SYSTÈME A ÉTÉ CONTOURNÉ.',
      `Bon travail, la réponse était "${answer}"`
    )
  } else {
    displayMessageAfterPuzzle(
      '../../../asset/laptop/failed.png',
      "LE SYSTÈME N'A PAS ACCEPTÉ VOS RÉPONSES",
      `Le temps s'est écoulé la réponse était "${answer}"`
    )
  }
}

async function displayPuzzles(
  squaresElement: NodeListOf<HTMLElement>
): Promise<[string | null, string]> {
  squaresElement.forEach((value: HTMLElement) => {
    value.querySelector('div')?.remove()
    const puzzle = generateRandomPuzzle()
    arrGeneratedPuzzle.push(puzzle)
    value.style.background = sample(Object.keys(COLORS))
    while (puzzle.colors['background'] === value.style.background)
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

  await counter(timerPuzzleSecond * 1000).then((value) => {
    submitted = value
    console.log('Submitted: ' + submitted + ' answer: ' + answer)
  })
  return [submitted, answer]
}

function displayMessageAfterPuzzle(
  imageSrc: string,
  message: string,
  hint: string
): void {
  puzzlesContainer.classList.add('hidden')
  centerMessageContainer!.classList.remove('hidden')
  answerContainer.classList.add('hidden')
  tryAgainContainer.classList.remove('hidden')
  centerMessageContainer!.classList.add('margin-top-auto')
  tryAgainImg!.src = imageSrc
  loadingText.getElementsByTagName('span')[0].innerHTML =
    message[0].toUpperCase()
  loadingText.childNodes[2].textContent = message.slice(1).toUpperCase()
  tryAgainHint.innerHTML = hint
}

init()
