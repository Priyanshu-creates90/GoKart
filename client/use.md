Step1:  
```cd GoKart```

Step*:  
Change document name to GoKart in index.hml

Step2:  
```npm create vite@latest```

Step3:  
```cd client/Project name```

Step4:  
```npm i```

Step5:  
```npm run dev```

Step6:  
tailwind link => ```https://tailwindcss.com/docs/guides/vite```

Step7:   
```npm install -D tailwindcss postcss autoprefixer```  
```npx tailwindcss init -p```
install config file

Step8:   
```npm i react-router-dom```

Step9:   
set index.jsx in route 
```
import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx"

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>
    }
])

export default router
```

Step10:   
set main.jsx
```import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './route/index.jsx' 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
```

Step11:   
``` pages folder => rafce```

Step12:   
```npm install react-icons --save```   
to install icons

Step13:   
```npm install react-type-animation```
to install type animation

Step14:  
```npm i react-hot-toast```
to pop up error from backend function 
https://www.npmjs.com/package/react-hot-toast  
include it in App.jsx

Step15:   
```npm i axios```   
to connect backend and frontend   
https://www.npmjs.com/package/axios

Step16:  
```npm install @reduxjs/toolkit```  
```npm i react-redux```   
for state management   
https://redux-toolkit.js.org/tutorials/quick-start


Step17:    
```npm install @tanstack/react-table```
https://tanstack.com/table/latest/docs/framework/react/examples/basic

Step18:
```npm install sweetalert2```  

Step19:
learn mongodb indexing

Step20:   
```npm i react-infinite-scroll-component```   
npm react infinite scrolling on web

Step21:   
```npm install react-hook-form```
react hook form https://www.react-hook-form.com/get-started

Step22:   
```npm i @stripe/stripe-js```
https://www.npmjs.com/package/@stripe/stripe-jshttps://www.npmjs.com/package/@stripe/stripe-js












