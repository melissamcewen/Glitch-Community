import { COOKIE_NAME, tests } from 'Shared/ab-tests';
import { useGlobals } from 'State/globals';

const useTestValue = (name) => {
  const { AB_TESTS } = useGlobals();
  const assignment = AB_TESTS[name];
  return tests[name][assignment].value;
};

const resetTests = () => {
  document.cookie = `${COOKIE_NAME}=; expires=${new Date()}`;
};

export default useTestValue;
export { resetTests };
