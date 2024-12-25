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


class PuzzleData {
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


export function generateRandomPuzzle(): PuzzleData | undefined {

    // What do we need here 
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

export function generateQuestionAndAnswer() {
}

