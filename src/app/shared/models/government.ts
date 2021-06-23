export interface IGovernment {
    name: string;
    boardToken: string;
    boardVoting: string;
    boardProposals: string;
    boardMembers: string[];
    totalBoardMembers: number;
}
export class Government implements IGovernment {
    name: string;
    boardToken: string;
    boardVoting: string;
    boardProposals: string;
    boardMembers: string[] = [];
    totalBoardMembers: number;
}