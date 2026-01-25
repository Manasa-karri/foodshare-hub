const API_URL = import.meta.env.VITE_API_URL;

export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const getAvailableFood = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/api/food/available`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};
