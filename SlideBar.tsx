import React, { useState } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import DescriptionIcon from '@mui/icons-material/Description';
import MapIcon from '@mui/icons-material/Map';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from '@mui/icons-material/People';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Slidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const navigate=useNavigate();
 
  return (
    <motion.div
      initial={{ width: 60 }}
      animate={{ width: expanded ? 250 : 60 }}
      transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{
        height: "100vh",
        background: "linear-gradient(180deg, #2a2a5e 0%, #1e1e2f 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "20px 0",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        boxShadow: "3px 0 10px rgba(0,0,0,0.3)",
        zIndex: 100,
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: "20px",
            borderBottom: "1px solid #3a3a5a",
            marginBottom: "10px",
          }}
        >
          <AutoGraphIcon style={{ color: "white", fontSize: 30 }} />
          {expanded && (
            <span style={{ marginLeft: 10, fontSize: 20, fontWeight: "bold" }}>
              AI Smart
            </span>
          )}
        </div>
        <List
          sx={{
            "& .MuiListItemButton-root": {
              marginBottom: "6px",
            },
          }}
        >
          <ListItemButton>
            <ListItemIcon>
              <HomeIcon style={{ color: "white" }} />
            </ListItemIcon>
            {expanded && <ListItemText primary="Home" onClick={()=>(navigate('/Home'))}/>}
          </ListItemButton>

        {sessionStorage.getItem('role')==='Admin' &&(
 <ListItemButton>
            <ListItemIcon>
              <BusinessCenterIcon style={{ color: "white" }} />
            </ListItemIcon>
            {expanded && <ListItemText primary="Assets" onClick={()=>(navigate('/Assets'))}/>}
          </ListItemButton>
        )}
         
{sessionStorage.getItem('role')==='Admin' &&(
  <ListItemButton>
            <ListItemIcon>
              <DescriptionIcon style={{ color: "white" }} />
            </ListItemIcon>
            {expanded && <ListItemText primary="EnrichDescription" onClick={()=>(navigate('/EnrichDescription'))} />}
          </ListItemButton>

)}
        {sessionStorage.getItem('role')==='Admin' &&(
 <ListItemButton>
            <ListItemIcon>
              <MapIcon style={{ color: "white" }} />
            </ListItemIcon>
            {expanded && <ListItemText primary="CapacityMapping" onClick={()=>(navigate('/CapacityMapping'))} />}
          </ListItemButton>
        )}
         
{sessionStorage.getItem('role')==='Admin' &&(
  <ListItemButton>
            <ListItemIcon>
              <AssessmentIcon style={{ color: "white" }} />
            </ListItemIcon>
            {expanded && <ListItemText primary="Reports" onClick={()=>(navigate('/Reports'))} />}
          </ListItemButton>

)}

{sessionStorage.getItem('role')==='Report viewer' &&(
  <ListItemButton>
            <ListItemIcon>
              <AssessmentIcon style={{ color: "white" }} />
            </ListItemIcon>
            {expanded && <ListItemText primary="Reports" onClick={()=>(navigate('/Reports'))} />}
          </ListItemButton>

)}
       {sessionStorage.getItem('role')==='Admin' &&(
  <ListItemButton>
            <ListItemIcon>
              <PeopleIcon style={{ color: "white" }} />
            </ListItemIcon>
            {expanded && (
              <ListItemText
                primary="UserManagement"
                primaryTypographyProps={{ noWrap: true }} onClick={()=>(navigate('/UserManagement'))}
              />
            )}
          </ListItemButton>
        )}
        
        </List>
      </div>
      <List>
        <ListItemButton>
          <ListItemIcon>
            <LogoutIcon style={{ color: "white" }} />
          </ListItemIcon>
          {expanded && <ListItemText primary="Logout" onClick={()=>(navigate('/Logout'))} />}
        </ListItemButton>
      </List>
    </motion.div>
  );
};

export default Slidebar;