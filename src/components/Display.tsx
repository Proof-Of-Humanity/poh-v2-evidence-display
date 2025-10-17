import { useEffect, useState } from 'react'
import { readContract } from 'viem/actions'
import { parseParameters } from '../utils/parseParams'
import { useDualProvider } from '../hooks/useDualProvider'
import { pohV2ABI } from '../contracts/pohV2'
import { POH_V2_PROFILE_URL, type DisputeParameters } from '../utils/config'
import { gnosis, gnosisChiado, mainnet, sepolia } from 'viem/chains'

const chainNameById: Record<number, string> = {
  [mainnet.id]: mainnet.name,
  [gnosis.id]: gnosis.name,
  [sepolia.id]: sepolia.name,
  [gnosisChiado.id]: gnosisChiado.name
}

const getChainName = (chainId?: number) =>
  chainId ? chainNameById[chainId] : undefined

export function Display() {
  const [parameters, setParameters] = useState<DisputeParameters | null>(null)
  const [humanityId, setHumanityId] = useState<string | null>(null)
  const [requestId, setRequestId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { client, error: providerError } = useDualProvider(parameters)

  // Parse URL parameters on mount
  useEffect(() => {
    const params = parseParameters(window.location.search)
    if (!params) {
      setError('No dispute parameters found in URL')
    } else {
      setParameters(params)
    }
  }, [])

  // Fetch humanity ID from contract
  useEffect(() => {
    if (!client || !parameters) return

    const fetchHumanityId = async () => {
      try {
        const disputeData = await readContract(client, {
          address: parameters.arbitrableContractAddress,
          abi: pohV2ABI,
          functionName: 'disputeIdToData',
          args: [
            parameters.arbitratorContractAddress,
            BigInt(parameters.disputeID)
          ]
        })
        const [requestIdValue, , humanityIdValue] = disputeData as readonly [bigint, bigint, `0x${string}`]
        setHumanityId(humanityIdValue)
        setRequestId(requestIdValue.toString())
      } catch (err) {
        console.error('Contract call error:', err)
        setError('Failed to fetch submission data: ' + (err as Error).message)
      }
    }

    fetchHumanityId()
  }, [client, parameters])

  if (error || providerError) {
    return <p>{error || providerError}</p>
  }

  if (!humanityId) {
    return null
  }
  
  const chainName = getChainName(Number(parameters?.arbitrableChainID) ?? Number(parameters?.chainID));

  if(!chainName){
    setError('Invalid chain ID')
    return null
  }

  return (
    <a
      href={`${POH_V2_PROFILE_URL}/${humanityId}/${chainName}/${requestId}`}
      target="_blank"
      rel="noopener noreferrer"
      title={chainName ? `View submission on Proof of Humanity (${chainName})` : undefined}
      style={{
        color: 'rgba(0, 0, 0, 0.65)',
        fontFamily: 'Roboto, sans-serif',
        fontSize: '16px',
        textDecoration: 'none'
      }}
    >
      View Submission on Proof of Humanity
    </a>
  )
}
