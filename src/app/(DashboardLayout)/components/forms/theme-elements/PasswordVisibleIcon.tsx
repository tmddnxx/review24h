import React, { useState } from 'react';
import { TextField, IconButton, InputAdornment, Typography } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const PasswordVisibleIcon = ({ showPassword, onToggle}) => {

  return (
  
    <InputAdornment position="end">
      <IconButton onClick={onToggle} edge="end">
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  
  );
};

export default PasswordVisibleIcon;
