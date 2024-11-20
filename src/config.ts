export const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
export const apiKey = process.env.COIN_GECKO_API_KEY!;
export const cryptoExchangeId = process.env.CRYPTO_EXCHANGE_ID ?? 'binance';