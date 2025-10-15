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
      try {
        const chain = getChainById(parameters.arbitrableChainID || parameters.chainID)

        // Strategy 1: Use injected RPC URL (read-only, no wallet needed)
        if (parameters.arbitrableJsonRpcUrl) {
          const publicClient = createPublicClient({
            transport: http(parameters.arbitrableJsonRpcUrl),
            chain,
          })
          setClient(publicClient)
          return
        }

        // Strategy 2: Use wallet provider
        if (typeof window !== 'undefined' && window.ethereum) {
          try {
            // Request account access if needed (for wallet mode)
            if (window.ethereum.enable) {
              await window.ethereum.enable()
            } else if (window.ethereum.request) {
              await window.ethereum.request({ method: 'eth_requestAccounts' })
            }
          } catch (enableError) {
            console.warn('User denied account access', enableError)
          }

          const publicClient = createPublicClient({
            transport: custom(window.ethereum),
            chain,
          })
          
          setClient(publicClient)
          return
        }

        setError('No RPC URL or wallet provider available')
      } catch (err) {
        setError('Failed to initialize provider: ' + (err as Error).message)
      }
    }

    initProvider()
  }, [parameters])

  return { client, error }
}


