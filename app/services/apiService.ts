import { resolve } from "path";

const apiService = {
  get: async function (url: string): Promise<any> {
    console.log(`GET request to ${url}`);

    return new Promise((resolve, reject) => {
      fetch(`${process.env.NEXT_PUBLIC_API_HOST}/${url}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
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
    return new Promise((resolve, reject) => {
      fetch(`${process.env.NEXT_PUBLIC_API_HOST}/${url}`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
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
