/* eslint-disable no-underscore-dangle */

// Extend promises with `finally`
// From: https://github.com/domenic/promises-unwrapping/issues/18

function ProgressPromise(fn) {
  const p = new Promise((resolve, reject) => {
    const notify = (event) => {
      if (p._progressHandlers == null) {
        return;
      }
      p._progressHandlers.forEach((handler) => {
        try {
          handler(event);
        } catch (error) {
          // empty
        }
      });
    };
    return fn(resolve, reject, notify);
  });

  p.then = function then(onFulfilled, onRejected) {
    const result = Promise.prototype.then.call(p, onFulfilled, onRejected);
    // Pass progress through
    p.progress(result._notify.bind(result));

    return result;
  };

  p.finally = function _finally(callback) {
    // We don’t invoke the callback in here,
    // because we want then() to handle its exceptions
    return this.then(
      // Callback fulfills: pass on predecessor settlement
      // Callback rejects: pass on rejection (=omit 2nd arg.)
      (value) => Promise.resolve(callback()).then(() => value),
      (reason) =>
        Promise.resolve(callback()).then(() => {
          throw reason;
        }),
    );
  };

  p._notify = function _notify(event) {
    return this._progressHandlers.forEach((handler) => {
      try {
        handler(event);
      } catch (error) {
        // empty
      }
    });
  };

  p.progress = function progress(handler) {
    if (this._progressHandlers == null) {
      this._progressHandlers = [];
    }
    this._progressHandlers.push(handler);

    return this;
  };

  return p;
}

export default ProgressPromise;
