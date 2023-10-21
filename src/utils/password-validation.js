const isValidPassword = (password) => {
  const minLength = 8;
  const hasLetters = /[A-Za-z]/.test(password);
  const hasNumbers = /\d/.test(password);

  return password.length >= minLength && hasLetters && hasNumbers;
};

module.exports = {
  isValidPassword,
};
