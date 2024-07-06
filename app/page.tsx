"use client";

import { useState, useEffect } from "react";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// import { generateClient } from "aws-amplify/data";
// import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

import { list, uploadData } from 'aws-amplify/storage';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import FolderIcon from '@mui/icons-material/Folder';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import ListItemButton from '@mui/material/ListItemButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';


Amplify.configure(outputs);

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const drawerWidth = 240;

export default function App() {

  const [files, setFiles] = useState<Array<any>>([]);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const result = await list({
          path: '2',
        });
        const items = result.items.filter(n => n.size !== undefined && n.size > 0)
        items.sort((a,b)=>{
          if ( a.path > b.path ) {
            return 1;
          }else{
            return -1;
          }
        });
        const viewItems:Array<{foldername:string; filename?:string; type:string}> = [];
        let currentFoldername:string = "";
        items.forEach((item) =>{
          const tmpFoldername = item.path.substring(0, item.path.indexOf('/'));
          if ( currentFoldername !== tmpFoldername ) {
            currentFoldername = tmpFoldername;
            viewItems.push({
              foldername: tmpFoldername,
              type: "folder",
            })
          }
          const tmpFilename = item.path.substring(item.path.indexOf('/')+1);
          viewItems.push({
            foldername: currentFoldername,
            filename: tmpFilename,
            type: "file",
          })
        })
        setFiles(viewItems);
      } catch (err:any) {
        console.error(err);
        setError(err.message);
      }
    };
    fetchFiles();
  }, []);

  function addContents(formJson:any) {
    try {
      console.log("addContents")
      // console.log(formJson);
      // console.log(uploadFiles);
      uploadFiles.forEach((file) => {
        uploadData({
            data:file,
            path: formJson.foldername+"/"+file.name
        });
      })
    } catch (e) {
      console.log("error", e);
    }
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [openList, setOpenList] = useState<Array<String>>([]);

  const listHandleClick = (foldername:String) => {
    let tmpArray:Array<String> = openList
    if (openList.includes(foldername)) {
      tmpArray = tmpArray.filter(n => n !== foldername)
    } else {
      tmpArray = [...tmpArray,foldername]
    }
    setOpenList(tmpArray);
  };

  const [inputFromOpen, setinputFromOpen] = useState(false);
  const handleInputFormClickOpen = () => {
    setinputFromOpen(true);
  };
  const handleInputFormClose = () => {
    setinputFromOpen(false);
  };
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
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const changeUploadFile = (event:any) => {
    let tmpUploadFiles:File[]= [];
    const targetFiles = Array.from(event.target.files);
    targetFiles.map((file:any) => {
      tmpUploadFiles = [...tmpUploadFiles, file];
    })
    setUploadFiles(tmpUploadFiles);
  }
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                CMS
              </Typography>
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                >
                  <Avatar sx={{ width: 32, height: 32 }} />
                </IconButton>
              </Tooltip>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem>{user?.username}</MenuItem>
                <MenuItem onClick={signOut}>Sign out</MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
          >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
              <List>
                {['Dashboard', 'XXContents'].map((text, index) => (
                  <ListItem key={text} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                       <FolderIcon />
                      </ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <Grid container>
              <Typography variant="h6" component="div">
                S3 Contents list
              </Typography>
            </Grid>
            <Grid>
              <Button variant="contained" onClick={handleInputFormClickOpen}>
                new
              </Button>
              <Dialog
                open={inputFromOpen}
                onClose={handleInputFormClose}
                PaperProps={{
                  component: 'form',
                  onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const formJson = Object.fromEntries((formData as any).entries());
                    addContents(formJson);
                    handleInputFormClose();
                  },
                }}
              >
                <DialogTitle>登録</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    XXやXXを登録
                  </DialogContentText>
                  <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="foldername"
                    name="foldername"
                    label="folder name"
                    type="text"
                    fullWidth
                    variant="standard"
                  />
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload file
                    <VisuallyHiddenInput name="files" type="file" multiple onChange={changeUploadFile}/>
                  </Button>
                  {uploadFiles.map((uploadFile:any, index:number) => (
                    <p key={index}>{uploadFile.name}</p>
                  ))}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleInputFormClose}>キャンセル</Button>
                  <Button type="submit">追加</Button>
                </DialogActions>
              </Dialog>
            </Grid>
            <Grid>
              <Demo>
                <Paper elevation={3}>
                  <List>
                    {files.map((file:any, index:number) => (
                    <ListItem key={index}>
                      {file.type == "folder"
                        ?
                          <ListItemButton onClick={()=>listHandleClick(file.foldername)}>
                            <ListItemAvatar>
                              <Avatar>
                                <FolderIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={file.foldername}
                            />
                            {openList.includes(file.foldername) ? <ExpandLess /> : <ExpandMore />}
                          </ListItemButton>
                        :
                          <Collapse in={openList.includes(file.foldername)} timeout="auto" unmountOnExit sx={{ flexGrow: 1 }}>
                            <ListItemButton>
                              <ListItemAvatar>
                                <Avatar>
                                  <ImageIcon />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={file.filename}
                              />
                            </ListItemButton>
                          </Collapse>
                      }
                    </ListItem>
                    ))}
                  </List>
                </Paper>
              </Demo>
            </Grid>
          </Box>
        </Box>
      )}
    </Authenticator>
  );
}