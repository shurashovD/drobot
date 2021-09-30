import React from "react"
import { useSelector } from "react-redux"
import { Switch, Route, Redirect } from "react-router-dom"
import { AddCategoryPage } from "./pages/AddCategoryPage"
import { AddCompetitionPage } from "./pages/AddCompetitionPage"
import { AddMasterPage } from "./pages/AddMasterPagee"
import { AddUserPage } from "./pages/AddUserPage"
import { AuthPage } from "./pages/AuthPage"
import { CategoriesPage } from "./pages/CategoriesPage"
import { CompetitionsPage } from "./pages/CompetitionsPage"
import { MainPage } from "./pages/MainPage"
import { MastersPage } from "./pages/MastersPage"
import { UsersPage } from "./pages/UsersPage"

export const Routes = () => {
    const { id } = useSelector(state => state.authState)

    if ( id ) {
        return (
            <Switch>
                <Route path="/admin/main">
                    <MainPage />
                </Route>
                <Route path="/admin/competitions" exact>
                    <CompetitionsPage />
                </Route>
                <Route path="/admin/competitions/add" exact>
                    <AddCompetitionPage />
                </Route>
                <Route path="/admin/competitions/add/:id">
                    <AddCompetitionPage />
                </Route>
                <Route path="/admin/users" exact>
                    <UsersPage />
                </Route>
                <Route path="/admin/users/add" exact>
                    <AddUserPage />
                </Route>
                <Route path="/admin/users/add/:id">
                    <AddUserPage />
                </Route>
                <Route path="/admin/masters" exact>
                    <MastersPage />
                </Route>
                <Route path="/admin/masters/add" exact>
                    <AddMasterPage />
                </Route>
                <Route path="/admin/masters/add/:id">
                    <AddMasterPage />
                </Route>
                <Route path="/admin/categories" exact>
                    <CategoriesPage />
                </Route>
                <Route path="/admin/categories/add/:id">
                    <AddCategoryPage />
                </Route>
                <Route path="/admin/categories/add">
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