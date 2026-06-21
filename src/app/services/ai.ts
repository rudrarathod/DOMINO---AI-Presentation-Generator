export interface SlideOutline {
  type: 'cover' | 'problem' | 'solution' | 'market' | 'product' | 'business_model' | 'competition' | 'financials' | 'roadmap' | 'team' | 'generic';
  title: string;
  description: string;
}

export interface PresentationOutline {
  presentationTitle: string;
  themeColor: string;
  slides: SlideOutline[];
}

export interface Slide {
  id: string;
  name: string;
  type: 'cover' | 'problem' | 'solution' | 'market' | 'product' | 'business_model' | 'competition' | 'financials' | 'roadmap' | 'team' | 'generic';
  color: string;
  data: any;
}

export function getApiKey(): string {
  const saved = localStorage.getItem("lumina_api_key") || "";
  // Check if it's the default masked placeholder from settings, if so, ignore it
  if (saved && !saved.includes("•") && saved.startsWith("gsk_")) {
    return saved;
  }
  // Try to read default API key from process environment variables
  return (import.meta.env.AI_API as string) || "";
}

export function getModel(): string {
  return localStorage.getItem("lumina_model") || "llama-3.3-70b-versatile";
}

async function callGroq(messages: { role: string; content: string }[], responseFormatJson: boolean = true) {
  const apiKey = getApiKey();
  const model = getModel();

  if (!apiKey) {
    throw new Error("No Groq API Key found. Please add your key in the settings panel.");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: 0.2,
      response_format: responseFormatJson ? { type: "json_object" } : undefined,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Groq API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  return responseFormatJson ? JSON.parse(content) : content;
}

export async function generateOutline(prompt: string, slideCount: string): Promise<PresentationOutline> {
  const countDesc = slideCount === "Auto" ? "about 8 to 10 slides" : `exactly ${slideCount} slides`;

  const systemPrompt = `You are DOMINO AI, an expert presentation designer.
Your task is to outline a slide deck based on the user's prompt.
You must choose a logical, premium layout structure using only these available slide templates:
- cover (strictly slide 1)
- problem
- solution
- market
- product
- business_model
- competition
- financials
- roadmap
- team
- generic (use this for any slide that doesn't fit the specific topics above, such as "Marketing Strategy", "Vision", "Summary", etc.)

Recommend a themeColor tailwind gradient class (e.g. from-violet-600 to-indigo-700, from-rose-500 to-pink-600, from-emerald-500 to-teal-600, from-blue-500 to-cyan-600, from-amber-500 to-orange-600, from-indigo-500 to-blue-600, from-fuchsia-500 to-violet-600).

Return a JSON object in this format:
{
  "presentationTitle": "Short catchy name for the presentation",
  "themeColor": "gradient-class-name",
  "slides": [
    {
      "type": "cover | problem | solution | etc",
      "title": "Short title of the slide (max 4-5 words)",
      "description": "Short guidelines of what contents should go on this slide"
    }
  ]
}`;

  const userPrompt = `Create a presentation outline for: "${prompt}".
The presentation should have ${countDesc}. Ensure a logical flow from Cover, Problem, Solution, to Market and other pitch deck slides.`;

  return callGroq([
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt }
  ]);
}

export async function generateSlideContent(
  slide: SlideOutline,
  themeColor: string,
  deckTopic: string,
  slideIndex: number
): Promise<Slide> {
  const schemaInstructions = getSlideSchemaInstructions(slide.type);

  const systemPrompt = `You are an expert copywriter and presentation designer.
Generate the contents for Slide #${slideIndex + 1} ("${slide.title}") of type "${slide.type}".
The overall presentation topic is: "${deckTopic}".
Slide description context: "${slide.description}".

You MUST return a JSON object containing the exact properties specified below.
Ensure all data is realistic, professional, and fully fleshed-out (NO placeholders like "John Doe" or "Insert Metric").

${schemaInstructions}`;

  const userPrompt = `Generate the contents JSON for the slide "${slide.title}" of type "${slide.type}".`;

  const data = await callGroq([
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt }
  ]);

  return {
    id: `slide-${slideIndex}-${Date.now()}`,
    name: slide.title,
    type: slide.type,
    color: themeColor,
    data: data,
  };
}

export interface ChatModification {
  action: 'modify' | 'add' | 'delete' | 'none';
  slideIndex?: number;
  slide?: Omit<Slide, 'id'> & { id?: string };
}

export interface RefinementResponse {
  explanation: string;
  modifications: ChatModification[];
}

export async function refineSlides(
  chatHistory: { role: 'user' | 'ai'; text: string }[],
  slides: Slide[],
  activeSlideIndex: number,
  scope: 'slide' | 'deck'
) {
  const currentDeckJSON = JSON.stringify(slides.map((s, idx) => ({
    index: idx,
    id: s.id,
    name: s.name,
    type: s.type,
    color: s.color,
    data: s.data
  })), null, 2);

  const scopeInstructions = scope === 'slide'
    ? `The user wants to edit ONLY the active slide (index ${activeSlideIndex}). You MUST NOT add slides, delete slides, or modify other slides. Any modifications you suggest must only apply to the active slide.`
    : `The user wants to edit the WHOLE DECK. You can modify any slide, add new slides, or delete slides as requested.`;

  const systemPrompt = `You are DOMINO AI, an interactive presentation assistant.
The user is viewing a slide deck and wants to edit it.
${scopeInstructions}

You have the power to:
- Modify content/styles of an existing slide
- Add a new slide (using cover, problem, solution, market, product, business_model, competition, financials, roadmap, team, or generic)
- Delete a slide
- Respond with general feedback

Here is the current slide deck JSON:
${currentDeckJSON}

The active slide is index ${activeSlideIndex}.

When requested to edit/refine:
- Formulate one or more modifications in a list.
- If modifying or adding a slide, provide the FULL slide content in the 'data' field. Use the exact data schemas for the slide type.
- Ensure the 'color' is consistent with the deck theme (e.g. current slides' color) unless they specifically ask to change color.
- Specify 'slideIndex' (0-indexed) correctly.
- Return a JSON object with:
  {
    "explanation": "A clear, concise, friendly explanation of what you updated (written directly to the user).",
    "modifications": [
      {
        "action": "modify" | "add" | "delete" | "none",
        "slideIndex": number,
        "slide": {
          "name": "Slide tab name",
          "type": "cover | problem | solution | etc",
          "color": "gradient-class-name",
          "data": { ... exact schema for type ... }
        }
      }
    ]
  }

Schemas for reference:
${getAllSchemasDescription()}`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...chatHistory.map(h => ({
      role: h.role === "user" ? "user" : "assistant",
      content: h.text
    }))
  ];

  return callGroq(messages);
}

function getSlideSchemaInstructions(type: string): string {
  switch (type) {
    case 'cover':
      return `Return a JSON object matching this schema:
{
  "tagline": "A short 2-3 word tagline (e.g. AgriTech Platform)",
  "title": "Catchy main slide title (e.g. AI-Powered Farming)",
  "subtitle": "Clear, premium subtitle detailing the value proposition",
  "stats": [
    { "value": "e.g. 85%", "label": "e.g. Yield Increase" },
    { "value": "e.g. $2.4B", "label": "e.g. Market Size" },
    { "value": "e.g. 12K+", "label": "e.g. Active Farms" }
  ],
  "demoTitle": "Label for the preview card (e.g. Platform Preview)",
  "bottomStats": [
    { "iconName": "globe | trending-up | bar-chart | leaf | rocket | zap | shield | users", "label": "Global Coverage", "val": "47 Countries" },
    { "iconName": "globe | trending-up | bar-chart | leaf | rocket | zap | shield | users", "label": "Avg. Revenue Lift", "val": "+34% YoY" },
    { "iconName": "globe | trending-up | bar-chart | leaf | rocket | zap | shield | users", "label": "Data Points / Day", "val": "2.1 Billion" }
  ]
}
NOTE: stats must have exactly 3 items, bottomStats must have exactly 3 items.`;

    case 'problem':
      return `Return a JSON object matching this schema:
{
  "badge": "e.g. 02 · PROBLEM",
  "title": "A strong headline explaining the problem",
  "cards": [
    { "title": "Resource Waste", "desc": "Detailed description of the issue.", "pct": "40%" },
    { "title": "Yield Uncertainty", "desc": "Detailed description of the issue.", "pct": "63%" },
    { "title": "Labor Gap", "desc": "Detailed description of the issue.", "pct": "78%" }
  ]
}
NOTE: cards must have exactly 3 items. The 'pct' can be percentages, numbers, or short metrics.`;

    case 'solution':
      return `Return a JSON object matching this schema:
{
  "badge": "e.g. 03 · SOLUTION",
  "title": "A headline stating the solution",
  "cards": [
    { "iconName": "cpu | leaf | zap | globe | users", "title": "AI Monitoring", "desc": "How it works" },
    { "iconName": "bar-chart | trending-up | briefcase", "title": "Predictive Analytics", "desc": "How it works" }
  ],
  "demoTitle": "e.g. Platform Demo"
}
NOTE: cards must have exactly 2 items.`;

    case 'market':
      return `Return a JSON object matching this schema:
{
  "badge": "e.g. 04 · MARKET",
  "title": "Market opportunity title",
  "cards": [
    { "label": "TAM", "value": "$240B", "desc": "Total Addressable Market definition", "color": "blue" },
    { "label": "SAM", "value": "$52B", "desc": "Serviceable Addressable Market definition", "color": "cyan" },
    { "label": "SOM", "value": "$2.4B", "desc": "Serviceable Obtainable Market definition", "color": "teal" }
  ]
}
NOTE: cards must have exactly 3 items. Use colors like 'blue', 'cyan', 'teal', 'emerald', 'indigo', or 'violet' for the color property.`;

    case 'product':
      return `Return a JSON object matching this schema:
{
  "badge": "e.g. 05 · PRODUCT",
  "title": "Premium headline about the product",
  "features": [
    { "iconName": "globe", "title": "Feature 1" },
    { "iconName": "bar-chart", "title": "Feature 2" },
    { "iconName": "cpu", "title": "Feature 3" },
    { "iconName": "users", "title": "Feature 4" }
  ]
}
NOTE: features must have exactly 4 items.`;

    case 'business_model':
      return `Return a JSON object matching this schema:
{
  "badge": "e.g. 06 · BUSINESS MODEL",
  "title": "Pricing & monetisation strategy",
  "tiers": [
    { "tier": "Starter", "price": "$299/mo", "desc": "Details..." },
    { "tier": "Pro", "price": "$899/mo", "desc": "Details..." },
    { "tier": "Enterprise", "price": "Custom", "desc": "Details..." },
    { "tier": "Data API", "price": "$0.02/call", "desc": "Details..." }
  ]
}
NOTE: tiers must have exactly 4 items.`;

    case 'competition':
      return `Return a JSON object matching this schema:
{
  "badge": "e.g. 07 · COMPETITION",
  "title": "Competitive landscape title",
  "headers": ["Feature", "Our Company Name", "Competitor A", "Competitor B"],
  "rows": [
    ["AI-Driven Insights", true, false, false],
    ["Real-Time Monitoring", true, true, false],
    ["Predictive Models", true, false, false],
    ["Multi-Platform", true, true, true],
    ["API Access", true, false, true]
  ]
}
NOTE: headers must have exactly 4 items (column 1 title, company name, then 2 competitor names). rows is an array of 5 rows, each containing a string followed by exactly 3 booleans.`;

    case 'financials':
      return `Return a JSON object matching this schema:
{
  "badge": "e.g. 08 · FINANCIALS",
  "title": "Headline summarizing financial metrics",
  "metrics": [
    { "label": "ARR (2025)", "value": "$4.2M", "growth": "+128% YoY" },
    { "label": "Gross Margin", "value": "74%", "growth": "↑ 6pts" },
    { "label": "CAC", "value": "$1,240", "growth": "↓ 18% QoQ" },
    { "label": "LTV", "value": "$28,500", "growth": "23x LTV/CAC" }
  ],
  "chartTitle": "Revenue Projection Chart"
}
NOTE: metrics must have exactly 4 items.`;

    case 'roadmap':
      return `Return a JSON object matching this schema:
{
  "badge": "e.g. 09 · ROADMAP",
  "title": "Future milestones headline",
  "milestones": [
    { "q": "Q1 2025", "title": "Milestone A", "desc": "Detailed milestone description.", "done": true },
    { "q": "Q2 2025", "title": "Milestone B", "desc": "Detailed milestone description.", "done": true },
    { "q": "Q3 2025", "title": "Milestone C", "desc": "Detailed milestone description.", "done": false },
    { "q": "Q4 2025", "title": "Milestone D", "desc": "Detailed milestone description.", "done": false }
  ]
}
NOTE: milestones must have exactly 4 items. 'done' is a boolean value indicating if it's completed.`;

    case 'team':
      return `Return a JSON object matching this schema:
{
  "badge": "e.g. 10 · TEAM",
  "title": "Our founding team",
  "members": [
    { "name": "Dr. Sarah Chen", "role": "CEO & Co-founder", "bg": "from-violet-500 to-indigo-600", "initials": "SC" },
    { "name": "Marcus Rivera", "role": "CTO & Co-founder", "bg": "from-blue-500 to-cyan-600", "initials": "MR" },
    { "name": "Priya Nair", "role": "Head of AI Research", "bg": "from-emerald-500 to-teal-600", "initials": "PN" },
    { "name": "James Okafor", "role": "VP of Growth", "bg": "from-amber-500 to-orange-600", "initials": "JO" }
  ]
}
NOTE: members must have exactly 4 items. Initials must be 2 characters. bg should be standard from-X-500 to-Y-600 gradients.`;

    case 'generic':
    default:
      return `Return a JSON object matching this schema:
{
  "badge": "e.g. 05 · OVERVIEW",
  "title": "A headline explaining the slide content",
  "layout": "list | grid",
  "bullets": [
    { "title": "Core Point 1", "desc": "Detailed description of this core point.", "iconName": "zap | rocket | shield | cpu | check" },
    { "title": "Core Point 2", "desc": "Detailed description of this core point.", "iconName": "globe | users | trending-up | bar-chart" },
    { "title": "Core Point 3", "desc": "Detailed description of this core point.", "iconName": "leaf | play | wand2 | briefcase | sparkles" }
  ]
}
NOTE: bullets must have 3 to 4 items. layout must be either 'list' (bulleted list layout) or 'grid' (2x2 grid columns layout).`;
  }
}

function getAllSchemasDescription(): string {
  return `
1. cover: { tagline, title, subtitle, stats: [{value, label}], bottomStats: [{iconName, label, val}] } (exactly 3 stats, 3 bottomStats)
2. problem: { badge, title, cards: [{title, desc, pct}] } (exactly 3 cards)
3. solution: { badge, title, cards: [{iconName, title, desc}], demoTitle } (exactly 2 cards)
4. market: { badge, title, cards: [{label, value, desc, color}] } (exactly 3 cards, colors: blue, cyan, teal)
5. product: { badge, title, features: [{iconName, title}] } (exactly 4 features)
6. business_model: { badge, title, tiers: [{tier, price, desc}] } (exactly 4 tiers)
7. competition: { badge, title, headers: [string, string, string, string], rows: [ [string, boolean, boolean, boolean], ... ] } (exactly 4 headers, ~5 rows)
8. financials: { badge, title, metrics: [{label, value, growth}], chartTitle } (exactly 4 metrics)
9. roadmap: { badge, title, milestones: [{q, title, desc, done: boolean}] } (exactly 4 milestones)
10. team: { badge, title, members: [{name, role, bg, initials}] } (exactly 4 members)
11. generic: { badge, title, layout: "list" | "grid", bullets: [{title, desc, iconName}] } (3-4 bullets)
`;
}
