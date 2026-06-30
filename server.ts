import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Helper to safely initialize GoogleGenAI client lazily
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

const app = express();
const PORT = 3000;

app.use(express.json());

// API: AI Task Analysis
app.post('/api/gemini/task-analyze', async (req, res) => {
  const { title, description, category, budget, deadline, urgency, taskType } = req.body;
  
  const ai = getAIClient();
  if (!ai) {
    // Elegant simulated fallback when API Key is not configured
    const calculatedClarity = Math.min(10, Math.max(1, Math.round((title?.length || 0) / 10 + (description?.length || 0) / 30 + 3)));
    const clarityScore = isNaN(calculatedClarity) ? 8 : calculatedClarity;
    const qualityScore = Math.round(clarityScore * 9.5);
    const successPrediction = Math.round(clarityScore * 8.5 + (urgency === 'urgent' ? 10 : 5));
    const priceRec = budget ? Math.round(budget * (1 + (10 - clarityScore) * 0.05)) : 500;
    
    return res.json({
      clarityScore,
      successPrediction: Math.min(99, successPrediction),
      qualityScore,
      priceRecommendation: priceRec,
      feedback: `[SIMULATED FEEDBACK] Great start! To improve your task clarity, try specifying the exact deliverables (e.g., file types, format, or exact campus locations). Your budget of ₹${budget || 500} is reasonable, but we recommend around ₹${priceRec} to attract top students quickly on campus.`
    });
  }

  try {
    const prompt = `
      You are TaskLink AI, a helper for a student-to-student platform.
      Analyze the following task listing proposed by a student poster.
      
      Task Title: "${title}"
      Description: "${description}"
      Category: "${category}"
      Proposed Budget: ₹${budget}
      Deadline: "${deadline}"
      Urgency: "${urgency}"
      Type: "${taskType}"
      
      Provide your analysis in JSON format ONLY. Do not write any markdowns, wrappers, or text other than the JSON object itself.
      The JSON object must have these exact keys:
      - clarityScore: number from 1 to 10 (based on how descriptive and well-defined the task is)
      - successPrediction: number from 1 to 100 (percentage chance of finding a doer and successfully completing before deadline)
      - qualityScore: number from 1 to 100
      - priceRecommendation: recommended budget in INR (number) based on the effort, type, and standard campus rates
      - feedback: a string of 2-3 specific, constructive tips on how the student can improve this task to attract verified peers.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    const responseText = response.text || '';
    // Strip markdown code block if present
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleanedText);
    res.json(result);
  } catch (err: any) {
    console.error('Gemini analyze error:', err);
    res.status(500).json({ error: 'AI analysis failed: ' + err.message });
  }
});

// API: AI Scam Detection in Chat
app.post('/api/gemini/scam-detect', async (req, res) => {
  const { currentMessage, history } = req.body;
  
  const ai = getAIClient();
  if (!ai) {
    // Simulated fallback checks for scam indicators (phone numbers, external keywords)
    const text = (currentMessage || '').toLowerCase();
    const hasPhone = /\b\d{10}\b/.test(text) || /\b\d{5}\s\d{5}\b/.test(text);
    const hasExternal = text.includes('whatsapp') || text.includes('telegram') || text.includes('gpay') || text.includes('paytm') || text.includes('phonepe') || text.includes('cash') || text.includes('external') || text.includes('upwork') || text.includes('fiverr');
    
    if (hasPhone || hasExternal) {
      return res.json({
        isScam: true,
        scamAlertReason: hasPhone ? 'Do not share phone numbers. Use built-in chat to remain safe.' : 'Attempting external payment or off-platform contact is high risk.'
      });
    }
    return res.json({ isScam: false });
  }

  try {
    const prompt = `
      You are TaskLink Guard, a real-time security filter for student-to-student transactions.
      We lock money in a secure escrow wallet on our platform. Some malicious users try to bypass this escrow by soliciting WhatsApp, Telegram, GPay, Paytm, or sharing contact details to pay off-platform, which leads to scams.
      
      Analyze the following chat message sent by a student doer or poster.
      Message: "${currentMessage}"
      
      Response Format: JSON ONLY. Do not write markdown wrappers or any other characters.
      The JSON object must have these exact keys:
      - isScam: boolean (true if the message clearly tries to bypass escrow, share personal phone/social contact, solicit external payment, or engage in suspicious peer-to-peer transaction fraud)
      - scamAlertReason: a short warning string explaining why the message was flagged, or an empty string if safe.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    const responseText = response.text || '';
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleanedText);
    res.json(result);
  } catch (err) {
    console.error('Scam detect error:', err);
    res.json({ isScam: false });
  }
});

// API: AI Task Rewriter
app.post('/api/gemini/rewrite-task', async (req, res) => {
  const { description, category } = req.body;
  
  const ai = getAIClient();
  if (!ai) {
    return res.json({
      rewrittenText: `✨ [AI REWRITTEN]\nI am looking for a student peer to assist with a ${category || 'general'} task.\n\nKey details:\n- Goal: ${description}\n- Requirements: Must be reliable, communicative, and complete on time.\n- Payment will be held in secure escrow and released immediately upon verification.\n\nPlease apply with your university details and department.`
    });
  }

  try {
    const prompt = `
      You are TaskLink Copywriter.
      Rewrite this student task description to make it highly professional, structured, attractive to doers, clear in its objectives, and easy to read. Keep a supportive, friendly, campus-peer tone. Do not use generic freelancing buzzwords.
      
      Original Description: "${description}"
      Category: "${category}"
      
      Return ONLY the rewritten text. Do not add any intros, explanations, or JSON wrappers. Just write the polished description itself.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    res.json({ rewrittenText: response.text?.trim() || description });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// API: AI Work Improver / Proofreader
app.post('/api/gemini/work-improver', async (req, res) => {
  const { submissionText } = req.body;
  
  const ai = getAIClient();
  if (!ai) {
    return res.json({
      suggestions: `[SIMULATED PROOFREAD]\n- Your submission is clear. Consider adding a short summary list of files uploaded.\n- Check that any code is free of hardcoded paths.\n- Grammar looks 100% correct.`
    });
  }

  try {
    const prompt = `
      You are TaskLink Quality Advisor.
      Review the following work progress summary or submission description created by a student doer.
      Provide constructive peer recommendations to polish the submission, check grammar, ensure clarity, and increase approval chances by the poster.
      
      Submission: "${submissionText}"
      
      Return ONLY the suggestions in bullet points. Avoid wrappers.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    res.json({ suggestions: response.text?.trim() || 'No feedback' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Setup Vite Dev Server / Static Hosting
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TaskLink Server] Express fullstack running on port ${PORT}`);
  });
}

startServer();
