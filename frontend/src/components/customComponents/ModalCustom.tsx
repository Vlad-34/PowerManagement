import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  boxShadow: 24,
  p: 4,
  bgcolor: 'text.primary',
  color: 'error.main'
};

interface Props {
    open: boolean;
    setOpen : React.Dispatch<React.SetStateAction<boolean>>,
    errorMessage: string
}

const ModalCustom = ({open, setOpen, errorMessage}: Props) => {
  
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal className='modal-class'
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            Error
          </Typography>
          <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
            {errorMessage}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default ModalCustom;
