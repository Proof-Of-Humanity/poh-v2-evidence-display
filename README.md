# PoH v2 Evidence Display

Iframe widget for Kleros Court that displays Proof of Humanity v2 submission links.

## Setup

```bash
yarn install
yarn dev
```

## Build

```bash
yarn build
```

Output: `build/` directory (ready for IPFS deployment)

## Usage

Embed as iframe with URL parameters:

```
?disputeID=123&arbitrableContractAddress=0x...&arbitratorContractAddress=0x...&arbitrableChainID=1&arbitrableJsonRpcUrl=https://...
```