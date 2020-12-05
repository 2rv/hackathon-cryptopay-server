export const API = {
  BITCOIN_TRANSACTION: ({ transaction }) =>
    `https://blockchain.info/rawtx/${this.transaction}`,
  BITCOIN_ADDRESS: ({ address }) =>
    `https://blockchain.info/rawaddr/${address}`,
};
