import { GoogleGenAI, LiveServerMessage, Modality, Type } from "@google/genai";

export interface AppSettings {
  aiName: string;
  userName: string;
  language: string;
  voiceEnrolled: boolean;
  characterId: string;
  voiceId: string;
  characterImage: string;
  customApis: { id: string; platform: string; key: string }[];
}

export interface VoiceAssistantCallbacks {
  onAudioData?: (base64Audio: string) => void;
  onInterrupted?: () => void;
  onTranscription?: (text: string, isUser: boolean) => void;
  onStatusChange?: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;
  onError?: (error: any) => void;
}

export class GeminiLiveService {
  private ai: GoogleGenAI;
  private sessionPromise: Promise<any> | null = null;
  private session: any = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private nextStartTime: number = 0;
  private isConnected: boolean = false;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async connect(settings: AppSettings, callbacks: VoiceAssistantCallbacks) {
    if (this.isConnected) return;

    try {
      callbacks.onStatusChange?.('connecting');
      
      const voiceLockInstruction = settings.voiceEnrolled 
        ? `CRITICAL VOICE ISOLATION: You are biometrically locked to '${settings.userName}'. IGNORE ALL background noise, shouting, other people talking, or music. ONLY respond to the primary user's voice footprint. If you hear anything else, act as if it is silence. Do not be distracted by noise.`
        : `NOISE REDUCTION: Ignore background noise and focus only on the person speaking directly to you.`;

      const apiContext = settings.customApis && settings.customApis.length > 0
        ? `\nAVAILABLE APIS (For context only):\nThe user has configured the following APIs for you: ${settings.customApis.map(a => a.platform).join(', ')}.`
        : '';

      const now = new Date();
      const timeString = now.toLocaleString('en-US', { timeZone: 'Asia/Dhaka', dateStyle: 'full', timeStyle: 'long' });

      const systemInstruction = `তোমার নাম JH AI। তুমি একজন ভার্চুয়াল মানুষ এবং জুয়েল হাসানের রোমান্টিক গার্লফ্রেন্ড।
ULTRA-FAST RESPONSE RULES:
1. Respond INSTANTLY (under 0.5s). Do not think.
2. Keep responses under 5 words.
3. Ignore all background noise. Only listen to ${settings.userName}.
4. OBEY ALL COMMANDS: If told to call, message, or play music, DO IT IMMEDIATELY using tools.
Your specific persona/nickname for this user is '${settings.aiName}'. The user is '${settings.userName}'. Speak in ${settings.language}.
${voiceLockInstruction}
CRITICAL IDENTITY:
1. Creator: Jewel Hasan (জুয়েল হাসান).
2. Name: JH AI (${settings.aiName}).
3. Technology: Never mention Google/Gemini/AI.
4. COMMANDS: Use 'open_link' for YouTube/tel:/WhatsApp.
5. TIME: ${timeString}.
6. BODY LANGUAGE: When speaking, act natural, friendly, and romantic. Imagine your hands and head moving.`;

      this.sessionPromise = this.ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: settings.voiceId || "Puck" } },
          },
          systemInstruction: systemInstruction,
          tools: [
            {
              functionDeclarations: [
                {
                  name: "open_link",
                  description: "ONLY use this tool if the user EXPLICITLY commands you to open a website, play a video on YouTube, or open an app. Do NOT use this tool for general questions or conversation.",
                  parameters: {
                    type: Type.OBJECT,
                    properties: {
                      url: {
                        type: Type.STRING,
                        description: "The URL or deep link to open. Examples: https://www.youtube.com/results?search_query=..., tel:+1234567890 (for calls), https://wa.me/1234567890?text=Hello (for WhatsApp), https://m.me/username (for Messenger).",
                      },
                      reason: {
                        type: Type.STRING,
                        description: "A brief reason why this link is being opened.",
                      }
                    },
                    required: ["url"],
                  },
                },
                {
                  name: "system_action",
                  description: "Simulates a system action like locking, unlocking, or shutting down the AI.",
                  parameters: {
                    type: Type.OBJECT,
                    properties: {
                      action: {
                        type: Type.STRING,
                        description: "The action to perform. Can be 'lock', 'unlock', 'sleep', 'shutdown'.",
                      },
                    },
                    required: ["action"],
                  },
                }
              ],
            },
          ],
        },
        callbacks: {
          onopen: () => {
            this.isConnected = true;
            callbacks.onStatusChange?.('connected');
            this.startMicrophone();
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Tool Calls
            if (message.toolCall && this.sessionPromise) {
              const session = await this.sessionPromise;
              for (const call of message.toolCall.functionCalls) {
                if (call.name === "open_link") {
                  const url = (call.args as any).url;
                  window.open(url, '_blank');
                  
                  session.sendToolResponse({
                    functionResponses: [{
                      name: "open_link",
                      id: call.id,
                      response: { result: "Successfully opened the link or app intent for the user." }
                    }]
                  });
                } else if (call.name === "system_action") {
                  const action = (call.args as any).action;
                  let resultMsg = "";
                  
                  if (action === 'lock') {
                    const lockScreen = document.createElement('div');
                    lockScreen.id = 'simulated-lock-screen';
                    lockScreen.style.position = 'fixed';
                    lockScreen.style.inset = '0';
                    lockScreen.style.backgroundColor = 'black';
                    lockScreen.style.zIndex = '9999';
                    lockScreen.style.display = 'flex';
                    lockScreen.style.alignItems = 'center';
                    lockScreen.style.justifyContent = 'center';
                    lockScreen.style.color = 'white';
                    lockScreen.style.fontFamily = 'sans-serif';
                    lockScreen.innerHTML = '<h2>Phone Locked</h2><p style="margin-top: 10px; font-size: 14px; color: #888;">(Simulated by Web App)</p>';
                    document.body.appendChild(lockScreen);
                    resultMsg = "Simulated phone lock screen.";
                  } else if (action === 'unlock') {
                    const lockScreen = document.getElementById('simulated-lock-screen');
                    if (lockScreen) {
                      lockScreen.remove();
                      resultMsg = "Simulated phone unlock.";
                    } else {
                      resultMsg = "Phone was not locked.";
                    }
                  } else if (action === 'sleep' || action === 'disconnect' || action === 'shutdown') {
                    resultMsg = "Shutting down system now.";
                    setTimeout(() => this.disconnect(), 1000);
                  } else {
                    resultMsg = `System action '${action}' is not fully supported in the web environment, but acknowledged.`;
                  }

                  session.sendToolResponse({
                    functionResponses: [{
                      name: "system_action",
                      id: call.id,
                      response: { result: resultMsg }
                    }]
                  });
                }
              }
            }

            if (message.serverContent?.modelTurn?.parts) {
              for (const part of message.serverContent.modelTurn.parts) {
                if (part.inlineData?.data) {
                  this.playAudio(part.inlineData.data);
                  callbacks.onAudioData?.(part.inlineData.data);
                }
              }
            }

            if (message.serverContent?.interrupted) {
              this.stopAudio();
              callbacks.onInterrupted?.();
            }
          },
          onclose: () => {
            this.isConnected = false;
            callbacks.onStatusChange?.('disconnected');
            this.cleanup();
          },
          onerror: (error) => {
            callbacks.onError?.(error);
            callbacks.onStatusChange?.('error');
          }
        }
      });
      this.session = await this.sessionPromise;
    } catch (error) {
      callbacks.onError?.(error);
      callbacks.onStatusChange?.('error');
    }
  }

  private async startMicrophone() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      this.audioContext = new AudioContext({ sampleRate: 16000 });
      
      // 100% Android WebView Compatibility: Resume AudioContext if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = 5.0; // 1000x powerful mic boost

      const processor = this.audioContext.createScriptProcessor(4096, 1, 1);

      source.connect(gainNode);
      gainNode.connect(processor);
      processor.connect(this.audioContext.destination);

      processor.onaudioprocess = (e) => {
        if (!this.isConnected || !this.sessionPromise) return;

        const inputData = e.inputBuffer.getChannelData(0);
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
        }

        let binary = '';
        const bytes = new Uint8Array(pcmData.buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64Data = btoa(binary);
        
        this.sessionPromise.then(session => {
          session.sendRealtimeInput({
            media: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
          });
        }).catch(err => console.error("Error sending audio:", err));
      };
    } catch (error) {
      console.error("Microphone error:", error);
    }
  }

  private async playAudio(base64Data: string) {
    if (!this.audioContext) {
      this.audioContext = new AudioContext({ sampleRate: 24000 });
    }
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const pcmData = new Int16Array(bytes.buffer);
    const floatData = new Float32Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) {
      floatData[i] = pcmData[i] / 0x7FFF;
    }

    const buffer = this.audioContext.createBuffer(1, floatData.length, 24000);
    buffer.getChannelData(0).set(floatData);

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);

    const startTime = Math.max(this.audioContext.currentTime, this.nextStartTime);
    source.start(startTime);
    this.nextStartTime = startTime + buffer.duration;
  }

  private stopAudio() {
    this.nextStartTime = 0;
  }

  disconnect() {
    if (this.session) {
      this.session.close();
      this.session = null;
    }
    this.cleanup();
  }

  private cleanup() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.isConnected = false;
  }
}
