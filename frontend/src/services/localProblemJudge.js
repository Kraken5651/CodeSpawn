const normalize = (value) => {
  if (typeof value === 'string') return value.replace(/\s+/g, '');
  return JSON.stringify(value).replace(/\s+/g, '');
};

const parseInput = (input) => {
  if (input.includes('nums =')) {
    const nums = JSON.parse(input.match(/\[[^\]]+\]/)?.[0] || '[]');
    const target = Number(input.match(/target\s*=\s*(-?\d+)/)?.[1]);
    return [nums, target];
  }

  if (input.includes('s =')) {
    return [input.match(/"([^"]*)"/)?.[1] || ''];
  }

  return JSON.parse(`[${input}]`);
};

const getFunctionName = (problem) => {
  if (problem.slug === 'valid-parentheses' || problem.id === 'valid-parentheses') return 'isValid';
  if (problem.slug === 'two-sum' || problem.id === 'two-sum') return 'twoSum';
  return (problem.slug || problem.id || '').replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};

export const runLocalProblemJudge = ({ problem, code }) => {
  const examples = problem.test_cases || problem.examples || [];
  const functionName = getFunctionName(problem);
  const startedAt = performance.now();
  const results = [];

  if (!code.trim()) {
    return {
      passed: false,
      status: 'ERROR',
      runtime: '0ms',
      memory: 'browser',
      error: 'Editor is empty.',
      testCases: [],
    };
  }

  try {
    const factory = new Function(`${code}; return typeof ${functionName} !== "undefined" ? ${functionName} : (typeof module !== "undefined" ? module.exports : undefined);`);
    const candidate = factory();

    if (typeof candidate !== 'function') {
      throw new Error(`Define a function named ${functionName}.`);
    }

    for (const [index, testCase] of examples.entries()) {
      const expected = testCase.expected_output ?? testCase.output;
      const input = testCase.input;
      const actual = candidate(...parseInput(input));
      const didPass = normalize(actual) === normalize(expected);

      results.push({
        status: didPass ? 'Passed' : 'Failed',
        input,
        expected,
        actual: Array.isArray(actual) ? JSON.stringify(actual) : String(actual),
        index: index + 1,
      });
    }

    const passed = results.every((result) => result.status === 'Passed');

    return {
      passed,
      status: passed ? 'Accepted' : 'Wrong Answer',
      runtime: `${Math.max(1, Math.round(performance.now() - startedAt))}ms`,
      memory: 'browser',
      error: passed ? null : 'At least one sample case failed.',
      testCases: results,
    };
  } catch (error) {
    return {
      passed: false,
      status: 'Runtime Error',
      runtime: `${Math.max(1, Math.round(performance.now() - startedAt))}ms`,
      memory: 'browser',
      error: error.message,
      testCases: results,
    };
  }
};
