import { UUID } from "crypto"

export enum Branch {
    IT = "IT",
    MEDIA = "MEDIA",
    INFRA = "INFRA",
    DEPORTES = "DEPORTES",
    NAUTICA = "NAUTICA",
    EVENTOS = "EVENTOS"
}

export enum StaffType {
    PRESIDENTE = "PRESIDENTE",
    VICEPRESIDENTE = "VICEPRESIDENTE",
    SECRETARIA = "SECRETARIA",
    TESORERIA = "TESORERIA",
    LIDER = "LIDER",
    MIEMBRO = "MIEMBRO"
}

export interface User {
    id: string
    email: string
    file_number?: number | null
    name?: string | null
    career_id?: string | null
    plan?: string | null
    role?: Role | null
    organizations?: Organization[] | null
}

/**
 * Represents an organization that a user belongs to
 */
interface Organization {
    organization_name: string
    role: string
}

/**
 * Represents a role that a user can have
 */
export interface Role {
    branch: Branch | string
    role: StaffType | string
    start: Date
    end?: Date | null
}


export enum AllowedRoles {
    IT = Branch.IT,
    MEDIA = Branch.MEDIA,
    INFRA = Branch.INFRA,
    DEPORTES = Branch.DEPORTES,
    NAUTICA = Branch.NAUTICA,
    EVENTOS = Branch.EVENTOS
}