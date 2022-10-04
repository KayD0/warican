import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface PropsType {
  title: string;
  selectItems: string[];
  className: string;
  id: string
  onChange: (event: SelectChangeEvent<string>, child: React.ReactNode) => void

}

export default function BasicSelect({title,selectItems,className,id,onChange}: PropsType) {
  return (
    <Box >
      <FormControl sx={{ width: '100%' }}>
        <InputLabel id="demo-simple-select-label">{title}</InputLabel>
        <Select
          labelId="user-label"
          id={id}
          label="Age"
          onChange={onChange}
          className={className}
        >
          {selectItems.map((item,index) => (
            <MenuItem key={item} value={item}>{item}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}