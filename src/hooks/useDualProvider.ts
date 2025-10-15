import { useEffect, useState } from 'react'
import { createPublicClient, custom, http, type PublicClient } from 'viem'
import { mainnet, gnosis, sepolia } from 'viem/chains'
import { DisputeParameters } from '../utils/config'

// Map chain IDs to viem chain configs
const getChainById = (chainId?: number) => {
  switch (chainId) {
    case 1:
      return mainnet
    case 100:
      return gnosis
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
          setClient(publicClient)
          return
        } catch (rpcError) {
          console.warn('RPC URL failed, trying fallback...', rpcError)
        }
      }

      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const publicClient = createPublicClient({
            transport: custom(window.ethereum),
            chain,
          })
          setClient(publicClient)
          return
        } catch (walletError) {
          console.warn('Wallet provider failed', walletError)
        }
      }

      setError('No RPC URL or wallet provider available')
    }

    initProvider()
  }, [parameters])

  return { client, error }
}


