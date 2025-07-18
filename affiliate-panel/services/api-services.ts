import { Config } from "@/utils/config";

export const Api = {
  get: async ({
    path,
    externalDomain,
  }: {
    path: string;
    externalDomain?: string;
  }) => {
    try {
      const response = await fetch(
        `${externalDomain || Config.env.app.api_url}${path}`,
        {
          method: "GET",
        }
      ).then((res) => res.json());
      return response;
    } catch (error) {
      return false;
    }
  },
  post: async ({
    path,
    body,
    headers,
    externalDomain,
  }: {
    path: string;
    body?: any;
    headers?: HeadersInit;
    externalDomain?: string;
  }) => {
    try {
      const res = await fetch(
        `${externalDomain || Config.env.app.api_url}${path}`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            ...headers,
          },
          body: JSON.stringify(body || {}),
        }
      ).then((res) => res.json());
      // console.log({ res });
      return res;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  delete: async ({
    path,
    body,
    headers,
    externalDomain,
  }: {
    path: string;
    body?: any;
    headers?: HeadersInit;
    externalDomain?: string;
  }) => {
    try {
      const res = await fetch(
        `${externalDomain || Config.env.app.api_url}${path}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            ...headers,
          },
          body: JSON.stringify(body || {}),
        }
      ).then((res) => res.json());
      return res;
    } catch (error) {
      return false;
    }
  },
};
