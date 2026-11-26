import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "./prisma";

export async function requireUser() {
    const session = await auth();
    const email = session?.user?.email;

    if(!email) {
        redirect('/login');
    }

    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, name: true, role: true },
    });

    if (!user) {
        redirect('/login');
    }

    return user;
}