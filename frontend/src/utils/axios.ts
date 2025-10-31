// axios.ts
import axios from 'axios'

let csrfToken: string | null = null;


axios.defaults.baseURL = "http://localhost:3001/api";
axios.defaults.withCredentials = true;

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

const fetchCsrfToken = async () => {
  try {
    const res = await axiosInstance.get("/csrf-token");
    csrfToken = res.data.csrfToken;
    console.log('csrfToken fetched: ', csrfToken);
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
  }
}

// Call fetchCsrfToken immediately to initialize it
//Can I call this in the main.tsx file?
// fetchCsrfToken();

//Attach CSRF token to outgoing requests
axios.interceptors.request.use(
  async (config) => {
    // If token not fetched yet, try fetching it again
    // if (!csrfToken) {
    //   await fetchCsrfToken();
    // }

    if (csrfToken && config.method !== "get") {
      console.log('csrf token from interceptor: ', csrfToken);
      config.headers["x-csrf-token"] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

fetchCsrfToken().catch((error) => {
  console.error("Initial CSRF token fetch failed:", error);
});

export default axios;
