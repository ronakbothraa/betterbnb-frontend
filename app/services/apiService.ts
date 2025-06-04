import { getAccessToken } from "../lib/actions";

// Define generic response type
type ApiResponse<T = unknown> = T;

// Define request data types
type RequestData = Record<string, unknown> | FormData | null;

const apiService = {
  get: async function <T = unknown>(url: string): Promise<ApiResponse<T>> {
    console.log(`GET request to ${url}`);

    const accessToken = await getAccessToken();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/${url}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          ...(accessToken && { "Authorization": `Bearer ${accessToken}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      console.log("Response data: ", json);
      return json;
    } catch (error) {
      console.error("Error in GET request: ", error);
      throw error;
    }
  },

  post: async function <T = unknown>(url: string, data: RequestData): Promise<ApiResponse<T>> {
    console.log(`POST request to ${url}`);
    
    const accessToken = await getAccessToken();

    // Determine if data is FormData or needs JSON stringification
    const isFormData = data instanceof FormData;
    
    const headers: Record<string, string> = {
      ...(accessToken && { "Authorization": `Bearer ${accessToken}` }),
    };

    // Only add Content-Type for non-FormData requests
    if (!isFormData) {
      headers["Accept"] = "application/json";
      headers["Content-Type"] = "application/json";
    }

    const requestOptions: RequestInit = {
      method: "POST",
      headers,
      body: isFormData ? data : (data ? JSON.stringify(data) : null),
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/${url}`, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      console.log("Response data: ", json);
      return json;
    } catch (error) {
      console.error("Error in POST request: ", error);
      throw error;
    }
  },

  put: async function <T = unknown>(url: string, data: RequestData): Promise<ApiResponse<T>> {
    console.log(`PUT request to ${url}`);
    
    const accessToken = await getAccessToken();

    const isFormData = data instanceof FormData;
    
    const headers: Record<string, string> = {
      ...(accessToken && { "Authorization": `Bearer ${accessToken}` }),
    };

    if (!isFormData) {
      headers["Accept"] = "application/json";
      headers["Content-Type"] = "application/json";
    }

    const requestOptions: RequestInit = {
      method: "PUT",
      headers,
      body: isFormData ? data : (data ? JSON.stringify(data) : null),
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/${url}`, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      console.log("Response data: ", json);
      return json;
    } catch (error) {
      console.error("Error in PUT request: ", error);
      throw error;
    }
  },

  delete: async function <T = unknown>(url: string): Promise<ApiResponse<T>> {
    console.log(`DELETE request to ${url}`);

    const accessToken = await getAccessToken();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/${url}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          ...(accessToken && { "Authorization": `Bearer ${accessToken}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      console.log("Response data: ", json);
      return json;
    } catch (error) {
      console.error("Error in DELETE request: ", error);
      throw error;
    }
  },
};

export default apiService;