interface HuggingFaceConfig {
  apiKey: string;
  modelId: string;
}

interface PredictionResult {
  label: string;
  score: number;
}

export function getHuggingFaceConfig(): HuggingFaceConfig | null {
  try {
    const config = localStorage.getItem('huggingface_config');
    return config ? JSON.parse(config) : null;
  } catch {
    return null;
  }
}

export function setHuggingFaceConfig(config: HuggingFaceConfig): void {
  localStorage.setItem('huggingface_config', JSON.stringify(config));
}

export async function predictWithHuggingFace(
  file: File, 
  config: HuggingFaceConfig
): Promise<PredictionResult[]> {
  const response = await fetch(
    `https://api-inference.huggingface.co/models/${config.modelId}`,
    {
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/octet-stream',
      },
      method: 'POST',
      body: file,
    }
  );

  if (!response.ok) {
    throw new Error(`Hugging Face API error: ${response.statusText}`);
  }

  return await response.json();
}