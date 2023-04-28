import React, { useEffect } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import InfoDetail from './pages/infoDetail'
import 'antd/dist/antd.less'
const App: React.FC = () => {
	return (
		<Router>
			<Switch>
				<Route path="/" component={InfoDetail} />
			</Switch>
		</Router>
	)
}

export default App
