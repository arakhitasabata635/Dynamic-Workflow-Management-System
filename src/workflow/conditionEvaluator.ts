export const evaluateCondition = (condition: string | undefined, document: any): boolean => {
  if (!condition || condition.trim() === '') {
    return true
  }

  const parts = condition.split(' ')

  if (parts.length !== 3) {
    console.log('Invalid condition format:', condition)
    return false
  }

  const [field, operator, value] = parts

  const docValue = document[field]
  const numericValue = Number(value)

  switch (operator) {
    case '>':
      return docValue > numericValue

    case '<':
      return docValue < numericValue

    case '>=':
      return docValue >= numericValue

    case '<=':
      return docValue <= numericValue

    case '==':
      return docValue == value

    default:
      return false
  }
}
