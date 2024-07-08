import { ArrowBack } from "@mui/icons-material";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import {MessageBarChannel1} from "./MessageBar";
import React from "react";
import { UserContext } from "../../Context/main";
import { ChannelInterface } from "../../Context/user";

export default function ChannelsList(
    { selected, setSelected, showChannels, setShowChannels, selectedChannel, setSelectedChannel, groups, setGroups, conversation  } : any
) {
    return (
        <Stack sx={
            {
              position: 'absolute',
              top: '0',
              bottom: '0',
              left: showChannels ? '0' : '-100%',
              boxSizing: 'border-box',
              right: '0',
              height: '100%',
              width: '100%',
              backgroundColor: 'rgba(25, 25, 25, 1)',
              transition: 'left 0.5s',
              gap: '10px',
              padding: '10px 20px',
              zIndex: 1,
            }
          }>
              <Box id='GoBack' sx={
                {
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  paddingBottom: '10px',
                }
              }>
                <IconButton
                  onClick={() => {
                    setShowChannels(false);
                    setSelectedChannel('');
                    //console.log('switch to direct messages');
                  }}
                >
                  <ArrowBack sx={
                    {
                      color: 'white',
                    }
                  } />
                </IconButton>
                <Typography sx={
                  {
                    color: 'white',
                  }
                }>
                  Back to direct messages
                </Typography>

              </Box>
              <Box id='Channels' sx={
                {
                }
              }>
                <Typography sx={
                  {
                    color: 'white',
                    paddingLeft: '10px',
                    paddingBottom: '10px',
                  }
                }>
                  Channels
                </Typography>
                <Stack>
                  {
                    conversation.map((group: ChannelInterface) => {
                        //console.log('group:', group.name);
                          return (
                              <MessageBarChannel1
                                key={group.id}
                                group={group}
                                setSelectedChannel={setSelectedChannel}
                                selectedChannel={selectedChannel}
                              />
                          )
                        }
                    )
                  }
                </Stack>
              </Box>
          </Stack>
    );
}