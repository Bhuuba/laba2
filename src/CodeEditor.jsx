function sumOfArray(arr) {
  if (arr.length === 0) {
    return 0;
  }
  return arr.reduce((sum, num) => sum + num, 0);
}

// Test cases
console.log(sumOfArray([1, 2, 3, 4])); // выведе 10
console.log(sumOfArray([])); // выведе 0
