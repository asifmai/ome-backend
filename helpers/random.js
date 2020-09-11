module.exports.genVerificationCode = () => {
  let returnVal = '';
  const numbers = [1,2,3,4,5,6,7,8,9];
  for (let i = 0; i < 6; i++) {
    const idx = Math.floor(Math.random() * 9);
    returnVal += numbers[idx]
  }

  return Number(returnVal);
}