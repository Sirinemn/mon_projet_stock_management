export interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    dateOfBirth: string;
    createdDate: string;
    lastModifiedDate: string;
    firstLogin?: boolean;
    roles: string[];
    groupId: number;
    groupName: string;
    createdBy: number;
}