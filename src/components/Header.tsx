import { Link, useLocation } from 'react-router-dom'
import { ConnectButton } from '@mysten/dapp-kit'
import viteLogo from '/vite.svg'

export function Header() {
	const location = useLocation()

	const isActive = (path: string) => location.pathname === path

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
						to='/nft-leaderboard'
						className={`text-sm font-medium transition-colors hover:text-primary ${
							isActive('/nft-leaderboard') ? 'text-primary' : 'text-foreground'
						}`}
					>
						NFT leaderboard
					</Link>
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

				{/* Connect Button on the far right */}
				<div className='flex items-center'>
					<ConnectButton />
				</div>
			</div>
		</header>
	)
}
