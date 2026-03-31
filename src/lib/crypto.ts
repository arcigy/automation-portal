import { select } from './db';

/**
 * Encrypt a value using Postgres' pgcrypto symmetric encryption.
 * @param value The plaintext value to encrypt
 * @returns The encrypted hex string from the DB
 */
export async function encrypt(value: string): Promise<string> {
  const key = process.env.APP_CRYPTO_KEY;
  if (!key) throw new Error('APP_CRYPTO_KEY is not defined');

  // Using encode(..., 'hex') to return a string
  const res = await select<{ encrypted: string }>(
    `SELECT encode(pgp_sym_encrypt($1, $2, 'cipher-algo=aes256'), 'hex') as encrypted`,
    [value, key]
  );
  return res[0].encrypted;
}

/**
 * Decrypt a value using Postgres' pgcrypto symmetric encryption.
 * @param hexValue The hex string of the encrypted data
 * @returns The plaintext value
 */
export async function decrypt(hexValue: string): Promise<string> {
  const key = process.env.APP_CRYPTO_KEY;
  if (!key) throw new Error('APP_CRYPTO_KEY is not defined');

  const res = await select<{ decrypted: string }>(
    `SELECT pgp_sym_decrypt(decode($1, 'hex'), $2, 'cipher-algo=aes256') as decrypted`,
    [hexValue, key]
  );
  return res[0].decrypted;
}
