import React, { useState } from 'react'
import { Box, Grid, Button, Alert, Table, TableRow, TableCell, TableBody, List } from '@mui/material'
import './App.css'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import TextInput from './MyTextInput'
import HistoryItem, { IHistory } from './HistoryItem'

const apiKey = '2b53f08ac62909c725a7b2fa6f0b0ce7'

function App() {

    // history store in current session only, alternative can use localStorage to store
    const [history, setHistory] = useState<IHistory[]>([])
    const [city, setCity] = useState('')
    const [country, setCountry] = useState('')
    const [searchResult, setSearchResult] = useState<IHistory | undefined>()
    const [searchError, setSearchError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSearch = () => {
        setLoading(true)
        setSearchResult(undefined)
        setSearchError('')

        // first use this api to get city/country detail, e.g. lat/lon
        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},,${country}&appid=${apiKey}`)
        .then(res => res.json())
        .then(
            (result) => {
                if (result && result.length) {
                    const loc = result[0] 

                    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${loc.lat}&lon=${loc.lon}&appid=${apiKey}`)
                    .then(res => res.json())
                    .then(
                        (result2) => {
                            // can use dns-date to format date/time but no need for this small project
                            const d = new Date()
                            const day = `${d.getDay() < 10 ? '0' + d.getDay() : d.getDay()}`
                            const month = `${d.getMonth() < 10 ? '0' + d.getMonth() : d.getMonth()}`
                            const h = d.getHours() > 12 ? d.getHours() - 12 : d.getHours()
                            const hour = `${h < 10 ? '0' + h : h}`
                            const mins = `${d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()}`
                            const sec = `${d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()}`

                            const weather = result2.weather && result2.weather.length ? result2.weather[0] : undefined
                            const main = result2.main
                            const data = {
                                city: loc.name || '',
                                country: loc.country || '',
                                state: (loc.state || '') || (loc.name || ''), 
                                main: (weather && weather.main) || '',
                                description: (weather && weather.description) || '',
                                temp_min: (main && main.temp_min) || 0,
                                temp_max: (main && main.temp_max) || 0,
                                humidity: (main && main.humidity) || 0,
                                dateTime: `${d.getFullYear()}-${month}-${day} ${hour}:${mins} ${d.getHours() > 12 ? 'PM' : 'AM'}`,
                                time: `${hour}:${mins}:${sec} ${d.getHours() > 12 ? 'PM' : 'AM'}`,
                                icon: (weather && weather.icon) || '',
                            }

                            console.log('[app] search result2: ', result2)
                            setSearchResult(data)
                            setHistory(oldArray => [data, ...oldArray])
                            setLoading(false)
                            
                        },
                        (error2) => {
                            console.log('[app] search error2: ', error2)
                            setSearchError('No weather found.')
                            setLoading(false)
                        }
                    )
                }
                else {
                    setSearchError('No city found.')
                    setLoading(false)
                }

            },
            (error) => {
                console.log('[app] search error: ', error)
                setSearchError('No weather found.')
                setLoading(false)
            }
        )
    }

    const handleClear = () => {
        setCity('')
        setCountry('')
        setSearchResult(undefined)
        setSearchError('')
    }

    const displayWeather = (w: IHistory) => {
        setSearchError('')
        setSearchResult(w)
    }

    const deleteWeather = (idx: number) => {
        setHistory(history.filter((un,index: number) => index !== idx))
    }

    return (
        <>
            {
                // loading
                loading &&
                <Box sx={{zIndex: 99, position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)'}}>
                    <div id="loading-small">
                        <AutorenewIcon  className="loading-small"/>
                    </div>
                </Box>
            }

            <Box sx={{
                padding: '24px',
                maxWidth: '1280px',
                margin: '0 auto'
            }}>
                <h2>Today's Weather</h2>
                
                <hr />


                <Box component="form" noValidate autoComplete="off" sx={{marginTop: '24px'}}>
                    <Grid container direction="row" spacing={4}>
                        <Grid container direction="row" spacing={4} item xs={12} md={8}>
                            <Grid item xs={12} md={6}>
                                <TextInput 
                                    name="city" 
                                    label="City" 
                                    placeholder="Enter city name"
                                    value={city} 
                                    onChange={(event:React.ChangeEvent<HTMLInputElement>) => setCity(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextInput 
                                    name="country" 
                                    label="Country" 
                                    placeholder="Enter country code"
                                    value={country} 
                                    onChange={(event:React.ChangeEvent<HTMLInputElement>) => setCountry(event.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ '& .MuiButton-root': {marginTop: '8px', marginRight: '12px'}}}>
                            <Button variant="contained" onClick={handleSearch} disabled={!city}>Search</Button>
                            <Button variant="outlined" onClick={handleClear}>Clear</Button>
                        </Grid>
                    </Grid>
                </Box>

                {
                    searchError ?
                    <Alert 
                        severity="error" 
                        sx={{marginTop: '24px'}}
                        onClose={() => setSearchError('')}
                    >
                        {searchError}
                    </Alert>
                    : null
                }

                {
                    searchResult ?
                    <Box 
                        sx={{
                            maxWidth: '360px', 
                            padding: '32px',
                            paddingBottom: '8px',
                            '& .MuiTableCell-body': {
                                borderBottom: 'none', 
                                padding: 0,
                                '&.text-grey': {
                                    color: 'rgba(0, 0, 0, 0.7)'
                                },
                                '&.text-black': {
                                    color: 'black'
                                }
                            },
                        }}
                    >
                        <p style={{marginBottom: 0}}>{searchResult.state}, {searchResult.country}</p>
                        <Grid container direction="row">
                            <Grid item>
                                <img src={`http://openweathermap.org/img/wn/${searchResult.icon}@2x.png`} alt={searchResult.main} width="50" height="50" loading="lazy"/>
                            </Grid>
                            <Grid item>
                                <h1 style={{marginTop: '4px', fontWeight: 'bolder'}}>{searchResult.main}</h1>
                            </Grid>
                        </Grid>
                        <Table >
                            <TableBody>
                                <TableRow>
                                    <TableCell className="text-grey">Description:</TableCell>
                                    <TableCell className="text-black">{searchResult.description}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="text-grey">Temperature:</TableCell>
                                    <TableCell className="text-black">{searchResult.temp_min}°C ~ {searchResult.temp_max}°C</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="text-grey">Humidity:</TableCell>
                                    <TableCell className="text-black">{searchResult.humidity}%</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="text-grey">Time:</TableCell>
                                    <TableCell className="text-black">{searchResult.dateTime}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Box>
                    : null
                }
            
                <Box>
                    <br/>
                    <h2>Search History</h2>
                    
                    <hr />
                    {
                        history && history.length ?  
                            <List>                            
                                {
                                    history.map((m: IHistory, mi: number) => {
                                        return <HistoryItem key={`history-${mi}`} data={m} index={mi+1} handleDisplay={displayWeather} handleDelete={deleteWeather}/>
                                    })
                                }
                            </List>
                        : <p style={{textAlign: 'center'}}>No Record</p>
                    }
    
                </Box>
            </Box>
        </>
    )
}

export default App
