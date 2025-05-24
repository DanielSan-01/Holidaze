# Project Notes

---

**[Previous Branches]**
- `feature/hotel-cards`: Implemented hotel card grid and hotel data fetching.
- `feature/tailwind-setup`: Set up Tailwind CSS and initial global styles.
- `feature/basic-layout`: Created initial page structure and container layout.

---

**[React Migration Changes]**

1. **Build Configuration**
- Updated Vite config to support React and client-side routing
- Added historyApiFallback for proper React Router handling
- Configured port and development server settings
```js
// vite.config.js changes
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    historyApiFallback: true // Enables client-side routing
  }
});
```

2. **Style Processing**
- Added PostCSS for advanced CSS processing capabilities
- Configured autoprefixer to handle browser-specific CSS prefixes
- Added WebKit text adjustments for better mobile rendering
```js
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}, // Handles vendor prefixes automatically
  },
}
```

3. **Tailwind Configuration**
- Updated content paths to include JSX files
- Improved file scanning patterns
```js
// tailwind.config.js
content: [
  "./index.html",
  "./src/**/*.{js,jsx,ts,tsx}", // Include all React file types
],
```

4. **HTML Structure**
- Removed legacy class-based structure
- Added meta description for SEO
- Properly configured root element for React mounting
- Added cross-origin attributes for font loading

5. **Component Changes**
- Converted all class components to functional components
- Updated file extensions from .js to .jsx
- Implemented proper React Router v6 syntax
- Added proper event handling and state management

---

**[Commit Message Style Explanations]**

feat(build): Configure Vite for React and client-side routing
- Added historyApiFallback for proper route handling
- Configured development server settings
- Ensures proper module resolution for React

feat(styles): Add PostCSS and cross-browser compatibility
- Added autoprefixer for vendor prefix handling
- Configured WebKit text adjustments for mobile
- Improves text rendering across different browsers

feat(components): Migrate to React functional components
- Converted class components to functional components
- Updated file extensions to .jsx
- Implements React best practices

chore(config): Update Tailwind configuration
- Added JSX file pattern scanning
- Improved content path configuration
- Ensures proper style processing for React components

---

**[Style Handling]**
- PostCSS: Added for advanced CSS processing and future compatibility
- WebKit: Added text-size-adjust properties to prevent mobile browsers from automatically adjusting text size
- Autoprefixer: Automatically handles vendor prefixes for cross-browser compatibility

---

**[React Router Implementation]**
- Using React Router v6 with BrowserRouter
- Implemented protected routes for authenticated sections
- Added proper navigation handling with useNavigate hook

---

**[Component Structure]**
- App.jsx: Main application wrapper with routing
- NavMenu.jsx: Navigation component with auth awareness
- AuthContext.jsx: Authentication state management
- Protected components: Wrapped with auth checks

---

**[NavMenu]**
- Created a navigation bar component with logo, three links, and a profile icon.
- Moved nav styles to a dedicated CSS file (`NavMenu.css`).
- Injected the nav into a `<header>` element in `index.html`.
- Updated nav link names to: Home, Venues, New booking.
- Set nav link color to black, with underline on active (future: add logic for active state if needed).

**[Footer]**
- Created a simple one-line footer component and CSS, rendered in a `<footer>` element in `index.html`.
- Footer text: "Holidaze all rights reserved 2025 ©".

**[Global Styles]**
- Imported the "Outfit" font from Google Fonts in `index.html`.
- Set `font-family: 'Outfit', sans-serif;` globally in `styles.css`.

---


docs.noroff.dev
Noroff API Documentation
~2 minutes

Noroff APIDocumentation

Holidaze
Profiles

Profiles related to Holidaze

These are authenticated endpoints. You can visit authentication to register an account.

This endpoint allows you to manage profiles. They are the users of the Holidaze site.

These endpoints support pagination and sorting. Read more about these features here.
Prop	Type	Default

name
	

string
	-

email
	

string
	-

banner
	

object
	-

avatar
	

object
	-

venueManager
	

boolean
	-

_count
	

Object
	-

Not all of the properties of a profile are returned by default. You can use the following optional query parameters to include additional properties in the response.
Prop	Type	Default

_bookings
	

boolean
	false

_venues
	

boolean
	false

GET/holidaze/profiles

Retrieve all profiles.

GET/holidaze/profiles/<name>

Retrieve a single profile by its id.

GET/holidaze/profiles/<name>/bookings

Retrieve all bookings made by profile.

The response is the same as the bookings endpoint, and accepts the same optional query parameters and flags.

GET/holidaze/profiles/<name>/venues

Retrieve all venues made by profile.

The response is the same as the venues endpoint, and accepts the same optional query parameters and flags.

PUT/holidaze/profiles/<name>

Update or set bio, venueManager, banner and avatar properties.

You may provide any combination of the properties, but at least one must be provided.

Please note that the avatar.url and banner.url properties must be fully formed URLs that links to live and publicly accessible images. The API will check the provided URLs and if they cannot be accessed publicly you will receive a 400 Bad Request error response.

GET/holidaze/profiles/search?q=<query>

Search for profiles by their name or bio properties.

Edit on GitHub


swagger ui



v2.api.noroff.dev
Swagger UI
Authorize
18–22 minutes

status

Health check endpoint
auth

Auth related endpoints
books

Books related endpoints
cat-facts

Cat Facts related endpoints
jokes

Jokes related endpoints
nba-teams

NBA teams related endpoints
old-games

Old games related endpoints
e-com

E-commerce related endpoints
quotes

Quotes related endpoints
online-shop

Online shop related endpoints
auction-profiles

Auction profiles related endpoints
auction-listings

Auction listings related endpoints
holidaze-profiles

Holidaze profiles related endpoints

Name	Description

sort

string

(query)
	

sortOrder

string

(query)
	

limit

integer

(query)
	

page

integer

(query)
	

_bookings

boolean

(query)
	

_venues

boolean

(query)
	
Code	Description
200	

Default Response

{
  "data": [
    {
      "name": "XvFCorXWGByWAcXF_Jkx",
      "email": "user@example.com",
      "bio": "string",
      "avatar": {
        "url": "string",
        "alt": ""
      },
      "banner": {
        "url": "string",
        "alt": ""
      },
      "venueManager": true,
      "venues": [
        {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "name": "string",
          "description": "string",
          "media": [
            {
              "url": "string",
              "alt": ""
            }
          ],
          "price": 0,
          "maxGuests": 0,
          "rating": 0,
          "created": "2025-05-23T17:20:33.794Z",
          "updated": "2025-05-23T17:20:33.794Z",
          "meta": {
            "wifi": true,
            "parking": true,
            "breakfast": true,
            "pets": true
          },
          "location": {
            "address": "string",
            "city": "string",
            "zip": "string",
            "country": "string",
            "continent": "string",
            "lat": 0,
            "lng": 0
          },
          "owner": {
            "name": "TaVQa0Cgh0svQoaJOeC0",
            "email": "user@example.com",
            "bio": "string",
            "avatar": {
              "url": "string",
              "alt": ""
            },
            "banner": {
              "url": "string",
              "alt": ""
            }
          },
          "_count": {
            "bookings": 0
          }
        }
      ],
      "bookings": [
        {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "dateFrom": "2025-05-23T17:20:33.794Z",
          "dateTo": "2025-05-23T17:20:33.794Z",
          "guests": 0,
          "created": "2025-05-23T17:20:33.794Z",
          "updated": "2025-05-23T17:20:33.794Z",
          "venue": {
            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "name": "string",
            "description": "string",
            "media": [
              {
                "url": "string",
                "alt": ""
              }
            ],
            "price": 0,
            "maxGuests": 0,
            "rating": 0,
            "created": "2025-05-23T17:20:33.794Z",
            "updated": "2025-05-23T17:20:33.794Z",
            "meta": {
              "wifi": true,
              "parking": true,
              "breakfast": true,
              "pets": true
            },
            "location": {
              "address": "string",
              "city": "string",
              "zip": "string",
              "country": "string",
              "continent": "string",
              "lat": 0,
              "lng": 0
            },
            "owner": {
              "name": "1EW_6h6e4uy1N443Djuv",
              "email": "user@example.com",
              "bio": "string",
              "avatar": {
                "url": "string",
                "alt": ""
              },
              "banner": {
                "url": "string",
                "alt": ""
              }
            },
            "_count": {
              "bookings": 0
            }
          },
          "customer": {
            "name": "7zYrblpJbP2lNTZVfAhp",
            "email": "user@example.com",
            "bio": "string",
            "avatar": {
              "url": "string",
              "alt": ""
            },
            "banner": {
              "url": "string",
              "alt": ""
            }
          }
        }
      ],
      "_count": {
        "venues": 0,
        "bookings": 0
      }
    }
  ],
  "meta": {}
}

Name	Description

_bookings

boolean

(query)
	

_venues

boolean

(query)
	

name *

string

(path)
	
Code	Description
200	

Default Response

{
  "data": {
    "name": "jRvhbOpM57ZyJbNKsW21",
    "email": "user@example.com",
    "bio": "string",
    "avatar": {
      "url": "string",
      "alt": ""
    },
    "banner": {
      "url": "string",
      "alt": ""
    },
    "venueManager": true,
    "venues": [
      {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "name": "string",
        "description": "string",
        "media": [
          {
            "url": "string",
            "alt": ""
          }
        ],
        "price": 0,
        "maxGuests": 0,
        "rating": 0,
        "created": "2025-05-23T17:20:33.797Z",
        "updated": "2025-05-23T17:20:33.797Z",
        "meta": {
          "wifi": true,
          "parking": true,
          "breakfast": true,
          "pets": true
        },
        "location": {
          "address": "string",
          "city": "string",
          "zip": "string",
          "country": "string",
          "continent": "string",
          "lat": 0,
          "lng": 0
        },
        "owner": {
          "name": "RiJAlP9N7M7jnzc8gVcO",
          "email": "user@example.com",
          "bio": "string",
          "avatar": {
            "url": "string",
            "alt": ""
          },
          "banner": {
            "url": "string",
            "alt": ""
          }
        },
        "_count": {
          "bookings": 0
        }
      }
    ],
    "bookings": [
      {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "dateFrom": "2025-05-23T17:20:33.797Z",
        "dateTo": "2025-05-23T17:20:33.797Z",
        "guests": 0,
        "created": "2025-05-23T17:20:33.797Z",
        "updated": "2025-05-23T17:20:33.797Z",
        "venue": {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "name": "string",
          "description": "string",
          "media": [
            {
              "url": "string",
              "alt": ""
            }
          ],
          "price": 0,
          "maxGuests": 0,
          "rating": 0,
          "created": "2025-05-23T17:20:33.797Z",
          "updated": "2025-05-23T17:20:33.797Z",
          "meta": {
            "wifi": true,
            "parking": true,
            "breakfast": true,
            "pets": true
          },
          "location": {
            "address": "string",
            "city": "string",
            "zip": "string",
            "country": "string",
            "continent": "string",
            "lat": 0,
            "lng": 0
          },
          "owner": {
            "name": "opovqtnl9K8KEbf7lB80",
            "email": "user@example.com",
            "bio": "string",
            "avatar": {
              "url": "string",
              "alt": ""
            },
            "banner": {
              "url": "string",
              "alt": ""
            }
          },
          "_count": {
            "bookings": 0
          }
        },
        "customer": {
          "name": "oz10GrnRFuN2vkyLUjA1",
          "email": "user@example.com",
          "bio": "string",
          "avatar": {
            "url": "string",
            "alt": ""
          },
          "banner": {
            "url": "string",
            "alt": ""
          }
        }
      }
    ],
    "_count": {
      "venues": 0,
      "bookings": 0
    }
  },
  "meta": {}
}

Name	Description

body

object

(body)
	

{
  "avatar": {
    "url": "string",
    "alt": ""
  },
  "banner": {
    "url": "string",
    "alt": ""
  },
  "venueManager": true,
  "bio": "string"
}

Parameter content type

name *

string

(path)
	
Code	Description
200	

Default Response

{
  "data": {
    "name": "JL",
    "email": "user@example.com",
    "bio": "string",
    "avatar": {
      "url": "string",
      "alt": ""
    },
    "banner": {
      "url": "string",
      "alt": ""
    },
    "venueManager": true,
    "venues": [
      {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "name": "string",
        "description": "string",
        "media": [
          {
            "url": "string",
            "alt": ""
          }
        ],
        "price": 0,
        "maxGuests": 0,
        "rating": 0,
        "created": "2025-05-23T17:20:33.804Z",
        "updated": "2025-05-23T17:20:33.804Z",
        "meta": {
          "wifi": true,
          "parking": true,
          "breakfast": true,
          "pets": true
        },
        "location": {
          "address": "string",
          "city": "string",
          "zip": "string",
          "country": "string",
          "continent": "string",
          "lat": 0,
          "lng": 0
        },
        "owner": {
          "name": "jioJBG6DTRwm8Loziy1D",
          "email": "user@example.com",
          "bio": "string",
          "avatar": {
            "url": "string",
            "alt": ""
          },
          "banner": {
            "url": "string",
            "alt": ""
          }
        },
        "_count": {
          "bookings": 0
        }
      }
    ],
    "bookings": [
      {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "dateFrom": "2025-05-23T17:20:33.805Z",
        "dateTo": "2025-05-23T17:20:33.805Z",
        "guests": 0,
        "created": "2025-05-23T17:20:33.805Z",
        "updated": "2025-05-23T17:20:33.805Z",
        "venue": {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "name": "string",
          "description": "string",
          "media": [
            {
              "url": "string",
              "alt": ""
            }
          ],
          "price": 0,
          "maxGuests": 0,
          "rating": 0,
          "created": "2025-05-23T17:20:33.805Z",
          "updated": "2025-05-23T17:20:33.805Z",
          "meta": {
            "wifi": true,
            "parking": true,
            "breakfast": true,
            "pets": true
          },
          "location": {
            "address": "string",
            "city": "string",
            "zip": "string",
            "country": "string",
            "continent": "string",
            "lat": 0,
            "lng": 0
          },
          "owner": {
            "name": "vGXCJUUPBhO7Rmz7fcWs",
            "email": "user@example.com",
            "bio": "string",
            "avatar": {
              "url": "string",
              "alt": ""
            },
            "banner": {
              "url": "string",
              "alt": ""
            }
          },
          "_count": {
            "bookings": 0
          }
        },
        "customer": {
          "name": "U1FYRw4p0aITEYb49vA1",
          "email": "user@example.com",
          "bio": "string",
          "avatar": {
            "url": "string",
            "alt": ""
          },
          "banner": {
            "url": "string",
            "alt": ""
          }
        }
      }
    ],
    "_count": {
      "venues": 0,
      "bookings": 0
    }
  },
  "meta": {}
}

Name	Description

sort

string

(query)
	

sortOrder

string

(query)
	

limit

integer

(query)
	

page

integer

(query)
	

_bookings

boolean

(query)
	

_venues

boolean

(query)
	

q *

string

(query)
	
Code	Description
200	

Default Response

{
  "data": [
    {
      "name": "thRR0jDBn9jghy0dyFlx",
      "email": "user@example.com",
      "bio": "string",
      "avatar": {
        "url": "string",
        "alt": ""
      },
      "banner": {
        "url": "string",
        "alt": ""
      },
      "venueManager": true,
      "venues": [
        {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "name": "string",
          "description": "string",
          "media": [
            {
              "url": "string",
              "alt": ""
            }
          ],
          "price": 0,
          "maxGuests": 0,
          "rating": 0,
          "created": "2025-05-23T17:20:33.809Z",
          "updated": "2025-05-23T17:20:33.809Z",
          "meta": {
            "wifi": true,
            "parking": true,
            "breakfast": true,
            "pets": true
          },
          "location": {
            "address": "string",
            "city": "string",
            "zip": "string",
            "country": "string",
            "continent": "string",
            "lat": 0,
            "lng": 0
          },
          "owner": {
            "name": "TkfTzcSWCl3ZpKbAh7EX",
            "email": "user@example.com",
            "bio": "string",
            "avatar": {
              "url": "string",
              "alt": ""
            },
            "banner": {
              "url": "string",
              "alt": ""
            }
          },
          "_count": {
            "bookings": 0
          }
        }
      ],
      "bookings": [
        {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "dateFrom": "2025-05-23T17:20:33.809Z",
          "dateTo": "2025-05-23T17:20:33.809Z",
          "guests": 0,
          "created": "2025-05-23T17:20:33.809Z",
          "updated": "2025-05-23T17:20:33.809Z",
          "venue": {
            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "name": "string",
            "description": "string",
            "media": [
              {
                "url": "string",
                "alt": ""
              }
            ],
            "price": 0,
            "maxGuests": 0,
            "rating": 0,
            "created": "2025-05-23T17:20:33.809Z",
            "updated": "2025-05-23T17:20:33.809Z",
            "meta": {
              "wifi": true,
              "parking": true,
              "breakfast": true,
              "pets": true
            },
            "location": {
              "address": "string",
              "city": "string",
              "zip": "string",
              "country": "string",
              "continent": "string",
              "lat": 0,
              "lng": 0
            },
            "owner": {
              "name": "pBc9pQHuJPgElNxsAD22",
              "email": "user@example.com",
              "bio": "string",
              "avatar": {
                "url": "string",
                "alt": ""
              },
              "banner": {
                "url": "string",
                "alt": ""
              }
            },
            "_count": {
              "bookings": 0
            }
          },
          "customer": {
            "name": "Zq6Z7vhzaBfzPOZQIRB2",
            "email": "user@example.com",
            "bio": "string",
            "avatar": {
              "url": "string",
              "alt": ""
            },
            "banner": {
              "url": "string",
              "alt": ""
            }
          }
        }
      ],
      "_count": {
        "venues": 0,
        "bookings": 0
      }
    }
  ],
  "meta": {}
}

Name	Description

sort

string

(query)
	

sortOrder

string

(query)
	

limit

integer

(query)
	

page

integer

(query)
	

_owner

boolean

(query)
	

_bookings

boolean

(query)
	

name *

string

(path)
	
Code	Description
200	

Default Response

{
  "data": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "string",
      "description": "string",
      "media": [
        {
          "url": "string",
          "alt": ""
        }
      ],
      "price": 0,
      "maxGuests": 0,
      "rating": 0,
      "created": "2025-05-23T17:20:33.813Z",
      "updated": "2025-05-23T17:20:33.813Z",
      "meta": {
        "wifi": true,
        "parking": true,
        "breakfast": true,
        "pets": true
      },
      "location": {
        "address": "string",
        "city": "string",
        "zip": "string",
        "country": "string",
        "continent": "string",
        "lat": 0,
        "lng": 0
      },
      "owner": {
        "name": "XYXazXsXTa18QvPQVHGp",
        "email": "user@example.com",
        "bio": "string",
        "avatar": {
          "url": "string",
          "alt": ""
        },
        "banner": {
          "url": "string",
          "alt": ""
        }
      },
      "bookings": [
        {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "dateFrom": "2025-05-23T17:20:33.813Z",
          "dateTo": "2025-05-23T17:20:33.813Z",
          "guests": 0,
          "created": "2025-05-23T17:20:33.813Z",
          "updated": "2025-05-23T17:20:33.813Z",
          "customer": {
            "name": "KllMrV79fI6htSVP7h3u",
            "email": "user@example.com",
            "bio": "string",
            "avatar": {
              "url": "string",
              "alt": ""
            },
            "banner": {
              "url": "string",
              "alt": ""
            }
          }
        }
      ],
      "_count": {
        "bookings": 0
      }
    }
  ],
  "meta": {}
}

Name	Description

sort

string

(query)
	

sortOrder

string

(query)
	

limit

integer

(query)
	

page

integer

(query)
	

_customer

boolean

(query)
	

_venue

boolean

(query)
	

name *

string

(path)
	
Code	Description
200	

Default Response

{
  "data": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "dateFrom": "2025-05-23T17:20:33.816Z",
      "dateTo": "2025-05-23T17:20:33.816Z",
      "guests": 0,
      "created": "2025-05-23T17:20:33.816Z",
      "updated": "2025-05-23T17:20:33.816Z",
      "venue": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "name": "string",
        "description": "string",
        "media": [
          {
            "url": "string",
            "alt": ""
          }
        ],
        "price": 0,
        "maxGuests": 0,
        "rating": 0,
        "created": "2025-05-23T17:20:33.816Z",
        "updated": "2025-05-23T17:20:33.816Z",
        "meta": {
          "wifi": true,
          "parking": true,
          "breakfast": true,
          "pets": true
        },
        "location": {
          "address": "string",
          "city": "string",
          "zip": "string",
          "country": "string",
          "continent": "string",
          "lat": 0,
          "lng": 0
        },
        "owner": {
          "name": "z9c1ILJGUCdHchK",
          "email": "user@example.com",
          "bio": "string",
          "avatar": {
            "url": "string",
            "alt": ""
          },
          "banner": {
            "url": "string",
            "alt": ""
          }
        },
        "_count": {
          "bookings": 0
        }
      },
      "customer": {
        "name": "xgBlXm3vypE4NIUTOxMm",
        "email": "user@example.com",
        "bio": "string",
        "avatar": {
          "url": "string",
          "alt": ""
        },
        "banner": {
          "url": "string",
          "alt": ""
        }
      }
    }
  ],
  "meta": {}
}

holidaze-venues

Holidaze venues related endpoints
holidaze-bookings

Holidaze bookings related endpoints
blog-posts

Blog posts related endpoints
pets

Pets related endpoints
artworks

Artworks related endpoints


