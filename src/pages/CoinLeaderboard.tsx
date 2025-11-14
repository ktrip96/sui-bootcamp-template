import { useSuiClientQuery } from '@mysten/dapp-kit'
import { useMemo, useState, useCallback, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'

// Convert MIST to SUI with maximum 3 decimal places (truncate, not round)
function mistToSui(mist: string | number): string {
	const mistAmount = typeof mist === 'string' ? BigInt(mist) : BigInt(mist)
	const suiAmount = Number(mistAmount) / 1_000_000_000

	// Truncate to 3 decimal places (not round)
	const multiplier = 1000
	const truncated = Math.floor(suiAmount * multiplier) / multiplier

	// Format to show up to 3 decimal places, removing trailing zeros
	return truncated.toFixed(3).replace(/\.?0+$/, '')
}

// Format number with commas
function formatNumberWithCommas(value: string | number): string {
	const num = typeof value === 'string' ? parseFloat(value) : value
	return num.toLocaleString('en-US', {
		minimumFractionDigits: 0,
		maximumFractionDigits: 3,
	})
}

// Get medal for rank
function medalForRank(rank: number): { icon?: string; className: string } {
	if (rank === 1) {
		return {
			icon: '🥇',
			className: 'bg-yellow-500 text-yellow-950 border-yellow-600',
		}
	}
	if (rank === 2) {
		return {
			icon: '🥈',
			className: 'bg-gray-400 text-gray-950 border-gray-500',
		}
	}
	if (rank === 3) {
		return {
			icon: '🥉',
			className: 'bg-amber-600 text-amber-50 border-amber-700',
		}
	}
	return {
		className: 'bg-muted text-muted-foreground border-border',
	}
}

// Skeleton row component
function SkeletonRow() {
	return (
		<TableRow>
			<TableCell>
				<Skeleton className='h-6 w-12' />
			</TableCell>
			<TableCell>
				<div className='flex items-center gap-3'>
					<Skeleton className='h-8 w-8 rounded-full' />
					<div className='flex flex-col gap-2'>
						<Skeleton className='h-4 w-24' />
						<Skeleton className='h-3 w-32' />
					</div>
				</div>
			</TableCell>
			<TableCell className='text-right'>
				<div className='flex flex-col items-end gap-1'>
					<Skeleton className='h-5 w-20' />
					<Skeleton className='h-1.5 w-32' />
				</div>
			</TableCell>
		</TableRow>
	)
}

// Calculate total balance from coin objects
function calculateTotalBalance(coins: Array<{ balance?: string }>): string {
	const total = coins.reduce((sum, coin) => {
		const balance = BigInt(coin.balance || '0')
		return sum + balance
	}, BigInt(0))
	return total.toString()
}

interface WalletInfo {
	name: string
	walletAddress: string
}

interface WalletData extends WalletInfo {
	coins: Array<{ balance?: string }>
	totalBalanceMist: string
	totalBalanceSui: number
	coinCount: number
}

// Component that fetches data for a single wallet
function WalletDataFetcher({
	wallet,
	onDataReady,
}: {
	wallet: WalletInfo
	onDataReady: (data: WalletData) => void
}) {
	const { data } = useSuiClientQuery(
		'getCoins',
		{
			owner: wallet.walletAddress,
		},
		{
			refetchInterval: 5000,
		}
	)

	useEffect(() => {
		if (data?.data) {
			const coins = data.data || []
			const totalBalanceMist = calculateTotalBalance(coins)
			const totalBalanceSui = parseFloat(mistToSui(totalBalanceMist))

			onDataReady({
				...wallet,
				coins,
				totalBalanceMist,
				totalBalanceSui,
				coinCount: coins.length,
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	return null
}

export function CoinLeaderboard() {
	// Filter out duplicate wallet addresses and create unique array
	const walletArray = useMemo(() => {
		const wallets = [
			// {
			// 	name: 'LION_PRADO',
			// 	walletAddress: '0x42c7235d44467c971772636f4426970ad1475de79ee3cd6ebd63c65eca5ebd48',
			// },
			{
				name: 'Douglas',
				walletAddress: '0xece3e17c33b23dc7dbe8999e154daccd2d02d5c92812e082e49ee03f3838fd9f',
			},
			{
				name: 'Nii Tettey',
				walletAddress: '0x269a4dd82b948208cd79980c1eaca1d81f7bed99254cd7c9c0c0947fdbfb968d',
			},
			{
				name: '😇',
				walletAddress: '0xff3f510cb8ace29268f1ebf4451ef2e3598790cb5e0c0c47bec4fed613d70b08',
			},
			{
				name: 'Abu78.Sui',
				walletAddress: '0x1c278c7931f3d84fb1276b66f3a18f06660d37a7535d7a79ddedcfee8e2dd24c',
			},
			{
				name: 'Famous',
				walletAddress: '0x0b511a3c031ca212d68848a28d3fee9ad8580e2c519b629b702f8c980fe03cf9',
			},
			{
				name: 'MrGem',
				walletAddress: '0x9458d950370f36ca9b5c05ffa97ce133581dbfad21c0ea1bdd6cec2a5134a485',
			},
			// {
			// 	name: 'Lapato',
			// 	walletAddress: '0x41a800227e5564b4cebd7e5d18b9c998ec145047fee5f5d1c2bf597433f30555',
			// },
			// {
			// 	name: 'Brainiac',
			// 	walletAddress: '0xd9ac614c5c0c3fe9ea619eec0ab8fb58910b2fd7a18dd84378cd84da15d1ac3b',
			// },
			// {
			// 	name: 'Abdul Hafis Mohammed',
			// 	walletAddress: '0x1c99992a569b722b592f09ba65c3fdc3f263637c20075f9132eff67e1a077b08',
			// },
			{
				name: "2'8 💰",
				walletAddress: '0x45c0257306ac1c9f42848f8fb20c710c352c365978a4558f2363b49a8a1b9c34',
			},
			// {
			// 	name: 'Son Of A Monarch🦴',
			// 	walletAddress: '0x9853838d2428fba697af7000cec295319add2bd736cc6c94f81aef2ca30866c8',
			// },
			// {
			// 	name: 'Bezboi Shykid',
			// 	walletAddress: '0xb828a2054a6cd19212f9b7dbba83acc4bc54eedc115ba114c78de54c84f76a2b',
			// },
			// {
			// 	name: 'ATS',
			// 	walletAddress: '0x35002297ced1833f4aab438fa6a9f91c1bc3730959942f75589d7868ec801a01',
			// },
			{
				name: 'Briel Addo',
				walletAddress: '0x95ddb02f77aba7a736abdb7adf8e4833a8fe67a97d7d6c1844dd89dff1bf0a97',
			},
			{
				name: 'Uju Pawtato',
				walletAddress: '0x777e69262ecfb59dd40f9af49cb758459a65d93b366069f62fb48d62de1eb7cb',
			},
			{
				name: 'Abdul Hafiz 💻💹',
				walletAddress: '0xe62ab0fa428c3ec4e6b26842967ae2f458d75935b39c893fd0e9e90f4f2c2363',
			},
			{
				name: 'Mi_yati 🐈‍⬛ 🐾',
				walletAddress: '0x7e450509b1e1fb530991efc9491559b41775300ecaabc2b695501485a03d40f2',
			},
			{
				name: 'Dc Ablorh',
				walletAddress: '0x6cfaaac110a1c99f9d9152b043d6cec8857de6af3c1f270b4a49b1b02f957327',
			},
			{
				name: 'Mickey',
				walletAddress: '0xe62ab0fa428c3ec4e6b26842967ae2f458d75935b39c893fd0e9e90f4f2c2363',
			},
			{
				name: 'sleep.deprived.one Pawtato',
				walletAddress: '0x4b4ff77211cf22019b63eda9196ef72557be1aa85fbde6dcf7b3c58051ca1c1b',
			},
			{
				name: 'holyghostkhid',
				walletAddress: '0x4b4ff77211cf22019b63eda9196ef72557be1aa85fbde6dcf7b3c58051ca1c1b',
			},
		]

		// Filter out duplicates by wallet address (keep first occurrence)
		const seen = new Set<string>()
		return wallets.filter((wallet) => {
			if (seen.has(wallet.walletAddress)) {
				return false
			}
			seen.add(wallet.walletAddress)
			return true
		})
	}, [])

	// Store wallet data as it comes in
	const [walletDataMap, setWalletDataMap] = useState<Map<string, WalletData>>(new Map())

	const handleDataReady = useCallback((data: WalletData) => {
		setWalletDataMap((prev) => {
			const next = new Map(prev)
			next.set(data.walletAddress, data)
			return next
		})
	}, [])

	// Calculate leaderboard data from collected wallet data
	const leaderboardData = useMemo(() => {
		return Array.from(walletDataMap.values()).sort((a, b) => b.totalBalanceSui - a.totalBalanceSui)
	}, [walletDataMap])

	// Check if all wallets have loaded
	const allWalletsLoaded = walletDataMap.size === walletArray.length
	const loading = !allWalletsLoaded

	// Calculate max balance for progress bars
	const maxBalance = useMemo(() => {
		if (leaderboardData.length === 0) return 0
		return Math.max(...leaderboardData.map((w) => w.totalBalanceSui))
	}, [leaderboardData])

	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-3xl font-bold mb-8 text-center'>Coin Leaderboard</h1>

			{/* Render fetchers in background */}
			{walletArray.map((wallet) => (
				<WalletDataFetcher key={wallet.walletAddress} wallet={wallet} onDataReady={handleDataReady} />
			))}

			<div className='max-w-6xl mx-auto'>
				{/* Horizontal scroll on small screens */}
				<div className='w-full overflow-x-auto'>
					<Table className='min-w-[560px]'>
						<TableHeader>
							<TableRow>
								<TableHead className='w-12'>Rank</TableHead>
								<TableHead>Profile</TableHead>
								<TableHead className='text-right whitespace-nowrap'>Balance</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{loading && (
								<>
									<SkeletonRow />
									<SkeletonRow />
									<SkeletonRow />
									<SkeletonRow />
									<SkeletonRow />
								</>
							)}

							{!loading &&
								leaderboardData.map((wallet, idx) => {
									const rank = idx + 1
									const medal = medalForRank(rank)
									const pct = maxBalance
										? Math.max(2, Math.round((wallet.totalBalanceSui / maxBalance) * 100))
										: 0
									const balanceDisplay = formatNumberWithCommas(mistToSui(wallet.totalBalanceMist))

									return (
										<TableRow
											key={`${wallet.walletAddress}-${wallet.name}-${idx}`}
											className='hover:bg-muted/50 transition-colors'
										>
											<TableCell className='align-middle'>
												<Badge className={`rounded-xl px-2 py-0.5 font-semibold ${medal.className}`}>
													{medal.icon ? <span className='mr-1 inline-flex'>{medal.icon}</span> : null}
													{rank}
												</Badge>
											</TableCell>

											<TableCell>
												<div className='flex items-center gap-3'>
													<div className='relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-border shrink-0 bg-muted flex items-center justify-center'>
														<span className='text-xs font-semibold'>
															{wallet.name.charAt(0).toUpperCase()}
														</span>
													</div>
													<div className='flex flex-col'>
														<span className='font-medium leading-none'>{wallet.name}</span>
														<span className='text-xs text-muted-foreground font-mono'>
															{wallet.walletAddress.slice(0, 8)}...
															{wallet.walletAddress.slice(-6)}
														</span>
													</div>
												</div>
											</TableCell>

											<TableCell className='text-right'>
												<div className='flex flex-col items-end gap-1'>
													<div className='flex items-center gap-1.5'>
														<img src='/sui.png' alt='SUI' className='h-4 w-4' />
														<span className='tabular-nums font-semibold whitespace-nowrap'>
															{balanceDisplay} SUI
														</span>
													</div>
													<Progress value={pct} className='w-32 h-1.5' />
												</div>
											</TableCell>
										</TableRow>
									)
								})}

							{!loading && leaderboardData.length === 0 && (
								<TableRow>
									<TableCell colSpan={3}>
										<div className='text-center py-8 text-muted-foreground'>
											No wallets found or balances are zero.
										</div>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	)
}
