import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Drawer,
  IconButton,
  Typography,
  Collapse,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDialog } from '../utils/DialogProvider';
import { styled } from "@mui/material/styles";
import { useAuth } from "../contexts/AuthContext";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const MENU_ITEMS = [
  {
    title: "Home",
    pathname: "/",
  },
  {
    title: "About Us",
    subMenus: [
      {
        title: "Who We Are",
        pathname: "/about",
      },
      {
        title: "Contact Us",
        pathname: "/contact-us",
      },
    ],
  },
  {
    title: "Resources",
    subMenus: [
      {
        title: "Resource Library",
        pathname: "/resources",
      },
      {
        title: "FAQs",
        pathname: "/faq",
      },
      /*{
        title: "Newsletter",
        pathname: "/newsletter",
      },*/
      {
        title: "Network Map",
        pathname: "/map",
      },
    ],
  },
  {
    title: "Connect",
    subMenus: [
      {
        title: "Community Forum",
        pathname: "/forum",
        protected: true,
      },
      /*{
        title: "Events Calendar",
        pathname: "/calendar",
        protected: true,
      },*/
      {
        title: "Contact List",
        pathname: "/contact-list",
        protected: true,
      },
    ],
  },
];

const Sidebar = ({ isOpen, setOpen, sidebarWidth }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();
  const { requestDialog } = useDialog();
  const { isAuthenticated, user } = useAuth();

  const handleSidebarClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleItemClick = (subMenuItem) => {
    setOpen(false);

    if (subMenuItem.protected) {
      if (!isAuthenticated) {
        requestDialog(
          'Account Required',
          'You must be logged in to access this page.',
          "Sign up",
          () => { navigate('/sign-up'); },
          "Log in",
          () => { navigate('/login'); }
        );
        return;
      } else if (user.memberstatus !== "verified") {
        requestDialog(
          'Membership Required',
          'You must be a verified member to access this page.',
          "Become a Member",
          () => { navigate('/become-a-member'); },
          "Another Time",
          () => { }
        );
        return;
      }
    }

    navigate(subMenuItem.pathname);
  };

  return (
    <Drawer
      variant="temporary"
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: sidebarWidth,
          boxSizing: 'border-box',
          boxShadow: '0px 10px 5px gray',
        },
      }}
      open={isOpen}
      onClose={() => setOpen(false)}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List disablePadding>
          <DrawerHeader>
            <IconButton onClick={() => setOpen(false)}>
              <ArrowBackIosNewIcon />
            </IconButton>
          </DrawerHeader>
          {MENU_ITEMS.map((menuItem, index) => (
            <div key={menuItem.title}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleSidebarClick(index)}
                  component={menuItem.pathname ? 'div' : 'div'} // Use 'div' to prevent default link behavior.
                >
                  <ListItemText
                    primary={
                      <Typography style={{ fontWeight: '600' }}>
                        {menuItem.title}
                      </Typography>
                    }
                    sx={{ color: 'rgba(102, 140, 60, 1)' }}
                  />
                  {menuItem.subMenus && (
                    openIndex === index ? (
                      <ExpandMoreIcon sx={{ color: 'rgba(102, 140, 60, 1)' }} />
                    ) : (
                      <ChevronRightIcon sx={{ color: 'rgba(102, 140, 60, 1)' }} />
                    )
                  )}
                </ListItemButton>
              </ListItem>
              <Collapse in={openIndex === index} timeout="auto" unmountOnExit>
                <List disablePadding>
                  {menuItem.subMenus?.map((subMenuItem) => (
                    <ListItemButton
                      key={subMenuItem.title}
                      sx={{ pl: 4 }}
                      onClick={() => handleItemClick(subMenuItem)}
                      component='div' // Use 'div' to override default Link behavior.
                    >
                      <ListItemText primary={subMenuItem.title} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </div>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;