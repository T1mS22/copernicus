// The package ships the EFF large wordlist as a CommonJS object keyed by dice
// rolls ("11111" → "abacus").
declare module "diceware-wordlist-en-eff" {
  const wordlist: Record<string, string>;
  export default wordlist;
}
