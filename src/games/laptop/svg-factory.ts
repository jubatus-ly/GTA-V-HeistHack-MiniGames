import { PuzzleData } from './laptop-puzzle-factory'

export function getPuzzleSvg(puzzleData: PuzzleData) {
  const textSize = 21
  const textWeight = 'normal'

  const shapeSVG = createShape(puzzleData.shape, puzzleData.colors['shape'])
  const topText = createText(
    puzzleData.text[0].toUpperCase(),
    puzzleData.colors['colortext'],
    textSize,
    textWeight,
    31
  )
  const bottomText = createText(
    puzzleData.text[1].toUpperCase(),
    puzzleData.colors['shapetext'],
    textSize,
    textWeight,
    67
  )
  const numberText = createText(
    puzzleData.number,
    puzzleData.colors['number'],
    60,
    'normal',
    50,
    'Arial, Helvetica'
  )

  return createSVG([shapeSVG, topText, bottomText, numberText])
}

// Takes multiple SVG strings and combines them into a single SVG
const createSVG = (elements: string[]) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150"> ${elements.join('\n')} </svg>`

const createShape = (shape: string, color: string) => SHAPE_SVG[shape](color)
type SVG_SHAPE = { [k: string]: (c: string) => string }
const SHAPE_SVG: SVG_SHAPE = {
  square: (c: string) =>
    `<rect fill="${c}" stroke="#000" stroke-width="1" width="150" height="150"/>`,
  triangle: (c: string) =>
    `<polygon fill="${c}" stroke="#000" stroke-width="1" points="0 150 75 0 150 150 0 150"/>`,
  rectangle: (c: string) =>
    `<rect y="30" fill="${c}" stroke="#000" stroke-width="1" width="150" height="90"/>`,
  circle: (c: string) =>
    `<circle fill="${c}" stroke="#000" stroke-width="1" cx="75" cy="75" r="75"/>`,
}

const createText = (
  text: string | number,
  color: string,
  size: number,
  weight: string | number,
  y: number,
  font?: string
) => `
    <text 
        stroke="black" 
        fill="${color}" 
        stroke-width="1" 
        style="font-size:${size}px;" 
        font-weight="${weight}" 
        font-family="${font || 'Archivo Black'}, sans-serif"
        x="50%" 
        y="${y}%" 
        dominant-baseline="middle" 
        text-anchor="middle"
    >
        ${text}
    </text>`

// function test() {
//   const svgContainer = document.getElementById('test')!
//   const puzzle = generateRandomPuzzle()

//   const puzzleSVG = getPuzzleSvg(puzzle)
//   svgContainer.innerHTML = puzzleSVG
// }

// test();
