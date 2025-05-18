// utils/reorder.js
export function removeCard(board, cardId) {
    const clone = structuredClone(board)           // deep copy
    clone.Column.forEach(col => {
      col.Card = col.Card.filter(c => c.id !== cardId)
    })
    return clone
  }
  
  export function insertCard(board, destColId, card, newOrder = 0) {
    const clone = structuredClone(board)
    const destCol = clone.Column.find(c => c.id === destColId)
    if (!destCol) return clone
    destCol.Card.splice(newOrder, 0, card)
    // re-index orders for that column
    destCol.Card.forEach((c, i) => { c.order = i })
    return clone
  }