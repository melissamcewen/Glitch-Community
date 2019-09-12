import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { sample } from 'lodash';

import Heading from 'Components/text/heading';
import Link from 'Components/link';
import Grid from 'Components/containers/grid';
import ErrorBoundary from 'Components/error-boundary';
import Arrow from 'Components/arrow';

import { pickRandomColors } from 'Utils/color';
import { captureException } from 'Utils/sentry';
import { useAPI } from 'State/api';

import QuestionItem from './item';
import styles from './questions.styl';

const kaomojis = ['八(＾□＾*)', '(ノ^_^)ノ', 'ヽ(*ﾟｰﾟ*)ﾉ', '♪(┌・。・)┌', 'ヽ(๏∀๏ )ﾉ', 'ヽ(^。^)丿'];

async function load(api, max) {
  const kaomoji = sample(kaomojis);
  try {
    const { data } = await api.get(`projects/questions?cache=${Date.now()}`);
    const questions = data
      .map((q) => JSON.parse(q.details))
      .filter((q) => !!q)
      .slice(0, max)
      .map((question) => {
        const [colorInner, colorOuter] = pickRandomColors(2);
        return { colorInner, colorOuter, id: question.questionId, ...question };
      });
    return { kaomoji, questions };
  } catch (error) {
    console.error(error);
    captureException(error);
    return { kaomoji, questions: [] };
  }
}

function useRepeatingEffect(effectHandler, interval, dependencies) {
  useEffect(() => {
    effectHandler();
    const id = setInterval(effectHandler, interval);
    return () => clearInterval(id);
  }, dependencies);
}

function Questions({ max }) {
  const api = useAPI();
  const [{ kaomoji, questions }, setState] = useState({
    kaomoji: '',
    questions: [],
  });
  useRepeatingEffect(() => {
    load(api, max).then(setState);
  }, 10000, [api.persistentToken, max]);

  return (
    <section className={styles.container}>
      <Heading tagName="h2">
        <Link to="/questions">Help Others, Get Thanks <Arrow /></Link>
      </Heading>
      <div>
        {questions.length ? (
          <ErrorBoundary>
            <Grid items={questions}>{(question) => <QuestionItem {...question} />}</Grid>
          </ErrorBoundary>
        ) : (
          <>
            {kaomoji} Looks like nobody is asking for help right now.{' '}
            <Link className={styles.link} to="/help/how-can-i-get-help-with-code-in-my-project/">
              Learn about helping
            </Link>
          </>
        )}
      </div>
    </section>
  );
}

Questions.propTypes = {
  max: PropTypes.number,
};
Questions.defaultProps = {
  max: 3,
};

export default Questions;
