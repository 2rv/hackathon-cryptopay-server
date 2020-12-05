import * as openpgp from 'openpgp';

export const EncryptKey = async (
  code: string,
  publicKey: string,
): Promise<string> => {
  const { data: encrypted } = await openpgp.encrypt({
    message: openpgp.message.fromText(code),
    publicKeys: (await openpgp.key.readArmored(publicKey)).keys,
  });

  return encrypted;
};
