import { Button } from '@/components/ui/button'
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { MINT_PRICE, PACKAGE_ID, TRACKER } from '@/lib/blockchain'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

interface MintButtonProps {
	soldOut?: boolean
}

export function MintButton({ soldOut = false }: MintButtonProps) {
	const queryClient = useQueryClient()
	const suiClient = useSuiClient()
	const account = useCurrentAccount()

	const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction({
		execute: async ({ bytes, signature }) =>
			await suiClient.executeTransactionBlock({
				transactionBlock: bytes,
				signature,
				options: {
					// Raw effects are required so the effects can be reported back to the wallet
					showRawEffects: true,
					// Select additional data to return
					showObjectChanges: true,
					showEffects: true,
				},
			}),
	})

	const handleClick = async () => {
		if (!account?.address) {
			toast.error('Please connect your wallet')
			return
		}

		try {
			const tx = new Transaction()
			tx.setGasBudget(300_000_000)

			// Split coins for payment
			const [payment] = tx.splitCoins(tx.gas, [tx.pure.u64(MINT_PRICE)])

			// Call the mint function
			const result = tx.moveCall({
				target: `${PACKAGE_ID}::accra::mint`,
				arguments: [tx.object(TRACKER), payment],
			})

			// Transfer the minted NFT to the user
			tx.transferObjects([result], account.address)

			signAndExecuteTransaction(
				{
					transaction: tx,
				},
				{
					onSuccess: async (result) => {
						try {
							// Wait for transaction to be confirmed
							const txDetails = await suiClient.waitForTransaction({
								digest: result.digest,
								options: {
									showEffects: true,
									showObjectChanges: true,
								},
							})

							const effects = txDetails.effects
							const status = effects?.status?.status

							if (status === 'success') {
								// Invalidate queries to refresh tracker data
								queryClient.invalidateQueries({
									queryKey: ['getObject', { id: TRACKER }],
								})

								toast.success('You have successfully minted this NFT!', {
									description: 'You are now officially a Sui Ghana 2025 Bootcamp attendee',
								})
							}

							if (status === 'failure') {
								const error = effects?.status?.error

								if (error) {
									// Error codes from accra.move:
									// EAlreadyMinted: 0
									// EMaxSupplyReached: 1
									// EIncorrectPayment: 2

									// Check error message for error codes
									const errorStr = String(error)

									if (errorStr.includes('0') || errorStr.includes('EAlreadyMinted')) {
										toast.error('One NFT per wallet', {
											description: 'You have already minted this NFT! 🚫',
										})
									} else if (errorStr.includes('1') || errorStr.includes('EMaxSupplyReached')) {
										toast.error('Sold out 😱', {
											description: 'All Bootcamp NFTs have been minted!',
										})
									} else if (errorStr.includes('2') || errorStr.includes('EIncorrectPayment')) {
										toast.error('Insufficient SUI amount', {
											description: "You don't have enough SUI in your balance 😱",
										})
									} else {
										toast.error('Transaction failed', {
											description: errorStr || 'An unexpected error occurred',
										})
									}
								} else {
									toast.error('Transaction failed', {
										description: 'An unexpected error occurred. Please try again',
									})
								}
							}
						} catch (error) {
							console.error('Error checking transaction:', error)
							toast.error('Error confirming transaction', {
								description: 'Please check your wallet or try again',
							})
						}
					},
					onError: (error) => {
						console.error('Error:', error)
						toast.error('Transaction failed', {
							description: error.message || 'An error occurred while minting',
						})
					},
				}
			)
		} catch (e) {
			console.error('Mint error:', e)
			toast.error('Something went wrong', {
				description: 'Please try again or check your wallet connection',
			})
		}
	}

	return (
		<div className='flex flex-col gap-4 items-center'>
			<div className='block md:hidden dappkit-scope'>
				<ConnectButton />
			</div>
			<Button
				className='bg-amber-600 hover:bg-amber-700 text-white w-fit cursor-pointer px-6 py-3 text-lg font-semibold'
				onClick={handleClick}
				disabled={!account || soldOut}
			>
				<div className='flex items-center gap-2'>
					Mint Bootcamp NFT{' '}
					<span className='border-2 p-[3px] px-2 flex items-center gap-1 border-amber-700 rounded-md justify-center bg-amber-700'>
						0.1 SUI
					</span>
				</div>
			</Button>
			{!account && <p className='text-sm text-muted-foreground'>Connect your wallet to mint</p>}
			{soldOut && <p className='text-sm text-destructive font-semibold'>Sold Out!</p>}
		</div>
	)
}
