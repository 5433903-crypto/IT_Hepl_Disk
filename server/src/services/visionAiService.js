const fs = require('fs');
const path = require('path');
const { diagnoseWithKnowledgeBase } = require('./ocrFallbackService');

/**
 * Modular Vision AI Service
 * Supports OpenAI Vision API when OPENAI_API_KEY is configured in backend environment.
 * Seamlessly and honestly falls back to Knowledge Base Diagnostic Engine when key is absent.
 */
async function analyzeImageWithVisionAI({ imagePath, originalname, description, labNumber, pcNumber }) {
  const apiKey = process.env.OPENAI_API_KEY;

  // Check if real AI provider is configured
  if (apiKey && apiKey.trim().length > 10 && !apiKey.includes('your-openai-api-key')) {
    try {
      console.log('[Vision AI] Initiating OpenAI Vision API diagnostic analysis...');
      
      let base64Image = '';
      if (imagePath && fs.existsSync(imagePath)) {
        const imageBuffer = fs.readFileSync(imagePath);
        base64Image = imageBuffer.toString('base64');
      }

      if (!base64Image) {
        throw new Error('Image file not found for Vision AI processing');
      }

      const promptText = `
You are an expert Campus IT Laboratory Systems Engineer.
Analyze this computer laboratory error screenshot or photo.
Context: Student is at Lab: "${labNumber}", Computer: "${pcNumber}".
Description provided by student: "${description || 'None'}".

Extract:
1. Exact error code or error message visible on screen (e.g. DNS_PROBE_FINISHED_NXDOMAIN, BSOD error code, CUDA driver error, 403 Forbidden, DHCP timeout, etc.)
2. Category: one of [Network, Hardware, Software, OS / Driver, Server / Login, Other]
3. Brief diagnostic title (1 line)
4. List of 3-5 immediate actionable step-by-step troubleshooting actions the student can perform at their terminal.
5. Suggested terminal commands (e.g. ipconfig /flushdns, ping, systemctl, etc.)
6. Confidence score (number between 70 and 99)

Respond strictly in valid JSON format with keys:
{
  "errorCode": "string",
  "category": "string",
  "title": "string",
  "resolutionSteps": ["step1", "step2", ...],
  "suggestedCommands": ["cmd1", ...],
  "confidence": 95,
  "escalateIf": "string"
}
`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: promptText },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`,
                  },
                },
              ],
            },
          ],
          response_format: { type: 'json_object' },
          max_tokens: 600,
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        console.warn(`[Vision AI API Warning] OpenAI request failed (${response.status}): ${errBody}. Falling back to Knowledge Base.`);
        return await diagnoseWithKnowledgeBase({
          filename: imagePath ? path.basename(imagePath) : '',
          originalname,
          description,
          labNumber,
          pcNumber,
        });
      }

      const data = await response.json();
      const content = JSON.parse(data.choices[0].message.content);

      return {
        provider: 'OpenAI Vision AI (gpt-4o-mini)',
        isAiFallback: false,
        errorCode: content.errorCode || 'DETECTED_LAB_ERROR',
        title: content.title || 'Laboratory Workstation Anomaly',
        category: content.category || 'Software',
        resolutionSteps: content.resolutionSteps || ['Check device status', 'Reboot workstation'],
        suggestedCommands: content.suggestedCommands || [],
        confidence: content.confidence || 92,
        escalateIf: content.escalateIf || 'Escalate if persistent across reboots',
        analyzedAt: new Date(),
        diagnosticNotes: 'Screen analyzed directly using real-time OpenAI Vision neural network.',
      };
    } catch (err) {
      console.error('[Vision AI Error]', err.message);
      // Fallback
      return await diagnoseWithKnowledgeBase({
        filename: imagePath ? path.basename(imagePath) : '',
        originalname,
        description,
        labNumber,
        pcNumber,
      });
    }
  }

  // No API key provided: Clearly labeled, robust Computer Engineering Knowledge Base fallback
  return await diagnoseWithKnowledgeBase({
    filename: imagePath ? path.basename(imagePath) : '',
    originalname,
    description,
    labNumber,
    pcNumber,
  });
}

module.exports = { analyzeImageWithVisionAI };
