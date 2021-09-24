import { useCallback, useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { Loader } from "../components/Loader"
import { Navbar } from "../components/Navbar"
import { useAlert } from "../hooks/alert.hook"
import { useHttp } from "../hooks/http.hook"

export const CategoriesPage = () => {
    const [categories, setCategories] = useState([])
    const { request, loading, error, clearError } = useHttp()
    const { errorAlert, successAlert } = useAlert()
    const links = [
        {to: '/admin/categories/add', title: 'Добавить'}
    ]

    const getCategories = useCallback(async () => {
        try {
            const result = await request('/api/categories/get-all')
            setCategories(result)
            console.log(result);
        }
        catch {}
    }, [request])
    
    const rmCategoryHandler = async event => {
        const id = event.target.getAttribute('data-category-id')
        try {
            const { message } = await request('/api/categories/remove-category', 'POST', { id })
            successAlert(message)
            getCategories()
        }
        catch {}
    }
    
    useEffect(getCategories, [getCategories])

    useEffect(() => {
        if ( error ) {
            errorAlert(error)
            clearError()
        }
    }, [error, clearError, errorAlert])

    return (
        <div className="container-fluid">
            { loading && <Loader /> }
            <Navbar links={links} />
            <div className="container">
                { categories.length === 0 && <p className="text-center fs-3 m-5">Категории не найдены</p> }
                <table className="table">
                    <thead>
                        <tr>
                            <th className="text-center">#</th>
                            <th>Название</th>
                            <th className="text-center">Количество критериев</th>
                            <th className="text-center">Изменить</th>
                            <th className="text-center">Удалить</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        categories.map(({_id, name, tasks}, index) => (
                            <tr key={_id}>
                                <td className="text-center">{index + 1}</td>
                                <td>{name}</td>
                                <td className="text-center">{tasks.length}</td>
                                <td className="text-center">
                                    <NavLink to={`/admin/categories/add/${_id}`} className="btn btn-sm btn-primary">Изменить</NavLink>
                                </td>
                                <td className="text-center">
                                    <button className="btn btn-sm btn-danger" data-category-id={_id}
                                        onClick={rmCategoryHandler}
                                    >
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                    </table>
            </div>
        </div>
    )
}