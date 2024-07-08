import {
  termInfo,
  logInfo,
  execScript,
  getHostsDFS,
  getBestHost
} from 'scripts/utils.js';

import {
  canHack,
  crackOpen,
  hasRam,
  makeMoney
} from 'scripts/worm-utils.js';

/**
 * @param {NS} ns
 * 
 * Rework so it can run forever, forever growing, hacking, and making money
 */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.tail();

  const script = 'money.js';
  if (ns.scriptRunning(script, 'home')) {
    ns.scriptKill(script, 'home');
  }

  const cracks = {
    'BruteSSH.exe': ns.brutessh,
    'FTPCrack.exe': ns.ftpcrack,
    'relaySMTP.exe': ns.relaysmtp,
    'HTTPWorm.exe': ns.httpworm,
    'SQLInject.exe': ns.sqlinject
  };

  while (true) {

    let hosts = getHostsDFS(ns);
    let bestHost = getBestHost(ns, hosts);
    
    for (let host of hosts) {
      // If host has no ram, skip
      if (!hasRam(ns, host)) {
        continue;
      }
      
      // If rooted & has ram & money, make some money on it
      if (ns.hasRootAccess(host)) {
        makeMoney(ns, host, script, bestHost);
        continue; 
      }
      // Crack, nuke & hack, if possible, then make some money on it
      if (canHack(ns, host, cracks)) {
        logInfo(ns, `Can crack ${host}`);
        crackOpen(ns, host, cracks);

        ns.nuke(host);
        logInfo(ns, `Nuked ${host}`);
        
        logInfo(ns, `Hacking ${host}`);
        await ns.hack(host);
        logInfo(ns, `${host} hacked`);
        
        bestHost = getBestHost(ns, hosts);
        
        makeMoney(ns, host, script, bestHost);
        termInfo(ns, `Now making money on ${host}`);
      }

      logInfo(ns, '----------');
      await ns.sleep(1000);
    }// hosts loop

    logInfo(ns, '--------------------');
    await ns.sleep(1000);
  }// while loop
}// main