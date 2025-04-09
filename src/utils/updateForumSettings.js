import api from "../api";
import config from "../config";

async function updateForumSettings(uid, settings) {
  const configResponse = await api.get(
    `${config.NODEBB_URL}/api/config`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const csrfToken = configResponse.data.csrf_token;

  api.put(
    `${config.NODEBB_URL}/api/v3/users/${uid}/settings`,
    {
      settings: settings,
    },
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken,
      },
    }
  )
    .then((response) => {
      const userSettings = response.data;
      return userSettings;
    })
    .catch((error) => {
      console.error(error);
    });
}

export default updateForumSettings;
