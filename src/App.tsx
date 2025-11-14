import { Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'

import { CoinLeaderboard } from './pages/CoinLeaderboard'
import { NftMint } from './pages/NftMint'
import './App.css'

function App() {
	return (
		<div className='min-h-screen'>
			<Header />
			<main>
				<Routes>
					<Route path='/coin-leaderboard' element={<CoinLeaderboard />} />
					<Route path='/nft-mint' element={<NftMint />} />
				</Routes>
			</main>
		</div>
	)
}

export default App
