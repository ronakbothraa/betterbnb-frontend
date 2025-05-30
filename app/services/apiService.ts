import { resolve } from "path";
import { getAccessToken } from "../lib/actions";

const apiService = {
  get: async function (url: string): Promise<any> {
    console.log(`GET request to ${url}`);

    const accessToken = await getAccessToken();

    return new Promise((resolve, reject) => {
      fetch(`${process.env.NEXT_PUBLIC_API_HOST}/${url}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((json) => {
          console.log("Response data: ", json);
          resolve(json);
        })
        .catch((error) => {
          console.error("Error in GET request: ", error);
          reject(error);
        });
    });
  },

  post: async function (url: string, data: any): Promise<any> {
    
    const accessToken = await getAccessToken();

    let request;
    {
      accessToken
        ? (request = {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${accessToken}`,
            },
            body: data,
          })
        : (request = {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
            },
            body: data ? JSON.stringify(data) : null,
        });
    }

    return new Promise((resolve, reject) => {
      fetch(`${process.env.NEXT_PUBLIC_API_HOST}/${url}`, request)
        .then((response) => response.json())
        .then((json) => {
          console.log("Response data: ", json);
          resolve(json);
        })
        .catch((error) => {
          console.error("Error in POST request: ", error);
          reject(error);
        });
    });
  },
};

export default apiService;
