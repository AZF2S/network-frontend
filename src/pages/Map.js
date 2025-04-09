import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Button,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  styled,
  TextField
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import PlaceIcon from "@mui/icons-material/Place";
import ReactDOMServer from "react-dom/server";
import profile_08 from "../assets/profile/default/profile-08.jpg";
import MarkerClusterGroup from "react-leaflet-cluster";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import foodEducator from "../assets/map/icon-food-education.png";
import gardenEducator from "../assets/map/icon-school-gardens.png";
import procurement from "../assets/map/icon-procurement.png";
import SelectMapTags from "../components/SelectMapTags";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useDialog } from "../utils/DialogProvider";
import { mapApi, progressApi } from '../api';
import config from "../config";

// Constants
const position = [33.448, -112.074];

// Styled Components
const CustomInputLabel = styled(InputLabel)({
  "&.Mui-focused": {
    color: "#B55B2C",
  },
});

const CustomSelect = styled(Select)({
  "& .MuiInputLabel-root": {
    color: "#B55B2C",
    "&.Mui-focused": {
      color: "#B55B2C",
    },
  },
  "&.MuiOutlinedInput-root": {
    "& fieldset": {
      borderWidth: "2px",
      borderRadius: "8px",
    },
    "&:hover fieldset": {
      borderColor: "#B55B2C",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#B55B2C",
      color: "#B55B2C",
    },
  },
});

const CustomField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#B55B2C",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#B55B2C",
  },
  "& .MuiInputBase-root": {
    "&:hover:not(.Mui-disabled):before": {
      borderBottomColor: "#B55B2C",
    },
    "&.Mui-focused:before": {
      borderBottomColor: "#B55B2C",
    },
  },
});

// Custom Marker Components
const SchoolMarker = () => (
  <div className="w-9 h-9 rounded-full flex items-center justify-center bg-light-green ml-[-6px] mt-[-6px]">
    <div className="w-7 h-7 rounded-full flex items-center justify-center bg-white">
      <SchoolIcon />
    </div>
  </div>
);

const FarmMarker = () => (
  <div className="w-9 h-9 rounded-full flex items-center justify-center bg-light-green ml-[-6px] mt-[-6px]">
    <div className="w-7 h-7 rounded-full flex items-center justify-center bg-white">
      <AgricultureIcon />
    </div>
  </div>
);

const PlaceMarker = () => (
  <div className="w-9 h-9 rounded-full flex items-center justify-center bg-light-green ml-[-6px] mt-[-6px]">
    <div className="w-7 h-7 rounded-full flex items-center justify-center bg-white">
      <PlaceIcon />
    </div>
  </div>
);

// Custom Icons
const schoolIcon = L.divIcon({
  className: "custom-icon",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  html: ReactDOMServer.renderToString(<SchoolMarker />),
});

const farmIcon = L.divIcon({
  className: "custom-icon",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  html: ReactDOMServer.renderToString(<FarmMarker />),
});

const placeIcon = L.divIcon({
  className: "custom-icon",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  html: ReactDOMServer.renderToString(<PlaceMarker />),
});

// PinsInBounds Component
const PinsInBounds = ({ pins, onPinsInBoundsUpdate, selectedLocation, mapWidth }) => {
  const [pinsInBounds, setPinsInBounds] = useState([]);
  
  const map = useMapEvents({
    moveend: () => {
      map.invalidateSize();
      const bounds = map.getBounds();
      const filteredPins = pins?.filter((pin) =>
        bounds.contains([pin.latLng[0], pin.latLng[1]])
      );
      setPinsInBounds(filteredPins);
    },
  });

  useEffect(() => {
    if (map) {
      map.invalidateSize();
      const bounds = map.getBounds();
      const filteredPins = pins?.filter((pin) =>
        bounds.contains([pin.latLng[0], pin.latLng[1]])
      );
      setPinsInBounds(filteredPins);

      if (pins?.length > 0) {
        const bounds = L.latLngBounds(
          pins.map((location) => [location.latLng[0], location.latLng[1]])
        );
        map.fitBounds(bounds, { padding: [30, 30] });
      }
    }
  }, [map, pins]);

  useLayoutEffect(() => {
    if (map) {
      setTimeout(() => {
        map.invalidateSize();
      }, 450);
    }
  }, [map, mapWidth]);

  useEffect(() => {
    if (map && selectedLocation) {
      map.flyTo(selectedLocation.latLng, 14, { duration: 1 });
    }
  }, [map, selectedLocation]);

  useEffect(() => {
    onPinsInBoundsUpdate(pinsInBounds);
  }, [pinsInBounds, onPinsInBoundsUpdate]);

  return null;
};

// Main Map Component
function Map() {
  // Hooks
  const dialogContext = useDialog();
  const navigate = useNavigate();
  const { user } = useAuth();
  const mapRef = useRef();

  // State
  const [filterType, setFilterType] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterArea, setFilterArea] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showPeople, setShowPeople] = useState([]);
  const [mapData, setMapData] = useState();
  const [mapPoints, setMapPoints] = useState();
  const [showingLocations, setShowingLocations] = useState(false);
  const [locations, setLocations] = useState([]);
  const [fetchedOrgIds, setFetchedOrgIds] = useState(new Set());
  const [selectedLocation, setSelectedLocation] = useState();
  const [zoomedLocation, setZoomedLocation] = useState();
  const [mapWidth, setMapWidth] = useState("100%");
  const [orgMembers, setOrgMembers] = useState({});
  const [orgTypes, setOrgTypes] = useState([]);

// Dialog state management
const [dialogOpen, setDialogOpen] = useState(false);

// Effects
useEffect(() => {
  if (dialogContext?.dialogProps) {
    setDialogOpen(dialogContext.dialogProps.isOpen);
  }
}, [dialogContext]);

useEffect(() => {
  window.scrollTo(0, 0);
}, []);

useEffect(() => {
  const updateChecklistStep = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await progressApi.updateChecklistStep("exploreNetworkMap");
      console.log("Checklist step updated successfully");
    } catch (error) {
      console.error("Error updating checklist step:", error);
    }
  };
  updateChecklistStep();
}, []);

useEffect(() => {
  const getMapData = async () => {
    try {
      const { data: mapData } = await mapApi.getMapData();

      const points = mapData.filter(
        (data) =>
          data.organizationstatus === "verified" &&
          data.members.length > 0 &&
          data.isPublic
      );

      const orgTypes = [...new Set(points.map((point) => point.type))];
      setOrgTypes(orgTypes);
      setMapData(points);
      setMapPoints(points);
    } catch (error) {
      console.error('Error fetching map data:', error);
    }
  };

  getMapData();
}, []);

// Early return if dialog is open
if (dialogOpen) {
  console.log('Map not rendering due to open dialog');
  return null;
}

// Handlers
const handlePinsInBoundsUpdate = (pinsInBounds) => {
  if (!selectedLocation) {
    setLocations(pinsInBounds);
  }
};

const handleChangeFilter = (event) => {
  setFilterType(event.target.value);
};

const handleFilterClick = (event, filter) => {
  if (activeFilters.includes(filter)) {
    setActiveFilters(activeFilters.filter((item) => item !== filter));
  } else {
    setActiveFilters([...activeFilters, filter]);
  }
};

const handleChangeName = (event) => {
  setFilterName(event.target.value);
};

const handleChangeArea = (event) => {
  setFilterArea(event.target.value);
};

const toggleShowPeople = async (location) => {
  if (showPeople.includes(location._id)) {
    setShowPeople(showPeople.filter((item) => item !== location._id));
  } else {
    if (!fetchedOrgIds.has(location._id)) {
      try {
        const members = await fetchMembersForOrg(location._id);
        setOrgMembers((prevState) => ({
          ...prevState,
          [location._id]: members,
        }));
        setFetchedOrgIds((prevSet) => new Set([...prevSet, location._id]));
      } catch (error) {
        console.error(
          `Failed to fetch members for organization ${location.name}:`,
          error
        );
        return;
      }
    }
    setShowPeople([...showPeople, location._id]);
  }
};

const fetchMembersForOrg = async (orgID) => {
  try {
    const { data } = await mapApi.getOrganizationMembers(orgID);
    return data;
  } catch (error) {
    throw new Error(`Error: ${error.response?.statusText || error.message}`);
  }
};

const toggleShowingLocations = () => {
  setMapWidth(showingLocations ? "100%" : "60%");
  setShowingLocations(!showingLocations);
};

const searchLocations = () => {
  setShowingLocations(true);

  const filteredPoints = mapData.filter((point) => {
    const nameMatch =
      !filterName ||
      point.name.toLowerCase().includes(filterName.toLowerCase());
    const areaMatch =
      !filterArea ||
      point.zip === filterArea ||
      point.city.toLowerCase().includes(filterArea.toLowerCase());
    const orgMatch = !filterType || point.type === filterType;
    const tagMatch =
      !selectedTags.length || selectedTags.every((tag) => point.tags.includes(tag));
    const foodEducationMatch =
      !activeFilters.includes("Food Education") ||
      point.involvements.foodEducation;
    const gardenEducationMatch =
      !activeFilters.includes("Garden Education") ||
      point.involvements.gardenEducation;
    const procurementMatch =
      !activeFilters.includes("Procurement") ||
      point.involvements.procurement;

    return (
      nameMatch &&
      areaMatch &&
      orgMatch &&
      tagMatch &&
      foodEducationMatch &&
      gardenEducationMatch &&
      procurementMatch
    );
  });

  setMapPoints(filteredPoints);
  setLocations(filteredPoints);
  setMapWidth("60%");
};

const resetFilters = () => {
  setFilterArea("");
  setFilterName("");
  setFilterType("");
  setSelectedTags([]);
  setActiveFilters([]);
  setMapPoints(mapData);
};

const goToSelectedLocation = (e, data) => {
  setZoomedLocation(data);
};

const showLocation = (e, data) => {
  setShowingLocations(true);
  setSelectedLocation(data);
  setLocations([data]);
  setMapWidth("60%");
};

const stopShowingLocation = () => {
  setZoomedLocation(null);
  setSelectedLocation(null);
  setLocations(mapPoints);
};

const goToProfile = (userSlug) => {
  navigate(`/forum?user=${userSlug}`);
};

// Render map method
const renderMap = () => {
  return (
    <div className="flex-col sm:flex-row sm:justify-center sm:flex sm:h-fit flex-grow relative aspect-[3/2]">
      <div
        className="relative transition-[width] duration-500 h-full"
        style={{ width: mapWidth }}
      >
        <div className="absolute right-5 top-5 z-[500]">
          <IconButton
            sx={{ backgroundColor: "#FFFFFF" }}
            onClick={toggleShowingLocations}
          >
            {showingLocations ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        
        <MapContainer
          style={{
            height: "100%",
            width: "100%",
            top: "0",
            bottom: "0",
            position: "absolute",
            zIndex: 1, // Base z-index for map
          }}
          center={position}
          zoom={6}
          scrollWheelZoom={true}
          preferCanvas={false}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MarkerClusterGroup 
            chunkedLoading
            zIndexOffset={-1000} // Keep clusters below popups
          >
            {mapPoints?.map((data, index) =>
              data.type === "Farm" ? (
                <Marker
                  key={index}
                  position={data.latLng}
                  icon={farmIcon}
                  eventHandlers={{
                    click: (e) => showLocation(e, data),
                  }}
                >
                  <Popup>{data.name}</Popup>
                </Marker>
              ) : data.type === "School" ? (
                <Marker
                  key={index}
                  position={data.latLng}
                  icon={schoolIcon}
                  eventHandlers={{
                    click: (e) => showLocation(e, data),
                  }}
                >
                  <Popup>{data.name}</Popup>
                </Marker>
              ) : (
                <Marker
                  key={index}
                  position={data.latLng}
                  icon={placeIcon}
                  eventHandlers={{
                    click: (e) => showLocation(e, data),
                  }}
                >
                  <Popup>{data.name}</Popup>
                </Marker>
              )
            )}
            <PinsInBounds
              pins={mapPoints}
              onPinsInBoundsUpdate={handlePinsInBoundsUpdate}
              selectedLocation={zoomedLocation}
              mapWidth={mapWidth}
            />
          </MarkerClusterGroup>
        </MapContainer>
      </div>

      {/* Locations sidebar */}
      <div
        className={`${
          showingLocations ? "sm:w-[40%]" : "sm:w-0"
        } transition-[width] w-full duration-500 border-l-2 border-t-2 border-light-gray border-solid sm:border-x-0 overflow-y-scroll`}
        style={{ zIndex: 2 }} // Ensure sidebar is above map
      >
        {locations?.slice(0, 30).map((location, index) => (
          <div className="m-5 relative" key={index}>
            <div className="flex flex-col gap-y-3">
              {selectedLocation ? (
                <div className="absolute top-0 right-0 ml-auto w-fit h-fit z-10">
                  <IconButton size="small" onClick={stopShowingLocation}>
                    <CloseIcon />
                  </IconButton>
                </div>
              ) : null}
              <div
                className="flex flex-col gap-y-3 cursor-pointer"
                onClick={(event) => goToSelectedLocation(event, location)}
              >
                <div className="inline-flex">
                  <div className="text-2xl font-[Kindest] cursor-pointer mr-8">
                    {location.name}
                  </div>
                </div>
                <div className="text-md">{location.address}</div>
                <div className="text-md">
                  {location.website && (
                    <a
                      href={location.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {location.website}
                    </a>
                  )}
                </div>
                <div className="bg-light-green flex w-fit rounded-lg">
                  <div className="mx-2 my-1 text-white font-bold text-sm">
                    {location.type}
                  </div>
                </div>
                <div className="flex flex-inline flex-wrap gap-x-2 gap-y-2">
                  {location.involvements.gardenEducation && (
                    <div className="bg-sage flex w-fit rounded-lg">
                      <div className="mx-2 my-1 text-white font-bold text-sm">
                        Garden Educator
                      </div>
                    </div>
                  )}
                  {location.involvements.foodEducation && (
                    <div className="bg-eggplant flex w-fit rounded-lg">
                      <div className="mx-2 my-1 text-white font-bold text-sm">
                        Food Educator
                      </div>
                    </div>
                  )}
                  {location.involvements.procurement && (
                    <div className="bg-orange flex w-fit rounded-lg">
                      <div className="mx-2 my-1 text-white font-bold text-sm">
                        Procurement
                      </div>
                    </div>
                  )}
                </div>
                <div className="inline-flex flex-wrap gap-x-2 gap-y-2">
                  {location.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      sx={{ width: "fit-content" }}
                    />
                  ))}
                </div>
              </div>
              <Button
                variant="contained"
                color="purple"
                fullWidth
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  color: "#fff",
                }}
                size="small"
                onClick={() => toggleShowPeople(location)}
              >
                {showPeople.includes(location._id) ? "Hide People" : "Show People"}
              </Button>
              <div
                className={`${
                  showPeople.includes(location._id) ? "max-h-96" : "max-h-0"
                } transition-max-h duration-500 overflow-y-hidden flex flex-col gap-y-2`}
              >
                {(orgMembers[location._id] || []).map((person, index) => (
                  <div
                    className="flex items-center hover:bg-light-gray rounded-lg cursor-pointer"
                    key={index}
                    onClick={() => goToProfile(person.userslug)}
                  >
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-2">
                      <div className="inline-flex items-center gap-x-2 m-1">
                        <img
                          src={
                            person.picture
                              ? `${config.PROTOCOL}forum.${config.DOMAIN_NO_HTTPS}` +
                                person.picture
                              : profile_08
                          }
                          className="rounded-full border-3 border-solid border-light-green w-12"
                          alt={person.fullname}
                        />
                        <div>{person.fullname}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Divider
                sx={{
                  borderStyle: "dashed",
                  marginTop: "2px",
                  borderColor: "rgba(0, 0, 0, 0.5)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main return
return (
  <div className="flex justify-center">
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-center">
        <div className="w-full h-[200px] bg-center bg-no-repeat relative bg-cover bg-map-header">
          <div className="p-12 h-full">
            <div className="flex items-end justify-left h-full">
              <div className="w-fit h-fit bg-purple rounded-lg">
                <div className="p-3 text-white font-[Kindest] text-5xl">
                  Network Map
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex justify-center mb-20">
        <div className="block my-12 sm:w-5/6 md:w-4/5 w-11/12 max-w-[950px]">
          <div className="font-[Kindest] text-3xl text-light-green mb-4">
            Connect with the AZ Farm to School Network
          </div>
          <div className="font-medium mb-4">
            Use this tool to see the organizations that participate in the
            Farm to School program!
          </div>

          {/* Filters */}
          <div className="flex justify-between flex-wrap-reverse gap-y-5 items-center mb-5">
            <div className="flex flex-row gap-x-5 w-full items-center">
              <div className="w-1/3">
                <CustomField
                  label="Name"
                  variant="standard"
                  size="small"
                  sx={{ width: "100%" }}
                  value={filterName}
                  onChange={handleChangeName}
                />
              </div>
              <div className="w-1/3">
                <CustomField
                  label="City/Zip Code"
                  variant="standard"
                  size="small"
                  sx={{ width: "100%" }}
                  value={filterArea}
                  onChange={handleChangeArea}
                />
              </div>
              <div className="w-1/3">
                <FormControl sx={{ minWidth: 50, width: "100%" }} size="small">
                  <CustomInputLabel id="org-type-label">
                    Org. Type
                  </CustomInputLabel>
                  <CustomSelect
                    labelId="org-type-label"
                    label="Org. Type"
                    value={filterType}
                    onChange={handleChangeFilter}
                  >
                    {orgTypes.map((orgType, index) => (
                      <MenuItem value={orgType} key={index}>
                        {orgType}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </FormControl>
              </div>
            </div>
            <div className="flex flex-row gap-x-5 ml-auto">
              <Button
                variant="contained"
                color="orange"
                sx={{ color: "#fff", fontWeight: 600, textTransform: "none" }}
                onClick={searchLocations}
              >
                Search
              </Button>
              <Button
                variant="contained"
                color="orange"
                sx={{ color: "#fff", fontWeight: 600, textTransform: "none" }}
                onClick={resetFilters}
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Filter icons */}
          <div className="inline-flex gap-x-5 mb-5 w-full items-center">
            <div className="inline-flex gap-x-5 w-fit">
              <div
                className={`${
                  activeFilters.includes("Food Education")
                    ? "border-eggplant"
                    : "border-eggplant/0 hover:border-eggplant/50"
                } transition-border-opacity duration-300 inline-flex gap-x-1 items-center cursor-pointer p-1 border-3 border-solid rounded-lg`}
                onClick={(event) => handleFilterClick(event, "Food Education")}
              >
                <img src={foodEducator} className="w-10" alt="Food Education" />
                <div className="text-sm whitespace-nowrap">Food Education</div>
              </div>
              <div
                className={`${
                  activeFilters.includes("Garden Education")
                    ? "border-sage"
                    : "border-sage/0 hover:border-sage/50"
                } transition-border-opacity duration-300 inline-flex gap-x-1 items-center cursor-pointer p-1 border-3 border-solid rounded-lg`}
                onClick={(event) => handleFilterClick(event, "Garden Education")}
              >
                <img src={gardenEducator} className="w-10" alt="Garden Education" />
                <div className="text-sm whitespace-nowrap">Garden Education</div>
              </div>
              <div
                className={`${
                  activeFilters.includes("Procurement")
                    ? "border-orange"
                    : "border-orange/0 hover:border-orange/50"
                } transition-border-opacity duration-300 inline-flex gap-x-1 items-center cursor-pointer p-1 border-3 border-solid rounded-lg`}
                onClick={(event) => handleFilterClick(event, "Procurement")}
              >
                <img src={procurement} className="w-10" alt="Procurement" />
                <div className="text-sm whitespace-nowrap">Procurement</div>
              </div>
            </div>
            <div className="w-full h-fit">
              <SelectMapTags
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                disabled={false}
              />
            </div>
          </div>
          {/* Map */}
          {renderMap()}

          {/* Add Organization Link */}
          {(!user || user?.memberstatus === "unverified") && (
            <div className="inline-flex justify-between mt-3 w-full flex-wrap">
              <div
                className="w-fit cursor-pointer underline text-light-green font-semibold ml-auto"
                onClick={
                  user
                    ? () => navigate("/membership-form")
                    : () => navigate("/sign-up")
                }
              >
                Become a member to add your organization!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
}

export default Map;