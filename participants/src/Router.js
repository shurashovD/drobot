import { useSelector } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'

export const Routes = () => {
    const id = useSelector(state => state.authState).id

    if ( id ) {
        return (
            <Switch>
                <Route path="/participants/profile">
                    <ProfilePage />
                </Route>
                <Redirect to="/participants/profile" />
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path="/participants/login">
                <LoginPage />
            </Route>
            <Redirect to="/participants/login" />
        </Switch>
    )
}