let startTime, interval;
let isRunning = false;

const timerDisplay = document.getElementById('timer');
const log = document.getElementById('log');
let sessions = JSON.parse(localStorage.getItem('sessions')) || [];

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const secs = String(totalSeconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  startTime = Date.now();
  interval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    timerDisplay.textContent = formatTime(elapsed);
  }, 1000);
}

function stopTimer() {
  if (!isRunning) return;
  clearInterval(interval);
  isRunning = false;
  const elapsed = Date.now() - startTime;

  const project = document.getElementById('project').value || "General";
  const rate = parseFloat(document.getElementById('rate').value) || 0;
  const hours = elapsed / (1000 * 60 * 60);
  const amount = rate * hours;

  const entry = {
    project,
    duration: formatTime(elapsed),
    amount: `$${amount.toFixed(2)}`,
    timestamp: new Date().toLocaleString()
  };

  sessions.push(entry);
  localStorage.setItem('sessions', JSON.stringify(sessions));
  renderLog();
}

function resetTimer() {
  clearInterval(interval);
  isRunning = false;
  timerDisplay.textContent = "00:00:00";
}

function renderLog() {
  log.innerHTML = '';
  sessions.forEach((s, i) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${s.project}</td>
      <td>${s.duration}</td>
      <td>${s.amount}</td>
      <td>${s.timestamp}</td>
      <td><button onclick="deleteSession(${i})">X</button></td>
    `;
    log.appendChild(row);
  });
}

function deleteSession(index) {
  sessions.splice(index, 1);
  localStorage.setItem('sessions', JSON.stringify(sessions));
  renderLog();
}

renderLog();
