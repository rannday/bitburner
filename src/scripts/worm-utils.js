import {
  termInfo,
  termError,
  logInfo,
  logError,
  copyScript,
  execScript,
  moneyForm,
  getThreads
} from './utils.js';

/**
 * @param {NS} ns
 * @param {array} cracks
 */
function getCracksCount(ns, cracks) {
  return Object.keys(cracks).filter(function (file) {
    return ns.fileExists(file, 'home');
  }).length;
}

/**
 * @param {NS} ns
 * @param {string} host
 * @param {array} cracks
 */
export function canHack(ns, host, cracks) {
  const crackCount = getCracksCount(ns, cracks);
  const myLevel = ns.getHackingLevel();
  const srvLevel = ns.getServerRequiredHackingLevel(host);
  const portsReq = ns.getServerNumPortsRequired(host);
  return (myLevel >= srvLevel) && (crackCount >= portsReq);
}

/**
 * @param {NS} ns
 * @param {string} host
 * @param {array} cracks
 */
export function crackOpen(ns, host, cracks) {
  for (let file of Object.keys(cracks)) {
    if (ns.fileExists(file, 'home')) {
      let runScript = cracks[file];
      runScript(host);
      termLog(`Ran ${file} on ${host}`);
    }
  }
}

/**
 * @param {NS} ns
 * @param {string} host
 */
export function hasRam(ns, host) {
  const ram = ns.getServerMaxRam(host);
  if (ram > 0) {
    return true;
  } else {
    logInfo(ns, `${host} as no ram`);
    return false;
  }
}

/**
 * @param {NS} ns
 * @param {string} host
 */
function hasMoney(ns, host) {
  const amount = ns.getServerMaxMoney(host);
  if (amount > 0) {
    logInfo(ns, `${host} has money`);
    return true;
  } else {
    return false;
  }
}

/**
 * @param {NS} ns
 * @param {string} host
 * @param {string} script
 */
function copyMoneyMaker(ns, host, script) {
  if (!ns.fileExists(script, host)) {
    copyScript(ns, host, script, 'home');
  }
}

/**
 * @param {NS} ns
 * @param {string} host
 * @param {string} script
 * 
 * Run money maker on server to self
 */
export function makeMoney(ns, host, script, target) {
  if (hasMoney(ns, host)) {
    if (!ns.scriptRunning(script, host)) {
      copyMoneyMaker(ns, host, script, 'home');
      execScript(ns, host, script, host);
    }
  } else {
    logInfo(ns, `${host} only has RAM`);
    if (!ns.scriptRunning(script, host)) {
      copyMoneyMaker(ns, host, script, 'home');
      execScript(ns, host, script, target);
    }
  }
}
