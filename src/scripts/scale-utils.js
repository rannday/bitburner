import {
  logInfo,
  copyScript,
  execScript,
  bankBalance,
  moneyForm
} from './utils.js';

/**
 * @param {NS} ns
 * @param {int} size
 * @param {int} pSrvCount
 */
export function buyServer(ns, size, pSrvCount) {
  const cost = ns.getPurchasedServerCost(size);
  const count = pSrvCount + 1;
  const name = 'psrv-' + count;
  const limit = ns.getPurchasedServerLimit()
  if (pSrvCount !== limit) {
    if (bankBalance(ns) > cost) {
      ns.purchaseServer(name, size);
      logInfo(ns, `Purchased ${size}Gb server`);
    } else {
      logInfo(ns, 'Not enough money for a new server');
      logInfo(ns, `New server cost: ${moneyForm.format(cost)}`);
    }
  } else {
    logInfo(ns, `At purchased server limit: ${limit}`)
  }
}

/**
 * @param {NS} ns
 * @param {array} pServers
 * @param {string} script
 * @param {string} target
 */
export function makeMoney(ns, pServers, script, target) {
  for (let pSrv of pServers) {
    if (ns.scriptRunning(script, pSrv)) {
      continue;
    } else if (!ns.fileExists(script, pSrv)) {
      copyScript(ns, pSrv, script, 'home');
    }
    execScript(ns, pSrv, script, target);
  }
}