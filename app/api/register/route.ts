import { parseBody, readJson, toResponse } from "@/lib/apiResponse";
import { registerUser } from "@/lib/userService";
import { registerSchema } from "@/lib/validation";

// POST /api/register  { name, email, password, requestedRole, org? }
export async function POST(request: Request) {
  const parsed = parseBody(registerSchema, await readJson(request));
  if ("response" in parsed) return parsed.response;

  return toResponse(await registerUser(parsed.data), 201);
}
