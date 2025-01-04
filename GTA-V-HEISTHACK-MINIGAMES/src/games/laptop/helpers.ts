const randomInt = (max: number) => Math.floor(Math.random() * Math.floor(max))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sample = (arr: any) => arr[randomInt(arr.length)]

export { randomInt, sample }
