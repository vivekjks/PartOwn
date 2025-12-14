const PINATA_API_KEY = process.env.PINATA_API_KEY!
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY!

export async function uploadToPinata(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_KEY,
    },
    body: formData
  })

  if (!response.ok) {
    throw new Error('Failed to upload to IPFS')
  }

  const data = await response.json()
  return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`
}

export async function uploadJSONToPinata(json: object): Promise<string> {
  const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_KEY,
    },
    body: JSON.stringify(json)
  })

  if (!response.ok) {
    throw new Error('Failed to upload JSON to IPFS')
  }

  const data = await response.json()
  return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`
}
