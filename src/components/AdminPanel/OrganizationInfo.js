import { Box, List, ListItem, Typography } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business"; // For Type
import LocationOnIcon from "@mui/icons-material/LocationOn"; // For Address
import LocationCityIcon from "@mui/icons-material/LocationCity"; // For City
import MailIcon from "@mui/icons-material/Mail"; // For Zipcode
import PeopleIcon from "@mui/icons-material/People"; // For Members
import GroupWorkIcon from "@mui/icons-material/GroupWork"; // For Involvements
import LabelIcon from "@mui/icons-material/Label"; // For Tags
import PublicIcon from "@mui/icons-material/Public"; // For Website
import LockOpenIcon from "@mui/icons-material/LockOpen"; // For Public

export default function OrganizationInfo({ org }) {
  return (
    <>
      <Typography
        variant="h4"
        component="div"
        color="primary"
        fontFamily={"Kindest"}
      >
        <b>{org.name}</b>
      </Typography>
      <List>
        <ListItem>
          <BusinessIcon style={{ marginRight: 15 }} color="textSecondary" />
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Type:
            </Typography>
            <Typography variant="body1">{org.type}</Typography>
          </Box>
        </ListItem>
        <ListItem>
          <LocationOnIcon style={{ marginRight: 15 }} color="textSecondary" />
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Address:
            </Typography>
            <Typography variant="body1">{org.address}</Typography>
          </Box>
        </ListItem>
        <ListItem>
          <LocationCityIcon style={{ marginRight: 15 }} color="textSecondary" />
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              City:
            </Typography>
            <Typography variant="body1">{org.city}</Typography>
          </Box>
        </ListItem>
        <ListItem>
          <MailIcon style={{ marginRight: 15 }} color="textSecondary" />
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Zipcode:
            </Typography>
            <Typography variant="body1">{org.zip}</Typography>
          </Box>
        </ListItem>
        <ListItem>
          <PeopleIcon style={{ marginRight: 15 }} color="textSecondary" />
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Members:
            </Typography>
            <div className="flex flex-col gap-y-2">
              {Object.values(org.members).map((member, index) => (
                <Typography
                  key={index}
                  variant="body1"
                >{`${member.name}`}</Typography>
              ))}
            </div>
          </Box>
        </ListItem>
        <ListItem>
          <GroupWorkIcon style={{ marginRight: 15 }} color="textSecondary" />
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Involvements:
            </Typography>
            <Typography variant="body1">
              {Object.keys(org.involvements)
                .filter((key) => org.involvements[key] === true)
                .join(", ")}
            </Typography>
          </Box>
        </ListItem>
        <ListItem>
          <LabelIcon style={{ marginRight: 15 }} color="textSecondary" />
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Tags:
            </Typography>
            <Typography variant="body1">{org.tags.join(", ")}</Typography>
          </Box>
        </ListItem>
        <ListItem>
          <PublicIcon style={{ marginRight: 15 }} color="textSecondary" />
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Website:
            </Typography>
            <Typography variant="body1">
              <a href={org.website} target="_blank" rel="noopener noreferrer">
                {org.website}
              </a>
            </Typography>
          </Box>
        </ListItem>
        <ListItem>
          <LockOpenIcon style={{ marginRight: 15 }} color="textSecondary" />
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Public:
            </Typography>
            <Typography variant="body1">
              {org.isPublic ? "Yes" : "No"}
            </Typography>
          </Box>
        </ListItem>
      </List>
    </>
  );
}
