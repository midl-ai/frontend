# MIDL.AI - Hackathon Video Script
## "The First AI Terminal for Bitcoin+EVM Hybrid Chain"
### Duration: ~6 minutes

---

## INTRO (0:00 - 0:30)

**[Show MIDL.AI homepage with animated logo and hero section]**

> "What if you could deploy smart contracts, bridge Bitcoin, and manage runes just by talking?  What if blockchain interaction was as simple as having a conversation?

> This is MIDL.AI - the first AI-powered MCP terminal for MIDL Protocol, the world's first Bitcoin L1 + EVM L2 hybrid blockchain."

**[Show tagline: "Talk to Your Blockchain"]**

---

## THE PROBLEM (0:30 - 1:30)

**[Split screen: Show complex CLI commands vs confused user]**

> "Let's talk about what's broken in blockchain UX today.

> **Problem 1: Dual-Layer Complexity**
> MIDL Protocol combines Bitcoin's UTXO model with EVM's account model. That means users need to understand TWO completely different systems - Bitcoin transactions AND Ethereum-style smart contracts. It's powerful, but overwhelming.

> **Problem 2: No Developer Tools**
> If you're building on MIDL, there's no simple interface. No SDK. No AI integration. You're writing raw RPC calls and managing both Bitcoin UTXOs and EVM accounts manually.

> **Problem 3: CLI Hell**
> Want to deploy a contract? That's 10 commands. Bridge some BTC? Another 15. Transfer a rune? Good luck remembering the syntax.

**[Show frustrated developer with multiple terminal windows]**

> "In 2026, we can talk to AI about ANYTHING... except our blockchain. That's what we're fixing."

---

## THE SOLUTION (1:30 - 2:30)

**[Show MIDL.AI interface with clean chat UI]**

> "MIDL.AI is TWO things:

> **First: An AI Chat Terminal**
> A beautiful Next.js interface where you interact with MIDL through natural language. Ask questions. Deploy contracts. Bridge assets. Transfer runes. All through conversation.

> **Second: An MCP Server**
> A standalone Model Context Protocol server that works with Claude Desktop, Cursor, and any MCP client. Install once, use everywhere.

> **The Power: 27 Tools Across 9 Categories**
> - Network tools for system info
> - Balance tools for checking funds
> - Transfer tools for moving assets
> - Deploy tools with Solidity templates
> - Contract tools for reading and verification
> - Bridge tools for BTC↔EVM movement
> - Runes tools for Bitcoin Rune protocol
> - Bitcoin tools for UTXO management
> - Utility tools for conversions and lookups

**[Show grid of tool categories with icons]**

> "This isn't a prototype. This is production software with PostgreSQL persistence, Redis caching, voice mode, and comprehensive error handling."

---

## TECHNICAL DEEP DIVE (2:30 - 3:30)

**[Show architecture diagram or code snippets]**

> "Let me show you what makes this technically unique.

> **Hybrid Chain Abstraction**
> Bitcoin uses UTXOs. Ethereum uses accounts. They're fundamentally different. We abstract this complexity. You say 'Bridge 0.5 BTC' - we handle UTXO selection, transaction building, L1 submission, bridge monitoring, and L2 confirmation. Automatically.

> **Generative UI**
> Most AI chats just show text. We built custom React components for every tool result. Transaction cards with live status updates. Explorer links. Action buttons. Beautiful dark mode.

> **MCP Architecture**
> We're one of the first full-featured MCP servers with a plugin system. Each category is a plugin. Each plugin has multiple tools. We support dual transports - stdio for desktop AND HTTP for remote clients.

> **Voice Mode**
> OpenAI Realtime API integration. Speak your command. Get voice responses. Watch transactions execute. The future is voice-controlled Web3.

> **Production Infrastructure**
> PostgreSQL for chat history. Redis for long-running operations. Drizzle ORM. Vercel AI SDK v6. Server-side signing. Environment validation. Comprehensive logging. This isn't hackathon code - this is enterprise-grade."

**[Show tech stack badges: Next.js 16, React 19, PostgreSQL, Redis]**

---

## LIVE DEMO (3:30 - 5:00)

**[Screen recording of complete flow]**

> "Let me show you how powerful this is.

> **Demo 1: Deploy an ERC20 Token**"

**[Type in chat: "Deploy an ERC20 token called DemoToken with symbol DEMO and 1 million initial supply"]**

> "Watch this. I just asked in plain English."

**[Show AI response with code compilation, deployment transaction, contract address]**

> "MIDL.AI compiled the Solidity, deployed to MIDL L2, and gave me the contract address with an explorer link. 30 seconds. Done.

> **Demo 2: Check Balances**"

**[Type: "What's my balance?"]**

> "Simple question."

**[Show formatted response with BTC L1 balance and EVM L2 balance]**

> "It checks BOTH layers automatically. Bitcoin UTXO balance on L1, EVM account balance on L2. One command.

> **Demo 3: Bridge BTC to EVM**"

**[Type: "Bridge 0.1 BTC to my EVM address"]**

> "Now the real magic - cross-layer bridging."

**[Show bridge transaction card with status updates]**

> "Building transaction... Submitting to L1... Waiting for confirmations... Monitoring bridge contract... Done! My EVM balance just updated. That's Bitcoin security with EVM programmability.

> **Demo 4: Voice Mode**"

**[Click voice mode button, show microphone icon]**

**[Speak]** "What's the current block number?"

**[Show voice response with synthesized speech]**

> "Voice input. Voice output. No typing. Just talking to your blockchain.

> **Demo 5: Rune Transfer**"

**[Type: "Transfer 50 UNCOMMON•GOODS rune to kaspa:qr..."]**

> "Bitcoin Runes - the new fungible token standard on Bitcoin. Full support."

**[Show rune transfer transaction with confirmation]**

> "Transaction submitted. Confirmed. Rune transferred. That's how easy it should be."

---

## FOR DEVELOPERS (5:00 - 5:30)

**[Show Claude Desktop with MIDL MCP installed]**

> "For developers, MIDL.AI is a game-changer.

> **Install in Claude Desktop:**
```json
{
  "mcpServers": {
    "midl": {
      "command": "node",
      "args": ["/path/to/midl-mcp-server/dist/index.js"]
    }
  }
}
```

> Five minutes to install. Now Claude can deploy contracts, bridge assets, transfer runes - all from your IDE.

**[Show Cursor with MIDL tools]**

> "Works in Cursor too. Code generation WITH blockchain interaction. Deploy your contract and test it in the same conversation.

> **Build Your Own Tools:**
> Our plugin architecture is open. Fork the repo. Add your own tools. Share with the community."

**[Show code snippet of plugin structure]**

```typescript
export class MyPlugin extends PluginBase {
  @Tool({ name: 'my_tool', schema: mySchema })
  async execute(params) {
    // Your implementation
  }
}
```

> "That's it. Full TypeScript support. Type safety everywhere."

---

## IMPACT & INNOVATION (5:30 - 6:00)

**[Show feature comparison or impact metrics]**

> "Let's recap what we've built:

> ✅ **First AI terminal for Bitcoin+EVM hybrid chain**
> ✅ **27 production-ready tools across 9 categories**
> ✅ **Dual interface: Web chat + MCP server**
> ✅ **Generative UI with custom React components**
> ✅ **Voice mode with OpenAI Realtime API**
> ✅ **PostgreSQL + Redis infrastructure**
> ✅ **Comprehensive documentation (6 pages)**
> ✅ **100% open source, MIT licensed**

> **Live Right Now:**
> - midl-ai.xyz - Chat interface
> - mcp.midl-ai.xyz - MCP server docs
> - github.com/midl-ai - Source code

> This is the future of blockchain interaction. No CLIs. No hex addresses. No confusion. Just conversation.

> **MIDL.AI: Talk to Your Blockchain.**

> Built for MIDL VibeHack 2026. Thank you."

**[Show MIDL.AI logo and website]**

---

## B-ROLL SUGGESTIONS

- Code editor showing tool implementations
- Split screen: CLI commands vs chat interface
- Transaction confirmation animations (confetti)
- Voice mode waveform animation
- Network diagram showing Bitcoin L1 ↔ EVM L2 bridge
- Side-by-side: Before (complex terminal) vs After (simple chat)
- Real blockchain explorer showing confirmed transactions
- Mobile view of chat interface
- Dark mode toggle with smooth transition
- Database visualization showing chat persistence

---

## KEY PHRASES TO EMPHASIZE

1. **"First AI terminal for Bitcoin+EVM hybrid chain"**
2. **"27 tools across 9 categories"**
3. **"Talk to your blockchain"**
4. **"No CLI required"**
5. **"Production-grade infrastructure"**
6. **"Dual interface: Chat + MCP"**
7. **"Voice-controlled Web3"**
8. **"Bitcoin security + EVM programmability"**

---

## VISUAL ASSETS NEEDED

### Diagrams
- [ ] Problem statement diagram (Bitcoin UTXO + EVM complexity)
- [ ] Solution architecture (Frontend + MCP + MIDL Protocol)
- [ ] MCP server architecture (Plugin system)
- [ ] Frontend architecture (Generative UI flow)
- [ ] Technical deep dive (Data flow diagram)

### Screenshots
- [ ] MIDL.AI homepage (hero section)
- [ ] Chat interface with tool results
- [ ] Voice mode active state
- [ ] Claude Desktop with MIDL MCP
- [ ] Documentation pages
- [ ] Dark/light mode comparison
- [ ] Mobile responsive view

### Animations
- [ ] Logo reveal
- [ ] Tool grid showcase
- [ ] Transaction confirmation flow
- [ ] Voice waveform
- [ ] Bridge operation sequence

---

## HACKATHON CATEGORIES THIS TARGETS

1. **Innovation Track**: First AI terminal for hybrid Bitcoin+EVM chain
2. **Developer Tools**: MCP server with 27 tools
3. **User Experience**: Natural language interface + voice mode
4. **Technical Excellence**: Production infrastructure with PostgreSQL/Redis
5. **Completeness**: Comprehensive docs, dual interface, open source

---

## BACKUP TALKING POINTS

### If Asked: "Why MIDL?"
> "MIDL Protocol is unique - it's the ONLY blockchain that combines Bitcoin's security with EVM's programmability. But that power comes with complexity. MIDL.AI makes it accessible."

### If Asked: "How is this different from ChatGPT plugins?"
> "Three ways: (1) We're purpose-built for MIDL's hybrid architecture. (2) We use the Model Context Protocol standard, not proprietary APIs. (3) We provide a standalone MCP server that works with ANY MCP client."

### If Asked: "Is this production-ready?"
> "Absolutely. PostgreSQL persistence. Redis caching. Comprehensive error handling. Type-safe TypeScript. Voice mode. We've deployed it live at midl-ai.xyz. Try it yourself."

### If Asked: "What about security?"
> "Server-side signing with secure key management. Environment variable validation. No private keys exposed to the client. Transaction signing requires explicit confirmation."

### If Asked: "Can I contribute?"
> "100% open source. MIT license. Fork the repo. Add tools. Submit PRs. We'd love community contributions."

---

## CLOSING SHOT

**[MIDL.AI logo with tagline]**

> "MIDL.AI - Talk to Your Blockchain"

**[Show all three URLs]**
- midl-ai.xyz
- mcp.midl-ai.xyz
- github.com/midl-ai

**[Fade to black with hackathon info]**

> "Built for MIDL VibeHack 2026"
> "February 9-28, 2026"

---

## PRODUCTION NOTES

### Video Length
Target: 5-6 minutes
Maximum: 7 minutes
Minimum: 4 minutes

### Pacing
- Intro: Fast and exciting
- Problem: Clear and relatable
- Solution: Comprehensive but not overwhelming
- Demo: Smooth and confident
- Technical: Impressive but accessible
- Closing: Inspiring and actionable

### Music
- Intro: Upbeat, tech-forward
- Demo: Lighter, let the UI shine
- Closing: Triumphant, memorable

### Tone
- Confident but not arrogant
- Technical but accessible
- Excited about innovation
- Welcoming to developers

Good luck! This is a winning project! 🚀
