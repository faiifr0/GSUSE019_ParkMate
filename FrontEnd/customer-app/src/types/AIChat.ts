export interface AIChatRequest {
  prompt: string;
  history: string[];
}

export interface AIChatResponse {
  answer: string;
  model: string;
}
