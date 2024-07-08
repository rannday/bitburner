import {
  runScript,
  getHostsDFS,
  getBestHost
} from 'scripts/utils.js';

import {
  buyServer,
  makeMoney
} from 'scripts/scale-utils.js';

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.tail();
  
  const script = 'money.js';
  // Kill script so we have enough RAM 
  if (ns.scriptRunning(script, 'home')) {
    ns.scriptKill(script, 'home');
  }

  const SIZE = 64;
  const hosts = getHostsDFS(ns);
  const target = getBestHost(ns, hosts);
  
  let pServers = ns.getPurchasedServers();
  // Attempt to buy a server
  buyServer(ns, SIZE, pServers.length);

  pServers = ns.getPurchasedServers();
  // Make money on purchased servers
  makeMoney(ns, pServers, script, target);

  // Make money on home server
  runScript(ns, 'home', script, target);
}