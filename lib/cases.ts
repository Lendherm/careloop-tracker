import { prisma } from "@/lib/prisma";
import type { CaseStatus } from "@/lib/types";

export interface CaseListItem {
    id: string;
    patientCode: string;
    resultIssuedAt: string;
    status: CaseStatus;
    ownerName: string | null;
    updatedAt: string;
}

export interface CaseDetail extends CaseListItem {
    createdAt: string;
    closureNote: string | null;
    closedByName: string | null;
    referrals: {
        id: string;
        status: string;
        notes: string | null;
        fromName: string;
        toName: string;
        createdAt: string;
    }[];
    timeline: {
        id: string;
        type: string;
        message: string;
        createdByName: string | null;
        createdAt: string;
    }[];
}

export async function getCases(): Promise<CaseListItem[]> {
    const cases = await prisma.case.findMany({
        orderBy: { resultIssuedAt: 'desc' },
        include: { owner: { select: { name: true} } },
    });

    return cases.map((c) => ({ 
        id: c.id,
        patientCode: c.patientCode,
        resultIssuedAt: c.resultIssuedAt.toISOString(),
        status: c.status,
        ownerName: c.owner?.name ?? null,
        updatedAt: c.updatedAt.toISOString(),
    }));
}

export async function getCaseById(id: string): Promise<CaseDetail | null> {
    const c = await prisma.case.findUnique({
        where: { id },
        include: {
            owner: { select: { name: true } },
            closedBy: { select: {name: true } },
            referrals: {
                orderBy: { createdAt: 'desc' },
                include: {
                    fromUser: { select: { name: true} },
                    toUser: { select: { name: true } },
                },
            },
            timeline: {
                orderBy: { createdAt: 'asc' },
                include: { createdBy: { select: { name: true } } },
            },
        },
    });

    if (!c) return null;

    return {
        id: c.id,
        patientCode: c.patientCode,
        resultIssuedAt: c.resultIssuedAt.toISOString(),
        status: c.status,
        ownerName: c.owner?.name ?? null,
        updatedAt: c.updatedAt.toISOString(),
        createdAt: c.createdAt.toISOString(),
        closureNote: c.closureNote,
        closedByName: c.closedBy?.name ?? null,
        referrals: c.referrals.map((r) => ({
            id: r.id,
            status: r.status,
            notes: r.notes,
            fromName: r.fromUser.name,
            toName: r.toUser.name,
            createdAt: r.createdAt.toISOString(),
        })),
        timeline: c.timeline.map((t) => ({
            id: t.id,
            type: t.type,
            message: t.message,
            createdByName: t.createdBy?.name ?? null,
            createdAt: t.createdAt.toISOString(),
        })),
    };
}

export async function createCaseRecord(input: {
    patientCode: string;
    resultIssuedAt: Date;
    ownerId: string;
}): Promise<string> {
    const created = await prisma.case.create({
        data: {
            patientCode: input.patientCode,
            resultIssuedAt: input.resultIssuedAt,
            ownerId: input.ownerId,
            timeline: {
                create: {
                    type: 'created',
                    message: 'Case created',
                    createdById: input.ownerId,
                },
            },
        },
        select: { id: true },
    });

    return created.id
}
