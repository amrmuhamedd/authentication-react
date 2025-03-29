export const tokenService = {
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },

  getAccessToken: () => localStorage.getItem("accessToken"),

  getRefreshToken: () => localStorage.getItem("refreshToken"),

  clearTokens: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  refreshTokens: async () => {
    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_ENV_API_BASE_URL}/auth/refresh-token`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          tokenService.clearTokens();
          window.location.href = "/login";
        }
        throw new Error("Token refresh failed");
      }

      const data = await response.json();
      const { access_token, refresh_token } = data;
      tokenService.setTokens(access_token, refresh_token);
      return access_token;
    } catch (error: any) {
      if (error.response?.status === 401) {
        tokenService.clearTokens();
        window.location.href = "/login";
      }
      throw error;
    }
  },
};
