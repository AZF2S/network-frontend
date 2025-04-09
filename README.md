# AZ Farm to School Network

This repository contains the source code for the AZ Farm to School Network website, a project that aims to promote and facilitate farm-to-school programs in Arizona. The platform serves as a hub for resources, community forum, newsletters, a network map, event calendar and more, all targeted at connecting local farms with schools and other educational institutions.

## Table of Contents

- [Website](#website)
- [NodeBB Forum](#nodebb-forum)
- [Proxy](#proxy)
- [AWS](#aws)
- [MongoDB](#mongodb)
- [To-Do](#to-do)

## Website

### Frontend

- **Home**: Provides information about the organization and links to different sections of the website.
- **About Us**
  - *Who we are*: Information about workgroup chairs and a link to join the workgroup.
  - *Contact Us*: A form for users to send contact emails.
- **Resources**
  - *Resource Library*: Previews of resources with information, and filters for specific roles, topics, and age groups. Resources are fetched from a Google Sheet via the Google Sheets API.
  - *FAQs*: Displays FAQs for the general audience and collaborators, fetched from a Google Sheet.
  - *Newsletter*: Lists recently released newsletters fetched from the Mailchimp API, and a button to subscribe to the newsletter.
  - *Network Map*: Map of all schools, farms, and other organizations, with filters for searching locations. Data is fetched from a Google Sheet.
- **Connect**
  - *Community Forum*: A forum page using the NodeBB open source library.
  - *Events Calendar*: Fetches events posted on a Google Sheet and displays them on a Google Calendar.
  - *Contact List*: Shows all registered users in the Arizona Farm to School Network.
- **Account**
  - *Overview*: User's profile and inbox, links to forum posts, and a logout button.
  - *Edit Profile*: Allows users to change their profile details.
  - *Settings*: Allows users to change email, set notifications, and delete their account.

## NodeBB Forum

### Frontend

- **Regular User**: Same as listed in the website frontend.
- **Admin**: Same as regular user but with additional options to manage the forum.

## Proxy

- **Session Validation**: Middleware for validating user sessions using cookies provided by the NodeBB API.

## AWS

- **Website**: Hosts build files from the repo using `npx serve -s build`.
- **Proxy**: Handles routing of domain names and IP addresses with Nginx.
- **API**: The express proxy is hosted here with endpoints at `http(s)://{ DOMAIN }/api/express`. Started with `node server.js`.
- **Forum**: Hosts the NodeBB Forum. Started/stopped with `nodebb start/stop`.

## MongoDB

- Hosted with MongoDB Atlas.
- Follows NodeBB's architecture with custom fields added for users and settings.
- Stores valid user sessions.
- Database Structure: [https://docs.nodebb.org/development/database-structure/](https://docs.nodebb.org/development/database-structure/)

## To-Do

### Account
- Link roles to groups when a user signs up
- Link people to forum profile page
- Add icon links to settings, edit profile, and messages

### Login
- Fix authentication error

### Newsletter
- Link to Mailchimp API
- Change UI for updated newsletters

### Map
- Add new filters to the Google sheet
- Clean and organize map data
- Add validation for adding a location
- Add new icons and colors for org types
- Add people who are a part of the organization

### Contact List
- Refactor logic for filters
- Add messaging functionality
- Link to forum profile page

