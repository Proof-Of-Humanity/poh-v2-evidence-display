import { DisputeParameters } from './config'

export function parseParameters(search: string): DisputeParameters | null {
  if (!search || search[0] !== '?') return null
  
  const queryString = search.substring(1)
  
  try {
    const params = new URLSearchParams(queryString)
    if (params.has('disputeID') && params.has('arbitrableContractAddress')) {
      const arbitratorAddress = params.get('arbitratorContractAddress')
      if (!arbitratorAddress) {
        console.error('Missing required parameter: arbitratorContractAddress')
        return null
      }
      
      return {
        disputeID: params.get('disputeID')!,
        arbitrableContractAddress: params.get('arbitrableContractAddress') as `0x${string}`,
        arbitratorContractAddress: arbitratorAddress as `0x${string}`,
        arbitrableChainID: params.get('arbitrableChainID') 
          ? parseInt(params.get('arbitrableChainID')!) 
          : undefined,
        arbitratorChainID: params.get('arbitratorChainID')
          ? parseInt(params.get('arbitratorChainID')!)
          : undefined,
        arbitrableJsonRpcUrl: params.get('arbitrableJsonRpcUrl') || undefined,
        arbitratorJsonRpcUrl: params.get('arbitratorJsonRpcUrl') || undefined,
      }
    }
  } catch (e) {
    console.warn('Failed to parse as URLSearchParams', e)
  }
  
  // Fallback to legacy JSON format
  try {
    const decoded = queryString
      .replace(/%22/g, '"')
      .replace(/%7B/g, '{')
      .replace(/%3A/g, ':')
      .replace(/%2C/g, ',')
      .replace(/%7D/g, '}')
    
    const parsed = JSON.parse(decoded)
    
    return {
      disputeID: parsed.disputeID,
      arbitrableContractAddress: parsed.arbitrableContractAddress,
      arbitratorContractAddress: parsed.arbitratorContractAddress,
      arbitrableChainID: parsed.arbitrableChainID,
      arbitratorChainID: parsed.arbitratorChainID,
      arbitrableJsonRpcUrl: decodeURIComponent(parsed.arbitrableJsonRpcUrl),
      arbitratorJsonRpcUrl: decodeURIComponent(parsed.arbitratorJsonRpcUrl),
      chainID: parsed.chainID,
    }
  } catch (e) {
    console.error('Failed to parse parameters', e)
    return null
  }
}

