import { Routes, Route, Navigate } from 'react-router-dom'
import { Header } from './components/Header'
import { NftLeaderboard } from './pages/NftLeaderboard'
import { CoinLeaderboard } from './pages/CoinLeaderboard'
import { NftMint } from './pages/NftMint'
import './App.css'

function App() {
	return (
		<div className='min-h-screen'>
			<Header />
			<main>
				<Routes>
					<Route path='/' element={<Navigate to='/nft-leaderboard' replace />} />
					<Route path='/nft-leaderboard' element={<NftLeaderboard />} />
					<Route path='/coin-leaderboard' element={<CoinLeaderboard />} />
					<Route path='/nft-mint' element={<NftMint />} />
				</Routes>
			</main>
		</div>
	)
}

export default App
