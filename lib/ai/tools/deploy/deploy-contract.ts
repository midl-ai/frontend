import { tool } from 'ai';
import { z } from 'zod';
import { getNetworkConfig } from '@/lib/midl/config';

/** Available contract templates */
const TEMPLATES = {
  erc20: {
    name: 'ERC20 Token',
    description: 'Standard ERC20 fungible token',
    params: ['name', 'symbol', 'initialSupply'],
  },
  counter: {
    name: 'Counter',
    description: 'Simple counter contract for testing',
    params: [],
  },
  storage: {
    name: 'Storage',
    description: 'Simple key-value storage contract',
    params: [],
  },
} as const;

export const midl_deploy_contract = tool({
  description:
    'Deploy a smart contract to the MIDL EVM layer. Supports templates or custom bytecode.',
  inputSchema: z.object({
    template: z
      .enum(['erc20', 'counter', 'storage'])
      .optional()
      .describe('Contract template to deploy'),
    params: z
      .record(z.string(), z.string())
      .optional()
      .describe('Parameters for the template (e.g., {name: "MyToken", symbol: "MTK"})'),
    customBytecode: z
      .string()
      .optional()
      .describe('Custom contract bytecode (0x prefixed). Use instead of template.'),
    customAbi: z
      .string()
      .optional()
      .describe('Custom contract ABI as JSON. Required with customBytecode.'),
  }),
  execute: async ({ template, params }) => {
    const config = getNetworkConfig();

    // Validate template params if using template
    if (template) {
      const templateDef = TEMPLATES[template];
      const missingParams = templateDef.params.filter(
        (p) => !params || !(p in params)
      );

      if (missingParams.length > 0) {
        return {
          success: false,
          error: `Missing required parameters: ${missingParams.join(', ')}`,
          data: {
            template,
            requiredParams: templateDef.params,
          },
        };
      }
    }

    // Deployment requires wallet - return info for frontend to handle
    return {
      success: false,
      error: 'Contract deployment requires wallet signing. Please connect your wallet.',
      data: {
        template,
        params,
        explorerUrl: config.explorerUrl,
        requiresWallet: true,
        availableTemplates: Object.entries(TEMPLATES).map(([key, val]) => ({
          id: key,
          name: val.name,
          description: val.description,
          params: val.params,
        })),
      },
    };
  },
});
