const calculateFibonacci = (num: number): number => {
  if (num <= 1) return num;
  return calculateFibonacci(num - 1) + calculateFibonacci(num - 2);
};

const performIntensiveCalculations = (
  iterations: number,
): Promise<number[]> => {
  const results = [];
  for (let i = 0; i < iterations; i++) {
    const result = calculateFibonacci(40); // High enough number to simulate intensive calculation
    results.push(result);
  }
  return Promise.resolve(results);
};

export {performIntensiveCalculations};
