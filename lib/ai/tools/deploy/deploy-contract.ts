import { tool } from 'ai';
import { z } from 'zod';
import { getNetworkConfig } from '@/lib/midl/constants';
import { getTemplate, getTemplateInfo } from '@/lib/contracts/templates';
import { compileSolidity } from '@/lib/contracts/compiler';
import type { ContractDeployTransaction } from '../types';

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
      let sourceCode: string;
      let contractName: string;

      // Option 1: Custom source code
      if (customSource && customContractName) {
        sourceCode = customSource;
        contractName = customContractName;
      }
      // Option 2: Use template
      else if (template) {
        const templateDef = getTemplate(template);

        if (!templateDef) {
          return {
            success: false,
            error: `Unknown template: ${template}`,
            data: {
              availableTemplates: getTemplateInfo(),
            },
          };
        }

        // Validate required params
        const missingParams = templateDef.params
          .filter((p) => p.required)
          .filter((p) => !params || !(p.name in params));

        if (missingParams.length > 0) {
          return {
            success: false,
            error: `Missing required parameters: ${missingParams.map((p) => p.name).join(', ')}`,
            data: {
              template,
              requiredParams: templateDef.params,
              availableTemplates: getTemplateInfo(),
            },
          };
        }

        // Generate source from template
        const generated = templateDef.generate(params || {});
        sourceCode = generated.source;
        contractName = generated.contractName;
      }
      // No template or custom source provided
      else {
        return {
          success: false,
          error: 'Please specify a template or provide custom source code',
          data: {
            availableTemplates: getTemplateInfo(),
          },
        };
      }

      // Compile the source code
      console.log('[deploy-contract] Compiling contract:', contractName);
      const compileResult = compileSolidity(sourceCode, contractName);

      if (!compileResult.success) {
        return {
          success: false,
          error: compileResult.error,
          data: {
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
        mempoolUrl: config.mempoolUrl,
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
