import React from "react"
import { Switch, Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { COMPETITION_ROLE_FINAL_SCREEN, COMPETITION_ROLE_HYHINICAL, COMPETITION_ROLE_PHOTO, COMPETITION_ROLE_PREV, COMPETITION_ROLE_REFEREE, COMPETITION_ROLE_REGISTER, COMPETITION_ROLE_SCREEN } from "./redux/refereeRoles"
import { RegisterPage } from './pages/RegisterPage'
import { PhotoPage } from './pages/PhotoPage'
import { PrevPage } from './pages/PrevPage'
import { HygienicalPage } from './pages/HygienicalPage'
import { RefereePage } from './pages/RefereePage'
import { ScoreboardPage } from './pages/ScoreboardPage'
import { FinalScoreboardPage } from './pages/FinalScoreboardPage'
import { AuthPage } from './pages/AuthPage'

export const Routes = () => {
    const { role } = useSelector(state => state.authState)

    if ( role === COMPETITION_ROLE_REGISTER ) {
        return (
            <Switch>
                <Route path="/evalution/register">
                    <RegisterPage />
                </Route>
                <Redirect to="/evalution/register" />
            </Switch>
        )
    }

    if ( role === COMPETITION_ROLE_PHOTO ) {
        return (
            <Switch>
                <Route path="/evalution/photo">
                    <PhotoPage />
                </Route>
                <Redirect to="/evalution/photo" />
            </Switch>
        )
    }

    if ( role === COMPETITION_ROLE_PREV ) {
        return (
            <Switch>
                <Route path="/evalution/prev">
                    <PrevPage />
                </Route>
                <Redirect to="/evalution/prev" />
            </Switch>
        )
    }

    if ( role === COMPETITION_ROLE_HYHINICAL ) {
        return (
            <Switch>
                <Route path="/evalution/hygienical">
                    <HygienicalPage />
                </Route>
                <Redirect to="/evalution/hygienical" />
            </Switch>
        )
    }

    if ( role === COMPETITION_ROLE_REFEREE ) {
        return (
            <Switch>
                <Route path="/evalution/referee">
                    <RefereePage />
                </Route>
                <Redirect to="/evalution/referee" />
            </Switch>
        )
    }

    if ( role === COMPETITION_ROLE_SCREEN ) {
        return (
            <Switch>
                <Route path="/evalution/screen">
                    <ScoreboardPage />
                </Route>
                <Redirect to="/evalution/screen" />
            </Switch>
        )
    }

    if ( role === COMPETITION_ROLE_FINAL_SCREEN ) {
        return (
            <Switch>
                <Route path="/evalution/final-screen">
                    <FinalScoreboardPage />
                </Route>
                <Redirect to="/evalution/final-screen" />
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path="/login">
                <AuthPage />
            </Route>
            <Redirect to="/login" />
        </Switch>
    )
}