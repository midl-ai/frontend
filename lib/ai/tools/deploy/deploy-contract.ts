import { tool } from 'ai';
import { z } from 'zod';
import { getNetworkConfig } from '@/lib/midl/config';
import type { ContractDeployTransaction } from '../types';

/** Base URL for internal API calls */
const getBaseUrl = () => {
  // In server context, use localhost
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};

export const midl_deploy_contract = tool({
  description:
    'Deploy a smart contract to the MIDL EVM layer. Compiles template server-side and returns prepared deployment transaction for wallet signing.',
  inputSchema: z.object({
    template: z
      .enum(['erc20', 'counter', 'storage'])
      .optional()
      .describe('Contract template to deploy'),
    params: z
      .record(z.string(), z.string())
      .optional()
      .describe('Parameters for the template (e.g., {name: "MyToken", symbol: "MTK", initialSupply: "1000000"})'),
    customSource: z
      .string()
      .optional()
      .describe('Custom Solidity source code. Use instead of template.'),
    customContractName: z
      .string()
      .optional()
      .describe('Contract name in custom source. Required with customSource.'),
  }),
  execute: async ({ template, params, customSource, customContractName }) => {
    const config = getNetworkConfig();

    try {
      // Call the compile API
      const response = await fetch(`${getBaseUrl()}/api/compile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template,
          params,
          customSource,
          customContractName,
        }),
      });

      const compileResult = await response.json();

      if (!compileResult.success) {
        // Return validation error with helpful info
        return {
          success: false,
          error: compileResult.error,
          data: {
            template,
            requiredParams: compileResult.requiredParams,
            availableTemplates: compileResult.availableTemplates,
            details: compileResult.details,
          },
        };
      }

      // Build transaction with compiled bytecode
      const transaction: ContractDeployTransaction = {
        type: 'contract_deploy',
        template: template || 'custom',
        params: params || {},
        bytecode: compileResult.bytecode,
        explorerUrl: config.explorerUrl,
      };

      console.log('[deploy-contract] Compiled successfully, bytecode length:', compileResult.bytecode.length);

      return {
        success: true,
        data: {
          transaction,
          abi: compileResult.abi,
          contractName: compileResult.contractName,
        },
      };
    } catch (error) {
      console.error('[deploy-contract] Compilation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to compile contract',
      };
    }
  },
});
