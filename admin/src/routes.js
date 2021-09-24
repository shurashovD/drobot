import React from "react"
import { useSelector } from "react-redux"
import { Switch, Route, Redirect } from "react-router-dom"
import { AddCategoryPage } from "./pages/AddCategoryPage"
import { AddCompetitionPage } from "./pages/AddCompetitionPage"
import { AuthPage } from "./pages/AuthPage"
import { CategoriesPage } from "./pages/CategoriesPage"
import { CompetitionsPage } from "./pages/CompetitionsPage"
import { MainPage } from "./pages/MainPage"
import { UsersPage } from "./pages/UsersPage"

export const Routes = () => {
    const { id } = useSelector(state => state.authState)

    if ( id ) {
        return (
            <Switch>
                <Route path="/admin/main">
                    <MainPage />
                </Route>
                <Route path="/admin/competitions">
                    <CompetitionsPage />
                </Route>
                <Route path="/admin/competitions/add">
                    <AddCompetitionPage />
                </Route>
                <Route path="/admin/users">
                    <UsersPage />
                </Route>
                <Route path="/admin/categories" exact>
                    <CategoriesPage />
                </Route>
                <Route path="/admin/categories/add/:id">
                    <AddCategoryPage />
                </Route>
                <Redirect to="/admin/main" />
            </Switch>
        )
    }
    return (
        <Switch>
            <Route path="/admin/login">
                <AuthPage />
            </Route>
            <Redirect to="/admin/login" />
        </Switch>
    )
}