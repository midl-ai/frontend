/**
 * MIDL SDK Configuration
 * Contains wallet connectors - only import in components that use wallet functionality
 */

import { createConfig, regtest } from '@midl/core';
import { xverseConnector } from '@midl/connectors';

// Re-export constants for backward compatibility
export {
  BTC_EXPLORER_URL,
  FAUCET_URL,
  midlRegtest,
  midlMainnet,
  getNetworkConfig,
  SATOSHIS_PER_BTC,
  WEI_PER_BTC,
  SATOSHI_TO_WEI,
  satoshisToWei,
  weiToSatoshis,
} from './constants';

/** MIDL SDK configuration with Xverse wallet connector */
export const midlConfig = createConfig({
  networks: [regtest],
  connectors: [xverseConnector()],
  persist: true,
});
