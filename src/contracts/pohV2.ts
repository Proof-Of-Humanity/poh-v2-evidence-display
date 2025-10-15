import { Abi } from 'viem'

// Only include the ABI function actually used by this app
export const pohV2ABI = [
  {
    inputs: [
      { name: '', type: 'address' },      // arbitrator address
      { name: '', type: 'uint256' }       // dispute ID
    ],
    name: 'disputeIdToData',
    outputs: [
      { name: 'requestId', type: 'uint96' },
      { name: 'challengeId', type: 'uint96' },
      { name: 'humanityId', type: 'bytes20' }
    ],
    stateMutability: 'view',
    type: 'function'
  }
] as const satisfies Abi

export type PohV2ABI = typeof pohV2ABI


