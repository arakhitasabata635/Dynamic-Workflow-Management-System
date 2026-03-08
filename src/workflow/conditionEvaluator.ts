export const evaluateCondition = (
  condition: string | null | undefined,
  document: Record<string, any>,
): boolean => {
  //no condition
  if (!condition || condition.trim() === '') {
    return true
  }

  try {
    const parts = condition.split(' ')

    //if condition but no proper format
    if (parts.length !== 3) {
      console.log('Invalid condition format:', condition)
      return false
    }

    //check condition gave result
    const [field, operator, value] = parts

    const documentValue = document[field]

    if (documentValue === undefined) {
      console.log(`Field "${field}" not found in document`)
      return false
    }

    const numericValue = Number(value)

    switch (operator) {
      case '>':
        return documentValue > numericValue

      case '<':
        return documentValue < numericValue

      case '>=':
        return documentValue >= numericValue

      case '<=':
        return documentValue <= numericValue

      case '=':
        return documentValue == value

      case '!=':
        return documentValue != value

      default:
        console.log('Unsupported operator:', operator)
        return false
    }
  } catch (error) {
    console.log('Condition evaluation error:', error)
    return false
  }
}
