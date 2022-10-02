# CSE201-Final-Project

Final project for CSE201
---
[Requirements document](https://docs.google.com/document/d/1E-UznHZ-zJSqqw9RpSeU8gU_d59jh9CuLEHOnF2Zn5w/edit)

[Working Log](https://docs.google.com/spreadsheets/d/1gw_QMtjQIW16OEdYbZCXAvHrfJEK8sqc-DnvQCiHKko/edit#gid=0)

## Setup instructions using VScode and Windows 10

### Pulling from the Github repository

Install the git extension from the marketplace. Invoke the command palette with __ctrl+shift+p__, then enter:
> gitcl  

Login to github, select this repository, then choose a location on your hard drive to clone the repository to. This will become your project directory.

### Building a Docker container

To use the dockerfile, first install the Docker and WSL extensions from the marketplace. You might be prompted to install the Docker Desktop application, which you will need.

Navigate to your project directory with the Ubuntu terminal from WSL, then run the following commands, replacing the bracketed arguments with names of your choice:
> docker build -t [container name]  
> docker run -d -p80:80 [container name]  

You will be prompted to allow docker to access networks. Select yes. You should now be hosting the project source files.

### Determining IP address

Open command prompt, then type:
> ipconfig  

This should bring up information about your machine's IP addresses. Find your IPv4 address under __Wireless LAN adapter Wi-Fi__.

### Accessing the webpage

Enter your machine's IP address into your browser while your docker container is running. You should see the repository source files.
