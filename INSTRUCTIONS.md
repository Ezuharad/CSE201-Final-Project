# Installation Instructions for Windows 10
---
## Dependencies
- Git. 
Instructions for installing Git can be found [here](https://learn.microsoft.com/en-us/devops/develop/git/install-and-set-up-git). Be sure to add Git to PATH
- Docker Hub. 
Instructions for installing Docker Hub can be found [here](https://docs.docker.com/desktop/install/windows-install/). Be sure to add Docker to PATH

## Downloading and Starting the Program
1. Open a new powershell window in the folder you want the program in. Enter the command:
> git clone https://github.com/Ezuharad/CSE201-Final-Project

This should download the source files from the Guthub repository
2. Start docker desktop. Then, using the powershell window from before, navigate to the newly created directory and enter the command:
> docker build . -t game

This will build a docker image called 'game'. The name 'game' is entirely completely arbitrary. Feel free to use any name you wish.
3. Enter the command:
> docker run -p 8080:9999 -t game

Changing 'game' to whatever name you used in step 2.

## Accessing the Program
> ipconfig

This will bring up information regarding your computer's IP address.
Enter the IP address under 'Wireless LAN adapter Wi-Fi' into your browser with port '8080'. For example, if your IP address is '1.2.3.4', enter '1.2.3.4:8080'. This will take you to the webpage index using any device connected to the same Wi-Fi network.
