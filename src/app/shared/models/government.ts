export interface IGovernment {
    name: string;
    boardToken: string;
    boardVoting: string;
    boardProposals: string;
    boardMembers: IBoardMember[];
    totalBoardMembers: number;
}
export class Government implements IGovernment {
    name: string;
    boardToken: string;
    boardVoting: string;
    boardProposals: string;
    boardMembers: IBoardMember[] = [];
    totalBoardMembers: number;
}

export interface IBoardMember {
    address: string;
    balance: string;
}