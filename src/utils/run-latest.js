/*
`runLatest` takes a generator that yields promises,
and returns an async function that restarts from the beginning every time it is called.
Effectively, this means that the first call is "cancelled" when the second call is made.
This is useful for long-running processes that need to be restarted if their initial values change
(e.g. loading a user if the persistent token changes).
*/

export default function runLatest(fn) {
  const state = {
    currentGenerator: null,
  };
  return async (...args) => {
    // if there is already a running generator instance,
    // create a new instance and replace the old one.
    // the loop initiated to run the previous instance
    // will now run the new instance instead.
    if (state.currentGenerator) {
      state.currentGenerator = fn(...args);
      return;
    }

    state.currentGenerator = fn(...args);

    let promiseResult = null;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { value, done } = state.currentGenerator.next(promiseResult);

      // when the generator is done, remove the running instance from state and end the loop.
      if (done) {
        state.currentGenerator = null;
        return;
      }
      promiseResult = await value; // eslint-disable-line no-await-in-loop
    }
  };
}
