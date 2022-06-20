import axios from "axios";
export default async function handler(request, response) {
  const AuthStr = "Bearer ".concat(process.env.cambim);
  const domain = request.query.name;
  const data = await axios.get("https://unstoppabledomains.g.alchemy.com/domains/" + domain, {
    headers: { Authorization: AuthStr },
  });

  response.json(data.data);
}
