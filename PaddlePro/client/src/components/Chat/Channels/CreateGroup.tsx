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
import { UserContext } from '../../Context/main';
import { ChannelInterface } from '../../Context/user';
import { toast } from 'react-toastify';
import CustomInput from './ChannelBar/CustomInput';
import { CheckCircle } from '@mui/icons-material';

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

const CreateGroup = ({ onClickFun, groups, setGroups }: {
  onClickFun: any,
  groups: ChannelInterface[],
  setGroups: React.Dispatch<React.SetStateAction<ChannelInterface[]>>
}) => {


  const [type, setType] = React.useState('Public' as string);
  const [password, setPassword] = React.useState(''); // what is the diff between this useState('') and useState('' as string) ?
  /*
    
  */
  const [error, setError] = React.useState(false); 
  const [groupName, setGroupName] = React.useState('');
  const [groupDescription, setGroupDescription] = React.useState('');
  const [groupImage, setGroupImage] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const AuthUser = React.useContext(UserContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchGroups = async () => {
    try {
      const response = await fetch('http://localhost:4000/groups', {
        headers: {
          'Authorization': `Bearer ${AuthUser.access_token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Error fetching groups');
      }
      //console.log(data);
      setGroups(data);
    }
    catch (e: any) {
      toast.error('Error fetching groups');
      //console.log('Error fetching groups', e);
    }
  }

  const handleCreateGroup = async () => {

    const formData = new FormData();
    formData.append('file', groupImage);
    formData.append('name', groupName);
    formData.append('type', type);
    formData.append('passcode', password === '' ? 'none' : password);
    formData.append('desc', groupDescription);

    try {
      const response = await fetch('http://127.0.0.1:4000/groups/create', {
        method: 'POST',
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
      //console.log(data);
      toast.success('Group created successfully');
      //console.log('-------------------------');
      fetchGroups();
    }
    catch (e: any) {
      toast.error('Error creating group');
      //console.log('Error creating group', e);
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
        Create a group
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
          {"Create a new group"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Box>
              <CustomInput
                value={groupName}
                setValue={setGroupName}
                placeholder="Enter group name"
                error={error}
                setError={setError}
              />
            </Box>

            <Box sx={
              {
                padding: '16px 0',
                paddingBottom: '0px'
              }
            }>
              <Input fullWidth type="text" placeholder="Enter group description" onChange={(e) => { setGroupDescription(e.target.value) }} value={groupDescription} />
            </Box>
            <br />
            <label>
              Choose group image:
            </label>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              endIcon={groupImage ? <CheckCircle /> : <></>}
              sx={
                {
                  margin: '16px 16px'
                }
              }
            >
              Upload file
              <VisuallyHiddenInput onChange={
                (e: any) => {
                  if (e.target.files.length > 0) {
                    setGroupImage(e.target.files[0])
                  }
                }
              
              } type="file" accept='image/*' />
            </Button>
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
              } type="radio" id="private" name="groupType" value="Private" />
              <label htmlFor="private"><span></span>Private</label>
              <input onClick={
                (e: any) => {
                  //console.log(e.target.value)
                  setType(e.target.value)
                }

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
            disabled={groupName === '' || groupImage === '' || (type === 'Protected' && password === '') || error}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

    </>
  )
}

export default CreateGroup