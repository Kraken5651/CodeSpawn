const vm = require('vm');

const SUPPORTED_LANGUAGE_SLUGS = new Set(['javascript']);

const normalizeOutput = (value) => {
  if (typeof value === 'string') {
    return value.replace(/\s+/g, '');
  }
  return JSON.stringify(value).replace(/\s+/g, '');
};

const parseTestInput = (input) => {
  const wrapped = `[${input}]`;
  return JSON.parse(wrapped);
};

const functionNameForProblem = (problem) => {
  const slug = problem.slug || '';
  return slug.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};

const runJavaScriptCase = ({ code, functionName, testCase, timeoutMs }) => {
  const sandbox = {
    module: { exports: {} },
    exports: {},
    console: {
      log: (...args) => {
        sandbox.__logs.push(args.join(' '));
      }
    },
    __logs: []
  };

  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { timeout: timeoutMs });

  const candidate = [
    sandbox.module.exports,
    sandbox.exports?.default,
    sandbox[functionName],
    sandbox.module.exports?.[functionName]
  ].find((value) => typeof value === 'function');

  if (typeof candidate !== 'function') {
    throw new Error(`Expected a function named ${functionName} or module.exports = ${functionName}.`);
  }

  const args = parseTestInput(testCase.input);
  return candidate(...args);
};

const judgeSubmission = async ({ code, problem, language, testCases }) => {
  const startedAt = Date.now();
  const totalTests = testCases.length;
  const languageSlug = language?.slug;

  if (!SUPPORTED_LANGUAGE_SLUGS.has(languageSlug)) {
    return {
      status: 'ERROR',
      passed_tests: 0,
      total_tests: totalTests,
      execution_time_ms: Date.now() - startedAt,
      memory_used_mb: null,
      is_accepted: false,
      stdout_output: '',
      stderr_output: '',
      error_message: `${language?.name || 'This language'} execution is not enabled yet. Configure the Docker worker before accepting these submissions.`,
      execution_details: {
        cases: testCases.map((testCase, index) => ({
          index: index + 1,
          status: 'Skipped',
          input: testCase.input,
          expected: testCase.expected_output,
          actual: null
        }))
      }
    };
  }

  const timeoutMs = Math.max(250, (problem.time_limit_seconds || 5) * 1000);
  const functionName = functionNameForProblem(problem);
  const results = [];
  let passed = 0;
  let status = 'COMPLETED';
  let errorMessage = null;

  for (const [index, testCase] of testCases.entries()) {
    try {
      const actual = runJavaScriptCase({ code, functionName, testCase, timeoutMs });
      const actualOutput = normalizeOutput(actual);
      const expectedOutput = normalizeOutput(testCase.expected_output);
      const didPass = actualOutput === expectedOutput;

      if (didPass) {
        passed += 1;
      }

      results.push({
        index: index + 1,
        status: didPass ? 'Passed' : 'Failed',
        input: testCase.input,
        expected: testCase.expected_output,
        actual
      });

      if (!didPass) {
        status = 'FAILED';
      }
    } catch (error) {
      status = error.message.includes('Script execution timed out') ? 'TIMEOUT' : 'ERROR';
      errorMessage = error.message;
      results.push({
        index: index + 1,
        status,
        input: testCase.input,
        expected: testCase.expected_output,
        actual: null,
        error: error.message
      });
      break;
    }
  }

  return {
    status,
    passed_tests: passed,
    total_tests: totalTests,
    execution_time_ms: Date.now() - startedAt,
    memory_used_mb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    is_accepted: status === 'COMPLETED' && passed === totalTests,
    stdout_output: '',
    stderr_output: '',
    error_message: errorMessage,
    execution_details: { cases: results }
  };
};

module.exports = {
  judgeSubmission
};
