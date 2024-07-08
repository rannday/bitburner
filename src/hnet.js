import {
  logInfo,
  bankBalance
} from 'scripts/utils.js';

import {
  pServerLimit,
  isNodeMaxed,
  getNewNode,
  upgradeNode
} from 'scripts/hnet-utils.js';

/**
 * @param {NS} ns
 * 
 * Grow the Hacknet
 */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.tail();

  // Starting off, max nodes is infinite, so let's set a limit
  const MAXNODES = 12;
  // Leave a reserve in the bank so we can buy augments
  const RESERVE = 3000000000; 
  const hn = ns.hacknet;
  while (hn.numNodes() > 0) {

    // Keep looping until our cash is greater than our reserve
    if (bankBalance(ns) < RESERVE) {
      logInfo(ns, 'Not enough money in reserve, continuing...');
      await ns.sleep(10000);
      continue;
    }

    // Keep looping until we're maxed out on purchased servers
    if (!pServerLimit(ns)) {
      logInfo(ns, 'Not at purchased server limit, continuing...');
      await ns.sleep(10000);
      continue;
    }
    logInfo(ns, '--------------------------------------------------');
    logInfo(ns, 'Growing Hacknet');

    logInfo(ns, `Node count: ${hn.numNodes()}`);
    //let maxNodes = hn.maxNumNodes();
    //logInfo(ns, `Maximum node count: ${maxNodes}`);

    // Purchase a node if we have none
    if (hn.numNodes() === 0) {
      getNewNode(ns);
    }

    for (let i = 0; i < MAXNODES; i++) {
      if (!isNodeMaxed(hn.getNodeStats(i))) {
        upgradeNode(ns, i);
      } else {
        getNewNode(ns);
      }
    }

    await ns.sleep(1000);
  }
}