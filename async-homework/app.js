"use strict";

/* ---------- 1. Closure: createTask ---------- */
const FAIL_CHANCE = 0.3;
const randomBetween = (min, max) => Math.round(min + Math.random() * (max - min));

function createTask(name, onChange = () => {}) {
  // Private state: only the functions below can see these variables.
  let count = 0;
  let status = "Idle";
  let duration = null;

  const task = {
    getName: () => name,
    getStatus: () => status,
    getCount: () => count,
    getDuration: () => duration,

    run() {
      count++;
      status = "Running";
      duration = null;
      onChange(task);

      const delay = randomBetween(500, 2000);
      const startedAt = performance.now();

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          duration = Math.round(performance.now() - startedAt);
          if (Math.random() < FAIL_CHANCE) {
            status = "Failed";
            onChange(task);
            reject(new Error(name + " failed"));
          } else {
            status = "Completed";
            onChange(task);
            resolve(name + " completed");
          }
        }, delay);
      });
    },

    reset() {
      count = 0;
      status = "Idle";
      duration = null;
      onChange(task);
    },
  };
  return task;
}

/* ---------- 2. UI for tasks ---------- */
const $ = (id) => document.getElementById(id);
const cards = new Map();

function updateCard(task) {
  const card = cards.get(task.getName());
  if (!card) return;
  const status = task.getStatus();
  const time = task.getDuration();
  card.dataset.status = status;
  card.querySelector(".status").textContent = status;
  card.querySelector(".count").textContent = "Runs: " + task.getCount();
  card.querySelector(".time").textContent = time === null ? "Time: -" : "Time: " + time + " ms";
  card.querySelector(".run").disabled = status === "Running";
}

const tasks = ["Load Users", "Load Posts", "Load Comments"].map((n) => createTask(n, updateCard));

tasks.forEach((task) => {
  const li = document.createElement("li");
  li.className = "task";
  li.innerHTML =
    '<span class="name"></span><span class="status"></span>' +
    '<span class="meta count"></span><span class="meta time"></span>' +
    '<span class="actions"><button class="small run">Run</button>' +
    '<button class="small secondary reset">Reset</button></span>';
  li.querySelector(".name").textContent = task.getName();
  li.querySelector(".run").addEventListener("click", () => {
    $("allDone").hidden = true;
    task.run().catch(() => {}); // failure is already shown in the UI
  });
  li.querySelector(".reset").addEventListener("click", () => task.reset());
  cards.set(task.getName(), li);
  $("taskList").appendChild(li);
  updateCard(task);
});

const busy = (state) =>
  ["runAll", "compare", "loopDemo"].forEach((id) => ($(id).disabled = state));

/* ---------- 3. Run All (concurrent) ---------- */
$("runAll").addEventListener("click", async () => {
  busy(true);
  $("allDone").hidden = true;
  // allSettled waits for every promise, whether it completed or failed
  await Promise.allSettled(tasks.map((t) => t.run()));
  $("allDone").hidden = false;
  busy(false);
});

/* ---------- 4. Sequential vs concurrent ---------- */
const safeRun = (task) => task.run().catch(() => {});

$("compare").addEventListener("click", async () => {
  busy(true);
  $("allDone").hidden = true;
  $("compareResult").textContent = "Measuring... (about 5 seconds)";

  let start = performance.now();
  await safeRun(tasks[0]); // each await waits for the previous task
  await safeRun(tasks[1]);
  await safeRun(tasks[2]);
  const sequential = Math.round(performance.now() - start);
  const sumOfTimes = tasks.reduce((s, t) => s + t.getDuration(), 0);

  start = performance.now();
  await Promise.allSettled(tasks.map((t) => t.run())); // all timers start together
  const concurrent = Math.round(performance.now() - start);
  const longest = Math.max(...tasks.map((t) => t.getDuration()));

  $("compareResult").classList.remove("muted");
  $("compareResult").innerHTML =
    "<p><b>Sequential:</b> " + sequential + " ms (sum of the three task times: " + sumOfTimes + " ms)</p>" +
    "<p><b>Concurrent (Promise.allSettled):</b> " + concurrent + " ms (longest single task: " + longest + " ms)</p>" +
    "<p>Sequential is about the sum of all times, because each task starts only after the previous one ends. " +
    "Concurrent is about the longest task, because all three timers wait at the same time. " +
    "Random delays differ on every run, so the numbers change, but concurrent is always faster.</p>";
  busy(false);
});

/* ---------- 5. Event Loop demo ---------- */
const demoSource = `async function fetchData() {
  console.log("async function start");
  await Promise.resolve();
  console.log("async function continues after await");
}

console.log("script start");
setTimeout(() => {
  console.log("timer 1");
  Promise.resolve().then(() => console.log("microtask inside timer 1"));
}, 0);
setTimeout(() => console.log("timer 2"), 0);
Promise.resolve()
  .then(() => console.log("promise 1"))
  .then(() => console.log("promise 2"));
fetchData();
console.log("script end");`;

// Written BEFORE running the demo:
const predicted = [
  "script start",
  "async function start",
  "script end",
  "promise 1",
  "async function continues after await",
  "promise 2",
  "timer 1",
  "microtask inside timer 1",
  "timer 2",
];

$("demoCode").textContent = demoSource;
$("predicted").innerHTML = predicted.map((line) => "<li>" + line + "</li>").join("");

function eventLoopDemo() {
  const output = [];
  const log = (text) => {
    output.push(text);
    console.log(text); // also visible in DevTools
  };

  return new Promise((done) => {
    async function fetchData() {
      log("async function start");
      await Promise.resolve();
      log("async function continues after await");
    }

    log("script start");
    setTimeout(() => {
      log("timer 1");
      Promise.resolve().then(() => log("microtask inside timer 1"));
    }, 0);
    setTimeout(() => {
      log("timer 2");
      done(output); // last task: the demo is finished
    }, 0);
    Promise.resolve()
      .then(() => log("promise 1"))
      .then(() => log("promise 2"));
    fetchData();
    log("script end");
  });
}

$("loopDemo").addEventListener("click", async () => {
  busy(true);
  const actual = await eventLoopDemo();
  $("actual").classList.remove("muted");
  $("actual").innerHTML = actual
    .map((line, i) => '<li class="' + (line === predicted[i] ? "ok" : "bad") + '">' + line + "</li>")
    .join("");
  const same = actual.every((line, i) => line === predicted[i]);
  $("loopVerdict").textContent = same
    ? "The actual output matches my prediction."
    : "The actual output differs from my prediction (red lines).";
  $("loopVerdict").hidden = false;
  busy(false);
});
