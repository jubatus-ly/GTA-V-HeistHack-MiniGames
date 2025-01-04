import './style.scss'
import games from './games.json'

const gs = games.games

console.log(gs)

document.querySelectorAll('div.card').forEach((element, index) => {
  const game = gs[index]
  const headerDiv = element.querySelector('div.card-header') as HTMLDivElement
  const contentDiv = element.querySelector('div.card-content') as HTMLDivElement

  if (headerDiv && contentDiv) {
    console.log(headerDiv)
    headerDiv.textContent = game.title
    contentDiv.textContent = game.description
  }
})
