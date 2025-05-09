import axios from "axios"

// Create an axios instance with base URL
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem("maestro_user")
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        if (user.access_token) {
          config.headers.Authorization = `Bearer ${user.access_token}`
        }
      } catch (error) {
        console.error("Error parsing stored user:", error)
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If the error is due to an expired token and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const storedUser = localStorage.getItem("maestro_user")
        if (storedUser) {
          const user = JSON.parse(storedUser)

          // Call the refresh token endpoint
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/auth/spotify/refresh-token/`,
            { refresh_token: user.refresh_token },
          )

          if (response.data && response.data.access_token) {
            // Update the stored user with the new token
            const updatedUser = {
              ...user,
              access_token: response.data.access_token,
              token_expires: new Date(Date.now() + 3600 * 1000).toISOString(),
            }
            localStorage.setItem("maestro_user", JSON.stringify(updatedUser))

            // Update the Authorization header and retry the original request
            originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`
            return axios(originalRequest)
          }
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError)
        // If refresh fails, redirect to login
        localStorage.removeItem("maestro_user")
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  },
)

// API service functions
export const apiService = {
  // Auth
  getSpotifyAuthUrl: () => api.get("/auth/spotify/"),
  handleCallback: (code: string) => api.get(`/auth/spotify/callback/?code=${code}`),
  refreshToken: (refreshToken: string) => api.post("/auth/spotify/refresh-token/", { refresh_token: refreshToken }),

  // User
  getUserProfile: (userId: number) => api.get(`/users/${userId}/profile/`),

  // Analysis
  analyzeUser: (userId: number) => api.post("/analyze/", { user_id: userId }),
  getUserAnalyses: (userId: number) => api.get(`/users/${userId}/analyses/`),

  // Playlists
  generatePlaylist: (userId: number, mood?: string, prompt?: string) =>
    api.post("/generate-playlist/", { user_id: userId, mood, prompt }),
  getUserPlaylists: (userId: number) => api.get(`/users/${userId}/playlists/`),
}
