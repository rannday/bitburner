/** @param {NS} ns */
export function termError(ns, msg) {
  ns.tprintf('ERROR: %s', msg);
}

/** @param {NS} ns */
export function termInfo(ns, msg) {
  ns.tprintf('INFO: %s', msg);
}

/** @param {NS} ns */
export function logError(ns, msg) {
  ns.printf('ERROR: %s', msg);
}

/** @param {NS} ns */
export function logInfo(ns, msg) {
  ns.printf('INFO %s', msg);
}

/** @param {NS} ns */
export function bankBalance(ns) {
  return ns.getServerMoneyAvailable('home');
}

/** Money Formatter - USD */
export const moneyForm = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

/**
 * @param {NS} ns
 * @param {string} host
 */
export function getThresholds(ns, host) {
  let moneyThresh = ns.getServerMaxMoney(host) * 0.75;
  let securThresh = ns.getServerMinSecurityLevel(host) + 5;
  return { moneyThresh, securThresh }
}

/**
 * @param {NS} ns
 * @param {string} host
 * @param {string} script
 */
export function getThreads(ns, host, script) {
  let srvMemUsed = ns.getServerUsedRam(host);
  let srvMemMax = ns.getServerMaxRam(host);
  let scriptMem = ns.getScriptRam(script, host);
  let srvMemAvail = srvMemMax - srvMemUsed;
  return Math.floor(srvMemAvail / scriptMem);
}

/**
 * @param {NS} ns
 * @param {string} host
 * @param {string} script
 */
export function copyScript(ns, host, script, source) {
  ns.scp(script, host, source);
  logInfo(ns, `Copied ${script} from ${source} to ${host}`);
}

/**
 * @param {NS} ns
 * @param {string} host
 * @param {string} script
 * @param {string} target
 */
export function execScript(ns, host, script, target) {
  let threads = getThreads(ns, host, script);
  ns.exec(script, host, threads, target);
  logInfo(ns, `Started ${script} with ${threads} threads on ${host} to ${target}`);
}

/**
 * @param {NS} ns
 * @param {string} host
 * @param {string} script
 * @param {string} target
 */
export function runScript(ns, host, script, target) {
  let threads = getThreads(ns, host, script);
  ns.run(script, threads, target);
  logInfo(ns, `Started ${script} with ${threads} threads on ${host} to ${target}`);
}

/** @param {NS} ns */
export function getHostsDFS(ns) {
  let visited = {};
  let hosts = ['home'];
  while (hosts.length > 0) {
    let host = hosts.pop();
    if (!visited[host]) {
      visited[host] = host;
      let neighbors = ns.scan(host);
      for (let node of neighbors) {
        if (visited[node]) {
          continue;
        }
        hosts.push(node);
      }
    }
  }
  visited = Object.keys(visited).filter(e => !e.includes('home'));
  visited = visited.filter(e => !e.includes('psrv-'));
  visited = visited.filter(e => !e.includes('darkweb'));
  return visited; 
}

/**
 * @param {NS} ns
 * @param {array} hosts
 */
export function getBestHost(ns, hosts) {
  let amounts = {};
  hosts.forEach(e => {
    if (ns.hasRootAccess(e)) {
      amounts[e] = ns.getServerMaxMoney(e);
    }    
  });
  // Find largest number - found on stackoverflow
  let bestValue = Object.values(amounts).sort((a,b)=>a-b).reverse()[0];
  let bestKey;
  for (let key in amounts) {
    if (amounts[key] === bestValue) {
      bestKey = key;
      logInfo(ns, `Best host - ${key}: ${moneyForm.format(bestValue)}`);
    }
  }
  return bestKey;
}