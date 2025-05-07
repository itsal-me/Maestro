import { toast } from "sonner"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

interface ApiOptions {
  method?: string
  headers?: Record<string, string>
  body?: any
}

export async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", headers = {}, body } = options

  const requestOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  }

  if (body) {
    requestOptions.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, requestOptions)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Request failed with status ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("API request failed:", error)
    toast(error instanceof Error ? error.message : "An unknown error occurred");
    throw error
  }
}

export const api = {
  // Auth endpoints
  getSpotifyAuthUrl: () => apiRequest<{ auth_url: string }>("/auth/spotify/"),

  // User analysis endpoints
  analyzeUser: (userId: number) =>
    apiRequest<any>("/analyze/", {
      method: "POST",
      body: { user_id: userId },
    }),

  getUserAnalyses: (userId: number) => apiRequest<any[]>(`/users/${userId}/analyses/`),

  // Playlist endpoints
  generatePlaylist: (userId: number, mood?: string, prompt?: string) =>
    apiRequest<any>("/generate-playlist/", {
      method: "POST",
      body: {
        user_id: userId,
        mood,
        prompt,
      },
    }),

  getUserPlaylists: (userId: number) => apiRequest<any[]>(`/users/${userId}/playlists/`),
}
