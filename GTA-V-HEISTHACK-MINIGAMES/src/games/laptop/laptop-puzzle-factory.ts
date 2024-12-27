import { randomInt, sample } from "./helpers";

const SHAPES = ["square", "triangle", "rectangle", "circle"];
const COLORABLE = ['background', 'colortext', 'shapetext', 'number', 'shape'];

export const COLORS = {
    'black' : '#000000',
    'white' : '#FFFFFF', 
    'blue' : '#2195ee',
    'red' : '#7b0100',
    'yellow' : '#fceb3d',
    'orange' : '#fd9802',
    'green' : '#4cae4f',
    'purple' : '#9926ac',
}

type QST = {[key: string]: (d: PuzzleData) => string;}

const QUESTIONS : QST = {
    'background color' : (d:PuzzleData) => d.colors['background'],
    'color text background color' : (d:PuzzleData) => d.colors['colortext'],
    'shape text background color' : (d:PuzzleData) => d.colors['shapetext'],
    'number color' : (d:PuzzleData) => d.colors['number'],
    'shape color' : (d:PuzzleData) => d.colors['shape'],
    'color text' : (d:PuzzleData) => d.text[0],
    'shape text' : (d:PuzzleData) => d.text[1],
    'shape' : (d:PuzzleData) => d.shape
}

export class PuzzleData {
    shape: string;
    number : number;
    text: string[];
    colors: {[key: string]: string};

    constructor(shape: string, number: number, text: string[], colors: {[key: string]: string}) {
        this.shape = shape;
        this.number = number;
        this.text = text;
        this.colors = colors;
    }
}


export function generateRandomPuzzle(): PuzzleData {

    const shape : string = sample(SHAPES);
    const number : number = randomInt(9) + 1;
    const topText : string = sample(Object.keys(COLORS));
    const bottomText : string = sample(SHAPES);

    const colors = COLORABLE.reduce((obj: {[key: string]: string}, color:string) => {obj[color] = sample(Object.keys(COLORS)); return obj}, {});
    
    // ensure color and shape text don't blend with background
    while(['colortext', 'shapetext'].map(i => colors[i]).includes(colors['background']))
        colors['background'] = sample(Object.keys(COLORS));
    
    // ensure nothing blends with shape
    while(['background', 'colortext', 'shapetext', 'number'].map(i => colors[i]).includes(colors['shape']))
        colors['shape'] = sample(Object.keys(COLORS));

    return new PuzzleData(shape, number, [topText, bottomText], colors);

}

export function generateQuestionAndAnswer(nums: number[], puzzles: PuzzleData[]) : string[] {

    const positionOne = randomInt(nums.length);
    let tempPosTwo;
    do {tempPosTwo = randomInt(nums.length)} while(positionOne == tempPosTwo);
    const positionTwo = tempPosTwo;

    let firstQuestion = sample(Object.keys(QUESTIONS));
    let tempSecondQuestion;
    do {tempSecondQuestion = sample(Object.keys(QUESTIONS))} while(tempSecondQuestion == firstQuestion);
    let secondQuestion = tempSecondQuestion;

    const andWord = 'AND';

    const question = firstQuestion +' ('+ nums[positionOne]+') '+ andWord + secondQuestion + ' ('+nums[positionTwo]+')';

    const a1 = QUESTIONS[firstQuestion](puzzles[positionOne]);
    const a2 = QUESTIONS[secondQuestion](puzzles[positionTwo]);

    // convert from hex codes to color names, skip if shape
    const nameA1 = (Object.keys(COLORS) as (keyof typeof COLORS)[]).find(k=>COLORS[k]===a1) || a1
    const nameA2 = (Object.keys(COLORS) as (keyof typeof COLORS)[]).find(k=>COLORS[k]===a2) || a2

    const answer = nameA1 + ' ' + nameA2;

    return [question, answer];

}
