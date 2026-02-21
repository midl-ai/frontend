/**
 * Solidity compiler wrapper using solc
 * Compiles source code and returns ABI + bytecode
 */

import solc from 'solc';

export interface CompileResult {
  success: true;
  abi: unknown[];
  bytecode: `0x${string}`;
  contractName: string;
}

export interface CompileError {
  success: false;
  error: string;
  details?: string[];
}

/**
 * Compile Solidity source code
 */
export function compileSolidity(
  sourceCode: string,
  contractName: string
): CompileResult | CompileError {
  const input = {
    language: 'Solidity',
    sources: {
      'contract.sol': {
        content: sourceCode,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode'],
        },
      },
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  };

  try {
    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    // Check for compilation errors
    const errors = output.errors?.filter(
      (e: { severity: string }) => e.severity === 'error'
    ) ?? [];

    if (errors.length > 0) {
      const errorMessages = errors.map(
        (e: { formattedMessage: string }) => e.formattedMessage
      );
      return {
        success: false,
        error: 'Compilation failed',
        details: errorMessages,
      };
    }

    // Get the compiled contract
    const contract = output.contracts?.['contract.sol']?.[contractName];

    if (!contract) {
      const availableContracts = Object.keys(
        output.contracts?.['contract.sol'] ?? {}
      );
      return {
        success: false,
        error: `Contract "${contractName}" not found`,
        details: availableContracts.length > 0
          ? [`Available contracts: ${availableContracts.join(', ')}`]
          : ['No contracts found in source'],
      };
    }

    const bytecode = contract.evm?.bytecode?.object;
    if (!bytecode) {
      return {
        success: false,
        error: 'No bytecode generated',
      };
    }

    return {
      success: true,
      abi: contract.abi,
      bytecode: `0x${bytecode}` as `0x${string}`,
      contractName,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown compilation error',
    };
  }
}
