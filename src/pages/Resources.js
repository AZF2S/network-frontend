import {
  IconButton,
  Divider,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Dialog,
  Backdrop,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import React, { useState, useEffect, useCallback, useRef } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { styled } from "@mui/material/styles";
import { Stack } from "@mui/system";
import InfiniteScroll from "react-infinite-scroll-component";
import { Scrollbars } from "react-custom-scrollbars-2";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import noPreview from "../assets/resources/no-preview.png";
import CircularProgress from "@mui/material/CircularProgress";
import '.././config';
import { resourcesApi, progressApi } from '../api';

function Resources() {
  const [resources, setResources] = useState();
  const [loadedResources, setLoadedResources] = useState();
  const [filteredResources, setFilteredResources] = useState();
  const [revealedDescriptions, setRevealedDescriptions] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    Topics: [],
    Roles: ["(Select All)"],
    Age: [],
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [fullscreenResource, setFullscreenResource] = useState({});
  const [isInFullscreen, setIsInFullscreen] = useState(false);
  const [resourceLoadingStatus, setResourceLoadingStatus] = useState(false);

  const iframeRefs = useRef([]);

  const fetchMoreResources = () => {
    setLoadedResources([
      ...loadedResources,
      ...filteredResources.slice(
        loadedResources.length,
        loadedResources.length + 5
      ),
    ]);
  };

  const checkIframeHeaders = async (resource, headers) => {
    if (!headers) {
      return { ...resource, isEmbeddable: false };
    }
    const xFrameOptions = headers["x-frame-options"];
    const contentSecurityPolicy = headers["content-security-policy"];

    const isEmbeddable =
      (!xFrameOptions || xFrameOptions.toLowerCase() === "allow") &&
      (!contentSecurityPolicy ||
        !contentSecurityPolicy.toLowerCase().includes("frame-ancestors"));

    return { ...resource, isEmbeddable: isEmbeddable };
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const updateChecklistStep = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await progressApi.updateChecklistStep("resourceLibrary");
        console.log("Checklist step updated successfully");
      } catch (error) {
        console.error("Error updating checklist step:", error);
      }
    };
  
    updateChecklistStep();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const resources = await resourcesApi.getResources();
        const filteredResources = resources.filter(entry => entry['Author'] !== undefined && entry['Author'].trim() !== '');

        if (filteredResources) {
          setFilteredResources(filteredResources);
          setLoadedResources(filteredResources.slice(0, 5));
          setResources(filteredResources);
          
          const headerResults = await resourcesApi.fetchHeaders(filteredResources);
          const promises = headerResults.map(({ resource, headers }) =>
            checkIframeHeaders(resource, headers)
          );
          const results = await Promise.all(promises);
          setResourceLoadingStatus(true);
          setFilteredResources(results);
          setLoadedResources(results.slice(0, 5));
          setResources(results);
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    })();
  }, []);

  const toggleDescription = useCallback(
    (resource) => {
      setRevealedDescriptions((resources) =>
        resources.includes(resource)
          ? resources.filter((r) => r !== resource)
          : [...resources, resource]
      );
    },
    []
  );

  const handleFilter = useCallback(
    (category, event) => {
      if (event.target.labels[0].innerText === "(Select All)") {
        setSelectedFilters({
          Roles: selectedFilters[category].includes("(Select All)")
            ? []
            : ["(Select All)"],
          Topics: [],
          Age: [],
        });
      } else {
        if (selectedFilters["Roles"].includes("(Select All)")) {
          setSelectedFilters({ ...selectedFilters, Roles: [] });
        }
        setSelectedFilters((selectedFilters) =>
          selectedFilters[category]?.includes(event.target.labels[0].innerText)
            ? {
                ...selectedFilters,
                [category]: selectedFilters[category].filter(
                  (filter) => filter !== event.target.labels[0].innerText
                ),
              }
            : {
                ...selectedFilters,
                [category]: [
                  ...(selectedFilters[category] || []),
                  event.target.labels[0].innerText,
                ],
              }
        );
      }
    },
    [selectedFilters]
  );

  const handleApplyFilters = () => {
    let filteredResources = [];
    Object.keys(selectedFilters).forEach((category) => {
      selectedFilters[category].forEach((keyWord) => {
        if (keyWord === "(Select All)") {
          filteredResources = resources;
        }
        switch (category) {
          case "Roles":
            filteredResources = filteredResources.concat(
              resources.filter((r) =>
                r["Applicable Audience"]
                  .toLowerCase()
                  .includes(keyWord.toLowerCase())
              )
            );
            break;
          case "Topics":
            filteredResources = filteredResources.concat(
              resources.filter((r) =>
                r["Work Group"].toLowerCase().includes(keyWord.toLowerCase())
              )
            );
            break;
          case "Age":
            filteredResources = filteredResources.concat(
              resources.filter((r) =>
                r["Age Group"].toLowerCase().includes(keyWord.toLowerCase())
              )
            );
            break;
          default:
            // No action needed for unknown categories
            break;
        }
      });
    });
    filteredResources = Array.from(new Set(filteredResources));
    console.log(filteredResources);
    if (isFiltersOpen) {
      handleCloseFilters();
    }
    setFilteredResources(filteredResources);
    setLoadedResources(filteredResources.slice(0, 5));
  };

  const handleClearFilters = () => {
    setSelectedFilters({
      Topics: [],
      Roles: [],
      Age: [],
    });
  };

  const handleOpenFilters = () => {
    setIsFiltersOpen(true);
  };

  const handleCloseFilters = () => {
    setIsFiltersOpen(false);
  };

  const roles = [
    "Administrators & Food Directors",
    "Educators",
    "Students",
    "Producers",
    "Purchasers",
    "Other",
  ];
  const topics = [
    "Getting Started",
    "School Garden",
    "Food Education",
    "Farm to Early Care",
    "Procurement Workgroup",
    "Produce Related",
    "School Food Service",
    "Advocacy and Sustainability",
    "Reports and Tools",
  ];
  const age = ["Early Care", "K+", "K-5", "K-8", "K-12", "10+", "Adults"];

  const Filters = () => {
    return (
      <div className="w-56">
        <div className="flex items-center">
          <div className="font-[Kindest] text-4xl mt-4 mr-12">Filters</div>
        </div>
        <div className="my-4">
          <Button
            variant="contained"
            color="gray"
            sx={{ color: "#fff", marginRight: "1rem", textTransform: "none" }}
            onClick={handleClearFilters}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            color="lightGreen"
            sx={{ color: "#fff", textTransform: "none" }}
            onClick={handleApplyFilters}
          >
            Apply Filters
          </Button>
        </div>
        <FormControlLabel
          control={<Checkbox />}
          onChange={(e) => handleFilter("Roles", e)}
          label={"(Select All)"}
          checked={selectedFilters["Roles"]?.includes("(Select All)")}
          className="mb-2"
        />
        <Scrollbars
          style={{
            width: "calc(100% + 0.7rem)",
            height: "calc(100vh - 320px)",
            marginLeft: "-0.7rem",
          }}
        >
          <Stack
            spacing={2}
            style={{
              paddingRight: "16px",
              marginLeft: "0.7rem",
            }}
          >
            <div>
              <div className="text-xl font-medium my-2 font-[Gothic]">
                Roles
              </div>
              <Divider sx={{ borderBottomWidth: 2 }} />
              <FormGroup>
                {roles.map((role) => (
                  <FormControlLabel
                    key={role}
                    control={<Checkbox />}
                    onChange={(e) => handleFilter("Roles", e)}
                    label={role}
                    checked={selectedFilters["Roles"]?.includes(role)}
                  />
                ))}
              </FormGroup>
            </div>
            <div>
              <div className="text-xl font-medium my-2 font-[Gothic]">
                Topics
              </div>
              <Divider sx={{ borderBottomWidth: 2 }} />
              <FormGroup>
                {topics.map((topic) => (
                  <FormControlLabel
                    key={topic}
                    control={<Checkbox />}
                    onChange={(e) => handleFilter("Topics", e)}
                    label={topic}
                    checked={selectedFilters["Topics"]?.includes(topic)}
                  />
                ))}
              </FormGroup>
            </div>
            <div>
              <div className="text-xl font-medium my-2 font-[Gothic]">
                Age Groups
              </div>
              <Divider sx={{ borderBottomWidth: 2 }} />
              <FormGroup>
                {age.map((a) => (
                  <FormControlLabel
                    key={a}
                    control={<Checkbox />}
                    onChange={(e) => handleFilter("Age", e)}
                    label={a}
                    checked={selectedFilters["Age"]?.includes(a)}
                  />
                ))}
              </FormGroup>
            </div>
          </Stack>
        </Scrollbars>
      </div>
    );
  };

  return (
    <div className="flex justify-center">
      <div className="w-full">
        <div className="flex justify-center">
          <div className="w-full h-48 bg-center bg-no-repeat relative bg-cover bg-resources-header">
            <div className="flex items-center justify-center h-full">
              <div className="w-fit h-fit bg-light-green rounded-lg">
                <div className="p-3 text-white font-[Kindest] text-5xl">
                  Resource Library
                </div>
              </div>
            </div>
          </div>
        </div>
        <Box sx={{ textAlign: 'center', mt: 3, mb: 3 }}>
          <Typography variant="h6" component="p">
            Can't find what you're looking for?{' '}
            <RouterLink 
              to="/submit-a-resource" 
              style={{ color: '#568571', fontWeight: 'bold' }}
            >
              Submit a new resource
            </RouterLink>{' '}
            to our library!
          </Typography>
        </Box>
        <div className="flex mx-16 mt-4">
          <div className="min-w-fit sticky h-fit top-24 mr-16 hidden md:block">
            <Filters />
          </div>
          <div className="w-full">
            <div className="sticky top-24 block md:hidden">
              <Button
                variant="contained"
                className="w-full h-12"
                sx={{ color: "#fff", fontWeight: "600" }}
                color="purple"
                onClick={handleOpenFilters}
              >
                Filters
              </Button>
              <Dialog onClose={handleCloseFilters} open={isFiltersOpen}>
                <div className="mx-8">
                  <Filters />
                </div>
              </Dialog>
            </div>
            <InfiniteScroll
              dataLength={loadedResources?.length || 0}
              next={fetchMoreResources}
              hasMore={loadedResources?.length < filteredResources?.length}
              loader={<CircularProgress />}
              scrollThreshold={0.9}
            >
              <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-x-10">
                {loadedResources?.map((resource, index) => (
                  <div className="col-span-1 my-4 flex" key={index}>
                    <div className="aspect-[3/4] w-2/5 hidden sm:block">
                      {resourceLoadingStatus ? (
                        <div className="w-full h-full border-2 border-solid border-light-green rounded-lg shadow-lg overflow-hidden">
                          {resource.isEmbeddable ? (
                            <>
                              <Button
                                aria-label="fullscreen"
                                variant="contained"
                                color="lightGreen"
                                sx={{
                                  position: "absolute",
                                  minWidth: "0",
                                  padding: "7px",
                                  boxShadow: "none",
                                }}
                                onClick={() => {
                                  setFullscreenResource(resource);
                                  setIsInFullscreen(true);
                                  console.log(resource);
                                }}
                              >
                                <FullscreenIcon />
                              </Button>
                              <iframe
                                src={resource.Link}
                                title={resource.Title}
                                className="w-full h-full border-0"
                                ref={(ref) => (iframeRefs.current[index] = ref)}
                              />
                            </>
                          ) : (
                            <div className="w-full h-full overflow-hidden bg-light-gray">
                              <div className="flex justify-center w-full h-full items-center">
                                <div className="flex flex-col gap-y-10">
                                  <img 
                                    src={noPreview} 
                                    className="w-fit" 
                                    alt="No preview available"
                                  />
                                  <div className="text-xl text-center">
                                    No Preview Available
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-full overflow-hidden bg-light-gray border-2 border-solid border-light-green rounded-lg shadow-lg">
                          <div className="flex justify-center w-full h-full items-center">
                            <div className="text-xl text-center">
                              <CircularProgress />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 w-full h-max border-2 border-solid border-light-green rounded-lg sm:border-none sm:w-3/5">
                      <div className="m-2 sm:m-0">
                        <h2 className="font-[Kindest] text-light-green text-xl my-0">
                          <a
                            href={resource.Link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-light-green visited:text-eggplant active:text-none"
                          >
                            {resource.Title}
                          </a>
                        </h2>
                        <div className="my-4">
                          <div>
                            <strong>By: </strong>
                            {resource.Author}
                            {/^\d+$/.test(resource.Year)
                              ? " (" + resource.Year + ")"
                              : ""}
                          </div>
                          <div>
                            {resource["Applicable Audience"] && resource["Applicable Audience"].trim() !== "" && (
                            <div>
                                <strong>For: </strong>
                                {resource["Applicable Audience"]}
                            </div>
                            )}
                            {resource["Age Group"] && resource["Age Group"].trim() !== "" && (
                              <div>
                                  <strong>Age group: </strong>
                                  {resource["Age Group"]}
                              </div>
                            )}
                        </div>
                        </div>
                        <div className="font-semibold text-sage">
                          {resource["Work Group"]}
                        </div>
                        <div
                          className="my-4 underline flex items-center cursor-pointer w-fit"
                          onClick={() => toggleDescription(resource.Title)}
                        >
                          See Description{" "}
                          {revealedDescriptions.includes(resource.Title) ? (
                            <ArrowDropDownIcon />
                          ) : (
                            <ArrowDropUpIcon />
                          )}
                        </div>
                        <div
                          className={`${
                            revealedDescriptions.includes(resource.Title)
                              ? "sm:flex flex"
                              : "sm:hidden hidden"
                          }`}
                        >
                          {resource["Brief Explanation"]}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </InfiniteScroll>
            <Dialog
              onClose={() => setIsInFullscreen(false)}
              open={isInFullscreen}
              maxWidth="false"
              PaperProps={{
                style: {
                  backgroundColor: "transparent",
                  overflowY: "hidden",
                  boxShadow: "none",
                },
              }}
              BackdropComponent={styled(Backdrop, {
                name: "MuiModal",
                slot: "Backdrop",
                overridesResolver: (props, styles) => {
                  return styles.backdrop;
                },
              })({ backgroundColor: "rgba(0, 0, 0, 0.95)" })}
            >
              <div className="flex justify-end mb-1">
                <Stack direction="row" spacing={1}>
                  <IconButton href={fullscreenResource.Link} target="_blank">
                    <OpenInNewIcon color="white" />
                  </IconButton>
                  <IconButton onClick={() => setIsInFullscreen(false)}>
                    <CloseIcon color="white" />
                  </IconButton>
                </Stack>
              </div>
              <div className="aspect-[3/4] h-[calc(100vmin-32px)] rounded-lg">
                <iframe
                  src={fullscreenResource.Link}
                  title={fullscreenResource.Title}
                  className="h-full w-full border-0 rounded-lg"
                />
              </div>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resources;
