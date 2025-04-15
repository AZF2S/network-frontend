import {
  Tabs,
  Tab,
  Toolbar,
  IconButton,
  CssBaseline,
  MenuItem,
  Button,
  Popper,
  Paper,
  MenuList,
  useMediaQuery,
  Badge,
  CircularProgress
} from "@mui/material";
import PlaylistAddCheckCircleIcon from "@mui/icons-material/PlaylistAddCheckCircle";
import { useCallback, useEffect, useState } from "react";
import { Link,  useLocation, useNavigate } from "react-router-dom";
import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./sidebar";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import profile_01 from "../assets/profile/default/profile-08.jpg";
import { Person } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { accountApi, organizationApi } from "../api";
import SettingsDialog from "../components/Dialogs/SettingsDialog";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import MembershipDialog from "./Dialogs/MembershipDialog";
import Star from "@mui/icons-material/Star";
import ChatIcon from "@mui/icons-material/Chat";
import AccountBadge from "../styled/AccountBadge";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import MemberButtonBadge from "../styled/MemberButtonBadge";
import MembershipInfoDialog from "./Dialogs/MembershipInfoDialog";
import dayjs from "dayjs";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import EditOrganizationDialog from "./Dialogs/EditOrganizationDialog";
import ".././config";
import "./navbar.css";
import { useDialog } from '../utils/DialogProvider';
import config from "../config";

const routeValues = {
  "/": 0,
  "/home": 0,
  "/resources": 2,
  "/faq": 2,
  "/about": 1,
  "/contact-us": 1,
  "/forum": 3,
  //"/calendar": 3,
  "/map": 2,
  //"/newsletter": 2,
  "/who-we-are": 1,
  "/profile": 4,
  "/contact-list": 3,
  "/login": 4,
  "/sign-up": 4,
  "/privacy-policy": 5,
  "/terms-of-service": 5,
  "/accessibility": 5,
  "/thank-you": 5,
  "/membership-form": 5,
  "/admin-panel": 5,
};

const sidebarWidth = 300;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${sidebarWidth}px)`,
    marginLeft: `${sidebarWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const NavTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    minWidth: 0,
    [theme.breakpoints.up("sm")]: {
      minWidth: 0,
    },
    color: "rgba(0, 0, 0, 0.55)",
    "&:hover": {
      color: "rgba(0, 0, 0, 0.70)",
    },
    "&.Mui-selected": {
      color: "#000",
    },
    "&:focus": {
      border: "2px solid black",
      borderRadius: "7px",
    },
  })
);

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

const ACCOUNT_MENU_ITEMS = [
  { title: "Getting Started", type: "link", icon: <PlaylistAddCheckCircleIcon /> },
  { title: "Profile", type: "link" },
  { title: "Settings", type: "dialog" },
  { title: "Messages", type: "link" },
  { title: "Log out", type: "button" },
  { title: "Become a Member", type: "membership" },
];

const MEMBER_MENU_ITEMS = [
  { title: "Getting Started", type: "link", icon: <PlaylistAddCheckCircleIcon /> },
  { title: "Profile", type: "link" },
  { title: "Membership", type: "dialog" },
  { title: "Organization(s)", type: "dialog" },
  { title: "Settings", type: "dialog" },
  { title: "Messages", type: "link" },
  { title: "Log out", type: "button" },
];

const ADMIN_MENU_ITEMS = [
  { title: "Profile", type: "link" },
  { title: "Settings", type: "dialog" },
  { title: "Messages", type: "link" },
  { title: "Admin Panel", type: "link" },
  { title: "Log out", type: "button" },
  { title: "Become a Member", type: "membership" },
];

const ADMIN_MEMBER_MENU_ITEMS = [
  { title: "Profile", type: "link" },
  { title: "Membership", type: "dialog" },
  { title: "Organization(s)", type: "dialog" },
  { title: "Settings", type: "dialog" },
  { title: "Messages", type: "link" },
  { title: "Admin Panel", type: "link" },
  { title: "Log out", type: "button" },
];

const Navbar = (props) => {
  const location = useLocation();
  const [value, setValue] = useState(routeValues[location.pathname]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [subMenuItems, setSubMenuItems] = useState();
  const [userSlug, setUserSlug] = useState("");
  const [userProfilePicture, setUserProfilePicture] = useState(profile_01);
  const [activeDialog, setActiveDialog] = useState();
  const [isMemberFormDisabled, setIsMemberFormDisabled] = useState(false);
  const [pendingMembers, setPendingMembers] = useState(0);
  const [pendingOrgs, setPendingOrgs] = useState(0);
  const [notifications, setNotifications] = useState({
    Settings: 0,
    Messages: 0,
    Membership: 0,
  });
  const [remainingSteps, setRemainingSteps] = useState(8);
  const { isAuthenticated, setIsAuthenticated, user, isAdmin, setIsAdmin, setUser } = useAuth();
  const [checkedMembershipInfo, setCheckedMembershipInfo] = useState(false);
  const [recentlyVerified, setRecentlyVerified] = useState(false);
  const [userOrgs, setUserOrgs] = useState();
  const isSmallScreen = useMediaQuery("(max-width: 1000px)");
  const isPhoneScreen = useMediaQuery("(max-width: 580px)");
  const isReallyTeenyTinyScreen = useMediaQuery("(max-width: 460px)");
  const isTheWorldsSmallestScreen = useMediaQuery("(max-width: 410px)");
  const { requestDialog } = useDialog();
  const navigate = useNavigate();

  useEffect(() => {
    setValue(routeValues[location.pathname]);
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const notifications = await accountApi.getNotifications(); // TODO error handling
          if (user.recentlyverified) {
            setNotifications({
              ...notifications,
              Messages: notifications.chat_notifications_count || 0,
              Settings: 3,
              Membership: 1,
            });
            setRecentlyVerified(true);
          } else {
            setNotifications({
              ...notifications,
              Messages: notifications.chat_notifications_count || 0,
            });
          }
        } catch (error) {
          console.error("Error fetching notification count", error);
        }
      }
    };

    fetchData();
  }, [user, notifications]);

  useEffect(() => {
    if (recentlyVerified) {
      const sum = notifications.Settings + notifications.Membership;
      if (sum === 0) {
        updateRecentlyVerified(false);
        setRecentlyVerified(false);
      }
    }
  }, [recentlyVerified, notifications]);

  useEffect(() => {
    if (user) {
      const getAndSetUserProfilePicture = async () => {
        const userPicture = await getUserProfilePicture(user.userslug);
        if (userPicture) {
          setUserProfilePicture(`${config.NODEBB_URL}${userPicture}`);
        }
        setUserSlug(user.userslug);
      };
      getAndSetUserProfilePicture();
    }
  }, [user]);

  useEffect(() => {
    if (!localStorage.getItem("checkedMembershipInfo", "true")) {
      setCheckedMembershipInfo(false);
    } else {
      setCheckedMembershipInfo(true);
    }
  }, []);

  useEffect(() => {
    if (user && dayjs(user.renewdate).diff(dayjs(), "day") <= 14) {
      setNotifications({
        ...notifications,
        Membership: 1,
      });
    }
  }, [user, notifications]);

  useEffect(() => {
    const fetchRemainingSteps = async () => {
      try {
        const steps = await accountApi.getRemainingSteps(); // TODO error handling
        setRemainingSteps(steps);
      } catch (error) {
        console.error("Error fetching remaining steps:", error);
      }
    };
  
    if (user) {
      fetchRemainingSteps();
    }
  }, [user, notifications]);

  useEffect(() => {
    if (user?.memberstatus === "unverified") {
      setIsMemberFormDisabled(false);
    } else {
      setIsMemberFormDisabled(true);
    }
  }, [user]);

  useEffect(() => {
    if (user?.organizations) {
      const getUserOrgs = async () => {
        try {
          const orgs = await accountApi.getUserOrganizations();
          const filteredOrgs = orgs.filter(
            (data) => data.organizationstatus === "verified"
          );
          setUserOrgs(filteredOrgs);
        } catch (error) {
          console.error("Error fetching user organizations:", error);
        }
      };

      getUserOrgs();
    }
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      const fetchPendingMembers = async () => {
        try {
          const members = await accountApi.getPendingMembers();
          setPendingMembers(members);
        } catch (error) {
          console.error("Error fetching pending members:", error);
        }
      };

      fetchPendingMembers();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      fetchOrganizations();
    }
  }, [isAdmin]);

  const fetchOrganizations = async () => {
    try {
      const response = await organizationApi.getPendingOrganizations();
      setPendingOrgs(response.orgs.length);
    } catch (error) {
      console.error("Error fetching pending organizations:", error);
    }
  };

  const goToGettingStarted = () => {
    navigate("/getting-started");
  };

  const updateRecentlyVerified = async (value) => {
    try {
      await accountApi.updateRecentlyVerified(value);
    } catch (error) {
       console.error("Error updating recently verified:", error);
    }
  };

  const handleMenuClose = useCallback(() => {
    setIsMenuOpen(false);
    setAnchorEl(null);
  }, [setIsMenuOpen, setAnchorEl]);

  const handleMenuOpen = useCallback(
    (index, event) => {
      setAnchorEl(event.currentTarget);
      setIsMenuOpen(true);
  
      const subMenus = MENU_ITEMS[index].subMenus?.map((subMenuItem) => {

        const onClickHandler = () => {
          handleMenuClose();

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
            } else if (user?.memberstatus !== "verified") {
              requestDialog(
                'Membership Required',
                'You must be a verified member to access this page.',
                "Become a Member",
                () => { navigate('/become-a-member'); },
                "Another Time",
                () => { }
              );
            }
          }
        };
  
        return (
          <div>
            <MenuItem
              component={Link}
              to={subMenuItem.protected ? 
                (isAuthenticated && user?.memberstatus === "verified" ? subMenuItem.pathname : "#") 
                : subMenuItem.pathname}
              key={subMenuItem.title}
              onClick={onClickHandler}
            >
              {subMenuItem.title}
            </MenuItem>
          </div>
        );
      });
  
      setSubMenuItems(subMenus);
    },
    [isAuthenticated, user?.memberstatus, handleMenuClose, requestDialog, navigate]
  );

  const handleAccountMenuOpen = (event) => {
    setAnchorEl(event.target);
    setIsMenuOpen(true);

    const getMenuItems = (subMenuItem) => {
      const { title, type, icon } = subMenuItem;
    
      const handleMenuItemClick = () => {
        handleMenuClose();
        if (type === "dialog") {
          setActiveDialog(title);
        }
        if (title === "Settings") {
          setNotifications({
            ...notifications,
            Settings: 0,
          });
        } else if (title === "Membership") {
          setNotifications({
            ...notifications,
            Membership: 0,
          });
        }
      };
    
      const handleLogout = async () => {
        try {
          await accountApi.logout();
          setIsAuthenticated(false);
          setUser(null);
          setIsAdmin(false);
          navigate("/");
        } catch (error) {
          console.error("Error logging out:", error);
        }
      };
    
      if (type === "link") {
        return (
          <MenuItem
            key={title}
            onClick={
              title === "Profile"
                ? goToProfile
                : title === "Admin Panel"
                ? goToAdminPanel
                : title === "Getting Started"
                ? goToGettingStarted
                : goToMessages
            }
            sx={{ columnGap: "10px", justifyContent: "space-between" }}
          >
            {title}
            {title === "Profile" ? (
              <Badge badgeContent={!user["email:confirmed"] ? 1 : 0} color="primary">
                <Person />
              </Badge>
            ) : title === "Admin Panel" ? (
              <Badge badgeContent={pendingMembers + pendingOrgs} color="primary">
                <AdminPanelSettingsIcon />
              </Badge>
            ) : title === "Getting Started" && remainingSteps > 0 ? (
              <Badge badgeContent={remainingSteps} color="primary">
                {icon}
              </Badge>
            ) : (
              <Badge badgeContent={notifications.Messages} color="primary">
                <ChatIcon />
              </Badge>
            )}
          </MenuItem>
        );
      } else if (type === "button") {
        return (
          <MenuItem
            key={title}
            onClick={handleLogout}
            sx={{ columnGap: "10px", justifyContent: "space-between" }}
          >
            {title}
            <LogoutIcon />
          </MenuItem>
        );
      } else if (type === "dialog") {
        return (
          <MenuItem
            onClick={handleMenuItemClick}
            sx={{ columnGap: "10px", justifyContent: "space-between" }}
          >
            {title}
            {title === "Settings" ? (
              <Badge badgeContent={notifications.Settings} color="primary">
                <SettingsIcon />
              </Badge>
            ) : title === "Membership" ? (
              <Badge badgeContent={notifications.Membership} color="primary">
                <Star />
              </Badge>
            ) : (
              <CorporateFareIcon />
            )}
          </MenuItem>
        );
      } else if (type === "membership") {
        return (
          <MemberButtonBadge
            badgeContent={
              isMemberFormDisabled || checkedMembershipInfo ? 0 : "!"
            }
            color="red"
            sx={{ color: "#fff" }}
          >
            <Button
              color="primary"
              variant="contained"
              disabled={isMemberFormDisabled}
              onClick={() => {
                setActiveDialog("Membership Info");
                setCheckedMembershipInfo(true);
                localStorage.setItem("checkedMembershipInfo", "true");
                setIsMenuOpen(false);
              }}
              sx={{ textTransform: "none", margin: "6px 16px" }}
            >
              {title}
            </Button>
          </MemberButtonBadge>
        );
      }
    };
    if (isAdmin) {
      if (user?.memberstatus === "unverified") {
        setSubMenuItems(ADMIN_MENU_ITEMS.map(getMenuItems));
      } else if (user?.memberstatus === "verified") {
        setSubMenuItems(ADMIN_MEMBER_MENU_ITEMS.map(getMenuItems));
      } else if (user?.memberstatus === "pending") {
        setSubMenuItems(ADMIN_MENU_ITEMS.map(getMenuItems));
      }
    } else {
      if (user?.memberstatus === "unverified") {
        setSubMenuItems(ACCOUNT_MENU_ITEMS.map(getMenuItems));
      } else if (user?.memberstatus === "verified") {
        setSubMenuItems(MEMBER_MENU_ITEMS.map(getMenuItems));
      } else if (user?.memberstatus === "pending") {
        setSubMenuItems(ACCOUNT_MENU_ITEMS.map(getMenuItems));
      }
    }
  };

  const goToProfile = () => {
    navigate(`/forum?user=${userSlug}`);
  };

  const goToMessages = () => {
    navigate(`/forum?messages=${userSlug}`);
  };

  const goToAdminPanel = () => {
    navigate("/admin-panel");
  };

  async function getUserProfilePicture(userslug) {
    try {
      return await accountApi.getUserProfilePicture(userslug);
    } catch (error) {
      console.error("Error fetching user profile picture:", error);
      return profile_01;
    }
  }

  function keyDetectMenuList(event) {
    let key = 0;

    if (window.event) {
      key = window.event.keyCode;
    } else if (event) {
      key = event.keyCode;
    }
    // was the Escape (27) or Tab (9) key pressed?
    if (key === 27 || key === 9) {
      document.getElementById("menuList").tabIndex = -1;
      handleMenuClose();
    }
  }

  function keyDetectNavTab(event) {
    let key = 0;

    if (window.event) {
      key = window.event.keyCode;
    } else if (event) {
      key = event.keyCode;
    }

    let tabs = document.getElementsByClassName("MuiTab-root");
    console.log(tabs);

    // was the Arrow Down (40) or Space (32) or Enter (13) key pressed?
    if (key === 40 || key === 32) {
      event.preventDefault();
      document.getElementById("menuList").focus();
    } else if (key === 13) {
      document.activeElement.click(); // maintain home button functionality
      event.preventDefault();
      document.getElementById("menuList").focus();
    }
  }

  const requestOrgChange = (org) => {
    console.log(org);
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="sticky" color="background">
        <Toolbar>
          {isSmallScreen ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => props.setOpen(!props.open)}
              sx={{ mr: 2, ...(props.open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
          ) : null}
          <div className="inline-flex items-center w-full">
            <h2
              className={`text-left grow font-[Kindest] text-light-green font-light ${
                isAuthenticated ? "" : "my-2.5"
              }`}
            >
              <a
                className="text-inherit no-underline w-full text-center"
                onClick={() => navigate("/")}
                href={() => navigate("/")}
              >
                <div className="w-fit">
                  {isReallyTeenyTinyScreen
                    ? "Farm to School"
                    : isSmallScreen
                      ? isPhoneScreen
                        ? "AZ Farm to School"
                        : "AZ Farm to School Network"
                      : "Arizona Farm to School\xA0Network"}
                </div>
              </a>
            </h2>
            <nav
              className="flex justify-between sm:justify-left items-center"
              onMouseLeave={handleMenuClose}
            >
              {!isSmallScreen ? (
                <div className="w-fit">
                  <Tabs
                    value={value}
                    indicatorColor="none"
                    variant={isSmallScreen ? "fullWidth" : "standard"}
                  >
                    {MENU_ITEMS.map((menuItem, index) => {
                      return (
                        <NavTab
                          tabIndex="0"
                          key={index}
                          sx={{ fontWeight: "600" }}
                          onKeyDown={keyDetectNavTab}
                          onFocus={(event) => {
                            handleMenuOpen(index, event);
                          }}
                          onMouseEnter={(event) => {
                            handleMenuOpen(index, event);
                          }}
                          label={menuItem.title}
                          component={Link}
                          to={menuItem.pathname ? menuItem.pathname : null}
                          onClick={() =>
                            menuItem.pathname ? setValue(0) : null
                          }
                        />
                      );
                    })}
                  </Tabs>
                  <Popper
                    anchorEl={anchorEl}
                    open={isMenuOpen}
                    sx={{ zIndex: 1300 }}
                  >
                    <Paper>
                      <MenuList
                        id="menuList"
                        tabIndex="0"
                        onKeyDown={keyDetectMenuList}
                      >
                        {subMenuItems}
                      </MenuList>
                    </Paper>
                  </Popper>
                </div>
              ) : null}
              {isAuthenticated ? (
                <div className="flex justify-center items-center pl-2">
                  <AccountBadge
                    badgeContent={
                      notifications.Membership +
                      notifications.Settings +
                      notifications.Messages +
                      pendingMembers +
                      pendingOrgs +
                      (isMemberFormDisabled || checkedMembershipInfo ? 0 : 1) +
                      (!user["email:confirmed"] ? 1 : 0)
                    }
                    color="primary"
                  >
                    <IconButton
                      onFocus={handleAccountMenuOpen}
                      onMouseEnter={handleAccountMenuOpen}
                      color="inherit"
                      aria-label="open drawer"
                      onClick={() => {
                        setValue(4);
                        goToProfile();
                      }}
                      size="small"
                    >
                      {!userProfilePicture ? (
                        <CircularProgress />
                      ) : (
                        <img
                          src={userProfilePicture}
                          className="flex rounded-full w-12"
                          alt="User profile"
                        />
                      )}
                    </IconButton>
                  </AccountBadge>
                  <Popper
                    anchorEl={anchorEl}
                    open={isMenuOpen}
                    sx={{ zIndex: 1300 }}
                  >
                    <Paper>
                      <MenuList
                        id="menuList"
                        tabIndex="0"
                        onKeyDown={keyDetectMenuList}
                      >
                        {subMenuItems}
                      </MenuList>
                    </Paper>
                  </Popper>
                  <MembershipDialog
                    open={activeDialog === "Membership"}
                    onClose={() => setActiveDialog(null)}
                    user={user}
                    profilePicture={userProfilePicture}
                  />
                  <SettingsDialog
                    open={activeDialog === "Settings"}
                    onClose={() => setActiveDialog(null)}
                    user={user}
                  />
                  <MembershipInfoDialog
                    open={activeDialog === "Membership Info"}
                    onClose={() => setActiveDialog(null)}
                    user={user}
                  />
                  <EditOrganizationDialog
                    organizations={userOrgs}
                    open={activeDialog === "Organization(s)"}
                    onClose={() => setActiveDialog(null)}
                    onUpdate={requestOrgChange}
                    isAdmin={isAdmin}
                  />
                </div>
              ) : (
                <Button
                  onFocus={handleMenuClose}
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    marginLeft: "1rem",
                  }}
                  onClick={() => navigate("/sign-up")}
                >
                  {isTheWorldsSmallestScreen ? "Sign\xA0up" : "Sign\xA0up\xA0/\xA0Log\xA0in"}
                </Button>
              )}
            </nav>
          </div>
        </Toolbar>
      </AppBar>
      <Sidebar
        isOpen={props.open}
        setOpen={props.setOpen}
        sidebarWidth={sidebarWidth}
      />
    </>
  );
};

export default Navbar;
