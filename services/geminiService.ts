
import { GoogleGenAI } from "@google/genai";
import { Player } from "../types";

/**
 * Generates a technical motivational summary for the squad.
 */
export const getSquadInsights = async (players: Player[]) => {
  // Always initialize GoogleGenAI with a named parameter for the API key.
  // Creating the instance inside the function ensures it uses the current environment context.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Actúa como un experto director técnico del Athletic Club. 
  Tengo la siguiente lista de jugadores: ${players.map(p => `${p.name} (${p.status}, participación ${p.participation}%)`).join(', ')}.
  Genera un breve resumen ejecutivo técnico de 2 párrafos sobre el estado de la plantilla, resaltando la importancia de los valores de Lezama y qué áreas debemos fortalecer basándonos en la disponibilidad.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    // Correctly accessing the text property from the GenerateContentResponse object.
    return response.text;
  } catch (error) {
    console.error("Error generating insights:", error);
    return "Error al conectar con el analista técnico IA.";
  }
};
