import { useSuiClientQuery } from '@mysten/dapp-kit'
import { MintButton } from '@/components/MintButton'
import { TRACKER } from '@/lib/blockchain'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function NftMint() {
	// Query the tracker to check mint status
	const { data: trackerData, isLoading } = useSuiClientQuery(
		'getObject',
		{
			id: TRACKER,
			options: {
				showContent: true,
			},
		},
		{
			refetchInterval: 5000,
		}
	)

	// Extract mint count and limit from tracker
	const mintCount =
		trackerData?.data?.content &&
		typeof trackerData.data.content === 'object' &&
		'fields' in trackerData.data.content &&
		trackerData.data.content.fields &&
		typeof trackerData.data.content.fields === 'object' &&
		'mint_count' in trackerData.data.content.fields
			? Number(trackerData.data.content.fields.mint_count)
			: 0

	const MINT_LIMIT = 28

	const soldOut = mintCount >= MINT_LIMIT

	// Extract minted addresses from tracker
	const mintedAddresses: string[] =
		trackerData?.data?.content &&
		typeof trackerData.data.content === 'object' &&
		'fields' in trackerData.data.content &&
		trackerData.data.content.fields &&
		typeof trackerData.data.content.fields === 'object' &&
		'minted_addresses' in trackerData.data.content.fields &&
		Array.isArray(trackerData.data.content.fields.minted_addresses)
			? (trackerData.data.content.fields.minted_addresses as string[])
			: []

	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='max-w-2xl mx-auto'>
				<Card>
					<CardHeader>
						<CardTitle className='text-3xl font-bold text-center'>Sui Ghana 2025 Bootcamp NFT</CardTitle>
						<CardDescription className='text-center'>
							Mint your exclusive Bootcamp NFT to prove you attended the Sui Ghana 2025 Bootcamp
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-6'>
						{/* NFT Image */}
						<div className='flex justify-center'>
							<img
								src='/accra.jpg'
								alt='Sui Ghana 2025 Bootcamp NFT'
								className='w-60 h-auto rounded-lg object-cover border border-border'
							/>
						</div>

						{/* Mint Stats */}
						<div className='grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg'>
							<div className='text-center'>
								<p className='text-sm text-muted-foreground'>Minted</p>
								<p className='text-2xl font-bold'>{isLoading ? '...' : `${mintCount} / ${MINT_LIMIT}`}</p>
							</div>
							<div className='text-center'>
								<p className='text-sm text-muted-foreground'>Price</p>
								<p className='text-2xl font-bold'>0.1 SUI</p>
							</div>
						</div>

						{/* NFT Info */}
						<div className='space-y-2'>
							<h3 className='font-semibold'>About this NFT</h3>
							<ul className='list-disc list-inside space-y-1 text-sm text-muted-foreground'>
								<li>Unique NFT that proves you attended the Sui Ghana 2025 Bootcamp</li>
								<li>Limited edition: Only {MINT_LIMIT} NFTs available</li>
								<li>One NFT per wallet address</li>
							</ul>
						</div>

						{/* Mint Button */}
						<div className='flex justify-center pt-4'>
							<MintButton soldOut={soldOut} />
						</div>

						{soldOut && (
							<div className='text-center p-4 bg-destructive/10 border border-destructive/20 rounded-lg'>
								<p className='text-destructive font-semibold'>All NFTs have been minted!</p>
								<p className='text-sm text-muted-foreground mt-1'>
									Thank you to everyone who participated in the Sui Ghana 2025 Bootcamp
								</p>
							</div>
						)}

						{/* Minted Addresses List */}
						{mintedAddresses.length > 0 && (
							<div className='space-y-3 pt-4 border-t border-border'>
								<h3 className='font-semibold text-lg'>Minted Addresses ({mintedAddresses.length})</h3>
								<div className='max-h-64 overflow-y-auto space-y-2'>
									{mintedAddresses.map((address, index) => (
										<div
											key={`${address}-${index}`}
											className='flex items-center gap-2 p-2 bg-muted rounded-md border border-border hover:bg-muted/80 transition-colors'
										>
											<span className='text-xs font-semibold text-muted-foreground w-8'>#{index + 1}</span>
											<span className='font-mono text-sm break-all flex-1'>{address}</span>
											<button
												onClick={() => {
													navigator.clipboard.writeText(address)
												}}
												className='text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1'
												title='Copy address'
											>
												Copy
											</button>
										</div>
									))}
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
