import { useEffect, useState } from 'react'
import { createPublicClient, custom, http, type PublicClient } from 'viem'
import { mainnet, gnosis, sepolia, gnosisChiado } from 'viem/chains'
import { DisputeParameters } from '../utils/config'

const getChainById = (chainId?: number) => {
  switch (chainId) {
    case 1:
      return mainnet
    case 100:
      return gnosis
    case 10200:
      return gnosisChiado
    case 11155111:
      return sepolia
    default:
      return mainnet
  }
}

export function useDualProvider(parameters: DisputeParameters | null) {
  const [client, setClient] = useState<PublicClient | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!parameters) return

    const initProvider = async () => {
      const chain = getChainById(parameters.arbitrableChainID || parameters.chainID)

      if (parameters.arbitrableJsonRpcUrl) {
        try {
          const publicClient = createPublicClient({
            transport: http(parameters.arbitrableJsonRpcUrl),
            chain,
          })
          await publicClient.getBlockNumber()
          setClient(publicClient)
          return;
        } catch (err) {
          console.warn('RPC URL failed, falling back to wallet provider:', err)
        }
      }

      if (typeof window !== 'undefined' && window.ethereum) {
          const publicClient = createPublicClient({
            transport: custom(window.ethereum),
            chain,
          })
          setClient(publicClient)
          return;
      }

      setError('No RPC URL or wallet provider available')
    }

    initProvider()
  }, [parameters])

  return { client, error }
}


