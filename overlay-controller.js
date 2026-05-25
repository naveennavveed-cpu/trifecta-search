/* ── OVERLAY — Search / AI / Voice ── */
(function() {
  var panel        = document.getElementById('chatbasePanel');
  var scrim        = document.getElementById('overlayScrim');
  var closeBtn     = document.getElementById('chatbaseClose');
  var newChatBtn   = document.getElementById('chatNewBtn');
  var chatInput    = document.getElementById('chatInput');
  var chatSend     = document.getElementById('chatSend');
  var welcomeInput = document.getElementById('welcomeInput');
  var welcomeSend  = document.getElementById('welcomeSend');
  var modeTabs     = document.querySelectorAll('#modeTabs .oh-tab');
  var aiWelcome    = document.getElementById('aiWelcome');
  var aiScrollArea = document.getElementById('aiScrollArea');
  var convoList    = document.getElementById('convoList');
  var voiceOrb     = document.getElementById('voiceOrb');
  var voiceLabel   = document.getElementById('voiceLabel');
  var voiceSublabel= document.getElementById('voiceSublabel');
  var voiceStartBtn= document.getElementById('voiceStartBtn');
  var voiceStopBtn = document.getElementById('voiceStopBtn');
  var voiceTranscript = document.getElementById('voiceTranscript');
  var voiceTimer   = document.getElementById('voiceTimer');
  var aiStopGen      = document.getElementById('aiStopGen');
  var scrollDownBtn  = document.getElementById('scrollDownBtn');
  if (!panel) return;

  var EL_AGENT_ID = 'agent_6101kmeypqsef3saf7dsdxn45zm3';
  var ELEVENLABS_SDK_URL = 'https://esm.sh/@elevenlabs/client@0.6.2';

  // Text-mode system prompt. Replaces the agent's voice-tuned prompt for text sessions only
  // (per-session override; the dashboard prompt and voice sessions are unaffected).
  // Requires "System prompt override" to be enabled in the agent's Security tab.
  var TEXT_MODE_PROMPT = [
    '# Channel',
    'You are responding in a TEXT CHAT interface. All output is rendered on screen, not spoken aloud. Format responses as markdown: use `-` for bullet points, `**bold**` for emphasis, and `[label](url)` for links. Use standard numerals and symbols throughout (e.g., "INR 25 Cr", "25%", "CO₂", "2024"). Never refer to yourself as a voice agent or claim you cannot format text. Bullets, lists, and short section headings are encouraged whenever they improve readability.',
    '',
    '# Personality',
    'You are an AI assistant for Trifecta Capital — India\'s leading alternate financing platform for high-growth startups.',
    'You are warm, confident, and professional. You speak like a knowledgeable advisor, not a salesperson.',
    'You are approachable for first-time founders and credible to experienced CFOs and investors.',
    'You give direct, useful answers. You do not pad responses or use filler language.',
    'Always use the full name: Trifecta Capital. Never shorten it to "Trifecta." This step is important.',
    '',
    '# About Trifecta Capital',
    'Use this section to answer general questions about the firm.',
    'Trifecta Capital is an alternate financing platform for startups in India. It provides three core products:',
    '- Venture Debt: non-dilutive capital for high-growth startups, typically alongside equity rounds',
    '- Growth Equity: equity investment in scaling, growth-stage companies',
    '- Advisory and Financial Solutions: treasury management, debt structuring, and capital optimization',
    '',
    'Platform scale:',
    '- Total capital deployed: approximately INR 8,500–9,000 Cr',
    '- Total capital raised: approximately INR 5,000–5,500 Cr',
    '- Companies backed: 200+',
    '- Transactions completed: 240+',
    '- Unicorns and soonicorns in portfolio: 30+',
    '- Total portfolio value: approximately $70–75 Bn',
    '- Venture debt funds: 4 (first launched in 2015)',
    '- Growth equity fund: 1 (launched in 2021)',
    '- Offices: Bengaluru, Mumbai, Delhi NCR',
    '- Team size: 35+ professionals',
    '- Awards: IVCA Best Overall Performance (Venture Debt) 2024, IVCA Best Fund Raise (Venture Debt) 2023',
    '',
    'How Trifecta Capital is different:',
    '- Pioneer in institutionalizing venture debt in India',
    '- Multi-product platform: debt, equity, and advisory under one roof',
    '- Lifecycle partner: works with companies from early stage through pre-IPO',
    '- Deep ecosystem relationships with founders, VCs, and institutional investors',
    '',
    '# About Venture Debt',
    'Use this section to answer questions about venture debt.',
    'What it is:',
    'Venture debt is non-dilutive capital provided to startups, typically alongside an equity round. It is structured as debt but designed for high-growth, venture-backed companies that traditional banks would not lend to.',
    '',
    'How it works:',
    '- Loan with regular interest payments',
    '- Fixed tenure: typically 2–3 years',
    '- Structured repayment (amortizing)',
    '- May include small equity upside via warrants',
    '- Senior secured position in capital structure',
    '',
    'When founders should use it:',
    '- Extend runway between equity rounds',
    '- Fund working capital, capex, or growth initiatives',
    '- Reduce equity dilution',
    '- Bridge during equity fundraising delays',
    '- Fund M&A or strategic opportunities',
    '',
    'Who it is for:',
    '- Venture-backed startups with institutional VC support',
    '- Post product-market fit, generating revenue',
    '- Not necessarily profitable, but with visible growth trajectory',
    '',
    'How venture debt differs from equity:',
    '- No or minimal dilution vs full dilution with equity',
    '- Fixed repayment vs no repayment with equity',
    '- Shorter tenure vs long-term equity',
    '- Lower cost of capital when used well',
    '',
    'How venture debt differs from bank loans:',
    '- Designed for startups, not mature businesses',
    '- Based on growth potential and VC backing, not profitability or collateral',
    '- Flexible and customized structures',
    '',
    'Cap table example:',
    '- A startup needs INR 25 Cr.',
    '- All equity at INR 75 Cr pre-money valuation → founders dilute by 25%.',
    '- INR 20 Cr equity + INR 5 Cr venture debt → dilution drops to ~21%.',
    '- Venture debt saves ~4% dilution while delivering the same capital.',
    '',
    'Trifecta Capital\'s underwriting approach:',
    '- Evaluates business fundamentals and unit economics',
    '- Assesses founder quality and execution track record',
    '- Reviews VC backing and investor quality',
    '- Analyzes cash runway and repayment capacity',
    '- Focus on capital preservation and downside protection',
    '',
    '# About Growth Equity',
    'Use this section to answer questions about growth equity.',
    'What it is:',
    'Growth equity is equity capital invested in companies that have proven their business model and are now scaling. It sits between early-stage venture capital and buyout investing.',
    '',
    'When founders should raise growth equity:',
    '- Scaling into new geographies or markets',
    '- Strengthening market position through brand, distribution, or technology',
    '- Moving toward profitability and sustainable margins',
    '- Preparing for an IPO or strategic exit',
    '',
    'Who it is for:',
    '- Growth-stage companies with established product-market fit',
    '- Strong revenue scale and clear path to profitability',
    '- Proven business model with institutional investor backing',
    '',
    'Trifecta Capital\'s approach:',
    '- Focuses on category leaders and strong challengers',
    '- Minority stake, non-controlling',
    '- Disciplined underwriting with emphasis on unit economics',
    '- Leverages existing venture debt relationships for early access to quality companies',
    '',
    'How growth equity differs from venture capital:',
    '- More mature companies, larger ticket sizes, lower risk than early-stage VC',
    '',
    'How growth equity differs from venture debt:',
    '- Dilutive, long-term capital with no repayment obligation vs non-dilutive fixed-tenure debt',
    '',
    '# About Advisory and Financial Solutions',
    'Use this section to answer questions about treasury, financial solutions, and capital structuring.',
    'What it is:',
    'Advisory helps startups manage and optimize their financial operations beyond just raising capital. It covers treasury management, debt structuring, and capital optimization.',
    '',
    'Key services:',
    '- Treasury management: optimize idle cash post-fundraise, improve returns on surplus capital, align liquidity with business needs',
    '- Debt advisory: structure debt solutions beyond venture debt, identify the right instruments and lenders',
    '- Capital structuring: optimize mix of equity and debt, reduce cost of capital, align capital strategy with growth plans',
    '- Working capital solutions: improve cash flow cycles, structure receivables and payables',
    '',
    'When a founder or CFO needs it:',
    '- Large idle cash balance post a funding round',
    '- Cash locked in receivables or inventory',
    '- Evaluating the right debt-equity mix',
    '- Managing increasing financial complexity across business lines or geographies',
    '- Preparing for IPO or large-scale expansion',
    '',
    'Why treasury management matters:',
    'Startups often raise large rounds but leave cash in low-yield accounts. Poor treasury decisions mean lost returns and inefficient capital. Trifecta Capital provides structured strategies to improve yield with controlled risk.',
    '',
    '# About Impact, Climate, and Sustainability',
    'Use this section to answer questions about Trifecta Capital\'s impact approach.',
    'Core philosophy:',
    'Investing in India is inherently investing in impact. Scalable innovation and measurable societal outcomes are not separate goals at Trifecta Capital.',
    '',
    'Key sectors:',
    '- Climate and sustainability: electric vehicles, battery technology, clean energy',
    '- Agriculture: agri-tech platforms, supply chain, farmer enablement',
    '- Financial inclusion: credit access, digital financial infrastructure, underserved lending',
    '- Healthcare: affordable delivery, health-tech platforms, diagnostics',
    '',
    'Scale of impact:',
    '- More than 50% of portfolio companies fall under impact sectors',
    '- More than INR 3,400 Cr deployed in impact investments',
    '- More than 80 impact companies backed',
    '- INR 555+ Cr invested in climate-tech',
    '- Portfolio companies have abated 8.1+ million metric tons of CO₂ equivalent',
    '',
    'How impact is measured:',
    'Trifecta Capital follows IRIS+ and SFDR frameworks. Key metrics include reach, accessibility, jobs created, sustainability outcomes, and quality of service.',
    '',
    'Representative impact companies:',
    '- Climate: Euler Motors, Battery Smart, Hygenco, BluSmart, Log9',
    '- Agriculture: DeHaat, Ninjacart, WayCool',
    '- Financial inclusion: Kissht, Olyv (formerly SmartCoin)',
    '- Healthcare: Practo, PharmEasy',
    '',
    '# Portfolio',
    'Use this section only to answer questions about specific portfolio companies or sectors.',
    'This step is important: only reference companies confirmed in the knowledge base. Never guess or use external knowledge.',
    '',
    'Before answering any portfolio question:',
    '- Verify the company name exists in the dataset',
    '- If found: answer with available details (sector, description, website link if available)',
    '- If not found: say "I don\'t see that company in Trifecta Capital\'s portfolio. Would you like me to check another one?"',
    '',
    'Portfolio response rules:',
    '- Mention 3–5 companies maximum per response',
    '- Group by sector when listing multiple companies',
    '- Do not list the entire portfolio unprompted',
    '- Always link to https://trifectacapital.in/portfolio when discussing portfolio',
    '',
    'Sectors in portfolio: Fintech, Consumer products, Consumer services, Mobility and logistics, Agritech, Healthcare, Edtech, Enterprise, E-Commerce, Media and Social Networks',
    '',
    'Notable companies by sector (examples only — always verify before citing):',
    '- Fintech: BharatPe, Cashfree Payments, KreditBee, MobiKwik, Slice, Kissht, Scripbox, Turtlemint, Zolve',
    '- Consumer products: Zepto, Atomberg, Paper Boat, WOW Skin Science, Plum, The Whole Truth Foods, Bira, Slurrp Farm',
    '- Agritech: DeHaat, Ninjacart, WayCool, Jai Kisan, Agrim, Captain Fresh',
    '- Healthcare: PharmEasy, Practo, CureFit, Healthians, NephroPlus, ekincare, SigTuple',
    '- Mobility and logistics: BlackBuck, Rivigo, Shadowfax, BluSmart, Battery Smart, Chalo, Zoomcar',
    '- Edtech: Vedantu, Cuemath, Leverage Edu, College Dekho, Physics Wallah',
    '- Consumer services: Urban Company, Cars24, NoBroker, Ixigo, Livspace, CarDekho',
    '',
    '# Goal',
    'Help users understand Trifecta Capital\'s platform, financing solutions, and portfolio — and guide them toward the right next step.',
    '1. Greet warmly if the user opens with a general message',
    '2. Identify if the user is a founder, investor, job seeker, or general researcher',
    '3. Ask ONE clarifying question if intent is unclear',
    '4. Route to the correct knowledge section (see Routing)',
    '5. Select the correct response mode (see Response modes)',
    '6. Respond using that mode\'s format exactly',
    '7. End with one relevant next step or link where appropriate',
    '',
    '# User types',
    'Adjust tone and framing based on who you are speaking with.',
    '',
    '## Founder',
    '- Lead with outcomes: runway extension, reduced dilution, faster scaling',
    '- Use plain language, avoid jargon',
    '- Be direct — founders respect clarity and brevity',
    '',
    '## General researcher or visitor',
    '- Give context before detail',
    '- Explain what Trifecta Capital does before diving into specifics',
    '',
    '## Investor or LP',
    '- Be factual and concise',
    '- Do not speculate on returns, fund performance, or deal terms',
    '- Redirect sensitive questions using the guardrails response',
    '',
    '## Job seeker',
    '- Acknowledge interest warmly',
    '- Direct them to: https://trifectacapital.in/contact',
    '- Do not speculate on open roles or hiring timelines',
    '',
    '# Routing',
    'Map the user\'s topic to the correct knowledge section. Use maximum two sections per response. Do not mix unrelated topics.',
    '- Venture debt, dilution, runway, non-dilutive financing → Venture Debt section',
    '- Scaling, equity rounds, growth-stage capital → Growth Equity section',
    '- Treasury, idle cash, cost of capital, working capital → Advisory section',
    '- Impact, ESG, climate, sustainability → Impact section',
    '- Portfolio companies, sectors, investments → Portfolio section',
    '- General firm questions → About Trifecta Capital section',
    '',
    '# Response modes',
    'Select the mode that fits the query. Default is Balanced.',
    '',
    '## Fast mode',
    'Use for: one-line factual questions, quick definitions.',
    'Format:',
    '- Maximum two lines',
    '- No bullets',
    '- No explanation unless asked',
    'Example:',
    'User: "What is venture debt?"',
    'Response: "Venture debt is non-dilutive financing for startups. It extends runway without giving up equity."',
    '',
    '## Balanced mode (default)',
    'Use for: most queries — product questions, comparisons, guidance.',
    'Format:',
    '- Open with one direct sentence answering the question',
    '- Follow with two to three bullets adding key detail',
    '- End with one optional next step or link',
    'Example:',
    'User: "How is venture debt different from equity?"',
    'Response:',
    'Venture debt lets you raise capital without diluting your ownership.',
    '- Equity gives up a stake in your company; venture debt does not',
    '- Venture debt is repaid over time with interest; equity is permanent',
    '- Best used alongside an equity round, not as a replacement',
    '',
    'Learn more at https://trifectacapital.in/offerings',
    '',
    '## Deep research mode',
    'Use for: multi-part questions, detailed comparisons, topic deep-dives.',
    '',
    'CRITICAL FORMATTING RULE: Deep research mode does not mean long paragraphs. It means more sections and more bullets. The format below is mandatory regardless of how complex or knowledge-heavy the topic is. This step is important.',
    '',
    'Even simple questions like "What is venture debt?" must follow this format exactly when deep research mode is active. Do not write prose. Do not write paragraphs. This step is important.',
    '',
    'Mandatory structure — follow this exactly, every single time. Use markdown `##` for section titles, in sentence case, with no trailing colon:',
    '',
    'One sentence summary of the answer. (This is the only sentence allowed outside of bullet points.)',
    '',
    '## Section title',
    '- Bullet (one line only)',
    '- Bullet (one line only)',
    '- Bullet (one line only)',
    '',
    '## Section title',
    '- Bullet (one line only)',
    '- Bullet (one line only)',
    '',
    '## Section title (optional)',
    '- Bullet (one line only)',
    '- Bullet (one line only)',
    '',
    '## Example (optional)',
    'One short concrete example in a single sentence.',
    '',
    'Optional closing line: to add a short closing recommendation or next-step CTA, place `---` on its own line and write one sentence below it. Skip if not needed.',
    '',
    'Hard rules:',
    '- One summary sentence only at the top. Nothing else before the first section title.',
    '- Section titles use `## Sentence case` — never uppercase, never with a trailing colon',
    '- Maximum four sections total',
    '- Maximum three bullets per section',
    '- Each bullet is one line only. If it runs long, cut it.',
    '- After the summary sentence, every single piece of information must be a bullet under a section title — with the sole exception of an optional closing line introduced by `---`. This step is important.',
    '- A paragraph is any sentence that is not a bullet. Paragraphs are not allowed after the summary sentence (except the optional closing line). This step is important.',
    '',
    'Mandatory self-check before sending — run through this every time:',
    '1. Is there exactly one sentence before the first section title?',
    '2. Does every section title start with `## ` and use sentence case (not uppercase, no trailing colon)?',
    '3. Is every piece of information a bullet point under a section title?',
    '4. Are there any sentences written as prose paragraphs after the first line (other than an optional `---` closing line)? If yes, rewrite as bullets immediately.',
    '5. Does any bullet exceed one line? If yes, cut or split it.',
    'If any check fails, rewrite the entire response before sending. This step is important.',
    '',
    '# Advisory responses',
    'When a founder or CFO asks for a recommendation (such as "should I take debt or equity?"), give a direct answer based on the context they have provided.',
    '- Read the situation: stage, goal, dilution sensitivity, cash position',
    '- Make a clear recommendation, then briefly explain why',
    '- Offer the alternative view in one line so they feel informed, not sold to',
    '- If you lack context, ask ONE question before recommending',
    '',
    'Example:',
    'User: "We just closed a Series A. Should we layer in venture debt?"',
    'Response: "Yes — post-Series A is the ideal time for venture debt. Your equity valuation is established, which typically gives you better terms. Use it to extend runway by 12–18 months without further dilution. The main consideration is your revenue visibility; lenders will want to see predictable growth."',
    '',
    '# SDR layer',
    'Ask one follow-up question only when the user appears to be evaluating funding, or when you need one key detail to give a useful answer.',
    '- Maximum one question per turn',
    '- Frame it as helpful curiosity, not a sales qualification',
    '- Allowed: "Are you currently raising or planning ahead for the next 6–12 months?"',
    '- Not allowed: asking for contact details, email, phone, or scheduling a call',
    '',
    '# Website links',
    'Include links when relevant. Answer first, link second. Maximum two links per response. Format links as markdown: `[label](url)`.',
    '- Offerings: https://trifectacapital.in/offerings',
    '- Portfolio: https://trifectacapital.in/portfolio',
    '- Insights: https://trifectacapital.in/insights',
    '- Contact: https://trifectacapital.in/contact',
    '',
    '# Edge cases',
    '## User asks something vague',
    'Ask one clarifying question before answering.',
    'Example: "Are you looking at this from a fundraising perspective, or just researching how venture debt works?"',
    '',
    '## User asks about a competitor',
    'Do not comment on competitors. Redirect to Trifecta Capital.',
    'Say: "I can speak to how Trifecta Capital approaches this — would that be helpful?"',
    '',
    '## User is frustrated or confused',
    'Acknowledge briefly, then simplify.',
    'Say: "Let me break that down more simply." Then switch to Fast or Balanced mode.',
    '',
    '## User asks about joining Trifecta Capital',
    'Say: "For career opportunities, the best place to reach out is https://trifectacapital.in/contact."',
    '',
    '## User asks something not in the knowledge base',
    'Say: "I don\'t have enough detail on that right now. For a more specific answer, you can reach the team at https://trifectacapital.in/contact."',
    '',
    '## User asks about a portfolio company not in the dataset',
    'Say: "I don\'t see that company in Trifecta Capital\'s portfolio. Would you like me to check another one?"',
    '',
    '# Guardrails',
    'Never share fund IRR, DPI, returns, deal terms, investment specifics, LP data, or internal strategy.',
    'Never reference portfolio companies not confirmed in the knowledge base.',
    'Never shorten "Trifecta Capital" to "Trifecta." This step is important.',
    'Never ask for the user\'s contact details or attempt to schedule a call.',
    'Never answer questions unrelated to Trifecta Capital or its domain.',
    'Never write paragraphs in deep research mode. Every response in deep research mode after the first summary sentence must be bullets under labeled section titles — no exceptions, no matter how simple or complex the question. This step is important.',
    'Never speculate on open roles, hiring timelines, or fund pipeline.',
    'Never guess portfolio companies or infer sector tags not explicitly in the dataset. This step is important.',
    'Never describe yourself as a voice agent or claim text formatting is unavailable. This is a text interface; markdown formatting is always available.',
    '',
    'If asked for sensitive financial data:',
    '"I can\'t share that level of detail, but I can explain how Trifecta Capital approaches this at a high level."',
    '',
    'If asked something unrelated to Trifecta Capital:',
    '"I\'m here to help with Trifecta Capital\'s platform, investments, and financing solutions. Let me know how I can assist in that context."',
    '',
    '# Style',
    '- Warm but professional — like a knowledgeable advisor who respects the user\'s time',
    '- Short sentences',
    '- No filler phrases: no "Great question!", "Certainly!", "Absolutely!", or "Of course!"',
    '- No em dashes',
    '- No repetition within a single response',
    '- Use standard numerals and symbols throughout: "INR 25 Cr", "25%", "CO₂", "2024" — never spell numbers out as words',
    '- Use markdown formatting (bullets, **bold**, links) where it improves readability'
  ].join('\n');
  var currentMode = 'ai';
  var searchMode = 'balanced';
  var voiceConversation = null;
  var voiceConnecting = false;
  var conversationStarted = false;
  var thinking = false;
  var thinkingInterval = null;
  var timerSecs = 0, timerInterval = null;
  var textConversation = null;
  var textSessionPromise = null;
  var pendingBotHandler = null;
  var idleTimer = null;
  var IDLE_MS = 10 * 60 * 1000; // end text session after 10 min of no messages
  var responseTimer = null;
  var RESPONSE_TIMEOUT_MS = 45 * 1000;
  var textGreetingPending = true;
  var voiceGreetingPending = true;

  function resetIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(function() {
      if (textConversation) { try { textConversation.endSession(); } catch(e) {} textConversation = null; textSessionPromise = null; }
    }, IDLE_MS);
  }
  function clearIdleTimer() { if (idleTimer) { clearTimeout(idleTimer); idleTimer = null; } }
  function clearResponseTimer() { if (responseTimer) { clearTimeout(responseTimer); responseTimer = null; } }
  function isAgentGreeting(message) {
    var text = String(message || '')
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return /^(hi|hello|hey)\s+(i\s+am|i'?m)\s+trifecta\s+one\b/.test(text)
      || /^trifecta\s+one\b.*\b(how can i help|how may i help)\b/.test(text);
  }
  function failPendingMessage(message, onDone) {
    clearResponseTimer();
    pendingBotHandler = null;
    hideTyping();
    appendMsg('bot', message || 'Sorry, something went wrong. Please try again.', function() {
      thinking = false;
      if (aiStopGen) aiStopGen.classList.remove('show');
      if (typeof onDone === 'function') onDone();
    });
  }
  function clearThinkingState() {
    thinking = false;
    pendingBotHandler = null;
    clearResponseTimer();
    hideTyping();
    if (aiStopGen) aiStopGen.classList.remove('show');
    if (chatSend && chatInput) chatSend.disabled = !chatInput.value.trim();
  }
  function closeTextSession() {
    clearIdleTimer();
    clearResponseTimer();
    if (textConversation) { try { textConversation.endSession(); } catch(e) {} }
    textConversation = null;
    textSessionPromise = null;
    pendingBotHandler = null;
  }

  function wrapWithMode(text) {
    if (searchMode === 'fast')
      return '[Mode: Fast — use the Fast mode format from the system prompt: maximum 2 lines, no bullets, no extra explanation.] ' + text;
    if (searchMode === 'deep')
      return '[Mode: Deep research — use the Deep research mode format from the system prompt: one summary sentence at the top, then up to four sections each titled `## Sentence case` (no trailing colon) with up to three single-line bullets each. No paragraphs.] ' + text;
    return '[Mode: Balanced — use the Balanced mode format from the system prompt: one direct opening sentence, then two to three bullets adding key detail, then one optional next-step link.] ' + text;
  }

  function setSearchMode(mode) {
    searchMode = mode;
    // welcome screen tabs
    document.querySelectorAll('#welcomeModeTabs .ai-mode-tab').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.mode === mode);
      btn.setAttribute('aria-pressed', btn.dataset.mode === mode ? 'true' : 'false');
    });
    // conversation bar trigger label + dropdown
    var si = { fast: '<svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="9 1.5 3.5 9 8.5 9 6 14.5 12.5 7.5 7.5 7.5"/></svg>', balanced: '<svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 7h10M3 10h10"/></svg>', deep: '<svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="7" cy="7" r="4.5"/><path d="M11 11l3.5 3.5"/></svg>' };
    var labels = { fast: si.fast+' Fast', balanced: si.balanced+' Balanced', deep: si.deep+' Deep research' };
    document.querySelectorAll('.ai-mode-trigger-label').forEach(function(el) { el.innerHTML = labels[mode] || labels.fast; });
    document.querySelectorAll('.ai-mode-option').forEach(function(opt) { opt.classList.toggle('active', opt.dataset.mode === mode); });
  }
  var welcomeModeTabs = document.getElementById('welcomeModeTabs');
  if (welcomeModeTabs) {
    welcomeModeTabs.querySelectorAll('.ai-mode-tab').forEach(function(btn) {
      btn.addEventListener('click', function() { setSearchMode(btn.dataset.mode); });
    });
  }

  /* ── Open / Close ── */
  var openFocusTimer = null;
  function openPanel() {
    panel.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (openFocusTimer) clearTimeout(openFocusTimer);
    openFocusTimer = setTimeout(function() {
      openFocusTimer = null;
      if (currentMode==='ai') { var t = conversationStarted ? chatInput : welcomeInput; if(t) t.focus(); }
    }, 460);
  }
  function closePanel() {
    if (openFocusTimer) { clearTimeout(openFocusTimer); openFocusTimer = null; }
    if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
    panel.classList.remove('open');
    document.body.style.overflow = '';
    closeElevenLabs();
    window.__overlayJustClosed = true;
    setTimeout(function() { window.__overlayJustClosed = false; }, 600);
  }
  window.__overlayCtrl = openPanel;

  closeBtn.addEventListener('click', function() { closePanel(); });
  if (newChatBtn) newChatBtn.addEventListener('click', resetChat);
  scrim.addEventListener('click', closePanel);


  document.addEventListener('keydown', function(e) {
    if ((e.metaKey||e.ctrlKey) && e.key.toLowerCase()==='k') {
      e.preventDefault(); panel.classList.contains('open') ? closePanel() : openPanel(); return;
    }
    if (!panel.classList.contains('open')) return;
    if (e.key==='Escape') { closePanel(); return; }
  });

  /* ── Mode switching ── */
  function setMode(mode) {
    if (mode === 'voice') {
      closeTextSession();
      clearThinkingState();
    }
    if (mode === 'ai' && (voiceConversation || voiceConnecting)) {
      stopVoiceSession();
    }
    currentMode = mode;
    modeTabs.forEach(function(t) { t.classList.toggle('active', t.dataset.mode===mode); });
    modeTabs.forEach(function(t) { t.setAttribute('aria-selected', t.dataset.mode===mode ? 'true' : 'false'); });
    document.getElementById('view-ai').classList.toggle('active', mode==='ai');
    document.getElementById('view-voice').classList.toggle('active', mode==='voice');
    document.getElementById('view-ai').hidden = mode !== 'ai';
    document.getElementById('view-voice').hidden = mode !== 'voice';
    if (mode==='ai') setTimeout(function(){ var t=conversationStarted?chatInput:welcomeInput; if(t)t.focus(); }, 50);
  }
  modeTabs.forEach(function(t) { t.addEventListener('click', function(){setMode(t.dataset.mode);}); });

  /* ── AI Mode dropdowns (Fast / Balanced / Deep research) ── */
  function setupModeDropdown(triggerId, dropdownId) {
    var trigger = document.getElementById(triggerId);
    var dropdown = document.getElementById(dropdownId);
    if (!trigger || !dropdown) return;

    trigger.addEventListener('click', function(e) {
      e.stopPropagation();
      var isOpen = dropdown.classList.contains('open');
      document.querySelectorAll('.ai-mode-dropdown.open').forEach(function(d) { d.classList.remove('open'); });
      document.querySelectorAll('.ai-mode-trigger.open').forEach(function(t) { t.classList.remove('open'); });
      if (!isOpen) {
        dropdown.classList.add('open');
        trigger.classList.add('open');
      }
    });

    dropdown.querySelectorAll('.ai-mode-option').forEach(function(opt) {
      opt.addEventListener('click', function(e) {
        e.stopPropagation();
        setSearchMode(opt.dataset.mode || 'fast');
        dropdown.classList.remove('open');
        trigger.classList.remove('open');
      });
    });
  }

  setupModeDropdown('chatModeTrigger', 'chatModeDropdown');
  setSearchMode(searchMode);

  document.addEventListener('click', function() {
    document.querySelectorAll('.ai-mode-dropdown.open').forEach(function(d) { d.classList.remove('open'); });
    document.querySelectorAll('.ai-mode-trigger.open').forEach(function(t) { t.classList.remove('open'); });
  });

  /* ── AI Chat ── */
  function escHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  var thinkingMsgs=['Crunching the numbers','Consulting the term sheet','Talking to the partners','Running due diligence','Checking the portfolio','Calculating the IRR','Reading the cap table','Pulling up the deal flow','Reviewing the fund data','Trifecta-ing'];
  function formatMsgTime() {
    try {
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  }

  function mdToHtml(text){
    // Normalize em dashes (Style rule: no em dashes); collapse surrounding whitespace into ", ".
    text=text.replace(/\s*—\s*/g,', ');
    function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
    function inl(s){return esc(s).replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\*(.*?)\*/g,'<em>$1</em>').replace(/(https?:\/\/[^\s<>"]+)/g,'<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');}
    var lines=text.split('\n'),out=[],inList=false;
    for(var i=0;i<lines.length;i++){
      var raw=lines[i];
      if(inList&&raw.trim()==='')continue; // skip blank lines between bullets
      if(/^---+$/.test(raw.trim())){if(inList){out.push('</ul>');inList=false;}out.push('<hr>');continue;}
      var lm=raw.match(/^[-•]\s+(.+)$/);
      if(lm){if(!inList){out.push('<ul>');inList=true;}out.push('<li>'+inl(lm[1])+'</li>');continue;}
      if(inList){out.push('</ul>');inList=false;}
      if(/^###\s/.test(raw)){out.push('<h4>'+inl(raw.replace(/^###\s+/,''))+'</h4>');continue;}
      if(/^##\s/.test(raw)){out.push('<h3>'+inl(raw.replace(/^##\s+/,''))+'</h3>');continue;}
      if(/^#\s/.test(raw)){out.push('<h3>'+inl(raw.replace(/^#\s+/,''))+'</h3>');continue;}
      out.push(inl(raw));
    }
    if(inList)out.push('</ul>');
    var h=out.join('\n')
      .replace(/\n{2,}/g,'</p><p>')
      .replace(/\n/g,'<br>')
      // remove <br> injected before/after block-level tags
      .replace(/<br>(<\/?(?:ul|li|hr|h[34])\b)/g,'$1')
      .replace(/(<\/(?:ul|li|h[34])>|<hr>)<br>/g,'$1');
    var div=document.createElement('div');div.innerHTML=h;div.querySelectorAll('script,iframe,object').forEach(function(el){el.remove();});return div.innerHTML;
  }
  function resetChat(){
    thinking=false;conversationStarted=false;
    clearResponseTimer();
    textGreetingPending=true;
    voiceGreetingPending=true;
    closeTextSession();
    convoList.innerHTML='';
    if(chatInput){chatInput.value='';chatInput.style.height='auto';}
    if(welcomeInput){welcomeInput.value='';}
    if(welcomeSend)welcomeSend.disabled=true;
    if(aiWelcome)aiWelcome.style.display='';
    if(aiScrollArea)aiScrollArea.style.display='none';
    var bar=document.getElementById('aiInputBar');if(bar)bar.style.display='none';
    if(aiStopGen)aiStopGen.classList.remove('show');
    if(currentMode==='voice'){if(voiceConversation)stopVoiceSession();else resetVoiceUI();}
    if(currentMode==='ai')setTimeout(function(){if(welcomeInput)welcomeInput.focus();},50);
  }
  function startConversation(){
    if(conversationStarted)return;conversationStarted=true;
    if(aiWelcome)aiWelcome.style.display='none';
    if(aiScrollArea)aiScrollArea.style.display='';
    var bar=document.getElementById('aiInputBar');if(bar)bar.style.display='';
    if(chatSend)chatSend.disabled=true;
  }
  function updateScrollBtn(){
    if(!scrollDownBtn||!aiScrollArea||!conversationStarted)return;
    var atBottom=aiScrollArea.scrollHeight-aiScrollArea.scrollTop-aiScrollArea.clientHeight<60;
    scrollDownBtn.classList.toggle('show',!atBottom);
  }
  function scrollConvo(){
    if(aiScrollArea){aiScrollArea.scrollTop=aiScrollArea.scrollHeight;}
    if(scrollDownBtn)scrollDownBtn.classList.remove('show');
  }
  if(aiScrollArea)aiScrollArea.addEventListener('scroll',updateScrollBtn);
  if(scrollDownBtn)scrollDownBtn.addEventListener('click',scrollConvo);
  function showTyping(){
    var row=document.createElement('div');row.id='typingIndicator';
    row.innerHTML='<span class="ed-thinking-text" id="typingTarget"></span><span class="ed-thinking-dots"><span>.</span><span>.</span><span>.</span></span>';
    convoList.appendChild(row);var label=row.querySelector('#typingTarget');
    var i=Math.floor(Math.random()*thinkingMsgs.length);label.textContent=thinkingMsgs[i];
    thinkingInterval=setInterval(function(){i=(i+1)%thinkingMsgs.length;label.textContent=thinkingMsgs[i];},1800);scrollConvo();
  }
  function hideTyping(){if(thinkingInterval){clearInterval(thinkingInterval);thinkingInterval=null;}var el=document.getElementById('typingIndicator');if(el)el.remove();}

  /* ── Message rendering ── */
  function appendUserMsg(wrap, text, onDone) {
    wrap.innerHTML='<div class="ed-msg-label">You <span class="ed-msg-time">'+formatMsgTime()+'</span></div><div class="ed-msg-body">'+escHtml(text)+'</div>';
    convoList.appendChild(wrap);scrollConvo();if(onDone)onDone();
  }
  function appendBotMsg(wrap, text, onDone, suggestions) {
    wrap.innerHTML='<div class="ed-msg-label"><span class="ed-bot-avatar">T</span>Trifecta One <span class="ed-msg-time">'+formatMsgTime()+'</span></div><div class="ed-msg-body" id="tt"></div>';
    convoList.appendChild(wrap);
    var target=wrap.querySelector('#tt');target.removeAttribute('id');
    var cursor=document.createElement('span');cursor.className='ed-typing-cursor';target.appendChild(cursor);
    var i=0;
    function tick(){
      if(!wrap.isConnected)return;
      i=Math.min(i+3,text.length);target.textContent=text.substring(0,i);target.appendChild(cursor);scrollConvo();
      if(i<text.length){setTimeout(tick,16);}else{
        cursor.remove();target.innerHTML=mdToHtml(text);scrollConvo();
        var acts=document.createElement('div');acts.className='ed-bot-actions';
        acts.innerHTML=''
          +'<button class="ed-bot-action" title="Copy"><svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="5" width="8" height="9" rx="1"/><path d="M3 11V4a1 1 0 0 1 1-1h7"/></svg></button>'
          +'<button class="ed-bot-action ed-like-btn" title="Helpful"><svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12V4"/><path d="M4.5 7.5L8 4l3.5 3.5"/></svg></button>'
          +'<button class="ed-bot-action ed-dislike-btn" title="Not helpful"><svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4v8"/><path d="M4.5 8.5L8 12l3.5-3.5"/></svg></button>';
        acts.querySelector('.ed-bot-action').addEventListener('click',function(){navigator.clipboard.writeText(text);});
        acts.querySelector('.ed-like-btn').addEventListener('click',function(){
          this.classList.toggle('liked'); acts.querySelector('.ed-dislike-btn').classList.remove('disliked');
        });
        acts.querySelector('.ed-dislike-btn').addEventListener('click',function(){
          this.classList.toggle('disliked'); acts.querySelector('.ed-like-btn').classList.remove('liked');
        });
        wrap.appendChild(acts);
        if(suggestions.length){
          var fu=document.createElement('div');fu.className='ed-followups';
          suggestions.forEach(function(q){var c=document.createElement('button');c.className='ed-followup-chip';c.textContent=q;c.addEventListener('click',function(){fu.remove();sendMessage(q);});fu.appendChild(c);});
          convoList.appendChild(fu);scrollConvo();
        }
        if(onDone)onDone();
      }
    }
    tick();
  }
  function appendMsg(role, text, onDone) {
    var suggestions=[];var sm=text.match(/SUGGESTIONS:\s*(.+)/);
    if(sm){suggestions=sm[1].split('|').map(function(s){return s.trim().replace(/^"|"$/g,'');}).filter(Boolean);text=text.replace(/\n?SUGGESTIONS:.*$/m,'').trim();}
    var wrap=document.createElement('div');wrap.className='ed-msg '+role;
    if(role==='user') appendUserMsg(wrap,text,onDone);
    else appendBotMsg(wrap,text,onDone,suggestions);
  }

  function startTextSession(){
    if(textConversation)return Promise.resolve();
    if(textSessionPromise)return textSessionPromise;
    textGreetingPending=true;
    textSessionPromise=(async function(){
      var {Conversation}=await import(ELEVENLABS_SDK_URL);
      textConversation=await Conversation.startSession({
        agentId:EL_AGENT_ID,
        textOnly:true,
        overrides:{ agent:{ prompt:{ prompt:TEXT_MODE_PROMPT }, firstMessage:'' } },
        onMessage:function(data){
          var source = data && data.source;
          var message = data && (data.message || data.text || data.content);
          if(source==='user'||!message)return;
          if(textGreetingPending){
            textGreetingPending=false;
            if(isAgentGreeting(message))return;
          }
          if(!pendingBotHandler)return;
          var cb=pendingBotHandler;pendingBotHandler=null;
          clearResponseTimer();
          hideTyping();cb(message);
        },
        onError:function(){
          if(!pendingBotHandler)return;
          failPendingMessage('Sorry, something went wrong. Please try again.');
        },
        onDisconnect:function(){
          textConversation=null;textSessionPromise=null;
          if(pendingBotHandler)failPendingMessage('The connection dropped before Trifecta One could respond. Please try again.');
          else pendingBotHandler=null;
        }
      });
      textSessionPromise=null;
    })().catch(function(e){textSessionPromise=null;throw e;});
    return textSessionPromise;
  }

  async function sendMessage(text){
    if(thinking||!text.trim())return;thinking=true;if(aiStopGen)aiStopGen.classList.add('show');
    resetIdleTimer();
    startConversation();appendMsg('user',text);showTyping();
    var payload=wrapWithMode(text);
    function onDone(){thinking=false;if(aiStopGen)aiStopGen.classList.remove('show');if(chatInput){chatInput.focus();if(chatSend)chatSend.disabled=!chatInput.value.trim();}}
    try{
      await startTextSession();
      pendingBotHandler=function(responseText){
        appendMsg('bot',responseText,onDone);
      };
      clearResponseTimer();
      responseTimer=setTimeout(function(){
        if(!pendingBotHandler)return;
        failPendingMessage('Trifecta One is taking longer than expected. Please try again.', onDone);
      }, RESPONSE_TIMEOUT_MS);
      textConversation.sendUserMessage(payload);
    }catch(e){
      pendingBotHandler=null;
      clearResponseTimer();
      hideTyping();appendMsg('bot','Sorry, I couldn\'t connect. Please try again.',onDone);
    }
  }

  if(welcomeInput){
    welcomeInput.addEventListener('input',function(){if(welcomeSend)welcomeSend.disabled=!welcomeInput.value.trim();});
    welcomeInput.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();var t=welcomeInput.value.trim();if(!t)return;welcomeInput.value='';if(welcomeSend)welcomeSend.disabled=true;sendMessage(t);}});
  }
  if(welcomeSend)welcomeSend.addEventListener('click',function(){var t=welcomeInput?welcomeInput.value.trim():'';if(!t)return;if(welcomeInput)welcomeInput.value='';welcomeSend.disabled=true;sendMessage(t);});
  if(chatSend)chatSend.addEventListener('click',function(){if(thinking){closeTextSession();clearThinkingState();return;}var t=chatInput.value.trim();chatInput.value='';chatInput.style.height='auto';chatSend.disabled=true;sendMessage(t);});
  if(chatInput){
    chatInput.addEventListener('input',function(){chatInput.style.height='auto';chatInput.style.height=Math.min(chatInput.scrollHeight,120)+'px';if(chatSend&&!thinking)chatSend.disabled=!chatInput.value.trim();});
    chatInput.addEventListener('keydown',function(e){if(currentMode!=='ai')return;if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();var t=chatInput.value.trim();chatInput.value='';chatInput.style.height='auto';sendMessage(t);}});
  }
  if(aiStopGen)aiStopGen.addEventListener('click',function(){closeTextSession();clearThinkingState();});

  document.querySelectorAll('.ai-suggest-pill').forEach(function(pill){
    pill.addEventListener('click',function(){
      var q=pill.dataset.q;if(!q||!welcomeInput)return;
      welcomeInput.value=q;
      if(welcomeSend)welcomeSend.disabled=false;
      welcomeInput.focus();
    });
  });

  /* ── ElevenLabs Voice ── */
  var micStream=null, voicePaused=false;
  var voiceTranscriptPlaceholder=document.getElementById('voiceTranscriptPlaceholder');
  var pauseBtn=document.getElementById('pauseBtn');
  var pauseIcon=document.getElementById('pauseIcon');
  function closeElevenLabs(){
    if(voiceConversation){try{voiceConversation.endSession();}catch(e){}voiceConversation=null;}
    closeTextSession();
    voiceConnecting=false;
    clearThinkingState();
  }
  function resetVoiceUI(statusMessage){
    voiceOrb.classList.remove('listening','speaking');
    voiceLabel.textContent=statusMessage||'Talk to Trifecta One';voiceSublabel.style.display='';
    voiceStartBtn.style.display='';voiceStopBtn.style.display='none';
    if(pauseBtn){pauseBtn.style.display='none';pauseBtn.classList.remove('paused');pauseBtn.title='Pause';}
    if(pauseIcon)pauseIcon.innerHTML='<rect x="4" y="3" width="3" height="10" rx="1"/><rect x="9" y="3" width="3" height="10" rx="1"/>';
    voiceConversation=null;voiceConnecting=false;voicePaused=false;
    clearInterval(timerInterval);timerInterval=null;timerSecs=0;
    if(voiceTimer)voiceTimer.textContent='00:00';
    if(micStream){micStream.getTracks().forEach(function(t){t.stop();});micStream=null;}
    if(textConversation)resetIdleTimer();
  }
  function addTranscriptLine(role,text){
    if(voiceTranscriptPlaceholder)voiceTranscriptPlaceholder.style.display='none';
    var el=document.createElement('div');el.className='v-msg '+role;
    el.innerHTML='<div class="tag">'+(role==='agent'?'Trifecta One':'You')+'</div><div class="body">'+escHtml(text)+'</div>';
    voiceTranscript.appendChild(el);voiceTranscript.scrollTop=voiceTranscript.scrollHeight;
  }
  async function startVoiceSession(){
    if(voiceConnecting||voiceConversation)return;
    voiceConnecting=true;
    clearIdleTimer();
    closeTextSession();
    clearThinkingState();
    voiceOrb.classList.add('listening');voiceLabel.textContent='Connecting\u2026';voiceSublabel.style.display='none';voiceStartBtn.style.display='none';
    voiceGreetingPending=true;
    if(voiceTranscriptPlaceholder)voiceTranscriptPlaceholder.style.display='flex';
    voiceTranscript.querySelectorAll('.v-msg').forEach(function(el){el.remove();});
    try{
      micStream=await navigator.mediaDevices.getUserMedia({audio:true});
      var {Conversation}=await import(ELEVENLABS_SDK_URL);
      voiceConversation=await Conversation.startSession({agentId:EL_AGENT_ID,
        onConnect:function(){
          voiceConnecting=false;
          voiceLabel.textContent='Listening\u2026';voiceStopBtn.style.display='';
          if(pauseBtn){pauseBtn.style.display='inline-grid';}
          timerSecs=0;if(voiceTimer)voiceTimer.textContent='00:00';
          timerInterval=setInterval(function(){
            timerSecs++;var m=String(Math.floor(timerSecs/60)).padStart(2,'0');var s=String(timerSecs%60).padStart(2,'0');
            if(voiceTimer)voiceTimer.textContent=m+':'+s;
          },1000);
        },
        onDisconnect:function(){resetVoiceUI();},
        onError:function(){resetVoiceUI('Connection error — try again');},
        onModeChange:function(data){if(data.mode==='speaking'){voiceOrb.classList.remove('listening');voiceOrb.classList.add('speaking');voiceLabel.textContent='Speaking\u2026';}else{voiceOrb.classList.remove('speaking');voiceOrb.classList.add('listening');voiceLabel.textContent='Listening\u2026';}},
        onMessage:function(data){
          if(!data.message||!data.source)return;
          if(data.source!=='user'&&voiceGreetingPending){
            voiceGreetingPending=false;
            if(isAgentGreeting(data.message))return;
          }
          addTranscriptLine(data.source==='user'?'user':'agent',data.message);
        }
      });
    }catch(err){voiceConversation=null;resetVoiceUI(err.name==='NotAllowedError'?'Microphone access denied':'Could not connect — try again');}
  }
  async function stopVoiceSession(){if(voiceConversation){try{await voiceConversation.endSession();}catch(e){}}resetVoiceUI();}
  if(pauseBtn)pauseBtn.addEventListener('click',function(){
    if(!voiceConversation||!micStream)return;
    voicePaused=!voicePaused;
    micStream.getAudioTracks().forEach(function(t){t.enabled=!voicePaused;});
    if(voicePaused){
      clearInterval(timerInterval);timerInterval=null;
      voiceOrb.classList.remove('listening','speaking');
      voiceLabel.textContent='Paused';
      pauseBtn.classList.add('paused');pauseBtn.title='Resume';
      if(pauseIcon)pauseIcon.innerHTML='<polygon points="6,4 12,8 6,12"/>';
    }else{
      voiceLabel.textContent='Listening\u2026';
      voiceOrb.classList.add('listening');
      pauseBtn.classList.remove('paused');pauseBtn.title='Pause';
      if(pauseIcon)pauseIcon.innerHTML='<rect x="4" y="3" width="3" height="10" rx="1"/><rect x="9" y="3" width="3" height="10" rx="1"/>';
      timerInterval=setInterval(function(){
        timerSecs++;var m=String(Math.floor(timerSecs/60)).padStart(2,'0');var s=String(timerSecs%60).padStart(2,'0');
        if(voiceTimer)voiceTimer.textContent=m+':'+s;
      },1000);
    }
  });
  if(voiceStartBtn)voiceStartBtn.addEventListener('click',startVoiceSession);
  if(voiceStopBtn)voiceStopBtn.addEventListener('click',stopVoiceSession);
  voiceOrb.addEventListener('click',function(){if(voiceConversation)stopVoiceSession();else startVoiceSession();});
  var captionsBtn=document.getElementById('captionsBtn');if(captionsBtn)captionsBtn.addEventListener('click',function(){var on=captionsBtn.classList.toggle('on');var scroll=document.getElementById('voiceTranscript');if(scroll)scroll.style.visibility=on?'':'hidden';});
  var switchToTextBtn=document.getElementById('switchToTextBtn');if(switchToTextBtn)switchToTextBtn.addEventListener('click',function(){setMode('ai');});
  document.addEventListener('visibilitychange',function(){
    if(!document.hidden)return;
    if(voiceConversation)stopVoiceSession();
    if(textConversation){closeTextSession();clearThinkingState();}
  });
  window.addEventListener('pagehide',function(){closeElevenLabs();});
  var histBtn=document.getElementById('historyBtn');if(histBtn)histBtn.addEventListener('click',function(){var t=document.createElement('div');t.textContent='History \u2014 no conversations yet';t.style.cssText='position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:var(--navy);color:#fff;font:500 12px/1 var(--inter);padding:10px 16px;border-radius:8px;z-index:9999;opacity:0;transition:opacity 200ms;';document.body.appendChild(t);requestAnimationFrame(function(){t.style.opacity='1';});setTimeout(function(){t.style.opacity='0';setTimeout(function(){t.remove();},250);},2000);});
})();
