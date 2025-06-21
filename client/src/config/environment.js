"use client";

const DEFAULT_API_URL = "http://localhost:5000/api";

let apiUrl = DEFAULT_API_URL;

try {
  if (process.env.NEXT_PUBLIC_API_URL) {
    apiUrl = process.env.NEXT_PUBLIC_API_URL;
  }


  if (typeof window !== 'undefined') {
    try {
      const getConfig = require('next/config').default;
      const { publicRuntimeConfig } = getConfig() || { publicRuntimeConfig: {} };

      if (publicRuntimeConfig) {
        if (publicRuntimeConfig.API_URL) {
          apiUrl = publicRuntimeConfig.API_URL;
        }
      }
    } catch (configError) {
      console.warn("Could not load runtime config, using environment variables or defaults");
    }
  }
} catch (error) {
  console.warn("Error accessing environment variables:", error);
}

export const API_URL = apiUrl;

export default {
  API_URL
};