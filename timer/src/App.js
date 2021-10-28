import { useState, useEffect } from "react";
import { interval, fromEvent } from "rxjs";
import { buffer, filter } from "rxjs/operators";

import Container from "./components/Container/Container";
import Timer from "./components/Timer/Timer";
import styleButton from "./components/Button/Button.module.css";
import styleTimer from "./components/Timer/Timer.module.css";

const source = interval(1000);

function App() {
  const [time, setTime] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (active) {
      const subscribe = source.subscribe(() =>
        setTime((state) => state + 1000)
      );

      return () => subscribe.unsubscribe();
    }
  }, [active, time]);

  useEffect(() => {
    const click = fromEvent(document.getElementById("wait"), "click")
      .pipe(
        buffer(interval(300)),
        filter((clicks) => clicks.length === 2)
      )
      .subscribe(() => waitTimer());

    return () => click.unsubscribe();
  }, []);

  const startTimer = () => source.subscribe(setActive(true));

  const waitTimer = () => source.subscribe(setActive(false));

  const resetTimer = () => source.subscribe(setTime(0));

  const stopTimer = () => {
    resetTimer();
    waitTimer();
  };

  return (
    <Container>
      <Timer time={time} />
      <div className={styleTimer.containerBtn}>
        <button
          className={styleButton.button}
          onClick={active ? stopTimer : startTimer}
        >
          {active ? `STOP` : `START`}
        </button>
        <button
          className={styleButton.button}
          id="wait"
          disabled={!active}
        >
          Wait
        </button>
        <button
          className={styleButton.button}
          onClick={resetTimer}
          disabled={!active}
        >
          Reset
        </button>
      </div>
    </Container>
  );
}

export default App;
