/**
 * Tool Mapping for OpenAI Realtime API
 * Converts MIDL tools to OpenAI function definitions
 */

/** OpenAI Realtime tool definition format */
export interface RealtimeToolDefinition {
  type: 'function';
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, { type: string; description?: string; enum?: string[] }>;
    required: string[];
  };
}

/** Tools that require wallet signing (return transaction objects) */
export const TRANSACTION_TOOLS = new Set([
  'midl_transfer_evm',
  'midl_transfer_token',
  'midl_transfer_rune',
  'midl_bridge_btc_to_evm',
  'midl_bridge_evm_to_btc',
  'midl_bridge_rune_to_erc20',
  'midl_bridge_erc20_to_rune',
  'midl_deploy_contract',
  'midl_send_raw_transaction',
]);

/** Check if a tool requires transaction signing */
export function isTransactionTool(toolName: string): boolean {
  return TRANSACTION_TOOLS.has(toolName);
}

/** Get all MIDL tool definitions for OpenAI Realtime API */
export function getMidlToolDefinitions(): RealtimeToolDefinition[] {
  return [
    // Network tools (3)
    {
      type: 'function',
      name: 'midl_get_network_info',
      description: 'Get current network information including chain ID, block number, and RPC endpoints',
      parameters: { type: 'object', properties: {}, required: [] },
    },
    {
      type: 'function',
      name: 'midl_get_block',
      description: 'Get block information by number or hash',
      parameters: {
        type: 'object',
        properties: {
          blockIdentifier: {
            type: 'string',
            description: 'Block number or hash. Use "latest" for the most recent block.',
          },
        },
        required: [],
      },
    },
    {
      type: 'function',
      name: 'midl_get_system_contracts',
      description: 'Get addresses of MIDL system contracts (bridge, rune factory, etc.)',
      parameters: { type: 'object', properties: {}, required: [] },
    },

    // Balance tools (3)
    {
      type: 'function',
      name: 'midl_get_evm_balance',
      description: 'Get BTC balance on the EVM layer for an address',
      parameters: {
        type: 'object',
        properties: {
          address: {
            type: 'string',
            description: 'EVM address to check. If not provided, uses connected wallet.',
          },
        },
        required: [],
      },
    },
    {
      type: 'function',
      name: 'midl_get_btc_balance',
      description: 'Get BTC balance on the Bitcoin layer',
      parameters: {
        type: 'object',
        properties: {
          address: {
            type: 'string',
            description: 'Bitcoin address to check. If not provided, uses connected wallet.',
          },
        },
        required: [],
      },
    },
    {
      type: 'function',
      name: 'midl_get_token_balance',
      description: 'Get ERC-20 token balance for an address',
      parameters: {
        type: 'object',
        properties: {
          tokenAddress: { type: 'string', description: 'ERC-20 token contract address' },
          ownerAddress: {
            type: 'string',
            description: 'Address to check balance for. Uses connected wallet if not provided.',
          },
        },
        required: ['tokenAddress'],
      },
    },

    // Bitcoin tools (4)
    {
      type: 'function',
      name: 'midl_get_utxos',
      description: 'Get unspent transaction outputs (UTXOs) for a Bitcoin address',
      parameters: {
        type: 'object',
        properties: {
          address: {
            type: 'string',
            description: 'Bitcoin address. Uses connected wallet if not provided.',
          },
        },
        required: [],
      },
    },
    {
      type: 'function',
      name: 'midl_get_transaction',
      description: 'Get Bitcoin transaction details by transaction ID',
      parameters: {
        type: 'object',
        properties: {
          txid: { type: 'string', description: 'Bitcoin transaction ID (txid)' },
        },
        required: ['txid'],
      },
    },
    {
      type: 'function',
      name: 'midl_get_transaction_receipt',
      description: 'Get EVM transaction receipt by hash',
      parameters: {
        type: 'object',
        properties: {
          hash: { type: 'string', description: 'EVM transaction hash' },
        },
        required: ['hash'],
      },
    },
    {
      type: 'function',
      name: 'midl_get_fee_rate',
      description: 'Get current Bitcoin fee rate estimates',
      parameters: { type: 'object', properties: {}, required: [] },
    },

    // Contract tools (3)
    {
      type: 'function',
      name: 'midl_read_contract',
      description:
        'Read data from a smart contract. Supports ERC-20 (name, symbol, decimals, totalSupply, balanceOf) and Counter (getCount)',
      parameters: {
        type: 'object',
        properties: {
          contractType: {
            type: 'string',
            enum: ['erc20', 'counter'],
            description: 'Type of contract to read',
          },
          address: { type: 'string', description: 'Contract address' },
          functionName: {
            type: 'string',
            description: 'Function to call (e.g., name, symbol, balanceOf, getCount)',
          },
          args: { type: 'string', description: 'JSON array of function arguments (optional)' },
        },
        required: ['contractType', 'address', 'functionName'],
      },
    },
    {
      type: 'function',
      name: 'midl_get_logs',
      description: 'Get contract event logs',
      parameters: {
        type: 'object',
        properties: {
          address: { type: 'string', description: 'Contract address to get logs from' },
          fromBlock: { type: 'string', description: 'Start block number (default: latest - 100)' },
          toBlock: { type: 'string', description: 'End block number (default: latest)' },
        },
        required: ['address'],
      },
    },
    {
      type: 'function',
      name: 'midl_verify_contract',
      description: 'Verify a deployed contract on the block explorer',
      parameters: {
        type: 'object',
        properties: {
          address: { type: 'string', description: 'Contract address to verify' },
          sourceCode: { type: 'string', description: 'Solidity source code' },
          contractName: { type: 'string', description: 'Contract name' },
        },
        required: ['address', 'sourceCode', 'contractName'],
      },
    },

    // Transfer tools (3)
    {
      type: 'function',
      name: 'midl_transfer_evm',
      description: 'Transfer BTC on the EVM layer to another address. Requires wallet signing.',
      parameters: {
        type: 'object',
        properties: {
          to: { type: 'string', description: 'Destination EVM address' },
          amount: { type: 'string', description: 'Amount to send' },
          unit: {
            type: 'string',
            enum: ['btc', 'wei'],
            description: 'Unit of amount (default: btc)',
          },
        },
        required: ['to', 'amount'],
      },
    },
    {
      type: 'function',
      name: 'midl_transfer_token',
      description: 'Transfer ERC-20 tokens to another address. Requires wallet signing.',
      parameters: {
        type: 'object',
        properties: {
          tokenAddress: { type: 'string', description: 'ERC-20 token contract address' },
          to: { type: 'string', description: 'Destination address' },
          amount: { type: 'string', description: 'Amount to send (in token units)' },
        },
        required: ['tokenAddress', 'to', 'amount'],
      },
    },
    {
      type: 'function',
      name: 'midl_send_raw_transaction',
      description: 'Send a raw signed transaction. Requires wallet signing.',
      parameters: {
        type: 'object',
        properties: {
          signedTx: { type: 'string', description: 'Signed transaction hex' },
        },
        required: ['signedTx'],
      },
    },

    // Bridge tools (3)
    {
      type: 'function',
      name: 'midl_bridge_btc_to_evm',
      description: 'Bridge BTC from Bitcoin layer to EVM layer. Requires wallet signing.',
      parameters: {
        type: 'object',
        properties: {
          amount: { type: 'string', description: 'Amount of BTC to bridge' },
          evmAddress: {
            type: 'string',
            description: 'Destination EVM address (uses connected wallet if not provided)',
          },
        },
        required: ['amount'],
      },
    },
    {
      type: 'function',
      name: 'midl_bridge_evm_to_btc',
      description: 'Bridge BTC from EVM layer back to Bitcoin layer. Requires wallet signing.',
      parameters: {
        type: 'object',
        properties: {
          amount: { type: 'string', description: 'Amount of BTC to withdraw' },
          btcAddress: {
            type: 'string',
            description: 'Destination Bitcoin address (uses connected wallet if not provided)',
          },
        },
        required: ['amount'],
      },
    },
    {
      type: 'function',
      name: 'midl_get_bridge_status',
      description: 'Check status of bridge transactions',
      parameters: {
        type: 'object',
        properties: {
          txid: { type: 'string', description: 'Transaction ID to check status for' },
        },
        required: [],
      },
    },

    // Runes tools (5)
    {
      type: 'function',
      name: 'midl_get_runes',
      description: 'List all runes owned by an address',
      parameters: {
        type: 'object',
        properties: {
          address: {
            type: 'string',
            description: 'Bitcoin address. Uses connected wallet if not provided.',
          },
        },
        required: [],
      },
    },
    {
      type: 'function',
      name: 'midl_get_rune_balance',
      description: 'Get balance of a specific rune',
      parameters: {
        type: 'object',
        properties: {
          runeId: { type: 'string', description: 'Rune ID (e.g., "840000:1")' },
          address: {
            type: 'string',
            description: 'Address to check. Uses connected wallet if not provided.',
          },
        },
        required: ['runeId'],
      },
    },
    {
      type: 'function',
      name: 'midl_transfer_rune',
      description: 'Transfer runes to another address. Requires wallet signing.',
      parameters: {
        type: 'object',
        properties: {
          runeId: { type: 'string', description: 'Rune ID to transfer' },
          to: { type: 'string', description: 'Destination Bitcoin address' },
          amount: { type: 'string', description: 'Amount of runes to transfer' },
        },
        required: ['runeId', 'to', 'amount'],
      },
    },
    {
      type: 'function',
      name: 'midl_bridge_rune_to_erc20',
      description: 'Bridge runes from Bitcoin to ERC-20 tokens on EVM. Requires wallet signing.',
      parameters: {
        type: 'object',
        properties: {
          runeId: { type: 'string', description: 'Rune ID to bridge' },
          amount: { type: 'string', description: 'Amount of runes to bridge' },
          evmAddress: {
            type: 'string',
            description: 'Destination EVM address (uses connected wallet if not provided)',
          },
        },
        required: ['runeId', 'amount'],
      },
    },
    {
      type: 'function',
      name: 'midl_bridge_erc20_to_rune',
      description: 'Bridge ERC-20 tokens back to runes on Bitcoin. Requires wallet signing.',
      parameters: {
        type: 'object',
        properties: {
          tokenAddress: { type: 'string', description: 'ERC-20 token address (rune wrapper)' },
          amount: { type: 'string', description: 'Amount to bridge back' },
          btcAddress: {
            type: 'string',
            description: 'Destination Bitcoin address (uses connected wallet if not provided)',
          },
        },
        required: ['tokenAddress', 'amount'],
      },
    },

    // Deploy tools (1)
    {
      type: 'function',
      name: 'midl_deploy_contract',
      description:
        'Deploy a smart contract to MIDL EVM. Templates: erc20, counter, storage. Requires wallet signing.',
      parameters: {
        type: 'object',
        properties: {
          template: {
            type: 'string',
            enum: ['erc20', 'counter', 'storage'],
            description: 'Contract template to deploy',
          },
          params: {
            type: 'string',
            description:
              'JSON object of parameters (e.g., {"name":"MyToken","symbol":"MTK","initialSupply":"1000000"})',
          },
        },
        required: ['template'],
      },
    },

    // Utility tools (3)
    {
      type: 'function',
      name: 'midl_estimate_gas',
      description: 'Estimate gas for an EVM transaction',
      parameters: {
        type: 'object',
        properties: {
          to: { type: 'string', description: 'Destination address' },
          data: { type: 'string', description: 'Transaction data (hex)' },
          value: { type: 'string', description: 'Value to send (in wei)' },
        },
        required: ['to'],
      },
    },
    {
      type: 'function',
      name: 'midl_convert_btc_to_evm',
      description: 'Convert a Bitcoin address to its corresponding EVM address',
      parameters: {
        type: 'object',
        properties: {
          btcAddress: { type: 'string', description: 'Bitcoin address to convert' },
        },
        required: ['btcAddress'],
      },
    },
    {
      type: 'function',
      name: 'midl_get_rune_erc20_address',
      description: 'Get the ERC-20 wrapper contract address for a rune',
      parameters: {
        type: 'object',
        properties: {
          runeId: { type: 'string', description: 'Rune ID to look up' },
        },
        required: ['runeId'],
      },
    },
  ];
}

/** Get system prompt for voice mode with contacts */
export function getMidlVoiceSystemPrompt(contacts: { name: string; evmAddress?: string; btcAddress?: string }[] = []): string {
  const contactList = contacts.length > 0
    ? contacts.map((c) => {
        const addrs = [];
        if (c.evmAddress) addrs.push(`EVM: ${c.evmAddress}`);
        if (c.btcAddress) addrs.push(`BTC: ${c.btcAddress}`);
        return `- ${c.name}: ${addrs.join(', ')}`;
      }).join('\n')
    : 'No contacts saved yet.';

  return `You are MIDL AI, a voice assistant for the MIDL blockchain terminal.

MIDL is a Bitcoin L1 + EVM L2 hybrid blockchain. You help users:
- Check balances (BTC, EVM, tokens, runes)
- Transfer assets between addresses
- Bridge BTC to EVM and back
- Deploy smart contracts
- Query blockchain state

VOICE INTERACTION GUIDELINES:
1. Be concise - users are listening, not reading
2. Confirm before executing transactions: "I'll transfer 0.5 BTC to Alex. Should I proceed?"
3. After transactions complete, summarize clearly: "Done! Transferred 0.5 BTC."
4. If unsure about an address or amount, ask for clarification
5. Use contact names when available instead of addresses

ADDRESS FORMATTING (CRITICAL):
6. NEVER spell out addresses character by character
7. For addresses: say "address starting with 0x58d3" or just use the contact name
8. For transaction hashes: say "transaction hash starting with 0x7a"
9. Keep technical details minimal in speech - the UI shows full details
10. Only mention the first 4-6 characters of any hash or address

USER'S CONTACTS:
${contactList}

When the user mentions a contact name (e.g., "send to Alex"), use their saved address.
If an address is not provided and no contact matches, ask for clarification.`;
}
