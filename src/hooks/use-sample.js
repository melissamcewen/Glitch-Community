// import { useMemo } from 'react';
import { range, sampleSize } from 'lodash';

// a version of sampleSize that uses the same indices as long as the input array's length is stable
const useSample = (items, size) => {
  const indices = useMemo(() => sampleSize(range(items.length), size), [items.length, size]);
  return indices.map((idx) => items[idx]);
};

export default useSample;
