export interface DisputeParameters {
  disputeID: string
  arbitrableContractAddress: `0x${string}`
  arbitratorContractAddress: `0x${string}`
  arbitrableChainID?: number
  arbitratorChainID?: number
  arbitrableJsonRpcUrl?: string
  arbitratorJsonRpcUrl?: string
  chainID?: number
}

export const POH_V2_PROFILE_URL = 'https://v2.proofofhumanity.id'


