const axios = require("axios");

const generateStrategy = async (req, res) => {
  try {
    const { mission } = req.body;

    if (!mission) {
      return res.status(400).json({
        message: "Mission is required",
      });
    }

    const prompt = `
You are an AI Military Strategy Planner.

Mission:
${mission}

IMPORTANT RULES:

Return ONLY valid JSON.
Do NOT write explanations.
Do NOT write "Here is the JSON".
Do NOT use markdown.
Do NOT use \`\`\`json.

Use EXACTLY this schema.

{
  "missionObjective":"string",
  "resources":[
    "string",
    "string"
  ],
  "strategy":[
    "Step 1",
    "Step 2",
    "Step 3"
  ],
  "route":"string",
  "risks":[
    "Risk 1",
    "Risk 2"
  ],
  "successProbability":"75%"
}
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.1-8b-instruct",
        temperature: 0.2,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let text = response.data.choices[0].message.content;

    console.log("\nRAW RESPONSE:\n");
  

    // Remove markdown
    text = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Extract JSON only
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("No valid JSON found in AI response.");
    }

    text = text.substring(start, end + 1);

    console.log("\nPARSED JSON STRING:\n");
    console.log(text);

    const result = JSON.parse(text);

    // Safety defaults
    result.resources = Array.isArray(result.resources)
      ? result.resources.map(String)
      : [];

    result.strategy = Array.isArray(result.strategy)
      ? result.strategy.map(String)
      : [];

    result.risks = Array.isArray(result.risks)
      ? result.risks.map(String)
      : [];

    result.successProbability =
      result.successProbability || "70%";

    res.json(result);
  } catch (err) {
    console.log(err.response?.data || err);

    res.status(500).json({
      message: "AI Error",
      error: err.response?.data || err.message,
    });
  }
};

module.exports = {
  generateStrategy,
};