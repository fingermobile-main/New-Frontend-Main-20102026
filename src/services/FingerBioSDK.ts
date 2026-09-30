// src/services/FingerBioSDK.ts

export interface FingerBioConfig {
  baseUrl?: string;
}

export interface BiometricResponse {
  authenticated?: boolean;
  mode?: string;
  identified_as?: string;
  username?: string;
  score?: number;
  session_token?: string;
  status?: string;
}

export class FingerBioSDK {
  private baseUrl: string;
  private stream: MediaStream | null = null;
  private modal: HTMLDivElement | null = null;

  constructor(config: FingerBioConfig = {}) {
    // Default to our internal Next.js API routes (which proxy or mock the Python backend)
    this.baseUrl = config.baseUrl || '/api/biometrics';
    this.stream = null;
    this.modal = null;
  }

  /**
   * Opens the camera stream and creates the Biometric UI Modal programmatically
   */
  async openCameraStream(label: string = 'Align your face'): Promise<void> {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    this.modal = document.createElement('div');
    this.modal.innerHTML = `
      <div style="position:fixed;inset:0;background:rgba(15,23,42,0.9);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:99999;">
        <div style="position:relative;width:260px;height:260px;border-radius:50%;overflow:hidden;border:3px solid #3b82f6;box-shadow:0 0 25px #3b82f6aa;">
          <video id="f-bio-cam" autoplay playsinline muted style="width:100%;height:100%;object-fit:cover;transform:scaleX(-1);"></video>
        </div>
        <p id="f-bio-label" style="color:#f8fafc;font-family:sans-serif;margin-top:16px;font-size:16px;font-weight:bold;">${label}</p>
        <button id="f-bio-cancel" style="margin-top:20px;padding:8px 16px;border-radius:8px;border:none;background:#334155;color:white;cursor:pointer;">Cancel</button>
      </div>`;
    document.body.appendChild(this.modal);

    const cancelButton = document.getElementById('f-bio-cancel');
    if (cancelButton) {
      cancelButton.onclick = () => {
        this.close();
        throw new Error('CANCELLED_BY_USER');
      };
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } }
      });
      this.stream = stream;
      const video = document.getElementById('f-bio-cam') as HTMLVideoElement;
      if (video) {
        video.srcObject = stream;
      }

      // Allow sensor stabilization and auto-exposure to adjust
      await new Promise(res => setTimeout(res, 1200));
    } catch (error) {
      this.close();
      throw new Error('CAMERA_PERMISSION_DENIED');
    }
  }

  /**
   * Captures the current frame from the active video stream as a base64 JPEG
   */
  captureFrame(): string {
    const video = document.getElementById('f-bio-cam') as HTMLVideoElement;
    if (!video) throw new Error('CAMERA_NOT_FOUND');

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('CANVAS_CONTEXT_FAILED');

    // Invert canvas back to natural orientation (since we mirrored the video preview)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/jpeg', 0.95);
  }

  /**
   * Closes the camera stream and removes the modal UI
   */
  close(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
    if (this.modal) {
      this.modal.remove();
      this.modal = null;
    }
  }

  /**
   * Updates the text label displayed in the modal
   */
  private updateLabel(text: string): void {
    const label = document.getElementById('f-bio-label');
    if (label) {
      label.innerText = text;
    }
  }

  /**
   * 1:1 Flow: User supplies username first, then Face verifies ownership
   */
  async verify1to1(username: string): Promise<BiometricResponse> {
    try {
      await this.openCameraStream(`Verifying @${username}...`);

      // Perform liveness check challenges here if needed in production
      // e.g. "Blink twice", "Turn head"

      this.updateLabel('Capturing frame...');
      const frame = this.captureFrame();

      this.updateLabel('Verifying identity with FingerMobile BioFace...');
      const res = await fetch(`${this.baseUrl}/verify-1to1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, image_base64: frame })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'VERIFICATION_FAILED');
      return data;
    } finally {
      this.close();
    }
  }

  /**
   * 1:N Flow: Passwordless lookup directly from face
   */
  async identify1toN(): Promise<BiometricResponse> {
    try {
      await this.openCameraStream('Sign in with Face...');
      this.updateLabel('Recognizing user...');

      const frame = this.captureFrame();

      this.updateLabel('Searching FingerMobile Database...');
      const res = await fetch(`${this.baseUrl}/identify-1toN`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_base64: frame })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'IDENTIFICATION_FAILED');
      return data;
    } finally {
      this.close();
    }
  }

  /**
   * Enroll a new biometric template
   */
  async enroll(username: string): Promise<BiometricResponse> {
    try {
      await this.openCameraStream(`Enrolling @${username}...`);
      this.updateLabel('Capturing biometric template...');

      const frame = this.captureFrame();

      this.updateLabel('Securing template in Vector DB...');
      const res = await fetch(`${this.baseUrl}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, image_base64: frame })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'ENROLLMENT_FAILED');
      return data;
    } finally {
      this.close();
    }
  }
}

// Export a singleton instance for convenient usage
export const fingerBioAuth = new FingerBioSDK();
