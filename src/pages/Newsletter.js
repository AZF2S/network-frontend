import { Stack } from "@mui/material";
import { React, useEffect } from "react";
import CardButton from "../components/CardButton.js";

const Newsletter = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // TODO: Add service to get newsletter objects from Google Sheets. 
  return (
    <div className="flex justify-center">
      <div className="w-full">
        <div className="flex justify-center">
          <div className="w-full h-[200px] bg-bottom bg-no-repeat relative bg-cover bg-newsletter-header">
            <div className="p-12 h-full">
              <div className="flex items-end justify-left h-full">
                <div className="w-fit h-fit bg-dark-green rounded-lg">
                  <div className="p-3 text-white font-[Kindest] text-5xl">
                    Newsletter
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-16">
          <div className="flex w-full h-auto bg-dark-green my-14 rounded-xl">
            <div className="w-[37.5%] h-auto bg-center bg-no-repeat bg-cover bg-subscribe-header rounded-l-xl"></div>
            <div className="w-[62.5%] h-full block mx-10 flex flex-col">
              <div className="my-6 font-[Kindest] text-white text-3xl">
                Subscribe to the Newsletter
              </div>
              <div className="text-white my-6 flex-grow">
                Stay up to date with what's happening in the AZ Farm to School
                Network. Learn about events in your area and how to get involved
                in your community.
              </div>

              <a
                  rel="noreferrer"
                  target="_blank"
                  href="https://gmail.us11.list-manage.com/subscribe?u=8ab36a253b7d3786969d0a77d&id=a16a0fde59"
              >
                <CardButton color="#0C2B1C" text="Subscribe"></CardButton>
              </a>
              <br></br>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-10">
            <div className="h-80 w-64 bg-orange rounded-xl shadow-lg">
              <div className="h-1/2 bg-center bg-no-repeat bg-cover bg-news-header-1 rounded-t-xl" />
              <div className="flex justify-center h-1/2 items-center">
                <div className="block">
                  <Stack spacing={2}>
                    <div className="font-[Gothic] text-white text-3xl uppercase">
                      May 2023
                    </div>
                    <div className="flex justify-center h-1/2">
                      <a rel="noreferrer" target="_blank" href="https://mailchi.mp/93491d7bb52e/network-news-az-farm-to-school-6230949">
                        <CardButton color="#B55B2C" text="Read"></CardButton>
                      </a>
                    </div>
                  </Stack>
                </div>
              </div>
            </div>
            <div className="h-80 w-64 bg-orange rounded-xl shadow-lg">
              <div className="h-1/2 bg-center bg-no-repeat bg-cover bg-news-header-2 rounded-t-xl" />
              <div className="flex justify-center h-1/2 items-center">
                <div className="block">
                  <Stack spacing={2}>
                    <div className="font-[Gothic] text-white text-3xl uppercase">
                      April 2023
                    </div>
                    <div className="flex justify-center h-1/2">
                      <a rel="noreferrer" target="_blank" href="https://us11.campaign-archive.com/?u=8ab36a253b7d3786969d0a77d&id=40c854468f">
                        <CardButton color="#B55B2C" text="Read"></CardButton>
                      </a>
                    </div>
                  </Stack>
                </div>
              </div>
            </div>
            <div className="h-80 w-64 bg-orange rounded-xl shadow-lg">
              <div className="h-1/2 bg-center bg-no-repeat bg-cover bg-news-header-3 rounded-t-xl" />
              <div className="flex justify-center h-1/2 items-center">
                <div className="block">
                  <Stack spacing={2}>
                    <div className="font-[Gothic] text-white text-3xl uppercase">
                      March 2023
                    </div>
                    <div className="flex justify-center h-1/2">
                      <a rel="noreferrer" target="_blank" href="https://us11.campaign-archive.com/?u=8ab36a253b7d3786969d0a77d&id=3cea9be3c9">
                        <CardButton color="#B55B2C" text="Read"></CardButton>
                      </a>
                    </div>
                  </Stack>
                </div>
              </div>
            </div>
          </div>
          <br/>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
