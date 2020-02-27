const unmask = (maskedValue, mask) => {
  const defaultTokens = ['#', 'X', 'S', 'A', 'a', '!']
  let unmaskedValue = ''
  let isToken

  for (let i = 0; i < maskedValue.length; i++) {
    isToken = false
    for (let j = 0; j < defaultTokens.length; j++) {
      if (mask[i] === defaultTokens[j]) {
        isToken = true
      }
    }

    if (isToken) {
      unmaskedValue += maskedValue[i]
    }
  }

  return unmaskedValue
}

const masks = {
  cep: '#####-###',
  phone: '(##) #####-####'
}

export {
  unmask,
  masks
}
