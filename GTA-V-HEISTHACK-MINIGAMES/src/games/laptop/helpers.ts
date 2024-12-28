const randomInt = (max : number) => Math.floor(Math.random() * Math.floor(max));
const sample = (arr:any) => arr[randomInt(arr.length)];


export {randomInt, sample}
