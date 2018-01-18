import { Constants } from "../../../common/app-settings/constants"

// List of Authenticated Users
export const Users = [
                {
                    userId:1,
                    userName: "commandcenter"                  
                }
];

// exports User's Site level authorisation
export const UsersBoroughSiteMapping = [
    {
        id:1,
        userId:1,
        boroughName:"Manhattan",
        siteNames:[
          "Beaver",
          "MOC",
          "Anywhere needed!",
          "Any Manhattan site!",
          'Manhattan: demotest, 18th Floor (33 Beaver St.)',
          'Manhattan: Hunter College, West Building (695 Park Ave (Main Campus))',
          'Manhattan: PS 116 (210 East 33rd St)',
          'Manhattan: PS 191 - Amsterdam School (210 West 61st Street)',
          'Manhattan: PS 128 - Audubon (560 W.169th St.)',
          'Manhattan: PS 41 - Greenwich Village (116 W 11th St.)',
          'Manhattan: PS 57 - James Weldon Johnson (176 E.115th St.)',
          'Manhattan: 40 Broad Street "End of Line Site" (40 Broad Street)',
        ]
    },
    {
        id:2,
        userId:2,
        boroughName:"Manhattan",
        siteNames:[
          'Anywhere Needed!'
        ]
    },
]
