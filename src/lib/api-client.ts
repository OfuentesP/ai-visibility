import axios, { AxiosInstance } from 'axios';

class APIClient {
  private instance: AxiosInstance;

  constructor(baseURL = process.env.NEXT_PUBLIC_API_URL || '/api') {
    this.instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Audit endpoints
  async createAudit(urlId: string, engines: string[]) {
    return this.instance.post('/audit/create', { urlId, engines });
  }

  async getAuditStatus(auditId: string) {
    return this.instance.get(`/audit/${auditId}`);
  }

  async listAudits(clientId: string) {
    return this.instance.get(`/audits`, { params: { clientId } });
  }

  // URL endpoints
  async addURL(url: string, title: string, description?: string) {
    return this.instance.post('/urls', { url, title, description });
  }

  async listURLs(clientId: string) {
    return this.instance.get(`/urls`, { params: { clientId } });
  }

  // Recommendations
  async getRecommendations(urlId: string) {
    return this.instance.get(`/recommendations/${urlId}`);
  }

  // Analytics
  async getAnalytics(clientId: string) {
    return this.instance.get(`/analytics`, { params: { clientId } });
  }

  setAuthToken(token: string) {
    this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

export const apiClient = new APIClient();
