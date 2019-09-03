const dayjs = require('dayjs');
const { COOKIE_NAME, tests } = require('Shared/ab-tests');

const readAssignments = (request) => {
  try {
    return JSON.parse(request.cookies[COOKIE_NAME]) || {};
  } catch {
    return {};
  }
};

const writeAssignments = (response, assignments) => {
  const whitelist = Object.keys(tests).sort();
  const serialized = JSON.stringify(assignments, whitelist);
  const expires = dayjs().add(1, 'month').toDate();
  response.cookie(COOKIE_NAME, serialized, { expires });
};

const assignGroup = (groups) => {
  const entries = Object.entries(groups);
  const sum = Object.values(groups).reduce((sum, { weight }) => sum + weight, 0);

  // pick a number in [0, sum) (0 to sum, not including sum) and see which weight's range it falls in
  // so for weights 1 and 2, pick in [0, 3) and the result must be in either [0, 1) or [1, 3)
  let rand = Math.random() * sum;
  for (const [assignment, { weight }] of entries) {
    if (rand < weight) {
      return assignment;
    }
    rand -= weight;
  }

  // this must be a rounding error, so return the last group
  return entries[entries.length - 1][0];
};

const getAssignments = (request, response) => {
  const assignments = readAssignments(request);
  for (const [test, groups] of Object.entries(tests)) {
    if (!Object.keys(groups).includes(assignments[test])) {
      assignments[test] = assignGroup(groups);
    }
  }
  writeAssignments(response, assignments);
  return assignments;
};

module.exports = getAssignments;
