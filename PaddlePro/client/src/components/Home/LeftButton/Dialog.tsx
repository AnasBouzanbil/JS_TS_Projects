import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { MenuItem } from '@mui/material';
import { Person, PersonRemove } from '@mui/icons-material';

export default function AlertDialog({name, onClick, action, isOwner} : {name : string, onClick: () => void, action : string, isOwner?:boolean}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      {
        action === "remove" ?
        <Button onClick={
          ()=>{
            handleClickOpen();
          }
        
        } sx={
          {
            margin: "auto",
            top: "50%",
            transform: "translateY(-50%)",
            padding: "1rem",
            color: "white",
            "&:hover": {
                border: "1px solid rgba(255,255,255,0.5)",
            }
          }
        }>

          <PersonRemove />
        </Button>
        :


        <MenuItem onClick={()=>{
          handleClickOpen();
        }} sx={
          {

          }
        }>

          {
            action[0].toUpperCase() + action.slice(1)
          } {
            action === "remove" ? "" :
              action === "leave" || action === "delete" ? "channel" : "friend"
            
          }
        
        </MenuItem>
      }
      <Dialog 
        open={open}
        onClose={handleClose}
      >
          <DialogTitle id="alert-dialog-title"
            sx={{backgroundColor: "black", color: 'white'}}>
              Are you absolutely sure?
          </DialogTitle>
          <DialogContent
          sx={{backgroundColor: "black"}} >
            <DialogContentText
            sx={{backgroundColor: "black", color: "#939393"}}
            id="alert-dialog-description" >
              {
                action === "delete" ?
                `You are about to delete ${name}. This action is irreversible.`
                :
                action === "leave" ?
                `You are about to leave ${name} channel.${
                  isOwner ? "You are the owner of this channel. If you leave, the channel will be deleted." : ""
                }`
                :
                action === "block" ?
                `You are about to block ${name}, so you won't be able to see his/her messages.`
                :
                action === "unblock" ?
                `You are about to unblock ${name}.`
                :
                action === "remove" ?
                `You are about to remove ${name} from your friends list.`
                :
                ""
              }
              </DialogContentText>
          </DialogContent>
          <DialogActions 
          sx={{backgroundColor: "black", color: 'white'}}>
            <Button onClick={
                ()=>{
                  handleClose();
                }
            } variant="text" sx={{color:'white'}}>Cancel</Button>
            <Button onClick={
              ()=>{
                handleClose();
                onClick();
              }
            } color="error" variant="contained" autoFocus>{action}</Button>
          </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}