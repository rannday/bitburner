import {
  logInfo,
  bankBalance
} from './utils.js';

/**
 * Hacknet Maximums
 * 
 * Level, RAM, Cores, Cache
 * Actual: 300, 8192, 128, 15
 * 
 * Early game: 200, 64, 16
 */
const MAXLEVEL = 200;
const MAXRAM = 64;
const MAXCORES = 16;

/** @param {NS} ns */
export function pServerLimit(ns) {
  return ns.getPurchasedServerLimit() === ns.getPurchasedServers().length;
}

/** @param {int} level */
function levelMaxed(level) {
  return level === MAXLEVEL;
}

/** @param {int} ram */
function ramMaxed(ram) {
  return ram === MAXRAM;
}

/** @param {int} cores */
function coresMaxed(cores) {
  return cores === MAXCORES;
}

/** @param {Object} stats */
export function isNodeMaxed(stats) {
  return (levelMaxed(stats.level) && ramMaxed(stats.ram) && coresMaxed(stats.cores));
}

/** @param {NS} ns */
export function getNewNode(ns) {
  logInfo(ns, 'Attempting to purchase a new node');
  if (bankBalance(ns) > ns.hacknet.getPurchaseNodeCost()) {
    let index = ns.hacknet.purchaseNode();
    logInfo(ns, `Purchased new node with index ${index}`);
  } else {
    logInfo(ns, 'Not enough money for a new node');
  }
}

/**
 * @param {NS} ns
 * @param {int} index
 */
export function upgradeNode(ns, index) {
  logInfo(ns, `Attempting to upgrade node with index ${index}`);
  const hn = ns.hacknet;
  const stats = hn.getNodeStats(index);
  if (bankBalance(ns) > hn.getLevelUpgradeCost(index) && !levelMaxed(stats.level)) {
    hn.upgradeLevel(index);
    logInfo(ns, `Upgraded level of node ${index}`);
  }
  if (bankBalance(ns) > hn.getRamUpgradeCost(index) && !ramMaxed(stats.ram)) {
    hn.upgradeRam(index);
    logInfo(ns, `Upgraded RAM of node ${index}`);
  }
  if (bankBalance(ns) > hn.getCoreUpgradeCost(index) && !coresMaxed(stats.cores)) {
    hn.upgradeCore(index);
    logInfo(ns, `Upgraded cores of node ${index}`);
  }
}