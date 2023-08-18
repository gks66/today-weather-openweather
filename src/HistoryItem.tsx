
import { Box, ListItem, IconButton, ListItemText } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

export interface IHistory {
    city: string
    country: string
    state: string
    main: string
    description: string
    temp_min: number
    temp_max: number
    humidity: number
    dateTime: string
    time: string
    icon: string
}

interface IHistoryItem {
    data: IHistory
    index: number
    handleDisplay: (d: IHistory) => void
    handleDelete: (idx: number) => void
}

const HistoryItem = (props: IHistoryItem) => {
    const {country, state, time} = props.data
    
    return <ListItem
        sx={{borderBottom: '1px solid rgba(0,0,0,0.2)'}}
        secondaryAction={
            <Box sx={{
                display: 'flex', 
                '& .MuiIconButton-root': {
                    background: 'rgba(0,0,0,0.1)',
                    width: '30px', height: '30px', marginLeft: '8px', marginRight: '8px'
                }, 
                '& .datetime': {
                    marginTop: '4px',
                    marginRight: '16px'
                }
            }}>
                <span className="datetime">{time}</span>
                <IconButton edge="end" aria-label="display" onClick={() => props.handleDisplay(props.data)}> 
                    <SearchIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => props.handleDelete(props.index - 1)}>
                    <DeleteIcon />
                </IconButton>
            </Box>
        }
    >
        <ListItemText
            primary={`${props.index}. ${state}, ${country}`}
        />
    </ListItem>    
}

export default HistoryItem