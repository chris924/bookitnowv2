#!/usr/bin/env node
// One-command local runner for BookItNow: `npm start` from the repo root.
//
// Checks prerequisites, installs frontend dependencies when needed, then runs the
// Spring Boot backend (embedded H2 database + demo data) and the Vite frontend
// side by side. Ctrl+C stops both. Uses only Node built-ins, so it works straight
// after cloning, without an `npm install` at the root.
//
// Flags: --no-open   don't open the browser once the app is ready.

import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BACKEND_DIR = path.join(ROOT, "appointment-booking-backend");
const FRONTEND_DIR = path.join(ROOT, "appointment-booking-frontend");

const BACKEND_PORT = 8080;
const FRONTEND_PORT = 5173;
const FRONTEND_URL = `http://localhost:${FRONTEND_PORT}`;
const HEALTH_URL = `http://localhost:${BACKEND_PORT}/actuator/health`;

const MIN_NODE = 20;
const MIN_JAVA = 21;

const isWindows = process.platform === "win32";
const openBrowserWhenReady = !process.argv.includes("--no-open");

const color = (code) => (text) => (process.stdout.isTTY ? `\x1b[${code}m${text}\x1b[0m` : text);
const bold = color("1");
const red = color("31");
const green = color("32");
const yellow = color("33");
const cyan = color("36");
const magenta = color("35");

const log = (msg = "") => console.log(`${bold("[start]")} ${msg}`);

function fail(msg) {
  console.error(`\n${red(bold("✖"))} ${msg}\n`);
  process.exit(1);
}

// ---------------------------------------------------------------- prerequisites

function checkNode() {
  const major = Number(process.versions.node.split(".")[0]);
  if (major < MIN_NODE) {
    fail(`Node.js ${MIN_NODE}+ is required (found ${process.versions.node}).\n  Download: https://nodejs.org`);
  }
}

// Mirrors how the Maven wrapper picks Java: JAVA_HOME if set, otherwise `java` on PATH.
function checkJava() {
  const javaBin = process.env.JAVA_HOME
    ? path.join(process.env.JAVA_HOME, "bin", isWindows ? "java.exe" : "java")
    : "java";
  const result = spawnSync(javaBin, ["-version"], { encoding: "utf8" });
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  const match = output.match(/version "(\d+)(?:\.(\d+))?/);

  if (result.error || !match) {
    const where = process.env.JAVA_HOME ? `JAVA_HOME (${process.env.JAVA_HOME})` : "your PATH";
    fail(`Java ${MIN_JAVA}+ (a JDK) is required but was not found via ${where}.\n  Download: https://adoptium.net`);
  }

  // Old-style versions report as "1.8.0_x".
  const major = match[1] === "1" ? Number(match[2]) : Number(match[1]);
  if (major < MIN_JAVA) {
    fail(`Java ${MIN_JAVA}+ is required (found Java ${major}).\n  Download: https://adoptium.net`);
  }
  return major;
}

function ensurePortFree(port, name) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () =>
      fail(`Port ${port} (${name}) is already in use. Stop whatever is using it (perhaps an earlier run) and try again.`),
    );
    server.once("listening", () => server.close(resolve));
    server.listen(port);
  });
}

// ----------------------------------------------------------- frontend install

function installFrontendDeps() {
  const lockFile = path.join(FRONTEND_DIR, "package-lock.json");
  const installedMarker = path.join(FRONTEND_DIR, "node_modules", ".package-lock.json");

  const upToDate =
    fs.existsSync(installedMarker) && fs.statSync(installedMarker).mtimeMs >= fs.statSync(lockFile).mtimeMs;
  if (upToDate) return;

  log("Installing frontend dependencies (first run only)...");
  const result = spawnSync("npm", ["ci", "--no-audit", "--no-fund"], {
    cwd: FRONTEND_DIR,
    stdio: "inherit",
    shell: isWindows, // npm is a .cmd shim on Windows
  });
  if (result.status !== 0) fail("Installing frontend dependencies failed (see the npm output above).");
}

// ------------------------------------------------------------ process control

const children = [];
let shuttingDown = false;

function prefixLines(stream, label, out) {
  let buffered = "";
  stream.setEncoding("utf8");
  stream.on("data", (chunk) => {
    buffered += chunk;
    const lines = buffered.split(/\r?\n/);
    buffered = lines.pop();
    for (const line of lines) out.write(`${label} ${line}\n`);
  });
  stream.on("end", () => buffered && out.write(`${label} ${buffered}\n`));
}

function run(name, label, command, args, cwd, options = {}) {
  const child = spawn(command, args, {
    cwd,
    stdio: ["ignore", "pipe", "pipe"],
    // Own process group on Unix so the whole tree (e.g. Maven -> JVM) can be stopped together.
    detached: !isWindows,
    windowsHide: true,
    ...options,
  });
  prefixLines(child.stdout, label, process.stdout);
  prefixLines(child.stderr, label, process.stderr);

  child.on("error", (err) => fail(`Could not start the ${name}: ${err.message}`));
  child.on("exit", (code) => {
    if (shuttingDown) return;
    console.error(`\n${red(bold("✖"))} The ${name} stopped unexpectedly (exit code ${code}). See its output above.`);
    shutdown(1);
  });
  children.push(child);
  return child;
}

function killTree(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  try {
    if (isWindows) {
      spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
    } else {
      process.kill(-child.pid, "SIGTERM");
    }
  } catch {
    // Already gone.
  }
}

function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  log("Stopping backend and frontend...");
  children.forEach(killTree);
  process.exit(exitCode);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

// ------------------------------------------------------------------ readiness

async function isUp(url, check = () => true) {
  try {
    const res = await fetch(url);
    return res.ok && check(await res.text());
  } catch {
    return false;
  }
}

async function waitUntilReady() {
  for (;;) {
    const [backend, frontend] = await Promise.all([
      isUp(HEALTH_URL, (body) => body.includes('"UP"')),
      isUp(FRONTEND_URL),
    ]);
    if (backend && frontend) return;
    await new Promise((r) => setTimeout(r, 2000));
  }
}

function openBrowser(url) {
  const [cmd, args] = isWindows
    ? ["cmd", ["/c", "start", "", url]]
    : process.platform === "darwin"
      ? ["open", [url]]
      : ["xdg-open", [url]];
  const child = spawn(cmd, args, { stdio: "ignore", detached: true });
  child.on("error", () => {}); // Best effort; the URL is printed anyway.
  child.unref();
}

function printReadyBanner() {
  const line = green("─".repeat(60));
  console.log(`
${line}
  ${green(bold("BookItNow is running"))}  →  ${bold(FRONTEND_URL)}

  Demo accounts (reset to this demo data on every backend restart):
    Customer  john.doe@email.com      / password123   ("Belépés")
    Company   cardetailing@gmail.com  / password      ("Szolgáltatóknak")
    Employee  jdavid@gmail.com        / password      ("Szolgáltatóknak" → toggle)

  API docs: http://localhost:${BACKEND_PORT}/swagger-ui.html
  Press Ctrl+C to stop.
${line}
`);
}

// ----------------------------------------------------------------------- main

async function main() {
  checkNode();
  const javaVersion = checkJava();
  log(`Node ${process.versions.node}, Java ${javaVersion} — OK`);

  await ensurePortFree(BACKEND_PORT, "backend");
  await ensurePortFree(FRONTEND_PORT, "frontend");

  installFrontendDeps();

  log("Starting backend on " + cyan(`http://localhost:${BACKEND_PORT}`) + " and frontend on " + magenta(FRONTEND_URL));
  log(yellow("The first run downloads Maven and the backend dependencies — this can take a few minutes."));

  const mavenArgs = ["-B", "--no-transfer-progress", "spring-boot:run"];
  if (isWindows) {
    // Explicit ".\" because cmd.exe may be configured not to search the current directory.
    run("backend", cyan("[backend] "), ".\\mvnw.cmd", mavenArgs, BACKEND_DIR, { shell: true });
  } else {
    run("backend", cyan("[backend] "), "sh", ["./mvnw", ...mavenArgs], BACKEND_DIR);
  }

  const viteBin = path.join(FRONTEND_DIR, "node_modules", "vite", "bin", "vite.js");
  run("frontend", magenta("[frontend]"), process.execPath, [viteBin], FRONTEND_DIR);

  await waitUntilReady();
  printReadyBanner();
  if (openBrowserWhenReady) openBrowser(FRONTEND_URL);
}

main();
