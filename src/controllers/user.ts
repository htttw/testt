import config from "../utils/config";
import { apiInstance } from "../utils/api";

const validateController = async (req: any, res: any) => {
  const { email, password } = req.body;
  const { data } = await apiInstance(
    config.serverElParron,
    config.apiKeyElParron
  ).post(`/user/validate`, { email, password });
  res.json(data);
};

export { validateController };
