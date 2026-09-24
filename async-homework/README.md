# JavaScript Runtime and Async

Small project with HTML, CSS and vanilla JavaScript. Open `index.html` in a browser (or use the Live Server extension in VS Code). Open DevTools (F12) to see the console output of the Event Loop demo.

Files: `index.html` (page), `style.css` (styles), `app.js` (all logic).

## Closure and the private counter
`createTask(name)` declares `count`, `status` and `duration` as local variables. The returned object has only methods (`run`, `getCount`, `reset`, ...). These methods "close over" the variables, so they can read and change them, but code outside cannot access `count` directly. Every call of `createTask` creates a new scope, so each task has its own counter.

## Call stack (example)
When I click **Run All Tasks**, the click handler is pushed on the stack. It calls `tasks.map(...)`, which calls `task.run()` for each task. Inside `run()` the Promise executor runs and calls `setTimeout`, which only registers a timer and returns. Then `run()` returns a pending Promise and is popped off the stack. When all frames are popped, the stack is empty and the browser can render and handle other events.

## How JavaScript continues while setTimeout waits
`setTimeout` hands the timer to the browser (Web API). JavaScript does not wait: the stack empties and other code can run. When the time is over, the browser puts the callback into the Task Queue. The Event Loop moves it to the Call Stack when the stack is empty.

## Event Loop: predicted and actual output
Predicted (and actual, they matched):
1. script start
2. async function start
3. script end
4. promise 1
5. async function continues after await
6. promise 2
7. timer 1
8. microtask inside timer 1
9. timer 2

Why: synchronous code runs first on the Call Stack (1-3). Then the Microtask Queue is emptied completely (4-6), including the promise 2 that was added by promise 1. Then the Event Loop takes one task from the Task Queue (timer 1), runs it, and empties microtasks again (8) before it takes timer 2.

## Tasks vs microtasks
Tasks (macrotasks) are things like `setTimeout` callbacks and events. Microtasks are Promise callbacks (`then`, `catch`) and the code after `await`. The Event Loop runs one task, then all microtasks, then can render, then takes the next task. So microtasks always run before the next timer, even with 0 ms delay.

## Multiple Promises and errors
- Each `run()` returns a Promise that rejects when the task randomly fails.
- **Run All** uses `Promise.allSettled`, which waits for all tasks and never rejects, so "All tasks finished" appears only when every task is completed or failed. `Promise.all` would reject at the first failure.
- Single runs and sequential runs use `.catch(() => {})` so a failed task does not stop the rest. The failure is shown in the UI (status Failed).

## Sequential vs concurrent
Sequential (`await task1.run(); await task2.run(); ...`) starts each task after the previous one ends, so the total time is about the sum of all times. Concurrent (`Promise.allSettled([...])`) starts all timers at once, so the total time is about the longest task. Waiting on timers does not block JavaScript, so timers can wait in parallel.
