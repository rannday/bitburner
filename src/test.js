/** @param {NS} ns */
export async function main(ns) {
  let host = ns.args[0];
  let ram = ns.getServerMaxRam(host);
  ns.tprint(ram);
  let hasRam = ram === 0;
  ns.tprint(hasRam);
}