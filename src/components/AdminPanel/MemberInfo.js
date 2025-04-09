import GroupIcon from "@mui/icons-material/Group";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import BusinessIcon from "@mui/icons-material/Business";
import CommunityIcon from "@mui/icons-material/Groups";
import GainIcon from "@mui/icons-material/EmojiEvents";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import LocationCountyIcon from "@mui/icons-material/LocationCityOutlined";
import CommentIcon from "@mui/icons-material/Comment";
import { Email } from "@mui/icons-material";
import { Box, List, ListItem, Typography } from "@mui/material";
import { Event } from "@mui/icons-material";
import dayjs from "dayjs";

export default function MemberInfo({ member }) {
  return (
    <>
      <Typography
        variant="h4"
        component="div"
        color="primary"
        fontFamily={"Kindest"}
      >
        <b>Membership Details for {member.fullname}</b>
      </Typography>

      <Typography
        variant="subtitle2"
        color="textSecondary"
        style={{ marginBottom: "20px" }}
      >
        <div className="flex items-end">
          <Email style={{ marginRight: 15, verticalAlign: "bottom" }} />
          {member.email}
        </div>
      </Typography>

      <List>
        <ListItem>
          <Event style={{ marginRight: 15 }} />
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Membership Date
            </Typography>
            <Typography variant="body1">
              {dayjs(member.membershipdate).format("M-DD-YYYY")}
            </Typography>
          </Box>
        </ListItem>
        <ListItem>
          <GroupIcon style={{ marginRight: 15 }} />
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              User Groups
            </Typography>
            <Typography variant="body1">{member.groups.join(", ")}</Typography>
          </Box>
        </ListItem>
        <ListItem>
          <LocalOfferIcon style={{ marginRight: 15 }} />
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Tags
            </Typography>
            <Typography variant="body1">{member.tags.join(", ")}</Typography>
          </Box>
        </ListItem>
        <ListItem>
          <BusinessIcon style={{ marginRight: 15 }} />
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Organizations
            </Typography>
            <Typography variant="body1">
              {member.organizations
                .map((org) => `${org.name}${org.role ? ` - ${org.role}` : ""}`)
                .join(", ")}
            </Typography>
          </Box>
        </ListItem>
        <ListItem>
          <CommunityIcon style={{ marginRight: 15 }} />
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Communities of Practice
            </Typography>
            <Typography variant="body1">
              {member.communitiesofpractice.join(", ")}
            </Typography>
          </Box>
        </ListItem>
        <ListItem>
          <GainIcon style={{ marginRight: 15 }} />
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Hoping to Gain
            </Typography>
            <Typography variant="body1">
              {member.hopetogain.join(", ")}
            </Typography>
          </Box>
        </ListItem>
        <ListItem>
          <LocationCountyIcon style={{ marginRight: 15 }} />
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              County
            </Typography>
            <Typography variant="body1">{member.county}</Typography>
          </Box>
        </ListItem>
        <ListItem>
          <LocationCityIcon style={{ marginRight: 15 }} />
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              City
            </Typography>
            <Typography variant="body1">{member.city}</Typography>
          </Box>
        </ListItem>
        <ListItem>
          <CommentIcon style={{ marginRight: 15 }} />
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Additional Comments
            </Typography>
            <Typography variant="body1">{member.additionalcomments}</Typography>
          </Box>
        </ListItem>
      </List>
    </>
  );
}
