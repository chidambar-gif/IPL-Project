# IPL-Project

# Setup
## Setting Up the Project Directory
``` bash 
mkdir IPL-Project
cd IPL-Project
```
Next, initialize the directory as an npm project using the npm init command and install necessary pacakges:
``` bash 
npm init -y
npm install csv
npm install sqlite3
```

## Configure Path
The csv files are placed under the "DataSet" folder in the root directory.
``` bash
          
└── DataSet
    ├── IPL Ball-by-Ball 2008-2020/
    └── IPL Matches 2008-2020/
```

# Running
Run the javascript file using the command.
``` bash
node index.js
```
