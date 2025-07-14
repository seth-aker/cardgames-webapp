export function doCardsMatch(card1, card2) {
  return isSameColor(card1, card2) && isSameValue(card1, card2)
}

function isSameColor(card1, card2) {
  const colors = {
    'H': 'red',
    'D': 'red',
    'S': 'black',
    'C': 'black'
  }
  return colors[card1.substring(1)] === colors[card2.substring(1)]
}

function isSameValue(card1, card2) {
  return card1.substring(0, 1) === card2.substring(0, 1);
}
