import { Link, useLocation } from 'react-router-dom'
import { ConnectButton, useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit'
import viteLogo from '/vite.svg'

// Convert MIST to SUI with maximum 3 decimal places
function mistToSui(mist: string | number): string {
	const mistAmount = typeof mist === 'string' ? BigInt(mist) : BigInt(mist)
	const suiAmount = Number(mistAmount) / 1_000_000_000

	// Truncate to 3 decimal places (not round)
	const multiplier = 1000
	const truncated = Math.floor(suiAmount * multiplier) / multiplier

	// Format to show up to 3 decimal places, removing trailing zeros
	return truncated.toFixed(3).replace(/\.?0+$/, '')
}

export function Header() {
	const location = useLocation()
	const account = useCurrentAccount()

	// Get SUI balance for the connected account
	const { data: balanceData } = useSuiClientQuery(
		'getBalance',
		{
			owner: account?.address || '',
		},
		{
			enabled: !!account?.address,
			refetchInterval: 5000,
		}
	)

	const isActive = (path: string) => location.pathname === path

	const suiBalance = balanceData?.totalBalance ? mistToSui(balanceData.totalBalance) : '0'

	return (
		<header className='w-full border-b border-border bg-background'>
			<div className='container mx-auto flex h-16 items-center justify-between px-4'>
				{/* Logo */}
				<Link to='/' className='flex items-center gap-2'>
					<img src={viteLogo} alt='Logo' className='h-8 w-8' />
					<span className='text-xl font-bold'>Sui Friday</span>
				</Link>

				{/* Navigation Links */}
				<nav className='flex items-center gap-6'>
					<Link
						to='/coin-leaderboard'
						className={`text-sm font-medium transition-colors hover:text-primary ${
							isActive('/coin-leaderboard') ? 'text-primary' : 'text-foreground'
						}`}
					>
						Coin Leaderboard
					</Link>
					<Link
						to='/nft-mint'
						className={`text-sm font-medium transition-colors hover:text-primary ${
							isActive('/nft-mint') ? 'text-primary' : 'text-foreground'
						}`}
					>
						NFT mint
					</Link>
				</nav>

				{/* Connect Button and Balance on the far right */}
				<div className='flex items-center gap-4'>
					{account && (
						<div className='flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md border border-border'>
							<img src='/sui.png' alt='SUI' className='h-4 w-4' />
							<span className='text-sm font-semibold tabular-nums'>{suiBalance} SUI</span>
						</div>
					)}
					<ConnectButton />
				</div>
			</div>
		</header>
	)
}
