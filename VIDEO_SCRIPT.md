# MIDL.AI - Hackathon Demo Video Script
## "The First AI Terminal for Bitcoin+EVM Hybrid Chain"
### Duration: 5 minutes

---

## Demo Sequence

### 1. Orientation (30 seconds)

**[Show midl-ai.xyz homepage]**

> "This is MIDL.AI — the first AI-powered terminal for MIDL Protocol, the world's first Bitcoin L1 + EVM L2 hybrid blockchain.

> MIDL combines Bitcoin's security with EVM's programmability. But this power comes with complexity. That's where MIDL.AI comes in — making blockchain interaction as simple as conversation."

**[Click into chat interface]**

> "Let me show you."

---

### 2. Check Balance (30 seconds)

**[Type in chat]**
> *"What's my balance?"*

**[AI response shows]**
```
→ get_evm_balance, get_btc_balance
← Balance card displays:
   Bitcoin L1: 2.5 BTC
   EVM L2: 1.8 BTC
   [Explorer links shown]
```

> "Notice how it checks both layers automatically. Bitcoin UTXO balance on L1, EVM account balance on L2. One question, both answers."

---

### 3. The Magic Moment — Deploy Contract (60 seconds)

**[Type in chat]**
> *"Deploy an ERC20 token called BitcoinCoffee with symbol BCOF and 1 million initial supply"*

**[Show AI thinking, then response]**
```
→ deploy_contract (AI generates Solidity, compiles, deploys)
← Contract deployment card shows:
   Contract: BitcoinCoffee (BCOF)
   Address: 0x8f3C...6A063
   Supply: 1,000,000 BCOF
   Block: 12346
   Gas Used: 245,000
   [Blockscout explorer link]
```

> "Watch this. The AI generated the Solidity code, compiled it using solc, deployed it to MIDL testnet, and gave me the contract address with an explorer link.

> I didn't configure Hardhat. I didn't write a deployment script. I didn't expose my private key. Zero setup. It just works."

**[Click explorer link to verify]**

> "And here it is live on Blockscout."

---

### 4. Read Contract State (45 seconds)

**[Type in chat]**
> *"Check the total supply of BitcoinCoffee"*

**[AI response]**
```
→ read_contract (totalSupply function)
← Contract read card shows:
   Function: totalSupply()
   Returns: 1,000,000 BCOF
   Contract: 0x8f3C...6A063
```

> "Simple contract read. No ABI hunting. No web3 setup. Just ask."

---

### 5. Transfer Tokens (45 seconds)

**[Type in chat]**
> *"Transfer 100 BCOF to 0x742d35Cc6634C0532925a3b844Bc9e7595f2bD78"*

**[AI response]**
```
→ transfer_token
← Transaction card shows:
   Status: Confirmed
   Amount: 100 BCOF
   To: 0x742d...2bD78
   Tx Hash: 0xabc123...
   Block: 12347
   Gas: 52,000
   [Explorer link]
```

> "Transaction submitted, confirmed in ~5 seconds. Full receipt with gas used, block confirmation, explorer link."

---

### 6. Voice Mode Demo (30 seconds)

**[Click voice mode button]**

**[Speak]**
> *"What's the current block number?"*

**[AI responds audibly + shows card]**
```
Voice: "The current block is 12,348 on MIDL testnet."
Card: Block #12,348
      Timestamp: 2 seconds ago
      Network: Testnet (0x3A99)
```

> "Voice mode works too. OpenAI Realtime API integration. Speak your command, get voice + visual response."

---

### 7. Runes Showcase (45 seconds)

**[Return to text input]**

**[Type]**
> *"What Runes do I have?"*

**[AI response]**
```
→ get_runes
← Rune portfolio table:
   | Rune ID     | Name            | Balance  |
   |-------------|-----------------|----------|
   | 840000:1    | UNCOMMON•GOODS  | 1,000    |
   | 840001:2    | RARE•TREASURE   | 500      |
   [ERC20 bridge available for each]
```

> "MIDL supports Bitcoin Runes — fungible tokens on Bitcoin L1. We've integrated full Rune management: balance queries, transfers, and bridging to ERC20 on the EVM layer."

---

### 8. MCP Server Demo (30 seconds)

**[Switch to Claude Desktop screen recording]**

> "Everything you just saw is also available as an MCP server for Claude Desktop and Cursor."

**[Show Claude Desktop with MIDL tools loaded]**

**[Type in Claude]**
> *"Show me the MIDL system contracts"*

**[Claude responds with MCP UI card]**
```
→ midl_get_system_contracts
← System Contracts table:
   Executor: 0x0000...0001
   Bridge: 0x0000...0002
   Rune Factory: 0x0000...0003
   [All with explorer links]
```

> "Same 27 tools. Two interfaces. One for end users at midl-ai.xyz. One for developers in their IDE."

---

### 9. Closing (15 seconds)

**[Show both interfaces side by side]**

> "MIDL.AI: The first AI terminal for Bitcoin+EVM hybrid chain.

> 27 tools across 9 categories. Generative UI. Voice mode. MCP integration. Production-ready. Open source.

> Live now at midl-ai.xyz"

**[Show URLs]**
```
midl-ai.xyz
mcp.midl-ai.xyz/mcp
github.com/midl-ai
```

---

## Key Talking Points

### Opening Hook
- **"First MCP for MIDL"** — No existing AI tooling for this Bitcoin+EVM hybrid
- **Problem statement** — MIDL's power comes with complexity (BIP322, intention-based tx, dual layers)
- **Solution** — Natural language makes it invisible

### Magic Moment
- **"Deploy an ERC20"** — Zero Hardhat setup, no deployment scripts, instant result
- **Emphasize:** Generated code + compiled + deployed + returned address
- **Visual proof:** Click to Blockscout to verify it's actually live

### Differentiation
- **27 tools** — Complete coverage: read, write, deploy, transfer, bridge
- **Dual interface** — Chat terminal (midl-ai.xyz) + MCP server (Claude Desktop)
- **Voice mode** — OpenAI Realtime API integration
- **Generative UI** — Not just text, rich visual cards everywhere

### Technical Credibility
- **Production stack:** Next.js 16, React 19, PostgreSQL, Redis
- **AI infrastructure:** Vercel AI SDK v6, Anthropic, OpenAI
- **MIDL integration:** Official SDK (@midl/core, @midl/executor, @midl/viem)
- **Code quality:** TypeScript strict mode, 300-line file limit, tested against testnet

### Call to Action
- **Try it:** midl-ai.xyz
- **Install MCP:** mcp.midl-ai.xyz/mcp
- **Open source:** github.com/midl-ai

---

## Pre-Demo Checklist

- [ ] Wallet funded with testnet BTC (minimum 1 BTC for gas)
- [ ] Chat interface tested at midl-ai.xyz
- [ ] Voice mode tested and working
- [ ] Claude Desktop with MIDL MCP installed and verified
- [ ] Blockscout explorer open in tab for verification clicks
- [ ] Network: testnet (not mainnet)
- [ ] Browser: no ad blockers interfering with WebSocket
- [ ] Microphone permissions granted for voice mode
- [ ] Screen recording software tested (OBS, QuickTime, etc.)
- [ ] Internet connection stable (for RPC calls)

---

## Visual Assets Needed

### Screenshots
- [ ] midl-ai.xyz homepage with clean chat interface
- [ ] Balance card showing both L1 and L2 balances
- [ ] Contract deployment card with all details
- [ ] Transaction receipt card with confirmation
- [ ] Rune portfolio table with multiple runes
- [ ] MCP UI card in Claude Desktop
- [ ] Voice mode active state with waveform
- [ ] System contracts table

### Screen Recordings
- [ ] Full demo flow (5 minutes)
- [ ] Deploy contract sequence (emphasize speed)
- [ ] Voice mode interaction (audio + visual)
- [ ] Claude Desktop with MIDL MCP tools

### B-Roll
- [ ] Code editor showing tool implementations (if needed)
- [ ] Blockscout explorer showing confirmed transactions
- [ ] Network diagram: Bitcoin L1 ↔ EVM L2
- [ ] Tool category grid (9 categories, 27 tools)

---

## Demo Flow Variations

### If Demo Runs Short (< 5 min)

Add:
- Bridge demo: *"Bridge 0.1 BTC from L1 to L2"*
- Contract write: *"Call the increment function on the Counter contract"*
- Gas estimation: *"Estimate gas for transferring 50 tokens"*

### If Demo Runs Long (> 5 min)

Cut:
- Voice mode demo (mention but don't show)
- Runes showcase (mention capability but skip demo)
- MCP server demo (mention but focus on web interface)

### If Technical Issues Occur

**Fallback Options:**
1. Pre-recorded screen capture of successful operations
2. Show screenshots of completed transactions on Blockscout
3. Walk through codebase showing the 27 tool implementations
4. Focus on architecture explanation with diagrams

---

## Audience-Specific Variations

### For Technical Judges

Emphasize:
- Plugin architecture (PluginBase → ToolBase pattern)
- Dual transport (stdio + HTTP)
- Type safety (TypeScript strict, Zod schemas)
- Error handling (structured responses, never throw)
- Testing (all tools tested against testnet)

### For Business Judges

Emphasize:
- User experience (conversational vs CLI)
- Market gap (first for MIDL, no competitors)
- Adoption potential (lowers barrier to entry)
- Completeness (27 tools, 2 interfaces, production-ready)
- Documentation (6 doc pages at midl-ai.xyz/docs)

### For Design Judges

Emphasize:
- Generative UI pattern (custom React components per tool)
- Visual consistency (all cards follow design system)
- Dark/light mode support
- Mobile responsiveness
- Voice mode UX (audio + visual confirmation)

---

## Closing Variations

### Standard Close
> "MIDL.AI is live at midl-ai.xyz. Try it yourself. Install the MCP server. Build something. It's 100% open source. Thank you."

### Confident Close
> "This is the future of blockchain interaction. No CLIs. No SDKs. Just conversation. MIDL.AI — talk to your blockchain."

### Community Close
> "We're just getting started. This is open source. MIT license. Fork it. Build on it. Add your own tools. Let's make blockchain accessible together."

---

## Post-Demo Q&A Prep

### Expected Questions

**Q: "Is this production-ready?"**
A: "Yes. PostgreSQL persistence, Redis caching, comprehensive error handling, tested against testnet. It's live at midl-ai.xyz."

**Q: "How does voice mode work?"**
A: "OpenAI Realtime API with function calling. Audio input/output via Web Audio API. Same 27 tools, just voice-triggered."

**Q: "What about security?"**
A: "Server-side signing with MIDL_PRIVATE_KEY environment variable. Never exposed to client. Transaction confirmation required before execution."

**Q: "Can I use this in my own app?"**
A: "Yes. The MCP server supports HTTP transport. JSON-RPC style. Integrate it as a REST endpoint in your existing architecture."

**Q: "How is this different from ChatGPT plugins?"**
A: "Three ways: (1) Purpose-built for MIDL's hybrid architecture. (2) Uses Model Context Protocol standard, not proprietary APIs. (3) Dual interface — web chat + MCP server for Claude/Cursor."

**Q: "What's next?"**
A: "Mainnet deployment. Multi-wallet support (MetaMask, Rabby). More contract templates (NFTs, DEX). Community plugin system."

---

## Technical Difficulties Troubleshooting

### RPC Connection Issues
- Switch to backup RPC endpoint
- Mention "network latency" and continue with pre-recorded fallback

### Voice Mode Fails
- Skip voice demo, mention it works
- Focus on text-based interactions

### Transaction Takes Too Long
- Explain: "Waiting for block confirmation — this is real blockchain interaction"
- Show pending transaction card
- Continue with other demos while it confirms

### Claude Desktop MCP Not Responding
- Skip MCP demo
- Focus on web interface
- Mention: "MCP integration is fully functional, documented at mcp.midl-ai.xyz/mcp"

---

## Success Metrics

Demo succeeds if judges see:
1. Contract deployment from natural language (magic moment)
2. Both Bitcoin L1 and EVM L2 interactions (hybrid chain)
3. Rich visual responses (generative UI differentiation)
4. Either voice mode OR MCP server (innovation showcase)
5. Live verification on Blockscout (proof of production)

**Minimum viable demo:** Items 1, 2, 3, and 5
**Ideal demo:** All 5 items + smooth delivery under 5 minutes
