import {
  termError,
  termInfo,
  moneyForm
} from './utils.js';

/**
 * @param {NS} ns
 * @param {string} host
 * 
 * Get target host system info
 * If no arguments provided, use 'home'
 */
export async function main(ns) {
  let host;
  if (ns.args.length > 0) {
    host = ns.args[0];
  } else {
    host = 'home';
  }
  if (!ns.serverExists(host)) {
    termError('Host not found');
  }
  termInfo(ns, `Host - ${host}`);
  termInfo(ns, '----------------------------------------')

  let hostMoney = ns.getServerMoneyAvailable(host);
  termInfo(ns, `Money Available: ${moneyForm.format(hostMoney)}`);
  let hostMaxMoney = ns.getServerMaxMoney(host);
  termInfo(ns, `Maximum Money: ${moneyForm.format(hostMaxMoney)}`);
}