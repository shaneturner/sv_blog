import { auth } from "$lib/auth";
import type { RequestHandler } from "@sveltejs/kit";

export const fallback: RequestHandler = ({ request }) => {
	return auth.handler(request);
};
