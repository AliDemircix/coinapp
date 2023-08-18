import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import MenuIcon from "@mui/icons-material/Menu";
import HandshakeIcon from "@mui/icons-material/Handshake";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { PersonPinCircleOutlined } from "@mui/icons-material";
import { BottomNavigationAction, Paper, Stack, Tooltip } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { BottomNavigation } from "@mui/material";
import * as Paths from "../Paths";
import Cookies from "js-cookie";

const drawerWidth = 240;

interface Props {
  window?: () => Window;
}

export default function AdminPage(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <List sx={{ a: { textDecoration: "none", color: "black" } }}>
        <Link to={Paths.coins.path}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <PersonPinCircleOutlined />
              </ListItemIcon>
              <ListItemText primary="Coins" />
            </ListItemButton>
          </ListItem>
        </Link>

        <Link to={Paths.scenarios.path}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <EventAvailableIcon />
              </ListItemIcon>
              <ListItemText primary="Scenarios" />
            </ListItemButton>
          </ListItem>
        </Link>

        <Link to="/admin/users">
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <HandshakeIcon />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItemButton>
          </ListItem>
        </Link>

        <Link to="/admin/dashboard">
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <AccountTreeIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
        </Link>
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "100%" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          p={1}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            My Coin Tracker
          </Typography>
          <Tooltip title="Logout">
            <IconButton
              size="small"
              onClick={() => {
                // Clear the token from cookies
                Cookies.remove("token");
                // Clear the token from sessionStorage
                sessionStorage.removeItem("token");
                navigate(Paths.login.path)
              }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: "auto",
        }}
      >
        <Toolbar />
        <Box sx={{ width: "95%", m: "auto" }}>
          <Outlet />
        </Box>
      </Box>
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          component="div"
          showLabels
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <BottomNavigationAction
            sx={{ width: "100%", cursor: "default" }}
            label="Powered by Ali Demirci"
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
