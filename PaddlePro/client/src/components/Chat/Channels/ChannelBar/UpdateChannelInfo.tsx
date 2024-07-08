import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Input, MenuItem, Stack, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import styled from '@emotion/styled';
import './CreateGroup.css';
import { UserContext } from '../../../Context/main';
import { ChannelInterface } from '../../../Context/user';
import UpdateChannel from './UpdateChannel';
import { toast } from 'react-toastify';
import CustomInput from './CustomInput';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const UpdateChannelInfo = ({ channel, onClickFun }: { channel: ChannelInterface, onClickFun: any }) => {


  const [type, setType] = React.useState(channel.type);
  const [password, setPassword] = React.useState(''); // what is the diff between this useState('') and useState('' as string) ?
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [error, setError] = React.useState<boolean>(false);
  /*
    
  */
  const [groupName, setGroupName] = React.useState(channel.name);
  const [groupDescription, setGroupDescription] = React.useState(channel.desc);
  const [open, setOpen] = React.useState(false);
  const AuthUser = React.useContext(UserContext);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateGroup = async () => {

    try {
      const response = await fetch(`http://127.0.0.1:4000/groups/${channel.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AuthUser.access_token}`
        },
        body: JSON.stringify({
          name: groupName,
          type: type,
          passcode: password,
          desc: groupDescription
        })
      });
      //console.log(response);
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Error creating group');
      }
      //console.log('-------------------------');

    }
    catch (e: any) {
      //console.log('Error creating group', e);
    }
    if (inputRef.current?.files !== null && inputRef.current?.files !== undefined && inputRef.current?.files.length !== 0) {
      try {
        const formData = new FormData();
        const file = inputRef.current.files[0];
        formData.append('file', file);
        const response = await fetch(`http://127.0.0.1:4000/groups/${channel.id}/update_image`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${AuthUser.access_token}`
          },
          body: formData
        });
        //console.log(response);
        const data = await response.json();
        if (!response.ok) {
          throw new Error('Error creating group');
        }
        //console.log('-------------------------');
        channel.image = data.image;
        toast.success('Group image updated');
      }
      catch (e: any) {
        //console.log('Error creating group', e);
      }
    }


  }


  return (
    <>
      <Typography onClick={handleClickOpen} sx={
        {
          cursor: 'pointer',
          color: 'white',
          fontSize: '1rem',
          padding: '10px 20px 10px 20px',
        }
      }>
        Edit Channel
      </Typography>
      <Dialog
        open={open}
        onClose={() => {
          handleClose()
          onClickFun()
        }}
        aria-labelledby="Create a group dialog"
        sx={
          {
            '& .MuiDialog-paper': {
              width: '80%',
              maxWidth: 500,
              borderRadius: 2,
            },
          }
        }
      >
        <DialogTitle sx={
          {
            textAlign: 'center',
          }
        } id="Create a group">
          {"Update Channel Info"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Box sx={
              {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',

              }
            }>
              <label style={
                {
                  fontSize: '1.5rem'
                }

              }>
                Group image
              </label>
              <UpdateChannel inputRef={inputRef} channel={channel} />
            </Box>
            <Box>
              <label>
                Group name:
              </label>
              <CustomInput
                setValue={setGroupName}
                value={groupName}
                placeholder='Enter group name'
                error={error}
                setError={setError} />
            </Box>
            <Box sx={

              {
                padding: '16px 0',
                paddingBottom: '0px'
              }

            }>
              <label>
                Group description:
              </label>
              <Input
                value={groupDescription}
                fullWidth type="text"
                placeholder="Enter group description"
                onChange={(e) => {
                  setGroupDescription(e.target.value)
                }
                }
              />
            </Box>
            <br />
            <label>
              Choose group type:
            </label>
            <Stack id="Chat-Create-Group-radio" sx={
              {
                flexDirection: 'row',
                // justifyContent: '',
                width: '100%',
                gap: 8,
                padding: '16px 0'
              }
            }>
              <input onClick={
                (e: any) => {
                  //console.log(e.target.value)
                  setType(e.target.value)
                }

              } type="radio" checked={
                type === 'Public'
              } id="public" name="groupType" value="Public" />
              <label htmlFor="public"><span></span>Public</label>
              <input onClick={
                (e: any) => {
                  //console.log(e.target.value)
                  setType(e.target.value)
                }
              } checked={
                type === 'Private'
              } type="radio" id="private" name="groupType" value="Private" />
              <label htmlFor="private"><span></span>Private</label>
              <input onClick={
                (e: any) => {
                  //console.log(e.target.value)
                  setType(e.target.value)
                }

              } checked={
                type === 'Protected'
              } type="radio" id="protected" name="groupType" value="Protected" />
              <label htmlFor="protected"><span></span>Protected</label>
            </Stack>
            <Stack alignItems={'cneter'} justifyContent={'center'} width={"60%"}>
              <Input fullWidth sx={{
                display: type === 'Protected' ? '' : 'none'
              }} type="password" placeholder="Enter group password" onChange={(e) => { setPassword(e.target.value) }} />
            </Stack>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus variant='outlined' color='info'
            onClick={() => {
              handleClose()
              onClickFun()
            }}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleClose()
              onClickFun()
              handleCreateGroup()
            }} autoFocus
            variant='contained' color='primary'
            disabled={groupName === '' || (type === 'Protected' && password === '') || error}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

    </>
  )
}

export default UpdateChannelInfo