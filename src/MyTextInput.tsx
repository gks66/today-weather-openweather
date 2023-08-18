import FormControl from '@mui/material/FormControl'
import { TextField, TextFieldProps } from '@mui/material'

const validCharacters = new RegExp('^[a-zA-Z\\s]*$')

const TextInput = (props: TextFieldProps) => {
    const { value } = props
    const error = value && !validCharacters.test(`${value}`) ? true : false

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        if (props.onChange)
            props.onChange(evt)
    }

    return <FormControl sx={{width: '100%'}} >
        <TextField 
            {...props}
            id={`outlined-${props.name}`}
            name={props.name}
            label={props.label}
            variant="outlined" 
            value={value} 
            onChange={(event:React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
            error={error}
            helperText={error ? 'Please enter characters only' : ''}
        />
    </FormControl>
}

export default TextInput