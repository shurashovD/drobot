import React, { useEffect, useState } from "react"
import { useHttp } from "../hooks/http.hook"

export const FinalScoreboardPage = () => {
    const { request, error, clearError } = useHttp()
    const [result, setResult] = useState({main: [], grandPree: []})

    useEffect(() => {
        try {
            const getter = async () => {
                const response = await request('/api/notes/get-evalution')
                setResult(response)
            }
            getter()
        }
        catch (e) {
            console.log(e)
        }
    }, [request])

    useEffect(() => {
        if ( error ) {
            console.log(error)
            clearError()
        }
    }, [error, clearError])

    return (
        <div className="container-fluid min-vh-100">
            {
                result.main.map(({category, pedestal}) => (
                    <div key={category}>
                        <h4 key={category}>{category}</h4>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>
                                        Место
                                    </th>
                                    <th>
                                        Имя
                                    </th>
                                    <th>
                                        Балл
                                    </th>
                                    <th>
                                        Фото до
                                    </th>
                                    <th>
                                        Фото после
                                    </th>
                                    <th>
                                        Всего фото
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    pedestal.map((item, index) => (
                                        <tr key={`${item.name}_${index}`}>
                                            <td>
                                                {index + 1}
                                            </td>
                                            <td>
                                                {item.name}
                                            </td>
                                            <td>
                                                {item.value}
                                            </td>
                                            <td>
                                                <img src={`https://drobot-digital.ru${item.photo[0]}`} alt={item.name} width="300" />
                                            </td>
                                            <td>
                                                <img src={`https://drobot-digital.ru${item.photo[item.photo.length - 2]}`} alt={item.name} width="300" />
                                            </td>
                                            <td>
                                                {item.photo.length}
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                ))
            }
            {
                result.grandPree.map(({grandPreeName, winnerName, winnerScore}) => (
                    <h4>{grandPreeName} {winnerName} {winnerScore}</h4>
                ))
            }
        </div>
    )
}