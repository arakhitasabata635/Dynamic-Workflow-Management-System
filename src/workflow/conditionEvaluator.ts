export const evaluateCondition = (
  condition: string | null | undefined,
  documentAmount: number,
): boolean => {
  if (!condition || condition.trim() === '') {
    return true
  }

  const parts = condition.split(' ')

  if (parts.length !== 2) {
    console.log('Invalid condition format:', condition)
    return false
  }

  const [operator, value] = parts

  const numericValue = Number(value)

  switch (operator) {
    case '>':
      return numericValue > documentAmount

    case '<':
      return numericValue < documentAmount

    case '>=':
      return numericValue >= documentAmount

    case '<=':
      return numericValue <= documentAmount

    case '==':
      return numericValue == documentAmount

    default:
      return false
  }
}
