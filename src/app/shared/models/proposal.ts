export interface IProposal {
    supportRequiredPct: number;
    minAcceptQuorumPct: number;
    voteTime: number;
    votesLength: number;
    votes: IVote[];
}

export interface IVote {
    id: number;
    open: boolean;
    executed: boolean;
    startDate: number;
    snapshotBlock: number;
    supportRequiredPct: number;
    minAcceptQuorumPct: number;
    bidsLength: number;
    winningBidId: number;
    bids: IBid[];
    voters: number[];

}

export interface IBid {
    name: string;
    beneficiary: string;
    active: boolean;
    cost: number;
    ifpshash: string;
    voteCount: number;
    bidsLength: number;
    bids: IBid[];
    voters: number[];
}